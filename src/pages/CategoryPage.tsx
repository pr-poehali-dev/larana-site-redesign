import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { categories, categoryFilters } from '@/data/catalogData';
import { useProductData } from '@/hooks/useProductData';
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

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const categoryData = slug ? categories[slug] : null;
  const filters = slug ? categoryFilters[slug] : [];
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [priceRange, setPriceRange] = useState<number[]>([15000, 80000]);
  const [sortBy, setSortBy] = useState('popular');

  const { allFurnitureSets } = useProductData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!categoryData) {
    return <Navigate to="/404" replace />;
  }

  const handleFilterChange = (filterId: string, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const categoryMapping: Record<string, string> = {
    'shkafy-kupe': 'Шкафы',
    'divany': 'Гостиная'
  };

  const targetCategory = categoryMapping[slug || ''];

  const mockProducts = useMemo(() => {
    if (!targetCategory) return [];
    
    return allFurnitureSets
      .filter(product => product.category === targetCategory)
      .map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        inStock: product.inStock,
        width: product.items[0] || '',
        material: product.colors[0] || ''
      }));
  }, [allFurnitureSets, targetCategory]);

  return (
    <>
      <Helmet>
        <title>{categoryData.title}</title>
        <meta name="description" content={categoryData.metaDescription} />
        <meta name="keywords" content={[...categoryData.primaryKeywords, ...categoryData.secondaryKeywords].join(', ')} />
        <link rel="canonical" href={`https://larana-mebel.ru/catalog/${slug}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": categoryData.breadcrumb.map((item, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "name": item.name,
              "item": `https://larana-mebel.ru${item.url}`
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
        <Header />
        
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <nav className="mb-6 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                {categoryData.breadcrumb.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    {idx > 0 && <Icon name="ChevronRight" size={14} />}
                    {idx === categoryData.breadcrumb.length - 1 ? (
                      <span className="text-foreground">{item.name}</span>
                    ) : (
                      <a href={item.url} className="hover:text-foreground transition-colors">
                        {item.name}
                      </a>
                    )}
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
                      <Button variant="ghost" size="sm" onClick={() => setSelectedFilters({})}>
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
                    <Card key={product.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.inStock && (
                          <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                            В наличии
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{product.width} • {product.material}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">{product.price}</span>
                          <Button size="sm">
                            <Icon name="ShoppingCart" size={16} className="mr-2" />
                            Купить
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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
    </>
  );
};

export default CategoryPage;