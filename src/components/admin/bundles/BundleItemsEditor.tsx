import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BundleItem {
  id?: number;
  supplier_article: string;
  product_name: string;
  quantity: number;
  in_stock?: boolean;
}

interface BundleItemsEditorProps {
  items: BundleItem[];
  products: any[];
  onUpdateItem: (index: number, field: keyof BundleItem, value: any) => void;
  onRemoveItem: (index: number) => void;
  onAddItem: () => void;
}

const BundleItemsEditor = ({ 
  items, 
  products, 
  onUpdateItem, 
  onRemoveItem, 
  onAddItem 
}: BundleItemsEditorProps) => {
  const [openPopover, setOpenPopover] = useState<number | null>(null);
  const [searchValues, setSearchValues] = useState<{ [key: number]: string }>({});

  const handleSelectProduct = (index: number, product: any) => {
    const supplierArticle = product.supplier_article || product.supplierArticle;
    onUpdateItem(index, 'supplier_article', supplierArticle);
    onUpdateItem(index, 'product_name', product.title);
    setOpenPopover(null);
    setSearchValues({ ...searchValues, [index]: '' });
  };

  const filterProducts = (search: string) => {
    if (!search) return products.slice(0, 50);
    
    const searchLower = search.toLowerCase();
    return products
      .filter(p => {
        const article = p.supplier_article || p.supplierArticle || '';
        const title = p.title || '';
        return article.toLowerCase().includes(searchLower) ||
               title.toLowerCase().includes(searchLower);
      })
      .slice(0, 50);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Состав набора</CardTitle>
          <Button onClick={onAddItem} size="sm">
            <Icon name="Plus" className="mr-2" size={16} />
            Добавить товар
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Package" className="mx-auto mb-2" size={48} />
            <p>Добавьте товары в набор</p>
          </div>
        ) : (
          items.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4 space-y-2">
                  <Label>Артикул поставщика</Label>
                  <div className="flex gap-2">
                    <Popover open={openPopover === index} onOpenChange={(open) => setOpenPopover(open ? index : null)}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="flex-1 justify-between font-normal"
                        >
                          <span className="truncate">{item.supplier_article || "Выбрать из списка..."}</span>
                          <Icon name="Search" className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder="Поиск по артикулу или названию..." 
                            value={searchValues[index] || ''}
                            onValueChange={(value) => setSearchValues({ ...searchValues, [index]: value })}
                          />
                          <CommandEmpty>Товары не найдены</CommandEmpty>
                          <CommandGroup className="max-h-[300px] overflow-auto">
                            {filterProducts(searchValues[index] || '').map((product) => {
                              const article = product.supplier_article || product.supplierArticle || '';
                              return (
                                <CommandItem
                                  key={article || product.id}
                                  value={`${article} ${product.title}`}
                                  onSelect={() => handleSelectProduct(index, product)}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{article}</span>
                                    <span className="text-xs text-muted-foreground truncate">{product.title}</span>
                                  </div>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Input
                    value={item.supplier_article}
                    onChange={(e) => {
                      onUpdateItem(index, 'supplier_article', e.target.value);
                      const product = products.find(p => 
                        (p.supplier_article || p.supplierArticle) === e.target.value
                      );
                      if (product) {
                        onUpdateItem(index, 'product_name', product.title);
                      }
                    }}
                    placeholder="Или введите артикул вручную"
                    className="text-sm"
                  />
                </div>

                <div className="md:col-span-4">
                  <Label>Название товара</Label>
                  <Input
                    value={item.product_name}
                    onChange={(e) => onUpdateItem(index, 'product_name', e.target.value)}
                    placeholder="Автоматически из артикула"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Количество</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(index, 'quantity', parseInt(e.target.value))}
                  />
                </div>

                <div className="md:col-span-2 flex gap-2">
                  {item.in_stock === false && (
                    <Badge variant="destructive" className="h-fit">
                      Нет в наличии
                    </Badge>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onRemoveItem(index)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default BundleItemsEditor;