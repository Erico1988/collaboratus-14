import React, { useState } from "react";
import { X, Download, Eye, ExternalLink, FileText, Image, FileSpreadsheet, File } from "lucide-react";
import { Document } from "@/lib/types";
import { formatFileSize } from "@/lib/data";
import Button from "../ui/button";

interface DocumentPreviewProps {
  document: Document;
  onClose: () => void;
}

const DocumentPreview = ({ document, onClose }: DocumentPreviewProps) => {
  const [loading, setLoading] = useState(true);

  const getFileIcon = () => {
    switch (document.fileType) {
      case "pdf":
        return <FileText className="h-16 w-16 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-16 w-16 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileSpreadsheet className="h-16 w-16 text-green-500" />;
      case "ppt":
      case "pptx":
        return <File className="h-16 w-16 text-orange-500" />;
      case "image":
        return <Image className="h-16 w-16 text-purple-500" />;
      default:
        return <FileText className="h-16 w-16 text-gray-500" />;
    }
  };

  const renderPreview = () => {
    // Simuler le chargement
    setTimeout(() => {
      setLoading(false);
    }, 1500);

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Chargement de la prévisualisation...</p>
        </div>
      );
    }
    
    if (document.fileType === "pdf") {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <iframe 
            src={document.downloadUrl + "#toolbar=0&navpanes=0"} 
            className="w-full h-full border-0"
            title={document.title}
          />
        </div>
      );
    } else if (document.fileType === "image") {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black/5 p-4">
          <img 
            src={document.thumbnailUrl || document.downloadUrl} 
            alt={document.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    } else {
      // Pour les autres types de fichiers, afficher un message
      return (
        <div className="flex flex-col items-center justify-center h-full p-10 bg-muted/30">
          {getFileIcon()}
          <h3 className="text-xl font-medium mt-4">{document.fileName}</h3>
          <p className="text-muted-foreground mt-2 mb-6 text-center">
            La prévisualisation n'est pas disponible pour ce type de fichier.
            <br />
            Téléchargez le document pour le consulter.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => window.open(document.downloadUrl, "_blank")}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button variant="outline" onClick={() => window.open(document.downloadUrl, "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ouvrir dans une nouvelle fenêtre
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-card border border-border rounded-lg shadow-lg overflow-hidden h-[90vh] flex flex-col animate-scale-in">
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center">
            <Eye className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-xl font-semibold truncate max-w-lg">{document.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open(document.downloadUrl, "_blank")}
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {renderPreview()}
        </div>
        
        <div className="p-3 border-t border-border flex justify-between items-center shrink-0 bg-muted/30 text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
              {document.fileName}
            </span>
            <span className="text-muted-foreground">
              {formatFileSize(document.fileSize)}
            </span>
            <span className="text-muted-foreground">
              Version {document.version}
            </span>
          </div>
          <div className="text-muted-foreground">
            Mis à jour {new Date(document.updatedAt).toLocaleDateString()} par {document.uploadedBy.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;