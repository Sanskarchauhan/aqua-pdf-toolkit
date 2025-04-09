
import { toast } from '@/hooks/use-toast';

// Interface for workspace items
export interface WorkspaceItem {
  id: string;
  files: File[];
  toolId: string | null;
  dateAdded: Date;
}

// Save files to workspace
export const addToWorkspace = (files: File[], toolId?: string): void => {
  try {
    // Get existing workspace
    const workspace = getWorkspace();
    
    // Create new workspace item
    const newItem: WorkspaceItem = {
      id: `workspace-${Date.now()}`,
      files,
      toolId: toolId || null,
      dateAdded: new Date(),
    };
    
    // Add to workspace
    workspace.push(newItem);
    
    // Save updated workspace
    localStorage.setItem('pdf-tools-workspace', JSON.stringify(workspace));
    
    toast({
      title: "Added to workspace",
      description: `${files.length} ${files.length === 1 ? 'file' : 'files'} added to your workspace.`,
    });
  } catch (error) {
    console.error("Error adding to workspace:", error);
    toast({
      title: "Error",
      description: "Failed to add files to workspace.",
      variant: "destructive",
    });
  }
};

// Get all workspace items
export const getWorkspace = (): WorkspaceItem[] => {
  try {
    const workspace = localStorage.getItem('pdf-tools-workspace');
    return workspace ? JSON.parse(workspace) : [];
  } catch (error) {
    console.error("Error getting workspace:", error);
    return [];
  }
};

// Remove item from workspace
export const removeFromWorkspace = (id: string): void => {
  try {
    let workspace = getWorkspace();
    workspace = workspace.filter(item => item.id !== id);
    localStorage.setItem('pdf-tools-workspace', JSON.stringify(workspace));
    
    toast({
      title: "Removed from workspace",
      description: "Item removed from your workspace.",
    });
  } catch (error) {
    console.error("Error removing from workspace:", error);
    toast({
      title: "Error",
      description: "Failed to remove item from workspace.",
      variant: "destructive",
    });
  }
};

// Clear entire workspace
export const clearWorkspace = (): void => {
  try {
    localStorage.removeItem('pdf-tools-workspace');
    
    toast({
      title: "Workspace cleared",
      description: "All items have been removed from your workspace.",
    });
  } catch (error) {
    console.error("Error clearing workspace:", error);
    toast({
      title: "Error",
      description: "Failed to clear workspace.",
      variant: "destructive",
    });
  }
};
