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
}

const ProductImageGallery = ({ images, mainImage, onImagesChange }: ProductImageGalleryProps) => {
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    console.log('🔄 Starting upload:', file.name, file.type, file.size);
    setUploading(true);
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Файл должен быть изображением');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Размер файла не должен превышать 10 МБ');
      }

      const formData = new FormData();
      formData.append('file', file);

      console.log('📤 Sending request to upload-file...');
      const response = await fetch('https://functions.poehali.dev/1a0d83e1-cea3-41fb-a393-b01eba523b70', {
        method: 'POST',
        body: formData
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Upload error:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || `Ошибка загрузки: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Upload success:', data);
      
      const imageUrl = data.url;
      
      if (!imageUrl) {
        throw new Error('URL изображения не найден в ответе сервера');
      }
      
      const newImages = [...images, imageUrl];
      const newMainImage = mainImage || imageUrl;
      onImagesChange(newImages, newMainImage);
      
      toast({
        title: "✅ Изображение загружено",
        description: `Файл ${file.name} успешно добавлен`
      });
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      toast({
        title: "❌ Ошибка загрузки",
        description: error instanceof Error ? error.message : "Не удалось загрузить изображение",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log('⚠️ No files selected');
      return;
    }

    console.log(`📁 Selected ${files.length} file(s)`);
    await handleFiles(Array.from(files));
    e.target.value = '';
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Пропущен файл",
          description: `${file.name} не является изображением`,
          variant: "destructive"
        });
        continue;
      }
      await uploadImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) {
      console.log('⚠️ No files dropped');
      return;
    }

    console.log(`🎯 Dropped ${files.length} file(s)`);
    await handleFiles(files);
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

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
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



  return (
    <div>
      <Label>Изображения товара</Label>
      <div className="space-y-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={uploading ? "secondary" : "outline"}
              onClick={() => {
                console.log('🖱️ Upload button clicked');
                const input = document.getElementById('image-upload') as HTMLInputElement;
                if (input) {
                  input.click();
                  console.log('✅ File input triggered');
                } else {
                  console.error('❌ File input not found');
                }
              }}
              disabled={uploading}
              className="flex-1"
            >
              <Icon name={uploading ? "Loader2" : "Upload"} size={16} className={`mr-2 ${uploading ? 'animate-spin' : ''}`} />
              {uploading ? 'Загрузка...' : '📁 Загрузить файл'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUrlInput(!showUrlInput)}
              disabled={uploading}
              className="flex-1"
            >
              <Icon name="Link" size={16} className="mr-2" />
              🔗 Добавить по URL
            </Button>
            <input
              id="image-upload"
              type="file"
              accept="image/*,image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Выбрать изображения"
            />
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
              isDragging 
                ? 'border-primary bg-primary/5 scale-[1.02]' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Icon 
              name={isDragging ? "Download" : "ImagePlus"} 
              size={40} 
              className={`mx-auto mb-3 ${isDragging ? 'text-primary animate-bounce' : 'text-muted-foreground'}`}
            />
            <p className="text-sm font-medium mb-1">
              {isDragging ? '📥 Отпустите файлы здесь' : '🖼️ Перетащите изображения сюда'}
            </p>
            <p className="text-xs text-muted-foreground">
              или используйте кнопки выше
            </p>
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
                onDragOver={(e) => handleImageDragOver(e, idx)}
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