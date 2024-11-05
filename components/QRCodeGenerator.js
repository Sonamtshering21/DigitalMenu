// app/components/QRCodeGenerator.js
'use client'; // Ensure this component runs on the client side

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import QRCode from 'qrcode';
const QRCodeGenerator = ({ numberOfTables, generate, setGenerate }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id; // Get user ID from session
  const [qrCodes, setQrCodes] = useState([]);

  useEffect(() => {
    const generateQRCode = async () => {
      const newQrCodes = []; // Temporary array to store new QR codes

      for (let i = 1; i <= numberOfTables; i++) {
        try {
          const url = `https://bhutandigitalmenusystem.netlify.app/menus?user_id=${userId}&table=${i}`;
          const canvas = document.createElement('canvas');

          await QRCode.toCanvas(canvas, url, {
            width: 200,
            margin: 2,
          });

          const dataUrl = canvas.toDataURL(); // Convert the canvas to a data URL
          newQrCodes.push(dataUrl); // Add the generated QR code to the array
        } catch (err) {
          console.error(`Error generating QR code for table ${i}:`, err);
        }
      }

      setQrCodes(newQrCodes); // Update the state with all new QR codes at once
      setGenerate(false); // Reset generate flag to prevent re-generation
    };

    // Generate QR codes only if generate is true, userId and numberOfTables are valid
    if (generate && userId && numberOfTables > 0) {
      setQrCodes([]); // Clear any existing QR codes before generating new ones
      generateQRCode(); // Call the function to generate QR codes
    }
  }, [generate, userId, numberOfTables, setGenerate]); // Dependency array includes generate flag

  return (
    <div>
      {userId ? (
        <p>Welcome, user {userId}. QR codes are being generated.</p>
      ) : (
        <p>Please log in to generate your QR codes.</p>
      )}
      <div>
        {qrCodes.length > 0 ? (
          qrCodes.map((qrCode, index) => (
            <div key={index}>
              <Image src={qrCode} alt={`QR Code for table ${index + 1}`} />
              <a href={qrCode} download={`QR_Code_Table_${index + 1}.png`}>
                Download QR Code for Table {index + 1}
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
