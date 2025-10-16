import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const TargetAudienceSection = () => {
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

  return (
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
  );
};

export default TargetAudienceSection;
