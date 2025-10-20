import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import func2url from '@/../backend/func2url.json';
import BundlesList from './bundles/BundlesList';
import BundleEditor from './bundles/BundleEditor';

interface BundleItem {
  id?: number;
  supplier_article: string;
  product_name: string;
  quantity: number;
  in_stock?: boolean;
}

interface ProductBundle {
  id?: number;
  name: string;
  type: string;
  color: string;
  image_url: string;
  price: number;
  description: string;
  items: BundleItem[];
  in_stock?: boolean;
}

interface ProductBundlesTabProps {
  products: any[];
}

const ProductBundlesTab = ({ products }: ProductBundlesTabProps) => {
  const [bundles, setBundles] = useState<ProductBundle[]>([]);
  const [editingBundle, setEditingBundle] = useState<ProductBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { toast } = useToast();

  const bundleTypes = ['Спальня', 'Гостиная', 'Детская', 'Прихожая', 'Кухня'];

  useEffect(() => {
    loadBundles();
    loadProducts();
  }, []);

  const loadProducts = async () => {
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
        setDbProducts(data);
        console.log(`✅ Загружено товаров из БД: ${data.length}`);
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      toast({
        title: 'Предупреждение',
        description: 'Используются локальные данные товаров',
        variant: 'default'
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadBundles = async () => {
    setLoading(true);
    try {
      const response = await fetch(func2url['product-bundles'], {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBundles(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки наборов:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить наборы товаров',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const startNewBundle = () => {
    setEditingBundle({
      name: '',
      type: 'Спальня',
      color: '',
      image_url: '',
      price: 0,
      description: '',
      items: []
    });
  };

  const startEditBundle = (bundle: ProductBundle) => {
    setEditingBundle({ ...bundle });
  };

  const saveBundle = async () => {
    if (!editingBundle) return;

    if (!editingBundle.name || !editingBundle.type || !editingBundle.price) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля: название, тип и цена',
        variant: 'destructive'
      });
      return;
    }

    if (editingBundle.items.length === 0) {
      toast({
        title: 'Ошибка',
        description: 'Добавьте хотя бы один товар в набор',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const method = editingBundle.id ? 'PUT' : 'POST';
      const url = editingBundle.id 
        ? `${func2url['product-bundles']}?id=${editingBundle.id}`
        : func2url['product-bundles'];

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingBundle)
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: editingBundle.id ? 'Набор обновлён' : 'Набор создан'
        });
        setEditingBundle(null);
        loadBundles();
      } else {
        throw new Error('Ошибка сохранения');
      }
    } catch (error) {
      console.error('Ошибка сохранения набора:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить набор',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBundle = async (bundleId: number) => {
    if (!confirm('Удалить набор?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${func2url['product-bundles']}?id=${bundleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Набор удалён'
        });
        loadBundles();
      }
    } catch (error) {
      console.error('Ошибка удаления набора:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить набор',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (editingBundle) {
    const productsToUse = dbProducts.length > 0 ? dbProducts : products;
    
    return (
      <div className="space-y-4">
        {loadingProducts && (
          <div className="text-sm text-muted-foreground">
            Загрузка товаров из базы данных...
          </div>
        )}
        {!loadingProducts && dbProducts.length > 0 && (
          <div className="text-sm text-green-600">
            ✅ Товаров в базе: {dbProducts.length}
          </div>
        )}
        <BundleEditor
          bundle={editingBundle}
          products={productsToUse}
          bundleTypes={bundleTypes}
          onSave={saveBundle}
          onCancel={() => setEditingBundle(null)}
          onUpdate={setEditingBundle}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <BundlesList
      bundles={bundles}
      loading={loading}
      onNew={startNewBundle}
      onEdit={startEditBundle}
      onDelete={deleteBundle}
    />
  );
};

export default ProductBundlesTab;