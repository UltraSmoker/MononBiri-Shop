import React, { useState } from 'react';
import { BidiProduct } from '../types';
import { formatMoney, toBanglaDigits } from '../data/bidiData';
import { Star, ShoppingBag, Check, ChevronLeft, ChevronRight, Heart, Scale } from 'lucide-react';

interface BidiCardProps {
  product: BidiProduct;
  isWishlisted: boolean;
  isCompared: boolean;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare: (product: BidiProduct) => void;
  onOpenDetails: (product: BidiProduct, initialTab?: 'details' | 'reviews') => void;
  onAddToCart: (product: BidiProduct) => void;
}

export const BidiCard: React.FC<BidiCardProps> = ({
  product,
  isWishlisted,
  isCompared,
  onToggleWishlist,
  onToggleCompare,
  onOpenDetails,
  onAddToCart,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  const priceText = product.priceDisplay || formatMoney(product.price, product.currency);
  const origPriceText =
    product.originalPriceDisplay ||
    (product.originalPrice ? formatMoney(product.originalPrice, product.currency) : undefined);

  return (
    <article
      id={`bidi-card-${product.id}`}
      onClick={() => onOpenDetails(product, 'details')}
      className={`group bg-stone-900/75 border rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between cursor-pointer ${
        product.isExtreme
          ? 'border-rose-900/60 hover:border-rose-500/70'
          : 'border-stone-800 hover:border-amber-600/60'
      }`}
    >
      {/* Top Imagery (Aspect 4:3 — 65%+ of card visual weight) */}
      <div className="relative aspect-[4/3] bg-stone-950 overflow-hidden select-none">
        <img
          src={product.images[currentImageIndex]}
          alt={`${product.name} — ${product.imageCaptions[currentImageIndex] || ''}`}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-black/20" />

        {/* Single subtle text tag top-left (no badge sandwich) */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-md ${
              product.isExtreme
                ? 'bg-rose-950/90 text-rose-200 border border-rose-700/50'
                : 'bg-stone-950/85 text-amber-300 border border-stone-700/80'
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Quick Wishlist & Compare affordance buttons top-right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            aria-label="Compare edition"
            title={isCompared ? 'তুলনা থেকে সরান' : 'পাশাপাশি তুলনায় যোগ করুন'}
            className={`p-2 rounded-lg backdrop-blur-md border transition-colors cursor-pointer ${
              isCompared
                ? 'bg-amber-600 text-stone-950 border-amber-400'
                : 'bg-stone-950/75 text-stone-300 border-stone-700/70 hover:text-amber-300'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            aria-label="Save to favorites"
            title={isWishlisted ? 'পছন্দ থেকে সরান' : 'পছন্দে সংরক্ষণ করুন'}
            className={`p-2 rounded-lg backdrop-blur-md border transition-colors cursor-pointer ${
              isWishlisted
                ? 'bg-rose-600/90 text-white border-rose-400'
                : 'bg-stone-950/75 text-stone-300 border-stone-700/70 hover:text-rose-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Hover Photo Switcher Arrows */}
        {product.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-stone-950/80 text-stone-200 border border-stone-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-stone-950/80 text-stone-200 border border-stone-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Photo index indicator */}
        <div className="absolute bottom-2.5 right-3 text-[11px] font-mono tabular-nums text-stone-300">
          {toBanglaDigits(currentImageIndex + 1)}/{toBanglaDigits(product.images.length)}
        </div>
      </div>

      {/* Content Area — Clean typographic hierarchy, zero pill clutter */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Unboxed Metadata Line */}
          <div className="flex items-center justify-between gap-2 text-xs text-stone-400">
            <span className="truncate">
              {product.categoryLabel} · {toBanglaDigits(product.stickCount)} শলাকা
            </span>

            {/* Clickable Star Rating jumping straight to Reviews */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(product, 'reviews');
              }}
              title="ক্লিক করে রেটিং ও রিভিউ দেখুন"
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline shrink-0 cursor-pointer font-mono tabular-nums"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-semibold text-stone-200">{toBanglaDigits(product.rating.toFixed(1))}</span>
              <span className="text-stone-400">({toBanglaDigits(product.reviewCount)})</span>
            </button>
          </div>

          {/* Product Title */}
          <h3 className="font-serif-bn text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Flavor summary */}
          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
            {product.flavor}
          </p>
        </div>

        {/* Price Baseline & Add to Cart */}
        <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className={`font-mono tabular-nums font-bold ${
                  product.isExtreme
                    ? 'text-sm sm:text-base text-rose-400'
                    : product.isHistoric
                    ? 'text-sm sm:text-base text-amber-300'
                    : 'text-lg text-amber-400'
                }`}
              >
                {priceText}
              </span>
              {origPriceText && (
                <span className="text-xs text-stone-500 line-through font-mono tabular-nums">
                  {origPriceText}
                </span>
              )}
            </div>
            <span className="text-[11px] text-stone-500 block">
              {product.isExtreme
                ? 'সিঙ্গেল কসমিক শলাকা'
                : `বিস্তারিত ও ${toBanglaDigits(product.reviewCount)}টি রিভিউ দেখুন`}
            </span>
          </div>

          <button
            type="button"
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
              isAddedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>যুক্ত</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>যোগ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
