// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PuzzleVault is ReentrancyGuard {

    /// NFT contract (OPNGridPuzzle)
    IERC721 public immutable nft;

    /// reward rate per block per NFT
    uint256 public rewardRate = 1;

    struct StakeInfo {
        address owner;
        uint256 stakedAt;
    }

    // tokenId => stake info
    mapping(uint256 => StakeInfo) public stakes;

    // user => accumulated rewards
    mapping(address => uint256) public rewards;

    // total staked NFTs
    uint256 public totalStaked;

    /// EVENTS
    event Staked(address indexed user, uint256 tokenId, uint256 time);
    event Unstaked(address indexed user, uint256 tokenId, uint256 reward);
    event Claimed(address indexed user, uint256 amount);

    constructor(address _nft) {
        nft = IERC721(_nft);
    }

    // =========================
    // STAKE NFT
    // =========================
    function stake(uint256 tokenId) external nonReentrant {

        require(nft.ownerOf(tokenId) == msg.sender, "Not NFT owner");

        // transfer NFT into vault
        nft.transferFrom(msg.sender, address(this), tokenId);

        stakes[tokenId] = StakeInfo({
            owner: msg.sender,
            stakedAt: block.number
        });

        totalStaked++;

        emit Staked(msg.sender, tokenId, block.number);
    }

    // =========================
    // UNSTAKE NFT
    // =========================
    function unstake(uint256 tokenId) external nonReentrant {

        StakeInfo memory info = stakes[tokenId];

        require(info.owner == msg.sender, "Not staker");

        // calculate reward
        uint256 reward = (block.number - info.stakedAt) * rewardRate;

        rewards[msg.sender] += reward;

        // cleanup
        delete stakes[tokenId];
        totalStaked--;

        // return NFT
        nft.transferFrom(address(this), msg.sender, tokenId);

        emit Unstaked(msg.sender, tokenId, reward);
    }

    // =========================
    // CLAIM REWARDS
    // =========================
    function claimRewards() external nonReentrant {

        uint256 amount = rewards[msg.sender];
        require(amount > 0, "No rewards");

        rewards[msg.sender] = 0;

        // NOTE:
        // ini "virtual reward" (DeFi scoring system)
        // bukan ERC20 transfer (biar ringan & gas cheap)

        emit Claimed(msg.sender, amount);
    }

    // =========================
    // VIEW FUNCTIONS
    // =========================

    function pendingReward(uint256 tokenId) external view returns (uint256) {
        StakeInfo memory info = stakes[tokenId];

        if (info.owner == address(0)) return 0;

        return (block.number - info.stakedAt) * rewardRate;
    }

    function userReward(address user) external view returns (uint256) {
        return rewards[user];
    }

    function isStaked(uint256 tokenId) external view returns (bool) {
        return stakes[tokenId].owner != address(0);
    }
}