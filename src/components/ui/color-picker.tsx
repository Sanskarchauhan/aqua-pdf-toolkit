
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

const PRESET_COLORS = [
  '#000000', '#ffffff', '#f44336', '#e91e63', '#9c27b0', '#673ab7', 
  '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', 
  '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', 
];

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      {label && <Label className="mb-1 block">{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="flex w-full justify-start gap-2 border border-input"
            style={{ height: 40 }}
          >
            <div 
              className="h-5 w-5 rounded-sm border"
              style={{ backgroundColor: value }}
            />
            <span>{value.toUpperCase()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <div 
                className="h-8 w-8 rounded border"
                style={{ backgroundColor: value }}
              />
              <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 flex-1"
                maxLength={9}
                spellCheck={false}
              />
            </div>
            <Input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 w-full"
            />
            <div className="grid grid-cols-6 gap-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className="h-6 w-6 rounded-sm border border-muted hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color.toUpperCase()}
                  onClick={() => {
                    onChange(color);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ColorPicker;
