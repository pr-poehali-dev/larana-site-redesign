import { useState } from 'react';

export const useProductData = () => {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [budget, setBudget] = useState([60000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const [allFurnitureSets, setAllFurnitureSets] = useState([
    {
      id: 1,
      title: 'Спальня "Сканди Мини"',
      category: 'Спальня',
      price: '38900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/857f001b-0b80-43af-a51b-f2a18a4ef240.jpg',
      items: ['Кровать 160', 'Шкаф 2Д', 'Тумбы'],
      style: 'Скандинавский',
      description: 'Кровать, 2 тумбы, шкаф, всё в скандинавском стиле. Идеально для молодых пар.',
      colors: ['Белый/дуб', 'серый/дуб'],
      inStock: true
    },
    {
      id: 2,
      title: 'Спальня "Комфорт Люкс"',
      category: 'Спальня',
      price: '57900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/790ac483-2de4-49e5-acd3-bb2f557ab85a.jpg',
      items: ['Кровать 180', 'Шкаф-купе', 'Комод', 'Зеркало'],
      style: 'Современный',
      description: 'Расширенный комплект: кровать, шкаф-купе, комод, зеркало. Цвет — дуб сонома.',
      colors: ['Дуб сонома', 'венге'],
      inStock: true
    },
    {
      id: 3,
      title: 'Кухня "Лара 180"',
      category: 'Кухня',
      price: '25900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/4b4f05f3-22e9-4eac-8af3-69ffc361cde8.jpg',
      items: ['Фасады', 'Столешница', 'Фурнитура'],
      style: 'Современный',
      description: 'Базовая кухня 180 см, верх + низ, фасады белый глянец. Подходит для арендаторов.',
      colors: ['Белый глянец', 'графит'],
      inStock: true
    },
    {
      id: 4,
      title: 'Кухня "Милан 240"',
      category: 'Кухня',
      price: '37900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/361eb671-ade4-4f67-9df1-de00cd20c61a.jpg',
      items: ['Фасады', 'Ручки', 'Фурнитура', 'Мойка'],
      style: 'Современный',
      description: 'Большая кухня 240 см, серый матовый фасад. Есть опция доводчиков и сушки.',
      colors: ['Серый мат', 'орех'],
      inStock: true
    },
    {
      id: 5,
      title: 'Шкаф-купе "Базис 2Д"',
      category: 'Шкафы',
      price: '17900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/5f05fce3-e920-49ee-9348-2bf8a0c2704e.jpg',
      items: ['Корпус', 'Двери', 'Зеркало'],
      style: 'Современный',
      description: 'Шкаф-купе 2-дверный, зеркало, ширина 120 см. Цвет: венге/дуб.',
      colors: ['Дуб', 'венге'],
      inStock: true
    },
    {
      id: 6,
      title: 'Шкаф-купе "Премиум 3Д"',
      category: 'Шкафы',
      price: '29900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/3141aeac-5ce4-4d14-b899-130e0e1c1761.jpg',
      items: ['Корпус', 'Фасады', 'Зеркало', 'Подсветка'],
      style: 'Современный',
      description: 'Шкаф-купе с 3 дверями, встроенное зеркало, подсветка. Современный стиль.',
      colors: ['Белый', 'антрацит'],
      inStock: true
    },
    {
      id: 7,
      title: 'Диван-кровать "Токио"',
      category: 'Гостиная',
      price: '26900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/55ef2f3b-2c0d-430e-b90d-5ac124f152a7.jpg',
      items: ['Диван', 'Подушки', 'Ящик'],
      style: 'Современный',
      description: 'Диван с механизмом еврокнижка. Ткань велюр. Ящик для белья.',
      colors: ['Синий', 'серый', 'бежевый'],
      inStock: true
    },
    {
      id: 8,
      title: 'Угловой диван-кровать "Неаполь"',
      category: 'Гостиная',
      price: '34900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/fb225bdc-f87d-4843-8021-0161f72938fa.jpg',
      items: ['Угловой диван', 'Подлокотники', 'Бельевой ящик'],
      style: 'Современный',
      description: 'Угловой диван с раскладкой, подходит для сна. Большой выбор цветов.',
      colors: ['Бордо', 'зелёный', 'бежевый'],
      inStock: true
    },
    {
      id: 9,
      title: 'Прихожая "Мини L1"',
      category: 'Прихожая',
      price: '8900 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/b2671236-b685-4573-ac0e-0e2e4f68a820.jpg',
      items: ['Тумба', 'Вешалка', 'Зеркало'],
      style: 'Скандинавский',
      description: 'Компактный комплект с тумбой, вешалкой и зеркалом. Для малых прихожих.',
      colors: ['Дуб сонома'],
      inStock: true
    },
    {
      id: 10,
      title: 'Прихожая "Сити Lux"',
      category: 'Прихожая',
      price: '15400 ₽',
      image: 'https://cdn.poehali.dev/projects/38667a9f-497e-4567-b285-1db7b0b5ca66/files/f5366cbf-23dd-47aa-998c-006d9db97a2b.jpg',
      items: ['Шкаф', 'Обувница', 'Зеркало'],
      style: 'Современный',
      description: 'Шкаф + обувница + зеркало. Глянцевые фасады. Современный вид.',
      colors: ['Белый', 'дуб сонома'],
      inStock: true
    }
  ]);

  const furnitureSets = allFurnitureSets
    .filter(set => {
      if (selectedRoom && selectedRoom !== 'all' && set.category !== selectedRoom) return false;
      if (selectedStyle && selectedStyle !== 'all' && set.style !== selectedStyle) return false;
      if (budget[0] && parseInt(set.price) > budget[0]) return false;
      if (inStockOnly && !set.inStock) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') {
        return parseInt(a.price) - parseInt(b.price);
      }
      if (sortBy === 'price-desc') {
        return parseInt(b.price) - parseInt(a.price);
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return {
    selectedStyle,
    setSelectedStyle,
    selectedRoom,
    setSelectedRoom,
    budget,
    setBudget,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    allFurnitureSets,
    setAllFurnitureSets,
    furnitureSets
  };
};