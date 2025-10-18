import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { calculateDelivery, searchCities } from '@/utils/deliveryCalculator';
import { formatPrice } from '@/utils/formatPrice';

interface DeliveryCalculatorProps {
  city?: string;
  address?: string;
  onDeliveryCalculated?: (deliveryPrice: number, isFreeZone: boolean) => void;
  compact?: boolean;
}

const DeliveryCalculator = ({ city = '', address = '', onDeliveryCalculated, compact = false }: DeliveryCalculatorProps) => {
  const [inputCity, setInputCity] = useState(city);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(calculateDelivery(city, address));

  useEffect(() => {
    if (city) {
      setInputCity(city);
      const info = calculateDelivery(city, address);
      setDeliveryInfo(info);
      onDeliveryCalculated?.(info.deliveryPrice, info.isFreeZone);
    }
  }, [city, address]);

  const handleCityChange = (value: string) => {
    setInputCity(value);
    
    if (value.length >= 2) {
      const results = searchCities(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    const info = calculateDelivery(value, address);
    setDeliveryInfo(info);
    onDeliveryCalculated?.(info.deliveryPrice, info.isFreeZone);
  };

  const handleSelectCity = (selectedCity: string) => {
    setInputCity(selectedCity);
    setShowSuggestions(false);
    
    const info = calculateDelivery(selectedCity, address);
    setDeliveryInfo(info);
    onDeliveryCalculated?.(info.deliveryPrice, info.isFreeZone);
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="space-y-2 relative">
          <Label htmlFor="delivery-city">Город доставки</Label>
          <div className="relative">
            <Icon name="MapPin" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              id="delivery-city"
              value={inputCity}
              onChange={(e) => handleCityChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Начните вводить город..."
              className="pl-10"
            />
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectCity(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {inputCity && deliveryInfo.city && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Стоимость доставки:</span>
              {deliveryInfo.isFreeZone ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Бесплатно
                </Badge>
              ) : (
                <span className="font-semibold">{formatPrice(deliveryInfo.deliveryPrice)}</span>
              )}
            </div>
            {deliveryInfo.estimatedDays && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Срок доставки:</span>
                <span className="text-sm font-medium">{deliveryInfo.estimatedDays}</span>
              </div>
            )}
            {deliveryInfo.distance && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Расстояние:</span>
                <span className="text-sm">{deliveryInfo.distance}</span>
              </div>
            )}
          </div>
        )}

        {inputCity && !deliveryInfo.city && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Icon name="AlertCircle" size={18} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900">Требуется уточнение</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Город не найден в базе. Стоимость доставки будет рассчитана менеджером.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Calculator" size={24} />
          Калькулятор доставки
        </CardTitle>
        <CardDescription>
          Узнайте стоимость и срок доставки в ваш город
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 relative">
          <Label htmlFor="calc-city">Город или населённый пункт</Label>
          <div className="relative">
            <Icon name="MapPin" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              id="calc-city"
              value={inputCity}
              onChange={(e) => handleCityChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Например: Екатеринбург, Челябинск..."
              className="pl-10"
            />
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectCity(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={16} className="text-muted-foreground" />
                    <span>{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {inputCity && deliveryInfo.city && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Город доставки</p>
                <p className="font-semibold">{deliveryInfo.city}</p>
              </div>
              {deliveryInfo.distance && (
                <Badge variant="outline">{deliveryInfo.distance}</Badge>
              )}
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Стоимость доставки:</span>
                {deliveryInfo.isFreeZone ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-base px-3 py-1">
                    Бесплатно
                  </Badge>
                ) : (
                  <span className="text-lg font-bold">{formatPrice(deliveryInfo.deliveryPrice)}</span>
                )}
              </div>
              
              {deliveryInfo.estimatedDays && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Срок доставки:</span>
                  <span className="font-semibold text-sm">{deliveryInfo.estimatedDays}</span>
                </div>
              )}
            </div>

            {deliveryInfo.isFreeZone && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                <Icon name="CheckCircle2" size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-900">Бесплатная доставка и сборка!</p>
                  <p className="text-xs text-green-700 mt-1">
                    Для вашего города действует бесплатная доставка и сборка мебели
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {inputCity && !deliveryInfo.city && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-yellow-900">Требуется уточнение стоимости</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Город "{inputCity}" не найден в нашей базе тарифов. Оставьте заявку, и менеджер рассчитает точную стоимость доставки.
                </p>
              </div>
            </div>
          </div>
        )}

        {!inputCity && (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Search" className="mx-auto mb-2" size={32} />
            <p className="text-sm">Начните вводить название города</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryCalculator;
