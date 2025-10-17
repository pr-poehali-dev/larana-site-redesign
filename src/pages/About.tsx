import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: 'Package',
      title: 'Только товары в наличии',
      description: 'Весь ассортимент хранится на нашем складе в Екатеринбурге. Вы получаете мебель за 1-2 дня, а не ждёте недели изготовления.'
    },
    {
      icon: 'Truck',
      title: 'Быстрая доставка',
      description: 'Доставляем по Екатеринбургу и области за 1-2 дня. Привозим, заносим и собираем — вам не нужно ни о чём беспокоиться.'
    },
    {
      icon: 'CheckCircle',
      title: 'Проверенное качество',
      description: 'Работаем только с надёжными поставщиками. Каждый товар проходит контроль качества перед отправкой на склад.'
    },
    {
      icon: 'CreditCard',
      title: 'Прозрачные цены',
      description: 'Цена на сайте = финальная цена с доставкой и сборкой. Никаких скрытых платежей и доплат при получении.'
    }
  ];

  const stats = [
    { value: '500+', label: 'Товаров в наличии' },
    { value: '1-2 дня', label: 'Доставка' },
    { value: '2 года', label: 'Гарантия' },
    { value: '0%', label: 'Рассрочка' }
  ];

  return (
    <>
      <Helmet>
        <title>О компании LARANA — мебель в наличии в Екатеринбурге</title>
        <meta name="description" content="LARANA — магазин готовой мебели в Екатеринбурге. Большой ассортимент в наличии на складе, быстрая доставка за 1-2 дня, сборка и гарантия." />
        <meta name="keywords" content="о компании larana, мебель в наличии екатеринбург, склад мебели" />
        <link rel="canonical" href="https://larana-mebel.ru/about" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "LARANA",
            "description": "Магазин готовой мебели в Екатеринбурге. Все товары в наличии на складе.",
            "url": "https://larana-mebel.ru",
            "logo": "https://cdn.poehali.dev/files/8e9a575f-fd1c-4d40-821a-4154a78e1d00.jpg",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Екатеринбург",
              "addressRegion": "Свердловская область",
              "addressCountry": "RU"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+7-343-351-19-12",
              "contactType": "customer service",
              "areaServed": "RU",
              "availableLanguage": "Russian"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header 
          cartItemsCount={0}
          onCartClick={() => {}}
          onAuthClick={() => {}}
          user={null}
          onLogout={() => {}}
          onOrdersClick={() => {}}
          onProfileClick={() => {}}
          onFavoritesClick={() => {}}
        />
        
        <main className="flex-1">
          <div className="bg-primary text-primary-foreground py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">О компании LARANA</h1>
                <p className="text-xl opacity-90">
                  Мы продаём готовую мебель, которая уже есть на складе. Быстро, удобно, без долгого ожидания.
                </p>
              </div>
            </div>
          </div>

          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-3xl font-bold mb-6">Почему мы работаем только с товарами в наличии</h2>
                  
                  <p className="text-lg text-muted-foreground mb-6">
                    Мы решили отказаться от модели мебели «на заказ» по нескольким причинам:
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon name="Clock" size={20} className="text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Вы получаете мебель быстро</h3>
                        <p className="text-muted-foreground">
                          Не нужно ждать 2-4 недели изготовления. Заказали сегодня — получили через 1-2 дня. 
                          Это особенно важно для тех, кто только въезжает в квартиру или делает срочный ремонт.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon name="Eye" size={20} className="text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Вы видите товар до покупки</h3>
                        <p className="text-muted-foreground">
                          На складе можно посмотреть и потрогать мебель вживую. Никаких сюрпризов при доставке — 
                          вы точно знаете, что получите.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon name="DollarSign" size={20} className="text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Честная цена без накруток</h3>
                        <p className="text-muted-foreground">
                          Мы закупаем большие партии напрямую у производителей, поэтому цены ниже, 
                          чем в мебельных салонах с индивидуальным производством.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-secondary/20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Наши принципы работы</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {values.map((value, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon name={value.icon} size={24} className="text-primary" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                          <p className="text-muted-foreground">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">LARANA в цифрах</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                        {stat.value}
                      </div>
                      <div className="text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Что у нас на складе</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Icon name="Sofa" size={32} className="text-primary flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Мягкая мебель</h3>
                          <p className="text-muted-foreground">
                            Диваны прямые и угловые, кресла, пуфы. Разные механизмы трансформации, 
                            обивки и размеры. Всё в наличии.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Icon name="Box" size={32} className="text-primary flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Шкафы и системы хранения</h3>
                          <p className="text-muted-foreground">
                            Шкафы-купе, распашные шкафы, комоды, тумбы. Разные размеры, 
                            цвета и конфигурации на складе.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Icon name="Bed" size={32} className="text-primary flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Спальни</h3>
                          <p className="text-muted-foreground">
                            Кровати с подъёмным механизмом и без, тумбочки, комоды, 
                            туалетные столики. Готовые комплекты для спальни.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Icon name="Utensils" size={32} className="text-primary flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Столы и стулья</h3>
                          <p className="text-muted-foreground">
                            Обеденные столы, журнальные столики, стулья, барные стойки. 
                            Разные стили и размеры в наличии.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Готовы обновить интерьер?</h2>
                <p className="text-xl opacity-90 mb-8">
                  Приезжайте на склад или выбирайте на сайте — доставим за 1-2 дня
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    onClick={() => navigate('/#catalog')}
                  >
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    Смотреть каталог
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    onClick={() => navigate('/contacts')}
                  >
                    <Icon name="MapPin" size={20} className="mr-2" />
                    Контакты склада
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default About;
