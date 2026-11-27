import React, { useState, useEffect } from 'react';
import { OrderDetails } from '../types';
import { formatMoney } from '../data/bidiData';
import { X, Truck, Search, CheckCircle2, Clock } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
  recentOrders: OrderDetails[];
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
  recentOrders,
}) => {
  const [searchId, setSearchId] = useState(initialOrderId || 'MN-884210');
  const [activeOrderId, setActiveOrderId] = useState(initialOrderId || 'MN-884210');

  useEffect(() => {
    if (initialOrderId) {
      setSearchId(initialOrderId);
      setActiveOrderId(initialOrderId);
    }
  }, [initialOrderId]);

  if (!isOpen) return null;

  const matchedPlacedOrder = recentOrders.find(
    (o) => o.orderId.toUpperCase() === activeOrderId.trim().toUpperCase()
  );

  const steps = matchedPlacedOrder
    ? [
        {
          stage: 'অর্ডার গৃহীত ও ভেরিফাইড',
          desc: `${matchedPlacedOrder.customerName}-এর অর্ডার কুষ্টিয়া ডিসপ্যাচ সেলে অনুমোদিত।`,
          time: matchedPlacedOrder.orderTime,
          done: true,
        },
        {
          stage: `গোপনীয় মোড়ক (${matchedPlacedOrder.stealthWrapperType})`,
          desc: matchedPlacedOrder.specialInstructions,
          time: 'প্রক্রিয়াধীন',
          done: true,
        },
        {
          stage: 'কুরিয়ার রাইডার হ্যান্ডওভার',
          desc: `${matchedPlacedOrder.district} রুটে ডেলিভারি (${matchedPlacedOrder.estimatedArrival})`,
          time: 'আসন্ন',
          done: false,
        },
        {
          stage: 'নীরব হস্তান্তর সম্পন্ন',
          desc: 'হর্ন না বাজিয়ে কল/এসএমএস মাধ্যমে হস্তান্তর।',
          time: 'অপেক্ষমাণ',
          done: false,
        },
      ]
    : [
        {
          stage: 'অর্ডার গৃহীত ও ভেরিফাইড',
          desc: 'সিস্টেমে ইনভয়েস অনুমোদিত হয়েছে।',
          time: 'সকাল ১০:১৫',
          done: true,
        },
        {
          stage: 'মান নিয়ন্ত্রণ ও গোপনীয় বইয়ের মলাট মোড়ক',
          desc: 'কুষ্টিয়া কেন্দ্রীয় ল্যাব থেকে এয়ার-টাইট সিল সম্পন্ন।',
          time: 'সকাল ১১:৪০',
          done: true,
        },
        {
          stage: 'ডেলিভারিতে বের হয়েছে',
          desc: 'রাইডার আপনার এলাকার উদ্দেশ্যে রওনা দিয়েছেন।',
          time: 'দুপুর ০৩:৩০',
          done: true,
        },
        {
          stage: 'হস্তান্তর অপেক্ষমাণ',
          desc: 'গোপনীয় নির্দেশনা অনুযায়ী কল করে হস্তান্তর।',
          time: 'আজ বিকাল',
          done: false,
        },
      ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setActiveOrderId(searchId.trim().toUpperCase());
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-stone-900 border border-stone-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close tracker"
          className="absolute top-4 right-4 p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
          <Truck className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h3 className="font-serif-bn text-xl sm:text-2xl font-bold text-stone-100">
              লাইভ পার্সেল ট্র্যাকিং
            </h3>
            <p className="text-xs text-stone-400">
              অর্ডার আইডি দিয়ে কুষ্টিয়া ফ্যাক্টরি থেকে ডেলিভারির অবস্থান দেখুন
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="অর্ডার আইডি লিখুন (যেমন: MN-884210)"
            className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs font-mono uppercase text-amber-300 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>খুঁজুন</span>
          </button>
        </form>

        {recentOrders.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-400">আপনার সাম্প্রতিক অর্ডার:</span>
            {recentOrders.slice(0, 3).map((ord) => (
              <button
                key={ord.orderId}
                type="button"
                onClick={() => {
                  setSearchId(ord.orderId);
                  setActiveOrderId(ord.orderId);
                }}
                className="font-mono px-2.5 py-1 rounded-md bg-stone-950 border border-stone-700 text-amber-300 hover:border-amber-500 cursor-pointer"
              >
                {ord.orderId}
              </button>
            ))}
          </div>
        )}

        <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-stone-400 block">অর্ডার কোড</span>
            <span className="font-mono font-bold text-amber-400 text-base">{activeOrderId}</span>
          </div>
          <div>
            <span className="text-stone-400 block">অবস্থা</span>
            <span className="text-emerald-400 font-semibold">
              {matchedPlacedOrder ? matchedPlacedOrder.status : 'ডেলিভারির পথে (On the Way)'}
            </span>
          </div>
          {matchedPlacedOrder && (
            <div>
              <span className="text-stone-400 block">মোট বিল</span>
              <span className="font-mono tabular-nums text-stone-200 font-bold">
                {formatMoney(matchedPlacedOrder.totalAmount, 'BDT')}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.stage} className="flex items-start gap-3">
              {s.done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className={`font-semibold ${s.done ? 'text-stone-100' : 'text-stone-400'}`}>
                    {s.stage}
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">{s.time}</span>
                </div>
                <p className="text-xs text-stone-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
