import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface DocumentGeneratorProps {
  dossierId: string;
  buttonText?: string;
  onSuccess?: (documents: Document[]) => void;
  onError?: (error: any) => void;
}

interface Document {
  name: string;
  url: string;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  dossierId,
  buttonText = 'Générer les documents',
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[] | null>(null);

  const handleGenerateDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`/dossiers/${dossierId}/generate-documents`);
      setDocuments(response.data.documents);
      if (onSuccess) {
        onSuccess(response.data.documents);
      }
    } catch (err) {
      console.error('Erreur lors de la génération des documents:', err);
      setError('Une erreur est survenue lors de la génération des documents');
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDocumentName = (name: string) => {
    switch (name) {
      case 'convention':
        return 'Convention de formation';
      case 'attestation':
        return 'Attestation de formation';
      case 'emargement':
        return 'Feuille d\'émargement';
      case 'convocation':
        return 'Convocation';
      default:
        return name;
    }
  };

  return (
    <div className="mt-4 mb-4">
      {!documents && (
        <Button
          onClick={handleGenerateDocuments}
          disabled={loading}
          className="mb-4"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Génération...
            </div>
          ) : (
            buttonText
          )}
        </Button>
      )}

      {error && (
        <p className="text-red-600 mt-4">
          {error}
        </p>
      )}

      {documents && documents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Documents générés:
          </h3>
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <CardContent className="p-4">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-decoration-none"
                  >
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{getDocumentName(doc.name)}</p>
                      <p className="text-sm text-gray-500">Cliquez pour télécharger le PDF</p>
                    </div>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGenerator;
