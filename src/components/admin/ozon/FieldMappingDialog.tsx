import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export interface FieldMapping {
  ozonField: string;
  catalogField: string;
  enabled: boolean;
}

interface FieldMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (mappings: FieldMapping[]) => void;
}

const FieldMappingDialog = ({ open, onOpenChange, onConfirm }: FieldMappingDialogProps) => {
  const ozonFields = [
    { value: 'name', label: 'Название товара', example: 'Диван угловой "Комфорт"' },
    { value: 'offer_id', label: 'Артикул продавца', example: 'SKU-12345' },
    { value: 'product_id', label: 'ID товара Ozon', example: '123456789' },
    { value: 'price', label: 'Цена', example: '25000' },
    { value: 'ozonCategory', label: 'Категория и тип', example: 'Мебель / Диваны' },
    { value: 'color', label: 'Название цвета', example: 'Серый' },
    { value: 'modelName', label: 'Название модели (для объединения в одну карточку)', example: 'Комфорт-2024' },
    { value: 'description', label: 'Описание', example: 'Удобный диван...' },
    { value: 'stocks.present', label: 'Остаток на складе', example: '15' },
  ];

  const catalogFields = [
    { value: 'title', label: 'Название товара' },
    { value: 'category', label: 'Категория (Гостиная, Спальня...)' },
    { value: 'price', label: 'Цена' },
    { value: 'description', label: 'Описание' },
    { value: 'supplierArticle', label: 'Артикул поставщика' },
    { value: 'colors', label: 'Цвета (Основные цвета этого товара)' },
    { value: 'colorVariant', label: 'Цветовой вариант' },
    { value: 'variantGroupId', label: 'ID группы вариантов' },
    { value: 'stockQuantity', label: 'Количество на складе' },
    { value: 'style', label: 'Стиль (Современный, Классический...)' },
    { value: 'skip', label: '🚫 Не импортировать это поле' },
  ];

  const defaultMappings: FieldMapping[] = [
    { ozonField: 'name', catalogField: 'title', enabled: true },
    { ozonField: 'offer_id', catalogField: 'supplierArticle', enabled: true },
    { ozonField: 'price', catalogField: 'price', enabled: true },
    { ozonField: 'ozonCategory', catalogField: 'category', enabled: true },
    { ozonField: 'color', catalogField: 'colorVariant', enabled: true },
    { ozonField: 'modelName', catalogField: 'variantGroupId', enabled: true },
    { ozonField: 'description', catalogField: 'description', enabled: true },
    { ozonField: 'stocks.present', catalogField: 'stockQuantity', enabled: true },
  ];

  const [mappings, setMappings] = useState<FieldMapping[]>(defaultMappings);

  useEffect(() => {
    const saved = localStorage.getItem('ozonFieldMappings');
    if (saved) {
      try {
        setMappings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load mappings:', e);
      }
    }
  }, []);

  const updateMapping = (index: number, catalogField: string) => {
    const newMappings = [...mappings];
    newMappings[index] = {
      ...newMappings[index],
      catalogField,
      enabled: catalogField !== 'skip'
    };
    setMappings(newMappings);
  };

  const handleConfirm = () => {
    localStorage.setItem('ozonFieldMappings', JSON.stringify(mappings));
    onConfirm(mappings);
    onOpenChange(false);
  };

  const resetToDefault = () => {
    setMappings(defaultMappings);
  };

  const getOzonFieldLabel = (value: string) => {
    return ozonFields.find(f => f.value === value)?.label || value;
  };

  const getOzonFieldExample = (value: string) => {
    return ozonFields.find(f => f.value === value)?.example || '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Settings2" size={24} />
            Настройка импорта с Ozon
          </DialogTitle>
          <DialogDescription>
            Укажите, какие поля с Ozon соответствуют полям в вашем каталоге товаров
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="gap-2"
            >
              <Icon name="RotateCcw" size={16} />
              Сбросить настройки
            </Button>
          </div>

          <div className="space-y-3">
            {mappings.map((mapping, index) => (
              <Card key={mapping.ozonField} className={!mapping.enabled ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Поле Ozon
                      </Label>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Icon name="Package" size={16} className="text-orange-500" />
                          {getOzonFieldLabel(mapping.ozonField)}
                        </div>
                        <div className="text-xs text-muted-foreground pl-6">
                          Пример: {getOzonFieldExample(mapping.ozonField)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Поле в каталоге
                      </Label>
                      <Select
                        value={mapping.catalogField}
                        onValueChange={(value) => updateMapping(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {catalogFields.map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={handleConfirm} className="gap-2">
              <Icon name="Check" size={16} />
              Сохранить и продолжить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FieldMappingDialog;