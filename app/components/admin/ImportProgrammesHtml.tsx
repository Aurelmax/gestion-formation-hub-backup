import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

interface ImportResult {
  id: string;
  titre: string;
  status: 'created' | 'updated' | 'error';
  source: string;
  error?: string;
}

interface ImportResponse {
  totalProcessed: number;
  results: ImportResult[];
}

const ImportProgrammesHtml = () => {
  const [loading, setLoading] = useState(false);
  const [htmlTemplates, setHtmlTemplates] = useState<any[]>([]);
  const [importResults, setImportResults] = useState<ImportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Charger la liste des templates HTML disponibles
  const loadHtmlTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/programmes-html');
      
      if (response.data && Array.isArray(response.data)) {
        setHtmlTemplates(response.data);
        setSuccess(`${response.data.length} templates HTML trouvés`);
      } else {
        setError('Format de données incorrect reçu du serveur');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des templates HTML:', err);
      setError('Impossible de charger la liste des templates HTML');
    } finally {
      setLoading(false);
    }
  };

  // Importer tous les templates HTML dans la base de données
  const importAllTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setImportResults(null);
      
      const response = await axios.post('/programmes-html/import-to-db');
      
      if (response.data && response.data.results) {
        setImportResults(response.data);
        const created = response.data.results.filter((r: ImportResult) => r.status === 'created').length;
        const updated = response.data.results.filter((r: ImportResult) => r.status === 'updated').length;
        const errors = response.data.results.filter((r: ImportResult) => r.status === 'error').length;
        
        setSuccess(`Import terminé : ${created} créés, ${updated} mis à jour, ${errors} erreurs`);
      } else {
        setError('Format de réponse incorrect reçu du serveur');
      }
    } catch (err) {
      console.error('Erreur lors de l\'import des templates HTML:', err);
      setError('L\'import des templates HTML a échoué');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Import des Templates HTML</CardTitle>
          <CardDescription>
            Importez les templates HTML de programmes de formation dans la base de données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Succès</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex space-x-4">
              <Button 
                onClick={loadHtmlTemplates} 
                disabled={loading}
                variant="outline"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Charger les templates disponibles
              </Button>
              
              <Button 
                onClick={importAllTemplates} 
                disabled={loading}
                variant="default"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Importer tous les templates
              </Button>
            </div>
            
            {htmlTemplates.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Templates HTML disponibles ({htmlTemplates.length})</h3>
                <div className="max-h-[400px] overflow-y-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Titre</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Fichier</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {htmlTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">{template.code}</TableCell>
                          <TableCell>{template.titre}</TableCell>
                          <TableCell>{template.categorieCode}</TableCell>
                          <TableCell>
                            <a 
                              href={template.programmeUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {template.filename}
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            
            {importResults && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Résultats de l'import ({importResults.totalProcessed})</h3>
                <div className="max-h-[400px] overflow-y-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Détails</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importResults.results.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{result.titre}</TableCell>
                          <TableCell>{result.source}</TableCell>
                          <TableCell>
                            {result.status === 'created' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Créé
                              </span>
                            )}
                            {result.status === 'updated' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Mis à jour
                              </span>
                            )}
                            {result.status === 'error' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Erreur
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {result.error && (
                              <div className="text-red-500 text-xs">
                                <AlertTriangle className="h-3 w-3 inline mr-1" />
                                {result.error}
                              </div>
                            )}
                            {result.status !== 'error' && (
                              <span className="text-xs text-gray-500">
                                {result.id}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-gray-500">
            Cette fonctionnalité permet d'importer les templates HTML du dossier /public/programmes/ dans la base de données.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImportProgrammesHtml;
