import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ProductEditorProps {
  product: any;
  products: any[];
  onProductUpdate: (products: any[]) => void;
  onClose: () => void;
}

const ProductEditor = ({ product, products, onProductUpdate, onClose }: ProductEditorProps) => {
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
    if (product.id) {
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
    } else {
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
    }
  }, [product]);

  const saveProduct = () => {
    if (!product) return;

    const updatedProduct = {
      ...product,
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
      p.id === product.id ? updatedProduct : p
    );

    onProductUpdate(updatedProducts);
    onClose();
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
      onClose();
      toast({
        title: "Товар удален",
        description: "Товар удален из каталога"
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">
        {product.id ? 'Редактировать товар' : 'Новый товар'}
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
        {product.id ? (
          <>
            <Button onClick={saveProduct} className="flex-1">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteProduct(product.id)}
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
          onClick={onClose}
        >
          Отмена
        </Button>
      </div>
    </div>
  );
};

export default ProductEditor;
