import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { formatPrice } from '@/utils/formatPrice';

interface CategoryFiltersProps {
  filters: any[];
  selectedFilters: Record<string, any>;
  priceRange: number[];
  onFilterChange: (filterId: string, value: any) => void;
  onPriceChange: (value: number[]) => void;
}

const CategoryFilters = ({ filters, selectedFilters, priceRange, onFilterChange, onPriceChange }: CategoryFiltersProps) => {
  const handleCheckboxChange = (filterId: string, value: string, checked: boolean) => {
    const current = selectedFilters[filterId] || [];
    const updated = checked 
      ? [...current, value]
      : current.filter((v: string) => v !== value);
    onFilterChange(filterId, updated);
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-card rounded-lg border p-6 sticky top-24">
        <h2 className="text-xl font-bold mb-6">Фильтры</h2>
        <Accordion type="multiple" defaultValue={filters.map(f => f.id)} className="w-full">
          {filters.map(filter => (
            <AccordionItem key={filter.id} value={filter.id}>
              <AccordionTrigger className="text-base font-semibold">
                {filter.label}
              </AccordionTrigger>
              <AccordionContent>
                {filter.type === 'range' ? (
                  <div className="space-y-4 pt-2">
                    <Slider
                      min={filter.min}
                      max={filter.max}
                      step={1000}
                      value={priceRange}
                      onValueChange={onPriceChange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {filter.options.map((option: any) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`${filter.id}-${option.value}`}
                          checked={(selectedFilters[filter.id] || []).includes(option.value)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange(filter.id, option.value, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`${filter.id}-${option.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default CategoryFilters;
