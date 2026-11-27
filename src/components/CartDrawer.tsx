import React from 'react';
import { CartItem } from '../types';
import { formatMoney, toBanglaDigits } from '../data/bidiData';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotalBDT = cartItems.reduce(
    (acc, item) => acc + (item.product.currency === 'USD' ? 0 : item.product.price * item.quantity),
    0
  );
  const subtotalUSD = cartItems.reduce(
    (acc, item) => acc + (item.product.currency === 'USD' ? item.product.price * item.quantity : 0),
    0
  );
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col text-stone-100">
          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif-bn text-xl font-bold text-stone-100">
                আপনার অর্ডার ঝুলি ({toBanglaDigits(totalItemsCount)})
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-14 h-14 rounded-full bg-stone-800 flex items-center justify-center text-stone-500">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-stone-200">
                    আপনার অর্ডার ঝুলি একদম খালি!
                  </p>
                  <p className="text-xs text-stone-400 max-w-xs">
                    মনন গোল্ড ফিল্টার, মেঘের গর্জ্জন কিংবা দার্শনিক আড্ডা থেকে পছন্দের সংস্করণ যোগ করুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-lg text-xs font-bold cursor-pointer"
                >
                  পণ্য সম্ভার দেখুন
                </button>
              </div>
            ) : (
              cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-stone-950 border border-stone-800 rounded-xl p-3.5 flex gap-3 items-center justify-between"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-stone-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif-bn font-bold text-stone-100 text-sm truncate">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 truncate">{product.packSize}</p>
                    <div className="text-xs font-mono tabular-nums font-bold text-amber-400 mt-1">
                      {formatMoney(product.price * quantity, product.currency)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(product.id)}
                      aria-label="Remove item"
                      className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-6 h-6 rounded hover:bg-stone-800 text-stone-200 flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono tabular-nums font-bold text-stone-100">
                        {toBanglaDigits(quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-6 h-6 rounded hover:bg-stone-800 text-stone-200 flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-stone-800 bg-stone-950 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-stone-400 text-xs">
                  <span>মোট প্যাক</span>
                  <span className="font-mono tabular-nums text-stone-200">
                    {toBanglaDigits(totalItemsCount)} প্যাক
                  </span>
                </div>
                {subtotalBDT > 0 && (
                  <div className="flex justify-between text-stone-200 font-medium">
                    <span>মোট টাকা (BDT)</span>
                    <span className="font-mono tabular-nums text-amber-400 font-bold text-lg">
                      {formatMoney(subtotalBDT, 'BDT')}
                    </span>
                  </div>
                )}
                {subtotalUSD > 0 && (
                  <div className="flex justify-between text-rose-300 font-medium">
                    <span>কসমিক ভল্ট (USD)</span>
                    <span className="font-mono tabular-nums font-bold text-base">
                      {formatMoney(subtotalUSD, 'USD')}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
              >
                <span>চেকআউট ও গোপনীয় ডেলিভারি</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>বিকাশ, নগদ, রকেট ও ক্যাশ অন ডেলিভারি সমর্থিত</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
