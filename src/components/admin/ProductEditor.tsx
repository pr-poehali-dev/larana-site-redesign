import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import ImageViewer from './ImageViewer';

interface ProductEditorProps {
  product: any;
  products: any[];
  onProductUpdate: (products: any[]) => void;
  onClose: () => void;
}

const ProductEditor = ({ product, products, onProductUpdate, onClose }: ProductEditorProps) => {
  const [productForm, setProductForm] = useState({
    title: '',
    category: '',
    price: '',
    image: '',
    images: [] as string[],
    items: '',
    style: '',
    description: '',
    colors: '',
    inStock: true,
    supplierArticle: '',
    stockQuantity: null as number | null
  });
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (product.id) {
      setProductForm({
        title: product.title,
        category: product.category,
        price: product.price,
        image: product.image,
        images: product.images || [product.image],
        items: product.items.join(', '),
        style: product.style,
        description: product.description,
        colors: product.colors.join(', '),
        inStock: product.inStock,
        supplierArticle: product.supplierArticle || '',
        stockQuantity: product.stockQuantity || null
      });
    } else {
      setProductForm({
        title: '',
        category: '',
        price: '',
        image: '',
        images: [],
        items: '',
        style: '',
        description: '',
        colors: '',
        inStock: true,
        supplierArticle: '',
        stockQuantity: null
      });
    }
  }, [product]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://api.poehali.dev/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.url;
        
        const newImages = [...productForm.images, imageUrl];
        setProductForm({ 
          ...productForm, 
          images: newImages,
          image: productForm.image || imageUrl
        });
        
        toast({
          title: "Изображение загружено",
          description: "Файл успешно добавлен"
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить изображение",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          uploadImage(file);
        }
      });
    }
  };

  const setMainImage = (imageUrl: string) => {
    setProductForm({ ...productForm, image: imageUrl });
    toast({
      title: "Главное изображение обновлено",
      description: "Это изображение будет отображаться в каталоге"
    });
  };

  const removeImage = (imageUrl: string) => {
    const newImages = productForm.images.filter(img => img !== imageUrl);
    const newMainImage = productForm.image === imageUrl 
      ? (newImages[0] || '') 
      : productForm.image;
    
    setProductForm({ 
      ...productForm, 
      images: newImages,
      image: newMainImage
    });
    
    toast({
      title: "Изображение удалено",
      description: "Файл удален из галереи"
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...productForm.images];
    const draggedImage = newImages[draggedIndex];
    
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    setProductForm({ ...productForm, images: newImages });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const openImageViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const saveProduct = () => {
    if (!product) return;

    const updatedProduct = {
      ...product,
      title: productForm.title,
      category: productForm.category,
      price: productForm.price,
      image: productForm.image,
      images: productForm.images,
      items: productForm.items.split(',').map(item => item.trim()),
      style: productForm.style,
      description: productForm.description,
      colors: productForm.colors.split(',').map(color => color.trim()),
      inStock: productForm.inStock,
      supplierArticle: productForm.supplierArticle,
      stockQuantity: productForm.stockQuantity
    };

    const updatedProducts = products.map(p => 
      p.id === product.id ? updatedProduct : p
    );

    onProductUpdate(updatedProducts);
    onClose();
    toast({
      title: "Товар обновлен",
      description: "Изменения сохранены успешно"
    });
  };

  const addNewProduct = () => {
    const newProduct = {
      id: Math.max(...products.map(p => p.id)) + 1,
      title: productForm.title,
      category: productForm.category,
      price: productForm.price,
      image: productForm.image,
      images: productForm.images,
      items: productForm.items.split(',').map(item => item.trim()),
      style: productForm.style,
      description: productForm.description,
      colors: productForm.colors.split(',').map(color => color.trim()),
      inStock: productForm.inStock,
      supplierArticle: productForm.supplierArticle,
      stockQuantity: productForm.stockQuantity
    };

    onProductUpdate([...products, newProduct]);
    setProductForm({
      title: '',
      category: '',
      price: '',
      image: '',
      images: [],
      items: '',
      style: '',
      description: '',
      colors: '',
      inStock: true,
      supplierArticle: '',
      stockQuantity: null
    });
    toast({
      title: "Товар добавлен",
      description: "Новый товар успешно создан"
    });
  };

  const deleteProduct = (productId: number) => {
    if (confirm('Удалить этот товар?')) {
      onProductUpdate(products.filter(p => p.id !== productId));
      onClose();
      toast({
        title: "Товар удален",
        description: "Товар удален из каталога"
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">
        {product.id ? 'Редактировать товар' : 'Новый товар'}
      </h3>

      <div className="space-y-3">
        <div>
          <Label>Название</Label>
          <Input
            value={productForm.title}
            onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
            placeholder="Название товара"
          />
        </div>

        <div>
          <Label>Категория</Label>
          <Select
            value={productForm.category}
            onValueChange={(value) => setProductForm({ ...productForm, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Спальня">Спальня</SelectItem>
              <SelectItem value="Гостиная">Гостиная</SelectItem>
              <SelectItem value="Кухня">Кухня</SelectItem>
              <SelectItem value="Шкафы">Шкафы</SelectItem>
              <SelectItem value="Детская">Детская</SelectItem>
              <SelectItem value="Прихожая">Прихожая</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Цена</Label>
          <Input
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
            placeholder="38900 ₽"
          />
        </div>

        <div>
          <Label>Стиль</Label>
          <Select
            value={productForm.style}
            onValueChange={(value) => setProductForm({ ...productForm, style: value })}
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
        </div>

        <div>
          <Label>Изображения товара</Label>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
                disabled={uploading}
                className="w-full"
              >
                <Icon name={uploading ? "Loader2" : "Upload"} size={16} className={`mr-2 ${uploading ? 'animate-spin' : ''}`} />
                {uploading ? 'Загрузка...' : 'Загрузить изображения'}
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {productForm.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {productForm.images.map((imageUrl, idx) => (
                  <Card 
                    key={idx}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`relative overflow-hidden cursor-move transition-all ${
                      productForm.image === imageUrl ? 'ring-2 ring-primary' : ''
                    } ${draggedIndex === idx ? 'opacity-50 scale-95' : ''}`}
                  >
                    <CardContent className="p-2">
                      <div 
                        className="relative aspect-square group"
                        onClick={() => openImageViewer(idx)}
                      >
                        <img 
                          src={imageUrl} 
                          alt={`Фото ${idx + 1}`}
                          className="w-full h-full object-cover rounded pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                          <div className="bg-white/90 rounded-full p-2">
                            <Icon name="Maximize2" size={20} className="text-black" />
                          </div>
                        </div>
                        {productForm.image === imageUrl && (
                          <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                            Главное
                          </div>
                        )}
                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Icon name="GripVertical" size={12} />
                          {idx + 1}
                        </div>
                        <div className="absolute top-1 right-1 flex gap-1">
                          {productForm.image !== imageUrl && (
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMainImage(imageUrl);
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <Icon name="Star" size={14} />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(imageUrl);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <Icon name="X" size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {productForm.images.length === 0 
                ? 'Загрузите изображения товара. Первое станет главным.'
                : `Загружено ${productForm.images.length} фото. Перетаскивайте для изменения порядка. Нажмите на звездочку, чтобы сделать главным.`
              }
            </p>
          </div>
        </div>

        <div>
          <Label>Состав (через запятую)</Label>
          <Input
            value={productForm.items}
            onChange={(e) => setProductForm({ ...productForm, items: e.target.value })}
            placeholder="Кровать 160, Шкаф 2Д, Тумбы"
          />
        </div>

        <div>
          <Label>Цвета (через запятую)</Label>
          <Input
            value={productForm.colors}
            onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
            placeholder="Белый, Серый, Дуб"
          />
        </div>

        <div>
          <Label>Описание</Label>
          <Textarea
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            placeholder="Описание товара"
            rows={3}
          />
        </div>

        <div className="border-t pt-3 space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Icon name="Database" size={16} />
            Служебные данные (не публикуются)
          </h4>
          
          <div>
            <Label>Артикул поставщика</Label>
            <Input
              value={productForm.supplierArticle}
              onChange={(e) => setProductForm({ ...productForm, supplierArticle: e.target.value })}
              placeholder="Артикул из системы поставщика"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Для автоматизации синхронизации остатков
            </p>
          </div>

          <div>
            <Label>Количество на складе</Label>
            <Input
              type="number"
              min="0"
              value={productForm.stockQuantity === null ? '' : productForm.stockQuantity}
              onChange={(e) => setProductForm({ 
                ...productForm, 
                stockQuantity: e.target.value ? parseInt(e.target.value) : null 
              })}
              placeholder="Оставьте пустым, если неизвестно"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Точное количество для автоматического учёта
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="inStock"
              checked={productForm.inStock}
              onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="inStock">В наличии</Label>
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-6">
            Используйте галочку, если не знаете точное количество
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        {product.id ? (
          <>
            <Button onClick={saveProduct} className="flex-1">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteProduct(product.id)}
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Удалить
            </Button>
          </>
        ) : (
          <Button onClick={addNewProduct} className="flex-1">
            <Icon name="Plus" size={16} className="mr-2" />
            Создать товар
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Отмена
        </Button>
      </div>

      <ImageViewer
        images={productForm.images}
        initialIndex={viewerIndex}
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  );
};

export default ProductEditor;