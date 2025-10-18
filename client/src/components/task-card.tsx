import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, Clock } from "lucide-react";
import { TaskWithCompletion } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: TaskWithCompletion;
  onToggleComplete?: (taskId: string, isCompleted: boolean) => void;
  onEdit?: (task: TaskWithCompletion) => void;
  onDelete?: (taskId: string) => void;
  showActions?: boolean;
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete, showActions = true }: TaskCardProps) {
  const frequencyColors = {
    daily: "bg-primary/10 text-primary border-primary/20",
    monthly: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    yearly: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  };

  const frequencyLabels = {
    daily: "Daily",
    monthly: `Monthly (${task.dayOfMonth ? `Day ${task.dayOfMonth}` : ""})`,
    yearly: `Yearly (${task.monthOfYear && task.dayOfYear ? `${task.monthOfYear}/${task.dayOfYear}` : ""})`,
  };

  return (
    <div className="relative">
      {task.category && task.color && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
          style={{ backgroundColor: task.color }}
        />
      )}
      <Card className="p-4 hover-elevate transition-all duration-200">
        <div className="flex items-start gap-3 pl-2">
          <div className="pt-1">
          <Checkbox
            checked={task.isCompletedToday || false}
            onCheckedChange={(checked) => onToggleComplete?.(task.id, !!checked)}
            className="w-6 h-6 rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            data-testid={`checkbox-task-${task.id}`}
          />
          </div>
          
          <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3
                className={`font-medium text-base mb-1 transition-all ${
                  task.isCompletedToday
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
                data-testid={`text-task-title-${task.id}`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                {task.category && (
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      backgroundColor: `${task.color}15`,
                      borderColor: task.color,
                      color: task.color,
                    }}
                  >
                    {task.category}
                  </Badge>
                )}
                <Badge variant="outline" className={`text-xs ${frequencyColors[task.frequency as keyof typeof frequencyColors]}`}>
                  {frequencyLabels[task.frequency as keyof typeof frequencyLabels]}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{task.time}</span>
                </div>
                {task.streak !== undefined && task.streak > 0 && (
                  <Badge variant="secondary" className="text-xs bg-chart-1/10 text-chart-1 border-chart-1/20">
                    {task.streak} day streak
                  </Badge>
                )}
              </div>
            </div>

            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-task-menu-${task.id}`}>
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(task)} data-testid={`button-edit-task-${task.id}`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete?.(task.id)}
                    className="text-destructive focus:text-destructive"
                    data-testid={`button-delete-task-${task.id}`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        </div>
      </Card>
    </div>
  );
}
