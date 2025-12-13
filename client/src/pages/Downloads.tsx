import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShoppingBag, 
  Download, 
  Heart, 
  Package,
  FileDown,
  User,
  Code,
  Clock,
  AlertCircle
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
import { staggerContainer, staggerItem } from "@/lib/animations";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const sidebarItems = [
  { title: "Overview", url: "/dashboard", icon: Package },
  { title: "Purchase History", url: "/dashboard/purchases", icon: ShoppingBag },
  { title: "Downloads", url: "/dashboard/downloads", icon: FileDown },
  { title: "Wishlist", url: "/dashboard/wishlist", icon: Heart },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

interface DownloadItem {
  id: string;
  name: string;
  image?: string;
  purchaseDate: string;
  downloadCount: number;
  maxDownloads: number;
  expirationDate: string;
  isExpired: boolean;
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

function DownloadCard({ item, index }: { item: DownloadItem; index: number }) {
  const downloadPercentage = (item.downloadCount / item.maxDownloads) * 100;
  const isLimitReached = item.downloadCount >= item.maxDownloads;

  return (
    <motion.div
      variants={staggerItem}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className={item.isExpired ? "opacity-60" : ""}
        data-testid={`download-card-${item.id}`}
      >
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-24 h-24 bg-muted rounded-md flex items-center justify-center shrink-0">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <Code className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <h3 
                    className="font-semibold text-lg truncate"
                    data-testid={`download-name-${item.id}`}
                  >
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Purchased: {item.purchaseDate}
                  </p>
                </div>
                {item.isExpired && (
                  <Badge variant="outline" className="text-destructive border-destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Expired
                  </Badge>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Downloads: {item.downloadCount} / {item.maxDownloads}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Expires: {item.expirationDate}
                  </span>
                </div>
                <Progress 
                  value={downloadPercentage} 
                  className="h-2"
                  data-testid={`download-progress-${item.id}`}
                />
              </div>

              <Button
                disabled={item.isExpired || isLimitReached}
                className="w-full sm:w-auto"
                data-testid={`button-download-${item.id}`}
              >
                <Download className="h-4 w-4 mr-2" />
                {isLimitReached ? "Limit Reached" : item.isExpired ? "Expired" : "Download"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DownloadsContent() {
  const downloads: DownloadItem[] = [
    {
      id: "1",
      name: "Email Automation Suite",
      purchaseDate: "Dec 10, 2024",
      downloadCount: 2,
      maxDownloads: 5,
      expirationDate: "Dec 10, 2025",
      isExpired: false,
    },
    {
      id: "2",
      name: "CRM Integration Pack",
      purchaseDate: "Dec 10, 2024",
      downloadCount: 1,
      maxDownloads: 5,
      expirationDate: "Dec 10, 2025",
      isExpired: false,
    },
    {
      id: "3",
      name: "Social Media Scheduler",
      purchaseDate: "Dec 8, 2024",
      downloadCount: 3,
      maxDownloads: 5,
      expirationDate: "Dec 8, 2025",
      isExpired: false,
    },
    {
      id: "4",
      name: "Analytics Dashboard Pro",
      purchaseDate: "Nov 15, 2023",
      downloadCount: 5,
      maxDownloads: 5,
      expirationDate: "Nov 15, 2024",
      isExpired: true,
    },
    {
      id: "5",
      name: "Lead Generation Template",
      purchaseDate: "Nov 28, 2024",
      downloadCount: 0,
      maxDownloads: 5,
      expirationDate: "Nov 28, 2025",
      isExpired: false,
    },
  ];

  const activeDownloads = downloads.filter((d) => !d.isExpired);
  const expiredDownloads = downloads.filter((d) => d.isExpired);

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            Downloads
          </h1>
          <p className="text-muted-foreground">
            Access and download your purchased templates.
          </p>
        </motion.div>

        {downloads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-12 text-center" data-testid="empty-downloads">
                <Download className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No downloads yet</h3>
                <p className="text-muted-foreground mb-4">
                  Purchase templates to access downloads here.
                </p>
                <Button asChild data-testid="button-browse-templates">
                  <Link href="/products">Browse Templates</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {activeDownloads.length > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-4 mb-8"
              >
                <h2 className="text-lg font-semibold" data-testid="text-active-downloads">
                  Active Downloads ({activeDownloads.length})
                </h2>
                {activeDownloads.map((item, index) => (
                  <DownloadCard key={item.id} item={item} index={index} />
                ))}
              </motion.div>
            )}

            {expiredDownloads.length > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-muted-foreground" data-testid="text-expired-downloads">
                  Expired Downloads ({expiredDownloads.length})
                </h2>
                {expiredDownloads.map((item, index) => (
                  <DownloadCard key={item.id} item={item} index={index} />
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Downloads() {
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
              <span className="font-semibold">Downloads</span>
            </div>
            <DownloadsContent />
          </div>
        </div>
      </SidebarProvider>
      <Footer />
    </div>
  );
}
