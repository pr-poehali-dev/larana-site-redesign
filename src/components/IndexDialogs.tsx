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

interface IndexDialogsProps {
  selectedSet: any;
  setSelectedSet: (set: any) => void;
  helpDialogOpen: boolean;
  setHelpDialogOpen: (open: boolean) => void;
  configuratorOpen: boolean;
  setConfiguratorOpen: (open: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  ordersOpen: boolean;
  setOrdersOpen: (open: boolean) => void;
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  favoritesOpen: boolean;
  setFavoritesOpen: (open: boolean) => void;
  adminOpen: boolean;
  setAdminOpen: (open: boolean) => void;
  selectedRoom: string;
  setSelectedRoom: (room: string) => void;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  budget: number[];
  setBudget: (budget: number[]) => void;
  resultsCount: number;
  cartItems: any[];
  user: any;
  allFurnitureSets: any[];
  setAllFurnitureSets: (sets: any[]) => void;
  handleAddToCart: (set: any) => void;
  handleRemoveFromCart: (id: number) => void;
  handleUpdateQuantity: (id: number, quantity: number) => void;
  handleCheckout: () => void;
  handleConfirmOrder: (orderData: any) => Promise<void>;
  handleHelpSubmit: () => void;
  handleShowResults: () => void;
  handleAuthSuccess: (userData: any) => void;
}

const IndexDialogs = ({
  selectedSet,
  setSelectedSet,
  helpDialogOpen,
  setHelpDialogOpen,
  configuratorOpen,
  setConfiguratorOpen,
  cartOpen,
  setCartOpen,
  checkoutOpen,
  setCheckoutOpen,
  authOpen,
  setAuthOpen,
  ordersOpen,
  setOrdersOpen,
  profileOpen,
  setProfileOpen,
  favoritesOpen,
  setFavoritesOpen,
  adminOpen,
  setAdminOpen,
  selectedRoom,
  setSelectedRoom,
  selectedStyle,
  setSelectedStyle,
  budget,
  setBudget,
  resultsCount,
  cartItems,
  user,
  allFurnitureSets,
  setAllFurnitureSets,
  handleAddToCart,
  handleRemoveFromCart,
  handleUpdateQuantity,
  handleCheckout,
  handleConfirmOrder,
  handleHelpSubmit,
  handleShowResults,
  handleAuthSuccess
}: IndexDialogsProps) => {
  return (
    <>
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
        resultsCount={resultsCount}
        onShowResults={handleShowResults}
      />

      <CartDialog
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        items={cartItems}
        onConfirm={handleConfirmOrder}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
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
    </>
  );
};

export default IndexDialogs;