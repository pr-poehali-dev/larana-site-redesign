import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import ScrollToTop from '@/components/ScrollToTop';
import { blogArticles, getBlogCategories } from '@/data/blogData';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const categories = ['Все', ...getBlogCategories()];

  const filteredArticles = selectedCategory === 'Все' 
    ? blogArticles 
    : blogArticles.filter(article => article.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Блог о мебели в наличии | Советы и новости от LARANA</title>
        <meta name="description" content="Полезные статьи о выборе мебели, новинках каталога, советы по уходу за мебелью. Актуальная информация о товарах в наличии в Екатеринбурге." />
        <meta name="keywords" content="блог о мебели, выбор мебели советы, мебель в наличии, мебель екатеринбург" />
        <link rel="canonical" href="https://laranamebel.ru/blog" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Блог LARANA",
            "description": "Полезные статьи о выборе мебели, новинках каталога, советы по уходу и обзоры товаров",
            "url": "https://laranamebel.ru/blog",
            "publisher": {
              "@type": "Organization",
              "name": "LARANA",
              "url": "https://laranamebel.ru",
              "logo": {
                "@type": "ImageObject",
                "url": "https://cdn.poehali.dev/files/8e9a575f-fd1c-4d40-821a-4154a78e1d00.jpg"
              }
            },
            "blogPost": blogArticles.map(article => ({
              "@type": "BlogPosting",
              "headline": article.title,
              "url": `https://laranamebel.ru/blog/${article.slug}`,
              "image": article.image,
              "datePublished": article.date,
              "description": article.excerpt
            }))
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": "https://laranamebel.ru"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Блог",
                "item": "https://laranamebel.ru/blog"
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          <div className="bg-primary text-primary-foreground py-12">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Блог LARANA</h1>
              <p className="text-xl opacity-90 max-w-3xl">
                Полезные статьи о выборе мебели, новинках каталога, советы по уходу и обзоры товаров в наличии в Екатеринбурге
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Link key={article.id} to={`/blog/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Icon name="Clock" size={14} />
                          {article.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{new Date(article.date).toLocaleDateString('ru-RU')}</span>
                        <span className="flex items-center gap-1 text-primary font-medium">
                          Читать <Icon name="ArrowRight" size={16} />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <Icon name="FileText" size={64} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">
                  Статей в этой категории пока нет
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default Blog;