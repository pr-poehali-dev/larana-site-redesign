import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface AddressSuggestion {
  value: string;
  fullAddress: string;
  postalCode?: string;
  city?: string;
  street?: string;
  house?: string;
  flat?: string;
  coordinates?: { lat: string; lon: string } | null;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string, suggestion?: AddressSuggestion) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  label = 'Адрес', 
  placeholder = 'Начните вводить адрес...',
  required = false 
}: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isTouched, setIsTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.length < 5) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Token 4308ec1ea2bfa7fb8aae5a84d8cef8c47e5d4d44'
            },
            body: JSON.stringify({
              query: value,
              count: 10
            })
          }
        );

        const data = await response.json();
        
        const addressSuggestions: AddressSuggestion[] = data.suggestions?.map((item: any) => ({
          value: item.value,
          fullAddress: item.unrestricted_value,
          postalCode: item.data.postal_code,
          city: item.data.city,
          street: item.data.street,
          house: item.data.house,
          flat: item.data.flat,
          coordinates: item.data.geo_lat && item.data.geo_lon 
            ? { lat: item.data.geo_lat, lon: item.data.geo_lon }
            : null
        })) || [];

        setSuggestions(addressSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Address suggestion error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    onChange(suggestion.value, suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="relative">
      <Label htmlFor="address">{label} {required && '*'}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="address"
          name="street-address"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setIsTouched(true)}
          required={required}
          autoComplete="street-address"
          className="pr-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0 ${
                highlightedIndex === index ? 'bg-accent' : ''
              }`}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="flex items-start gap-2">
                <Icon name="MapPin" size={16} className="text-muted-foreground mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{suggestion.value}</p>
                  {suggestion.postalCode && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Индекс: {suggestion.postalCode}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {value.length === 0 && isTouched && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <Icon name="AlertCircle" size={12} />
          Укажите адрес доставки
        </p>
      )}

      {value.length > 0 && value.length < 5 && (
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Icon name="Info" size={12} />
          Введите минимум 5 символов для поиска адреса
        </p>
      )}

      {value.length >= 5 && !isTouched && (
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Icon name="Search" size={12} />
          Выберите адрес из выпадающего списка
        </p>
      )}

      {value.length >= 5 && isTouched && (
        <p className="text-xs text-green-600 mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <Icon name="CheckCircle2" size={12} />
          Адрес указан
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;