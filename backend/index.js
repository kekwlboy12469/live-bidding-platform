import express from "express";
import http from "http";
import { Server } from "socket.io";
import { items as importedItems } from "./items.js";

// Setup express + websockets
const app = express();
const server = http.createServer(app);
const users = {};

const io = new Server(server, {
  cors: { origin: "*" }
});

// How long each auction lasts (in milliseconds)
const AUCTION_DURATION = 2 * 60 * 1000; // 2 minutes

// Build server items from the canonical `items.js` file and normalize fields
// This lets us use the items.js file as the single source of truth
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
        highestBidder: it.highestBidder ?? null
      }
    ];
  })
);

// When someone connects
io.on("connection", socket => {
  const userId = `user_${Math.floor(Math.random() * 1000)}`;
  // Give each user a starting wallet
  users[userId] = users[userId] || 5000;

  // Send user their ID and wallet
  socket.emit("USER_INIT", {
    userId,
    wallet: users[userId]
  });
  console.log("✅ User connected:", socket.id);

  // Send all auction items with server timestamp
  socket.emit("init", {
    items,
    serverTime: Date.now()
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

    // Deduct money from wallet
    users[userId] -= 10; // only deduct increment, not full amount
    // Update item price and record the bid
    item.price = amount;
    item.highestBidder = userId;
    item.bids.push({ user: userId, amount, time: Date.now() });

    // Tell everyone about the new bid
    io.emit("UPDATE_BID", item);

    // Confirm to bidder
    socket.emit("BID_ACCEPTED", {
      wallet: users[userId]
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Check every second if any auctions have ended
setInterval(() => {
  const now = Date.now();

  Object.values(items).forEach(item => {
    // Mark as ended if time is up
    if (!item.ended && now >= item.endsAt) {
      item.ended = true;
      // Winner is the person with the last bid
      item.winner = item.bids.at(-1) || null;

      // Broadcast that auction ended
      io.emit("auctionEnded", {
        itemId: item.id,
        winner: item.winner,
        serverTime: Date.now()
      });
    }
  });
}, 1000);

server.listen(4000, () =>
  console.log("🎯 Auction server running on http://localhost:4000")
);

