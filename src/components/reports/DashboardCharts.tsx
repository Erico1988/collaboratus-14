
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, LineChart, AreaChart, Bar, Pie, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from "recharts";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, InfoIcon, PieChartIcon, TrendingUpIcon, BarChart3Icon, ScatterChartIcon, MoveUpIcon, MoveDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface DashboardChartsProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  department: string;
  isLoading: boolean;
}

// Données améliorées pour les graphiques
const marketStatusData = [
  { name: "En attente", value: 8, color: "#94a3b8" },
  { name: "En cours", value: 15, color: "#3b82f6" },
  { name: "Terminé", value: 12, color: "#22c55e" },
];

const departmentBudgetData = [
  { name: "Informatique", budget: 145000, spent: 125000, remaining: 20000 },
  { name: "Finance", budget: 85000, spent: 62000, remaining: 23000 },
  { name: "RH", budget: 60000, spent: 45000, remaining: 15000 },
  { name: "Ventes", budget: 130000, spent: 110000, remaining: 20000 },
  { name: "Juridique", budget: 75000, spent: 50000, remaining: 25000 },
  { name: "Marketing", budget: 95000, spent: 82000, remaining: 13000 },
  { name: "Opérations", budget: 110000, spent: 92000, remaining: 18000 },
];

const taskCompletionData = [
  { month: "Jan", completed: 23, delayed: 5, expected: 25 },
  { month: "Fév", completed: 28, delayed: 3, expected: 26 },
  { month: "Mar", completed: 30, delayed: 4, expected: 27 },
  { month: "Avr", completed: 35, delayed: 6, expected: 28 },
  { month: "Mai", completed: 32, delayed: 2, expected: 30 },
  { month: "Jun", completed: 37, delayed: 1, expected: 32 },
  { month: "Jul", completed: 41, delayed: 3, expected: 33 },
  { month: "Aoû", completed: 39, delayed: 4, expected: 35 },
  { month: "Sep", completed: 42, delayed: 2, expected: 36 },
  { month: "Oct", completed: 45, delayed: 3, expected: 38 },
  { month: "Nov", completed: 48, delayed: 1, expected: 40 },
];

const budgetTrendData = [
  { month: "Jan", allocated: 60000, spent: 52000, forecast: 55000 },
  { month: "Fév", allocated: 65000, spent: 58000, forecast: 60000 },
  { month: "Mar", allocated: 70000, spent: 62000, forecast: 65000 },
  { month: "Avr", allocated: 75000, spent: 68000, forecast: 70000 },
  { month: "Mai", allocated: 80000, spent: 73000, forecast: 75000 },
  { month: "Jun", allocated: 85000, spent: 78000, forecast: 80000 },
  { month: "Jul", allocated: 90000, spent: 85000, forecast: 85000 },
  { month: "Aoû", allocated: 95000, spent: 89000, forecast: 90000 },
  { month: "Sep", allocated: 100000, spent: 95000, forecast: 95000 },
  { month: "Oct", allocated: 105000, spent: 98000, forecast: 100000 },
  { month: "Nov", allocated: 110000, spent: 102000, forecast: 105000 },
];

const riskAnalysisData = [
  { name: "Délais fournisseur", count: 8, impact: 7, probability: 6, size: 120 },
  { name: "Dépassement budget", count: 5, impact: 9, probability: 4, size: 100 },
  { name: "Qualité insuffisante", count: 12, impact: 6, probability: 7, size: 130 },
  { name: "Non-conformité", count: 3, impact: 10, probability: 3, size: 90 },
  { name: "Ressources indisponibles", count: 7, impact: 8, probability: 5, size: 110 },
  { name: "Problèmes techniques", count: 15, impact: 4, probability: 8, size: 140 },
  { name: "Changement de périmètre", count: 9, impact: 5, probability: 6, size: 100 },
];

const timelinePerformanceData = [
  { month: "Jan", onTime: 85, delayed: 15 },
  { month: "Fév", onTime: 82, delayed: 18 },
  { month: "Mar", onTime: 88, delayed: 12 },
  { month: "Avr", onTime: 90, delayed: 10 },
  { month: "Mai", onTime: 87, delayed: 13 },
  { month: "Jun", onTime: 92, delayed: 8 },
  { month: "Jul", onTime: 94, delayed: 6 },
  { month: "Aoû", onTime: 91, delayed: 9 },
  { month: "Sep", onTime: 95, delayed: 5 },
  { month: "Oct", onTime: 93, delayed: 7 },
  { month: "Nov", onTime: 96, delayed: 4 },
];

export const DashboardCharts = ({ dateRange, department, isLoading }: DashboardChartsProps) => {
  const [chartType, setChartType] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [currentLayout, setCurrentLayout] = useState<"grid" | "stack">("grid");
  
  // Pour simuler le chargement
  const handleChartTypeChange = (value: string) => {
    setChartType(value as "daily" | "weekly" | "monthly");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          value={chartType}
          onValueChange={handleChartTypeChange}
        >
          <TabsList className="grid grid-cols-3 h-8">
            <TabsTrigger value="daily" className="text-xs">Jour</TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs">Semaine</TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">Mois</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className={`h-8 px-2 ${currentLayout === "grid" ? "bg-accent" : ""}`}
            onClick={() => setCurrentLayout("grid")}
          >
            <BarChart3Icon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`h-8 px-2 ${currentLayout === "stack" ? "bg-accent" : ""}`}
            onClick={() => setCurrentLayout("stack")}
          >
            <PieChartIcon className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1 ml-4">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              <MoveUpIcon className="h-3 w-3 mr-1" />
              Hauss. 8%
            </Badge>
            <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
              <MoveDownIcon className="h-3 w-3 mr-1" />
              Baiss. 3%
            </Badge>
          </div>
        </div>
      </div>
      
      <div className={`${currentLayout === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}`}>
        {/* Market Status Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Statut des marchés</CardTitle>
                <CardDescription>
                  Répartition des marchés par statut
                </CardDescription>
              </div>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cette visualisation montre la répartition des marchés selon leur statut actuel</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {marketStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} marchés`, 'Quantité']} />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Budget by Department */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Budget par département</CardTitle>
                <CardDescription>
                  Répartition du budget alloué et dépensé
                </CardDescription>
              </div>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Visualisation comparative des budgets alloués et dépensés par département</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="space-y-4 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentBudgetData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" tickFormatter={(value) => `${value / 1000}k €`} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => `${value.toLocaleString()} €`} />
                  <Legend />
                  <Bar dataKey="budget" fill="#8884d8" name="Budget alloué" radius={[4, 4, 4, 4]} barSize={20} />
                  <Bar dataKey="spent" fill="#82ca9d" name="Budget dépensé" radius={[4, 4, 4, 4]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Task Completion */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Completion des tâches</CardTitle>
                <CardDescription>
                  Suivi des tâches complétées vs retardées
                </CardDescription>
              </div>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Évolution mensuelle des tâches complétées et retardées par rapport aux prévisions</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={taskCompletionData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    activeDot={{ r: 8 }}
                    name="Tâches complétées"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="delayed"
                    stroke="#f59e0b"
                    name="Tâches en retard"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="expected"
                    stroke="#8884d8"
                    name="Prévisions"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Budget Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Tendances du budget</CardTitle>
                <CardDescription>
                  Évolution du budget alloué vs dépensé
                </CardDescription>
              </div>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Évolution comparative des budgets alloués, dépensés et prévisions</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={budgetTrendData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient id="colorAllocated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => `${value.toLocaleString()} €`} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="allocated"
                    stroke="#8884d8"
                    fill="url(#colorAllocated)"
                    name="Budget alloué"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="spent"
                    stroke="#82ca9d"
                    fill="url(#colorSpent)"
                    name="Budget dépensé"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#ff7300"
                    name="Prévisions"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Risk Analysis Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Analyse des risques</CardTitle>
                <CardDescription>
                  Répartition des risques par impact et probabilité
                </CardDescription>
              </div>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Matrice des risques identifiés selon leur impact et probabilité d'occurrence</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="probability" 
                    name="Probabilité" 
                    domain={[0, 10]}
                    label={{ value: 'Probabilité', position: 'insideBottomRight', offset: -5 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="impact" 
                    name="Impact" 
                    domain={[0, 10]}
                    label={{ value: 'Impact', angle: -90, position: 'insideLeft' }}
                  />
                  <ZAxis type="number" dataKey="size" range={[60, 400]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name, props) => {
                      if (name === 'Impact' || name === 'Probabilité') {
                        return [`${value}/10`, name];
                      }
                      return [value, name];
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow-md">
                            <p className="font-medium">{data.name}</p>
                            <p>Probabilité: {data.probability}/10</p>
                            <p>Impact: {data.impact}/10</p>
                            <p>Occurrences: {data.count}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    name="Risques" 
                    data={riskAnalysisData} 
                    fill="#8884d8"
                    shape={(props) => {
                      const { cx, cy, fill, r } = props;
                      const RADIAN = Math.PI / 180;
                      const risk = props.payload;
                      const severity = risk.impact * risk.probability;

                      // Couleur basée sur la sévérité
                      let color = "#22c55e"; // vert pour faible
                      if (severity > 40) {
                        color = "#ef4444"; // rouge pour élevé
                      } else if (severity > 25) {
                        color = "#f59e0b"; // orange pour moyen
                      }

                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill={color}
                          opacity={0.7}
                        />
                      );
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Timeline Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Performance des délais</CardTitle>
                <CardDescription>
                  Proportion des marchés livrés à temps vs en retard
                </CardDescription>
              </div>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Évolution mensuelle du respect des délais pour les marchés</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timelinePerformanceData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  stackOffset="expand"
                >
                  <defs>
                    <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorDelayed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="onTime"
                    stackId="1"
                    stroke="#22c55e"
                    fill="url(#colorOnTime)"
                    name="À temps"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="delayed"
                    stackId="1"
                    stroke="#ef4444"
                    fill="url(#colorDelayed)"
                    name="En retard"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
