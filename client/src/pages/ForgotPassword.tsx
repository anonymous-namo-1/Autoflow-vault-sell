import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, Lock, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { fadeInUp, staggerContainer, staggerItem, scaleIn } from "@/lib/animations";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z.object({
  otp: z.string().length(6, "Please enter the 6-digit code"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

type Step = "email" | "verify" | "success";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/forgot-password", { email: data.email });
      setEmail(data.email);
      setStep("verify");
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/reset-password", {
        email,
        code: data.otp,
        newPassword: data.newPassword,
      });
      setStep("success");
      toast({
        title: "Password Reset",
        description: "Your password has been successfully reset.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/forgot-password", { email });
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.div
              key="email"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Card className="shadow-lg">
                <CardHeader className="text-center space-y-2">
                  <motion.div variants={staggerItem}>
                    <CardTitle className="text-3xl font-bold tracking-tight">
                      Forgot Password
                    </CardTitle>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <CardDescription className="text-muted-foreground">
                      Enter your email to receive a verification code
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                      <motion.div variants={staggerItem}>
                        <FormField
                          control={emailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-10"
                                    data-testid="input-email"
                                  />
                                </div>
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
                          data-testid="button-send-otp"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Verification Code"
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>

                  <motion.div variants={staggerItem} className="mt-6 text-center">
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
          )}

          {step === "verify" && (
            <motion.div
              key="verify"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Card className="shadow-lg">
                <CardHeader className="text-center space-y-2">
                  <motion.div variants={staggerItem}>
                    <CardTitle className="text-3xl font-bold tracking-tight">
                      Reset Password
                    </CardTitle>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <CardDescription className="text-muted-foreground">
                      Enter the code sent to {email}
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <Form {...resetForm}>
                    <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                      <motion.div variants={staggerItem}>
                        <FormField
                          control={resetForm.control}
                          name="otp"
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                              <FormLabel>Verification Code</FormLabel>
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
                        <FormField
                          control={resetForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="pl-10 pr-10"
                                    data-testid="input-new-password"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                    data-testid="button-toggle-new-password"
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={staggerItem}>
                        <FormField
                          control={resetForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    {...field}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    className="pl-10 pr-10"
                                    data-testid="input-confirm-new-password"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    data-testid="button-toggle-confirm-new-password"
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
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
                          data-testid="button-reset-password"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Resetting...
                            </>
                          ) : (
                            "Reset Password"
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>

                  <motion.div variants={staggerItem} className="mt-4 text-center">
                    <Button
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-sm"
                      data-testid="button-resend-otp"
                    >
                      Didn't receive the code? Resend
                    </Button>
                  </motion.div>

                  <motion.div variants={staggerItem} className="mt-4 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => setStep("email")}
                      className="text-sm text-muted-foreground"
                      data-testid="button-change-email"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Use a different email
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === "success" && (
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
                      Password Reset Successful
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-muted-foreground"
                    >
                      Your password has been successfully reset. You can now sign in with your new password.
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
