import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/BenefitsSection';
import ConfiguratorSection from '@/components/ConfiguratorSection';
import CatalogSection from '@/components/CatalogSection';
import TargetAudienceSection from '@/components/TargetAudienceSection';
import WhyUsSection from '@/components/WhyUsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import ProductDialog from '@/components/dialogs/ProductDialog';
import HelpDialog from '@/components/dialogs/HelpDialog';
import ConfiguratorDialog from '@/components/dialogs/ConfiguratorDialog';
import CartDialog from '@/components/dialogs/CartDialog';
import CheckoutDialog from '@/components/dialogs/CheckoutDialog';
import AuthDialog from '@/components/dialogs/AuthDialog';

const Index = () => {
  const [selectedSet, setSelectedSet] = useState<any>(null);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [budget, setBudget] = useState([3000]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const allFurnitureSets = [
    {
      id: 1,
      title: 'Спальня "Сканди Мини"',
      category: 'Спальня',
      price: '38900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/ed6e2b24-421a-4f81-bc83-3eb261fcc919.jpg',
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
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/ed6e2b24-421a-4f81-bc83-3eb261fcc919.jpg',
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
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/5546849f-7d51-4b8f-aad6-76df00bc86c8.jpg',
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
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/5546849f-7d51-4b8f-aad6-76df00bc86c8.jpg',
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
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/6dc15d77-b11a-4009-bfbc-a76ac54e68db.jpg',
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
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/6dc15d77-b11a-4009-bfbc-a76ac54e68db.jpg',
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
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/6dc15d77-b11a-4009-bfbc-a76ac54e68db.jpg',
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
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/6dc15d77-b11a-4009-bfbc-a76ac54e68db.jpg',
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
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/6dc15d77-b11a-4009-bfbc-a76ac54e68db.jpg',
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
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/6dc15d77-b11a-4009-bfbc-a76ac54e68db.jpg',
      items: ['Шкаф', 'Обувница', 'Зеркало'],
      style: 'Современный',
      description: 'Шкаф + обувница + зеркало. Глянцевые фасады. Современный вид.',
      colors: ['Белый', 'дуб сонома'],
      inStock: true
    }
  ];

  const furnitureSets = allFurnitureSets.filter(set => {
    if (selectedRoom && set.category !== selectedRoom) return false;
    if (selectedStyle && set.style !== selectedStyle) return false;
    if (budget[0] && parseInt(set.price) > budget[0]) return false;
    return true;
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

  const handleConfirmOrder = (orderData: any) => {
    toast({ 
      title: "Заказ успешно оформлен!", 
      description: `Номер заказа: ${Math.floor(Math.random() * 100000)}. Мы свяжемся с вами в ближайшее время.`,
      duration: 5000
    });
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

  return (
    <div className="min-h-screen">
      <Header 
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
        onAuthClick={() => setAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
      />
      
      <HeroSection 
        onConfiguratorOpen={() => setConfiguratorOpen(true)}
        onHelpOpen={() => setHelpDialogOpen(true)}
      />
      
      <BenefitsSection />
      
      <ConfiguratorSection
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        budget={budget}
        setBudget={setBudget}
        resultsCount={furnitureSets.length}
      />
      
      <CatalogSection 
        furnitureSets={furnitureSets}
        onSetClick={setSelectedSet}
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
      />

      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;