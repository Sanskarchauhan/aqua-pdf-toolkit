
// Type declarations for modules without TypeScript support
declare module 'signature_pad' {
  export default class SignaturePad {
    constructor(canvas: HTMLCanvasElement, options?: SignaturePadOptions);
    
    clear(): void;
    isEmpty(): boolean;
    fromData(data: any): void;
    toData(): any;
    toDataURL(type?: string, encoderOptions?: number): string;
    on(): void;
    off(): void;
    
    addEventListener(event: string, callback: () => void): void;
    removeEventListener(event: string, callback: () => void): void;
  }
  
  interface SignaturePadOptions {
    dotSize?: number;
    minWidth?: number;
    maxWidth?: number;
    backgroundColor?: string;
    penColor?: string;
    velocityFilterWeight?: number;
    throttle?: number;
  }
}

declare module 'tesseract.js';
