import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Здравствуйте! 👋 Я помогу вам подобрать идеальную мебель для вашего дома. Что вас интересует?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/1fc53931-02b0-492a-9dd0-b0cd7f227b51', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      
      if (data.message) {
        setMessages([...updatedMessages, { role: 'assistant', content: data.message }]);
      } else {
        throw new Error('No message in response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: 'Извините, произошла ошибка. Пожалуйста, попробуйте позже или позвоните нам: +7 (343) 290-40-54'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    '🛋️ Показать кухни',
    '🛏️ Показать спальни',
    '💰 Какие условия рассрочки?',
    '🚚 Как работает доставка?'
  ];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform z-50 flex items-center gap-2"
          aria-label="Открыть чат с консультантом"
        >
          <Icon name="MessageCircle" size={24} />
          <span className="font-medium">Нужна помощь?</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => sendMessage(), 100);
                    }}
                    className="text-xs bg-white border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-2.5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите ваш вопрос..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-primary text-white p-2.5 rounded-full hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Отправить сообщение"
              >
                <Icon name="Send" size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
