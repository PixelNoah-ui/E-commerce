export type sortType = "last_updated" | "price_asc" | "price_desc";
export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  categoryType: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
