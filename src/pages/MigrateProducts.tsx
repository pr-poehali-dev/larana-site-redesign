import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { migrateProductsToDatabase } from '@/utils/migrateProducts';
import Icon from '@/components/ui/icon';

const MigrateProducts = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);
  const [autoMigrated, setAutoMigrated] = useState(false);
  const [localStorageCount, setLocalStorageCount] = useState(0);

  const handleMigrate = async () => {
    setIsRunning(true);
    setResult(null);
    
    try {
      const migrationResult = await migrateProductsToDatabase();
      setResult(migrationResult);
    } catch (error) {
      console.error('Migration error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    const checkLocalStorage = () => {
      const saved = localStorage.getItem('larana-products') || 
                    localStorage.getItem('adminProducts') ||
                    localStorage.getItem('products');
      
      if (saved) {
        try {
          const products = JSON.parse(saved);
          setLocalStorageCount(products.length || 0);
          console.log(`📦 Обнаружено товаров в localStorage: ${products.length}`);
          
          if (!autoMigrated) {
            setAutoMigrated(true);
            handleMigrate();
          }
        } catch (e) {
          console.error('Ошибка парсинга localStorage:', e);
        }
      }
    };
    
    checkLocalStorage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Database" size={24} />
              Миграция товаров в PostgreSQL
            </CardTitle>
            <CardDescription>
              Перенос товаров из localStorage в базу данных
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Icon name="Info" size={16} />
              <AlertDescription>
                <div className="space-y-2">
                  <p>Эта операция создаст товары в базе данных из текущего localStorage.</p>
                  {localStorageCount > 0 && (
                    <p className="font-semibold text-green-700">
                      📦 Обнаружено товаров для миграции: {localStorageCount}
                    </p>
                  )}
                  {localStorageCount === 0 && (
                    <p className="font-semibold text-red-700">
                      ⚠️ Товары в localStorage не найдены
                    </p>
                  )}
                </div>
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleMigrate} 
              disabled={isRunning}
              className="w-full"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                  Миграция выполняется...
                </>
              ) : (
                <>
                  <Icon name="Upload" className="mr-2" size={16} />
                  Запустить миграцию
                </>
              )}
            </Button>

            {result && (
              <Alert className={result.failed === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}>
                <Icon name={result.failed === 0 ? 'CheckCircle' : 'AlertCircle'} size={16} />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">Результаты миграции:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>✅ Успешно: {result.success}</li>
                      <li>❌ Ошибок: {result.failed}</li>
                      <li>📦 Всего: {result.success + result.failed}</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MigrateProducts;