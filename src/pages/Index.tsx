import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import { smoothScrollToSection } from '@/utils/smoothScroll';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/BenefitsSection';

import CatalogSection from '@/components/CatalogSection';
import TargetAudienceSection from '@/components/TargetAudienceSection';
import WhyUsSection from '@/components/WhyUsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import ProductCarousel from '@/components/ProductCarousel';
import LocalBusinessInfo from '@/components/LocalBusinessInfo';
import Footer from '@/components/Footer';
import IndexDialogs from '@/components/IndexDialogs';
import ScrollToTop from '@/components/ScrollToTop';
import { useProducts } from '@/contexts/ProductContext';
import { useProductData } from '@/hooks/useProductData';
import { useCartLogic } from '@/hooks/useCartLogic';
import { useOrderLogic } from '@/hooks/useOrderLogic';

const Index = () => {
  const [selectedSet, setSelectedSet] = useState<any>(null);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const {
    selectedStyle,
    setSelectedStyle,
    selectedRoom,
    setSelectedRoom,
    budget,
    setBudget,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    availableProducts,
    setAllFurnitureSets,
    furnitureSets
  } = useProductData();

  const {
    cartItems,
    handleAddToCart: addToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    clearCart
  } = useCartLogic();

  const { handleConfirmOrder: confirmOrder } = useOrderLogic(cartItems, clearCart, user);

  const handleAddToCart = (set: any) => {
    addToCart(set);
    setSelectedSet(null);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleConfirmOrder = async (orderData: any) => {
    await confirmOrder(orderData);
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
    smoothScrollToSection('catalog');
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
    const roomParam = params.get('room');
    
    if (roomParam) {
      setSelectedRoom(roomParam);
      setTimeout(() => {
        smoothScrollToSection('catalog');
      }, 500);
    }
    
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
          smoothScrollToSection('catalog');
        }, 500);
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedRoom && selectedRoom !== 'all') {
      params.set('room', selectedRoom);
    } else {
      params.delete('room');
    }
    const newUrl = params.toString() ? `?${params.toString()}` : '/';
    window.history.replaceState({}, '', newUrl);
  }, [selectedRoom]);

  return (
    <>
      <Helmet>
        <title>LARANA - мебель в наличии в Екатеринбурге | Доставка за 1-2 дня</title>
        <meta name="description" content="Мебель в наличии в Екатеринбурге: спальни, кухни, гостиные, шкафы-купе. Доставка за 1-2 дня. Гарантия 18 месяцев. Рассрочка 0%." />
        <meta name="keywords" content="мебель екатеринбург, мебель в наличии, купить мебель, мебель с доставкой" />
        <link rel="canonical" href="https://laranamebel.ru/" />
        
        <meta property="og:title" content="LARANA - мебель в наличии в Екатеринбурге" />
        <meta property="og:description" content="Мебель в наличии: спальни, кухни, гостиные, шкафы-купе. Доставка за 1-2 дня. Гарантия 18 месяцев. Рассрочка 0%." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://laranamebel.ru/" />
        <meta property="og:image" content="https://cdn.poehali.dev/files/8e9a575f-fd1c-4d40-821a-4154a78e1d00.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="LARANA — Мебель на заказ в Екатеринбурге" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LARANA - мебель в наличии в Екатеринбурге" />
        <meta name="twitter:description" content="Мебель в наличии: спальни, кухни, гостиные, шкафы-купе. Доставка за 1-2 дня." />
        <meta name="twitter:image" content="https://cdn.poehali.dev/files/8e9a575f-fd1c-4d40-821a-4154a78e1d00.jpg" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FurnitureStore",
            "name": "LARANA",
            "description": "Магазин мебели в наличии с доставкой за 1-2 дня",
            "url": "https://laranamebel.ru",
            "logo": "https://cdn.poehali.dev/files/8e9a575f-fd1c-4d40-821a-4154a78e1d00.jpg",
            "image": "https://cdn.poehali.dev/files/8e9a575f-fd1c-4d40-821a-4154a78e1d00.jpg",
            "telephone": "+7 (343) 123-45-67",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "ул. Примерная, д. 1",
              "addressLocality": "Екатеринбург",
              "addressRegion": "Свердловская область",
              "postalCode": "620000",
              "addressCountry": "RU"
            },
            "priceRange": "₽₽",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "20:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Saturday", "Sunday"],
                "opens": "10:00",
                "closes": "19:00"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "127"
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "LARANA",
            "url": "https://laranamebel.ru",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://laranamebel.ru/catalog?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

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
            products={availableProducts.slice(0, 8)}
            onProductClick={setSelectedSet}
            onAddToCart={handleAddToCart}
          />
        </div>
      </section>
      
      <BenefitsSection />
      

      
      <CatalogSection 
        furnitureSets={furnitureSets}
        onSetClick={setSelectedSet}
        user={user}
      />
      
      <TargetAudienceSection />
      
      <WhyUsSection />
      
      <TestimonialsSection />
      
      <FAQSection />
      
      <LocalBusinessInfo />
      
      <Footer />
      
      <ScrollToTop />

      <IndexDialogs
        selectedSet={selectedSet}
        setSelectedSet={setSelectedSet}
        helpDialogOpen={helpDialogOpen}
        setHelpDialogOpen={setHelpDialogOpen}

        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        checkoutOpen={checkoutOpen}
        setCheckoutOpen={setCheckoutOpen}
        authOpen={authOpen}
        setAuthOpen={setAuthOpen}
        ordersOpen={ordersOpen}
        setOrdersOpen={setOrdersOpen}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        favoritesOpen={favoritesOpen}
        setFavoritesOpen={setFavoritesOpen}
        adminOpen={adminOpen}
        setAdminOpen={setAdminOpen}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        budget={budget}
        setBudget={setBudget}
        resultsCount={furnitureSets.length}
        cartItems={cartItems}
        user={user}
        availableProducts={availableProducts}
        setAllFurnitureSets={setAllFurnitureSets}
        handleAddToCart={handleAddToCart}
        handleRemoveFromCart={handleRemoveFromCart}
        handleUpdateQuantity={handleUpdateQuantity}
        handleCheckout={handleCheckout}
        handleConfirmOrder={handleConfirmOrder}
        handleHelpSubmit={handleHelpSubmit}
        handleShowResults={handleShowResults}
        handleAuthSuccess={handleAuthSuccess}
      />
      </div>
    </>
  );
};

export default Index;