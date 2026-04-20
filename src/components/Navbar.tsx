import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token && !!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  const smoothScroll = (targetId: string) => {
    const element = document.querySelector(targetId) as HTMLElement;
    const navbarHeight = headerRef.current?.offsetHeight || 100;
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header ref={headerRef} className="fixed w-full z-50 bg-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 
          className="text-xl font-bold cursor-pointer hover:opacity-80 transition-all duration-500 ease-in-out"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          tech<span className="text-primary">gear</span>
        </h1>

        <nav className="hidden md:flex gap-8 text-sm">
          <button onClick={() => smoothScroll('#home')} className="hover:text-primary transition-colors duration-500 ease-in-out bg-transparent border-none cursor-pointer p-0 font-normal">Home</button>
          <button onClick={() => smoothScroll('#products')} className="hover:text-primary transition-colors duration-500 ease-in-out bg-transparent border-none cursor-pointer p-0 font-normal">Products</button>
          <button onClick={() => smoothScroll('#services')} className="hover:text-primary transition-colors duration-500 ease-in-out bg-transparent border-none cursor-pointer p-0 font-normal">Services</button>
          <button onClick={() => smoothScroll('#members')} className="hover:text-primary transition-colors duration-500 ease-in-out bg-transparent border-none cursor-pointer p-0 font-normal">Members</button>
          <button 
            onClick={() => navigate('/crud')} 
            className="hover:text-primary transition-colors duration-500 ease-in-out bg-transparent border-none cursor-pointer p-0 font-normal"
          >
            Add Cart
          </button>
          <button onClick={() => smoothScroll('#contacts')} className="hover:text-primary transition-colors duration-500 ease-in-out bg-transparent border-none cursor-pointer p-0 font-normal">Contacts</button>
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <button 
                onClick={() => navigate('/profile')}
                className="text-primary hover:text-primary-light text-sm font-semibold transition-all duration-500 ease-in-out hover:shadow-md bg-transparent border-none cursor-pointer p-0"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="border border-primary px-4 py-2 rounded hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-500 ease-in-out flex items-center gap-1 text-sm shadow-md hover:shadow-lg"
                title="Logout"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <button 
              className="border border-primary px-6 py-2 rounded hover:bg-primary hover:text-black font-semibold transition-all duration-500 ease-in-out text-sm uppercase tracking-wide shadow-md hover:shadow-lg" 
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

