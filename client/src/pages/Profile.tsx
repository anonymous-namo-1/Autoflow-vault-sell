import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  ShoppingBag, 
  Download, 
  Heart, 
  Package,
  FileDown,
  User,
  Camera,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const sidebarItems = [
  { title: "Overview", url: "/dashboard", icon: Package },
  { title: "Purchase History", url: "/dashboard/purchases", icon: ShoppingBag },
  { title: "Downloads", url: "/dashboard/downloads", icon: FileDown },
  { title: "Wishlist", url: "/dashboard/wishlist", icon: Heart },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

function DashboardSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function ProfileContent() {
  const { user, updateUser } = useAuthStore();
  const { toast } = useToast();
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsProfileSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateUser({ name: data.name });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProfileSaving(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsPasswordSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Password update:", data);
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
      passwordForm.reset();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const accountCreatedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "December 2024";

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and avatar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                    <AvatarFallback className="text-2xl">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="absolute -bottom-2 -right-2 rounded-full"
                    data-testid="button-upload-avatar"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Your name"
                                data-testid="input-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div>
                        <FormLabel>Email</FormLabel>
                        <Input 
                          value={user?.email || ""} 
                          disabled 
                          className="mt-2"
                          data-testid="input-email"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Email cannot be changed.
                        </p>
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isProfileSaving}
                        data-testid="button-save-profile"
                      >
                        {isProfileSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password"
                            placeholder="Enter current password"
                            data-testid="input-current-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password"
                            placeholder="Enter new password"
                            data-testid="input-new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password"
                            placeholder="Confirm new password"
                            data-testid="input-confirm-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={isPasswordSaving}
                    data-testid="button-update-password"
                  >
                    {isPasswordSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Update Password
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Details about your account status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Account Created</span>
                  <span className="font-medium" data-testid="text-account-created">
                    {accountCreatedDate}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email Verification</span>
                  {user?.isVerified ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" data-testid="badge-verified">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600" data-testid="badge-unverified">
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Verified
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function Profile() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex flex-1 w-full">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 p-4 border-b lg:hidden">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <span className="font-semibold">Profile</span>
            </div>
            <ProfileContent />
          </div>
        </div>
      </SidebarProvider>
      <Footer />
    </div>
  );
}
