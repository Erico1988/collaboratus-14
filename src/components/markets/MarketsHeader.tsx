import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MarketsHeaderProps {
  onNewMarket: () => void;
}

export const MarketsHeader = ({ onNewMarket }: MarketsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Marchés</h1>
      <Button onClick={onNewMarket}>
        <Plus className="mr-2 h-4 w-4" />
        Nouveau Marché
      </Button>
    </div>
  );
};