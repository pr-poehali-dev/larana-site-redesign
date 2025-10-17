import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const catalogCategories = [
  {
    slug: 'shkafy-kupe',
    title: 'Шкафы-купе',
    description: 'Встраиваемые и корпусные шкафы-купе различных размеров',
    icon: 'Home',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/5f05fce3-e920-49ee-9348-2bf8a0c2704e.jpg',
    count: 2
  },
  {
    slug: 'divany',
    title: 'Диваны',
    description: 'Угловые и прямые диваны для гостиной',
    icon: 'Sofa',
    image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/55ef2f3b-2c0d-430e-b90d-5ac124f152a7.jpg',
    count: 2
  }
];

const Catalog = () => {
  return (
    <>
      <Helmet>
        <title>Каталог мебели в Екатеринбурге | LARANA</title>
        <meta name="description" content="Каталог мебели: шкафы-купе, диваны, кухни. Доставка по Екатеринбургу, гарантия 2 года." />
        <link rel="canonical" href="https://larana-mebel.ru/catalog" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
