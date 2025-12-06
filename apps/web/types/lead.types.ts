// Shared types for Leads

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  productId?: string | null;
  createdAt: string; // ISO
  source?: string | null;
}

export interface CreateLeadInput {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  productId?: string;
  source?: string;
}

export type UpdateLeadInput = Partial<CreateLeadInput>;


