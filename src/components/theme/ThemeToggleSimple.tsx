
import React from 'react';
import { useTheme } from './ThemeProvider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sun, Moon } from 'lucide-react';

const ThemeToggleSimple: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const handleChange = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch 
        checked={theme === 'dark'}
        onCheckedChange={handleChange}
        aria-label="Toggle dark mode"
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};

export default ThemeToggleSimple;
