import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock, Users, BookOpen, Info, GitBranch, Calendar,
  Download, Archive, FileText, Edit, Trash2, Eye, EyeOff
} from "lucide-react";
import { FormationCardProps } from "./types";
import { useFormations } from "./FormationsContext";

export const FormationCard = ({ programme }: { programme: FormationCardProps['programme'] }) => {
  const { actions } = useFormations();
  const {
    onViewDetail,
    onEdit,
    onDelete,
    onGeneratePDF,
    onToggleVisible,
    onDuplicate
  } = actions;

  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le programme "${programme.titre || programme.code}" ?`)) {
      onDelete(programme.id);
    }
  };

  return (
    <Card key={programme.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{programme.pictogramme}</span>
              <CardTitle className="text-lg">{programme.titre || programme.code || "Sans titre"}</CardTitle>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {programme.duree}
              </Badge>
              <Badge variant={programme.type === "catalogue" ? "default" : "outline"} className="flex items-center gap-1">
                {programme.type === "catalogue" ? (
                  <FileText className="h-3 w-3" />
                ) : (
                  <Archive className="h-3 w-3" />
                )}
                {programme.type === "catalogue" ? "Catalogue" : "Personnalisé"}
              </Badge>
              {programme.type === "personnalise" && programme.beneficiaireId && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {programme.beneficiaireId}
                </Badge>
              )}
              <Badge
                variant={programme.estVisible ? "default" : "secondary"}
                className={`flex items-center gap-1 ${programme.estVisible ? 'bg-green-500' : 'bg-gray-400'}`}
              >
                {programme.estVisible ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
                {programme.estVisible ? "Visible" : "Masqué"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {programme.description || "Description non disponible"}
        </p>

        <div className="space-y-2 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>Public: {programme.publicConcerne || "Non défini"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>Prérequis: {programme.prerequis || "Aucun"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Code: {programme.code}</span>
          </div>
          {programme.categorieId && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>Catégorie: {programme.categorie?.titre || programme.categorieId}</span>
            </div>
          )}
          {programme.type === "personnalise" && programme.objectifsSpecifiques && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>Objectifs spécifiques: {programme.objectifsSpecifiques}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-between mt-4 gap-2">
          <Button variant="ghost" size="sm" onClick={() => onViewDetail(programme)}>
            <Eye className="h-4 w-4 mr-1" /> Voir
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(programme)}>
            <Edit className="h-4 w-4 mr-1" /> Éditer
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" /> Supprimer
          </Button>
          {onGeneratePDF && (
            <Button variant="ghost" size="sm" onClick={() => onGeneratePDF(programme)}>
              <Download className="h-4 w-4 mr-1" /> PDF
            </Button>
          )}
          {onDuplicate && (
            <Button variant="ghost" size="sm" onClick={() => onDuplicate(programme.id)}>
              <GitBranch className="h-4 w-4 mr-1" /> Dupliquer
            </Button>
          )}
          {onToggleVisible && (
            <>
              {programme.estVisible ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleVisible(programme.id, false)}
                  className="text-orange-600 hover:text-orange-700"
                  title="Masquer ce programme du site public"
                >
                  <EyeOff className="h-4 w-4 mr-1" /> Masquer du site
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleVisible(programme.id, true)}
                  className="text-green-600 hover:text-green-700"
                  title="Rendre ce programme visible sur le site public"
                >
                  <Eye className="h-4 w-4 mr-1" /> Publier sur le site
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};