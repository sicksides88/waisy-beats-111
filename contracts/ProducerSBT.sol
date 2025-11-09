// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProducerSBT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct ProducerMetadata {
        string producerId;
        address producerWallet;
        string profileIPFS;
        uint256 mintedAt;
        bool isVerified;
    }

    mapping(uint256 => ProducerMetadata) private _producerMetadata;
    mapping(address => uint256) private _walletToTokenId;
    mapping(string => uint256) private _producerIdToTokenId;

    event ProducerTokenMinted(
        address indexed producer,
        uint256 indexed tokenId,
        string producerId,
        uint256 mintedAt
    );

    constructor() ERC721("Producer SBT", "PRODUCER") {
        _tokenIdCounter = 1;
    }

    function mintProducerToken(
        address producerWallet,
        string memory profileIPFS,
        string memory producerId
    ) public onlyOwner returns (uint256) {
        require(producerWallet != address(0), "Invalid producer wallet");
        require(_walletToTokenId[producerWallet] == 0, "Producer already has SBT");
        require(bytes(producerId).length > 0, "Producer ID required");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(producerWallet, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", profileIPFS)));

        _producerMetadata[tokenId] = ProducerMetadata({
            producerId: producerId,
            producerWallet: producerWallet,
            profileIPFS: profileIPFS,
            mintedAt: block.timestamp,
            isVerified: false
        });

        _walletToTokenId[producerWallet] = tokenId;
        _producerIdToTokenId[producerId] = tokenId;

        emit ProducerTokenMinted(producerWallet, tokenId, producerId, block.timestamp);
        return tokenId;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(from == address(0) || to == address(0), "Soulbound: token cannot be transferred");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function verifyProducer(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        _producerMetadata[tokenId].isVerified = true;
    }

    function getProducerMetadata(uint256 tokenId) public view returns (ProducerMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return _producerMetadata[tokenId];
    }

    function getProducerTokenId(address producerWallet) public view returns (uint256) {
        return _walletToTokenId[producerWallet];
    }

    function isProducerVerified(address producerWallet) public view returns (bool) {
        uint256 tokenId = _walletToTokenId[producerWallet];
        if (tokenId == 0 || !_exists(tokenId)) return false;
        return _producerMetadata[tokenId].isVerified;
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
