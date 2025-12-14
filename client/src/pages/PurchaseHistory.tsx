import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ChevronRight
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
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const sidebarItems = [
  { title: "Overview", url: "/dashboard", icon: Package },
  { title: "Purchase History", url: "/dashboard/purchases", icon: ShoppingBag },
  { title: "Downloads", url: "/dashboard/downloads", icon: FileDown },
  { title: "Wishlist", url: "/dashboard/wishlist", icon: Heart },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

interface OrderItem {
  id: string;
  name: string;
  price: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: string;
  status: string;
  items: OrderItem[];
}

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

function OrderRow({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors: Record<string, string> = {
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    refunded: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  };

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
        <TableCell>{order.date}</TableCell>
        <TableCell>{order.items.length} item(s)</TableCell>
        <TableCell className="font-medium" data-testid={`order-total-${order.id}`}>
          {order.total}
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
            data-testid={`button-download-all-${order.id}`}
          >
            <Download className="h-4 w-4 mr-1" />
            Download All
          </Button>
        </TableCell>
      </TableRow>
      <AnimatePresence>
        {isExpanded && (
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
                      <span className="font-medium">{item.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">{item.price}</span>
                        <Button size="sm" variant="ghost" data-testid={`button-download-item-${item.id}`}>
                          <Download className="h-4 w-4" />
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

function MobileOrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors: Record<string, string> = {
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    refunded: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  };

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
            <div className="text-sm text-muted-foreground">{order.date}</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusColors[order.status] || ""}>
              {order.status}
            </Badge>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="text-sm text-muted-foreground">{order.items.length} item(s)</div>
          <div className="font-semibold">{order.total}</div>
        </div>

        <AnimatePresence>
          {isExpanded && (
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
                    <span className="text-sm">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.price}</span>
                      <Button size="icon" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-3" variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download All
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function PurchaseHistoryContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const orders: Order[] = [
    { 
      id: "1", 
      orderNumber: "ORD-2024-001", 
      date: "Dec 10, 2024", 
      total: "₹12,499/-", 
      status: "paid",
      items: [
        { id: "1a", name: "Email Automation Suite", price: "₹6,599/-" },
        { id: "1b", name: "CRM Integration Pack", price: "₹5,900/-" },
      ]
    },
    { 
      id: "2", 
      orderNumber: "ORD-2024-002", 
      date: "Dec 8, 2024", 
      total: "₹6,599/-", 
      status: "paid",
      items: [
        { id: "2a", name: "Social Media Scheduler", price: "₹6,599/-" },
      ]
    },
    { 
      id: "3", 
      orderNumber: "ORD-2024-003", 
      date: "Dec 5, 2024", 
      total: "₹16,599/-", 
      status: "pending",
      items: [
        { id: "3a", name: "Analytics Dashboard Pro", price: "₹8,299/-" },
        { id: "3b", name: "Invoice Generator", price: "₹4,150/-" },
        { id: "3c", name: "Task Workflow Bundle", price: "₹4,150/-" },
      ]
    },
    { 
      id: "4", 
      orderNumber: "ORD-2024-004", 
      date: "Nov 28, 2024", 
      total: "₹7,499/-", 
      status: "paid",
      items: [
        { id: "4a", name: "Lead Generation Template", price: "₹7,499/-" },
      ]
    },
    { 
      id: "5", 
      orderNumber: "ORD-2024-005", 
      date: "Nov 20, 2024", 
      total: "₹10,799/-", 
      status: "refunded",
      items: [
        { id: "5a", name: "Customer Support Bot", price: "₹10,799/-" },
      ]
    },
  ];

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

        {orders.length === 0 ? (
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
