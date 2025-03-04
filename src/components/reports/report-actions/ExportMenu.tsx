
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadIcon, ChevronDownIcon, FileTextIcon, FileSpreadsheetIcon, BarChart2Icon, MailIcon, BookmarkIcon, ShareIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ExportMenuProps {
  disabled?: boolean;
}

export const ExportMenu = ({ disabled = false }: ExportMenuProps) => {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);

  const handleExport = (format: string) => {
    setExporting(true);
    
    // Simuler l'export
    setTimeout(() => {
      setExporting(false);
      toast({
        title: `Rapport exporté en ${format}`,
        description: "Le fichier a été téléchargé avec succès.",
      });
    }, 1500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || exporting}
          className="flex items-center gap-2"
        >
          <DownloadIcon className="h-4 w-4" />
          <span>{exporting ? "Exportation..." : "Exporter"}</span>
          <ChevronDownIcon className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Format de fichier</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("PDF")}>
          <FileTextIcon className="h-4 w-4 mr-2" />
          <span>PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("Excel")}>
          <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
          <span>Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("CSV")}>
          <FileTextIcon className="h-4 w-4 mr-2" />
          <span>CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("Power BI")}>
          <BarChart2Icon className="h-4 w-4 mr-2" />
          <span>Power BI</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast({
          title: "Envoi programmé",
          description: "Configuration de l'envoi automatique en cours de développement",
        })}>
          <MailIcon className="h-4 w-4 mr-2" />
          <span>Programmer un envoi</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast({
          title: "Rapport sauvegardé",
          description: "Vos paramètres de rapport ont été sauvegardés",
        })}>
          <BookmarkIcon className="h-4 w-4 mr-2" />
          <span>Sauvegarder le rapport</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast({
          title: "Lien de partage",
          description: "Le lien a été copié dans le presse-papier",
        })}>
          <ShareIcon className="h-4 w-4 mr-2" />
          <span>Partager le rapport</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
