
import 'tailwindcss/tailwind.css';

declare module 'tailwindcss/tailwind.css' {
  // Add animation classes
  interface AnimationClasses {
    'animate-fade-in': string;
    'animate-fade-out': string;
    'animate-slide-in': string;
    'animate-slide-out': string;
    'animate-scale-in': string;
    'animate-scale-out': string;
    'animate-bounce-in': string;
    'animate-ripple': string;
    'hover-scale': string;
    'hover-lift': string;
    'hover-glow': string;
  }
}

declare global {
  // Add animation utility types to global scope
  type AnimationTypes = 'fade' | 'slide' | 'scale' | 'bounce';
  type AnimationDirections = 'up' | 'down' | 'left' | 'right';
  
  // Animation configuration object
  interface AnimationConfig {
    type: AnimationTypes;
    direction?: AnimationDirections;
    duration?: number;
    delay?: number;
    stiffness?: number;
    damping?: number;
  }
}
