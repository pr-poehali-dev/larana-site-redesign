import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import QuickFilters from '@/components/QuickFilters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useProducts } from '@/contexts/ProductContext';
import { formatPrice } from '@/utils/formatPrice';

const catalogCategoriesBase = [
  {
    slug: 'gostinaya',
    title: 'Гостиные',
    categoryName: 'Гостиная',
    description: 'Диваны прямые и угловые с механизмами трансформации',
    icon: 'Sofa',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/55ef2f3b-2c0d-430e-b90d-5ac124f152a7.jpg'
  },
  {
    slug: 'spalnya',
    title: 'Спальни',
    categoryName: 'Спальня',
    description: 'Кровати, комоды, тумбы для спальни',
    icon: 'Bed',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/857f001b-0b80-43af-a51b-f2a18a4ef240.jpg'
  },
  {
    slug: 'kuhni',
    title: 'Кухни',
    categoryName: 'Кухня',
    description: 'Модульные кухонные гарнитуры под любой размер',
    icon: 'ChefHat',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/4b4f05f3-22e9-4eac-8af3-69ffc361cde8.jpg'
  },
  {
    slug: 'shkafy',
    title: 'Шкафы',
    categoryName: 'Шкафы',
    description: 'Шкафы-купе с зеркальными и глухими фасадами',
    icon: 'Box',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/5f05fce3-e920-49ee-9348-2bf8a0c2704e.jpg'
  },
  {
    slug: 'prihozhaya',
    title: 'Прихожие',
    categoryName: 'Прихожая',
    description: 'Компактные решения для коридора и прихожей',
    icon: 'DoorOpen',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/b2671236-b685-4573-ac0e-0e2e4f68a820.jpg'
  },
  {
    slug: 'detskaya',
    title: 'Детская',
    categoryName: 'Детская',
    description: 'Безопасная и яркая мебель для детской комнаты',
    icon: 'Baby',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/55ef2f3b-2c0d-430e-b90d-5ac124f152a7.jpg'
  }
];

const Catalog = () => {
  const { availableProducts } = useProducts();
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showProducts, setShowProducts] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(24);

  const handleFilterChange = (type: 'price', value: string) => {
    setSelectedPriceRange(selectedPriceRange === value ? '' : value);
    setShowProducts(true);
  };

  const filteredProducts = useMemo(() => {
    let filtered = availableProducts;

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        const price = typeof p.price === 'string' 
          ? parseFloat(p.price.replace(/[^\d.]/g, '')) 
          : parseFloat(p.price);
        return price >= min && price <= max;
      });
    }

    return filtered;
  }, [availableProducts, selectedPriceRange]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^\d.]/g, '')) : parseFloat(a.price);
          const priceB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^\d.]/g, '')) : parseFloat(b.price);
          return priceA - priceB;
        });
      case 'price-desc':
        return sorted.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^\d.]/g, '')) : parseFloat(a.price);
          const priceB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^\d.]/g, '')) : parseFloat(b.price);
          return priceB - priceA;
        });
      case 'newest':
        return sorted.sort((a, b) => b.id - a.id);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const catalogCategories = catalogCategoriesBase.map(cat => ({
    ...cat,
    count: availableProducts.filter(product => 
      product.category === cat.categoryName
    ).length
  }));
  return (
    <>
      <Helmet>
        <title>Каталог мебели в Екатеринбурге | LARANA</title>
        <meta name="description" content="Каталог мебели: шкафы-купе, диваны, кухни. Доставка по Екатеринбургу, гарантия 2 года." />
        <link rel="canonical" href="https://laranamebel.ru/catalog" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Каталог мебели LARANA",
            "description": "Каталог мебели: шкафы-купе, диваны, кухни, спальни, прихожие",
            "url": "https://laranamebel.ru/catalog",
            "hasPart": catalogCategories.map(cat => ({
              "@type": "ItemList",
              "name": cat.title,
              "description": cat.description,
              "url": `https://laranamebel.ru/catalog/${cat.slug}`,
              "numberOfItems": cat.count
            }))
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
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <ScrollToTop />
        
        <main className="flex-grow">
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Каталог мебели
                </h1>
                <p className="text-lg text-muted-foreground">
                  {availableProducts.length.toLocaleString('ru-RU')} товаров в наличии
                </p>
              </div>

              <div className="max-w-5xl mx-auto mb-12">
                <Card>
                  <CardContent className="p-6">
                    <QuickFilters
                      onFilterChange={handleFilterChange}
                      selectedPriceRange={selectedPriceRange}
                    />
                    <div className="mt-6 pt-6 border-t">
                      <Button 
                        onClick={() => {
                          setShowProducts(true);
                          setSelectedPriceRange('');
                          setSortBy('default');
                          setDisplayLimit(24);
                        }}
                        size="lg"
                        variant="outline"
                        className="w-full"
                      >
                        <Icon name="Grid3x3" className="mr-2" size={20} />
                        Показать все товары ({availableProducts.length})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {showProducts && filteredProducts.length > 0 && (
                <div className="mb-12">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold">
                      Найдено: {filteredProducts.length} товаров
                    </h2>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                          <SelectValue placeholder="Сортировка" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">По умолчанию</SelectItem>
                          <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                          <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                          <SelectItem value="newest">Сначала новые</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedPriceRange('');
                          setSortBy('default');
                          setShowProducts(false);
                        }}
                      >
                        Сбросить
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.slice(0, displayLimit).map((product) => {
                      const price = typeof product.price === 'string' 
                        ? parseFloat(product.price.replace(/[^\d.]/g, '')) 
                        : parseFloat(product.price);
                      const imageUrl = Array.isArray(product.images) && product.images.length > 0
                        ? product.images[0]
                        : (product.image || '');
                      
                      return (
                        <Link key={product.id} to={`/product/${product.slug}`}>
                          <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300">
                            <div className="aspect-square overflow-hidden">
                              <img 
                                src={imageUrl} 
                                alt={product.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                              <p className="text-xl font-bold text-primary">{formatPrice(price)}</p>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                  {sortedProducts.length > displayLimit && (
                    <div className="text-center mt-8">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setDisplayLimit(prev => prev + 24)}
                      >
                        <Icon name="ChevronDown" className="mr-2" size={20} />
                        Показать ещё ({sortedProducts.length - displayLimit} товаров)
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="mb-12">
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-8 text-center">
                    <Icon name="Box" className="mx-auto mb-4 text-primary" size={48} />
                    <h2 className="text-3xl font-bold mb-3">Готовые комплекты мебели</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      Подобранные комплекты для спальни, гостиной и детской. 
                      Экономьте до 20% при покупке набора!
                    </p>
                    <Button asChild size="lg">
                      <Link to="/catalog/bundles">
                        <Icon name="Package" className="mr-2" size={20} />
                        Посмотреть комплекты
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-2xl font-bold mb-6 text-center">Категории</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {catalogCategories.map((category) => (
                  <Link 
                    key={category.slug} 
                    to={`/catalog/${category.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={category.image} 
                          alt={category.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon name={category.icon} className="text-primary" size={24} />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                              {category.title}
                            </h2>
                            <p className="text-muted-foreground mb-3">
                              {category.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{category.count} товаров</span>
                            </div>
                          </div>
                          <Icon 
                            name="ChevronRight" 
                            className="text-muted-foreground group-hover:text-primary transition-colors" 
                            size={24} 
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Catalog;