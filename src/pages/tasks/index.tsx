
import { MainLayout } from "@/components/layout/MainLayout";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { GanttChart } from "@/components/tasks/GanttChart";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { Task } from "@/types/task";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Données du projet ProcureTrack
const procureTrackTasks: Task[] = [
  // Phase 1: Planification
  {
    id: "1.1",
    title: "Analyse des besoins",
    description: "Identification et documentation des besoins des utilisateurs",
    status: "done",
    priority: "high",
    dueDate: "2024-03-15",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
    assigneeName: "Sophie Martin"
  },
  {
    id: "1.2",
    title: "Définition des fonctionnalités clés",
    description: "Spécification détaillée des features principales",
    status: "done",
    priority: "high",
    dueDate: "2024-03-20",
    dependsOn: ["1.1"],
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15",
    assigneeName: "Thomas Dubois"
  },
  {
    id: "1.3",
    title: "Étude de faisabilité",
    description: "Analyse technique et économique du projet",
    status: "in_progress",
    priority: "high",
    dueDate: "2024-03-25",
    dependsOn: ["1.2"],
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20",
    assigneeName: "Marie Lambert"
  },
  // Phase 2: Conception
  {
    id: "2.1",
    title: "Architecture back-end NestJS/GraphQL",
    description: "Conception de l'architecture technique",
    status: "todo",
    priority: "urgent",
    dueDate: "2024-04-10",
    dependsOn: ["1.3"],
    createdAt: "2024-03-25",
    updatedAt: "2024-03-25",
    assigneeName: "Lucas Bernard"
  },
  {
    id: "2.2",
    title: "Design UI/UX TailwindCSS",
    description: "Création des maquettes et du design system",
    status: "todo",
    priority: "high",
    dueDate: "2024-04-15",
    dependsOn: ["1.3"],
    createdAt: "2024-03-25",
    updatedAt: "2024-03-25",
    assigneeName: "Julie Chen"
  },
  {
    id: "2.3",
    title: "Définition workflows BPMN",
    description: "Modélisation des processus métier",
    status: "todo",
    priority: "medium",
    dueDate: "2024-04-20",
    dependsOn: ["2.1"],
    createdAt: "2024-03-25",
    updatedAt: "2024-03-25",
    assigneeName: "Alexandre Petit"
  },
  // Phase 3: Développement
  {
    id: "3.1",
    title: "Modules front-end Next.js",
    description: "Développement des composants React",
    status: "todo",
    priority: "urgent",
    dueDate: "2024-05-15",
    dependsOn: ["2.2"],
    createdAt: "2024-04-15",
    updatedAt: "2024-04-15",
    assigneeName: "Sarah Wong"
  },
  {
    id: "3.2",
    title: "API GraphQL",
    description: "Implémentation des resolvers et mutations",
    status: "todo",
    priority: "urgent",
    dueDate: "2024-05-20",
    dependsOn: ["2.1", "2.3"],
    createdAt: "2024-04-20",
    updatedAt: "2024-04-20",
    assigneeName: "Lucas Bernard"
  },
  {
    id: "3.3",
    title: "Implémentation GED",
    description: "Système de gestion électronique des documents",
    status: "todo",
    priority: "high",
    dueDate: "2024-05-25",
    dependsOn: ["3.1", "3.2"],
    createdAt: "2024-05-01",
    updatedAt: "2024-05-01",
    assigneeName: "Pierre Dupont"
  },
  {
    id: "3.4",
    title: "Système de permissions",
    description: "Implémentation du contrôle d'accès RBAC",
    status: "todo",
    priority: "high",
    dueDate: "2024-05-30",
    dependsOn: ["3.2"],
    createdAt: "2024-05-01",
    updatedAt: "2024-05-01",
    assigneeName: "Marie Lambert"
  },
  // Phase 4: Tests & Sécurité
  {
    id: "4.1",
    title: "Tests unitaires et d'intégration",
    description: "Implémentation des suites de tests",
    status: "todo",
    priority: "high",
    dueDate: "2024-06-15",
    dependsOn: ["3.3", "3.4"],
    createdAt: "2024-05-30",
    updatedAt: "2024-05-30",
    assigneeName: "Thomas Dubois"
  },
  {
    id: "4.2",
    title: "Audit de sécurité OAuth2",
    description: "Audit et renforcement de la sécurité",
    status: "todo",
    priority: "urgent",
    dueDate: "2024-06-20",
    dependsOn: ["4.1"],
    createdAt: "2024-06-15",
    updatedAt: "2024-06-15",
    assigneeName: "Sophie Martin"
  },
  {
    id: "4.3",
    title: "Optimisation des performances",
    description: "Tests de charge et optimisations",
    status: "todo",
    priority: "medium",
    dueDate: "2024-06-25",
    dependsOn: ["4.1"],
    createdAt: "2024-06-15",
    updatedAt: "2024-06-15",
    assigneeName: "Lucas Bernard"
  },
  // Phase 5: Déploiement & Scalabilité
  {
    id: "5.1",
    title: "Configuration Docker/Kubernetes",
    description: "Mise en place de l'infrastructure cloud",
    status: "todo",
    priority: "urgent",
    dueDate: "2024-07-10",
    dependsOn: ["4.2", "4.3"],
    createdAt: "2024-06-25",
    updatedAt: "2024-06-25",
    assigneeName: "Alexandre Petit"
  },
  {
    id: "5.2",
    title: "Intégration CI/CD",
    description: "Pipeline de déploiement continu",
    status: "todo",
    priority: "high",
    dueDate: "2024-07-15",
    dependsOn: ["5.1"],
    createdAt: "2024-07-10",
    updatedAt: "2024-07-10",
    assigneeName: "Sarah Wong"
  },
  {
    id: "5.3",
    title: "Monitoring Datadog/Sentry",
    description: "Configuration du monitoring",
    status: "todo",
    priority: "medium",
    dueDate: "2024-07-20",
    dependsOn: ["5.2"],
    createdAt: "2024-07-15",
    updatedAt: "2024-07-15",
    assigneeName: "Pierre Dupont"
  },
  // Phase 6: Adoption & Amélioration
  {
    id: "6.1",
    title: "Formation des utilisateurs",
    description: "Sessions de formation et documentation",
    status: "todo",
    priority: "high",
    dueDate: "2024-08-10",
    dependsOn: ["5.3"],
    createdAt: "2024-07-20",
    updatedAt: "2024-07-20",
    assigneeName: "Julie Chen"
  },
  {
    id: "6.2",
    title: "Analyse des feedbacks",
    description: "Collecte et analyse des retours utilisateurs",
    status: "todo",
    priority: "medium",
    dueDate: "2024-08-20",
    dependsOn: ["6.1"],
    createdAt: "2024-08-10",
    updatedAt: "2024-08-10",
    assigneeName: "Thomas Dubois"
  },
  {
    id: "6.3",
    title: "Itérations UX/UI",
    description: "Améliorations basées sur les feedbacks",
    status: "todo",
    priority: "medium",
    dueDate: "2024-08-30",
    dependsOn: ["6.2"],
    createdAt: "2024-08-20",
    updatedAt: "2024-08-20",
    assigneeName: "Julie Chen"
  }
];

const TasksPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">ProcureTrack - Planning</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Tâche
          </Button>
        </div>

        <Tabs defaultValue="gantt" className="space-y-4">
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="gantt">Gantt</TabsTrigger>
          </TabsList>
          <TabsContent value="kanban">
            <KanbanBoard />
          </TabsContent>
          <TabsContent value="gantt">
            <GanttChart tasks={procureTrackTasks} />
          </TabsContent>
        </Tabs>

        <TaskDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </MainLayout>
  );
};

export default TasksPage;
