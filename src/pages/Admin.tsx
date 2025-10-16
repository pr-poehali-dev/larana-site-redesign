import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import OrdersTab from '@/components/admin/OrdersTab';
import ProductsTab from '@/components/admin/ProductsTab';
import EmployeesTab from '@/components/admin/EmployeesTab';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    products: 10
  });
  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'Спальня "Сканди Мини"',
      category: 'Спальня',
      price: '38900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/857f001b-0b80-43af-a51b-f2a18a4ef240.jpg',
      items: ['Кровать 160', 'Шкаф 2Д', 'Тумбы'],
      style: 'Скандинавский',
      description: 'Кровать, 2 тумбы, шкаф, всё в скандинавском стиле. Идеально для молодых пар.',
      colors: ['Белый/дуб', 'серый/дуб'],
      inStock: true,
      supplierArticle: '',
      stockQuantity: null
    },
    {
      id: 2,
      title: 'Спальня "Комфорт Люкс"',
      category: 'Спальня',
      price: '57900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/790ac483-2de4-49e5-acd3-bb2f557ab85a.jpg',
      items: ['Кровать 180', 'Шкаф-купе', 'Комод', 'Зеркало'],
      style: 'Современный',
      description: 'Расширенный комплект: кровать, шкаф-купе, комод, зеркало. Цвет — дуб сонома.',
      colors: ['Дуб сонома', 'венге'],
      inStock: true,
      supplierArticle: '',
      stockQuantity: null
    },
    {
      id: 3,
      title: 'Кухня "Лара 180"',
      category: 'Кухня',
      price: '25900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/4b4f05f3-22e9-4eac-8af3-69ffc361cde8.jpg',
      items: ['Фасады', 'Столешница', 'Фурнитура'],
      style: 'Современный',
      description: 'Базовая кухня 180 см, верх + низ, фасады белый глянец. Подходит для арендаторов.',
      colors: ['Белый глянец', 'графит'],
      inStock: true,
      supplierArticle: '',
      stockQuantity: null
    },
    {
      id: 4,
      title: 'Кухня "Милан 240"',
      category: 'Кухня',
      price: '37900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/361eb671-ade4-4f67-9df1-de00cd20c61a.jpg',
      items: ['Фасады', 'Ручки', 'Фурнитура', 'Мойка'],
      style: 'Современный',
      description: 'Большая кухня 240 см, серый матовый фасад. Есть опция доводчиков и сушки.',
      colors: ['Серый мат', 'орех'],
      inStock: true,
      supplierArticle: '',
      stockQuantity: null
    },
    {
      id: 5,
      title: 'Шкаф-купе "Базис 2Д"',
      category: 'Шкафы',
      price: '17900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/5f05fce3-e920-49ee-9348-2bf8a0c2704e.jpg',
      items: ['Корпус', 'Двери', 'Зеркало'],
      style: 'Современный',
      description: 'Шкаф-купе 2-дверный, зеркало, ширина 120 см. Цвет: венге/дуб.',
      colors: ['Дуб', 'венге'],
      inStock: true,
      supplierArticle: '',
      stockQuantity: null
    },
    {
      id: 6,
      title: 'Шкаф-купе "Премиум 3Д"',
      category: 'Шкафы',
      price: '29900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/3141aeac-5ce4-4d14-b899-130e0e1c1761.jpg',
      items: ['Корпус', 'Фасады', 'Зеркало', 'Подсветка'],
      style: 'Современный',
      description: 'Шкаф-купе с 3 дверями, встроенное зеркало, подсветка. Современный стиль.',
      colors: ['Белый', 'антрацит'],
      inStock: true,
      supplierArticle: '',
      stockQuantity: null
    },
    {
      id: 7,
      title: 'Диван-кровать "Токио"',
      category: 'Гостиная',
      price: '26900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/55ef2f3b-2c0d-430e-b90d-5ac124f152a7.jpg',
      items: ['Диван', 'Подушки', 'Ящик'],
      style: 'Современный',
      description: 'Диван с механизмом еврокнижка. Ткань велюр. Ящик для белья.',
      colors: ['Синий', 'серый', 'бежевый'],
      inStock: true,
      supplierArticle: '',
      stockQuantity: null
    },
    {
      id: 8,
      title: 'Угловой диван-кровать "Неаполь"',
      category: 'Гостиная',
      price: '34900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/fb225bdc-f87d-4843-8021-0161f72938fa.jpg',
      items: ['Угловой диван', 'Подлокотники', 'Бельевой ящик'],
      style: 'Современный',
      description: 'Угловой диван с раскладкой, подходит для сна. Большой выбор цветов.',
      colors: ['Бордо', 'зелёный', 'бежевый'],
      inStock: true,
      supplierArticle: '',
      stockQuantity: null
    },
    {
      id: 9,
      title: 'Прихожая "Мини L1"',
      category: 'Прихожая',
      price: '8900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/b2671236-b685-4573-ac0e-0e2e4f68a820.jpg',
      items: ['Тумба', 'Вешалка', 'Зеркало'],
      style: 'Скандинавский',
      description: 'Компактный комплект с тумбой, вешалкой и зеркалом. Для малых прихожих.',
      colors: ['Дуб сонома'],
      inStock: true,
      supplierArticle: '',
      stockQuantity: null
    },
    {
      id: 10,
      title: 'Прихожая "Сити Lux"',
      category: 'Прихожая',
      price: '15400 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/f5366cbf-23dd-47aa-998c-006d9db97a2b.jpg',
      items: ['Шкаф', 'Обувница', 'Зеркало'],
      style: 'Современный',
      description: 'Шкаф + обувница + зеркало. Глянцевые фасады. Современный вид.',
      colors: ['Белый', 'дуб сонома'],
      inStock: true,
      supplierArticle: '',
      stockQuantity: null
    }
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchStats();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setStats(prev => ({
      ...prev,
      products: products.length
    }));
  }, [products]);

  const fetchStats = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0?admin=true');
      if (response.ok) {
        const data = await response.json();
        const orders = data.orders || [];
        setStats({
          total: orders.length,
          pending: orders.filter((o: any) => o.status === 'pending').length,
          completed: orders.filter((o: any) => o.status === 'completed').length,
          products: 10
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      if (password === 'admin123') {
        localStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать в админ-панель"
        });
      } else {
        toast({
          title: "Ошибка входа",
          description: "Неверный пароль",
          variant: "destructive"
        });
      }
      setLoading(false);
      setPassword('');
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из админ-панели"
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Icon name="Shield" size={32} className="text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Админ-панель</CardTitle>
            <CardDescription>Введите пароль для доступа</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-center text-lg"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Пароль по умолчанию: admin123
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading || !password}
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Вход...
                  </>
                ) : (
                  <>
                    <Icon name="LogIn" size={20} className="mr-2" />
                    Войти
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Вернуться на сайт
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Админ-панель</h1>
                <p className="text-xs text-muted-foreground">Управление заказами и товарами</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                <Icon name="Home" size={16} className="mr-2" />
                На сайт
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
              >
                <Icon name="LogOut" size={16} className="mr-2" />
                Выход
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Всего заказов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.total}</div>
                <Icon name="ShoppingBag" size={24} className="text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Новые заказы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <Icon name="Clock" size={24} className="text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Выполнено
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <Icon name="CheckCircle2" size={24} className="text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Товаров
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.products}</div>
                <Icon name="Package" size={24} className="text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Icon name="ShoppingBag" size={16} />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Icon name="Package" size={16} />
              Товары
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Icon name="Users" size={16} />
              Сотрудники
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление заказами</CardTitle>
                <CardDescription>
                  Просматривайте и обновляйте статусы заказов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление товарами</CardTitle>
                <CardDescription>
                  Редактируйте информацию о товарах в каталоге
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductsTab 
                  products={products}
                  onProductUpdate={setProducts}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <EmployeesTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;