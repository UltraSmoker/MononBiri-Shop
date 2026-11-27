import React, { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, Sparkles } from 'lucide-react';
import { playWheelTickSound } from '../utils/soundFx';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimVoucher: (code: string, title: string) => void;
}

const SEGMENTS = [
  { text: '৳২,০০০ ছাড়', code: 'WIN20TAKA', color: '#b45309' },
  { text: 'ফ্রি ডেলিভারি', code: 'FREESHIPWIN', color: '#1c1917' },
  { text: 'আইনস্টাইন ছাড়', code: 'EINSTEIN1939', color: '#78350f' },
  { text: 'শুভকামনা (আবার)', code: '', color: '#292524' },
  { text: '৳১,৫০০ ছাড়', code: 'MONON20', color: '#d97706' },
  { text: '৳৩,৮০০ বোনাস', code: 'BONUSPACK', color: '#15803d' },
];

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({
  isOpen,
  onClose,
  onClaimVoucher,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonSegment, setWonSegment] = useState<(typeof SEGMENTS)[number] | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const num = SEGMENTS.length;
    const arc = (2 * Math.PI) / num;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < num; i++) {
      const angle = i * arc;
      ctx.beginPath();
      ctx.fillStyle = SEGMENTS[i].color;
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 2, angle, angle + arc);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
      ctx.translate(radius, radius);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillText(SEGMENTS[i].text, radius - 16, 4);
      ctx.restore();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonSegment(null);
    setCopied(false);

    const winIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    const extraSpins = 5 * 360;
    const targetMod = 360 - winIndex * segmentAngle - segmentAngle / 2 - 90;
    const nextRotation = rotation + extraSpins + ((targetMod - (rotation % 360) + 360) % 360);

    setRotation(nextRotation);
    playWheelTickSound();

    const tickInterval = setInterval(() => {
      playWheelTickSound();
    }, 320);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      const prize = SEGMENTS[winIndex];
      setWonSegment(prize);
      if (prize.code) {
        onClaimVoucher(prize.code, prize.text);
      }
    }, 4000);
  };

  const handleCopy = () => {
    if (!wonSegment?.code) return;
    navigator.clipboard?.writeText(wonSegment.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 text-center shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close wheel"
          className="absolute top-4 right-4 p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="text-xs font-medium text-amber-400">মনন রয়্যাল ভাগ্য চাকা</div>
          <h3 className="font-serif-bn text-2xl font-bold text-stone-100">
            স্পিন করে জিতে নিন আসল ভাউচার
          </h3>
          <p className="text-xs text-stone-400">
            জিতলেই প্রোমো কোড স্বয়ংক্রিয়ভাবে আপনার চেকআউটে যুক্ত হবে।
          </p>
        </div>

        {/* Wheel + Pointer */}
        <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 drop-shadow"
            aria-hidden="true"
          />
          <canvas
            ref={canvasRef}
            width={256}
            height={256}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
            }}
            className="rounded-full border-4 border-amber-600/60 shadow-2xl"
          />
          <div className="absolute w-10 h-10 rounded-full bg-stone-950 border-2 border-amber-400 flex items-center justify-center font-cinzel font-bold text-amber-400 text-sm z-10">
            ম
          </div>
        </div>

        {wonSegment && (
          <div className="bg-stone-950 border border-amber-700/50 rounded-xl p-4 space-y-2 text-xs">
            {wonSegment.code ? (
              <>
                <div className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>অভিনন্দন! আপনি জিতেছেন: {wonSegment.text}</span>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <code className="font-mono font-bold text-amber-300 bg-stone-900 border border-stone-700 px-3 py-1.5 rounded-lg select-all">
                    {wonSegment.code}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
                    title="কোড কপি করুন"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-stone-300">আরেকবার ঘুরিয়ে ভাগ্য পরীক্ষা করুন!</p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-stone-950 font-bold text-sm transition-colors cursor-pointer"
        >
          {isSpinning ? 'চাকা ঘুরছে...' : wonSegment ? 'আবার ঘুরান' : 'ভাগ্যের চাকা ঘুরান'}
        </button>
      </div>
    </div>
  );
};
