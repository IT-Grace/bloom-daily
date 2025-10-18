import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar, CheckCircle2, Target } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import type { MonthlyStats } from "@shared/schema";

export default function Reports() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data: stats, isLoading } = useQuery<MonthlyStats>({
    queryKey: ["/api/stats/monthly", year, month],
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const chartData = stats?.dailyCompletions.slice(-14).map((day) => ({
    date: new Date(day.date).getDate().toString(),
    completed: day.count,
    total: day.total,
    rate: day.total > 0 ? Math.round((day.count / day.total) * 100) : 0,
  })) || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-serif text-foreground mb-2">Progress Reports</h1>
        <p className="text-muted-foreground">Insights into your habit journey</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2" />
                <div className="h-3 bg-muted rounded w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              title="Total Habits"
              value={stats.totalTasks}
              icon={Target}
              description="Active this month"
            />
            <StatsCard
              title="Completed"
              value={stats.completedCount}
              icon={CheckCircle2}
              description="Tasks finished"
            />
            <StatsCard
              title="Completion Rate"
              value={`${Math.round(stats.completionRate)}%`}
              icon={TrendingUp}
              description="Monthly average"
            />
            <StatsCard
              title="Best Streak"
              value={`${stats.streakDays} days`}
              icon={Calendar}
              description="Longest this month"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">
                Last 14 Days Performance
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Daily completion trends
              </p>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Bar
                      dataKey="completed"
                      fill="hsl(var(--primary))"
                      radius={[8, 8, 0, 0]}
                      name="Completed"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available for the last 14 days
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Total Days Tracked</span>
                <span className="text-lg font-semibold font-serif">
                  {stats.dailyCompletions.length}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Perfect Days</span>
                <span className="text-lg font-semibold font-serif">
                  {stats.dailyCompletions.filter(d => d.total > 0 && d.count === d.total).length}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Average Completion Rate</span>
                <span className="text-lg font-semibold font-serif">
                  {Math.round(stats.completionRate)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No data available yet. Start tracking your habits to see reports.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
