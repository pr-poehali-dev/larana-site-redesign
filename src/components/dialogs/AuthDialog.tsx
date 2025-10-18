import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
}

const AuthDialog = ({ open, onClose, onSuccess }: AuthDialogProps) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isAdmin = loginEmail === 'admin@mebel.ru';
    onSuccess({
      name: isAdmin ? 'Администратор' : 'Пользователь',
      email: loginEmail,
      isAdmin: isAdmin
    });
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      name: registerName,
      email: registerEmail,
      phone: registerPhone
    });
    onClose();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const resetLink = `${window.location.origin}/reset-password?token=example-token`;
      
      const response = await fetch('https://functions.poehali.dev/655e638f-76f8-464e-bafc-f29f0e5f9db4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: resetEmail,
          subject: 'Восстановление пароля - LARANA',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Восстановление пароля</h2>
              <p>Вы запросили восстановление пароля для вашего аккаунта на LARANA.</p>
              <p>Перейдите по ссылке ниже для создания нового пароля:</p>
              <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                Сбросить пароль
              </a>
              <p style="color: #666; font-size: 14px;">Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
              <p style="color: #666; font-size: 14px;">Ссылка действительна в течение 24 часов.</p>
            </div>
          `,
          text: `Восстановление пароля\n\nВы запросили восстановление пароля для вашего аккаунта на LARANA.\n\nПерейдите по ссылке для создания нового пароля:\n${resetLink}\n\nЕсли вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.\n\nСсылка действительна в течение 24 часов.`
        })
      });

      if (response.ok) {
        setResetSent(true);
        setTimeout(() => {
          setResetSent(false);
          setShowResetForm(false);
          setResetEmail('');
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to send reset email:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Вход в личный кабинет</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            {!showResetForm ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@mail.ru"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Пароль</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Войти
                </Button>
                <Button 
                  type="button" 
                  variant="link" 
                  className="w-full text-sm"
                  onClick={() => setShowResetForm(true)}
                >
                  Забыли пароль?
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email для восстановления</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="example@mail.ru"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                {resetSent && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                    ✅ Ссылка для восстановления отправлена на {resetEmail}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={resetSent}>
                  {resetSent ? 'Отправлено' : 'Отправить ссылку'}
                </Button>
                <Button 
                  type="button" 
                  variant="link" 
                  className="w-full text-sm"
                  onClick={() => {
                    setShowResetForm(false);
                    setResetEmail('');
                    setResetSent(false);
                  }}
                >
                  ← Вернуться к входу
                </Button>
              </form>
            )}
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Имя</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Иван Иванов"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="example@mail.ru"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-phone">Телефон</Label>
                <Input
                  id="register-phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Пароль</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Зарегистрироваться
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;