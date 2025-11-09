// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BasicLicense.sol";

contract ExclusiveLicense is BasicLicense {
    uint96 public constant ROYALTY_EXCLUSIVE = 3500;
    uint256 public constant MAX_SUPPLY = 1;
    mapping(string => bool) private _beatExclusiveMinted;

    constructor() BasicLicense("Exclusive License", "EXCLUSIVE", ROYALTY_EXCLUSIVE) {}

    function mintExclusiveLicense(
        address to, string memory ipfsHash, string memory purchaseId, string memory beatId,
        string memory producerId, address producerWallet, uint256 priceUSD, uint256 creditsSpent, uint256 purchasedAt
    ) public onlyOwner returns (uint256) {
        require(!_beatExclusiveMinted[beatId], "Exclusive license already minted for this beat");
        _beatExclusiveMinted[beatId] = true;
        return mintLicense(to, ipfsHash, purchaseId, beatId, producerId, producerWallet, priceUSD, creditsSpent, purchasedAt, "exclusive");
    }

    function isExclusiveMinted(string memory beatId) public view returns (bool) {
        return _beatExclusiveMinted[beatId];
    }
}
