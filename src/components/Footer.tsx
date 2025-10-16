import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img 
              src="https://cdn.poehali.dev/files/8e9a575f-fd1c-4d40-821a-4154a78e1d00.jpg" 
              alt="LARANA" 
              className="h-16 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm opacity-80">Готовые интерьеры под ключ</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Каталог</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100">Гостиные</a></li>
              <li><a href="#" className="hover:opacity-100">Спальни</a></li>
              <li><a href="#" className="hover:opacity-100">Кухни</a></li>
              <li><a href="#" className="hover:opacity-100">Прихожие</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Компания</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100">О нас</a></li>
              <li><a href="#" className="hover:opacity-100">Доставка</a></li>
              <li><a href="#" className="hover:opacity-100">Гарантия</a></li>
              <li><a href="#" className="hover:opacity-100">Контакты</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>+7 (800) 123-45-67</li>
              <li>info@larana.ru</li>
              <li className="flex gap-4 pt-4">
                <Icon name="Instagram" size={20} className="cursor-pointer hover:opacity-100" />
                <Icon name="Facebook" size={20} className="cursor-pointer hover:opacity-100" />
                <Icon name="Youtube" size={20} className="cursor-pointer hover:opacity-100" />
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm opacity-80">
          <p>© 2024 LARANA. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;