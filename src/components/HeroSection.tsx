import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { smoothScrollToSection } from '@/utils/smoothScroll';

interface HeroSectionProps {
  onConfiguratorOpen: () => void;
  onHelpOpen: () => void;
}

const HeroSection = ({ onConfiguratorOpen, onHelpOpen }: HeroSectionProps) => {
  return (
    <section className="relative bg-secondary py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Готовые интерьеры под ключ.<br />Не думай — живи
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in">
            Дом начинается с мебели. Мебель — с LARANA
          </p>
          <div className="flex flex-wrap gap-4 animate-scale-in">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-foreground" onClick={() => smoothScrollToSection('configurator')}>
              <Icon name="Package" size={20} className="mr-2" />
              Выбрать комплект
            </Button>
            <Button size="lg" variant="outline" onClick={onHelpOpen}>
              <Icon name="Phone" size={20} className="mr-2" />
              Помощь с выбором
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;