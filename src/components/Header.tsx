import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onAuthClick: () => void;
  user: any;
  onLogout: () => void;
  onOrdersClick: () => void;
  onProfileClick: () => void;
}

const Header = ({ cartItemsCount, onCartClick, onAuthClick, user, onLogout, onOrdersClick, onProfileClick }: HeaderProps) => {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/8e9a575f-fd1c-4d40-821a-4154a78e1d00.jpg" 
                alt="LARANA" 
                className="h-16 md:h-20 w-auto"
              />
            </a>
            <nav className="hidden md:flex gap-6">
              <a href="#catalog" className="text-sm hover:text-primary transition-colors">Каталог</a>
              <a href="#configurator" className="text-sm hover:text-primary transition-colors">Конфигуратор</a>
              <a href="#blog" className="text-sm hover:text-primary transition-colors">Блог</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Icon name="User" size={20} />
                    <span className="hidden md:inline text-sm">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onProfileClick}>
                    <Icon name="Settings" size={16} className="mr-2" />
                    Настройки профиля
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onOrdersClick}>
                    <Icon name="Package" size={16} className="mr-2" />
                    Мои заказы
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon name="Heart" size={16} className="mr-2" />
                    Избранное
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-destructive">
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={onAuthClick}>
                <Icon name="User" size={20} />
              </Button>
            )}
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