const StarBorder = ({
  as: Component = 'button',
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}) => {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px 0`,
        position: 'relative',
        display: 'inline-block',
        ...rest.style
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: `${thickness}px`,
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animation: `starBorderAnimation ${speed} linear infinite`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${thickness}px`,
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animation: `starBorderAnimation ${speed} linear infinite reverse`,
          animationDuration: speed
        }}
      ></div>
      <div 
        className="inner-content"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: `0 ${thickness}px`
        }}
      >
        {children}
      </div>
      
      {/* Add keyframes for animation */}
      <style>{`
        @keyframes starBorderAnimation {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </Component>
  );
};

export default StarBorder;