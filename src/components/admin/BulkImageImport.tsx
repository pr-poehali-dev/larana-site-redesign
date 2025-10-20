import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { clearProductCache } from '@/utils/productCache';

interface BulkImageImportProps {
  products: any[];
  onProductUpdate: (products: any[]) => void;
  onClose: () => void;
}

const BulkImageImport = ({ products, onProductUpdate, onClose }: BulkImageImportProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const importedData = XLSX.utils.sheet_to_json(worksheet);

        let updatedCount = 0;
        let newImagesCount = 0;

        const updatedProducts = products.map(product => {
          const matchingRow = importedData.find((row: any) => {
            const rowTitle = row['Название'] || row['title'] || '';
            const rowArticle = row['Артикул'] || row['Артикул поставщика'] || row['supplierArticle'] || '';
            
            return rowTitle === product.title || 
                   (rowArticle && rowArticle === product.supplierArticle);
          });

          if (matchingRow) {
            const cleanImageUrl = (url: string) => {
              if (!url) return url;
              
              let cleaned = url.trim();
              
              if (cleaned.endsWith('Р') || cleaned.endsWith('р')) {
                cleaned = cleaned.slice(0, -1).trim();
              }
              
              cleaned = cleaned
                .replace(/\s*[₽₸₴€$£¥]\s*.*$/, '')
                .replace(/\s+₽.*$/, '')
                .replace(/₽.*$/, '')
                .split(' ')[0]
                .trim();
              
              return cleaned.startsWith('http') ? cleaned : '';
            };

            const newImages: string[] = [];
            
            for (let i = 1; i <= 20; i++) {
              const imageKey = `Изображение ${i}` || `Image ${i}` || `image${i}`;
              const imageUrl = (matchingRow as any)[imageKey] || (matchingRow as any)[`Изображение ${i}`];
              
              if (imageUrl) {
                const cleaned = cleanImageUrl(String(imageUrl));
                if (cleaned && !newImages.includes(cleaned)) {
                  newImages.push(cleaned);
                }
              }
            }

            if (newImages.length > 0) {
              updatedCount++;
              
              const existingImages = product.images || [product.image];
              const combinedImages = [...new Set([...existingImages, ...newImages])].filter(url => url && url.startsWith('http'));
              
              newImagesCount += (combinedImages.length - existingImages.length);
              
              return {
                ...product,
                images: combinedImages,
                image: combinedImages[0] || product.image
              };
            }
          }

          return product;
        });

        onProductUpdate(updatedProducts);
        clearProductCache();

        toast({
          title: "✅ Картинки импортированы",
          description: `Обновлено товаров: ${updatedCount}, добавлено картинок: ${newImagesCount}`
        });

        setIsProcessing(false);
        onClose();
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "❌ Ошибка импорта",
          description: "Проверьте формат файла",
          variant: "destructive"
        });
        setIsProcessing(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const templateData = products.slice(0, 3).map(p => ({
      'Название': p.title,
      'Артикул поставщика': p.supplierArticle || '',
      'Изображение 1': p.images?.[0] || p.image || '',
      'Изображение 2': '',
      'Изображение 3': '',
      'Изображение 4': '',
      'Изображение 5': ''
    }));

    const ws = XLSX.utils.json_to_sheet(templateData);
    ws['!cols'] = [
      { wch: 30 },
      { wch: 20 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Картинки');
    XLSX.writeFile(wb, 'шаблон_импорт_картинок.xlsx');

    toast({
      title: "Шаблон скачан",
      description: "Заполните ссылки на картинки и загрузите обратно"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">📸 Импорт дополнительных картинок</CardTitle>
            <CardDescription className="mt-1">
              Добавьте дополнительные фотографии к существующим товарам
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
          <p className="font-semibold flex items-center gap-2">
            <Icon name="Info" size={16} className="text-blue-600" />
            Как это работает:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-6">
            <li>Скачайте шаблон Excel с вашими товарами</li>
            <li>Добавьте ссылки на картинки в колонки "Изображение 1", "Изображение 2" и т.д.</li>
            <li>Товары находятся по названию или артикулу поставщика</li>
            <li>Новые картинки добавятся к существующим</li>
            <li>Загрузите заполненный файл обратно</li>
          </ol>
        </div>

        <div className="space-y-3">
          <Button 
            variant="outline" 
            onClick={downloadTemplate}
            className="w-full"
          >
            <Icon name="Download" size={16} className="mr-2" />
            Скачать шаблон с товарами
          </Button>

          <div>
            <Label htmlFor="image-import">Загрузить заполненный файл</Label>
            <Input
              id="image-import"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Форматы: Excel (.xlsx, .xls)
            </p>
          </div>
        </div>

        {isProcessing && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Icon name="Loader2" size={16} className="animate-spin" />
            Обработка файла...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkImageImport;