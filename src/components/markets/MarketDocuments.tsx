import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

interface MarketDocumentsProps {
  marketId: string;
}

// Mock data pour les documents
const mockDocuments: Record<string, Document[]> = {
  "M2024-001": [
    {
      id: "doc1",
      name: "Cahier des charges.pdf",
      type: "PDF",
      uploadedAt: "2024-01-20",
      size: "1.2 MB",
    },
    {
      id: "doc2",
      name: "Annexe technique.docx",
      type: "DOCX",
      uploadedAt: "2024-01-22",
      size: "850 KB",
    }
  ],
  "M2024-002": [
    {
      id: "doc3",
      name: "Contrat type.pdf",
      type: "PDF",
      uploadedAt: "2024-02-15",
      size: "980 KB",
    }
  ],
  "M2024-003": [
    {
      id: "doc4",
      name: "Programme de formation.pdf",
      type: "PDF",
      uploadedAt: "2024-01-10",
      size: "1.5 MB",
    },
    {
      id: "doc5",
      name: "Liste des participants.xlsx",
      type: "XLSX",
      uploadedAt: "2024-01-12",
      size: "450 KB",
    }
  ],
  "M2024-004": [
    {
      id: "doc6",
      name: "Spécifications techniques.pdf",
      type: "PDF",
      uploadedAt: "2024-03-05",
      size: "2.3 MB",
    }
  ],
  "M2024-005": []
};

export const MarketDocuments = ({ marketId }: MarketDocumentsProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments[marketId] || []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDoc: Document = {
        id: `doc${Date.now()}`,
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        uploadedAt: new Date().toISOString().split('T')[0],
        size: `${Math.round(file.size / 1024)} KB`,
      };
      
      setDocuments([...documents, newDoc]);
      
      toast({
        title: "Document ajouté",
        description: `${file.name} a été ajouté avec succès.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documents du marché</h3>
        <div className="relative">
          <Input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          />
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un document
            </label>
          </Button>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
          <p>Aucun document disponible pour ce marché</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600">Nom</th>
                <th className="px-4 py-3 text-left text-gray-600">Type</th>
                <th className="px-4 py-3 text-left text-gray-600">
                  Date d'ajout
                </th>
                <th className="px-4 py-3 text-left text-gray-600">Taille</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                    {doc.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{doc.type}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(doc.uploadedAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{doc.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Import needed for the empty state
import { FileText } from "lucide-react";