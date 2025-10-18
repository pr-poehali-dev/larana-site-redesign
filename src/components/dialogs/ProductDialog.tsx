import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageViewer from '@/components/admin/ImageViewer';
import { formatPrice } from '@/utils/formatPrice';

interface FurnitureSet {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
  images?: string[];
  items: string[];
  style: string;
  description: string;
}

interface ProductDialogProps {
  selectedSet: FurnitureSet | null;
  onClose: () => void;
  onAddToCart: (set: FurnitureSet) => void;
}

const ProductDialog = ({ selectedSet, onClose, onAddToCart }: ProductDialogProps) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const productImages = selectedSet?.images && selectedSet.images.length > 0 
    ? selectedSet.images 
    : selectedSet?.image ? [selectedSet.image] : [];

  const openImageViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      <Dialog open={!!selectedSet} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedSet?.title}</DialogTitle>
            <DialogDescription>{selectedSet?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {productImages.length > 0 && (
              <div className="space-y-3">
                <div 
                  className="aspect-video rounded-lg overflow-hidden cursor-pointer group relative"
                  onClick={() => openImageViewer(0)}
                >
                  <img 
                    src={productImages[0]} 
                    alt={selectedSet?.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800';
                      target.onerror = null;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/90 rounded-full p-3">
                      <Icon name="Maximize2" size={24} className="text-black" />
                    </div>
                  </div>
                </div>

                {productImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {productImages.slice(1, 5).map((image, idx) => (
                      <div 
                        key={idx}
                        className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                        onClick={() => openImageViewer(idx + 1)}
                      >
                        <img 
                          src={image} 
                          alt={`${selectedSet?.title} - фото ${idx + 2}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800';
                            target.onerror = null;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Icon name="Maximize2" size={20} className="text-white" />
                        </div>
                      </div>
                    ))}
                    {productImages.length > 5 && (
                      <div 
                        className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative bg-black/50"
                        onClick={() => openImageViewer(5)}
                      >
                        <img 
                          src={productImages[5]} 
                          alt={`${selectedSet?.title} - еще фото`}
                          className="w-full h-full object-cover opacity-50"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800';
                            target.onerror = null;
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-white text-lg font-semibold">
                            +{productImages.length - 5}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">В комплект входит:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSet?.items.map((item: string, idx: number) => (
                  <Badge key={idx} variant="secondary">{item}</Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Категория</p>
                <p className="font-semibold">{selectedSet?.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Стиль</p>
                <p className="font-semibold">{selectedSet?.style}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Цена комплекта</p>
                <p className="text-3xl font-bold">{formatPrice(selectedSet?.price || '')}</p>
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-foreground" onClick={() => {
                if (selectedSet) {
                  onAddToCart(selectedSet);
                }
              }}>
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                В корзину
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {productImages.length > 0 && (
        <ImageViewer
          images={productImages}
          initialIndex={viewerIndex}
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
};

export default ProductDialog;