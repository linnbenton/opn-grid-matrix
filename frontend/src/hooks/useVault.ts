import { useState, useCallback } from "react";
import { config } from "@/wagmi";
import { VAULT_ABI } from "@/services/vault";
import { readContract, writeContract } from "wagmi/actions";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function useVault(
  vaultAddress: `0x${string}`,
  _signer: any,
  userAddress: `0x${string}`,
) {
  const [loading, setLoading] = useState(false);

  const isValidAddress =
    vaultAddress &&
    vaultAddress !== ZERO_ADDRESS &&
    vaultAddress.startsWith("0x") &&
    vaultAddress.length === 42;

  const stakeNFT = useCallback(
    async (tokenId: number) => {
      setLoading(true);
      try {
        const tx = await writeContract(config, {
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: "stake",
          args: [BigInt(tokenId)],
        });
        return tx;
      } catch (error: any) {
        // Gracefully handle user rejection without breaking the console or dApp UI
        if (error.code === 4001 || error.message?.includes("User denied")) {
          console.log("Staking cancelled by the user.");
        } else {
          console.error("Actual staking error:", error);
        }
      } finally {
        setLoading(false);
      }
    },
    [vaultAddress],
  );

  const unstakeNFT = useCallback(
    async (tokenId: number) => {
      setLoading(true);
      try {
        const tx = await writeContract(config, {
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: "unstake",
          args: [BigInt(tokenId)],
        });
        return tx;
      } catch (error: any) {
        // Gracefully handle user rejection without breaking the console or dApp UI
        if (error.code === 4001 || error.message?.includes("User denied")) {
          console.log("Unstaking cancelled by the user.");
        } else {
          console.error("Actual unstaking error:", error);
        }
      } finally {
        setLoading(false);
      }
    },
    [vaultAddress],
  );

  const claimRewards = useCallback(async () => {
    setLoading(true);
    try {
      const tx = await writeContract(config, {
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: "claimRewards",
      });
      return tx;
    } catch (error: any) {
      // Gracefully handle user rejection without breaking the console or dApp UI
      if (error.code === 4001 || error.message?.includes("User denied")) {
        console.log("Claiming rewards cancelled by the user.");
      } else {
        console.error("Actual claiming rewards error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [vaultAddress]);

  const getReward = useCallback(async () => {
    if (!isValidAddress || !userAddress || userAddress === ZERO_ADDRESS) {
      return BigInt(0);
    }

    try {
      const data = await readContract(config, {
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: "userReward",
        args: [userAddress],
      });

      return data as bigint;
    } catch (error) {
      console.error("Failed to fetch vault rewards:", error);
      return BigInt(0);
    }
  }, [vaultAddress, userAddress, isValidAddress]);

  return {
    stakeNFT,
    unstakeNFT,
    claimRewards,
    getReward,
    loading,
  };
}
