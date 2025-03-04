import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RefreshCwIcon, FilterIcon, SearchIcon, XIcon, SaveIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface DashboardFiltersProps {
  dateRange: DateRange;
  department: string;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onDepartmentChange: (department: string) => void;
  onRefresh: () => void;
}

// Liste des départements
const departments = [
  { id: "all", name: "Tous les départements" },
  { id: "it", name: "Informatique" },
  { id: "finance", name: "Finance" },
  { id: "hr", name: "Ressources Humaines" },
  { id: "sales", name: "Ventes" },
  { id: "legal", name: "Juridique" },
  { id: "marketing", name: "Marketing" },
  { id: "operations", name: "Opérations" },
  { id: "rd", name: "R&D" },
];

// Présets de dates
const datePresets = [
  { id: "today", name: "Aujourd'hui", days: 0 },
  { id: "yesterday", name: "Hier", days: 1 },
  { id: "7days", name: "7 derniers jours", days: 7 },
  { id: "30days", name: "30 derniers jours", days: 30 },
  { id: "90days", name: "90 derniers jours", days: 90 },
  { id: "thisYear", name: "Cette année", days: 365 },
];

export const DashboardFilters = ({
  dateRange,
  department,
  onDateRangeChange,
  onDepartmentChange,
  onRefresh
}: DashboardFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handlePresetClick = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    onDateRangeChange({ from, to });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onDateRangeChange(range);
  };

  const addFilter = (filterId: string) => {
    if (!activeFilters.includes(filterId)) {
      setActiveFilters([...activeFilters, filterId]);
    }
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter(id => id !== filterId));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchValue("");
    setStatusFilter("all");
    onDepartmentChange("all");
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range Filter */}
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd MMM yyyy", { locale: fr })} -{" "}
                          {format(dateRange.to, "dd MMM yyyy", { locale: fr })}
                        </>
                      ) : (
                        format(dateRange.from, "dd MMM yyyy", { locale: fr })
                      )
                    ) : (
                      <span>Sélectionner une période</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="px-4 pt-4 pb-2 border-b">
                    <div className="flex flex-wrap gap-2">
                      {datePresets.map(preset => (
                        <Button 
                          key={preset.id} 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePresetClick(preset.days)}
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Department Filter */}
            <div>
              <Select value={department} onValueChange={onDepartmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Select 
                value={statusFilter} 
                onValueChange={(value) => {
                  setStatusFilter(value);
                  if (value !== "all") {
                    addFilter(`status-${value}`);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="termine">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-9 w-full"
              />
              {searchValue && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchValue("")}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <FilterIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px]" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">Filtres avancés</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Budget minimum</span>
                      <Input type="number" className="w-24 h-8" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Budget maximum</span>
                      <Input type="number" className="w-24 h-8" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Niveau de risque</span>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue placeholder="Tous" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="medium">Moyen</SelectItem>
                          <SelectItem value="high">Élevé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={clearAllFilters}>
                      Réinitialiser
                    </Button>
                    <Button size="sm" onClick={() => addFilter("budget-range")}>
                      Appliquer
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="icon" className="shrink-0" onClick={onRefresh}>
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon" className="shrink-0">
              <SaveIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Active Filter Badges */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Filtres actifs:</span>
            {activeFilters.map(filter => {
              let label = "";
              if (filter.startsWith("status-")) {
                const status = filter.replace("status-", "");
                label = `Statut: ${status === "en_attente" ? "En attente" : status === "en_cours" ? "En cours" : "Terminé"}`;
              } else if (filter === "budget-range") {
                label = "Budget: Personnalisé";
              }
              
              return (
                <Badge key={filter} variant="outline" className="pl-2 pr-1 py-1 flex items-center gap-1">
                  {label}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => removeFilter(filter)}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={clearAllFilters}
            >
              Effacer tout
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
