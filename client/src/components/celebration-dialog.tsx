import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Star, Sparkles } from "lucide-react";
import { Achievement } from "@shared/schema";

interface CelebrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievements: Achievement[];
  taskTitle: string;
}

const ACHIEVEMENT_ICONS = {
  "7-day": Star,
  "30-day": Award,
  "100-day": Trophy,
};

const ACHIEVEMENT_MESSAGES = {
  "7-day": "You've completed 7 days in a row!",
  "30-day": "Amazing! A full month of consistency!",
  "100-day": "Incredible! 100 days of dedication!",
};

const ACHIEVEMENT_TITLES = {
  "7-day": "7 Day Streak Achievement!",
  "30-day": "30 Day Streak Champion!",
  "100-day": "100 Day Streak Master!",
};

export function CelebrationDialog({ open, onOpenChange, achievements, taskTitle }: CelebrationDialogProps) {
  if (achievements.length === 0) return null;
  
  const achievement = achievements[0];
  const Icon = ACHIEVEMENT_ICONS[achievement.type as keyof typeof ACHIEVEMENT_ICONS];
  const message = ACHIEVEMENT_MESSAGES[achievement.type as keyof typeof ACHIEVEMENT_MESSAGES];
  const title = ACHIEVEMENT_TITLES[achievement.type as keyof typeof ACHIEVEMENT_TITLES];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] text-center">
        <DialogHeader>
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
            <Icon className="w-12 h-12 text-primary" />
          </div>
          <DialogTitle className="font-serif text-3xl text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-lg text-center pt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-lg font-medium">{taskTitle}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Keep up the amazing work! Consistency is the key to building lasting habits.
          </p>
        </div>
        
        <Button 
          onClick={() => onOpenChange(false)}
          size="lg"
          className="rounded-full"
          data-testid="button-close-celebration"
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
