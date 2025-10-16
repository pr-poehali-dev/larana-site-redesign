import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
  items: string[];
  style: string;
  description: string;
}

interface ProductCarouselProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCarousel = ({ products, onProductClick, onAddToCart }: ProductCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-4 md:px-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-none w-[85%] sm:w-[45%] lg:w-[30%] snap-start"
          >
            <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer group">
              <CardContent className="p-0">
                <div 
                  className="relative aspect-[4/3] overflow-hidden rounded-t-lg"
                  onClick={() => onProductClick(product)}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {product.price}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 
                      className="font-semibold text-lg mb-1 line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => onProductClick(product)}
                    >
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                    {product.items.length > 3 && (
                      <span className="text-xs bg-secondary px-2 py-1 rounded">
                        +{product.items.length - 3}
                      </span>
                    )}
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                  >
                    <Icon name="ShoppingCart" size={16} className="mr-2" />
                    В корзину
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Button
        variant="secondary"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg z-10 hidden md:flex"
        onClick={scrollPrev}
      >
        <Icon name="ChevronLeft" size={24} />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg z-10 hidden md:flex"
        onClick={scrollNext}
      >
        <Icon name="ChevronRight" size={24} />
      </Button>
    </div>
  );
};

export default ProductCarousel;
