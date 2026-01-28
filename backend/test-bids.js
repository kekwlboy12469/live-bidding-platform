import { io } from "socket.io-client";

const socketA = io("http://localhost:3000");
const socketB = io("http://localhost:3000");

socketA.on("connect", () => {
  console.log("User A connected");
});

socketB.on("connect", () => {
  console.log("User B connected");
});

socketA.on("UPDATE_BID", data => {
  console.log("User A UPDATE_BID:", data);
});

socketB.on("UPDATE_BID", data => {
  console.log("User B UPDATE_BID:", data);
});

socketA.on("BID_REJECTED", err => {
  console.log("User A REJECTED:", err);
});

socketB.on("BID_REJECTED", err => {
  console.log("User B REJECTED:", err);
});

// Fire bids at the SAME TIME
setTimeout(() => {
  socketA.emit("BID_PLACED", {
    itemId: "1",
    amount: 1010,
    userId: "UserA"
  });

  socketB.emit("BID_PLACED", {
    itemId: "1",
    amount: 1010,
    userId: "UserB"
  });
}, 1000);
