import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';
import { clearProductCache } from '@/utils/productCache';

interface BulkProductImportProps {
  products: any[];
  onProductsUpdate: (products: any[]) => void;
}

const BulkProductImport = ({ products, onProductsUpdate }: BulkProductImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const downloadSampleFile = () => {
    const sampleData = [
      [
        'Название',
        'Категория',
        'Цена (₽)',
        'Стиль',
        'Описание',
        'Ссылка на изображение',
        'Артикул поставщика',
        'В наличии (да/нет)',
        'Количество на складе',
        'Состав комплекта (через ;)',
        'Цвета (через ;)',
        'ID группы вариантов',
        'Цвет варианта'
      ],
      [
        'Спальня "Модерн"',
        'Спальня',
        '45900',
        'Современный',
        'Элегантная спальня в современном стиле с минималистичным дизайном',
        'https://cdn.poehali.dev/files/example-image.jpg',
        'ART-BEDROOM-001',
        'да',
        '5',
        'Кровать 160;Тумбы прикроватные 2 шт;Комод',
        'Белый;Дуб натуральный;Графит',
        '',
        ''
      ],
      [
        'Диван "Комфорт" (серый)',
        'Диваны',
        '35900',
        'Современный',
        'Удобный трёхместный диван с механизмом еврокнижка',
        'https://cdn.poehali.dev/files/sofa-grey.jpg',
        'ART-SOFA-004',
        'да',
        '3',
        'Каркас;Механизм трансформации;Ящик для белья',
        'Серый',
        'sofa-comfort-001',
        'Серый'
      ],
      [
        'Диван "Комфорт" (бежевый)',
        'Диваны',
        '35900',
        'Современный',
        'Удобный трёхместный диван с механизмом еврокнижка',
        'https://cdn.poehali.dev/files/sofa-beige.jpg',
        'ART-SOFA-005',
        'да',
        '5',
        'Каркас;Механизм трансформации;Ящик для белья',
        'Бежевый',
        'sofa-comfort-001',
        'Бежевый'
      ],
      [
        'Шкаф-купе "Премиум 2Д"',
        'Шкафы',
        '22900',
        'Классический',
        'Вместительный двухдверный шкаф-купе с зеркалом',
        'https://cdn.poehali.dev/files/wardrobe.jpg',
        'ART-WARD-003',
        'да',
        '12',
        'Корпус;Двери 2 шт;Зеркало;Внутренние полки',
        'Венге;Дуб сонома',
        '',
        ''
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    
    const colWidths = [
      { wch: 25 },
      { wch: 12 },
      { wch: 10 },
      { wch: 15 },
      { wch: 50 },
      { wch: 40 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 40 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 }
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Товары');
    XLSX.writeFile(wb, 'образец_импорта_товаров.xlsx');

    toast({
      title: "Файл загружен",
      description: "Образец файла импорта сохранён на ваше устройство"
    });
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Ошибка",
        description: "Выберите файл для загрузки",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const newProducts = [];
      let maxId = Math.max(...products.map(p => p.id), 0);

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        if (!row[0] || !row[1] || !row[2]) continue;

        const title = row[0]?.toString().trim();
        const category = row[1]?.toString().trim();
        const price = row[2]?.toString().trim();
        const style = row[3]?.toString().trim() || 'Современный';
        const description = row[4]?.toString().trim() || '';
        const imageUrl = row[5]?.toString().trim() || 'https://cdn.poehali.dev/files/placeholder.jpg';
        const supplierArticle = row[6]?.toString().trim() || '';
        const inStockText = row[7]?.toString().toLowerCase().trim();
        const inStock = inStockText === 'да' || inStockText === 'yes' || inStockText === '1';
        const stockQuantity = row[8] ? parseInt(row[8].toString()) : null;
        const itemsText = row[9]?.toString().trim() || '';
        const items = itemsText ? itemsText.split(';').map(s => s.trim()).filter(s => s) : [];
        const colorsText = row[10]?.toString().trim() || '';
        const colors = colorsText ? colorsText.split(';').map(s => s.trim()).filter(s => s) : [];
        const variantGroupId = row[11]?.toString().trim() || '';
        const colorVariant = row[12]?.toString().trim() || '';

        maxId++;
        
        newProducts.push({
          id: maxId,
          title,
          category,
          price: `${price} ₽`,
          style,
          description,
          image: imageUrl,
          supplierArticle,
          inStock,
          stockQuantity,
          items,
          colors,
          variantGroupId: variantGroupId || undefined,
          colorVariant: colorVariant || undefined
        });
      }

      if (newProducts.length > 0) {
        const updatedProducts = [...products, ...newProducts];
        onProductsUpdate(updatedProducts);
        clearProductCache();
        
        toast({
          title: "Товары импортированы",
          description: `Добавлено новых товаров: ${newProducts.length}`
        });
        setFile(null);
      } else {
        toast({
          title: "Нет данных",
          description: "В файле не найдено корректных записей для импорта",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Ошибка импорта",
        description: "Проверьте формат файла и повторите попытку",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Upload" size={20} />
          Массовый импорт товаров
        </CardTitle>
        <CardDescription>
          Загрузите файл Excel с товарами для добавления в каталог
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={downloadSampleFile}
            className="flex items-center gap-2"
          >
            <Icon name="Download" size={16} />
            Скачать образец с примерами
          </Button>
        </div>

        <div>
          <Label>Файл Excel (.xlsx, .xls)</Label>
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
          />
          {file && (
            <p className="text-sm text-muted-foreground mt-2">
              Выбран файл: {file.name}
            </p>
          )}
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={!file || processing}
          className="w-full"
        >
          {processing ? (
            <>
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
              Импорт...
            </>
          ) : (
            <>
              <Icon name="Upload" size={16} className="mr-2" />
              Импортировать товары
            </>
          )}
        </Button>

        <div className="text-sm text-muted-foreground space-y-2 pt-2 border-t">
          <p><strong>Формат файла:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Название</strong> — название товара (обязательно)</li>
            <li><strong>Категория</strong> — Спальня, Кухня, Гостиная, Шкафы, Прихожая (обязательно)</li>
            <li><strong>Цена</strong> — только число без символа ₽ (обязательно)</li>
            <li><strong>Стиль</strong> — Современный, Классический, Скандинавский</li>
            <li><strong>Описание</strong> — краткое описание товара</li>
            <li><strong>Ссылка на изображение</strong> — полная URL ссылка на картинку</li>
            <li><strong>Артикул поставщика</strong> — артикул для идентификации</li>
            <li><strong>В наличии</strong> — да/нет</li>
            <li><strong>Количество на складе</strong> — число или пусто</li>
            <li><strong>Состав комплекта</strong> — элементы через точку с запятой</li>
            <li><strong>Цвета</strong> — доступные цвета через точку с запятой</li>
            <li><strong>ID группы вариантов</strong> — одинаковый ID для товаров с разными цветами (опционально)</li>
            <li><strong>Цвет варианта</strong> — конкретный цвет данного варианта (опционально)</li>
          </ul>
          
          <p className="pt-2"><strong>Инструкция:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Скачайте образец файла с примерами</li>
            <li>Заполните данные о товарах по образцу</li>
            <li>Для изображений используйте прямые ссылки (https://...)</li>
            <li>Загрузите файл для импорта</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkProductImport;