export function formatPrice(price: string | number | undefined | null): string {
  if (price === undefined || price === null || price === '') {
    return '0 ₽';
  }
  
  const priceStr = typeof price === 'number' ? price.toString() : String(price);
  const numericPrice = priceStr.replace(/[^\d]/g, '');
  
  if (!numericPrice) {
    return '0 ₽';
  }
  
  const formatted = numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ₽`;
}