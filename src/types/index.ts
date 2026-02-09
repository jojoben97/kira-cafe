export type CategoryId = 'coffee' | 'tea' | 'smoothies' | 'pastries' | 'water' | 'others';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: CategoryId;
}

export type DrinkSize = 'Small' | 'Medium' | 'Large';
export type MilkType = 'Dairy' | 'Oat' | 'Almond' | 'Soy';
export type SugarLevel = '0%' | '25%' | '50%' | '75%' | '100%';

export interface DrinkOptions {
  size: DrinkSize;
  milk?: MilkType;
  sugar?: SugarLevel;
}

export interface CartItem extends MenuItem {
  cartId: string; // Unique ID for this specific item in cart (to handle same item diff options)
  options?: DrinkOptions; // Optional because pastries might not have these
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  customerName: string;
  createdAt: string;
  paymentId?: string;
}
