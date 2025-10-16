import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

const ImageViewer = ({ images, initialIndex, open, onClose }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] p-0"
        onKeyDown={handleKeyDown}
      >
        <div className="relative w-full h-[90vh] bg-black flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`Изображение ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />

          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full"
                onClick={goToPrevious}
              >
                <Icon name="ChevronLeft" size={24} />
              </Button>

              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full"
                onClick={goToNext}
              >
                <Icon name="ChevronRight" size={24} />
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}

          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 h-10 w-10 rounded-full"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>

          {images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
