
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { markets } from "@/data/markets";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar } from "lucide-react";

export const Markets = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map((market) => (
        <Card key={market.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="font-semibold text-lg">{market.title}</span>
              <Badge>En cours</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>Ref: {market.id}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Créé le {new Date().toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
