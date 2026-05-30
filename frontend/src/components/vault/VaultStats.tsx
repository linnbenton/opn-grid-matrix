"use client";

export default function VaultStats({
  totalStaked,
  yourStake,
  apy,
  nftBoost,
}: any) {
  return (
    <div className="p-4 border rounded-xl bg-black text-white">
      <h3 className="font-bold mb-3">📊 Vault Stats</h3>

      <div className="space-y-2 text-sm">
        <p>
          Total Staked: <span className="text-green-400">{totalStaked}</span>
        </p>
        <p>
          Your Stake: <span className="text-blue-400">{yourStake}</span>
        </p>
        <p>
          APY: <span className="text-yellow-400">{apy}%</span>
        </p>
        <p>
          NFT Boost: <span className="text-purple-400">+{nftBoost}%</span>
        </p>
      </div>
    </div>
  );
}
