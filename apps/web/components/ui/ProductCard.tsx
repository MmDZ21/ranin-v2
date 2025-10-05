import { ProductDTO } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Phone, ExternalLink } from "lucide-react";

export default function ProductCard({ product }: { product: ProductDTO }) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <div className="aspect-square flex items-center justify-center p-4 sm:p-6">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                width={300}
                height={300}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-300">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-400">بدون تصویر</span>
              </div>
            )}
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* External Link Icon */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-1">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-md">
                {product.code}
              </span>
            </div>
          </div>

          {/* Contact Button */}
          <div className="mt-4 pt-3 border-t border-gray-50">
            <div className="flex items-center justify-center gap-2 text-primary text-sm font-medium group-hover:bg-primary/5 rounded-lg py-2 transition-colors duration-200">
              <Phone className="w-4 h-4" />
              <span>تماس بگیرید</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
