import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShoppingBag, 
  Download, 
  Heart, 
  Clock,
  ArrowRight,
  Settings,
  Package,
  FileDown,
  User,
  Loader2
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useWishlistStore } from "@/stores/wishlistStore";
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
import { staggerContainer, staggerItem } from "@/lib/animations";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Order, OrderItem, Download as DownloadType } from "@shared/schema";

const sidebarItems = [
  { title: "Overview", url: "/dashboard", icon: Package },
  { title: "Purchase History", url: "/dashboard/purchases", icon: ShoppingBag },
  { title: "Downloads", url: "/dashboard/downloads", icon: FileDown },
  { title: "Wishlist", url: "/dashboard/wishlist", icon: Heart },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

type OrderWithItems = Order & { items: OrderItem[] };

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

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  index,
  isLoading = false
}: { 
  title: string; 
  value: string | number; 
  icon: typeof ShoppingBag; 
  index: number;
  isLoading?: boolean;
}) {
  return (
    <motion.div
      variants={staggerItem}
      transition={{ delay: index * 0.1 }}
    >
      <Card data-testid={`stat-card-${title.toLowerCase().replace(' ', '-')}`}>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold" data-testid={`stat-value-${title.toLowerCase().replace(' ', '-')}`}>
              {value}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RecentOrderRow({ 
  order 
}: { 
  order: OrderWithItems;
}) {
  const statusColors: Record<string, string> = {
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    refunded: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  };

  const formattedDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '';

  const totalAmount = parseFloat(order.total) || 0;

  return (
    <div 
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b last:border-b-0"
      data-testid={`order-row-${order.id}`}
    >
      <div className="flex flex-col gap-1">
        <span className="font-medium" data-testid={`order-number-${order.id}`}>
          {order.orderNumber}
        </span>
        <span className="text-sm text-muted-foreground">{formattedDate}</span>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm text-muted-foreground">{order.items?.length || 0} item(s)</span>
        <span className="font-medium" data-testid={`order-total-${order.id}`}>
          ₹{Math.round(totalAmount)}/-
        </span>
        <Badge 
          className={statusColors[order.status] || ""} 
          data-testid={`order-status-${order.id}`}
        >
          {order.status}
        </Badge>
        <Button size="sm" variant="outline" asChild data-testid={`button-download-${order.id}`}>
          <Link href="/dashboard/downloads">
            <Download className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { user, isAuthenticated } = useAuthStore();
  const [, setLocation] = useLocation();
  const wishlistCount = useWishlistStore((state) => state.itemCount());

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login?redirect=/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const { data: orders = [], isLoading: ordersLoading } = useQuery<OrderWithItems[]>({
    queryKey: ['/api/user/orders'],
    enabled: isAuthenticated,
  });

  const { data: downloads = [], isLoading: downloadsLoading } = useQuery<DownloadType[]>({
    queryKey: ['/api/user/downloads'],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const isLoading = ordersLoading || downloadsLoading;
  const totalPurchases = orders.length;
  const totalDownloads = downloads.reduce((acc, d) => acc + (d.downloadCount || 0), 0);
  const activeDownloads = downloads.filter(d => new Date(d.expiresAt) > new Date()).length;

  const stats = [
    { title: "Total Purchases", value: totalPurchases, icon: ShoppingBag },
    { title: "Templates Downloaded", value: totalDownloads, icon: Download },
    { title: "Wishlist Items", value: wishlistCount, icon: Heart },
    { title: "Active Downloads", value: activeDownloads, icon: Clock },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2" data-testid="text-welcome">
            Welcome back, {user?.name || "User"}
          </h1>
          <p className="text-muted-foreground">
            Manage your purchases, downloads, and account settings.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} index={index} isLoading={isLoading} />
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle>Recent Purchases</CardTitle>
                <Button variant="ghost" size="sm" asChild data-testid="link-view-all-orders">
                  <Link href="/dashboard/purchases">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {ordersLoading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    ))}
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div data-testid="recent-orders-list">
                    {recentOrders.map((order) => (
                      <RecentOrderRow key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground" data-testid="empty-orders">
                    No purchases yet. Start browsing our templates!
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button className="w-full justify-start" asChild data-testid="button-browse-templates">
                  <Link href="/products">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Browse Templates
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild data-testid="button-view-wishlist">
                  <Link href="/dashboard/wishlist">
                    <Heart className="h-4 w-4 mr-2" />
                    View Wishlist
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild data-testid="button-account-settings">
                  <Link href="/dashboard/profile">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
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
              <span className="font-semibold">Dashboard</span>
            </div>
            <DashboardContent />
          </div>
        </div>
      </SidebarProvider>
      <Footer />
    </div>
  );
}
