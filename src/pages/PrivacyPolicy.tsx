import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
              Политика конфиденциальности
            </h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground mb-6">
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты 
                персональных данных пользователей сайта LARANA.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Общие положения</h2>
              <p className="mb-4">
                Настоящая Политика конфиденциальности действует в отношении всей информации, 
                которую интернет-магазин LARANA может получить о пользователе во время использования 
                им сайта larana.market.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Сбор и использование данных</h2>
              <p className="mb-4">
                Мы собираем и используем следующую информацию:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>ФИО, контактные данные (телефон, email)</li>
                <li>Адрес доставки товаров</li>
                <li>История заказов и предпочтения</li>
                <li>Данные о посещении сайта (cookies, IP-адрес)</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Цели обработки данных</h2>
              <p className="mb-4">
                Персональные данные обрабатываются для:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Обработки и выполнения заказов</li>
                <li>Связи с клиентами по вопросам заказов</li>
                <li>Улучшения качества обслуживания</li>
                <li>Информирования о новых товарах и акциях</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Защита данных</h2>
              <p className="mb-4">
                Мы применяем технические и организационные меры для защиты персональных данных 
                от несанкционированного доступа, изменения, раскрытия или уничтожения.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Права пользователей</h2>
              <p className="mb-4">
                Пользователи имеют право:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Получать информацию о своих персональных данных</li>
                <li>Требовать исправления неточных данных</li>
                <li>Требовать удаления своих данных</li>
                <li>Отозвать согласие на обработку данных</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Контактная информация</h2>
              <p className="mb-4">
                По вопросам обработки персональных данных обращайтесь:
              </p>
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
