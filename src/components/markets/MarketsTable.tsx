import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Market, MarketStatus, RiskLevel } from "@/types/market";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface MarketsTableProps {
  markets: Market[];
  onMarketClick: (market: Market) => void;
  onEditMarket?: (market: Market) => void;
  onDeleteMarket?: (marketId: string) => void;
}

const statusColors: Record<MarketStatus, string> = {
  en_cours: "bg-blue-500",
  en_attente: "bg-yellow-500",
  termine: "bg-green-500",
  annule: "bg-red-500",
  brouillon: "bg-slate-500",
};

const statusLabels: Record<MarketStatus, string> = {
  en_cours: "En cours",
  en_attente: "En attente",
  termine: "Terminé",
  annule: "Annulé",
  brouillon: "Brouillon",
};

const riskColors: Record<RiskLevel, string> = {
  faible: "bg-green-500",
  moyen: "bg-yellow-500",
  eleve: "bg-red-500",
};

const riskLabels: Record<RiskLevel, string> = {
  faible: "Faible",
  moyen: "Moyen",
  eleve: "Élevé",
};

export const MarketsTable = ({ 
  markets, 
  onMarketClick, 
  onEditMarket, 
  onDeleteMarket 
}: MarketsTableProps) => {
  const isDeadlineClose = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Budget</TableHead>
            <TableHead>Échéance</TableHead>
            <TableHead>Niveau de risque</TableHead>
            <TableHead>Département</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {markets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Aucun marché trouvé
              </TableCell>
            </TableRow>
          ) : (
            markets.map((market) => (
              <TableRow 
                key={market.id} 
                className="cursor-pointer hover:bg-muted/80"
              >
                <TableCell className="font-medium">{market.id}</TableCell>
                <TableCell onClick={() => onMarketClick(market)}>
                  <div className="font-medium">{market.title}</div>
                  {market.description && (
                    <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                      {market.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[market.status as MarketStatus]}>
                    {statusLabels[market.status as MarketStatus]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {market.budget.toLocaleString('fr-FR')} €
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {isDeadlineClose(market.deadline) && market.status !== 'termine' && market.status !== 'annule' && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className={isDeadlineClose(market.deadline) && market.status !== 'termine' && market.status !== 'annule' ? "text-yellow-600 font-medium" : ""}>
                      {format(new Date(market.deadline), 'dd MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={riskColors[market.riskLevel as RiskLevel]}>
                    {riskLabels[market.riskLevel as RiskLevel]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {market.department || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onMarketClick(market)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les détails
                      </DropdownMenuItem>
                      {onEditMarket && (
                        <DropdownMenuItem onClick={() => onEditMarket(market)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {onDeleteMarket && (
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteMarket(market.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};