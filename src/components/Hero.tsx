import React from 'react';
import { ArrowDown, Flame, Compass, Sparkles, Search } from 'lucide-react';
import { heroBannerImg, mononModernGoldImg, toBanglaDigits } from '../data/bidiData';

interface HeroProps {
  totalProducts?: number;
  totalReviews?: number;
  onExploreClick: () => void;
  onSmokeLabClick: () => void;
  onOpenQuiz: () => void;
  onOpenSpin: () => void;
  onOpenTracker: () => void;
  onOpenLeafCert: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalProducts = 13,
  totalReviews = 479,
  onExploreClick,
  onSmokeLabClick,
  onOpenQuiz,
  onOpenSpin,
  onOpenTracker,
  onOpenLeafCert,
}) => {
  return (
    <section className="relative bg-stone-950 border-b border-stone-800/80 overflow-hidden">
      {/* Subtle warm radial ambient glow */}
      <div
        className="absolute -top-24 left-1/3 w-[560px] h-[420px] rounded-full bg-amber-600/8 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 lg:pt-16 lg:pb-16 relative z-10 space-y-12">
        {/* 12-Column Editorial Split with items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Narrative Column (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Quiet unboxed metadata kicker */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-amber-400 tracking-wide">
                <span>স্থাপিত ১৯৫৪</span>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span>গড়াই অববাহিকা, কুষ্টিয়া</span>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span>১০০% প্রাকৃতিক তেন্দুপাতা ও বায়ো-ফিল্টার</span>
              </div>

              <h1 className="font-serif-bn text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-stone-100 leading-[1.15] tracking-tight">
                শতবর্ষের খাঁটি তামাক ঐতিহ্য,{' '}
                <span className="text-amber-400">আধুনিক কারিগরির অভিজাত রূপ।</span>
              </h1>

              <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                কুষ্টিয়ার পলিমাটিতে প্রাকৃতিকভাবে রোদে ১২০ দিন কিউর করা শীর্ষ গ্রেডের তামাক পাতা থেকে তৈরি — ক্লাসিক <strong className="text-amber-200 font-semibold">মেঘের গর্জ্জন</strong> ও <strong className="text-amber-200 font-semibold">দার্শনিক আড্ডা</strong> থেকে আধুনিক <strong className="text-amber-200 font-semibold">মনন গোল্ড ফিল্টার</strong> এবং <strong className="text-amber-200 font-semibold">আইস ক্রাশ</strong> পর্যন্ত।
              </p>

              {/* Primary + Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  id="hero-explore-btn"
                  onClick={onExploreClick}
                  className="inline-flex items-center gap-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-colors cursor-pointer whitespace-nowrap shadow-lg shadow-amber-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <span>পণ্য সম্ভার ও অর্ডার করুন</span>
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onSmokeLabClick}
                  className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-amber-200 font-semibold px-5 py-3.5 rounded-xl text-sm transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>ভার্চুয়াল স্মোক ল্যাব</span>
                </button>
              </div>
            </div>

            {/* Interactive Utility Shortcuts Row (Below primary CTAs, not in Header) */}
            <div className="pt-6 border-t border-stone-800/80 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-stone-300">
              <button
                type="button"
                onClick={onOpenQuiz}
                className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>স্বাদ নির্বাচক কুইজ</span>
              </button>
              <button
                type="button"
                onClick={onOpenSpin}
                className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ভাগ্যের চাকা ও ভাউচার</span>
              </button>
              <button
                type="button"
                onClick={onOpenTracker}
                className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>অর্ডার ট্র্যাকিং</span>
              </button>
              <button
                type="button"
                onClick={onOpenLeafCert}
                className="inline-flex items-center gap-1.5 text-stone-400 hover:text-amber-300 transition-colors cursor-pointer whitespace-nowrap underline underline-offset-4 decoration-stone-700"
              >
                <span>তামাক পাতার মান সনদ দেখুন</span>
              </button>
            </div>
          </div>

          {/* Right Stretched Visual Showcase (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[340px] lg:min-h-[430px] rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 group">
              <img
                src={heroBannerImg}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = mononModernGoldImg;
                }}
                alt="মনন প্রিমিয়াম বিড়ি — কুষ্টিয়ার খাঁটি তামাক পাতা ও গোল্ড ফিল্টার সিরিজ"
                className="w-full h-full object-cover lg:h-full group-hover:scale-[1.03] transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              {/* Measured Contrast Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/35 to-transparent" />

              {/* Bottom Editorial Caption inside frame */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-300 font-medium">
                  <span>কুষ্টিয়া অরিজিনাল কালেকশন</span>
                  <span className="font-mono tabular-nums text-stone-200">৳৩,৫০০ – ৳৬,০০০</span>
                </div>
                <h2 className="font-serif-bn text-xl sm:text-2xl font-bold text-stone-100">
                  গোল্ড ফিল্টার থেকে মহাজাগতিক এক্সট্রিম
                </h2>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {toBanglaDigits(totalProducts)}টি অনন্য সংস্করণ · প্রতিটিতে ৩৬+ যাচাইকৃত ও চমকপ্রদ গ্রাহক রিভিউ।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column KPI Strip Below Hero Split */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-stone-800/80">
          <div className="space-y-1">
            <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-amber-400">
              ৭০+ বছর
            </div>
            <div className="text-sm font-medium text-stone-200">ঐতিহ্যবাহী কারিগরি</div>
            <div className="text-xs text-stone-400">১৯৫৪ থেকে কুষ্টিয়া সেন্ট্রাল ফ্যাক্টরি</div>
          </div>

          <div className="space-y-1">
            <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-stone-100">
              ১০০% খাঁটি
            </div>
            <div className="text-sm font-medium text-stone-200">বাছাইকৃত তামাক পাতা</div>
            <div className="text-xs text-stone-400">১২০ দিন প্রাকৃতিক রোদে কিউরিং</div>
          </div>

          <div className="space-y-1">
            <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-stone-100">
              ৬৪ জেলা
            </div>
            <div className="text-sm font-medium text-stone-200">গোপনীয় হোম ডেলিভারি</div>
            <div className="text-xs text-stone-400">বইয়ের মলাট ও নথিপত্র মোড়ক</div>
          </div>

          <div className="space-y-1">
            <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-amber-400">
              {toBanglaDigits(totalReviews)}+ রিভিউ
            </div>
            <div className="text-sm font-medium text-stone-200">যাচাইকৃত অভিজ্ঞতা</div>
            <div className="text-xs text-stone-400">মানুষ থেকে বিলিয়নিয়ার ও এলিয়েন</div>
          </div>
        </div>
      </div>
    </section>
  );
};
