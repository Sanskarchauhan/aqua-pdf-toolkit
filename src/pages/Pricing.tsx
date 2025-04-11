
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, CreditCard, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AnimatedPage from '@/components/animation/AnimatedPage';

const Pricing = () => {
  const navigate = useNavigate();
  const { user, upgradeToSubscription } = useAuth();
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      upgradeToSubscription();
      setIsProcessing(false);
      toast({
        title: "Payment successful!",
        description: "Thank you for subscribing to AquaPDF Premium.",
      });
      navigate('/workspace');
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <AnimatedPage>
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Choose Your Plan
          </motion.h1>
          <motion.p 
            className="text-muted-foreground max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Get access to all features and tools with our premium plans.
          </motion.p>
          
          <motion.div 
            className="flex justify-center mt-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-secondary rounded-full p-1 inline-flex">
              <Button
                variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                size="sm"
                className={billingCycle === 'monthly' ? 'bg-primary text-white' : ''}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </Button>
              <Button
                variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
                size="sm"
                className={billingCycle === 'yearly' ? 'bg-primary text-white' : ''}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly
                <span className="ml-2 bg-green-500 text-white text-xs py-0.5 px-1.5 rounded-full">Save 20%</span>
              </Button>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Free Plan */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-2 border-muted">
              <CardHeader>
                <CardTitle className="flex items-center">
                  Free Plan
                </CardTitle>
                <CardDescription>Try out our core features</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground"> forever</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>3 free uses of any tool</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Basic PDF editing features</span>
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 mr-2 text-red-500" />
                    <span className="text-muted-foreground">Unlimited processing</span>
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 mr-2 text-red-500" />
                    <span className="text-muted-foreground">Cloud storage</span>
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 mr-2 text-red-500" />
                    <span className="text-muted-foreground">Advanced tools</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Premium Plan */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground text-xs py-1 px-3 rounded-bl-lg">
                  RECOMMENDED
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Premium
                  <Sparkles className="h-5 w-5 ml-2 text-yellow-500" />
                </CardTitle>
                <CardDescription>All features & unlimited usage</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">
                    ${billingCycle === 'monthly' ? '9.99' : '7.99'}
                  </span>
                  <span className="text-muted-foreground"> / {billingCycle === 'monthly' ? 'month' : 'month (billed yearly)'}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span className="font-semibold">Unlimited processing</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>All PDF tools</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Advanced editing features</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>10GB cloud storage</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handlePurchase}
                  className="w-full bg-gradient-to-r from-primary to-accent"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Subscribe Now
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4 text-left">
            <div>
              <h3 className="font-semibold mb-1">What happens after my 3 free trials?</h3>
              <p className="text-muted-foreground">
                After using your 3 free trials, you'll need to upgrade to our premium plan to continue using our tools.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Can I cancel my subscription anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. Your premium access will remain until the end of your billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Is my payment information secure?</h3>
              <p className="text-muted-foreground">
                Yes, all payment processing is handled securely through our payment processor. We never store your full credit card information.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </AnimatedPage>
  );
};

export default Pricing;
