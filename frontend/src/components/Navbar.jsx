import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Menu, X, Sun, Moon, ChefHat, LogOut, User as UserIcon, 
  Heart, PlusCircle, BookOpen, LayoutDashboard, Sparkles 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
    ${isActive(path) 
      ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20' 
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'}
  `;

  const mobileLinkClass = (path) => `
    flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200
    ${isActive(path) 
      ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20' 
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'}
  `;

  return (
    <nav className="glass sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                <ChefHat className="h-5 w-5" />
              </span>
              <span>
                Cook<span className="text-amber-500">Verse</span>
                <span className="ml-1 text-xs font-semibold uppercase tracking-wider text-slate-400">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/search" className={linkClass('/search')}>Explore</Link>
            
            {isAuthenticated && (
              <>
                <Link to="/generate-ai" className={linkClass('/generate-ai')}>
                  <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                  AI Generator
                </Link>
                
                {!isAdmin && (
                  <>
                    <Link to="/favorites" className={linkClass('/favorites')}>
                      <Heart className="h-4 w-4" />
                      Favorites
                    </Link>
                    <Link to="/add-recipe" className={linkClass('/add-recipe')}>
                      <PlusCircle className="h-4 w-4" />
                      Add Recipe
                    </Link>
                    <Link to="/my-recipes" className={linkClass('/my-recipes')}>
                      <BookOpen className="h-4 w-4" />
                      My Recipes
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link to="/admin/recipes" className={linkClass('/admin/recipes')}>
                      <BookOpen className="h-4 w-4" />
                      Manage Recipes
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Theme & User Profile Actions */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors duration-200"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-slate-200/50 pl-4 dark:border-slate-800/50">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                    <UserIcon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white transition-colors">
                    {user?.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:text-slate-400 dark:hover:border-red-950 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-all duration-200"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-slate-200/50 pl-4 dark:border-slate-800/50">
                <Link 
                  to="/login"
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-amber-500 px-3.5 py-2 text-sm font-medium text-white shadow-md shadow-amber-500/10 hover:bg-amber-600 hover:shadow-amber-500/20 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Open menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-3 space-y-1 transition-colors duration-300">
          <Link to="/" className={mobileLinkClass('/')} onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/search" className={mobileLinkClass('/search')} onClick={() => setIsOpen(false)}>Explore</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/generate-ai" className={mobileLinkClass('/generate-ai')} onClick={() => setIsOpen(false)}>
                <Sparkles className="h-4 w-4 text-amber-500" />
                AI Generator
              </Link>
              
              {!isAdmin && (
                <>
                  <Link to="/favorites" className={mobileLinkClass('/favorites')} onClick={() => setIsOpen(false)}>
                    <Heart className="h-4 w-4" />
                    Favorites
                  </Link>
                  <Link to="/add-recipe" className={mobileLinkClass('/add-recipe')} onClick={() => setIsOpen(false)}>
                    <PlusCircle className="h-4 w-4" />
                    Add Recipe
                  </Link>
                  <Link to="/my-recipes" className={mobileLinkClass('/my-recipes')} onClick={() => setIsOpen(false)}>
                    <BookOpen className="h-4 w-4" />
                    My Recipes
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className={mobileLinkClass('/admin/dashboard')} onClick={() => setIsOpen(false)}>
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link to="/admin/recipes" className={mobileLinkClass('/admin/recipes')} onClick={() => setIsOpen(false)}>
                    <BookOpen className="h-4 w-4" />
                    Manage Recipes
                  </Link>
                </>
              )}

              <div className="border-t border-slate-200 my-2 pt-2 dark:border-slate-800">
                <Link to="/profile" className={mobileLinkClass('/profile')} onClick={() => setIsOpen(false)}>
                  <UserIcon className="h-4 w-4" />
                  My Profile ({user?.name})
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-slate-200 my-2 pt-2 dark:border-slate-800 flex flex-col gap-2 px-4">
              <Link 
                to="/login"
                className="flex items-center justify-center rounded-lg border border-slate-200 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center rounded-lg bg-amber-500 py-2.5 text-base font-medium text-white shadow-md shadow-amber-500/10 hover:bg-amber-600"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
