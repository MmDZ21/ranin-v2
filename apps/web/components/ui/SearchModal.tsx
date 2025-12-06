"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Search, Loader2 } from "lucide-react";
import Image from "next/image";
import { Input } from "./input";
import { Button } from "./Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { searchProducts } from "@/actions/products";
import { Product } from "@/types/product.types";
import Link from "next/link";

interface SearchModalProps {
  className?: string;
}

export function SearchModal({ className }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Search effect using debounced query
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      try {
        const result = await searchProducts(debouncedSearchQuery);
        if (result.success && result.data) {
          setSearchResults(result.data);
        } else {
          setSearchResults([]);
        }
        setHasSearched(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // TODO: Navigate to search results page or handle search
      console.log("Searching for:", searchQuery);
      setIsDialogOpen(false);
      setIsDrawerOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const SearchContent = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search className="h-5 w-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 z-10" />
        <Input
          placeholder="جستجو در محصولات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-12 h-12 text-base border-border focus:border-primary/50"
          autoFocus
        />
        {isSearching && (
          <Loader2 className="h-5 w-5 animate-spin absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        )}
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-base text-muted-foreground">در حال جستجو...</span>
            </div>
          ) : hasSearched ? (
            searchResults.length > 0 ? (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground mb-4 px-1">
                  {searchResults.length} نتیجه یافت شد
                </div>
                <div className="space-y-1">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/30 transition-all duration-200 group border border-transparent hover:border-muted/50"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setIsDrawerOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                        setHasSearched(false);
                      }}
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted/20 relative">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Search className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </div>
                        {product.shortDesc && (
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {product.shortDesc}
                          </div>
                        )}
                        {product.brand && (
                          <div className="text-sm text-primary mt-2 font-medium">
                            {product.brand}
                          </div>
                        )}
                      </div>
                      
                      {/* Arrow Icon */}
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-base text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <div className="font-medium">هیچ محصولی یافت نشد</div>
                <div className="text-sm mt-2">کلمات کلیدی دیگری امتحان کنید</div>
              </div>
            )
          ) : null}
        </div>
      )}

      {!searchQuery.trim() && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <div className="text-base text-muted-foreground font-medium">جستجوی خود را تایپ کنید</div>
          <div className="text-sm text-muted-foreground/70 mt-2">برای یافتن محصولات مورد نظرتان</div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop - Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`hidden lg:flex items-center gap-2 ${className}`}
          >
            <Search className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>جستجو در محصولات</DialogTitle>
          </DialogHeader>
          <SearchContent />
        </DialogContent>
      </Dialog>

      {/* Mobile - Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`lg:hidden flex items-center gap-2 ${className}`}
          >
            <Search className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>جستجو در محصولات</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <SearchContent />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
