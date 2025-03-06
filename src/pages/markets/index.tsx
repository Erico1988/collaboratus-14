import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";
import { MarketsHeader } from "@/components/markets/MarketsHeader";
import { MarketsFilters } from "@/components/markets/MarketsFilters";
import { MarketsTable } from "@/components/markets/MarketsTable";
import { MarketForm } from "@/components/markets/MarketForm";
import { MarketDetails } from "@/components/markets/MarketDetails";
import { Market, MarketStatus } from "@/types/market";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Filter, 
  PlusCircle, 
  RefreshCw, 
  Search, 
  Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MarketDialog } from "@/components/markets/MarketDialog";

// Temporary mock data
const mockMarkets: Market[] = [
  {
    id: "M2024-001",
    title: "Fourniture de matériel informatique",
    description: "Acquisition de postes de travail, écrans et périphériques pour le renouvellement du parc informatique",
    status: "en_cours",
    budget: 150000,
    deadline: "2024-06-30",
    riskLevel: "faible",
    department: "DSI",
    contactName: "Jean Dupont",
    contactEmail: "jean.dupont@example.com",
    createdAt: "2024-01-15",
    documents: ["Cahier des charges.pdf", "Annexe technique.docx"],
    tags: ["informatique", "matériel", "bureautique"]
  },
  {
    id: "M2024-002",
    title: "Services de maintenance bâtiments",
    description: "Contrat de maintenance préventive et curative des installations techniques des bâtiments administratifs",
    status: "en_attente",
    budget: 75000,
    deadline: "2024-07-15",
    riskLevel: "moyen",
    department: "Services Généraux",
    contactName: "Marie Leroy",
    contactEmail: "marie.leroy@example.com",
    createdAt: "2024-02-10",
    documents: ["Contrat type.pdf"],
    tags: ["maintenance", "bâtiment", "services"]
  },
  {
    id: "M2024-003",
    title: "Prestations de formation",
    description: "Formation du personnel aux nouveaux outils collaboratifs et à la cybersécurité",
    status: "termine",
    budget: 45000,
    deadline: "2024-05-01",
    riskLevel: "faible",
    department: "Ressources Humaines",
    contactName: "Sophie Martin",
    contactEmail: "sophie.martin@example.com",
    createdAt: "2024-01-05",
    updatedAt: "2024-05-10",
    documents: ["Programme de formation.pdf", "Liste des participants.xlsx"],
    tags: ["formation", "RH", "cybersécurité"]
  },
  {
    id: "M2024-004",
    title: "Développement application mobile",
    description: "Conception et développement d'une application mobile pour les agents de terrain",
    status: "en_cours",
    budget: 120000,
    deadline: "2024-08-30",
    riskLevel: "eleve",
    department: "DSI",
    contactName: "Thomas Bernard",
    contactEmail: "thomas.bernard@example.com",
    createdAt: "2024-03-01",
    documents: ["Spécifications techniques.pdf"],
    tags: ["développement", "mobile", "application"]
  },
  {
    id: "M2024-005",
    title: "Fourniture de mobilier de bureau",
    description: "Acquisition de mobilier ergonomique pour l'aménagement des nouveaux locaux",
    status: "brouillon",
    budget: 60000,
    deadline: "2024-09-15",
    riskLevel: "faible",
    department: "Services Généraux",
    contactName: "Pierre Dubois",
    contactEmail: "pierre.dubois@example.com",
    createdAt: "2024-03-20",
    tags: ["mobilier", "ergonomie", "aménagement"]
  },
  {
    id: "M2024-006",
    title: "Refonte du site internet",
    description: "Refonte complète du site internet institutionnel avec intégration d'un portail citoyen",
    status: "en_cours",
    budget: 95000,
    deadline: "2024-10-30",
    riskLevel: "moyen",
    department: "Communication",
    contactName: "Julie Moreau",
    contactEmail: "julie.moreau@example.com",
    createdAt: "2024-02-25",
    documents: ["Cahier des charges.pdf", "Maquettes.pdf"],
    tags: ["web", "communication", "digital"]
  },
  {
    id: "M2024-007",
    title: "Étude d'impact environnemental",
    description: "Réalisation d'une étude d'impact environnemental pour le projet d'extension de la zone industrielle",
    status: "en_attente",
    budget: 35000,
    deadline: "2024-08-15",
    riskLevel: "moyen",
    department: "Environnement",
    contactName: "Marc Petit",
    contactEmail: "marc.petit@example.com",
    createdAt: "2024-03-10",
    tags: ["environnement", "étude", "impact"]
  }
];

// Statistiques pour les graphiques
const getStatusStats = (markets: Market[]) => {
  const stats = {
    en_cours: 0,
    en_attente: 0,
    termine: 0,
    annule: 0,
    brouillon: 0
  };
  
  markets.forEach(market => {
    stats[market.status as keyof typeof stats]++;
  });
  
  return [
    { name: 'En cours', value: stats.en_cours, color: '#3b82f6' },
    { name: 'En attente', value: stats.en_attente, color: '#f59e0b' },
    { name: 'Terminé', value: stats.termine, color: '#10b981' },
    { name: 'Annulé', value: stats.annule, color: '#ef4444' },
    { name: 'Brouillon', value: stats.brouillon, color: '#6b7280' }
  ];
};

const getBudgetByDepartment = (markets: Market[]) => {
  const deptBudgets: Record<string, number> = {};
  
  markets.forEach(market => {
    if (market.department) {
      deptBudgets[market.department] = (deptBudgets[market.department] || 0) + market.budget;
    }
  });
  
  return Object.entries(deptBudgets).map(([name, value]) => ({ name, value }));
};

const getRiskStats = (markets: Market[]) => {
  const stats = {
    faible: 0,
    moyen: 0,
    eleve: 0
  };
  
  markets.forEach(market => {
    stats[market.riskLevel as keyof typeof stats]++;
  });
  
  return [
    { name: 'Faible', value: stats.faible, color: '#10b981' },
    { name: 'Moyen', value: stats.moyen, color: '#f59e0b' },
    { name: 'Élevé', value: stats.eleve, color: '#ef4444' }
  ];
};

const getUpcomingDeadlines = (markets: Market[]) => {
  const now = new Date();
  const inThreeMonths = new Date();
  inThreeMonths.setMonth(now.getMonth() + 3);
  
  return markets
    .filter(market => {
      const deadline = new Date(market.deadline);
      return deadline > now && deadline <= inThreeMonths && market.status !== 'termine' && market.status !== 'annule';
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);
};

const MarketsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("tous");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [markets, setMarkets] = useState<Market[]>(mockMarkets);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [activeTab, setActiveTab] = useState("liste");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [marketToEdit, setMarketToEdit] = useState<Market | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("tous");
  const [selectedRisk, setSelectedRisk] = useState("tous");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  // Statistiques
  const statusStats = getStatusStats(markets);
  const budgetByDepartment = getBudgetByDepartment(markets);
  const riskStats = getRiskStats(markets);
  const upcomingDeadlines = getUpcomingDeadlines(markets);

  // Départements uniques pour les filtres
  const departments = Array.from(new Set(markets.filter(m => m.department).map(m => m.department))) as string[];

  const filteredMarkets = markets.filter((market) => {
    const matchesSearch = market.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (market.description && market.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         market.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "tous" || market.status === selectedStatus;
    
    const matchesDepartment = selectedDepartment === "tous" || market.department === selectedDepartment;
    
    const matchesRisk = selectedRisk === "tous" || market.riskLevel === selectedRisk;
    
    const matchesMinBudget = minBudget === "" || market.budget >= parseInt(minBudget);
    
    const matchesMaxBudget = maxBudget === "" || market.budget <= parseInt(maxBudget);
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesRisk && matchesMinBudget && matchesMaxBudget;
  });

  const handleCreateMarket = (values: Market) => {
    const newMarket = {
      id: `M2024-${(markets.length + 1).toString().padStart(3, "0")}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...values,
    };
    setMarkets([...markets, newMarket]);
    toast({
      title: "Marché créé",
      description: "Le marché a été créé avec succès.",
    });
  };

  const handleEditMarket = async (values: any) => {
    if (!marketToEdit) return;
    
    const updatedMarkets = markets.map(market => 
      market.id === marketToEdit.id 
        ? { 
            ...market, 
            ...values, 
            updatedAt: new Date().toISOString().split('T')[0]
          } 
        : market
    );
    
    setMarkets(updatedMarkets);
    setIsEditDialogOpen(false);
    setMarketToEdit(null);
    
    toast({
      title: "Marché mis à jour",
      description: "Les modifications ont été enregistrées avec succès.",
    });
  };

  const handleDeleteMarket = (marketId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce marché ? Cette action est irréversible.")) {
      const updatedMarkets = markets.filter(market => market.id !== marketId);
      setMarkets(updatedMarkets);
      
      toast({
        title: "Marché supprimé",
        description: "Le marché a été supprimé avec succès.",
      });
    }
  };

  const openEditDialog = (market: Market) => {
    setMarketToEdit(market);
    setIsEditDialogOpen(true);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("tous");
    setSelectedDepartment("tous");
    setSelectedRisk("tous");
    setMinBudget("");
    setMaxBudget("");
  };

  const totalBudget = markets.reduce((sum, market) => sum + market.budget, 0);
  const activeBudget = markets
    .filter(market => market.status === "en_cours" || market.status === "en_attente")
    .reduce((sum, market) => sum + market.budget, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <MarketsHeader onNewMarket={() => setIsFormOpen(true)} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="liste">Liste des marchés</TabsTrigger>
              <TabsTrigger value="tableau-bord">Tableau de bord</TabsTrigger>
              <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres avancés
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetFilters}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>
          
          {isAdvancedFilterOpen && (
            <Card className="mb-6 p-4 glass-panel">
              <CardContent className="p-0 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recherche</label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un marché..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Statut</label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les statuts</SelectItem>
                        <SelectItem value="en_cours">En cours</SelectItem>
                        <SelectItem value="en_attente">En attente</SelectItem>
                        <SelectItem value="termine">Terminé</SelectItem>
                        <SelectItem value="annule">Annulé</SelectItem>
                        <SelectItem value="brouillon">Brouillon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Département</label>
                    <Select
                      value={selectedDepartment}
                      onValueChange={setSelectedDepartment}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un département" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les départements</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Niveau de risque</label>
                    <Select
                      value={selectedRisk}
                      onValueChange={setSelectedRisk}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un niveau de risque" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les niveaux</SelectItem>
                        <SelectItem value="faible">Faible</SelectItem>
                        <SelectItem value="moyen">Moyen</SelectItem>
                        <SelectItem value="eleve">Élevé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget minimum (€)</label>
                    <Input
                      type="number"
                      placeholder="Budget minimum"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget maximum (€)</label>
                    <Input
                      type="number"
                      placeholder="Budget maximum"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <TabsContent value="liste" className="mt-6">
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {filteredMarkets.length} marché{filteredMarkets.length !== 1 ? 's' : ''} trouvé{filteredMarkets.length !== 1 ? 's' : ''}
              </div>
              
              <div className="flex gap-2">
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                    <SelectItem value="annule">Annulé</SelectItem>
                    <SelectItem value="brouillon">Brouillon</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[250px]"
                  />
                </div>
              </div>
            </div>
            
            <MarketsTable
              markets={filteredMarkets}
              onMarketClick={setSelectedMarket}
              onEditMarket={openEditDialog}
              onDeleteMarket={handleDeleteMarket}
            />
          </TabsContent>
          
          <TabsContent value="tableau-bord" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Budget total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalBudget)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Budget actif: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(activeBudget)}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Marchés par statut</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">En cours: {statusStats[0].value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">En attente: {statusStats[1].value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Terminé: {statusStats[2].value}</span>
                    </div>
                  </div>
                  <div className="h-20 w-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={15}
                          outerRadius={30}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Répartition des risques</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Faible: {riskStats[0].value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Moyen: {riskStats[1].value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Élevé: {riskStats[2].value}</span>
                    </div>
                  </div>
                  <div className="h-20 w-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={15}
                          outerRadius={30}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {riskStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Budget par département</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={budgetByDepartment}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value as number)}
                        />
                        <Legend />
                        <Bar dataKey="value" name="Budget" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Échéances à venir</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingDeadlines.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingDeadlines.map(market => (
                        <div key={market.id} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <div className="font-medium">{market.title}</div>
                            <div className="text-sm text-muted-foreground">{market.id}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {format(new Date(market.deadline), 'dd MMM yyyy', { locale: fr })}
                            </div>
                            <Badge 
                              className={
                                new Date(market.deadline).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              }
                            >
                              {Math.ceil((new Date(market.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mb-2 opacity-20" />
                      <p>Aucune échéance proche</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {markets
                    .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())
                    .slice(0, 5)
                    .map(market => (
                      <div key={market.id} className="flex items-start gap-4 border-b pb-4">
                        <div className={`rounded-full p-2 ${
                          market.status === 'en_cours' ? 'bg-blue-100 text-blue-600' :
                          market.status === 'en_attente' ? 'bg-yellow-100 text-yellow-600' :
                          market.status === 'termine' ? 'bg-green-100 text-green-600' :
                          market.status === 'annule' ? 'bg-red-100 text-red-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {market.status === 'en_cours' ? <Clock className="h-5 w-5" /> :
                           market.status === 'en_attente' ? <Clock className="h-5 w-5" /> :
                           market.status === 'termine' ? <CheckCircle className="h-5 w-5" /> :
                           market.status === 'annule' ? <Trash2 className="h-5 w-5" /> :
                           <FileText className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{market.title}</p>
                              <p className="text-sm text-muted-foreground">{market.id}</p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {market.createdAt && format(new Date(market.createdAt), 'dd MMM yyyy', { locale: fr })}
                            </div>
                          </div>
                          <div className="mt-1 flex gap-2">
                            <Badge className={
                              market.status === 'en_cours' ? 'bg-blue-500' :
                              market.status === 'en_attente' ? 'bg-yellow-500' :
                              market.status === 'termine' ? 'bg-green-500' :
                              market.status === 'annule' ? 'bg-red-500' :
                              'bg-gray-500'
                            }>
                              {market.status === 'en_cours' ? 'En cours' :
                               market.status === 'en_attente' ? 'En attente' :
                               market.status === 'termine' ? 'Terminé' :
                               market.status === 'annule' ? 'Annulé' :
                               'Brouillon'}
                            </Badge>
                            <Badge className={
                              market.riskLevel === 'faible' ? 'bg-green-500' :
                              market.riskLevel === 'moyen' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }>
                              Risque {market.riskLevel}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendrier" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendrier des échéances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Regroupement par mois */}
                  {Array.from(new Set(markets.map(m => {
                    const date = new Date(m.deadline);
                    return `${date.getFullYear()}-${date.getMonth()}`;
                  }))).sort().map(monthKey => {
                    const [year, month] = monthKey.split('-').map(Number);
                    const monthName = new Date(year, month).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                    
                    const monthMarkets = markets.filter(m => {
                      const date = new Date(m.deadline);
                      return date.getFullYear() === year && date.getMonth() === month;
                    }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
                    
                    return (
                      <div key={monthKey}>
                        <h3 className="text-lg font-medium capitalize mb-4">{monthName}</h3>
                        <div className="space-y-3">
                          {monthMarkets.map(market => (
                            <div 
                              key={market.id} 
                              className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                              onClick={() => setSelectedMarket(market)}
                            >
                              <div className="w-16 h-16 flex flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <span className="text-xl font-bold">{new Date(market.deadline).getDate()}</span>
                                <span className="text-xs">{new Date(market.deadline).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{market.title}</div>
                                <div className="text-sm text-muted-foreground">{market.id}</div>
                                <div className="flex gap-2 mt-1">
                                  <Badge className={
                                    market.status === 'en_cours' ? 'bg-blue-500' :
                                    market.status === 'en_attente' ? 'bg-yellow-500' :
                                    market.status === 'termine' ? 'bg-green-500' :
                                    market.status === 'annule' ? 'bg-red-500' :
                                    'bg-gray-500'
                                  }>
                                    {market.status === 'en_cours' ? 'En cours' :
                                     market.status === 'en_attente' ? 'En attente' :
                                     market.status === 'termine' ? 'Terminé' :
                                     market.status === 'annule' ? 'Annulé' :
                                     'Brouillon'}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">
                                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(market.budget)}
                                </div>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                  {market.riskLevel === 'eleve' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                                  <Badge className={
                                    market.riskLevel === 'faible' ? 'bg-green-500' :
                                    market.riskLevel === 'moyen' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }>
                                    {market.riskLevel}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
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
        
        {marketToEdit && (
          <MarketDialog
            market={marketToEdit}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSubmit={handleEditMarket}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default MarketsPage;