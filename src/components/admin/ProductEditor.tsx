import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import ProductBasicFields from './ProductBasicFields';
import ProductImageGallery from './ProductImageGallery';
import ProductAdminFields from './ProductAdminFields';

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
    images: [] as string[],
    items: '',
    style: '',
    description: '',
    colors: '',
    inStock: true,
    supplierArticle: '',
    stockQuantity: null as number | null,
    variantGroupId: '',
    colorVariant: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔄 ProductEditor: useEffect сработал, product.id:', product?.id);
    if (product.title) {
      console.log('📋 Загрузка формы с данными товара:', {
        variantGroupId: product.variantGroupId,
        colorVariant: product.colorVariant
      });
      setProductForm({
        title: product.title,
        category: product.category,
        price: product.price,
        image: product.image,
        images: product.images || [product.image],
        items: Array.isArray(product.items) ? product.items.join(', ') : product.items || '',
        style: product.style,
        description: product.description,
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : product.colors || '',
        inStock: product.inStock,
        supplierArticle: product.supplierArticle || '',
        stockQuantity: product.stockQuantity || null,
        variantGroupId: product.variantGroupId || '',
        colorVariant: product.colorVariant || ''
      });
    } else {
      console.log('📋 Создание новой формы (пустой товар)');
      setProductForm({
        title: '',
        category: '',
        price: '',
        image: '',
        images: [],
        items: '',
        style: '',
        description: '',
        colors: '',
        inStock: true,
        supplierArticle: '',
        stockQuantity: null,
        variantGroupId: '',
        colorVariant: ''
      });
    }
  }, [product.id]);

  const handleFieldChange = (field: string, value: string) => {
    console.log(`📝 ProductEditor: Изменение поля "${field}" на значение:`, value);
    setProductForm((prevForm) => {
      const newForm = { ...prevForm, [field]: value };
      console.log('📝 Новое состояние формы:', {
        variantGroupId: newForm.variantGroupId,
        colorVariant: newForm.colorVariant
      });
      return newForm;
    });
  };

  const handleImagesChange = (images: string[], mainImage: string) => {
    setProductForm((prevForm) => ({ ...prevForm, images, image: mainImage }));
  };

  const saveProduct = () => {
    if (!product) return;

    const updatedProduct = {
      ...product,
      title: productForm.title,
      category: productForm.category,
      price: productForm.price,
      image: productForm.image,
      images: productForm.images,
      items: productForm.items.split(',').map(item => item.trim()),
      style: productForm.style,
      description: productForm.description,
      colors: productForm.colors.split(',').map(color => color.trim()),
      inStock: productForm.inStock,
      supplierArticle: productForm.supplierArticle,
      stockQuantity: productForm.stockQuantity,
      variantGroupId: productForm.variantGroupId || undefined,
      colorVariant: productForm.colorVariant || undefined
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
      images: productForm.images,
      items: productForm.items.split(',').map(item => item.trim()),
      style: productForm.style,
      description: productForm.description,
      colors: productForm.colors.split(',').map(color => color.trim()),
      inStock: productForm.inStock,
      supplierArticle: productForm.supplierArticle,
      stockQuantity: productForm.stockQuantity,
      variantGroupId: productForm.variantGroupId || undefined,
      colorVariant: productForm.colorVariant || undefined
    };

    onProductUpdate([...products, newProduct]);
    setProductForm({
      title: '',
      category: '',
      price: '',
      image: '',
      images: [],
      items: '',
      style: '',
      description: '',
      colors: '',
      inStock: true,
      supplierArticle: '',
      stockQuantity: null,
      variantGroupId: '',
      colorVariant: ''
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

  const isCopy = product.id === null && productForm.title.includes('(копия)');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {product.id ? 'Редактировать товар' : isCopy ? '📋 Создание копии товара' : 'Новый товар'}
        </h3>
      </div>

      {isCopy && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3 rounded-lg text-sm">
          <p className="font-semibold mb-2 flex items-center gap-2 text-green-900 dark:text-green-100">
            <Icon name="Copy" size={16} />
            Копия товара создана!
          </p>
          <p className="text-xs text-green-800 dark:text-green-200 mb-2">
            Для создания цветового варианта:
          </p>
          <ul className="text-xs space-y-1 ml-4 text-green-800 dark:text-green-200">
            <li>1. Измените название (уберите "(копия)")</li>
            <li>2. Укажите новый артикул поставщика</li>
            <li>3. Обновите цвет варианта (например: "Серый матовый")</li>
            <li>4. Загрузите фото нового цвета</li>
            <li>5. Скорректируйте цену и остатки</li>
          </ul>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm">
        <p className="font-semibold mb-1 flex items-center gap-2">
          <Icon name="Info" size={16} />
          Влияние на фильтры каталога:
        </p>
        <ul className="text-xs space-y-1 ml-6">
          <li>• <strong>Категория</strong> — определяет раздел каталога</li>
          <li>• <strong>Стиль</strong> — фильтр "Стиль" в каталоге</li>
          <li>• <strong>Цвета</strong> — фильтр "Цвет" (Белый, Венге, Дуб, Серый и т.д.)</li>
          <li>• <strong>Состав</strong> — фильтр по размерам/ширине (указывайте размеры в см)</li>
          <li>• <strong>В наличии</strong> — фильтр "Только в наличии"</li>
        </ul>
      </div>

      <div className="space-y-3">
        <ProductBasicFields
          formData={{
            title: productForm.title,
            category: productForm.category,
            price: productForm.price,
            style: productForm.style,
            items: productForm.items,
            colors: productForm.colors,
            description: productForm.description
          }}
          onChange={handleFieldChange}
        />

        <ProductImageGallery
          images={productForm.images}
          mainImage={productForm.image}
          onImagesChange={handleImagesChange}
        />

        <ProductAdminFields
          supplierArticle={productForm.supplierArticle}
          stockQuantity={productForm.stockQuantity}
          inStock={productForm.inStock}
          onSupplierArticleChange={(value) => setProductForm({ ...productForm, supplierArticle: value })}
          onStockQuantityChange={(value) => setProductForm({ ...productForm, stockQuantity: value })}
          onInStockChange={(value) => setProductForm({ ...productForm, inStock: value })}
        />
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
            Добавить товар
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductEditor;