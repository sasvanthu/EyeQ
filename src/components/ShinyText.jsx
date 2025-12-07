import { useEffect, useRef } from 'react';

const ShinyText = ({ 
  text, 
  speed = 1, 
  disabled = false,
  className = '',
  style = {}
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (disabled || !textRef.current) return;

    const element = textRef.current;
    const animationDuration = 2 / speed;
    
    // Create keyframes dynamically
    const keyframes = `
      @keyframes shine {
        0% {
          background-position: 200% center;
        }
        100% {
          background-position: -200% center;
        }
      }
    `;
    
    // Add keyframes to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    
    // Cleanup function
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [speed, disabled]);

  const combinedStyle = {
    fontFamily: "'Bebas Neue', sans-serif",
    position: 'relative',
    display: 'inline-block',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    animation: disabled ? 'none' : `shine ${2 / speed}s linear infinite`,
    background: disabled 
      ? '#ffffff' 
      : 'linear-gradient(90deg, #ffffff 0%, #ffffff 40%, #a78bfa 50%, #ffffff 60%, #ffffff 100%)',
    backgroundSize: '200% 100%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: disabled ? '#ffffff' : 'transparent',
    ...style
  };

  return (
    <span
      ref={textRef}
      className={`shiny-text ${className} ${disabled ? 'disabled' : ''}`}
      style={combinedStyle}
    >
      {text}
    </span>
  );
};

export default ShinyText;