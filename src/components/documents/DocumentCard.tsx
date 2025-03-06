
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Document } from "@/lib/types";
import { formatFileSize, getDocumentFileIcon, getStatusColor } from "@/lib/data";
import { File, Download, MoreHorizontal, History, ExternalLink, Edit, Trash2, Eye } from "lucide-react";
import Button from "../ui/button";
import DocumentVersionHistory from "./DocumentVersionHistory";
import DocumentPreview from "./DocumentPreview";

interface DocumentCardProps {
  document: Document;
  className?: string;
}

const DocumentCard = ({ document, className }: DocumentCardProps) => {
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const FileIcon = () => {
    const iconName = getDocumentFileIcon(document.fileType);
    if (iconName === "file-text") return <File className="w-6 h-6" />;
    if (iconName === "file-spreadsheet") return <File className="w-6 h-6" />;
    if (iconName === "file-presentation") return <File className="w-6 h-6" />;
    if (iconName === "image") return <File className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleVersionHistoryClick = () => {
    setShowMenu(false);
    setShowVersionHistory(true);
  };

  const handlePreviewClick = () => {
    setShowMenu(false);
    setShowPreview(true);
  };

  const handleRestoreVersion = (versionId: string) => {
    // Dans une implémentation réelle, nous enverrions une requête au backend
    // pour restaurer cette version
    console.log("Restauration de la version :", versionId);
    alert(`Version ${versionId} restaurée avec succès.`);
    setShowVersionHistory(false);
  };

  return (
    <>
      <div 
        className={cn(
          "group flex flex-col bg-card border border-border rounded-lg overflow-hidden transition-all hover:shadow-md hover:border-primary/20 cursor-pointer",
          className
        )}
        onClick={handlePreviewClick}
      >
        <div className="flex p-4 border-b border-border">
          <div className="shrink-0 w-10 h-10 rounded-md flex items-center justify-center bg-primary/10 text-primary">
            <FileIcon />
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium truncate pr-2">{document.title}</h3>
              <div className="flex shrink-0 ml-2 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={toggleMenu}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] bg-card border border-border rounded-md shadow-md py-1 animate-fade-in">
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewClick();
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                      Prévisualiser
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(document.downloadUrl, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                      Ouvrir
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(document.downloadUrl, '_blank');
                      }}
                    >
                      <Download className="h-4 w-4 mr-2 text-muted-foreground" />
                      Télécharger
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVersionHistoryClick();
                      }}
                    >
                      <History className="h-4 w-4 mr-2 text-muted-foreground" />
                      Historique des versions
                    </button>
                    <hr className="my-1 border-border" />
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
                      Modifier
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center text-red-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground truncate">{document.description}</p>
          </div>
        </div>
        
        <div className="flex items-center px-4 py-2 text-xs text-muted-foreground">
          <span>{document.fileType.toUpperCase()}</span>
          <span className="mx-2">•</span>
          <span>{formatFileSize(document.fileSize)}</span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <History className="h-3 w-3 mr-1" />
            v{document.version}
          </span>
        </div>
        
        <div className="flex-1 px-4 py-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {document.tags?.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-6 w-6 rounded-full overflow-hidden bg-muted">
                <img 
                  src={document.uploadedBy.avatar || "/placeholder.svg"} 
                  alt={document.uploadedBy.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="ml-2 text-xs">{document.uploadedBy.name}</span>
            </div>
            
            <span 
              className={cn(
                "text-xs px-2 py-1 rounded-full",
                getStatusColor(document.status)
              )}
            >
              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="border-t border-border p-2 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleVersionHistoryClick();
            }}
          >
            <History className="w-4 h-4 mr-2" />
            Versions
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              window.open(document.downloadUrl, '_blank');
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
        </div>
      </div>
      
      {showVersionHistory && (
        <DocumentVersionHistory 
          document={document} 
          onClose={() => setShowVersionHistory(false)}
          onRestore={handleRestoreVersion}
        />
      )}

      {showPreview && (
        <DocumentPreview
          document={document}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

export default DocumentCard;
