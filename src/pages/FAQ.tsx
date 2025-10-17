import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    answer: 'Для жителей других регионов России доставка оплачивается отдельно. Стоимость рассчитывается индивидуально в зависимости от вашего города и габаритов товара. Свяжитесь с нами для уточнения стоимости доставки в ваш регион.'
  },
  {
    question: 'Какие города входят в зону бесплатной доставки?',
    answer: 'Бесплатная доставка и сборка действует для Екатеринбурга и городов-спутников: Верхняя Пышма, Среднеуральск, Арамиль, Берёзовский и других населенных пунктов в радиусе 30 км от Екатеринбурга.'
  },
  {
    question: 'Сколько времени занимает доставка?',
    answer: 'По Екатеринбургу и городам-спутникам доставка осуществляется в течение 1-3 рабочих дней с момента оформления заказа. Точное время доставки согласовывается с вами нашим менеджером.'
  },
  {
    question: 'Можно ли отказаться от сборки?',
    answer: 'Да, вы можете отказаться от услуги сборки. В этом случае стоимость будет пересчитана. Свяжитесь с нашим менеджером при оформлении заказа, чтобы обсудить детали.'
  },
  {
    question: 'Какие способы оплаты вы принимаете?',
    answer: 'Мы принимаем оплату наличными курьеру при получении, картой онлайн на сайте, а также картой курьеру при доставке. Выберите удобный вам способ при оформлении заказа.'
  },
  {
    question: 'Есть ли гарантия на товары?',
    answer: 'Да, на всю мебель предоставляется официальная гарантия производителя. Срок гарантии зависит от конкретного товара и указан в описании. Мы также предоставляем гарантию на качество сборки.'
  },
  {
    question: 'Можно ли вернуть или обменять товар?',
    answer: 'Да, вы можете вернуть или обменять товар в течение 14 дней с момента получения, если он не был в употреблении и сохранен товарный вид. Подробности уточняйте у наших менеджеров.'
  }
];

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Часто задаваемые вопросы
          </h1>
          <p className="text-lg text-muted-foreground">
            Ответы на популярные вопросы о доставке, оплате и условиях работы
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <Card 
              key={index}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full text-left p-6 flex items-start gap-4 hover:bg-muted/30 transition-colors"
              >
                <Icon 
                  name={expandedIndex === index ? "ChevronDown" : "ChevronRight"}
                  size={24}
                  className="text-primary mt-1 flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold pr-4">
                    {item.question}
                  </h3>
                </div>
              </button>

              {expandedIndex === index && (
                <CardContent className="px-6 pb-6 pt-0">
                  <div className="pl-10 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 bg-primary/5 rounded-lg border-2 border-primary/20">
          <div className="flex items-start gap-4">
            <Icon name="MessageCircle" size={32} className="text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Не нашли ответ на свой вопрос?
              </h3>
              <p className="text-muted-foreground mb-4">
                Свяжитесь с нами любым удобным способом, и мы с радостью поможем вам!
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="tel:+79000000000" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Icon name="Phone" size={18} />
                  Позвонить
                </a>
                <a 
                  href="mailto:info@example.com" 
                  className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
                >
                  <Icon name="Mail" size={18} />
                  Написать email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
