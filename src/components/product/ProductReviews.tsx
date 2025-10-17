import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const ProductReviews = () => {
  const reviews = [
    {
      id: 1,
      author: 'Елена Смирнова',
      initials: 'ЕС',
      date: '2 недели назад',
      rating: 5,
      text: 'Отличный комплект! Качество мебели превзошло ожидания. Доставка точно в срок, сборщики приехали на следующий день. Всё собрали аккуратно за 3 часа. Очень довольны покупкой!',
      likes: 12
    },
    {
      id: 2,
      author: 'Михаил Петров',
      initials: 'МП',
      date: '1 месяц назад',
      rating: 5,
      text: 'Заказывали для новой квартиры. Мебель пришла в отличном состоянии, упаковка надежная. Цвет соответствует фото на сайте. Сборка заняла чуть больше времени, но результат превосходный. Рекомендую!',
      likes: 8
    },
    {
      id: 3,
      author: 'Анна Васильева',
      initials: 'АВ',
      date: '2 месяца назад',
      rating: 4,
      text: 'Хорошее качество за свою цену. Единственный минус - немного долгая доставка, но это компенсируется качеством мебели. В целом покупкой довольны, использовали скидку по промокоду.',
      likes: 15
    }
  ];

  return (
    <div id="reviews" className="mb-12">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Отзывы покупателей</h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon 
                    key={star} 
                    name="Star" 
                    size={20} 
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">4.8</span>
              <span className="text-muted-foreground">(24 отзыва)</span>
            </div>
          </div>

          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={review.id} className={index !== reviews.length - 1 ? "border-b pb-6" : ""}>
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-semibold text-primary">{review.initials}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{review.author}</span>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon 
                          key={star} 
                          name="Star" 
                          size={16} 
                          className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {review.text}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                        <Icon name="ThumbsUp" size={14} />
                        <span>Полезно ({review.likes})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline">
              Показать все отзывы
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductReviews;
