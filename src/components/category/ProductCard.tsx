import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { formatPrice } from '@/utils/formatPrice';

interface ProductCardProps {
  product: any;
  slug: string;
  onAddToCart: (product: any) => void;
}

const ProductCard = ({ product, slug, onAddToCart }: ProductCardProps) => {
  return (
    <article 
      itemScope 
      itemType="https://schema.org/Product"
    >
      <Link 
        to={`/catalog/${slug}/${product.id}`}
        className="block"
      >
        <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow h-full">
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                loading="lazy"
                itemProp="image"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800';
                  target.onerror = null;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon name="Image" size={64} className="text-muted-foreground/30" />
              </div>
            )}
            {product.inStock && (
              <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                В наличии
              </Badge>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors" itemProp="name">{product.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{product.width} • {product.material}</p>
            <div className="mb-3" itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <meta itemProp="priceCurrency" content="RUB" />
              <meta itemProp="price" content={typeof product.price === 'string' ? product.price.replace(/[^\d]/g, '') : product.price} />
              <link itemProp="availability" href={product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
              <div className="text-3xl font-bold text-foreground mb-2">{formatPrice(product.price)}</div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Icon name="Truck" size={14} />
                  <span>Доставка в подарок</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Wrench" size={14} />
                  <span>Монтаж включён</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Wallet" size={14} />
                  <span>Оплата при получении</span>
                </div>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}>
              <Icon name="ShoppingCart" size={18} className="mr-2" />
              В корзину
            </Button>
          </CardContent>
        </Card>
      </Link>
    </article>
  );
};

export default ProductCard;
