import React, { useEffect, useRef, useState } from 'react';
import { BidiProduct } from '../types';
import { formatMoney, toBanglaDigits } from '../data/bidiData';
import { playLighterAndPuffSound } from '../utils/soundFx';
import { Flame, Volume2, VolumeX, Eye, ShoppingBag, Sparkles, AlertTriangle } from 'lucide-react';

interface SmokeLabSectionProps {
  products: BidiProduct[];
  selectedId: string;
  onSelectId: (id: string) => void;
  onOpenDetails: (product: BidiProduct) => void;
  onAddToCart: (product: BidiProduct) => void;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  hue: string;
}

export const SmokeLabSection: React.FC<SmokeLabSectionProps> = ({
  products,
  selectedId,
  onSelectId,
  onOpenDetails,
  onAddToCart,
}) => {
  const activeProduct = products.find((p) => p.id === selectedId) || products[0];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<SmokeParticle[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [puffCount, setPuffCount] = useState(0);
  const [extremeAlert, setExtremeAlert] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);

  // Ambient & Puff Canvas Particle Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const spawnAmbient = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (particlesRef.current.length < 75 && Math.random() < 0.45) {
        particlesRef.current.push({
          x: w * 0.5 + (Math.random() - 0.5) * 14,
          y: h - 38,
          vx: (Math.random() - 0.5) * 0.65,
          vy: -(0.7 + Math.random() * 1.1),
          radius: 8 + Math.random() * 14,
          alpha: 0.22 + Math.random() * 0.14,
          decay: 0.0022 + Math.random() * 0.0018,
          hue: activeProduct.smokeColor || '#f59e0b',
        });
      }
    };

    const tick = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      spawnAmbient();

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx + Math.sin(p.y * 0.025) * 0.35;
        p.y += p.vy;
        p.radius += 0.26;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < -60) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, p.radius);
        grad.addColorStop(0, `${p.hue}${Math.round(p.alpha * 255).toString(16).padStart(2, '0')}`);
        grad.addColorStop(0.55, `rgba(214, 211, 209, ${p.alpha * 0.55})`);
        grad.addColorStop(1, 'rgba(214, 211, 209, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glowing ember tip at bottom center
      const emberGrad = ctx.createRadialGradient(w * 0.5, h - 34, 1, w * 0.5, h - 34, 22);
      emberGrad.addColorStop(0, activeProduct.isExtreme ? 'rgba(244, 63, 94, 0.95)' : 'rgba(245, 158, 11, 0.9)');
      emberGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = emberGrad;
      ctx.beginPath();
      ctx.arc(w * 0.5, h - 34, 22, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [activeProduct]);

  const handleSimulatePuff = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const burstCount = activeProduct.isExtreme ? 65 : 32;
      for (let i = 0; i < burstCount; i++) {
        particlesRef.current.push({
          x: w * 0.5 + (Math.random() - 0.5) * 28,
          y: h - 40,
          vx: (Math.random() - 0.5) * (activeProduct.isExtreme ? 3.2 : 1.7),
          vy: -(1.4 + Math.random() * (activeProduct.isExtreme ? 3.4 : 2.2)),
          radius: 10 + Math.random() * 20,
          alpha: 0.42 + Math.random() * 0.25,
          decay: 0.0025 + Math.random() * 0.002,
          hue: activeProduct.smokeColor || '#f59e0b',
        });
      }
    }

    if (soundEnabled) {
      playLighterAndPuffSound(Boolean(activeProduct.isExtreme));
    }

    setPuffCount((c) => c + 1);

    if (activeProduct.isExtreme) {
      setExtremeAlert(true);
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 500);
    } else {
      setExtremeAlert(false);
    }
  };

  const priceText =
    activeProduct.priceDisplay || formatMoney(activeProduct.price, activeProduct.currency);

  return (
    <section
      id="smoke-lab"
      className={`py-16 sm:py-20 bg-stone-900/40 border-b border-stone-800/80 ${
        shakeScreen ? 'animate-extreme-shake' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-medium text-amber-400 tracking-wide">
              ইন্টারেক্টিভ অ্যারোমা চেম্বার · লাইভ স্মোক সিমুলেটর
            </div>
            <h2 className="font-serif-bn text-3xl sm:text-4xl font-bold text-stone-100">
              ভার্চুয়াল টান দিয়ে পরখ করুন স্বাদ ও সুবাস
            </h2>
            <p className="text-sm sm:text-base text-stone-400">
              যেকোনো একটি মনন সংস্করণ নির্বাচন করে ভার্চুয়াল টান দিন — ধোঁয়ার রঙ, ঘনত্ব, ফিল্টারের আচরণ ও কারিগরের নোট সরাসরি দেখুন ও শুনুন।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs font-medium text-stone-300 hover:border-amber-600/60 transition-colors cursor-pointer self-start md:self-auto whitespace-nowrap"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>লাইটার ও টানের শব্দ চালু</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-stone-500" />
                <span>শব্দ বন্ধ আছে</span>
              </>
            )}
          </button>
        </div>

        {/* Selector Strip for all 13 Bidis */}
        <div className="flex flex-wrap gap-2">
          {products.map((p) => {
            const active = p.id === activeProduct.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelectId(p.id);
                  setExtremeAlert(false);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? p.isExtreme
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-amber-600 text-stone-950 font-bold'
                    : 'bg-stone-950 text-stone-300 border border-stone-800 hover:border-stone-600'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Main Simulator Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Live Smoke Canvas Chamber (5 Cols) */}
          <div className="lg:col-span-5 bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden flex flex-col justify-between">
            <div className="relative h-72 sm:h-80 w-full overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-full block" />

              {/* Subtle Bidi Silhouette Tip at bottom */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-2.5 rounded-full bg-gradient-to-r from-stone-800 via-amber-900 to-amber-500/80 border border-stone-700" />

              {/* Top Overlay Telemetry */}
              <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between text-xs text-stone-400">
                <span>ধোঁয়ার প্রকৃতি: {activeProduct.intensity.split('(')[0].trim()}</span>
                <span className="font-mono tabular-nums text-amber-300">
                  মোট টান: {toBanglaDigits(puffCount)}
                </span>
              </div>

              {/* Extreme Bidi Azrael Alert Easter Egg */}
              {extremeAlert && activeProduct.isExtreme && (
                <div className="absolute inset-x-4 top-12 bg-rose-950/95 border border-rose-500/70 rounded-xl p-3.5 text-xs text-rose-100 space-y-1 shadow-xl">
                  <div className="flex items-center gap-2 font-bold text-rose-300">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>আজরাইল অ্যালার্ট · ১০ কোটি বিড়ির কসমিক শকওয়েভ!</span>
                  </div>
                  <p className="text-rose-200/90 leading-relaxed">
                    ইলন মাস্ক ও জাকারবার্গও ভেবেছিলেন কিছু হয়নি—কিন্তু ৩ ঘণ্টার মধ্যেই কসমিক এনার্জি কাজ শুরু করেছিল। কেবল ভিনগ্রহের এলিয়েনরাই এই ধোঁয়া সহ্য করতে পারে!
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5 border-t border-stone-800/80 flex items-center justify-between gap-3 bg-stone-900/50">
              <button
                type="button"
                onClick={handleSimulatePuff}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer ${
                  activeProduct.isExtreme
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>
                  {activeProduct.isExtreme ? 'সাবধান! কসমিক টান দিন' : 'আগুন ধরান ও ভার্চুয়াল টান দিন'}
                </span>
              </button>
            </div>
          </div>

          {/* Right: Sensory Profile & Roll Master Details (7 Cols) */}
          <div className="lg:col-span-7 bg-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
                <span>
                  {activeProduct.categoryLabel} · {activeProduct.filterType}
                </span>
                <span className="font-mono tabular-nums text-amber-400 font-bold text-base">
                  {priceText}
                </span>
              </div>

              <div>
                <h3 className="font-serif-bn text-2xl sm:text-3xl font-bold text-stone-100">
                  {activeProduct.name}
                </h3>
                <p className="text-sm text-stone-300 mt-1.5 leading-relaxed">
                  {activeProduct.tagline}
                </p>
              </div>

              {/* 4 Sensory Telemetry Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { label: 'প্রাকৃতিক মিষ্টতা', val: activeProduct.smokeProfile.sweetness },
                  { label: 'ধোঁয়ার ঘনত্ব', val: activeProduct.smokeProfile.smokeDensity },
                  { label: 'অ্যারোমা ও সুবাস', val: activeProduct.smokeProfile.aroma },
                  { label: 'নিকোটিন কিক ও তীব্রতা', val: activeProduct.smokeProfile.kick },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-300 font-medium">{metric.label}</span>
                      <span className="font-mono tabular-nums text-amber-300 font-bold">
                        {toBanglaDigits(metric.val)}%
                      </span>
                    </div>
                    <div className="h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          activeProduct.isExtreme ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${metric.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Roll Master Note */}
              <div className="pt-4 border-t border-stone-800/80 space-y-1.5 text-xs">
                <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>রোল মাস্টার ও উপাদান নোট</span>
                </div>
                <p className="text-stone-300 leading-relaxed">{activeProduct.rollMasterStory}</p>
                <p className="text-stone-400">
                  উৎস: <span className="text-stone-200">{activeProduct.tobaccoOrigin}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenDetails(activeProduct)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>৪টি ছবি ও সকল রিভিউ দেখুন</span>
              </button>

              <button
                type="button"
                onClick={() => onAddToCart(activeProduct)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ঝুলিতে যোগ করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
