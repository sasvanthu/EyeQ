import { useState, useRef, useEffect } from 'react';

const GlareHover = ({
  width = '500px',
  height = '500px',
  background = '#000',
  borderRadius = '10px',
  borderColor = '#333',
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = '',
  style = {}
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: -100, y: -100 });
  const containerRef = useRef(null);

  const hex = glareColor.replace('#', '');
  let rgba = glareColor;
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setGlarePosition({ x, y });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setGlarePosition({ x: -100, y: -100 });
  };

  const vars = {
    '--gh-width': width,
    '--gh-height': height,
    '--gh-bg': background,
    '--gh-br': borderRadius,
    '--gh-angle': `${glareAngle}deg`,
    '--gh-duration': `${transitionDuration}ms`,
    '--gh-size': `${glareSize}%`,
    '--gh-rgba': rgba,
    '--gh-border': borderColor
  };

  return (
    <div
      ref={containerRef}
      className={`glare-hover ${playOnce ? 'glare-hover--play-once' : ''} ${className}`}
      style={{ 
        ...vars, 
        ...style,
        width: 'var(--gh-width)',
        height: 'var(--gh-height)',
        background: 'var(--gh-bg)',
        borderRadius: 'var(--gh-br)',
        border: '1px solid var(--gh-border)',
        overflow: 'hidden',
        position: 'relative',
        display: 'grid',
        placeItems: 'center'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
      {/* Glare effect using JSX */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isHovered ? `linear-gradient(
            ${glareAngle}deg,
            rgba(0, 0, 0, 0) 60%,
            ${rgba} 70%,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0) 100%
          )` : 'transparent',
          backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: isHovered ? 
            `${glarePosition.x}% ${glarePosition.y}%, 0 0` : 
            '-100% -100%, 0 0',
          transition: playOnce && !isHovered ? 'none' : `all ${transitionDuration}ms ease`,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default GlareHover;