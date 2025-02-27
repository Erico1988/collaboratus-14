
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Market } from "@/types/market";
import { Badge } from "@/components/ui/badge";
import { formatEuro } from "@/lib/utils";

interface MarketsTableProps {
  markets: Market[];
  onMarketClick: (market: Market) => void;
}

const getStatusBadgeVariant = (status: Market["status"]) => {
  switch (status) {
    case "en_cours":
      return "default";
    case "en_attente":
      return "secondary";
    case "termine":
      return "outline";
    default:
      return "default";
  }
};

const getStatusLabel = (status: Market["status"]) => {
  switch (status) {
    case "en_cours":
      return "En cours";
    case "en_attente":
      return "En attente";
    case "termine":
      return "Terminé";
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
        </TableBody>
      </Table>
    </Table>
  );
};
