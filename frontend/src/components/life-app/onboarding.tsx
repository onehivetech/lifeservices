'use client';
import { useState } from 'react';
import { useApp } from './context';
import { DEFAULT_FAMILY } from './data';
import { Sparkle, ChevronL, PlusI, CheckI, ShieldI, AppleI, GoogleI } from './icons';
import { ToggleRow } from './primitives';

const STEPS = [
  'welcome', 'value-1', 'value-2', 'value-3',
  'signin', 'personal', 'address', 'nok', 'kids', 'permissions', 'done'
] as const;
type Step = typeof STEPS[number];

export function Onboarding() {
  const app = useApp();
  const [step, setStep] = useState(0);

  const [authed, setAuthed] = useState(false);
  const [email, setEmail]   = useState(app.family.parent1.email);
  const [pw, setPw]         = useState('');
  const [parent1, setP1]    = useState(app.family.parent1);
  const [address, setAddress] = useState(app.family.address);
  const [nok, setNok]       = useState(app.family.nextOfKin);
  const [kids, setKids]     = useState(app.family.kids);
  const [perms, setPerms]   = useState(app.family.permissions);

  const cur: Step = STEPS[step];
  const next  = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back  = () => setStep(s => Math.max(s - 1, 0));
  const finish = () => {
    app.setBy(s => ({ ...s, family: { ...s.family, parent1, address, nextOfKin: nok, kids, permissions: perms } }));
    app.completeOnboarding();
  };

  const showProgress = cur !== 'welcome';
  const progressIdx = Math.max(0, step - 1);
  const progressTotal = STEPS.length - 2;

  return (
    <div className="onb">
      {showProgress && (
        <div className="onb-top">
          <div className="onb-progress">
            {Array.from({ length: progressTotal }, (_, i) => (
              <div key={i} className={`onb-progress-dot ${i < progressIdx ? 'done' : (i === progressIdx ? 'active' : '')}`} />
            ))}
          </div>
          {step > 1 && cur !== 'done' && (
            <button className="back-btn" style={{ color: 'var(--blue)', fontSize: 15, padding: '0 4px' }} onClick={back}>
              <ChevronL size={18}/><span style={{ marginLeft: -2 }}>Back</span>
            </button>
          )}
        </div>
      )}

      <div className="onb-body">
        {cur === 'welcome'     && <Welcome/>}
        {cur === 'value-1'     && <ValueProp num={1}/>}
        {cur === 'value-2'     && <ValueProp num={2}/>}
        {cur === 'value-3'     && <ValueProp num={3}/>}
        {cur === 'signin'      && <SignIn email={email} setEmail={setEmail} pw={pw} setPw={setPw} authed={authed} setAuthed={setAuthed}/>}
        {cur === 'personal'    && <PersonalInfo p1={parent1} setP1={setP1}/>}
        {cur === 'address'     && <AddressStep address={address} setAddress={setAddress}/>}
        {cur === 'nok'         && <NokStep nok={nok} setNok={setNok}/>}
        {cur === 'kids'        && <KidsStep kids={kids} setKids={setKids}/>}
        {cur === 'permissions' && <PermsStep perms={perms} setPerms={setPerms}/>}
        {cur === 'done'        && <DoneStep/>}
      </div>

      <div className="onb-foot">
        {cur === 'welcome' && (
          <>
            <button className="btn primary" onClick={next}>Get started</button>
            <button className="btn ghost" onClick={() => setStep(STEPS.indexOf('signin'))}>I already have an account</button>
          </>
        )}
        {(cur === 'value-1' || cur === 'value-2' || cur === 'value-3') && (
          <button className="btn primary" onClick={next}>Continue</button>
        )}
        {cur === 'signin' && (
          <button className="btn primary" disabled={!authed && (!email || !pw)} onClick={next}>
            {authed ? 'Continue' : 'Sign in'}
          </button>
        )}
        {(cur === 'personal' || cur === 'address' || cur === 'nok' || cur === 'kids') && (
          <button className="btn primary" onClick={next}>Continue</button>
        )}
        {cur === 'permissions' && (
          <button className="btn primary" onClick={next}>Finish setup</button>
        )}
        {cur === 'done' && (
          <button className="btn primary" onClick={finish}>Enter Life</button>
        )}
      </div>
    </div>
  );
}

function Welcome() {
  return (
    <div className="welcome-hero">
      <div className="big-mark"><Sparkle size={56}/></div>
      <h1>Welcome to Life.</h1>
      <p>One app for your family, your circles, and everything in between.</p>
    </div>
  );
}

function ValueProp({ num }: { num: 1 | 2 | 3 }) {
  const variants = {
    1: {
      icon: '🏛️', title: 'All your circles in one place',
      desc: 'Schools, sports clubs, scouts, churches and community groups — connected once, updated forever.',
      features: [
        { title: 'Stay in the loop',    desc: 'Get updates only from circles you care about', icon: '🔔' },
        { title: 'Family-aware',        desc: 'Add each child once. Their circles follow them.', icon: '👨‍👩‍👧‍👦' },
        { title: 'No more group chats', desc: 'Permission slips, events and payments in one feed.', icon: '💬' },
      ],
    },
    2: {
      icon: '🔒', title: 'Your details stay yours',
      desc: "Fill in your family's info once. Share only what you choose, when you choose — every time.",
      features: [
        { title: 'Locked Personal Vault',   desc: 'Two-factor auth on every access',             icon: '🔐' },
        { title: 'Co-parent notifications', desc: 'Both parents are pinged when info is opened', icon: '🔔' },
        { title: 'Granular permissions',    desc: 'Allergies, medical, photo consent — your call', icon: '✅' },
      ],
    },
    3: {
      icon: '✨', title: 'Permission slips in 5 seconds',
      desc: "When Jake's scouts go camping, we prefill the form. You review, sign, done. No printing.",
      features: [
        { title: 'AI Brain Dump', desc: 'Speak your day. We organise the chaos.',       icon: '🪄' },
        { title: 'Tap to pay',   desc: 'Fees, fundraisers, tickets — direct to the org', icon: '💳' },
        { title: 'Rewards',      desc: 'Earn points on every interaction you complete',  icon: '🎁' },
      ],
    },
  };
  const v = variants[num];
  return (
    <>
      <div style={{ fontSize: 64, marginTop: 24 }}>{v.icon}</div>
      <h1 className="onb-title">{v.title}</h1>
      <p className="onb-sub">{v.desc}</p>
      <div style={{ marginTop: 6 }}>
        {v.features.map((f, i) => (
          <div className="feature-row" key={i}>
            <div className="feature-icon" style={{ background: 'var(--blue-soft)', color: 'var(--blue)', fontSize: 22 }}>{f.icon}</div>
            <div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function SignIn({ email, setEmail, pw, setPw, authed, setAuthed }: {
  email: string; setEmail: (v: string) => void;
  pw: string; setPw: (v: string) => void;
  authed: boolean; setAuthed: (v: boolean) => void;
}) {
  return (
    <>
      <h1 className="onb-title">Sign in or create your account</h1>
      <p className="onb-sub">Use Apple or Google for the fastest setup, or your email.</p>

      <button className="btn dark" onClick={() => setAuthed(true)}>
        <AppleI size={18}/> Continue with Apple
      </button>
      <button className="btn secondary" onClick={() => setAuthed(true)}>
        <GoogleI size={18}/> Continue with Google
      </button>

      <div style={{ display:'flex', alignItems:'center', gap: 8, color:'var(--ink-4)', fontSize:12, margin:'4px 0' }}>
        <div style={{ flex:1, height:1, background:'var(--line)' }}/>
        OR
        <div style={{ flex:1, height:1, background:'var(--line)' }}/>
      </div>

      <div className="input-row">
        <label>Email</label>
        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setAuthed(false); }} placeholder="you@example.com"/>
      </div>
      <div className="input-row">
        <label>Password</label>
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setAuthed(false); }} placeholder="••••••••"/>
      </div>
      {authed && (
        <div className="row" style={{ color: 'var(--green)', fontSize: 13, padding: '6px 4px' }}>
          <CheckI size={14} color="var(--green)"/> Signed in
        </div>
      )}
    </>
  );
}

function PersonalInfo({ p1, setP1 }: { p1: typeof DEFAULT_FAMILY['parent1']; setP1: (v: typeof DEFAULT_FAMILY['parent1']) => void }) {
  const upd = (k: string, v: string) => setP1({ ...p1, [k]: v });
  return (
    <>
      <h1 className="onb-title">A bit about you</h1>
      <p className="onb-sub">We&apos;ll prefill forms across every org you join. Personal details are locked behind two-factor authentication.</p>
      <div className="input-row"><label>Full name</label>
        <input value={p1.name}  onChange={e => upd('name',  e.target.value)}/></div>
      <div className="input-row"><label>Email</label>
        <input value={p1.email} onChange={e => upd('email', e.target.value)}/></div>
      <div className="input-row"><label>Mobile</label>
        <input value={p1.phone} onChange={e => upd('phone', e.target.value)}/></div>
      <div className="input-row"><label>Date of birth</label>
        <input type="date" value={p1.dob} onChange={e => upd('dob', e.target.value)}/></div>
    </>
  );
}

function AddressStep({ address, setAddress }: { address: typeof DEFAULT_FAMILY['address']; setAddress: (v: typeof DEFAULT_FAMILY['address']) => void }) {
  const upd = (k: string, v: string) => setAddress({ ...address, [k]: v });
  return (
    <>
      <h1 className="onb-title">Your home address</h1>
      <p className="onb-sub">Used for school catchments, local services and emergency contacts.</p>
      <div className="input-row"><label>Street</label>
        <input value={address.line1}    onChange={e => upd('line1', e.target.value)}/></div>
      <div className="input-row"><label>Suburb / City</label>
        <input value={address.suburb}   onChange={e => upd('suburb', e.target.value)}/></div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8 }}>
        <div className="input-row"><label>State</label>
          <input value={address.state}    onChange={e => upd('state', e.target.value)}/></div>
        <div className="input-row"><label>Postcode</label>
          <input value={address.postcode} onChange={e => upd('postcode', e.target.value)}/></div>
      </div>
    </>
  );
}

function NokStep({ nok, setNok }: { nok: typeof DEFAULT_FAMILY['nextOfKin']; setNok: (v: typeof DEFAULT_FAMILY['nextOfKin']) => void }) {
  const upd = (k: string, v: string) => setNok({ ...nok, [k]: v });
  return (
    <>
      <h1 className="onb-title">Next of kin</h1>
      <p className="onb-sub">In an emergency, who should we call first? You can add more later.</p>
      <div className="input-row"><label>Name</label>
        <input value={nok.name}     onChange={e => upd('name', e.target.value)}/></div>
      <div className="input-row"><label>Relationship</label>
        <input value={nok.relation} onChange={e => upd('relation', e.target.value)}/></div>
      <div className="input-row"><label>Phone</label>
        <input value={nok.phone}    onChange={e => upd('phone', e.target.value)}/></div>
    </>
  );
}

type Kid = typeof DEFAULT_FAMILY['kids'][0];

function KidsStep({ kids, setKids }: { kids: Kid[]; setKids: (v: Kid[]) => void }) {
  const updKid = (i: number, k: string, v: string | number) => setKids(kids.map((kid, idx) => idx === i ? { ...kid, [k]: v } : kid));
  const remove = (i: number) => setKids(kids.filter((_, idx) => idx !== i));
  const add    = () => setKids([...kids, { name: '', age: 0, school: '', grade: '', allergies: '', meds: '' }]);
  return (
    <>
      <h1 className="onb-title">Add your kids</h1>
      <p className="onb-sub">When Jake&apos;s scouts go camping, this info will prefill the permission slip.</p>
      {kids.map((kid, i) => (
        <div key={i} style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:14, padding:14, display:'flex', flexDirection:'column', gap:8, marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'0.04em' }}>Child {i+1}</div>
            {kids.length > 1 && <button onClick={() => remove(i)} style={{ color:'var(--red, #FF3B30)', fontSize:13 }}>Remove</button>}
          </div>
          <div className="input-row"><label>Name</label>
            <input value={kid.name}      onChange={e => updKid(i, 'name', e.target.value)}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8 }}>
            <div className="input-row"><label>Age</label>
              <input value={kid.age}     onChange={e => updKid(i, 'age', e.target.value)}/></div>
            <div className="input-row"><label>Grade</label>
              <input value={kid.grade}   onChange={e => updKid(i, 'grade', e.target.value)}/></div>
          </div>
          <div className="input-row"><label>School</label>
            <input value={kid.school}    onChange={e => updKid(i, 'school', e.target.value)}/></div>
          <div className="input-row"><label>Allergies</label>
            <input value={kid.allergies} onChange={e => updKid(i, 'allergies', e.target.value)}/></div>
          <div className="input-row"><label>Medications</label>
            <input value={kid.meds}      onChange={e => updKid(i, 'meds', e.target.value)}/></div>
        </div>
      ))}
      <button className="btn secondary" onClick={add}>
        <PlusI size={16}/>Add another child
      </button>
    </>
  );
}

function PermsStep({ perms, setPerms }: { perms: typeof DEFAULT_FAMILY['permissions']; setPerms: (v: typeof DEFAULT_FAMILY['permissions']) => void }) {
  const upd = (k: keyof typeof DEFAULT_FAMILY['permissions'], v: boolean) => setPerms({ ...perms, [k]: v });
  return (
    <>
      <h1 className="onb-title">Permission defaults</h1>
      <p className="onb-sub">Your starting position for every form. You&apos;ll review each one before sending.</p>
      <ToggleRow title="Photo consent"      sub="Photos of your child can appear in org newsletters"   value={perms.photoConsent}     onChange={v => upd('photoConsent', v)}/>
      <ToggleRow title="Medical consent"    sub="Authorise emergency medical treatment"                 value={perms.medicalConsent}   onChange={v => upd('medicalConsent', v)}/>
      <ToggleRow title="Transport consent"  sub="Travel in org-arranged vehicles to events"            value={perms.transportConsent} onChange={v => upd('transportConsent', v)}/>
      <ToggleRow title="Overnight consent"  sub="Required for camps and tournaments"                   value={perms.overnightConsent} onChange={v => upd('overnightConsent', v)}/>
      <ToggleRow title="Digital sharing"    sub="Share posts to org's public social feeds"             value={perms.digitalConsent}   onChange={v => upd('digitalConsent', v)}/>

      <div style={{ marginTop: 16, padding: 14, background: 'var(--blue-soft)', borderRadius: 12 }}>
        <div className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
          <ShieldI size={18}/>
          <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.45 }}>
            <b>Two-factor protection.</b> Personal info is locked. We notify your co-parent every time it&apos;s accessed.
          </div>
        </div>
      </div>
    </>
  );
}

function DoneStep() {
  return (
    <div className="welcome-hero" style={{ paddingTop: 40 }}>
      <div className="big-mark" style={{ background: 'linear-gradient(155deg, #34C759, #1F9D43)' }}>
        <CheckI size={56} color="white"/>
      </div>
      <h1>You&apos;re all set.</h1>
      <p>Tim, your circles are loaded and your family is ready. Welcome to a simpler life.</p>
    </div>
  );
}
