import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ProductEditor from './ProductEditor';
import BulkPriceUpdate from './BulkPriceUpdate';
import BulkProductImport from './BulkProductImport';
import BulkStockUpdate from './BulkStockUpdate';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

interface ProductsTabProps {
  products: any[];
  onProductUpdate: (products: any[]) => void;
}

const ProductsTab = ({ products, onProductUpdate }: ProductsTabProps) => {
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showBulkStock, setShowBulkStock] = useState(false);
  const { toast } = useToast();

  const startEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowBulkUpdate(false);
    setShowBulkImport(false);
    setShowBulkStock(false);
  };

  const startNewProduct = () => {
    setEditingProduct({ id: null });
    setShowBulkUpdate(false);
    setShowBulkImport(false);
    setShowBulkStock(false);
  };

  const openBulkUpdate = () => {
    setEditingProduct(null);
    setShowBulkUpdate(true);
    setShowBulkImport(false);
    setShowBulkStock(false);
  };

  const openBulkImport = () => {
    setEditingProduct(null);
    setShowBulkUpdate(false);
    setShowBulkImport(true);
    setShowBulkStock(false);
  };

  const openBulkStock = () => {
    setEditingProduct(null);
    setShowBulkUpdate(false);
    setShowBulkImport(false);
    setShowBulkStock(true);
  };

  const exportProducts = () => {
    const exportData = products.map(p => ({
      'Название': p.title,
      'Категория': p.category,
      'Цена (₽)': p.price.replace(' ₽', ''),
      'Стиль': p.style,
      'Описание': p.description,
      'Ссылка на изображение': p.image,
      'Артикул поставщика': p.supplierArticle || '',
      'В наличии': p.inStock ? 'да' : 'нет',
      'Количество на складе': p.stockQuantity !== null ? p.stockQuantity : '',
      'Состав комплекта': p.items?.join(';') || '',
      'Цвета': p.colors?.join(';') || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    
    const colWidths = [
      { wch: 25 }, { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 50 },
      { wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 40 }, { wch: 30 }
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Товары');
    XLSX.writeFile(wb, `товары_экспорт_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Экспорт завершён",
      description: `Экспортировано товаров: ${products.length}`
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-2">
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Список товаров</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={exportProducts}>
                  <Icon name="Download" size={16} className="mr-2" />
                  Экспорт
                </Button>
                <Button size="sm" onClick={startNewProduct}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" variant="outline" onClick={openBulkImport}>
                <Icon name="Upload" size={16} className="mr-2" />
                Импорт
              </Button>
              <Button size="sm" variant="outline" onClick={openBulkUpdate}>
                <Icon name="DollarSign" size={16} className="mr-2" />
                Цены
              </Button>
              <Button size="sm" variant="outline" onClick={openBulkStock}>
                <Icon name="Package" size={16} className="mr-2" />
                Остатки
              </Button>
            </div>
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
                    {product.supplierArticle && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Арт: {product.supplierArticle}
                      </p>
                    )}
                    {product.stockQuantity !== null && (
                      <p className="text-xs text-muted-foreground">
                        Склад: {product.stockQuantity} шт
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={product.inStock ? 'default' : 'secondary'}>
                      {product.inStock ? 'В наличии' : 'Нет'}
                    </Badge>
                    {product.stockQuantity !== null && (
                      <Badge variant={product.stockQuantity > 0 ? 'outline' : 'destructive'}>
                        {product.stockQuantity} шт
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <ScrollArea className="h-[500px] pr-4">
        {showBulkImport ? (
          <BulkProductImport 
            products={products}
            onProductsUpdate={onProductUpdate}
          />
        ) : showBulkUpdate ? (
          <BulkPriceUpdate 
            products={products}
            onProductsUpdate={onProductUpdate}
          />
        ) : showBulkStock ? (
          <BulkStockUpdate 
            products={products}
            onProductsUpdate={onProductUpdate}
          />
        ) : editingProduct ? (
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