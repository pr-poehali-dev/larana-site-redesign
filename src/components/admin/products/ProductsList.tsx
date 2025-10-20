import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { formatPrice } from '@/utils/formatPrice';

interface ProductsListProps {
  filteredProducts: any[];
  loadingProducts: boolean;
  dbProducts: any[];
  lastSync: Date | null;
  searchQuery: string;
  stockFilter: 'all' | 'in' | 'out';
  onSearchChange: (value: string) => void;
  onStockFilterChange: (filter: 'all' | 'in' | 'out') => void;
  onProductClick: (product: any) => void;
  onDuplicate: (product: any, e: React.MouseEvent) => void;
}

const ProductsList = ({
  filteredProducts,
  loadingProducts,
  dbProducts,
  lastSync,
  searchQuery,
  stockFilter,
  onSearchChange,
  onStockFilterChange,
  onProductClick,
  onDuplicate
}: ProductsListProps) => {
  return (
    <ScrollArea className="h-[500px] xl:h-[600px] pr-4">
      <div className="space-y-2 pr-2">
        <div className="space-y-2 mb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm md:text-base">Список товаров</h3>
              {loadingProducts && (
                <span className="text-xs text-muted-foreground">Загрузка из БД...</span>
              )}
              {!loadingProducts && dbProducts.length > 0 && lastSync && (
                <Badge variant="outline" className="text-xs">
                  БД: {dbProducts.length} шт | {(() => {
                    const age = Date.now() - lastSync.getTime();
                    const minutes = Math.floor(age / 60000);
                    return minutes < 1 ? 'только что' : `${minutes}м назад`;
                  })()}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Button 
            size="sm" 
            variant={stockFilter === 'all' ? 'default' : 'outline'}
            onClick={() => onStockFilterChange('all')}
          >
            Все ({filteredProducts.length})
          </Button>
          <Button 
            size="sm" 
            variant={stockFilter === 'in' ? 'default' : 'outline'}
            onClick={() => onStockFilterChange('in')}
          >
            <Icon name="CheckCircle" size={14} className="mr-1" />
            В наличии
          </Button>
          <Button 
            size="sm" 
            variant={stockFilter === 'out' ? 'default' : 'outline'}
            onClick={() => onStockFilterChange('out')}
          >
            <Icon name="XCircle" size={14} className="mr-1" />
            Нет в наличии
          </Button>
        </div>

        {filteredProducts.map((product) => (
          <Card 
            key={product.id}
            className="cursor-pointer hover:border-primary/50 transition-all"
            onClick={() => onProductClick(product)}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                {product.image && (
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1 truncate">{product.title}</h4>
                      <div className="flex flex-wrap gap-1 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        {product.supplierArticle && (
                          <Badge variant="outline" className="text-xs">
                            {product.supplierArticle}
                          </Badge>
                        )}
                        {!product.inStock && (
                          <Badge variant="destructive" className="text-xs">
                            Нет в наличии
                          </Badge>
                        )}
                        {product.stockQuantity !== null && product.stockQuantity !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            {product.stockQuantity} шт
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => onDuplicate(product, e)}
                      className="shrink-0"
                    >
                      <Icon name="Copy" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ProductsList;
