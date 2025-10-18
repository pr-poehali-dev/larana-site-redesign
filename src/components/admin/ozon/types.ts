export interface OzonProduct {
  product_id: number;
  offer_id: string;
  name: string;
  price: string;
  old_price: string;
  currency_code: string;
  visible: boolean;
  images: { file_name: string; url: string }[];
  stocks?: {
    present: number;
    reserved: number;
  };
  description?: string;
  attributes?: any[];
  color?: string;
  modelName?: string;
  ozonCategory?: string;
}

export interface OzonImportTabProps {
  products: any[];
  onProductsUpdate: (products: any[]) => void;
}
