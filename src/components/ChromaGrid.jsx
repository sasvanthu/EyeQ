import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export const ChromaGrid = ({
  items,
  className = '',
  radius = 400,
  columns = 3,
  rows = 3,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo = [
    {
      image: 'https://i.pravatar.cc/300?img=8',
      title: 'Alex Rivera',
      subtitle: 'Full Stack Developer',
      handle: '@alexrivera',
      borderColor: '#8B5CF6', // Vibrant purple
      gradient: 'linear-gradient(145deg, #8B5CF6, #6366F1)',
      url: 'https://github.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=11',
      title: 'Jordan Chen',
      subtitle: 'DevOps Engineer',
      handle: '@jordanchen',
      borderColor: '#06B6D4', // Vibrant cyan
      gradient: 'linear-gradient(210deg, #06B6D4, #0EA5E9)',
      url: 'https://linkedin.com/in/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=3',
      title: 'Morgan Blake',
      subtitle: 'UI/UX Designer',
      handle: '@morganblake',
      borderColor: '#F59E0B', // Vibrant amber
      gradient: 'linear-gradient(165deg, #F59E0B, #F97316)',
      url: 'https://dribbble.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=16',
      title: 'Casey Park',
      subtitle: 'Data Scientist',
      handle: '@caseypark',
      borderColor: '#EC4899', // Vibrant pink
      gradient: 'linear-gradient(195deg, #EC4899, #F43F5E)',
      url: 'https://kaggle.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=25',
      title: 'Sam Kim',
      subtitle: 'Mobile Developer',
      handle: '@thesamkim',
      borderColor: '#10B981', // Vibrant emerald
      gradient: 'linear-gradient(225deg, #10B981, #059669)',
      url: 'https://github.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=60',
      title: 'Tyler Rodriguez',
      subtitle: 'Cloud Architect',
      handle: '@tylerrod',
      borderColor: '#6366F1', // Vibrant indigo
      gradient: 'linear-gradient(135deg, #6366F1, #4F46E5)',
      url: 'https://aws.amazon.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=32',
      title: 'Riley Smith',
      subtitle: 'AI Researcher',
      handle: '@rileysmith',
      borderColor: '#F43F5E', // Vibrant rose
      gradient: 'linear-gradient(150deg, #F43F5E, #E11D48)',
      url: 'https://research.google.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=45',
      title: 'Avery Johnson',
      subtitle: 'Cybersecurity',
      handle: '@averyj',
      borderColor: '#0EA5E9', // Vibrant sky
      gradient: 'linear-gradient(180deg, #0EA5E9, #0284C7)',
      url: 'https://cybersecurity.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=52',
      title: 'Quinn Williams',
      subtitle: 'Game Developer',
      handle: '@quinnw',
      borderColor: '#F97316', // Vibrant orange
      gradient: 'linear-gradient(160deg, #F97316, #EA580C)',
      url: 'https://unity.com/'
    }
  ];
  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = e => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true
    });
  };

  const handleCardClick = url => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardMove = e => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        '--r': `${radius}px`,
        '--cols': columns,
        '--rows': rows
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          style={{
            '--card-border': c.borderColor || 'transparent',
            '--card-gradient': c.gradient,
            cursor: c.url ? 'pointer' : 'default'
          }}
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className="handle">{c.handle}</span>}
            <p className="role">{c.subtitle}</p>
            {c.location && <span className="location">{c.location}</span>}
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
