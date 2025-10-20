import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import BundleItemsEditor from './BundleItemsEditor';

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

interface BundleEditorProps {
  bundle: ProductBundle;
  products: any[];
  bundleTypes: string[];
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (bundle: ProductBundle) => void;
  loading: boolean;
}

const BundleEditor = ({ 
  bundle, 
  products, 
  bundleTypes, 
  onSave, 
  onCancel, 
  onUpdate,
  loading 
}: BundleEditorProps) => {
  const updateBundleItem = (index: number, field: keyof BundleItem, value: any) => {
    const newItems = [...bundle.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'supplier_article') {
      const product = products.find(p => 
        p.supplier_article === value || p.supplierArticle === value
      );
      if (product) {
        newItems[index].product_name = product.title;
      }
    }

    onUpdate({
      ...bundle,
      items: newItems
    });
  };

  const removeItemFromBundle = (index: number) => {
    onUpdate({
      ...bundle,
      items: bundle.items.filter((_, i) => i !== index)
    });
  };

  const addItemToBundle = () => {
    onUpdate({
      ...bundle,
      items: [
        ...bundle.items,
        {
          supplier_article: '',
          product_name: '',
          quantity: 1
        }
      ]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {bundle.id ? 'Редактирование набора' : 'Создание набора'}
        </h2>
        <Button
          variant="outline"
          onClick={onCancel}
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
              value={bundle.name}
              onChange={(e) => onUpdate({ ...bundle, name: e.target.value })}
              placeholder="Например: Спальня Модерн Белая"
            />
          </div>

          <div>
            <Label>Тип *</Label>
            <Select
              value={bundle.type}
              onValueChange={(value) => onUpdate({ ...bundle, type: value })}
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
              value={bundle.color}
              onChange={(e) => onUpdate({ ...bundle, color: e.target.value })}
              placeholder="Например: Белый, Венге"
            />
          </div>

          <div>
            <Label>Цена * (руб)</Label>
            <Input
              type="number"
              value={bundle.price}
              onChange={(e) => onUpdate({ ...bundle, price: parseFloat(e.target.value) })}
            />
          </div>

          <div>
            <Label>Изображение (URL)</Label>
            <Input
              value={bundle.image_url}
              onChange={(e) => onUpdate({ ...bundle, image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label>Описание</Label>
            <Textarea
              value={bundle.description}
              onChange={(e) => onUpdate({ ...bundle, description: e.target.value })}
              placeholder="Краткое описание набора"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <BundleItemsEditor
        items={bundle.items}
        products={products}
        onUpdateItem={updateBundleItem}
        onRemoveItem={removeItemFromBundle}
        onAddItem={addItemToBundle}
      />

      <div className="flex gap-3">
        <Button
          onClick={onSave}
          disabled={loading}
          size="lg"
        >
          <Icon name="Save" className="mr-2" size={16} />
          {loading ? 'Сохранение...' : 'Сохранить набор'}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          size="lg"
        >
          Отмена
        </Button>
      </div>
    </div>
  );
};

export default BundleEditor;