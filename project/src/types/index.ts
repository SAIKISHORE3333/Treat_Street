export interface Supplier {
  id: string;
  name: string;
  email: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  ingredient_id: string | null;
  name: string;
  supplier_id: string | null;
  supplier?: Supplier;
  category: string;
  package_size: string | null;
  price: number;
  active: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  supplier_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface Order {
  id: string;
  staff_name: string;
  department: string;
  branch_name: string | null;
  notes: string | null;
  total_cost: number;
  status: 'Pending' | 'Ordered' | 'Fulfilled';
  created_at: string;
  order_items?: OrderItem[];
}

export type OrderStatus = 'Pending' | 'Ordered' | 'Fulfilled';
