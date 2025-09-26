import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useProgrammesFormation } from "@/hooks/useProgrammesFormation";
import { ProgrammeFormation } from "@/types/programmes";
import { Upload, FileText, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormationImportProps {
  onBack: () => void;
  onSuccess?: (importedCount: number) => void;
}

const FormationImport = ({ onBack, onSuccess }: FormationImportProps) => {
  const { createProgramme } = useProgrammesFormation();
  const { toast } = useToast();
  
  const [jsonData, setJsonData] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [importType, setImportType] = useState<"catalogue" | "personnalise">("catalogue");
  const [importMode, setImportMode] = useState<"file" | "paste">("file");
  
  // Gérer l'upload de fichier JSON
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      
      try {
        const fileContent = await uploadedFile.text();
        setJsonData(fileContent);
        
        // Prévisualiser les données
        const parsedData = JSON.parse(fileContent);
        setPreview(Array.isArray(parsedData) ? parsedData.slice(0, 3) : [parsedData]);
      } catch (error) {
        toast({
          title: "Erreur de lecture du fichier",
          description: "Le fichier n'est pas un JSON valide.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Gérer la prévisualisation du JSON collé
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setJsonData(content);
    
    try {
      if (content.trim()) {
        const parsedData = JSON.parse(content);
        setPreview(Array.isArray(parsedData) ? parsedData.slice(0, 3) : [parsedData]);
      } else {
        setPreview([]);
      }
    } catch (error) {
      // Ne pas afficher d'erreur pendant la saisie
      setPreview([]);
    }
  };
  
  // Valider et importer les données
  const handleImport = async () => {
    if (!jsonData.trim()) {
      toast({
        title: "Données manquantes",
        description: "Veuillez fournir des données à importer.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      let parsedData: any;
      
      try {
        parsedData = JSON.parse(jsonData);
      } catch (error) {
        toast({
          title: "Format JSON invalide",
          description: "Veuillez vérifier le format des données.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const formationsToImport = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      // Statistiques d'importation
      const stats = {
        total: formationsToImport.length,
        success: 0,
        failed: 0,
        errors: [] as string[]
      };
      
      // Importer chaque formation
      for (const formationData of formationsToImport) {
        try {
          // Ajouter le type sélectionné si non spécifié
          if (!formationData.type) {
            formationData.type = importType;
          }
          
          // S'assurer que les champs obligatoires sont présents
          const requiredFields = ['titre', 'description', 'duree', 'prix', 'niveau', 'objectifs', 'prerequis'];
          const missingFields = requiredFields.filter(field => !formationData[field]);
          
          if (missingFields.length > 0) {
            throw new Error(`Champs obligatoires manquants: ${missingFields.join(', ')}`);
          }
          
          // ✅ Génération d'un code unique côté client uniquement
          if (!formationData.code) {
            const prefix = formationData.type === 'catalogue' ? 'CAT' : 'SM';
            const timestamp = Date.now().toString(36); // Base36 plus compact
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            formationData.code = `${prefix}-${timestamp}-${random}`;
          }
          
          // Créer la formation
          await createProgramme(formationData);
          stats.success++;
        } catch (error: any) {
          stats.failed++;
          stats.errors.push(`${formationData.titre || 'Sans titre'}: ${error.message || 'Erreur inconnue'}`);
        }
      }
      
      // Afficher le résultat
      if (stats.success > 0) {
        toast({
          title: "Import réussi",
          description: `${stats.success} formation(s) importée(s) sur ${stats.total}.`,
          variant: "default"
        });
        
        if (onSuccess) {
          onSuccess(stats.success);
        }
      }
      
      if (stats.failed > 0) {
        toast({
          title: "Import partiellement réussi",
          description: `${stats.failed} formation(s) n'ont pas pu être importées.`,
          variant: stats.success > 0 ? "default" : "destructive"
        });
        
        // Afficher les erreurs dans la console pour debug
        console.error("Erreurs d'importation:", stats.errors);
      }
      
      // Retourner à la liste si tout est ok
      if (stats.failed === 0) {
        onBack();
      }
    } catch (error: any) {
      toast({
        title: "Erreur d'import",
        description: error.message || "Une erreur est survenue lors de l'import.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <h1 className="text-2xl font-bold">Importer des formations</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className={`cursor-pointer transition-all ${importMode === 'file' ? 'ring-2 ring-primary' : ''}`} onClick={() => setImportMode("file")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <span>Importer depuis un fichier</span>
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className={`cursor-pointer transition-all ${importMode === 'paste' ? 'ring-2 ring-primary' : ''}`} onClick={() => setImportMode("paste")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>Coller du JSON</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Type d'importation</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={importType} 
            onValueChange={(value) => setImportType(value as "catalogue" | "personnalise")}
          >
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Sélectionnez le type de formation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="catalogue">Formations catalogue</SelectItem>
              <SelectItem value="personnalise">Formations personnalise</SelectItem>
            </SelectContent>
          </Select>
          
          <p className="text-sm text-muted-foreground">
            Ce type sera appliqué aux formations importées qui n'ont pas de type spécifié.
          </p>
        </CardContent>
      </Card>
      
      {importMode === 'file' ? (
        <Card>
          <CardHeader>
            <CardTitle>Téléverser un fichier JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-md p-8 text-center">
              <Upload className="mx-auto mb-4 h-10 w-10 text-gray-400" />
              <p className="mb-4 text-sm text-gray-600">
                Déposez votre fichier JSON ici ou cliquez pour parcourir
              </p>
              <Input 
                type="file" 
                accept=".json" 
                onChange={handleFileChange} 
                className="hidden" 
                id="file-upload" 
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Sélectionner un fichier
              </Button>
              
              {file && (
                <div className="mt-4 text-left bg-gray-50 p-3 rounded">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-blue-500" />
                    <span>{file.name}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Coller du JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder='[{"titre": "Formation Excel", "description": "Maîtrisez Excel", "duree": "2 jours", "prix": "950€", "niveau": "Débutant", "objectifs": ["Maîtriser les fondamentaux"], "prerequis": "Aucun"}, ...]'
              value={jsonData}
              onChange={handleJsonChange}
              className="min-h-[200px] font-mono"
            />
          </CardContent>
        </Card>
      )}
      
      {preview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aperçu des données</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[300px] text-xs">
              {JSON.stringify(preview, null, 2)}
            </pre>
            {jsonData && JSON.parse(jsonData).length > preview.length && (
              <p className="text-sm text-gray-500 mt-2">
                Aperçu des 3 premiers éléments sur {JSON.parse(jsonData).length}.
              </p>
            )}
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onBack} disabled={loading}>
          Annuler
        </Button>
        <Button 
          onClick={handleImport} 
          disabled={loading || !jsonData.trim()}
          className="relative"
        >
          {loading ? (
            <>
              <span className="opacity-0">Importer</span>
              <span className="absolute inset-0 flex items-center justify-center">Chargement...</span>
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" /> Importer
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FormationImport;
