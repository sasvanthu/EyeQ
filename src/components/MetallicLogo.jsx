import { useState, useEffect } from 'react';
import MetallicPaint, { parseLogoImage } from './MetallicPaint';

const MetallicLogo = ({ src, alt = "Logo", className = "" }) => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImage() {
      try {
        setLoading(true);
        const response = await fetch(src);
        const blob = await response.blob();
        const result = await parseLogoImage(blob);
        setImageData(result.imageData);
      } catch (error) {
        console.error('Error loading metallic logo:', error);
      } finally {
        setLoading(false);
      }
    }

    if (src) {
      loadImage();
    }
  }, [src]);

  if (loading) {
    return (
      <div className={className}>
        <img src={src} alt={alt} className="w-full h-full object-contain opacity-50" />
      </div>
    );
  }

  if (!imageData) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div className={className}>
      <MetallicPaint 
        imageData={imageData}
        params={{
          patternScale: 2,
          refraction: 0.015,
          edge: 1,
          patternBlur: 0.005,
          liquid: 0.07,
          speed: 0.3
        }}
      />
    </div>
  );
};

export default MetallicLogo;
