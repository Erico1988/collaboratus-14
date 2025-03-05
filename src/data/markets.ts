
import { Market } from "@/types/market";

export const markets: Market[] = [
  {
    id: "1",
    title: "Développement ProcureTrack",
    reference: "PROC-2024-001",
    description: "Développement d'une application de suivi des marchés publics",
    status: "in_progress",
    budget: 150000,
    startDate: "2024-01-15",
    endDate: "2024-07-30",
    deadline: "2024-07-30",
    riskLevel: "faible",
    createdAt: "2023-12-10",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Maintenance Infrastructure",
    reference: "PROC-2024-002",
    description: "Contrat de maintenance des infrastructures informatiques",
    status: "published",
    budget: 75000,
    startDate: "2024-04-01",
    endDate: "2025-03-31",
    deadline: "2025-03-31",
    riskLevel: "moyen",
    createdAt: "2024-02-15",
    updatedAt: "2024-03-10"
  },
  {
    id: "3",
    title: "Fourniture Équipements Bureautiques",
    reference: "PROC-2024-003",
    description: "Appel d'offres pour l'acquisition d'équipements bureautiques",
    status: "draft",
    budget: 50000,
    startDate: "2024-05-01",
    endDate: "2024-06-30",
    deadline: "2024-06-30",
    riskLevel: "faible",
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20"
  }
];
