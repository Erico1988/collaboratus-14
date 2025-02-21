
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
}

export const FileUpload = ({ value, onChange }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange([...value, ...acceptedFiles]);
  }, [value, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted"}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? "Déposez les fichiers ici"
            : "Glissez-déposez des fichiers ici ou cliquez pour sélectionner"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, DOC, DOCX, PNG, JPG (max 10MB)
        </p>
      </div>

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"
            >
              <span className="truncate max-w-[200px]">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
