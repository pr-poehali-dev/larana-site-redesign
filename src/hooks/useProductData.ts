import { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';

export const useProductData = () => {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [budget, setBudget] = useState([60000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const { availableProducts, setAllFurnitureSets } = useProducts();

  const furnitureSets = availableProducts
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
    availableProducts,
    setAllFurnitureSets,
    furnitureSets
  };
};