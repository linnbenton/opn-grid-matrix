import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

/*
─────────────────────────────────────────────
OPN TESTNET CHAIN
─────────────────────────────────────────────
*/

export const opnChain = defineChain({
  id: 2026,

  name: "OPN Testnet",

  nativeCurrency: {
    name: "OPN",
    symbol: "OPN",
    decimals: 18,
  },

  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.iopn.tech"],
    },
  },

  blockExplorers: {
    default: {
      name: "OPN Explorer",
      url: "https://testnet.iopn.tech",
    },
  },

  testnet: true,
});

/*
─────────────────────────────────────────────
WAGMI CONFIG
─────────────────────────────────────────────
*/

export const config = createConfig({
  chains: [opnChain],

  connectors: [injected()],

  transports: {
    [opnChain.id]: http("https://testnet-rpc.iopn.tech"),
  },
});
