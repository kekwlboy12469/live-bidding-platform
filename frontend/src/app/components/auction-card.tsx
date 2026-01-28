import { useState, useEffect } from 'react';
import { Clock, Check, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export type AuctionStatus = 'neutral' | 'winning' | 'outbid' | 'ended';

export interface AuctionItem {
  id: string;
  title: string;
  currentBid: number;
  timeRemaining: number; // in seconds
  status: AuctionStatus;
  userBid?: number;
  winner?: { user: string; amount: number; time: number } | null;
}

interface AuctionCardProps {
  item: AuctionItem;
  onBid: (itemId: string, newBid: number) => void;
  onTimeEnd: (itemId: string) => void;
}

export function AuctionCard({ item, onBid, onTimeEnd }: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState(item.timeRemaining);
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashColor, setFlashColor] = useState<'green' | 'red'>('green');
  const [isShaking, setIsShaking] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  // Sync with parent's timeRemaining when it changes
  useEffect(() => {
    setTimeLeft(item.timeRemaining);
  }, [item.timeRemaining]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || item.status === 'ended') {
      if (timeLeft > 0) {
        setTimeLeft(0);
        onTimeEnd(item.id);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          onTimeEnd(item.id);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, item.id, item.status, onTimeEnd]);

  // Trigger animations on status change
  useEffect(() => {
    if (item.status === 'winning') {
      setFlashColor('green');
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 500);
    } else if (item.status === 'outbid') {
      setFlashColor('red');
      setIsFlashing(true);
      setIsShaking(true);
      setTimeout(() => {
        setIsFlashing(false);
        setIsShaking(false);
      }, 500);
    }
  }, [item.status]);

  // Pulse animation for timer when low
  useEffect(() => {
    setIsPulsing(timeLeft <= 60 && timeLeft > 0);
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  const handleBid = () => {
    const newBid = item.currentBid + 10;
    onBid(item.id, newBid);
    setFlashColor('green');
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 500);
  };

  const getStatusBadge = () => {
    switch (item.status) {
      case 'winning':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Check className="w-4 h-4 text-[#10B981]" />
            <span className="text-sm font-medium text-[#10B981]">You're winning!</span>
          </div>
        );
      case 'outbid':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30 animate-pulse">
            <X className="w-4 h-4 text-[#EF4444]" />
            <span className="text-sm font-medium text-[#EF4444]">Outbid!</span>
          </div>
        );
      case 'ended':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-500/10 border border-gray-500/30">
            <span className="text-sm font-medium text-gray-400">
              🏆 Winner: {item.winner?.user || "No bids"}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const isEnded = item.status === 'ended' || timeLeft <= 0;

  return (
    <div
      className={`
        relative bg-[#020617] rounded-xl p-6 border border-gray-800/50
        transition-all duration-300
        ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}
        ${isEnded ? 'opacity-60' : 'hover:border-gray-700/50'}
      `}
    >
      {/* Flash overlay */}
      {isFlashing && (
        <div
          className={`
            absolute inset-0 rounded-xl pointer-events-none
            ${flashColor === 'green' ? 'bg-[#10B981]/20' : 'bg-[#EF4444]/20'}
            animate-[flash_0.5s_ease-out]
          `}
        />
      )}

      <div className="relative space-y-4">
        {/* Title */}
        <h2 className="text-xl font-semibold text-white">{item.title}</h2>

        {/* Current Bid */}
        <div className="space-y-1">
          <p className="text-sm text-gray-400">Current Bid</p>
          <h1
            className={`
              text-4xl font-bold text-[#0EA5E9]
              transition-all duration-300
              ${isFlashing ? 'scale-105' : 'scale-100'}
            `}
          >
            {formatCurrency(item.currentBid)}
          </h1>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2">
          <Clock
            className={`
              w-5 h-5 text-gray-400
              ${isPulsing ? 'animate-pulse text-[#EF4444]' : ''}
            `}
          />
          <span
            className={`
              text-lg font-mono font-semibold
              ${isPulsing ? 'text-[#EF4444]' : 'text-gray-300'}
            `}
          >
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Status Badge */}
        {getStatusBadge()}

        {/* Bid Button */}
        <Button
          onClick={handleBid}
          disabled={isEnded}
          className={`
            w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold
            transition-all duration-300
            ${!isEnded ? 'hover:shadow-[0_0_20px_rgba(14,165,233,0.5)]' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
          `}
        >
          Bid +$10
        </Button>
      </div>
    </div>
  );
}

// Add animations to global styles
export const auctionCardStyles = `
  @keyframes flash {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
