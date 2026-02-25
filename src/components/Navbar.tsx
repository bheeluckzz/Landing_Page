import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed w-full z-50 bg-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          tech<span className="text-primary">gear</span>
        </h1>

        <nav className="hidden md:flex gap-8 text-sm">
          <a href="#home" className="hover:text-primary">Home</a>
          <a href="#products" className="hover:text-primary">Products</a>
          <a href="#services" className="hover:text-primary">Services</a>
          <a href="#members" className="hover:text-primary">Members</a>
          <a href="#contacts" className="hover:text-primary">Contacts</a>
        </nav>

        <button className="border border-primary px-4 py-2 rounded hover:bg-blue-400 hover:text-black transition" 
        onClick={() => navigate('/login')}>
          Sign In
        </button>
      </div>
    </header>
  );
};

export default Navbar;