"use client";

import { useState } from "react";

export default function StakeCard({ onStake, onUnstake, loading }: any) {
  const [tokenId, setTokenId] = useState("");

  return (
    <div className="p-4 border rounded-xl bg-black text-white">
      <h3 className="font-bold">🧩 Stake NFT</h3>

      <input
        type="text"
        inputMode="numeric"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        className="w-full mt-3 px-4 py-3 rounded-xl border border-[#38bdf8] bg-[#050816]/90 text-white font-mono text-base font-bold outline-none caret-[#38bdf8] placeholder:text-gray-500 focus:ring-2 focus:ring-[#38bdf8]"
      />

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onStake(Number(tokenId))}
          disabled={loading}
          className="bg-blue-600 px-3 py-1 rounded"
        >
          Stake
        </button>

        <button
          onClick={() => onUnstake(Number(tokenId))}
          disabled={loading}
          className="bg-red-600 px-3 py-1 rounded"
        >
          Unstake
        </button>
      </div>
    </div>
  );
}
