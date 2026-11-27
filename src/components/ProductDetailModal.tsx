import React, { useState, useEffect, useRef } from 'react';
import { BidiProduct, UserReview } from '../types';
import { formatMoney, toBanglaDigits } from '../data/bidiData';
import {
  X,
  Star,
  ShoppingBag,
  ShieldCheck,
  Check,
  Flame,
  ThumbsUp,
  AlertTriangle,
  Newspaper,
  Sparkles,
  Plus,
  Minus,
  ArrowDown,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: BidiProduct | null;
  initialTab?: 'details' | 'reviews';
  onClose: () => void;
  onAddToCart: (product: BidiProduct, quantity: number) => void;
  onInstantOrder: (product: BidiProduct, quantity: number) => void;
  onTestInSmokeLab: (productId: string) => void;
  reviews: UserReview[];
  onAddReview: (review: UserReview) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialTab = 'details',
  onClose,
  onAddToCart,
  onInstantOrder,
  onTestInSmokeLab,
  reviews,
  onAddReview,
}) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedStarFilter, setSelectedStarFilter] = useState<'all' | number>('all');
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [justAdded, setJustAdded] = useState(false);
  const [highlightReviews, setHighlightReviews] = useState(false);

  // Inline review writer
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [revName, setRevName] = useState('');
  const [revLocation, setRevLocation] = useState('ঢাকা');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  const reviewsSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToReviews = () => {
    setTimeout(() => {
      if (reviewsSectionRef.current) {
        reviewsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHighlightReviews(true);
        setTimeout(() => setHighlightReviews(false), 1200);
      }
    }, 80);
  };

  useEffect(() => {
    setActiveImgIndex(0);
    setQuantity(1);
    setSelectedStarFilter('all');
    setShowWriteForm(false);
    if (product && initialTab === 'reviews') {
      scrollToReviews();
    }
  }, [product, initialTab]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!product) return null;

  const productReviews = reviews.filter((r) => r.bidiId === product.id);
  const totalCount = productReviews.length;

  const avgRating =
    totalCount > 0
      ? (productReviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1)
      : product.rating.toFixed(1);

  const starCounts: Record<number, number> = {
    5: productReviews.filter((r) => r.rating === 5).length,
    4: productReviews.filter((r) => r.rating === 4).length,
    3: productReviews.filter((r) => r.rating === 3).length,
    2: productReviews.filter((r) => r.rating === 2).length,
    1: productReviews.filter((r) => r.rating === 1).length,
  };

  const filteredReviews =
    selectedStarFilter === 'all'
      ? productReviews
      : productReviews.filter((r) => r.rating === selectedStarFilter);

  const priceText = product.priceDisplay || formatMoney(product.price, product.currency);
  const origPriceText =
    product.originalPriceDisplay ||
    (product.originalPrice ? formatMoney(product.originalPrice, product.currency) : undefined);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleSubmitNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) return;
    onAddReview({
      id: `user-rev-${Date.now()}`,
      bidiId: product.id,
      bidiName: product.name,
      userName: revName.trim(),
      userRole: 'যাচাইকৃত ক্রেতা',
      location: revLocation.trim() || 'বাংলাদেশ',
      rating: revRating,
      date: 'এইমাত্র',
      comment: revComment.trim(),
      funnyEffectWitnessed: 'অসাধারণ স্মোক ও খাঁটি তামাক পাতার স্বাদ।',
      helpfulCount: 1,
      avatarSeed: revName.trim(),
      verifiedPurchase: true,
    });
    setRevName('');
    setRevComment('');
    setShowWriteForm(false);
    setSelectedStarFilter('all');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto p-5 sm:p-8 relative shadow-2xl space-y-6"
      >
        {/* Sticky Modal Header Bar */}
        <div className="sticky top-0 z-20 -mx-5 sm:-mx-8 -mt-5 sm:-mt-8 px-5 sm:px-8 py-3.5 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 flex items-center justify-between gap-4">
          <div className="min-w-0 flex items-center gap-2 text-xs text-stone-400">
            <span className="font-semibold text-amber-400 truncate">{product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.name}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Contiguous Product & Purchase Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 4-Photo Gallery (6 Cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 bg-stone-950 relative">
              <img
                src={product.images[activeImgIndex]}
                alt={`${product.name} - ${product.imageCaptions[activeImgIndex] || ''}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {product.imageCaptions[activeImgIndex] && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3.5 text-xs text-stone-200">
                  {product.imageCaptions[activeImgIndex]}
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImgIndex(idx)}
                  className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImgIndex === idx
                      ? 'border-amber-500 opacity-100'
                      : 'border-stone-800 opacity-65 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`ছবি ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Purchase Info & Specs (6 Cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
                <span>
                  {product.categoryLabel} · {toBanglaDigits(product.stickCount)} শলাকা
                </span>
                <button
                  type="button"
                  onClick={scrollToReviews}
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer font-mono tabular-nums"
                >
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{toBanglaDigits(avgRating)}</span>
                  <span className="text-stone-400">
                    ({toBanglaDigits(totalCount)}টি রিভিউ)
                  </span>
                </button>
              </div>

              <h2 className="font-serif-bn text-2xl sm:text-3xl font-bold text-stone-100 leading-snug">
                {product.name}
              </h2>

              <p className="text-sm text-stone-300 leading-relaxed">{product.tagline}</p>

              {/* Prominent Scroll-to-Reviews Trigger */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={scrollToReviews}
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 bg-stone-950 hover:bg-stone-800 border border-amber-700/50 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>রেটিং ও {toBanglaDigits(totalCount)}টি রিভিউ দেখুন</span>
                  <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>

            {/* Key Specifications */}
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold pb-1.5 border-b border-stone-800/80">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{product.tobaccoOrigin}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-stone-300">
                <div>
                  <span className="text-stone-500 block">ফ্লেভার নোট</span>
                  <span className="text-amber-200">{product.flavor}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">ফিল্টার ও মোড়ক</span>
                  <span>{product.filterType}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">প্যাকেজিং</span>
                  <span>{product.packaging}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">তীব্রতা</span>
                  <span className="text-amber-300">{product.intensity}</span>
                </div>
              </div>
            </div>

            {/* Price & Quantity Stepper */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span
                    className={`font-mono tabular-nums text-2xl sm:text-3xl font-bold ${
                      product.isExtreme ? 'text-rose-400' : 'text-amber-400'
                    }`}
                  >
                    {priceText}
                  </span>
                  {origPriceText && (
                    <span className="text-sm text-stone-500 line-through font-mono tabular-nums">
                      {origPriceText}
                    </span>
                  )}
                </div>
                <span className="text-xs text-emerald-400 font-medium">{product.stockStatus}</span>
              </div>

              <div className="inline-flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-2 rounded-md hover:bg-stone-800 text-stone-300 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono tabular-nums text-sm font-bold text-stone-100">
                  {toBanglaDigits(quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="p-2 rounded-md hover:bg-stone-800 text-stone-300 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer border ${
                  justAdded
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border-stone-700'
                }`}
              >
                {justAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{justAdded ? 'ঝুলিতে যুক্ত হয়েছে' : 'কার্টে যোগ করুন'}</span>
              </button>

              <button
                type="button"
                onClick={() => onInstantOrder(product, quantity)}
                className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                সরাসরি অর্ডার করুন
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onTestInSmokeLab(product.id);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-300 text-xs font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>ভার্চুয়াল স্মোক ল্যাবে এর ধোঁয়া ও সুবাস পরীক্ষা করুন</span>
            </button>
          </div>
        </div>

        {/* Dedicated Ratings & Reviews Breakdown Section */}
        <div
          id="modal-reviews-section"
          ref={reviewsSectionRef}
          className={`pt-8 border-t border-stone-800 space-y-6 rounded-xl transition-all duration-300 ${
            highlightReviews ? 'ring-2 ring-amber-500/70 p-4 bg-stone-950/60' : ''
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-bn text-xl sm:text-2xl font-bold text-stone-100">
                গ্রাহক রেটিং ও {toBanglaDigits(totalCount)}টি যাচাইকৃত রিভিউ
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                যেকোনো স্টার রেটিং বার-এ ক্লিক করে নির্দিষ্ট রিভিউ ফিল্টার করুন
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowWriteForm((v) => !v)}
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-300 text-xs font-semibold cursor-pointer"
            >
              {showWriteForm ? 'ফর্ম বন্ধ করুন' : '+ আপনার রিভিউ লিখুন'}
            </button>
          </div>

          {/* Inline Write Review Form */}
          {showWriteForm && (
            <form
              onSubmit={handleSubmitNewReview}
              className="bg-stone-950 border border-amber-700/40 rounded-xl p-4 sm:p-5 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                  placeholder="আপনার নাম *"
                  className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  value={revLocation}
                  onChange={(e) => setRevLocation(e.target.value)}
                  placeholder="এলাকা / জেলা"
                  className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
                <select
                  value={revRating}
                  onChange={(e) => setRevRating(Number(e.target.value))}
                  className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-500"
                >
                  <option value={5}>৫ স্টার — অসাধারণ</option>
                  <option value={4}>৪ স্টার — চমৎকার</option>
                  <option value={3}>৩ স্টার — ভালো</option>
                  <option value={2}>২ স্টার — মোটামুটি</option>
                  <option value={1}>১ স্টার — সতর্কবার্তা</option>
                </select>
              </div>
              <textarea
                required
                rows={2}
                value={revComment}
                onChange={(e) => setRevComment(e.target.value)}
                placeholder="আপনার বাস্তব অভিজ্ঞতা লিখুন *"
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs cursor-pointer"
              >
                রিভিউ প্রকাশ করুন
              </button>
            </form>
          )}

          {/* Interactive 5-Star Breakdown Card */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 text-center md:text-left space-y-1 md:border-r border-stone-800 md:pr-6">
              <div className="font-mono tabular-nums text-4xl sm:text-5xl font-bold text-amber-400">
                {toBanglaDigits(avgRating)}
                <span className="text-lg text-stone-500 font-normal"> / ৫</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(Number(avgRating)) ? 'fill-amber-400' : 'text-stone-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-stone-400">
                মোট {toBanglaDigits(totalCount)}টি যাচাইকৃত অভিজ্ঞতার ভিত্তিতে
              </p>
              {selectedStarFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedStarFilter('all')}
                  className="text-xs text-amber-300 underline cursor-pointer pt-1"
                >
                  সব স্টার ({toBanglaDigits(totalCount)}টি) দেখুন
                </button>
              )}
            </div>

            {/* Clickable 5 to 1 Star Bars */}
            <div className="md:col-span-8 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = starCounts[star] || 0;
                const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                const active = selectedStarFilter === star;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedStarFilter(active ? 'all' : star)}
                    className={`w-full flex items-center gap-3 p-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                      active ? 'bg-amber-950/60 ring-1 ring-amber-500/60' : 'hover:bg-stone-900'
                    }`}
                  >
                    <span className="w-16 text-left font-mono tabular-nums text-stone-200 font-medium shrink-0">
                      {toBanglaDigits(star)} স্টার
                    </span>
                    <div className="flex-1 h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          star === 1 && product.isExtreme ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-20 text-right font-mono tabular-nums text-stone-400 shrink-0">
                      {toBanglaDigits(count)} ({toBanglaDigits(pct)}%)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extreme Bidi Special Warning Banner */}
          {product.isExtreme && (
            <div className="bg-rose-950/50 border border-rose-700/60 rounded-xl p-4 text-xs text-rose-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>বিশেষ সতর্কতা · বিলিয়নিয়ার ব্রেকিং নিউজ ও এলিয়েন রিভিউ আর্কাইভ</span>
              </div>
              <p className="leading-relaxed">
                ১-স্টার রিভিউগুলোর নিচে রয়টার্স/বিবিসি-র ব্রেকিং নিউজ আপডেট সংযুক্ত রয়েছে। অন্যদিকে ৫-স্টার রিভিউগুলো অ্যান্ড্রোমিডা ও কেপলার-২২বি গ্রহের ভিনগ্রহবাসী ক্রেতাদের পাঠানো!
              </p>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-400 bg-stone-950 rounded-xl border border-stone-800">
                এই স্টার রেটিংয়ের কোনো রিভিউ পাওয়া যায়নি।
              </div>
            ) : (
              filteredReviews.map((rev) => {
                const isLiked = Boolean(likedIds[rev.id]);
                return (
                  <div
                    key={rev.id}
                    className={`rounded-xl p-4 border space-y-2.5 text-xs ${
                      rev.isAlien
                        ? 'bg-emerald-950/20 border-emerald-800/50'
                        : rev.newsUpdate
                        ? 'bg-stone-950 border-rose-900/50'
                        : 'bg-stone-950 border-stone-800'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-stone-100">{rev.userName}</span>
                          {rev.verifiedBadge && (
                            <span className="text-[11px] font-medium text-amber-300">
                              · {rev.verifiedBadge}
                            </span>
                          )}
                          {rev.isAlien && (
                            <span className="text-[11px] font-semibold text-emerald-400">
                              · ভিনগ্রহের ভেরিফাইড ক্রেতা
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {rev.userRole} · {rev.location} · {rev.date}
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-amber-400' : 'text-stone-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-stone-200 text-xs sm:text-sm leading-relaxed">
                      {rev.comment}
                    </p>

                    {rev.funnyEffectWitnessed && (
                      <div className="text-[11px] text-amber-300/90 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>{rev.funnyEffectWitnessed}</span>
                      </div>
                    )}

                    {/* Billionaire Breaking News Update */}
                    {rev.newsUpdate && (
                      <div className="bg-rose-950/60 border border-rose-700/60 rounded-lg p-3 space-y-1 text-rose-100">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-rose-300">
                          <span className="inline-flex items-center gap-1.5">
                            <Newspaper className="w-3.5 h-3.5" />
                            {rev.newsUpdate.source}
                          </span>
                          <span>{rev.newsUpdate.time}</span>
                        </div>
                        <div className="font-bold text-xs text-white">{rev.newsUpdate.headline}</div>
                        <p className="text-[11px] text-rose-200/90 leading-relaxed">
                          {rev.newsUpdate.text}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-end pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setLikedIds((prev) => ({ ...prev, [rev.id]: !prev[rev.id] }))
                        }
                        className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md border transition-colors cursor-pointer font-mono tabular-nums ${
                          isLiked
                            ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>সহায়ক ({toBanglaDigits(rev.helpfulCount + (isLiked ? 1 : 0))})</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
