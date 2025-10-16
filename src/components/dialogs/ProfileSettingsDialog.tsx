import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProfileSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

interface Address {
  id: number;
  address_name: string;
  city: string;
  address: string;
  is_default: boolean;
}

const ProfileSettingsDialog = ({ open, onClose, user }: ProfileSettingsDialogProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressName: '',
    city: '',
    address: '',
    isDefault: false
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open && user) {
      fetchAddresses();
    }
  }, [open, user]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/9e157aab-894b-47e4-8fb7-4e88d0a941b1?action=addresses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.email
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.city || !newAddress.address) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/9e157aab-894b-47e4-8fb7-4e88d0a941b1?action=addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.email
        },
        body: JSON.stringify(newAddress)
      });
      
      if (response.ok) {
        toast({
          title: 'Адрес добавлен',
          description: 'Новый адрес успешно сохранен'
        });
        setNewAddress({ addressName: '', city: '', address: '', isDefault: false });
        setShowAddressForm(false);
        fetchAddresses();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить адрес',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/9e157aab-894b-47e4-8fb7-4e88d0a941b1?action=addresses&addressId=${addressId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.email
        }
      });
      
      if (response.ok) {
        toast({
          title: 'Адрес удален',
          description: 'Адрес успешно удален'
        });
        fetchAddresses();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить адрес',
        variant: 'destructive'
      });
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Пароль должен содержать минимум 6 символов',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/9e157aab-894b-47e4-8fb7-4e88d0a941b1?action=password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.email
        },
        body: JSON.stringify({ newPassword })
      });
      
      if (response.ok) {
        toast({
          title: 'Пароль изменен',
          description: 'Ваш пароль успешно обновлен'
        });
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить пароль',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Настройки профиля</DialogTitle>
          <DialogDescription>
            Управление адресами доставки и безопасностью
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="addresses" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="addresses">Адреса доставки</TabsTrigger>
            <TabsTrigger value="security">Безопасность</TabsTrigger>
          </TabsList>

          <TabsContent value="addresses" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {addresses.length === 0 && !showAddressForm ? (
                  <div className="text-center py-8">
                    <Icon name="MapPin" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">У вас пока нет сохраненных адресов</p>
                    <Button onClick={() => setShowAddressForm(true)}>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить адрес
                    </Button>
                  </div>
                ) : (
                  <>
                    {addresses.map((addr) => (
                      <Card key={addr.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {addr.address_name || 'Адрес доставки'}
                                {addr.is_default && (
                                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                    По умолчанию
                                  </span>
                                )}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                <div className="flex items-center gap-2">
                                  <Icon name="MapPin" size={14} />
                                  {addr.city}
                                </div>
                                <p className="mt-1">{addr.address}</p>
                              </CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAddress(addr.id)}
                            >
                              <Icon name="Trash2" size={16} className="text-destructive" />
                            </Button>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}

                    {showAddressForm ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Новый адрес</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="addressName">Название адреса (необязательно)</Label>
                            <Input
                              id="addressName"
                              placeholder="Дом, Работа, Дача..."
                              value={newAddress.addressName}
                              onChange={(e) => setNewAddress({ ...newAddress, addressName: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="city">Город *</Label>
                            <Input
                              id="city"
                              placeholder="Москва"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="address">Адрес *</Label>
                            <Input
                              id="address"
                              placeholder="ул. Примерная, д. 1, кв. 1"
                              value={newAddress.address}
                              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleAddAddress}>Сохранить</Button>
                            <Button variant="outline" onClick={() => setShowAddressForm(false)}>
                              Отмена
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Button onClick={() => setShowAddressForm(true)} variant="outline" className="w-full">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить еще адрес
                      </Button>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Изменить пароль</CardTitle>
                <CardDescription>
                  Создайте надежный пароль для защиты вашего аккаунта
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="newPassword">Новый пароль</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Минимум 6 символов"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleChangePassword}>
                  <Icon name="Lock" size={16} className="mr-2" />
                  Изменить пароль
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Информация аккаунта</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="User" size={16} />
                  <span className="text-muted-foreground">Имя:</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="Mail" size={16} />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsDialog;
