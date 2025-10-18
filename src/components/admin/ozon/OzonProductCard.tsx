import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OzonProduct } from './types';

interface OzonProductCardProps {
  product: OzonProduct;
  isSelected: boolean;
  onToggle: (productId: number) => void;
}

const OzonProductCard = ({ product, isSelected, onToggle }: OzonProductCardProps) => {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'hover:border-gray-400'
      }`}
      onClick={() => onToggle(product.product_id)}
    >
      <CardContent className="p-2 md:p-4">
        <div className="flex gap-2 md:gap-4">
          <div className="flex items-center flex-shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(product.product_id)}
              className="w-4 h-4 md:w-5 md:h-5 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {product.images?.[0] && (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-12 h-12 md:w-20 md:h-20 object-cover rounded flex-shrink-0 bg-secondary/20"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}

          <div className="flex-1 space-y-1 md:space-y-2 min-w-0">
            <div className="flex items-start justify-between gap-2 md:gap-4">
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-xs md:text-sm line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                  ID: {product.product_id} • Арт: {product.offer_id}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg">
                  {product.price} {product.currency_code}
                </p>
                {product.old_price && product.old_price !== product.price && (
                  <p className="text-xs text-muted-foreground line-through">
                    {product.old_price}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 md:gap-2 text-[10px] md:text-xs">
              <Badge variant={product.visible ? "default" : "secondary"}>
                {product.visible ? 'Опубликован' : 'Не опубликован'}
              </Badge>

              {product.stocks && (
                <Badge variant="outline">
                  На складе: {product.stocks.present}
                </Badge>
              )}

              {product.color && (
                <Badge variant="outline" className="bg-blue-50">
                  Цвет: {product.color}
                </Badge>
              )}

              {product.modelName && (
                <Badge variant="outline" className="bg-purple-50">
                  Модель: {product.modelName}
                </Badge>
              )}

              {product.images && product.images.length > 1 && (
                <Badge variant="outline" className="bg-green-50">
                  Фото: {product.images.length}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OzonProductCard;