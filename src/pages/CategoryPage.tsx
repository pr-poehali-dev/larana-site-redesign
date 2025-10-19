import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { formatPrice } from '@/utils/formatPrice';
import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { categories, categoryFilters } from '@/data/catalogData';
import { useProductData } from '@/hooks/useProductData';
import { useProducts } from '@/contexts/ProductContext';
import { useOrderLogic } from '@/hooks/useOrderLogic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import CheckoutDialog from '@/components/dialogs/CheckoutDialog';
import AuthDialog from '@/components/dialogs/AuthDialog';
import CartDialog from '@/components/dialogs/CartDialog';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
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

  const { availableProducts } = useProductData();
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useProducts();
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

  const categoryMapping: Record<string, string> = {
    'gostinaya': 'Гостиная',
    'spalnya': 'Спальня',
    'kuhni': 'Кухня',
    'shkafy': 'Шкафы',
    'prihozhaya': 'Прихожая'
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
      <Helmet>
        <title>{categoryData.title}</title>
        <meta name="description" content={categoryData.metaDescription} />
        <meta name="keywords" content={[...categoryData.primaryKeywords, ...categoryData.secondaryKeywords].join(', ')} />
        <link rel="canonical" href={`https://laranamebel.ru/catalog/${slug}`} />
        
        <meta property="og:title" content={categoryData.ogTitle || categoryData.title} />
        <meta property="og:description" content={categoryData.ogDescription || categoryData.metaDescription} />
        <meta property="og:type" content={categoryData.ogType || 'website'} />
        <meta property="og:url" content={`https://laranamebel.ru/catalog/${slug}`} />
        <meta property="og:image" content="https://cdn.poehali.dev/files/8e9a575f-fd1c-4d40-821a-4154a78e1d00.jpg" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": categoryData.breadcrumb.map((item, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "name": item.name,
              "item": `https://laranamebel.ru${item.url}`
            }))
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": mockProducts.map((product, idx) => ({
              "@type": "Product",
              "position": idx + 1,
              "name": product.title,
              "image": product.image,
              "offers": {
                "@type": "Offer",
                "price": product.price.replace(/[^\d]/g, ''),
                "priceCurrency": "RUB",
                "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
              }
            }))
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
            <nav className="mb-6 text-sm text-muted-foreground" aria-label="Хлебные крошки">
              <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
                {categoryData.breadcrumb.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    {idx > 0 && <Icon name="ChevronRight" size={14} />}
                    {idx === categoryData.breadcrumb.length - 1 ? (
                      <span className="text-foreground" itemProp="name">{item.name}</span>
                    ) : (
                      <Link to={item.url} className="hover:text-foreground transition-colors" itemProp="item">
                        <span itemProp="name">{item.name}</span>
                      </Link>
                    )}
                    <meta itemProp="position" content={String(idx + 1)} />
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryData.h1}</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                {categoryData.content.intro}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Фильтры</h3>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedFilters({});
                          setPriceRange(initialPriceRange);
                        }}
                      >
                        Сбросить
                      </Button>
                    </div>

                    <Accordion type="multiple" defaultValue={['price', 'width', 'type']} className="w-full">
                      {filters.map((filter) => (
                        <AccordionItem key={filter.id} value={filter.id}>
                          <AccordionTrigger className="text-sm">{filter.name}</AccordionTrigger>
                          <AccordionContent>
                            {filter.type === 'range' && (
                              <div className="space-y-4">
                                <Slider
                                  min={filter.min}
                                  max={filter.max}
                                  step={1000}
                                  value={priceRange}
                                  onValueChange={setPriceRange}
                                  className="mb-2"
                                />
                                <div className="flex items-center justify-between text-sm">
                                  <span>{priceRange[0].toLocaleString()} {filter.unit}</span>
                                  <span>{priceRange[1].toLocaleString()} {filter.unit}</span>
                                </div>
                              </div>
                            )}
                            
                            {filter.type === 'checkbox' && filter.options && (
                              <div className="space-y-3">
                                {filter.options.map((option) => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${filter.id}-${option.value}`}
                                      checked={selectedFilters[filter.id]?.includes(option.value)}
                                      onCheckedChange={(checked) => {
                                        const current = selectedFilters[filter.id] || [];
                                        handleFilterChange(
                                          filter.id,
                                          checked
                                            ? [...current, option.value]
                                            : current.filter((v: string) => v !== option.value)
                                        );
                                      }}
                                    />
                                    <label
                                      htmlFor={`${filter.id}-${option.value}`}
                                      className="text-sm cursor-pointer flex-1"
                                    >
                                      {option.label}
                                      {option.count && (
                                        <span className="text-muted-foreground ml-1">({option.count})</span>
                                      )}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </aside>

              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Найдено товаров: <span className="font-semibold text-foreground">{mockProducts.length}</span>
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Сортировка:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="popular">По популярности</option>
                      <option value="price-asc">Цена: по возрастанию</option>
                      <option value="price-desc">Цена: по убыванию</option>
                      <option value="new">Новинки</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {mockProducts.map((product) => (
                    <article 
                      key={product.id}
                      itemScope 
                      itemType="https://schema.org/Product"
                    >
                      <Link 
                        to={`/catalog/${slug}/${product.id}`}
                        className="block"
                      >
                        <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow h-full">
                          <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.title}
                              loading="lazy"
                              itemProp="image"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800';
                                target.onerror = null;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Icon name="Image" size={64} className="text-muted-foreground/30" />
                            </div>
                          )}
                          {product.inStock && (
                            <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                              В наличии
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors" itemProp="name">{product.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{product.width} • {product.material}</p>
                          <div className="mb-3" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                            <meta itemProp="priceCurrency" content="RUB" />
                            <meta itemProp="price" content={typeof product.price === 'string' ? product.price.replace(/[^\d]/g, '') : product.price} />
                            <link itemProp="availability" href={product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
                            <div className="text-3xl font-bold text-foreground mb-2">{formatPrice(product.price)}</div>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Icon name="Truck" size={14} />
                                <span>Доставка в подарок</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Icon name="Wrench" size={14} />
                                <span>Монтаж включён</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Icon name="Wallet" size={14} />
                                <span>Оплата при получении</span>
                              </div>
                            </div>
                          </div>
                          <Button className="w-full" size="lg" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const fullProduct = allFurnitureSets.find(p => p.id === product.id);
                            if (fullProduct) {
                              addToCart(fullProduct);
                              setCheckoutOpen(true);
                            }
                          }}>
                            <Icon name="ShoppingCart" size={18} className="mr-2" />
                            В корзину
                          </Button>
                        </CardContent>
                        </Card>
                      </Link>
                    </article>
                  ))}
                </div>

                <div className="prose prose-lg max-w-none mb-12">
                  {categoryData.content.h2Sections.map((section, idx) => (
                    <div key={idx} className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                      <p className="text-muted-foreground">{section.content}</p>
                    </div>
                  ))}
                </div>

                <Card className="mb-12">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h2>
                    <Accordion type="single" collapsible className="w-full">
                      {categoryData.content.faq.map((item, idx) => (
                        <AccordionItem key={idx} value={`faq-${idx}`}>
                          <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <ScrollToTop />
      </div>

      <CartDialog
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        onConfirmOrder={async (orderData) => {
          await confirmOrder(orderData);
          setCheckoutOpen(false);
        }}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        user={user}
      />

      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={setUser}
      />
    </>
  );
};

export default CategoryPage;