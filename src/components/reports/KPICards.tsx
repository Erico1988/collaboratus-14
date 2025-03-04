
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon, TargetIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface KPICardsProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  department: string;
  isLoading: boolean;
}

// Données simulées pour les KPIs
const kpiData = {
  totalMarkets: { value: 29, change: 3, trend: "up" },
  totalBudget: { value: 456250, change: 5.2, trend: "up" },
  completionRate: { value: 72, change: -2.1, trend: "down" },
  delayRate: { value: 18, change: 1.4, trend: "up" },
  riskScore: { value: 24, change: -8.5, trend: "down" },
  avgClosureTime: { value: 35, change: -3, trend: "down" },
};

export const KPICards = ({ dateRange, department, isLoading }: KPICardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPICard
        title="Marchés totaux"
        value={kpiData.totalMarkets.value}
        unit=""
        change={kpiData.totalMarkets.change}
        trend={kpiData.totalMarkets.trend as "up" | "down"}
        icon={<TargetIcon className="h-5 w-5" />}
        isLoading={isLoading}
      />
      
      <KPICard
        title="Budget total"
        value={kpiData.totalBudget.value}
        unit="€"
        change={kpiData.totalBudget.change}
        trend={kpiData.totalBudget.trend as "up" | "down"}
        icon={<TrendingUpIcon className="h-5 w-5" />}
        isLoading={isLoading}
        format={(value) => `${value.toLocaleString()} €`}
      />
      
      <KPICard
        title="Taux de completion"
        value={kpiData.completionRate.value}
        unit="%"
        change={kpiData.completionRate.change}
        trend={kpiData.completionRate.trend as "up" | "down"}
        icon={<CheckCircleIcon className="h-5 w-5" />}
        isLoading={isLoading}
        format={(value) => `${value} %`}
      />
      
      <KPICard
        title="Taux de retard"
        value={kpiData.delayRate.value}
        unit="%"
        change={kpiData.delayRate.change}
        trend={kpiData.delayRate.trend as "up" | "down"}
        icon={<AlertCircleIcon className="h-5 w-5" />}
        isLoading={isLoading}
        format={(value) => `${value} %`}
        trendIsGood={false}
      />
      
      <KPICard
        title="Score de risque"
        value={kpiData.riskScore.value}
        unit=""
        change={kpiData.riskScore.change}
        trend={kpiData.riskScore.trend as "up" | "down"}
        icon={<AlertCircleIcon className="h-5 w-5" />}
        isLoading={isLoading}
        trendIsGood={false}
      />
      
      <KPICard
        title="Temps de clôture"
        value={kpiData.avgClosureTime.value}
        unit="jours"
        change={kpiData.avgClosureTime.change}
        trend={kpiData.avgClosureTime.trend as "up" | "down"}
        icon={<TrendingUpIcon className="h-5 w-5" />}
        isLoading={isLoading}
        format={(value) => `${value} jours`}
        trendIsGood={false}
      />
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: number;
  unit: string;
  change: number;
  trend: "up" | "down";
  icon: React.ReactNode;
  isLoading: boolean;
  format?: (value: number) => string;
  trendIsGood?: boolean;
}

const KPICard = ({ 
  title, 
  value, 
  unit, 
  change, 
  trend, 
  icon, 
  isLoading,
  format = (v) => v.toString(),
  trendIsGood = true
}: KPICardProps) => {
  const trendIsPositive = trendIsGood ? trend === "up" : trend === "down";
  const TrendIcon = trend === "up" ? ArrowUpIcon : ArrowDownIcon;
  const changeSign = change >= 0 ? "+" : "";
  
  return (
    <Card>
      <CardContent className="p-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className={`p-1.5 rounded-full ${trendIsPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {icon}
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold mb-1">
              {format(value)}
            </div>
            <div className="flex items-center gap-1">
              <div className={`flex items-center text-xs ${trendIsPositive ? 'text-green-600' : 'text-red-600'}`}>
                <TrendIcon className="h-3 w-3 mr-1" />
                <span>{changeSign}{change}{unit === "%" ? "pp" : "%"}</span>
              </div>
              <span className="text-xs text-muted-foreground">vs. période précédente</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
