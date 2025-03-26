export interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string | null;
  price: string;
  image?: {
    id: number | null;
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  variants?: Array<{
    id: number;
    title: string;
    price: string;
    position: number;
  }>;
  status?: string;
  vendor?: string;
  tags?: string;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  spicinessLevel: number;
  sweetnessLevel: number;
  dietaryPreference: string[];
  healthinessScore: number;
  popularity: number;
  caffeineLevel: string;
  sufficientFor: number;
}

export interface MenuItemFront {
  id: number;
  name: string;
  description: string;
  category: string | null;
  price: string;
  restaurant: string;
  image: string;
  spicinessLevel: number;
  sweetnessLevel: number;
  dietaryPreference: string[];
  healthinessScore: number;
  popularity: number;
  caffeineLevel: string;
  sufficientFor: number;
}
