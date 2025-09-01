import { useState } from "react";
import FormationCard from "./FormationCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Formation, CategorieFormation } from "./types";

interface FormationsListProps {
  categoriesFormations: CategorieFormation[];
  onPositionnement: (formationTitre: string) => void;
}

const FormationsList = ({ categoriesFormations, onPositionnement }: FormationsListProps) => {
  const [activeTab, setActiveTab] = useState(categoriesFormations[0]?.id || "");

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b sticky top-0 bg-white z-10 pb-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">Nos formations par catégorie</h2>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-100 p-1">
              {categoriesFormations.map((categorie) => (
                <TabsTrigger 
                  key={categorie.id} 
                  value={categorie.id}
                  className={`font-medium data-[state=active]:text-white ${categorie.id === 'visibilite' || categorie.id === 'entreprises' ? 'data-[state=active]:bg-[#1869ba]' : 'data-[state=active]:bg-[#f58a3d]'}`}
                >
                  {categorie.titre}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {categoriesFormations.map((categorie) => (
            <TabsContent key={categorie.id} value={categorie.id} className="mt-6">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{categorie.titre}</h3>
                <p className="text-lg text-gray-600">{categorie.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categorie.formations.map((formation) => (
                  <FormationCard
                    key={formation.id}
                    formation={formation}
                    onPositionnement={onPositionnement}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default FormationsList;
