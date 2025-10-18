import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { calculateFloorCarry, FurnitureCategory } from '@/utils/deliveryCalculator';
import { formatPrice } from '@/utils/formatPrice';

interface FloorCarryCalculatorProps {
  onCarryCalculated?: (carryPrice: number) => void;
  compact?: boolean;
}

const FloorCarryCalculator = ({ onCarryCalculated, compact = false }: FloorCarryCalculatorProps) => {
  const [category, setCategory] = useState<FurnitureCategory>('soft');
  const [floor, setFloor] = useState<number>(1);
  const [hasElevator, setHasElevator] = useState<boolean>(true);
  const [countertopLength, setCountertopLength] = useState<number>(0);

  const calculation = calculateFloorCarry(category, floor, hasElevator, countertopLength);

  const handleCategoryChange = (value: FurnitureCategory) => {
    setCategory(value);
    const calc = calculateFloorCarry(value, floor, hasElevator, countertopLength);
    onCarryCalculated?.(calc.totalPrice);
  };

  const handleFloorChange = (value: number) => {
    setFloor(value);
    const calc = calculateFloorCarry(category, value, hasElevator, countertopLength);
    onCarryCalculated?.(calc.totalPrice);
  };

  const handleElevatorChange = (value: boolean) => {
    setHasElevator(value);
    const calc = calculateFloorCarry(category, floor, value, countertopLength);
    onCarryCalculated?.(calc.totalPrice);
  };

  const handleCountertopLengthChange = (value: number) => {
    setCountertopLength(value);
    const calc = calculateFloorCarry(category, floor, hasElevator, value);
    onCarryCalculated?.(calc.totalPrice);
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Тип мебели</Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bed">Кровать</SelectItem>
              <SelectItem value="soft">Мягкая мебель</SelectItem>
              <SelectItem value="corner-sofa">Угловой диван</SelectItem>
              <SelectItem value="kitchen">Кухня</SelectItem>
              <SelectItem value="countertop">Столешница</SelectItem>
              <SelectItem value="mixed">Смешанный заказ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="floor-compact">Этаж</Label>
            <Input
              id="floor-compact"
              type="number"
              min="1"
              max="30"
              value={floor}
              onChange={(e) => handleFloorChange(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label>Лифт</Label>
            <RadioGroup 
              value={hasElevator ? 'yes' : 'no'} 
              onValueChange={(v) => handleElevatorChange(v === 'yes')}
              className="flex gap-2 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="elevator-yes-compact" />
                <Label htmlFor="elevator-yes-compact" className="cursor-pointer mb-0 font-normal">Есть</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="elevator-no-compact" />
                <Label htmlFor="elevator-no-compact" className="cursor-pointer mb-0 font-normal">Нет</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {category === 'countertop' && (
          <div className="space-y-2">
            <Label htmlFor="countertop-length">Длина столешницы (мм)</Label>
            <Input
              id="countertop-length"
              type="number"
              min="0"
              placeholder="2400"
              value={countertopLength || ''}
              onChange={(e) => handleCountertopLengthChange(parseInt(e.target.value) || 0)}
            />
          </div>
        )}

        {calculation.totalPrice > 0 && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Подъём на этаж:</span>
              <span className="font-semibold">{formatPrice(calculation.totalPrice)}</span>
            </div>
            <p className="text-xs text-muted-foreground">{calculation.details}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="TrendingUp" size={24} />
          Калькулятор подъёма на этаж
        </CardTitle>
        <CardDescription>
          Рассчитайте стоимость подъёма мебели с учётом типа и этажа
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Тип мебели</Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bed">
                <div className="flex items-center gap-2">
                  <Icon name="Bed" size={16} />
                  Интерьерные кровати
                </div>
              </SelectItem>
              <SelectItem value="soft">
                <div className="flex items-center gap-2">
                  <Icon name="Sofa" size={16} />
                  Мягкая мебель
                </div>
              </SelectItem>
              <SelectItem value="corner-sofa">
                <div className="flex items-center gap-2">
                  <Icon name="Sofa" size={16} />
                  Угловой диван
                </div>
              </SelectItem>
              <SelectItem value="kitchen">
                <div className="flex items-center gap-2">
                  <Icon name="CookingPot" size={16} />
                  Кухня
                </div>
              </SelectItem>
              <SelectItem value="countertop">
                <div className="flex items-center gap-2">
                  <Icon name="RectangleHorizontal" size={16} />
                  Столешница
                </div>
              </SelectItem>
              <SelectItem value="mixed">
                <div className="flex items-center gap-2">
                  <Icon name="Package" size={16} />
                  Смешанный заказ
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="floor">Этаж доставки</Label>
            <Input
              id="floor"
              type="number"
              min="1"
              max="30"
              value={floor}
              onChange={(e) => handleFloorChange(parseInt(e.target.value) || 1)}
              placeholder="1"
            />
          </div>

          <div className="space-y-2">
            <Label>Наличие лифта</Label>
            <RadioGroup 
              value={hasElevator ? 'yes' : 'no'} 
              onValueChange={(v) => handleElevatorChange(v === 'yes')}
              className="flex gap-4 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="elevator-yes" />
                <Label htmlFor="elevator-yes" className="cursor-pointer mb-0 font-normal">Есть</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="elevator-no" />
                <Label htmlFor="elevator-no" className="cursor-pointer mb-0 font-normal">Нет</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {category === 'countertop' && (
          <div className="space-y-2">
            <Label htmlFor="countertop-length-full">Длина столешницы (мм)</Label>
            <Input
              id="countertop-length-full"
              type="number"
              min="0"
              placeholder="Например: 2400"
              value={countertopLength || ''}
              onChange={(e) => handleCountertopLengthChange(parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              До 2300 мм — фиксированная стоимость. От 2800 мм — индивидуальный расчёт
            </p>
          </div>
        )}

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Категория</p>
              <p className="font-semibold">{calculation.category}</p>
            </div>
            <Badge variant="outline" className="text-sm">
              {floor} этаж {hasElevator ? '(с лифтом)' : '(без лифта)'}
            </Badge>
          </div>

          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground mb-2">Расчёт:</p>
            <p className="text-sm mb-3">{calculation.details}</p>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Итого подъём:</span>
              {calculation.totalPrice > 0 ? (
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(calculation.totalPrice)}
                </span>
              ) : (
                <span className="text-sm text-yellow-600">Требуется расчёт</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Важно:</p>
          <p>• Для частного дома: +300 ₽ за каждый этаж</p>
          <p>• При смешанном заказе: расчёт по категории + 300 ₽ за каждое изделие</p>
          <p>• Для столешниц от 2800 мм — индивидуальный расчёт</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FloorCarryCalculator;
