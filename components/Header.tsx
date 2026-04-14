import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext, CartContext, ThemeContext, ProductContext } from '../App';
import { CartIcon, UserIcon, SunIcon, MoonIcon, LogoutIcon, DashboardIcon, WishlistIcon, SearchIcon } from './Icons';
import type { Product } from '../types';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const { products } = useContext(ProductContext);
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.trim()) {
            const filtered = products
                .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 5);
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [query, products]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setSuggestions([]);
            navigate(`/products?q=${encodeURIComponent(query.trim())}`);
        }
    };
    
    const handleSuggestionClick = (productId: number) => {
        setQuery('');
        setSuggestions([]);
        navigate(`/products/${productId}`);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full max-w-xs ml-auto" ref={searchRef}>
            <form onSubmit={handleSearch}>
                <input 
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-4 pr-10 py-2 text-sm rounded-full bg-gray-100 dark:bg-secondary border border-gray-200 dark:border-gray-700 text-textDark dark:text-textLight focus:ring-2 focus:ring-accent focus:border-accent"
                />
                <button type="submit" className="absolute right-0 top-0 mt-1 mr-2 p-1.5 text-gray-500 dark:text-gray-400 hover:text-accent">
                    <SearchIcon className="w-5 h-5" />
                </button>
            </form>
            {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-secondary rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-30 overflow-hidden">
                    <ul>
                        {suggestions.map(product => (
                            <li key={product.id}>
                                <button 
                                    onClick={() => handleSuggestionClick(product.id)}
                                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-textDark dark:text-textLight hover:bg-gray-100 dark:hover:bg-primary"
                                >
                                    <img src={product.imageUrl} alt={product.name} className="w-8 h-8 object-cover rounded-sm" />
                                    <span>{product.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-textDark dark:text-textLight hover:text-accent dark:hover:text-accent'}`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-primary/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-accent">
              ShopZilla
            </Link>
            <nav className="hidden md:flex items-center space-x-6 ml-10">
              <NavLink to="/" className={navLinkClasses} end>Home</NavLink>
              <NavLink to="/products" className={navLinkClasses}>Products</NavLink>
              <NavLink to="/about" className={navLinkClasses}>About</NavLink>
              <NavLink to="/contact" className={navLinkClasses}>Contact</NavLink>
            </nav>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
            <SearchBar />
            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-secondary">
              {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <Link to="/cart" className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-secondary">
              <CartIcon className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(!isProfileOpen)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-secondary">
                <UserIcon className="w-6 h-6" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary rounded-md shadow-xl z-20 border border-gray-200 dark:border-gray-700 py-1">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        Signed in as <br /><span className="font-semibold">{user.name}</span>
                      </div>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-primary">
                        <UserIcon className="w-4 h-4 mr-2" /> My Profile
                      </Link>
                      {user.role !== 'customer' && (
                        <Link to={user.role === 'admin' ? "/admin/dashboard" : "/seller/dashboard"} onClick={() => setProfileOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-primary">
                          <DashboardIcon className="w-4 h-4 mr-2" /> Dashboard
                        </Link>
                      )}
                       <Link to="/profile#wishlist" onClick={() => setProfileOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-primary">
                         <WishlistIcon className="w-4 h-4 mr-2" /> My Wishlist
                      </Link>
                      <button onClick={() => { logout(); setProfileOpen(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10">
                        <LogoutIcon className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/auth" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-primary">
                      Sign In / Sign Up
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;