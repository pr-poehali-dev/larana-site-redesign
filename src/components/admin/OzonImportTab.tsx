import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { OzonProduct, OzonImportTabProps } from './ozon/types';
import { loadOzonProductsFromAPI } from './ozon/ozonApi';
import { convertOzonToProduct } from './ozon/productMapper';
import OzonProductCard from './ozon/OzonProductCard';

const OzonImportTab = ({ products: catalogProducts, onProductsUpdate }: OzonImportTabProps) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<OzonProduct[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const loadOzonProducts = async () => {
    setLoading(true);
    try {
      const mappedProducts = await loadOzonProductsFromAPI((message) => {
        toast({
          title: "⏳ Загрузка товаров...",
          description: message,
        });
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

  const uploadImageFromUrl = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch('https://functions.poehali.dev/872aa2f7-0278-44a5-8930-98a76886a184', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: imageUrl })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.url) {
          return data.url;
        }
      }
      
      console.warn('Не удалось загрузить изображение через backend, используем оригинальный URL');
      return imageUrl;
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error);
      return imageUrl;
    }
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
        toast({
          title: "⏳ Загрузка изображений",
          description: `Обрабатываем товар: ${ozonProduct.name}`,
        });

        const ozonImages = ozonProduct.images?.map(img => img.url).filter(url => url) || [];
        const uploadedImages: string[] = [];

        for (const imageUrl of ozonImages) {
          const uploadedUrl = await uploadImageFromUrl(imageUrl);
          uploadedImages.push(uploadedUrl);
        }

        const convertedProduct = convertOzonToProduct(ozonProduct, newProducts);
        convertedProduct.id = newProducts.length > 0 ? Math.max(...newProducts.map(p => p.id)) + 1 : 1;
        convertedProduct.image = uploadedImages[0] || '';
        convertedProduct.images = uploadedImages;
        
        newProducts.push(convertedProduct);
        console.log('✅ Добавлен товар:', convertedProduct.title);
        imported++;
      } else {
        console.log('⏭️ Товар уже существует:', ozonProduct.offer_id);
      }

      setImportProgress(Math.round(((imported + 1) / total) * 100));
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
              <OzonProductCard
                key={product.product_id}
                product={product}
                isSelected={selectedProducts.has(product.product_id)}
                onToggle={toggleProductSelection}
              />
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