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
  | 'bed'           // Интерьерные кровати
  | 'soft'          // Мягкая мебель
  | 'corner-sofa'   // Угловые диваны
  | 'kitchen'       // Кухня
  | 'countertop'    // Столешницы
  | 'mixed';        // Смешанный заказ

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

  let basePrice = 0;
  let totalPrice = 0;
  let details = '';

  switch (category) {
    case 'bed':
      if (hasElevator) {
        basePrice = 800;
        totalPrice = 800;
        details = 'С лифтом: 800 ₽';
      } else {
        if (floor === 1) {
          basePrice = 800;
          totalPrice = 800;
          details = '1 этаж: 800 ₽';
        } else if (floor === 2) {
          basePrice = 1000;
          totalPrice = 1000;
          details = '2 этаж без лифта: 1 000 ₽';
        } else if (floor === 3) {
          basePrice = 1200;
          totalPrice = 1200;
          details = '3 этаж без лифта: 1 200 ₽';
        } else if (floor === 4) {
          basePrice = 1400;
          totalPrice = 1400;
          details = '4 этаж без лифта: 1 400 ₽';
        } else if (floor >= 5) {
          basePrice = 1600;
          totalPrice = 1600;
          details = '5+ этаж без лифта: 1 600 ₽';
        }
      }
      break;

    case 'soft':
      basePrice = 1000;
      if (hasElevator || floor === 1) {
        totalPrice = 1000;
        details = hasElevator ? 'С лифтом: 1 000 ₽' : '1 этаж: 1 000 ₽';
      } else {
        const additionalFloors = floor - 1;
        totalPrice = 1000 + (additionalFloors * 200);
        details = `1 этаж (1 000 ₽) + ${additionalFloors} эт. × 200 ₽ = ${totalPrice.toLocaleString('ru-RU')} ₽`;
      }
      break;

    case 'corner-sofa':
      basePrice = 1000;
      if (hasElevator || floor === 1) {
        totalPrice = 1300;
        details = `Угловой диван ${hasElevator ? 'с лифтом' : '1 этаж'}: 1 000 ₽ + 300 ₽ = 1 300 ₽`;
      } else {
        const additionalFloors = floor - 1;
        totalPrice = 1000 + (additionalFloors * 200) + 300;
        details = `1 000 ₽ + ${additionalFloors} эт. × 200 ₽ + угловой (300 ₽) = ${totalPrice.toLocaleString('ru-RU')} ₽`;
      }
      break;

    case 'kitchen':
      basePrice = 1000;
      if (hasElevator || floor === 1) {
        totalPrice = 1000;
        details = hasElevator ? 'С лифтом: 1 000 ₽' : '1 этаж: 1 000 ₽';
      } else {
        const additionalFloors = floor - 1;
        totalPrice = 1000 + (additionalFloors * 200);
        details = `1 этаж (1 000 ₽) + ${additionalFloors} эт. × 200 ₽ = ${totalPrice.toLocaleString('ru-RU')} ₽`;
      }
      break;

    case 'countertop':
      if (!countertopLength || countertopLength <= 2300) {
        totalPrice = 1000;
        details = 'До 2 300 мм: 1 000 ₽';
      } else if (countertopLength <= 2800) {
        if (hasElevator || floor === 1) {
          totalPrice = 1000;
          details = 'От 2 300 мм: как кухня (1 000 ₽)';
        } else {
          const additionalFloors = floor - 1;
          totalPrice = 1000 + (additionalFloors * 200);
          details = `От 2 300 мм: как кухня (1 000 ₽ + ${additionalFloors} эт. × 200 ₽) = ${totalPrice.toLocaleString('ru-RU')} ₽`;
        }
      } else {
        totalPrice = 0;
        details = 'От 2 800 мм: требуется индивидуальный расчёт';
      }
      break;

    case 'mixed':
      basePrice = 1000;
      if (hasElevator || floor === 1) {
        totalPrice = 1300;
        details = 'Смешанный заказ: 1 000 ₽ + 300 ₽ за каждое изделие';
      } else {
        const additionalFloors = floor - 1;
        totalPrice = 1000 + (additionalFloors * 200) + 300;
        details = `Смешанный: 1 000 ₽ + ${additionalFloors} эт. × 200 ₽ + 300 ₽ за изделие`;
      }
      break;
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
    'bed': 'Интерьерные кровати',
    'soft': 'Мягкая мебель',
    'corner-sofa': 'Угловой диван',
    'kitchen': 'Кухня',
    'countertop': 'Столешница',
    'mixed': 'Смешанный заказ'
  };
  return names[category];
};