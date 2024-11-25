// app/qr-codes/page.js
"use client";
import { useState } from 'react';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import Header from '@/components/Header';
import style from '@/app/qr-codes/qrcode.module.css';


const QRCodePage = () => {
  const [numberOfTables, setNumberOfTables] = useState(1); // State for number of tables
  const [generate, setGenerate] = useState(false); // State to trigger QR code generation

  const handleGenerate = () => {
    setGenerate(true); // Set generate to true when button is clicked
  };

  return (
    <div>
      <Header />
      <div className={style.mainsection}>
        <h1>QR Code Generation Page</h1>
        <label>
          Number of Tables:
          <input
            type="number"
            min="1"
            value={numberOfTables}
            onChange={(e) => setNumberOfTables(Number(e.target.value))}
          />
        </label>
        <button onClick={handleGenerate} className={style.btn}>
          Generate QR Codes
        </button>
        {/* Pass generate state and setGenerate function to QRCodeGenerator */}
        <QRCodeGenerator numberOfTables={numberOfTables} generate={generate} setGenerate={setGenerate} />
      </div>
    </div>
  );
};

export default QRCodePage;