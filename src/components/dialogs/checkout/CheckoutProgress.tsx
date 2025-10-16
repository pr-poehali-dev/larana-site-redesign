import Icon from '@/components/ui/icon';

interface CheckoutProgressProps {
  step: number;
  progress: number;
  swipeHintVisible: boolean;
}

const CheckoutProgress = ({ step, progress, swipeHintVisible }: CheckoutProgressProps) => {
  return (
    <div className="mb-4 px-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground">
          Заполнено полей
        </span>
        <span className="text-xs sm:text-sm font-bold text-primary">
          {progress}%
        </span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
      {progress === 100 && (
        <p className="text-xs text-green-600 mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-300">
          <Icon name="CheckCircle2" size={14} />
          Все поля заполнены!
        </p>
      )}
      <div className="flex items-center justify-between mt-4 mb-2">
        {[
          { num: 1, label: 'Контакты' },
          { num: 2, label: 'Доставка' },
          { num: 3, label: 'Подтверждение' }
        ].map((s) => (
          <div 
            key={s.num} 
            className={`flex items-center gap-2 transition-all duration-300 ${
              s.num === step ? 'scale-110' : 'opacity-60'
            }`}
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
              s.num <= step 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {s.num}
            </div>
            <span className={`hidden sm:block text-xs font-medium transition-colors duration-300 ${
              s.num === step ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`flex-1 h-1 rounded-full transition-all duration-500 ${
              s <= step ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>
      
      {swipeHintVisible && (
        <div className="sm:hidden flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Icon name="ChevronsLeft" size={14} className="animate-pulse" />
          <span>Свайпайте для переключения шагов</span>
          <Icon name="ChevronsRight" size={14} className="animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default CheckoutProgress;
