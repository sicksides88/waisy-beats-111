// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AuthorshipCertificate is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct BeatAuthorshipMetadata {
        string beatId;
        string producerId;
        address producerWallet;
        string[] availableLicenses;
        uint256 createdAt;
        string ipfsHash;
        uint256 mintedAt;
    }

    mapping(uint256 => BeatAuthorshipMetadata) private _authorshipMetadata;
    mapping(string => uint256) private _beatIdToTokenId;
    mapping(address => uint256[]) private _producerTokens;

    event AuthorshipTokenMinted(
        address indexed producer,
        uint256 indexed tokenId,
        string beatId,
        string producerId,
        uint256 mintedAt
    );

    constructor() ERC721("Beat Authorship Certificate", "BAC") {
        _tokenIdCounter = 1;
    }

    function mintAuthorshipToken(
        address producerWallet,
        string memory ipfsHash,
        string memory beatId,
        string memory producerId,
        string[] memory availableLicenses,
        uint256 createdAt
    ) public onlyOwner returns (uint256) {
        require(producerWallet != address(0), "Invalid producer wallet");
        require(bytes(beatId).length > 0, "Beat ID required");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        require(_beatIdToTokenId[beatId] == 0, "Beat already certified");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(producerWallet, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", ipfsHash)));

        _authorshipMetadata[tokenId] = BeatAuthorshipMetadata({
            beatId: beatId,
            producerId: producerId,
            producerWallet: producerWallet,
            availableLicenses: availableLicenses,
            createdAt: createdAt,
            ipfsHash: ipfsHash,
            mintedAt: block.timestamp
        });

        _beatIdToTokenId[beatId] = tokenId;
        _producerTokens[producerWallet].push(tokenId);

        emit AuthorshipTokenMinted(producerWallet, tokenId, beatId, producerId, block.timestamp);
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

    function getTokenByBeatId(string memory beatId) public view returns (uint256 tokenId, bool exists) {
        tokenId = _beatIdToTokenId[beatId];
        exists = tokenId != 0 && _exists(tokenId);
    }

    function getAuthorshipMetadata(uint256 tokenId) public view returns (BeatAuthorshipMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return _authorshipMetadata[tokenId];
    }

    function getProducerTokens(address producerWallet) public view returns (uint256[] memory) {
        return _producerTokens[producerWallet];
    }

    function verifyAuthorship(string memory beatId, address producerWallet) public view returns (bool) {
        uint256 tokenId = _beatIdToTokenId[beatId];
        if (tokenId == 0 || !_exists(tokenId)) return false;
        return _authorshipMetadata[tokenId].producerWallet == producerWallet && ownerOf(tokenId) == producerWallet;
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
