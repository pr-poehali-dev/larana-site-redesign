import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Что входит в стоимость товара?',
    answer: 'Все цены на сайте указаны по принципу "Всё включено" для жителей Екатеринбурга и городов-спутников. В стоимость входит: сам товар, доставка до двери и профессиональная сборка. Вы сразу видите финальную цену готового решения "Под ключ" — никаких скрытых платежей!'
  },
  {
    question: 'Как работает доставка в другие регионы?',
    answer: 'Для жителей других регионов России доставка оплачивается отдельно. Стоимость рассчитывается индивидуально в зависимости от вашего города и габаритов товара.'
  },
  {
    question: 'Какие города входят в зону бесплатной доставки?',
    answer: 'Бесплатная доставка и сборка действует для Екатеринбурга и городов-спутников: Верхняя Пышма, Среднеуральск, Арамиль, Берёзовский и других населенных пунктов в радиусе 30 км от Екатеринбурга.'
  },
  {
    question: 'Сколько времени занимает доставка?',
    answer: 'По Екатеринбургу и городам-спутникам доставка осуществляется в течение 1-3 рабочих дней с момента оформления заказа.'
  }
];

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Часто задаваемые вопросы
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ответы на популярные вопросы о доставке, оплате и условиях работы
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqData.map((item, index) => (
            <Card 
              key={index}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full text-left p-5 flex items-start gap-3 hover:bg-muted/30 transition-colors"
              >
                <Icon 
                  name={expandedIndex === index ? "ChevronDown" : "ChevronRight"}
                  size={22}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <h3 className="text-base md:text-lg font-semibold flex-1 pr-2">
                  {item.question}
                </h3>
              </button>

              {expandedIndex === index && (
                <CardContent className="px-5 pb-5 pt-0">
                  <div className="pl-8 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="/faq">
            <Button variant="outline" size="lg" className="gap-2">
              Смотреть все вопросы
              <Icon name="ArrowRight" size={18} />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
