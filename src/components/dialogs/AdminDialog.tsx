import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import OrdersTab from '@/components/admin/OrdersTab';
import ProductsTab from '@/components/admin/ProductsTab';
import StatsTab from '@/components/admin/StatsTab';

interface AdminDialogProps {
  open: boolean;
  onClose: () => void;
  products: any[];
  onProductUpdate: (products: any[]) => void;
}

const AdminDialog = ({ open, onClose, products, onProductUpdate }: AdminDialogProps) => {
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">
              <Icon name="ShoppingBag" size={16} className="mr-2" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="products">
              <Icon name="Package" size={16} className="mr-2" />
              Товары
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Статистика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="products" className="mt-4">
            <ProductsTab 
              products={products}
              onProductUpdate={onProductUpdate}
            />
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <StatsTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDialog;