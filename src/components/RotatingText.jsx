import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RotatingText = ({
  texts = [],
  mainClassName = '',
  staggerFrom = 'first',
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  exit = { opacity: 0 },
  staggerDuration = 0.05,
  splitLevelClassName = '',
  transition = { duration: 0.3 },
  rotationInterval = 2000,
  ariaLabel = 'Rotating text'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (texts.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % texts.length);
    }, rotationInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [texts.length, rotationInterval]);

  const renderTextWithSplit = (text) => {
    // Split text into characters for animation
    const chars = text.split('');
    
    return (
      <motion.span 
        className="text-rotate-word"
        style={{
          display: 'inline-flex'
        }}
      >
        <AnimatePresence mode="popLayout">
          {chars.map((char, index) => {
            const isWordEnd = char === ' ';
            return (
              <motion.span
                key={`${char}-${index}`}
                className={`text-rotate-element ${splitLevelClassName} ${isWordEnd ? 'text-rotate-space' : ''}`}
                style={{
                  display: 'inline-block',
                  whiteSpace: isWordEnd ? 'pre' : 'normal'
                }}
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{
                  ...transition,
                  delay: staggerFrom === 'first' 
                    ? index * staggerDuration 
                    : (chars.length - 1 - index) * staggerDuration
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </motion.span>
    );
  };

  if (!texts.length) return null;

  return (
    <div 
      className={`text-rotate ${mainClassName}`}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        whiteSpace: 'pre-wrap',
        position: 'relative'
      }}
      role="region" 
      aria-label={ariaLabel}
    >
      <div 
        className="text-rotate-lines"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="text-rotate-line"
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
          >
            {renderTextWithSplit(texts[currentIndex])}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RotatingText;