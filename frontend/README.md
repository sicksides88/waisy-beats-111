# Frontend Integration - Blockchain Components

This directory contains frontend components that demonstrate the integration with Avalanche blockchain for the Waisy platform.

## Components

### `author-certificate-modal.tsx`

A React component that displays blockchain certification information for beat authorship. This component:

- **Displays blockchain metadata**: Token ID, transaction hash, contract address, block number
- **Provides verification links**: Direct links to SnowTrace (Avalanche blockchain explorer)
- **Shows certification status**: Certified, pending, failed, or not certified
- **User-friendly UI**: Copy-to-clipboard functionality for blockchain data

## Integration Details

### API Endpoint Used

The component fetches certification data from:
```
GET /api/beats/[id]/certify-author
```

### Blockchain Explorer

- **Network**: Avalanche Fuji Testnet
- **Explorer**: SnowTrace (https://testnet.snowtrace.io)
- **Contract**: AuthorshipCertificate SBT contract

### Environment Variables

The component uses the following environment variable:
- `NEXT_PUBLIC_PRODUCER_SBT_CONTRACT_ADDRESS`: Contract address for the SBT (public, safe to expose)

## Usage Example

```tsx
import { AuthorCertificateModal } from '@/components/author-certificate-modal'

function BeatCard({ beatId, beatTitle }) {
  const [showCert, setShowCert] = useState(false)
  
  return (
    <>
      <Button onClick={() => setShowCert(true)}>
        View Certificate
      </Button>
      <AuthorCertificateModal
        open={showCert}
        onOpenChange={setShowCert}
        beatId={beatId}
        beatTitle={beatTitle}
      />
    </>
  )
}
```

## Security Notes

- ✅ **No sensitive data**: Only uses public blockchain data (transaction hashes, contract addresses)
- ✅ **Public contract address**: Contract addresses are public information
- ✅ **Read-only operations**: Component only displays data, doesn't perform blockchain transactions
- ✅ **Environment variables**: Uses public environment variables only (NEXT_PUBLIC_*)

## What This Demonstrates

This component showcases:
1. **Frontend-Blockchain Integration**: How the web platform displays on-chain data
2. **User Experience**: How producers can verify their beat certifications
3. **Transparency**: Direct links to blockchain explorer for public verification
4. **Real-time Status**: Shows certification status (pending, certified, failed)

## Related Files

- Backend API: `api/beats/certify-author/route.ts`
- Smart Contract: `contracts/AuthorshipCertificate.sol`
- ABI: `abis/AuthorshipCertificate.json`

