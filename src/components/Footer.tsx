import Icon from '@/components/ui/icon';
import { handleSmoothNavigation } from '@/utils/smoothScroll';

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
              <li>
                <a 
                  href="/#catalog" 
                  onClick={(e) => { e.preventDefault(); handleSmoothNavigation('/#catalog'); }}
                  className="hover:opacity-100 cursor-pointer"
                >
                  Гостиные
                </a>
              </li>
              <li>
                <a 
                  href="/#catalog" 
                  onClick={(e) => { e.preventDefault(); handleSmoothNavigation('/#catalog'); }}
                  className="hover:opacity-100 cursor-pointer"
                >
                  Спальни
                </a>
              </li>
              <li>
                <a 
                  href="/#catalog" 
                  onClick={(e) => { e.preventDefault(); handleSmoothNavigation('/#catalog'); }}
                  className="hover:opacity-100 cursor-pointer"
                >
                  Кухни
                </a>
              </li>
              <li>
                <a 
                  href="/#catalog" 
                  onClick={(e) => { e.preventDefault(); handleSmoothNavigation('/#catalog'); }}
                  className="hover:opacity-100 cursor-pointer"
                >
                  Прихожие
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Компания</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="/" className="hover:opacity-100">О нас</a></li>
              <li><a href="/faq" className="hover:opacity-100">FAQ</a></li>
              <li>
                <a 
                  href="/#configurator" 
                  onClick={(e) => { e.preventDefault(); handleSmoothNavigation('/#configurator'); }}
                  className="hover:opacity-100 cursor-pointer"
                >
                  Конфигуратор
                </a>
              </li>
              <li><a href="/contacts" className="hover:opacity-100">Контакты</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li>
                <a href="tel:+73433511912" className="hover:opacity-100 flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (343) 351-19-12
                </a>
              </li>
              <li>
                <a href="mailto:zakaz@larana.market" className="hover:opacity-100 flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  zakaz@larana.market
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="MapPin" size={16} className="flex-shrink-0 mt-0.5" />
                <span>г. Екатеринбург, ул. Крупносортщиков, 14, офис 102</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Clock" size={16} className="flex-shrink-0 mt-0.5" />
                <div>
                  <div>Пн-Пт: 09:00–21:00</div>
                  <div>Сб: 10:00–17:00</div>
                  <div>Вс: выходной</div>
                </div>
              </li>
              <li className="pt-2">
                <a 
                  href="https://vk.com/larana96" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-100 inline-flex items-center gap-2"
                >
                  <Icon name="Share2" size={16} />
                  ВКонтакте
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm opacity-80">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <p>© 2024 LARANA. Все права защищены.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="/privacy-policy" className="hover:opacity-100 underline">
                Политика конфиденциальности
              </a>
              <a href="/terms-of-service" className="hover:opacity-100 underline">
                Пользовательское соглашение
              </a>
              <a href="/oferta" className="hover:opacity-100 underline">
                Договор-оферта
              </a>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => window.location.href = '/employee'}
              className="text-background/80 hover:text-background underline text-sm flex items-center gap-2 mx-auto"
            >
              <Icon name="UserCog" size={16} />
              Для сотрудников
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;