
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { markets } from "@/data/markets";

interface MarketFilterProps {
  selectedMarketId: string;
  onMarketChange: (marketId: string) => void;
}

export const MarketFilter = ({ selectedMarketId, onMarketChange }: MarketFilterProps) => {
  return (
    <Select
      value={selectedMarketId}
      onValueChange={onMarketChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Tous les marchés" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Marchés</SelectLabel>
          <SelectItem value="">Tous les marchés</SelectItem>
          {markets.map(market => (
            <SelectItem key={market.id} value={market.id}>
              {market.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
