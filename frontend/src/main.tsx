
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { auctionCardStyles } from "./app/components/auction-card";

  const styleSheet = document.createElement("style");
  styleSheet.textContent = auctionCardStyles;
  document.head.appendChild(styleSheet);

  createRoot(document.getElementById("root")!).render(<App />);
  