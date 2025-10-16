import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface GeneratedPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  login: string;
  password: string;
}

export const GeneratedPasswordDialog = ({
  open,
  onOpenChange,
  login,
  password
}: GeneratedPasswordDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Скопировано",
      description: `${label} скопирован в буфер обмена`
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAll = () => {
    const text = `Логин: ${login}\nПароль: ${password}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Логин и пароль скопированы в буфер обмена"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="KeyRound" size={24} className="text-primary" />
            Данные для входа сотрудника
          </DialogTitle>
          <DialogDescription>
            Сохраните эти данные и передайте сотруднику. После закрытия окна пароль будет недоступен.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Логин</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(login, 'Логин')}
                >
                  <Icon name={copied ? "Check" : "Copy"} size={16} />
                </Button>
              </div>
              <p className="font-mono text-lg font-semibold">{login}</p>
            </div>

            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Временный пароль</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(password, 'Пароль')}
                >
                  <Icon name={copied ? "Check" : "Copy"} size={16} />
                </Button>
              </div>
              <p className="font-mono text-lg font-semibold break-all">{password}</p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <Icon name="AlertTriangle" size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Важно:
                </p>
                <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside">
                  <li>При первом входе сотрудник обязан сменить пароль</li>
                  <li>Пароль показывается только один раз</li>
                  <li>Сохраните данные в надежном месте</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={copyAll}
            className="w-full sm:w-auto"
          >
            <Icon name="Copy" size={16} className="mr-2" />
            Скопировать всё
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Понятно, закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
