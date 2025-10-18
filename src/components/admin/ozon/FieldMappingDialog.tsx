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
  sampleProduct?: any;
}

const FieldMappingDialog = ({ open, onOpenChange, onConfirm, sampleProduct }: FieldMappingDialogProps) => {
  const ozonFields = [
    { value: 'offer_id', label: 'Артикул продавца', example: 'SKU-12345' },
    { value: 'name', label: 'Название товара', example: 'Диван угловой "Комфорт"' },
    { value: 'price', label: 'Цена', example: '25000' },
    { value: 'images', label: 'Все фотографии', example: '[массив изображений]' },
    { value: 'description', label: 'Аннотация/Описание', example: 'Удобный диван...' },
    { value: 'color', label: 'Название цвета (из атрибутов)', example: 'Серый' },
    { value: 'modelName', label: 'Название модели (для объединения в одну карточку)', example: 'Комфорт-2024' },
    { value: 'ozonCategory', label: 'Категория и тип (из атрибутов)', example: 'Диваны' },
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
    { ozonField: 'offer_id', catalogField: 'supplierArticle', enabled: true },
    { ozonField: 'name', catalogField: 'title', enabled: true },
    { ozonField: 'price', catalogField: 'price', enabled: true },
    { ozonField: 'images', catalogField: 'skip', enabled: false },
    { ozonField: 'description', catalogField: 'description', enabled: true },
    { ozonField: 'color', catalogField: 'colors', enabled: true },
    { ozonField: 'modelName', catalogField: 'variantGroupId', enabled: true },
    { ozonField: 'ozonCategory', catalogField: 'category', enabled: true },
  ];

  const [mappings, setMappings] = useState<FieldMapping[]>(defaultMappings);
  const [showPreview, setShowPreview] = useState(false);

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

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const getPreviewValue = (ozonField: string): string => {
    if (!sampleProduct) return 'Нет данных';
    
    const value = getNestedValue(sampleProduct, ozonField);
    
    if (value === undefined || value === null) return '—';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    
    return String(value);
  };

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
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="gap-2"
            >
              <Icon name="RotateCcw" size={16} />
              Сбросить настройки
            </Button>
            
            {sampleProduct && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                <Icon name={showPreview ? "EyeOff" : "Eye"} size={16} />
                {showPreview ? 'Скрыть предпросмотр' : 'Показать предпросмотр'}
              </Button>
            )}
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
                        {showPreview && sampleProduct && (
                          <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-950 rounded text-xs">
                            <div className="font-medium text-orange-700 dark:text-orange-300 mb-1">
                              Реальные данные:
                            </div>
                            <div className="text-orange-900 dark:text-orange-100 break-all">
                              {getPreviewValue(mapping.ozonField)}
                            </div>
                          </div>
                        )}
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
                      {showPreview && sampleProduct && mapping.enabled && mapping.catalogField !== 'skip' && (
                        <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 rounded text-xs">
                          <div className="font-medium text-green-700 dark:text-green-300 mb-1">
                            Будет импортировано:
                          </div>
                          <div className="text-green-900 dark:text-green-100 break-all">
                            ✓ {getPreviewValue(mapping.ozonField)}
                          </div>
                        </div>
                      )}
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