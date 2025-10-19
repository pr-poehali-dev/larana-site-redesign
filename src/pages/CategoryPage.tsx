import { useParams, Navigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { categories, categoryFilters } from '@/data/catalogData';
import { useProducts } from '@/contexts/ProductContext';
import { useOrderLogic } from '@/hooks/useOrderLogic';
import CheckoutDialog from '@/components/dialogs/CheckoutDialog';
import AuthDialog from '@/components/dialogs/AuthDialog';
import CartDialog from '@/components/dialogs/CartDialog';
import CategorySEO from '@/components/category/CategorySEO';
import CategoryBreadcrumb from '@/components/category/CategoryBreadcrumb';
import CategoryFilters from '@/components/category/CategoryFilters';
import ProductCard from '@/components/category/ProductCard';
import CategoryContent from '@/components/category/CategoryContent';
import CategoryFAQ from '@/components/category/CategoryFAQ';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const categoryData = slug ? categories[slug] : null;
  const filters = slug ? categoryFilters[slug] || [] : [];
  
  const priceFilter = filters.find(f => f.id === 'price' && f.type === 'range');
  const initialPriceRange = priceFilter ? [priceFilter.min || 2000, priceFilter.max || 70000] : [2000, 70000];
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [priceRange, setPriceRange] = useState<number[]>(initialPriceRange);
  const [sortBy, setSortBy] = useState('popular');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { availableProducts, cartItems, addToCart, removeFromCart, updateQuantity, clearCart, allFurnitureSets } = useProducts();
  const { handleConfirmOrder: confirmOrder } = useOrderLogic(cartItems, clearCart, user);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPriceRange(initialPriceRange);
    setSelectedFilters({});
  }, [slug]);

  if (!categoryData) {
    console.error('❌ Category not found');
    console.log('Available categories:', Object.keys(categories));
    console.log('Requested slug:', slug);
    return <Navigate to="/404" replace />;
  }

  const handleFilterChange = (filterId: string, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const handleConfirmOrder = async (orderData: any) => {
    await confirmOrder(orderData);
    setCheckoutOpen(false);
  };

  const handleAddToCart = (product: any) => {
    const fullProduct = allFurnitureSets.find(p => p.id === product.id);
    if (fullProduct) {
      addToCart(fullProduct);
      setCheckoutOpen(true);
    }
  };

  const categoryMapping: Record<string, string> = {
    'gostinaya': 'Гостиная',
    'spalnya': 'Спальня',
    'kuhni': 'Кухня',
    'shkafy': 'Шкафы',
    'prihozhaya': 'Прихожая',
    'detskaya': 'Детская'
  };

  const targetCategory = categoryMapping[slug || ''];

  const mockProducts = useMemo(() => {
    if (!slug) return [];
    
    let filtered = availableProducts
      .filter(product => {
        if (!targetCategory) return false;
        return product.category === targetCategory;
      })
      .map(product => ({
        ...product,
        width: product.items[0] || '',
        material: product.colors[0] || ''
      }));

    filtered = filtered.filter(product => {
      const price = typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^\d.]/g, '')) 
        : parseFloat(product.price);
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      if (selectedFilters.inStock?.includes('true') && !product.inStock) {
        return false;
      }

      for (const [filterId, values] of Object.entries(selectedFilters)) {
        if (filterId === 'inStock' || !values || (Array.isArray(values) && values.length === 0)) {
          continue;
        }

        if (filterId === 'style' && Array.isArray(values)) {
          const styleMatch = values.some((v: string) => 
            product.style?.toLowerCase().includes(v.toLowerCase())
          );
          if (!styleMatch) return false;
        }

        if (filterId === 'color' && Array.isArray(values)) {
          const colorMatch = values.some((v: string) => {
            const productColors = Array.isArray(product.colors) 
              ? product.colors.join(' ').toLowerCase() 
              : (product.material?.toLowerCase() || '');
            return productColors.includes(v.toLowerCase());
          });
          if (!colorMatch) return false;
        }

        if (filterId === 'material' && Array.isArray(values)) {
          const materialMatch = values.some((v: string) => {
            const productMaterials = Array.isArray(product.items)
              ? product.items.join(' ').toLowerCase()
              : product.width?.toLowerCase() || '';
            return productMaterials.includes(v.toLowerCase());
          });
          if (!materialMatch) return false;
        }

        if ((filterId === 'width' || filterId === 'length' || filterId === 'bed-size') && Array.isArray(values)) {
          const sizeMatch = values.some((v: string) => {
            const productSize = Array.isArray(product.items)
              ? product.items.join(' ')
              : product.width || '';
            return productSize.includes(v) || productSize.includes(v.replace('-', ''));
          });
          if (!sizeMatch) return false;
        }
      }

      return true;
    });

    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => {
        const priceA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^\d.]/g, '')) : parseFloat(a.price);
        const priceB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^\d.]/g, '')) : parseFloat(b.price);
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => {
        const priceA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^\d.]/g, '')) : parseFloat(a.price);
        const priceB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^\d.]/g, '')) : parseFloat(b.price);
        return priceB - priceA;
      });
    } else if (sortBy === 'new') {
      filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [availableProducts, targetCategory, slug, priceRange, selectedFilters, sortBy]);

  return (
    <>
      <CategorySEO categoryData={categoryData} slug={slug || ''} mockProducts={mockProducts} />

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
            <CategoryBreadcrumb breadcrumb={categoryData.breadcrumb} />

            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{categoryData.h1}</h1>
              <p className="text-lg text-muted-foreground">{categoryData.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <CategoryFilters 
                filters={filters}
                selectedFilters={selectedFilters}
                priceRange={priceRange}
                onFilterChange={handleFilterChange}
                onPriceChange={setPriceRange}
              />

              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Найдено товаров: <span className="font-semibold text-foreground">{mockProducts.length}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Сортировка:</span>
                    <Button
                      variant={sortBy === 'popular' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('popular')}
                    >
                      Популярные
                    </Button>
                    <Button
                      variant={sortBy === 'price-asc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('price-asc')}
                    >
                      <Icon name="ArrowUp" size={14} className="mr-1" />
                      Цена
                    </Button>
                    <Button
                      variant={sortBy === 'price-desc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('price-desc')}
                    >
                      <Icon name="ArrowDown" size={14} className="mr-1" />
                      Цена
                    </Button>
                    <Button
                      variant={sortBy === 'new' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('new')}
                    >
                      Новинки
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {mockProducts.map((product) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      slug={slug || ''}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                <CategoryContent categoryData={categoryData} />
                <CategoryFAQ faq={categoryData.content.faq} />
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <ScrollToTop />
      </div>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cartItems={cartItems}
        onConfirm={handleConfirmOrder}
        onAuthRequired={() => {
          setCheckoutOpen(false);
          setAuthOpen(true);
        }}
        user={user}
      />

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={(userData) => {
          setUser(userData);
          setAuthOpen(false);
        }}
      />

      <CartDialog
        open={cartOpen}
        onOpenChange={setCartOpen}
        cartItems={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
    </>
  );
};

export default CategoryPage;