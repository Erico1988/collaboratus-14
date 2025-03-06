
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, File, AlertCircle, Mail, Scan, Folder } from "lucide-react";
import { Button } from "../ui/button";

interface DocumentUploadProps {
  onUpload?: (files: File[]) => void;
}

const DocumentUpload = ({ onUpload }: DocumentUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [error, setError] = useState<string | null>(null);
  const [showSourceOptions, setShowSourceOptions] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [directoryPath, setDirectoryPath] = useState("");

  // Liste des types de fichiers acceptés
  const acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'text/plain': ['.txt'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png']
  };

  // Taille maximale de fichier (10 MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  // Configuration de react-dropzone
  const { 
    getRootProps, 
    getInputProps, 
    isDragActive,
    isDragAccept,
    isDragReject 
  } = useDropzone({
    accept: acceptedFileTypes,
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles, rejectedFiles) => {
      handleFilesAdded(acceptedFiles);
      
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(file => {
          if (file.errors[0]?.code === 'file-too-large') {
            return `"${file.file.name}" dépasse la taille limite de 10 MB`;
          }
          if (file.errors[0]?.code === 'file-invalid-type') {
            return `"${file.file.name}" a un format non pris en charge`;
          }
          return `"${file.file.name}" a été rejeté`;
        });
        
        setError(errors.join(". "));
      } else {
        setError(null);
      }
    }
  });

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    // Ajouter les fichiers à la liste
    setFiles(prev => [...prev, ...newFiles]);
    
    // Initialiser la progression pour chaque fichier
    const newProgress = { ...uploadProgress };
    newFiles.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(newProgress);
    
    // Simuler le téléchargement des fichiers
    newFiles.forEach(file => {
      simulateFileUpload(file.name);
    });
    
    // Appeler la fonction onUpload du parent si elle existe
    if (onUpload) {
      onUpload(newFiles);
    }
  }, [onUpload, uploadProgress]);

  const simulateFileUpload = (fileName: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 1;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      setUploadProgress(prev => ({
        ...prev,
        [fileName]: progress
      }));
    }, 200);
  };

  const removeFile = useCallback((index: number) => {
    const fileToRemove = files[index];
    setFiles(prev => prev.filter((_, i) => i !== index));
    
    // Supprimer également les informations de progression
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileToRemove.name];
      return newProgress;
    });
  }, [files]);

  const handleSourceSelect = (source: string) => {
    setSelectedSource(source);
  };

  const handleImportFromSource = () => {
    if (selectedSource === 'email' && emailInput) {
      // Simuler l'importation à partir d'un e-mail
      setError(null);
      alert(`Importation à partir de l'adresse e-mail: ${emailInput} en cours...`);
      // Réinitialiser
      setEmailInput("");
      setSelectedSource(null);
      setShowSourceOptions(false);
    } else if (selectedSource === 'directory' && directoryPath) {
      // Simuler l'importation à partir d'un répertoire
      setError(null);
      alert(`Importation à partir du répertoire: ${directoryPath} en cours...`);
      // Réinitialiser
      setDirectoryPath("");
      setSelectedSource(null);
      setShowSourceOptions(false);
    } else if (selectedSource === 'scanner') {
      // Simuler l'importation à partir d'un scanner
      setError(null);
      alert("Connexion au scanner en cours...");
      // Réinitialiser
      setSelectedSource(null);
      setShowSourceOptions(false);
    }
  };

  const dropzoneClasses = `
    border-2 border-dashed rounded-lg p-8 text-center transition-all 
    ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/50'}
    ${isDragAccept ? 'border-green-500 bg-green-50/30' : ''}
    ${isDragReject ? 'border-red-500 bg-red-50/30' : ''}
  `;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Importer des documents</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowSourceOptions(!showSourceOptions)}
        >
          Autres sources <span className="ml-1">{showSourceOptions ? '▲' : '▼'}</span>
        </Button>
      </div>

      {showSourceOptions && (
        <div className="mb-6 bg-card rounded-lg border border-border p-4 animate-slide-down">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <button
              onClick={() => handleSourceSelect('email')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                selectedSource === 'email' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <Mail className="h-8 w-8 mb-2 text-primary" />
              <span>Email</span>
            </button>
            
            <button
              onClick={() => handleSourceSelect('directory')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                selectedSource === 'directory' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <Folder className="h-8 w-8 mb-2 text-primary" />
              <span>Répertoire</span>
            </button>
            
            <button
              onClick={() => handleSourceSelect('scanner')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                selectedSource === 'scanner' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <Scan className="h-8 w-8 mb-2 text-primary" />
              <span>Scanner</span>
            </button>
          </div>
          
          {selectedSource === 'email' && (
            <div className="mb-4 animate-fade-in">
              <label className="block text-sm font-medium mb-1">Adresse e-mail</label>
              <div className="flex">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="exemple@domaine.com"
                  className="flex-1 px-3 py-2 border border-input rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <Button onClick={handleImportFromSource} className="rounded-l-none">
                  Importer
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Les pièces jointes seront automatiquement importées
              </p>
            </div>
          )}
          
          {selectedSource === 'directory' && (
            <div className="mb-4 animate-fade-in">
              <label className="block text-sm font-medium mb-1">Chemin du répertoire</label>
              <div className="flex">
                <input
                  type="text"
                  value={directoryPath}
                  onChange={(e) => setDirectoryPath(e.target.value)}
                  placeholder="/chemin/vers/dossier"
                  className="flex-1 px-3 py-2 border border-input rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <Button onClick={handleImportFromSource} className="rounded-l-none">
                  Importer
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tous les fichiers du répertoire seront importés
              </p>
            </div>
          )}
          
          {selectedSource === 'scanner' && (
            <div className="mb-4 animate-fade-in">
              <p className="mb-2">Sélectionnez un scanner pour commencer la numérisation</p>
              <Button onClick={handleImportFromSource}>
                Connecter au scanner
              </Button>
            </div>
          )}
        </div>
      )}

      <div
        {...getRootProps()}
        className={dropzoneClasses}
      >
        <input {...getInputProps()} />
        <div className="mx-auto flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
            <Upload className="h-8 w-8" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">
            {isDragActive 
              ? "Déposez vos fichiers ici..." 
              : "Glissez-déposez vos fichiers ici"}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-6">
            ou cliquez pour parcourir vos fichiers
          </p>
          
          <Button variant="outline" className="cursor-pointer">
            Parcourir
          </Button>
          
          <p className="text-xs text-muted-foreground mt-4">
            Formats acceptés : PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Taille maximum : 10 MB par fichier
          </p>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {files.length > 0 && (
        <div className="mt-6 animate-slide-up">
          <h4 className="text-sm font-medium mb-3">Fichiers sélectionnés ({files.length})</h4>
          <div className="space-y-3">
            {files.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex flex-col p-3 bg-card border border-border rounded-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <File className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-accent rounded-full"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${uploadProgress[file.name] || 0}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {uploadProgress[file.name] === 100 ? 'Téléversé' : 'Téléversement...'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {uploadProgress[file.name] || 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button>
              Finaliser l'importation ({files.length} fichier{files.length > 1 ? "s" : ""})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
