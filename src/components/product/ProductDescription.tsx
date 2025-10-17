import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ProductDescriptionProps {
  description: string;
  items: string[];
  category: string;
  style: string;
  colors: string[];
  inStock: boolean;
}

const ProductDescription = ({
  description,
  items,
  category,
  style,
  colors,
  inStock
}: ProductDescriptionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Описание</h2>
          <p className="text-muted-foreground mb-6">{description}</p>
          
          <h3 className="font-semibold text-lg mb-3">Состав комплекта:</h3>
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Icon name="Check" size={16} className="text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Характеристики</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">Категория</dt>
              <dd className="font-semibold">{category}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Стиль</dt>
              <dd className="font-semibold">{style}</dd>
            </div>
            {colors && colors.length > 0 && (
              <div>
                <dt className="text-sm text-muted-foreground">
                  {colors.length > 1 ? 'Доступные цвета' : 'Цвет'}
                </dt>
                <dd className="font-semibold">{colors.join(', ')}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-muted-foreground">Наличие</dt>
              <dd className="font-semibold">
                {inStock ? 'В наличии' : 'Под заказ (7-14 дней)'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDescription;
