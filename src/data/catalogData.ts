export interface CategoryMeta {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  breadcrumb: { name: string; url: string }[];
  content: {
    intro: string;
    h2Sections: { title: string; content: string }[];
    faq: { question: string; answer: string }[];
  };
}

export interface FilterOption {
  id: string;
  name: string;
  type: 'range' | 'checkbox' | 'radio' | 'select';
  options?: { value: string; label: string; count?: number }[];
  min?: number;
  max?: number;
  unit?: string;
}

export const categories: Record<string, CategoryMeta> = {
  'shkafy-kupe': {
    slug: 'shkafy-kupe',
    title: 'Шкафы-купе в Екатеринбурге — купить с доставкой | LARANA',
    h1: 'Шкафы-купе в Екатеринбурге',
    metaDescription: 'Большой выбор шкафов-купе. Доставка по Екатеринбургу, сборка и гарантия. Рассрочка. Реальные отзывы и фото.',
    primaryKeywords: ['шкафы купе екатеринбург', 'купить шкаф купе', 'шкаф купе цена'],
    secondaryKeywords: ['шкаф купе недорого', 'встраиваемые шкафы купе', 'шкаф купе для прихожей'],
    breadcrumb: [
      { name: 'Главная', url: '/' },
      { name: 'Каталог', url: '/catalog' },
      { name: 'Шкафы-купе', url: '/catalog/shkafy-kupe' }
    ],
    content: {
      intro: 'Шкафы-купе — практичное решение для любой комнаты. В каталоге LARANA представлены шкафы различных размеров, конфигураций и стилей. Все модели с зеркальными и глухими фасадами, встроенными системами хранения. Доставка по Екатеринбургу, профессиональная сборка и гарантия 2 года.',
      h2Sections: [
        {
          title: 'Популярные размеры',
          content: 'Стандартные размеры шкафов-купе: ширина от 120 до 300 см, высота до 240 см, глубина 45-60 см. Мы поможем подобрать оптимальный размер под ваше помещение.'
        },
        {
          title: 'Материалы и фасады',
          content: 'Корпус из ЛДСП, фасады — зеркало, ЛДСП, комбинированные варианты. Раздвижная система на алюминиевых направляющих — тихая и плавная.'
        },
        {
          title: 'Доставка и сборка',
          content: 'Бесплатная доставка по Екатеринбургу при заказе от 15 000 ₽. Профессиональная сборка включена в стоимость. Средний срок доставки — 1-3 дня.'
        },
        {
          title: 'Гарантия и возврат',
          content: 'Гарантия на шкафы-купе — 2 года. Возврат и обмен в течение 14 дней согласно законодательству РФ.'
        }
      ],
      faq: [
        {
          question: 'Какой размер шкафа-купе выбрать?',
          answer: 'Оптимальная глубина — 60 см (с учётом раздвижной системы остаётся 55 см для вешалок). Ширина зависит от места установки, минимум — 120 см.'
        },
        {
          question: 'Сколько времени занимает сборка?',
          answer: 'Сборка шкафа-купе шириной до 2 метров занимает 2-4 часа. Более крупные модели — до 6 часов.'
        },
        {
          question: 'Можно ли установить шкаф-купе в нишу?',
          answer: 'Да, мы предлагаем встраиваемые модели без задней и боковых стенок — это экономичное решение для ниш.'
        },
        {
          question: 'Какие фасады лучше — зеркальные или глухие?',
          answer: 'Зеркальные фасады визуально расширяют пространство, глухие — более практичны в уходе. Можно комбинировать оба варианта.'
        }
      ]
    }
  },
  'divany': {
    slug: 'divany',
    title: 'Диваны в Екатеринбурге — купить с доставкой и сборкой | LARANA',
    h1: 'Диваны в Екатеринбурге',
    metaDescription: 'Прямые и угловые диваны. Быстрая доставка, сборка, гарантия. Рассрочка без переплаты.',
    primaryKeywords: ['диваны екатеринбург', 'купить диван', 'диваны цена'],
    secondaryKeywords: ['диван угловой', 'диван прямой', 'диван-кровать', 'недорогие диваны'],
    breadcrumb: [
      { name: 'Главная', url: '/' },
      { name: 'Каталог', url: '/catalog' },
      { name: 'Диваны', url: '/catalog/divany' }
    ],
    content: {
      intro: 'В каталоге LARANA представлены прямые и угловые диваны для гостиной, спальни и кухни. Модели с различными механизмами трансформации, обивками и размерами. Все диваны с гарантией, доставкой и сборкой по Екатеринбургу.',
      h2Sections: [
        {
          title: 'Популярные модели',
          content: 'Прямые диваны — компактные и универсальные. Угловые — вмещают больше человек, идеальны для больших гостиных. Диваны-кровати — с механизмами еврокнижка, дельфин, аккордеон.'
        },
        {
          title: 'Механизмы трансформации',
          content: 'Еврокнижка — самый популярный и надёжный механизм. Дельфин — удобен для ежедневного использования. Аккордеон — компактный в сложенном виде.'
        },
        {
          title: 'Ткани и уход',
          content: 'Велюр — мягкий и приятный на ощупь. Рогожка — износостойкая и практичная. Экокожа — легко чистится. Все ткани с антивандальной пропиткой.'
        },
        {
          title: 'Доставка и сборка',
          content: 'Бесплатная доставка по Екатеринбургу при заказе от 10 000 ₽. Сборка и подъём на этаж включены.'
        }
      ],
      faq: [
        {
          question: 'Какой диван лучше для сна?',
          answer: 'Для ежедневного сна подходят механизмы дельфин и аккордеон — у них ровное спальное место без стыков.'
        },
        {
          question: 'Какая обивка самая износостойкая?',
          answer: 'Рогожка и шенилл — самые практичные ткани, выдерживают активное использование и легко чистятся.'
        },
        {
          question: 'Есть ли диваны с ящиком для белья?',
          answer: 'Да, большинство моделей с механизмами еврокнижка и дельфин оснащены вместительным бельевым ящиком.'
        },
        {
          question: 'Сколько времени занимает доставка?',
          answer: 'Доставка товаров в наличии — 1-3 дня. Товары под заказ — от 5 до 14 рабочих дней.'
        }
      ]
    }
  }
};

export const categoryFilters: Record<string, FilterOption[]> = {
  'shkafy-kupe': [
    {
      id: 'price',
      name: 'Цена',
      type: 'range',
      min: 15000,
      max: 80000,
      unit: '₽'
    },
    {
      id: 'width',
      name: 'Ширина',
      type: 'checkbox',
      options: [
        { value: '120-150', label: '120-150 см', count: 12 },
        { value: '150-180', label: '150-180 см', count: 18 },
        { value: '180-220', label: '180-220 см', count: 24 },
        { value: '220+', label: 'От 220 см', count: 15 }
      ]
    },
    {
      id: 'material',
      name: 'Материал фасада',
      type: 'checkbox',
      options: [
        { value: 'mirror', label: 'Зеркало', count: 45 },
        { value: 'ldsp', label: 'ЛДСП', count: 38 },
        { value: 'combined', label: 'Комбинированный', count: 28 }
      ]
    },
    {
      id: 'color',
      name: 'Цвет',
      type: 'checkbox',
      options: [
        { value: 'white', label: 'Белый', count: 22 },
        { value: 'wenge', label: 'Венге', count: 18 },
        { value: 'oak', label: 'Дуб', count: 25 },
        { value: 'grey', label: 'Серый', count: 14 }
      ]
    },
    {
      id: 'inStock',
      name: 'В наличии',
      type: 'checkbox',
      options: [
        { value: 'true', label: 'Только в наличии', count: 35 }
      ]
    }
  ],
  'divany': [
    {
      id: 'price',
      name: 'Цена',
      type: 'range',
      min: 18000,
      max: 90000,
      unit: '₽'
    },
    {
      id: 'type',
      name: 'Тип',
      type: 'checkbox',
      options: [
        { value: 'straight', label: 'Прямой', count: 42 },
        { value: 'corner', label: 'Угловой', count: 38 },
        { value: 'modular', label: 'Модульный', count: 12 }
      ]
    },
    {
      id: 'mechanism',
      name: 'Механизм',
      type: 'checkbox',
      options: [
        { value: 'eurobook', label: 'Еврокнижка', count: 35 },
        { value: 'dolphin', label: 'Дельфин', count: 28 },
        { value: 'accordion', label: 'Аккордеон', count: 18 },
        { value: 'without', label: 'Без механизма', count: 12 }
      ]
    },
    {
      id: 'fabric',
      name: 'Обивка',
      type: 'checkbox',
      options: [
        { value: 'velour', label: 'Велюр', count: 32 },
        { value: 'cloth', label: 'Рогожка', count: 28 },
        { value: 'eco-leather', label: 'Экокожа', count: 18 },
        { value: 'chenille', label: 'Шенилл', count: 15 }
      ]
    },
    {
      id: 'storage',
      name: 'Ящик для белья',
      type: 'checkbox',
      options: [
        { value: 'true', label: 'С ящиком', count: 45 }
      ]
    },
    {
      id: 'inStock',
      name: 'В наличии',
      type: 'checkbox',
      options: [
        { value: 'true', label: 'Только в наличии', count: 28 }
      ]
    }
  ]
};
