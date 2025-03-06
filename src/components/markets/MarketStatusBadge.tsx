import { Badge } from "@/components/ui/badge";

interface MarketStatusBadgeProps {
  status: string;
}

export const MarketStatusBadge = ({ status }: MarketStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_cours":
        return "bg-blue-500";
      case "en_attente":
        return "bg-yellow-500";
      case "termine":
        return "bg-green-500";
      case "annule":
        return "bg-red-500";
      case "brouillon":
        return "bg-slate-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_cours":
        return "En cours";
      case "en_attente":
        return "En attente";
      case "termine":
        return "Terminé";
      case "annule":
        return "Annulé";
      case "brouillon":
        return "Brouillon";
      default:
        return status;
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
};