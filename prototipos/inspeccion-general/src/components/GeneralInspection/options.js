/** Stable storage identifiers. Labels may change without changing saved values. */
export const GENERAL_INSPECTION_OPTIONS = Object.freeze([
  { id: 'engine_oil', label: 'Control de niveles y fugas', icon: 'oil' },
  { id: 'exterior_lights', label: 'Luces exteriores', icon: 'light' },
  { id: 'ventilation_heating_ac', label: 'Ventilación, calefacción y A/C', icon: 'fan' },
  { id: 'dashboard_indicators', label: 'Tablero e indicadores', icon: 'dashboard' },
  { id: 'lubrication', label: 'Engrase', icon: 'lubrication' },
  { id: 'belts_rollers', label: 'Correas y rodillos', icon: 'belt' },
  { id: 'batteries_terminals', label: 'Baterías y terminales', icon: 'battery' },
  { id: 'tires_visual', label: 'Neumáticos: revisión visual', icon: 'tire' },
  { id: 'doors_hood_latches', label: 'Puertas, capó y cierres', icon: 'door' },
  { id: 'windshield_glass', label: 'Parabrisas y demás cristales', icon: 'windshield' },
].map(Object.freeze));
