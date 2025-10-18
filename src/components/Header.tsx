import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useLocation } from 'react-router-dom';
import { handleSmoothNavigation } from '@/utils/smoothScroll';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onAuthClick: () => void;
  user: any;
  onLogout: () => void;
  onOrdersClick: () => void;
  onProfileClick: () => void;
  onFavoritesClick: () => void;
  onAdminClick?: () => void;
}

const Header = ({ cartItemsCount, onCartClick, onAuthClick, user, onLogout, onOrdersClick, onProfileClick, onFavoritesClick, onAdminClick }: HeaderProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { href: '/', label: 'Главная', exact: true },
    { 
      href: '/catalog', 
      label: 'Каталог', 
      exact: false,
      submenu: [
        { href: '/catalog/gostinaya', label: 'Гостиные' },
        { href: '/catalog/spalnya', label: 'Спальни' },
        { href: '/catalog/kuhni', label: 'Кухни' },
        { href: '/catalog/shkafy', label: 'Шкафы' },
        { href: '/catalog/prihozhaya', label: 'Прихожие' },
        { href: '/catalog', label: 'Все категории' }
      ]
    },
    { href: '/delivery', label: 'Доставка', exact: true },
    { href: '/about', label: 'О нас', exact: true },
    { href: '/blog', label: 'Блог', exact: true },
    { href: '/faq', label: 'FAQ', exact: true },
    { href: '/contacts', label: 'Контакты', exact: true },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return currentPath === href;
    }
    return href.includes('#') && currentPath === '/';
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/8e9a575f-fd1c-4d40-821a-4154a78e1d00.jpg" 
                alt="LARANA" 
                className="h-16 md:h-20 w-auto"
              />
            </a>
            <nav className="hidden md:flex gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.includes('#')) {
                      e.preventDefault();
                      handleSmoothNavigation(link.href);
                    }
                  }}
                  className={`text-sm transition-colors font-medium ${
                    isActive(link.href, link.exact)
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Icon name="Menu" size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Меню</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  {navLinks.map((link) => (
                    <div key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          if (link.href.includes('#')) {
                            e.preventDefault();
                            handleSmoothNavigation(link.href);
                          }
                        }}
                        className={`text-base py-2 px-3 rounded-md transition-colors block ${
                          isActive(link.href, link.exact)
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'text-foreground hover:bg-accent'
                        }`}
                      >
                        {link.label}
                      </a>
                      {link.submenu && (
                        <div className="ml-4 mt-2 space-y-1 border-l-2 border-primary/20 pl-3">
                          {link.submenu.map((sublink) => (
                            <a
                              key={sublink.href}
                              href={sublink.href}
                              className={`text-sm py-2 px-3 rounded-md transition-colors flex items-center gap-2 ${
                                currentPath === sublink.href
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                              }`}
                            >
                              <Icon name="ChevronRight" size={14} />
                              {sublink.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
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
                  <DropdownMenuItem onClick={onFavoritesClick}>
                    <Icon name="Heart" size={16} className="mr-2" />
                    Избранное
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onAdminClick}>
                        <Icon name="Shield" size={16} className="mr-2" />
                        Админ-панель
                      </DropdownMenuItem>
                    </>
                  )}
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