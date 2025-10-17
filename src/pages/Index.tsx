import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { smoothScrollToSection } from '@/utils/smoothScroll';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/BenefitsSection';
import ConfiguratorSection from '@/components/ConfiguratorSection';
import CatalogSection from '@/components/CatalogSection';
import TargetAudienceSection from '@/components/TargetAudienceSection';
import WhyUsSection from '@/components/WhyUsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import ProductCarousel from '@/components/ProductCarousel';
import Footer from '@/components/Footer';
import IndexDialogs from '@/components/IndexDialogs';
import ScrollToTop from '@/components/ScrollToTop';
import { useProductData } from '@/hooks/useProductData';
import { useCartLogic } from '@/hooks/useCartLogic';
import { useOrderLogic } from '@/hooks/useOrderLogic';

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
    allFurnitureSets,
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
  }, [allFurnitureSets, toast]);

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
      
      <FAQSection />
      
      <Footer />
      
      <ScrollToTop />

      <IndexDialogs
        selectedSet={selectedSet}
        setSelectedSet={setSelectedSet}
        helpDialogOpen={helpDialogOpen}
        setHelpDialogOpen={setHelpDialogOpen}
        configuratorOpen={configuratorOpen}
        setConfiguratorOpen={setConfiguratorOpen}
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
        allFurnitureSets={allFurnitureSets}
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
  );
};

export default Index;