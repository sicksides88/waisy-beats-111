// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BasicLicense is ERC721, ERC721URIStorage, ERC2981, Ownable {
    uint256 internal _tokenIdCounter;
    uint96 public royaltyPercentage;

    struct LicenseMetadata {
        string purchaseId;
        string beatId;
        string producerId;
        address buyerWallet;
        address producerWallet;
        string licenseType;
        uint256 priceUSD;
        uint256 creditsSpent;
        uint256 purchasedAt;
        string ipfsHash;
        uint256 mintedAt;
    }

    mapping(uint256 => LicenseMetadata) internal _licenseMetadata;
    mapping(string => uint256) internal _purchaseIdToTokenId;
    mapping(address => uint256[]) internal _walletTokens;

    event LicenseMinted(address indexed buyer, uint256 indexed tokenId, string purchaseId, string beatId, string licenseType, uint256 mintedAt);

    constructor(string memory name, string memory symbol, uint96 _royaltyPercentage) ERC721(name, symbol) {
        royaltyPercentage = _royaltyPercentage;
        _tokenIdCounter = 1;
    }

    function mintLicense(
        address to, string memory ipfsHash, string memory purchaseId, string memory beatId,
        string memory producerId, address producerWallet, uint256 priceUSD, uint256 creditsSpent,
        uint256 purchasedAt, string memory licenseType
    ) public virtual onlyOwner returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(bytes(purchaseId).length > 0, "Purchase ID required");
        require(_purchaseIdToTokenId[purchaseId] == 0, "Purchase already certified");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", ipfsHash)));
        _setTokenRoyalty(tokenId, producerWallet, royaltyPercentage);

        _licenseMetadata[tokenId] = LicenseMetadata({
            purchaseId: purchaseId,
            beatId: beatId,
            producerId: producerId,
            buyerWallet: to,
            producerWallet: producerWallet,
            licenseType: licenseType,
            priceUSD: priceUSD,
            creditsSpent: creditsSpent,
            purchasedAt: purchasedAt,
            ipfsHash: ipfsHash,
            mintedAt: block.timestamp
        });

        _purchaseIdToTokenId[purchaseId] = tokenId;
        _walletTokens[to].push(tokenId);

        emit LicenseMinted(to, tokenId, purchaseId, beatId, licenseType, block.timestamp);
        return tokenId;
    }

    function getTokenByPurchaseId(string memory purchaseId) public view returns (uint256 tokenId, bool exists) {
        tokenId = _purchaseIdToTokenId[purchaseId];
        exists = tokenId != 0 && _exists(tokenId);
    }

    function getLicenseMetadata(uint256 tokenId) public view returns (LicenseMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return _licenseMetadata[tokenId];
    }

    function getCertificatesByWallet(address wallet) public view returns (uint256[] memory) {
        return _walletTokens[wallet];
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
