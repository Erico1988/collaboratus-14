import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DocumentsPage from "./pages/documents";
import PlaceholderPage from "./pages/PlaceholderPage";
import TasksPage from "./pages/tasks";
import MarketsPage from "./pages/markets";
import ReportsPage from "./pages/reports";
import { ThemeProvider } from "./styles/ThemeProvider";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            retry: 1,
        },
    },
});

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <TooltipProvider>
                <Toaster />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/documents" element={<DocumentsPage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/markets" element={<MarketsPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/workflow" element={<PlaceholderPage title="Workflow" />} />
                        <Route path="/risks" element={<PlaceholderPage title="Risques" />} />
                        <Route path="/suppliers" element={<PlaceholderPage title="Fournisseurs" />} />
                        <Route path="/budget" element={<PlaceholderPage title="Budget" />} />
                        <Route path="/contracts" element={<PlaceholderPage title="Contrats" />} />
                        <Route path="/resources" element={<PlaceholderPage title="Ressources" />} />
                        <Route path="/users" element={<PlaceholderPage title="Utilisateurs" />} />
                        <Route path="/settings" element={<PlaceholderPage title="Paramètres" />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default App;
