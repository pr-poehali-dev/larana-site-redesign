import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AdminDialogProps {
  open: boolean;
  onClose: () => void;
  products: any[];
  onProductUpdate: (products: any[]) => void;
}

const AdminDialog = ({ open, onClose, products, onProductUpdate }: AdminDialogProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: '',
    price: '',
    image: '',
    items: '',
    style: '',
    description: '',
    colors: '',
    inStock: true
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchAllOrders();
    }
  }, [open]);

  const fetchAllOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch('https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заказы",
        variant: "destructive"
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/f363b242-7b94-4530-a6e9-e75c166d29e0', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        toast({
          title: "Статус обновлен",
          description: `Заказ #${orderId} обновлен`
        });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Новый', variant: 'default' },
      processing: { label: 'В обработке', variant: 'secondary' },
      completed: { label: 'Выполнен', variant: 'outline' },
      cancelled: { label: 'Отменен', variant: 'destructive' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  const startEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      category: product.category,
      price: product.price,
      image: product.image,
      items: product.items.join(', '),
      style: product.style,
      description: product.description,
      colors: product.colors.join(', '),
      inStock: product.inStock
    });
  };

  const saveProduct = () => {
    if (!editingProduct) return;

    const updatedProduct = {
      ...editingProduct,
      title: productForm.title,
      category: productForm.category,
      price: productForm.price,
      image: productForm.image,
      items: productForm.items.split(',').map(item => item.trim()),
      style: productForm.style,
      description: productForm.description,
      colors: productForm.colors.split(',').map(color => color.trim()),
      inStock: productForm.inStock
    };

    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? updatedProduct : p
    );

    onProductUpdate(updatedProducts);
    setEditingProduct(null);
    toast({
      title: "Товар обновлен",
      description: "Изменения сохранены успешно"
    });
  };

  const addNewProduct = () => {
    const newProduct = {
      id: Math.max(...products.map(p => p.id)) + 1,
      title: productForm.title,
      category: productForm.category,
      price: productForm.price,
      image: productForm.image,
      items: productForm.items.split(',').map(item => item.trim()),
      style: productForm.style,
      description: productForm.description,
      colors: productForm.colors.split(',').map(color => color.trim()),
      inStock: productForm.inStock
    };

    onProductUpdate([...products, newProduct]);
    setProductForm({
      title: '',
      category: '',
      price: '',
      image: '',
      items: '',
      style: '',
      description: '',
      colors: '',
      inStock: true
    });
    toast({
      title: "Товар добавлен",
      description: "Новый товар успешно создан"
    });
  };

  const deleteProduct = (productId: number) => {
    if (confirm('Удалить этот товар?')) {
      onProductUpdate(products.filter(p => p.id !== productId));
      setEditingProduct(null);
      toast({
        title: "Товар удален",
        description: "Товар удален из каталога"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="Shield" size={24} />
            Панель администратора
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">
              <Icon name="ShoppingBag" size={16} className="mr-2" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="products">
              <Icon name="Package" size={16} className="mr-2" />
              Товары
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Все заказы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все заказы</SelectItem>
                    <SelectItem value="pending">Новые</SelectItem>
                    <SelectItem value="processing">В обработке</SelectItem>
                    <SelectItem value="completed">Выполненные</SelectItem>
                    <SelectItem value="cancelled">Отмененные</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={fetchAllOrders}>
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Обновить
                </Button>
                <div className="ml-auto text-sm text-muted-foreground">
                  Всего заказов: {filteredOrders.length}
                </div>
              </div>

              <ScrollArea className="h-[500px] pr-4">
                {loadingOrders ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Загрузка заказов...</div>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Icon name="ShoppingBag" size={48} className="text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Нет заказов</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => (
                      <Card key={order.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">
                                Заказ #{order.id}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(order.status)}
                              <p className="text-lg font-bold">{order.totalAmount} ₽</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Клиент</p>
                                <p className="font-medium">{order.fullName}</p>
                                <p className="text-muted-foreground">{order.email}</p>
                                <p className="text-muted-foreground">{order.phone}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Адрес доставки</p>
                                <p className="font-medium">{order.address}</p>
                                {order.deliveryDate && (
                                  <p className="text-muted-foreground mt-1">
                                    Дата доставки: {order.deliveryDate}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Товары:</p>
                              <div className="space-y-1">
                                {order.items.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between text-sm">
                                    <span>{item.title} x {item.quantity}</span>
                                    <span className="font-medium">{item.price * item.quantity} ₽</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {order.comment && (
                              <div className="pt-2 border-t">
                                <p className="text-sm text-muted-foreground">Комментарий:</p>
                                <p className="text-sm">{order.comment}</p>
                              </div>
                            )}

                            <div className="flex gap-2 pt-2">
                              <Select
                                value={order.status}
                                onValueChange={(value) => updateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Новый</SelectItem>
                                  <SelectItem value="processing">В обработке</SelectItem>
                                  <SelectItem value="completed">Выполнен</SelectItem>
                                  <SelectItem value="cancelled">Отменен</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Список товаров</h3>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setEditingProduct({ id: null });
                        setProductForm({
                          title: '',
                          category: '',
                          price: '',
                          image: '',
                          items: '',
                          style: '',
                          description: '',
                          colors: '',
                          inStock: true
                        });
                      }}
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить товар
                    </Button>
                  </div>
                  {products.map((product) => (
                    <Card 
                      key={product.id}
                      className={`cursor-pointer transition-colors ${
                        editingProduct?.id === product.id ? 'border-primary' : ''
                      }`}
                      onClick={() => startEditProduct(product)}
                    >
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product.title}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                            <p className="text-sm font-semibold mt-1">{product.price}</p>
                          </div>
                          <Badge variant={product.inStock ? 'default' : 'secondary'}>
                            {product.inStock ? 'В наличии' : 'Нет'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              <ScrollArea className="h-[500px] pr-4">
                {editingProduct ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold">
                      {editingProduct.id ? 'Редактировать товар' : 'Новый товар'}
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <Label>Название</Label>
                        <Input
                          value={productForm.title}
                          onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                          placeholder="Название товара"
                        />
                      </div>

                      <div>
                        <Label>Категория</Label>
                        <Select
                          value={productForm.category}
                          onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Спальня">Спальня</SelectItem>
                            <SelectItem value="Гостиная">Гостиная</SelectItem>
                            <SelectItem value="Кухня">Кухня</SelectItem>
                            <SelectItem value="Детская">Детская</SelectItem>
                            <SelectItem value="Прихожая">Прихожая</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Цена</Label>
                        <Input
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          placeholder="38900 ₽"
                        />
                      </div>

                      <div>
                        <Label>Стиль</Label>
                        <Select
                          value={productForm.style}
                          onValueChange={(value) => setProductForm({ ...productForm, style: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите стиль" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Скандинавский">Скандинавский</SelectItem>
                            <SelectItem value="Минимализм">Минимализм</SelectItem>
                            <SelectItem value="Классика">Классика</SelectItem>
                            <SelectItem value="Лофт">Лофт</SelectItem>
                            <SelectItem value="Модерн">Модерн</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>URL изображения</Label>
                        <Input
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>

                      <div>
                        <Label>Состав (через запятую)</Label>
                        <Input
                          value={productForm.items}
                          onChange={(e) => setProductForm({ ...productForm, items: e.target.value })}
                          placeholder="Кровать 160, Шкаф 2Д, Тумбы"
                        />
                      </div>

                      <div>
                        <Label>Цвета (через запятую)</Label>
                        <Input
                          value={productForm.colors}
                          onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                          placeholder="Белый, Серый, Дуб"
                        />
                      </div>

                      <div>
                        <Label>Описание</Label>
                        <Textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          placeholder="Описание товара"
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="inStock"
                          checked={productForm.inStock}
                          onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="inStock">В наличии</Label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      {editingProduct.id ? (
                        <>
                          <Button onClick={saveProduct} className="flex-1">
                            <Icon name="Save" size={16} className="mr-2" />
                            Сохранить
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => deleteProduct(editingProduct.id)}
                          >
                            <Icon name="Trash2" size={16} className="mr-2" />
                            Удалить
                          </Button>
                        </>
                      ) : (
                        <Button onClick={addNewProduct} className="flex-1">
                          <Icon name="Plus" size={16} className="mr-2" />
                          Создать товар
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingProduct(null)}
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Icon name="Package" size={48} className="mb-4" />
                    <p>Выберите товар для редактирования</p>
                    <p className="text-sm">или создайте новый</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDialog;
