
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Files, 
  History, 
  Star, 
  Upload, 
  ArrowRight,
  FileUp,
  Layers,
  FileText,
  ScanLine,
  Pencil,
  Lock, 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedPage from '@/components/animation/AnimatedPage';
import { useAuth } from '@/contexts/AuthContext';
import FileUploader from '@/components/shared/FileUploader';

const Workspace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const recentFiles = []; // This would be populated from API in real app
  const favorites = []; // This would be populated from API in real app
  
  // Mock function for file upload handling
  const handleFilesAdded = (files: File[]) => {
    if (files.length > 0) {
      const fileType = files[0].name.split('.').pop()?.toLowerCase();
      
      if (fileType === 'pdf') {
        navigate('/tools/edit-pdf'); // Fixed path
      } else if (['doc', 'docx'].includes(fileType || '')) {
        navigate('/tools/word-to-pdf'); // Fixed path
      } else if (['jpg', 'jpeg', 'png'].includes(fileType || '')) {
        navigate('/tools/jpg-to-pdf'); // Fixed path
      }
    }
  };
  
  // Popular tools list
  const popularTools = [
    {
      id: 'compress-pdf',
      name: 'Compress PDF',
      icon: FileUp,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      id: 'merge-pdf',
      name: 'Merge PDFs',
      icon: Layers,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      id: 'pdf-to-word',
      name: 'PDF to Word',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      id: 'pdf-ocr',
      name: 'PDF OCR',
      icon: ScanLine,
      color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    },
    {
      id: 'edit-pdf',
      name: 'Edit PDF',
      icon: Pencil,
      color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    },
    {
      id: 'protect-pdf',
      name: 'Protect PDF',
      icon: Lock,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
  ];

  return (
    <AnimatedPage>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome{user?.name ? `, ${user.name}` : ''}</h1>
          <p className="text-muted-foreground">
            Manage your documents and access your favorite tools
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Quick Upload
              </CardTitle>
              <CardDescription>
                Upload a file to get started with processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader
                acceptedFileTypes={{
                  'application/pdf': ['.pdf'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                  'application/msword': ['.doc'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                  'image/png': ['.png']
                }}
                maxFiles={1}
                onFilesAdded={handleFilesAdded}
                className=""
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5" />
                Subscription Status
              </CardTitle>
              <CardDescription>
                Your current plan and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold mb-1">
                    {user?.isSubscribed ? 'Premium Plan' : 'Free Plan'}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    {user?.isSubscribed ? (
                      <p>You have unlimited access to all premium features.</p>
                    ) : (
                      <>
                        <p className="mb-2">Free trial usage: {user?.trialCount || 0}/3</p>
                        <div className="w-full bg-muted-foreground/20 rounded-full h-1.5">
                          <div 
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, ((user?.trialCount || 0) / 3) * 100)}%` }}
                          ></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {!user?.isSubscribed && (
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/pricing')}
                  >
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Popular Tools</h2>
              <Button 
                variant="link" 
                className="text-primary"
                onClick={() => navigate('/tools')}
              >
                View All Tools <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularTools.map(tool => (
                <Card 
                  key={tool.id}
                  className="border cursor-pointer transition-all hover:shadow-md"
                  onClick={() => navigate(`/tools/${tool.id}`)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`${tool.color} rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center mb-2`}>
                      <tool.icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium">{tool.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
            
            <Card>
              <Tabs defaultValue="recent">
                <CardHeader className="pb-0">
                  <TabsList>
                    <TabsTrigger value="recent" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Recent
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Favorites
                    </TabsTrigger>
                    <TabsTrigger value="all" className="flex items-center gap-2">
                      <Files className="h-4 w-4" />
                      All Files
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-6">
                  <TabsContent value="recent">
                    {recentFiles.length > 0 ? (
                      <div className="space-y-2">
                        {/* File list would go here */}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-muted/50 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center mb-3">
                          <History className="h-8 w-8 text-muted-foreground/70" />
                        </div>
                        <h3 className="font-medium mb-1">No recent files</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Files you work with will appear here
                        </p>
                        <Button onClick={() => navigate('/tools')}>
                          Browse Tools
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="favorites">
                    {favorites.length > 0 ? (
                      <div className="space-y-2">
                        {/* Favorites list would go here */}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-muted/50 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center mb-3">
                          <Star className="h-8 w-8 text-muted-foreground/70" />
                        </div>
                        <h3 className="font-medium mb-1">No favorites yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Star files to add them to your favorites
                        </p>
                        <Button onClick={() => navigate('/tools')}>
                          Browse Tools
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="all">
                    <div className="text-center py-8">
                      <div className="bg-muted/50 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center mb-3">
                        <Files className="h-8 w-8 text-muted-foreground/70" />
                      </div>
                      <h3 className="font-medium mb-1">Start working with files</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload and process files to see them here
                      </p>
                      <Button onClick={() => navigate('/tools')}>
                        Browse Tools
                      </Button>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </AnimatedPage>
  );
};

export default Workspace;
