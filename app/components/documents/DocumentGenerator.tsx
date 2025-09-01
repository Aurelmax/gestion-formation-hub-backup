import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileIcon, DownloadIcon, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface DocumentGeneratorProps {
  dossierId: string;
  refDevis: string;
}

type DocumentStatus = {
  generating: boolean;
  documents: {
    name: string;
    url: string;
    label: string;
  }[];
};

export default function DocumentGenerator({ dossierId, refDevis }: DocumentGeneratorProps) {
  const [status, setStatus] = useState<DocumentStatus>({
    generating: false,
    documents: []
  });
  const { toast } = useToast();

  const documentLabels: Record<string, string> = {
    convention: "Convention de formation",
    emargement: "Feuille d'émargement",
    convocation: "Convocation à la formation"
  };

  const generateDocuments = async () => {
    setStatus({ ...status, generating: true });
    
    try {
      const response = await api.post(`/dossiers/${dossierId}/generate-documents`);
      
      const documents = response.data.documents.map((doc: any) => ({
        name: doc.name,
        url: doc.url,
        label: documentLabels[doc.name] || doc.name
      }));
      
      setStatus({
        generating: false,
        documents
      });
      
      toast({
        title: "Documents générés",
        description: `${documents.length} documents ont été générés avec succès.`,
      });
    } catch (error) {
      console.error("Erreur lors de la génération des documents:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les documents. Veuillez réessayer.",
        variant: "destructive",
      });
      setStatus({
        generating: false,
        documents: []
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Documents administratifs</CardTitle>
        <CardDescription>
          Générez et téléchargez les documents administratifs pour le dossier {refDevis}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {status.documents.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-700">Documents disponibles:</h3>
            <div className="grid gap-3">
              {status.documents.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <FileIcon className="h-5 w-5 text-blue-500" />
                    <span>{doc.label}</span>
                  </div>
                  <a
                    href={doc.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <DownloadIcon className="h-4 w-4" />
                    <span>Télécharger</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            Cliquez sur le bouton ci-dessous pour générer la convention de formation, 
            la feuille d'émargement et la convocation pour ce dossier.
          </p>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button
          onClick={generateDocuments}
          disabled={status.generating}
        >
          {status.generating ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : status.documents.length > 0 ? (
            "Régénérer les documents"
          ) : (
            "Générer les documents"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
