"use client";

import React, { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import VaultPanel from "./vault/VaultPanel";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWriteContract,
  useBalance,
  useChainId,
} from "wagmi";

// OPN Ecosystem Pillars representation for the puzzle grid
const OPN_PILLARS: Record<number, string> = {
  1: "Sovereign Staking",
  2: "Mosaic RWA",
  3: "DID Identity",
  4: "Internet of Things",
  5: "OPN Node",
  6: "Builder's Pass",
  7: "Interoperability",
  8: "AI Worker",
  0: "",
};

// Winning configuration state for the matrix puzzle
const TARGET_SOLUTION = [1, 2, 3, 4, 5, 6, 7, 8, 0];

const CONTRACT_ADDRESS = "0xe495E3b24cBE70FC6Ba08BE82d3719D748EF11Df";

interface PuzzleBoardProps {
  vaultAddress: `0x${string}`;
  signer: any;
  userAddress: `0x${string}`;
}

// Fixed: Destructured the incoming props with strict TypeScript typing to resolve the page.tsx compilation error
export default function PuzzleBoard({
  vaultAddress,
  signer,
  userAddress,
}: PuzzleBoardProps) {
  // ... Your existing state hooks and game logic functions below can remain exactly the same
  /*
  ─────────────────────────────────────────────
  Core States
  ─────────────────────────────────────────────
  */
  const [mounted, setMounted] = useState(false);
  const [grid, setGrid] = useState<number[]>([1, 2, 3, 4, 0, 5, 7, 8, 6]);
  const [isSolved, setIsSolved] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null);

  /*
  ─────────────────────────────────────────────
  Wallet Hooks
  ─────────────────────────────────────────────
  */
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, isPending, isSuccess } = useWriteContract();
  const chainId = useChainId();
  const isCorrectNetwork = chainId === 2026;
  const { data: walletClient } = useWalletClient();

  /*
  ─────────────────────────────────────────────
  Wallet Balance
  ─────────────────────────────────────────────
  */
  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address,
    chainId: 2026,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const hasBalanceData = balanceData && typeof balanceData.value === "bigint";
  const rawBalance = hasBalanceData ? balanceData.value : BigInt(0);
  const decimals = balanceData?.decimals ?? 18;
  const formattedBalance = hasBalanceData
    ? Number(rawBalance) / 10 ** decimals
    : 0;
  const tokenSymbol = balanceData?.symbol ?? "OPN";
  const hasEnoughOPN = formattedBalance >= 1;

  /*
  ─────────────────────────────────────────────
  Hydration Fix
  ─────────────────────────────────────────────
  */
  useEffect(() => {
    setMounted(true);
  }, []);

  /*
  ─────────────────────────────────────────────
  Puzzle Validation
  ─────────────────────────────────────────────
  */
  useEffect(() => {
    setIsSolved(JSON.stringify(grid) === JSON.stringify(TARGET_SOLUTION));
  }, [grid]);

  /*
  ─────────────────────────────────────────────
  Puzzle Movement
  ─────────────────────────────────────────────
  */
  const handleTileClick = (index: number) => {
    const emptyIndex = grid.indexOf(0);
    const validMoves = [index - 1, index + 1, index - 3, index + 3];

    if (!validMoves.includes(emptyIndex)) return;

    const isInvalidHorizontalMove =
      Math.abs(emptyIndex - index) === 1 &&
      Math.floor(emptyIndex / 3) !== Math.floor(index / 3);

    if (isInvalidHorizontalMove) return;

    const updatedGrid = [...grid];
    updatedGrid[emptyIndex] = grid[index];
    updatedGrid[index] = 0;
    setGrid(updatedGrid);
  };

  /*
  ─────────────────────────────────────────────
  NFT Mint
  ─────────────────────────────────────────────
  */
  const handleMint = async () => {
    try {
      if (!isConnected) {
        alert("Connect your wallet first.");
        return;
      }

      if (!isCorrectNetwork) {
        alert("Switch to OPN Testnet.");
        return;
      }

      const isValidSolution =
        JSON.stringify(grid) === JSON.stringify(TARGET_SOLUTION);
      if (!isValidSolution) {
        alert("Invalid puzzle solution. Please solve it first.");
        return;
      }

      const puzzleAbi = [
        {
          inputs: [
            {
              internalType: "uint8[9]",
              name: "clientSolution",
              type: "uint8[9]",
            },
            {
              internalType: "string",
              name: "tokenURI",
              type: "string",
            },
          ],
          name: "verifyAndMint",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ] as const;

      const currentSolution = [
        grid[0],
        grid[1],
        grid[2],
        grid[3],
        grid[4],
        grid[5],
        grid[6],
        grid[7],
        grid[8],
      ] as const;

      console.log("=== DEBUG MINT ===");
      console.log("Connected:", isConnected);
      console.log("Correct Network:", isCorrectNetwork);
      console.log("Contract:", CONTRACT_ADDRESS);
      console.log("Grid:", grid);
      console.log("Target:", TARGET_SOLUTION);
      console.log("CurrentSolution:", currentSolution);

      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: puzzleAbi,
        functionName: "verifyAndMint",
        args: [
          currentSolution as unknown as readonly [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
          ],
          "ipfs://bafybeihd3xxxxx-metadata-puzzle-iopn",
        ],
        gas: BigInt(250000),
      });
    } catch (error: any) {
      console.error("FULL ERROR:", error);

      console.log("name:", error?.name);
      console.log("message:", error?.message);
      console.log("shortMessage:", error?.shortMessage);
      console.log("details:", error?.details);
      console.log("cause:", error?.cause);

      alert(error?.shortMessage || error?.message || "Transaction failed");
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen bg-[#050816] text-[#D6E4FF] select-none overflow-hidden flex items-center justify-center font-mono">
      {/* BACKGROUND VIDEO LAYER - Immersive atmospheric base */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none opacity-40 brightness-75 contrast-125"
      >
        <source src="/bg-wave.mp4" type="video/mp4" />
      </video>

      {/* Cyberpunk Lighting & Grid Overlays */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_left,rgba(36,59,107,0.35),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(58,41,90,0.25),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-black/30 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(125,211,252,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(125,211,252,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_50%,transparent_100%)] pointer-events-none" />

      {/* Micro-Particle FX System */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[
          { top: "15%", left: "12%" },
          { top: "25%", left: "80%" },
          { top: "45%", left: "65%" },
          { top: "60%", left: "20%" },
          { top: "75%", left: "85%" },
        ].map((particle, index) => (
          <div
            key={index}
            className="absolute h-1 w-1 rounded-full bg-[#7DD3FC]/20 animate-pulse"
            style={{ top: particle.top, left: particle.left }}
          />
        ))}
      </div>

      {/* CORE WIDESCREEN WRAPPER */}
      <div className="relative z-20 flex h-[94vh] w-full max-w-[1150px] flex-col justify-between px-6 py-2">
        {/* =========================================================================
            TOP SECTION: UNIFIED GLOBAL HEADER & WALLET MANAGEMENT (STAYS CENTERED)
            ========================================================================= */}
        <div className="w-full flex flex-col items-center border-b border-[#243B6B]/30 pb-4">
          <h1 className="bg-gradient-to-r from-[#7DD3FC] via-[#38BDF8] to-[#818CF8] bg-clip-text text-center text-4xl font-black uppercase tracking-[0.2em] text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.4)]">
            OPN-GRID MATRIX
          </h1>
          <p className="mt-1 text-center text-[9px] uppercase tracking-[0.35em] text-[#8EA3C7]">
            Restore Infrastructure Integrity
          </p>

          {/* SHARED CENTERED WALLET CONTROLLER */}
          <div className="mt-4 w-full max-w-[480px]">
            {mounted && isConnected ? (
              <div className="w-full rounded-xl border border-[#243B6B] bg-[#0B1533]/90 px-4 py-2.5 backdrop-blur-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#8EA3C7]">
                    Balance:
                  </span>
                  <span className="text-xs font-bold text-[#D6E4FF]">
                    {balanceLoading
                      ? "SYNCING..."
                      : `${formattedBalance.toFixed(2)} ${tokenSymbol}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${hasEnoughOPN ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-red-400"}`}
                    />
                    <span
                      className={`text-[9px] uppercase tracking-wider ${hasEnoughOPN ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {hasEnoughOPN ? "Verified" : "Low OPN"}
                    </span>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="rounded-md border border-red-500/30 bg-red-950/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/20 hover:text-white transition-all"
                  >
                    Disconnect ({address?.slice(0, 4)}...{address?.slice(-4)})
                  </button>
                </div>
              </div>
            ) : (
              mounted &&
              !isConnected && (
                <button
                  onClick={() => connect({ connector: connectors[0] })}
                  className="w-full py-2.5 rounded-xl border border-[#7DD3FC]/30 bg-[#18214A] text-[10px] font-black uppercase tracking-[0.25em] text-[#D6E4FF] hover:bg-[#243B6B] hover:border-[#7DD3FC] transition-all duration-300 shadow-[0_0_20px_rgba(125,211,252,0.1)]"
                >
                  CONNECT WEB3 WALLET
                </button>
              )
            )}
          </div>
        </div>

        {/* =========================================================================
            MIDDLE SECTION: TWO-COLUMN TACTICAL VIEW (MATCHING THE RED BOXES)
            ========================================================================= */}
        <div className="flex flex-row items-center justify-center gap-36 px-10 my-auto w-full max-w-[1400px] mx-auto max-h-[50vh]">
          {/* LEFT RED BOX COMPARTMENT: VAULT INTERACTION PANEL */}
          <div className="w-1/2 max-w-[420px] aspect-square bg-[#0B1533]/70 border border-[#243B6B]/60 rounded-[24px] p-8 backdrop-blur-2xl shadow-[inset_0_0_25px_rgba(36,59,107,0.15)] relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#38BDF8]/30 to-transparent" />

            {/* Ultra-maximized structural layout for larger internal VaultPanel elements */}
            <div
              className="w-full h-full flex flex-col justify-start overflow-y-auto pr-2 space-y-4
  [&_h2]:text-2xl
  [&_h2]:font-black
  [&_h2]:mb-3
  [&_p]:text-base
  [&_p]:my-1
  [&_input]:w-full
  [&_input]:bg-[#050816]/90
  [&_input]:border-[#243B6B]
  [&_input]:rounded-xl
  [&_input]:px-4
  [&_input]:py-3.5
  [&_button]:w-full
  [&_button]:py-3
  [&_button]:rounded-xl
  [&_button]:mt-2
"
            >
              <VaultPanel
                vaultAddress={vaultAddress}
                signer={null}
                userAddress={userAddress}
              />
            </div>
          </div>

          {/* RIGHT RED BOX COMPARTMENT: INTERACTIVE PUZZLE GRID MATRIX */}
          <div className="w-1/2 max-w-[420px] flex items-center justify-center">
            <div className="relative grid aspect-square w-full grid-cols-3 gap-2.5 overflow-hidden rounded-[24px] border border-[#243B6B] bg-[#0B1533]/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.06),transparent_60%)]" />

              {grid.map((tile, index) => (
                <button
                  key={index}
                  onClick={() => handleTileClick(index)}
                  className={`group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-xl border text-center transition-all duration-300
                  ${
                    tile === 0
                      ? "border-dashed border-[#243B6B]/40 bg-[#050816]/80 shadow-[inset_0_0_15px_rgba(0,0,0,0.6)]"
                      : isSolved
                        ? "border-emerald-500/50 bg-[#18214A] shadow-[0_0_25px_rgba(16,185,129,0.2)]"
                        : "border-[#243B6B] bg-[#18214A]/90 hover:border-[#38BDF8]/60 hover:bg-[#243B6B]/80 active:scale-98"
                  }
                `}
                >
                  {tile !== 0 && (
                    <>
                      {/* Technical Cyberpunk Corner Overlays */}
                      <span className="absolute top-0 left-0 w-1 h-1 border-t border-l border-neutral-700/40 group-hover:border-[#38BDF8] transition-colors" />
                      <span className="absolute top-0 right-0 w-1 h-1 border-t border-r border-neutral-700/40 group-hover:border-[#38BDF8] transition-colors" />
                      <span className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-neutral-700/40 group-hover:border-[#38BDF8] transition-colors" />
                      <span className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-neutral-700/40 group-hover:border-[#38BDF8] transition-colors" />

                      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_70%)]" />
                      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-1.5">
                        <span className="text-[10px] font-bold tracking-wider text-[#8EA3C7]/40 group-hover:text-[#38BDF8]/70 mb-0.5">
                          #{tile.toString().padStart(2, "0")}
                        </span>
                        <span className="block text-center font-mono text-[13px] md:text-[14px] font-black uppercase leading-tight tracking-wide text-[#D6E4FF] group-hover:text-white drop-shadow-[0_0_8px_rgba(214,228,255,0.15)]">
                          {OPN_PILLARS[tile]}
                        </span>
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM SECTION: PROTOCOL SETTLEMENT ACTION & MINT LOGIC
            ========================================================================= */}
        <div className="flex w-full flex-col items-center gap-2 border-t border-[#243B6B]/20 pt-3">
          <button
            onClick={handleMint}
            disabled={
              !isSolved ||
              !isConnected ||
              !isCorrectNetwork ||
              !hasEnoughOPN ||
              isPending ||
              isSuccess
            }
            className={`
              w-full max-w-[480px] rounded-xl border py-3.5 font-mono text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md active:scale-99
              ${
                mounted && isSolved && isConnected && hasEnoughOPN
                  ? "border-emerald-500/40 bg-[#18214A] text-[#D6E4FF] hover:bg-emerald-500/10 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]"
                  : "border-[#243B6B] bg-[#0B1533]/60 text-[#8EA3C7]/40 cursor-not-allowed"
              }
            `}
          >
            {!mounted
              ? "LOADING MATRIX SYSTEM..."
              : isPending
                ? "VERIFYING ONCHAIN..."
                : isSuccess
                  ? "NFT SUCCESSFULLY MINTED"
                  : !isConnected
                    ? "CONNECT WALLET TO MINT"
                    : !isCorrectNetwork
                      ? "SWITCH TO OPN TESTNET"
                      : !isSolved
                        ? "SOLVE PUZZLE TO UNLOCK"
                        : !hasEnoughOPN
                          ? "INSUFFICIENT OPN BALANCE"
                          : "SUBMIT PROOF TO OPN CHAIN"}
          </button>

          <button
            onClick={() => setGrid([1, 2, 3, 4, 5, 6, 7, 8, 0])}
            className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500/40 transition-all duration-300 hover:text-[#38BDF8]"
          >
            [ DEV MODE : AUTO SOLVE ]
          </button>
        </div>
      </div>
    </div>
  );
}
