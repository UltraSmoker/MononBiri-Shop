import React, { useState } from 'react';
import { BidiProduct } from '../types';
import { formatMoney } from '../data/bidiData';
import { X, Compass, ShoppingBag, Eye, RotateCcw } from 'lucide-react';

interface BlendFinderQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: BidiProduct[];
  onAddToCart: (product: BidiProduct) => void;
  onOpenDetails: (product: BidiProduct) => void;
}

export const BlendFinderQuizModal: React.FC<BlendFinderQuizModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
  onOpenDetails,
}) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    preference: 'modern',
    mood: 'chill',
    strength: 'medium',
  });

  if (!isOpen) return null;

  const getRecommended = (): BidiProduct => {
    if (answers.preference === 'cosmic') {
      return products.find((p) => p.id === 'monon-extreme-bidi') || products[0];
    }
    if (answers.preference === 'cool') {
      return products.find((p) => p.id === 'monon-ice-crush') || products[0];
    }
    if (answers.preference === 'coffee') {
      return products.find((p) => p.id === 'monon-padma-espresso') || products[0];
    }
    if (answers.mood === 'historic') {
      return products.find((p) => p.id === 'monon-einstein-1939') || products[0];
    }
    if (answers.mood === 'royal' && answers.preference === 'spicy') {
      return products.find((p) => p.id === 'monon-nawabi-keshor') || products[0];
    }
    if (answers.mood === 'royal') {
      return products.find((p) => p.id === 'monon-platinum-reserve') || products[0];
    }
    if (answers.mood === 'sufiana') {
      return products.find((p) => p.id === 'monon-baul-sandalwood') || products[0];
    }
    if (answers.mood === 'deep') {
      return products.find((p) => p.id === 'darshonik-adda') || products[0];
    }
    if (answers.preference === 'classic' && answers.strength === 'strong') {
      return products.find((p) => p.id === 'megher-gorjon') || products[0];
    }
    if (answers.preference === 'classic') {
      return products.find((p) => p.id === 'monon-craft-special') || products[0];
    }
    if (answers.preference === 'spicy' && answers.strength === 'medium') {
      return products.find((p) => p.id === 'monon-nawabi-keshor') || products[0];
    }
    if (answers.preference === 'spicy') {
      return products.find((p) => p.id === 'monon-spicy-masala') || products[0];
    }
    if (answers.strength === 'mild') {
      return products.find((p) => p.id === 'monon-charcoal-pure') || products[0];
    }
    return products.find((p) => p.id === 'monon-gold-filter') || products[0];
  };

  const recommended = getRecommended();
  const priceText =
    recommended.priceDisplay || formatMoney(recommended.price, recommended.currency);

  const reset = () => {
    setStep(1);
    setAnswers({ preference: 'modern', mood: 'chill', strength: 'medium' });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-stone-900 border border-stone-700 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quiz"
          className="absolute top-4 right-4 p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
          <Compass className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h3 className="font-serif-bn text-xl font-bold text-stone-100">
              স্বাদ ও ব্লেন্ড নির্বাচক কুইজ
            </h3>
            <p className="text-xs text-stone-400">
              ৩টি ছোট প্রশ্নে জেনে নিন কোন মনন বিড়ি আপনার জন্য তৈরি
            </p>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-amber-400">ধাপ ১ / ৩ · আপনার প্রধান পছন্দ?</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'modern', title: 'আধুনিক গোল্ড বা চারকোল ফিল্টার', sub: 'স্মুথ ও পরিচ্ছন্ন ড্র' },
                { id: 'cool', title: 'বরফশীতল মেন্থল ক্যাপসুল', sub: 'ক্লিক করলেই ঠান্ডা প্রশান্তি' },
                { id: 'classic', title: 'খাঁটি তেন্দুপাতা ও আমসত্ত্ব', sub: 'আদি কুষ্টিয়ার মেঠো টান' },
                { id: 'spicy', title: 'কেশর, এলাচ ও মশলা মেহফিল', sub: 'রাজকীয় ও সুবাসিত ধোঁয়া' },
                { id: 'coffee', title: 'ডার্ক রোস্ট কফি ও কোকো ফিউশন', sub: 'নাইট-শিফট ও কফিশপ ব্লেন্ড' },
                { id: 'cosmic', title: 'অসমসাহসী মহাজাগতিক অভিজ্ঞতা', sub: '১০ কোটি বিড়ির এক্সট্রিম শক্তি' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setAnswers((a) => ({ ...a, preference: opt.id }));
                    setStep(opt.id === 'cosmic' || opt.id === 'coffee' ? 4 : 2);
                  }}
                  className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500 text-left space-y-1 transition-colors cursor-pointer"
                >
                  <div className="text-xs font-bold text-stone-100">{opt.title}</div>
                  <div className="text-[11px] text-stone-400">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-amber-400">ধাপ ২ / ৩ · কোন মুহূর্তের জন্য?</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'chill', title: 'অফিস বিরতি ও প্রতিদিনের সঙ্গী', sub: 'স্মার্ট ও ঝাঁজহীন' },
                { id: 'deep', title: 'টিএসসি আড্ডা ও গরম লাল চা', sub: 'দীর্ঘ আলোচনা ও গাম্ভীর্য' },
                { id: 'sufiana', title: 'বাউল গানের আসর ও চন্দন প্রশান্তি', sub: 'ধ্যানমগ্ন ও চন্দন-সুবাসিত' },
                { id: 'royal', title: 'বিশেষ উপহার ও নবাবী আয়োজন', sub: 'ভেলভেট বক্স, কেশর ও জাফরান' },
                { id: 'historic', title: 'বিজ্ঞান ও ১৯৩৯-এর ইতিহাস প্রেম', sub: 'আইনস্টাইন আর্কাইভ' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setAnswers((a) => ({ ...a, mood: opt.id }));
                    setStep(3);
                  }}
                  className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500 text-left space-y-1 transition-colors cursor-pointer"
                >
                  <div className="text-xs font-bold text-stone-100">{opt.title}</div>
                  <div className="text-[11px] text-stone-400">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-amber-400">ধাপ ৩ / ৩ · নিকোটিনের তীব্রতা?</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'mild', title: 'হালকা ও কোমল', sub: '১–২ মাত্রা' },
                { id: 'medium', title: 'সুষম মাঝারি', sub: '৩ মাত্রা' },
                { id: 'strong', title: 'কড়া ও বোল্ড', sub: '৪–৫ মাত্রা' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setAnswers((a) => ({ ...a, strength: opt.id }));
                    setStep(4);
                  }}
                  className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500 text-left space-y-1 transition-colors cursor-pointer"
                >
                  <div className="text-xs font-bold text-stone-100">{opt.title}</div>
                  <div className="text-[11px] text-stone-400">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div className="text-xs font-mono text-emerald-400">আপনার সেরা ম্যাচ প্রস্তুত</div>
            <div className="bg-stone-950 border border-amber-700/50 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
              <img
                src={recommended.images[0]}
                alt={recommended.name}
                className="w-28 h-24 rounded-lg object-cover border border-stone-800 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="font-serif-bn text-lg font-bold text-stone-100">
                  {recommended.name}
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">{recommended.tagline}</p>
                <div className="font-mono tabular-nums text-base font-bold text-amber-400">
                  {priceText}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>আবার কুইজ দিন</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDetails(recommended);
                  }}
                  className="px-4 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>বিস্তারিত</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(recommended);
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>কার্টে যোগ করুন</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
