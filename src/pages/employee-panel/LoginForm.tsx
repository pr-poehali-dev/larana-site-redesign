import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface LoginFormProps {
  loading: boolean;
  onLogin: (e: React.FormEvent) => void;
  loginData: { login: string; password: string };
  onLoginDataChange: (data: { login: string; password: string }) => void;
  employeeId: string;
  onEmployeeIdChange: (id: string) => void;
}

export const LoginForm = ({
  loading,
  onLogin,
  loginData,
  onLoginDataChange,
  employeeId,
  onEmployeeIdChange
}: LoginFormProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Icon name="UserCog" size={32} className="text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Панель сотрудника</CardTitle>
          <CardDescription>Войдите используя логин и пароль</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Логин"
                value={loginData.login}
                onChange={(e) => onLoginDataChange({ ...loginData, login: e.target.value })}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Пароль"
                value={loginData.password}
                onChange={(e) => onLoginDataChange({ ...loginData, password: e.target.value })}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={loading || (!loginData.login && !employeeId)}
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
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
