import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatPrice } from '@/utils/formatPrice';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface FavoritesDialogProps {
  open: boolean;
  onClose: () => void;
  user: any;
  allProducts: any[];
  onProductClick: (product: any) => void;
}

const FavoritesDialog = ({ open, onClose, user, allProducts, onProductClick }: FavoritesDialogProps) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && user) {
      fetchFavorites();
    }
  }, [open, user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/6a0f8438-1ca3-47e2-b774-67b3e2f5f037', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.email
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavoriteIds(data.favorites || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const response = await fetch(`https://functions.poehali.dev/6a0f8438-1ca3-47e2-b774-67b3e2f5f037?productId=${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.email
        }
      });
      
      if (response.ok) {
        setFavoriteIds(favoriteIds.filter(id => id !== productId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const favoriteProducts = allProducts.filter(product => favoriteIds.includes(product.id));

  const shareLink = () => {
    const shareableIds = favoriteIds.join(',');
    const url = `${window.location.origin}?favorites=${shareableIds}`;
    
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Ссылка скопирована!",
        description: "Отправьте её друзьям, чтобы поделиться избранным",
      });
    }).catch(() => {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать ссылку",
        variant: "destructive"
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Избранные товары</DialogTitle>
          <DialogDescription>
            Ваша коллекция понравившихся товаров
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Загрузка...</div>
            </div>
          ) : favoriteProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="Heart" size={48} className="text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">У вас пока нет избранных товаров</p>
              <p className="text-muted-foreground mb-4">
                Добавляйте товары в избранное, чтобы быстро находить их позже
              </p>
              <Button onClick={onClose}>Перейти к каталогу</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    onProductClick(product);
                    onClose();
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="Image" size={48} className="text-muted-foreground/30" />
                      </div>
                    )}
                    <Badge className="absolute top-2 left-2 bg-white text-foreground text-xs">
                      {product.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      onClick={(e) => removeFavorite(product.id, e)}
                    >
                      <Icon 
                        name="Heart" 
                        size={18} 
                        className="fill-red-500 text-red-500"
                      />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-sm line-clamp-1">{product.title}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.items.slice(0, 2).map((item: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                      {product.items.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.items.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="mb-3">
                      <div className="text-2xl font-bold text-foreground mb-2">{formatPrice(product.price)}</div>
                      <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Icon name="Truck" size={12} />
                          <span>Доставка в подарок</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Shield" size={12} />
                          <span>Гарантия 12 мес</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductClick(product);
                        onClose();
                      }}
                    >
                      Подробнее
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        {favoriteProducts.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Всего избранных: <span className="font-semibold text-foreground">{favoriteProducts.length}</span>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={shareLink}>
                <Icon name="Share2" size={16} className="mr-2" />
                Поделиться
              </Button>
              <Button variant="outline" onClick={onClose}>
                Закрыть
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FavoritesDialog;