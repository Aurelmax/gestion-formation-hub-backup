// Exports centralisés pour le module programmes
export * from './types';
export { ProgrammeCard, default as ProgrammeCardDefault } from './ProgrammeCard';
export { default as ProgrammesPersonnalises } from './ProgrammesPersonnalises';

// Re-exports des types principaux pour faciliter l'utilisation
export type {
  Programme,
  ProgrammeCatalogue,
  ProgrammePersonnalise,
  ProgrammeCardProps,
  CategorieProgramme,
  ModuleProgramme,
  TypeProgramme,
  StatutProgramme,
  VariantCard
} from './types';