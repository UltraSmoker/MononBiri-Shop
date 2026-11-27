import React from 'react';
import { ShieldAlert, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onScrollTo: (elementId: string) => void;
  onOpenDealership: () => void;
  onOpenTracker: () => void;
  onOpenQuiz: () => void;
  onOpenSpin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollTo,
  onOpenDealership,
  onOpenTracker,
  onOpenQuiz,
  onOpenSpin,
}) => {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-300">
      {/* Statutory Health Warning */}
      <div className="bg-stone-900 border-b border-stone-800 py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-xs text-amber-300 font-medium text-center">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            বিধিবদ্ধ সতর্কীকরণ: ধূমপান স্বাস্থ্যের জন্য ক্ষতিকর। ১৮ বছরের কম বয়সীদের কাছে তামাকজাত পণ্য বিক্রয় নিষিদ্ধ।
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="font-cinzel text-xl font-bold text-amber-400">ম</span>
              <span className="font-serif-bn text-2xl font-bold text-stone-100">মনন বিড়ি</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              ১৯৫৪ সাল থেকে কুষ্টিয়ার গড়াই নদীর তীরে প্রস্তুতকৃত শতভাগ খাঁটি তামাক পাতা, প্রাকৃতিক তেন্দুপাতা ও আধুনিক সেলুলোজ ফিল্টারের ঐতিহ্যবাহী সম্ভার।
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-stone-100 text-sm">দ্রুত নেভিগেশন</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => onScrollTo('bidi-catalog')}
                  className="hover:text-amber-300 cursor-pointer"
                >
                  সকল পণ্য সম্ভার
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onScrollTo('smoke-lab')}
                  className="hover:text-amber-300 cursor-pointer"
                >
                  ভার্চুয়াল স্মোক ল্যাব
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenQuiz}
                  className="hover:text-amber-300 cursor-pointer"
                >
                  স্বাদ নির্বাচক কুইজ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSpin}
                  className="hover:text-amber-300 cursor-pointer"
                >
                  ভাগ্যের চাকা ও ভাউচার
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTracker}
                  className="hover:text-amber-300 cursor-pointer"
                >
                  লাইভ পার্সেল ট্র্যাকিং
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenDealership}
                  className="hover:text-amber-300 cursor-pointer"
                >
                  পাইকারি ডিলারশিপ
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-xs text-stone-400">
            <h4 className="font-bold text-stone-100 text-sm">কারখানা ও যোগাযোগ</h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>বিসিক শিল্পনগরী, কুষ্টিয়া সদর, কুষ্টিয়া - ৭০০০</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-mono">০৯৬১২-৬৬৬৬৬৪</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>info@mononbidi.com</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© ১৯৫৪ – ২০২৬ মনন বিড়ি ইন্ডাস্ট্রিজ লিমিটেড · সর্বস্বত্ব সংরক্ষিত।</p>
          <p>১০০% বাছাইকৃত কুষ্টিয়ার তামাক পাতায় প্রস্তুত</p>
        </div>
      </div>
    </footer>
  );
};
