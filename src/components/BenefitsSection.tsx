import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const BenefitsSection = () => {
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
  );
};

export default BenefitsSection;
