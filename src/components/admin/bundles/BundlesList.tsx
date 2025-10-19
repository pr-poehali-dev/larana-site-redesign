import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
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

interface BundlesListProps {
  bundles: ProductBundle[];
  loading: boolean;
  onNew: () => void;
  onEdit: (bundle: ProductBundle) => void;
  onDelete: (bundleId: number) => void;
}

const BundlesList = ({ bundles, loading, onNew, onEdit, onDelete }: BundlesListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Наборы товаров</h2>
        <Button onClick={onNew}>
          <Icon name="Plus" className="mr-2" size={16} />
          Создать набор
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Icon name="Loader2" className="mx-auto animate-spin mb-4" size={48} />
          <p className="text-muted-foreground">Загрузка наборов...</p>
        </div>
      ) : bundles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Icon name="Package" className="mx-auto mb-4 text-muted-foreground" size={64} />
            <h3 className="text-xl font-semibold mb-2">Наборы не найдены</h3>
            <p className="text-muted-foreground mb-6">
              Создайте первый набор товаров
            </p>
            <Button onClick={onNew}>
              <Icon name="Plus" className="mr-2" size={16} />
              Создать набор
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bundles.map((bundle) => (
            <Card key={bundle.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{bundle.name}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{bundle.type}</Badge>
                      {bundle.color && <Badge variant="outline">{bundle.color}</Badge>}
                      {bundle.in_stock === false ? (
                        <Badge variant="destructive">Нет в наличии</Badge>
                      ) : (
                        <Badge variant="default">В наличии</Badge>
                      )}
                    </div>
                  </div>
                  {bundle.image_url && (
                    <img 
                      src={bundle.image_url} 
                      alt={bundle.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Цена набора:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(bundle.price)}
                  </span>
                </div>

                {bundle.description && (
                  <p className="text-sm text-muted-foreground">{bundle.description}</p>
                )}

                <div>
                  <p className="text-sm font-semibold mb-2">
                    Состав ({bundle.items.length} {bundle.items.length === 1 ? 'товар' : 'товаров'}):
                  </p>
                  <ScrollArea className="h-32 rounded-md border p-3">
                    <div className="space-y-2">
                      {bundle.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex-1">
                            <span className="font-medium">{item.product_name || item.supplier_article}</span>
                            {item.in_stock === false && (
                              <Badge variant="destructive" className="ml-2 text-xs">
                                Нет в наличии
                              </Badge>
                            )}
                          </div>
                          <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => onEdit(bundle)}
                  >
                    <Icon name="Edit" className="mr-2" size={16} />
                    Редактировать
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => bundle.id && onDelete(bundle.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BundlesList;
