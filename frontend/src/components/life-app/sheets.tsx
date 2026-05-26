'use client';
import { useState, useEffect, useRef } from 'react';
import { useApp } from './context';
import { CHATS, MY_PEOPLE, SUBSCRIPTIONS, FINANCE_ACCOUNTS, SHAREHOUSE } from './data';
import { Sheet, PushScreen, Switch, ListRow } from './primitives';
import {
  SearchI, CloseI, ChevronR, ChevronL, PlusI, CheckI, LockI, ShieldI,
  CardI, ClockI, ChatI, FaceI, AppleI, MoreI,
} from './icons';
import { Logo } from './primitives';

// ── Chat ──────────────────────────────────────────────────────────────────────
interface ChatMsg { id: number; from: 'me' | 'them'; text: string; time: string; }

function ChatThread({ chat }: { chat?: typeof CHATS[0] }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { id:1, from:'them', text:'Hi! Just confirming the camp gear list — bring sleeping bag, torch, and water bottle.', time:'1:05 PM' },
    { id:2, from:'me',   text:'Thanks Akela 👍 Will Jake need a mess tin?', time:'1:06 PM' },
    { id:3, from:'them', text:'Yes, plus a metal cup. All listed in the PDF in the post.', time:'1:08 PM' },
  ]);
  const [draft, setDraft] = useState('');
  const send = () => {
    if (!draft.trim()) return;
    setMsgs(m => [...m, { id: Date.now(), from:'me', text: draft, time: 'Now' }]);
    setDraft('');
  };
  return (
    <>
      <div style={{ padding:'12px 16px 0', display:'flex', flexDirection:'column', gap:10 }}>
        {msgs.map(m => (
          <div key={m.id} style={{ display:'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '75%',
              background: m.from === 'me' ? 'var(--blue)' : 'var(--surface-2)',
              color: m.from === 'me' ? 'white' : 'var(--ink)',
              padding: '8px 12px', borderRadius: 16,
              borderBottomRightRadius: m.from === 'me' ? 4 : 16,
              borderBottomLeftRadius:  m.from === 'me' ? 16 : 4,
              fontSize: 14, lineHeight: 1.35,
            }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ position:'sticky', bottom: 0, background:'var(--bg)', padding:'12px 14px calc(12px + env(safe-area-inset-bottom))', borderTop:'1px solid var(--line-soft)', display:'flex', gap:8, marginTop: 14 }}>
        <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
               placeholder="Type a message…"
               style={{ flex:1, padding:'10px 14px', borderRadius: 999, background:'var(--surface)', border:'1px solid var(--line)', fontSize:14 }}/>
        <button className="btn primary" style={{ width:48, height:42, padding:0, borderRadius: 999 }} onClick={send}>
          <ChevronR size={20} style={{ transform:'rotate(-90deg)' }}/>
        </button>
      </div>
    </>
  );
}

export function ChatThreadScreen({ chat }: { chat?: typeof CHATS[0] }) {
  const app = useApp();
  return (
    <PushScreen
      title={chat?.name || 'Chat'}
      onBack={() => app.popScreen()}
      rightAction={
        <button className="icon-btn" onClick={() => alert('Call ' + (chat?.name || ''))}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L7.9 9.6a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0122 16.9z"/>
          </svg>
        </button>
      }
    >
      <ChatThread chat={chat}/>
    </PushScreen>
  );
}

export function ChatSheet() {
  const app = useApp();
  const [thread, setThread] = useState<typeof CHATS[0] | null>(null);
  return (
    <Sheet open onClose={() => app.closeSheet()} full
           title={thread ? thread.name : 'Chat'}
           leftBtn={thread && <button onClick={() => setThread(null)}><ChevronL size={22}/></button>}>
      {!thread && (
        <>
          <div className="search-field" style={{ marginBottom: 8 }}>
            <SearchI size={16}/>
            <input placeholder="Search messages"/>
          </div>
          <div style={{ marginTop: 4 }}>
            {CHATS.map(c => (
              <button key={c.id} className="chat-list-row" style={{ textAlign:'left', width:'100%', border:0, background:'transparent' }} onClick={() => setThread(c)}>
                <div className="chat-avatar" style={{ background: c.color }}>{c.initials}</div>
                <div className="chat-meta">
                  <div className="chat-name">
                    {c.name}
                    {c.isOrg && <span style={{ fontSize:10, color:'var(--blue)', fontWeight:600, padding:'1px 5px', background:'var(--blue-soft)', borderRadius:4, marginLeft:4 }}>ORG</span>}
                    {c.isFamily && <span style={{ fontSize:10, color:'#FF2D55', fontWeight:600, padding:'1px 5px', background:'rgba(255,45,85,0.1)', borderRadius:4, marginLeft:4 }}>FAMILY</span>}
                  </div>
                  <div className="chat-preview">{c.last}</div>
                </div>
                <div className="chat-r-meta">
                  <div className="chat-time">{c.time}</div>
                  {c.unread > 0 && <div className="chat-badge">{c.unread}</div>}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
      {thread && <ChatThread chat={thread}/>}
    </Sheet>
  );
}

// ── Search ────────────────────────────────────────────────────────────────────
const SEARCH_RECENT = ['ballet recital', 'scout camp form', 'sarah school', 'maths tutor'];
const SEARCH_SUGGEST = [
  { cat:'Circle', items:['1st Bayside Scout Group', 'Bayside Ballet Academy', 'Junior Chess Club'] },
  { cat:'Events', items:['Scout winter camp', 'Maritime Museum excursion', 'Ballet recital'] },
  { cat:'Forms',  items:['Excursion permission slip', 'Scout camp consent', 'Medical info update'] },
];

export function SearchSheet() {
  const app = useApp();
  const [q, setQ] = useState('');
  return (
    <Sheet open onClose={() => app.closeSheet()} full title="Search">
      <div className="search-field" style={{ marginBottom: 16 }}>
        <SearchI size={16}/>
        <input placeholder="Search circles, events, people…" value={q} onChange={e => setQ(e.target.value)} autoFocus/>
        {q && <button onClick={() => setQ('')} style={{ color:'var(--ink-3)' }}><CloseI size={16}/></button>}
      </div>

      {!q && (
        <>
          <div className="list-section">
            <div className="list-section-head">Recent</div>
            <div className="ios-list">
              {SEARCH_RECENT.map(r => (
                <div key={r} className="ios-list-row" onClick={() => setQ(r)}>
                  <SearchI size={16} style={{ color:'var(--ink-3)' }}/>
                  <div className="left"><div className="title">{r}</div></div>
                </div>
              ))}
            </div>
          </div>
          {SEARCH_SUGGEST.map(s => (
            <div className="list-section" key={s.cat}>
              <div className="list-section-head">{s.cat}</div>
              <div className="ios-list">
                {s.items.map(it => (
                  <div key={it} className="ios-list-row">
                    <div className="left"><div className="title">{it}</div></div>
                    <div className="right"><ChevronR size={16}/></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
      {q && (
        <div style={{ padding:'40px 24px', textAlign:'center', color:'var(--ink-3)', fontSize:14 }}>
          Searching &ldquo;<b style={{ color:'var(--ink)' }}>{q}</b>&rdquo; across your circles…
        </div>
      )}
    </Sheet>
  );
}

// ── Notifications ─────────────────────────────────────────────────────────────
const NOTIFS = [
  { unread:true,  ico:'🏕️', bg:'#FF3B30', title:'Scout camp permission', body:'Akela posted the gear list and consent form for the winter camp.', time:'2h' },
  { unread:true,  ico:'🩰', bg:'#FF2D55', title:'Ballet recital tickets',  body:'Tickets for Saturday 14 June are on sale now.',                 time:'5h' },
  { unread:true,  ico:'🔒', bg:'#FF9F0A', title:'Personal info accessed',  body:"Emma viewed kids' medical info from her device.",               time:'Yesterday' },
  { unread:false, ico:'💳', bg:'#34C759', title:'Payment reminder',        body:'Scouts fees ($145) due today.',                                  time:'Yesterday' },
  { unread:false, ico:'📚', bg:'#0A84FF', title:'Excursion permission',    body:'Bayside Primary needs your signature by Friday.',                time:'2 days' },
  { unread:false, ico:'🎁', bg:'#AF52DE', title:'Rewards earned',          body:'+25 points for completing 3 permission slips this week.',        time:'3 days' },
];

export function NotificationsSheet() {
  const app = useApp();
  return (
    <Sheet open onClose={() => app.closeSheet()} full title="Notifications"
           rightBtn={<button onClick={() => app.closeSheet()}>Done</button>}>
      <div style={{ padding:'6px 14px 0' }}>
        <div className="segmented">
          <button className="seg-item active">All</button>
          <button className="seg-item">Family</button>
          <button className="seg-item">Circles</button>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        {NOTIFS.map((n, i) => (
          <div key={i} className={`notif-row ${n.unread ? 'unread' : ''}`}>
            <div className="notif-ico" style={{ background: n.bg, fontSize: 16 }}>{n.ico}</div>
            <div className="notif-text">
              <div className="notif-title">{n.title}</div>
              <div className="notif-body">{n.body}</div>
              <div className="notif-time">{n.time}</div>
            </div>
            {n.unread && <div style={{ width:8, height:8, borderRadius:99, background:'var(--blue)', alignSelf:'center', marginTop:8 }}/>}
          </div>
        ))}
      </div>
    </Sheet>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────
export function ProfileSheet() {
  const app = useApp();
  const p1 = app.family.parent1;
  const closeThen = (kind: Parameters<typeof app.pushScreen>[0], props?: Record<string, unknown>) => {
    app.closeSheet();
    setTimeout(() => app.pushScreen(kind, props || {}), 250);
  };
  return (
    <Sheet open onClose={() => app.closeSheet()} full title="Settings">
      <div className="profile-head">
        <div className="profile-avatar">{p1.initials}</div>
        <div className="profile-name">{p1.name}</div>
        <div className="profile-email">{p1.email}</div>
      </div>

      <div className="list-section">
        <div className="list-section-head">Your Vault</div>
        <div className="ios-list">
          <ListRow icon={<LockI size={16}/>} iconBg="#FF9F0A" title="Personal information"
            sub="Address, ID, payment methods" locked
            onClick={() => { app.closeSheet(); setTimeout(() => app.openSheet('2fa', { target: 'personal-info' }), 250); }}/>
          <ListRow icon={<ShieldI size={16}/>} iconBg="#34C759" title="Access log"
            sub="Last accessed by Emma · yesterday"
            onClick={() => app.openSheet('access-log')}/>
        </div>
      </div>

      <div className="list-section">
        <div className="list-section-head">Connections</div>
        <div className="ios-list">
          <ListRow icon="👥" iconBg="#5856D6" title="My People"
            sub={`${MY_PEOPLE.length} contacts · immediate, secondary, friends`}
            onClick={() => closeThen('my-people')}/>
          <ListRow icon="🏠" iconBg="#FF9F0A" title="Sharehouse"
            sub={`${SHAREHOUSE.name} · ${SHAREHOUSE.members.length} housemates`}
            onClick={() => closeThen('sharehouse')}/>
          <ListRow icon="🔄" iconBg="#FF2D55" title="Subscriptions"
            sub={`${SUBSCRIPTIONS.length} active · 1 overdue`}
            onClick={() => closeThen('subscriptions')}/>
          <ListRow icon="💳" iconBg="#0A84FF" title="Finance"
            sub="Bank, cards, and wallets"
            onClick={() => closeThen('finance')}/>
        </div>
      </div>

      <div className="list-section">
        <div className="list-section-head">Preferences</div>
        <div className="ios-list">
          <ListRow title="Permission defaults" value="5 enabled"/>
          <ListRow title="Notifications" value="On"/>
          <ListRow title="Theme" value="System"/>
          <ListRow title="Language" value="English"/>
        </div>
      </div>

      <div className="list-section">
        <div className="ios-list">
          <ListRow title="Help & support" chevron={true}/>
          <ListRow title="Privacy policy"/>
          <ListRow title="Sign out" chevron={false} onClick={() => app.restartOnboarding()}/>
        </div>
      </div>

      <div style={{ textAlign:'center', color:'var(--ink-4)', fontSize:12, padding:'24px 0' }}>
        Life v1.0 · build 2026.05.26
      </div>
    </Sheet>
  );
}

// ── Rewards ───────────────────────────────────────────────────────────────────
const REWARD_ITEMS = [
  { title:'$10 Bayside Bookshop voucher', cost:'500 pts', emoji:'📚' },
  { title:'Free coffee · Coral Café',     cost:'250 pts', emoji:'☕️' },
  { title:'1 month tutoring discount',    cost:'1,000 pts', emoji:'📐' },
  { title:'Family movie tickets ×4',      cost:'1,200 pts', emoji:'🎬' },
];
const EARN_WAYS = [
  { title:'Complete a permission slip',  pts:'+15 pts', emoji:'✅' },
  { title:'RSVP to an event',            pts:'+5 pts',  emoji:'🎉' },
  { title:'Pay org fees on time',        pts:'+25 pts', emoji:'💳' },
  { title:'Invite a friend',             pts:'+100 pts',emoji:'💌' },
];

export function RewardsSheet() {
  const app = useApp();
  const [tab, setTab] = useState<'redeem' | 'earn' | 'history'>('redeem');
  return (
    <Sheet open onClose={() => app.closeSheet()} full title="Rewards">
      <div className="rewards-card">
        <div className="label">Your balance</div>
        <div className="balance">{app.rewards.toLocaleString()}</div>
        <div className="balance-sub">+125 this month</div>
      </div>

      <div style={{ padding:'0 14px 12px' }}>
        <div className="segmented">
          <button className={`seg-item ${tab === 'redeem' ? 'active' : ''}`} onClick={() => setTab('redeem')}>Redeem</button>
          <button className={`seg-item ${tab === 'earn' ? 'active' : ''}`} onClick={() => setTab('earn')}>Ways to earn</button>
          <button className={`seg-item ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>History</button>
        </div>
      </div>

      {tab === 'redeem' && REWARD_ITEMS.map((r, i) => (
        <div key={i} className="reward-tile">
          <div className="reward-emoji">{r.emoji}</div>
          <div className="reward-text">
            <div className="reward-title">{r.title}</div>
            <div className="reward-cost">{r.cost}</div>
          </div>
          <button className="reward-redeem">Redeem</button>
        </div>
      ))}
      {tab === 'earn' && EARN_WAYS.map((e, i) => (
        <div key={i} className="reward-tile">
          <div className="reward-emoji">{e.emoji}</div>
          <div className="reward-text">
            <div className="reward-title">{e.title}</div>
            <div className="reward-cost">{e.pts}</div>
          </div>
        </div>
      ))}
      {tab === 'history' && (
        <div style={{ padding:'20px 14px', color:'var(--ink-3)', fontSize:14, textAlign:'center' }}>
          Recent activity: +25 (Scouts fees), +15 (Excursion form), +5 (Ballet RSVP), -250 (Coral Café coffee).
        </div>
      )}
      <div style={{ height: 24 }}/>
    </Sheet>
  );
}

// ── Pay ───────────────────────────────────────────────────────────────────────
export function PaySheet({ event }: { event?: { org?: string; amount?: number; title?: string } }) {
  const app = useApp();
  const [method, setMethod] = useState('visa');
  const [stage, setStage] = useState<'review' | 'processing' | 'done'>('review');
  const amount = event?.amount || 145;

  const confirm = () => {
    setStage('processing');
    setTimeout(() => setStage('done'), 1100);
    setTimeout(() => { app.setBy(s => ({ ...s, paid: true, rewards: s.rewards + 25 })); }, 1200);
  };

  return (
    <Sheet open onClose={() => app.closeSheet()} full title={stage === 'done' ? '' : 'Pay'}>
      {stage === 'review' && (
        <>
          <div className="pay-amount-block">
            <div className="amount">${amount}.00</div>
            <div className="for">to {event?.org || '1st Bayside Scout Group'}</div>
          </div>

          <div className="list-section">
            <div className="list-section-head">Order</div>
            <div className="ios-list">
              <div className="ios-list-row">
                <div className="left"><div className="title">Term 2 fees</div><div className="sub">Jake Watson · Cub Scout</div></div>
                <div className="right value">$145.00</div>
              </div>
              <div className="ios-list-row">
                <div className="left"><div className="title">Total</div></div>
                <div className="right value" style={{ color:'var(--ink)', fontWeight:700 }}>$145.00</div>
              </div>
            </div>
          </div>

          <div className="list-section">
            <div className="list-section-head">Payment method</div>
          </div>
          {[
            { id:'visa',  name:'Visa',     num:'•••• 4221', bg:'linear-gradient(135deg,#1A1F71,#2A6CFF)' },
            { id:'amex',  name:'Amex',     num:'•••• 1005', bg:'linear-gradient(135deg,#016FD0,#003D6B)' },
            { id:'apple', name:'Apple Pay',num:'Default device', bg:'#000' },
          ].map(m => (
            <div key={m.id} className={`method-row ${method === m.id ? 'selected' : ''}`} onClick={() => setMethod(m.id)}>
              <div className="method-ico" style={{ background: m.bg }}>{m.name === 'Apple Pay' ? <AppleI size={16}/> : m.name.toUpperCase().slice(0,4)}</div>
              <div className="method-text">
                <div className="method-name">{m.name}</div>
                <div className="method-num">{m.num}</div>
              </div>
              <div style={{ width:22, height:22, borderRadius:99, border: '2px solid var(--line)', display:'grid', placeItems:'center',
                            background: method === m.id ? 'var(--blue)' : 'transparent', borderColor: method === m.id ? 'var(--blue)' : 'var(--line)' }}>
                {method === m.id && <CheckI size={12}/>}
              </div>
            </div>
          ))}
          <div style={{ padding:'12px 14px', color:'var(--ink-3)', fontSize:12, textAlign:'center' }}>
            Earn <b style={{ color:'var(--amber-ink, #B45309)' }}>+25 points</b> on this payment
          </div>
        </>
      )}
      {stage === 'processing' && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 24px', gap: 24 }}>
          <div className="big-mark" style={{ background:'var(--blue)', width:80, height:80, borderRadius:20 }}>
            <CardI size={36}/>
          </div>
          <div style={{ fontSize:18, fontWeight:700 }}>Processing payment…</div>
        </div>
      )}
      {stage === 'done' && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'60px 24px', gap: 16, textAlign:'center' }}>
          <div className="big-mark" style={{ background:'var(--green)', width:84, height:84, borderRadius:50 }}>
            <CheckI size={48} color="white"/>
          </div>
          <div style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.02em' }}>Paid ${amount}.00</div>
          <div style={{ fontSize:14, color:'var(--ink-3)' }}>Receipt sent to {app.family.parent1.email}.<br/>+25 rewards points earned.</div>
        </div>
      )}

      {stage === 'review' && (
        <div className="sheet-footer">
          <button className="btn primary" onClick={confirm}>
            Pay ${amount}.00 with {method === 'apple' ? 'Apple Pay' : 'card'}
          </button>
        </div>
      )}
      {stage === 'done' && (
        <div className="sheet-footer">
          <button className="btn primary" onClick={() => app.closeSheet()}>Done</button>
        </div>
      )}
    </Sheet>
  );
}

// ── Sign (permission slip) ────────────────────────────────────────────────────
export function SignSheet({ event }: { event?: Record<string, unknown> }) {
  const app = useApp();
  const [stage, setStage] = useState<'review' | 'done'>('review');
  const [strokes, setStrokes] = useState<[number, number][][]>([]);
  const [drawing, setDrawing] = useState(false);
  const padRef = useRef<HTMLDivElement>(null);

  const getPt = (e: React.MouseEvent | React.TouchEvent): [number, number] => {
    const rect = padRef.current!.getBoundingClientRect();
    const t = 'touches' in e ? e.touches[0] : e;
    return [t.clientX - rect.left, t.clientY - rect.top];
  };
  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setDrawing(true);
    const pt = getPt(e);
    setStrokes(s => [...s, [pt]]);
  };
  const moveDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const pt = getPt(e);
    setStrokes(s => { const last = s[s.length - 1]; return [...s.slice(0, -1), [...last, pt]]; });
  };
  const endDraw = () => setDrawing(false);

  const submit = () => {
    if (!strokes.length) return;
    setStage('done');
    setTimeout(() => { app.setBy(s => ({ ...s, signed: true, rewards: s.rewards + 15 })); }, 200);
  };

  return (
    <Sheet open onClose={() => app.closeSheet()} full title="Permission slip"
           rightBtn={stage === 'review' && strokes.length > 0 ? <button onClick={() => setStrokes([])} style={{ color: 'var(--red, #FF3B30)' }}>Clear</button> : undefined}>
      {stage === 'review' && (
        <>
          <div className="form-doc">
            <h3>Year 6 Maritime Museum Excursion</h3>
            <div className="org-line">Bayside Primary School · Wed 4 June, 2026</div>
            <h4>Student</h4>
            <dl>
              <dt>Name</dt><dd>{app.family.kids[0].name}</dd>
              <dt>Grade</dt><dd>{app.family.kids[0].grade}</dd>
              <dt>Allergies</dt><dd>{app.family.kids[0].allergies}</dd>
              <dt>Emergency contact</dt><dd>{app.family.parent1.phone}</dd>
            </dl>
            <h4>Trip details</h4>
            <p>Students will travel by bus from school at 9:00 AM to the Australian National Maritime Museum, returning by 3:00 PM. Lunch will not be provided — students must bring their own.</p>
            <h4>Consents</h4>
            <p style={{ color:'var(--ink-3)' }}>By signing below you consent to your child&apos;s participation, agree to release of medical info in an emergency, and authorise photography for school newsletter use only.</p>
          </div>

          <div style={{ padding:'18px 14px 6px', fontSize:13, fontWeight:700, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.05em' }}>
            Sign here
          </div>
          <div className={`signature-pad ${strokes.length ? 'signed' : ''}`}
               ref={padRef}
               onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
               onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}>
            {strokes.length === 0 && <span>Sign with your finger or mouse</span>}
            <svg width="100%" height="100%" style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
              {strokes.map((s, i) => (
                <polyline key={i} className="sig-line"
                          points={s.map(([x,y]) => `${x},${y}`).join(' ')}/>
              ))}
            </svg>
          </div>
          <div style={{ padding:'12px 14px', fontSize:12, color:'var(--ink-3)' }}>
            Signed by: <b style={{ color:'var(--ink)' }}>{app.family.parent1.name}</b> · {new Date().toLocaleDateString()}
          </div>
        </>
      )}
      {stage === 'done' && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'60px 24px', gap: 16, textAlign:'center' }}>
          <div className="big-mark" style={{ background:'var(--green)', width:84, height:84, borderRadius:50 }}>
            <CheckI size={48} color="white"/>
          </div>
          <div style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.02em' }}>Signed &amp; sent</div>
          <div style={{ fontSize:14, color:'var(--ink-3)' }}>Bayside Primary will be notified. +15 rewards points earned.</div>
        </div>
      )}
      {stage === 'review' && (
        <div className="sheet-footer">
          <button className="btn primary" disabled={!strokes.length} onClick={submit}>Submit signed form</button>
        </div>
      )}
      {stage === 'done' && (
        <div className="sheet-footer">
          <button className="btn primary" onClick={() => app.closeSheet()}>Done</button>
        </div>
      )}
    </Sheet>
  );
}

// ── 2FA ───────────────────────────────────────────────────────────────────────
export function TwoFASheet({ target }: { target?: string }) {
  const app = useApp();
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<'enter' | 'verifying' | 'success'>('enter');

  const tapKey = (k: string) => {
    if (k === 'del') return setCode(c => c.slice(0, -1));
    if (code.length >= 6) return;
    setCode(c => c + k);
  };

  useEffect(() => {
    if (code.length === 6) {
      setStage('verifying');
      setTimeout(() => {
        setStage('success');
        setTimeout(() => {
          app.closeSheet();
          if (target === 'personal-info') app.pushScreen('personal-info');
        }, 600);
      }, 700);
    }
  }, [code]);

  return (
    <Sheet open onClose={() => app.closeSheet()} full title="Two-factor required">
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'24px 24px 8px', textAlign:'center', gap: 8 }}>
        <div className="big-mark" style={{ background:'var(--amber, #FF9F0A)', width:64, height:64, borderRadius:16 }}>
          <LockI size={28}/>
        </div>
        <div style={{ fontSize:18, fontWeight:700 }}>Verify it&apos;s really you</div>
        <div style={{ fontSize:13, color:'var(--ink-3)', maxWidth: 280, lineHeight:1.45 }}>
          We sent a 6-digit code to {app.family.parent1.phone.slice(-7)}. Emma will also be notified of this access.
        </div>
      </div>

      <div className="tfa-otp">
        {[0,1,2,3,4,5].map(i => (
          <div key={i} className={`box ${code[i] ? 'filled' : ''}`}>{code[i] ?? ''}</div>
        ))}
      </div>

      {stage === 'enter' && (
        <div className="tfa-keypad" style={{ marginTop: 6 }}>
          {['1','2','3','4','5','6','7','8','9'].map(k => (
            <button key={k} className="tfa-key" onClick={() => tapKey(k)}>{k}</button>
          ))}
          <button className="tfa-key no-bg" onClick={() => alert('Use SMS or authenticator app')}>
            <FaceI size={28} stroke={1.4}/>
          </button>
          <button className="tfa-key" onClick={() => tapKey('0')}>0</button>
          <button className="tfa-key no-bg" onClick={() => tapKey('del')}>
            <svg width="28" height="20" viewBox="0 0 28 20"><path d="M9 2h17a2 2 0 012 2v12a2 2 0 01-2 2H9l-7-8 7-8z" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M14 7l6 6M20 7l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}
      {stage === 'verifying' && (
        <div style={{ textAlign:'center', padding:'24px', color:'var(--ink-3)', fontSize:14 }}>Verifying…</div>
      )}
      {stage === 'success' && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'24px', gap: 8 }}>
          <div className="big-mark" style={{ background:'var(--green)', width:60, height:60, borderRadius:50 }}>
            <CheckI size={32} color="white"/>
          </div>
          <div style={{ fontSize:15, fontWeight:600 }}>Unlocked</div>
        </div>
      )}
      <div style={{ height: 24 }}/>
    </Sheet>
  );
}

// ── Access Log ────────────────────────────────────────────────────────────────
export function AccessLogSheet() {
  const app = useApp();
  const log = [
    { who: 'Emma Watson',         what: "Viewed kids' medical info",              time: 'Yesterday, 6:42 PM', device: 'iPhone · Sydney' },
    { who: 'Tim Watson',          what: 'Updated next of kin',                    time: '3 days ago',          device: 'iPhone · Sydney' },
    { who: 'Bayside Primary School', what: "Read Sarah's allergies (form: Excursion)", time: '5 days ago',     device: 'Org portal' },
    { who: 'Tim Watson',          what: 'Signed in',                              time: '6 days ago',          device: 'iPhone · Sydney' },
  ];
  return (
    <Sheet open onClose={() => app.closeSheet()} full title="Access log">
      <div style={{ padding:'8px 14px 14px', color:'var(--ink-3)', fontSize:13 }}>
        Every time someone accesses your personal vault we log it here and notify your co-parent.
      </div>
      <div style={{ padding:'0 14px' }}>
        <div className="ios-list">
          {log.map((l, i) => (
            <div key={i} className="ios-list-row" style={{ alignItems:'flex-start' }}>
              <div className="left">
                <div className="title">{l.what}</div>
                <div className="sub">{l.who} · {l.device}</div>
              </div>
              <div className="right value">{l.time}</div>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

// ── Event Detail ──────────────────────────────────────────────────────────────
export function EventDetailScreen({ event }: { event?: Record<string, string> }) {
  const app = useApp();
  const e = event || {};
  return (
    <PushScreen title="Event" onBack={() => app.popScreen()}>
      <div className="event-detail-hero">
        <div className="event-detail-time">{e.time || 'Today'}</div>
        <div className="event-detail-title">{e.title || 'Event'}</div>
        {e.sub && <div className="event-detail-loc">{e.sub}</div>}
      </div>

      <div className="list-section" style={{ marginTop: 0 }}>
        <div className="ios-list" style={{ background: 'transparent', border: 0, borderRadius: 0 }}>
          {e.loc && (
            <div className="detail-row">
              <div className="ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 21s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg></div>
              <div><div className="lbl">Where</div><div className="val">{e.loc}</div></div>
              <ChevronR size={16} stroke={2} style={{ color: 'var(--ink-4)' }}/>
            </div>
          )}
          {e.org && (
            <div className="detail-row">
              <div className="ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 21V9h6v12"/></svg></div>
              <div><div className="lbl">Organised by</div><div className="val">{e.org}</div></div>
              <ChevronR size={16} stroke={2} style={{ color: 'var(--ink-4)' }}/>
            </div>
          )}
          <div className="detail-row">
            <div className="ico"><ClockI size={20} stroke={1.75}/></div>
            <div><div className="lbl">When</div><div className="val">Today · {e.time || 'TBD'}</div></div>
          </div>
        </div>
      </div>

      {e.desc && (
        <div style={{ padding:'20px 18px 0', color:'var(--ink-2)', fontSize:14, lineHeight:1.5 }}>{e.desc}</div>
      )}

      <div style={{ padding:'20px 14px 30px', display:'flex', flexDirection:'column', gap:10 }}>
        <button className="btn primary">Add to calendar</button>
        <div className="btn-row">
          <button className="btn secondary">Share</button>
          <button className="btn secondary">Message</button>
        </div>
      </div>
    </PushScreen>
  );
}

// ── Circle Detail ─────────────────────────────────────────────────────────────
const ORG_FOOTERS: Record<string, { id: string; label: string; emoji: string }[]> = {
  'Education': [
    { id:'board', label:'Board', emoji:'📰' }, { id:'canteen', label:'Canteen', emoji:'🥪' },
    { id:'uniforms', label:'Uniforms', emoji:'👕' }, { id:'fundraisers', label:'Fundraisers', emoji:'🎟️' },
    { id:'calendar', label:'Calendar', emoji:'📅' },
  ],
  'Sporting': [
    { id:'board', label:'Board', emoji:'📰' }, { id:'canteen', label:'Canteen', emoji:'🥪' },
    { id:'uniforms', label:'Uniforms', emoji:'👕' }, { id:'scoreboard', label:'Scoreboard', emoji:'🏆' },
    { id:'fundraisers', label:'Fundraisers', emoji:'🎟️' }, { id:'calendar', label:'Calendar', emoji:'📅' },
  ],
  'Community': [
    { id:'board', label:'Board', emoji:'📰' }, { id:'events', label:'Events', emoji:'🎉' },
    { id:'members', label:'Members', emoji:'👥' }, { id:'calendar', label:'Calendar', emoji:'📅' },
  ],
  'Religion': [
    { id:'board', label:'Board', emoji:'📰' }, { id:'services', label:'Services', emoji:'🕯️' },
    { id:'donations', label:'Give', emoji:'💝' }, { id:'calendar', label:'Calendar', emoji:'📅' },
  ],
  'Clubs & Societies': [
    { id:'board', label:'Board', emoji:'📰' }, { id:'canteen', label:'Canteen', emoji:'🥪' },
    { id:'uniforms', label:'Uniforms', emoji:'👕' }, { id:'fundraisers', label:'Fundraisers', emoji:'🎟️' },
    { id:'calendar', label:'Calendar', emoji:'📅' },
  ],
};

interface CircleData { name: string; initials: string; color: string; role: string; updates: number; }

export function CircleDetailScreen({ circle, category }: { circle?: CircleData; category?: string }) {
  const app = useApp();
  const c = circle || { name:'', initials:'', color:'#000', role:'', updates:0 };
  const cat = category || 'Education';
  const footer = ORG_FOOTERS[cat] || ORG_FOOTERS['Education'];
  const [view, setView] = useState('board');

  return (
    <div className="push-screen open org-screen">
      <OrgNav circle={c} category={cat} onHome={() => app.popScreen()}/>
      <div className="scroll org-scroll">
        {view === 'board'       && <OrgBoard circle={c} category={cat}/>}
        {view === 'canteen'     && <OrgCanteen circle={c}/>}
        {view === 'uniforms'    && <OrgUniforms circle={c}/>}
        {view === 'scoreboard'  && <OrgScoreboard circle={c}/>}
        {view === 'fundraisers' && <OrgFundraisers circle={c}/>}
        {view === 'calendar'    && <OrgCalendar circle={c}/>}
        {view === 'events'      && <OrgCalendar circle={c}/>}
        {view === 'members'     && <OrgMembers circle={c}/>}
        {view === 'services'    && <OrgServices circle={c}/>}
        {view === 'donations'   && <OrgDonations circle={c}/>}
        <div style={{ height: 24 }}/>
      </div>
      <OrgFooter items={footer} active={view} onSelect={setView}/>
    </div>
  );
}

function OrgNav({ circle, category, onHome }: { circle: CircleData; category: string; onHome: () => void }) {
  const app = useApp();
  return (
    <div className="org-nav" style={{ background: circle.color }}>
      <button className="org-nav-home" onClick={onHome} aria-label="Back to Life">
        <Logo size={28}/>
      </button>
      <div className="org-nav-id">
        <div className="org-nav-name">{circle.name}</div>
        <div className="org-nav-sub">{category} · {circle.role}</div>
      </div>
      <button className="org-nav-icon" onClick={() => app.openSheet('chat')} aria-label="Message">
        <ChatI size={20}/>
      </button>
    </div>
  );
}

function OrgFooter({ items, active, onSelect }: { items: { id: string; label: string; emoji: string }[]; active: string; onSelect: (id: string) => void }) {
  return (
    <nav className="org-footer">
      {items.map(it => (
        <button key={it.id} className={`org-foot-item ${active === it.id ? 'active' : ''}`} onClick={() => onSelect(it.id)}>
          <span className="org-foot-ico" aria-hidden="true">{it.emoji}</span>
          <span className="org-foot-label">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

function OrgBoard({ circle, category }: { circle: CircleData; category: string }) {
  const samplePosts = [
    {
      who: circle.name, ago: '2h',
      title: category === 'Sporting' ? '🏆 Saturday Team of the Week' : '📚 This week at ' + circle.name.split(' ').slice(0,2).join(' '),
      body: category === 'Sporting'
        ? 'Huge effort by the U10s — 4-1 win against Coastal United. Player of the match: Jake Watson 🌟'
        : 'Year 6 are running the Maritime Museum excursion this Wednesday. Please sign the form by Friday.',
      img: category === 'Sporting'
        ? 'linear-gradient(135deg, #16A34A 0%, #166534 50%, #052E16 100%)'
        : 'linear-gradient(135deg, #BAE6FD 0%, #60A5FA 50%, #1E3A8A 100%)',
      likes: 42, comments: 7,
    },
    {
      who: circle.name, ago: '1d', title: '📅 Coming up',
      body: category === 'Sporting'
        ? 'Training: Tue 4:30pm at Bayside Oval. Bring water + boots + shin pads.'
        : 'Whole-school assembly Friday at 10am. Parents welcome — please sign in at reception.',
      likes: 18, comments: 3,
    },
    {
      who: circle.name, ago: '3d', title: '🎟️ Fundraiser update',
      body: 'Chocolate drive raised $1,240 this week — thanks to all the families who took part!',
      img: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #B45309 100%)',
      likes: 89, comments: 14,
    },
  ];

  return (
    <>
      <div className="org-hero" style={{ background: `linear-gradient(180deg, ${circle.color} 0%, ${circle.color}dd 100%)` }}>
        <div className="org-hero-logo">{circle.initials}</div>
        <div className="org-hero-text">
          <div className="org-hero-name">{circle.name}</div>
          <div className="org-hero-role">{circle.role}</div>
          <div className="org-hero-stats">
            <span>{Math.floor(circle.name.length * 32 + 110)} members</span>
            <span>·</span>
            <span>{circle.updates || 0} new today</span>
          </div>
        </div>
      </div>

      <div className="org-quickbar">
        <button className="org-quick"><span>📋</span>Forms<span className="qb-badge">2</span></button>
        <button className="org-quick"><span>💳</span>Payments<span className="qb-badge">1</span></button>
        <button className="org-quick"><span>📅</span>RSVP</button>
        <button className="org-quick"><span>📨</span>Message</button>
      </div>

      <div className="org-feed">
        {samplePosts.map((p, i) => (
          <article key={i} className="org-post">
            <header className="org-post-head">
              <div className="org-post-avatar" style={{ background: circle.color }}>{circle.initials}</div>
              <div>
                <div className="org-post-name">{p.who}</div>
                <div className="org-post-ago">{p.ago}</div>
              </div>
            </header>
            {p.img && <div className="org-post-img" style={{ background: p.img }}/>}
            <div className="org-post-body">
              <div className="org-post-title">{p.title}</div>
              <div className="org-post-text">{p.body}</div>
              <div className="org-post-meta">
                <span>❤️ {p.likes}</span>
                <span>💬 {p.comments}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function OrgCanteen({ circle }: { circle: CircleData }) {
  const items = [
    { name: 'Vegemite sandwich',    price: '$4.50', tag: 'Vegetarian',   emoji: '🥪' },
    { name: 'Chicken & salad wrap', price: '$6.50', tag: 'Halal',        emoji: '🌯' },
    { name: 'Fresh fruit cup',      price: '$3.00', tag: 'Gluten-free',  emoji: '🍎' },
    { name: 'Sushi rolls (2)',      price: '$7.00', tag: 'Most popular', emoji: '🍣' },
    { name: 'Hot chips (small)',    price: '$3.50', tag: 'Tuesday only', emoji: '🍟' },
    { name: 'Milk · 250ml',         price: '$2.00', tag: '',             emoji: '🥛' },
  ];
  return (
    <>
      <div className="org-section-head"><h2>Canteen</h2><span>Order by 9am for same-day lunch</span></div>
      <div className="canteen-grid">
        {items.map((it, i) => (
          <div key={i} className="canteen-card">
            <div className="canteen-emoji" style={{ background: `${circle.color}1A` }}>{it.emoji}</div>
            <div className="canteen-name">{it.name}</div>
            {it.tag && <div className="canteen-tag">{it.tag}</div>}
            <div className="canteen-foot">
              <span className="canteen-price">{it.price}</span>
              <button className="canteen-add" style={{ background: circle.color }}><PlusI size={14}/></button>
            </div>
          </div>
        ))}
      </div>
      <div className="org-cta">
        <button className="btn primary" style={{ background: circle.color }}>Today&apos;s lunch order · 0 items</button>
      </div>
    </>
  );
}

function OrgUniforms({ circle }: { circle: CircleData }) {
  const items = [
    { name: 'Polo shirt · navy',      size: 'Size 10', price: '$32', stock: 'In stock',  emoji: '👕' },
    { name: 'Sport shorts',           size: 'Size 10', price: '$24', stock: 'In stock',  emoji: '🩳' },
    { name: 'Winter jumper',          size: 'Size 12', price: '$58', stock: 'Low stock', emoji: '🧥' },
    { name: 'School hat · wide brim', size: 'Medium',  price: '$18', stock: 'In stock',  emoji: '🧢' },
    { name: 'Lunch backpack',         size: '',        price: '$45', stock: 'In stock',  emoji: '🎒' },
    { name: 'School socks (3-pack)',  size: '',        price: '$15', stock: 'In stock',  emoji: '🧦' },
  ];
  return (
    <>
      <div className="org-section-head"><h2>Uniforms</h2><span>Click &amp; collect from the office</span></div>
      <div className="canteen-grid">
        {items.map((it, i) => (
          <div key={i} className="canteen-card">
            <div className="canteen-emoji" style={{ background: `${circle.color}1A` }}>{it.emoji}</div>
            <div className="canteen-name">{it.name}</div>
            <div className="canteen-tag">
              {it.size}{it.size && ' · '}
              <span style={{ color: it.stock === 'Low stock' ? 'var(--amber-ink, #B45309)' : 'var(--ink-3)' }}>{it.stock}</span>
            </div>
            <div className="canteen-foot">
              <span className="canteen-price">{it.price}</span>
              <button className="canteen-add" style={{ background: circle.color }}><PlusI size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function OrgScoreboard({ circle }: { circle: CircleData }) {
  const results = [
    { date: 'Sat 24 May', team: 'U10 Bayside vs Coastal Utd',   score: '4 – 1', won: true  as boolean | null },
    { date: 'Sat 17 May', team: 'U10 Bayside vs Northern Stars', score: '2 – 2', won: null  as boolean | null },
    { date: 'Sat 10 May', team: 'U10 Bayside vs Westfield FC',   score: '1 – 3', won: false as boolean | null },
    { date: 'Sat  3 May', team: 'U10 Bayside vs South Sharks',   score: '5 – 0', won: true  as boolean | null },
  ];
  return (
    <>
      <div className="org-section-head"><h2>Scoreboard</h2><span>U10 Bayside · Round 8</span></div>
      <div className="ladder-card" style={{ background: `linear-gradient(135deg, ${circle.color}, ${circle.color}cc)` }}>
        <div className="ladder-rank">2nd</div>
        <div className="ladder-stats">
          <div><span>14</span>Pts</div>
          <div><span>4</span>W</div>
          <div><span>2</span>D</div>
          <div><span>1</span>L</div>
        </div>
      </div>
      <div className="org-section-head" style={{ marginTop: 18 }}><h2>Recent results</h2></div>
      <div className="results-list">
        {results.map((r, i) => (
          <div key={i} className="result-row">
            <div className="result-date">{r.date}</div>
            <div className="result-team">{r.team}</div>
            <div className={`result-score ${r.won === true ? 'win' : r.won === false ? 'loss' : 'draw'}`}>{r.score}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function OrgFundraisers({ circle }: { circle: CircleData }) {
  const fundraisers = [
    { title: 'Chocolate drive',      progress: 62, goal: '$2,000', raised: '$1,240', emoji: '🍫', closes: '4 days left' },
    { title: 'Trivia night tickets', progress: 88, goal: '$1,500', raised: '$1,320', emoji: '🎤', closes: 'This Friday' },
    { title: 'Winter raffle',        progress: 24, goal: '$5,000', raised: '$1,200', emoji: '🎟️', closes: '3 weeks left' },
    { title: 'Year 6 farewell fund', progress: 41, goal: '$3,000', raised: '$1,230', emoji: '🎓', closes: 'Open' },
  ];
  return (
    <>
      <div className="org-section-head"><h2>Fundraisers</h2><span>Every dollar goes back to the kids</span></div>
      {fundraisers.map((f, i) => (
        <div key={i} className="fundraiser-card">
          <div className="fundraiser-head">
            <div className="fundraiser-emoji">{f.emoji}</div>
            <div style={{ flex: 1 }}>
              <div className="fundraiser-title">{f.title}</div>
              <div className="fundraiser-sub">{f.raised} of {f.goal} · {f.closes}</div>
            </div>
            <button className="fundraiser-btn" style={{ background: circle.color }}>Give</button>
          </div>
          <div className="fundraiser-bar">
            <div className="fundraiser-fill" style={{ width: f.progress + '%', background: circle.color }}/>
          </div>
        </div>
      ))}
    </>
  );
}

function OrgCalendar({ circle }: { circle: CircleData }) {
  const events = [
    { date: 'Today',      time: '5:00 PM', title: 'Training · U10',    loc: 'Bayside Oval', color: circle.color },
    { date: 'Tomorrow',   time: '4:30 PM', title: 'Game preview',      loc: 'Clubhouse',    color: '#5856D6' },
    { date: 'Sat 30 May', time: '9:00 AM', title: 'Round 9 match',     loc: 'Coastal Oval', color: '#16A34A' },
    { date: 'Wed 4 Jun',  time: '6:30 PM', title: 'Parents meeting',   loc: 'Clubhouse',    color: '#AF52DE' },
    { date: 'Sat 14 Jun', time: '7:00 PM', title: 'Annual presentation',loc:'RSL Hall',     color: '#F59E0B' },
  ];
  return (
    <>
      <div className="org-section-head"><h2>Calendar</h2><span>Tap an event to RSVP or add to family calendar</span></div>
      {events.map((e, i) => (
        <div key={i} className="agenda-item" style={{ marginBottom: 8, marginLeft: 14, marginRight: 14 }}>
          <div className="agenda-time">{e.time}</div>
          <div className="agenda-bar" style={{ background: e.color }}/>
          <div className="agenda-body">
            <div className="agenda-title">{e.title}</div>
            <div className="agenda-loc">{e.date} · {e.loc}</div>
          </div>
        </div>
      ))}
    </>
  );
}

function OrgMembers({ circle }: { circle: CircleData }) {
  const members = [
    { name: 'Akela Mike', role: 'Group Leader', initials: 'AM', color: '#FF3B30' },
    { name: 'Sarah Chen', role: 'Cub Leader',   initials: 'SC', color: '#5856D6' },
    { name: 'David Park', role: 'Treasurer',    initials: 'DP', color: '#34C759' },
    { name: 'Lisa Owens', role: 'Parent rep',   initials: 'LO', color: '#FF9F0A' },
  ];
  return (
    <>
      <div className="org-section-head"><h2>Members</h2><span>Leaders &amp; committee</span></div>
      <div className="ios-list" style={{ margin: '0 14px' }}>
        {members.map((m, i) => (
          <div key={i} className="ios-list-row">
            <div className="ico-square" style={{ background: m.color, fontSize: 12 }}>{m.initials}</div>
            <div className="left"><div className="title">{m.name}</div><div className="sub">{m.role}</div></div>
            <div className="right"><ChevronR size={16}/></div>
          </div>
        ))}
      </div>
    </>
  );
}

function OrgServices({ circle }: { circle: CircleData }) {
  return (
    <>
      <div className="org-section-head"><h2>Services</h2><span>Mass times, baptisms, weddings</span></div>
      <div className="ios-list" style={{ margin: '0 14px' }}>
        {['Sunday Mass · 9:30am','Saturday Vigil · 5:30pm','Weekday Mass · 7am Mon–Fri','Confessions · Sat 4:30pm'].map((s, i) => (
          <div key={i} className="ios-list-row">
            <div className="left"><div className="title">{s}</div></div>
            <div className="right"><ChevronR size={16}/></div>
          </div>
        ))}
      </div>
    </>
  );
}

function OrgDonations({ circle }: { circle: CircleData }) {
  return (
    <>
      <div className="org-section-head"><h2>Give</h2><span>Weekly giving, building fund, special collections</span></div>
      <div className="fundraiser-card">
        <div className="fundraiser-head">
          <div className="fundraiser-emoji">💝</div>
          <div style={{ flex: 1 }}>
            <div className="fundraiser-title">Weekly offering</div>
            <div className="fundraiser-sub">Tap any amount</div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 8, marginTop: 12 }}>
          {['$10','$25','$50','$100','$200','Other'].map(a => (
            <button key={a} className="give-amt" style={{ borderColor: circle.color, color: circle.color }}>{a}</button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Personal Info ─────────────────────────────────────────────────────────────
export function PersonalInfoScreen() {
  const app = useApp();
  const p1 = app.family.parent1;
  const p2 = app.family.parent2;
  const a = app.family.address;
  const n = app.family.nextOfKin;
  return (
    <PushScreen title="Personal info" onBack={() => app.popScreen()}>
      <div style={{ padding:'14px 14px 4px', display:'flex', gap:10, alignItems:'center', color:'var(--amber-ink, #B45309)', background:'var(--amber-soft, #FEF3C7)', borderRadius:12, margin:'10px 14px 14px' }}>
        <LockI size={16}/>
        <div style={{ fontSize:12, lineHeight:1.4 }}>Unlocked for 5 minutes. Emma was notified of this access.</div>
      </div>

      <div className="list-section" style={{ marginTop: 4 }}>
        <div className="list-section-head">You</div>
        <div className="ios-list">
          <ListRow title="Name"  value={p1.name}/>
          <ListRow title="Email" value={p1.email}/>
          <ListRow title="Phone" value={p1.phone}/>
          <ListRow title="DOB"   value={new Date(p1.dob).toLocaleDateString()}/>
        </div>
      </div>

      <div className="list-section">
        <div className="list-section-head">Co-parent</div>
        <div className="ios-list">
          <ListRow title="Name"  value={p2.name}/>
          <ListRow title="Email" value={p2.email}/>
          <ListRow title="Phone" value={p2.phone}/>
        </div>
      </div>

      <div className="list-section">
        <div className="list-section-head">Home address</div>
        <div className="ios-list">
          <ListRow title="Street"   value={a.line1}/>
          <ListRow title="Suburb"   value={a.suburb}/>
          <ListRow title="State"    value={a.state}/>
          <ListRow title="Postcode" value={a.postcode}/>
        </div>
      </div>

      <div className="list-section">
        <div className="list-section-head">Next of kin</div>
        <div className="ios-list">
          <ListRow title="Name"         value={n.name}/>
          <ListRow title="Relationship" value={n.relation}/>
          <ListRow title="Phone"        value={n.phone}/>
        </div>
      </div>

      <div className="list-section">
        <div className="list-section-head">Children</div>
        {app.family.kids.map((k, i) => (
          <div className="ios-list" key={i} style={{ marginBottom: 8 }}>
            <ListRow title={k.name} sub={`${k.age} · ${k.grade} · ${k.school}`} value="Edit"/>
            <ListRow title="Allergies"   value={k.allergies}/>
            <ListRow title="Medications" value={k.meds}/>
          </div>
        ))}
      </div>
      <div style={{ height: 30 }}/>
    </PushScreen>
  );
}

// ── My People ─────────────────────────────────────────────────────────────────
export function MyPeopleScreen() {
  const app = useApp();
  const [filter, setFilter] = useState('all');
  const groups = [
    { id: 'all',        label: 'All',        color: '#0A84FF' },
    { id: 'immediate',  label: 'Immediate',  color: '#FF2D55' },
    { id: 'housemates', label: 'Housemates', color: '#FF9F0A' },
    { id: 'secondary',  label: 'Secondary',  color: '#AF52DE' },
    { id: 'friends',    label: 'Friends',    color: '#34C759' },
  ];
  const counts: Record<string, number> = {
    all:        MY_PEOPLE.length,
    immediate:  MY_PEOPLE.filter(p => p.group === 'immediate').length,
    housemates: MY_PEOPLE.filter(p => p.group === 'housemates').length,
    secondary:  MY_PEOPLE.filter(p => p.group === 'secondary').length,
    friends:    MY_PEOPLE.filter(p => p.group === 'friends').length,
  };
  const sectioned = filter === 'all'
    ? [
        { label: 'Immediate',               items: MY_PEOPLE.filter(p => p.group === 'immediate') },
        { label: 'Housemates',              items: MY_PEOPLE.filter(p => p.group === 'housemates') },
        { label: 'Secondary',               items: MY_PEOPLE.filter(p => p.group === 'secondary') },
        { label: 'Friends & acquaintances', items: MY_PEOPLE.filter(p => p.group === 'friends') },
      ]
    : [{ label: groups.find(g => g.id === filter)!.label, items: MY_PEOPLE.filter(p => p.group === filter) }];

  const sh = SHAREHOUSE;
  const myMonthly = sh.services.reduce((s, x) => {
    let m = x.cost;
    if (x.cycle === 'fortnightly') m = x.cost * 26 / 12;
    else if (x.cycle === 'quarterly') m = x.cost / 3;
    else if (x.cycle === 'yearly')    m = x.cost / 12;
    return s + (m * (x.members.me || 0) / 100);
  }, 0);

  return (
    <PushScreen title="My People" onBack={() => app.popScreen()}
               rightAction={<button className="icon-btn" onClick={() => alert('Add a person')}><PlusI size={18}/></button>}>
      <div style={{ padding:'14px 14px 12px' }}>
        <div className="search-field" style={{ margin: 0 }}>
          <SearchI size={16}/>
          <input placeholder="Search people"/>
        </div>
      </div>

      <button className="sharehouse-banner" onClick={() => app.pushScreen('sharehouse')}>
        <div className="sharehouse-art"><span className="sh-emoji">🏠</span></div>
        <div className="sharehouse-body">
          <div className="sharehouse-head">
            <span className="sharehouse-label">Sharehouse</span>
            <span className="sharehouse-pill">{sh.members.length} housemates</span>
          </div>
          <div className="sharehouse-title">{sh.name}</div>
          <div className="sharehouse-stack">
            {sh.members.map((m, i) => (
              <div key={m.id} className="sh-mini-avatar" style={{ background: m.color, marginLeft: i === 0 ? 0 : -8, zIndex: 10 - i }}>
                {m.initials}
              </div>
            ))}
            <div className="sharehouse-due">
              <span>${myMonthly.toFixed(0)}/mo</span>
              <span className="sharehouse-due-sub">your share</span>
            </div>
          </div>
        </div>
        <ChevronR size={18} stroke={2} style={{ color: 'white', alignSelf: 'center', opacity: 0.8 }}/>
      </button>

      <div style={{ display:'flex', gap:8, padding:'0 14px 12px', overflowX:'auto', scrollbarWidth:'none' }}>
        {groups.map(g => {
          const active = filter === g.id;
          return (
            <button key={g.id} onClick={() => setFilter(g.id)}
                    style={{
                      padding:'8px 14px', borderRadius: 999,
                      background: active ? g.color : 'var(--surface)',
                      color: active ? 'white' : 'var(--ink-2)',
                      border: active ? 'none' : '1px solid var(--line)',
                      fontSize: 13, fontWeight: 600,
                      display:'inline-flex', alignItems:'center', gap: 6, flexShrink: 0, whiteSpace:'nowrap',
                    }}>
              {g.label}
              <span style={{ background: active ? 'rgba(255,255,255,0.22)' : 'var(--surface-2)', color: active ? 'white' : 'var(--ink-3)', padding:'1px 7px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                {counts[g.id]}
              </span>
            </button>
          );
        })}
      </div>

      {sectioned.map(sec => sec.items.length > 0 && (
        <div key={sec.label}>
          <div className="list-section">
            <div className="list-section-head">{sec.label}</div>
          </div>
          <div className="ios-list" style={{ margin: '0 14px' }}>
            {sec.items.map((p, i) => (
              <div key={i} className="ios-list-row" onClick={() => alert(p.name)}>
                <div className="ico-square" style={{ background: p.color, fontSize: 12 }}>{p.initials}</div>
                <div className="left">
                  <div className="title" style={{ display:'flex', alignItems:'center', gap: 6 }}>
                    {p.name}
                    {p.verified && (
                      <svg width="13" height="13" viewBox="0 0 24 24">
                        <path fill="var(--blue)" d="M12 2l2.4 2.4 3.3-.4.4 3.3L20.5 9.6 19 12l1.5 2.4-2.4 1.7-.4 3.3-3.3-.4L12 21.5l-2.4-1.5-3.3.4-.4-3.3L3.5 14.4 5 12 3.5 9.6l2.4-1.7.4-3.3 3.3.4z"/>
                        <path fill="white" d="M10.4 14.2L7.8 11.6l1-1 1.6 1.6 4.8-4.7 1 1z"/>
                      </svg>
                    )}
                  </div>
                  <div className="sub">{p.relation}</div>
                </div>
                <div className="right">
                  <button className="icon-btn" onClick={(e) => { e.stopPropagation(); alert('Chat with ' + p.name); }}>
                    <ChatI size={18}/>
                  </button>
                  <ChevronR size={16}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ padding:'24px 14px' }}>
        <button className="btn secondary" onClick={() => alert('Invite a contact')}>
          <PlusI size={16}/> Add someone to your people
        </button>
      </div>
    </PushScreen>
  );
}

// ── Subscriptions ─────────────────────────────────────────────────────────────
export function SubscriptionsScreen() {
  const app = useApp();
  const monthlyTotal = SUBSCRIPTIONS.reduce((sum, s) => {
    const n = parseFloat(s.cost.replace(/[^0-9.]/g, ''));
    if (s.cycle === 'monthly')   return sum + n;
    if (s.cycle === 'quarterly') return sum + n / 3;
    if (s.cycle === 'yearly')    return sum + n / 12;
    return sum;
  }, 0);

  const grouped: Record<string, typeof SUBSCRIPTIONS> = {};
  SUBSCRIPTIONS.forEach(s => { (grouped[s.category] = grouped[s.category] || []).push(s); });

  return (
    <PushScreen title="Subscriptions" onBack={() => app.popScreen()}
               rightAction={<button className="icon-btn"><PlusI size={18}/></button>}>
      <div style={{ padding:'14px 14px 18px' }}>
        <div className="rewards-card" style={{ margin: 0, background:'linear-gradient(135deg, #2A6CFF, #5856D6)' }}>
          <div className="label">Monthly spend</div>
          <div className="balance">${monthlyTotal.toFixed(0)}</div>
          <div className="balance-sub">{SUBSCRIPTIONS.length} active subscriptions · 1 overdue</div>
        </div>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <div className="list-section">
            <div className="list-section-head">{cat}</div>
          </div>
          <div className="ios-list" style={{ margin: '0 14px' }}>
            {items.map((s, i) => (
              <div key={i} className="ios-list-row">
                <div className="ico-square" style={{ background: s.color, fontSize: 12, fontWeight: 800 }}>{s.initials}</div>
                <div className="left">
                  <div className="title">{s.name}</div>
                  <div className="sub">{s.cost} · {s.cycle} · next {s.next}</div>
                </div>
                <div className="right">
                  {s.overdue
                    ? <span className="pill-high">Overdue</span>
                    : <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:999, background:'var(--green-soft)', color:'#1F9D43' }}>Active</span>}
                  <ChevronR size={16}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ padding:'24px 14px', display:'flex', flexDirection:'column', gap: 8 }}>
        <button className="btn primary"><PlusI size={16}/> Add a subscription</button>
        <button className="btn secondary">Scan for unused subscriptions</button>
      </div>
    </PushScreen>
  );
}

// ── Finance ───────────────────────────────────────────────────────────────────
export function FinanceScreen() {
  const app = useApp();
  const banks   = FINANCE_ACCOUNTS.filter(a => a.kind === 'Bank');
  const cards   = FINANCE_ACCOUNTS.filter(a => a.kind === 'Card');
  const wallets = FINANCE_ACCOUNTS.filter(a => a.kind === 'Wallet');

  const totalCash = banks.reduce((n, a) => n + parseFloat(a.balance.replace(/[^0-9.]/g, '')), 0);
  const totalDebt = cards.reduce((n, a) => n + parseFloat(a.balance.replace(/[^0-9.]/g, '')) * (a.balance.includes('-') ? -1 : 1), 0);

  return (
    <PushScreen title="Finance" onBack={() => app.popScreen()}
               rightAction={<button className="icon-btn"><PlusI size={18}/></button>}>
      <div style={{ padding:'14px 14px 18px' }}>
        <div className="rewards-card" style={{ margin: 0, background:'linear-gradient(135deg, #1F9D43, #34C759)' }}>
          <div className="label">Net worth</div>
          <div className="balance">${(totalCash + totalDebt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="balance-sub">${totalCash.toLocaleString()} cash · ${Math.abs(totalDebt).toLocaleString()} owing</div>
        </div>
      </div>

      <div className="list-section"><div className="list-section-head">Bank accounts</div></div>
      <div className="ios-list" style={{ margin: '0 14px' }}>
        {banks.map((a, i) => (
          <div key={i} className="ios-list-row">
            <div className="ico-square" style={{ background: a.color, color: a.color === '#FFCC00' ? '#000' : '#fff', fontSize: 10, fontWeight: 800 }}>{a.logo}</div>
            <div className="left"><div className="title">{a.name}</div><div className="sub">{a.num}</div></div>
            <div className="right">
              <span className="value" style={{ color:'var(--ink)', fontWeight:700 }}>{a.balance}</span>
              <ChevronR size={16}/>
            </div>
          </div>
        ))}
      </div>

      <div className="list-section"><div className="list-section-head">Cards</div></div>
      <div className="ios-list" style={{ margin: '0 14px' }}>
        {cards.map((a, i) => (
          <div key={i} className="ios-list-row">
            <div className="ico-square" style={{ background: a.color, fontSize: 9, fontWeight: 800 }}>{a.logo}</div>
            <div className="left"><div className="title">{a.name}</div><div className="sub">{a.num}</div></div>
            <div className="right">
              <span className="value" style={{ color: a.balance.includes('-') ? 'var(--red, #FF3B30)' : 'var(--ink)', fontWeight:700 }}>{a.balance}</span>
              <ChevronR size={16}/>
            </div>
          </div>
        ))}
      </div>

      <div className="list-section"><div className="list-section-head">Digital wallets</div></div>
      <div className="ios-list" style={{ margin: '0 14px' }}>
        {wallets.map((a, i) => (
          <div key={i} className="ios-list-row">
            <div className="ico-square" style={{ background: a.color, fontSize: 14 }}>
              <AppleI size={16}/>
            </div>
            <div className="left"><div className="title">{a.name}</div><div className="sub">{a.num}</div></div>
            <div className="right"><ChevronR size={16}/></div>
          </div>
        ))}
      </div>

      <div style={{ padding:'24px 14px', display:'flex', flexDirection:'column', gap: 8 }}>
        <button className="btn primary"><PlusI size={16}/> Link a bank account</button>
        <button className="btn secondary"><PlusI size={16}/> Add a card</button>
      </div>
      <div style={{ padding:'0 18px 24px', textAlign:'center', color:'var(--ink-3)', fontSize:12, lineHeight:1.5 }}>
        Connections are read-only and encrypted end-to-end. We never store your bank password.
      </div>
    </PushScreen>
  );
}

// ── Sharehouse ────────────────────────────────────────────────────────────────
export function SharehouseScreen() {
  const app = useApp();
  const [tab, setTab] = useState<'services' | 'members' | 'settings'>('services');
  const sh = SHAREHOUSE;
  const findMember = (id: string) => sh.members.find(m => m.id === id);

  const monthly = sh.services.reduce((s, x) => {
    if (x.cycle === 'fortnightly') return s + x.cost * 26 / 12;
    if (x.cycle === 'quarterly')   return s + x.cost / 3;
    if (x.cycle === 'yearly')      return s + x.cost / 12;
    return s + x.cost;
  }, 0);
  const myMonthly = sh.services.reduce((s, x) => {
    let m = x.cost;
    if (x.cycle === 'fortnightly') m = x.cost * 26 / 12;
    else if (x.cycle === 'quarterly') m = x.cost / 3;
    else if (x.cycle === 'yearly')    m = x.cost / 12;
    return s + (m * (x.members.me || 0) / 100);
  }, 0);

  return (
    <PushScreen title="Sharehouse" onBack={() => app.popScreen()}
               rightAction={<button className="icon-btn" onClick={() => alert('Add a service')}><PlusI size={18}/></button>}>
      <div className="sharehouse-hero">
        <div>
          <div className="sharehouse-hero-name">{sh.name}</div>
          <div className="sharehouse-hero-sub">{sh.sub}</div>
        </div>
        <div className="sharehouse-hero-totals">
          <div>
            <span className="hero-total-val">${monthly.toFixed(0)}</span>
            <span className="hero-total-lbl">Total / mo</span>
          </div>
          <div>
            <span className="hero-total-val" style={{ color: 'white' }}>${myMonthly.toFixed(0)}</span>
            <span className="hero-total-lbl">Your share</span>
          </div>
        </div>
      </div>

      <div style={{ padding:'14px 14px 6px' }}>
        <div className="segmented">
          <button className={`seg-item ${tab === 'services' ? 'active' : ''}`} onClick={() => setTab('services')}>Services</button>
          <button className={`seg-item ${tab === 'members' ? 'active' : ''}`} onClick={() => setTab('members')}>Housemates</button>
          <button className={`seg-item ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>Settings</button>
        </div>
      </div>

      {tab === 'services' && (
        <>
          <div className="list-section">
            <div className="list-section-head">Shared services · {sh.services.length}</div>
          </div>
          {sh.services.map(svc => {
            const payer = findMember(svc.payer);
            const splitLabel = svc.split === 'even' ? 'Split evenly' : svc.split === 'percent' ? 'Split by %' : 'Custom split';
            return (
              <div key={svc.id} className="sh-service" onClick={() => alert('Edit ' + svc.name)}>
                <div className="sh-service-head">
                  <div className="sh-emoji-small">{svc.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="sh-service-name">{svc.name}</div>
                    <div className="sh-service-sub">{svc.vendor} · {svc.cycle} · {splitLabel}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div className="sh-service-cost">${svc.cost.toFixed(2)}</div>
                    <div className="sh-service-due">Next {svc.nextDate}</div>
                  </div>
                </div>
                <div className="sh-split-bar">
                  {sh.members.map(m => {
                    const pct = svc.members[m.id as keyof typeof svc.members] || 0;
                    if (!pct) return null;
                    return <div key={m.id} className="sh-split-seg" style={{ background: m.color, width: pct + '%' }} title={`${m.name} · ${pct}%`}/>;
                  })}
                </div>
                <div className="sh-split-detail">
                  {sh.members.map(m => {
                    const pct = svc.members[m.id as keyof typeof svc.members] || 0;
                    if (!pct) return null;
                    return (
                      <span key={m.id} className="sh-chip">
                        <span className="sh-chip-dot" style={{ background: m.color }}/>
                        {m.isMe ? 'You' : m.name.split(' ')[0]}
                        <b>${(svc.cost * pct / 100).toFixed(2)}</b>
                      </span>
                    );
                  })}
                </div>
                <div className="sh-pay-row">
                  {payer && <span className="sh-pay-by">Paid by <b>{payer.isMe ? 'you' : payer.name.split(' ')[0]}</b> · others reimburse</span>}
                  <span className="spacer"/>
                  <button className="sh-pay-btn" onClick={(e) => {
                    e.stopPropagation();
                    const myPct = svc.members[('me' as keyof typeof svc.members)] || 0;
                    app.openSheet('pay', { event: { org: svc.vendor, amount: svc.cost * myPct / 100, title: svc.name } });
                  }}>
                    Pay your share
                  </button>
                </div>
              </div>
            );
          })}
          <div style={{ padding:'18px 14px 8px' }}>
            <button className="btn primary" onClick={() => alert('Browse Services to add to sharehouse')}>
              <PlusI size={16}/> Add a service
            </button>
          </div>
        </>
      )}

      {tab === 'members' && (
        <>
          <div className="list-section">
            <div className="list-section-head">Housemates · {sh.members.length}</div>
          </div>
          <div className="ios-list" style={{ margin: '0 14px' }}>
            {sh.members.map(m => (
              <div key={m.id} className="ios-list-row">
                <div className="ico-square" style={{ background: m.color, fontSize: 12 }}>{m.initials}</div>
                <div className="left">
                  <div className="title">{m.name}{m.isMe ? ' (you)' : ''}</div>
                  <div className="sub">Default share · {m.share}%</div>
                </div>
                <div className="right">
                  <span className="value" style={{ fontWeight:700, color: 'var(--ink)' }}>{m.paid}</span>
                  <span style={{ fontSize:11, color:'var(--ink-3)' }}>this month</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:'18px 14px 8px' }}>
            <button className="btn secondary" onClick={() => alert('Invite a housemate')}>
              <PlusI size={16}/> Invite a housemate
            </button>
          </div>
        </>
      )}

      {tab === 'settings' && (
        <>
          <div className="list-section">
            <div className="list-section-head">Property</div>
            <div className="ios-list" style={{ margin: '0 14px' }}>
              <ListRow title="Address" value={sh.name}/>
              <ListRow title="Sharehouse name" value="Coral Ave Crew"/>
              <ListRow title="Move-in date" value="Jan 2025"/>
            </div>
          </div>
          <div className="list-section">
            <div className="list-section-head">Defaults</div>
            <div className="ios-list" style={{ margin: '0 14px' }}>
              <ListRow title="Default split" value="Evenly"/>
              <ListRow title="Bill reminders" value="3 days before"/>
              <ListRow title="Reimburse via" value="Auto-debit"/>
              <ListRow title="Currency" value="AUD"/>
            </div>
          </div>
          <div className="list-section">
            <div className="list-section-head">Privacy</div>
            <div className="toggle-row" style={{ margin: '0 14px 8px' }}>
              <div className="left">
                <div className="title">Show personal balances</div>
                <div className="sub">Housemates can see what each person owes</div>
              </div>
              <Switch value={true} onChange={() => {}}/>
            </div>
            <div className="toggle-row" style={{ margin: '0 14px 8px' }}>
              <div className="left">
                <div className="title">Allow housemates to add services</div>
                <div className="sub">Otherwise only the head tenant can add</div>
              </div>
              <Switch value={true} onChange={() => {}}/>
            </div>
            <div className="toggle-row" style={{ margin: '0 14px 8px' }}>
              <div className="left">
                <div className="title">Auto-settle weekly</div>
                <div className="sub">Net out everyone&apos;s balances every Sunday</div>
              </div>
              <Switch value={false} onChange={() => {}}/>
            </div>
          </div>
          <div style={{ padding:'18px 14px 30px', textAlign:'center' }}>
            <button className="btn secondary" style={{ color:'var(--red, #FF3B30)', borderColor:'var(--line)' }}
                    onClick={() => alert('Leave sharehouse?')}>
              Leave sharehouse
            </button>
          </div>
        </>
      )}
      <div style={{ height: 14 }}/>
    </PushScreen>
  );
}
