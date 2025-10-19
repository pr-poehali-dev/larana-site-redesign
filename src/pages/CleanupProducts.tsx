import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cleanupProductsByArticle } from '@/utils/cleanupProducts';
import Icon from '@/components/ui/icon';

const CleanupProducts = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ removed: number; remaining: number } | null>(null);

  const handleCleanup = () => {
    setIsRunning(true);
    setResult(null);
    
    setTimeout(() => {
      const cleanupResult = cleanupProductsByArticle();
      setResult(cleanupResult);
      setIsRunning(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Trash2" size={24} />
              Очистка товаров по артикулам
            </CardTitle>
            <CardDescription>
              Удаление 96 товаров с указанными артикулами поставщика
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Icon name="Info" size={16} />
              <AlertDescription>
                Эта операция удалит все товары с артикулами из списка (Ц0084746, Ц0084980, и т.д.).
                Изменения сохранятся в localStorage.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleCleanup} 
              disabled={isRunning}
              className="w-full"
              size="lg"
              variant="destructive"
            >
              {isRunning ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                  Очистка выполняется...
                </>
              ) : (
                <>
                  <Icon name="Trash2" className="mr-2" size={16} />
                  Запустить очистку
                </>
              )}
            </Button>

            {result && (
              <Alert className={result.removed > 0 ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}>
                <Icon name={result.removed > 0 ? 'CheckCircle' : 'Info'} size={16} />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">Результаты очистки:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>🗑️ Удалено: {result.removed}</li>
                      <li>✅ Осталось: {result.remaining}</li>
                    </ul>
                    {result.removed === 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Товары с указанными артикулами не найдены
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {result && result.removed > 0 && (
              <Alert className="bg-blue-50 border-blue-200">
                <Icon name="Info" size={16} />
                <AlertDescription>
                  <p className="text-sm">
                    ✅ Товары удалены! Обновите страницу каталога или админки, чтобы увидеть изменения.
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CleanupProducts;
