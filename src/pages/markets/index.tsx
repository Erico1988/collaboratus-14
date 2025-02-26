
import { MainLayout } from "@/components/layout/MainLayout";
import { useState } from "react";
import { Market } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MarketDialog } from "@/components/markets/MarketDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Données de test (à remplacer par les données réelles)
const mockMarkets: Market[] = [
  {
    id: "1",
    title: "Développement ProcureTrack",
    reference: "PROC-2024-001",
    description: "Développement de l'application de gestion des marchés",
    budget: 150000,
    startDate: "2024-03-01",
    endDate: "2024-08-30",
    status: "in_progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Ajoutez d'autres marchés de test si nécessaire
];

const statusColors: Record<Market["status"], string> = {
  draft: "bg-slate-500",
  published: "bg-blue-500",
  in_progress: "bg-yellow-500",
  awarded: "bg-green-500",
  completed: "bg-purple-500",
  cancelled: "bg-red-500",
};

const statusLabels: Record<Market["status"], string> = {
  draft: "Brouillon",
  published: "Publié",
  in_progress: "En cours",
  awarded: "Attribué",
  completed: "Terminé",
  cancelled: "Annulé",
};

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>(mockMarkets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | undefined>();

  const handleCreateMarket = () => {
    setSelectedMarket(undefined);
    setIsDialogOpen(true);
  };

  const handleEditMarket = (market: Market) => {
    setSelectedMarket(market);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: Omit<Market, "id" | "createdAt" | "updatedAt">) => {
    if (selectedMarket) {
      // Mise à jour
      const updatedMarkets = markets.map(market =>
        market.id === selectedMarket.id
          ? { ...market, ...data, updatedAt: new Date().toISOString() }
          : market
      );
      setMarkets(updatedMarkets);
    } else {
      // Création
      const newMarket: Market = {
        ...data,
        id: `market-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMarkets([...markets, newMarket]);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Marchés</h1>
          <Button onClick={handleCreateMarket}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Marché
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Début</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {markets.map((market) => (
                <TableRow key={market.id}>
                  <TableCell>{market.reference}</TableCell>
                  <TableCell>{market.title}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[market.status]}>
                      {statusLabels[market.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{market.budget.toLocaleString()} €</TableCell>
                  <TableCell>
                    {format(new Date(market.startDate), 'dd MMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(market.endDate), 'dd MMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMarket(market)}
                    >
                      Modifier
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <MarketDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          market={selectedMarket}
          onSubmit={handleSubmit}
        />
      </div>
    </MainLayout>
  );
}
