import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/BenefitsSection';
import ConfiguratorSection from '@/components/ConfiguratorSection';
import CatalogSection from '@/components/CatalogSection';
import TargetAudienceSection from '@/components/TargetAudienceSection';
import WhyUsSection from '@/components/WhyUsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ProductCarousel from '@/components/ProductCarousel';
import Footer from '@/components/Footer';
import ProductDialog from '@/components/dialogs/ProductDialog';
import HelpDialog from '@/components/dialogs/HelpDialog';
import ConfiguratorDialog from '@/components/dialogs/ConfiguratorDialog';
import CartDialog from '@/components/dialogs/CartDialog';
import CheckoutDialog from '@/components/dialogs/CheckoutDialog';
import AuthDialog from '@/components/dialogs/AuthDialog';
import OrderHistoryDialog from '@/components/dialogs/OrderHistoryDialog';
import ProfileSettingsDialog from '@/components/dialogs/ProfileSettingsDialog';
import FavoritesDialog from '@/components/dialogs/FavoritesDialog';
import AdminDialog from '@/components/dialogs/AdminDialog';

const Index = () => {
  const [selectedSet, setSelectedSet] = useState<any>(null);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [budget, setBudget] = useState([60000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const [allFurnitureSets, setAllFurnitureSets] = useState([
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
      inStock: true
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
      inStock: true
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
      inStock: true
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
      inStock: true
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
      inStock: true
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
      inStock: true
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
      inStock: true
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
      inStock: true
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
      inStock: true
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
      inStock: true
    }
  ]);

  const furnitureSets = allFurnitureSets
    .filter(set => {
      if (selectedRoom && set.category !== selectedRoom) return false;
      if (selectedStyle && set.style !== selectedStyle) return false;
      if (budget[0] && parseInt(set.price) > budget[0]) return false;
      if (inStockOnly && !set.inStock) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') {
        return parseInt(a.price) - parseInt(b.price);
      }
      if (sortBy === 'price-desc') {
        return parseInt(b.price) - parseInt(a.price);
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const handleAddToCart = (set: any) => {
    const existingItem = cartItems.find(item => item.id === set.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === set.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...set, quantity: 1 }]);
    }
    toast({ 
      title: "Комплект добавлен в корзину!", 
      description: `${set.title} успешно добавлен` 
    });
    setSelectedSet(null);
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({ title: "Товар удален из корзины" });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleConfirmOrder = async (orderData: any) => {
    try {
      const totalAmount = cartItems.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/\D/g, ''));
        return sum + (price * item.quantity);
      }, 0);

      const userEmail = user?.email || orderData.email;

      const response = await fetch('https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userEmail
        },
        body: JSON.stringify({
          ...orderData,
          totalAmount,
          items: cartItems.map(item => ({
            id: item.id,
            title: item.title,
            price: parseInt(item.price.replace(/\D/g, '')),
            quantity: item.quantity
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Order created successfully:', data);
        
        fetch('https://functions.poehali.dev/5bb39c34-5468-4f00-906c-c2bed52f18d9', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: {
              orderNumber: data.orderNumber,
              name: orderData.name,
              email: userEmail,
              phone: orderData.phone,
              deliveryType: orderData.deliveryType,
              paymentType: orderData.paymentType,
              address: orderData.address,
              city: orderData.city,
              totalAmount,
              items: cartItems.map(item => ({
                title: item.title,
                price: parseInt(item.price.replace(/\D/g, '')),
                quantity: item.quantity
              })),
              comment: orderData.comment
            }
          })
        }).catch(err => console.log('Telegram notification failed:', err));
        
        toast({ 
          title: "Заказ успешно оформлен!", 
          description: `Номер заказа: ${data.orderNumber}. Мы свяжемся с вами в ближайшее время.`,
          duration: 5000
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Order creation failed:', response.status, errorData);
        toast({ 
          title: "Ошибка оформления заказа", 
          description: errorData.error || "Попробуйте снова или свяжитесь с нами",
          variant: "destructive",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Order request error:', error);
      toast({ 
        title: "Ошибка оформления заказа", 
        description: "Проверьте подключение к интернету",
        variant: "destructive",
        duration: 5000
      });
    }
    setCartItems([]);
    setCheckoutOpen(false);
  };

  const handleHelpSubmit = () => {
    toast({ 
      title: "Заявка отправлена!", 
      description: "Мы свяжемся с вами в ближайшее время" 
    });
    setHelpDialogOpen(false);
  };

  const handleShowResults = () => {
    setConfiguratorOpen(false);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    toast({ 
      title: "Добро пожаловать!", 
      description: `Вы успешно вошли как ${userData.name}` 
    });
  };

  const handleLogout = () => {
    setUser(null);
    toast({ 
      title: "Вы вышли из аккаунта",
      description: "До новых встреч!"
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const favoritesParam = params.get('favorites');
    
    if (favoritesParam) {
      const favoriteIds = favoritesParam.split(',').map(Number);
      const favoriteProducts = allFurnitureSets.filter(product => 
        favoriteIds.includes(product.id)
      );
      
      if (favoriteProducts.length > 0) {
        toast({
          title: "Избранные товары загружены",
          description: `Найдено ${favoriteProducts.length} товаров из общей подборки`,
        });
        
        setTimeout(() => {
          document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Header 
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
        onAuthClick={() => setAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
        onOrdersClick={() => setOrdersOpen(true)}
        onProfileClick={() => setProfileOpen(true)}
        onFavoritesClick={() => setFavoritesOpen(true)}
        onAdminClick={() => setAdminOpen(true)}
      />
      
      <HeroSection 
        onConfiguratorOpen={() => setConfiguratorOpen(true)}
        onHelpOpen={() => setHelpDialogOpen(true)}
      />
      
      <section className="py-12 md:py-20 bg-gradient-to-b from-background to-secondary/20 hidden md:block">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Популярные комплекты</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Готовые решения для вашего дома — выбирайте и заказывайте
            </p>
          </div>
          <ProductCarousel 
            products={allFurnitureSets.slice(0, 8)}
            onProductClick={setSelectedSet}
            onAddToCart={handleAddToCart}
          />
        </div>
      </section>
      
      <BenefitsSection />
      
      <ConfiguratorSection
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        budget={budget}
        setBudget={setBudget}
        resultsCount={furnitureSets.length}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      
      <CatalogSection 
        furnitureSets={furnitureSets}
        onSetClick={setSelectedSet}
        user={user}
      />
      
      <TargetAudienceSection />
      
      <WhyUsSection />
      
      <TestimonialsSection />
      
      <Footer />

      <ProductDialog
        selectedSet={selectedSet}
        onClose={() => setSelectedSet(null)}
        onAddToCart={handleAddToCart}
      />

      <HelpDialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        onSubmit={handleHelpSubmit}
      />

      <ConfiguratorDialog
        open={configuratorOpen}
        onClose={() => setConfiguratorOpen(false)}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        budget={budget}
        setBudget={setBudget}
        resultsCount={furnitureSets.length}
        onShowResults={handleShowResults}
      />

      <CartDialog
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />

      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        onConfirmOrder={handleConfirmOrder}
        user={user}
      />

      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <OrderHistoryDialog
        open={ordersOpen}
        onClose={() => setOrdersOpen(false)}
        user={user}
      />

      <ProfileSettingsDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
      />

      <FavoritesDialog
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        user={user}
        allProducts={allFurnitureSets}
        onProductClick={setSelectedSet}
      />

      <AdminDialog
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        products={allFurnitureSets}
        onProductUpdate={setAllFurnitureSets}
      />
    </div>
  );
};

export default Index;