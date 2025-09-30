export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  emailVerified: boolean;
  image?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    sessions?: number;
  };
}

export interface CreateUserData {
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user';
  emailVerified?: boolean;
}

export interface UpdateUserData {
  role?: 'admin' | 'user';
  isActive?: boolean;
}

export interface UsersApiResponse {
  success: boolean;
  data?: User[];
  error?: string;
  details?: any;
}

export interface UserApiResponse {
  success: boolean;
  data?: User;
  error?: string;
  details?: any;
}