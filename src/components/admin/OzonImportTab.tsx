import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface OzonProduct {
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
}

interface OzonImportTabProps {
  products: any[];
  onProductsUpdate: (products: any[]) => void;
}

const OzonImportTab = ({ products: catalogProducts, onProductsUpdate }: OzonImportTabProps) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<OzonProduct[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const loadOzonProducts = async () => {
    setLoading(true);
    try {
      toast({
        title: "⏳ Загрузка товаров...",
        description: "Загружаем все товары с Ozon, это может занять время",
      });

      let allProducts: any[] = [];
      let lastId = '';
      let hasMore = true;
      
      while (hasMore) {
        const url = lastId 
          ? `https://functions.poehali.dev/41fcd72f-4164-49f0-8cf6-315f1a291c00?limit=1000&last_id=${lastId}`
          : 'https://functions.poehali.dev/41fcd72f-4164-49f0-8cf6-315f1a291c00?limit=1000';
        
        const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Ozon API error:', errorData);
        throw new Error(errorData.error || 'Ошибка загрузки товаров с Ozon');
      }

        const data = await response.json();
        const items = data.result?.items || [];
        
        if (items.length === 0) {
          hasMore = false;
          break;
        }
        
        allProducts = [...allProducts, ...items];
        lastId = data.result?.last_id || '';
        hasMore = !!lastId && items.length === 1000;
        
        console.log(`Загружено ${allProducts.length} товаров...`);
      }
      
      const productIds = allProducts.map((item: any) => item.product_id);

      if (productIds.length === 0) {
        toast({
          title: "Товары не найдены",
          description: "В вашем каталоге Ozon пока нет товаров",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "⏳ Загрузка деталей...",
        description: `Загружаем детали для ${productIds.length} товаров`,
      });

      let allDetails: any[] = [];
      const batchSize = 100;
      
      for (let i = 0; i < productIds.length; i += batchSize) {
        const batch = productIds.slice(i, i + batchSize);
        
        const detailsResponse = await fetch('https://functions.poehali.dev/41fcd72f-4164-49f0-8cf6-315f1a291c00', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_ids: batch
          })
        });

        if (!detailsResponse.ok) {
          console.error('Ошибка загрузки батча', i);
          continue;
        }

        const detailsData = await detailsResponse.json();
        const items = detailsData.result?.items || detailsData.result || [];
        allDetails = [...allDetails, ...items];
        
        console.log(`Загружено деталей: ${allDetails.length}/${productIds.length}`);
      }
      
      const rawItems = allDetails;
      
      const mappedProducts = rawItems.map((item: any) => {
        const name = item.name || item.title || `Товар ${item.offer_id}`;
        
        // Правильно извлекаем ВСЕ изображения
        const images = item.images?.map((img: any) => ({
          file_name: img.file_name || '',
          url: img.default || img.url || ''
        })) || [];
        
        // Извлекаем цвет как единое значение (не массив)
        const colorAttr = item.attributes?.find((attr: any) => 
          attr.attribute_name?.toLowerCase().includes('цвет') || 
          attr.attribute_id === 85
        );
        const colorValue = colorAttr?.values?.[0]?.value || '';
        
        // Правильно извлекаем цену (НЕ изображение!)
        const price = item.marketing_price || item.price || item.old_price || '0';
        
        return {
          product_id: item.id || item.product_id,
          offer_id: item.offer_id,
          name: name,
          price: price,
          old_price: item.old_price || '',
          currency_code: item.currency_code || 'RUB',
          visible: item.visible || item.status?.state === 'processed',
          images: images,
          stocks: item.stocks || { present: 0, reserved: 0 },
          description: item.description || item.rich_text || '',
          attributes: item.attributes || [],
          color: colorValue
        };
      });
      
      setProducts(mappedProducts);
      
      toast({
        title: "Товары загружены",
        description: `Загружено ${mappedProducts.length} товаров с Ozon`,
      });
    } catch (error) {
      console.error('Load error:', error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось загрузить товары",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleProductSelection = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.product_id)));
    }
  };

  const mapOzonCategory = (productName: string, attributes?: any[]): string => {
    const nameLower = productName.toLowerCase();
    
    if (nameLower.includes('диван') || nameLower.includes('кресло') || nameLower.includes('пуф')) {
      return 'Гостиная';
    }
    if (nameLower.includes('кровать') || nameLower.includes('матрас')) {
      return 'Спальня';
    }
    if (nameLower.includes('стол') || nameLower.includes('стул') || nameLower.includes('табурет')) {
      return 'Кухня';
    }
    if (nameLower.includes('шкаф') || nameLower.includes('комод') || nameLower.includes('тумба')) {
      return 'Прихожая';
    }
    if (nameLower.includes('детск')) {
      return 'Детская';
    }
    
    return 'Гостиная';
  };

  const convertOzonToProduct = (ozonProduct: OzonProduct): any => {
    const maxId = catalogProducts.length > 0 ? Math.max(...catalogProducts.map(p => p.id)) : 0;
    const category = mapOzonCategory(ozonProduct.name, ozonProduct.attributes);
    
    // Все изображения товара
    const allImages = ozonProduct.images?.map(img => img.url).filter(url => url) || [];
    
    // Цвет как единое значение (не массив вариаций)
    const singleColor = ozonProduct.color || '';
    
    // Форматируем цену
    const priceValue = typeof ozonProduct.price === 'string' 
      ? ozonProduct.price.replace(/[^\d]/g, '')
      : ozonProduct.price;
    
    return {
      id: maxId + 1,
      title: ozonProduct.name,
      category: category,
      price: `${priceValue} ₽`,
      style: 'Современный',
      description: ozonProduct.description || `${ozonProduct.name}. Товар импортирован из Ozon.${singleColor ? ` Цвет: ${singleColor}.` : ''}`,
      image: allImages[0] || '',
      supplierArticle: ozonProduct.offer_id,
      inStock: (ozonProduct.stocks?.present ?? 0) > 0,
      stockQuantity: ozonProduct.stocks?.present ?? null,
      images: allImages,
      colors: singleColor ? [singleColor] : [],
      items: [],
      variantGroupId: null,
      colorVariant: singleColor || null
    };
  };

  const importSelected = async () => {
    console.log('🚀 Начало импорта');
    console.log('Выбрано товаров:', selectedProducts.size);
    console.log('Текущий каталог:', catalogProducts.length, 'товаров');
    
    if (selectedProducts.size === 0) {
      toast({
        title: "Выберите товары",
        description: "Отметьте товары для импорта",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setImportProgress(0);
    
    const selectedItems = products.filter(p => selectedProducts.has(p.product_id));
    console.log('Товары для импорта:', selectedItems);
    
    const total = selectedItems.length;
    let imported = 0;
    const newProducts = [...catalogProducts];

    for (const ozonProduct of selectedItems) {
      const existingProduct = newProducts.find(p => p.supplierArticle === ozonProduct.offer_id);
      
      if (!existingProduct) {
        const convertedProduct = convertOzonToProduct(ozonProduct);
        convertedProduct.id = newProducts.length > 0 ? Math.max(...newProducts.map(p => p.id)) + 1 : 1;
        newProducts.push(convertedProduct);
        console.log('✅ Добавлен товар:', convertedProduct.title);
        imported++;
      } else {
        console.log('⏭️ Товар уже существует:', ozonProduct.offer_id);
      }
      
      setImportProgress(Math.round((imported / total) * 100));
    }

    console.log('📦 Всего импортировано:', imported);
    console.log('📊 Новый каталог:', newProducts.length, 'товаров');
    
    onProductsUpdate(newProducts);

    toast({
      title: "✅ Импорт завершён",
      description: `Импортировано ${imported} товаров. Всего в каталоге: ${newProducts.length}`,
    });

    setLoading(false);
    setImportProgress(0);
    setSelectedProducts(new Set());
    setProducts([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Package" size={24} />
            Импорт товаров с Ozon
          </CardTitle>
          <CardDescription>
            Загрузите товары из личного кабинета Ozon Seller
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button 
              onClick={loadOzonProducts} 
              disabled={loading}
              className="gap-2 w-full sm:w-auto text-xs md:text-sm"
              size="sm"
            >
              <Icon name="Download" size={16} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">{loading ? 'Загрузка...' : 'Загрузить товары с Ozon'}</span>
              <span className="sm:hidden">{loading ? 'Загрузка...' : 'Загрузить'}</span>
            </Button>
            
            {products.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  onClick={selectAll}
                  className="gap-2 w-full sm:w-auto text-xs md:text-sm"
                  size="sm"
                >
                  <Icon name="CheckSquare" size={16} className="md:w-4 md:h-4" />
                  <span className="hidden sm:inline">{selectedProducts.size === products.length ? 'Снять все' : 'Выбрать все'}</span>
                  <span className="sm:hidden">{selectedProducts.size === products.length ? 'Снять' : 'Выбрать'}</span>
                </Button>
                
                <Button 
                  onClick={importSelected}
                  disabled={selectedProducts.size === 0 || loading}
                  className="gap-2 w-full sm:w-auto text-xs md:text-sm"
                  size="sm"
                >
                  <Icon name="Upload" size={16} className="md:w-4 md:h-4" />
                  Импорт ({selectedProducts.size})
                </Button>
              </>
            )}
          </div>

          {importProgress > 0 && (
            <div className="space-y-2">
              <Progress value={importProgress} />
              <p className="text-sm text-muted-foreground text-center">
                Импорт: {importProgress}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {products.length > 0 && (
        <div className="grid gap-3 md:gap-4">
          <h3 className="text-base md:text-lg font-semibold">
            Товары из Ozon ({products.length})
          </h3>
          
          <div className="grid gap-2 md:gap-3">
            {products.map((product) => (
              <Card 
                key={product.product_id}
                className={`cursor-pointer transition-all ${
                  selectedProducts.has(product.product_id) 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-gray-400'
                }`}
                onClick={() => toggleProductSelection(product.product_id)}
              >
                <CardContent className="p-2 md:p-4">
                  <div className="flex gap-2 md:gap-4">
                    <div className="flex items-center flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.product_id)}
                        onChange={() => toggleProductSelection(product.product_id)}
                        className="w-4 h-4 md:w-5 md:h-5 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    {product.images?.[0] && (
                      <img 
                        src={product.images[0].url} 
                        alt={product.name}
                        className="w-12 h-12 md:w-20 md:h-20 object-cover rounded flex-shrink-0"
                      />
                    )}
                    
                    <div className="flex-1 space-y-1 md:space-y-2 min-w-0">
                      <div className="flex items-start justify-between gap-2 md:gap-4">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-xs md:text-sm line-clamp-2">
                            {product.name}
                          </h4>
                          <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                            ID: {product.product_id} • Арт: {product.offer_id}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {product.price} {product.currency_code}
                          </p>
                          {product.old_price && product.old_price !== product.price && (
                            <p className="text-xs text-muted-foreground line-through">
                              {product.old_price}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Badge variant={product.visible ? "default" : "secondary"}>
                          {product.visible ? 'Опубликован' : 'Не опубликован'}
                        </Badge>
                        
                        {product.stocks && (
                          <Badge variant="outline">
                            На складе: {product.stocks.present}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Icon name="Package" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Товары не загружены</h3>
            <p className="text-muted-foreground mb-4">
              Нажмите кнопку "Загрузить товары с Ozon" для импорта каталога
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OzonImportTab;