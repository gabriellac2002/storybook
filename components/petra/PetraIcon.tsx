// Referência: docs/parte_diaria_v46.html linhas 350–411 — ICON_PATHS + icon()
// SVG inline com currentColor: herda a cor do elemento pai, nítido em qualquer DPI.
// Usage: <PetraIcon name="truck" size={32} className="text-petra-blue" />

import { cn } from '@/lib/utils';

const ICON_PATHS = {
  truck:      '<path d="M2 17V8a1 1 0 0 1 1-1h10v10H2Z"/><path d="M13 10h4l3 3v4h-7v-7Z"/><circle cx="6" cy="18" r="2"/><circle cx="16.5" cy="18" r="2"/><path d="M2 13h11"/>',
  loader:     '<path d="M3 18h6v-3H3v3Z"/><circle cx="5" cy="20" r="1.6"/><circle cx="9" cy="20" r="1.6"/><path d="M9 16l4-2 1.5-4"/><path d="M14.5 10l5-2 1.5 1-1 4-5 1"/><path d="M9 13l3 1"/>',
  excavator:  '<path d="M3 19h8v-3H3v3Z"/><circle cx="5" cy="20.5" r="1.2"/><circle cx="9" cy="20.5" r="1.2"/><path d="M7 16v-3h3"/><path d="M10 13l4-5 3 1 2 5"/><path d="M19 14l1 4h-4l-1-2"/>',
  drill:      '<path d="M12 2v9"/><path d="M9 4h6"/><path d="M9 7h6"/><path d="M10 11h4l-1 5h-2l-1-5Z"/><path d="M11.2 16l.8 6 .8-6"/>',
  crusher:    '<path d="M4 8l4-4 3 3-4 4-3-3Z"/><path d="M20 8l-4-4-3 3 4 4 3-3Z"/><path d="M7 11h10l-1.5 9h-7L7 11Z"/><path d="M10 14l1 3M14 14l-1 3"/>',
  rebritagem: '<path d="M3 7h18v3H3z"/><path d="M5 10l1 10h12l1-10"/><path d="M9 13v4M12 13v4M15 13v4"/><path d="M8 4l2 3M16 4l-2 3"/>',
  grader:     '<path d="M2 18h7v-2H2z"/><circle cx="4" cy="19.5" r="1.4"/><circle cx="7.5" cy="19.5" r="1.4"/><path d="M9 17l8-9 4 1"/><path d="M11 19h10l-2-3h-6"/><circle cx="18" cy="19.5" r="1.4"/>',
  water:      '<path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9Z"/>',
  rock:       '<path d="M6 9l4-4 5 2 4 5-3 7H8l-4-6 2-4Z"/><path d="M10 5l2 5 5-1M12 10l-4 9M12 10l3 8"/>',
  gravel:     '<circle cx="7" cy="9" r="3"/><circle cx="15" cy="8" r="3.2"/><circle cx="11" cy="15" r="3"/><circle cx="18" cy="15" r="2.4"/><circle cx="5" cy="16" r="2.2"/>',
  pile:       '<path d="M12 4l9 15H3L12 4Z"/><path d="M8 13l4-3 4 3"/>',
  stockpile:  '<path d="M2 20h20"/><path d="M4 20c0-5 3.5-9 8-9s8 4 8 9"/><path d="M9 13l3-2 3 2"/>',
  dump:       '<path d="M3 16V9a1 1 0 0 1 1-1h8v8H3Z"/><path d="M12 11h4l3 3v2h-7"/><circle cx="6" cy="17.5" r="1.6"/><circle cx="16" cy="17.5" r="1.6"/><path d="M5 6l2-2 2 2M7 4v4"/>',
  decape:     '<path d="M3 18h18"/><path d="M5 18c0-3 2-5 4-5M19 18c0-4-3-7-7-7"/><path d="M12 11V4M9 6l3-3 3 3"/>',
  pause:      '<rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/>',
  flag:       '<path d="M5 22V3"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
  wrench:     '<path d="M15 4a4 4 0 0 0-4.6 5.2L4 15.6 6.4 18l6.4-6.4A4 4 0 0 0 19 8l-2.5 2.5L14 9l1.5-2.5L15 4Z"/>',
  warning:    '<path d="M12 3l9 16H3L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
  note:       '<path d="M5 4h11l3 3v13H5z"/><path d="M15 4v3h3M8 12h8M8 16h6"/>',
  inbound:    '<path d="M12 3v10"/><path d="M8 10l4 4 4-4"/><path d="M4 17h16v3H4z"/>',
  outbound:   '<path d="M12 14V4"/><path d="M8 7l4-4 4 4"/><path d="M4 17h16v3H4z"/>',
  undo:       '<path d="M9 7L4 12l5 5"/><path d="M4 12h11a5 5 0 0 1 0 10h-3"/>',
  user:       '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  lock:       '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock:     '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7-2"/>',
  check:      '<path d="M4 12l5 5L20 6"/>',
  clock:      '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar:   '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
  helmet:     '<path d="M3 16a9 9 0 0 1 18 0"/><path d="M2 16h20v2H2z"/><path d="M12 7v-2M9 8l-1-2M15 8l1-2"/>',
  fuel:       '<rect x="4" y="4" width="9" height="16" rx="1"/><path d="M4 10h9"/><path d="M13 8l3 1v7a2 2 0 0 0 2-2v-5l-2-3"/>',
  road:       '<path d="M7 3L4 21M17 3l3 18"/><path d="M12 4v3M12 10v3M12 16v3"/>',
  cloud:      '<path d="M7 17a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1.3A3.5 3.5 0 0 1 17 17H7Z"/>',
  radio:      '<path d="M4 9h16v9H4z"/><circle cx="8.5" cy="13.5" r="2"/><path d="M14 11h4M14 14h4M14 17h2"/><path d="M7 9l8-4"/>',
  search:     '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>',
  swap:       '<path d="M7 4L4 7l3 3"/><path d="M4 7h10a4 4 0 0 1 0 8"/><path d="M17 20l3-3-3-3"/><path d="M20 17H10a4 4 0 0 1 0-8"/>',
  empty:      '<path d="M4 7h16l-1.5 13h-13z"/><path d="M9 11v5M15 11v5M3 7h18"/>',
  list:       '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1.2"/><circle cx="3.5" cy="12" r="1.2"/><circle cx="3.5" cy="18" r="1.2"/>',
  gauge:      '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-5"/><circle cx="12" cy="18" r="1.4"/>',
  cleaning:   '<path d="M16 3l5 5-9 9-5-5 9-9Z"/><path d="M3 21l4-4M5 19l2 2"/>',
  brake:      '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18" stroke-width="3"/>',
  tire:       '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l3 3M18 6l-3 3M6 18l3-3M18 18l-3-3"/>',
  lightbulb:  '<path d="M9 18h6M10 21h4"/><path d="M8 14a5 5 0 1 1 8 0c-.7 1-1 2-1 4H9c0-2-.3-3-1-4Z"/>',
  oil:        '<path d="M6 5h12l-1 7H7L6 5Z"/><path d="M4 12h16v8H4z"/><path d="M9 16h6"/>',
  belt:       '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 9h12M9 9v12"/><circle cx="13" cy="13" r=".8"/>',
  mirror:     '<rect x="4" y="3" width="16" height="14" rx="2"/><path d="M4 17l4 4h8l4-4"/><path d="M8 9l3 3 5-5"/>',
  horn:       '<path d="M5 8h4l5-4v16l-5-4H5z"/><path d="M16 9c1 1 1 5 0 6M18 7c2 2 2 8 0 10"/>',
  tracks:     '<rect x="3" y="14" width="18" height="6" rx="3"/><circle cx="7" cy="17" r="1.2"/><circle cx="12" cy="17" r="1.2"/><circle cx="17" cy="17" r="1.2"/><path d="M5 10l2-4h10l2 4"/>',
  bucket:     '<path d="M5 7h14l-2 11H7L5 7Z"/><path d="M9 7V5h6v2"/><path d="M5 7l-2-3h18l-2 3"/>',
  grid:       '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
  jaws:       '<path d="M5 4l7 7-7 7"/><path d="M19 4l-7 7 7 7"/>',
  hammer:     '<path d="M14 4l6 6-3 3-6-6 3-3Z"/><path d="M11 7l-7 7v6h6l7-7"/>',
  wind:       '<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h15a3 3 0 1 1-3 3"/><path d="M3 16h9"/>',
  general:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
} as const;

export type IconName = keyof typeof ICON_PATHS;

export type PetraIconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

export const PetraIcon: React.FC<PetraIconProps> = ({ name, size = 24, className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('shrink-0 inline-block align-middle', className)}
      style={{ width: size, height: size, flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
    />
  );
};

export { ICON_PATHS };
