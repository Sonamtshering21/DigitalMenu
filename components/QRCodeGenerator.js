// app/components/QRCodeGenerator.js
'use client'; // Ensure this component runs on the client side

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import QRCode from 'qrcode';

const QRCodeGenerator = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id; // Get user ID from session
  const [qrCodes, setQrCodes] = useState([]);
  const tableNumbers = [1, 2, 3, 5, 6, 7, 8, 9]; // Example table numbers

  useEffect(() => {
    const generateQRCode = async (userId, tableNumber) => {
      try {
        const url = `http://localhost:3000/menu?C=${userId}&table=${tableNumber}`;
        const canvas = document.createElement('canvas');

        await QRCode.toCanvas(canvas, url, {
          width: 200,
          margin: 2,
        });

        const dataUrl = canvas.toDataURL(); // Convert the canvas to a data URL
        setQrCodes((prevCodes) => [...prevCodes, dataUrl]);
      } catch (err) {
        console.error(err);
      }
    };

    if (userId) {
      tableNumbers.forEach((tableNumber) => {
        generateQRCode(userId, tableNumber);
      });
    } else {
      console.error('User ID is not available. Cannot generate QR codes.');
    }
  }, [userId]);

  return (
    <div>
      <h2>QR Code Generation</h2>
      {userId ? (
        <p>Welcome, user {userId}. QR codes are being generated.</p>
      ) : (
        <p>Please log in to generate your QR codes.</p>
      )}
      <div>
        {qrCodes.length > 0 ? (
          qrCodes.map((qrCode, index) => (
            <div key={index}>
              <img src={qrCode} alt={`QR Code for table ${tableNumbers[index]}`} />
              <a href={qrCode} download={`QR_Code_Table_${tableNumbers[index]}.png`}>
                Download QR Code
              </a>
            </div>
          ))
        ) : (
          <p>No QR codes generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
