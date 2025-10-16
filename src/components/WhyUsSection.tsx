import Icon from '@/components/ui/icon';

const WhyUsSection = () => {
  return (
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
  );
};

export default WhyUsSection;
