import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface BundleItem {
  id?: number;
  supplier_article: string;
  product_name: string;
  quantity: number;
  in_stock?: boolean;
}

interface BundleItemsEditorProps {
  items: BundleItem[];
  products: any[];
  onUpdateItem: (index: number, field: keyof BundleItem, value: any) => void;
  onRemoveItem: (index: number) => void;
  onAddItem: () => void;
}

const BundleItemsEditor = ({ 
  items, 
  products, 
  onUpdateItem, 
  onRemoveItem, 
  onAddItem 
}: BundleItemsEditorProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Состав набора</CardTitle>
          <Button onClick={onAddItem} size="sm">
            <Icon name="Plus" className="mr-2" size={16} />
            Добавить товар
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Package" className="mx-auto mb-2" size={48} />
            <p>Добавьте товары в набор</p>
          </div>
        ) : (
          items.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4">
                  <Label>Артикул поставщика</Label>
                  <Input
                    value={item.supplier_article}
                    onChange={(e) => onUpdateItem(index, 'supplier_article', e.target.value)}
                    placeholder="Введите артикул"
                    list={`articles-${index}`}
                  />
                  <datalist id={`articles-${index}`}>
                    {products.map(p => (
                      <option key={p.supplierArticle} value={p.supplierArticle}>
                        {p.title}
                      </option>
                    ))}
                  </datalist>
                </div>

                <div className="md:col-span-4">
                  <Label>Название товара</Label>
                  <Input
                    value={item.product_name}
                    onChange={(e) => onUpdateItem(index, 'product_name', e.target.value)}
                    placeholder="Автоматически из артикула"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Количество</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(index, 'quantity', parseInt(e.target.value))}
                  />
                </div>

                <div className="md:col-span-2 flex gap-2">
                  {item.in_stock === false && (
                    <Badge variant="destructive" className="h-fit">
                      Нет в наличии
                    </Badge>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onRemoveItem(index)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default BundleItemsEditor;
