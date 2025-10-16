import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemsCount, onCartClick }: HeaderProps) => {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-foreground">LARANA</h1>
            <nav className="hidden md:flex gap-6">
              <a href="#catalog" className="text-sm hover:text-primary transition-colors">Каталог</a>
              <a href="#configurator" className="text-sm hover:text-primary transition-colors">Конфигуратор</a>
              <a href="#blog" className="text-sm hover:text-primary transition-colors">Блог</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Icon name="User" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
              <Icon name="ShoppingCart" size={20} />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-foreground text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;