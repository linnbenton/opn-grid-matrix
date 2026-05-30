# 🤖 OPN Grid Puzzle

An on-chain AI-driven puzzle + DeFi vault system built on IOPN Testnet.

---

## 🏆 Season

**Season 1 · DeFi & Open Finance**

Submission:
`https://builders.iopn.tech/dashboard/submit`

---

## 🔥 Core Flow

User Wallet  
→ Solve Puzzle  
→ Mint NFT  
→ Unlock Vault  
→ Stake NFT  
→ Earn Rewards  
→ Claim Yield

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

🌳 System Tree Flow

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

🧱 Contract Architecture

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

## ⚙️ Tech Stack

- Next.js (Frontend)
- Wagmi / Viem (Web3)
- Solidity ^0.8.x
- OpenZeppelin Contracts
- IOPN Testnet

---

## 🌐 Network Info (OPN Testnet)

- RPC: `https://testnet-rpc.iopn.tech`
- Explorer: `https://testnet.iopn.tech`
- Chain ID: 984
- Currency: OPN

---

## 📜 Contract Info

### 🧩 Puzzle NFT Contract

- 0xe495E3b24cBE70FC6Ba08BE82d3719D748EF11Df

### 💰 Vault Contract (Staking & Rewards)

- 0x325f79e812548A82b0bdeeDc9Dc0779bfb880dF0

---

## 🚀 Status

MVP DeFi Vault + Puzzle system integrated and running on testnet.
