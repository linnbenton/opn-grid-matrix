// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract OPNGridPuzzle is ERC721URIStorage {

    uint256 private _tokenIds;

    mapping(address => bool) public hasMinted;

    uint8[9] public targetSolution = [
        1,2,3,4,5,6,7,8,0
    ];

    event PuzzleSolved(address indexed player, uint256 tokenId, string tokenURI);

    constructor() ERC721("OPN Grid Matrix Fragment", "OPNGM") {}

    function verifyAndMint(
        uint8[9] memory clientSolution,
        string memory tokenURI
    ) public returns (uint256) {

        require(!hasMinted[msg.sender], "Already minted");

        for (uint i = 0; i < 9; i++) {
            require(clientSolution[i] == targetSolution[i], "Wrong solution");
        }

        _tokenIds++;
        uint256 newId = _tokenIds;

        hasMinted[msg.sender] = true;

        _safeMint(msg.sender, newId);
        _setTokenURI(newId, tokenURI);

        emit PuzzleSolved(msg.sender, newId, tokenURI);

        return newId;
    }
}