import { ProgrammeFormation, CategorieType } from "@/types";

// Types pour les actions sur les programmes
export interface ProgrammeActions {
  onViewDetail: (programme: ProgrammeFormation) => void;
  onEdit: (programme: ProgrammeFormation) => void;
  onDelete: (id: string) => void;
  onGeneratePDF?: (programme: ProgrammeFormation) => void;
  onToggleVisible?: (id: string, newState: boolean) => void;
  onDuplicate?: (id: string) => void;
}

// Types pour les modes d'affichage
export type ViewMode = "list" | "form" | "detail" | "import";

// Types pour les programmes filtrés
export interface FilteredProgrammes {
  catalogue: ProgrammeFormation[];
  personnalise: ProgrammeFormation[];
}

// Props du FormationCard
export interface FormationCardProps {
  programme: ProgrammeFormation;
  actions: ProgrammeActions;
}

// Props pour l'état vide
export interface EmptyStateProps {
  type?: string;
  onCreate: () => void;
}

// Props pour les formulaires de programme (utilise CategorieType normalisé)
export interface ProgrammeFormProps {
  programme?: Partial<ProgrammeFormation>;
  onSubmit: (data: Partial<ProgrammeFormation>) => void;
  onCancel: () => void;
  categories: CategorieType[];
}