import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, SlidersHorizontal, X, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const MOCK_PRODUCTS = [
  {
    id: '1',
    slug: 'email-automation-template',
    name: 'Email Automation Template',
    price: 29.99,
    originalPrice: 49.99,
    category: 'Email',
    rating: 4.8,
    reviewCount: 124,
    tags: ['automation', 'email', 'marketing'],
  },
  {
    id: '2',
    slug: 'crm-integration-workflow',
    name: 'CRM Integration Workflow',
    price: 49.99,
    category: 'CRM',
    rating: 4.5,
    reviewCount: 89,
    tags: ['integration', 'crm', 'sales'],
  },
  {
    id: '3',
    slug: 'social-media-scheduler',
    name: 'Social Media Scheduler',
    price: 19.99,
    originalPrice: 29.99,
    category: 'Social',
    rating: 4.9,
    reviewCount: 256,
    tags: ['social', 'scheduling', 'marketing'],
  },
  {
    id: '4',
    slug: 'invoice-generator-pro',
    name: 'Invoice Generator Pro',
    price: 39.99,
    category: 'Finance',
    rating: 4.7,
    reviewCount: 178,
    tags: ['invoice', 'finance', 'automation'],
  },
  {
    id: '5',
    slug: 'lead-capture-automation',
    name: 'Lead Capture Automation',
    price: 59.99,
    originalPrice: 79.99,
    category: 'Marketing',
    rating: 4.6,
    reviewCount: 145,
    tags: ['leads', 'marketing', 'automation'],
  },
  {
    id: '6',
    slug: 'customer-support-bot',
    name: 'Customer Support Bot',
    price: 44.99,
    category: 'Support',
    rating: 4.4,
    reviewCount: 92,
    tags: ['chatbot', 'support', 'automation'],
  },
  {
    id: '7',
    slug: 'data-sync-pipeline',
    name: 'Data Sync Pipeline',
    price: 34.99,
    originalPrice: 44.99,
    category: 'Data',
    rating: 4.8,
    reviewCount: 67,
    tags: ['data', 'sync', 'integration'],
  },
  {
    id: '8',
    slug: 'ecommerce-order-workflow',
    name: 'E-commerce Order Workflow',
    price: 54.99,
    category: 'E-commerce',
    rating: 4.9,
    reviewCount: 203,
    tags: ['ecommerce', 'orders', 'automation'],
  },
  {
    id: '9',
    slug: 'hr-onboarding-automation',
    name: 'HR Onboarding Automation',
    price: 64.99,
    originalPrice: 89.99,
    category: 'HR',
    rating: 4.7,
    reviewCount: 112,
    tags: ['hr', 'onboarding', 'automation'],
  },
];

const CATEGORIES = ['Email', 'CRM', 'Social', 'Finance', 'Marketing', 'Support', 'Data', 'E-commerce', 'HR'];
const TAGS = ['automation', 'email', 'marketing', 'integration', 'crm', 'sales', 'social', 'data'];

type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'popular';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredProducts = useMemo(() => {
    let filtered = [...MOCK_PRODUCTS];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) => p.tags?.some((t) => selectedTags.includes(t)));
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategories, selectedTags, priceRange, minRating, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setPriceRange([0, 100]);
    setMinRating(0);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedTags.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 100 ||
    minRating > 0;

  const FilterContent = () => (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['categories', 'price', 'tags', 'rating']}>
        <AccordionItem value="categories">
          <AccordionTrigger data-testid="accordion-categories">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                    data-testid={`checkbox-category-${category.toLowerCase()}`}
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger data-testid="accordion-price">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={(value) => {
                  setPriceRange(value as [number, number]);
                  setCurrentPage(1);
                }}
                min={0}
                max={100}
                step={5}
                data-testid="slider-price"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tags">
          <AccordionTrigger data-testid="accordion-tags">Tags</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                  data-testid={`badge-tag-${tag}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger data-testid="accordion-rating">Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={minRating === rating}
                    onCheckedChange={() => {
                      setMinRating(minRating === rating ? 0 : rating);
                      setCurrentPage(1);
                    }}
                    data-testid={`checkbox-rating-${rating}`}
                  />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rating ? 'fill-foreground text-foreground' : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                    <span className="text-sm ml-1">& up</span>
                  </div>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
          data-testid="button-clear-filters"
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl font-bold mb-8" data-testid="text-page-title">
              Browse Templates
            </h1>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h2 className="font-semibold mb-4">Filters</h2>
                <FilterContent />
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9"
                    data-testid="input-search"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden" data-testid="button-filters-mobile">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filters
                        {hasActiveFilters && (
                          <Badge variant="default" className="ml-2">
                            {selectedCategories.length + selectedTags.length + (minRating > 0 ? 1 : 0)}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger className="w-[180px]" data-testid="select-sort">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={viewMode === 'grid' ? 'bg-muted' : ''}
                      onClick={() => setViewMode('grid')}
                      data-testid="button-view-grid"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={viewMode === 'list' ? 'bg-muted' : ''}
                      onClick={() => setViewMode('list')}
                      data-testid="button-view-list"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mb-4 text-sm text-muted-foreground">
                Showing {paginatedProducts.length} of {filteredProducts.length} templates
              </div>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ProductCardSkeleton key={i} viewMode={viewMode} />
                    ))}
                  </motion.div>
                ) : paginatedProducts.length > 0 ? (
                  <motion.div
                    key="products"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }
                  >
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} {...product} viewMode={viewMode} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    className="text-center py-16"
                  >
                    <p className="text-muted-foreground mb-4">No templates found matching your criteria.</p>
                    <Button variant="outline" onClick={clearFilters} data-testid="button-clear-empty">
                      Clear Filters
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    data-testid="button-prev-page"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                      data-testid={`button-page-${page}`}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    data-testid="button-next-page"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
