import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Clock, Users, CheckCircle, Globe, Laptop, Code, BookOpen, BarChart,
  Search, ShoppingBag, Lightbulb, Sparkles, Calendar, FileDown,
  Edit, Trash2, Eye, Download, CheckSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import {
  Programme,
  ProgrammeCardProps,
  isProgrammeCatalogue,
  isProgrammePersonnalise,
  ModuleProgramme
} from './types';

// Fonction pour déterminer l'icône à afficher
const getProgrammeIcon = (programme: Programme) => {
  const id = programme.id.toLowerCase();
  const titre = programme.titre.toLowerCase();

  if (id.includes('wp') || titre.includes('wordpress')) {
    return <Globe className="h-6 w-6 text-blue-600" />;
  } else if (id.includes('wc') || titre.includes('woocommerce') || titre.includes('e-commerce')) {
    return <ShoppingBag className="h-6 w-6 text-purple-600" />;
  } else if (id.includes('seo') || titre.includes('référencement')) {
    return <Search className="h-6 w-6 text-green-600" />;
  } else if (id.includes('marketing') || titre.includes('marketing')) {
    return <BarChart className="h-6 w-6 text-orange-600" />;
  } else if (id.includes('dev') || titre.includes('développement')) {
    return <Code className="h-6 w-6 text-gray-700" />;
  } else if (titre.includes('stratégie') || titre.includes('inbound')) {
    return <Lightbulb className="h-6 w-6 text-yellow-600" />;
  } else if (titre.includes('avancé')) {
    return <Sparkles className="h-6 w-6 text-purple-500" />;
  }

  return <BookOpen className="h-6 w-6 text-blue-500" />;
};

// Badge de statut pour programmes personnalisés
const getStatusBadge = (statut: string) => {
  switch (statut) {
    case 'brouillon':
      return <Badge variant="outline">Brouillon</Badge>;
    case 'valide':
      return <Badge variant="default" className="bg-green-500">Validé</Badge>;
    case 'archive':
      return <Badge variant="secondary">Archivé</Badge>;
    default:
      return <Badge variant="outline">{statut}</Badge>;
  }
};

// Composant de détail pour les modules (programmes personnalisés)
const ModuleDetail = ({ module }: { module: ModuleProgramme }) => (
  <Card className="mb-4">
    <CardHeader className="pb-2">
      <div className="flex justify-between">
        <CardTitle className="text-lg">{module.titre}</CardTitle>
        <Badge variant="outline">{module.duree}h</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{module.description}</p>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-1">Objectifs</h4>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {module.objectifs.map((obj, idx) => (
            <li key={idx}>{obj}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-1">Prérequis</h4>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {module.prerequis.map((pre, idx) => (
            <li key={idx}>{pre}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-1">Contenu</h4>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {module.contenu.map((cont, idx) => (
            <li key={idx}>{cont}</li>
          ))}
        </ul>
      </div>
    </CardContent>
  </Card>
);

// Modal de détails pour programmes personnalisés
const ProgrammeDetailsDialog = ({
  programme,
  isOpen,
  onClose,
  onValidate,
  onGenerateDocument
}: {
  programme: Programme | null;
  isOpen: boolean;
  onClose: () => void;
  onValidate?: (id: string) => void;
  onGenerateDocument?: (id: string) => void;
}) => {
  if (!programme || !isProgrammePersonnalise(programme)) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{programme.titre}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Créé le {format(new Date(programme.dateCreation || new Date()), 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </p>
              <p className="text-sm">Bénéficiaire: <span className="font-medium">{programme.beneficiaire}</span></p>
            </div>
            <div>{getStatusBadge(programme.statut)}</div>
          </div>

          <div className="p-4 bg-muted/50 rounded-md">
            <h3 className="font-medium mb-2">Description</h3>
            <p>{programme.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Modules ({programme.modules.length})</h3>
            {programme.modules.map(module => (
              <ModuleDetail key={module.id} module={module} />
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          {!programme.estValide && onValidate && (
            <Button onClick={() => onValidate(programme.id)}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Valider le programme
            </Button>
          )}
          {onGenerateDocument && (
            <Button onClick={() => onGenerateDocument(programme.id)}>
              <Download className="mr-2 h-4 w-4" />
              Générer le document
            </Button>
          )}
          {programme.documentUrl && (
            <Button onClick={() => window.open(programme.documentUrl, '_blank')}>
              <Eye className="mr-2 h-4 w-4" />
              Voir le document
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Composant principal ProgrammeCard
export const ProgrammeCard = ({
  programme,
  variant = 'catalogue',
  className,
  onView,
  onEdit,
  onDelete,
  onPositionnement,
  onValidate,
  onGenerateDocument,
  onToggleActive,
  onDuplicate,
}: ProgrammeCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = () => {
    if (isProgrammePersonnalise(programme)) {
      setShowDetails(true);
    } else if (onView) {
      onView(programme);
    }
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'dd MMM yyyy', { locale: fr });
  };

  return (
    <>
      <Card className={cn("h-full hover:shadow-md transition-shadow", className)}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 flex-1">
              {getProgrammeIcon(programme)}
              <div className="flex-1">
                <CardTitle className="text-lg leading-tight">
                  {programme.titre}
                </CardTitle>
                {isProgrammeCatalogue(programme) && programme.code && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Code: {programme.code}
                  </p>
                )}
              </div>
            </div>

            {/* Badges selon le type */}
            <div className="flex flex-col gap-1">
              {isProgrammePersonnalise(programme) && getStatusBadge(programme.statut)}
              {isProgrammeCatalogue(programme) && programme.categorie && (
                <Badge
                  variant="secondary"
                  style={{ backgroundColor: programme.categorie.couleur || '#3498db' }}
                  className="text-white"
                >
                  {programme.categorie.titre}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {programme.description}
          </p>

          {/* Informations spécifiques selon le type */}
          <div className="space-y-2">
            {isProgrammeCatalogue(programme) && (
              <>
                {programme.duree && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{programme.duree}</span>
                  </div>
                )}
                {programme.prix && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{programme.prix}</Badge>
                  </div>
                )}
                {programme.niveau && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Niveau:</span>
                    <span>{programme.niveau}</span>
                  </div>
                )}
              </>
            )}

            {isProgrammePersonnalise(programme) && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{programme.beneficiaire}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{programme.modules.length} module(s)</span>
                </div>
              </>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(programme.dateCreation)}</span>
            </div>
          </div>

          {/* Actions selon le variant */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4 mr-1" />
              Détails
            </Button>

            {/* Actions catalogue */}
            {variant === 'catalogue' && isProgrammeCatalogue(programme) && onPositionnement && (
              <Button size="sm" onClick={() => onPositionnement(programme.titre)}>
                Positionnement
              </Button>
            )}

            {/* Actions sur-mesure */}
            {variant === 'sur-mesure' && isProgrammePersonnalise(programme) && (
              <>
                {!programme.estValide && onValidate && (
                  <Button size="sm" onClick={() => onValidate(programme.id)}>
                    <CheckSquare className="h-4 w-4 mr-1" />
                    Valider
                  </Button>
                )}
                {onGenerateDocument && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onGenerateDocument(programme.id)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Document
                  </Button>
                )}
              </>
            )}

            {/* Actions admin */}
            {variant === 'admin' && (
              <>
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(programme)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                )}
                {onDuplicate && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onDuplicate(programme.id)}
                  >
                    Dupliquer
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(programme.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de détails pour programmes personnalisés */}
      <ProgrammeDetailsDialog
        programme={programme}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onValidate={onValidate}
        onGenerateDocument={onGenerateDocument}
      />
    </>
  );
};

export default ProgrammeCard;