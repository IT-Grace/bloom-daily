import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { scheduleNotification, requestNotificationPermission } from "@/lib/notifications";
import type { TaskWithCompletion } from "@shared/schema";

export function useNotifications() {
  const { data: tasks } = useQuery<TaskWithCompletion[]>({
    queryKey: ["/api/tasks"],
  });

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        if (task.isActive && !task.isCompletedToday) {
          scheduleNotification(task.title, task.time);
        }
      });
    }
  }, [tasks]);
}
