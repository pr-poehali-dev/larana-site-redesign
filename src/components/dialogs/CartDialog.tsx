import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/utils/formatPrice';
import { smoothScrollToSection } from '@/utils/smoothScroll';
import { useNavigate } from 'react-router-dom';

interface FurnitureSet {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
  items: string[];
  style: string;
  description: string;
}

interface CartItem extends FurnitureSet {
  quantity: number;
}

interface CartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onCheckout: () => void;
}

const CartDialog = ({ 
  open, 
  onOpenChange, 
  items = [], 
  onRemoveItem, 
  onUpdateQuantity,
  onCheckout 
}: CartDialogProps) => {
  const navigate = useNavigate();
  
  const total = items.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Корзина покупок</DialogTitle>
          <DialogDescription>
            {items.length === 0 ? 'Ваша корзина пуста' : `Товаров в корзине: ${items.length}`}
          </DialogDescription>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="ShoppingCart" size={64} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Добавьте комплекты мебели в корзину</p>
            <Button onClick={() => {
              onOpenChange(false);
              navigate('/');
              setTimeout(() => smoothScrollToSection('catalog'), 300);
            }}>
              Перейти к каталогу
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400';
                          target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <Badge variant="outline" className="mb-2">{item.category}</Badge>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Icon name="Minus" size={14} />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Icon name="Plus" size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Icon name="X" size={18} />
                      </Button>
                      <p className="font-bold">{formatPrice(parseInt(item.price) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Товары ({items.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Доставка</span>
                <span className="text-green-600">Бесплатно</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-foreground"
              onClick={() => {
                onCheckout();
                onOpenChange(false);
              }}
            >
              <Icon name="CreditCard" size={20} className="mr-2" />
              Оформить заказ
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartDialog;