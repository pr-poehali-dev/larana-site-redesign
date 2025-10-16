import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface CitySuggestion {
  value: string;
  fullName: string;
  region?: string;
  postalCode?: string;
}

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string, suggestion?: CitySuggestion) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const CityAutocomplete = ({ 
  value, 
  onChange, 
  label = 'Город', 
  placeholder = 'Начните вводить название города...',
  required = false 
}: CityAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
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
    const fetchCitySuggestions = async () => {
      if (!value || value.length < 2) {
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
              count: 10,
              from_bound: { value: 'city' },
              to_bound: { value: 'city' }
            })
          }
        );

        const data = await response.json();
        
        const citySuggestions: CitySuggestion[] = data.suggestions?.map((item: any) => ({
          value: item.data.city || item.value,
          fullName: item.value,
          region: item.data.region_with_type,
          postalCode: item.data.postal_code
        })) || [];

        setSuggestions(citySuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('City suggestion error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchCitySuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleSelectSuggestion = (suggestion: CitySuggestion) => {
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
      <Label htmlFor="city">{label} {required && '*'}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="city"
          name="address-level2"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          required={required}
          autoComplete="address-level2"
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
                  <p className="text-sm font-medium">{suggestion.value}</p>
                  {suggestion.region && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {suggestion.region}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {value.length > 0 && value.length < 2 && (
        <p className="text-xs text-muted-foreground mt-1">
          Введите минимум 2 символа для поиска
        </p>
      )}
    </div>
  );
};

export default CityAutocomplete;