import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QrScanner = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 50,
      qrbox: 500,
    },true);

    scanner.render(
      (decodedText) => console.log(`Decoded text: ${decodedText}`),
      (error) => console.error(`Error: ${error}`)
    );

    // Cleanup function
    return () => {
      // Wrap async cleanup in an IIFE
      (async () => {
        try {
          await scanner.clear(); // Asynchronous cleanup
        } catch (err) {
          console.error("Error clearing scanner:", err);
        }
      })();
    };
  }, []);

  return <div id="qr-reader" />;
};

export default QrScanner;
