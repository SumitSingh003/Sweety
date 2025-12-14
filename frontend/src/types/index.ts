export interface Sweet {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface PurchaseHistory {
  id: string;
  user_id: string;
  sweet_id: string;
  quantity: number;
  priceAtPurchase: number;
  createdAt: string;
  sweet?: Sweet;
}

export type SweetFormData = {
  name: string;
  category: string;
  description: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
};

export type AuthUser = {
  id: string;
  email: string;
  fullName?: string | null;
  role: 'ADMIN' | 'USER';
};
