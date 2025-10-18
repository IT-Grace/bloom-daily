import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DayData {
  date: string;
  count: number;
  total: number;
}

interface CalendarHeatmapProps {
  data: DayData[];
  month: string;
  year: number;
}

export function CalendarHeatmap({ data, month, year }: CalendarHeatmapProps) {
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const monthNum = new Date(`${month} 1, ${year}`).getMonth() + 1;
  const daysInMonth = getDaysInMonth(monthNum, year);
  const firstDay = getFirstDayOfMonth(monthNum, year);

  const getIntensity = (count: number, total: number) => {
    if (total === 0) return 0;
    const percentage = (count / total) * 100;
    if (percentage === 0) return 0;
    if (percentage < 25) return 1;
    if (percentage < 50) return 2;
    if (percentage < 75) return 3;
    if (percentage < 100) return 4;
    return 5;
  };

  const intensityColors = [
    "bg-muted",
    "bg-primary/20",
    "bg-primary/40",
    "bg-primary/60",
    "bg-primary/80",
    "bg-primary",
  ];

  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDay + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;

    const dateStr = `${year}-${String(monthNum).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const dayData = data.find((d) => d.date === dateStr);
    const intensity = dayData ? getIntensity(dayData.count, dayData.total) : 0;

    return {
      day: dayNum,
      date: dateStr,
      intensity,
      count: dayData?.count || 0,
      total: dayData?.total || 0,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">
          {month} {year}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-xs text-center text-muted-foreground font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) =>
            day ? (
              <div
                key={i}
                className={`aspect-square rounded-md ${intensityColors[day.intensity]} flex items-center justify-center text-xs font-medium transition-all hover:scale-110 cursor-pointer ${
                  day.intensity > 2 ? "text-primary-foreground" : "text-foreground"
                }`}
                title={`${day.date}: ${day.count}/${day.total} completed`}
                data-testid={`calendar-day-${day.day}`}
              >
                {day.day}
              </div>
            ) : (
              <div key={i} />
            )
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
          <span>Less</span>
          {intensityColors.map((color, i) => (
            <div key={i} className={`w-4 h-4 rounded-sm ${color}`} />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
