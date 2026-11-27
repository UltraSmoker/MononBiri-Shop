import React from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LeafCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeafCertificateModal: React.FC<LeafCertificateModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-stone-900 border border-amber-700/60 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close certificate"
          className="absolute top-4 right-4 p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1.5 border-b border-stone-800 pb-4">
          <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>কুষ্টিয়া ফ্যাক্টরি কোয়ালিটি অ্যাসিউরেন্স · সনদ নং MN-QC-১৯৫৪</span>
          </div>
          <h3 className="font-serif-bn text-2xl font-bold text-stone-100">
            ১০০% উন্নতমানের তামাক পাতা বিশুদ্ধতা সনদ
          </h3>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-stone-300 leading-relaxed">
          <p>
            মনন বিড়ি ইন্ডাস্ট্রিজ লিমিটেডের প্রতিটি ব্যাচ কুষ্টিয়ার বিসিক ল্যাবে আর্দ্রতা (১১.৫%), প্রাকৃতিক অ্যারোমা এবং জিরো-ভেজাল পরীক্ষায় উত্তীর্ণ হয়ে তবেই প্যাকেটজাত করা হয়।
          </p>

          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-2.5 text-xs">
            {[
              'শতভাগ কুষ্টিয়া ও উত্তরবঙ্গের গ্রেড-এ তামাক পাতা (কোনো ডাস্ট বা ভুসি নেই)',
              '১২০ দিন প্রাকৃতিক রোদ ও ছায়ায় ধীরগতির কিউরিং প্রক্রিয়া',
              'কৃত্রিম ব্লিচ, কেমিক্যাল আঠা ও কৃত্রিম ধোঁয়া-বর্ধক সম্পূর্ণ নিষিদ্ধ',
              'আধুনিক সিরিজে অর্গানিক বায়ো-কটন ও কোকোনাট কার্বন ফিল্টার ব্যবহার',
            ].map((point) => (
              <div key={point} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs text-stone-400">
          <span>প্রধান কিউরেটর: আব্দুল জব্বার · কুষ্টিয়া</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold cursor-pointer"
          >
            বুঝেছি
          </button>
        </div>
      </div>
    </div>
  );
};
