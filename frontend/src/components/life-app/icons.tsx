'use client';
import { SVGProps } from 'react';

interface IconProps { size?: number; stroke?: number | string; fill?: string; viewBox?: string; style?: React.CSSProperties; children?: React.ReactNode; }

export function Icon({ d, size = 22, stroke = 1.75, fill = 'none', viewBox = '0 0 24 24', children, style }: IconProps & { d?: string }) {
  return (
    <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke="currentColor"
         strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>
      {d && <path d={d} />}
      {children}
    </svg>
  );
}

export function Sparkle({ size = 22, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5c.4 2.6 1.4 4.4 3 5.3 1.6.9 3.4 1.2 5.5 1.2-2.1 0-3.9.3-5.5 1.2-1.6.9-2.6 2.7-3 5.3-.4-2.6-1.4-4.4-3-5.3C7.4 10.3 5.6 10 3.5 10c2.1 0 3.9-.3 5.5-1.2 1.6-.9 2.6-2.7 3-5.3z" fill={color}/>
      <path d="M19 14c.3 1.4.8 2.4 1.7 2.9.9.5 1.9.7 3.3.7-1.4 0-2.4.2-3.3.7-.9.5-1.4 1.5-1.7 2.9-.3-1.4-.8-2.4-1.7-2.9-.9-.5-1.9-.7-3.3-.7 1.4 0 2.4-.2 3.3-.7.9-.5 1.4-1.5 1.7-2.9z" fill={color}/>
    </svg>
  );
}

export const ClockI  = (p: IconProps) => <Icon {...p} d="M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
export const CardI   = (p: IconProps) => <Icon {...p} d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM3 10h18M7 15h3" />;
export const ChatI   = (p: IconProps) => <Icon {...p} d="M4 6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3h-6l-4 4v-4H7a3 3 0 01-3-3V6z" />;
export const SearchI = (p: IconProps) => <Icon {...p} d="M21 21l-4.3-4.3M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />;
export const BellI   = (p: IconProps) => <Icon {...p} d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0" />;
export const MicI    = (p: IconProps) => <Icon {...p} d="M12 1.5a3.5 3.5 0 00-3.5 3.5v7a3.5 3.5 0 007 0V5A3.5 3.5 0 0012 1.5zM5 11a7 7 0 0014 0M12 19v3.5M8.5 22.5h7" />;
export const PlusI   = (p: IconProps) => <Icon {...p} d="M12 5v14M5 12h14" />;
export const ChevronR = (p: IconProps) => <Icon {...p} stroke={2} d="M9 6l6 6-6 6" />;
export const ChevronL = (p: IconProps) => <Icon {...p} stroke={2.4} d="M15 6l-6 6 6 6" />;
export const CloseI  = (p: IconProps) => <Icon {...p} stroke={2} d="M6 6l12 12M18 6L6 18" />;
export const HeartI  = (p: IconProps) => <Icon {...p} d="M20.8 6.6a5.6 5.6 0 00-8 0L12 7.5l-.8-.9a5.6 5.6 0 10-8 8L12 23l8.8-8.4a5.6 5.6 0 000-8z" />;
export const CommentI = (p: IconProps) => <Icon {...p} d="M21 11.5a8.4 8.4 0 01-1.2 4.4 8.5 8.5 0 01-7.2 4 8.4 8.4 0 01-4.4-1.2L3 21l2.3-5.2A8.4 8.4 0 014.1 11a8.5 8.5 0 014-7.2 8.4 8.4 0 014.4-1.2 8.5 8.5 0 018 5.4 8.4 8.4 0 01.5 3.5z"/>;
export const ShareI  = (p: IconProps) => <Icon {...p} d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v14" />;
export const BookmarkI = (p: IconProps) => <Icon {...p} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />;
export const MoreI   = (p: IconProps) => <Icon {...p}><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></Icon>;
export const LockI   = (p: IconProps) => <Icon {...p} d="M5 11h14v10H5zM8 11V7a4 4 0 118 0v4" />;
export const FaceI   = (p: IconProps) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 10v.01M15 10v.01M9 15c1 1 2 1.5 3 1.5s2-.5 3-1.5"/></Icon>;
export const ShieldI = (p: IconProps) => <Icon {...p} d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />;
export const AppleI  = (p: IconProps) => <Icon {...p} fill="currentColor" stroke="none"><path d="M17.5 12.5a4.4 4.4 0 012.1-3.7 4.5 4.5 0 00-3.6-1.9c-1.5-.2-3 .9-3.7.9-.8 0-2-.8-3.3-.8a4.7 4.7 0 00-4 2.4c-1.7 3-.4 7.4 1.3 9.8.8 1.2 1.7 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4a10.7 10.7 0 001.4-2.8 4.3 4.3 0 01-2.6-3.9zM15.2 5.4A4.3 4.3 0 0016 2.2a4.3 4.3 0 00-2.8 1.4 4 4 0 00-.9 3.1 3.6 3.6 0 002.9-1.3z"/></Icon>;

export const GoogleI = (_p: IconProps) => (
  <svg width="18" height="18" viewBox="0 0 24 24" stroke="none" fill="none">
    <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 01-2 3v2.5h3.3a9.8 9.8 0 003-7.4z" fill="#4285F4"/>
    <path d="M12 22a9.6 9.6 0 006.7-2.4l-3.3-2.5a6 6 0 01-9-3.1H3v2.6A10 10 0 0012 22z" fill="#34A853"/>
    <path d="M6.4 14a6 6 0 010-3.8V7.6H3a10 10 0 000 8.9L6.4 14z" fill="#FBBC04"/>
    <path d="M12 6.4a5.4 5.4 0 013.8 1.5l2.9-2.9A9.6 9.6 0 0012 2 10 10 0 003 7.6L6.4 10A6 6 0 0112 6.4z" fill="#EA4335"/>
  </svg>
);

export const HomeT    = (p: IconProps) => <Icon {...p} d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-9z"/>;
export const BoardT   = (p: IconProps) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3 9h18"/><circle cx="7" cy="6" r="0.6" fill="currentColor" stroke="none"/><circle cx="10" cy="6" r="0.6" fill="currentColor" stroke="none"/><path d="M7 14h8M7 17h5"/></Icon>;
export const ShopT    = (p: IconProps) => <Icon {...p} d="M3 8h18l-1.5 11a2 2 0 01-2 1.8h-11a2 2 0 01-2-1.8L3 8zM8 8V6a4 4 0 018 0v2"/>;
export const ServiceT = (p: IconProps) => <Icon {...p} d="M14.7 6.3a4 4 0 00-5.6 5.6L3 18v3h3l6.1-6.1a4 4 0 005.6-5.6l-3 3-2-2 3-3z"/>;
export const ProdT    = (p: IconProps) => <Icon {...p}><rect x="3" y="4" width="18" height="17" rx="3"/><path d="M8 2v4M16 2v4M3 10h18M8 14l2 2 4-4"/></Icon>;
export const CirclesT = (p: IconProps) => <Icon {...p}><circle cx="9" cy="9" r="5"/><circle cx="16.5" cy="16.5" r="3.5"/></Icon>;
export const AlbumT   = (p: IconProps) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M3 17l5-5 4 4 3-3 6 6"/></Icon>;

export function SunI({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="#FBC02C"/>
      <g stroke="#FBC02C" strokeWidth="2.2" strokeLinecap="round">
        <line x1="12" y1="2.5" x2="12" y2="5"/>
        <line x1="12" y1="19" x2="12" y2="21.5"/>
        <line x1="2.5" y1="12" x2="5" y2="12"/>
        <line x1="19" y1="12" x2="21.5" y2="12"/>
        <line x1="5.2" y1="5.2" x2="6.9" y2="6.9"/>
        <line x1="17.1" y1="17.1" x2="18.8" y2="18.8"/>
        <line x1="5.2" y1="18.8" x2="6.9" y2="17.1"/>
        <line x1="17.1" y1="6.9" x2="18.8" y2="5.2"/>
      </g>
    </svg>
  );
}

export function CoinI({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="11" r="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1.4"/>
      <circle cx="15" cy="13" r="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1.4"/>
      <circle cx="15" cy="13" r="3.4" fill="#FBBF24"/>
    </svg>
  );
}

export function CheckI({ size = 14, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4.2 4.2L19 7" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
