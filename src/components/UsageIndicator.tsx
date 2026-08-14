import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface UsageIndicatorProps {
  used: number;
  limit: number;
  label: string;
}

export const UsageIndicator = ({ used, limit, label }: UsageIndicatorProps) => {
  const { profile } = useAuth();

  if (profile?.is_pro) return null;

  const remaining = Math.max(limit - used, 0);
  const isLow = remaining <= 1;

  return (
    <div className="flex items-center justify-between gap-3 text-sm bg-muted/50 border border-border rounded-lg px-4 py-2.5 mb-4">
      <span className={isLow ? "text-destructive font-medium" : "text-muted-foreground"}>
        {Math.min(used, limit)}/{limit} {label} used
      </span>
      <Link to="/pricing" className="text-primary hover:underline font-medium shrink-0">
        Upgrade for unlimited
      </Link>
    </div>
  );
};
