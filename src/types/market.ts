
export type MarketStatus = 'draft' | 'published' | 'in_progress' | 'awarded' | 'completed' | 'cancelled' | 'en_cours' | 'en_attente' | 'termine';
export type RiskLevel = "faible" | "moyen" | "eleve";

export interface Market {
  id: string;
  title: string;
  reference: string;
  description: string;
  status: MarketStatus;
  budget: number;
  startDate: string;
  endDate: string;
  deadline: string;
  riskLevel: RiskLevel;
  createdAt: string;
  updatedAt: string;
}
