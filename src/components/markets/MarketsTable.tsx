
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Market, MarketStatus } from "@/types/market";
import { Badge } from "@/components/ui/badge";
import { formatEuro } from "@/lib/utils";

interface MarketsTableProps {
  markets: Market[];
  onMarketClick: (market: Market) => void;
}

const getStatusBadgeVariant = (status: MarketStatus) => {
  switch (status) {
    case "en_cours":
    case "in_progress":
      return "default";
    case "en_attente":
    case "published":
    case "draft":
      return "secondary";
    case "termine":
    case "completed":
    case "awarded":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
};

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

export const MarketsTable = ({ markets, onMarketClick }: MarketsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Titre</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Échéance</TableHead>
          <TableHead>Niveau de risque</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {markets.map((market) => (
          <TableRow
            key={market.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onMarketClick(market)}
          >
            <TableCell>{market.id}</TableCell>
            <TableCell>{market.title}</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(market.status)}>
                {getStatusLabel(market.status)}
              </Badge>
            </TableCell>
            <TableCell>{formatEuro(market.budget)}</TableCell>
            <TableCell>{new Date(market.deadline).toLocaleDateString()}</TableCell>
            <TableCell className="capitalize">{market.riskLevel}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
