'use client';
import { useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import { useApp } from './context';
import { CIRCLES, CHATS, PROPERTIES } from './data';
import {
  AppTopBar, Sheet, PushScreen, StatusSpacer, Switch,
} from './primitives';
import {
  Sparkle, ClockI, CardI, SearchI, MicI, PlusI, ChevronR, ChevronL,
  CheckI, HeartI, CommentI, ShareI, BookmarkI, MoreI, SunI,
} from './icons';

// ── HOME ─────────────────────────────────────────────────────────────────────
interface CalEvent {
  id: string;
  time?: string;
  title: string;
  sub?: string;
  icon?: string;
  loc?: string;
  org?: string;
  desc?: string;
  amount?: number;
  action?: 'pay' | 'sign';
}

export function HomeScreen() {
  const app = useApp();
  const family = app.family;

  const events: CalEvent[] = [
    { id: 'e1', time: '9:00 AM',  title: 'Board Meeting', sub: 'for Tim',         icon: 'clock', loc: 'Conference Room A',         org: 'Workplace',                  desc: 'Quarterly board review of strategic plan and finances.' },
    { id: 'e2', time: '5:00 PM',  title: 'Ballet',        sub: `for ${family.kids[0].name.split(' ')[0]}`, icon: 'clock', loc: 'Bayside Ballet Academy', org: 'Bayside Ballet Academy', desc: 'Tuesday class. Bring leotard + water.' },
    { id: 'e3', title: 'Scouts fees due today',         icon: 'card',  org: '1st Bayside Scout Group', amount: 145, action: 'pay'  },
    { id: 'e4', title: 'School excursion permission slip', icon: 'clock', org: 'Bayside Primary School', action: 'sign' },
  ];

  const openEvent = (ev: CalEvent) => {
    if (ev.action === 'pay')  return app.openSheet('pay',  { event: ev });
    if (ev.action === 'sign') return app.openSheet('sign', { event: ev });
    app.pushScreen('event-detail', { event: ev });
  };

  const now = new Date();
  const day  = now.toLocaleDateString('en-US', { weekday: 'long' });
  const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const year = now.getFullYear();

  return (
    <>
      <AppTopBar />
      <div className="screen-body">
        <section className="hero">
          <div className="hero-photo">
            <div className="hero-sunset" aria-hidden="true">
              <div className="sun" />
              <div className="reflection" />
              <div className="silhouette" />
            </div>
            <div className="hero-vignette" />
          </div>

          <div className="hero-inner">
            <header className="hero-head">
              <div>
                <div className="hero-day">{day}</div>
                <h1 className="hero-date">{date}</h1>
                <div className="hero-year">{year}</div>
              </div>
              <div className="weather-pill"><SunI size={18}/><span>27°</span></div>
            </header>

            <div className="hero-events">
              {events.map(ev => (
                <button key={ev.id} className="event-row" onClick={() => openEvent(ev)}>
                  <div className="event-icon">
                    {ev.icon === 'card' ? <CardI size={20}/> : <ClockI size={20}/>}
                  </div>
                  <div className="event-text">
                    {ev.time && <div className="event-time">{ev.time}</div>}
                    <div className="event-title">
                      <span className="event-title-strong">{ev.title}</span>
                      {ev.sub && <span className="event-title-weak"> {ev.sub}</span>}
                    </div>
                  </div>
                  {ev.action === 'pay' && (
                    <span className={`event-cta ${app.paid ? 'done' : ''}`}>
                      {app.paid ? 'Paid ✓' : 'Pay Now'}
                    </span>
                  )}
                  {ev.action === 'sign' && (
                    <span className={`event-cta ${app.signed ? 'done' : ''}`}>
                      {app.signed ? 'Signed ✓' : 'Sign'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        <BrainDumpCard />
        <HomeTodos />
      </div>
    </>
  );
}

function BrainDumpCard() {
  const [val, setVal] = useState('');
  const [listening, setListening] = useState(false);
  const [chips, setChips] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!val.trim()) return;
    setChips(c => [...c, val.trim()]);
    setVal('');
    inputRef.current?.focus();
  };

  return (
    <section className="card brain">
      <header className="card-head">
        <div className="card-head-title">
          <Sparkle size={20} color="oklch(0.55 0.25 var(--accent-hue))"/>
          <span>AI Brain Dump</span>
        </div>
      </header>
      <div className="brain-input-row">
        <input ref={inputRef} className="brain-input"
               placeholder="What's on your mind?"
               value={val} onChange={e => setVal(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && submit()}/>
        <button className={`mic-btn ${listening ? 'on' : ''}`}
                onClick={() => { setListening(l => !l); setTimeout(() => setListening(false), 1500); }}
                aria-label="Voice input">
          <MicI size={18}/>
        </button>
      </div>
      {chips.length > 0 && (
        <div className="brain-chips">
          {chips.map((c, i) => (
            <span className="brain-chip" key={i}>
              <Sparkle size={11} color="oklch(0.55 0.25 var(--accent-hue))"/>
              {c}
            </span>
          ))}
        </div>
      )}
      <p className="brain-hint">Speak or type. AI sorts it into events, lists, and reminders for you.</p>
    </section>
  );
}

function HomeTodos() {
  const app = useApp();
  const todos = app.todos.home;
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (adding) inputRef.current?.focus(); }, [adding]);

  const commit = () => {
    if (draft.trim()) app.addTodo('home', draft.trim());
    setDraft(''); setAdding(false);
  };

  return (
    <section className="card">
      <header className="card-head">
        <div className="card-head-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="var(--blue)" strokeWidth="1.8"/>
            <path d="M9 12l2 2 4-4" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>To-Do List</span>
        </div>
        <button className="add-btn" onClick={() => app.setTab('productivity')}>
          See all <ChevronR size={14}/>
        </button>
      </header>
      <ul className="todo-list">
        {todos.slice(0, 5).map(t => (
          <li key={t.id} className={`todo-item ${t.done ? 'done' : ''}`}>
            <button className={`checkbox ${t.done ? 'checked' : ''}`} onClick={() => app.toggleTodo('home', t.id)}>
              {t.done && <CheckI size={12}/>}
            </button>
            <span className="todo-text">{t.text}</span>
            {t.priority === 'high' && !t.done && <span className="pill-high">High</span>}
          </li>
        ))}
        {adding && (
          <li className="todo-item">
            <span className="checkbox"/>
            <input ref={inputRef} className="todo-new-input"
                   value={draft} onChange={e => setDraft(e.target.value)}
                   onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setAdding(false); setDraft(''); } }}
                   onBlur={commit}
                   placeholder="New task…"/>
          </li>
        )}
        {!adding && (
          <li className="todo-item" style={{ borderStyle: 'dashed', cursor: 'pointer' }} onClick={() => setAdding(true)}>
            <span className="checkbox"><PlusI size={14}/></span>
            <span className="todo-text" style={{ color: 'var(--ink-3)' }}>Add task</span>
          </li>
        )}
      </ul>
    </section>
  );
}

// ── BOARD ─────────────────────────────────────────────────────────────────────
const FEED_STORIES = [
  { name: 'Your story',     hue: 0,    self: true },
  { name: 'Bayside Scouts', hue: 5  },
  { name: 'Ballet Academy', hue: 340 },
  { name: 'Bayside Primary',hue: 220 },
  { name: 'Chess Club',     hue: 30  },
  { name: 'North Suns FC',  hue: 50  },
  { name: "St Andrew's",    hue: 280 },
];

interface FeedPostData {
  id: string;
  org: string;
  initials: string;
  hue: number;
  verified: boolean;
  age: string;
  ad?: boolean;
  img: string;
  likes: number;
  caption: ReactNode;
  comments: number;
}

const FEED_POSTS: FeedPostData[] = [
  {
    id: 'p1',
    org: '1st Bayside Scout Group',
    initials: '1B',
    hue: 5,
    verified: true,
    age: '2h',
    img: 'linear-gradient(135deg, #3D5A3E 0%, #6B8E5C 50%, #2C4A3F 100%)',
    likes: 47,
    caption: <><b>1st Bayside Scout Group</b> 🏕️ This weekend&apos;s bushwalk was incredible! Big shout-out to our Cubs for completing the 4km loop. Permission slips for the winter camp are now live in the app.</>,
    comments: 12,
  },
  {
    id: 'ad1',
    org: 'Life Services',
    initials: 'LS',
    hue: 240,
    verified: true,
    age: 'Sponsored',
    ad: true,
    img: 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)',
    likes: 0,
    caption: <><b>Life Services</b> · Need a babysitter for tonight? Vetted local sitters in Bayside, available in 30 minutes. <span style={{ color:'var(--blue)' }}>Learn more</span></>,
    comments: 0,
  },
  {
    id: 'p2',
    org: 'Bayside Ballet Academy',
    initials: 'BB',
    hue: 340,
    verified: true,
    age: '5h',
    img: 'linear-gradient(135deg, #FCE7F3 0%, #F9A8D4 50%, #BE185D 100%)',
    likes: 89,
    caption: <><b>Bayside Ballet Academy</b> 🩰 Recital tickets are open! Saturday 14 June, 7pm. Tap below to RSVP and pre-purchase tickets in the app.</>,
    comments: 23,
  },
  {
    id: 'p3',
    org: 'Bayside Primary School',
    initials: 'BP',
    hue: 220,
    verified: true,
    age: '1d',
    img: 'linear-gradient(135deg, #BAE6FD 0%, #60A5FA 50%, #1E3A8A 100%)',
    likes: 156,
    caption: <><b>Bayside Primary</b> 📚 Year 6 excursion to the Maritime Museum is on next Wednesday. Please sign the permission slip in your inbox by Friday.</>,
    comments: 8,
  },
  {
    id: 'ad2',
    org: 'Life Services',
    initials: 'LS',
    hue: 160,
    verified: true,
    age: 'Sponsored',
    ad: true,
    img: 'linear-gradient(135deg, #ECFDF5 0%, #6EE7B7 50%, #047857 100%)',
    likes: 0,
    caption: <><b>Life Services</b> · School holiday tutoring · Local certified maths tutors, $45/session. Save 15% as a Life member.</>,
    comments: 0,
  },
];

export function BoardScreen() {
  const [view, setView] = useState<'posts' | 'chats'>('posts');
  const unreadChats = CHATS.reduce((n, c) => n + c.unread, 0);

  return (
    <>
      <AppTopBar/>
      <div className="large-title" style={{ display:'flex', alignItems:'center', gap:8 }}>
        Board
        {view === 'chats' && unreadChats > 0 && (
          <span style={{ background:'var(--blue)', color:'white', fontSize:12, fontWeight:700, padding:'2px 8px', borderRadius:999 }}>
            {unreadChats}
          </span>
        )}
      </div>

      <div style={{ padding:'0 14px 10px' }}>
        <div className="search-field" style={{ margin: 0 }}>
          <SearchI size={16}/>
          <input placeholder={view === 'posts' ? 'Search posts and people' : 'Search messages'}/>
        </div>
      </div>

      <div style={{ padding:'0 14px 10px' }}>
        <div className="segmented">
          <button className={`seg-item ${view === 'posts' ? 'active' : ''}`} onClick={() => setView('posts')}>Posts</button>
          <button className={`seg-item ${view === 'chats' ? 'active' : ''}`} onClick={() => setView('chats')}>
            Chats {unreadChats > 0 && <span style={{ background:'var(--blue)', color:'white', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:999, marginLeft: 4 }}>{unreadChats}</span>}
          </button>
        </div>
      </div>

      {view === 'posts' ? <PostsView/> : <ChatsView/>}
    </>
  );
}

function PostsView() {
  return (
    <>
      <div className="feed-stories">
        {FEED_STORIES.map((s, i) => (
          <button key={i} className="story">
            <div className={`story-avatar ${i > 2 ? 'seen' : ''}`}>
              <div>
                <div className="placeholder-img"
                     style={{ background: `linear-gradient(135deg, oklch(0.75 0.15 ${s.hue}), oklch(0.5 0.2 ${s.hue + 30}))` }}/>
              </div>
            </div>
            <div className="story-name">{s.name}</div>
          </button>
        ))}
      </div>

      {FEED_POSTS.map(p => <FeedPost key={p.id} post={p}/>)}
      <div style={{ height: 24 }}/>
    </>
  );
}

function ChatsView() {
  const app = useApp();
  const pinned = CHATS.filter(c => c.pinned);
  const family = CHATS.filter(c => !c.pinned && c.isFamily);
  const orgs   = CHATS.filter(c => !c.pinned && c.isOrg);
  const groups = CHATS.filter(c => !c.pinned && !c.isFamily && !c.isOrg);

  const openThread = (chat: typeof CHATS[0]) => app.pushScreen('chat-thread', { chat });

  const Section = ({ title, rows }: { title: string; rows: typeof CHATS }) => rows.length === 0 ? null : (
    <>
      <div className="list-section" style={{ marginTop: 14 }}>
        <div className="list-section-head">{title}</div>
      </div>
      {rows.map(c => (
        <button key={c.id} className="chat-list-row"
                style={{ textAlign:'left', width:'100%', border:0, background:'var(--surface)', borderRadius: 0,
                         marginLeft: 14, borderBottom: '1px solid var(--line-soft)' }}
                onClick={() => openThread(c)}>
          <div style={{ position: 'relative' }}>
            <div className="chat-avatar" style={{ background: c.color }}>{c.initials}</div>
            {c.online && (
              <span style={{ position:'absolute', bottom:0, right:0, width:13, height:13,
                             borderRadius:'50%', background:'var(--green)', border:'2px solid var(--surface)' }}/>
            )}
          </div>
          <div className="chat-meta">
            <div className="chat-name">
              {c.name}
              {c.isOrg && <span style={{ fontSize:10, color:'var(--blue)', fontWeight:600, padding:'1px 5px', background:'var(--blue-soft)', borderRadius:4, marginLeft:4 }}>ORG</span>}
              {c.members && <span style={{ fontSize:11, color:'var(--ink-3)', fontWeight:400, marginLeft:4 }}>· {c.members}</span>}
            </div>
            <div className="chat-preview">{c.last}</div>
          </div>
          <div className="chat-r-meta">
            <div className="chat-time">{c.time}</div>
            {c.unread > 0
              ? <div className="chat-badge">{c.unread}</div>
              : <div style={{ width: 18, height: 14 }}>
                  <svg width="18" height="14" viewBox="0 0 24 16" fill="none">
                    <path d="M2 8l5 5L17 3M9 13l4 4 9-9" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>}
          </div>
        </button>
      ))}
    </>
  );

  return (
    <>
      <div className="feed-stories" style={{ paddingBottom: 6 }}>
        {CHATS.filter(c => c.online).map((c, i) => (
          <button key={i} className="story" onClick={() => openThread(c)}>
            <div style={{ position: 'relative' }}>
              <div className="story-avatar seen">
                <div>
                  <div className="placeholder-img" style={{ background: c.color, display:'grid', placeItems:'center', color:'white', fontWeight:700, fontSize:18 }}>
                    {c.initials}
                  </div>
                </div>
              </div>
              <span style={{ position:'absolute', bottom:2, right:2, width:14, height:14,
                             borderRadius:'50%', background:'var(--green)', border:'2.5px solid var(--surface)' }}/>
            </div>
            <div className="story-name">{c.name.split(' ')[0]}</div>
          </button>
        ))}
        <button className="story" onClick={() => alert('New chat — pick a contact')}>
          <div className="story-avatar seen">
            <div>
              <div className="placeholder-img" style={{ background:'var(--surface-2)', display:'grid', placeItems:'center', color:'var(--ink-3)' }}>
                <PlusI size={22}/>
              </div>
            </div>
          </div>
          <div className="story-name">New</div>
        </button>
      </div>

      <Section title="Pinned" rows={pinned}/>
      <Section title="Family" rows={family}/>
      <Section title="Organisations" rows={orgs}/>
      <Section title="Groups" rows={groups}/>

      <div style={{ height: 24 }}/>
    </>
  );
}

function FeedPost({ post }: { post: FeedPostData }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const tap = () => {
    setLiked(l => {
      const nl = !l;
      setLikes(c => c + (nl ? 1 : -1));
      return nl;
    });
  };
  return (
    <article className="post" style={{ '--story-hue': post.hue } as React.CSSProperties}>
      <header className="post-head">
        <div className="post-avatar" style={{ '--story-hue': post.hue } as React.CSSProperties}>{post.initials}</div>
        <div className="post-author-row">
          <div className="post-author">
            {post.org}
            {post.verified && (
              <svg width="13" height="13" viewBox="0 0 24 24" className="org-badge">
                <path fill="currentColor" d="M12 2l2.4 2.4 3.3-.4.4 3.3L20.5 9.6 19 12l1.5 2.4-2.4 1.7-.4 3.3-3.3-.4L12 21.5l-2.4-1.5-3.3.4-.4-3.3L3.5 14.4 5 12 3.5 9.6l2.4-1.7.4-3.3 3.3.4z"/>
                <path fill="white" d="M10.4 14.2L7.8 11.6l1-1 1.6 1.6 4.8-4.7 1 1z"/>
              </svg>
            )}
          </div>
          <div className="post-sub">{post.ad ? <span className="ad-label">AD</span> : post.age}</div>
        </div>
        <button className="icon-btn"><MoreI size={18}/></button>
      </header>
      <div className="post-img" style={{ background: post.img }} onDoubleClick={tap}/>
      <div className="post-actions">
        <button className={`post-action ${liked ? 'liked' : ''}`} onClick={tap}>
          <HeartI size={24} fill={liked ? 'currentColor' : 'none'}/>
        </button>
        <button className="post-action"><CommentI size={22}/></button>
        <button className="post-action"><ShareI size={22}/></button>
        <div className="spacer"/>
        <button className="post-action" onClick={() => setSaved(s => !s)}>
          <BookmarkI size={22} fill={saved ? 'currentColor' : 'none'}/>
        </button>
      </div>
      {!post.ad && (
        <div className="post-body">
          <div className="post-likes">{likes.toLocaleString()} likes</div>
          <div className="post-caption">{post.caption}</div>
          {post.comments > 0 && <div className="post-comments">View all {post.comments} comments</div>}
        </div>
      )}
      {post.ad && (
        <div className="post-body">
          <div className="post-caption">{post.caption}</div>
          <button className="btn primary" style={{ marginTop: 10, padding: '10px 14px', fontSize: 14 }}>Learn more</button>
        </div>
      )}
    </article>
  );
}

// ── SHOP ──────────────────────────────────────────────────────────────────────
const SHOP_CATS = ['My Circles', 'Food & Drink', 'Retail', 'Health', 'Beauty', 'Auto', 'Home'];
const BUSINESSES = [
  { id:'b1',  name:'Coral Café',            cat:'Food & Drink', emoji:'☕️', tag:'Local roastery',       rating:4.8, dist:'0.4 km',  badge:'15% off',   color:'#8B5E3C' },
  { id:'b2',  name:'Bayside Books',         cat:'Retail',       emoji:'📚', tag:'Independent bookshop', rating:4.9, dist:'0.6 km',  badge:'New',        color:'#0A84FF' },
  { id:'b3',  name:'Sparkle Home Clean',    cat:'Home',         emoji:'🧹', tag:'House cleaning',       rating:4.7, dist:'In-area', badge:'Vetted',     color:'#34C759' },
  { id:'b4',  name:'Bayside Bike Co.',      cat:'Retail',       emoji:'🚲', tag:'Sales & servicing',    rating:4.6, dist:'1.2 km',  badge:'',           color:'#FF9F0A' },
  { id:'b5',  name:'Dr Susan Liu Clinic',   cat:'Health',       emoji:'🩺', tag:'GP · Family practice', rating:4.9, dist:'0.8 km',  badge:'Accepting',  color:'#FF3B30' },
  { id:'b6',  name:'The Hair Den',          cat:'Beauty',       emoji:'💇', tag:'Hair · 12 stylists',   rating:4.7, dist:'0.5 km',  badge:'',           color:'#FF2D55' },
  { id:'b7',  name:'Coastal Tyres & Auto',  cat:'Auto',         emoji:'🔧', tag:'Mechanic · Tyres',     rating:4.5, dist:'2.1 km',  badge:'Open',       color:'#5856D6' },
  { id:'b8',  name:'GreenThumb Gardens',    cat:'Home',         emoji:'🌿', tag:'Mowing & landscaping', rating:4.8, dist:'In-area', badge:'',           color:'#16A34A' },
  { id:'b9',  name:'Salt & Sand Bakery',    cat:'Food & Drink', emoji:'🥖', tag:'Sourdough · pastries', rating:4.9, dist:'0.3 km',  badge:'',           color:'#D97706' },
  { id:'b10', name:'Bayside Pharmacy',      cat:'Health',       emoji:'💊', tag:'Pharmacy · 7 days',    rating:4.6, dist:'0.4 km',  badge:'',           color:'#0EA5E9' },
  { id:'b11', name:'Coral Pet Hospital',    cat:'Health',       emoji:'🐾', tag:'24hr vet care',        rating:4.9, dist:'1.4 km',  badge:'24/7',       color:'#AF52DE' },
  { id:'b12', name:'Sunday Roast Co.',      cat:'Food & Drink', emoji:'🍗', tag:'Family meal delivery', rating:4.7, dist:'Delivery',badge:'New',        color:'#B91C1C' },
];

function getMyCircleListings() {
  const out: { id: string; name: string; cat: string; tag: string; badge: string; rating: number; dist: string; color: string; initials: string; isCircle: boolean }[] = [];
  CIRCLES.forEach(cat => {
    cat.items.forEach((o) => out.push({
      id: 'circle-' + o.name,
      name: o.name,
      cat: 'My Circles',
      tag: o.role,
      badge: cat.cat,
      rating: 4.8,
      dist: 'Joined',
      color: o.color,
      initials: o.initials,
      isCircle: true,
    }));
  });
  return out;
}

export function ShopScreen() {
  const [cat, setCat] = useState('My Circles');
  const myCircles = useMemo(() => getMyCircleListings(), []);
  const list = cat === 'My Circles' ? myCircles : BUSINESSES.filter(b => b.cat === cat);

  return (
    <>
      <AppTopBar/>
      <div className="large-title">Shop</div>
      <div className="large-title-sub">Local businesses, vetted and recommended.</div>

      <div className="search-field" style={{ marginBottom: 12 }}>
        <SearchI size={16}/>
        <input placeholder="Search businesses, schools, churches…"/>
      </div>

      <div style={{ display:'flex', gap:8, overflowX:'auto', padding:'0 14px 14px', scrollbarWidth:'none' }}>
        {SHOP_CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
                  style={{
                    padding:'8px 14px', borderRadius: 999,
                    background: cat === c ? 'var(--ink)' : 'var(--surface)',
                    color: cat === c ? 'var(--bg-elev)' : 'var(--ink-2)',
                    border: cat === c ? 'none' : '1px solid var(--line)',
                    fontSize: 13, fontWeight: 600,
                    flexShrink: 0, whiteSpace:'nowrap',
                  }}>{c}</button>
        ))}
      </div>

      <div className="list-section" style={{ marginTop: 0 }}>
        <div className="list-section-head">{cat} · {list.length}</div>
      </div>

      <div className="biz-grid">
        {list.map(b => (
          <button key={b.id} className="biz-tile">
            <div className="biz-tile-art" style={{ background: `linear-gradient(135deg, ${b.color}, ${b.color}cc)` }}>
              {'emoji' in b && <span className="biz-tile-emoji">{(b as typeof BUSINESSES[0]).emoji}</span>}
              {'isCircle' in b && b.isCircle && <span className="biz-tile-emoji" style={{ fontSize: 28, fontWeight: 800, color:'white' }}>{(b as ReturnType<typeof getMyCircleListings>[0]).initials}</span>}
              {b.badge && <span className="biz-tile-badge">{b.badge}</span>}
            </div>
            <div className="biz-tile-body">
              <div className="biz-tile-name">{b.name}</div>
              <div className="biz-tile-tag">{b.tag}</div>
              <div className="biz-tile-meta">
                <span className="biz-rating">★ {b.rating}</span>
                <span>·</span>
                <span>{b.dist}</span>
              </div>
            </div>
          </button>
        ))}
        {list.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding:'24px', textAlign:'center', color:'var(--ink-3)', fontSize: 14 }}>
            Nothing here yet.
          </div>
        )}
      </div>

      <div style={{ height: 24 }}/>
    </>
  );
}

// ── SERVICES ──────────────────────────────────────────────────────────────────
const BROWSE_SERVICES = [
  { title:'Babysitting',         sub:'Vetted local sitters · from $25/hr',     icon:'👶', color:'#FF2D55' },
  { title:'Tutoring',            sub:'Maths, English, music · $45/session',     icon:'📐', color:'#5856D6' },
  { title:'Tradies',             sub:'Plumbers, electricians, handymen',         icon:'🔧', color:'#FF9F0A' },
  { title:'Cleaning',            sub:'Home cleaning from $90/visit',             icon:'🧹', color:'#34C759' },
  { title:'School-run carpool',  sub:'Share rides with families in your circle', icon:'🚗', color:'#0A84FF' },
  { title:'Pet care',            sub:'Walking, sitting, vet visits',             icon:'🐶', color:'#AF52DE' },
  { title:'Lawn & garden',       sub:'Weekly mow & maintenance',                 icon:'🌿', color:'#65A30D' },
  { title:'Health & wellness',   sub:'GPs, dentists, physios accepting members', icon:'🩺', color:'#FF3B30' },
];

function pillStyle(active: boolean, color: string): React.CSSProperties {
  return {
    padding:'8px 14px', borderRadius: 999,
    background: active ? color : 'var(--surface)',
    color: active ? 'white' : 'var(--ink-2)',
    border: active ? '1px solid transparent' : '1px solid var(--line)',
    fontSize: 13, fontWeight: 600,
    display:'inline-flex', alignItems:'center', gap: 6,
    flexShrink: 0, whiteSpace:'nowrap',
  };
}
function pillCountStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? 'rgba(255,255,255,0.22)' : 'var(--surface-2)',
    color: active ? 'white' : 'var(--ink-3)',
    padding:'1px 7px', borderRadius: 999, fontSize: 11, fontWeight: 700,
    marginLeft: 2,
  };
}
function iconForKind(kind: string) {
  const m: Record<string, string> = {
    'Cleaning':'🧹','Lawn & garden':'🌿','Internet':'📶','Electricity':'⚡️',
    'Pool service':'🏊','Gas':'🔥','Plumber':'🔧','Babysitting':'👶',
  };
  return m[kind] || '🛠️';
}

export function ServicesScreen() {
  const [propId, setPropId] = useState('all');
  const [view, setView] = useState<'current' | 'browse'>('current');
  const visibleProps = propId === 'all' ? PROPERTIES : PROPERTIES.filter(p => p.id === propId);

  return (
    <>
      <AppTopBar/>
      <div className="large-title">Services</div>
      <div className="large-title-sub">Manage what&apos;s running across your properties.</div>

      <div style={{ display:'flex', gap:8, padding:'0 14px 12px', overflowX:'auto', scrollbarWidth:'none' }}>
        <button onClick={() => setPropId('all')} style={pillStyle(propId === 'all', '#0A84FF')}>
          <span style={{ fontSize: 16 }}>🏘️</span>
          All properties
          <span style={pillCountStyle(propId === 'all')}>{PROPERTIES.reduce((n, p) => n + p.active.length, 0)}</span>
        </button>
        {PROPERTIES.map(p => (
          <button key={p.id} onClick={() => setPropId(p.id)} style={pillStyle(propId === p.id, p.color)}>
            <span style={{ fontSize: 16 }}>{p.icon}</span>
            {p.name}
            <span style={pillCountStyle(propId === p.id)}>{p.active.length}</span>
          </button>
        ))}
        <button onClick={() => alert('Add a property')}
                style={{ ...pillStyle(false, '#000'), borderStyle:'dashed', color:'var(--ink-3)' }}>
          <PlusI size={14}/>
        </button>
      </div>

      <div style={{ padding:'0 14px 14px' }}>
        <div className="segmented">
          <button className={`seg-item ${view === 'current' ? 'active' : ''}`} onClick={() => setView('current')}>Current</button>
          <button className={`seg-item ${view === 'browse' ? 'active' : ''}`} onClick={() => setView('browse')}>Browse</button>
        </div>
      </div>

      {view === 'current' ? (
        <>
          {visibleProps.map(p => (
            <div key={p.id}>
              {propId === 'all' && (
                <div className="list-section">
                  <div className="list-section-head" style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:16 }}>{p.icon}</span>{p.name}
                    <span style={{ color:'var(--ink-4)', textTransform:'none', letterSpacing:0, fontWeight:500 }}>· {p.sub}</span>
                  </div>
                </div>
              )}
              {p.active.map((s, i) => (
                <div key={i} className="service-card" style={{ marginTop: i === 0 ? 4 : 8 }}>
                  <div className="service-icon" style={{ background: p.color, fontSize: 18 }}>
                    {iconForKind(s.kind)}
                  </div>
                  <div className="service-text">
                    <div className="service-title">{s.kind} · <span style={{ color:'var(--ink-3)', fontWeight:500 }}>{s.vendor}</span></div>
                    <div className="service-sub">{s.plan} · {s.cost}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding:'3px 8px', borderRadius: 999,
                                 background: s.status === 'Active' ? 'var(--green-soft)' : 'var(--surface-2)',
                                 color: s.status === 'Active' ? '#1F9D43' : 'var(--ink-3)' }}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          ))}
          <div style={{ height: 8 }}/>
          <div className="list-section">
            <div className="list-section-head">Quick add</div>
          </div>
          <div className="shop-banner" style={{ background:'linear-gradient(135deg, #FF6B6B, #FFA500)' }}>
            <h3>Need someone right now?</h3>
            <p>Emergency babysitter or tradie — most respond in under 15 minutes.</p>
          </div>
        </>
      ) : (
        <>
          <div className="search-field" style={{ marginBottom: 14 }}>
            <SearchI size={16}/>
            <input placeholder="Search services"/>
          </div>
          <div className="list-section" style={{ marginTop: 6 }}>
            <div className="list-section-head">All services</div>
          </div>
          {BROWSE_SERVICES.map((s, i) => (
            <div key={i} className="service-card">
              <div className="service-icon" style={{ background: s.color, fontSize: 22 }}>{s.icon}</div>
              <div className="service-text">
                <div className="service-title">{s.title}</div>
                <div className="service-sub">{s.sub}</div>
              </div>
              <button className="service-cta">Book</button>
            </div>
          ))}
        </>
      )}
      <div style={{ height: 24 }}/>
    </>
  );
}

// ── PRODUCTIVITY ──────────────────────────────────────────────────────────────
export function ProductivityScreen() {
  const [view, setView] = useState<'calendar' | 'lists'>('calendar');
  return (
    <>
      <AppTopBar/>
      <div className="large-title">Productivity</div>
      <div style={{ padding: '0 14px 14px' }}>
        <div className="segmented">
          <button className={`seg-item ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>Calendar</button>
          <button className={`seg-item ${view === 'lists' ? 'active' : ''}`} onClick={() => setView('lists')}>Lists</button>
        </div>
      </div>
      {view === 'calendar' ? <CalendarView/> : <ListsView/>}
    </>
  );
}

const CAL_EVENTS: Record<number, { time: string; title: string; color: string; loc?: string }[]> = {
  21: [{ time:'4:00 PM', title:'Sarah · Maths tutor',  color:'#5856D6' }],
  22: [{ time:'6:00 PM', title:'Family movie night',    color:'#AF52DE' }],
  26: [
    { time:'9:00 AM', title:'Board Meeting',       color:'#0A84FF', loc:'Conference Room A' },
    { time:'4:00 PM', title:'Sarah · Maths tutor', color:'#5856D6' },
    { time:'5:00 PM', title:'Sarah · Ballet',      color:'#FF2D55', loc:'Bayside Ballet Academy' },
    { time:'5:30 PM', title:'Sarah · Chess Club',  color:'#1A1F36' },
    { time:'Today',   title:'Scouts fees due',     color:'#FF9F0A' },
  ],
  27: [{ time:'5:30 PM', title:'Sarah · Chess Club', color:'#1A1F36' }],
  28: [
    { time:'3:30 PM', title:'Sarah · Ballet',  color:'#FF2D55' },
    { time:'7:00 PM', title:'Tim · Scouts AGM',color:'#FF3B30' },
  ],
  29: [{ time:'9:00 AM', title:'Excursion · Maritime Museum', color:'#0A84FF' }],
  30: [{ time:'9:00 AM', title:'Jake · Soccer match',         color:'#FF9F0A', loc:'Bayside Oval' }],
};

function CalendarView() {
  const [selected, setSelected] = useState(26);
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date(2026, 4, 26);
  const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDow = monthDate.getDay();
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const daysInPrev  = new Date(monthDate.getFullYear(), monthDate.getMonth(), 0).getDate();

  const cells: { d: number; muted: boolean }[] = [];
  for (let i = 0; i < firstDow; i++) cells.push({ d: daysInPrev - firstDow + i + 1, muted: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ d, muted: false });
  while (cells.length < 42) cells.push({ d: cells.length - firstDow - daysInMonth + 1, muted: true });

  const isCurMonth = monthOffset === 0;
  const eventsForDay = isCurMonth ? (CAL_EVENTS[selected] || []) : [];

  return (
    <>
      <div className="cal-month">
        <div className="cal-month-head">
          <div className="cal-month-name">{monthName}</div>
          <div className="cal-nav">
            <button onClick={() => setMonthOffset(o => o - 1)}><ChevronL size={18}/></button>
            <button onClick={() => setMonthOffset(o => o + 1)}><ChevronR size={18}/></button>
          </div>
        </div>
        <div className="cal-grid">
          {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} className="cal-dow">{d}</div>)}
          {cells.map((c, i) => {
            const isToday = isCurMonth && !c.muted && c.d === 26;
            const isSel   = isCurMonth && !c.muted && c.d === selected;
            const events  = isCurMonth && !c.muted ? (CAL_EVENTS[c.d] || []) : [];
            return (
              <button key={i}
                      className={`cal-day ${c.muted ? 'muted' : ''} ${isToday ? 'today' : ''} ${isSel && !isToday ? 'selected' : ''}`}
                      onClick={() => !c.muted && isCurMonth && setSelected(c.d)}>
                {c.d}
                <div className="dots">
                  {events.slice(0, 3).map((e, j) => (
                    <span key={j} className="dot" style={{ background: isToday ? 'white' : e.color }}/>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="agenda">
        <div className="agenda-head">
          <div className="agenda-date">
            {isCurMonth ? new Date(2026, 4, selected).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : monthName}
          </div>
          <div className="agenda-sub">{eventsForDay.length} event{eventsForDay.length === 1 ? '' : 's'}</div>
        </div>
        {eventsForDay.length === 0 && (
          <div style={{ textAlign:'center', color:'var(--ink-3)', padding:'24px 0', fontSize:14 }}>
            Nothing scheduled. <span style={{ color:'var(--blue)', fontWeight:600 }}>+ Add event</span>
          </div>
        )}
        {eventsForDay.map((e, i) => (
          <div key={i} className="agenda-item">
            <div className="agenda-time">{e.time}</div>
            <div className="agenda-bar" style={{ background: e.color }}/>
            <div className="agenda-body">
              <div className="agenda-title">{e.title}</div>
              {e.loc && <div className="agenda-loc">{e.loc}</div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 24 }}/>
    </>
  );
}

const LISTS = [
  { id: 'home',     name: 'Home',     icon: '🏠', color: '#0A84FF' },
  { id: 'work',     name: 'Work',     icon: '💼', color: '#5856D6' },
  { id: 'shopping', name: 'Shopping', icon: '🛒', color: '#34C759' },
] as const;

function ListsView() {
  const app = useApp();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (adding) inputRef.current?.focus(); }, [adding]);

  const todos = app.todos[app.activeList];
  const commit = () => {
    if (draft.trim()) app.addTodo(app.activeList, draft.trim());
    setDraft(''); setAdding(false);
  };

  return (
    <>
      <div style={{ display:'flex', gap:8, padding:'0 14px 12px', overflowX:'auto', scrollbarWidth:'none' }}>
        {LISTS.map(l => {
          const active = l.id === app.activeList;
          return (
            <button key={l.id}
                    onClick={() => app.setBy({ activeList: l.id })}
                    style={{
                      padding:'9px 14px', borderRadius: 11,
                      background: active ? l.color : 'var(--surface)',
                      color: active ? 'white' : 'var(--ink-2)',
                      border: active ? 'none' : '1px solid var(--line)',
                      fontSize: 13, fontWeight: 600,
                      display:'flex', alignItems:'center', gap: 6, flexShrink: 0,
                    }}>
              <span style={{ fontSize: 16 }}>{l.icon}</span>
              {l.name}
              <span style={{ opacity: 0.8, fontSize: 12, marginLeft: 4 }}>
                {app.todos[l.id].filter(t => !t.done).length}
              </span>
            </button>
          );
        })}
        <button onClick={() => alert('Coming soon — create custom lists')}
                style={{ padding:'9px 12px', borderRadius: 11, background:'var(--surface)', border:'1px dashed var(--line)', color:'var(--ink-3)', flexShrink: 0 }}>
          <PlusI size={14}/>
        </button>
      </div>

      <div style={{ padding:'0 14px 24px' }}>
        <ul className="todo-list">
          {todos.map(t => (
            <li key={t.id} className={`todo-item ${t.done ? 'done' : ''}`}>
              <button className={`checkbox ${t.done ? 'checked' : ''}`} onClick={() => app.toggleTodo(app.activeList, t.id)}>
                {t.done && <CheckI size={12}/>}
              </button>
              <span className="todo-text">{t.text}</span>
              {t.priority === 'high' && !t.done && <span className="pill-high">High</span>}
            </li>
          ))}
          {adding ? (
            <li className="todo-item">
              <span className="checkbox"/>
              <input ref={inputRef} className="todo-new-input"
                     value={draft} onChange={e => setDraft(e.target.value)}
                     onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setAdding(false); setDraft(''); } }}
                     onBlur={commit} placeholder="New task…"/>
            </li>
          ) : (
            <li className="todo-item" style={{ borderStyle: 'dashed', cursor: 'pointer' }} onClick={() => setAdding(true)}>
              <span className="checkbox"><PlusI size={14}/></span>
              <span className="todo-text" style={{ color: 'var(--ink-3)' }}>Add task</span>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

// ── CIRCLES ───────────────────────────────────────────────────────────────────
export function CirclesScreen() {
  const app = useApp();
  return (
    <>
      <AppTopBar/>
      <div className="large-title">Circles</div>
      <div className="large-title-sub">Organisations your family belongs to.</div>

      <div className="search-field" style={{ marginBottom: 14 }}>
        <SearchI size={16}/>
        <input placeholder="Find a circle to join"/>
      </div>

      {CIRCLES.map(cat => (
        <div key={cat.cat}>
          <div className="list-section">
            <div className="list-section-head">{cat.cat}</div>
          </div>
          {cat.items.map(o => (
            <button key={o.name} className="org-card" style={{ textAlign:'left', width:'auto' }}
                    onClick={() => app.pushScreen('circle-detail', { circle: o, category: cat.cat })}>
              <div className="org-logo" style={{ background: o.color }}>{o.initials}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="org-name">{o.name}</div>
                <div className="org-role">{o.role}</div>
                {o.updates > 0 && (
                  <div className="org-meta">
                    <span className="org-meta-pill" style={{ background:'var(--blue-soft)', color:'var(--blue)', fontWeight:700 }}>
                      {o.updates} new
                    </span>
                  </div>
                )}
              </div>
              <ChevronR size={18} stroke={2} style={{ color: 'var(--ink-4)' }}/>
            </button>
          ))}
        </div>
      ))}
      <div style={{ height: 24 }}/>
    </>
  );
}

// ── ALBUM ─────────────────────────────────────────────────────────────────────
const ALBUM_SECTIONS = [
  { title: 'This week', sub: 'Bayside · 12 photos', tiles: ['v3','v5','v1','v2','v4','v6','v1','v3','v5','v2','v4','v6'] },
  { title: 'May 2026',  sub: '38 photos · 4 videos', tiles: ['v2','v4','v6','v1','v3','v5','v2','v4','v6','v1','v3','v5','v2','v4','v6'] },
  { title: 'April 2026', sub: '24 photos',            tiles: ['v5','v3','v1','v6','v4','v2','v5','v3','v1','v6','v4','v2'] },
];

export function AlbumScreen() {
  const [tab, setTab] = useState('all');
  return (
    <>
      <AppTopBar/>
      <div className="large-title">Album</div>
      <div className="large-title-sub">Shared with the Watson family · 4 members</div>

      <div style={{ padding:'0 14px 12px' }}>
        <div className="segmented">
          <button className={`seg-item ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All</button>
          <button className={`seg-item ${tab === 'people' ? 'active' : ''}`} onClick={() => setTab('people')}>People</button>
          <button className={`seg-item ${tab === 'shared' ? 'active' : ''}`} onClick={() => setTab('shared')}>Shared with circles</button>
        </div>
      </div>

      {ALBUM_SECTIONS.map((s, i) => (
        <div key={i}>
          <div className="album-section-head">
            {s.title}
            <div className="sub">{s.sub}</div>
          </div>
          <div className="album-grid">
            {s.tiles.map((v, j) => (
              <button key={j} className={`album-tile placeholder ${v}`} aria-label="photo"/>
            ))}
          </div>
        </div>
      ))}
      <div style={{ height: 24 }}/>
    </>
  );
}
