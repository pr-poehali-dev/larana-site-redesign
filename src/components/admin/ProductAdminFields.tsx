import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface ProductAdminFieldsProps {
  supplierArticle: string;
  stockQuantity: number | null;
  inStock: boolean;
  onSupplierArticleChange: (value: string) => void;
  onStockQuantityChange: (value: number | null) => void;
  onInStockChange: (value: boolean) => void;
}

const ProductAdminFields = ({ 
  supplierArticle, 
  stockQuantity, 
  inStock,
  onSupplierArticleChange,
  onStockQuantityChange,
  onInStockChange
}: ProductAdminFieldsProps) => {
  return (
    <>
      <div className="border-t pt-3 space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Icon name="Database" size={16} />
          Служебные данные (не публикуются)
        </h4>
        
        <div>
          <Label>Артикул поставщика</Label>
          <Input
            value={supplierArticle}
            onChange={(e) => onSupplierArticleChange(e.target.value)}
            placeholder="Артикул из системы поставщика"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Для автоматизации синхронизации остатков
          </p>
        </div>

        <div>
          <Label>Количество на складе</Label>
          <Input
            type="number"
            min="0"
            inputMode="numeric"
            value={stockQuantity === null ? '' : stockQuantity}
            onChange={(e) => {
              const val = e.target.value;
              onStockQuantityChange(val === '' ? null : parseInt(val, 10));
            }}
            placeholder="Оставьте пустым, если неизвестно"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Точное количество для автоматического учёта
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="inStock"
            checked={inStock}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="inStock">В наличии</Label>
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-6">
          Используйте галочку, если не знаете точное количество
        </p>
      </div>
    </>
  );
};

export default ProductAdminFields;