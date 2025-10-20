import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ProductsActionsProps {
  onBulkUpdate: () => void;
  onBulkImport: () => void;
  onBulkStock: () => void;
  onBulkImages: () => void;
}

const ProductsActions = ({
  onBulkUpdate,
  onBulkImport,
  onBulkStock,
  onBulkImages
}: ProductsActionsProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Массовые операции</CardTitle>
          <CardDescription>Обновление товаров через Excel файлы</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            onClick={onBulkUpdate}
            variant="outline" 
            className="w-full justify-start"
            size="sm"
          >
            <Icon name="DollarSign" size={16} className="mr-2" />
            Обновить цены
          </Button>
          
          <Button 
            onClick={onBulkImport}
            variant="outline" 
            className="w-full justify-start"
            size="sm"
          >
            <Icon name="FileSpreadsheet" size={16} className="mr-2" />
            Импорт товаров
          </Button>
          
          <Button 
            onClick={onBulkStock}
            variant="outline" 
            className="w-full justify-start"
            size="sm"
          >
            <Icon name="Package" size={16} className="mr-2" />
            Обновить остатки
          </Button>
          
          <Button 
            onClick={onBulkImages}
            variant="outline" 
            className="w-full justify-start"
            size="sm"
          >
            <Icon name="Image" size={16} className="mr-2" />
            Импорт изображений
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Справка</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>• Нажмите на товар для редактирования</p>
          <p>• Используйте поиск для быстрого поиска</p>
          <p>• Фильтры помогут найти товары по наличию</p>
          <p>• Копируйте товары для быстрого создания похожих</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsActions;
