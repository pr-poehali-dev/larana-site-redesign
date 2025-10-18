import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { sverdlovskRegionRates, cottageSettlementsEkb, chelyabinskRegionRates, deliveryInfo } from '@/data/deliveryRates';

const Delivery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('sverdlovsk');

  const allRates = [...sverdlovskRegionRates, ...cottageSettlementsEkb, ...chelyabinskRegionRates];

  const filteredSverdlovsk = sverdlovskRegionRates.filter(rate =>
    rate.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCottages = cottageSettlementsEkb.filter(rate =>
    rate.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChelyabinsk = chelyabinskRegionRates.filter(rate =>
    rate.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAll = allRates.filter(rate =>
    rate.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isFreeZone = (city: string) => {
    return deliveryInfo.freeDeliveryZones.some(zone =>
      city.toLowerCase().includes(zone.toLowerCase())
    );
  };

  const renderTable = (rates: typeof sverdlovskRegionRates) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold">Населенный пункт</th>
            <th className="text-left py-3 px-4 font-semibold">Расстояние</th>
            <th className="text-right py-3 px-4 font-semibold">Стоимость</th>
          </tr>
        </thead>
        <tbody>
          {rates.length > 0 ? (
            rates.map((rate, index) => (
              <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {rate.city}
                    {isFreeZone(rate.city) && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Бесплатно
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{rate.distance}</td>
                <td className="py-3 px-4 text-right font-semibold">
                  {rate.price.toLocaleString('ru-RU')} ₽
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-8 text-center text-muted-foreground">
                <Icon name="Search" className="mx-auto mb-2" size={32} />
                <p>Населенный пункт не найден</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Доставка и тарифы | LARANA</title>
        <meta name="description" content="Стоимость доставки мебели по Свердловской и Челябинской области. Бесплатная сборка и доставка для Екатеринбурга, Среднеуральска и Верхней Пышмы." />
      </Helmet>

      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Доставка мебели</h1>
              <p className="text-xl text-muted-foreground">
                Свердловская и Челябинская области
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Truck" className="text-primary" size={24} />
                    <CardTitle className="text-lg">Газель</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{deliveryInfo.gazelle.pricePerHour} ₽/час</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    До {deliveryInfo.gazelle.maxWeight} кг
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Объём: {deliveryInfo.gazelle.volumeRange}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Gift" className="text-green-600" size={24} />
                    <CardTitle className="text-lg">Бесплатно</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium mb-2">Сборка и доставка:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {deliveryInfo.freeDeliveryZones.map(zone => (
                      <li key={zone} className="flex items-center gap-1">
                        <Icon name="Check" size={16} className="text-green-600" />
                        {zone}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Warehouse" className="text-primary" size={24} />
                    <CardTitle className="text-lg">Хранение</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {deliveryInfo.storageAvailable 
                      ? 'Возможно промежуточное хранение на складе'
                      : 'Хранение не доступно'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Тарифы доставки</CardTitle>
                <CardDescription>
                  Выберите регион и найдите свой населенный пункт
                </CardDescription>
                <div className="mt-4">
                  <div className="relative">
                    <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                      type="text"
                      placeholder="Поиск по названию..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="sverdlovsk">
                      <span className="hidden sm:inline">Свердловская обл.</span>
                      <span className="sm:hidden">Свердл.</span>
                    </TabsTrigger>
                    <TabsTrigger value="cottages">
                      <span className="hidden sm:inline">Коттеджные посёлки</span>
                      <span className="sm:hidden">КП</span>
                    </TabsTrigger>
                    <TabsTrigger value="chelyabinsk">
                      <span className="hidden sm:inline">Челябинская обл.</span>
                      <span className="sm:hidden">Челяб.</span>
                    </TabsTrigger>
                    <TabsTrigger value="all">
                      Все
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="sverdlovsk" className="mt-4">
                    {renderTable(filteredSverdlovsk)}
                    <p className="text-xs text-muted-foreground mt-4">
                      Найдено населенных пунктов: {filteredSverdlovsk.length}
                    </p>
                  </TabsContent>

                  <TabsContent value="cottages" className="mt-4">
                    {renderTable(filteredCottages)}
                    <p className="text-xs text-muted-foreground mt-4">
                      Найдено коттеджных посёлков: {filteredCottages.length}
                    </p>
                  </TabsContent>

                  <TabsContent value="chelyabinsk" className="mt-4">
                    {renderTable(filteredChelyabinsk)}
                    <p className="text-xs text-muted-foreground mt-4">
                      Найдено населенных пунктов: {filteredChelyabinsk.length}
                    </p>
                  </TabsContent>

                  <TabsContent value="all" className="mt-4">
                    {renderTable(filteredAll)}
                    <p className="text-xs text-muted-foreground mt-4">
                      Всего населенных пунктов: {filteredAll.length}
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Info" size={24} />
                  Важная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <strong>Бесплатная сборка и доставка</strong> действует только для городов: Екатеринбург, Среднеуральск и Верхняя Пышма
                </p>
                <p className="text-sm">
                  Для остальных населенных пунктов стоимость доставки рассчитывается согласно тарифам
                </p>
                <p className="text-sm">
                  При необходимости возможно промежуточное хранение мебели на наших складах
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Delivery;
