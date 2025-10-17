import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const LocalBusinessInfo = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Мы в Екатеринбурге
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="MapPin" size={32} className="text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Адрес</h3>
                <p className="text-muted-foreground">
                  г. Екатеринбург<br />
                  Свердловская область
                </p>
                <a 
                  href="https://yandex.ru/maps/-/CDdkFYxY" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm mt-2 inline-block"
                >
                  Открыть на карте
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Phone" size={32} className="text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Телефон</h3>
                <a 
                  href="tel:+73432904054" 
                  className="text-muted-foreground hover:text-primary transition-colors text-lg font-medium"
                >
                  +7 (343) 290-40-54
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  Звоните с 9:00 до 18:00
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Clock" size={32} className="text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Часы работы</h3>
                <p className="text-muted-foreground">
                  Пн-Пт: 9:00 — 18:00<br />
                  Сб: 10:00 — 16:00<br />
                  Вс: выходной
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 bg-background p-4 rounded-lg">
                <Icon name="Truck" size={20} className="text-primary" />
                <span className="text-sm font-medium">Доставка</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-background p-4 rounded-lg">
                <Icon name="Wrench" size={20} className="text-primary" />
                <span className="text-sm font-medium">Сборка</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-background p-4 rounded-lg">
                <Icon name="CreditCard" size={20} className="text-primary" />
                <span className="text-sm font-medium">Рассрочка 0%</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-background p-4 rounded-lg">
                <Icon name="Shield" size={20} className="text-primary" />
                <span className="text-sm font-medium">Гарантия 2 года</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalBusinessInfo;
