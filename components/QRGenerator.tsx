"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QrProps {
  data: string;
  size?: number;
  className?: string;
}

export default function QrCodeGenerator({ data, size = 200, className }: QrProps) {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    if (!data) return;

    QRCode.toDataURL(data, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'M', // Medium error resistance
    })
      .then(setSrc)
      .catch((err) => console.error("QR Generation Error:", err));
  }, [data, size]);

  if (!src) return <div style={{ width: size, height: size }} className="bg-gray-100 animate-pulse" />;

  return (
    <img 
      src={src} 
      alt="QR Code" 
      width={size} 
      height={size} 
      className={className} 
    />
  );
}