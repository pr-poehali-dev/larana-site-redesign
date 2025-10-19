import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface QuickFilter {
  id: string;
  label: string;
  icon?: string;
  value: string;
}

interface QuickFiltersProps {
  categories: QuickFilter[];
  styles: QuickFilter[];
  onFilterChange: (type: 'category' | 'style' | 'price', value: string) => void;
  selectedCategory?: string;
  selectedStyle?: string;
  selectedPriceRange?: string;
}

const priceRanges: QuickFilter[] = [
  { id: 'budget', label: 'До 10 000 ₽', value: '0-10000' },
  { id: 'medium', label: '10 000 - 30 000 ₽', value: '10000-30000' },
  { id: 'premium', label: '30 000 - 50 000 ₽', value: '30000-50000' },
  { id: 'luxury', label: 'От 50 000 ₽', value: '50000-70000' }
];

const QuickFilters = ({
  categories,
  styles,
  onFilterChange,
  selectedCategory,
  selectedStyle,
  selectedPriceRange
}: QuickFiltersProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="Grid3x3" size={20} />
            Категории
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('category', cat.value)}
              className="gap-2"
            >
              {cat.icon && <Icon name={cat.icon} size={16} />}
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="Sparkles" size={20} />
            Стиль
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {styles.map((style) => (
            <Button
              key={style.id}
              variant={selectedStyle === style.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('style', style.value)}
            >
              {style.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="Wallet" size={20} />
            Цена
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
    </div>
  );
};

export default QuickFilters;
