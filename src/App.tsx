import React, { useState, useMemo, useEffect } from 'react';
import { BidiProduct, CartItem, OrderDetails, UserReview } from './types';
import { BIDI_PRODUCTS, toBanglaDigits } from './data/bidiData';
import { FLAT_ALL_REVIEWS } from './data/bidiReviews';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterBar, FilterState } from './components/FilterBar';
import { BidiCard } from './components/BidiCard';
import { SmokeLabSection } from './components/SmokeLabSection';
import { CuringTimelineSection } from './components/CuringTimelineSection';
import { EinsteinHistorySection } from './components/EinsteinHistorySection';
import { AtelierExperienceHub } from './components/AtelierExperienceHub';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { DealershipModal } from './components/DealershipModal';
import { BlendFinderQuizModal } from './components/BlendFinderQuizModal';
import { SpinWheelModal } from './components/SpinWheelModal';
import { LeafCertificateModal } from './components/LeafCertificateModal';
import { CompareBarModal } from './components/CompareBarModal';
import { CheckCircle, Flame } from 'lucide-react';

export default function App() {
  // Reviews synced with FLAT_ALL_REVIEWS + localStorage user submissions
  const [reviews, setReviews] = useState<UserReview[]>(() => {
    try {
      const saved = localStorage.getItem('monon_user_reviews_v2');
      if (saved) {
        const parsed: UserReview[] = JSON.parse(saved);
        return [...parsed, ...FLAT_ALL_REVIEWS];
      }
    } catch {
      // Ignore storage errors
    }
    return FLAT_ALL_REVIEWS;
  });

  // Live products with dynamic rating & reviewCount synced with reviews state
  const products = useMemo<BidiProduct[]>(() => {
    const statsByBidi: Record<string, { sum: number; count: number }> = {};
    for (const r of reviews) {
      if (!statsByBidi[r.bidiId]) {
        statsByBidi[r.bidiId] = { sum: 0, count: 0 };
      }
      statsByBidi[r.bidiId].sum += r.rating;
      statsByBidi[r.bidiId].count += 1;
    }
    return BIDI_PRODUCTS.map((p) => {
      const st = statsByBidi[p.id];
      if (!st || st.count === 0) return p;
      return {
        ...p,
        rating: Number((st.sum / st.count).toFixed(1)),
        reviewCount: st.count,
      };
    });
  }, [reviews]);

  // Cart persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('monon_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist persisted in localStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('monon_wishlist_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Placed orders persisted for live tracking
  const [recentOrders, setRecentOrders] = useState<OrderDetails[]>(() => {
    try {
      const saved = localStorage.getItem('monon_orders_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('monon_cart_v2', JSON.stringify(cartItems));
    } catch {
      // Ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('monon_wishlist_v2', JSON.stringify(wishlistIds));
    } catch {
      // Ignore
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('monon_orders_v2', JSON.stringify(recentOrders));
    } catch {
      // Ignore
    }
  }, [recentOrders]);

  // Interactive States
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProductTab, setSelectedProductTab] = useState<'details' | 'reviews'>('details');
  const [smokeLabProductId, setSmokeLabProductId] = useState<string>(BIDI_PRODUCTS[0].id);

  const selectedProduct = useMemo(
    () => (selectedProductId ? products.find((p) => p.id === selectedProductId) || null : null),
    [selectedProductId, products]
  );

  const [compareItemIds, setCompareItemIds] = useState<string[]>([]);
  const compareItems = useMemo(
    () => compareItemIds.map((id) => products.find((p) => p.id === id)).filter((p): p is BidiProduct => Boolean(p)),
    [compareItemIds, products]
  );
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [preAppliedVoucherCode, setPreAppliedVoucherCode] = useState('');

  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | undefined>(undefined);
  const [isDealershipOpen, setIsDealershipOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSpinOpen, setIsSpinOpen] = useState(false);
  const [isLeafCertOpen, setIsLeafCertOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Catalog Filters
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    strength: 'all',
    sortBy: 'featured',
    onlyWishlist: false,
  });

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        if (filters.onlyWishlist && !wishlistIds.includes(item.id)) {
          return false;
        }
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const haystack = [
            item.name,
            item.englishName,
            item.flavor,
            item.tagline,
            item.tobaccoOrigin,
            ...item.effects,
          ]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        if (filters.category !== 'all' && item.category !== filters.category) {
          return false;
        }
        if (filters.strength !== 'all') {
          if (filters.strength === 'mild' && item.strength > 2) return false;
          if (filters.strength === 'medium' && item.strength !== 3) return false;
          if (filters.strength === 'strong' && item.strength < 4) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, filters, wishlistIds]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenProductModal = (product: BidiProduct, tab: 'details' | 'reviews' = 'details') => {
    setSelectedProductTab(tab);
    setSelectedProductId(product.id);
  };

  const handleAddToCart = (product: BidiProduct, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`"${product.name}" ঝুলিতে যোগ হয়েছে (${toBanglaDigits(quantity)} প্যাক)।`);
  };

  const handleInstantOrder = (product: BidiProduct, quantity = 1) => {
    handleAddToCart(product, quantity);
    setSelectedProductId(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('পণ্যটি ঝুলি থেকে সরানো হয়েছে।');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'পছন্দের তালিকা থেকে সরানো হয়েছে।' : 'পছন্দের তালিকায় সংরক্ষিত হয়েছে!');
      return next;
    });
  };

  const handleToggleCompare = (product: BidiProduct) => {
    setCompareItemIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        return prev.filter((id) => id !== product.id);
      }
      if (prev.length >= 3) {
        showToast('সর্বোচ্চ ৩টি সংস্করণ পাশাপাশি তুলনা করা যাবে।');
        return prev;
      }
      return [...prev, product.id];
    });
  };

  const handleAddReview = (newReview: UserReview) => {
    setReviews((prev) => [newReview, ...prev]);
    try {
      const saved = localStorage.getItem('monon_user_reviews_v2');
      const existing: UserReview[] = saved ? JSON.parse(saved) : [];
      localStorage.setItem('monon_user_reviews_v2', JSON.stringify([newReview, ...existing]));
    } catch {
      // Ignore
    }
    showToast('আপনার রিভিউ সফলভাবে প্রকাশিত হয়েছে!');
  };

  const handleOrderSuccess = (order: OrderDetails) => {
    setCartItems([]);
    setRecentOrders((prev) => [order, ...prev]);
    setActiveTrackingOrderId(order.orderId);
    showToast(`ধন্যবাদ ${order.customerName}! অর্ডার ${order.orderId} গৃহীত হয়েছে।`);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 border border-amber-500/70 text-stone-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm"
        >
          <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 3-Zone Header */}
      <Header
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollTo={scrollToSection}
        onOpenDealership={() => setIsDealershipOpen(true)}
      />

      <main className="flex-1">
        {/* 1. Editorial Hero + 4-KPI Strip */}
        <Hero
          totalProducts={products.length}
          totalReviews={reviews.length}
          onExploreClick={() => scrollToSection('bidi-catalog')}
          onSmokeLabClick={() => scrollToSection('smoke-lab')}
          onOpenQuiz={() => setIsQuizOpen(true)}
          onOpenSpin={() => setIsSpinOpen(true)}
          onOpenTracker={() => {
            setActiveTrackingOrderId(recentOrders[0]?.orderId);
            setIsTrackerOpen(true);
          }}
          onOpenLeafCert={() => setIsLeafCertOpen(true)}
        />

        {/* 2. Bidi Catalog Grid */}
        <section
          id="bidi-catalog"
          className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-stone-800/80"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-medium text-amber-400 tracking-wide">
                অফিশিয়াল অনলাইন স্টোর · {toBanglaDigits(products.length)}টি অনন্য সংস্করণ
              </div>
              <h2 className="font-serif-bn text-3xl sm:text-4xl font-bold text-stone-100">
                মনন বিড়ির পূর্ণাঙ্গ সম্ভার
              </h2>
              <p className="text-sm sm:text-base text-stone-400">
                শতভাগ বাছাইকৃত কুষ্টিয়ার তামাক পাতায় প্রস্তুত — প্রতিটি কার্ডে ৪টি ছবি, রেটিং বিস্তারিত ও পাশাপাশি তুলনার সুবিধা।
              </p>
            </div>
          </div>

          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            totalResults={filteredProducts.length}
            wishlistCount={wishlistIds.length}
          />

          {filteredProducts.length === 0 ? (
            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-12 text-center space-y-4">
              <Flame className="w-8 h-8 text-amber-500/60 mx-auto" />
              <h3 className="font-serif-bn text-xl font-bold text-stone-200">
                কোনো সংস্করণ খুঁজে পাওয়া যায়নি
              </h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                আপনার অনুসন্ধান বা ফিল্টারের সাথে মিলছে না। ফিল্টার রিসেট করে সবগুলো সংস্করণ দেখুন।
              </p>
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    searchQuery: '',
                    category: 'all',
                    strength: 'all',
                    sortBy: 'featured',
                    onlyWishlist: false,
                  })
                }
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-lg text-xs font-bold cursor-pointer"
              >
                সব ফিল্টার রিসেট করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredProducts.map((product) => (
                <BidiCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  isCompared={compareItems.some((p) => p.id === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onToggleCompare={handleToggleCompare}
                  onOpenDetails={(p, tab) => handleOpenProductModal(p, tab || 'details')}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 3. SURPRISE: Interactive Live Smoke Chamber & Sound Simulator */}
        <SmokeLabSection
          products={products}
          selectedId={smokeLabProductId}
          onSelectId={setSmokeLabProductId}
          onOpenDetails={(p) => handleOpenProductModal(p, 'details')}
          onAddToCart={(p) => handleAddToCart(p, 1)}
        />

        {/* 4. Interactive 120-Day Kushtia Leaf Curing Timeline */}
        <CuringTimelineSection onOpenLeafCert={() => setIsLeafCertOpen(true)} />

        {/* 5. Albert Einstein 1939 Historic Archive */}
        <EinsteinHistorySection
          products={products}
          onOpenDetails={(p) => handleOpenProductModal(p, 'details')}
          onAddToCart={(p) => handleAddToCart(p, 1)}
        />

        {/* 6. Atelier Interactive Portals (Quiz, Spin Wheel, Tracker, Dealership) */}
        <AtelierExperienceHub
          onOpenQuiz={() => setIsQuizOpen(true)}
          onOpenSpin={() => setIsSpinOpen(true)}
          onOpenTracker={() => {
            setActiveTrackingOrderId(recentOrders[0]?.orderId);
            setIsTrackerOpen(true);
          }}
          onOpenDealership={() => setIsDealershipOpen(true)}
        />
      </main>

      <Footer
        onScrollTo={scrollToSection}
        onOpenDealership={() => setIsDealershipOpen(true)}
        onOpenTracker={() => {
          setActiveTrackingOrderId(recentOrders[0]?.orderId);
          setIsTrackerOpen(true);
        }}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenSpin={() => setIsSpinOpen(true)}
      />

      {/* Floating Comparison Bar + Matrix Modal */}
      <CompareBarModal
        compareItems={compareItems}
        isModalOpen={isCompareModalOpen}
        onOpenModal={() => setIsCompareModalOpen(true)}
        onCloseModal={() => setIsCompareModalOpen(false)}
        onRemoveItem={(id) =>
          setCompareItemIds((prev) => prev.filter((itemId) => itemId !== id))
        }
        onClearAll={() => {
          setCompareItemIds([]);
          setIsCompareModalOpen(false);
        }}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* Product Detail & Interactive Reviews Modal */}
      <ProductDetailModal
        product={selectedProduct}
        initialTab={selectedProductTab}
        onClose={() => setSelectedProductId(null)}
        onAddToCart={handleAddToCart}
        onInstantOrder={handleInstantOrder}
        onTestInSmokeLab={(id) => {
          setSmokeLabProductId(id);
          scrollToSection('smoke-lab');
        }}
        reviews={reviews}
        onAddReview={handleAddReview}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal with Live Stealth Wrapper Preview */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        preAppliedVoucherCode={preAppliedVoucherCode}
        onOrderSuccess={handleOrderSuccess}
        onOpenTrackerForOrder={(orderId) => {
          setIsCheckoutOpen(false);
          setActiveTrackingOrderId(orderId);
          setIsTrackerOpen(true);
        }}
      />

      {/* Live Order Tracker */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        initialOrderId={activeTrackingOrderId}
        recentOrders={recentOrders}
      />

      {/* Dealership Application Modal */}
      <DealershipModal
        isOpen={isDealershipOpen}
        onClose={() => setIsDealershipOpen(false)}
        products={products}
        onSubmitted={() => showToast('ডিলারশিপ আবেদন সফলভাবে জমা হয়েছে!')}
      />

      {/* Blend Sommelier Quiz Modal */}
      <BlendFinderQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        products={products}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onOpenDetails={(p) => handleOpenProductModal(p, 'details')}
      />

      {/* Lucky Spin Wheel Modal */}
      <SpinWheelModal
        isOpen={isSpinOpen}
        onClose={() => setIsSpinOpen(false)}
        onClaimVoucher={(code, title) => {
          setPreAppliedVoucherCode(code);
          showToast(`ভাউচার "${code}" (${title}) আপনার চেকআউটে যুক্ত হয়েছে!`);
        }}
      />

      {/* Leaf Purity Certificate Modal */}
      <LeafCertificateModal
        isOpen={isLeafCertOpen}
        onClose={() => setIsLeafCertOpen(false)}
      />
    </div>
  );
}
