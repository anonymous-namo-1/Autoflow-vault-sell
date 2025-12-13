import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, CheckCircle2, ArrowLeft } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { fadeInUp, staggerContainer, staggerItem, scaleIn } from "@/lib/animations";

const verifySchema = z.object({
  otp: z.string().length(6, "Please enter the 6-digit code"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const email = searchParams.get("email") || "";
  
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: VerifyFormValues) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/verify-email", {
        email,
        code: data.otp,
      });
      setIsVerified(true);
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified.",
      });
      setTimeout(() => {
        setLocation("/login");
      }, 3000);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    try {
      await apiRequest("POST", "/api/auth/resend-verification", { email });
      setCountdown(60);
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend code",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-semibold">No Email Provided</h2>
              <p className="text-muted-foreground">
                Please register first to verify your email.
              </p>
              <Link href="/register">
                <Button className="w-full" data-testid="button-go-to-register">
                  Go to Register
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {!isVerified ? (
            <motion.div
              key="verify"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Card className="shadow-lg">
                <CardHeader className="text-center space-y-2">
                  <motion.div variants={staggerItem} className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Mail className="h-8 w-8" />
                    </div>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <CardTitle className="text-3xl font-bold tracking-tight">
                      Verify Your Email
                    </CardTitle>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <CardDescription className="text-muted-foreground">
                      We've sent a verification code to
                      <br />
                      <span className="font-medium text-foreground">{email}</span>
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <motion.div variants={staggerItem}>
                        <FormField
                          control={form.control}
                          name="otp"
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                              <FormControl>
                                <InputOTP
                                  maxLength={6}
                                  value={field.value}
                                  onChange={field.onChange}
                                  data-testid="input-otp"
                                >
                                  <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                  </InputOTPGroup>
                                  <InputOTPSeparator />
                                  <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                  </InputOTPGroup>
                                </InputOTP>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={staggerItem}>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                          data-testid="button-verify"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Verify Email"
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>

                  <motion.div variants={staggerItem} className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Didn't receive the code?
                    </p>
                    <Button
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={isResending || countdown > 0}
                      className="text-sm"
                      data-testid="button-resend-otp"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : countdown > 0 ? (
                        `Resend in ${countdown}s`
                      ) : (
                        "Resend Code"
                      )}
                    </Button>
                  </motion.div>

                  <motion.div variants={staggerItem} className="mt-4 text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="link-back-to-login"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to login
                    </Link>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              variants={scaleIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex justify-center"
                    >
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-bold tracking-tight"
                    >
                      Email Verified!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-muted-foreground"
                    >
                      Your email has been successfully verified. Redirecting you to login...
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link href="/login">
                        <Button className="w-full" data-testid="button-go-to-login">
                          Go to Login
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
