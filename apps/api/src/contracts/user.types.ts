// Shared types for User and Role

export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
