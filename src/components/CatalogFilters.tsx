import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Filter {
  id: string;
  label: string;
  type: 'checkbox' | 'range';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

interface CatalogFiltersProps {
  filters: Filter[];
  selectedFilters: Record<string, any>;
  priceRange: number[];
  onFilterChange: (filterId: string, value: any) => void;
  onPriceChange: (value: number[]) => void;
  onReset: () => void;
  productsCount: number;
}

const CatalogFilters = ({
  filters,
  selectedFilters,
  priceRange,
  onFilterChange,
  onPriceChange,
  onReset,
  productsCount
}: CatalogFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (filterId: string, value: string, checked: boolean) => {
    const current = selectedFilters[filterId] || [];
    const updated = checked 
      ? [...current, value]
      : current.filter((v: string) => v !== value);
    onFilterChange(filterId, updated);
  };

  const activeFiltersCount = Object.keys(selectedFilters).filter(
    key => selectedFilters[key] && 
    (Array.isArray(selectedFilters[key]) ? selectedFilters[key].length > 0 : true)
  ).length;

  return (
    <>
      <div className="lg:hidden mb-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon name="SlidersHorizontal" size={20} className="mr-2" />
          Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
      </div>

      <Card className={`${isOpen ? 'block' : 'hidden'} lg:block sticky top-4`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Фильтры</h3>
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onReset}
              >
                Сбросить
              </Button>
            )}
          </div>

          <Accordion type="multiple" defaultValue={filters.map(f => f.id)}>
            {filters.map((filter) => (
              <AccordionItem key={filter.id} value={filter.id}>
                <AccordionTrigger className="text-sm font-medium">
                  {filter.label}
                </AccordionTrigger>
                <AccordionContent>
                  {filter.type === 'range' && (
                    <div className="space-y-4 pt-2">
                      <Slider
                        min={filter.min || 0}
                        max={filter.max || 100000}
                        step={1000}
                        value={priceRange}
                        onValueChange={onPriceChange}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{priceRange[0].toLocaleString('ru-RU')} ₽</span>
                        <span>{priceRange[1].toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>
                  )}

                  {filter.type === 'checkbox' && filter.options && (
                    <div className="space-y-3 pt-2">
                      {filter.options.map((option) => {
                        const isChecked = selectedFilters[filter.id]?.includes(option.value) || false;
                        return (
                          <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${filter.id}-${option.value}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => 
                                handleCheckboxChange(filter.id, option.value, checked as boolean)
                              }
                            />
                            <label
                              htmlFor={`${filter.id}-${option.value}`}
                              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {option.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Найдено товаров: <span className="font-semibold text-foreground">{productsCount}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CatalogFilters;
