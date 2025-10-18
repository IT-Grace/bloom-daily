import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { TaskCard } from "@/components/task-card";
import { StatsCard } from "@/components/stats-card";
import { ProgressRing } from "@/components/progress-ring";
import { TaskDialog } from "@/components/task-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CheckCircle2, Clock, TrendingUp, Sparkles } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import type { TaskWithCompletion, InsertTask, DailySummary } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: summary, isLoading } = useQuery<DailySummary>({
    queryKey: ["/api/summary/today"],
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ taskId, isCompleted, date }: { taskId: string; isCompleted: boolean; date: string }) => {
      if (isCompleted) {
        return apiRequest("POST", "/api/completions", { taskId, date });
      } else {
        const task = summary?.tasks.find(t => t.id === taskId);
        if (task?.completionId) {
          return apiRequest("DELETE", `/api/completions/${task.completionId}`, {});
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/summary/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: InsertTask) => apiRequest("POST", "/api/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/summary/today"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Habit created",
        description: "Your new habit has been added successfully.",
      });
    },
  });

  const handleToggleComplete = (taskId: string, isCompleted: boolean) => {
    const today = new Date().toISOString().split("T")[0];
    toggleCompleteMutation.mutate({ taskId, isCompleted, date: today });
  };

  const upcomingTasks = summary?.tasks.filter(t => !t.isCompletedToday).slice(0, 5) || [];
  const completedTasks = summary?.tasks.filter(t => t.isCompletedToday) || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-serif text-foreground mb-2">Good morning!</h1>
          <p className="text-muted-foreground">Let's make today amazing</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          size="lg"
          className="rounded-full"
          data-testid="button-create-habit"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Habit
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Habits"
            value={summary?.totalTasks || 0}
            icon={CheckCircle2}
            description="Active habits today"
          />
          <StatsCard
            title="Completed"
            value={summary?.completedTasks || 0}
            icon={Sparkles}
            description={`${summary?.totalTasks || 0} habits scheduled`}
          />
          <StatsCard
            title="Completion Rate"
            value={`${Math.round(summary?.completionRate || 0)}%`}
            icon={TrendingUp}
            description="Today's progress"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-2xl">Today's Habits</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {summary?.completedTasks || 0} of {summary?.totalTasks || 0} completed
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : summary?.tasks && summary.tasks.length > 0 ? (
                summary.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    showActions={false}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No habits scheduled for today</h3>
                  <p className="text-muted-foreground mb-4">Create your first habit to get started</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first-habit">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Habit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <ProgressRing progress={summary?.completionRate || 0} />
            </CardContent>
          </Card>

          {upcomingTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Upcoming</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card hover-elevate transition-all"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <TaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={(data) => createTaskMutation.mutate(data)}
        isPending={createTaskMutation.isPending}
      />
    </div>
  );
}
