
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, LineChart, AreaChart, Bar, Pie, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface DashboardChartsProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  department: string;
}

// Mock data for different charts
const marketStatusData = [
  { name: "En attente", value: 6, color: "#94a3b8" },
  { name: "En cours", value: 15, color: "#3b82f6" },
  { name: "Terminé", value: 8, color: "#22c55e" },
];

const departmentBudgetData = [
  { name: "Informatique", budget: 125000, spent: 98000, remaining: 27000 },
  { name: "Finance", budget: 75000, spent: 45000, remaining: 30000 },
  { name: "RH", budget: 50000, spent: 38000, remaining: 12000 },
  { name: "Ventes", budget: 110000, spent: 87000, remaining: 23000 },
  { name: "Juridique", budget: 65000, spent: 42000, remaining: 23000 },
];

const taskCompletionData = [
  { month: "Jan", completed: 23, delayed: 5 },
  { month: "Fév", completed: 28, delayed: 3 },
  { month: "Mar", completed: 30, delayed: 4 },
  { month: "Avr", completed: 35, delayed: 6 },
  { month: "Mai", completed: 32, delayed: 2 },
  { month: "Jun", completed: 37, delayed: 1 },
];

const budgetTrendData = [
  { month: "Jan", allocated: 50000, spent: 42000 },
  { month: "Fév", allocated: 55000, spent: 48000 },
  { month: "Mar", allocated: 60000, spent: 52000 },
  { month: "Avr", allocated: 65000, spent: 58000 },
  { month: "Mai", allocated: 70000, spent: 63000 },
  { month: "Jun", allocated: 75000, spent: 68000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"];

export const DashboardCharts = ({ dateRange, department }: DashboardChartsProps) => {
  const [chartType, setChartType] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading effect
  const handleChartTypeChange = (value: string) => {
    setIsLoading(true);
    setChartType(value as "daily" | "weekly" | "monthly");
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Market Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des marchés</CardTitle>
            <CardDescription>
              Répartition des marchés par statut
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {marketStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget by Department */}
        <Card>
          <CardHeader>
            <CardTitle>Budget par département</CardTitle>
            <CardDescription>
              Répartition du budget alloué et dépensé
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentBudgetData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()} €`} />
                <Legend />
                <Bar dataKey="budget" fill="#3b82f6" name="Budget alloué" />
                <Bar dataKey="spent" fill="#ef4444" name="Budget dépensé" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Completion */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Completion des tâches</CardTitle>
              <CardDescription>
                Suivi des tâches complétées vs retardées
              </CardDescription>
            </div>
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
                  />
                  <Line
                    type="monotone"
                    dataKey="delayed"
                    stroke="#f59e0b"
                    name="Tâches en retard"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Budget Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tendances du budget</CardTitle>
            <CardDescription>
              Évolution du budget alloué vs dépensé
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()} €`} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="allocated"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Budget alloué"
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Budget dépensé"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
