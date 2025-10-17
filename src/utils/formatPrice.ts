export function formatPrice(price: string | number): string {
  const priceStr = typeof price === 'number' ? price.toString() : price;
  const numericPrice = priceStr.replace(/[^\d]/g, '');
  
  if (!numericPrice) return priceStr;
  
  const formatted = numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ₽`;
}
