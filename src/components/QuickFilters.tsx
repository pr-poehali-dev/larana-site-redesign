import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface QuickFilter {
  id: string;
  label: string;
  value: string;
}

interface QuickFiltersProps {
  onFilterChange: (type: 'price', value: string) => void;
  selectedPriceRange?: string;
}

const priceRanges: QuickFilter[] = [
  { id: 'budget', label: 'До 10 000 ₽', value: '0-10000' },
  { id: 'medium', label: '10 000 - 30 000 ₽', value: '10000-30000' },
  { id: 'premium', label: '30 000 - 50 000 ₽', value: '30000-50000' },
  { id: 'luxury', label: 'От 50 000 ₽', value: '50000-999999' }
];

const QuickFilters = ({
  onFilterChange,
  selectedPriceRange
}: QuickFiltersProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Icon name="Wallet" size={20} />
          Фильтр по цене
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {priceRanges.map((range) => (
          <Button
            key={range.id}
            variant={selectedPriceRange === range.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange('price', range.value)}
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilters;
