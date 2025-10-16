import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

const EmailInput = ({ 
  value, 
  onChange, 
  label = 'Email', 
  placeholder = 'example@mail.ru',
  required = false,
  id = 'email'
}: EmailInputProps) => {
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getEmailSuggestion = (email: string): string | null => {
    if (!email.includes('@')) return null;
    
    const commonDomains = [
      'gmail.com',
      'yandex.ru',
      'mail.ru',
      'ya.ru',
      'rambler.ru',
      'outlook.com',
      'icloud.com',
      'bk.ru',
      'list.ru'
    ];

    const [localPart, domainPart] = email.split('@');
    if (!domainPart || domainPart.length < 2) return null;

    const domainLower = domainPart.toLowerCase();
    
    const typoMap: Record<string, string> = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gnail.com': 'gmail.com',
      'gmil.com': 'gmail.com',
      'yandex.ru': 'yandex.ru',
      'yandex.com': 'yandex.ru',
      'ya.com': 'ya.ru',
      'mai.ru': 'mail.ru',
      'maul.ru': 'mail.ru',
      'male.ru': 'mail.ru',
      'rambler.com': 'rambler.ru',
      'outloоk.com': 'outlook.com',
      'iclaud.com': 'icloud.com'
    };

    if (typoMap[domainLower]) {
      return `${localPart}@${typoMap[domainLower]}`;
    }

    for (const domain of commonDomains) {
      if (domainLower.includes(domain.split('.')[0]) && domainLower !== domain) {
        return `${localPart}@${domain}`;
      }
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim().toLowerCase();
    onChange(newValue);
    
    if (isTouched) {
      setIsValid(validateEmail(newValue));
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
    setIsValid(validateEmail(value));
  };

  const suggestion = getEmailSuggestion(value);
  const showSuggestion = suggestion && isTouched && value.length > 5;

  const applySuggestion = () => {
    if (suggestion) {
      onChange(suggestion);
      setIsValid(true);
    }
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label} {required && '*'}</Label>}
      <div className="relative">
        <Input
          id={id}
          name="email"
          type="email"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          autoComplete="email"
          className={isTouched && !isValid ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {isTouched && value.length > 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <Icon name="CheckCircle2" size={16} className="text-green-600" />
            ) : (
              <Icon name="AlertCircle" size={16} className="text-destructive" />
            )}
          </div>
        )}
      </div>

      {showSuggestion && (
        <button
          type="button"
          onClick={applySuggestion}
          className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
        >
          <Icon name="Lightbulb" size={14} />
          Возможно, вы имели в виду: <span className="font-semibold">{suggestion}</span>
        </button>
      )}

      {isTouched && !isValid && value.length > 0 && (
        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
          <Icon name="AlertCircle" size={12} />
          Введите корректный email (например: name@mail.ru)
        </p>
      )}

      {value.length === 0 && isTouched && required && (
        <p className="text-xs text-muted-foreground mt-1">
          Email обязателен для оформления заказа
        </p>
      )}
    </div>
  );
};

export default EmailInput;