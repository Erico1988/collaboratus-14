
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardHeader } from "@/components/reports/DashboardHeader";
import { DashboardFilters } from "@/components/reports/DashboardFilters";
import { DashboardCharts } from "@/components/reports/DashboardCharts";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { KPICards } from "@/components/reports/KPICards";
import { DataTable } from "@/components/reports/DataTable";
import { TrendsAnalysis } from "@/components/reports/TrendsAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportContext } from "@/components/reports/ReportContext";
import { DateRange } from "react-day-picker";

const ReportsPage = () => {
  // Use DateRange type from react-day-picker and define as optional
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const [department, setDepartment] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"dashboard" | "generator">("dashboard");
  const [selectedView, setSelectedView] = useState<"charts" | "data" | "trends">("charts");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handler function that ensures 'to' is always set when 'from' is set
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range && range.from) {
      setDateRange({
        from: range.from,
        to: range.to || range.from
      });
    } else {
      setDateRange({} as DateRange);
    }
  };

  // Simulate data refresh
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const contextValue = {
    dateRange,
    department,
    refreshData,
    isRefreshing
  };

  return (
    <MainLayout>
      <ReportContext.Provider value={contextValue}>
        <div className="space-y-6">
          <DashboardHeader 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          {activeTab === "dashboard" ? (
            <>
              <DashboardFilters
                dateRange={dateRange}
                department={department}
                onDateRangeChange={handleDateRangeChange}
                onDepartmentChange={setDepartment}
                onRefresh={refreshData}
              />
              
              <KPICards 
                dateRange={dateRange}
                department={department}
                isLoading={isRefreshing}
              />

              <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)} className="mt-8">
                <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
                  <TabsTrigger value="charts">Graphiques</TabsTrigger>
                  <TabsTrigger value="data">Données</TabsTrigger>
                  <TabsTrigger value="trends">Tendances</TabsTrigger>
                </TabsList>
                
                <TabsContent value="charts">
                  <DashboardCharts
                    dateRange={dateRange}
                    department={department}
                    isLoading={isRefreshing}
                  />
                </TabsContent>
                
                <TabsContent value="data">
                  <DataTable 
                    dateRange={dateRange}
                    department={department}
                    isLoading={isRefreshing}
                  />
                </TabsContent>
                
                <TabsContent value="trends">
                  <TrendsAnalysis 
                    dateRange={dateRange}
                    department={department}
                    isLoading={isRefreshing}
                  />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <ReportGenerator />
          )}
        </div>
      </ReportContext.Provider>
    </MainLayout>
  );
};

export default ReportsPage;
