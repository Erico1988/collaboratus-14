
export type MarketStatus = "en_cours" | "en_attente" | "termine";
export type RiskLevel = "faible" | "moyen" | "eleve";

export interface Market {
  id: string;
  title: string;
  status: MarketStatus;
  budget: number;
  deadline: string;
  riskLevel: RiskLevel;
}
