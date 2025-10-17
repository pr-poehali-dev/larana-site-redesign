import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import CityAutocomplete from '@/components/CityAutocomplete';
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
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    
    let formatted = '+7';
    
    if (numbers.length > 1) {
      formatted += ' (' + numbers.substring(1, 4);
    }
    if (numbers.length >= 5) {
      formatted += ') ' + numbers.substring(4, 7);
    }
    if (numbers.length >= 8) {
      formatted += '-' + numbers.substring(7, 9);
    }
    if (numbers.length >= 10) {
      formatted += '-' + numbers.substring(9, 11);
    }
    
    return formatted;
  };

  const validatePhone = (value: string): boolean => {
    const numbers = value.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    
    if (formatted.length > 0 && !validatePhone(formatted)) {
      setPhoneError('Введите корректный номер телефона');
    } else {
      setPhoneError('');
    }
  };

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleDeliveryCalculation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!city.trim()) {
      toast({
        title: "Укажите город",
        description: "Выберите город из выпадающего списка",
        variant: "destructive"
      });
      return;
    }

    if (!phone.trim()) {
      toast({
        title: "Укажите телефон",
        description: "Введите номер телефона для связи",
        variant: "destructive"
      });
      return;
    }

    if (!validatePhone(phone)) {
      toast({
        title: "Некорректный номер телефона",
        description: "Введите номер в формате +7 (999) 123-45-67",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://functions.poehali.dev/5bb39c34-5468-4f00-906c-c2bed52f18d9', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'delivery_calculation',
          city: city.trim(),
          phone: phone.trim(),
          timestamp: new Date().toLocaleString('ru-RU')
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки');
      }

      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время для расчета стоимости доставки"
      });

      setCity('');
      setPhone('');
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Попробуйте позже или свяжитесь с нами по телефону",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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

        <Card className="mb-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/30">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <Icon name="Calculator" size={32} className="text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Узнать стоимость доставки в ваш регион
                </h2>
                <p className="text-muted-foreground">
                  Оставьте заявку, и мы рассчитаем точную стоимость доставки мебели в ваш город
                </p>
              </div>
            </div>
            
            <form onSubmit={handleDeliveryCalculation} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <CityAutocomplete
                  value={city}
                  onChange={(value) => setCity(value)}
                  label="Ваш город"
                  placeholder="Например: Москва"
                  required
                />
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Телефон для связи <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`w-full ${phoneError ? 'border-destructive' : ''}`}
                    required
                  />
                  {phoneError && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <Icon name="AlertCircle" size={12} />
                      {phoneError}
                    </p>
                  )}
                  {phone.length > 0 && !phoneError && validatePhone(phone) && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <Icon name="CheckCircle2" size={12} />
                      Номер телефона корректен
                    </p>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={18} className="mr-2" />
                    Рассчитать стоимость доставки
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

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