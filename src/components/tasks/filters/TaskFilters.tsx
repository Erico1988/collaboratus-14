
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Task, TaskFilter, TaskPriority, TaskStatus } from "@/types/task";
import { MarketFilter } from "./MarketFilter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface TaskFiltersProps {
  filters: TaskFilter;
  onFilterChange: (filters: TaskFilter) => void;
  markets: { id: string; title: string }[];
}

export const TaskFilters = ({ filters, onFilterChange, markets }: TaskFiltersProps) => {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    filters.dueDate?.start ? new Date(filters.dueDate.start) : undefined
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchValue });
  };

  const handleStatusChange = (value: TaskStatus | "all") => {
    if (value === "all") {
      const { status, ...rest } = filters;
      onFilterChange(rest);
    } else {
      onFilterChange({ ...filters, status: [value] });
    }
  };

  const handlePriorityChange = (value: TaskPriority | "all") => {
    if (value === "all") {
      const { priority, ...rest } = filters;
      onFilterChange(rest);
    } else {
      onFilterChange({ ...filters, priority: [value] });
    }
  };

  const handleMarketChange = (marketId: string) => {
    onFilterChange({ ...filters, marketId: marketId || undefined });
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onFilterChange({
        ...filters,
        dueDate: { start: date.toISOString() }
      });
    } else {
      const { dueDate, ...rest } = filters;
      onFilterChange(rest);
    }
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setSelectedDate(undefined);
    onFilterChange({});
  };

  const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "todo", label: "À faire" },
    { value: "in_progress", label: "En cours" },
    { value: "review", label: "En révision" },
    { value: "done", label: "Terminé" },
    { value: "pending", label: "En attente" },
    { value: "rejected", label: "Rejeté" },
    { value: "assigned", label: "Assigné" }
  ];

  const priorityOptions = [
    { value: "all", label: "Toutes les priorités" },
    { value: "low", label: "Basse" },
    { value: "medium", label: "Moyenne" },
    { value: "high", label: "Haute" },
    { value: "urgent", label: "Urgente" }
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.priority) count++;
    if (filters.marketId) count++;
    if (filters.dueDate) count++;
    return count;
  };

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filtres</h3>
        {getActiveFiltersCount() > 0 && (
          <Badge variant="secondary">{getActiveFiltersCount()} actif(s)</Badge>
        )}
      </div>
      
      <Separator />
      
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-8"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        <Button type="submit">Rechercher</Button>
      </form>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Statut</label>
          <Select
            value={filters.status?.[0] || "all"}
            onValueChange={(value) => handleStatusChange(value as TaskStatus | "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Statut</SelectLabel>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Priorité</label>
          <Select
            value={filters.priority?.[0] || "all"}
            onValueChange={(value) => handlePriorityChange(value as TaskPriority | "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les priorités" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Priorité</SelectLabel>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Marché</label>
          <MarketFilter
            selectedMarketId={filters.marketId || ""}
            onMarketChange={handleMarketChange}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Date d'échéance</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                {selectedDate ? (
                  format(selectedDate, "d MMMM yyyy", { locale: fr })
                ) : (
                  "Sélectionner une date"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {getActiveFiltersCount() > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleResetFilters}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
};
