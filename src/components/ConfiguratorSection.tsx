import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface ConfiguratorSectionProps {
  selectedRoom: string;
  setSelectedRoom: (value: string) => void;
  selectedStyle: string;
  setSelectedStyle: (value: string) => void;
  budget: number[];
  setBudget: (value: number[]) => void;
  resultsCount: number;
  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

const ConfiguratorSection = ({
  selectedRoom,
  setSelectedRoom,
  selectedStyle,
  setSelectedStyle,
  budget,
  setBudget,
  resultsCount,
  inStockOnly,
  setInStockOnly,
  sortBy,
  setSortBy
}: ConfiguratorSectionProps) => {
  return (
    <section id="configurator" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Конфигуратор комплектов</h2>
          <p className="text-lg text-muted-foreground">Подберите идеальную мебель под ваши потребности</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label className="mb-2 block">Тип комнаты</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Все комнаты" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все комнаты</SelectItem>
                  <SelectItem value="Гостиная">Гостиная</SelectItem>
                  <SelectItem value="Спальня">Спальня</SelectItem>
                  <SelectItem value="Кухня">Кухня</SelectItem>
                  <SelectItem value="Шкафы">Шкафы</SelectItem>
                  <SelectItem value="Прихожая">Прихожая</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Стиль</Label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Любой стиль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Любой стиль</SelectItem>
                  <SelectItem value="Скандинавский">Скандинавский</SelectItem>
                  <SelectItem value="Современный">Современный</SelectItem>
                  <SelectItem value="Классический">Классический</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Бюджет: до {budget[0].toLocaleString()} ₽</Label>
              <Slider
                value={budget}
                onValueChange={setBudget}
                max={60000}
                min={5000}
                step={1000}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="inStock" 
                checked={inStockOnly}
                onCheckedChange={setInStockOnly}
              />
              <label
                htmlFor="inStock"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Только в наличии
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Label className="text-sm">Сортировка:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">По умолчанию</SelectItem>
                  <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                  <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                  <SelectItem value="name">По названию</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-muted-foreground">Найдено комплектов: <span className="font-semibold text-foreground">{resultsCount}</span></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfiguratorSection;