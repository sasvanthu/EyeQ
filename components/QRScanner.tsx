import React from 'react';
import { QrReader } from 'react-qr-reader';

interface QRScannerProps {
  onResult: (data: string | null) => void;
  onClose?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onResult, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="glass-card p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Scan QR Code</h4>
            <button className="btn neon-btn" onClick={onClose}>Close</button>
          </div>
          <div className="w-full h-96">
            <QrReader
              constraints={{ facingMode: 'environment' }}
              onResult={(result, error) => {
                if (!!result) {
                  onResult(result?.text ?? null);
                }
                if (!!error) {
                  // ignore
                }
              }}
              containerStyle={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;