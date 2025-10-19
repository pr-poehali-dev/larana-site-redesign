import { Product } from '@/types/admin';

export const productsToDelete = [
  'Товар Ц0084746',
  'Товар Ц0084980',
  'Товар Ц0064609',
  'Товар Ц0081949',
  'Товар Ц0084981',
  'Товар Ц0065338',
  'Товар Ц0084961',
  'Товар Ц0063649',
  'Товар Ц0063627',
  'Товар Ц0084979',
  'Товар Ц0084978',
  'Товар Ц0084972',
  'Товар Ц0050205',
  'Товар Ц0067418',
  'Товар Ц0081444',
  'Товар Ц0063873',
  'Товар Ц0075504',
  'Товар Ц0083200',
  'Товар Ц0063628',
  'Товар Ц0077915',
  'Товар Ц0084722',
  'Товар Ц0050203',
  'Товар Ц0075505',
  'Товар Ц0084927',
  'Товар Ц0050216',
  'Товар Ц0069392',
  'Товар Ц0050220',
  'Товар Ц0083692',
  'Товар Ц0084000',
  'Товар Ц0076594',
  'Товар Ц0064606',
  'Товар Ц0050207',
  'Товар Ц0081610',
  'Товар Ц0083202',
  'Товар Ц0067414',
  'Товар Ц0082327',
  'Товар Ц0067416',
  'Товар Ц0084445',
  'Товар Ц0084984',
  'Товар Ц0063875',
  'Товар Ц0064222',
  'Товар Ц0084977',
  'Товар Ц0050217',
  'Товар Ц0067420',
  'Товар Ц0082326',
  'Товар Ц0084975',
  'Товар Ц0065348',
  'Товар Ц0065347',
  'Товар Ц0064231',
  'Товар Ц0064227',
  'Товар PR-0018.1544',
  'Товар Ц0064237',
  'Товар Ц0075135',
  'Товар Ц0064225',
  'Товар Ц0064219',
  'Товар Ц0064238',
  'Товар Ц0081428',
  'Товар Ц0064228',
  'Товар Ц0065333',
  'Товар Ц0064263',
  'Товар Ц0064218',
  'Товар KM-0216.0133',
  'Товар NKL02S1.2.1623',
  'Товар KM-0216.1747',
  'Товар Ц0064239',
  'Товар Ц0084974',
  'Товар Ц0065344',
  'Товар SPV-1.05.1544',
  'Товар KM-0216.2120',
  'Товар Ц0084848',
  'Товар Ц0067523',
  'Товар TM-001.2.2173',
  'Товар Ц0064223',
  'Товар LMN-02.2342',
  'Товар P-014.1544',
  'Товар Ц0064347',
  'Товар Ц0064226',
  'Товар Ц0083414',
  'Товар Ц0066543',
  'Товар Ц0075137',
  'Товар KM-0216.1544',
  'Товар Ц0064229',
  'Товар Ц0075141',
  'Товар Ц0064232',
  'Товар KM-0216.0144',
  'Товар Ц0064230',
  'Товар Ц0074620',
  'Товар Ц0064235',
  'Товар TM-001.2.2172',
  'Товар Ц0064220',
  'Товар PR-0018.0739',
  'Товар PR-0018.0144',
  'Товар Ц0064217',
  'Товар LMN-02.1797',
  'Товар Ц0084847',
  'Товар Ц0075132'
];

export const normalizeCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'Гостиные': 'Гостиная',
    'Спальни': 'Спальня',
    'Кухни': 'Кухня',
    'Прихожие': 'Прихожая'
  };
  return categoryMap[category] || category;
};

export const cleanImageUrl = (url: string): string => {
  if (!url) return url;
  
  let cleaned = url.trim();
  
  if (cleaned.endsWith('Р') || cleaned.endsWith('р')) {
    cleaned = cleaned.slice(0, -1).trim();
  }
  
  cleaned = cleaned
    .replace(/\s*[₽₸₴€$£¥]\s*.*$/, '')
    .replace(/\s+₽.*$/, '')
    .replace(/₽.*$/, '')
    .split(' ')[0]
    .trim();
  
  return cleaned.startsWith('http') ? cleaned : url;
};

export const roundPrice = (price: string): string => {
  if (!price) return '0 ₽';
  const numericValue = price.replace(/[^\d.,]/g, '').replace(',', '.');
  const rounded = Math.round(parseFloat(numericValue) || 0);
  return `${rounded} ₽`;
};

export const processProducts = (loadedProducts: Product[]): Product[] => {
  const filteredProducts = loadedProducts.filter((product: Product) => 
    !productsToDelete.includes(product.title)
  );
  
  const fixedProducts = filteredProducts.map((product: Product) => {
    let fixed = product;
    
    if (product.supplierArticle && product.price && product.price.startsWith('http')) {
      fixed = {
        ...product,
        price: '0 ₽',
        image: product.images?.[0] || product.price,
        images: product.images || [product.price]
      };
    }
    
    const cleanedImage = cleanImageUrl(fixed.image || '');
    const cleanedImages = (fixed.images || []).map(cleanImageUrl).filter(url => url.startsWith('http'));
    
    const cleanedDescription = (fixed.description || fixed.title || '')
      .replace(/\.\s*Товар импортирован из Ozon\./g, '')
      .replace(/Товар импортирован из Ozon\.\s*/g, '')
      .trim();
    
    return {
      ...fixed,
      category: normalizeCategory(fixed.category || 'Гостиная'),
      price: roundPrice(fixed.price || '0 ₽'),
      image: cleanedImage,
      images: cleanedImages.length > 0 ? cleanedImages : [cleanedImage],
      items: fixed.items || [],
      style: fixed.style || 'Современный',
      description: cleanedDescription || fixed.title || '',
      colors: fixed.colors || ['Базовый']
    };
  });
  
  return fixedProducts;
};
