import './Header.css';
import { NavLink } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

function Header() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="header">
      <nav className="nav">
        <NavLink to={'/'}>Home</NavLink>
        <NavLink to={'/Projetos'}>Projetos</NavLink>
        <NavLink to={'/Contato'}>Contato</NavLink>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
      </nav>
    </header>
  );
}

export default Header;