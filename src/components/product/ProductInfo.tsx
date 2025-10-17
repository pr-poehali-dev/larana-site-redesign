import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/utils/formatPrice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ProductRating from './ProductRating';

interface ProductInfoProps {
  product: any;
  variants: any[];
  hasVariants: boolean;
  allAvailableColors: string[];
  selectedColor: string;
  quantity: number;
  slug: string;
  onColorChange: (color: string) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const ProductInfo = ({
  product,
  variants,
  hasVariants,
  allAvailableColors,
  selectedColor,
  quantity,
  slug,
  onColorChange,
  onQuantityChange,
  onAddToCart,
  onBuyNow
}: ProductInfoProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
        <div className="flex items-center gap-4 mb-4">
          <ProductRating rating={4.8} reviewsCount={24} showLink />
          {product.inStock ? (
            <Badge className="bg-green-500 text-white">
              <Icon name="Check" size={16} className="mr-1" />
              В наличии
            </Badge>
          ) : (
            <Badge variant="outline">
              Под заказ
            </Badge>
          )}
        </div>
      </div>

      <div className="border-t border-b py-6">
        <div className="text-5xl font-bold text-foreground mb-2">
          {formatPrice(product.price)}
        </div>
        <p className="text-sm text-muted-foreground">
          Цена за полный комплект
        </p>
      </div>

      {hasVariants && allAvailableColors.length > 1 && (
        <div>
          <h3 className="font-semibold mb-3">Выберите цвет:</h3>
          <div className="flex flex-wrap gap-2">
            {allAvailableColors.map((color) => {
              const variant = variants.find(v => v.colorVariant === color);
              const isCurrentColor = product.colorVariant === color;
              const isAvailable = variant?.inStock;
              
              return (
                <Button
                  key={color}
                  variant={isCurrentColor ? "default" : "outline"}
                  onClick={() => {
                    if (variant && variant.id !== product.id) {
                      navigate(`/catalog/${slug}/${variant.id}`);
                    }
                  }}
                  disabled={!isAvailable}
                  className="min-w-[120px] relative"
                >
                  {color}
                  {!isAvailable && (
                    <span className="ml-2 text-xs">(нет в наличии)</span>
                  )}
                </Button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Выбор цвета переключит на соответствующий товар с его ценой и артикулом
          </p>
        </div>
      )}

      {!hasVariants && product.colors && product.colors.length > 1 && (
        <div>
          <h3 className="font-semibold mb-3">Выберите цвет:</h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color: string) => (
              <Button
                key={color}
                variant={selectedColor === color ? "default" : "outline"}
                onClick={() => onColorChange(color)}
                className="min-w-[120px]"
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      )}

      {product.colors && product.colors.length === 1 && (
        <div>
          <h3 className="font-semibold mb-2">Цвет:</h3>
          <p className="text-muted-foreground">{product.colors[0]}</p>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-3">Количество:</h3>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          >
            <Icon name="Minus" size={16} />
          </Button>
          <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onQuantityChange(quantity + 1)}
          >
            <Icon name="Plus" size={16} />
          </Button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button size="lg" className="flex-1" onClick={onBuyNow}>
          Купить сейчас
        </Button>
        <Button size="lg" variant="outline" className="flex-1" onClick={onAddToCart}>
          <Icon name="ShoppingCart" size={20} className="mr-2" />
          В корзину
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Icon name="Truck" size={24} className="text-primary flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Бесплатная доставка</h4>
              <p className="text-sm text-muted-foreground">По Екатеринбургу, Верхняя Пышма, Среднеуральск</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="Wrench" size={24} className="text-primary flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Сборка под ключ</h4>
              <p className="text-sm text-muted-foreground">Профессиональная сборка за 1 день</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="Shield" size={24} className="text-primary flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Гарантия 2 года</h4>
              <p className="text-sm text-muted-foreground">На всю мебель и фурнитуру</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductInfo;
