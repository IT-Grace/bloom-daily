export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    return Notification.requestPermission();
  }
  return Promise.resolve(Notification.permission);
}

export function showNotification(title: string, options?: NotificationOptions) {
  if ("Notification" in window && Notification.permission === "granted") {
    return new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    });
  }
  return null;
}

export function scheduleNotification(taskTitle: string, taskTime: string) {
  const now = new Date();
  const [hours, minutes] = taskTime.split(":").map(Number);
  
  const taskDate = new Date();
  taskDate.setHours(hours, minutes, 0, 0);
  
  if (taskDate < now) {
    taskDate.setDate(taskDate.getDate() + 1);
  }
  
  const reminderTime = new Date(taskDate.getTime() - 15 * 60 * 1000);
  
  const timeUntilReminder = reminderTime.getTime() - now.getTime();
  
  if (timeUntilReminder > 0 && timeUntilReminder < 24 * 60 * 60 * 1000) {
    setTimeout(() => {
      showNotification("Habit Reminder", {
        body: `${taskTitle} is coming up in 15 minutes`,
        tag: taskTitle,
      });
    }, timeUntilReminder);
  }
}
