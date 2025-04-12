
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
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const success = await signup(values.name, values.email, values.password);
      
      if (success) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        });
        
        // Redirect to get-started page
        navigate('/get-started');
      } else {
        toast({
          title: "Signup failed",
          description: "This email is already registered. Please try a different email or log in.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Signup error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 bg-grid-pattern">
      <Navbar />
      <div className="container mx-auto px-4 pt-12 pb-20 md:py-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center max-w-6xl mx-auto">
          {/* Left side - Features */}
          <div className="hidden md:block w-1/2">
            <div className="space-y-6 animate-fade-in">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-4">Join AquaPDF Today</h2>
                <p className="text-muted-foreground mb-6">Create your account to unlock premium features</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/60 border border-border animate-float">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Personal Account</h3>
                    <p className="text-sm text-muted-foreground">Save your work and access your files from any device</p>
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
                    <h3 className="font-medium">Premium Features</h3>
                    <p className="text-sm text-muted-foreground">Get access to advanced PDF tools and unlimited processing</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/60 border border-border animate-float" style={{ animationDelay: '0.2s' }}>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <circle cx="10" cy="13" r="2"></circle>
                      <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">File History</h3>
                    <p className="text-sm text-muted-foreground">Keep track of all your processed documents</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Signup form */}
          <div className="w-full md:w-1/2 max-w-md mx-auto">
            <div className="animate-fade-in">
              <div className="space-y-2 text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold gradient-text">Create an Account</h1>
                <p className="text-muted-foreground">Join thousands of users using AquaPDF</p>
              </div>
              
              <Card className="border-0 shadow-lg bg-opacity-95 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/90">Full Name</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Enter your name" 
                                  className="pl-10 bg-background/50" 
                                  {...field} 
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/90">Email Address</FormLabel>
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
                            <FormLabel className="text-foreground/90">Password</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Create a password" 
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
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/90">Confirm Password</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Confirm your password" 
                                  type={showConfirmPassword ? "text" : "password"} 
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
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="sr-only">
                                  {showConfirmPassword ? "Hide password" : "Show password"}
                                </span>
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-border rounded-md bg-background/50">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="terms"
                                disabled={isLoading}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel htmlFor="terms" className="text-sm font-normal">
                                I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full h-11 gradient-button font-medium mt-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
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
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-primary hover:underline">
                          Sign in
                        </Link>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
