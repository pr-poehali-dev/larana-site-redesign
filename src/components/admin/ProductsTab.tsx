import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ProductEditor from './ProductEditor';

interface ProductsTabProps {
  products: any[];
  onProductUpdate: (products: any[]) => void;
}

const ProductsTab = ({ products, onProductUpdate }: ProductsTabProps) => {
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const startEditProduct = (product: any) => {
    setEditingProduct(product);
  };

  const startNewProduct = () => {
    setEditingProduct({ id: null });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Список товаров</h3>
            <Button size="sm" onClick={startNewProduct}>
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить товар
            </Button>
          </div>
          {products.map((product) => (
            <Card 
              key={product.id}
              className={`cursor-pointer transition-colors ${
                editingProduct?.id === product.id ? 'border-primary' : ''
              }`}
              onClick={() => startEditProduct(product)}
            >
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.title}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                    <p className="text-sm font-semibold mt-1">{product.price}</p>
                  </div>
                  <Badge variant={product.inStock ? 'default' : 'secondary'}>
                    {product.inStock ? 'В наличии' : 'Нет'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <ScrollArea className="h-[500px] pr-4">
        {editingProduct ? (
          <ProductEditor
            product={editingProduct}
            products={products}
            onProductUpdate={onProductUpdate}
            onClose={() => setEditingProduct(null)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Icon name="Package" size={48} className="mb-4" />
            <p>Выберите товар для редактирования</p>
            <p className="text-sm">или создайте новый</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ProductsTab;
