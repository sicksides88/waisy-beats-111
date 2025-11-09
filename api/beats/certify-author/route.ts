import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db, getProducerById } from '@/lib/firebase'
import { mintAuthorShipToken, getPlatformWalletAddress } from '@/lib/blockchain-service'
import { getAvailableLicenses, hasAnyLicenseEnabled, timestampToUnix } from '@/lib/blockchain-metadata'

/**
 * API Endpoint: POST /api/beats/[id]/certify-author
 * 
 * Certifies the authorship of a beat by minting a Soulbound Token on Avalanche
 * 
 * Parameters:
 * - id: string (ID of the beat to certify)
 * 
 * Response:
 * - success: boolean
 * - data?: { tokenId, txHash, blockNumber, contractAddress }
 * - error?: string
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: beatId } = await params

    console.log('🔐 API: Certifying beat authorship:', beatId)

    // 1. Get beat from Firestore
    const beatRef = doc(db, 'beats', beatId)
    const beatSnap = await getDoc(beatRef)

    if (!beatSnap.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Beat not found'
        },
        { status: 404 }
      )
    }

    const beat = beatSnap.data()

    // 2. Validate that the beat has licenses enabled
    if (!beat.licenses || !hasAnyLicenseEnabled(beat.licenses)) {
      return NextResponse.json(
        {
          success: false,
          error: 'The beat must have at least one license enabled to be certified'
        },
        { status: 400 }
      )
    }

    // 3. Validate that the beat doesn't already have a certificate
    if (beat.blockchainMetadata?.authorShipToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'This beat already has an authorship certificate',
          data: {
            tokenId: beat.blockchainMetadata.authorShipToken.tokenId,
            txHash: beat.blockchainMetadata.authorShipToken.txHash,
            contractAddress: beat.blockchainMetadata.authorShipToken.contractAddress
          }
        },
        { status: 400 }
      )
    }

    // 4. Get producer data
    const producer = await getProducerById(beat.producerId)
    if (!producer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Producer not found'
        },
        { status: 404 }
      )
    }

    // 5. Determine producer wallet (use producer wallet or master wallet as fallback)
    const producerWallet = producer.wallet || getPlatformWalletAddress()

    // 6. Prepare parameters for the contract
    const availableLicenses = getAvailableLicenses(beat.licenses)
    const createdAt = timestampToUnix(beat.createdAt)
    const ipfsHash = 'placeholder' // We don't use IPFS in beta phase

    console.log('📋 Parameters prepared:', {
      producerWallet,
      beatId,
      producerId: beat.producerId,
      availableLicenses,
      createdAt,
      ipfsHash
    })

    // 7. Update status to "pending" before minting
    await updateDoc(beatRef, {
      authorShipStatus: 'pending',
      updatedAt: serverTimestamp()
    })

    // 8. Mint SBT on blockchain
    let mintResult
    try {
      mintResult = await mintAuthorShipToken({
        producerWallet,
        ipfsHash,
        beatId,
        producerId: beat.producerId,
        availableLicenses,
        createdAt
      })

      console.log('✅ Token minted successfully:', mintResult)
    } catch (mintError: any) {
      console.error('❌ Error minting token:', mintError)

      // Update status to "failed"
      await updateDoc(beatRef, {
        authorShipStatus: 'failed',
        updatedAt: serverTimestamp()
      })

      return NextResponse.json(
        {
          success: false,
          error: mintError.message || 'Error minting token on blockchain'
        },
        { status: 500 }
      )
    }

    // 9. Update Firestore with certificate data
    await updateDoc(beatRef, {
      blockchainMetadata: {
        authorShipToken: {
          contractAddress: mintResult.contractAddress,
          tokenId: mintResult.tokenId,
          txHash: mintResult.txHash,
          blockNumber: mintResult.blockNumber,
          mintedAt: serverTimestamp(),
          status: 'minted'
        }
      },
      authorShipStatus: 'certified',
      updatedAt: serverTimestamp()
    })

    console.log('✅ Certification completed successfully')

    return NextResponse.json({
      success: true,
      data: {
        tokenId: mintResult.tokenId,
        txHash: mintResult.txHash,
        blockNumber: mintResult.blockNumber,
        contractAddress: mintResult.contractAddress
      }
    })
  } catch (error: any) {
    console.error('❌ API Error certifying authorship:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error certifying beat authorship'
      },
      { status: 500 }
    )
  }
}

/**
 * API Endpoint: GET /api/beats/[id]/certify-author
 * 
 * Gets the certification status of a beat
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: beatId } = await params

    const beatRef = doc(db, 'beats', beatId)
    const beatSnap = await getDoc(beatRef)

    if (!beatSnap.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Beat not found'
        },
        { status: 404 }
      )
    }

    const beat = beatSnap.data()
    const certification = beat.blockchainMetadata?.authorShipToken

    return NextResponse.json({
      success: true,
      data: {
        status: beat.authorShipStatus || 'not_certified',
        certification: certification
          ? {
              tokenId: certification.tokenId,
              txHash: certification.txHash,
              contractAddress: certification.contractAddress,
              blockNumber: certification.blockNumber,
              mintedAt: certification.mintedAt?.toDate?.()?.toISOString() || null
            }
          : null
      }
    })
  } catch (error: any) {
    console.error('❌ API Error getting certification:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error getting certification'
      },
      { status: 500 }
    )
  }
}

