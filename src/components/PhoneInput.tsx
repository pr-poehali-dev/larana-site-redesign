import { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

const PhoneInput = ({ 
  value, 
  onChange, 
  label = 'Телефон', 
  placeholder = '+7 (___) ___-__-__',
  required = false,
  id = 'phone'
}: PhoneInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTouched, setIsTouched] = useState(false);

  const formatPhoneNumber = (input: string): string => {
    const digits = input.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    
    let formatted = '+7';
    
    if (digits.length > 1) {
      formatted += ` (${digits.substring(1, 4)}`;
      
      if (digits.length >= 4) {
        formatted += `) ${digits.substring(4, 7)}`;
      }
      
      if (digits.length >= 7) {
        formatted += `-${digits.substring(7, 9)}`;
      }
      
      if (digits.length >= 9) {
        formatted += `-${digits.substring(9, 11)}`;
      }
    }
    
    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    const previousLength = value.length;
    
    let digits = input.replace(/\D/g, '');
    
    if (digits.length === 0) {
      onChange('');
      return;
    }
    
    if (!digits.startsWith('7') && !digits.startsWith('8')) {
      digits = '7' + digits;
    } else if (digits.startsWith('8')) {
      digits = '7' + digits.substring(1);
    }
    
    if (digits.length > 11) {
      digits = digits.substring(0, 11);
    }
    
    const formatted = formatPhoneNumber(digits);
    onChange(formatted);
    
    setTimeout(() => {
      if (inputRef.current) {
        let newCursorPosition = cursorPosition;
        
        if (formatted.length > previousLength) {
          const addedChars = formatted.length - previousLength;
          newCursorPosition = cursorPosition + addedChars;
        }
        
        if (formatted[newCursorPosition - 1] === ' ' || 
            formatted[newCursorPosition - 1] === '(' || 
            formatted[newCursorPosition - 1] === ')' || 
            formatted[newCursorPosition - 1] === '-') {
          newCursorPosition++;
        }
        
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;
    
    if (e.key === 'Backspace' && cursorPosition <= 2) {
      e.preventDefault();
      return;
    }
    
    if (e.key === 'Backspace') {
      const charBeforeCursor = value[cursorPosition - 1];
      if (charBeforeCursor === ' ' || charBeforeCursor === '(' || charBeforeCursor === ')' || charBeforeCursor === '-') {
        e.preventDefault();
        const newValue = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
        handleChange({ target: { value: newValue, selectionStart: cursorPosition - 1 } } as any);
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!value || value.length === 0) {
      onChange('+7');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(2, 2);
        }
      }, 0);
    }
  };

  useEffect(() => {
    if (value && !value.startsWith('+7')) {
      const formatted = formatPhoneNumber(value);
      if (formatted !== value) {
        onChange(formatted);
      }
    }
  }, []);

  const isValid = value.replace(/\D/g, '').length === 11;
  const digitsCount = value.replace(/\D/g, '').length;

  return (
    <div>
      {label && <Label htmlFor={id}>{label} {required && '*'}</Label>}
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          name="tel"
          type="tel"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={() => setIsTouched(true)}
          required={required}
          maxLength={18}
          autoComplete="tel"
          className={isTouched && digitsCount > 0 && !isValid ? 'border-amber-500 focus-visible:ring-amber-500' : ''}
        />
        {isTouched && digitsCount > 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <Icon name="CheckCircle2" size={16} className="text-green-600" />
            ) : (
              <Icon name="AlertCircle" size={16} className="text-amber-500" />
            )}
          </div>
        )}
      </div>
      
      {isTouched && digitsCount > 0 && digitsCount < 11 && (
        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
          <Icon name="Info" size={12} />
          Введите ещё {11 - digitsCount} {digitsCount === 10 ? 'цифру' : 'цифры'}
        </p>
      )}
      
      {isTouched && isValid && (
        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
          <Icon name="CheckCircle2" size={12} />
          Номер введён полностью
        </p>
      )}

      {!isTouched && digitsCount === 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          Формат: +7 (XXX) XXX-XX-XX
        </p>
      )}
    </div>
  );
};

export default PhoneInput;