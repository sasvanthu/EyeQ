import React from 'react';
import { QrReader } from 'react-qr-reader';

interface QRScannerProps {
  onResult: (data: string | null) => void;
  onClose?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onResult, onClose }) => {
  return (
    <div className="w-full h-full min-h-[300px] relative overflow-hidden rounded-lg bg-black">
      <QrReader
        constraints={{ facingMode: 'environment' }}
        onResult={(result, error) => {
          if (!!result) {
            // @ts-ignore - react-qr-reader types might be slightly off or using an older zxing version
            const text = result?.getText ? result.getText() : (result as any).text;
            onResult(text ?? null);
          }
          if (!!error) {
            // ignore
          }
        }}
        containerStyle={{ width: '100%', height: '100%' }}
        videoStyle={{ objectFit: 'cover' }}
      />
    </div>
  );
};

export default QRScanner;
