
import React from "react";
import { Document } from "@/lib/types";
import DocumentCard from "./DocumentCard";

interface DocumentListProps {
  documents: Document[];
}

const DocumentList = ({ documents }: DocumentListProps) => {
  if (!documents.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-muted-foreground"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
        <h3 className="text-lg font-medium">Aucun document trouvé</h3>
        <p className="text-muted-foreground mt-2">
          Importez vos premiers documents ou modifiez vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {documents.map((document) => (
        <DocumentCard 
          key={document.id} 
          document={document} 
        />
      ))}
    </div>
  );
};

export default DocumentList;
