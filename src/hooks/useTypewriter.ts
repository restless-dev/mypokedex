import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 30) => {
  const [displayedText, setDisplayedText] = useState('');
  const [prevText, setPrevText] = useState(text);

  if (text !== prevText) {
    setPrevText(text);
    setDisplayedText('');
  }

  useEffect(() => {
    if (!text) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(text.substring(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayedText;
};
