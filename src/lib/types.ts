
export type DocumentType = 
  | "pdf" 
  | "doc" 
  | "docx" 
  | "xls" 
  | "xlsx" 
  | "ppt" 
  | "pptx" 
  | "txt" 
  | "image" 
  | "other";

export type DocumentStatus = 
  | "draft" 
  | "pending" 
  | "approved" 
  | "rejected" 
  | "archived";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface DocumentVersion {
  id: string;
  number: number;
  createdAt: string;
  createdBy: User;
  downloadUrl: string;
  changeDescription?: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileType: DocumentType;
  fileSize: number;
  uploadedBy: User;
  uploadedAt: string;
  updatedAt: string;
  version: number;
  status: DocumentStatus;
  tags?: string[];
  thumbnailUrl?: string;
  downloadUrl: string;
  versions?: DocumentVersion[];
}

export interface Market {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  startDate: string;
  endDate: string;
  documents: Document[];
  assignedTo: User[];
}
