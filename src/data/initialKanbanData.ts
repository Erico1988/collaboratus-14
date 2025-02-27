
import { KanbanColumn, TaskStatus } from "@/types/task";

export const initialColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "À faire",
    tasks: [
      {
        id: "1",
        title: "Analyser les besoins",
        description: "Définir les spécifications détaillées du projet",
        status: "todo" as TaskStatus,
        priority: "high",
        dueDate: "2024-04-01",
        assigneeName: "Marie Durant",
        marketId: "1",
        marketTitle: "Développement ProcureTrack",
        createdAt: "2024-03-15",
        updatedAt: "2024-03-15",
        comments: [
          {
            id: "c1",
            taskId: "1",
            userId: "u1",
            userName: "Jean Martin",
            content: "N'oubliez pas d'inclure les spécifications techniques",
            createdAt: "2024-03-15",
            updatedAt: "2024-03-15"
          }
        ],
        attachments: ["spec.pdf"]
      },
      {
        id: "2",
        title: "Préparer l'appel d'offres",
        description: "Rédiger le cahier des charges",
        status: "todo" as TaskStatus,
        priority: "medium",
        dueDate: "2024-04-15",
        assigneeName: "Jean Martin",
        marketId: "1",
        marketTitle: "Développement ProcureTrack",
        createdAt: "2024-03-15",
        updatedAt: "2024-03-15",
        dependsOn: ["1"],
        isBlocked: true
      },
    ],
    automations: [
      {
        id: "auto1",
        trigger: "deadline_approaching",
        action: "send_notification",
        parameters: { days: 2 }
      }
    ]
  },
  {
    id: "in_progress",
    title: "En cours",
    tasks: [
      {
        id: "3",
        title: "Développement du backend",
        description: "Implémenter l'API REST",
        status: "in_progress" as TaskStatus,
        priority: "high",
        dueDate: "2024-05-01",
        assigneeName: "Thomas Dubois",
        marketId: "1",
        marketTitle: "Développement ProcureTrack",
        createdAt: "2024-03-20",
        updatedAt: "2024-03-20"
      }
    ],
    roleAccess: ["developer", "manager"]
  },
  {
    id: "review",
    title: "En révision",
    tasks: [
      {
        id: "4",
        title: "Revue de code",
        description: "Revue du code frontend",
        status: "review" as TaskStatus,
        priority: "medium",
        dueDate: "2024-04-20",
        assigneeName: "Sophie Martin",
        marketId: "1",
        marketTitle: "Développement ProcureTrack",
        createdAt: "2024-03-25",
        updatedAt: "2024-03-25"
      }
    ],
    automations: [
      {
        id: "auto2",
        trigger: "status_change",
        action: "change_status",
        parameters: { after: "48h", newStatus: "done" }
      }
    ]
  },
  {
    id: "done",
    title: "Terminé",
    tasks: [
      {
        id: "5",
        title: "Configuration initiale",
        description: "Mise en place de l'environnement de développement",
        status: "done" as TaskStatus,
        priority: "high",
        dueDate: "2024-03-10",
        assigneeName: "Pierre Dupont",
        marketId: "1",
        marketTitle: "Développement ProcureTrack",
        createdAt: "2024-03-01",
        updatedAt: "2024-03-10"
      }
    ],
  },
];
