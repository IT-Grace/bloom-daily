import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  time: text("time").notNull(),
  frequency: text("frequency").notNull(), // 'daily', 'monthly', 'yearly'
  dayOfMonth: integer("day_of_month"), // for monthly tasks (1-31)
  monthOfYear: integer("month_of_year"), // for yearly tasks (1-12)
  dayOfYear: integer("day_of_year"), // for yearly tasks (1-31)
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const completions = pgTable("completions", {
  id: varchar("id").primaryKey(),
  taskId: varchar("task_id").notNull().references(() => tasks.id),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
  date: text("date").notNull(), // YYYY-MM-DD format for easy querying
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
}).extend({
  title: z.string().min(1, "Task title is required"),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  frequency: z.enum(["daily", "monthly", "yearly"]),
  dayOfMonth: z.number().min(1).max(31).optional(),
  monthOfYear: z.number().min(1).max(12).optional(),
  dayOfYear: z.number().min(1).max(31).optional(),
}).refine(
  (data) => {
    if (data.frequency === "monthly") {
      return data.dayOfMonth !== undefined && data.dayOfMonth >= 1 && data.dayOfMonth <= 31;
    }
    return true;
  },
  { message: "Day of month is required for monthly habits", path: ["dayOfMonth"] }
).refine(
  (data) => {
    if (data.frequency === "yearly") {
      return (
        data.monthOfYear !== undefined && 
        data.monthOfYear >= 1 && 
        data.monthOfYear <= 12 &&
        data.dayOfYear !== undefined &&
        data.dayOfYear >= 1 &&
        data.dayOfYear <= 31
      );
    }
    return true;
  },
  { message: "Month and day are required for yearly habits", path: ["monthOfYear"] }
);

export const insertCompletionSchema = createInsertSchema(completions).omit({
  id: true,
  completedAt: true,
}).extend({
  taskId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertCompletion = z.infer<typeof insertCompletionSchema>;
export type Completion = typeof completions.$inferSelect;

// Extended types for frontend
export type TaskWithCompletion = Task & {
  isCompletedToday?: boolean;
  completionId?: string;
  nextOccurrence?: string;
  streak?: number;
};

export type DailySummary = {
  date: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  tasks: TaskWithCompletion[];
};

export type MonthlyStats = {
  month: string;
  year: number;
  totalTasks: number;
  completedCount: number;
  completionRate: number;
  streakDays: number;
  dailyCompletions: { date: string; count: number; total: number }[];
};
