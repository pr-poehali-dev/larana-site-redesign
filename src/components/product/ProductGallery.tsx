import Icon from '@/components/ui/icon';

interface ProductGalleryProps {
  image: string;
  title: string;
}

const ProductGallery = ({ image, title }: ProductGalleryProps) => {
  return (
    <div>
      <div className="aspect-square rounded-lg overflow-hidden bg-secondary/20 mb-4 flex items-center justify-center">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <Icon name="Image" size={128} className="text-muted-foreground/30" />
        )}
      </div>
    </div>
  );
};

export default ProductGallery;