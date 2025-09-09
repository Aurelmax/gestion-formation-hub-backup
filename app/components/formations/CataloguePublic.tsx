import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen, Calendar, Archive } from "lucide-react";
import { useProgrammesFormation } from "@/hooks/useProgrammesFormation";
import { ProgrammeFormation } from "@/types/programmes";

const CataloguePublic = () => {
  const { programmes, loading, error } = useProgrammesFormation();
  const [programmesPublics, setProgrammesPublics] = useState<ProgrammeFormation[]>([]);

  useEffect(() => {
    if (programmes) {
      // Filtrer seulement les programmes actifs de type catalogue
      setProgrammesPublics(
        programmes.filter(p => p.type === "catalogue" && p.estActif !== false)
      );
    }
  }, [programmes]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement du catalogue...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">Erreur lors du chargement du catalogue</div>
        <div className="text-gray-500 text-sm">{error}</div>
      </div>
    );
  }

  if (programmesPublics.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <Archive className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold">Catalogue en cours de mise à jour</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun programme de formation n'est actuellement disponible au catalogue.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Catalogue des formations</h2>
        <p className="text-gray-600">
          Découvrez notre sélection de programmes de formation professionnelle
        </p>
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            {programmesPublics.length} programme{programmesPublics.length > 1 ? 's' : ''} disponible{programmesPublics.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {programmesPublics.map((programme) => (
          <Card key={programme.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{programme.pictogramme || "📚"}</span>
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight">
                    {programme.titre || "Programme de formation"}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {programme.duree || "Durée non spécifiée"}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {programme.code}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-600 text-sm line-clamp-3">
                {programme.description || "Description non disponible"}
              </p>
              
              <div className="space-y-2 text-xs text-gray-500">
                {programme.publicConcerne && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 shrink-0" />
                    <span>Public: {programme.publicConcerne}</span>
                  </div>
                )}
                {programme.prerequis && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3 shrink-0" />
                    <span>Prérequis: {programme.prerequis}</span>
                  </div>
                )}
                {programme.categorie && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3 shrink-0" />
                    <span>Catégorie: {programme.categorie.titre}</span>
                  </div>
                )}
              </div>

              {programme.prix && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prix</span>
                    <span className="font-semibold text-green-600">
                      {typeof programme.prix === 'string' ? programme.prix : `${programme.prix}€`}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CataloguePublic;