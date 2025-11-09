# Waisy - Blockchain Implementation on Avalanche

## Overview

This repository contains the **Avalanche blockchain integration** developed during the hackathon for **Waisy**, a full-stack music production platform that connects producers and artists. Waisy operates as a dual-platform ecosystem with a **web platform for producers** and a **mobile app for artists**, now enhanced with blockchain-powered transparency and ownership verification.

Our Avalanche implementation provides immutable proof of authorship and license ownership, creating a transparent marketplace that revolutionizes how beats are certified, licensed, and traded in the music industry.

## 🎯 Project Status

**Current Status:** We have a solid, production-ready blockchain implementation with a **public beta** featuring a fully functional beat store. The platform already has 5,000+ users on the mobile app and a working producer dashboard. We are committed to continuing development on **Avalanche** as we believe it provides the infrastructure we need to improve transparency and create a new market in the industry.

**Note:** We are currently working on completing the API implementation for license purchases from artists to producers. The blockchain contracts are fully functional and deployed, but the backend integration for automatic license NFT minting during purchases is still in development.

## 🏗️ Platform Architecture

Waisy is built as a dual-platform ecosystem:

### Web Platform (Producers)
- **Frontend:** React/Next.js with TypeScript
- **State Management:** Redux Toolkit
- **UI:** Custom components with Tailwind CSS
- **Blockchain:** Ethers.js for Avalanche smart contract interactions
- **URL:** `waisy.app/producers`

### Mobile App (Artists)
- **Framework:** React Native (Android)
- **Payments:** Google Play Billing integration
- **Blockchain:** Web3 integration for future Avalanche wallet connectivity (planned)
- **AI Features:** Real-time lyric analysis for beat recommendations
- **Users:** 5,000+ active users

### Backend Infrastructure
- **Runtime:** Node.js with Express.js
- **Hosting:** Render (scalable serverless environment)
- **Authentication:** Firebase Auth with custom claims
- **Database:** Cloud Firestore (NoSQL, real-time updates)
- **Storage:** Firebase Storage for audio files, IPFS planned for metadata
- **API:** RESTful architecture

### Payment Systems
- **Traditional:** Google Play Billing (70/30 split)
- **Crypto:** Direct Avalanche (AVAX) integration (planned for future)
- **Features:** Real-time payouts, multi-currency support, automated revenue distribution
- **Beta Phase:** Currently using master wallet for blockchain operations (minting SBTs and licenses)

## 🆕 Hackathon Development

This repository focuses on the **new Avalanche blockchain features** developed during the hackathon:

### Pre-Hackathon (Existing Platform)
- ✅ Waisy Notepad mobile app (5,000+ users)
- ✅ Basic beat marketplace functionality
- ✅ Producer web dashboard
- ✅ User authentication and profiles
- ✅ Payment processing via Google Play Billing
- ✅ AI lyric analysis and beat recommendations

### New During Hackathon (Avalanche Integration)
All blockchain components are **completely new**:

- ✅ Smart Contracts on Avalanche (6 contracts)
- ✅ Blockchain integration layer with event listeners
- ✅ NFT minting service
- ✅ Royalty distribution system
- ✅ Soulbound certificate minting for producers
- ✅ NFT license purchases for artists
- ✅ On-chain rights verification
- ✅ Master wallet integration for beta phase minting operations

## 🏗️ Blockchain Architecture

Our Avalanche implementation consists of two main components:

1. **Soulbound Tokens (SBT)** - For producer authorship certification
2. **License NFTs** - For beat license ownership (Basic, Standard, Exclusive)

### Technology Stack

- **Blockchain:** Avalanche C-Chain (Fuji Testnet / Mainnet)
- **Smart Contracts:** Solidity ^0.8.20
- **Standards:** ERC-721, ERC-2981 (Royalties)
- **Framework:** OpenZeppelin Contracts
- **Integration:** Ethers.js for web, Web3 for mobile

## 📋 Smart Contracts

### 1. ProducerSBT.sol

A **Soulbound Token (SBT)** contract that certifies producer authorship of beats. These tokens are non-transferable and permanently bound to the producer's wallet.

**Key Features:**
- Non-transferable tokens (Soulbound)
- Producer verification system
- One SBT per producer wallet
- Metadata includes producer ID, wallet address, and profile IPFS hash

**Main Functions:**
- `mintProducerToken()` - Mints a new producer SBT
- `verifyProducer()` - Marks a producer as verified
- `getProducerMetadata()` - Retrieves producer metadata
- `isProducerVerified()` - Checks if a producer is verified

### 2. AuthorshipCertificate.sol

A Soulbound Token contract that certifies the authorship of individual beats. Each beat can have one authorship certificate minted to the producer's wallet.

**Key Features:**
- One certificate per beat (enforced by beatId)
- Stores available license types for the beat
- Non-transferable (Soulbound)
- Links beat to producer wallet

**Main Functions:**
- `mintAuthorshipToken()` - Mints authorship certificate for a beat
- `getTokenByBeatId()` - Retrieves certificate by beat ID
- `verifyAuthorship()` - Verifies beat authorship
- `getProducerTokens()` - Gets all certificates for a producer

### 3. BasicLicense.sol

Base contract for beat licenses. Implements ERC-721 with ERC-2981 royalty support.

**Key Features:**
- Transferable NFT licenses
- Royalty support (ERC-2981)
- Metadata includes purchase details, prices, and timestamps
- Tracks licenses by wallet and purchase ID

**Main Functions:**
- `mintLicense()` - Mints a license NFT
- `getLicenseMetadata()` - Retrieves license details
- `getCertificatesByWallet()` - Gets all licenses for a wallet
- `getTokenByPurchaseId()` - Finds license by purchase ID

### 4. StandardLicense.sol

Extends `BasicLicense` with a 15% royalty rate (1500 basis points).

**Royalty:** 15% (1500 bps)

### 5. ExclusiveLicense.sol

Extends `BasicLicense` with a 35% royalty rate and enforces exclusivity (only one exclusive license per beat).

**Key Features:**
- 35% royalty rate (3500 bps)
- Maximum supply of 1 per beat
- Prevents multiple exclusive licenses for the same beat

**Royalty:** 35% (3500 bps)

### 6. BasicLicenseStandalone.sol

Standalone implementation of Basic License with 7.5% royalty rate.

**Royalty:** 7.5% (750 bps)

## 📄 License Types

Our system supports three types of licenses:

### Basic License
- **Royalty:** 7.5% (750 basis points)
- **Use Cases:** Personal projects, demos, non-commercial use
- **Transferable:** Yes
- **Resale Rights:** Yes

### Standard License
- **Royalty:** 15% (1500 basis points)
- **Use Cases:** Commercial projects, limited distribution
- **Transferable:** Yes
- **Resale Rights:** Yes

### Exclusive License
- **Royalty:** 35% (3500 basis points)
- **Use Cases:** Full commercial rights, exclusive ownership
- **Transferable:** Yes
- **Resale Rights:** Yes
- **Exclusivity:** Only one exclusive license can be minted per beat

## 🔌 API Integration

### Producer SBT Certification

We have implemented the API endpoint for certifying producer authorship using SBT tokens:

**Endpoint:** `POST /api/beats/[id]/certify-author`

**Functionality:**
- Validates beat has licenses enabled
- Checks if beat already has a certificate
- Mints an AuthorshipCertificate SBT on Avalanche
- Updates Firestore with blockchain metadata
- Returns transaction details (tokenId, txHash, contractAddress)

**Status:** ✅ **Fully Implemented and Working**

**Integration:**
- Connected to Next.js backend (Node.js/Express on Render)
- Uses Ethers.js for Avalanche contract interactions
- **Beta Phase:** Uses master wallet (platform-controlled) to mint SBTs on behalf of producers
- Real-time Firestore updates for web platform
- Event listeners for blockchain state synchronization

**Note:** In the current beta phase, all blockchain minting operations (SBTs and licenses) are performed using a master wallet controlled by the platform. This simplifies the user experience during beta testing. Future implementation will support direct user wallet connections for Web3-native interactions.

### License Purchase API

**Status:** 🚧 **In Development**

We are currently working on completing the API implementation for license purchases. The smart contracts are fully functional and ready, but the backend integration for automatically minting license NFTs when artists purchase beats from producers is still being developed.

**What's Missing:**
- Automatic license NFT minting on purchase
- Integration with dual payment flow (Google Play Billing + future AVAX direct payments)
- License metadata generation and IPFS upload
- Cross-platform synchronization (mobile purchase → web NFT)

**Note:** The contracts (`BasicLicense`, `StandardLicense`, `ExclusiveLicense`) are production-ready and deployed. In the beta phase, license NFTs will be minted using the platform's master wallet. Once the API is complete, purchases will automatically mint the corresponding license NFT. Future implementation will support direct AVAX payments and user wallet connections for Web3-native experiences.

## 📁 Repository Structure

```
avalanche-blockchain-implementation/
├── contracts/
│   ├── ProducerSBT.sol
│   ├── AuthorshipCertificate.sol
│   ├── BasicLicense.sol
│   ├── BasicLicenseStandalone.sol
│   ├── StandardLicense.sol
│   └── ExclusiveLicense.sol
├── abis/
│   ├── ProducerSBT.json
│   ├── ProducerSBT-complete.json
│   ├── AuthorshipCertificate.json
│   ├── AuthorshipCertificate-complete.json
│   ├── BasicLicense-complete.json
│   ├── BasicLicenseStandalone.json
│   ├── StandardLicense.json
│   ├── StandardLicense-complete.json
│   ├── ExclusiveLicense.json
│   └── ExclusiveLicense-complete.json
├── api/
│   └── beats/
│       └── certify-author/
│           └── route.ts
└── README.md
```

## 🚀 Deployment

### Contracts Deployed On

- **Network:** Avalanche Fuji Testnet (for testing)
- **Network:** Avalanche Mainnet (for production)

### Contract Addresses

*Note: Contract addresses should be added here after deployment*

## 🔐 Security Features

- **OpenZeppelin Contracts:** All contracts use battle-tested OpenZeppelin implementations
- **Access Control:** Only contract owner can mint tokens
- **Soulbound Protection:** SBT tokens cannot be transferred (only minted/burned)
- **Exclusivity Enforcement:** Exclusive licenses are limited to one per beat
- **Royalty Standard:** ERC-2981 compliant royalty implementation

## 🎵 Use Cases

### For Producers (Web Platform)

1. **Certify Beat Authorship:** Mint an SBT certificate proving ownership of a beat via web dashboard (minted by platform master wallet in beta)
2. **Set License Types:** Define which licenses (Basic/Standard/Exclusive) are available for each beat
3. **Earn Royalties:** Receive automatic royalties on license resales (7.5%, 15%, or 35% depending on license type)
4. **Track Ownership:** View all certified beats and their on-chain verification status
5. **Revenue Management:** Real-time tracking of earnings from traditional payments (crypto payments planned for future)

### For Artists (Mobile App)

1. **Browse Certified Beats:** Discover beats with verified blockchain authorship
2. **AI-Powered Discovery:** Get personalized recommendations based on lyric analysis
3. **Purchase Licenses:** Buy licenses via Google Play Billing (traditional payments) - NFT minting in development
4. **Own License NFTs:** Receive transferable NFT licenses as proof of purchase (coming soon, minted via platform master wallet in beta)
5. **Resell Licenses:** Transfer licenses to other artists with automatic royalty distribution to original producer (future feature)
6. **Verify Rights:** On-chain verification of license ownership for commercial use

## 🔄 Workflow

### Beat Certification Flow (Web Platform)

1. Producer logs into web dashboard (`waisy.app/producers`)
2. Producer uploads beat audio to Firebase Storage
3. Producer configures licenses (Basic, Standard, or Exclusive) via web UI
4. Producer clicks "Certify on Blockchain" button
5. Frontend calls `/api/beats/[id]/certify-author` endpoint
6. Backend validates and mints `AuthorshipCertificate` SBT on Avalanche using platform master wallet
7. Firestore updates with blockchain metadata (tokenId, txHash, contractAddress)
8. Web UI displays certification status and on-chain proof
9. Beat is now searchable in mobile app with blockchain verification

### License Purchase Flow (In Development)

**Mobile App (Artists) - Beta Phase:**
1. Artist browses beats in mobile app (React Native)
2. AI recommendations suggest beats based on lyrics
3. Artist selects license type and purchases via Google Play Billing
4. **TODO:** Backend processes payment and mints license NFT on Avalanche using platform master wallet
5. **TODO:** NFT ownership recorded in Firestore (on-chain verification available)
6. Artist can download beat and use according to license terms

**Web Platform (Future - Full Web3 Integration):**
1. Artist connects Avalanche wallet via Web3 (planned)
2. Artist purchases license with AVAX (planned)
3. **TODO:** System mints license NFT directly to connected wallet
4. NFT ownership verified on-chain for license rights

**Note:** Current beta implementation uses a platform master wallet for all minting operations to simplify the user experience. Future versions will support direct wallet connections for Web3-native interactions.

## 🌐 Why Avalanche?

We chose Avalanche for our blockchain implementation because it perfectly aligns with our platform's requirements:

- **Fast Transactions:** Sub-second finality ensures smooth user experience across web and mobile
- **Low Fees:** Cost-effective for frequent transactions (minting, transfers) - critical for a marketplace with thousands of users
- **EVM Compatible:** Seamless integration with our existing JavaScript/TypeScript stack (Ethers.js, Web3)
- **Scalability:** Can handle high transaction volumes as our platform grows (currently 5,000+ users, targeting millions)
- **Ecosystem:** Strong DeFi and NFT ecosystem support for future features
- **Dual Payment Support:** Enables both traditional (Google Play) and future crypto (AVAX) payment flows
- **Future-Proof:** Avalanche Subnets potential for music-specific custom blockchain

**Perfect Fit:** Avalanche's infrastructure allows us to maintain low operational costs while providing enterprise-grade blockchain features, making it ideal for our serverless architecture and scalable business model.

## 📊 Current Status Summary

### Blockchain Components (Hackathon Development)

| Component | Status | Notes |
|-----------|--------|-------|
| ProducerSBT Contract | ✅ Complete | Deployed and tested on Avalanche |
| AuthorshipCertificate Contract | ✅ Complete | Deployed and tested on Avalanche |
| License Contracts (Basic/Standard/Exclusive) | ✅ Complete | Deployed and tested on Avalanche |
| Producer SBT API | ✅ Complete | Fully functional, integrated with web platform |
| License Purchase API | 🚧 In Development | Contracts ready, API integration pending |
| Blockchain Event Listeners | ✅ Complete | Real-time state synchronization |
| Master Wallet Integration | ✅ Complete | Platform-controlled wallet for beta phase minting operations |

### Platform Integration

| Component | Status | Notes |
|-----------|--------|-------|
| Web Platform (Producers) | ✅ Live | `waisy.app/producers` - Full dashboard |
| Mobile App (Artists) | ✅ Live | 5,000+ users, beat store functional |
| Beat Store (Beta) | ✅ Live | Public beta available |
| Google Play Billing | ✅ Live | Traditional payment flow working |
| AI Recommendations | ✅ Live | Real-time lyric analysis |
| IPFS Metadata Storage | 🚧 Planned | Q1 2026 implementation |

## 🔮 Future Development

### Immediate (Q4 2025 - Current)
1. **Complete License Purchase API:** Finish integration for automatic license NFT minting on both mobile and web
2. **Dual Payment Flow:** Seamless integration of Google Play Billing + future AVAX direct payments with automatic NFT minting
3. **Cross-Platform Sync:** Real-time NFT ownership sync between mobile app and web platform

### Short-term (Q1 2026)
4. **IPFS Integration:** Decentralized metadata storage for enhanced immutability
5. **License Marketplace:** Enable secondary market for license trading with royalty distribution
6. **Analytics Dashboard:** Track license sales, royalties, and producer earnings on-chain

### Long-term Vision
7. **Avalanche Subnets:** Custom blockchain subnet for music-specific transactions
8. **Cross-Chain Expansion:** Multi-chain copyright verification while maintaining Avalanche as primary
9. **AI/ML Enhancements:** Advanced beat recommendation algorithms with on-chain reputation scoring
10. **Royalty Automation:** Smart contract-based automatic royalty distribution for all license resales

## 🔐 Security Features

- **OpenZeppelin Contracts:** All contracts use battle-tested OpenZeppelin implementations
- **Access Control:** Only contract owner can mint tokens
- **Soulbound Protection:** SBT tokens cannot be transferred (only minted/burned)
- **Exclusivity Enforcement:** Exclusive licenses are limited to one per beat
- **Royalty Standard:** ERC-2981 compliant royalty implementation
- **Enterprise Security:** Firebase Auth with custom claims, secure API endpoints
- **Gas Optimization:** Efficient contract design for cost-effective transactions

## 💡 Technical Highlights

- **Full-Stack JavaScript:** Single language ecosystem (TypeScript/JavaScript) across web, mobile, and blockchain
- **Serverless Architecture:** Cost-effective scaling with Render hosting
- **Real-Time Sync:** Firestore real-time updates synchronized with blockchain events
- **Dual Payment Gateway:** Seamless integration of traditional (Google Play) payments with future crypto (AVAX) direct payment support
- **AI Integration:** Real-time lyric analysis for personalized beat recommendations
- **Scalable Design:** Architecture supports millions of users with low operational costs

## 📝 License

This project is part of the Waisy platform. All smart contracts are provided as-is for review and integration purposes.

## 🤝 Contributing

This is a hackathon submission showcasing our blockchain implementation developed during the hackathon. The platform has a solid foundation with 5,000+ users and a working beat marketplace. We're committed to completing the license purchase API integration and continuing to build on Avalanche.

For questions or collaboration opportunities, please contact the Waisy team.

---

**Built with ❤️ for the music production community**

*Creating transparency and new markets in the music industry through blockchain technology on Avalanche*

