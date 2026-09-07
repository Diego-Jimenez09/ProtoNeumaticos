import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { GENERAL_INSPECTION_OPTIONS } from './components/GeneralInspection/options.js';

// Demo-only fixture: ?selected=engine_oil&selected=exterior_lights
// The reusable component receives its previous selection solely through `value`.
const requested = new Set(new URLSearchParams(window.location.search).getAll('selected'));
const initialSelection = GENERAL_INSPECTION_OPTIONS.filter(option => requested.has(option.id)).map(option => option.id);

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App initialSelection={initialSelection} /></React.StrictMode>
);
