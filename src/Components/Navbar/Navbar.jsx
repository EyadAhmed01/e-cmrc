import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import { UserContext } from '../../Context/UserContext';
import logo from '../../assets/freshcart-logo.svg';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const { cartCount } = useContext(CartContext);
  const { token, setToken, isAdmin } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, [setToken]);

  function logout() {
    localStorage.removeItem("userToken");
    setToken(null);
    navigate('/login');
  }

  const currentToken = token || localStorage.getItem('userToken');

  return (
    <nav className="glass-strong sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink to="/home" className="flex items-center space-x-3 rtl:space-x-reverse group">
          <img src={logo} className="h-8 transition-transform group-hover:scale-110" alt="Logo" />
          <span className="self-center text-2xl font-bold gradient-text">FreshCart</span>
        </NavLink>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm glass rounded-xl md:hidden hover:bg-white/10 transition-smooth"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          {currentToken ? (
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 glass rounded-2xl md:flex-row md:space-x-2 md:mt-0 md:bg-transparent md:border-0">
              <li>
                <NavLink 
                  to="/home" 
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-xl transition-smooth ${
                      isActive 
                        ? 'bg-accent/20 text-accent font-semibold glow' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <i className="fas fa-home mr-2"></i>Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/products" 
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-xl transition-smooth ${
                      isActive 
                        ? 'bg-accent/20 text-accent font-semibold glow' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <i className="fas fa-box mr-2"></i>Products
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/brands" 
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-xl transition-smooth ${
                      isActive 
                        ? 'bg-accent/20 text-accent font-semibold glow' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <i className="fas fa-tags mr-2"></i>Brands
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/cart" 
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-xl transition-smooth relative ${
                      isActive 
                        ? 'bg-accent/20 text-accent font-semibold glow' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <i className="fas fa-shopping-cart mr-2"></i>Cart
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-accent text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-glow-pulse">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/wishlist" 
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-xl transition-smooth ${
                      isActive 
                        ? 'bg-accent/20 text-accent font-semibold glow' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <i className="fas fa-heart mr-2"></i>Wishlist
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/account" 
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-xl transition-smooth ${
                      isActive 
                        ? 'bg-accent/20 text-accent font-semibold glow' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <i className="fas fa-user mr-2"></i>Account
                </NavLink>
              </li>
              {isAdmin && (
                <li>
                  <NavLink 
                    to="/admin/dashboard" 
                    className={({ isActive }) => 
                      `block py-2 px-4 rounded-xl transition-smooth ${
                        isActive 
                          ? 'bg-purple-500/20 text-purple-400 font-semibold' 
                          : 'text-gray-300 hover:bg-purple-500/10 hover:text-purple-400'
                      }`
                    }
                  >
                    <i className="fas fa-cog mr-2"></i>Admin
                  </NavLink>
                </li>
              )}
              <li>
                <button
                  onClick={logout}
                  className="block py-2 px-4 rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-smooth"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 glass rounded-2xl md:flex-row md:space-x-2 md:mt-0 md:bg-transparent md:border-0">
              <li>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-xl transition-smooth ${
                      isActive 
                        ? 'bg-accent/20 text-accent font-semibold glow' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-xl transition-smooth ${
                      isActive 
                        ? 'bg-accent/20 text-accent font-semibold glow' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  Register
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
