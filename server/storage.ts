import { type Task, type InsertTask, type Completion, type InsertCompletion, type Achievement, type InsertAchievement, type TaskWithCompletion, type DailySummary, type MonthlyStats } from "@shared/schema";
import { tasks, completions, achievements } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

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
  
  getAchievements(): Promise<Achievement[]>;
  getAchievementsByTaskId(taskId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  deleteAchievement(id: string): Promise<boolean>;
  checkAndAwardMilestones(taskId: string, currentStreak: number): Promise<Achievement[]>;
  
  getDailySummary(date: string): Promise<DailySummary>;
  getMonthlyStats(year: number, month: number): Promise<MonthlyStats>;
}

export class DatabaseStorage implements IStorage {
  async getTasks(): Promise<Task[]> {
    const allTasks = await db.select().from(tasks).where(eq(tasks.isActive, true));
    return allTasks;
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async updateTask(id: string, insertTask: InsertTask): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(insertTask)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask || undefined;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getCompletions(): Promise<Completion[]> {
    return await db.select().from(completions);
  }

  async getCompletion(id: string): Promise<Completion | undefined> {
    const [completion] = await db.select().from(completions).where(eq(completions.id, id));
    return completion || undefined;
  }

  async getCompletionsByTaskId(taskId: string): Promise<Completion[]> {
    return await db.select().from(completions).where(eq(completions.taskId, taskId));
  }

  async getCompletionsByDate(date: string): Promise<Completion[]> {
    return await db.select().from(completions).where(eq(completions.date, date));
  }

  async createCompletion(insertCompletion: InsertCompletion): Promise<Completion> {
    const existing = await db
      .select()
      .from(completions)
      .where(
        and(
          eq(completions.taskId, insertCompletion.taskId),
          eq(completions.date, insertCompletion.date)
        )
      );
    
    if (existing.length > 0) {
      return existing[0];
    }

    const [completion] = await db
      .insert(completions)
      .values(insertCompletion)
      .returning();
    return completion;
  }

  async deleteCompletion(id: string): Promise<boolean> {
    const result = await db.delete(completions).where(eq(completions.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async deleteCompletionByTaskAndDate(taskId: string, date: string): Promise<boolean> {
    const result = await db
      .delete(completions)
      .where(
        and(
          eq(completions.taskId, taskId),
          eq(completions.date, date)
        )
      );
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getAchievementsByTaskId(taskId: string): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.taskId, taskId));
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db
      .insert(achievements)
      .values(insertAchievement)
      .returning();
    return achievement;
  }

  async deleteAchievement(id: string): Promise<boolean> {
    const result = await db.delete(achievements).where(eq(achievements.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async checkAndAwardMilestones(taskId: string, currentStreak: number): Promise<Achievement[]> {
    const existingAchievements = await this.getAchievementsByTaskId(taskId);
    const newAchievements: Achievement[] = [];
    
    const milestones = [
      { type: "7-day" as const, threshold: 7 },
      { type: "30-day" as const, threshold: 30 },
      { type: "100-day" as const, threshold: 100 },
    ];
    
    for (const milestone of milestones) {
      if (currentStreak >= milestone.threshold) {
        const alreadyEarned = existingAchievements.some(
          a => a.type === milestone.type
        );
        
        if (!alreadyEarned) {
          const achievement = await this.createAchievement({
            taskId,
            type: milestone.type,
            streakCount: currentStreak,
          });
          newAchievements.push(achievement);
        }
      }
    }
    
    return newAchievements;
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

  async calculateStreak(taskId: string, endDate: Date): Promise<number> {
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
    const allTasks = await this.getTasks();
    const allCompletions = await this.getCompletionsByDate(date);
    
    const tasksForDate = allTasks.filter(task => this.isTaskDueOnDate(task, dateObj));
    
    const tasksWithCompletion: TaskWithCompletion[] = await Promise.all(
      tasksForDate.map(async (task) => {
        const completion = allCompletions.find(c => c.taskId === task.id);
        const streak = await this.calculateStreak(task.id, dateObj);
        const nextOccurrence = this.getNextOccurrence(task, dateObj);
        const taskAchievements = await this.getAchievementsByTaskId(task.id);
        const latestMilestone = taskAchievements.length > 0 
          ? taskAchievements.sort((a, b) => b.streakCount - a.streakCount)[0]
          : undefined;
        
        return {
          ...task,
          isCompletedToday: !!completion,
          completionId: completion?.id,
          streak,
          nextOccurrence,
          achievements: taskAchievements,
          latestMilestone,
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
    const allTasks = await this.getTasks();
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const dailyCompletions = [];
    let totalCompletions = 0;
    let totalPossible = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dateObj = new Date(date);
      
      const tasksForDate = allTasks.filter(task => this.isTaskDueOnDate(task, dateObj));
      const dayCompletions = await this.getCompletionsByDate(date);
      const completedCount = dayCompletions.filter(c => 
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
      totalTasks: allTasks.length,
      completedCount: totalCompletions,
      completionRate,
      streakDays: maxStreak,
      dailyCompletions,
    };
  }
}

export const storage = new DatabaseStorage();
