// app/qr-codes/page.js

import QRCodeGenerator from '../../components/QRCodeGenerator'

const QRCodePage = () => {
  return (
    <div>
      <h1>QR Code Generation Page</h1>
      <QRCodeGenerator />
    </div>
  );
};

export default QRCodePage;
