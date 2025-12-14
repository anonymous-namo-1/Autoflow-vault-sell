import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ShoppingBag, 
  Download, 
  Heart, 
  ChevronDown,
  ChevronUp,
  Package,
  FileDown,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
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
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Order, OrderItem } from "@shared/schema";

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

function OrderRow({ order }: { order: OrderWithItems }) {
  const [isExpanded, setIsExpanded] = useState(false);

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
  const totalAmount = parseFloat(String(order.total)) || 0;

  return (
    <>
      <TableRow 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        data-testid={`order-row-${order.id}`}
      >
        <TableCell>
          <div className="flex items-center gap-2">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="font-medium" data-testid={`order-number-${order.id}`}>
              {order.orderNumber}
            </span>
          </div>
        </TableCell>
        <TableCell>{formattedDate}</TableCell>
        <TableCell>{order.items?.length || 0} item(s)</TableCell>
        <TableCell className="font-medium" data-testid={`order-total-${order.id}`}>
          ₹{Math.round(totalAmount)}/-
        </TableCell>
        <TableCell>
          <Badge className={statusColors[order.status] || ""} data-testid={`order-status-${order.id}`}>
            {order.status}
          </Badge>
        </TableCell>
        <TableCell>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={(e) => e.stopPropagation()}
            asChild
            data-testid={`button-download-all-${order.id}`}
          >
            <Link href="/dashboard/downloads">
              <Download className="h-4 w-4 mr-1" />
              Download All
            </Link>
          </Button>
        </TableCell>
      </TableRow>
      <AnimatePresence>
        {isExpanded && order.items && order.items.length > 0 && (
          <TableRow data-testid={`order-items-${order.id}`}>
            <TableCell colSpan={6} className="bg-muted/30 p-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-2">
                  {order.items.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-3 bg-background rounded-md"
                      data-testid={`order-item-${item.id}`}
                    >
                      <span className="font-medium">{item.product?.name || 'Product'}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">₹{Math.round(item.price)}/-</span>
                        <Button size="sm" variant="ghost" asChild data-testid={`button-download-item-${item.id}`}>
                          <Link href="/dashboard/downloads">
                            <Download className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileOrderCard({ order }: { order: OrderWithItems }) {
  const [isExpanded, setIsExpanded] = useState(false);

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
  const totalAmount = parseFloat(String(order.total)) || 0;

  return (
    <Card data-testid={`mobile-order-${order.id}`}>
      <CardContent className="p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div>
            <div className="font-medium" data-testid={`mobile-order-number-${order.id}`}>
              {order.orderNumber}
            </div>
            <div className="text-sm text-muted-foreground">{formattedDate}</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusColors[order.status] || ""}>
              {order.status}
            </Badge>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="text-sm text-muted-foreground">{order.items?.length || 0} item(s)</div>
          <div className="font-semibold">₹{Math.round(totalAmount)}/-</div>
        </div>

        <AnimatePresence>
          {isExpanded && order.items && order.items.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                  >
                    <span className="text-sm">{item.product?.name || 'Product'}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">₹{Math.round(item.price)}/-</span>
                      <Button size="icon" variant="ghost" asChild>
                        <Link href="/dashboard/downloads">
                          <Download className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-3" variant="outline" size="sm" asChild>
                <Link href="/dashboard/downloads">
                  <Download className="h-4 w-4 mr-1" />
                  Download All
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function PurchaseHistoryContent() {
  const { isAuthenticated } = useAuthStore();
  const [, setLocation] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login?redirect=/dashboard/purchases");
    }
  }, [isAuthenticated, setLocation]);

  const { data: orders = [], isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ['/api/user/orders'],
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

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            Purchase History
          </h1>
          <p className="text-muted-foreground">
            View and manage all your orders and downloads.
          </p>
        </motion.div>

        {isLoading ? (
          <Card>
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          </Card>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-12 text-center" data-testid="empty-orders">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start exploring our templates and make your first purchase.
                </p>
                <Button asChild data-testid="button-browse-templates">
                  <Link href="/products">Browse Templates</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block"
            >
              <Card>
                <Table data-testid="orders-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.map((order) => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:hidden space-y-4"
              data-testid="mobile-orders-list"
            >
              {paginatedOrders.map((order) => (
                <MobileOrderCard key={order.id} order={order} />
              ))}
            </motion.div>

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 mt-6"
                data-testid="pagination"
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  data-testid="button-next-page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function PurchaseHistory() {
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
              <span className="font-semibold">Purchase History</span>
            </div>
            <PurchaseHistoryContent />
          </div>
        </div>
      </SidebarProvider>
      <Footer />
    </div>
  );
}
