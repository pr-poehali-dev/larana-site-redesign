import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
}

const CatalogSection = ({ furnitureSets, onSetClick }: CatalogSectionProps) => {
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-white text-foreground">{set.category}</Badge>
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
