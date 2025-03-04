import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DownloadIcon,
  FilterIcon,
  SortAscIcon,
  SortDescIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react";
import { DateRange } from "react-day-picker";

interface DataTableProps {
  dateRange: DateRange;
  department: string;
  isLoading: boolean;
}

// Données simulées pour le tableau
const tableData = [
  { id: 1, name: "Rénovation Bureaux", budget: 75000, spent: 68450, status: "en_cours", startDate: "2023-05-10", endDate: "2023-12-15" },
  { id: 2, name: "Équipement IT", budget: 125000, spent: 98750, status: "en_cours", startDate: "2023-06-02", endDate: "2023-11-30" },
  { id: 3, name: "Services Conseils", budget: 50000, spent: 50000, status: "termine", startDate: "2023-04-15", endDate: "2023-08-30" },
  { id: 4, name: "Formation Personnel", budget: 35000, spent: 12500, status: "en_cours", startDate: "2023-07-01", endDate: "2024-01-31" },
  { id: 5, name: "Licences Logiciels", budget: 95000, spent: 95000, status: "termine", startDate: "2023-03-15", endDate: "2023-09-15" },
  { id: 6, name: "Matériel Marketing", budget: 45000, spent: 10250, status: "en_attente", startDate: "2023-08-01", endDate: "2024-02-28" },
  { id: 7, name: "Mobilier Bureau", budget: 65000, spent: 58750, status: "en_cours", startDate: "2023-05-20", endDate: "2023-10-15" },
  { id: 8, name: "Audit Qualité", budget: 30000, spent: 30000, status: "termine", startDate: "2023-06-10", endDate: "2023-07-30" },
];

const statusLabels: Record<string, string> = {
  en_attente: "En attente",
  en_cours: "En cours",
  termine: "Terminé"
};

const statusColors: Record<string, string> = {
  en_attente: "bg-yellow-500",
  en_cours: "bg-blue-500",
  termine: "bg-green-500"
};

export const DataTable = ({ dateRange, department, isLoading }: DataTableProps) => {
  return (
    <Card>
      <CardHeader className="py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Détails des marchés</CardTitle>
            <CardDescription>
              Vue détaillée de tous les marchés dans la période sélectionnée
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead className="min-w-[150px]">
                  <div className="flex items-center gap-1">
                    Marché
                    <SortAscIcon className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="min-w-[80px]">
                  <div className="flex items-center gap-1">
                    Budget
                    <SortDescIcon className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Dépensé</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date début</TableHead>
                <TableHead>Date fin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : (
                tableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.budget.toLocaleString()} €</TableCell>
                    <TableCell>{row.spent.toLocaleString()} €</TableCell>
                    <TableCell>
                      <Badge className={statusColors[row.status]}>
                        {statusLabels[row.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(row.startDate)}</TableCell>
                    <TableCell>{formatDate(row.endDate)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Affichage 1 à 8 sur 28 entrées
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">1</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">3</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">4</Button>
            <Button variant="outline" size="icon">
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
