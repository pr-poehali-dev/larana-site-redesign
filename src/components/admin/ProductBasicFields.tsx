import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductBasicFieldsProps {
  formData: {
    title: string;
    category: string;
    price: string;
    style: string;
    items: string;
    colors: string;
    description: string;
  };
  onChange: (field: string, value: string) => void;
}

const ProductBasicFields = ({ formData, onChange }: ProductBasicFieldsProps) => {
  return (
    <>
      <div>
        <Label>Название</Label>
        <Input
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Название товара"
        />
        <p className="text-xs text-muted-foreground mt-1">
          💡 Для группировки цветов используйте одинаковое базовое название. 
          Например: "Кухня Лара 180" для всех цветов этой модели
        </p>
      </div>

      <div>
        <Label>Категория</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => onChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Спальни">Спальни</SelectItem>
            <SelectItem value="Гостиные">Гостиные</SelectItem>
            <SelectItem value="Кухни">Кухни</SelectItem>
            <SelectItem value="Шкафы">Шкафы</SelectItem>
            <SelectItem value="Прихожие">Прихожие</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Цена</Label>
        <Input
          value={formData.price}
          onChange={(e) => onChange('price', e.target.value)}
          placeholder="38900 ₽"
        />
      </div>

      <div>
        <Label>Стиль</Label>
        <Select
          value={formData.style}
          onValueChange={(value) => onChange('style', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите стиль" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Скандинавский">Скандинавский</SelectItem>
            <SelectItem value="Современный">Современный</SelectItem>
            <SelectItem value="Минимализм">Минимализм</SelectItem>
            <SelectItem value="Классика">Классика</SelectItem>
            <SelectItem value="Лофт">Лофт</SelectItem>
            <SelectItem value="Модерн">Модерн</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Используется в фильтре по стилям
        </p>
      </div>

      <div>
        <Label>Состав (через запятую)</Label>
        <Input
          value={formData.items}
          onChange={(e) => onChange('items', e.target.value)}
          placeholder="Кровать 160, Шкаф 2Д, Тумбы"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Используется в фильтрах по размерам/ширине
        </p>
      </div>

      <div>
        <Label>Цвета (через запятую)</Label>
        <Input
          value={formData.colors}
          onChange={(e) => onChange('colors', e.target.value)}
          placeholder="Белый глянец, Серый матовый, Венге"
        />
        <p className="text-xs text-muted-foreground mt-1">
          💡 Товары с одинаковым базовым названием автоматически группируются — 
          все их цвета будут показаны в одной карточке для удобства выбора покупателя
        </p>
      </div>

      <div>
        <Label>Описание</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Описание товара"
          rows={3}
        />
      </div>
    </>
  );
};

export default ProductBasicFields;