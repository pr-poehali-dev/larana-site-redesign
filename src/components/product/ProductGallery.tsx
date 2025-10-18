import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ProductGalleryProps {
  image: string;
  title: string;
}

const ProductGallery = ({ image, title }: ProductGalleryProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  console.log('🖼️ ProductGallery:', { title, image, hasImage: !!image });

  return (
    <div>
      <div className="aspect-square rounded-lg overflow-hidden bg-secondary/20 mb-4 flex items-center justify-center relative">
        {image && image.trim() !== '' && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="Loader2" size={48} className="text-muted-foreground/30 animate-spin" />
              </div>
            )}
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
              onLoad={() => {
                console.log('✅ Изображение загружено:', image);
                setImageLoading(false);
              }}
              onError={(e) => {
                console.error('❌ Ошибка загрузки изображения:', {
                  url: image,
                  title,
                  error: e
                });
                setImageError(true);
                setImageLoading(false);
              }}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <Icon name="ImageOff" size={64} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground text-center">
              Изображение недоступно
            </p>
            {image && (
              <p className="text-xs text-muted-foreground/50 text-center break-all max-w-full">
                URL: {image.substring(0, 50)}...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;