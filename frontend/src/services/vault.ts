import { getContract } from "viem";
import { config } from "@/wagmi";
import { getPublicClient, getWalletClient } from "wagmi/actions";

export const VAULT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "userReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export async function getVaultContract(vaultAddress: `0x${string}`) {
  const publicClient = await getPublicClient(config);
  const walletClient = await getWalletClient(config);

  return getContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    client: { public: publicClient, wallet: walletClient },
  });
}
