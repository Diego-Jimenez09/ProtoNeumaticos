import React, { useState } from 'react';
import { GeneralInspection } from './components/GeneralInspection/index.js';
import './demo.css';

export default function App({ initialSelection = [] }) {
  const [selection, setSelection] = useState(initialSelection);

  return (
    <main className="inspection-demo">
      <div className="inspection-demo__sheet">
        <GeneralInspection value={selection} onChange={setSelection} />
      </div>
    </main>
  );
}
