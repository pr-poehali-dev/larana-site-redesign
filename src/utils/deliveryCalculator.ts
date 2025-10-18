import { 
  sverdlovskRegionRates, 
  cottageSettlementsEkb, 
  chelyabinskRegionRates, 
  tyumenRegionRates, 
  yanaoHmaoRates, 
  permRegionRates,
  deliveryInfo
} from '@/data/deliveryRates';

export interface DeliveryCalculation {
  city: string;
  deliveryPrice: number;
  isFreeZone: boolean;
  distance?: string;
  estimatedDays?: string;
}

const allRates = [
  ...sverdlovskRegionRates,
  ...cottageSettlementsEkb,
  ...chelyabinskRegionRates,
  ...tyumenRegionRates,
  ...yanaoHmaoRates,
  ...permRegionRates
];

export const calculateDelivery = (city: string, address?: string): DeliveryCalculation => {
  if (!city) {
    return {
      city: '',
      deliveryPrice: 0,
      isFreeZone: false
    };
  }

  const normalizedCity = city.toLowerCase().trim();
  const isFree = deliveryInfo.freeDeliveryZones.some(zone => 
    normalizedCity.includes(zone.toLowerCase())
  );

  if (isFree) {
    return {
      city,
      deliveryPrice: 0,
      isFreeZone: true,
      estimatedDays: '1-3 дня'
    };
  }

  const foundRate = allRates.find(rate => 
    rate.city.toLowerCase().includes(normalizedCity) || 
    normalizedCity.includes(rate.city.toLowerCase())
  );

  if (foundRate) {
    return {
      city: foundRate.city,
      deliveryPrice: foundRate.price,
      isFreeZone: false,
      distance: foundRate.distance,
      estimatedDays: estimateDays(foundRate.distance)
    };
  }

  return {
    city,
    deliveryPrice: 0,
    isFreeZone: false,
    estimatedDays: 'требуется уточнение'
  };
};

const estimateDays = (distance: string): string => {
  if (distance === 'точка') return '1-2 дня';
  
  const km = parseInt(distance.replace(/\D/g, ''));
  if (isNaN(km)) return '3-7 дней';
  
  if (km < 50) return '1-2 дня';
  if (km < 150) return '2-4 дня';
  if (km < 300) return '3-5 дней';
  return '5-10 дней';
};

export const searchCities = (query: string): string[] => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  const matches = allRates
    .filter(rate => rate.city.toLowerCase().includes(normalizedQuery))
    .map(rate => rate.city)
    .slice(0, 10);
  
  return [...new Set(matches)];
};
