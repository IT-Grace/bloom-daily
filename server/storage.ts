import { type Task, type InsertTask, type Completion, type InsertCompletion, type TaskWithCompletion, type DailySummary, type MonthlyStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: InsertTask): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  getCompletions(): Promise<Completion[]>;
  getCompletion(id: string): Promise<Completion | undefined>;
  getCompletionsByTaskId(taskId: string): Promise<Completion[]>;
  getCompletionsByDate(date: string): Promise<Completion[]>;
  createCompletion(completion: InsertCompletion): Promise<Completion>;
  deleteCompletion(id: string): Promise<boolean>;
  deleteCompletionByTaskAndDate(taskId: string, date: string): Promise<boolean>;
  
  getDailySummary(date: string): Promise<DailySummary>;
  getMonthlyStats(year: number, month: number): Promise<MonthlyStats>;
}

export class MemStorage implements IStorage {
  private tasks: Map<string, Task>;
  private completions: Map<string, Completion>;

  constructor() {
    this.tasks = new Map();
    this.completions = new Map();
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.isActive);
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, insertTask: InsertTask): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;

    const updatedTask: Task = {
      ...insertTask,
      id,
      createdAt: existingTask.createdAt,
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getCompletions(): Promise<Completion[]> {
    return Array.from(this.completions.values());
  }

  async getCompletion(id: string): Promise<Completion | undefined> {
    return this.completions.get(id);
  }

  async getCompletionsByTaskId(taskId: string): Promise<Completion[]> {
    return Array.from(this.completions.values()).filter(c => c.taskId === taskId);
  }

  async getCompletionsByDate(date: string): Promise<Completion[]> {
    return Array.from(this.completions.values()).filter(c => c.date === date);
  }

  async createCompletion(insertCompletion: InsertCompletion): Promise<Completion> {
    const existing = Array.from(this.completions.values()).find(
      c => c.taskId === insertCompletion.taskId && c.date === insertCompletion.date
    );
    
    if (existing) {
      return existing;
    }

    const id = randomUUID();
    const completion: Completion = {
      ...insertCompletion,
      id,
      completedAt: new Date(),
    };
    this.completions.set(id, completion);
    return completion;
  }

  async deleteCompletion(id: string): Promise<boolean> {
    return this.completions.delete(id);
  }

  async deleteCompletionByTaskAndDate(taskId: string, date: string): Promise<boolean> {
    const completion = Array.from(this.completions.values()).find(
      c => c.taskId === taskId && c.date === date
    );
    if (completion) {
      return this.completions.delete(completion.id);
    }
    return false;
  }

  private isTaskDueOnDate(task: Task, date: Date): boolean {
    if (task.frequency === "daily") {
      return true;
    }
    
    if (task.frequency === "monthly" && task.dayOfMonth) {
      return date.getDate() === task.dayOfMonth;
    }
    
    if (task.frequency === "yearly" && task.monthOfYear && task.dayOfYear) {
      return date.getMonth() + 1 === task.monthOfYear && date.getDate() === task.dayOfYear;
    }
    
    return false;
  }

  private async calculateStreak(taskId: string, endDate: Date): Promise<number> {
    const allCompletions = await this.getCompletionsByTaskId(taskId);
    const task = await this.getTask(taskId);
    if (!task) return 0;

    let streak = 0;
    let currentDate = new Date(endDate);
    
    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];
      
      if (!this.isTaskDueOnDate(task, currentDate)) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      
      const wasCompleted = allCompletions.some(c => c.date === dateStr);
      
      if (!wasCompleted) break;
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
      
      if (streak > 365) break;
    }
    
    return streak;
  }

  private getNextOccurrence(task: Task, afterDate: Date): string | undefined {
    const testDate = new Date(afterDate);
    testDate.setDate(testDate.getDate() + 1);
    
    for (let i = 0; i < 365; i++) {
      if (this.isTaskDueOnDate(task, testDate)) {
        return testDate.toISOString().split("T")[0];
      }
      testDate.setDate(testDate.getDate() + 1);
    }
    
    return undefined;
  }

  async getDailySummary(date: string): Promise<DailySummary> {
    const dateObj = new Date(date);
    const tasks = await this.getTasks();
    const completions = await this.getCompletionsByDate(date);
    
    const tasksForDate = tasks.filter(task => this.isTaskDueOnDate(task, dateObj));
    
    const tasksWithCompletion: TaskWithCompletion[] = await Promise.all(
      tasksForDate.map(async (task) => {
        const completion = completions.find(c => c.taskId === task.id);
        const streak = await this.calculateStreak(task.id, dateObj);
        const nextOccurrence = this.getNextOccurrence(task, dateObj);
        
        return {
          ...task,
          isCompletedToday: !!completion,
          completionId: completion?.id,
          streak,
          nextOccurrence,
        };
      })
    );
    
    const completedTasks = tasksWithCompletion.filter(t => t.isCompletedToday).length;
    const totalTasks = tasksWithCompletion.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      date,
      totalTasks,
      completedTasks,
      completionRate,
      tasks: tasksWithCompletion,
    };
  }

  async getMonthlyStats(year: number, month: number): Promise<MonthlyStats> {
    const tasks = await this.getTasks();
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const dailyCompletions = [];
    let totalCompletions = 0;
    let totalPossible = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dateObj = new Date(date);
      
      const tasksForDate = tasks.filter(task => this.isTaskDueOnDate(task, dateObj));
      const completions = await this.getCompletionsByDate(date);
      const completedCount = completions.filter(c => 
        tasksForDate.some(t => t.id === c.taskId)
      ).length;
      
      dailyCompletions.push({
        date,
        count: completedCount,
        total: tasksForDate.length,
      });
      
      totalCompletions += completedCount;
      totalPossible += tasksForDate.length;
    }
    
    const completionRate = totalPossible > 0 ? (totalCompletions / totalPossible) * 100 : 0;
    
    let currentStreak = 0;
    let maxStreak = 0;
    
    for (const day of dailyCompletions) {
      if (day.total > 0 && day.count === day.total) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return {
      month: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
      year,
      totalTasks: tasks.length,
      completedCount: totalCompletions,
      completionRate,
      streakDays: maxStreak,
      dailyCompletions,
    };
  }
}

export const storage = new MemStorage();
