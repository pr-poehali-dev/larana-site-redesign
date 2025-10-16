import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const furnitureSets = [
    {
      id: 1,
      title: 'Набор для гостиной "Северный"',
      category: 'Гостиная',
      price: '3200 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/6dc15d77-b11a-4009-bfbc-a76ac54e68db.jpg',
      items: ['Диван', 'Журнальный стол', 'Стеллаж']
    },
    {
      id: 2,
      title: 'Комплект для спальни "Вариант"',
      category: 'Спальня',
      price: '2800 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/ed6e2b24-421a-4f81-bc83-3eb261fcc919.jpg',
      items: ['Кровать', 'Прикроватные тумбы', 'Шкаф']
    },
    {
      id: 3,
      title: 'Набор для кухни "Контор"',
      category: 'Кухня',
      price: '4100 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/5546849f-7d51-4b8f-aad6-76df00bc86c8.jpg',
      items: ['Кухонный гарнитур', 'Стол', 'Стулья']
    }
  ];

  const targetAudience = [
    {
      icon: 'Heart',
      title: 'Для молодых пар',
      description: 'Стильные решения для первого совместного дома'
    },
    {
      icon: 'Users',
      title: 'Для семей с детьми',
      description: 'Функциональная и безопасная мебель'
    },
    {
      icon: 'Home',
      title: 'Для арендаторов',
      description: 'Быстрая сборка и легкая транспортировка'
    },
    {
      icon: 'Laptop',
      title: 'Для домашнего офиса',
      description: 'Комфортное рабочее пространство'
    }
  ];

  const benefits = [
    {
      icon: 'Home',
      title: 'Готовые комплекты',
      description: 'Всё, что нужно для комнаты — в одном наборе'
    },
    {
      icon: 'Package',
      title: 'Доставка и сборка',
      description: 'Привезём и соберём за вас'
    },
    {
      icon: 'Truck',
      title: 'Быстро — 3-7 дней',
      description: 'От заказа до готового интерьера'
    },
    {
      icon: 'Wrench',
      title: 'Рассрочка 0%',
      description: 'Без первого взноса и переплат'
    }
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-foreground">LARANA</h1>
              <nav className="hidden md:flex gap-6">
                <a href="#catalog" className="text-sm hover:text-primary transition-colors">Каталог</a>
                <a href="#configurator" className="text-sm hover:text-primary transition-colors">Конфигуратор</a>
                <a href="#blog" className="text-sm hover:text-primary transition-colors">Блог</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Icon name="User" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="ShoppingCart" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative bg-secondary py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Готовые интерьеры под ключ.<br />Не думай — живи
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in">
              Дом начинается с мебели. Мебель — с LARANA
            </p>
            <div className="flex flex-wrap gap-4 animate-scale-in">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-foreground">
                <Icon name="Package" size={20} className="mr-2" />
                Выбрать комплект
              </Button>
              <Button size="lg" variant="outline">
                <Icon name="Phone" size={20} className="mr-2" />
                Помощь с выбором
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none shadow-none">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name={benefit.icon} size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовые комплекты мебели</h2>
            <p className="text-lg text-muted-foreground">Всё необходимое для вашего дома в одном решении</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {furnitureSets.map((set) => (
              <Card key={set.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={set.image} 
                    alt={set.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-white text-foreground">{set.category}</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{set.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {set.items.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{item}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{set.price}</span>
                    <Button className="bg-foreground hover:bg-foreground/90 text-background">
                      Конфигуратор
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Для кого мы</h2>
            <p className="text-lg text-muted-foreground">Готовые решения для каждого этапа жизни</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetAudience.map((audience, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name={audience.icon} size={28} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{audience.title}</h3>
                  <p className="text-sm text-muted-foreground">{audience.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Почему выбирают LARANA</h2>
            <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Icon name="CheckCircle2" size={24} className="text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Готовые интерьеры без дизайнера</h3>
                  <p className="text-muted-foreground">Мы сами подберём комплект, который впишется в ваш дом и бюджет</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Icon name="CheckCircle2" size={24} className="text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Всё включено в один комплект</h3>
                  <p className="text-muted-foreground">Спальни, гостиные, кухни — готовые решения с доставкой и сборкой</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Отзывы наших клиентов</h2>
            <p className="text-lg text-muted-foreground">Реальные интерьеры, реальные истории</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Анна К.</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon key={star} name="Star" size={14} className="fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Заказали комплект для спальни. Всё привезли и собрали за 5 дней. 
                    Мебель отличного качества, а главное — не пришлось ничего выбирать самим!"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LARANA</h3>
              <p className="text-sm opacity-80">Готовые интерьеры под ключ</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Гостиные</a></li>
                <li><a href="#" className="hover:opacity-100">Спальни</a></li>
                <li><a href="#" className="hover:opacity-100">Кухни</a></li>
                <li><a href="#" className="hover:opacity-100">Прихожие</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">О нас</a></li>
                <li><a href="#" className="hover:opacity-100">Доставка</a></li>
                <li><a href="#" className="hover:opacity-100">Гарантия</a></li>
                <li><a href="#" className="hover:opacity-100">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>+7 (800) 123-45-67</li>
                <li>info@larana.ru</li>
                <li className="flex gap-4 pt-4">
                  <Icon name="Instagram" size={20} className="cursor-pointer hover:opacity-100" />
                  <Icon name="Facebook" size={20} className="cursor-pointer hover:opacity-100" />
                  <Icon name="Youtube" size={20} className="cursor-pointer hover:opacity-100" />
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm opacity-80">
            <p>© 2024 LARANA. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
