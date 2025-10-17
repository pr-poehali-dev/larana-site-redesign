interface ProductGalleryProps {
  image: string;
  title: string;
}

const ProductGallery = ({ image, title }: ProductGalleryProps) => {
  return (
    <div>
      <div className="aspect-square rounded-lg overflow-hidden bg-secondary/20 mb-4">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ProductGallery;
