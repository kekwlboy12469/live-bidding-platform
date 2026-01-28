import { useEffect, useState } from "react";
import io from "socket.io-client";
import { AuctionCard, AuctionStatus } from "@/app/components/auction-card";

// Connect to backend socket server
const socket = io("http://localhost:4000");
// For Docker networking - use backend container name
const socket = io('http://host.docker.internal:4000');
type Bid = {
  amount: number;
  user: string;
  time: number;
};

type Item = {
  id: string;
  name: string;
  image: string;
  price: number;
  bids: Bid[];
  endsAt: number;
  ended: boolean;
  winner: Bid | null;
  highestBidder?: string | null;
};

type ItemStatus = Record<string, AuctionStatus>;

export default function App() {
  const [items, setItems] = useState<Record<string, Item>>({});
  const [user, setUser] = useState<{ id: string; wallet: number } | null>(null);
  const [now, setNow] = useState(Date.now());
  const [itemStatus, setItemStatus] = useState<ItemStatus>({});
  const [serverTimeOffset, setServerTimeOffset] = useState(0); // offset between client and server

  // Get server-synced "now"
  const getServerTime = () => now - serverTimeOffset;

  useEffect(() => {
    socket.on("init", (data: { items: Record<string, Item>; serverTime: number }) => {
      // Calculate offset: if serverTime is 1000ms behind client, offset is positive
      const offset = Date.now() - data.serverTime;
      setServerTimeOffset(offset);
      setItems(data.items);
      
      const statuses: ItemStatus = {};
      Object.keys(data.items).forEach(id => {
        statuses[id] = 'neutral';
      });
      setItemStatus(statuses);
    });

    socket.on("USER_INIT", (data) => {
      setUser({ id: data.userId, wallet: data.wallet });
    });

    socket.on("UPDATE_BID", (item: Item) => {
      // Update item price and bids
      setItems(prev => ({ ...prev, [item.id]: item }));
      
      // Figure out my status on this item
      setItemStatus(prev => {
        let newStatus: AuctionStatus = 'neutral';
        
        if (item.ended) {
          newStatus = 'ended';
        } else if (item.highestBidder === user?.id) {
          newStatus = 'winning';
        } else if (prev[item.id] === 'winning') {
          // I was winning but someone outbid me!
          newStatus = 'outbid';
        }
        
        return { ...prev, [item.id]: newStatus };
      });
    });

    socket.on("auctionEnded", ({ itemId, winner, serverTime }) => {
      // Update offset if server time provided
      if (serverTime) {
        setServerTimeOffset(Date.now() - serverTime);
      }
      setItems(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          ended: true,
          winner
        }
      }));
      setItemStatus(prev => ({ ...prev, [itemId]: 'ended' }));
    });

    socket.on("BID_ACCEPTED", ({ wallet }) => {
      setUser(u => u && ({ ...u, wallet }));
    });

    socket.on("BID_REJECTED", () => {
      // Oops, bid failed - give the money back
      setUser(u => u && ({ ...u, wallet: u.wallet + 10 }));
      alert("❌ Bid rejected - auction may have ended or bid too low");
    });

    return () => {
      socket.off();
    };
  }, [user?.id]);

  // Update "now" every second so timers count down live
  useEffect(() => {
    const ticker = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(ticker);
  }, []);

  const placeBid = (itemId: string, amount: number) => {
    if (!user) return;

    // Subtract money right away (we'll get it back if bid fails)
    setUser(u => u && ({ ...u, wallet: u.wallet - 10 }));

    // Tell server about the bid
    socket.emit("BID_PLACED", {
      itemId,
      amount,
      userId: user.id
    });
  };

  // When auction timer hits zero, mark it as ended
  const handleTimeEnd = (itemId: string) => {
    setItemStatus(prev => ({ ...prev, [itemId]: 'ended' }));
  };

  return (
    <div style={{ padding: 40, background: "#0b1220", minHeight: "100vh" }}>
      
      {/* Header with title and server time sync */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30
      }}>
        <div>
          <h1 style={{ color: "#1cc8ff", marginBottom: 8 }}>🏆 Live Bidding</h1>
          <div style={{ fontSize: 12, color: "#888" }}>
            🕐 Server: {new Date(getServerTime()).toLocaleTimeString()}
          </div>
        </div>

        {/* Show my wallet balance */}
        {user && (
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#22c55e", fontSize: 22, fontWeight: "bold" }}>
              💰 ${user.wallet.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>
              You: {user.id.substring(0, 8)}...
            </div>
          </div>
        )}
      </div>

      {/* Grid of auction items */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 30 }}>
        {Object.values(items).map(item => {
          // Calculate time left using server time (can't be hacked)
          const serverNow = getServerTime();
          const timeRemaining = Math.max(0, Math.floor((item.endsAt - serverNow) / 1000));
          
          return (
            <div key={item.id} style={{ position: "relative" }}>
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  marginBottom: 16,
                  height: 250,
                  objectFit: "cover"
                }}
              />
              <AuctionCard
                item={{
                  id: item.id,
                  title: item.name,
                  currentBid: item.price,
                  timeRemaining,
                  status: itemStatus[item.id] || 'neutral',
                  userBid: user?.id === item.highestBidder ? item.price : undefined,
                  winner: item.winner
                }}
                onBid={(itemId, newBid) => placeBid(itemId, newBid)}
                onTimeEnd={handleTimeEnd}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
