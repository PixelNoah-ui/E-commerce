export type sortType = "last_updated" | "price_asc" | "price_desc";
export type ProductType = {
  id: string;
  name?: string;
  description?: string;
  price?: string | number;
  imageUrl?: string;
  image_url?: string;
  condition?: string;
  battery?: string;
  ram?: string;
  storage?: string;
  network?: string;
  signals?: string;
  camera?: string;
  specifications?: Record<string, string> | null;

  categoryType?: string;
  category?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
