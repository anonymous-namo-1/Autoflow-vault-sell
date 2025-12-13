import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image?: string;
  rating: number;
  reviewCount?: number;
  tags?: string[];
  viewMode?: 'grid' | 'list';
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  originalPrice,
  category,
  image,
  rating,
  reviewCount = 0,
  viewMode = 'grid',
}: ProductCardProps) {
  const { addItem, hasItem } = useCartStore();
  const { toggleItem, hasItem: isInWishlist } = useWishlistStore();

  const inCart = hasItem(id);
  const inWishlist = isInWishlist(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `cart-${id}`,
      productId: id,
      name,
      price,
      originalPrice,
      image,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: `wishlist-${id}`,
      productId: id,
      name,
      price,
      originalPrice,
      image,
    });
  };

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-3.5 h-3.5',
          i < Math.floor(rating) ? 'fill-foreground text-foreground' : 'text-muted-foreground'
        )}
      />
    ));
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href={`/products/${slug}`}>
          <Card
            className="group overflow-visible hover-elevate cursor-pointer"
            data-testid={`card-product-${id}`}
          >
            <CardContent className="p-0">
              <div className="flex gap-6 p-4">
                <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                  )}
                  {discount > 0 && (
                    <Badge className="absolute top-2 left-2" variant="default">
                      -{discount}%
                    </Badge>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {category}
                    </Badge>
                    <h3 className="font-semibold text-lg mb-1" data-testid={`text-product-name-${id}`}>
                      {name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(rating)}
                      <span className="text-sm text-muted-foreground ml-1">({reviewCount})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold" data-testid={`text-price-${id}`}>
                        ${price.toFixed(2)}
                      </span>
                      {originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleToggleWishlist}
                        data-testid={`button-wishlist-${id}`}
                        className={cn(inWishlist && 'text-red-500')}
                      >
                        <Heart className={cn('w-5 h-5', inWishlist && 'fill-current')} />
                      </Button>
                      <Button
                        onClick={handleAddToCart}
                        data-testid={`button-add-cart-${id}`}
                        disabled={inCart}
                      >
                        {inCart ? 'In Cart' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${slug}`}>
        <Card
          className="group overflow-visible hover-elevate cursor-pointer"
          data-testid={`card-product-${id}`}
        >
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-t-xl">
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ShoppingCart className="w-12 h-12" />
                  </div>
                )}
              </div>

              {discount > 0 && (
                <Badge className="absolute top-3 left-3" variant="default">
                  -{discount}%
                </Badge>
              )}

              <motion.button
                className={cn(
                  'absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border transition-colors',
                  inWishlist ? 'text-red-500' : 'text-foreground'
                )}
                onClick={handleToggleWishlist}
                whileTap={{ scale: 0.9 }}
                data-testid={`button-wishlist-${id}`}
              >
                <Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} />
              </motion.button>

              <motion.div
                className="absolute bottom-0 left-0 right-0 p-3 invisible group-hover:visible"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                style={{ visibility: 'hidden' }}
              >
                <div className="group-hover:visible invisible">
                  <Button
                    className="w-full"
                    onClick={handleAddToCart}
                    data-testid={`button-add-cart-${id}`}
                    disabled={inCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {inCart ? 'In Cart' : 'Add to Cart'}
                  </Button>
                </div>
              </motion.div>
            </div>

            <div className="p-4 space-y-2">
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
              <h3 className="font-semibold line-clamp-1" data-testid={`text-product-name-${id}`}>
                {name}
              </h3>
              <div className="flex items-center gap-1">
                {renderStars(rating)}
                <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" data-testid={`text-price-${id}`}>
                  ${price.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export function ProductCardSkeleton({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <Card className="overflow-visible">
        <CardContent className="p-0">
          <div className="flex gap-6 p-4">
            <div className="w-48 h-32 flex-shrink-0 rounded-md bg-muted animate-pulse" />
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-5 w-20 bg-muted animate-pulse rounded" />
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-7 w-20 bg-muted animate-pulse rounded" />
                <div className="h-9 w-32 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-visible">
      <CardContent className="p-0">
        <div className="aspect-[4/3] bg-muted animate-pulse rounded-t-xl" />
        <div className="p-4 space-y-2">
          <div className="h-5 w-16 bg-muted animate-pulse rounded" />
          <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-6 w-20 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
