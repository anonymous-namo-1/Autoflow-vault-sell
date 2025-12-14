import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShoppingBag, 
  Download, 
  Heart, 
  Package,
  FileDown,
  User,
  Code,
  Trash2,
  ShoppingCart
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
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
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

function WishlistCard({ 
  item, 
  index,
  onRemove,
  onAddToCart 
}: { 
  item: { id: string; productId: string; name: string; price: number; originalPrice?: number; image?: string };
  index: number;
  onRemove: () => void;
  onAddToCart: () => void;
}) {
  return (
    <motion.div
      variants={staggerItem}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className="overflow-visible hover-elevate transition-all duration-300"
        data-testid={`wishlist-card-${item.productId}`}
      >
        <CardContent className="p-0">
          <div className="aspect-video bg-muted relative overflow-hidden rounded-t-xl">
            {item.image ? (
              <img 
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Code className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
            <Button
              size="icon"
              variant="outline"
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
              onClick={onRemove}
              data-testid={`button-remove-wishlist-${item.productId}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="p-4">
            <h3 
              className="font-semibold mb-1 truncate"
              data-testid={`wishlist-name-${item.productId}`}
            >
              {item.name}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span 
                className="text-lg font-bold"
                data-testid={`wishlist-price-${item.productId}`}
              >
                ₹{Math.round(item.price)}/-
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{Math.round(item.originalPrice)}/-
                </span>
              )}
            </div>
            <Button 
              className="w-full"
              onClick={onAddToCart}
              data-testid={`button-add-to-cart-${item.productId}`}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WishlistContent() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
  };

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
            Wishlist
          </h1>
          <p className="text-muted-foreground">
            {items.length > 0 
              ? `You have ${items.length} item${items.length > 1 ? 's' : ''} in your wishlist.`
              : 'Your wishlist is empty.'
            }
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-12 text-center" data-testid="empty-wishlist">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-4">
                  Browse our templates and add your favorites to the wishlist.
                </p>
                <Button asChild data-testid="button-browse-templates">
                  <Link href="/products">Browse Templates</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-testid="wishlist-grid"
          >
            {items.map((item, index) => (
              <WishlistCard
                key={item.id}
                item={item}
                index={index}
                onRemove={() => removeItem(item.productId)}
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function Wishlist() {
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
              <span className="font-semibold">Wishlist</span>
            </div>
            <WishlistContent />
          </div>
        </div>
      </SidebarProvider>
      <Footer />
    </div>
  );
}
