import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { MarketStatus } from "@/types/market";

interface MarketsFiltersProps {
  searchTerm: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const MarketsFilters = ({
  searchTerm,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}: MarketsFiltersProps) => {
  return (
    <Card className="p-4 glass-panel">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Rechercher</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Rechercher un marché..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={selectedStatus}
            onValueChange={onStatusChange}
          >
            <SelectTrigger id="status">
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
      </div>
    </Card>
  );
};