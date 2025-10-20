import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { formatPrice } from '@/utils/formatPrice';
import { clearProductCache } from '@/utils/productCache';
import ProductEditor from './ProductEditor';
import BulkPriceUpdate from './BulkPriceUpdate';
import BulkProductImport from './BulkProductImport';
import BulkStockUpdate from './BulkStockUpdate';
import BulkImageImport from './BulkImageImport';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';
import func2url from '@/../backend/func2url.json';

interface ProductsTabProps {
  products: any[];
  onProductUpdate: (products: any[]) => void;
  onReloadCatalog?: () => void;
}

const ProductsTab = ({ products, onProductUpdate, onReloadCatalog }: ProductsTabProps) => {
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showBulkStock, setShowBulkStock] = useState(false);
  const [showBulkImages, setShowBulkImages] = useState(false);
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'out'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProductsFromDB();
  }, []);

  const loadProductsFromDB = async (forceRefresh = false) => {
    const CACHE_KEY = 'admin_products_cache';
    const CACHE_TIMESTAMP_KEY = 'admin_products_cache_timestamp';
    const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

    // Проверяем кэш если не форсируем обновление
    if (!forceRefresh) {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        
        if (cachedData && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp);
          
          if (age < CACHE_DURATION) {
            const formattedProducts = JSON.parse(cachedData);
            setDbProducts(formattedProducts);
            onProductUpdate(formattedProducts);
            setLastSync(new Date(parseInt(cachedTimestamp)));
            setLoadingProducts(false);
            
            console.log(`📦 Загружено из кэша: ${formattedProducts.length} товаров (кэш свежий ${Math.round(age / 1000)}с)`);
            
            toast({
              title: "Товары загружены из кэша",
              description: `${formattedProducts.length} товаров (обновлено ${Math.round(age / 1000)}с назад)`,
              duration: 2000
            });
            
            return;
          } else {
            console.log('🕐 Кэш устарел, загружаю свежие данные из БД');
          }
        }
      } catch (error) {
        console.warn('Ошибка чтения кэша:', error);
      }
    }

    setLoadingProducts(true);
    try {
      const response = await fetch(func2url['products'], {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const formattedProducts = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          price: typeof p.price === 'number' ? `${p.price} ₽` : p.price,
          discountPrice: p.discount_price ? (typeof p.discount_price === 'number' ? `${p.discount_price} ₽` : p.discount_price) : null,
          category: p.category,
          style: p.style,
          colors: Array.isArray(p.colors) ? p.colors : (typeof p.colors === 'string' ? JSON.parse(p.colors) : []),
          images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : []),
          image: Array.isArray(p.images) ? p.images[0] : (typeof p.images === 'string' ? JSON.parse(p.images)[0] : p.images),
          items: Array.isArray(p.items) ? p.items : (typeof p.items === 'string' ? JSON.parse(p.items) : []),
          inStock: p.in_stock,
          isNew: p.is_new,
          supplierArticle: p.supplier_article,
          stockQuantity: p.stock_quantity,
          variantGroupId: p.variant_group_id,
          colorVariant: p.color_variant
        }));
        
        // Сохраняем в кэш
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(formattedProducts));
          localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (error) {
          console.warn('Не удалось сохранить в кэш:', error);
        }
        
        setDbProducts(formattedProducts);
        onProductUpdate(formattedProducts);
        setLastSync(new Date());
        
        console.log(`✅ Загружено товаров из БД: ${formattedProducts.length}`);
        
        toast({
          title: forceRefresh ? "Каталог обновлён" : "Товары загружены",
          description: `Загружено ${formattedProducts.length} товаров из базы данных`
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров из БД:', error);
      toast({
        title: 'Предупреждение',
        description: 'Не удалось загрузить товары из БД, используются локальные данные',
        variant: 'default'
      });
    } finally {
      setLoadingProducts(false);
    }
  };

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
    const exportData = activeProducts.map(p => ({
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
      description: `Экспортировано товаров: ${activeProducts.length}`
    });
  };

  const activeProducts = dbProducts.length > 0 ? dbProducts : products;
  
  const filteredProducts = activeProducts.filter(product => {
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
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm md:text-base">Список товаров</h3>
                {loadingProducts && (
                  <span className="text-xs text-muted-foreground">Загрузка из БД...</span>
                )}
                {!loadingProducts && dbProducts.length > 0 && lastSync && (
                  <Badge variant="outline" className="text-xs">
                    БД: {dbProducts.length} шт | {(() => {
                      const age = Date.now() - lastSync.getTime();
                      const minutes = Math.floor(age / 60000);
                      return minutes < 1 ? 'только что' : `${minutes}м назад`;
                    })()}
                  </Badge>
                )}
              </div>
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
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => loadProductsFromDB(true)}
                disabled={loadingProducts}
              >
                <Icon name="RefreshCw" size={16} className={`mr-1 ${loadingProducts ? 'animate-spin' : ''}`} />
                {loadingProducts ? 'Загрузка...' : 'Обновить из БД'}
              </Button>
              {lastSync && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Обновлено: {lastSync.toLocaleTimeString('ru-RU')}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                    onClick={() => {
                      clearProductCache();
                      toast({
                        title: "Кэш очищен",
                        description: "При следующей загрузке данные будут обновлены",
                        duration: 2000
                      });
                    }}
                  >
                    <Icon name="Trash2" size={12} className="mr-1" />
                    Очистить кэш
                  </Button>
                </div>
              )}
              <Button 
                size="sm" 
                variant="default" 
                className="bg-green-600 hover:bg-green-700"
                onClick={async () => {
                  const confirmed = confirm(`Перенести ${activeProducts.length} товаров в базу данных? Все покупатели увидят ваш каталог!`);
                  if (!confirmed) return;
                  
                  try {
                    const response = await fetch('https://functions.poehali.dev/1aa3b0e9-1067-47c6-97ee-40e0747b7d8e', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'X-Admin-Key': 'larana-admin-2024'
                      },
                      body: JSON.stringify({ products: activeProducts, clearBefore: true })
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                      toast({
                        title: "✅ Успешно!",
                        description: `Перенесено ${result.imported} товаров в БД. Теперь все видят каталог!`
                      });
                      
                      window.dispatchEvent(new CustomEvent('larana-products-updated'));
                      
                      await loadProductsFromDB(true);
                    } else {
                      toast({
                        title: "Ошибка",
                        description: result.error || 'Не удалось перенести товары',
                        variant: 'destructive'
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Ошибка",
                      description: 'Проблема с подключением к БД',
                      variant: 'destructive'
                    });
                  }
                }}
              >
                <Icon name="Database" size={16} className="mr-1" />
                Перенести в БД ({products.length})
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