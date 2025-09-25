import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Copy,
  FileText,
  Info,
  Search,
  MoreHorizontal,
  BookOpen,
  Bookmark,
  Book,
  BookMarked,
  Archive,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useProgrammesFormation } from "@/hooks/useProgrammesFormation";
import { ProgrammeFormation } from "@/types/programmes";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { generateFormationPDF } from "@/utils/pdfGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProgrammeListEnhancedProps {
  onCreateClick: () => void;
  onEditClick: (programme: ProgrammeFormation) => void;
  onViewClick: (programme: ProgrammeFormation) => void;
}

export default function ProgrammeListEnhanced({
  onCreateClick,
  onEditClick,
  onViewClick,
}: ProgrammeListEnhancedProps) {
  const { programmes, loading, deleteProgramme, duplicateProgramme, updateProgrammeStatus } = useProgrammesFormation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [programmeToModify, setProgrammeToModify] = useState<ProgrammeFormation | null>(null);
  const [duplicationType, setDuplicationType] = useState<"catalogue" | "personnalise">("personnalise");

  // Filtrer les programmes en fonction des critères
  const filteredProgrammes = useMemo(() => {
    if (!programmes) return [];
    
    return programmes.filter((programme) => {
      // Filtrage par recherche
      const matchesSearch = searchQuery === "" || 
        programme.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        programme.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        programme.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtrage par type
      const matchesType = 
        filterType === "all" || 
        programme.type === filterType;
      
      // Filtrage par catégorie
      const matchesCategory = 
        filterCategory === "all" || 
        programme.categorieId === filterCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [programmes, searchQuery, filterType, filterCategory]);

  // Extraire toutes les catégories uniques
  const categories = useMemo(() => {
    if (!programmes) return [];
    
    const categoryIds = new Set<string>();
    const categoriesArray: { id: string; titre: string }[] = [];
    
    programmes.forEach((programme) => {
      if (programme.categorieId && !categoryIds.has(programme.categorieId)) {
        categoryIds.add(programme.categorieId);
        categoriesArray.push({
          id: programme.categorieId,
          titre: programme.categorie?.titre || "Catégorie sans titre"
        });
      }
    });
    
    return categoriesArray;
  }, [programmes]);

  const handleDelete = async (id: string) => {
    try {
      await deleteProgramme(id);
      toast({
        title: "Programme supprimé",
        description: "Le programme a été supprimé avec succès.",
      });
      setConfirmDeleteId(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le programme.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async () => {
    if (!programmeToModify) return;

    try {
      await duplicateProgramme(programmeToModify.id);
      
      toast({
        title: "Programme dupliqué",
        description: duplicationType === "catalogue" 
          ? "Le programme a été dupliqué dans le catalogue." 
          : "Le programme a été converti en version personnalise.",
      });
      
      setDuplicateDialogOpen(false);
      setProgrammeToModify(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer le programme.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, estActif: boolean) => {
    try {
      await updateProgrammeStatus(id, estActif);
      toast({
        title: estActif ? "Programme activé" : "Programme désactivé",
        description: `Le programme a été ${estActif ? "activé" : "désactivé"} avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du programme.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePDF = (programme: ProgrammeFormation) => {
    try {
      // Adapter le ProgrammeFormation vers le type Formation
      const formationAdapter = {
        id: programme.id,
        code: programme.code,
        libelle: programme.titre, // Mapping de titre à libelle
        duree: programme.duree,
        objectifsPedagogiques: Array.isArray(programme.objectifs) ? programme.objectifs.join('\n') : programme.objectifs as string,
        contenuDetailleJours: programme.contenuDetailleJours,
        prerequis: programme.prerequis,
        publicConcerne: programme.publicConcerne,
        horaires: "9h-12h30 / 13h30-17h", // Valeur par défaut pour horaires
        modalitesAcces: programme.modalitesAcces,
        tarif: programme.prix, // Mapping de prix à tarif
        modalitesReglement: programme.modalitesReglement,
        contactOrganisme: programme.accessibiliteHandicap || "Pour les personnes en situation de handicap, merci de contacter notre référent pour adapter les modalités", // Utiliser accessibiliteHandicap comme contactOrganisme
        referentPedagogique: programme.formateur || "Aurélien LAVAYSSIERE", // Utiliser formateur ou valeur par défaut
        referentQualite: "Aurélien LAVAYSSIERE", // Valeur par défaut
        modalitesTechniques: programme.modalites || "Formation présentielle ou à distance", // Utiliser modalites comme modalitesTechniques
        formateur: programme.formateur,
        ressourcesDisposition: programme.ressourcesDisposition,
        modalitesEvaluation: programme.modalitesEvaluation,
        sanctionFormation: programme.sanctionFormation,
        niveauCertification: programme.niveauCertification || ''
      };
      
      generateFormationPDF(formationAdapter);
      toast({
        title: "PDF généré",
        description: "Le PDF du programme a été généré et téléchargé.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF du programme.",
        variant: "destructive",
      });
    }
  };

  const openDuplicateDialog = (programme: ProgrammeFormation, type: "catalogue" | "personnalise") => {
    setProgrammeToModify(programme);
    setDuplicationType(type);
    setDuplicateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des programmes</h2>
          <p className="text-gray-600">
            Bibliothèque unifiée des programmes de formation catalogue et personnalise
          </p>
        </div>
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau programme
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par titre, code ou description..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de programme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="catalogue">Catalogue</SelectItem>
                <SelectItem value="personnalise">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.titre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="ml-auto">
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => setView(view === "cards" ? "table" : "cards")}
              >
                {view === "cards" ? (
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Vue tableau
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Vue cards
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredProgrammes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookMarked className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun programme trouvé</h3>
            <p className="text-gray-500 text-center max-w-md">
              Aucun programme ne correspond à vos critères de recherche.
              Essayez d'ajuster vos filtres ou créez un nouveau programme.
            </p>
            <Button onClick={onCreateClick} className="mt-6">
              <Plus className="h-4 w-4 mr-2" />
              Créer un programme
            </Button>
          </CardContent>
        </Card>
      ) : view === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProgrammes.map((programme) => (
            <Card key={programme.id} className={`overflow-hidden border-l-4 hover:shadow-md transition-shadow ${programme.type === 'catalogue' ? 'border-l-blue-500' : 'border-l-amber-500'}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{programme.pictogramme || '📚'}</span>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {programme.titre || "Sans titre"}
                        {!programme.estActif && (
                          <Badge variant="outline" className="text-gray-500">
                            Inactif
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="text-sm text-gray-500">{programme.code}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewClick(programme)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditClick(programme)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleGeneratePDF(programme)}>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger PDF
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuLabel>Conversion</DropdownMenuLabel>
                      {programme.type === 'catalogue' && (
                        <DropdownMenuItem onClick={() => openDuplicateDialog(programme, 'personnalise')}>
                          <Copy className="h-4 w-4 mr-2" />
                          Convertir en personnalise
                        </DropdownMenuItem>
                      )}
                      {programme.type === 'personnalise' && (
                        <DropdownMenuItem onClick={() => openDuplicateDialog(programme, 'catalogue')}>
                          <Copy className="h-4 w-4 mr-2" />
                          Publier dans le catalogue
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(programme.id, !programme.estActif)}
                      >
                        {programme.estActif ? (
                          <>
                            <Archive className="h-4 w-4 mr-2" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activer
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setConfirmDeleteId(programme.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {programme.description || "Aucune description"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant={programme.type === 'catalogue' ? 'default' : 'secondary'}>
                    {programme.type === 'catalogue' ? 'Catalogue' : 'Personnalisé'}
                  </Badge>
                  {programme.categorie && (
                    <Badge variant="outline">{programme.categorie.titre}</Badge>
                  )}
                  {programme.typeProgramme && (
                    <Badge variant="outline" className="bg-gray-100">
                      {programme.typeProgramme}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Mis à jour le {programme.dateModification ? new Date(programme.dateModification).toLocaleDateString('fr-FR') : 'récemment'}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8" onClick={() => onEditClick(programme)}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8" onClick={() => onViewClick(programme)}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProgrammes.map((programme) => (
                  <TableRow key={programme.id}>
                    <TableCell className="font-medium">{programme.code}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{programme.pictogramme || "📚"}</span>
                        {programme.titre || "Sans titre"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={programme.type === 'catalogue' ? 'default' : 'secondary'}>
                        {programme.type === 'catalogue' ? 'Catalogue' : 'Personnalisé'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {programme.categorie ? programme.categorie.titre : "Aucune"}
                    </TableCell>
                    <TableCell>
                      {programme.estActif ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Actif
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Inactif
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewClick(programme)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => onEditClick(programme)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleGeneratePDF(programme)}>
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger PDF
                            </DropdownMenuItem>
                            {programme.type === 'catalogue' && (
                              <DropdownMenuItem onClick={() => openDuplicateDialog(programme, 'personnalise')}>
                                <Copy className="h-4 w-4 mr-2" />
                                Convertir en personnalise
                              </DropdownMenuItem>
                            )}
                            {programme.type === 'personnalise' && (
                              <DropdownMenuItem onClick={() => openDuplicateDialog(programme, 'catalogue')}>
                                <Copy className="h-4 w-4 mr-2" />
                                Publier dans catalogue
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(programme.id, !programme.estActif)}
                            >
                              {programme.estActif ? (
                                <>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Désactiver
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activer
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setConfirmDeleteId(programme.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce programme de formation ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de duplication/conversion */}
      <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {duplicationType === "personnalise"
                ? "Convertir en programme personnalise"
                : "Publier dans le catalogue"}
            </DialogTitle>
            <DialogDescription>
              {duplicationType === "personnalise"
                ? "Vous êtes sur le point de créer une version personnalise de ce programme catalogue qui pourra être personnalisée sans modifier l'original."
                : "Vous êtes sur le point de publier ce programme personnalise dans le catalogue public."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              <strong>Programme source:</strong>{" "}
              {programmeToModify?.titre || "Programme"} ({programmeToModify?.code || ""})
            </p>
            <p className="text-sm text-gray-500 mt-2">
              <strong>Nouveau type:</strong>{" "}
              {duplicationType === "personnalise" ? "Personnalisé" : "Catalogue"}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Un nouveau programme sera créé avec un code et un titre légèrement modifiés.
              Vous pourrez ensuite éditer ce nouveau programme selon vos besoins.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDuplicateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              {duplicationType === "personnalise" ? "Créer version personnalise" : "Publier dans le catalogue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
