
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";
import { MarketsHeader } from "@/components/markets/MarketsHeader";
import { MarketsFilters } from "@/components/markets/MarketsFilters";
import { MarketsTable } from "@/components/markets/MarketsTable";
import { MarketForm } from "@/components/markets/MarketForm";
import { MarketDetails } from "@/components/markets/MarketDetails";
import { Market } from "@/types/market";

// Données temporaires
const mockMarkets: Market[] = [
  {
    id: "M2024-001",
    title: "Fourniture de matériel informatique",
    reference: "REF-001",
    description: "Fourniture de matériel informatique pour les bureaux",
    status: "en_cours",
    budget: 150000,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    deadline: "2024-06-30",
    riskLevel: "faible",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "M2024-002",
    title: "Services de maintenance bâtiments",
    reference: "REF-002",
    description: "Services de maintenance des bâtiments administratifs",
    status: "en_attente",
    budget: 75000,
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    deadline: "2024-07-15",
    riskLevel: "moyen",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01"
  },
  {
    id: "M2024-003",
    title: "Prestations de formation",
    reference: "REF-003",
    description: "Formation du personnel aux nouvelles technologies",
    status: "termine",
    budget: 45000,
    startDate: "2024-03-01",
    endDate: "2024-05-31",
    deadline: "2024-05-01",
    riskLevel: "faible",
    createdAt: "2024-03-01",
    updatedAt: "2024-05-31"
  },
];

const MarketsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("tous");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [markets, setMarkets] = useState(mockMarkets);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  const filteredMarkets = markets.filter((market) => {
    const matchesSearch = market.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "tous" || market.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateMarket = (values: Omit<Market, "id">) => {
    const newMarket = {
      id: `M2024-${(markets.length + 1).toString().padStart(3, "0")}`,
      ...values,
    };
    setMarkets([...markets, newMarket]);
    toast({
      description: "Le marché a été créé avec succès.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <MarketsHeader onNewMarket={() => setIsFormOpen(true)} />
        <MarketsFilters
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchTerm}
          onStatusChange={setSelectedStatus}
        />
        <MarketsTable
          markets={filteredMarkets}
          onMarketClick={setSelectedMarket}
        />
        <MarketForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateMarket}
        />
        <MarketDetails
          market={selectedMarket}
          isOpen={!!selectedMarket}
          onClose={() => setSelectedMarket(null)}
        />
      </div>
    </MainLayout>
  );
};

export default MarketsPage;
