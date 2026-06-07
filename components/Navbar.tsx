import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/rooms';
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled;
  
  const navClass = isTransparent 
    ? 'bg-transparent text-white py-6' 
    : 'bg-white/95 backdrop-blur-xl text-forest shadow-md py-4';
    
  const linkClass = isTransparent
    ? 'text-white hover:text-gold'
    : 'text-forest hover:text-gold';

  const logoClass = isTransparent ? 'text-white' : 'text-forest';
  
  const buttonClass = isTransparent 
    ? 'bg-white text-forest hover:bg-gold hover:text-white' 
    : 'bg-forest text-white hover:bg-gold';

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'The Retreat', path: '/rooms' },
    { name: 'Experiences', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav id="nav-header" className={`fixed w-full z-50 px-6 lg:px-16 transition-all duration-700 cubic-bezier(0.22, 1, 0.36, 1) ${navClass}`}>
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <Link id="nav-logo" to="/" className={`font-serif italic text-2xl md:text-3xl font-bold transition-colors tracking-tighter ${logoClass}`}>
            EcoGen Retreat
          </Link>

          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`text-[13px] font-extrabold uppercase tracking-[0.2em] transition-all opacity-90 hover:opacity-100 ${linkClass}`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/booking" 
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition shadow-2xl ${buttonClass}`}
            >
              Book Your Stay
            </Link>
          </div>

          <button className="lg:hidden p-2" onClick={toggleMenu}>
            <Menu className={`w-8 h-8 ${isTransparent ? 'text-white' : 'text-forest'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-[60] flex flex-col p-8 transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}>
        <div className="flex justify-between items-center mb-12">
          <span className="font-serif italic text-3xl font-bold text-forest">EcoGen Retreat</span>
          <button onClick={toggleMenu} className="w-14 h-14 rounded-full bg-forest text-white flex items-center justify-center hover:bg-forestDeep transition-all shadow-xl hover:scale-110 hover:rotate-90 group">
            <X className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <div className="flex flex-col space-y-6 text-2xl sm:text-3xl font-serif italic font-bold text-charcoal">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              onClick={toggleMenu}
              className="hover:text-gold transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <Link 
          to="/booking"
          onClick={toggleMenu}
          className="mt-auto w-full bg-forest text-white py-5 rounded-2xl font-black uppercase tracking-widest text-base shadow-xl hover:bg-forestDeep transition-colors text-center"
        >
          Book Your Stay
        </Link>
      </div>
    </>
  );
};

export default Navbar;