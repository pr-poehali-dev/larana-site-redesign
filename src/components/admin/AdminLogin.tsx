import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      if (password === 'admin123') {
        localStorage.setItem('adminAuth', 'true');
        onLogin();
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать в админ-панель"
        });
      } else {
        toast({
          title: "Ошибка входа",
          description: "Неверный пароль",
          variant: "destructive"
        });
      }
      setLoading(false);
      setPassword('');
    }, 500);
  };

  return (
    <>
      <Helmet>
        <title>Админ-панель | LARANA</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Icon name="Shield" size={32} className="text-primary-foreground" />
            </div>
            <CardTitle className="text-xl md:text-2xl">Админ-панель</CardTitle>
            <CardDescription className="text-sm">Введите пароль для доступа</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-center text-lg"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Пароль по умолчанию: admin123
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading || !password}
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Вход...
                  </>
                ) : (
                  <>
                    <Icon name="LogIn" size={20} className="mr-2" />
                    Войти
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Вернуться на сайт
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminLogin;
