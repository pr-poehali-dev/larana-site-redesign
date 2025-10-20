import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { clearProductCache } from '@/utils/productCache';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';

interface BulkPriceUpdateProps {
  products: any[];
  onProductsUpdate: (products: any[]) => void;
}

const BulkPriceUpdate = ({ products, onProductsUpdate }: BulkPriceUpdateProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [articleColumn, setArticleColumn] = useState('A');
  const [priceColumn, setPriceColumn] = useState('B');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const downloadSampleFile = () => {
    const sampleData = [
      ['Артикул поставщика', 'Цена'],
      ['ART-001', '25900'],
      ['ART-002', '38900'],
      ['ART-003', '57900']
    ];

    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Образец');
    XLSX.writeFile(wb, 'образец_обновления_цен.xlsx');

    toast({
      title: "Файл загружен",
      description: "Образец файла сохранён на ваше устройство"
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

      const articleColIndex = articleColumn.toUpperCase().charCodeAt(0) - 65;
      const priceColIndex = priceColumn.toUpperCase().charCodeAt(0) - 65;

      let updatedCount = 0;
      const updatedProducts = [...products];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const article = row[articleColIndex]?.toString().trim();
        const price = row[priceColIndex]?.toString().trim();

        if (!article || !price) continue;

        const productIndex = updatedProducts.findIndex(
          p => p.supplierArticle === article
        );

        if (productIndex !== -1) {
          updatedProducts[productIndex].price = `${price} ₽`;
          updatedCount++;
        }
      }

      if (updatedCount > 0) {
        onProductsUpdate(updatedProducts);
        clearProductCache();
        toast({
          title: "Цены обновлены",
          description: `Обновлено цен: ${updatedCount} товаров`
        });
        setFile(null);
      } else {
        toast({
          title: "Товары не найдены",
          description: "Не найдено совпадений по артикулам поставщика",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка обработки файла",
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
          <Icon name="FileSpreadsheet" size={20} />
          Массовое обновление цен
        </CardTitle>
        <CardDescription>
          Загрузите файл Excel с артикулами и ценами для обновления
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
            Скачать образец
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Колонка с артикулом (A, B, C...)</Label>
            <Input
              value={articleColumn}
              onChange={(e) => setArticleColumn(e.target.value.toUpperCase())}
              placeholder="A"
              maxLength={2}
            />
          </div>
          <div>
            <Label>Колонка с ценой (A, B, C...)</Label>
            <Input
              value={priceColumn}
              onChange={(e) => setPriceColumn(e.target.value.toUpperCase())}
              placeholder="B"
              maxLength={2}
            />
          </div>
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
              Обработка...
            </>
          ) : (
            <>
              <Icon name="Upload" size={16} className="mr-2" />
              Загрузить и обновить цены
            </>
          )}
        </Button>

        <div className="text-sm text-muted-foreground space-y-1 pt-2 border-t">
          <p><strong>Инструкция:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Скачайте образец файла</li>
            <li>Заполните артикулы поставщика и новые цены</li>
            <li>Укажите колонки с данными (по умолчанию A и B)</li>
            <li>Загрузите файл для обновления</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkPriceUpdate;