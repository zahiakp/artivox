'use client';

import React, { useRef, useState } from 'react';
import QRCode from 'qrcode';
import { decode, encode } from 'punycode';
import { encodeId } from '../../components/common/decode';

const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = async () => {
    if (!canvasRef.current) return;

    try {
      await QRCode.toCanvas(canvasRef.current, encodeId(text) || ' ', {
        errorCorrectionLevel: 'H',
        width: 256,
        margin: 1,
      });
    } catch (err) {
      console.error('QR Code generation failed:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-md mx-auto">
      <input
        type="text"
        className="border rounded px-3 py-2 w-full"
        placeholder="Enter text to encode"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate QR Code
      </button>
      <canvas ref={canvasRef} className="border shadow mt-4" />
    </div>
  );
};

export default QRCodeGenerator;
