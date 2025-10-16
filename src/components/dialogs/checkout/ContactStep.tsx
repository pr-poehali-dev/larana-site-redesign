import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import PhoneInput from '@/components/PhoneInput';
import EmailInput from '@/components/EmailInput';
import NameInput from '@/components/NameInput';

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
      <NameInput
        value={formData.name}
        onChange={(value) => setFormData({...formData, name: value})}
        label="Имя и фамилия"
        placeholder="Анна Иванова"
        required
      />
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