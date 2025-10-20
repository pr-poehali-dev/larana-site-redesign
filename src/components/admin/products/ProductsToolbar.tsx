import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { clearProductCache } from '@/utils/productCache';
import { useToast } from '@/hooks/use-toast';

interface ProductsToolbarProps {
  activeProducts: any[];
  loadingProducts: boolean;
  lastSync: Date | null;
  dbProducts: any[];
  onNewProduct: () => void;
  onExport: () => void;
  onRefresh: () => void;
  onSyncToDB: () => void;
}

const ProductsToolbar = ({
  activeProducts,
  loadingProducts,
  lastSync,
  dbProducts,
  onNewProduct,
  onExport,
  onRefresh,
  onSyncToDB
}: ProductsToolbarProps) => {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <Button size="sm" onClick={onNewProduct}>
        <Icon name="Plus" size={16} className="mr-1" />
        Добавить товар
      </Button>
      <Button size="sm" variant="outline" onClick={onExport}>
        <Icon name="Download" size={16} className="mr-1" />
        Экспортировать
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={onRefresh}
        disabled={loadingProducts}
      >
        <Icon name="RefreshCw" size={16} className={`mr-1 ${loadingProducts ? 'animate-spin' : ''}`} />
        {loadingProducts ? 'Загрузка...' : 'Обновить из БД'}
      </Button>
      {lastSync && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Обновлено: {lastSync.toLocaleTimeString('ru-RU')}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs"
            onClick={() => {
              clearProductCache();
              toast({
                title: "Кэш очищен",
                description: "При следующей загрузке данные будут обновлены",
                duration: 2000
              });
            }}
          >
            <Icon name="Trash2" size={12} className="mr-1" />
            Очистить кэш
          </Button>
        </div>
      )}
      <Button 
        size="sm" 
        variant="default" 
        className="bg-green-600 hover:bg-green-700"
        onClick={onSyncToDB}
      >
        <Icon name="Database" size={16} className="mr-1" />
        Перенести в БД ({activeProducts.length})
      </Button>
    </div>
  );
};

export default ProductsToolbar;
