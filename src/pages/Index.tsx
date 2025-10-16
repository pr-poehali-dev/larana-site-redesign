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

const Index = () => {
  const [selectedSet, setSelectedSet] = useState<any>(null);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [budget, setBudget] = useState([3000]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { toast } = useToast();

  const allFurnitureSets = [
    {
      id: 1,
      title: 'Набор для гостиной "Северный"',
      category: 'Гостиная',
      price: '3200 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/6dc15d77-b11a-4009-bfbc-a76ac54e68db.jpg',
      items: ['Диван', 'Журнальный стол', 'Стеллаж'],
      style: 'Скандинавский',
      description: 'Современная гостиная в скандинавском стиле с уютной атмосферой'
    },
    {
      id: 2,
      title: 'Комплект для спальни "Вариант"',
      category: 'Спальня',
      price: '2800 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/ed6e2b24-421a-4f81-bc83-3eb261fcc919.jpg',
      items: ['Кровать', 'Прикроватные тумбы', 'Шкаф'],
      style: 'Современный',
      description: 'Комфортная спальня для полноценного отдыха'
    },
    {
      id: 3,
      title: 'Набор для кухни "Контор"',
      category: 'Кухня',
      price: '4100 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/5546849f-7d51-4b8f-aad6-76df00bc86c8.jpg',
      items: ['Кухонный гарнитур', 'Стол', 'Стулья'],
      style: 'Современный',
      description: 'Функциональная кухня с современным дизайном и удобной планировкой'
    },
    {
      id: 4,
      title: 'Прихожая "Вахан"',
      category: 'Прихожая',
      price: '1900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/6dc15d77-b11a-4009-bfbc-a76ac54e68db.jpg',
      items: ['Шкаф', 'Вешалка', 'Тумба для обуви'],
      style: 'Скандинавский',
      description: 'Компактное решение для удобной организации пространства'
    },
    {
      id: 5,
      title: 'Гостиная "Контор"',
      category: 'Гостиная',
      price: '3800 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/6dc15d77-b11a-4009-bfbc-a76ac54e68db.jpg',
      items: ['Диван угловой', 'ТВ-тумба', 'Кресло'],
      style: 'Современный',
      description: 'Просторная гостиная для семейного отдыха'
    },
    {
      id: 6,
      title: 'Спальня "Нон"',
      category: 'Спальня',
      price: '3200 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/ed6e2b24-421a-4f81-bc83-3eb261fcc919.jpg',
      items: ['Двуспальная кровать', 'Комод', 'Зеркало'],
      style: 'Скандинавский',
      description: 'Уютная спальня в минималистичном стиле'
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

  return (
    <div className="min-h-screen">
      <Header 
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
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
    </div>
  );
};

export default Index;