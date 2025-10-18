import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { TaskCard } from "@/components/task-card";
import { TaskDialog } from "@/components/task-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Filter } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { TaskWithCompletion, InsertTask } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Habits() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithCompletion | null>(null);
  const [filterFrequency, setFilterFrequency] = useState<string>("all");
  const { toast } = useToast();

  const { data: tasks, isLoading } = useQuery<TaskWithCompletion[]>({
    queryKey: ["/api/tasks"],
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

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertTask }) =>
      apiRequest("PUT", `/api/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/summary/today"] });
      setIsEditDialogOpen(false);
      setEditingTask(null);
      toast({
        title: "Habit updated",
        description: "Your habit has been updated successfully.",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/tasks/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/summary/today"] });
      toast({
        title: "Habit deleted",
        description: "Your habit has been removed.",
      });
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ taskId, isCompleted, date }: { taskId: string; isCompleted: boolean; date: string }) => {
      if (isCompleted) {
        return apiRequest("POST", "/api/completions", { taskId, date });
      } else {
        const task = tasks?.find(t => t.id === taskId);
        if (task?.completionId) {
          return apiRequest("DELETE", `/api/completions/${task.completionId}`, {});
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/summary/today"] });
    },
  });

  const handleEdit = (task: TaskWithCompletion) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const handleToggleComplete = (taskId: string, isCompleted: boolean) => {
    const today = new Date().toISOString().split("T")[0];
    toggleCompleteMutation.mutate({ taskId, isCompleted, date: today });
  };

  const filteredTasks = tasks?.filter(task => 
    filterFrequency === "all" || task.frequency === filterFrequency
  ) || [];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-serif text-foreground mb-2">My Habits</h1>
          <p className="text-muted-foreground">Manage and track all your habits</p>
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-2xl">All Habits</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterFrequency} onValueChange={setFilterFrequency}>
                <SelectTrigger className="w-[140px]" data-testid="select-filter-frequency">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {filterFrequency === "all" ? "No habits yet" : `No ${filterFrequency} habits`}
              </h3>
              <p className="text-muted-foreground mb-4">Create your first habit to get started</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first-habit">
                <Plus className="w-4 h-4 mr-2" />
                Create Habit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <TaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={(data) => createTaskMutation.mutate(data)}
        isPending={createTaskMutation.isPending}
      />

      {editingTask && (
        <TaskDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setEditingTask(null);
          }}
          onSubmit={(data) => updateTaskMutation.mutate({ id: editingTask.id, data })}
          task={editingTask}
          isPending={updateTaskMutation.isPending}
        />
      )}
    </div>
  );
}
