import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
              Пользовательское соглашение
            </h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground mb-6">
                Настоящее Пользовательское соглашение регулирует отношения между интернет-магазином 
                LARANA и пользователями сайта larana.market.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Термины и определения</h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Сайт</strong> — интернет-магазин LARANA, расположенный по адресу larana.market</li>
                <li><strong>Пользователь</strong> — любое лицо, использующее Сайт</li>
                <li><strong>Товар</strong> — продукция мебельной фурнитуры, представленная на Сайте</li>
                <li><strong>Заказ</strong> — оформленная заявка на приобретение Товара</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Общие положения</h2>
              <p className="mb-4">
                Использование Сайта означает безоговорочное согласие Пользователя с настоящим 
                Соглашением и указанными в нем условиями. В случае несогласия с условиями 
                Пользователь должен воздержаться от использования Сайта.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Регистрация на Сайте</h2>
              <p className="mb-4">
                Для оформления заказа Пользователь предоставляет следующие данные:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Фамилия, Имя, Отчество</li>
                <li>Контактный телефон</li>
                <li>Адрес электронной почты</li>
                <li>Адрес доставки</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Оформление и выполнение заказа</h2>
              <p className="mb-4">
                4.1. Заказ оформляется через форму на Сайте или по телефону.
              </p>
              <p className="mb-4">
                4.2. После оформления заказа Пользователь получает подтверждение на указанный email или телефон.
              </p>
              <p className="mb-4">
                4.3. Сроки выполнения заказа согласовываются с Пользователем индивидуально.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Оплата</h2>
              <p className="mb-4">
                Оплата производится одним из способов:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Наличными при получении</li>
                <li>Банковской картой на сайте</li>
                <li>Банковским переводом для юридических лиц</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Доставка</h2>
              <p className="mb-4">
                6.1. Доставка осуществляется по адресу, указанному Пользователем при оформлении заказа.
              </p>
              <p className="mb-4">
                6.2. Сроки и стоимость доставки зависят от региона и веса товара.
              </p>
              <p className="mb-4">
                6.3. Возможен самовывоз со склада в г. Екатеринбург, ул. Крупносортщиков, 14, корпус 2.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Возврат товара</h2>
              <p className="mb-4">
                Возврат товара осуществляется в соответствии с законодательством РФ о защите прав потребителей.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Ответственность</h2>
              <p className="mb-4">
                8.1. Администрация Сайта не несет ответственности за ненадлежащее использование 
                Товаров, заказанных на Сайте.
              </p>
              <p className="mb-4">
                8.2. Администрация не несет ответственности за содержание и достоверность информации, 
                предоставленной Пользователем.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Контактная информация</h2>
              <p className="mb-2">
                <strong>Email:</strong> info@larana.market
              </p>
              <p className="mb-2">
                <strong>Телефон:</strong> +7 (343) 123-45-67
              </p>
              <p className="mb-6">
                <strong>Адрес:</strong> г. Екатеринбург, ул. Крупносортщиков, 14, корпус 2
              </p>

              <p className="text-sm text-muted-foreground mt-8">
                Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
