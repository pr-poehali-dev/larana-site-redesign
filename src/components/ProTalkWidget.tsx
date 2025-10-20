import { useState } from 'react';
import Icon from '@/components/ui/icon';

const ProTalkWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform z-50 flex items-center gap-2"
          aria-label="Открыть ИИ-консультанта"
        >
          <Icon name="MessageCircle" size={24} />
          <span className="font-medium">Нужна помощь?</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
          <div className="bg-primary text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="Sparkles" size={20} />
              </div>
              <div>
                <h3 className="font-semibold">ИИ-консультант LARANA</h3>
                <p className="text-xs text-white/80">Всегда на связи</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition"
              aria-label="Закрыть чат"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          <iframe
            allow="microphone;autoplay"
            style={{ width: '100%', height: '100%', border: 'none' }}
            src="https://functions.pro-talk.ru/api/v1.0/chatgpt_widget_dialog_api?record_id=recE1kjNfOvPrfiXI&promt_id=41726&lang=ru&fullscreen=0&voice=1&file=1&circle=1"
            title="ИИ-консультант LARANA"
          />
        </div>
      )}
    </>
  );
};

export default ProTalkWidget;
