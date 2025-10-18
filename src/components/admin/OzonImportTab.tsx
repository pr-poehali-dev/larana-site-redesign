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
import FieldMappingDialog, { FieldMapping } from './ozon/FieldMappingDialog';

const OzonImportTab = ({ products: catalogProducts, onProductsUpdate }: OzonImportTabProps) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<OzonProduct[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [mappingDialogOpen, setMappingDialogOpen] = useState(false);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
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
    // Используем прямые URL с Озона - они публичные и работают
    console.log('📸 Используем прямой URL изображения Ozon:', imageUrl);
    return imageUrl;
  };

  const handleImportClick = () => {
    if (selectedProducts.size === 0) {
      toast({
        title: "Выберите товары",
        description: "Отметьте товары для импорта",
        variant: "destructive"
      });
      return;
    }

    setMappingDialogOpen(true);
  };

  const handleMappingConfirm = (mappings: FieldMapping[]) => {
    setFieldMappings(mappings);
    importSelected(mappings);
  };

  const importSelected = async (mappings: FieldMapping[]) => {
    console.log('🚀 Начало импорта с маппингом:', mappings);
    console.log('Выбрано товаров:', selectedProducts.size);
    console.log('Текущий каталог:', catalogProducts.length, 'товаров');

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
        const ozonImages = ozonProduct.images?.map(img => img.url).filter(url => url) || [];
        const uploadedImages: string[] = [];

        for (const imageUrl of ozonImages) {
          const uploadedUrl = await uploadImageFromUrl(imageUrl);
          uploadedImages.push(uploadedUrl);
        }

        const convertedProduct = convertOzonToProduct(ozonProduct, newProducts, mappings);
        convertedProduct.id = newProducts.length > 0 ? Math.max(...newProducts.map(p => p.id)) + 1 : 1;
        
        if (uploadedImages.length > 0) {
          convertedProduct.image = uploadedImages[0];
          convertedProduct.images = uploadedImages;
        }
        
        console.log('📸 Изображения товара:', {
          title: convertedProduct.title,
          mainImage: convertedProduct.image,
          allImages: convertedProduct.images,
          imageCount: convertedProduct.images?.length || 0,
          hasMainImage: !!convertedProduct.image
        });
        
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
                  onClick={handleImportClick}
                  disabled={selectedProducts.size === 0 || loading}
                  className="gap-2 w-full sm:w-auto text-xs md:text-sm"
                  size="sm"
                >
                  <Icon name="Upload" size={16} className="md:w-4 md:h-4" />
                  Импорт ({selectedProducts.size})
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setMappingDialogOpen(true)}
                  className="gap-2 w-full sm:w-auto text-xs md:text-sm"
                  size="sm"
                >
                  <Icon name="Settings2" size={16} className="md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Настройки импорта</span>
                  <span className="sm:hidden">Настройки</span>
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

      <FieldMappingDialog
        open={mappingDialogOpen}
        onOpenChange={setMappingDialogOpen}
        onConfirm={handleMappingConfirm}
        sampleProduct={products.length > 0 ? products[0] : undefined}
      />
    </div>
  );
};

export default OzonImportTab;