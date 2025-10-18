import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { formatPrice } from '@/utils/formatPrice';
import ProductEditor from './ProductEditor';
import BulkPriceUpdate from './BulkPriceUpdate';
import BulkProductImport from './BulkProductImport';
import BulkStockUpdate from './BulkStockUpdate';
import BulkImageImport from './BulkImageImport';
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
  const [showBulkImages, setShowBulkImages] = useState(false);
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'out'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const startEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowBulkUpdate(false);
    setShowBulkImport(false);
    setShowBulkStock(false);
    setShowBulkImages(false);
  };

  const startNewProduct = () => {
    setEditingProduct({ id: null });
    setShowBulkUpdate(false);
    setShowBulkImport(false);
    setShowBulkStock(false);
    setShowBulkImages(false);
  };

  const duplicateProduct = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const maxId = Math.max(...products.map(p => p.id), 0);
    const duplicatedProduct = {
      ...product,
      id: null,
      title: `${product.title} (копия)`,
      supplierArticle: product.supplierArticle ? `${product.supplierArticle}-COPY` : ''
    };
    
    setEditingProduct(duplicatedProduct);
    setShowBulkUpdate(false);
    setShowBulkImport(false);
    setShowBulkStock(false);
    setShowBulkImages(false);
    
    toast({
      title: "Создана копия товара",
      description: "Отредактируйте параметры и сохраните"
    });
  };

  const openBulkUpdate = () => {
    setEditingProduct(null);
    setShowBulkUpdate(true);
    setShowBulkImport(false);
    setShowBulkStock(false);
    setShowBulkImages(false);
  };

  const openBulkImport = () => {
    setEditingProduct(null);
    setShowBulkUpdate(false);
    setShowBulkImport(true);
    setShowBulkStock(false);
    setShowBulkImages(false);
  };

  const openBulkStock = () => {
    setEditingProduct(null);
    setShowBulkUpdate(false);
    setShowBulkImport(false);
    setShowBulkStock(true);
    setShowBulkImages(false);
  };

  const openBulkImages = () => {
    setEditingProduct(null);
    setShowBulkUpdate(false);
    setShowBulkImport(false);
    setShowBulkStock(false);
    setShowBulkImages(true);
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
      'Цвета': p.colors?.join(';') || '',
      'ID группы вариантов': p.variantGroupId || '',
      'Цвет варианта': p.colorVariant || ''
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (stockFilter === 'in') {
      return product.inStock;
    }
    if (stockFilter === 'out') {
      return !product.inStock;
    }
    return true;
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <ScrollArea className="h-[500px] xl:h-[600px] pr-4">
        <div className="space-y-2 pr-2">
          <div className="space-y-2 mb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h3 className="font-semibold text-sm md:text-base">Список товаров</h3>
            </div>
            
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-2">
              <Button size="sm" onClick={startNewProduct}>
                <Icon name="Plus" size={16} className="mr-1" />
                Добавить товар
              </Button>
              <Button size="sm" variant="outline" onClick={exportProducts}>
                <Icon name="Download" size={16} className="mr-1" />
                Экспортировать
              </Button>
              <Button size="sm" variant="outline" onClick={() => duplicateProduct(products[0], new MouseEvent('click'))}>
                <Icon name="Copy" size={16} className="mr-1" />
                Копировать
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-2 max-w-[66%]">
              <Button size="sm" variant="outline" onClick={openBulkImport} className="text-[10px] px-1">
                <Icon name="Upload" size={12} className="mr-1" />
                Импорт
              </Button>
              <Button size="sm" variant="outline" onClick={openBulkUpdate} className="text-[10px] px-1">
                <Icon name="DollarSign" size={12} className="mr-1" />
                Цены
              </Button>
              <Button size="sm" variant="outline" onClick={openBulkStock} className="text-[10px] px-1">
                <Icon name="Package" size={12} className="mr-1" />
                Остатки
              </Button>
              <Button size="sm" variant="outline" onClick={openBulkImages} className="text-[10px] px-1">
                <Icon name="Image" size={12} className="mr-1" />
                Фото
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 max-w-[50%]">
              <Button 
                size="sm" 
                variant={stockFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStockFilter('all')}
                className="text-[10px] px-1"
              >
                Все ({products.length})
              </Button>
              <Button 
                size="sm" 
                variant={stockFilter === 'in' ? 'default' : 'outline'}
                onClick={() => setStockFilter('in')}
                className="text-[10px] px-1"
              >
                Налич. ({products.filter(p => p.inStock).length})
              </Button>
              <Button 
                size="sm" 
                variant={stockFilter === 'out' ? 'default' : 'outline'}
                onClick={() => setStockFilter('out')}
                className="text-[10px] px-1"
              >
                Нет ({products.filter(p => !p.inStock).length})
              </Button>
            </div>
          </div>
          {filteredProducts.map((product) => (
            <Card 
              key={product.id}
              className={`cursor-pointer transition-colors ${
                editingProduct?.id === product.id ? 'border-primary' : ''
              }`}
              onClick={() => startEditProduct(product)}
            >
              <CardContent className="p-2 md:p-3">
                <div className="flex gap-2 md:gap-3">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-12 h-12 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs md:text-sm truncate">{product.title}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{product.category}</p>
                    <p className="text-xs md:text-sm font-semibold mt-1">{formatPrice(product.price)}</p>
                    {product.supplierArticle && (
                      <p className="text-[10px] md:text-xs text-muted-foreground mt-1 truncate">
                        Арт: {product.supplierArticle}
                      </p>
                    )}
                    {product.stockQuantity !== null && (
                      <p className="text-[10px] md:text-xs text-muted-foreground">
                        Склад: {product.stockQuantity} шт
                      </p>
                    )}
                    {product.variantGroupId && (
                      <p className="text-[10px] md:text-xs text-blue-600 mt-1">
                        🎨 {product.colorVariant || 'Вариант'}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 md:h-7 px-1 md:px-2"
                      onClick={(e) => duplicateProduct(product, e)}
                      title="Создать копию"
                    >
                      <Icon name="Copy" size={12} className="md:w-3.5 md:h-3.5" />
                    </Button>
                    <Badge variant={product.inStock ? 'default' : 'secondary'} className="text-[10px] md:text-xs px-1 md:px-2">
                      {product.inStock ? 'В наличии' : 'Нет'}
                    </Badge>
                    {product.stockQuantity !== null && (
                      <Badge variant={product.stockQuantity > 0 ? 'outline' : 'destructive'} className="text-[10px] md:text-xs px-1 md:px-2">
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

      <ScrollArea className="h-[500px] xl:h-[600px] pr-2 md:pr-4">
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
        ) : showBulkImages ? (
          <BulkImageImport 
            products={products}
            onProductUpdate={onProductUpdate}
            onClose={() => setShowBulkImages(false)}
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