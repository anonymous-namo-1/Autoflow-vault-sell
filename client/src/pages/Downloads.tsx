import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShoppingBag, 
  Download, 
  Heart, 
  Package,
  FileDown,
  User,
  Code,
  Clock,
  AlertCircle,
  ExternalLink,
  Play
} from "lucide-react";
import { SiGoogledrive, SiYoutube } from "react-icons/si";
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
import { format } from "date-fns";
import type { Product } from "@shared/schema";

const sidebarItems = [
  { title: "Overview", url: "/dashboard", icon: Package },
  { title: "Purchase History", url: "/dashboard/purchases", icon: ShoppingBag },
  { title: "Downloads", url: "/dashboard/downloads", icon: FileDown },
  { title: "Wishlist", url: "/dashboard/wishlist", icon: Heart },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

interface DownloadWithProduct {
  id: string;
  userId: string;
  orderId: string;
  productId: string;
  token: string;
  downloadCount: number | null;
  maxDownloads: number | null;
  expiresAt: string;
  createdAt: string;
  product: Product;
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

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function DownloadCard({ item, index }: { item: DownloadWithProduct; index: number }) {
  const downloadCount = item.downloadCount || 0;
  const maxDownloads = item.maxDownloads || 5;
  const downloadPercentage = (downloadCount / maxDownloads) * 100;
  const isLimitReached = downloadCount >= maxDownloads;
  const isExpired = new Date(item.expiresAt) < new Date();
  const youtubeId = item.product.youtubeVideoUrl ? extractYoutubeId(item.product.youtubeVideoUrl) : null;

  return (
    <motion.div
      variants={staggerItem}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className={isExpired ? "opacity-60" : ""}
        data-testid={`download-card-${item.id}`}
      >
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-24 h-24 bg-muted rounded-md flex items-center justify-center shrink-0 overflow-hidden">
                {item.product.images && item.product.images.length > 0 ? (
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
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
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Purchased: {format(new Date(item.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  {isExpired && (
                    <Badge variant="outline" className="text-destructive border-destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Expired
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Downloads: {downloadCount} / {maxDownloads}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Expires: {format(new Date(item.expiresAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <Progress 
                    value={downloadPercentage} 
                    className="h-2"
                    data-testid={`download-progress-${item.id}`}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.product.driveDownloadUrl ? (
                    <Button
                      disabled={isExpired || isLimitReached}
                      asChild={!isExpired && !isLimitReached}
                      data-testid={`button-drive-download-${item.id}`}
                    >
                      {isExpired || isLimitReached ? (
                        <>
                          <SiGoogledrive className="h-4 w-4 mr-2" />
                          {isLimitReached ? "Limit Reached" : "Expired"}
                        </>
                      ) : (
                        <a 
                          href={item.product.driveDownloadUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <SiGoogledrive className="h-4 w-4 mr-2" />
                          Download from Drive
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </Button>
                  ) : (
                    <Button
                      disabled={isExpired || isLimitReached}
                      asChild={!isExpired && !isLimitReached}
                      data-testid={`button-download-${item.id}`}
                    >
                      {isExpired || isLimitReached ? (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          {isLimitReached ? "Limit Reached" : "Expired"}
                        </>
                      ) : (
                        <a href={`/api/user/download/${item.token}`}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      )}
                    </Button>
                  )}
                  
                  <Button variant="outline" asChild data-testid={`button-view-product-${item.id}`}>
                    <Link href={`/products/${item.product.slug}`}>
                      View Product
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {youtubeId && !isExpired && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <SiYoutube className="h-4 w-4 text-red-600" />
                  Tutorial Video
                </h4>
                <div className="aspect-video rounded-md overflow-hidden bg-muted">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={`${item.product.name} Tutorial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    data-testid={`video-tutorial-${item.id}`}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DownloadsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="w-full sm:w-24 h-24 rounded-md" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-2 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-40" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DownloadsContent() {
  const { data: downloads, isLoading, error } = useQuery<DownloadWithProduct[]>({
    queryKey: ['/api/user/downloads'],
  });

  const activeDownloads = downloads?.filter((d) => new Date(d.expiresAt) >= new Date()) || [];
  const expiredDownloads = downloads?.filter((d) => new Date(d.expiresAt) < new Date()) || [];

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
            Access and download your purchased templates. Each product includes a Google Drive link for easy download and a tutorial video to help you get started.
          </p>
        </motion.div>

        {isLoading ? (
          <DownloadsSkeleton />
        ) : error ? (
          <Card>
            <CardContent className="p-12 text-center" data-testid="error-downloads">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">Failed to load downloads</h3>
              <p className="text-muted-foreground mb-4">
                Please try again later or contact support if the problem persists.
              </p>
              <Button onClick={() => window.location.reload()} data-testid="button-retry">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : !downloads || downloads.length === 0 ? (
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
                  Purchase templates to access downloads here. Each purchase includes download access and tutorial videos.
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
