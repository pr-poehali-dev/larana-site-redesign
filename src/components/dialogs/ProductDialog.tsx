import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FurnitureSet {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
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
  return (
    <Dialog open={!!selectedSet} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{selectedSet?.title}</DialogTitle>
          <DialogDescription>{selectedSet?.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden">
            <img src={selectedSet?.image} alt={selectedSet?.title} className="w-full h-full object-cover" />
          </div>
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
              <p className="text-3xl font-bold">{selectedSet?.price}</p>
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
  );
};

export default ProductDialog;
