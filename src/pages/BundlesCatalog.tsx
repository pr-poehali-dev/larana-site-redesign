import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { formatPrice } from '@/utils/formatPrice';
import func2url from '@/../backend/func2url.json';
import { useToast } from '@/hooks/use-toast';

interface BundleItem {
  id?: number;
  supplier_article: string;
  product_name: string;
  quantity: number;
  in_stock?: boolean;
}

interface ProductBundle {
  id: number;
  name: string;
  type: string;
  color: string;
  image_url: string;
  price: number;
  description: string;
  items: BundleItem[];
  in_stock: boolean;
}

const BundlesCatalog = () => {
  const [bundles, setBundles] = useState<ProductBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('');
  const { toast } = useToast();

  const bundleTypes = ['Все', 'Спальня', 'Гостиная', 'Детская', 'Прихожая', 'Кухня'];

  useEffect(() => {
    loadBundles();
  }, []);

  const loadBundles = async () => {
    setLoading(true);
    try {
      const response = await fetch(func2url['product-bundles'], {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBundles(data.filter((b: ProductBundle) => b.in_stock));
      }
    } catch (error) {
      console.error('Ошибка загрузки наборов:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить наборы товаров',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBundles = selectedType && selectedType !== 'Все'
    ? bundles.filter(b => b.type === selectedType)
    : bundles;

  return (
    <>
      <Helmet>
        <title>Готовые комплекты мебели | LARANA</title>
        <meta name="description" content="Готовые комплекты мебели для спальни, гостиной, детской. Экономьте до 20% при покупке набора." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <ScrollToTop />
        
        <main className="flex-grow">
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <Link 
                  to="/catalog" 
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Назад в каталог
                </Link>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Готовые комплекты мебели
                </h1>
                <p className="text-lg text-muted-foreground">
                  Подобранные комплекты для вашего интерьера. 
                  Экономьте время и получайте скидку при покупке набора.
                </p>
              </div>

              <div className="mb-8 flex flex-wrap gap-2 justify-center">
                {bundleTypes.map(type => (
                  <Button
                    key={type}
                    variant={selectedType === type || (type === 'Все' && !selectedType) ? 'default' : 'outline'}
                    onClick={() => setSelectedType(type === 'Все' ? '' : type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Загрузка комплектов...</p>
                </div>
              ) : filteredBundles.length === 0 ? (
                <Card className="max-w-md mx-auto">
                  <CardContent className="py-12 text-center">
                    <Icon name="Package" className="mx-auto mb-4" size={48} />
                    <p className="text-muted-foreground">
                      {selectedType 
                        ? `Комплекты категории "${selectedType}" не найдены`
                        : 'Комплекты мебели пока не добавлены'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBundles.map((bundle) => (
                    <Card key={bundle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {bundle.image_url && (
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={bundle.image_url}
                            alt={bundle.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <CardContent className="p-6">
                        <div className="flex gap-2 mb-3">
                          <Badge variant="outline">{bundle.type}</Badge>
                          {bundle.color && <Badge variant="secondary">{bundle.color}</Badge>}
                          {bundle.in_stock && <Badge variant="default">В наличии</Badge>}
                        </div>

                        <h3 className="text-xl font-bold mb-2">{bundle.name}</h3>
                        
                        {bundle.description && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {bundle.description}
                          </p>
                        )}

                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">В комплект входит:</p>
                          <ul className="space-y-1">
                            {bundle.items.map((item, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <Icon name="Check" size={14} className="text-green-500 mt-1 flex-shrink-0" />
                                <span>
                                  {item.product_name}
                                  {item.quantity > 1 && ` (${item.quantity} шт)`}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <p className="text-2xl font-bold">
                            {formatPrice(bundle.price)}
                          </p>
                          <Badge variant="outline" className="text-green-600">
                            <Icon name="TrendingDown" size={14} className="mr-1" />
                            Выгода
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <Button className="w-full" size="lg">
                            <Icon name="ShoppingCart" className="mr-2" size={18} />
                            Купить комплект
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Icon name="Eye" className="mr-2" size={18} />
                            Подробнее
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BundlesCatalog;
