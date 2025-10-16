import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface SavedAddress {
  id: string;
  name: string;
  city: string;
  address: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  intercom?: string;
  isDefault?: boolean;
}

interface SavedAddressesProps {
  addresses: SavedAddress[];
  onSelect: (address: SavedAddress) => void;
  onAdd: (address: SavedAddress) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  currentFormData?: any;
}

const SavedAddresses = ({
  addresses,
  onSelect,
  onAdd,
  onDelete,
  onSetDefault,
  currentFormData
}: SavedAddressesProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAddressName, setNewAddressName] = useState('');

  const handleSaveCurrentAddress = () => {
    if (!currentFormData?.city || !currentFormData?.address) {
      alert('Заполните адрес перед сохранением');
      return;
    }

    if (!newAddressName.trim()) {
      alert('Введите название адреса');
      return;
    }

    const newAddress: SavedAddress = {
      id: Date.now().toString(),
      name: newAddressName.trim(),
      city: currentFormData.city,
      address: currentFormData.address,
      apartment: currentFormData.apartment,
      entrance: currentFormData.entrance,
      floor: currentFormData.floor,
      intercom: currentFormData.intercom,
      isDefault: addresses.length === 0
    };

    onAdd(newAddress);
    setNewAddressName('');
    setShowAddDialog(false);
  };

  const getAddressIcon = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('дом') || nameLower.includes('домашний')) return 'Home';
    if (nameLower.includes('работ') || nameLower.includes('офис')) return 'Briefcase';
    if (nameLower.includes('дач') || nameLower.includes('загород')) return 'TreePine';
    if (nameLower.includes('родител') || nameLower.includes('мам') || nameLower.includes('пап')) return 'Users';
    return 'MapPin';
  };

  const formatAddressShort = (addr: SavedAddress) => {
    let result = addr.address;
    if (addr.apartment) result += `, кв. ${addr.apartment}`;
    return result;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Сохранённые адреса</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddDialog(true)}
          className="text-xs"
        >
          <Icon name="Plus" size={14} className="mr-1" />
          Сохранить текущий
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed rounded-lg">
          <Icon name="MapPin" size={32} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Нет сохранённых адресов</p>
          <p className="text-xs text-muted-foreground mt-1">
            Заполните адрес и сохраните его для быстрого выбора
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`border rounded-lg p-3 hover:border-primary transition-colors ${
                addr.isDefault ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  name={getAddressIcon(addr.name)}
                  size={20}
                  className="text-primary mt-1 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{addr.name}</p>
                    {addr.isDefault && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        Основной
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{addr.city}</p>
                  <p className="text-sm mt-1">{formatAddressShort(addr)}</p>
                  {(addr.entrance || addr.floor || addr.intercom) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {addr.entrance && `Подъезд ${addr.entrance}`}
                      {addr.floor && ` • Этаж ${addr.floor}`}
                      {addr.intercom && ` • Домофон ${addr.intercom}`}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  onClick={() => onSelect(addr)}
                  className="flex-1 text-xs h-8"
                >
                  <Icon name="Check" size={14} className="mr-1" />
                  Выбрать
                </Button>
                {!addr.isDefault && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onSetDefault(addr.id)}
                    className="text-xs h-8"
                  >
                    <Icon name="Star" size={14} />
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(addr.id)}
                  className="text-xs h-8"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сохранить адрес</DialogTitle>
            <DialogDescription>
              Дайте название адресу для удобного выбора в будущем
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="addressName">Название адреса *</Label>
              <Input
                id="addressName"
                placeholder="Например: Домашний, Работа, Дача"
                value={newAddressName}
                onChange={(e) => setNewAddressName(e.target.value)}
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Это поможет быстро найти адрес при следующем заказе
              </p>
            </div>

            {currentFormData && (
              <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                <p className="font-medium">Будет сохранён адрес:</p>
                <p className="text-muted-foreground">{currentFormData.city}</p>
                <p>{currentFormData.address}</p>
                {currentFormData.apartment && <p>Квартира: {currentFormData.apartment}</p>}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleSaveCurrentAddress}
                className="flex-1"
                disabled={!newAddressName.trim()}
              >
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setNewAddressName('');
                }}
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedAddresses;
