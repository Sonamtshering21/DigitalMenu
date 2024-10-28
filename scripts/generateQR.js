const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const generateQRCode = async (tableNumber) => {
  try {
    const url = `http://localhost:3000/menu?table=${tableNumber}`;
    
    // Save the QR code in the /public/qr-codes folder
    const qrCodePath = path.join(__dirname, '../public/qr-codes', `table-${tableNumber}.png`);

    await QRCode.toFile(qrCodePath, url, {
      width: 200,
      margin: 2
    });

    console.log(`QR code for table ${tableNumber} generated at ${qrCodePath}`);
  } catch (err) {
    console.error(err);
  }
};

// Generate QR codes for 10 tables as an example
for (let i = 1; i <= 10; i++) {
  generateQRCode(i);
}
