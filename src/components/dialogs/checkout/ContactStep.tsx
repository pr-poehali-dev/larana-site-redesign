import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import PhoneInput from '@/components/PhoneInput';
import EmailInput from '@/components/EmailInput';

interface ContactStepProps {
  formData: {
    name: string;
    phone: string;
    email: string;
  };
  setFormData: (data: any) => void;
  user?: any;
}

const ContactStep = ({ formData, setFormData, user }: ContactStepProps) => {
  return (
    <div className="space-y-4">
      {user && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Icon name="CheckCircle2" size={16} className="text-primary" />
            Данные заполнены автоматически из вашего профиля
          </p>
        </div>
      )}
      <div>
        <Label htmlFor="name">Имя и фамилия *</Label>
        <Input 
          id="name" 
          placeholder="Анна Иванова" 
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      <PhoneInput
        value={formData.phone}
        onChange={(value) => setFormData({...formData, phone: value})}
        label="Телефон"
        required
      />
      <EmailInput
        value={formData.email}
        onChange={(value) => setFormData({...formData, email: value})}
        label="Email"
        placeholder="example@mail.ru"
        required
      />
    </div>
  );
};

export default ContactStep;
