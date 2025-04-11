
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Check, Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextLayerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddText: (text: string, options: TextOptions) => void;
  initialText?: string;
  initialOptions?: Partial<TextOptions>;
}

export interface TextOptions {
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textAlign: 'left' | 'center' | 'right';
  opacity: number;
}

const DEFAULT_OPTIONS: TextOptions = {
  fontSize: 16,
  color: '#000000',
  fontFamily: 'Arial',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textAlign: 'left',
  opacity: 1,
};

const FONT_FAMILIES = [
  'Arial',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Helvetica',
];

const TextLayer: React.FC<TextLayerProps> = ({
  isOpen,
  onClose,
  onAddText,
  initialText = '',
  initialOptions = {},
}) => {
  const [text, setText] = useState(initialText);
  const [options, setOptions] = useState<TextOptions>({
    ...DEFAULT_OPTIONS,
    ...initialOptions,
  });
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleOptionChange = <K extends keyof TextOptions>(
    key: K,
    value: TextOptions[K]
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (text.trim()) {
      onAddText(text, options);
      onClose();
    }
  };

  const toggleFontWeight = () => {
    handleOptionChange(
      'fontWeight',
      options.fontWeight === 'bold' ? 'normal' : 'bold'
    );
  };

  const toggleFontStyle = () => {
    handleOptionChange(
      'fontStyle',
      options.fontStyle === 'italic' ? 'normal' : 'italic'
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Type className="mr-2 h-5 w-5" />
            Add Text to PDF
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="text">Enter Text</Label>
            <Textarea
              id="text"
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-32"
              placeholder="Enter text to add to your PDF..."
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Font Family</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={options.fontFamily}
                onChange={(e) => handleOptionChange('fontFamily', e.target.value)}
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Font Size</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[options.fontSize]}
                  min={8}
                  max={72}
                  step={1}
                  className="flex-grow"
                  onValueChange={(value) => handleOptionChange('fontSize', value[0])}
                />
                <div className="w-12 text-center">{options.fontSize}px</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Text Color</Label>
              <div className="flex h-10 items-center gap-2 mt-1">
                <div
                  className="h-6 w-6 rounded-full border"
                  style={{ backgroundColor: options.color }}
                />
                <Input
                  type="color"
                  value={options.color}
                  onChange={(e) => handleOptionChange('color', e.target.value)}
                  className="w-full h-8"
                />
              </div>
            </div>

            <div>
              <Label>Opacity</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[options.opacity * 100]}
                  min={10}
                  max={100}
                  step={5}
                  className="flex-grow"
                  onValueChange={(value) => handleOptionChange('opacity', value[0] / 100)}
                />
                <div className="w-12 text-center">{Math.round(options.opacity * 100)}%</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex gap-1">
              <Button
                type="button"
                size="sm"
                variant={options.fontWeight === 'bold' ? 'default' : 'outline'}
                onClick={toggleFontWeight}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant={options.fontStyle === 'italic' ? 'default' : 'outline'}
                onClick={toggleFontStyle}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-1">
              <Button
                type="button"
                size="sm"
                variant={options.textAlign === 'left' ? 'default' : 'outline'}
                onClick={() => handleOptionChange('textAlign', 'left')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant={options.textAlign === 'center' ? 'default' : 'outline'}
                onClick={() => handleOptionChange('textAlign', 'center')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant={options.textAlign === 'right' ? 'default' : 'outline'}
                onClick={() => handleOptionChange('textAlign', 'right')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-2 p-3 border rounded-md bg-muted/30">
            <p className="text-sm text-center mb-1">Preview</p>
            <div
              className="p-2 bg-background rounded border"
              style={{
                fontFamily: options.fontFamily,
                fontSize: options.fontSize,
                color: options.color,
                fontWeight: options.fontWeight,
                fontStyle: options.fontStyle,
                textAlign: options.textAlign as any,
                opacity: options.opacity,
              }}
            >
              {text || 'Text preview'}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!text.trim()}>
            <Check className="mr-2 h-4 w-4" />
            Add Text
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TextLayer;
