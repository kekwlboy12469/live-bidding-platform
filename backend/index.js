import express from "express";
import http from "http";
import { Server } from "socket.io";
import { items as importedItems } from "./items.js";
import cors from "cors";

// Setup express + websockets
const app = express();
const server = http.createServer(app);
const users = {};


const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://live-bidding-platform-beta.vercel.app",

  
];

// ✅ Express CORS 
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow Postman/curl
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked: " + origin));
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Socket.IO CORS 
const io = new Server(server, {
  cors: {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error("Socket.IO CORS blocked: " + origin));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// How long each auction lasts (in milliseconds)
const AUCTION_DURATION = 2 * 60 * 1000; // 2 minutes

// Build server items from the canonical `items.js` file and normalize fields
const items = Object.fromEntries(
  Object.entries(importedItems).map(([key, it]) => {
    const image = (it.image ?? "").toString().trim();
    const id = it.id ?? key;
    return [
      id,
      {
        id,
        name: it.title ?? it.name ?? "",
        image,
        price: it.currentBid ?? it.startingPrice ?? it.price ?? 0,
        bids: Array.isArray(it.bids) ? it.bids : it.bidHistory ?? [],
        endsAt: it.endTime ?? it.endsAt ?? Date.now() + AUCTION_DURATION,
        ended: it.ended ?? false,
        winner: it.winner ?? null,
        highestBidder: it.highestBidder ?? null,
      },
    ];
  })
);

// When someone connects
io.on("connection", (socket) => {
  const userId = `user_${Math.floor(Math.random() * 1000)}`;

  // Give each user a starting wallet
  users[userId] = users[userId] || 5000;

  // Send user their ID and wallet
  socket.emit("USER_INIT", {
    userId,
    wallet: users[userId],
  });

  console.log("✅ User connected:", socket.id, "as", userId);

  // Send all auction items with server timestamp
  socket.emit("init", {
    items,
    serverTime: Date.now(),
  });

  // Handle incoming bids
  socket.on("BID_PLACED", ({ itemId, amount }) => {
    const userWallet = users[userId];

    // Check if user has enough money
    if (userWallet < amount) {
      socket.emit("BID_REJECTED", { itemId, reason: "Insufficient funds" });
      return;
    }

    const item = items[itemId];

    // Check if item exists and auction is still going
    if (!item || Date.now() > item.endsAt || amount <= item.price) {
      socket.emit("BID_REJECTED", { itemId, reason: "Invalid bid" });
      return;
    }

    // Deduct money from wallet (increment only)
    users[userId] -= 10;

    // Update item price and record the bid
    item.price = amount;
    item.highestBidder = userId;
    item.bids.push({ user: userId, amount, time: Date.now() });

    // Tell everyone about the new bid
    io.emit("UPDATE_BID", item);

    // Confirm to bidder
    socket.emit("BID_ACCEPTED", {
      wallet: users[userId],
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});
function resetAuction(item) {
  // If you have a starting price stored, use it. Otherwise 0 is ok.
  item.price = item.startingPrice ?? 0;

  item.bids = [];
  item.ended = false;
  item.winner = null;
  item.highestBidder = null;
  item.endsAt = Date.now() + AUCTION_DURATION;
}

// Check every second if any auctions have ended
setInterval(() => {
  const now = Date.now();

  Object.values(items).forEach((item) => {
    if (!item.ended && now >= item.endsAt) {
      item.ended = true;
      item.winner = item.bids.at(-1) || null;

      io.emit("auctionEnded", {
        itemId: item.id,
        winner: item.winner,
        serverTime: Date.now()
      });

      // ⏳ Auto-restart auction after 10 seconds
      setTimeout(() => {
        resetAuction(item);
        io.emit("UPDATE_BID", item);
      }, 10_000);
    }
  });
}, 1000);
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🎯 Auction server running on port ${PORT}`);
});

