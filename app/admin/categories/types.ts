// app/admin/categories/types.ts

export interface Categorie {
  id: string;
  code: string;
  titre: string;
  description?: string;
  ordre: number;
  _count?: {
    programmes: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategorieData {
  code: string;
  titre: string;
  description?: string;
  ordre?: number;
}

export interface UpdateCategorieData {
  code?: string;
  titre?: string;
  description?: string;
  ordre?: number;
}

export interface CategoriesApiResponse {
  success: boolean;
  data?: Categorie[];
  error?: string;
  details?: any;
}

export interface CategorieApiResponse {
  success: boolean;
  data?: Categorie;
  error?: string;
  details?: any;
}