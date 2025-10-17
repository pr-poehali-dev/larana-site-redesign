import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import func2url from '../../../backend/func2url.json';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const HelpDialog = ({ open, onClose, onSubmit }: HelpDialogProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [room, setRoom] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const timestamp = new Date().toLocaleString('ru-RU', {
        timeZone: 'Asia/Yekaterinburg',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      const response = await fetch(func2url['telegram-notify'], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'consultation',
          name,
          phone,
          room,
          comment,
          timestamp
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send consultation request');
      }

      setName('');
      setPhone('');
      setRoom('');
      setComment('');
      onSubmit();
    } catch (error) {
      console.error('Error sending consultation request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Помощь с выбором</DialogTitle>
          <DialogDescription>
            Наш специалист свяжется с вами и поможет подобрать идеальный комплект
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Ваше имя</Label>
            <Input 
              id="name" 
              placeholder="Анна" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div>
            <Label htmlFor="phone">Телефон</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="+7 (900) 123-45-67" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
          </div>
          <div>
            <Label htmlFor="room">Какую комнату обустраиваете?</Label>
            <Select value={room} onValueChange={setRoom} required>
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
            <Textarea 
              id="comment" 
              placeholder="Расскажите о ваших предпочтениях" 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-foreground"
            disabled={isLoading}
          >
            {isLoading ? 'Отправка...' : 'Отправить заявку'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;