export type MarketStatus = 'en_cours' | 'en_attente' | 'termine' | 'annule' | 'brouillon';
export type RiskLevel = 'faible' | 'moyen' | 'eleve';

export interface Market {
  id: string;
  title: string;
  description?: string;
  status: MarketStatus;
  budget: number;
  deadline: string;
  riskLevel: RiskLevel;
  createdAt?: string;
  updatedAt?: string;
  department?: string;
  contactName?: string;
  contactEmail?: string;
  documents?: string[];
  tags?: string[];
}

export interface MarketFilter {
  searchTerm?: string;
  status?: MarketStatus | 'tous';
  minBudget?: number;
  maxBudget?: number;
  dateRange?: {
    start?: string;
    end?: string;
  };
  riskLevel?: RiskLevel[];
  department?: string[];
  tags?: string[];
}