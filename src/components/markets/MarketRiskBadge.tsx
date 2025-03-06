import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MarketRiskBadgeProps {
  level: string;
}

const getRiskIcon = (level: string) => {
  switch (level) {
    case "eleve":
      return <AlertTriangle className="h-5 w-5 text-error-500" />;
    case "moyen":
      return <Clock className="h-5 w-5 text-warning-500" />;
    case "faible":
      return <CheckCircle2 className="h-5 w-5 text-success-500" />;
    default:
      return null;
  }
};

const getRiskColor = (level: string) => {
  switch (level) {
    case "faible":
      return "bg-green-500";
    case "moyen":
      return "bg-yellow-500";
    case "eleve":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getRiskLabel = (level: string) => {
  switch (level) {
    case "faible":
      return "Faible";
    case "moyen":
      return "Moyen";
    case "eleve":
      return "Élevé";
    default:
      return level;
  }
};

export const MarketRiskBadge = ({ level }: MarketRiskBadgeProps) => (
  <div className="flex items-center gap-2">
    {getRiskIcon(level)}
    <Badge className={getRiskColor(level)}>
      {getRiskLabel(level)}
    </Badge>
  </div>
);
