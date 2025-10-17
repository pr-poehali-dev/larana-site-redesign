import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { useProductData } from '@/hooks/useProductData';
import { useProducts } from '@/contexts/ProductContext';
import { useProductVariants } from '@/hooks/useProductVariants';
import CartDialog from '@/components/dialogs/CartDialog';
import CheckoutDialog from '@/components/dialogs/CheckoutDialog';
import AuthDialog from '@/components/dialogs/AuthDialog';
import { useOrderLogic } from '@/hooks/useOrderLogic';
import { useToast } from '@/hooks/use-toast';
import ProductBreadcrumb from '@/components/product/ProductBreadcrumb';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductDescription from '@/components/product/ProductDescription';
import ProductReviews from '@/components/product/ProductReviews';

const ProductPage = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const navigate = useNavigate();
  const { allFurnitureSets } = useProductData();
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useProducts();
  const { toast } = useToast();
  
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const product = allFurnitureSets.find(p => p.id === parseInt(id || '0'));
  const { variants, hasVariants, allAvailableColors } = useProductVariants(
    product || {} as any,
    allFurnitureSets
  );
  
  const { handleConfirmOrder: confirmOrder } = useOrderLogic(cartItems, clearCart, user);

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product?.id, product?.colors]);

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  const handleAddToCart = () => {
    console.log('=== ДОБАВЛЕНИЕ В КОРЗИНУ ===');
    console.log('Товар:', product);
    console.log('Количество:', quantity);
    console.log('Корзина до:', cartItems);
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    console.log('Корзина после:', cartItems);
    
    toast({
      title: "Товар добавлен в корзину",
      description: `${product.title} × ${quantity}`,
    });
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setCheckoutOpen(true);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleConfirmOrder = async (orderData: any) => {
    await confirmOrder(orderData);
    setCheckoutOpen(false);
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>{product.title} - купить в Москве | Lara Мебель</title>
        <meta name="description" content={`${product.title} - ${product.description}. Цена ${product.price}. ${product.inStock ? 'В наличии' : 'Под заказ'}.`} />
        <link rel="canonical" href={`https://laranamebel.ru/catalog/${slug}/${id}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "image": product.images || [product.image],
            "description": product.description,
            "brand": {
              "@type": "Brand",
              "name": "LARANA"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://laranamebel.ru/catalog/${slug}/${id}`,
              "priceCurrency": "RUB",
              "price": product.price.replace(/\s/g, '').replace('₽', ''),
              "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
              "seller": {
                "@type": "Organization",
                "name": "LARANA"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "12"
            },
            "category": product.category,
            "material": product.style,
            "color": product.colors?.join(", ")
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": "https://laranamebel.ru"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Каталог",
                "item": "https://laranamebel.ru/catalog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": product.category,
                "item": `https://laranamebel.ru/catalog/${slug}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": product.title,
                "item": `https://laranamebel.ru/catalog/${slug}/${id}`
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header 
          cartItemsCount={cartItems.length}
          onCartClick={() => setCartOpen(true)}
          onAuthClick={() => setAuthOpen(true)}
          user={user}
          onLogout={() => setUser(null)}
          onOrdersClick={() => {}}
          onProfileClick={() => {}}
          onFavoritesClick={() => {}}
        />
        
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <ProductBreadcrumb 
              slug={slug || ''}
              category={product.category}
              title={product.title}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <ProductGallery 
                image={product.image}
                title={product.title}
              />

              <ProductInfo 
                product={product}
                variants={variants}
                hasVariants={hasVariants}
                allAvailableColors={allAvailableColors}
                selectedColor={selectedColor}
                quantity={quantity}
                slug={slug || ''}
                onColorChange={setSelectedColor}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>

            <ProductDescription 
              description={product.description}
              items={product.items}
              category={product.category}
              style={product.style}
              colors={product.colors}
              inStock={product.inStock}
            />

            <ProductReviews />
          </div>
        </main>

        <Footer />
        <ScrollToTop />

        <CartDialog
          open={cartOpen}
          onOpenChange={setCartOpen}
          items={cartItems}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={handleCheckout}
        />

        <CheckoutDialog
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          items={cartItems}
          onConfirm={handleConfirmOrder}
        />

        <AuthDialog
          open={authOpen}
          onOpenChange={setAuthOpen}
          onSuccess={setUser}
        />
      </div>
    </>
  );
};

export default ProductPage;