import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp }: StatCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
            {trend && (
              <p className={cn(
                "text-sm mt-2",
                trendUp ? "text-secondary" : "text-destructive"
              )}>
                {trend}
              </p>
            )}
          </div>
          <div className="bg-primary/10 p-4 rounded-lg">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
