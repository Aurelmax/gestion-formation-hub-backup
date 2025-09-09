
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, MessageCircle, FileText, History, Upload, Download, Trash2, Edit3, Check, X } from "lucide-react";
import { Veille, StatutVeille } from "@/types/veille";
import { useToast } from "@/hooks/use-toast";

interface VeilleDetailProps {
  veille: Veille;
  onBack: () => void;
  onUpdateStatut: (id: string, statut: StatutVeille) => void;
  onUpdateAvancement: (id: string, avancement: number) => void;
  onAddCommentaire: (id: string, commentaire: string) => void;
  onUpdateCommentaire: (veilleId: string, commentaireId: string, contenu: string) => Promise<void>;
  onDeleteCommentaire: (veilleId: string, commentaireId: string) => Promise<void>;
  onUploadDocument: (veilleId: string, file: File) => Promise<any>;
  onDeleteDocument: (veilleId: string, documentId: string) => Promise<void>;
}

const VeilleDetail = ({
  veille,
  onBack,
  onUpdateStatut,
  onUpdateAvancement,
  onAddCommentaire,
  onUpdateCommentaire,
  onDeleteCommentaire,
  onUploadDocument,
  onDeleteDocument
}: VeilleDetailProps) => {
  const [nouveauCommentaire, setNouveauCommentaire] = useState("");
  const [avancementLocal, setAvancementLocal] = useState(veille.avancement);
  const [isUploading, setIsUploading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const { toast } = useToast();

  const getStatutLabel = (statut: StatutVeille) => {
    switch (statut) {
      case "nouvelle": return "Nouvelle";
      case "en-cours": return "En cours";
      case "terminee": return "Terminée";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "reglementaire": return "Réglementaire";
      case "metier": return "Métier";
      case "innovation": return "Innovation";
      default: return type;
    }
  };

  const handleStatusChange = (statut: StatutVeille) => {
    onUpdateStatut(veille.id, statut);
    toast({
      title: "Statut mis à jour",
      description: `Le statut a été changé vers "${getStatutLabel(statut)}"`,
    });
  };

  const saveAvancement = () => {
    onUpdateAvancement(veille.id, avancementLocal);
    toast({
      title: "Avancement sauvegardé",
      description: `Avancement mis à jour: ${avancementLocal}%`,
    });
  };

  const saveCommentaire = () => {
    if (nouveauCommentaire.trim()) {
      onAddCommentaire(veille.id, nouveauCommentaire.trim());
      setNouveauCommentaire("");
      toast({
        title: "Commentaire ajouté",
        description: "Le commentaire a été enregistré avec succès",
      });
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Date non disponible';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Date invalide';
    return dateObj.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatDateTime = (date: Date | string | undefined) => {
    if (!date) return 'Date non disponible';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Date invalide';
    return dateObj.toLocaleString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifications côté client
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 10MB",
      });
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Type de fichier non autorisé",
        description: "Types acceptés: PDF, JPEG, PNG, WEBP, DOCX, XLSX, TXT",
      });
      return;
    }

    try {
      setIsUploading(true);
      await onUploadDocument(veille.id, file);
      toast({
        title: "Document ajouté",
        description: `Le fichier "${file.name}" a été ajouté avec succès`,
      });
      // Reset input
      event.target.value = '';
    } catch (error) {
      toast({
        title: "Erreur d'upload",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string, documentName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${documentName}" ?`)) {
      return;
    }

    try {
      await onDeleteDocument(veille.id, documentId);
      toast({
        title: "Document supprimé",
        description: `Le document "${documentName}" a été supprimé`,
      });
    } catch (error) {
      toast({
        title: "Erreur de suppression",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('sheet')) return '📊';
    return '📎';
  };

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(currentContent);
  };

  const handleSaveEditedComment = async () => {
    if (!editingCommentId || !editingCommentContent.trim()) return;

    try {
      await onUpdateCommentaire(veille.id, editingCommentId, editingCommentContent.trim());
      setEditingCommentId(null);
      setEditingCommentContent("");
      toast({
        title: "Commentaire modifié",
        description: "Le commentaire a été modifié avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return;
    }

    try {
      await onDeleteCommentaire(veille.id, commentId);
      toast({
        title: "Commentaire supprimé",
        description: "Le commentaire a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{veille.titre}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{getTypeLabel(veille.type)}</Badge>
            <Badge variant={veille.statut === "terminee" ? "outline" : "default"}>
              {getStatutLabel(veille.statut)}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="commentaires">
            <MessageCircle className="h-4 w-4 mr-2" />
            Commentaires ({veille.commentaires.length})
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents ({veille.documents.length})
          </TabsTrigger>
          <TabsTrigger value="historique">
            <History className="h-4 w-4 mr-2" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-gray-600 mt-1">{veille.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Date de création</label>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(veille.dateCreation)}</p>
                </div>

                {veille.dateEcheance && (
                  <div>
                    <label className="text-sm font-medium">Date d'échéance</label>
                    <p className="text-sm text-gray-600 mt-1">{formatDate(veille.dateEcheance)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Statut</label>
                  <Select value={veille.statut} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nouvelle">Nouvelle</SelectItem>
                      <SelectItem value="en-cours">En cours</SelectItem>
                      <SelectItem value="terminee">Terminée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Avancement ({avancementLocal}%)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={avancementLocal}
                      onChange={(e) => setAvancementLocal(Number(e.target.value))}
                      className="w-full"
                    />
                    <Progress value={avancementLocal} className="h-2" />
                    <Button onClick={saveAvancement} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commentaires">
          <Card>
            <CardHeader>
              <CardTitle>Commentaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {veille.commentaires.map((commentaire) => (
                  <div key={commentaire.id} className="group p-3 bg-gray-50 rounded-lg">
                    {editingCommentId === commentaire.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingCommentContent}
                          onChange={(e) => setEditingCommentContent(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEditedComment} disabled={!editingCommentContent.trim()}>
                            <Check className="h-4 w-4 mr-1" />
                            Valider
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                            <X className="h-4 w-4 mr-1" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-sm flex-1">{commentaire.contenu}</p>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditComment(commentaire.id, commentaire.contenu)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(commentaire.id)}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-500">
                            Ajouté le {formatDateTime(commentaire.dateCreation)}
                          </p>
                          {commentaire.utilisateur && (
                            <p className="text-xs text-gray-500">
                              par {commentaire.utilisateur}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Ajouter un commentaire..."
                  value={nouveauCommentaire}
                  onChange={(e) => setNouveauCommentaire(e.target.value)}
                />
                <Button onClick={saveCommentaire} disabled={!nouveauCommentaire.trim()}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ajouter commentaire
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Documents
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="document-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.docx,.xlsx,.txt"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <Button
                    onClick={() => document.getElementById('document-upload')?.click()}
                    disabled={isUploading}
                    size="sm"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Upload...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Ajouter
                      </>
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {veille.documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun document ajouté</p>
                  <p className="text-sm mt-1">Cliquez sur "Ajouter" pour télécharger un fichier</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {veille.documents.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getFileIcon(document.type)}</span>
                        <div>
                          <p className="font-medium text-sm">{document.nom}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{formatFileSize(document.taille)}</span>
                            <span>•</span>
                            <span>Ajouté le {formatDate(document.dateAjout)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(document.url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(document.id, document.nom)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {veille.documents.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Astuce:</strong> Cliquez sur l'icône de téléchargement pour ouvrir le document, ou sur la corbeille pour le supprimer.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <CardTitle>Historique des actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucun historique disponible</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VeilleDetail;
