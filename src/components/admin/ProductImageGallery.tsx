import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
  const { toast } = useToast();

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
        
        const newImages = [...images, imageUrl];
        const newMainImage = mainImage || imageUrl;
        onImagesChange(newImages, newMainImage);
        
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

  return (
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
