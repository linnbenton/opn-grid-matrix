import { useState, useEffect } from "react";
import { useVault } from "../../hooks/useVault";
import StakeCard from "./StakeCard";
import RewardChart from "./RewardChart";
import VaultStats from "./VaultStats";

export default function VaultPanel({ vaultAddress, signer, userAddress }: any) {
  const isValidVault =
    vaultAddress &&
    typeof vaultAddress === "string" &&
    vaultAddress.startsWith("0x") &&
    vaultAddress.length === 42;

  const { stakeNFT, unstakeNFT, claimRewards, getReward, loading } = useVault(
    vaultAddress,
    signer,
    userAddress,
  );

  const [tokenId, setTokenId] = useState("");
  const [reward, setReward] = useState("0");

  useEffect(() => {
    if (!isValidVault || !userAddress) return;

    const load = async () => {
      const r = await getReward();
      setReward(r.toString());
    };

    load();
  }, [userAddress, vaultAddress]);

  if (!isValidVault) {
    return (
      <div className="p-4 border rounded-xl bg-black text-red-400">
        ❌ Vault not deployed / invalid address
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-xl bg-black text-white">
      <h2 className="text-xl font-bold">💰 Puzzle Vault</h2>

      {/* 📊 GRID LAYOUT BIAR GAK NEMPEL */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT SIDE */}
        <div className="space-y-4">
          <VaultStats
            totalStaked={1200}
            yourStake={200}
            apy={18.4}
            nftBoost={10}
          />

          <RewardChart reward={Number(reward)} />
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4">
          {/* Pending Reward Card */}
          <div className="p-4 border rounded-xl bg-[#0d1b3e]">
            <p className="text-sm text-gray-400">Pending Reward</p>
            <p className="text-green-400 text-xl font-bold">{reward}</p>
          </div>

          {/* Stake Card */}
          <StakeCard
            onStake={stakeNFT}
            onUnstake={unstakeNFT}
            loading={loading}
          />

          {/* 💥 CLAIM BUTTON (NOW INSIDE CARD AREA) */}
          <button
            onClick={claimRewards}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded font-bold transition"
          >
            Claim Rewards
          </button>
        </div>
      </div>
    </div>
  );
}
