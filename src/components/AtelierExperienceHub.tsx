import React from 'react';
import { Compass, Sparkles, Search, Building2, ArrowRight } from 'lucide-react';

interface AtelierExperienceHubProps {
  onOpenQuiz: () => void;
  onOpenSpin: () => void;
  onOpenTracker: () => void;
  onOpenDealership: () => void;
}

export const AtelierExperienceHub: React.FC<AtelierExperienceHubProps> = ({
  onOpenQuiz,
  onOpenSpin,
  onOpenTracker,
  onOpenDealership,
}) => {
  const portals = [
    {
      title: 'স্বাদ ও ব্লেন্ড নির্বাচক কুইজ',
      desc: 'আপনার মেজাজ, আড্ডার পরিবেশ ও ধোঁয়ার পছন্দ অনুযায়ী ৩টি প্রশ্নে সেরা বিড়ি খুঁজে নিন।',
      cta: 'কুইজ শুরু করুন',
      icon: Compass,
      action: onOpenQuiz,
    },
    {
      title: 'ভাগ্যের চাকা ও ভাউচার',
      desc: 'চাকা ঘুরিয়ে জিতে নিন ৳২,০০০ পর্যন্ত ক্যাশ ছাড় কিংবা ফ্রি আর্মার্ড হোম ডেলিভারি।',
      cta: 'চাকা ঘুরান',
      icon: Sparkles,
      action: onOpenSpin,
    },
    {
      title: 'লাইভ পার্সেল ট্র্যাকিং',
      desc: 'অর্ডার আইডি দিয়ে কুষ্টিয়া ফ্যাক্টরি থেকে আপনার গোপনীয় পার্সেলের লাইভ অবস্থান দেখুন।',
      cta: 'অর্ডার ট্র্যাক করুন',
      icon: Search,
      action: onOpenTracker,
    },
    {
      title: 'পাইকারি ও জেলা ডিলারশিপ',
      desc: 'নিজ জেলা বা উপজেলায় মনন বিড়ির অফিশিয়াল ডিলার ও পাইকারি সরবরাহকারী হতে আবেদন করুন।',
      cta: 'আবেদন ফর্ম খুলুন',
      icon: Building2,
      action: onOpenDealership,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-stone-900/40 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-medium text-amber-400">মনন সেবা ও ইন্টারেক্টিভ পোর্টাল</div>
          <h2 className="font-serif-bn text-3xl sm:text-4xl font-bold text-stone-100">
            সঠিক ব্লেন্ড খুঁজুন, ট্র্যাক করুন কিংবা ডিলার হোন
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {portals.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-stone-950 border border-stone-800 hover:border-amber-600/60 rounded-xl p-5 flex flex-col justify-between space-y-5 transition-colors"
              >
                <div className="space-y-3">
                  <Icon className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif-bn text-lg font-bold text-stone-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={item.action}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 cursor-pointer self-start"
                >
                  <span>{item.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
