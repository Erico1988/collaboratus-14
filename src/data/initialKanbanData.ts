
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
    tasks: [],
    roleAccess: ["developer", "manager"]
  },
  {
    id: "review",
    title: "En révision",
    tasks: [],
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
    tasks: [],
  },
];
