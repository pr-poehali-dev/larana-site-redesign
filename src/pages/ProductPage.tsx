import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { useProductData } from '@/hooks/useProductData';
import { useCartLogic } from '@/hooks/useCartLogic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import CartDialog from '@/components/dialogs/CartDialog';

const ProductPage = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const navigate = useNavigate();
  const { allFurnitureSets } = useProductData();
  const { cartItems, handleAddToCart: addToCart, handleRemoveFromCart, handleUpdateQuantity } = useCartLogic();
  
  const product = allFurnitureSets.find(p => p.id === parseInt(id || '0'));
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setCartOpen(true);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/');
  };

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>{product.title} - купить в Москве | Lara Мебель</title>
        <meta name="description" content={`${product.title} - ${product.description}. Цена ${product.price}. ${product.inStock ? 'В наличии' : 'Под заказ'}.`} />
        <link rel="canonical" href={`https://larana-mebel.ru/catalog/${slug}/${id}`} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <nav className="mb-6 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li><Link to="/" className="hover:text-foreground">Главная</Link></li>
                <li><Icon name="ChevronRight" size={14} /></li>
                <li><Link to="/catalog" className="hover:text-foreground">Каталог</Link></li>
                <li><Icon name="ChevronRight" size={14} /></li>
                <li><Link to={`/catalog/${slug}`} className="hover:text-foreground">{product.category}</Link></li>
                <li><Icon name="ChevronRight" size={14} /></li>
                <li className="text-foreground">{product.title}</li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary/20 mb-4">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
                  {product.inStock ? (
                    <Badge className="bg-green-500 text-white mb-4">
                      <Icon name="Check" size={16} className="mr-1" />
                      В наличии
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="mb-4">
                      Под заказ
                    </Badge>
                  )}
                </div>

                <div className="border-t border-b py-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {product.price}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Цена за полный комплект
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Выберите цвет:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        onClick={() => setSelectedColor(color)}
                        className="min-w-[120px]"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Количество:</h3>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Icon name="Minus" size={16} />
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button size="lg" className="flex-1" onClick={handleBuyNow}>
                    Купить сейчас
                  </Button>
                  <Button size="lg" variant="outline" className="flex-1" onClick={handleAddToCart}>
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    В корзину
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Icon name="Truck" size={24} className="text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Бесплатная доставка</h4>
                        <p className="text-sm text-muted-foreground">По Москве и области при заказе от 30 000 ₽</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="Wrench" size={24} className="text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Сборка под ключ</h4>
                        <p className="text-sm text-muted-foreground">Профессиональная сборка за 1 день</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="Shield" size={24} className="text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Гарантия 2 года</h4>
                        <p className="text-sm text-muted-foreground">На всю мебель и фурнитуру</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <Card className="lg:col-span-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Описание</h2>
                  <p className="text-muted-foreground mb-6">{product.description}</p>
                  
                  <h3 className="font-semibold text-lg mb-3">Состав комплекта:</h3>
                  <ul className="space-y-2">
                    {product.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Icon name="Check" size={16} className="text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Характеристики</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-muted-foreground">Категория</dt>
                      <dd className="font-semibold">{product.category}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Стиль</dt>
                      <dd className="font-semibold">{product.style}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Доступные цвета</dt>
                      <dd className="font-semibold">{product.colors.join(', ')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Наличие</dt>
                      <dd className="font-semibold">
                        {product.inStock ? 'В наличии' : 'Под заказ (7-14 дней)'}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
        <ScrollToTop />
      </div>

      <CartDialog
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
    </>
  );
};

export default ProductPage;