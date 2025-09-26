import React, { createContext, useContext, ReactNode } from 'react';
import { ProgrammeFormation } from '@/types';
import { ProgrammeActions } from './types';

interface FormationsContextProps {
  programmes: ProgrammeFormation[];
  isLoading: boolean;
  actions: ProgrammeActions;
  categories: Array<{
    id: string;
    code: string;
    titre: string;
    description: string;
  }>;
}

interface FormationsProviderProps {
  children: ReactNode;
  programmes: ProgrammeFormation[];
  isLoading: boolean;
  actions: ProgrammeActions;
  categories: Array<{
    id: string;
    code: string;
    titre: string;
    description: string;
  }>;
}

const FormationsContext = createContext<FormationsContextProps | undefined>(undefined);

export const FormationsProvider = ({
  children,
  programmes,
  isLoading,
  actions,
  categories
}: FormationsProviderProps) => {
  return (
    <FormationsContext.Provider
      value={{
        programmes,
        isLoading,
        actions,
        categories
      }}
    >
      {children}
    </FormationsContext.Provider>
  );
};

export const useFormations = () => {
  const context = useContext(FormationsContext);
  if (context === undefined) {
    throw new Error('useFormations must be used within a FormationsProvider');
  }
  return context;
};