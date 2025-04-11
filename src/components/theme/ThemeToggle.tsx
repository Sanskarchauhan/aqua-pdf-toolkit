
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  // Add a subtle animation when theme changes
  useEffect(() => {
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    return () => {
      document.documentElement.style.transition = '';
    };
  }, []);

  const iconVariants = {
    initial: { rotate: 0 },
    animate: { rotate: 360, transition: { duration: 0.5 } }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative overflow-hidden">
          <motion.div
            key={resolvedTheme}
            initial="initial"
            animate="animate"
            variants={iconVariants}
            className="absolute inset-0 flex items-center justify-center"
          >
            {resolvedTheme === 'light' ? (
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
            ) : (
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            )}
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && <motion.span layoutId="activeTheme" className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && <motion.span layoutId="activeTheme" className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === 'system' && <motion.span layoutId="activeTheme" className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeToggle;
