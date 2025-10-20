import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import ProductEditor from './ProductEditor';
import BulkPriceUpdate from './BulkPriceUpdate';
import BulkProductImport from './BulkProductImport';
import BulkStockUpdate from './BulkStockUpdate';
import BulkImageImport from './BulkImageImport';
import ProductsToolbar from './products/ProductsToolbar';
import ProductsList from './products/ProductsList';
import ProductsActions from './products/ProductsActions';
import { useProductsData } from './products/useProductsData';

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
  const { toast } = useToast();

  const { dbProducts, loadingProducts, lastSync, loadProductsFromDB } = useProductsData(onProductUpdate);

  const activeProducts = dbProducts.length > 0 ? dbProducts : products;

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

  const syncToDB = async () => {
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
  };

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
      <div className="space-y-4">
        <ProductsToolbar
          activeProducts={activeProducts}
          loadingProducts={loadingProducts}
          lastSync={lastSync}
          dbProducts={dbProducts}
          onNewProduct={startNewProduct}
          onExport={exportProducts}
          onRefresh={() => loadProductsFromDB(true)}
          onSyncToDB={syncToDB}
        />

        <ProductsList
          filteredProducts={filteredProducts}
          loadingProducts={loadingProducts}
          dbProducts={dbProducts}
          lastSync={lastSync}
          searchQuery={searchQuery}
          stockFilter={stockFilter}
          onSearchChange={setSearchQuery}
          onStockFilterChange={setStockFilter}
          onProductClick={startEditProduct}
          onDuplicate={duplicateProduct}
        />
      </div>

      <div>
        {editingProduct && (
          <ProductEditor
            product={editingProduct}
            products={activeProducts}
            onProductUpdate={onProductUpdate}
            onClose={() => setEditingProduct(null)}
          />
        )}

        {showBulkUpdate && (
          <BulkPriceUpdate
            products={activeProducts}
            onProductsUpdate={onProductUpdate}
          />
        )}

        {showBulkImport && (
          <BulkProductImport
            products={activeProducts}
            onProductsUpdate={onProductUpdate}
          />
        )}

        {showBulkStock && (
          <BulkStockUpdate
            products={activeProducts}
            onProductsUpdate={onProductUpdate}
          />
        )}

        {showBulkImages && (
          <BulkImageImport
            products={activeProducts}
            onProductUpdate={onProductUpdate}
          />
        )}

        {!editingProduct && !showBulkUpdate && !showBulkImport && !showBulkStock && !showBulkImages && (
          <ProductsActions
            onBulkUpdate={openBulkUpdate}
            onBulkImport={openBulkImport}
            onBulkStock={openBulkStock}
            onBulkImages={openBulkImages}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsTab;
