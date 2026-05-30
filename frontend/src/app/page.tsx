"use client";

import { useAccount } from "wagmi";
import PuzzleBoard from "@/components/PuzzleBoard";

// Your deployed Vault smart contract hex address
const DEPLOYED_VAULT_ADDRESS =
  "0x325f79e812548A82b0bdeeDc9Dc0779bfb880dF0" as const;

export default function Home() {
  const { address } = useAccount();

  return (
    <main>
      <PuzzleBoard
        vaultAddress={DEPLOYED_VAULT_ADDRESS}
        signer={null} // We are using wagmi/actions directly inside hooks, so signer can be safely passed as null
        userAddress={address || "0x0000000000000000000000000000000000000000"} // Fallback to zero address if wallet is not connected yet
      />
    </main>
  );
}
