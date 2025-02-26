
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { markets } from "@/data/markets";

interface MarketFilterProps {
  selectedMarketId: string;
  onMarketChange: (marketId: string) => void;
}

export const MarketFilter = ({ selectedMarketId, onMarketChange }: MarketFilterProps) => {
  return (
    <div className="w-[250px]">
      <Label htmlFor="market-filter">Filtrer par marché</Label>
      <Select
        value={selectedMarketId}
        onValueChange={onMarketChange}
      >
        <SelectTrigger id="market-filter">
          <SelectValue placeholder="Tous les marchés" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous les marchés</SelectItem>
          {markets.map(market => (
            <SelectItem key={market.id} value={market.id}>
              {market.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
