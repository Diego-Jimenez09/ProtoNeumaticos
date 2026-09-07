import React from 'react';

/** Decorative inline icons: no dependency, request, or accessible-name duplication. */
export function InspectionIcon({ name, className }) {
  const icons = {
    clipboard: <><path d="M9 5H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" /><rect x="9" y="2" width="6" height="5" rx="1.5" /><path d="m8 13 2 2 5-5M8 19h8" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7v.1" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    oil: <><path d="M3 10h11l3-3 4 3-4 6H6l-3-3ZM7 10V6h6M10 6V4M3 10 1 8" /><path d="M20 17s-2 2.3-2 3.5a2 2 0 0 0 4 0C22 19.3 20 17 20 17Z" /></>,
    light: <><path d="M13 5C7 5 3 8 3 12s4 7 10 7V5ZM17 6l4-2M17 10l5-1M17 14l5 1M17 18l4 2" /></>,
    fan: <><circle cx="12" cy="12" r="2" /><path d="M10 10C5 5 11 1 14 4c2 2 0 5-1 6M14 11c7-2 8 5 4 7-3 1-4-2-5-4M11 14c-2 6-8 3-7-1 1-3 4-2 6-2" /></>,
    dashboard: <><path d="M3 19a10 10 0 1 1 18 0H3Z" /><path d="m12 14 4-5M5 13h1M7 7l1 1M12 5v1M18 13h1" /><circle cx="12" cy="15" r="1.5" /></>,
    lubrication: <><path d="m4 11 5-5 8 8-5 5ZM6 13l-3 3M14 11l3-3V4l4-2M9 6 7 4M5 9 3 7" /><path d="M20 16s-2 2.4-2 3.5a2 2 0 0 0 4 0C22 18.4 20 16 20 16Z" /></>,
    belt: <><path d="M10 3a5 5 0 0 0-7 6l5 10a5 5 0 0 0 9 0l4-10a5 5 0 0 0-7-6Z" /><circle cx="7.5" cy="7" r="2" /><circle cx="16.5" cy="7" r="2" /><circle cx="12.5" cy="17" r="2" /></>,
    battery: <><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M6 6V3h3v3M15 6V3h3v3M5 13h5M7.5 10.5v5M15 13h4" /></>,
    tire: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="5" /><path d="m8 3 1 3M15 18l1 3M3 8l3 1M18 15l3 1M16 3l-1 3M9 18l-1 3M3 16l3-1M18 9l3-1" /></>,
    door: <><path d="M5 21V3h10l5 7v11H5Z" /><path d="M8 6h5l4 5H8V6ZM8 15h3" /></>,
    windshield: <><path d="M5 4a27 27 0 0 1 14 0l3 15a36 36 0 0 0-20 0L5 4Z" /><path d="m7 17 6-7M5 13l5-6M13 14l5-6" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{icons[name]}</svg>;
}
