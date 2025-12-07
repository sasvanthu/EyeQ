import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-4",
        "bg-transparent",
        className
      )}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <div className="nav-button-container flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/20 bg-transparent backdrop-blur-md shadow-lg transition-all duration-300 hover:border-white/40 hover:shadow-xl">
          <Link to="home" smooth={true} duration={500}>
            <button className="nav-animated-button group cursor-target">
              <div className="nav-outline"></div>
              <div className="nav-button-content">
                <p className="nav-text">
                  <span style={{ '--i': 0 } as React.CSSProperties}>H</span>
                  <span style={{ '--i': 1 } as React.CSSProperties}>o</span>
                  <span style={{ '--i': 2 } as React.CSSProperties}>m</span>
                  <span style={{ '--i': 3 } as React.CSSProperties}>e</span>
                </p>
              </div>
            </button>
          </Link>
          <div className="w-px h-8 bg-white/20"></div>
          <Link to="about" smooth={true} duration={500}>
            <button className="nav-animated-button group cursor-target">
              <div className="nav-outline"></div>
              <div className="nav-button-content">
                <p className="nav-text">
                  <span style={{ '--i': 0 } as React.CSSProperties}>A</span>
                  <span style={{ '--i': 1 } as React.CSSProperties}>b</span>
                  <span style={{ '--i': 2 } as React.CSSProperties}>o</span>
                  <span style={{ '--i': 3 } as React.CSSProperties}>u</span>
                  <span style={{ '--i': 4 } as React.CSSProperties}>t</span>
                </p>
              </div>
            </button>
          </Link>
          <div className="w-px h-8 bg-white/20"></div>
          <Link to="contact" smooth={true} duration={500}>
            <button className="nav-animated-button group cursor-target">
              <div className="nav-outline"></div>
              <div className="nav-button-content">
                <p className="nav-text">
                  <span style={{ '--i': 0 } as React.CSSProperties}>C</span>
                  <span style={{ '--i': 1 } as React.CSSProperties}>o</span>
                  <span style={{ '--i': 2 } as React.CSSProperties}>n</span>
                  <span style={{ '--i': 3 } as React.CSSProperties}>t</span>
                  <span style={{ '--i': 4 } as React.CSSProperties}>a</span>
                  <span style={{ '--i': 5 } as React.CSSProperties}>c</span>
                  <span style={{ '--i': 6 } as React.CSSProperties}>t</span>
                </p>
              </div>
            </button>
          </Link>
        </div>

        <div className="md:hidden">
          <motion.button 
            className="text-foreground p-2 cursor-target"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button 
              className="absolute top-4 right-4 text-foreground p-2 cursor-target"
              onClick={() => setIsMobileMenuOpen(false)}
              whileTap={{ scale: 0.9 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
            
            <Link to="home" smooth={true} duration={500} onClick={handleNavClick}>
              <motion.button 
                className="text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-target"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Home
              </motion.button>
            </Link>
            <Link to="about" smooth={true} duration={500} onClick={handleNavClick}>
              <motion.button 
                className="text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-target"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                About
              </motion.button>
            </Link>
            <Link to="contact" smooth={true} duration={500} onClick={handleNavClick}>
              <motion.button 
                className="text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-target"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;