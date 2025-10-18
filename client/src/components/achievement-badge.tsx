import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star } from "lucide-react";
import { Achievement } from "@shared/schema";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
}

const ACHIEVEMENT_ICONS = {
  "7-day": Star,
  "30-day": Award,
  "100-day": Trophy,
};

const ACHIEVEMENT_COLORS = {
  "7-day": { bg: "#FEC8D8", border: "#F78888", text: "#C13366" },
  "30-day": { bg: "#FFE4B5", border: "#FFD700", text: "#B8860B" },
  "100-day": { bg: "#E6E6FA", border: "#9370DB", text: "#663399" },
};

const ACHIEVEMENT_LABELS = {
  "7-day": "7 Day Streak",
  "30-day": "30 Day Streak",
  "100-day": "100 Day Streak!",
};

export function AchievementBadge({ achievement, size = "sm" }: AchievementBadgeProps) {
  const Icon = ACHIEVEMENT_ICONS[achievement.type as keyof typeof ACHIEVEMENT_ICONS];
  const colors = ACHIEVEMENT_COLORS[achievement.type as keyof typeof ACHIEVEMENT_COLORS];
  const label = ACHIEVEMENT_LABELS[achievement.type as keyof typeof ACHIEVEMENT_LABELS];
  
  const iconSize = size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-5 h-5";
  
  return (
    <Badge
      variant="outline"
      className={`text-xs gap-1 ${size === "lg" ? "text-sm py-1.5 px-3" : ""}`}
      style={{
        backgroundColor: `${colors.bg}40`,
        borderColor: colors.border,
        color: colors.text,
      }}
      data-testid={`badge-achievement-${achievement.type}`}
    >
      <Icon className={iconSize} />
      {label}
    </Badge>
  );
}
