import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import ScrollToTop from '@/components/ScrollToTop';
import { getBlogArticleBySlug } from '@/data/blogData';

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = slug ? getBlogArticleBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return <Navigate to="/404" replace />;
  }

  const handleConsultation = () => {
    if (article.content.cta.link) {
      navigate(article.content.cta.link);
    } else {
      navigate('/?action=consultation');
    }
  };

  return (
    <>
      <Helmet>
        <title>{article.seo.title}</title>
        <meta name="description" content={article.seo.description} />
        <meta name="keywords" content={article.seo.keywords} />
        <meta property="og:title" content={article.seo.title} />
        <meta property="og:description" content={article.seo.description} />
        <meta property="og:image" content={article.image} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://laranamebel.ru/blog/${article.slug}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": article.title,
            "image": {
              "@type": "ImageObject",
              "url": article.image,
              "width": 1200,
              "height": 630
            },
            "datePublished": article.date,
            "dateModified": article.date,
            "author": {
              "@type": "Organization",
              "name": "LARANA",
              "url": "https://laranamebel.ru"
            },
            "publisher": {
              "@type": "Organization",
              "name": "LARANA",
              "url": "https://laranamebel.ru",
              "logo": {
                "@type": "ImageObject",
                "url": "https://cdn.poehali.dev/files/8e9a575f-fd1c-4d40-821a-4154a78e1d00.jpg"
              }
            },
            "description": article.excerpt,
            "articleBody": article.content.intro,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://laranamebel.ru/blog/${article.slug}`
            },
            "keywords": article.tags.join(", ")
          })}
        </script>

        {article.content.faq && article.content.faq.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": article.content.faq.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })}
          </script>
        )}

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
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": article.title,
                "item": `https://laranamebel.ru/blog/${article.slug}`
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          <article className="container mx-auto px-4 py-12 max-w-4xl">
            <nav className="mb-6 text-sm text-muted-foreground">
              <a href="/" className="hover:text-foreground">Главная</a>
              <Icon name="ChevronRight" size={14} className="inline mx-2" />
              <a href="/blog" className="hover:text-foreground">Блог</a>
              <Icon name="ChevronRight" size={14} className="inline mx-2" />
              <span className="text-foreground">{article.title}</span>
            </nav>

            <div className="mb-6 flex flex-wrap items-center gap-4">
              <Badge variant="secondary">{article.category}</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon name="Calendar" size={16} />
                {new Date(article.date).toLocaleDateString('ru-RU')}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon name="Clock" size={16} />
                {article.readTime}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.content.h1}</h1>

            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
            />

            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl text-muted-foreground mb-8">
                {article.content.intro}
              </p>

              {article.content.sections.map((section, idx) => (
                <div key={idx} className="mb-12">
                  <h2 className="text-3xl font-bold mb-4">{section.h2}</h2>
                  <div 
                    className="mb-6" 
                    dangerouslySetInnerHTML={{ __html: section.content.replace(/\n\n/g, '</p><p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                  />

                  {section.subsections?.map((subsection, subIdx) => (
                    <div key={subIdx} className="mb-8 ml-4">
                      <h3 className="text-2xl font-semibold mb-3">{subsection.h3}</h3>
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: subsection.content
                            .replace(/\n\n/g, '</p><p>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br/>')
                        }} 
                      />
                    </div>
                  ))}
                </div>
              ))}

              {article.content.faq && article.content.faq.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6">Часто задаваемые вопросы</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {article.content.faq.map((faq, idx) => (
                      <AccordionItem key={idx} value={`faq-${idx}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>

            <Card className="bg-primary text-primary-foreground mt-12">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">
                      {article.content.cta.title}
                    </h3>
                    <p className="opacity-90">
                      {article.content.cta.description}
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    variant="secondary"
                    onClick={handleConsultation}
                  >
                    {article.content.cta.buttonText}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline">#{tag}</Badge>
                ))}
              </div>
            </div>
          </article>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default BlogArticle;