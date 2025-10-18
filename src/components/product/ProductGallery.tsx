import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

const ProductGallery = ({ images, title }: ProductGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
  const [imageLoading, setImageLoading] = useState(true);

  const validImages = images.filter(img => img && img.trim() !== '');
  const hasMultipleImages = validImages.length > 1;
  const currentImage = validImages[currentIndex] || '';

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    setImageLoading(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    setImageLoading(true);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setImageLoading(true);
  };

  return (
    <div className="space-y-4">
      {/* Основное изображение */}
      <div className="aspect-square rounded-lg overflow-hidden bg-secondary/20 flex items-center justify-center relative group">
        {currentImage && !imageError[currentIndex] ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
                <Icon name="Loader2" size={48} className="text-muted-foreground/30 animate-spin" />
              </div>
            )}
            <img 
              src={currentImage} 
              alt={`${title} - фото ${currentIndex + 1}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="eager"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(prev => ({ ...prev, [currentIndex]: true }));
                setImageLoading(false);
              }}
            />

            {/* Стрелки навигации */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800"
                  aria-label="Предыдущее фото"
                >
                  <Icon name="ChevronLeft" size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800"
                  aria-label="Следующее фото"
                >
                  <Icon name="ChevronRight" size={24} />
                </button>
              </>
            )}

            {/* Индикатор количества фото */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {validImages.length}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <Icon name="ImageOff" size={64} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground text-center">
              Изображение недоступно
            </p>
          </div>
        )}
      </div>

      {/* Миниатюры */}
      {hasMultipleImages && (
        <div className="grid grid-cols-5 gap-2">
          {validImages.map((img, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "aspect-square rounded-lg overflow-hidden bg-secondary/20 border-2 transition-all",
                currentIndex === index 
                  ? "border-primary shadow-md" 
                  : "border-transparent hover:border-primary/50"
              )}
            >
              {!imageError[index] ? (
                <img
                  src={img}
                  alt={`${title} - миниатюра ${index + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={() => setImageError(prev => ({ ...prev, [index]: true }))}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="ImageOff" size={20} className="text-muted-foreground/30" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
