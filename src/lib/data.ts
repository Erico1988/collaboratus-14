
import { Document, Market, User } from "./types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Thomas Martin",
    email: "thomas.martin@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "Admin"
  },
  {
    id: "user-2",
    name: "Sophie Bernard",
    email: "sophie.bernard@example.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    role: "Manager"
  },
  {
    id: "user-3",
    name: "Lucas Dubois",
    email: "lucas.dubois@example.com",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    role: "User"
  }
];

export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    title: "Appel d'offres - Construction École",
    description: "Document d'appel d'offres pour le projet de construction d'une école primaire",
    fileName: "appel-offres-ecole-2023.pdf",
    fileType: "pdf",
    fileSize: 2456789,
    uploadedBy: mockUsers[0],
    uploadedAt: "2023-09-15T10:30:00Z",
    updatedAt: "2023-09-15T10:30:00Z",
    version: 1,
    status: "approved",
    tags: ["appel d'offres", "construction", "école"],
    thumbnailUrl: "/placeholder.svg",
    downloadUrl: "#"
  },
  {
    id: "doc-2",
    title: "Cahier des charges - Système informatique",
    description: "Spécifications techniques pour l'installation d'un nouveau système informatique",
    fileName: "cahier-charges-si-2023.docx",
    fileType: "docx",
    fileSize: 1356789,
    uploadedBy: mockUsers[1],
    uploadedAt: "2023-09-10T14:45:00Z",
    updatedAt: "2023-09-12T09:15:00Z",
    version: 2,
    status: "pending",
    tags: ["cahier des charges", "informatique", "technique"],
    thumbnailUrl: "/placeholder.svg",
    downloadUrl: "#"
  },
  {
    id: "doc-3",
    title: "Contrat de maintenance - Ascenseurs",
    description: "Contrat de maintenance pour les ascenseurs des bâtiments administratifs",
    fileName: "contrat-maintenance-ascenseurs.pdf",
    fileType: "pdf",
    fileSize: 3256789,
    uploadedBy: mockUsers[2],
    uploadedAt: "2023-09-05T11:20:00Z",
    updatedAt: "2023-09-05T11:20:00Z",
    version: 1,
    status: "approved",
    tags: ["contrat", "maintenance", "ascenseurs"],
    thumbnailUrl: "/placeholder.svg",
    downloadUrl: "#"
  },
  {
    id: "doc-4",
    title: "Budget prévisionnel 2024",
    description: "Budget prévisionnel pour les marchés publics de l'année 2024",
    fileName: "budget-previsionnel-2024.xlsx",
    fileType: "xlsx",
    fileSize: 856789,
    uploadedBy: mockUsers[0],
    uploadedAt: "2023-09-01T09:00:00Z",
    updatedAt: "2023-09-02T15:30:00Z",
    version: 3,
    status: "draft",
    tags: ["budget", "prévisionnel", "finance"],
    thumbnailUrl: "/placeholder.svg",
    downloadUrl: "#"
  },
  {
    id: "doc-5",
    title: "Rapport d'analyse des offres",
    description: "Analyse comparative des offres reçues pour le projet de rénovation",
    fileName: "rapport-analyse-offres.pptx",
    fileType: "pptx",
    fileSize: 4567890,
    uploadedBy: mockUsers[1],
    uploadedAt: "2023-08-28T16:15:00Z",
    updatedAt: "2023-08-29T10:45:00Z",
    version: 2,
    status: "approved",
    tags: ["rapport", "analyse", "offres"],
    thumbnailUrl: "/placeholder.svg",
    downloadUrl: "#"
  },
  {
    id: "doc-6",
    title: "Plan architectural - Extension Mairie",
    description: "Plans architecturaux pour le projet d'extension de la mairie",
    fileName: "plan-architectural-mairie.pdf",
    fileType: "pdf",
    fileSize: 12567890,
    uploadedBy: mockUsers[2],
    uploadedAt: "2023-08-25T11:30:00Z",
    updatedAt: "2023-08-25T11:30:00Z",
    version: 1,
    status: "pending",
    tags: ["plan", "architectural", "mairie"],
    thumbnailUrl: "/placeholder.svg",
    downloadUrl: "#"
  }
];

export const mockMarkets: Market[] = [
  {
    id: "market-1",
    title: "Construction École Primaire",
    description: "Projet de construction d'une nouvelle école primaire dans le quartier Est",
    status: "En cours",
    budget: 2500000,
    startDate: "2023-03-15T00:00:00Z",
    endDate: "2024-06-30T00:00:00Z",
    documents: [mockDocuments[0], mockDocuments[4]],
    assignedTo: [mockUsers[0], mockUsers[1]]
  },
  {
    id: "market-2",
    title: "Modernisation Système Informatique",
    description: "Mise à niveau complète des systèmes informatiques de l'administration",
    status: "Planification",
    budget: 850000,
    startDate: "2023-10-01T00:00:00Z",
    endDate: "2024-04-30T00:00:00Z",
    documents: [mockDocuments[1]],
    assignedTo: [mockUsers[1]]
  },
  {
    id: "market-3",
    title: "Maintenance Ascenseurs",
    description: "Contrat de maintenance pour tous les ascenseurs des bâtiments publics",
    status: "Actif",
    budget: 125000,
    startDate: "2023-01-01T00:00:00Z",
    endDate: "2025-12-31T00:00:00Z",
    documents: [mockDocuments[2]],
    assignedTo: [mockUsers[2]]
  },
  {
    id: "market-4",
    title: "Extension Bâtiment Mairie",
    description: "Construction d'une extension pour les nouveaux services administratifs",
    status: "Appel d'offres",
    budget: 1750000,
    startDate: "2023-11-15T00:00:00Z",
    endDate: "2025-05-30T00:00:00Z",
    documents: [mockDocuments[5]],
    assignedTo: [mockUsers[0], mockUsers[2]]
  }
];

// Helper functions to work with the mock data
export const getDocumentFileIcon = (fileType: string) => {
  switch (fileType) {
    case "pdf":
      return "file-text";
    case "doc":
    case "docx":
      return "file-text";
    case "xls":
    case "xlsx":
      return "file-spreadsheet";
    case "ppt":
    case "pptx":
      return "file-presentation";
    case "txt":
      return "file-text";
    case "image":
      return "image";
    default:
      return "file";
  }
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-gray-200 text-gray-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "archived":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
