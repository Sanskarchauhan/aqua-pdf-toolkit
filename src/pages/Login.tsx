
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  }),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("Login attempt with:", values.email); // Debug log
      const success = await login(values.email, values.password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back to AquaPDF!",
        });
        
        // Redirect to workspace page
        navigate('/workspace');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error details:", error); // Enhanced error logging
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 bg-grid-pattern">
      <Navbar />
      <div className="container mx-auto px-4 pt-12 pb-20 md:py-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center max-w-6xl mx-auto">
          {/* Left side - Login form */}
          <div className="w-full md:w-1/2 max-w-md mx-auto">
            <div className="animate-fade-in">
              <div className="space-y-2 text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold gradient-text">Welcome Back</h1>
                <p className="text-muted-foreground">Sign in to continue to your account</p>
              </div>
              
              <Card className="border-0 shadow-lg bg-opacity-95 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/90">Email</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Enter your email" 
                                  type="email" 
                                  className="pl-10 bg-background/50" 
                                  {...field} 
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <FormLabel className="text-foreground/90">Password</FormLabel>
                              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                                Forgot password?
                              </Link>
                            </div>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Enter your password" 
                                  type={showPassword ? "text" : "password"} 
                                  className="pl-10 pr-10 bg-background/50" 
                                  {...field} 
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="sr-only">
                                  {showPassword ? "Hide password" : "Show password"}
                                </span>
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="rememberMe"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                                Remember me
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full h-11 gradient-button font-medium"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                            Signing In...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                      
                      <div className="relative flex py-3 items-center w-full">
                        <div className="flex-grow border-t border-muted-foreground/20"></div>
                        <span className="flex-shrink mx-4 text-xs text-muted-foreground">or continue with</span>
                        <div className="flex-grow border-t border-muted-foreground/20"></div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <Button variant="outline" className="w-full" type="button">
                          <svg
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fab"
                            data-icon="google"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 488 512"
                          >
                            <path
                              fill="currentColor"
                              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                            ></path>
                          </svg>
                          Google
                        </Button>
                      </div>
                      
                      <div className="text-center text-sm pt-2">
                        New to AquaPDF?{" "}
                        <Link to="/signup" className="font-medium text-primary hover:underline">
                          Create an account
                        </Link>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Right side - Features */}
          <div className="hidden md:block w-1/2">
            <div className="space-y-6 animate-fade-in">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-4">Why Choose AquaPDF?</h2>
                <p className="text-muted-foreground mb-6">Access premium PDF tools with your account</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/60 border border-border animate-float">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                      <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                      <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">All-in-One PDF Solution</h3>
                    <p className="text-sm text-muted-foreground">Edit, convert, compress, and manage all your PDF files in one place</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/60 border border-border animate-float" style={{ animationDelay: '0.1s' }}>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Secure Processing</h3>
                    <p className="text-sm text-muted-foreground">Files are processed securely and never stored permanently on our servers</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/60 border border-border animate-float" style={{ animationDelay: '0.2s' }}>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Save Time</h3>
                    <p className="text-sm text-muted-foreground">Process documents in seconds with our high-performance tools</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
