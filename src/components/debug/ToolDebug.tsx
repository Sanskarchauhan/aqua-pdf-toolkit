
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Bug } from 'lucide-react';

interface ToolDebugProps {
  toolId: string;
  files: File[];
  processing: boolean;
  progress: number;
  completed: boolean;
  onTest: () => void;
}

const ToolDebug: React.FC<ToolDebugProps> = ({ 
  toolId, 
  files, 
  processing, 
  progress, 
  completed, 
  onTest 
}) => {
  return (
    <Card className="mt-4 border-dashed border-yellow-500">
      <CardHeader className="bg-yellow-50 dark:bg-yellow-950/20">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bug size={16} /> Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">Tool ID:</div>
          <div>{toolId}</div>
          
          <div className="font-medium">Files Loaded:</div>
          <div>{files.length}</div>
          
          <div className="font-medium">File Names:</div>
          <div>{files.map(f => f.name).join(', ') || 'None'}</div>
          
          <div className="font-medium">Processing:</div>
          <div>{processing ? 'Yes' : 'No'}</div>
          
          <div className="font-medium">Progress:</div>
          <div>{progress}%</div>
          
          <div className="font-medium">Completed:</div>
          <div className="flex items-center">
            {completed ? <Check size={16} className="text-green-500 mr-1" /> : ''} 
            {completed ? 'Yes' : 'No'}
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs"
            onClick={onTest}
          >
            Run Test Function
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolDebug;
