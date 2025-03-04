
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FilePdf, FileSpreadsheet, Send, Download } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export const ReportGenerator = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("market");
  const [fileFormat, setFileFormat] = useState("pdf");
  const [generating, setGenerating] = useState(false);
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "statusSummary",
    "budgetAnalysis",
    "delayAnalysis",
  ]);

  const toggleSection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleGenerateReport = () => {
    setGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setGenerating(false);
      toast({
        title: "Rapport généré avec succès",
        description: "Votre rapport est prêt à être téléchargé.",
      });
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Générateur de rapports</CardTitle>
          <CardDescription>
            Sélectionnez les options pour générer un rapport personnalisé
          </CardDescription>
          <Tabs 
            value={reportType} 
            onValueChange={setReportType}
            className="w-full mt-4"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="market">Marchés</TabsTrigger>
              <TabsTrigger value="task">Tâches</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Période du rapport</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "dd MMM yyyy", { locale: fr })} -{" "}
                            {format(date.to, "dd MMM yyyy", { locale: fr })}
                          </>
                        ) : (
                          format(date.from, "dd MMM yyyy", { locale: fr })
                        )
                      ) : (
                        <span>Sélectionner une période</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les départements" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les départements</SelectItem>
                    <SelectItem value="it">Informatique</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">Ressources Humaines</SelectItem>
                    <SelectItem value="sales">Ventes</SelectItem>
                    <SelectItem value="legal">Juridique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sections à inclure</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reportType === "market" && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="statusSummary"
                      checked={selectedSections.includes("statusSummary")}
                      onCheckedChange={() => toggleSection("statusSummary")}
                    />
                    <Label htmlFor="statusSummary">Résumé des statuts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="budgetAnalysis"
                      checked={selectedSections.includes("budgetAnalysis")}
                      onCheckedChange={() => toggleSection("budgetAnalysis")}
                    />
                    <Label htmlFor="budgetAnalysis">Analyse budgétaire</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="delayAnalysis"
                      checked={selectedSections.includes("delayAnalysis")}
                      onCheckedChange={() => toggleSection("delayAnalysis")}
                    />
                    <Label htmlFor="delayAnalysis">Analyse des retards</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="riskAssessment"
                      checked={selectedSections.includes("riskAssessment")}
                      onCheckedChange={() => toggleSection("riskAssessment")}
                    />
                    <Label htmlFor="riskAssessment">Évaluation des risques</Label>
                  </div>
                </>
              )}

              {reportType === "task" && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="taskProgress"
                      checked={selectedSections.includes("taskProgress")}
                      onCheckedChange={() => toggleSection("taskProgress")}
                    />
                    <Label htmlFor="taskProgress">Progression des tâches</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="resourceAllocation"
                      checked={selectedSections.includes("resourceAllocation")}
                      onCheckedChange={() => toggleSection("resourceAllocation")}
                    />
                    <Label htmlFor="resourceAllocation">Allocation des ressources</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bottlenecks"
                      checked={selectedSections.includes("bottlenecks")}
                      onCheckedChange={() => toggleSection("bottlenecks")}
                    />
                    <Label htmlFor="bottlenecks">Goulets d'étranglement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="completionTrends"
                      checked={selectedSections.includes("completionTrends")}
                      onCheckedChange={() => toggleSection("completionTrends")}
                    />
                    <Label htmlFor="completionTrends">Tendances d'achèvement</Label>
                  </div>
                </>
              )}

              {reportType === "budget" && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="budgetOverview"
                      checked={selectedSections.includes("budgetOverview")}
                      onCheckedChange={() => toggleSection("budgetOverview")}
                    />
                    <Label htmlFor="budgetOverview">Aperçu du budget</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="costVariance"
                      checked={selectedSections.includes("costVariance")}
                      onCheckedChange={() => toggleSection("costVariance")}
                    />
                    <Label htmlFor="costVariance">Variance des coûts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="forecasting"
                      checked={selectedSections.includes("forecasting")}
                      onCheckedChange={() => toggleSection("forecasting")}
                    />
                    <Label htmlFor="forecasting">Prévisions budgétaires</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="departmentBreakdown"
                      checked={selectedSections.includes("departmentBreakdown")}
                      onCheckedChange={() => toggleSection("departmentBreakdown")}
                    />
                    <Label htmlFor="departmentBreakdown">Répartition par département</Label>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Format de sortie</h3>
            <Tabs 
              value={fileFormat} 
              onValueChange={setFileFormat}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="pdf" className="flex items-center gap-2">
                  <FilePdf className="h-4 w-4" />
                  <span>PDF</span>
                </TabsTrigger>
                <TabsTrigger value="excel" className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel</span>
                </TabsTrigger>
                <TabsTrigger value="powerbi" className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Power BI</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Réinitialiser</Button>
          <div className="flex gap-2">
            <Button 
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span>Programmer</span>
            </Button>
            <Button 
              onClick={handleGenerateReport}
              disabled={generating || selectedSections.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>{generating ? "Génération..." : "Générer"}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu du rapport</CardTitle>
          <CardDescription>
            Prévisualisation du rapport avant génération
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[550px] flex flex-col items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-300">
          {selectedSections.length === 0 ? (
            <div className="text-center text-gray-400">
              <FilePdf className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>Sélectionnez au moins une section</p>
              <p className="text-sm">pour voir l'aperçu</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="border-b border-gray-200 p-4 text-center">
                <h3 className="font-bold text-xl">
                  {reportType === "market" ? "Rapport des marchés" : 
                   reportType === "task" ? "Rapport des tâches" : 
                   "Rapport budgétaire"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {date.from && date.to ? (
                    `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
                  ) : (
                    "Période non spécifiée"
                  )}
                </p>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                {selectedSections.includes("statusSummary") && reportType === "market" && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Résumé des statuts</h4>
                    <div className="h-32 bg-gray-100 flex items-center justify-center rounded">
                      <p className="text-gray-400 text-sm">Graphique: Répartition des statuts</p>
                    </div>
                  </div>
                )}
                
                {selectedSections.includes("budgetAnalysis") && reportType === "market" && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Analyse budgétaire</h4>
                    <div className="h-32 bg-gray-100 flex items-center justify-center rounded">
                      <p className="text-gray-400 text-sm">Graphique: Analyse du budget</p>
                    </div>
                  </div>
                )}
                
                {selectedSections.includes("taskProgress") && reportType === "task" && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Progression des tâches</h4>
                    <div className="h-32 bg-gray-100 flex items-center justify-center rounded">
                      <p className="text-gray-400 text-sm">Graphique: Progression</p>
                    </div>
                  </div>
                )}
                
                {selectedSections.includes("budgetOverview") && reportType === "budget" && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Aperçu du budget</h4>
                    <div className="h-32 bg-gray-100 flex items-center justify-center rounded">
                      <p className="text-gray-400 text-sm">Graphique: Aperçu budgétaire</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            variant="ghost" 
            className="w-full text-primary"
            disabled={selectedSections.length === 0}
          >
            Rafraîchir l'aperçu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
