import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useProducts } from '@/contexts/ProductContext';

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
  }
];

const Catalog = () => {
  const { allFurnitureSets } = useProducts();
  
  const catalogCategories = catalogCategoriesBase.map(cat => ({
    ...cat,
    count: allFurnitureSets.filter(product => product.category === cat.categoryName).length
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
                  Выберите категорию для просмотра товаров
                </p>
              </div>

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