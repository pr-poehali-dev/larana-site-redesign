import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { smoothScrollToSection } from '@/utils/smoothScroll';

interface HeroSectionProps {
  onHelpOpen: () => void;
}

const HeroSection = ({ onHelpOpen }: HeroSectionProps) => {
  return (
    <section className="relative bg-secondary py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Мебель в наличии с доставкой по Екатеринбургу
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 animate-fade-in">
            Все товары в наличии на складе • Доставка за 1-2 дня • Рассрочка 0%
          </p>
          <div className="flex flex-wrap gap-3 mb-8 text-sm md:text-base">
            <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-lg">
              <Icon name="Truck" size={18} className="text-primary" />
              <span>Доставка по Екатеринбургу</span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-lg">
              <Icon name="Wrench" size={18} className="text-primary" />
              <span>Сборка под ключ</span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-lg">
              <Icon name="CreditCard" size={18} className="text-primary" />
              <span>Рассрочка 0%</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 animate-scale-in">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-foreground" onClick={() => smoothScrollToSection('catalog')}>
              <Icon name="ShoppingCart" size={20} className="mr-2" />
              Смотреть каталог
            </Button>
            <Button size="lg" variant="outline" onClick={onHelpOpen}>
              <Icon name="Phone" size={20} className="mr-2" />
              Заказать звонок
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;