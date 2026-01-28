/**
 * AUCTION CARD COMPONENT LIBRARY
 * 
 * Production-ready component variants for real-time auction platform.
 * All states documented with CSS variables and responsive breakpoints.
 */

import { Clock, Check, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

/**
 * CSS VARIABLES (defined in theme or inline)
 * --color-bg-primary: #0F172A
 * --color-bg-card: #020617
 * --color-border: rgba(255, 255, 255, 0.1)
 * --color-cyan: #0EA5E9
 * --color-green: #10B981
 * --color-red: #EF4444
 * --color-text-primary: #FFFFFF
 * --color-text-secondary: #94A3B8
 */

// ====================================
// VARIANT 1: NEUTRAL STATE (Default)
// ====================================
export function AuctionCardNeutral() {
  return (
    <div className="bg-[#020617] rounded-xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Vintage Rolex Submariner</h2>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-400">Current Bid</p>
          <h1 className="text-4xl font-bold text-[#0EA5E9]">$12,450</h1>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className="text-lg font-mono font-semibold text-gray-300">2:34</span>
        </div>

        <Button className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] text-white font-semibold transition-all duration-300">
          Bid +$10
        </Button>
      </div>
    </div>
  );
}

// ====================================
// VARIANT 2: WINNING STATE
// Features: Green glow, success badge, flash animation
// ====================================
export function AuctionCardWinning() {
  return (
    <div className="relative bg-[#020617] rounded-xl p-6 border border-gray-800/50 transition-all duration-300">
      {/* Green flash overlay (triggered on state change) */}
      <div className="absolute inset-0 rounded-xl pointer-events-none bg-[#10B981]/20 animate-[flash_0.5s_ease-out]" />
      
      <div className="relative space-y-4">
        <h2 className="text-xl font-semibold text-white">Picasso Print - Limited Edition</h2>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-400">Current Bid</p>
          <h1 className="text-4xl font-bold text-[#0EA5E9] scale-105 transition-all duration-300">
            $89,000
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className="text-lg font-mono font-semibold text-gray-300">1:12</span>
        </div>

        {/* Winning Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Check className="w-4 h-4 text-[#10B981]" />
          <span className="text-sm font-medium text-[#10B981]">You're winning!</span>
        </div>

        <Button className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] text-white font-semibold transition-all duration-300">
          Bid +$10
        </Button>
      </div>
    </div>
  );
}

// ====================================
// VARIANT 3: OUTBID STATE
// Features: Red pulse, warning badge, shake animation
// ====================================
export function AuctionCardOutbid() {
  return (
    <div className="relative bg-[#020617] rounded-xl p-6 border border-gray-800/50 animate-[shake_0.5s_ease-in-out] transition-all duration-300">
      {/* Red flash overlay */}
      <div className="absolute inset-0 rounded-xl pointer-events-none bg-[#EF4444]/20 animate-[flash_0.5s_ease-out]" />
      
      <div className="relative space-y-4">
        <h2 className="text-xl font-semibold text-white">Tesla Cybertruck Founder Series</h2>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-400">Current Bid</p>
          <h1 className="text-4xl font-bold text-[#0EA5E9] scale-105 transition-all duration-300">
            $245,000
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className="text-lg font-mono font-semibold text-gray-300">5:22</span>
        </div>

        {/* Outbid Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30 animate-pulse">
          <X className="w-4 h-4 text-[#EF4444]" />
          <span className="text-sm font-medium text-[#EF4444]">Outbid!</span>
        </div>

        <Button className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] text-white font-semibold transition-all duration-300">
          Bid +$10
        </Button>
      </div>
    </div>
  );
}

// ====================================
// VARIANT 4: ENDED STATE
// Features: Greyed out, disabled button, ended badge
// ====================================
export function AuctionCardEnded() {
  return (
    <div className="bg-[#020617] rounded-xl p-6 border border-gray-800/50 opacity-60 transition-all duration-300">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Hermès Birkin Bag - Crocodile</h2>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-400">Final Bid</p>
          <h1 className="text-4xl font-bold text-[#0EA5E9]">$35,000</h1>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className="text-lg font-mono font-semibold text-gray-300">0:00</span>
        </div>

        {/* Ended Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-500/10 border border-gray-500/30">
          <span className="text-sm font-medium text-gray-400">Auction closed</span>
        </div>

        <Button disabled className="w-full bg-[#0EA5E9] text-white font-semibold opacity-50 cursor-not-allowed">
          Bid +$10
        </Button>
      </div>
    </div>
  );
}

// ====================================
// VARIANT 5: LOW TIME WARNING
// Features: Pulsing red timer, urgency indicator
// ====================================
export function AuctionCardLowTime() {
  return (
    <div className="bg-[#020617] rounded-xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Rare 1st Edition Pokémon Card Set</h2>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-400">Current Bid</p>
          <h1 className="text-4xl font-bold text-[#0EA5E9]">$18,750</h1>
        </div>

        {/* Pulsing red timer */}
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#EF4444] animate-pulse" />
          <span className="text-lg font-mono font-semibold text-[#EF4444] animate-pulse">0:45</span>
        </div>

        <Button className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] text-white font-semibold transition-all duration-300">
          Bid +$10
        </Button>
      </div>
    </div>
  );
}

// ====================================
// COMPONENT LIBRARY SHOWCASE
// Display all variants side by side
// ====================================
export function AuctionCardShowcase() {
  return (
    <div className="min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Auction Card Component Library</h1>
          <p className="text-gray-400">Production-ready variants with all states and transitions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Variant 1: Neutral</p>
            <AuctionCardNeutral />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Variant 2: Winning</p>
            <AuctionCardWinning />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Variant 3: Outbid</p>
            <AuctionCardOutbid />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Variant 4: Ended</p>
            <AuctionCardEnded />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Variant 5: Low Time</p>
            <AuctionCardLowTime />
          </div>
        </div>

        {/* Design Specifications */}
        <div className="mt-12 p-6 bg-[#020617] rounded-xl border border-gray-800/50">
          <h2 className="text-2xl font-bold text-white mb-4">Design Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-[#0EA5E9]">Colors</h3>
              <ul className="space-y-1 text-gray-400 font-mono">
                <li>Background: #0F172A</li>
                <li>Cards: #020617</li>
                <li>Cyan (Bid): #0EA5E9</li>
                <li>Green (Win): #10B981</li>
                <li>Red (Outbid): #EF4444</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-[#0EA5E9]">Typography</h3>
              <ul className="space-y-1 text-gray-400 font-mono">
                <li>Font: Inter (400, 500, 600, 700, 800)</li>
                <li>Title: 1.25rem / 600</li>
                <li>Bid Amount: 2.25rem / 700</li>
                <li>Timer: 1.125rem / 600 / mono</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-[#0EA5E9]">Animations</h3>
              <ul className="space-y-1 text-gray-400">
                <li>Flash: 0.5s ease-out (state change)</li>
                <li>Shake: 0.5s ease-in-out (outbid)</li>
                <li>Pulse: continuous (low time)</li>
                <li>Glow: hover (button hover)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-[#0EA5E9]">Responsive</h3>
              <ul className="space-y-1 text-gray-400">
                <li>Desktop: 3-column grid (1200px+)</li>
                <li>Tablet: 2-column grid (768px+)</li>
                <li>Mobile: 1-column stack</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
