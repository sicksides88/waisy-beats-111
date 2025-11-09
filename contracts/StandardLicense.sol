// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BasicLicense.sol";

contract StandardLicense is BasicLicense {
    uint96 public constant ROYALTY_STANDARD = 1500;

    constructor() BasicLicense("Standard License", "STANDARD", ROYALTY_STANDARD) {}

    function mintStandardLicense(
        address to, string memory ipfsHash, string memory purchaseId, string memory beatId,
        string memory producerId, address producerWallet, uint256 priceUSD, uint256 creditsSpent, uint256 purchasedAt
    ) public onlyOwner returns (uint256) {
        return mintLicense(to, ipfsHash, purchaseId, beatId, producerId, producerWallet, priceUSD, creditsSpent, purchasedAt, "standard");
    }
}
