import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState, useEffect, useRef } from 'react';

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

const ImageViewer = ({ images, initialIndex, open, onClose }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const touchStartRef = useRef<{ x: number; y: number; distance: number } | null>(null);
  const initialZoomRef = useRef(1);
  const swipeStartRef = useRef<{ x: number; time: number } | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [initialIndex, open]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      touchStartRef.current = { x: center.x, y: center.y, distance };
      initialZoomRef.current = zoom;
      swipeStartRef.current = null;
    } else if (e.touches.length === 1) {
      if (zoom > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y
        });
      } else {
        swipeStartRef.current = {
          x: e.touches[0].clientX,
          time: Date.now()
        };
      }
      touchStartRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartRef.current) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const scale = distance / touchStartRef.current.distance;
      const newZoom = Math.min(Math.max(initialZoomRef.current * scale, 1), 3);
      setZoom(newZoom);
      
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1) {
      if (isDragging && zoom > 1) {
        e.preventDefault();
        setPosition({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y
        });
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      
      if (swipeStartRef.current && zoom === 1) {
        const deltaX = (e.changedTouches[0]?.clientX || 0) - swipeStartRef.current.x;
        const deltaTime = Date.now() - swipeStartRef.current.time;
        
        if (Math.abs(deltaX) > 50 && deltaTime < 300) {
          if (deltaX > 0) {
            goToPrevious();
          } else {
            goToNext();
          }
        }
      }
      
      swipeStartRef.current = null;
      touchStartRef.current = null;
    } else if (e.touches.length === 1) {
      touchStartRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
    if (e.key === '+' || e.key === '=') handleZoomIn();
    if (e.key === '-') handleZoomOut();
  };

  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (zoom > 1) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setZoom(2);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] p-0"
        onKeyDown={handleKeyDown}
      >
        <div 
          className="relative w-full h-[90vh] bg-black flex items-center justify-center overflow-hidden touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={images[currentIndex]}
            alt={`Изображение ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-transform select-none"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            draggable={false}
          />

          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full z-10 md:flex hidden"
                onClick={goToPrevious}
              >
                <Icon name="ChevronLeft" size={24} />
              </Button>

              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full z-10 md:flex hidden"
                onClick={goToNext}
              >
                <Icon name="ChevronRight" size={24} />
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-10">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}

          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full hidden md:flex"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
            >
              <Icon name="ZoomOut" size={20} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full hidden md:flex"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <Icon name="ZoomIn" size={20} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {zoom > 1 && (
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm z-10">
              {Math.round(zoom * 100)}%
            </div>
          )}

          <div className="absolute top-1/2 left-4 -translate-y-1/2 text-white/50 text-xs z-10 md:hidden">
            <Icon name="ChevronLeft" size={32} />
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 text-white/50 text-xs z-10 md:hidden">
            <Icon name="ChevronRight" size={32} />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setZoom(1);
                    setPosition({ x: 0, y: 0 });
                  }}
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
