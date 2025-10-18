import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} className="md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base md:text-xl font-bold">Админ-панель</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Управление заказами и товарами</p>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="hidden sm:flex"
            >
              <Icon name="Home" size={16} className="mr-2" />
              На сайт
            </Button>
            <Button 
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              className="sm:hidden"
            >
              <Icon name="Home" size={16} />
            </Button>
            <Button 
              variant="outline"
              size="sm" 
              onClick={onLogout}
              className="hidden sm:flex"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выход
            </Button>
            <Button 
              variant="outline"
              size="icon" 
              onClick={onLogout}
              className="sm:hidden"
            >
              <Icon name="LogOut" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
