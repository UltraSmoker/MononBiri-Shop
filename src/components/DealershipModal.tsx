import React, { useState } from 'react';
import { BidiProduct } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/bidiData';
import { X, Building2, CheckCircle2 } from 'lucide-react';

interface DealershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: BidiProduct[];
  onSubmitted?: () => void;
}

export const DealershipModal: React.FC<DealershipModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [district, setDistrict] = useState(BANGLADESH_DISTRICTS[0].name);
  const [phone, setPhone] = useState('');
  const [cartons, setCartons] = useState('৫০ কার্টুন / মাস');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !phone.trim()) return;
    setSubmitted(true);
    onSubmitted?.();
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
          aria-label="Close dealership modal"
          className="absolute top-4 right-4 p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-serif-bn text-2xl font-bold text-stone-100">
              ডিলারশিপ আবেদন গৃহীত হয়েছে!
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              ধন্যবাদ <strong className="text-amber-300">{ownerName || businessName}</strong>। কুষ্টিয়া হেড অফিসের পাইকারি বিভাগ ২৪ ঘণ্টার মধ্যে <span className="font-mono">{phone}</span> নম্বরে যোগাযোগ করবে।
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs cursor-pointer"
            >
              সম্পন্ন
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
              <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <h3 className="font-serif-bn text-xl sm:text-2xl font-bold text-stone-100">
                  জেলা ডিলারশিপ ও পাইকারি আবেদন
                </h3>
                <p className="text-xs text-stone-400">
                  সরাসরি কুষ্টিয়া কারখানা থেকে হোলসেল রেটে মনন বিড়ি সরবরাহ নিন
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1.5 font-medium">
                    প্রতিষ্ঠানের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="যেমন: মেসার্স পদ্মা ট্রেডার্স"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1.5 font-medium">
                    স্বত্বাধিকারীর নাম
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="আপনার নাম"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1.5 font-medium">জেলা *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 mb-1.5 font-medium">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১৭xxxxxxxx"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 font-mono text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1.5 font-medium">
                  মাসিক সম্ভাব্য চাহিদা
                </label>
                <select
                  value={cartons}
                  onChange={(e) => setCartons(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="২০ - ৫০ কার্টুন / মাস">২০ – ৫০ কার্টুন / মাস</option>
                  <option value="৫০ - ১০০ কার্টুন / মাস">৫০ – ১০০ কার্টুন / মাস</option>
                  <option value="১০০+ কার্টুন (জেলা ডিস্ট্রিবিউটর)">
                    ১০০+ কার্টুন (জেলা ডিস্ট্রিবিউটর)
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm transition-colors cursor-pointer"
              >
                ডিলারশিপ আবেদন জমা দিন
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
