export interface Sweet {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  quantity: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
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
  price_at_purchase: number;
  created_at: string;
  sweet?: Sweet;
}

export type SweetFormData = {
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  image_url: string;
};
