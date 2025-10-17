import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import ScrollToTop from '@/components/ScrollToTop';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { handleSmoothNavigation } from '@/utils/smoothScroll';

const Contacts = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast({
        title: "Заполните все поля",
        description: "Укажите имя, телефон и сообщение",
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
          type: 'contact_form',
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim(),
          timestamp: new Date().toLocaleString('ru-RU')
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки');
      }

      toast({
        title: "Сообщение отправлено!",
        description: "Мы свяжемся с вами в ближайшее время"
      });

      setName('');
      setPhone('');
      setMessage('');
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
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/8e9a575f-fd1c-4d40-821a-4154a78e1d00.jpg" 
                alt="LARANA" 
                className="h-16 md:h-20 w-auto"
              />
            </a>
            <nav className="hidden md:flex gap-6">
              <a href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Главная</a>
              <a 
                href="/#catalog" 
                onClick={(e) => { e.preventDefault(); handleSmoothNavigation('/#catalog'); }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Каталог
              </a>
              <a 
                href="/#configurator" 
                onClick={(e) => { e.preventDefault(); handleSmoothNavigation('/#configurator'); }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Конфигуратор
              </a>
              <a href="/faq" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">FAQ</a>
              <a href="/contacts" className="text-sm font-medium text-primary border-b-2 border-primary transition-colors">Контакты</a>
            </nav>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Icon name="Menu" size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Меню</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  <a
                    href="/"
                    className="text-base py-2 px-3 rounded-md transition-colors text-foreground hover:bg-accent"
                  >
                    Главная
                  </a>
                  <a
                    href="/#catalog"
                    onClick={(e) => { e.preventDefault(); handleSmoothNavigation('/#catalog'); }}
                    className="text-base py-2 px-3 rounded-md transition-colors text-foreground hover:bg-accent cursor-pointer"
                  >
                    Каталог
                  </a>
                  <a
                    href="/#configurator"
                    onClick={(e) => { e.preventDefault(); handleSmoothNavigation('/#configurator'); }}
                    className="text-base py-2 px-3 rounded-md transition-colors text-foreground hover:bg-accent cursor-pointer"
                  >
                    Конфигуратор
                  </a>
                  <a
                    href="/faq"
                    className="text-base py-2 px-3 rounded-md transition-colors text-foreground hover:bg-accent"
                  >
                    FAQ
                  </a>
                  <a
                    href="/contacts"
                    className="text-base py-2 px-3 rounded-md transition-colors bg-primary text-primary-foreground font-medium"
                  >
                    Контакты
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Контакты
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Свяжитесь с нами любым удобным способом — мы всегда рады помочь!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold mb-4">Наши контакты</h2>

                <div className="flex items-start gap-3">
                  <Icon name="MapPin" size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Адрес офиса и пункта самовывоза</h3>
                    <p className="text-muted-foreground">
                      г. Екатеринбург, ул. Крупносортщиков, 14, офис 102
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="Phone" size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Телефон</h3>
                    <a 
                      href="tel:+73433511912" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +7 (343) 351-19-12
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="Mail" size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Электронная почта</h3>
                    <a 
                      href="mailto:zakaz@larana.market" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      zakaz@larana.market
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="Clock" size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">График работы</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>Пн-Пт: 09:00–21:00</p>
                      <p>Сб: 10:00–17:00</p>
                      <p>Вс: выходной</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="Share2" size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Социальные сети</h3>
                    <a 
                      href="https://vk.com/larana96" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                      ВКонтакте
                      <Icon name="ExternalLink" size={16} />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full h-[400px]">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?um=constructor%3A8e9a575f-fd1c-4d40-821a-4154a78e1d00&amp;source=constructor"
                    width="100%"
                    height="400"
                    frameBorder="0"
                    className="w-full h-full"
                    title="Карта офиса LARANA"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Написать нам</h2>
                <p className="text-muted-foreground mb-6">
                  Оставьте сообщение, и мы свяжемся с вами в ближайшее время
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Ваше имя <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Иван Иванов"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Телефон <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Сообщение <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="Напишите ваш вопрос или комментарий..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[150px] resize-none"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Icon name="Send" size={18} className="mr-2" />
                        Отправить сообщение
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <Icon name="Info" size={16} className="flex-shrink-0 mt-0.5" />
                    Мы ответим на ваше сообщение в течение рабочего дня
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <ScrollToTop />
    </div>
  );
};

export default Contacts;