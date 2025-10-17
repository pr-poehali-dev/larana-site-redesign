import Icon from '@/components/ui/icon';

interface ProductRatingProps {
  rating: number;
  reviewsCount: number;
  showLink?: boolean;
}

const ProductRating = ({ rating, reviewsCount, showLink = false }: ProductRatingProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon 
            key={star} 
            name="Star" 
            size={18} 
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>
      <span className="font-semibold">{rating}</span>
      {showLink ? (
        <a href="#reviews" className="text-sm text-muted-foreground hover:text-primary">
          ({reviewsCount} отзыва)
        </a>
      ) : (
        <span className="text-muted-foreground">({reviewsCount} отзыва)</span>
      )}
    </div>
  );
};

export default ProductRating;
