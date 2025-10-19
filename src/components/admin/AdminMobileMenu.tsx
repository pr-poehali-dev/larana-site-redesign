import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface AdminMobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminMobileMenu = ({ open, onOpenChange, activeTab, onTabChange }: AdminMobileMenuProps) => {
  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    onOpenChange(false);
  };

  return (
    <div className="md:hidden mb-4">
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            <Icon name="Menu" size={16} className="mr-2" />
            Меню
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] p-4">
          <div className="flex flex-col gap-2 mt-8">
            <Button
              variant={activeTab === 'statistics' ? 'default' : 'ghost'}
              className="justify-start"
              onClick={() => handleTabClick('statistics')}
            >
              <Icon name="BarChart3" size={16} className="mr-2" />
              Статистика
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              className="justify-start"
              onClick={() => handleTabClick('orders')}
            >
              <Icon name="ShoppingBag" size={16} className="mr-2" />
              Заказы
            </Button>
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              className="justify-start"
              onClick={() => handleTabClick('products')}
            >
              <Icon name="Package" size={16} className="mr-2" />
              Товары
            </Button>
            <Button
              variant={activeTab === 'ozon' ? 'default' : 'ghost'}
              className="justify-start"
              onClick={() => handleTabClick('ozon')}
            >
              <Icon name="Download" size={16} className="mr-2" />
              Ozon
            </Button>
            <Button
              variant={activeTab === 'bundles' ? 'default' : 'ghost'}
              className="justify-start"
              onClick={() => handleTabClick('bundles')}
            >
              <Icon name="Box" size={16} className="mr-2" />
              Наборы
            </Button>
            <Button
              variant={activeTab === 'employees' ? 'default' : 'ghost'}
              className="justify-start"
              onClick={() => handleTabClick('employees')}
            >
              <Icon name="Users" size={16} className="mr-2" />
              Сотрудники
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminMobileMenu;