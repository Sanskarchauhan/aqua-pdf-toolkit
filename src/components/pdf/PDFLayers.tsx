
import React from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

export interface PDFLayer {
  id: string;
  type: 'text' | 'image' | 'shape' | 'signature' | 'highlight' | 'comment';
  content: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  fontSize?: number;
  opacity?: number;
  rotation?: number;
  pageNumber: number;
}

interface PDFLayersProps {
  layers: PDFLayer[];
  currentPage: number;
  scale: number;
  onLayerClick?: (layer: PDFLayer) => void;
  onLayerMove?: (id: string, x: number, y: number) => void;
  editable?: boolean;
}

const PDFLayers: React.FC<PDFLayersProps> = ({
  layers,
  currentPage,
  scale,
  onLayerClick,
  onLayerMove,
  editable = false
}) => {
  const { resolvedTheme } = useTheme();
  
  const filteredLayers = layers.filter(layer => layer.pageNumber === currentPage - 1);
  
  const renderLayer = (layer: PDFLayer) => {
    switch(layer.type) {
      case 'text':
        return (
          <div 
            key={layer.id}
            className={`absolute cursor-${editable ? 'move' : 'default'} p-1 ${
              editable ? 'border border-dashed border-transparent hover:border-primary' : ''
            }`}
            style={{ 
              left: layer.x * scale, 
              top: layer.y * scale,
              color: layer.color || (resolvedTheme === 'dark' ? '#fff' : '#000'),
              fontSize: (layer.fontSize || 16) * scale,
              opacity: layer.opacity || 1,
              transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined
            }}
            onClick={() => onLayerClick && onLayerClick(layer)}
          >
            {layer.content}
          </div>
        );
        
      case 'image':
        return (
          <img 
            key={layer.id}
            src={layer.content}
            alt="PDF layer"
            className={`absolute cursor-${editable ? 'move' : 'default'} ${
              editable ? 'border border-dashed border-transparent hover:border-primary' : ''
            }`}
            style={{
              left: layer.x * scale,
              top: layer.y * scale,
              width: (layer.width || 100) * scale,
              height: (layer.height || 100) * scale,
              opacity: layer.opacity || 1,
              transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined
            }}
            onClick={() => onLayerClick && onLayerClick(layer)}
          />
        );
        
      case 'signature':
        return (
          <img 
            key={layer.id}
            src={layer.content}
            alt="Signature"
            className={`absolute cursor-${editable ? 'move' : 'default'} ${
              editable ? 'border border-dashed border-transparent hover:border-primary' : ''
            }`}
            style={{
              left: layer.x * scale,
              top: layer.y * scale,
              width: (layer.width || 150) * scale,
              height: 'auto',
              opacity: layer.opacity || 1
            }}
            onClick={() => onLayerClick && onLayerClick(layer)}
          />
        );
        
      case 'shape':
        if (layer.content === 'rectangle') {
          return (
            <div 
              key={layer.id}
              className={`absolute cursor-${editable ? 'move' : 'default'} ${
                editable ? 'border border-dashed border-transparent hover:border-primary' : ''
              }`}
              style={{
                left: layer.x * scale,
                top: layer.y * scale,
                width: (layer.width || 100) * scale,
                height: (layer.height || 60) * scale,
                backgroundColor: layer.color || 'rgba(66, 133, 244, 0.2)',
                border: `1px solid ${layer.color || 'rgba(66, 133, 244, 0.8)'}`,
                opacity: layer.opacity || 1,
                transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined
              }}
              onClick={() => onLayerClick && onLayerClick(layer)}
            />
          );
        } else if (layer.content === 'circle') {
          return (
            <div 
              key={layer.id}
              className={`absolute rounded-full cursor-${editable ? 'move' : 'default'} ${
                editable ? 'border border-dashed border-transparent hover:border-primary' : ''
              }`}
              style={{
                left: layer.x * scale,
                top: layer.y * scale,
                width: (layer.width || 100) * scale,
                height: (layer.width || 100) * scale, // Keep aspect ratio 1:1 for circle
                backgroundColor: layer.color || 'rgba(66, 133, 244, 0.2)',
                border: `1px solid ${layer.color || 'rgba(66, 133, 244, 0.8)'}`,
                opacity: layer.opacity || 1
              }}
              onClick={() => onLayerClick && onLayerClick(layer)}
            />
          );
        }
        return null;
        
      case 'highlight':
        return (
          <div 
            key={layer.id}
            className={`absolute cursor-${editable ? 'move' : 'default'} ${
              editable ? 'border border-dashed border-transparent hover:border-primary' : ''
            }`}
            style={{
              left: layer.x * scale,
              top: layer.y * scale,
              width: (layer.width || 100) * scale,
              height: (layer.height || 20) * scale,
              backgroundColor: layer.color || 'rgba(255, 235, 59, 0.5)',
              opacity: layer.opacity || 0.5,
              zIndex: 10
            }}
            onClick={() => onLayerClick && onLayerClick(layer)}
          />
        );
        
      case 'comment':
        return (
          <div 
            key={layer.id}
            className={`absolute cursor-${editable ? 'move' : 'default'} bg-yellow-100 dark:bg-yellow-900 p-2 rounded-md max-w-[200px] ${
              editable ? 'border border-dashed border-transparent hover:border-primary' : ''
            }`}
            style={{
              left: layer.x * scale,
              top: layer.y * scale,
              fontSize: 14 * scale,
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              zIndex: 20
            }}
            onClick={() => onLayerClick && onLayerClick(layer)}
          >
            {layer.content}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {filteredLayers.map(layer => (
        <div key={layer.id} className="pointer-events-auto">
          {renderLayer(layer)}
        </div>
      ))}
    </div>
  );
};

export default PDFLayers;
