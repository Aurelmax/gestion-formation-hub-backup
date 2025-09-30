'use client';

// app/components/programmes/ProgrammeCard.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Settings,
  FileEdit,
  Eye,
  Trash2,
  Calendar,
  Download,
  CheckSquare,
  Users,
  Clock,
  FilePlus,
  Copy,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Programme,
  ProgrammeCardProps,
  TypeProgramme,
  VariantCard,
  isProgrammeCatalogue,
  isProgrammePersonnalise,
  getProgrammeConfig
} from './types';

const ProgrammeCard: React.FC<ProgrammeCardProps> = ({
  programme,
  variant = VariantCard.UNIVERSAL,
  size = 'default',
  showActions = true,
  actions = {},
  className = ''
}) => {
  // Validation des props
  if (!programme || !programme.id) {
    console.warn('ProgrammeCard: programme invalide ou manquant');
    return null;
  }

  const [showDetails, setShowDetails] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Type guards
  const isCatalogue = isProgrammeCatalogue(programme);
  const isSurMesure = isProgrammePersonnalise(programme);
  
  // Configuration UI mémorisée
  const config = useMemo(() => getProgrammeConfig(programme.type), [programme.type]);

  // Auto-détection du variant
  const resolvedVariant = useMemo(() => {
    if (variant !== VariantCard.UNIVERSAL) return variant;
    return isCatalogue ? VariantCard.CATALOGUE : VariantCard.SUR_MESURE;
  }, [variant, isCatalogue]);

  // Formattage de date sécurisé pour éviter l'hydratation mismatch
  const formatDate = (dateString: string, dateFormat = 'dd MMM yyyy'): string => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'Date invalide';

      // Utiliser toLocaleDateString pour éviter les problèmes d'hydratation
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.warn('Erreur de formatage de date:', error);
      return 'Date invalide';
    }
  };

  // Rendu spécifique pour programmes CATALOGUE
  const renderCatalogueContent = () => {
    if (!isCatalogue) return null;

    return (
      <div className="space-y-3">
        {programme.categorieProgramme && (
          <Badge
            variant="outline"
            className="mb-3"
            style={{
              backgroundColor: `${programme.categorieProgramme.couleur}15`,
              borderColor: programme.categorieProgramme.couleur,
              color: programme.categorieProgramme.couleur
            }}
          >
            {programme.categorieProgramme.titre}
          </Badge>
        )}

        {/* Informations principales */}
        {(programme.duree || programme.participantsMax) && (
          <div className="flex gap-4 text-sm text-gray-600">
            {programme.duree && (
              <div className="flex items-center gap-2" title="Durée de la formation">
                <Clock size={16} aria-hidden="true" />
                <span>{programme.duree}</span>
              </div>
            )}
            {programme.participantsMax && (
              <div className="flex items-center gap-2" title="Nombre maximum de participants">
                <Users size={16} aria-hidden="true" />
                <span>Max {programme.participantsMax}</span>
              </div>
            )}
          </div>
        )}

        {/* Niveau */}
        {programme.niveau && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Niveau : {programme.niveau}</Badge>
          </div>
        )}

        {/* Prix */}
        {programme.prix !== undefined && programme.prix > 0 && (
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm text-gray-600">Tarif</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">
                {programme.prix.toLocaleString('fr-FR')}€
              </span>
              <span className="text-gray-500 text-sm ml-1">HT</span>
            </div>
          </div>
        )}

        {/* Adaptations */}
        {programme.adaptations && programme.adaptations.length > 0 && (
          <div className="border-t pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full justify-between"
              aria-expanded={showDetails}
              aria-label={`${showDetails ? 'Masquer' : 'Afficher'} les adaptations`}
            >
              <span className="text-sm font-medium">
                {programme.adaptations.length} adaptation
                {programme.adaptations.length > 1 ? 's' : ''} créée
                {programme.adaptations.length > 1 ? 's' : ''}
              </span>
              <span className="text-xs" aria-hidden="true">
                {showDetails ? '▼' : '▶'}
              </span>
            </Button>

            {showDetails && (
              <div className="mt-2 space-y-2" role="list">
                {programme.adaptations.map((adaptation) => (
                  <div
                    key={adaptation.id}
                    className="flex items-center gap-2 p-2 bg-orange-50 rounded text-sm"
                    role="listitem"
                  >
                    <Settings size={14} className="text-orange-600 flex-shrink-0" aria-hidden="true" />
                    <span className="text-orange-700 font-medium flex-1 truncate" title={adaptation.titre}>
                      {adaptation.titre}
                    </span>
                    {isClient && (
                      <span className="text-xs text-orange-600">
                        {formatDate(adaptation.dateCreation, 'dd/MM/yy')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Rendu spécifique pour programmes SUR-MESURE
  const renderSurMesureContent = () => {
    if (!isSurMesure) return null;

    return (
      <div className="space-y-3">
        {/* Bénéficiaire */}
        {programme.beneficiaire && (
          <div className="p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium text-gray-700">Bénéficiaire : </span>
            <span className="text-sm text-gray-900">{programme.beneficiaire}</span>
          </div>
        )}

        {/* Modules */}
        {programme.modules && programme.modules.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Modules ({programme.modules.length})
              </span>
              {size !== 'compact' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs"
                  aria-expanded={showDetails}
                  aria-label={`${showDetails ? 'Masquer' : 'Afficher'} les détails des modules`}
                >
                  {showDetails ? 'Masquer' : 'Détails'}
                </Button>
              )}
            </div>

            {showDetails && (
              <div className="space-y-1" role="list">
                {programme.modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="text-xs bg-gray-50 p-2 rounded flex items-start gap-2"
                    role="listitem"
                  >
                    <span className="font-bold text-gray-500 min-w-[20px]">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{module.titre}</div>
                      {module.description && size === 'detailed' && (
                        <div className="text-gray-600 mt-1 text-xs">{module.description}</div>
                      )}
                      {module.duree && (
                        <div className="text-gray-600 mt-1">
                          <Clock size={10} className="inline mr-1" aria-hidden="true" />
                          {module.duree}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
            <AlertCircle size={14} aria-hidden="true" />
            <span>Aucun module défini pour ce programme</span>
          </div>
        )}

        {/* Programme source */}
        {programme.sourceProgram && (
          <div className={`p-3 rounded border ${config.bgColor}`}>
            <div className="flex items-center gap-2 text-xs font-medium text-orange-700 mb-1">
              <FilePlus size={12} aria-hidden="true" />
              Adapté du programme catalogue
            </div>
            <div className="text-sm text-orange-900 font-medium">
              {programme.sourceProgram.titre}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Rendu des actions
  const renderActions = () => {
    if (!showActions) return null;

    const actionButtons = [];

    if (actions.onView) {
      actionButtons.push(
        <Button
          key="view"
          variant="outline"
          size="sm"
          onClick={() => actions.onView!(programme)}
          aria-label={`Voir le programme ${programme.titre}`}
        >
          <Eye size={14} className="mr-1" aria-hidden="true" />
          Voir
        </Button>
      );
    }

    if (actions.onEdit) {
      actionButtons.push(
        <Button
          key="edit"
          variant="outline"
          size="sm"
          onClick={() => actions.onEdit!(programme)}
          aria-label={`Modifier le programme ${programme.titre}`}
        >
          <FileEdit size={14} className="mr-1" aria-hidden="true" />
          Modifier
        </Button>
      );
    }

    if (isCatalogue && actions.onAdapt) {
      actionButtons.push(
        <Button
          key="adapt"
          variant="outline"
          size="sm"
          onClick={() => actions.onAdapt!(programme)}
          aria-label={`Créer une adaptation du programme ${programme.titre}`}
        >
          <FilePlus size={14} className="mr-1" aria-hidden="true" />
          Adapter
        </Button>
      );
    }

    if (actions.onSchedule) {
      actionButtons.push(
        <Button
          key="schedule"
          size="sm"
          onClick={() => actions.onSchedule!(programme)}
          className={`text-white ${config.buttonColor}`}
          aria-label={`${isCatalogue ? 'Programmer' : 'Planifier'} le programme ${programme.titre}`}
        >
          <Calendar size={14} className="mr-1" aria-hidden="true" />
          {isCatalogue ? 'Programmer' : 'Planifier'}
        </Button>
      );
    }

    if (actions.onDuplicate) {
      actionButtons.push(
        <Button
          key="duplicate"
          variant="outline"
          size="sm"
          onClick={() => actions.onDuplicate!(programme)}
          aria-label={`Dupliquer le programme ${programme.titre}`}
        >
          <Copy size={14} className="mr-1" aria-hidden="true" />
          Dupliquer
        </Button>
      );
    }

    if (actions.onDownload) {
      actionButtons.push(
        <Button
          key="download"
          variant="outline"
          size="sm"
          onClick={() => actions.onDownload!(programme)}
          aria-label={`Télécharger le programme ${programme.titre}`}
        >
          <Download size={14} className="mr-1" aria-hidden="true" />
          Télécharger
        </Button>
      );
    }

    if (actions.onGenerateDocument) {
      actionButtons.push(
        <Button
          key="generate"
          variant="outline"
          size="sm"
          onClick={() => actions.onGenerateDocument!(programme.id)}
          aria-label={`Générer le document du programme ${programme.titre}`}
        >
          <Download size={14} className="mr-1" aria-hidden="true" />
          Générer doc
        </Button>
      );
    }

    if (isSurMesure && actions.onValidate) {
      actionButtons.push(
        <Button
          key="validate"
          variant="default"
          size="sm"
          onClick={() => actions.onValidate!(programme.id)}
          className="bg-green-600 hover:bg-green-700 text-white"
          aria-label={`Valider le programme ${programme.titre}`}
        >
          <CheckSquare size={14} className="mr-1" aria-hidden="true" />
          Valider
        </Button>
      );
    }

    if (actions.onDelete) {
      actionButtons.push(
        <Button
          key="delete"
          variant="destructive"
          size="sm"
          onClick={() => actions.onDelete!(programme.id)}
          aria-label={`Supprimer le programme ${programme.titre}`}
        >
          <Trash2 size={14} aria-hidden="true" />
        </Button>
      );
    }

    return actionButtons.length > 0 ? (
      <div className="flex gap-2 flex-wrap pt-3 border-t" role="group" aria-label="Actions du programme">
        {actionButtons}
      </div>
    ) : null;
  };

  return (
    <Card
      className={`
        transition-all duration-200 hover:shadow-lg border-l-4 ${config.borderColor}
        ${size === 'compact' ? 'p-2' : ''}
        ${className}
      `}
      role="article"
      aria-label={`Programme ${programme.titre}`}
    >
      <CardHeader className={size === 'compact' ? 'pb-2 px-3 pt-3' : ''}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Badges et date */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge 
                className={`${config.badge.bg} ${config.badge.text} border-0`}
                aria-label={`Type de programme: ${config.label}`}
              >
                {isCatalogue ? (
                  <BookOpen size={12} className="mr-1" aria-hidden="true" />
                ) : (
                  <Settings size={12} className="mr-1" aria-hidden="true" />
                )}
                {config.label}
              </Badge>

              {programme.dateCreation && size !== 'compact' && isClient && (
                <span className="text-xs text-gray-500">
                  {formatDate(programme.dateCreation)}
                </span>
              )}
            </div>

            {/* Titre */}
            <CardTitle
              className={`${size === 'compact' ? 'text-base' : 'text-lg'} line-clamp-2`}
            >
              {programme.titre}
            </CardTitle>

            {/* Description */}
            {programme.description && size !== 'compact' && (
              <CardDescription className="mt-2 line-clamp-2">
                {programme.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Contenu principal */}
      {size !== 'compact' && (
        <CardContent>
          {resolvedVariant === VariantCard.CATALOGUE && renderCatalogueContent()}
          {resolvedVariant === VariantCard.SUR_MESURE && renderSurMesureContent()}
          {renderActions()}
        </CardContent>
      )}

      {/* Actions pour variante compact */}
      {size === 'compact' && showActions && (
        <div className="px-3 pb-3">{renderActions()}</div>
      )}
    </Card>
  );
};

export { ProgrammeCard };
export default ProgrammeCard;