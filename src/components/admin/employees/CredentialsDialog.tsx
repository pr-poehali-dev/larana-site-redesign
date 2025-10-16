import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface CredentialsDialogProps {
  isOpen: boolean;
  credentials: { login: string; password: string } | null;
  onClose: () => void;
}

export const CredentialsDialog = ({
  isOpen,
  credentials,
  onClose
}: CredentialsDialogProps) => {
  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Учетные данные сотрудника</DialogTitle>
          <DialogDescription>
            Сохраните эти данные! Они больше не будут показаны.
          </DialogDescription>
        </DialogHeader>

        {credentials && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Логин</Label>
              <div className="flex gap-2">
                <Input 
                  value={credentials.login} 
                  readOnly 
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(credentials.login);
                    toast({ title: "Скопировано", description: "Логин скопирован" });
                  }}
                >
                  <Icon name="Copy" size={16} />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Пароль</Label>
              <div className="flex gap-2">
                <Input 
                  value={credentials.password} 
                  readOnly 
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(credentials.password);
                    toast({ title: "Скопировано", description: "Пароль скопирован" });
                  }}
                >
                  <Icon name="Copy" size={16} />
                </Button>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                const text = `Логин: ${credentials.login}\nПароль: ${credentials.password}\nСсылка: ${window.location.origin}/employee`;
                navigator.clipboard.writeText(text);
                toast({ title: "Скопировано", description: "Все данные скопированы" });
              }}
            >
              <Icon name="Copy" size={16} className="mr-2" />
              Скопировать все данные
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
