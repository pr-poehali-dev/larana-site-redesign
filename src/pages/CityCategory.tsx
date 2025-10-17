import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cities, categories, generateSeoMeta } from '@/data/seoData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ScrollToTop from '@/components/ScrollToTop';

const CityCategory = () => {
  const { city = '', category = '' } = useParams();
  const navigate = useNavigate();
  
  const cityData = cities[city as keyof typeof cities];
  const categoryData = categories[category as keyof typeof categories];
  const seo = generateSeoMeta(category, city);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [city, category]);

  if (!cityData || !categoryData || !seo) {
    return <Navigate to="/404" replace />;
  }

  const benefits = [
    {
      icon: 'Ruler',
      title: 'Бесплатный замер',
      description: `Выезд специалиста на объект в ${cityData.declension.prepositional} в удобное для вас время`
    },
    {
      icon: 'Truck',
      title: 'Доставка под ключ',
      description: 'Бесплатная доставка и профессиональная сборка включены в стоимость'
    },
    {
      icon: 'Wallet',
      title: 'Выгодные цены',
      description: 'Работаем напрямую с производителями, без наценок посредников'
    },
    {
      icon: 'Clock',
      title: 'Быстрые сроки',
      description: 'Изготовление от 5 рабочих дней, доставка в течение 1-3 дней'
    }
  ];

  const handleConsultation = () => {
    navigate('/?action=consultation');
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://larana-mebel.ru/city/${city}/${category}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": `${categoryData.name} на заказ`,
            "description": seo.description,
            "brand": {
              "@type": "Brand",
              "name": "LARANA"
            },
            "areaServed": {
              "@type": "City",
              "name": cityData.name
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "RUB",
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <nav className="mb-6 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                {seo.breadcrumb.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    {idx > 0 && <Icon name="ChevronRight" size={14} />}
                    {idx === seo.breadcrumb.length - 1 ? (
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

            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{seo.h1}</h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                {categoryData.description} в {cityData.declension.prepositional}. 
                Бесплатный замер, доставка и профессиональная сборка под ключ.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon name={benefit.icon} className="text-primary" size={24} />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-primary text-primary-foreground mb-12">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      Получите бесплатную консультацию
                    </h2>
                    <p className="opacity-90">
                      Наш специалист ответит на все вопросы и поможет подобрать идеальное решение
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    variant="secondary"
                    onClick={handleConsultation}
                  >
                    Заказать звонок
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="prose prose-lg max-w-none">
              <h2>{categoryData.name} на заказ в {cityData.declension.prepositional}</h2>
              
              <p>
                Компания LARANA предлагает изготовление {categoryData.nameGenitive} на заказ 
                в {cityData.declension.prepositional} и по всей {cityData.region}. 
                Мы работаем напрямую с производителями, что позволяет нам предлагать 
                конкурентные цены без потери качества.
              </p>

              <h3>Почему выбирают нас?</h3>
              <ul>
                <li><strong>Бесплатный замер:</strong> Наш специалист приедет в удобное время, 
                произведёт точные замеры и поможет с выбором</li>
                <li><strong>Цена "под ключ":</strong> Стоимость включает изготовление, 
                доставку и профессиональную сборку</li>
                <li><strong>Гарантия качества:</strong> Используем только проверенные материалы 
                и фурнитуру от надёжных поставщиков</li>
                <li><strong>Быстрые сроки:</strong> Изготовление от 5 рабочих дней, 
                доставка по {cityData.declension.prepositional} — 1-3 дня</li>
              </ul>

              <h3>Как мы работаем</h3>
              <ol>
                <li>Оставьте заявку на сайте или позвоните нам</li>
                <li>Специалист приедет на бесплатный замер</li>
                <li>Согласуем дизайн, материалы и стоимость</li>
                <li>Изготовим {categoryData.nameSingle} на собственном производстве</li>
                <li>Доставим и соберём в удобное для вас время</li>
              </ol>

              <p>
                Работаем по {cityData.declension.prepositional} и всем близлежащим городам. 
                Для уточнения стоимости доставки в ваш район — свяжитесь с нашими менеджерами.
              </p>
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" onClick={handleConsultation}>
                <Icon name="Phone" size={20} className="mr-2" />
                Заказать бесплатный замер
              </Button>
            </div>
          </div>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default CityCategory;
