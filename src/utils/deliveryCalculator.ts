import { 
  sverdlovskRegionRates, 
  cottageSettlementsEkb, 
  chelyabinskRegionRates, 
  tyumenRegionRates, 
  yanaoHmaoRates, 
  permRegionRates,
  carryRates,
  deliveryInfo
} from '@/data/deliveryRates';

export interface DeliveryCalculation {
  city: string;
  deliveryPrice: number;
  isFreeZone: boolean;
  distance?: string;
  estimatedDays?: string;
}

export interface FloorCarryCalculation {
  basePrice: number;
  totalPrice: number;
  details: string;
  category: string;
}

export type FurnitureCategory = 
  | 'soft'          // Мягкая мебель
  | 'wardrobe'      // Корпусная мебель (шкафы)
  | 'kitchen';      // Кухня

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

export const calculateFloorCarry = (
  category: FurnitureCategory,
  floor: number,
  hasElevator: boolean,
  countertopLength?: number
): FloorCarryCalculation => {
  if (floor <= 0) {
    return {
      basePrice: 0,
      totalPrice: 0,
      details: 'Не требуется',
      category: getCategoryName(category)
    };
  }

  const basePrice = 1000;
  let totalPrice = 0;
  let details = '';

  // Все категории: базовая цена 1000₽
  if (hasElevator || floor === 1) {
    totalPrice = 1000;
    details = hasElevator ? 'С лифтом: 1 000 ₽' : '1 этаж: 1 000 ₽';
  } else {
    const additionalFloors = floor - 1;
    totalPrice = 1000 + (additionalFloors * 200);
    details = `1 этаж (1 000 ₽) + ${additionalFloors} эт. × 200 ₽ = ${totalPrice.toLocaleString('ru-RU')} ₽`;
  }

  return {
    basePrice,
    totalPrice,
    details,
    category: getCategoryName(category)
  };
};

const getCategoryName = (category: FurnitureCategory): string => {
  const names: Record<FurnitureCategory, string> = {
    'soft': 'Мягкая мебель',
    'wardrobe': 'Корпусная мебель (шкафы)',
    'kitchen': 'Кухня'
  };
  return names[category];
};