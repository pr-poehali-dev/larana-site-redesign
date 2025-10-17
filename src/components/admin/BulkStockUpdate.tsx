import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';

interface BulkStockUpdateProps {
  products: any[];
  onProductsUpdate: (products: any[]) => void;
}

const BulkStockUpdate = ({ products, onProductsUpdate }: BulkStockUpdateProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [articleColumn, setArticleColumn] = useState('A');
  const [stockColumn, setStockColumn] = useState('B');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const downloadSampleFile = () => {
    const sampleData = [
      ['Артикул поставщика', 'Количество на складе'],
      ['ART-001', '15'],
      ['ART-002', '8'],
      ['ART-003', '0'],
      ['ART-004', '23']
    ];

    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Остатки');
    XLSX.writeFile(wb, 'образец_обновления_остатков.xlsx');

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
      const stockColIndex = stockColumn.toUpperCase().charCodeAt(0) - 65;

      let updatedCount = 0;
      const updatedProducts = [...products];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const article = row[articleColIndex]?.toString().trim();
        const stock = row[stockColIndex]?.toString().trim();

        if (!article || stock === undefined || stock === '') continue;

        const stockQuantity = parseInt(stock);
        if (isNaN(stockQuantity)) continue;

        const productIndex = updatedProducts.findIndex(
          p => p.supplierArticle === article
        );

        if (productIndex !== -1) {
          updatedProducts[productIndex].stockQuantity = stockQuantity;
          updatedProducts[productIndex].inStock = stockQuantity > 0;
          updatedCount++;
        }
      }

      if (updatedCount > 0) {
        onProductsUpdate(updatedProducts);
        toast({
          title: "Остатки обновлены",
          description: `Обновлено остатков: ${updatedCount} товаров`
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
          <Icon name="Package" size={20} />
          Обновление остатков товаров
        </CardTitle>
        <CardDescription>
          Загрузите файл Excel с артикулами и количеством для обновления остатков
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
            <Label>Колонка с количеством (A, B, C...)</Label>
            <Input
              value={stockColumn}
              onChange={(e) => setStockColumn(e.target.value.toUpperCase())}
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
              Загрузить и обновить остатки
            </>
          )}
        </Button>

        <div className="text-sm text-muted-foreground space-y-1 pt-2 border-t">
          <p><strong>Инструкция:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Скачайте образец файла</li>
            <li>Заполните артикулы поставщика и количество на складе</li>
            <li>Укажите колонки с данными (по умолчанию A и B)</li>
            <li>Загрузите файл для обновления остатков</li>
          </ol>
          <p className="pt-2 text-xs">
            💡 При количестве = 0 товар автоматически помечается как "Нет в наличии"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkStockUpdate;
