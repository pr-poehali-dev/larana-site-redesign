const CACHE_KEY = 'admin_products_cache';
const CACHE_TIMESTAMP_KEY = 'admin_products_cache_timestamp';

export const clearProductCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    console.log('🗑️ Кэш товаров очищен');
  } catch (error) {
    console.warn('Ошибка очистки кэша:', error);
  }
};

export const getCacheAge = (): number | null => {
  try {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return null;
    
    return Date.now() - parseInt(timestamp);
  } catch (error) {
    return null;
  }
};

export const getCachedProducts = (): any[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    return null;
  }
};
