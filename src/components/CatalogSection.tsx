import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';

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

interface CatalogSectionProps {
  furnitureSets: FurnitureSet[];
  onSetClick: (set: FurnitureSet) => void;
  user: any;
}

const CatalogSection = ({ furnitureSets, onSetClick, user }: CatalogSectionProps) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
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
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    
    if (!user) return;

    const isFavorite = favorites.includes(productId);
    
    try {
      if (isFavorite) {
        const response = await fetch(`https://functions.poehali.dev/6a0f8438-1ca3-47e2-b774-67b3e2f5f037?productId=${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': user.email
          }
        });
        
        if (response.ok) {
          setFavorites(favorites.filter(id => id !== productId));
        }
      } else {
        const response = await fetch('https://functions.poehali.dev/6a0f8438-1ca3-47e2-b774-67b3e2f5f037', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': user.email
          },
          body: JSON.stringify({ productId })
        });
        
        if (response.ok) {
          setFavorites([...favorites, productId]);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <section id="catalog" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовые комплекты мебели</h2>
          <p className="text-lg text-muted-foreground">Всё необходимое для вашего дома в одном решении</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {furnitureSets.map((set) => (
            <Card key={set.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSetClick(set)}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={set.image} 
                  alt={set.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-white text-foreground">{set.category}</Badge>
                {user && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                    onClick={(e) => toggleFavorite(e, set.id)}
                  >
                    <Icon 
                      name="Heart" 
                      size={20} 
                      className={favorites.includes(set.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                    />
                  </Button>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{set.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {set.items.map((item, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{item}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{set.price}</span>
                  <Button className="bg-foreground hover:bg-foreground/90 text-background" onClick={(e) => { e.stopPropagation(); onSetClick(set); }}>
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;