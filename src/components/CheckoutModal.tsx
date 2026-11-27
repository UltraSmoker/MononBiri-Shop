import React, { useState, useEffect } from 'react';
import { CartItem, OrderDetails, PaymentGatewayType } from '../types';
import {
  BANGLADESH_DISTRICTS,
  DELIVERY_INSTRUCTION_PRESETS,
  DELIVERY_OPTIONS,
  INITIAL_VOUCHERS,
  STEALTH_WRAPPERS,
  formatMoney,
  toBanglaDigits,
} from '../data/bidiData';
import { X, ShieldCheck, CheckCircle2, PackageCheck } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  preAppliedVoucherCode?: string;
  onOrderSuccess: (order: OrderDetails) => void;
  onOpenTrackerForOrder: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  preAppliedVoucherCode = '',
  onOrderSuccess,
  onOpenTrackerForOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState(BANGLADESH_DISTRICTS[0].name);
  const [fullAddress, setFullAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentGatewayType>('cod');
  const [deliveryOptionId, setDeliveryOptionId] = useState(DELIVERY_OPTIONS[1].id);
  const [stealthWrapperId, setStealthWrapperId] = useState(STEALTH_WRAPPERS[0].id);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [voucherInput, setVoucherInput] = useState(preAppliedVoucherCode);
  const [appliedVoucher, setAppliedVoucher] = useState<(typeof INITIAL_VOUCHERS)[number] | null>(null);
  const [voucherMessage, setVoucherMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    if (preAppliedVoucherCode) {
      setVoucherInput(preAppliedVoucherCode);
      const found = INITIAL_VOUCHERS.find(
        (v) => v.code.toUpperCase() === preAppliedVoucherCode.toUpperCase()
      );
      if (found) {
        setAppliedVoucher(found);
        setVoucherMessage(`ভাউচার "${found.code}" স্বয়ংক্রিয়ভাবে যুক্ত হয়েছে!`);
      }
    }
  }, [preAppliedVoucherCode]);

  useEffect(() => {
    if (isOpen) {
      setCompletedOrder(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotalBDT = cartItems.reduce(
    (acc, item) => acc + (item.product.currency === 'USD' ? 0 : item.product.price * item.quantity),
    0
  );
  const subtotalUSD = cartItems.reduce(
    (acc, item) => acc + (item.product.currency === 'USD' ? item.product.price * item.quantity : 0),
    0
  );

  const selectedDistrictObj =
    BANGLADESH_DISTRICTS.find((d) => d.name === district) || BANGLADESH_DISTRICTS[0];
  const selectedDeliveryObj =
    DELIVERY_OPTIONS.find((d) => d.id === deliveryOptionId) || DELIVERY_OPTIONS[0];
  const selectedWrapper =
    STEALTH_WRAPPERS.find((w) => w.id === stealthWrapperId) || STEALTH_WRAPPERS[0];

  const hasEinsteinInCart = cartItems.some(
    (item) => item.product.id === 'monon-einstein-1939'
  );

  const rawDeliveryFee =
    selectedDeliveryObj.price === 0 ? 0 : selectedDistrictObj.fee + selectedDeliveryObj.price;

  const effectiveVoucherDiscount = appliedVoucher
    ? appliedVoucher.code === 'EINSTEIN1939' && !hasEinsteinInCart
      ? 500
      : appliedVoucher.discountAmount
    : 0;

  const discountAmount = appliedVoucher
    ? appliedVoucher.type === 'free_shipping'
      ? rawDeliveryFee
      : Math.min(effectiveVoucherDiscount, subtotalBDT)
    : 0;
  const deliveryFee =
    appliedVoucher?.type === 'free_shipping' ? 0 : rawDeliveryFee;

  const grandTotalBDT = Math.max(
    0,
    subtotalBDT + deliveryFee - (appliedVoucher?.type === 'free_shipping' ? 0 : discountAmount)
  );

  const handleApplyVoucher = () => {
    const code = voucherInput.trim().toUpperCase();
    const found = INITIAL_VOUCHERS.find((v) => v.code.toUpperCase() === code);
    if (!found) {
      setAppliedVoucher(null);
      setVoucherMessage('ভাউচার কোডটি সঠিক নয়। চেষ্টা করুন: WIN20TAKA, MONON20 বা FREESHIPWIN');
      return;
    }
    setAppliedVoucher(found);
    if (found.code === 'EINSTEIN1939' && !hasEinsteinInCart) {
      setVoucherMessage(
        'আইনস্টাইন ১৯৩৯ ছাড়ের মূল সুবিধা কেবল "আইনস্টাইন ১৯৩৯" সংস্করণে প্রযোজ্য — তবে সাধারণ অর্ডারে ৳৫০০ শুভেচ্ছা ছাড় যুক্ত হয়েছে!'
      );
    } else {
      setVoucherMessage(`অভিনন্দন! "${found.title}" প্রযোজ্য হয়েছে।`);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0 || !customerName.trim() || !phone.trim() || !fullAddress.trim()) return;

    const orderId = `MN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderDetails = {
      orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      district,
      fullAddress: fullAddress.trim(),
      specialInstructions: specialInstructions.trim() || 'স্ট্যান্ডার্ড গোপনীয় হস্তান্তর',
      stealthWrapperType: selectedWrapper.label,
      items: cartItems,
      subtotal: subtotalBDT,
      discountAmount,
      appliedVoucherCode: appliedVoucher?.code,
      deliveryOption: selectedDeliveryObj,
      totalAmount: grandTotalBDT,
      paymentMethod,
      orderTime: 'এইমাত্র',
      estimatedArrival: selectedDeliveryObj.estimatedTime,
      statusStep: 2,
      status: 'মান নিয়ন্ত্রণ ও গোপনীয় প্যাকিং',
    };

    setCompletedOrder(newOrder);
    onOrderSuccess(newOrder);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-stone-900 border border-stone-700 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl space-y-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close checkout"
          className="absolute top-4 right-4 p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {completedOrder ? (
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-600/50 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif-bn text-2xl sm:text-3xl font-bold text-stone-100">
                অর্ডার সফলভাবে গৃহীত হয়েছে!
              </h3>
              <p className="text-xs sm:text-sm text-stone-400">
                কুষ্টিয়া ডিসপ্যাচ টিম আপনার গোপনীয় পার্সেল প্রস্তুত করছে।
              </p>
            </div>

            <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 text-left space-y-2.5 text-xs sm:text-sm max-w-lg mx-auto">
              <div className="flex justify-between">
                <span className="text-stone-400">অর্ডার আইডি</span>
                <span className="font-mono font-bold text-amber-400 select-all">
                  {completedOrder.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">গ্রাহক</span>
                <span className="text-stone-100">
                  {completedOrder.customerName} ({completedOrder.phone})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">ছদ্মবেশ মোড়ক</span>
                <span className="text-emerald-400 font-medium">{completedOrder.stealthWrapperType}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-800">
                <span className="text-stone-300 font-semibold">সর্বমোট বিল</span>
                <span className="font-mono tabular-nums font-bold text-amber-400 text-base">
                  {formatMoney(completedOrder.totalAmount, 'BDT')}
                  {subtotalUSD > 0 ? ` + ${formatMoney(subtotalUSD, 'USD')}` : ''}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenTrackerForOrder(completedOrder.orderId)}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm cursor-pointer"
              >
                লাইভ পার্সেল ট্র্যাক করুন
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-sm cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-1 border-b border-stone-800 pb-4">
              <h3 className="font-serif-bn text-2xl font-bold text-stone-100">
                চেকআউট ও গোপনীয় ডেলিভারি সেটআপ
              </h3>
              <p className="text-xs text-stone-400">
                শতভাগ ব্যক্তিগত গোপনীয়তা নিশ্চিত করে আপনার ঠিকানায় পৌঁছে দেওয়া হবে।
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    আপনার পূর্ণ নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="যেমন: আরিফুল ইসলাম"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    সচল মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১৭xxxxxxxx"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    জেলা নির্বাচন *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} (কুরিয়ার বেস ৳{toBanglaDigits(d.fee)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    পেমেন্ট মাধ্যম *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentGatewayType)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="cod">ক্যাশ অন ডেলিভারি (পণ্য পেয়ে টাকা)</option>
                    <option value="bkash">বিকাশ (bKash)</option>
                    <option value="nagad">নগদ (Nagad)</option>
                    <option value="rocket">রকেট (Rocket)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  বিস্তারিত ঠিকানা *
                </label>
                <textarea
                  required
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="বাসা নম্বর, রোড, এলাকা বা নিকটস্থ মোড়ের চায়ের দোকান"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  ডেলিভারি গতি *
                </label>
                <select
                  value={deliveryOptionId}
                  onChange={(e) => setDeliveryOptionId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  {DELIVERY_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} (+{formatMoney(opt.price)})
                    </option>
                  ))}
                </select>
              </div>

              {/* SURPRISE FEATURE: Interactive Stealth Wrapper Selector + Live Parcel Label Preview */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-300">
                    গোপনীয় পার্সেল মোড়ক (Stealth Packaging Preview)
                  </span>
                  <span className="text-[11px] text-emerald-400 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    বাইরে বিড়ির কোনো নাম থাকবে না
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STEALTH_WRAPPERS.map((wrap) => {
                    const active = wrap.id === stealthWrapperId;
                    return (
                      <button
                        key={wrap.id}
                        type="button"
                        onClick={() => setStealthWrapperId(wrap.id)}
                        className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                          active
                            ? 'bg-amber-950/50 border-amber-500 text-amber-200 font-semibold'
                            : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        {wrap.label}
                      </button>
                    );
                  })}
                </div>

                {/* Live Visual Parcel Box Preview */}
                <div className="bg-stone-900 border border-dashed border-stone-700 rounded-lg p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                    <span>PARCEL LABEL PREVIEW</span>
                    <span className="text-amber-300">{selectedWrapper.badge}</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-stone-100">
                    {selectedWrapper.boxHeader}
                  </div>
                  <p className="text-[11px] text-stone-400">{selectedWrapper.boxSub}</p>
                </div>

                {/* Classic Stealth Instruction Presets */}
                <div className="space-y-2 pt-1">
                  <select
                    value=""
                    onChange={(e) => {
                      if (!e.target.value) return;
                      setSpecialInstructions((prev) =>
                        prev ? `${prev} | ${e.target.value}` : e.target.value
                      );
                    }}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- দ্রুত গোপনীয় নির্দেশনা যোগ করুন --</option>
                    {DELIVERY_INSTRUCTION_PRESETS.map((preset) => (
                      <option key={preset} value={preset}>
                        {preset}
                      </option>
                    ))}
                  </select>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="অতিরিক্ত গোপনীয় নির্দেশনা (যেমন: বাসার ছাদে বা মোড়ের দোকানে হ্যান্ডওভার)..."
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Promo Code */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    placeholder="ভাউচার কোড (যেমন: WIN20TAKA, MONON20, FREESHIPWIN)"
                    className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs font-mono uppercase text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-300 text-xs font-bold cursor-pointer"
                  >
                    প্রয়োগ
                  </button>
                </div>
                {voucherMessage && (
                  <p
                    className={`text-xs ${
                      appliedVoucher ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {voucherMessage}
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>পণ্যের মূল্য</span>
                  <span className="font-mono tabular-nums text-stone-200">
                    {subtotalBDT > 0 && subtotalUSD > 0
                      ? `${formatMoney(subtotalBDT, 'BDT')} + ${formatMoney(subtotalUSD, 'USD')}`
                      : subtotalUSD > 0
                      ? formatMoney(subtotalUSD, 'USD')
                      : formatMoney(subtotalBDT, 'BDT')}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-mono tabular-nums text-stone-200">
                    {deliveryFee === 0 ? 'ফ্রি' : formatMoney(deliveryFee)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>ভাউচার ছাড় ({appliedVoucher?.code})</span>
                    <span className="font-mono tabular-nums">-{formatMoney(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-stone-800 text-sm font-bold">
                  <span className="text-stone-100">সর্বমোট প্রদেয়</span>
                  <span className="font-mono tabular-nums text-amber-400 text-base">
                    {subtotalUSD > 0 && grandTotalBDT > 0
                      ? `${formatMoney(grandTotalBDT, 'BDT')} + ${formatMoney(subtotalUSD, 'USD')}`
                      : subtotalUSD > 0
                      ? formatMoney(subtotalUSD, 'USD')
                      : formatMoney(grandTotalBDT, 'BDT')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={cartItems.length === 0}
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <PackageCheck className="w-4 h-4" />
                <span>অর্ডার কনফার্ম করুন</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
