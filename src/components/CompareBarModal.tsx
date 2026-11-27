import React from 'react';
import { BidiProduct } from '../types';
import { formatMoney, toBanglaDigits } from '../data/bidiData';
import { X, Scale, ShoppingBag, Star } from 'lucide-react';

interface CompareBarModalProps {
  compareItems: BidiProduct[];
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onAddToCart: (product: BidiProduct) => void;
}

export const CompareBarModal: React.FC<CompareBarModalProps> = ({
  compareItems,
  isModalOpen,
  onOpenModal,
  onCloseModal,
  onRemoveItem,
  onClearAll,
  onAddToCart,
}) => {
  if (compareItems.length === 0) return null;

  return (
    <>
      {/* Subtle Bottom Comparison Dock */}
      {!isModalOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-2xl bg-stone-900/95 backdrop-blur-md border border-amber-600/50 rounded-xl px-4 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold text-stone-200">
              তুলনা ({toBanglaDigits(compareItems.length)}/৩):
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {compareItems.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1.5 text-xs bg-stone-950 border border-stone-800 px-2.5 py-1 rounded-md text-stone-200"
                >
                  <span className="max-w-[110px] truncate">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Remove ${item.name} from compare`}
                    className="text-stone-400 hover:text-rose-400 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-stone-400 hover:text-stone-200 px-2 py-1 cursor-pointer"
            >
              মুছুন
            </button>
            <button
              type="button"
              onClick={onOpenModal}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              পাশাপাশি তুলনা দেখুন
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Matrix Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <h3 className="font-serif-bn text-2xl font-bold text-stone-100">
                  সংস্করণ পাশাপাশি তুলনা
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  দাম, পাতা, ফিল্টার, কিক ও গ্রাহক রেটিং এক নজরে মিলিয়ে নিন
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseModal}
                aria-label="Close comparison"
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-800">
                    <th className="py-3 pr-4 text-stone-400 font-medium w-40">বৈশিষ্ট্য</th>
                    {compareItems.map((p) => (
                      <th key={p.id} className="py-3 px-4 min-w-[200px]">
                        <div className="space-y-2">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-28 object-cover rounded-lg border border-stone-800"
                            referrerPolicy="no-referrer"
                          />
                          <div className="font-serif-bn font-bold text-stone-100 text-base">
                            {p.name}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  <tr>
                    <td className="py-3 pr-4 text-stone-400">মূল্য</td>
                    {compareItems.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-mono tabular-nums font-bold text-amber-400">
                        {p.priceDisplay || formatMoney(p.price, p.currency)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-stone-400">রেটিং</td>
                    {compareItems.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-mono tabular-nums text-stone-200">
                        <span className="inline-flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {toBanglaDigits(p.rating.toFixed(1))} ({toBanglaDigits(p.reviewCount)})
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-stone-400">শলাকা সংখ্যা</td>
                    {compareItems.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-mono tabular-nums text-stone-200">
                        {toBanglaDigits(p.stickCount)} টি
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-stone-400">ফিল্টার / মোড়ক</td>
                    {compareItems.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-stone-300">
                        {p.filterType}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-stone-400">তামাকের উৎস</td>
                    {compareItems.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-stone-300">
                        {p.tobaccoOrigin}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-stone-400">সুবাস (Aroma)</td>
                    {compareItems.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-mono tabular-nums text-amber-300">
                        {toBanglaDigits(p.smokeProfile.aroma)}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-stone-400">তীব্রতা (Kick)</td>
                    {compareItems.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-mono tabular-nums text-amber-300">
                        {toBanglaDigits(p.smokeProfile.kick)}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4" />
                    {compareItems.map((p) => (
                      <td key={p.id} className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => onAddToCart(p)}
                          className="w-full py-2.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>ঝুলিতে যোগ করুন</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
