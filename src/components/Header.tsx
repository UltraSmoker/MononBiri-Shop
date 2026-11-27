import React, { useState } from 'react';
import { ShoppingBag, X, Menu } from 'lucide-react';
import { CartItem } from '../types';
import { formatMoney } from '../data/bidiData';

interface HeaderProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onScrollTo: (elementId: string) => void;
  onOpenDealership: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  onOpenCart,
  onScrollTo,
  onOpenDealership,
}) => {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotalBDT = cartItems.reduce(
    (acc, item) => acc + (item.product.currency === 'USD' ? 0 : item.product.price * item.quantity),
    0
  );
  const hasUsdItem = cartItems.some((item) => item.product.currency === 'USD');

  const navItems = [
    { label: 'পণ্য সম্ভার', action: () => onScrollTo('bidi-catalog') },
    { label: 'স্মোক ল্যাব', action: () => onScrollTo('smoke-lab') },
    { label: 'তামাকের মান', action: () => onScrollTo('curing-timeline') },
    { label: 'আর্কাইভ ১৯৩৯', action: () => onScrollTo('einstein-history') },
    { label: 'ডিলারশিপ', action: onOpenDealership },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-950/92 backdrop-blur-md border-b border-stone-800/80 text-stone-100">
      {/* Slim Dismissible Announcement Bar (<= 36px height) */}
      {!bannerDismissed && (
        <div className="bg-stone-900 border-b border-stone-800/80 h-8 px-4 flex items-center justify-between text-[11px] sm:text-xs text-stone-300">
          <div className="w-4 shrink-0" />
          <p className="truncate text-center">
            ১০০% বাছাইকৃত কুষ্টিয়ার তামাক পাতায় প্রস্তুত · ৬৪ জেলায় গোপনীয় হোম ডেলিভারি
          </p>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            aria-label="Close announcement"
            className="text-stone-400 hover:text-stone-200 p-1 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Strictly 1-Row, 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Clean single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
        >
          <span className="font-cinzel text-lg font-bold text-amber-400 tracking-tight">ম</span>
          <span className="font-serif-bn text-xl sm:text-2xl font-bold tracking-tight text-stone-100 group-hover:text-amber-300 transition-colors">
            মনন বিড়ি
          </span>
        </button>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-300">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors py-1 border-b border-transparent hover:border-amber-400/70 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action (Cart Button) + Mobile Menu trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            id="cart-trigger-btn"
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>অর্ডার ঝুলি</span>
            {totalItemsCount > 0 && (
              <span className="font-mono tabular-nums text-xs bg-stone-950 text-amber-300 px-1.5 py-0.5 rounded">
                {totalItemsCount}
                {!hasUsdItem && cartSubtotalBDT > 0 ? ` · ${formatMoney(cartSubtotalBDT)}` : ''}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="lg:hidden p-2 rounded-lg border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-stone-700 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-stone-950 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                item.action();
              }}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-stone-300 hover:text-amber-300 hover:bg-stone-900 rounded-lg transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
