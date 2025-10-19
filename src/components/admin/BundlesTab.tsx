import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import func2url from '@/../backend/func2url.json';

interface BundleItem {
  supplier_article: string;
  product_name: string;
  quantity: number;
}

interface Bundle {
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

export default function BundlesTab() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Bundle>({
    name: '',
    type: 'спальня',
    color: '',
    image_url: '',
    price: 0,
    description: '',
    items: []
  });

  const [newItem, setNewItem] = useState<BundleItem>({
    supplier_article: '',
    product_name: '',
    quantity: 1
  });

  useEffect(() => {
    loadBundles();
  }, []);

  const loadBundles = async () => {
    setLoading(true);
    try {
      const response = await fetch(func2url['product-bundles']);
      if (response.ok) {
        const data = await response.json();
        setBundles(data);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить наборы',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingBundle 
        ? `${func2url['product-bundles']}?id=${editingBundle.id}`
        : func2url['product-bundles'];
      
      const method = editingBundle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: editingBundle ? 'Набор обновлён' : 'Набор создан'
        });
        setDialogOpen(false);
        resetForm();
        loadBundles();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить набор',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить набор?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${func2url['product-bundles']}?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Набор удалён'
        });
        loadBundles();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить набор',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setFormData(bundle);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'спальня',
      color: '',
      image_url: '',
      price: 0,
      description: '',
      items: []
    });
    setNewItem({
      supplier_article: '',
      product_name: '',
      quantity: 1
    });
    setEditingBundle(null);
  };

  const addItemToBundle = () => {
    if (!newItem.supplier_article || !newItem.product_name) {
      toast({
        title: 'Ошибка',
        description: 'Заполните артикул и название товара',
        variant: 'destructive'
      });
      return;
    }

    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });

    setNewItem({
      supplier_article: '',
      product_name: '',
      quantity: 1
    });
  };

  const removeItemFromBundle = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Наборы товаров</h3>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="Plus" size={16} className="mr-2" />
              Создать набор
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBundle ? 'Редактировать набор' : 'Создать набор'}</DialogTitle>
              <DialogDescription>
                Укажите параметры набора и добавьте товары по артикулам поставщика
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Название комплекта</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Спальня Классик"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Тип</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="спальня">Спальня</SelectItem>
                      <SelectItem value="гостиная">Гостиная</SelectItem>
                      <SelectItem value="детская">Детская</SelectItem>
                      <SelectItem value="прихожая">Прихожая</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Цвет</Label>
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Белый, Коричневый"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Цена (₽)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Изображение (URL)</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Описание</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Комплект мебели для спальни"
                />
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold">Комплектация</h4>
                
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label className="text-xs">Артикул поставщика</Label>
                    <Input
                      value={newItem.supplier_article}
                      onChange={(e) => setNewItem({ ...newItem, supplier_article: e.target.value })}
                      placeholder="A-12345"
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-5">
                    <Label className="text-xs">Название для покупателя</Label>
                    <Input
                      value={newItem.product_name}
                      onChange={(e) => setNewItem({ ...newItem, product_name: e.target.value })}
                      placeholder="Кровать двуспальная"
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Кол-во</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button type="button" size="sm" onClick={addItemToBundle} className="w-full">
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </div>

                {formData.items.length > 0 && (
                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                          <span className="font-mono text-xs">{item.supplier_article}</span>
                          <span>{item.product_name}</span>
                          <span className="text-muted-foreground">× {item.quantity}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItemFromBundle(index)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={loading || formData.items.length === 0}>
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && bundles.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Загрузка...</div>
      ) : bundles.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Наборов пока нет. Создайте первый набор!
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Цвет</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Состав</TableHead>
              <TableHead>Наличие</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bundles.map((bundle) => (
              <TableRow key={bundle.id}>
                <TableCell className="font-medium">{bundle.name}</TableCell>
                <TableCell className="capitalize">{bundle.type}</TableCell>
                <TableCell>{bundle.color}</TableCell>
                <TableCell>{bundle.price} ₽</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {bundle.items?.length || 0} товаров
                </TableCell>
                <TableCell>
                  {bundle.in_stock ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Icon name="CheckCircle" size={16} />
                      В наличии
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <Icon name="XCircle" size={16} />
                      Нет в наличии
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(bundle)}
                    >
                      <Icon name="Pencil" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(bundle.id!)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
