import React, { useState } from 'react';
import { CURING_STAGES } from '../data/bidiData';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface CuringTimelineSectionProps {
  onOpenLeafCert: () => void;
}

export const CuringTimelineSection: React.FC<CuringTimelineSectionProps> = ({
  onOpenLeafCert,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = CURING_STAGES[activeIndex];

  return (
    <section id="curing-timeline" className="py-16 sm:py-20 bg-stone-950 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-medium text-amber-400 tracking-wide">
              ১০০% খাঁটি তামাক পাতা · ১২০ দিনের কিউরিং প্রক্রিয়া
            </div>
            <h2 className="font-serif-bn text-3xl sm:text-4xl font-bold text-stone-100">
              কুষ্টিয়ার পদ্মাপাড় থেকে শলাকা — ৪ ধাপের শুদ্ধতা
            </h2>
            <p className="text-sm sm:text-base text-stone-400">
              কোনো ডাস্ট, কাঠের গুঁড়া বা কৃত্রিম কেমিক্যাল নয় — প্রাকৃতিক রোদ, ছায়া ও ওক পিপায় ১২০ দিন পরিপক্ব হওয়া তামাক পাতার প্রতিটি ধাপ দেখুন।
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenLeafCert}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-amber-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer self-start md:self-auto whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ল্যাব পিউরিটি সনদ দেখুন</span>
          </button>
        </div>

        {/* Interactive 4-Step Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CURING_STAGES.map((stage, idx) => {
            const active = idx === activeIndex;
            return (
              <button
                key={stage.day}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`text-left p-4 rounded-xl border transition-colors cursor-pointer space-y-1 ${
                  active
                    ? 'bg-stone-900 border-amber-500 text-stone-100'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                <div className="text-xs font-mono tabular-nums text-amber-400 font-semibold">
                  {stage.day}
                </div>
                <div className="font-serif-bn text-sm sm:text-base font-bold leading-snug">
                  {stage.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Inspection Panel (Clean, no nested boxes inside boxes) */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-mono text-amber-400">
              {current.day} · {current.subtitle}
            </div>
            <h3 className="font-serif-bn text-2xl sm:text-3xl font-bold text-stone-100">
              {current.title}
            </h3>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              {current.detail}
            </p>
            <p className="text-xs sm:text-sm text-amber-200/90 italic pt-2">
              {current.craftsmanNote}
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 pt-4 lg:pt-0 lg:pl-8 lg:border-l border-stone-800">
            <div className="flex items-baseline justify-between border-b border-stone-800/80 pb-3">
              <span className="text-xs text-stone-400">পাতার আর্দ্রতা</span>
              <span className="font-mono tabular-nums text-base font-bold text-stone-100">
                {current.moisture}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-b border-stone-800/80 pb-3">
              <span className="text-xs text-stone-400">সুবাস ও অ্যারোমা</span>
              <span className="font-mono tabular-nums text-base font-bold text-amber-400">
                {current.aromaIndex}
              </span>
            </div>
            <div className="flex items-baseline justify-between pb-1">
              <span className="text-xs text-stone-400">ক্লোরোফিল শোধন</span>
              <span className="font-mono tabular-nums text-base font-bold text-emerald-400">
                {current.chlorophyllDrop}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % CURING_STAGES.length)}
              className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-amber-300 hover:text-amber-200 pt-2 cursor-pointer self-start"
            >
              <span>পরবর্তী ধাপ দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
