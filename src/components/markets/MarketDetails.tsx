
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Market, MarketStatus } from "@/types/market";
import { formatEuro } from "@/lib/utils";

interface MarketDetailsProps {
  market: Market | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusLabel = (status: MarketStatus) => {
  switch (status) {
    case "en_cours":
    case "in_progress":
      return "En cours";
    case "en_attente":
    case "published":
      return "En attente";
    case "termine":
    case "completed":
    case "awarded":
      return "Terminé";
    case "draft":
      return "Brouillon";
    case "cancelled":
      return "Annulé";
    default:
      return status;
  }
};

export const MarketDetails = ({ market, isOpen, onClose }: MarketDetailsProps) => {
  if (!market) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{market.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">ID</p>
              <p className="font-medium">{market.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Référence</p>
              <p className="font-medium">{market.reference}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <Badge variant="outline" className="mt-1">
                {getStatusLabel(market.status)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="font-medium">{formatEuro(market.budget)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de début</p>
              <p className="font-medium">
                {new Date(market.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de fin</p>
              <p className="font-medium">
                {new Date(market.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date d'échéance</p>
              <p className="font-medium">
                {new Date(market.deadline).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Niveau de risque</p>
              <p className="font-medium capitalize">{market.riskLevel}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="mt-1">{market.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
