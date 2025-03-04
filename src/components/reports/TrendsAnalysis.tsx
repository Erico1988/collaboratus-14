
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUpIcon, TrendingDownIcon, AlertCircleIcon, InfoIcon } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TrendsAnalysisProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  department: string;
  isLoading: boolean;
}

// Données simulées pour les tendances
const budgetTrends = [
  { month: "Jan", predicted: 280000, actual: 290000 },
  { month: "Fév", predicted: 300000, actual: 310000 },
  { month: "Mar", predicted: 320000, actual: 300000 },
  { month: "Avr", predicted: 340000, actual: 380000 },
  { month: "Mai", predicted: 360000, actual: 350000 },
  { month: "Jun", predicted: 380000, actual: 410000 },
  { month: "Jul", predicted: 400000, actual: 430000 },
  { month: "Aoû", predicted: 420000, actual: 440000 },
  { month: "Sep", predicted: 440000, actual: 460000 },
  { month: "Oct", predicted: 460000, actual: 480000 },
  { month: "Nov", predicted: 480000, actual: 470000 },
  { month: "Déc", predicted: 500000, actual: null },
];

const marketCompletionTrends = [
  { month: "Jan", trend: 70 },
  { month: "Fév", trend: 68 },
  { month: "Mar", trend: 72 },
  { month: "Avr", trend: 75 },
  { month: "Mai", trend: 78 },
  { month: "Jun", trend: 73 },
  { month: "Jul", trend: 70 },
  { month: "Aoû", trend: 74 },
  { month: "Sep", trend: 78 },
  { month: "Oct", trend: 82 },
  { month: "Nov", trend: 80 },
  { month: "Déc", trend: null },
];

const delayRateTrends = [
  { month: "Jan", trend: 22 },
  { month: "Fév", trend: 24 },
  { month: "Mar", trend: 21 },
  { month: "Avr", trend: 19 },
  { month: "Mai", trend: 18 },
  { month: "Jun", trend: 17 },
  { month: "Jul", trend: 18 },
  { month: "Aoû", trend: 16 },
  { month: "Sep", trend: 15 },
  { month: "Oct", trend: 14 },
  { month: "Nov", trend: 12 },
  { month: "Déc", trend: null },
];

const predictedAnomalies = [
  { month: "Mar", severity: "medium", description: "Chute inattendue du budget" },
  { month: "Jun", severity: "high", description: "Forte augmentation des dépenses imprévues" },
  { month: "Nov", severity: "low", description: "Légère baisse du taux de complétion" }
];

export const TrendsAnalysis = ({ dateRange, department, isLoading }: TrendsAnalysisProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictionCard 
          title="Prévision budgétaire"
          description="Analyse prédictive du budget total"
          type="budget"
          isLoading={isLoading}
        />
        
        <AnomaliesCard
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictionCard 
          title="Taux de complétion prévisionnel"
          description="Évolution prévue du taux de complétion des marchés"
          type="completion"
          isLoading={isLoading}
        />
        
        <PredictionCard 
          title="Prévision du taux de retard"
          description="Évolution prévue du taux de retard des marchés"
          type="delay"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

interface PredictionCardProps {
  title: string;
  description: string;
  type: "budget" | "completion" | "delay";
  isLoading: boolean;
}

const PredictionCard = ({ title, description, type, isLoading }: PredictionCardProps) => {
  // Sélection des données en fonction du type
  const data = type === "budget" 
    ? budgetTrends 
    : type === "completion" 
      ? marketCompletionTrends 
      : delayRateTrends;
      
  const currentValue = type === "budget" 
    ? 470000 
    : type === "completion" 
      ? 80 
      : 12;
      
  const predictedValue = type === "budget" 
    ? 500000 
    : type === "completion" 
      ? 85 
      : 10;
      
  const change = type === "budget" 
    ? 6.4 
    : type === "completion" 
      ? 6.3 
      : -16.7;
      
  const isTrendPositive = (type === "delay" && change < 0) || (type !== "delay" && change > 0);
  
  // Formatage selon le type
  const formatValue = (value: number) => {
    if (type === "budget") {
      return `${value.toLocaleString()} €`;
    } else {
      return `${value}%`;
    }
  };
  
  const chartColor = type === "budget" 
    ? "#8884d8" 
    : type === "completion" 
      ? "#82ca9d" 
      : "#ff7300";
  
  const referenceLine = type === "completion" 
    ? 75 
    : type === "delay" 
      ? 20 
      : null;
      
  const referenceLabel = type === "completion" 
    ? "Objectif" 
    : type === "delay" 
      ? "Seuil critique" 
      : "";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Prévisions basées sur l'historique des 12 derniers mois</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-[200px] w-full mt-4" />
          </div>
        ) : (
          <>
            <div>
              <Tabs defaultValue="1m" className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-4">
                  <TabsTrigger value="1m">1M</TabsTrigger>
                  <TabsTrigger value="3m">3M</TabsTrigger>
                  <TabsTrigger value="6m">6M</TabsTrigger>
                  <TabsTrigger value="1y">1A</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="mt-4">
              <div className="flex items-baseline space-x-2 mt-2">
                <div className="text-2xl font-bold">
                  {formatValue(predictedValue)}
                </div>
                <div className={`text-sm font-medium flex items-center ${isTrendPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isTrendPositive ? (
                    <TrendingUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {change > 0 ? '+' : ''}{change}%
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Prévision d'ici 30 jours (vs. {formatValue(currentValue)} actuellement)
              </p>
            </div>
            
            <div className="h-[200px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                {type === "budget" ? (
                  <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                      </linearGradient>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1000)}k`} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString()} €`} />
                    <Legend />
                    <Area type="monotone" name="Prévu" dataKey="predicted" stroke="#8884d8" fillOpacity={1} fill="url(#colorPredicted)" />
                    <Area type="monotone" name="Réel" dataKey="actual" stroke="#82ca9d" fillOpacity={1} fill="url(#colorActual)" />
                  </AreaChart>
                ) : (
                  <LineChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="trend"
                      name="Tendance"
                      stroke={chartColor}
                      activeDot={{ r: 8 }}
                    />
                    {referenceLine !== null && (
                      <ReferenceLine
                        y={referenceLine}
                        label={referenceLabel}
                        stroke="#ff7300"
                        strokeDasharray="3 3"
                      />
                    )}
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const AnomaliesCard = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircleIcon className="h-5 w-5 text-amber-500" />
          Anomalies détectées
        </CardTitle>
        <CardDescription>
          Événements inhabituels détectés par notre système d'analyse prédictive
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, index) => (
              <div key={`skeleton-${index}`} className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {predictedAnomalies.map((anomaly, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{anomaly.month} 2023</div>
                  <Badge className={
                    anomaly.severity === "high" 
                      ? "bg-red-500" 
                      : anomaly.severity === "medium" 
                        ? "bg-amber-500" 
                        : "bg-blue-500"
                  }>
                    {anomaly.severity === "high" 
                      ? "Critique" 
                      : anomaly.severity === "medium" 
                        ? "Importante" 
                        : "Légère"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{anomaly.description}</p>
                <Separator />
              </div>
            ))}
            
            <div className="pt-2 text-center">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Voir toutes les anomalies
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
