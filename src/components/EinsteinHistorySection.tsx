import React, { useState } from 'react';
import { BidiProduct } from '../types';
import { einsteinHistoryImg, formatMoney } from '../data/bidiData';
import { ArrowRight, Play, Pause, Quote } from 'lucide-react';

interface EinsteinHistorySectionProps {
  products: BidiProduct[];
  onOpenDetails: (product: BidiProduct) => void;
  onAddToCart: (product: BidiProduct) => void;
}

const ARCHIVE_CHAPTERS = [
  {
    time: '০৯:১৫ AM · ২ আগস্ট, ১৯৩৯',
    title: 'পেকোনিক সামার কটেজ, লং আইল্যান্ড',
    text: 'পদার্থবিজ্ঞানী লিও জিলার্ড মার্কিন প্রেসিডেন্ট রুজভেল্টকে চিঠি পাঠানোর খসড়া নিয়ে আলবার্ট আইনস্টাইনের গ্রীষ্মকালীন কটেজে পৌঁছান।',
  },
  {
    time: '১১:৪০ AM · গবেষণা ও ধোঁয়া বিরতি',
    title: 'কুষ্টিয়ার পদ্মাপাড়ের ভিন্টেজ টিন',
    text: 'গভীর তাত্ত্বিক হিসাবের মাঝে স্নায়ুর প্রশান্তি আনতে আইনস্টাইন বেঙ্গল থেকে আনীত ওক-ফারমেন্টেড মনন তামাকের শলাকায় আগুন ধরান।',
  },
  {
    time: '০২:১০ PM · ঐতিহাসিক স্বাক্ষর',
    title: 'ইতিহাসের মোড় ঘোরানো মুহূর্ত',
    text: 'ধোঁয়ার শান্ত আবহে চূড়ান্ত চিঠিতে স্বাক্ষর করেন আইনস্টাইন—আর সেই টেবিলের পাশের টিনটিই আজ মনন ১৯৩৯ আর্কাইভের প্রেরণা।',
  },
];

export const EinsteinHistorySection: React.FC<EinsteinHistorySectionProps> = ({
  products,
  onOpenDetails,
  onAddToCart,
}) => {
  const einsteinProduct =
    products.find((p) => p.id === 'monon-einstein-1939') || products[0];
  const [activeChapter, setActiveChapter] = useState(0);
  const [isPlayingDoc, setIsPlayingDoc] = useState(false);

  const priceText =
    einsteinProduct.priceDisplay ||
    formatMoney(einsteinProduct.price, einsteinProduct.currency);

  return (
    <section
      id="einstein-history"
      className="py-16 sm:py-24 bg-stone-950 border-b border-stone-800/80 text-stone-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-medium text-amber-400 tracking-wide">
            ঐতিহাসিক আর্কাইভ · প্রিন্সটন ও কুষ্টিয়া · ১৯৩৯
          </div>
          <h2 className="font-serif-bn text-3xl sm:text-4xl font-bold text-stone-100">
            আলবার্ট আইনস্টাইন ও মনন বিড়ির ঐতিহাসিক যোগসূত্র
          </h2>
          <p className="text-sm sm:text-base text-stone-400 leading-relaxed">
            ১৯৩৯ সালের ২ আগস্ট লং আইল্যান্ডের সামার কটেজে পদার্থবিজ্ঞানী লিও জিলার্ডের সাথে ঐতিহাসিক বৈঠকে আইনস্টাইনের তাত্ত্বিক মনোযোগের সঙ্গী ছিল কুষ্টিয়ার কিউর্ড মনন বিড়ি।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left: Archival Photograph & Interactive Chapter Player */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-stone-900/60 border border-stone-800 rounded-2xl overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={einsteinHistoryImg}
                alt="১৯৩৯ সালের ২ আগস্ট লং আইল্যান্ডে আলবার্ট আইনস্টাইন ও লিও জিলার্ড"
                className={`w-full h-full object-cover object-top transition-all duration-700 ${
                  isPlayingDoc ? 'scale-[1.03] sepia-[0.15]' : 'sepia-[0.35]'
                }`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/35 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
                <div>
                  <span className="font-mono text-[11px] text-amber-300 block">
                    ARCHIVE CODE · MONON-1939-AE
                  </span>
                  <h3 className="font-serif-bn text-lg font-bold text-stone-100">
                    {ARCHIVE_CHAPTERS[activeChapter].title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlayingDoc((p) => !p)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold cursor-pointer shrink-0"
                >
                  {isPlayingDoc ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingDoc ? 'বিরতি' : 'আর্কাইভ পাঠ'}</span>
                </button>
              </div>
            </div>

            {/* Chapter Switcher */}
            <div className="p-5 space-y-3 border-t border-stone-800/80">
              <div className="flex flex-wrap gap-2">
                {ARCHIVE_CHAPTERS.map((ch, idx) => (
                  <button
                    key={ch.time}
                    type="button"
                    onClick={() => setActiveChapter(idx)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-mono transition-colors cursor-pointer ${
                      activeChapter === idx
                        ? 'bg-amber-600 text-stone-950 font-bold'
                        : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    অধ্যায় {idx + 1}
                  </button>
                ))}
              </div>
              <div className="text-xs text-amber-400 font-mono">
                {ARCHIVE_CHAPTERS[activeChapter].time}
              </div>
              <p className="text-sm text-stone-300 leading-relaxed">
                {ARCHIVE_CHAPTERS[activeChapter].text}
              </p>
            </div>
          </div>

          {/* Right: Editorial Narrative, Quote & Collector Edition CTA */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <h3 className="font-serif-bn text-2xl sm:text-3xl font-bold text-stone-100 leading-snug">
                মহাবিশ্বের রহস্য উন্মোচনে কুষ্টিয়ার খাঁটি তামাক পাতার শান্তিময় ভূমিকা
              </h3>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                ১৯৩৯ সালের ঐতিহাসিক সেই গ্রীষ্মে গভীর একাগ্রতা ও স্নায়ুর প্রশান্তি বজায় রাখতে আইনস্টাইন বেছে নিয়েছিলেন পদ্মা চরের ওক-কিউরড তামাক পাতা। সেই অবিস্মরণীয় ইতিহাসের শ্রদ্ধার্ঘ্য হিসেবে সংরক্ষিত রয়েছে <strong className="text-amber-300">আইনস্টাইন ১৯৩৯ ঐতিহাসিক সংস্করণ</strong>।
              </p>

              {/* Clean Typographic Quote (No thick border-l-4 cliché) */}
              <blockquote className="bg-stone-900/60 border border-stone-800 rounded-xl p-5 space-y-2 relative">
                <Quote className="w-6 h-6 text-amber-500/30 absolute top-4 right-4" />
                <p className="font-serif-bn text-sm sm:text-base italic text-amber-100 leading-relaxed pr-6">
                  “তামাকুর স্নিগ্ধ ও শান্ত ধোঁয়া মানুষের বুদ্ধিবৃত্তিক জটিলতা ও অস্থিরতাকে শান্ত করে। গভীর গাণিতিক সমীকরণের গোলকধাঁধায় এটি আমাকে এক অবর্ণনীয় একাগ্রতা এনে দেয়।”
                </p>
                <footer className="text-xs text-amber-400 font-mono">
                  — আলবার্ট আইনস্টাইন (লং আইল্যান্ড ডায়েরি নোটস, ১৯৩৯)
                </footer>
              </blockquote>
            </div>

            {/* Collector Purchase Strip */}
            <div className="bg-stone-900/70 border border-amber-700/40 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="text-xs text-stone-400">সংগ্রাহক ভিন্টেজ অ্যান্টিক বক্স · ২৫ শলাকা</div>
                  <div className="font-serif-bn text-lg font-bold text-stone-100">
                    {einsteinProduct.name}
                  </div>
                </div>
                <div className="font-mono tabular-nums text-xl font-bold text-amber-400">
                  {priceText}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onOpenDetails(einsteinProduct)}
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-5 py-2.5 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  <span>বিস্তারিত ও ৪০টি রিভিউ দেখুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onAddToCart(einsteinProduct)}
                  className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <span>ঝুলিতে যোগ করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
