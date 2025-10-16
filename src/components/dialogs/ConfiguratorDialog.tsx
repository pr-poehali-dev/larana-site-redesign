import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ConfiguratorDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRoom: string;
  setSelectedRoom: (value: string) => void;
  selectedStyle: string;
  setSelectedStyle: (value: string) => void;
  budget: number[];
  setBudget: (value: number[]) => void;
  resultsCount: number;
  onShowResults: () => void;
}

const ConfiguratorDialog = ({
  open,
  onClose,
  selectedRoom,
  setSelectedRoom,
  selectedStyle,
  setSelectedStyle,
  budget,
  setBudget,
  resultsCount,
  onShowResults
}: ConfiguratorDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Конфигуратор комплектов</DialogTitle>
          <DialogDescription>
            Ответьте на несколько вопросов, и мы подберем идеальный комплект
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label>Какую комнату обустраиваете?</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {['Гостиная', 'Спальня', 'Кухня', 'Прихожая'].map((room) => (
                <Button
                  key={room}
                  variant={selectedRoom === room ? 'default' : 'outline'}
                  onClick={() => setSelectedRoom(selectedRoom === room ? '' : room)}
                  className={selectedRoom === room ? 'bg-primary text-foreground' : ''}
                >
                  {room}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>Какой стиль вам нравится?</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {['Скандинавский', 'Современный', 'Классический'].map((style) => (
                <Button
                  key={style}
                  variant={selectedStyle === style ? 'default' : 'outline'}
                  onClick={() => setSelectedStyle(selectedStyle === style ? '' : style)}
                  className={selectedStyle === style ? 'bg-primary text-foreground' : ''}
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>Ваш бюджет: до {budget[0]} ₽</Label>
            <Slider
              value={budget}
              onValueChange={setBudget}
              max={5000}
              min={1000}
              step={100}
              className="mt-4"
            />
          </div>
          <div className="pt-4 border-t">
            <p className="text-center mb-4">Подходящих комплектов: <span className="font-bold text-xl">{resultsCount}</span></p>
            <Button className="w-full bg-primary hover:bg-primary/90 text-foreground" onClick={onShowResults}>
              <Icon name="Search" size={20} className="mr-2" />
              Показать результаты
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfiguratorDialog;
