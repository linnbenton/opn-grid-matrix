"use client";

import React, { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWriteContract,
  useBalance,
  useChainId,
} from "wagmi";

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

const TARGET_SOLUTION = [1, 2, 3, 4, 5, 6, 7, 8, 0];

const CONTRACT_ADDRESS = "0xe495E3b24cBE70FC6Ba08BE82d3719D748EF11Df";

export default function PuzzleBoard() {
  /*
  ─────────────────────────────────────────────
  Core States
  ─────────────────────────────────────────────
  */
  const [mounted, setMounted] = useState(false);
  const [grid, setGrid] = useState<number[]>([1, 2, 3, 4, 0, 5, 7, 8, 6]);
  const [isSolved, setIsSolved] = useState(false);

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
    <div className="fixed inset-0 h-screen w-screen bg-[#050816] text-[#D6E4FF] select-none overflow-hidden flex items-center justify-center">
      {/* BACKGROUND VIDEO LAYER - Ditempatkan paling atas di kode latar belakang, tanpa mix-blend miring */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none opacity-80 brightness-110 contrast-100"
      >
        <source src="/bg-wave.mp4" type="video/mp4" />
      </video>

      {/* Efek Gradasi Atmosfer & Grid di Atas Video */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_left,rgba(36,59,107,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(58,41,90,0.2),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-black/10 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(129,140,248,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(129,140,248,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none" />

      {/* Efek Partikel */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[
          { top: "12%", left: "18%" },
          { top: "20%", left: "72%" },
          { top: "34%", left: "55%" },
          { top: "48%", left: "80%" },
          { top: "64%", left: "24%" },
          { top: "72%", left: "60%" },
          { top: "82%", left: "38%" },
          { top: "90%", left: "84%" },
        ].map((particle, index) => (
          <div
            key={index}
            className="absolute h-1 w-1 rounded-full bg-[#7DD3FC]/30 animate-pulse"
            style={{ top: particle.top, left: particle.left }}
          />
        ))}
      </div>

      {/* CONTAINER KONTEN UTAMA */}
      <div className="relative z-20 flex h-[92vh] w-full max-w-[460px] flex-col justify-between px-5">
        {/* PANEL ATAS */}
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col items-center">
            <h1 className="bg-gradient-to-r from-[#7DD3FC] via-[#38BDF8] to-[#818CF8] bg-clip-text text-center font-mono text-4xl font-black uppercase tracking-[0.16em] text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.35)] md:text-5xl">
              OPN-GRID MATRIX
            </h1>
            <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.32em] text-[#8EA3C7]">
              Restore Infrastructure Integrity
            </p>
          </div>

          <div className="mt-4 flex h-24 w-full flex-col justify-center items-center">
            {mounted && isConnected ? (
              <div className="w-full flex flex-col items-center">
                <div className="w-full rounded-2xl border border-[#243B6B] bg-[#0B1533]/90 p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8EA3C7]">
                      OPN Balance
                    </span>
                    <span className="font-mono text-sm font-black text-[#D6E4FF]">
                      {balanceLoading
                        ? "SYNCING..."
                        : `${formattedBalance.toFixed(2)} ${tokenSymbol}`}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          hasEnoughOPN
                            ? "bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]"
                            : "bg-red-400"
                        }`}
                      />
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                          hasEnoughOPN ? "text-emerald-300" : "text-red-300"
                        }`}
                      >
                        {hasEnoughOPN
                          ? "Onchain Verification Ready"
                          : "Insufficient OPN Balance"}
                      </span>
                    </div>

                    <button
                      onClick={() => disconnect()}
                      className="rounded-lg border border-red-500/30 bg-red-950/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-red-300 transition-all duration-300 hover:bg-red-500/20 hover:text-white"
                    >
                      Disconnect ({address?.slice(0, 4)}...{address?.slice(-4)})
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              mounted &&
              !isConnected && (
                <button
                  onClick={() => connect({ connector: connectors[0] })}
                  className="relative w-full overflow-hidden rounded-2xl border border-[#7DD3FC]/40 bg-[#18214A] py-4 font-mono text-sm font-black uppercase tracking-[0.25em] text-[#D6E4FF] shadow-[0_0_40px_rgba(125,211,252,0.12)] transition-all duration-300 hover:border-[#7DD3FC] hover:bg-[#243B6B] hover:shadow-[0_0_50px_rgba(125,211,252,0.22)]"
                >
                  CONNECT WALLET
                </button>
              )
            )}
          </div>
        </div>

        {/* PAPAN PUZZLE GRID */}
        <div className="relative grid aspect-square w-full grid-cols-3 gap-3 overflow-hidden rounded-[28px] border border-[#243B6B] bg-[#0B1533]/90 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.08),transparent_60%)]" />

          {grid.map((tile, index) => (
            <button
              key={index}
              onClick={() => handleTileClick(index)}
              className={`group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl border text-center transition-all duration-300
              ${
                tile === 0
                  ? "border-dashed border-[#243B6B] bg-[#050816]/60"
                  : isSolved
                    ? "border-[#7DD3FC]/60 bg-[#18214A] shadow-[0_0_35px_rgba(125,211,252,0.22)]"
                    : "border-[#243B6B] bg-[#18214A]/95 hover:border-[#7DD3FC]/40 hover:bg-[#243B6B]/90 hover:shadow-[0_0_25px_rgba(125,211,252,0.14)]"
              }
            `}
            >
              {tile !== 0 && (
                <>
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_70%)]" />
                  <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-2">
                    <span className="mb-2 font-mono text-[13px] font-bold tracking-[0.15em] text-[#8EA3C7]/70">
                      #{tile.toString().padStart(2, "0")}
                    </span>
                    <span className="block text-center font-mono text-[15px] font-black uppercase leading-tight tracking-tight text-[#D6E4FF] drop-shadow-[0_0_10px_rgba(125,211,252,0.25)] sm:text-[16px] md:text-[18px]">
                      {OPN_PILLARS[tile]}
                    </span>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>

        {/* PANEL BAWAH / BUTTON MINT */}
        <div className="flex w-full flex-col items-center gap-4">
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
              w-full rounded-2xl border py-5 font-mono text-sm font-black uppercase tracking-[0.22em] transition-all duration-300
              ${
                mounted && isSolved && isConnected && hasEnoughOPN
                  ? "border-[#7DD3FC]/50 bg-[#18214A] text-[#D6E4FF] shadow-[0_0_40px_rgba(16,185,129,0.16)] hover:bg-emerald-500/15 hover:shadow-[0_0_40px_rgba(125,211,252,0.18)]"
                  : "border-[#243B6B] bg-[#0B1533]/90 text-[#8EA3C7]/50 cursor-not-allowed"
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
            className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-500/60 transition-all duration-300 hover:text-slate-300 pb-1"
          >
            [ DEV MODE : AUTO SOLVE ]
          </button>
        </div>
      </div>
    </div>
  );
}
