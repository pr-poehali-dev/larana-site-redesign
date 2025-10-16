import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const HelpDialog = ({ open, onClose, onSubmit }: HelpDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Помощь с выбором</DialogTitle>
          <DialogDescription>
            Наш специалист свяжется с вами и поможет подобрать идеальный комплект
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }} className="space-y-4">
          <div>
            <Label htmlFor="name">Ваше имя</Label>
            <Input id="name" placeholder="Анна" required />
          </div>
          <div>
            <Label htmlFor="phone">Телефон</Label>
            <Input id="phone" type="tel" placeholder="+7 (900) 123-45-67" required />
          </div>
          <div>
            <Label htmlFor="room">Какую комнату обустраиваете?</Label>
            <Select required>
              <SelectTrigger id="room">
                <SelectValue placeholder="Выберите тип комнаты" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="living">Гостиная</SelectItem>
                <SelectItem value="bedroom">Спальня</SelectItem>
                <SelectItem value="kitchen">Кухня</SelectItem>
                <SelectItem value="hallway">Прихожая</SelectItem>
                <SelectItem value="office">Кабинет</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="comment">Комментарий (необязательно)</Label>
            <Textarea id="comment" placeholder="Расскажите о ваших предпочтениях" />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-foreground">
            Отправить заявку
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
