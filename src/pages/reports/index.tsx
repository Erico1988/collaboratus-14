
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardHeader } from "@/components/reports/DashboardHeader";
import { DashboardFilters } from "@/components/reports/DashboardFilters";
import { DashboardCharts } from "@/components/reports/DashboardCharts";
import { ReportGenerator } from "@/components/reports/ReportGenerator";

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const [department, setDepartment] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"dashboard" | "generator">("dashboard");

  return (
    <MainLayout>
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
              onDateRangeChange={setDateRange}
              onDepartmentChange={setDepartment}
            />
            <DashboardCharts
              dateRange={dateRange}
              department={department}
            />
          </>
        ) : (
          <ReportGenerator />
        )}
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
