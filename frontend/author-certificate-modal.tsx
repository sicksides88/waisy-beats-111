"use client"

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, CheckCircle, Clock, XCircle, Download, Copy } from 'lucide-react'
import { toast } from 'sonner'

interface AuthorCertificateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  beatId: string
  beatTitle?: string
}

interface CertificationData {
  status: 'pending' | 'certified' | 'failed' | 'not_certified'
  certification: {
    tokenId: number
    txHash: string
    contractAddress: string
    blockNumber: number
    mintedAt: string | null
  } | null
}

// Avalanche Fuji Testnet Explorer
const FUJI_EXPLORER_URL = 'https://testnet.snowtrace.io'

// Contract Address - Uses environment variable or fallback
// In production, this would be the deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PRODUCER_SBT_CONTRACT_ADDRESS || '0x2E9d30761DB97706C536A112B9466433032b28e3'

/**
 * AuthorCertificateModal Component
 * 
 * Displays blockchain certification information for a beat's authorship.
 * Shows token ID, transaction hash, contract address, and provides links
 * to Avalanche blockchain explorer (SnowTrace) for on-chain verification.
 * 
 * This component demonstrates the frontend integration with Avalanche blockchain
 * for displaying Soulbound Token (SBT) certification data.
 */
export function AuthorCertificateModal({
  open,
  onOpenChange,
  beatId,
  beatTitle
}: AuthorCertificateModalProps) {
  const [loading, setLoading] = useState(true)
  const [certification, setCertification] = useState<CertificationData | null>(null)

  useEffect(() => {
    if (open && beatId) {
      fetchCertification()
    }
  }, [open, beatId])

  const fetchCertification = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/beats/${beatId}/certify-author`)
      const data = await response.json()

      if (data.success) {
        setCertification(data.data)
      } else {
        setCertification({
          status: 'not_certified',
          certification: null
        })
      }
    } catch (error) {
      console.error('Error fetching certification:', error)
      setCertification({
        status: 'not_certified',
        certification: null
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const getStatusBadge = () => {
    if (!certification) return null

    switch (certification.status) {
      case 'certified':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Certified
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case 'failed':
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            Not Certified
          </Badge>
        )
    }
  }

  const getExplorerUrl = (txHash: string) => {
    return `${FUJI_EXPLORER_URL}/tx/${txHash}`
  }

  const getContractExplorerUrl = (contractAddress: string, tokenId: number) => {
    return `${FUJI_EXPLORER_URL}/token/${contractAddress}?a=${tokenId}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Blockchain Authorship Certificate
            {getStatusBadge()}
          </DialogTitle>
          <DialogDescription>
            {beatTitle && (
              <span className="block mb-2">Beat: <strong>{beatTitle}</strong></span>
            )}
            Immutable certification of your authorship rights on Avalanche Fuji Testnet
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : certification?.certification ? (
          <div className="space-y-4">
            {/* Token Information */}
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Token ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">#{certification.certification.tokenId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(
                      certification.certification!.tokenId.toString(),
                      'Token ID'
                    )}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Contract Address</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">
                    {certification.certification.contractAddress.slice(0, 10)}...
                    {certification.certification.contractAddress.slice(-8)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(
                      certification.certification!.contractAddress,
                      'Contract Address'
                    )}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transaction Hash</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">
                    {certification.certification.txHash.slice(0, 10)}...
                    {certification.certification.txHash.slice(-8)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(
                      certification.certification!.txHash,
                      'Transaction Hash'
                    )}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Block Number</span>
                <span className="font-mono text-sm">
                  {certification.certification.blockNumber.toLocaleString()}
                </span>
              </div>

              {certification.certification.mintedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Certification Date</span>
                  <span className="text-sm">
                    {new Date(certification.certification.mintedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open(
                  getExplorerUrl(certification.certification!.txHash),
                  '_blank'
                )}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open(
                  getContractExplorerUrl(
                    certification.certification!.contractAddress,
                    certification.certification!.tokenId
                  ),
                  '_blank'
                )}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Token
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Implement PDF download
                  toast.info('PDF download coming soon')
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>

            {/* Additional Information */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>What is this?</strong> This is a Soulbound Token (SBT) that immutably
                certifies on the Avalanche blockchain that you are the original author
                of this beat. This certificate cannot be transferred and will remain
                permanently linked to your wallet.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              This beat does not have an authorship certificate yet.
            </p>
            {certification?.status === 'pending' && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Certification is in process. Please wait a few moments.
              </p>
            )}
            {certification?.status === 'failed' && (
              <p className="text-sm text-red-600 dark:text-red-400">
                There was an error certifying this beat. Please try again.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

