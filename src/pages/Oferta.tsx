import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function Oferta() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
              Договор-оферта
            </h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground mb-6">
                Настоящий документ является официальным предложением (публичной офертой) 
                интернет-магазина LARANA и содержит все существенные условия по продаже товаров.
              </p>

              <div className="bg-muted/50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-4">Скачать полный текст договора</h3>
                <Button
                  onClick={() =>
                    window.open(
                      'https://larana.market/assets/larana.market_oferta.pdf',
                      '_blank'
                    )
                  }
                  className="w-full md:w-auto"
                >
                  <Icon name="FileText" className="mr-2" size={18} />
                  Скачать PDF
                </Button>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Предмет договора</h2>
              <p className="mb-4">
                Продавец обязуется передать в собственность Покупателю товар, а Покупатель 
                обязуется принять товар и оплатить его по ценам, указанным на сайте 
                интернет-магазина на момент оформления заказа.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Порядок оформления заказа</h2>
              <p className="mb-4">
                2.1. Заказ может быть оформлен через корзину на сайте или по телефону.
              </p>
              <p className="mb-4">
                2.2. При оформлении заказа Покупатель предоставляет информацию: ФИО, контактный 
                телефон, адрес электронной почты, адрес доставки.
              </p>
              <p className="mb-4">
                2.3. Принятие Покупателем условий настоящей Оферты осуществляется посредством 
                оформления заказа на сайте.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Цена товара</h2>
              <p className="mb-4">
                3.1. Цены на товары указаны на сайте в рублях РФ за единицу товара.
              </p>
              <p className="mb-4">
                3.2. Цены могут быть изменены Продавцом в одностороннем порядке.
              </p>
              <p className="mb-4">
                3.3. Цена конкретного товара, указанная на сайте, может быть изменена Продавцом, 
                однако изменение цены не распространяется на оформленные и оплаченные заказы.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Оплата товара</h2>
              <p className="mb-4">
                Покупатель оплачивает заказ одним из способов:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Наличными курьеру при получении</li>
                <li>Безналичным платежом на сайте (банковская карта)</li>
                <li>Банковским переводом по реквизитам (для юридических лиц)</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Доставка товара</h2>
              <p className="mb-4">
                5.1. Доставка товара осуществляется по адресу, указанному Покупателем.
              </p>
              <p className="mb-4">
                5.2. Срок доставки согласовывается с Покупателем и зависит от региона доставки.
              </p>
              <p className="mb-4">
                5.3. Право собственности и риск случайной гибели товара переходят к Покупателю 
                с момента передачи товара.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Возврат товара</h2>
              <p className="mb-4">
                6.1. Покупатель вправе отказаться от товара в любое время до его передачи, 
                а после передачи товара — в течение 7 дней.
              </p>
              <p className="mb-4">
                6.2. Возврат товара надлежащего качества возможен, если сохранены его товарный 
                вид, потребительские свойства, а также документ, подтверждающий факт покупки.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Гарантии и ответственность</h2>
              <p className="mb-4">
                7.1. Продавец не несет ответственности за ущерб, причиненный Покупателю 
                вследствие ненадлежащего использования товара.
              </p>
              <p className="mb-4">
                7.2. Продавец вправе передать свои права и обязанности по исполнению договора третьим лицам.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Реквизиты продавца</h2>
              <p className="mb-2">
                <strong>Наименование:</strong> ИП Казанцев Александр Витальевич
              </p>
              <p className="mb-2">
                <strong>ИНН:</strong> 665811471307
              </p>
              <p className="mb-2">
                <strong>ОГРНИП:</strong> 323665800144085
              </p>
              <p className="mb-2">
                <strong>Адрес:</strong> г. Екатеринбург, ул. Крупносортщиков, 14, офис 102
              </p>
              <p className="mb-2">
                <strong>Email:</strong> zakaz@larana.market
              </p>
              <p className="mb-2">
                <strong>Телефон:</strong> +7 (343) 351-19-12
              </p>
              <p className="mb-6">
                <strong>Режим работы:</strong> Пн-Пт 09:00–21:00, Сб 10:00–17:00, Вс выходной
              </p>

              <div className="bg-muted/50 p-6 rounded-lg mt-8">
                <p className="text-sm">
                  Полный текст договора-оферты с указанием всех реквизитов и печати доступен для скачивания в формате PDF.
                </p>
                <Button
                  onClick={() =>
                    window.open(
                      'https://larana.market/assets/larana.market_oferta.pdf',
                      '_blank'
                    )
                  }
                  variant="outline"
                  className="w-full md:w-auto mt-4"
                >
                  <Icon name="Download" className="mr-2" size={18} />
                  Скачать полный договор (PDF)
                </Button>
              </div>

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