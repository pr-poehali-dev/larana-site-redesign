import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import ImageViewer from './ImageViewer';

interface ProductImageGalleryProps {
  images: string[];
  mainImage: string;
  onImagesChange: (images: string[], mainImage: string) => void;
  productTitle?: string;
  productCategory?: string;
}

const ProductImageGallery = ({ images, mainImage, onImagesChange, productTitle, productCategory }: ProductImageGalleryProps) => {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://functions.poehali.dev/1a0d83e1-cea3-41fb-a393-b01eba523b70', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload error:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || `Ошибка загрузки: ${response.status}`);
      }

      const data = await response.json();
      console.log('Upload success:', data);
      
      const imageUrl = data.url;
      
      if (!imageUrl) {
        throw new Error('URL изображения не найден в ответе сервера');
      }
      
      const newImages = [...images, imageUrl];
      const newMainImage = mainImage || imageUrl;
      onImagesChange(newImages, newMainImage);
      
      toast({
        title: "Изображение загружено",
        description: "Файл успешно добавлен"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : "Не удалось загрузить изображение",
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
    onImagesChange(images, imageUrl);
    toast({
      title: "Главное изображение обновлено",
      description: "Это изображение будет отображаться в каталоге"
    });
  };

  const removeImage = (imageUrl: string) => {
    const newImages = images.filter(img => img !== imageUrl);
    const newMainImage = mainImage === imageUrl 
      ? (newImages[0] || '') 
      : mainImage;
    
    onImagesChange(newImages, newMainImage);
    
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

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    onImagesChange(newImages, mainImage);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const openImageViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const addImageFromUrl = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите URL изображения",
        variant: "destructive"
      });
      return;
    }

    // Простая валидация URL
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      toast({
        title: "Некорректный URL",
        description: "URL должен начинаться с http:// или https://",
        variant: "destructive"
      });
      return;
    }

    const newImages = [...images, imageUrl.trim()];
    const newMainImage = mainImage || imageUrl.trim();
    onImagesChange(newImages, newMainImage);
    
    setImageUrl('');
    setShowUrlInput(false);
    
    toast({
      title: "Изображение добавлено",
      description: "URL успешно добавлен в галерею"
    });
  };

  const generateImage = async () => {
    if (!productTitle) {
      toast({
        title: "Ошибка",
        description: "Укажите название товара для генерации изображения",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);

    try {
      const prompt = `${productTitle}, профессиональная фотография товара, белый фон, студийное освещение, высокая детализация, 4k`;

      const response = await fetch('https://api.kie.ai/nano-banana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_KIE_API_KEY || ''}`
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка API: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.url || data.image_url || data.imageUrl) {
        const generatedUrl = data.url || data.image_url || data.imageUrl;
        const newImages = [...images, generatedUrl];
        const newMainImage = mainImage || generatedUrl;
        onImagesChange(newImages, newMainImage);
        
        toast({
          title: "Изображение сгенерировано!",
          description: "AI создал изображение товара"
        });
      } else {
        throw new Error('URL изображения не найден в ответе API');
      }
    } catch (error) {
      toast({
        title: "Ошибка генерации",
        description: error instanceof Error ? error.message : "Не удалось сгенерировать изображение",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <Label>Изображения товара</Label>
      <div className="space-y-3">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={uploading || generating}
              className="text-xs px-2"
            >
              <Icon name={uploading ? "Loader2" : "Upload"} size={14} className={`mr-1 ${uploading ? 'animate-spin' : ''}`} />
              {uploading ? 'Загрузка...' : 'Файл'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUrlInput(!showUrlInput)}
              disabled={uploading || generating}
              className="text-xs px-2"
            >
              <Icon name="Link" size={14} className="mr-1" />
              URL
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={generateImage}
              disabled={uploading || generating || !productTitle}
              className="text-xs px-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950"
            >
              <Icon name={generating ? "Loader2" : "Sparkles"} size={14} className={`mr-1 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'AI...' : 'AI'}
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

          {showUrlInput && (
            <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addImageFromUrl();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addImageFromUrl}
                size="sm"
              >
                <Icon name="Plus" size={16} className="mr-1" />
                Добавить
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowUrlInput(false);
                  setImageUrl('');
                }}
                size="sm"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {images.map((imageUrl, idx) => (
              <Card 
                key={idx}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`relative overflow-hidden cursor-move transition-all ${
                  mainImage === imageUrl ? 'ring-2 ring-primary' : ''
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
                    {mainImage === imageUrl && (
                      <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Главное
                      </div>
                    )}
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMainImage(imageUrl);
                        }}
                      >
                        <Icon name="Star" size={14} className={mainImage === imageUrl ? 'fill-yellow-400 text-yellow-400' : ''} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(imageUrl);
                        }}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {images.length === 0 
            ? 'Загрузите изображения товара. Первое станет главным.'
            : `Загружено ${images.length} фото. Перетаскивайте для изменения порядка. Нажмите на звездочку, чтобы сделать главным.`
          }
        </p>
      </div>

      <ImageViewer
        images={images}
        currentIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onNavigate={setViewerIndex}
      />
    </div>
  );
};

export default ProductImageGallery;