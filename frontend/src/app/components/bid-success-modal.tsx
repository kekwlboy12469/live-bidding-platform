import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Check } from 'lucide-react';

interface BidSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  newBid: number;
}

export function BidSuccessModal({ isOpen, onClose, itemTitle, newBid }: BidSuccessModalProps) {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsFlashing(true);
      const timer = setTimeout(() => {
        setIsFlashing(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#020617] border border-gray-800/50 text-white max-w-md">
        {isFlashing && (
          <div className="absolute inset-0 bg-[#10B981]/20 rounded-lg pointer-events-none animate-[flash_0.5s_ease-out]" />
        )}
        
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Check className="w-6 h-6 text-[#10B981]" />
            </div>
            Bid Placed Successfully!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-[#0F172A] rounded-lg border border-gray-800/50">
            <p className="text-sm text-gray-400 mb-1">Item</p>
            <p className="text-lg font-semibold text-white">{itemTitle}</p>
          </div>
          
          <div className="p-4 bg-[#0F172A] rounded-lg border border-gray-800/50">
            <p className="text-sm text-gray-400 mb-1">Your Bid</p>
            <p className="text-3xl font-bold text-[#0EA5E9]">
              ${newBid.toLocaleString()}
            </p>
          </div>
          
          <p className="text-sm text-gray-400 text-center">
            You're currently the highest bidder! 🎉
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
