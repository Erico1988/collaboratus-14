
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        placeholder="Rechercher un marché..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sm:max-w-xs"
      />
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="sm:max-w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous">Tous les statuts</SelectItem>
          <SelectItem value="en_cours">En cours</SelectItem>
          <SelectItem value="en_attente">En attente</SelectItem>
          <SelectItem value="termine">Terminé</SelectItem>
          <SelectItem value="draft">Brouillon</SelectItem>
          <SelectItem value="cancelled">Annulé</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
