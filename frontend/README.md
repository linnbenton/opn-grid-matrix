# 🤖 OPN Grid Puzzle

An on-chain puzzle game where players solve a 3x3 grid challenge to mint an NFT reward. Built for EVM-compatible networks using Solidity and ERC-721 standards.

---

## ⚙️ Core Idea

Players must solve a predefined 3x3 puzzle configuration.  
If the solution matches the target state, the smart contract mints an NFT as proof of completion.

- One wallet = one mint
- Fully on-chain verification
- NFT reward issued instantly upon success

---

## 🚀 Smart Contract Features

- ERC-721 NFT standard (OpenZeppelin)
- On-chain puzzle validation
- Anti double-mint protection
- Event emission for solved puzzle tracking
- Metadata URI support for NFT assets

---

## 📊 Performance Flow

- Gas-efficient loop validation (9 iterations only)
- Minimal storage usage (mapping + uint256 counter)
- No external oracle dependency
- Pure deterministic execution (fully on-chain logic)

---

## 🌳 System Tree Flow

User Wallet
↓
Submit Puzzle Solution (uint8[9])
↓
verifyAndMint()
↓
Validate hasMinted mapping
↓
Compare with targetSolution
↓
If valid:
├── Increment tokenId
├── Mint NFT (ERC721)
├── Set TokenURI
└── Emit PuzzleSolved event
↓
Return tokenId

---

## 🧱 Contract Architecture

OPNGridPuzzle (ERC721URIStorage)
│
├── hasMinted mapping
├── targetSolution[9]
├── \_tokenIds counter
│
├── getTargetSolution()
├── verifyAndMint()
└── PuzzleSolved event

---

## 🔐 Security Notes

- Prevents multiple mint per wallet
- Strict array comparison validation
- No external contract calls (reduces attack surface)
- Deterministic on-chain execution

---

## 📦 Tech Stack

- Solidity ^0.8.x
- OpenZeppelin Contracts
- Hardhat / Remix compatible
- EVM testnet deployment ready

---

## 🌐 Network Info (OPN Testnet)

- RPC: `https://testnet-rpc.iopn.tech`
- Explorer: `https://testnet.iopn.tech`
- Chain ID: 984
- Currency: OPN

---

## 📜 Contract Info

- Contract Address:
  0xe495E3b24cBE70FC6Ba08BE82d3719D748EF11Df

---

## 🧪 Status

- Smart contract: deployed ✔
- Puzzle logic: active ✔
- NFT minting: functional ✔
