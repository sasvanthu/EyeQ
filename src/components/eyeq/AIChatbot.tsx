import React, { useEffect, useRef, useState } from 'react';
import GlassCard from './GlassCard';
import { Button } from '@/components/ui/button';

const languages = [
  'English', 'Tamil', 'Telugu', 'Malayalam', 'Hindi', 'Kannada'
];

const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ user: string; text: string }>>([{ user: 'EyeQ AI', text: 'Ask me anything about the club or programming!' }]);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState('English');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Setup speech recog if available
    const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = (e: any) => {
        setInput((prev) => prev + ' ' + e.results[0][0].transcript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const startVoice = () => {
    const r = recognitionRef.current;
    if (r) r.start();
  };

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { user: 'You', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [...m, { user: 'EyeQ AI', text: `I heard: ${input}. (Mock AI answers will be integrated)` }]);
    }, 1200);
  };

  return (
    <div>
      <GlassCard>
        <div className='flex items-center justify-between mb-2'>
          <div>
            <h4 className='text-lg font-semibold'>EyeQ AI Assistant</h4>
            <div className='text-sm text-muted-foreground'>Ask technical questions, get resource suggestions & more.</div>
          </div>
          <div className='flex items-center gap-2'>
            <select value={lang} onChange={(e) => setLang(e.target.value)} className='bg-transparent border p-2 rounded-md'>
              {languages.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <Button onClick={startVoice} variant='ghost'>Start Voice</Button>
          </div>
        </div>
        <div className='max-h-64 overflow-auto space-y-3 mb-3'>
          {messages.map((m, idx) => (
            <div key={idx} className='px-3 py-2 rounded-md bg-black/5'>
              <div className='text-xs text-muted-foreground'>{m.user}</div>
              <div className='text-sm'>{m.text}</div>
            </div>
          ))}
        </div>
        <div className='flex items-center gap-2'>
          <input className='flex-1 bg-transparent border p-2 rounded-md' value={input} onChange={(e) => setInput(e.target.value)} placeholder='Type your question...' />
          <Button onClick={send}>Send</Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default AIChatbot;
