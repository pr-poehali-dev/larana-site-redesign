import { Helmet } from 'react-helmet-async';

interface CategorySEOProps {
  categoryData: any;
  slug: string;
  mockProducts: any[];
}

const CategorySEO = ({ categoryData, slug, mockProducts }: CategorySEOProps) => {
  return (
    <Helmet>
      <title>{categoryData.title}</title>
      <meta name="description" content={categoryData.metaDescription} />
      <meta name="keywords" content={[...categoryData.primaryKeywords, ...categoryData.secondaryKeywords].join(', ')} />
      <link rel="canonical" href={`https://laranamebel.ru/catalog/${slug}`} />
      
      <meta property="og:title" content={categoryData.ogTitle || categoryData.title} />
      <meta property="og:description" content={categoryData.ogDescription || categoryData.metaDescription} />
      <meta property="og:type" content={categoryData.ogType || 'website'} />
      <meta property="og:url" content={`https://laranamebel.ru/catalog/${slug}`} />
      <meta property="og:image" content="https://cdn.poehali.dev/files/8e9a575f-fd1c-4d40-821a-4154a78e1d00.jpg" />
      
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": categoryData.breadcrumb.map((item: any, idx: number) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": item.name,
            "item": `https://laranamebel.ru${item.url}`
          }))
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": mockProducts.map((product, idx) => ({
            "@type": "Product",
            "position": idx + 1,
            "name": product.title,
            "image": product.image,
            "offers": {
              "@type": "Offer",
              "price": product.price.replace(/[^\d]/g, ''),
              "priceCurrency": "RUB",
              "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          }))
        })}
      </script>
    </Helmet>
  );
};

export default CategorySEO;
