import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  FileCheck, 
  Send, 
  ArrowRight,
  FileText,
  Users,
  Calendar,
  CheckCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Market } from "@/types/market";
import { Progress } from "@/components/ui/progress";

interface MarketWorkflowProps {
  market: Market;
}

// Workflow steps based on market status
const getWorkflowSteps = (status: string) => {
  const baseSteps = [
    { 
      id: "draft", 
      name: "Brouillon", 
      description: "Création et édition du marché", 
      status: "completed", 
      date: "15/01/2024",
      icon: FileText
    },
    { 
      id: "validation", 
      name: "Validation interne", 
      description: "Validation par le service juridique", 
      status: status === "brouillon" ? "pending" : "completed", 
      date: status === "br ouillon" ? null : "22/01/2024",
      icon: UserCheck
    },
    { 
      id: "publication", 
      name: "Publication", 
      description: "Publication de l'appel d'offres", 
      status: ["brouillon", "en_attente"].includes(status) ? "pending" : "completed", 
      date: ["brouillon", "en_attente"].includes(status) ? null : "01/02/2024",
      icon: Send
    },
    { 
      id: "reception", 
      name: "Réception des offres", 
      description: "Réception et analyse des offres", 
      status: status === "en_cours" ? "active" : (["termine", "annule"].includes(status) ? "completed" : "pending"), 
      date: status === "en_cours" ? "15/03/2024" : (status === "termine" ? "15/03/2024" : null),
      icon: FileCheck
    },
    { 
      id: "attribution", 
      name: "Attribution", 
      description: "Sélection du prestataire et notification", 
      status: status === "termine" ? "completed" : "pending", 
      date: status === "termine" ? "01/04/2024" : null,
      icon: Users
    },
    { 
      id: "execution", 
      name: "Exécution", 
      description: "Suivi de l'exécution du marché", 
      status: status === "termine" ? "completed" : "pending", 
      date: status === "termine" ? "10/05/2024" : null,
      icon: Clock
    },
    { 
      id: "closure", 
      name: "Clôture", 
      description: "Clôture administrative du marché", 
      status: status === "termine" ? "completed" : "pending", 
      date: status === "termine" ? "15/05/2024" : null,
      icon: CheckCheck
    }
  ];

  // Add a cancelled step if the market is cancelled
  if (status === "annule") {
    return [
      ...baseSteps.slice(0, 3), // Keep only the first three steps
      { 
        id: "cancelled", 
        name: "Marché annulé", 
        description: "Le marché a été annulé", 
        status: "cancelled", 
        date: "05/02/2024",
        icon: AlertTriangle
      }
    ];
  }

  return baseSteps;
};

export const MarketWorkflow = ({ market }: MarketWorkflowProps) => {
  const { toast } = useToast();
  const [workflowSteps, setWorkflowSteps] = useState(getWorkflowSteps(market.status));
  
  const getStepStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "active":
        return "bg-blue-500";
      case "pending":
        return "bg-gray-300";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStepStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "active":
        return "En cours";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  };

  const handleAdvanceWorkflow = () => {
    // Find the first pending step
    const pendingStepIndex = workflowSteps.findIndex(step => step.status === "pending");
    
    if (pendingStepIndex !== -1) {
      const newSteps = [...workflowSteps];
      
      // If there's an active step, mark it as completed
      const activeStepIndex = newSteps.findIndex(step => step.status === "active");
      if (activeStepIndex !== -1) {
        newSteps[activeStepIndex].status = "completed";
        newSteps[activeStepIndex].date = new Date().toLocaleDateString("fr-FR");
      }
      
      // Mark the pending step as active
      newSteps[pendingStepIndex].status = "active";
      
      setWorkflowSteps(newSteps);
      
      toast({
        title: "Workflow mis à jour",
        description: `Étape "${newSteps[pendingStepIndex].name}" activée.`
      });
    }
  };

  // Calculate workflow progress
  const calculateProgress = () => {
    const totalSteps = workflowSteps.length;
    const completedSteps = workflowSteps.filter(step => step.status === "completed").length;
    return Math.round((completedSteps / totalSteps) * 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Workflow du marché</h3>
        <Button 
          onClick={handleAdvanceWorkflow}
          disabled={!workflowSteps.some(step => step.status === "pending") || market.status === "annule" || market.status === "termine"}
        >
          Avancer le workflow
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex justify-between items-center">
            <span>Progression du marché</span>
            <Badge className="ml-2">{calculateProgress()}%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={calculateProgress()} className="h-2 mb-6" />
          
          <div className="space-y-6">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connector line */}
                {index < workflowSteps.length - 1 && (
                  <div 
                    className={`absolute left-5 top-10 h-full w-0.5 ${
                      step.status === "completed" ? "bg-green-500" : "bg-gray-200"
                    }`}
                    style={{ height: "calc(100% - 2rem)" }}
                  />
                )}
                
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${getStepStatusColor(step.status)}`}>
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{step.name}</h4>
                      <Badge className={getStepStatusColor(step.status)}>
                        {getStepStatusLabel(step.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                    {step.date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.status === "active" ? "Démarré le " : "Complété le "} 
                        {step.date}
                      </p>
                    )}
                    
                    {/* Additional actions for specific steps */}
                    {step.id === "validation" && step.status === "active" && (
                      <div className="mt-2">
                        <Button variant="outline" size="sm" className="mr-2">
                          <UserCheck className="mr-2 h-4 w-4" />
                          Demander validation
                        </Button>
                      </div>
                    )}
                    
                    {step.id === "publication" && step.status === "active" && (
                      <div className="mt-2">
                        <Button variant="outline" size="sm" className="mr-2">
                          <Calendar className="mr-2 h-4 w-4" />
                          Planifier publication
                        </Button>
                      </div>
                    )}
                    
                    {step.id === "reception" && step.status === "active" && (
                      <div className="mt-2">
                        <Button variant="outline" size="sm" className="mr-2">
                          <FileText className="mr-2 h-4 w-4" />
                          Ajouter une offre
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};