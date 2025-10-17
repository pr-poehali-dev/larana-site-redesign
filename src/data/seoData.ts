export const cities = {
  ekaterinburg: {
    name: 'Екатеринбург',
    region: 'Свердловская область',
    declension: {
      genitive: 'Екатеринбурга',
      prepositional: 'Екатеринбурге'
    }
  },
  tyumen: {
    name: 'Тюмень',
    region: 'Тюменская область',
    declension: {
      genitive: 'Тюмени',
      prepositional: 'Тюмени'
    }
  },
  chelyabinsk: {
    name: 'Челябинск',
    region: 'Челябинская область',
    declension: {
      genitive: 'Челябинска',
      prepositional: 'Челябинске'
    }
  },
  surgut: {
    name: 'Сургут',
    region: 'ХМАО',
    declension: {
      genitive: 'Сургута',
      prepositional: 'Сургуте'
    }
  },
  nizhnevartovsk: {
    name: 'Нижневартовск',
    region: 'ХМАО',
    declension: {
      genitive: 'Нижневартовска',
      prepositional: 'Нижневартовске'
    }
  },
  'khanty-mansiysk': {
    name: 'Ханты-Мансийск',
    region: 'ХМАО',
    declension: {
      genitive: 'Ханты-Мансийска',
      prepositional: 'Ханты-Мансийске'
    }
  },
  noyabrsk: {
    name: 'Ноябрьск',
    region: 'ЯНАО',
    declension: {
      genitive: 'Ноябрьска',
      prepositional: 'Ноябрьске'
    }
  },
  'novy-urengoy': {
    name: 'Новый Уренгой',
    region: 'ЯНАО',
    declension: {
      genitive: 'Нового Уренгоя',
      prepositional: 'Новом Уренгое'
    }
  },
  salekhard: {
    name: 'Салехард',
    region: 'ЯНАО',
    declension: {
      genitive: 'Салехарда',
      prepositional: 'Салехарде'
    }
  },
  nadym: {
    name: 'Надым',
    region: 'ЯНАО',
    declension: {
      genitive: 'Надыма',
      prepositional: 'Надыме'
    }
  },
  'verkhnyaya-pyshma': {
    name: 'Верхняя Пышма',
    region: 'Свердловская область',
    declension: {
      genitive: 'Верхней Пышмы',
      prepositional: 'Верхней Пышме'
    }
  },
  berezovsky: {
    name: 'Берёзовский',
    region: 'Свердловская область',
    declension: {
      genitive: 'Берёзовского',
      prepositional: 'Берёзовском'
    }
  },
  sredneuralsk: {
    name: 'Среднеуральск',
    region: 'Свердловская область',
    declension: {
      genitive: 'Среднеуральска',
      prepositional: 'Среднеуральске'
    }
  }
};

export const categories = {
  kitchen: {
    name: 'Кухни',
    nameSingle: 'кухня',
    nameGenitive: 'кухни',
    keywords: [
      'кухни на заказ',
      'кухня на заказ',
      'кухонный гарнитур на заказ',
      'кухни на заказ цена',
      'кухни на заказ недорого'
    ],
    description: 'Изготовление кухонь на заказ с бесплатной доставкой и сборкой'
  },
  wardrobe: {
    name: 'Шкафы-купе',
    nameSingle: 'шкаф-купе',
    nameGenitive: 'шкафа-купе',
    keywords: [
      'шкаф купе на заказ',
      'шкафы купе на заказ',
      'встроенный шкаф купе на заказ',
      'шкаф купе на заказ цена',
      'шкаф купе на заказ недорого'
    ],
    description: 'Изготовление шкафов-купе на заказ любых размеров и конфигураций'
  },
  wardrobe_room: {
    name: 'Гардеробные',
    nameSingle: 'гардеробная',
    nameGenitive: 'гардеробной',
    keywords: [
      'гардеробная на заказ',
      'гардеробная комната на заказ',
      'двери купе для гардеробной'
    ],
    description: 'Проектирование и изготовление гардеробных комнат на заказ'
  },
  countertop: {
    name: 'Столешницы',
    nameSingle: 'столешница',
    nameGenitive: 'столешницы',
    keywords: [
      'столешницы на заказ',
      'столешница для кухни на заказ',
      'столешницы из искусственного камня на заказ'
    ],
    description: 'Изготовление столешниц из искусственного камня и других материалов'
  },
  facade: {
    name: 'Фасады',
    nameSingle: 'фасад',
    nameGenitive: 'фасада',
    keywords: [
      'фасады для кухни на заказ',
      'замена фасадов кухни'
    ],
    description: 'Изготовление и замена фасадов для кухонной мебели'
  }
};

export const seoServices = {
  measurement: {
    title: 'Бесплатный замер',
    keywords: ['замер кухни', 'бесплатный замер', 'замер кухни бесплатно']
  },
  delivery: {
    title: 'Доставка и сборка',
    keywords: ['доставка и сборка кухни', 'доставка кухни']
  },
  installment: {
    title: 'Рассрочка',
    keywords: ['кухня на заказ рассрочка', 'рассрочка на кухню']
  },
  reviews: {
    title: 'Отзывы',
    keywords: ['кухни на заказ отзывы', 'отзывы о кухнях']
  }
};

export function generateSeoMeta(category: string, city: string) {
  const cat = categories[category as keyof typeof categories];
  const cty = cities[city as keyof typeof cities];
  
  if (!cat || !cty) return null;

  return {
    title: `${cat.name} на заказ в ${cty.declension.prepositional} | Доставка и сборка под ключ`,
    description: `${cat.description} в ${cty.declension.prepositional}. Бесплатный замер, доставка и сборка. Цены от производителя. Работаем по всей ${cty.region}.`,
    keywords: cat.keywords.map(k => `${k} ${city}`).join(', '),
    h1: `${cat.name} на заказ в ${cty.declension.prepositional}`,
    breadcrumb: [
      { name: 'Главная', url: '/' },
      { name: cty.name, url: `/city/${city}` },
      { name: cat.name, url: `/city/${city}/${category}` }
    ]
  };
}
