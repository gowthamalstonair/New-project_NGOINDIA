import { useState, useCallback } from 'react';

export function useChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    toggleChatbot
  };
}