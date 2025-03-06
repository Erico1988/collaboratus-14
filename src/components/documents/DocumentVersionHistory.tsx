
import React, { useState } from "react";
import { History, ArrowLeft, ArrowRight, Download, RotateCcw, Clock, FileText, User, Check } from "lucide-react";
import { Document, DocumentVersion } from "@/lib/types";
import { formatFileSize } from "@/lib/data";
import Button from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface DocumentVersionHistoryProps {
  document: Document;
  onClose: () => void;
  onRestore?: (versionId: string) => void;
}

const DocumentVersionHistory = ({ document, onClose, onRestore }: DocumentVersionHistoryProps) => {
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersion, setCompareVersion] = useState<DocumentVersion | null>(null);

  // Générer des versions fictives si le document n'en a pas
  const versions = document.versions || [
    {
      id: `${document.id}-v${document.version}`,
      number: document.version,
      createdAt: document.updatedAt,
      createdBy: document.uploadedBy,
      downloadUrl: document.downloadUrl,
      changeDescription: "Version actuelle"
    },
    {
      id: `${document.id}-v${document.version-1}`,
      number: document.version - 1,
      createdAt: new Date(new Date(document.updatedAt).getTime() - 86400000 * 2).toISOString(), // 2 jours avant
      createdBy: document.uploadedBy,
      downloadUrl: "#",
      changeDescription: "Mise à jour des détails techniques"
    },
    {
      id: `${document.id}-v${document.version-2}`,
      number: document.version - 2,
      createdAt: new Date(new Date(document.updatedAt).getTime() - 86400000 * 5).toISOString(), // 5 jours avant
      createdBy: document.uploadedBy,
      downloadUrl: "#",
      changeDescription: "Version initiale"
    }
  ];

  // Trier les versions par numéro décroissant
  const sortedVersions = [...versions].sort((a, b) => b.number - a.number);
  
  // Gestion de la restauration d'une version
  const handleRestore = (version: DocumentVersion) => {
    if (onRestore && version.number !== document.version) {
      onRestore(version.id);
    }
  };

  // Basculer en mode comparaison
  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    setCompareVersion(null);
  };

  // Sélectionner une version pour la comparaison
  const handleSelectCompareVersion = (version: DocumentVersion) => {
    if (compareMode && selectedVersion && version.id !== selectedVersion.id) {
      setCompareVersion(version);
    } else {
      setSelectedVersion(version);
      if (compareMode) {
        setCompareVersion(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-card border border-border rounded-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col animate-scale-in">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center">
            <History className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-xl font-semibold">Historique des versions</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={toggleCompareMode}>
              {compareMode ? "Annuler la comparaison" : "Comparer des versions"}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Liste des versions */}
          <div className="w-1/3 border-r border-border overflow-y-auto">
            <div className="p-3 bg-muted/50">
              <h3 className="text-sm font-medium">Versions du document</h3>
              <p className="text-xs text-muted-foreground mt-1">{document.title}</p>
            </div>
            
            <ul className="divide-y divide-border">
              {sortedVersions.map((version) => (
                <li 
                  key={version.id}
                  className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
                    selectedVersion?.id === version.id ? 'bg-accent/70' : ''
                  } ${
                    compareVersion?.id === version.id ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => handleSelectCompareVersion(version)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">v{version.number}</span>
                      {version.number === document.version && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                          Actuelle
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                    {version.changeDescription || "Aucune description"}
                  </p>
                  
                  <div className="flex items-center text-xs mt-1">
                    <User className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">{version.createdBy.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Détails de la version sélectionnée */}
          <div className="flex-1 overflow-y-auto p-4">
            {!selectedVersion ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Sélectionnez une version</h3>
                <p className="text-muted-foreground max-w-md">
                  Choisissez une version dans la liste pour visualiser ses détails ou la restaurer.
                </p>
              </div>
            ) : compareMode && compareVersion ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Comparaison des versions</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-border rounded-md p-4">
                    <div className="mb-2 flex items-center">
                      <span className="font-medium">Version {selectedVersion.number}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({new Date(selectedVersion.createdAt).toLocaleDateString()})
                      </span>
                    </div>
                    
                    <div className="aspect-video bg-muted flex items-center justify-center rounded-md mb-3">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    
                    <p className="text-sm mb-2">{selectedVersion.changeDescription || "Aucune description"}</p>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Download className="h-4 w-4 mr-1" /> Télécharger
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-md p-4">
                    <div className="mb-2 flex items-center">
                      <span className="font-medium">Version {compareVersion.number}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({new Date(compareVersion.createdAt).toLocaleDateString()})
                      </span>
                    </div>
                    
                    <div className="aspect-video bg-muted flex items-center justify-center rounded-md mb-3">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    
                    <p className="text-sm mb-2">{compareVersion.changeDescription || "Aucune description"}</p>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Download className="h-4 w-4 mr-1" /> Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-muted/50 p-4 rounded-md">
                  <h4 className="font-medium text-sm mb-3">Différences détectées</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-red-500 font-medium mr-2">-</span>
                      <span>Section 3.2: Changement des spécifications techniques</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 font-medium mr-2">+</span>
                      <span>Section 4.1: Ajout d'informations sur le budget</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 font-medium mr-2">~</span>
                      <span>Multiples corrections de mise en forme et fautes d'orthographe</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-end mt-4 space-x-3">
                  <Button variant="outline" onClick={() => setCompareVersion(null)}>
                    Annuler la comparaison
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      Version {selectedVersion.number}
                      {selectedVersion.number === document.version && (
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          Version actuelle
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Créée le {new Date(selectedVersion.createdAt).toLocaleDateString()} par {selectedVersion.createdBy.name}
                    </p>
                  </div>
                  
                  {selectedVersion.number !== document.version && (
                    <Button onClick={() => handleRestore(selectedVersion)}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restaurer cette version
                    </Button>
                  )}
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <h4 className="font-medium mb-2">Modifications</h4>
                  <p>{selectedVersion.changeDescription || "Aucune description fournie pour cette version."}</p>
                </div>
                
                <div className="border border-border rounded-lg overflow-hidden mb-6">
                  <div className="bg-muted/50 p-3 flex items-center justify-between border-b border-border">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">{document.fileName}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatFileSize(document.fileSize)}</span>
                  </div>
                  
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {/* Prévisualisation du document, simplement un placeholder ici */}
                    <div className="text-center p-6">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Prévisualisation non disponible</p>
                      <p className="text-xs text-muted-foreground mt-1">Téléchargez le document pour le visualiser</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex space-x-3">
                    {selectedVersion.number < sortedVersions[0].number && (
                      <Button variant="outline" size="sm" onClick={() => {
                        const nextIndex = sortedVersions.findIndex(v => v.id === selectedVersion.id) - 1;
                        if (nextIndex >= 0) {
                          setSelectedVersion(sortedVersions[nextIndex]);
                        }
                      }}>
                        <ArrowLeft className="h-4 w-4 mr-1" /> Version suivante
                      </Button>
                    )}
                    
                    {selectedVersion.number > sortedVersions[sortedVersions.length - 1].number && (
                      <Button variant="outline" size="sm" onClick={() => {
                        const prevIndex = sortedVersions.findIndex(v => v.id === selectedVersion.id) + 1;
                        if (prevIndex < sortedVersions.length) {
                          setSelectedVersion(sortedVersions[prevIndex]);
                        }
                      }}>
                        <ArrowRight className="h-4 w-4 mr-1" /> Version précédente
                      </Button>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Télécharger cette version
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentVersionHistory;
