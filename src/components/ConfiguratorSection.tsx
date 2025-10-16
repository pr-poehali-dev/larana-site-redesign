import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface ConfiguratorSectionProps {
  selectedRoom: string;
  setSelectedRoom: (value: string) => void;
  selectedStyle: string;
  setSelectedStyle: (value: string) => void;
  budget: number[];
  setBudget: (value: number[]) => void;
  resultsCount: number;
}

const ConfiguratorSection = ({
  selectedRoom,
  setSelectedRoom,
  selectedStyle,
  setSelectedStyle,
  budget,
  setBudget,
  resultsCount
}: ConfiguratorSectionProps) => {
  return (
    <section id="configurator" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Конфигуратор комплектов</h2>
          <p className="text-lg text-muted-foreground">Подберите идеальную мебель под ваши потребности</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
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
              <Label className="mb-2 block">Бюджет: до {budget[0]} ₽</Label>
              <Slider
                value={budget}
                onValueChange={setBudget}
                max={5000}
                min={1000}
                step={100}
                className="mt-2"
              />
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
