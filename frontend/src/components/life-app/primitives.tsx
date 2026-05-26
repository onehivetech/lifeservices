'use client';
import { ReactNode, useEffect, useRef } from 'react';
import { useApp } from './context';
import { Sparkle, CoinI, SearchI, BellI, ChevronR, ChevronL, CloseI, LockI, BoardT, ShopT, ServiceT, ProdT, CirclesT, AlbumT } from './icons';

// ── Logo ──────────────────────────────────────────────────────────────────────
export function Logo({ size = 34 }: { size?: number }) {
  return (
    <div className="logo" style={{ width: size, height: size, borderRadius: size * 0.27 }}>
      <Sparkle size={size * 0.62} color="white" />
    </div>
  );
}

// ── AppTopBar ─────────────────────────────────────────────────────────────────
export function AppTopBar() {
  const app = useApp();
  return (
    <div className="app-topbar">
      <div className="app-topbar-left">
        <button onClick={() => app.setTab('home')} style={{ display:'flex', alignItems:'center', gap: 8, cursor:'pointer' }} aria-label="Home">
          <Logo size={32} />
          <span className="brand-name">Life</span>
        </button>
        <button className="rewards-pill" onClick={() => app.openSheet('rewards')}>
          <CoinI size={16}/>
          <span>Rewards</span>
          <span className="rewards-pill-count">{app.rewards.toLocaleString()}</span>
        </button>
      </div>
      <div className="app-topbar-right">
        <button className="icon-btn" aria-label="Search" onClick={() => app.openSheet('search')}><SearchI size={20}/></button>
        <button className="icon-btn" aria-label="Notifications" onClick={() => app.openSheet('notifications')}>
          <BellI size={20}/>
          <span className="notif-dot" />
        </button>
        <button className="avatar" onClick={() => app.openSheet('profile')}>
          {app.family.parent1.initials}
        </button>
      </div>
    </div>
  );
}

// ── TabBar ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'board',        label: 'Board',        Icon: BoardT },
  { id: 'shop',         label: 'Shop',         Icon: ShopT },
  { id: 'services',     label: 'Services',     Icon: ServiceT },
  { id: 'productivity', label: 'Productivity', Icon: ProdT },
  { id: 'circles',      label: 'Circles',      Icon: CirclesT },
  { id: 'album',        label: 'Album',        Icon: AlbumT },
] as const;

export function TabBar() {
  const app = useApp();
  return (
    <nav className="tabbar tabbar-6">
      {TABS.map(({ id, label, Icon: I }) => (
        <button key={id} className={`tab-item ${app.tab === id ? 'active' : ''}`} onClick={() => app.setTab(id as never)}>
          <I size={22} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

// ── Sheet ─────────────────────────────────────────────────────────────────────
interface SheetProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  leftBtn?: ReactNode;
  rightBtn?: ReactNode;
  full?: boolean;
  footer?: ReactNode;
  children: ReactNode;
}

export function Sheet({ open, onClose, title, leftBtn, rightBtn, full, footer, children }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={`sheet-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`sheet ${open ? 'open' : ''} ${full ? 'full' : ''}`} role="dialog">
        {!full && <div className="sheet-grabber" />}
        <div className="sheet-head">
          <div className="left-btn">
            {leftBtn || (full && <button onClick={onClose}><CloseI size={22}/></button>) || ''}
          </div>
          {title && <h2>{title}</h2>}
          <div className="right-btn">
            {rightBtn || (!full && <button onClick={onClose}>Done</button>)}
          </div>
        </div>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-footer">{footer}</div>}
      </div>
    </>
  );
}

// ── PushScreen ────────────────────────────────────────────────────────────────
interface PushScreenProps {
  title?: string;
  onBack?: () => void;
  rightAction?: ReactNode;
  children: ReactNode;
}

export function PushScreen({ title, onBack, rightAction, children }: PushScreenProps) {
  return (
    <div className="push-screen open">
      <div className="push-nav">
        <div className="left">
          <button className="back-btn" onClick={onBack}>
            <ChevronL size={20}/>
            <span style={{ marginLeft: -2 }}>Back</span>
          </button>
        </div>
        <div className="mid">{title}</div>
        <div className="right">{rightAction}</div>
      </div>
      <div className="scroll no-tabs">{children}</div>
    </div>
  );
}

// ── Switch ────────────────────────────────────────────────────────────────────
export function Switch({ value, onChange }: { value: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button className={`switch ${value ? 'on' : ''}`} onClick={() => onChange?.(!value)}
            role="switch" aria-checked={value} />
  );
}

// ── ToggleRow ─────────────────────────────────────────────────────────────────
export function ToggleRow({ title, sub, value, onChange }: { title: string; sub?: string; value: boolean; onChange?: (v: boolean) => void }) {
  return (
    <div className="toggle-row">
      <div className="left">
        <div className="title">{title}</div>
        {sub && <div className="sub">{sub}</div>}
      </div>
      <Switch value={value} onChange={onChange} />
    </div>
  );
}

// ── ListRow ───────────────────────────────────────────────────────────────────
interface ListRowProps {
  icon?: ReactNode;
  iconBg?: string;
  title: string;
  sub?: string;
  value?: string;
  locked?: boolean;
  chevron?: boolean;
  onClick?: () => void;
}

export function ListRow({ icon, iconBg, title, sub, value, locked, chevron = true, onClick }: ListRowProps) {
  return (
    <div className="ios-list-row" onClick={onClick}>
      {icon && (
        <div className="ico-square" style={{ background: iconBg || '#A0A0AA' }}>{icon}</div>
      )}
      <div className="left">
        <div className="title">{title}</div>
        {sub && <div className="sub">{sub}</div>}
      </div>
      <div className="right">
        {locked && <span className="lock"><LockI size={12}/>2FA</span>}
        {value && <span className="value">{value}</span>}
        {chevron && <ChevronR size={16} stroke={2}/>}
      </div>
    </div>
  );
}

export function StatusSpacer() { return <div className="top-spacer" />; }
