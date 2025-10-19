import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import func2url from '@/../backend/func2url.json';
import { formatPrice } from '@/utils/formatPrice';

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
  const { toast } = useToast();

  const bundleTypes = ['Спальня', 'Гостиная', 'Детская', 'Прихожая', 'Кухня'];

  useEffect(() => {
    loadBundles();
  }, []);

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

  const addItemToBundle = () => {
    if (!editingBundle) return;
    
    setEditingBundle({
      ...editingBundle,
      items: [
        ...editingBundle.items,
        {
          supplier_article: '',
          product_name: '',
          quantity: 1
        }
      ]
    });
  };

  const updateBundleItem = (index: number, field: keyof BundleItem, value: any) => {
    if (!editingBundle) return;

    const newItems = [...editingBundle.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'supplier_article') {
      const product = products.find(p => p.supplierArticle === value);
      if (product) {
        newItems[index].product_name = product.title;
      }
    }

    setEditingBundle({
      ...editingBundle,
      items: newItems
    });
  };

  const removeItemFromBundle = (index: number) => {
    if (!editingBundle) return;
    
    setEditingBundle({
      ...editingBundle,
      items: editingBundle.items.filter((_, i) => i !== index)
    });
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
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {editingBundle.id ? 'Редактирование набора' : 'Создание набора'}
          </h2>
          <Button
            variant="outline"
            onClick={() => setEditingBundle(null)}
          >
            <Icon name="X" className="mr-2" size={16} />
            Отмена
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Основные параметры</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Название комплекта *</Label>
              <Input
                value={editingBundle.name}
                onChange={(e) => setEditingBundle({ ...editingBundle, name: e.target.value })}
                placeholder="Например: Спальня Модерн Белая"
              />
            </div>

            <div>
              <Label>Тип *</Label>
              <Select
                value={editingBundle.type}
                onValueChange={(value) => setEditingBundle({ ...editingBundle, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bundleTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Цвет</Label>
              <Input
                value={editingBundle.color}
                onChange={(e) => setEditingBundle({ ...editingBundle, color: e.target.value })}
                placeholder="Например: Белый, Венге"
              />
            </div>

            <div>
              <Label>Цена * (руб)</Label>
              <Input
                type="number"
                value={editingBundle.price}
                onChange={(e) => setEditingBundle({ ...editingBundle, price: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <Label>Изображение (URL)</Label>
              <Input
                value={editingBundle.image_url}
                onChange={(e) => setEditingBundle({ ...editingBundle, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label>Описание</Label>
              <Input
                value={editingBundle.description}
                onChange={(e) => setEditingBundle({ ...editingBundle, description: e.target.value })}
                placeholder="Краткое описание набора"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Комплектация набора</CardTitle>
            <Button onClick={addItemToBundle} size="sm">
              <Icon name="Plus" className="mr-2" size={16} />
              Добавить товар
            </Button>
          </CardHeader>
          <CardContent>
            {editingBundle.items.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Добавьте товары в комплект
              </p>
            ) : (
              <div className="space-y-4">
                {editingBundle.items.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                          <Label>Артикул поставщика *</Label>
                          <Select
                            value={item.supplier_article}
                            onValueChange={(value) => updateBundleItem(index, 'supplier_article', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите товар" />
                            </SelectTrigger>
                            <SelectContent>
                              {products
                                .filter(p => p.supplierArticle)
                                .map(product => (
                                  <SelectItem key={product.id} value={product.supplierArticle}>
                                    {product.supplierArticle} - {product.title}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Количество</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateBundleItem(index, 'quantity', parseInt(e.target.value))}
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeItemFromBundle(index)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>

                      {item.product_name && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Покупатель увидит: {item.product_name}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={saveBundle} disabled={loading}>
            <Icon name="Save" className="mr-2" size={16} />
            {loading ? 'Сохранение...' : 'Сохранить набор'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setEditingBundle(null)}
          >
            Отмена
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Наборы товаров</h2>
        <Button onClick={startNewBundle}>
          <Icon name="Plus" className="mr-2" size={16} />
          Создать набор
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      ) : bundles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Icon name="Package" className="mx-auto mb-4" size={48} />
            <p className="text-muted-foreground mb-4">
              Наборы товаров не созданы
            </p>
            <Button onClick={startNewBundle}>
              <Icon name="Plus" className="mr-2" size={16} />
              Создать первый набор
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bundles.map((bundle) => (
              <Card key={bundle.id} className="overflow-hidden">
                {bundle.image_url && (
                  <img
                    src={bundle.image_url}
                    alt={bundle.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{bundle.name}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{bundle.type}</Badge>
                        {bundle.color && <Badge variant="secondary">{bundle.color}</Badge>}
                        {bundle.in_stock ? (
                          <Badge variant="default">В наличии</Badge>
                        ) : (
                          <Badge variant="destructive">Нет в наличии</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-4">
                    {formatPrice(bundle.price)}
                  </p>

                  {bundle.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {bundle.description}
                    </p>
                  )}

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Состав набора:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {bundle.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Icon 
                            name={item.in_stock ? "Check" : "X"} 
                            size={14} 
                            className={item.in_stock ? "text-green-500" : "text-red-500"} 
                          />
                          {item.product_name} {item.quantity > 1 && `(${item.quantity} шт)`}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditBundle(bundle)}
                      className="flex-1"
                    >
                      <Icon name="Edit" size={14} className="mr-2" />
                      Изменить
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => bundle.id && deleteBundle(bundle.id)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ProductBundlesTab;
