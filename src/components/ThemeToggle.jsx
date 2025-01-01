import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext.jsx'
import { useContext } from 'react'
import { useEffectUpdate } from '../hooks/useEffectUpdate.jsx'

const ThemeToggle = () => {
    const { theme, setTheme, toggleTheme } = useContext(ThemeContext)
    const isDark = theme === 'dark';
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches)
            setTheme('dark');
    }, []);

    useEffectUpdate(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [theme]);

    const MyToggleTheme = () => {
        toggleTheme();

        setIsAnimating(false);

        requestAnimationFrame(() => {
            setIsAnimating(true);
        });
    };
    

    return (
        <button
        onClick={MyToggleTheme}
        className={`theme-toggle ${isAnimating ? 'animate-outline' : ''}`}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
        <div className="toggle-track">
            <div className="toggle-thumb">
            {isDark ? (
                <Moon className="moon" />
            ) : (
                <Sun className="sun" />
            )}
            </div>
        </div>
        
        <span className="toggle-text">
            {isDark ? 'Dark' : 'Light'}
        </span>
        </button>
    );
};

export default ThemeToggle;