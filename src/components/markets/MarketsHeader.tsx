
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MarketsHeaderProps {
  onNewMarket: () => void;
}

export const MarketsHeader = ({ onNewMarket }: MarketsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Marchés</h1>
        <p className="text-muted-foreground">
          Gérez vos marchés et leurs détails
        </p>
      </div>
      <Button onClick={onNewMarket}>
        <Plus className="mr-2 h-4 w-4" />
        Nouveau marché
      </Button>
    </div>
  );
};
