'use client';
import { Scanner } from '@yudiel/react-qr-scanner';

interface Props {
  onResult: (text: string) => void;
  onClose: () => void;
}

export default function ScannerModal({ onResult, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Header with Close Button */}
      <div className="absolute top-10 right-5 z-60">
        <button 
          onClick={onClose}
          className="bg-white text-black px-4 py-2 rounded-full font-bold"
        >
          Close
        </button>
      </div>

      {/* The Actual Scanner */}
      <div className="w-full h-full">
        <Scanner
          onScan={(detectedCodes) => {
            if (detectedCodes.length > 0) {
              onResult(detectedCodes[0].rawValue); // "Return" the result
            }
          }}
          styles={{
            container: { width: '100%', height: '100%' }
          }}
          components={{ finder: true }}
          constraints={{ facingMode: 'environment' }}
        />
      </div>
    </div>
  );
}