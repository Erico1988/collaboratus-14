
import { createContext, useContext } from "react";

type ReportContextType = {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  department: string;
  refreshData: () => void;
  isRefreshing: boolean;
};

export const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReportContext must be used within a ReportContext.Provider");
  }
  return context;
};
