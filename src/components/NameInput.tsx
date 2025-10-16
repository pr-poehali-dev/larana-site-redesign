import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

const NameInput = ({ 
  value, 
  onChange, 
  label = 'Имя и фамилия', 
  placeholder = 'Анна Иванова',
  required = false,
  id = 'name'
}: NameInputProps) => {
  const [isTouched, setIsTouched] = useState(false);

  const formatName = (input: string): string => {
    return input
      .replace(/[^а-яА-ЯёЁa-zA-Z\s-]/g, '')
      .split(' ')
      .map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ')
      .replace(/\s{2,}/g, ' ');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleanValue = rawValue.replace(/[^а-яА-ЯёЁa-zA-Z\s-]/g, '');
    onChange(cleanValue);
  };

  const handleBlur = () => {
    setIsTouched(true);
    const formatted = formatName(value);
    if (formatted !== value) {
      onChange(formatted);
    }
  };

  const isValid = value.trim().length >= 2;
  const hasMultipleWords = value.trim().split(' ').filter(w => w.length > 0).length >= 2;

  return (
    <div>
      {label && <Label htmlFor={id}>{label} {required && '*'}</Label>}
      <div className="relative">
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          className={isTouched && !hasMultipleWords && value.length > 0 ? 'border-amber-500 focus-visible:ring-amber-500' : ''}
        />
        {isTouched && value.length > 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasMultipleWords ? (
              <Icon name="CheckCircle2" size={16} className="text-green-600" />
            ) : (
              <Icon name="AlertCircle" size={16} className="text-amber-500" />
            )}
          </div>
        )}
      </div>

      {isTouched && value.length > 0 && !hasMultipleWords && (
        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
          <Icon name="Info" size={12} />
          Укажите имя и фамилию через пробел
        </p>
      )}

      {isTouched && hasMultipleWords && (
        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
          <Icon name="CheckCircle2" size={12} />
          Отлично! Имя оформлено правильно
        </p>
      )}

      {!isTouched && value.length === 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          Например: Анна Иванова
        </p>
      )}
    </div>
  );
};

export default NameInput;
