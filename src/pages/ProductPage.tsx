import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
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
  const { allFurnitureSets, availableProducts, isLoading, cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useProducts();
  const { toast } = useToast();
  
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const requestedId = parseInt(id || '0');
  
  let product = availableProducts.find(p => p.id === requestedId);
  
  if (!product) {
    product = availableProducts.find(p => 
      p.variants && p.variants.some((v: any) => v.id === requestedId)
    );
  }
  
  console.log('🔍 ProductPage: Поиск товара', { 
    requestedId, 
    totalProducts: availableProducts.length,
    foundProduct: product ? product.title : 'NOT FOUND',
    isLoading
  });
  
  const { variants, hasVariants, allAvailableColors } = useProductVariants(
    product || {} as any,
    allFurnitureSets
  );
  
  const activeVariant = product?.variants?.find((v: any) => v.id === requestedId);
  
  const displayProduct = activeVariant ? {
    ...product,
    id: activeVariant.id,
    colorVariant: activeVariant.colorVariant,
    stockQuantity: activeVariant.stockQuantity,
    images: activeVariant.images,
    image: activeVariant.images?.[0] || product?.image
  } : product;
  
  const { handleConfirmOrder: confirmOrder } = useOrderLogic(cartItems, clearCart, user);

  useEffect(() => {
    if (displayProduct && displayProduct.colors && displayProduct.colors.length > 0) {
      setSelectedColor(displayProduct.colors[0]);
    }
  }, [displayProduct?.id, displayProduct?.colors]);

  if (isLoading) {
    return (
      <>
        <Header cartItemsCount={cartItems.length} onCartClick={() => setCartOpen(true)} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка товара...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  const handleAddToCart = () => {
    console.log('=== ДОБАВЛЕНИЕ В КОРЗИНУ ===');
    console.log('Товар:', displayProduct);
    console.log('Количество:', quantity);
    console.log('Корзина до:', cartItems);
    
    for (let i = 0; i < quantity; i++) {
      addToCart(displayProduct!);
    }
    
    console.log('Корзина после:', cartItems);
    
    toast({
      title: "Товар добавлен в корзину",
      description: `${displayProduct!.title} × ${quantity}`,
    });
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(displayProduct!);
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
        <title>{displayProduct!.title} - купить в Москве | Lara Мебель</title>
        <meta name="description" content={`${displayProduct!.title} - ${displayProduct!.description}. Цена ${displayProduct!.price}. ${displayProduct!.inStock ? 'В наличии' : 'Под заказ'}.`} />
        <link rel="canonical" href={`https://laranamebel.ru/catalog/${slug}/${id}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": displayProduct!.title,
            "image": displayProduct!.images || [displayProduct!.image],
            "description": displayProduct!.description,
            "brand": {
              "@type": "Brand",
              "name": "LARANA"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://laranamebel.ru/catalog/${slug}/${id}`,
              "priceCurrency": "RUB",
              "price": displayProduct!.price.replace(/\s/g, '').replace('₽', ''),
              "availability": displayProduct!.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
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
            "category": displayProduct!.category,
            "material": displayProduct!.style,
            "color": displayProduct!.colors?.join(", ")
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
              category={displayProduct!.category}
              title={displayProduct!.title}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <ProductGallery 
                images={(() => {
                  const allImages = displayProduct!.images || [];
                  const mainImg = displayProduct!.image;
                  
                  // Если главное изображение есть и оно есть в массиве - ставим его первым
                  if (mainImg && allImages.includes(mainImg)) {
                    return [mainImg, ...allImages.filter(img => img !== mainImg)];
                  }
                  
                  // Если главного изображения нет в массиве, но оно указано - добавляем его первым
                  if (mainImg && !allImages.includes(mainImg)) {
                    return [mainImg, ...allImages];
                  }
                  
                  // Иначе просто возвращаем массив или главное изображение
                  return allImages.length > 0 ? allImages : [mainImg];
                })()}
                title={displayProduct!.title}
              />

              <ProductInfo 
                product={displayProduct!}
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
              description={displayProduct!.description}
              items={displayProduct!.items}
              category={displayProduct!.category}
              style={displayProduct!.style}
              colors={displayProduct!.colors}
              inStock={displayProduct!.inStock}
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
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          user={user}
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