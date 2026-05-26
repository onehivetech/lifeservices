export const DEFAULT_FAMILY = {
  parent1: { name: 'Tim Watson',  initials: 'TW', email: 'tim.watson@gmail.com',  phone: '+61 412 345 678', dob: '1986-03-14' },
  parent2: { name: 'Emma Watson', initials: 'EW', email: 'emma.watson@gmail.com', phone: '+61 412 988 211', dob: '1988-07-22' },
  address: { line1: '14 Coral Ave', suburb: 'Bayside', state: 'NSW', postcode: '2099', country: 'Australia' },
  nextOfKin: { name: 'Margaret Watson', relation: 'Mother (Tim)', phone: '+61 412 100 200' },
  kids: [
    { name: 'Sarah Watson', age: 12, school: 'Bayside Primary', grade: 'Yr 6', allergies: 'Peanuts', meds: '—' },
    { name: 'Jake Watson',  age: 10, school: 'Bayside Primary', grade: 'Yr 4', allergies: '—', meds: 'Asthma inhaler' },
  ],
  permissions: {
    photoConsent: true,
    medicalConsent: true,
    transportConsent: true,
    digitalConsent: false,
    overnightConsent: true,
  },
};

export const CIRCLES = [
  { cat: 'Education', icon: '📚', color: '#0A84FF', items: [
    { name: 'Bayside Primary School',   role: 'Sarah · Yr 6 · Jake · Yr 4', initials: 'BP', color: '#0A84FF', updates: 3 },
    { name: 'Cambridge Maths Tutoring', role: 'Sarah · Tue 4:00 PM',         initials: 'CM', color: '#5856D6', updates: 0 },
  ]},
  { cat: 'Sporting', icon: '⚽️', color: '#FF9F0A', items: [
    { name: 'Bayside Ballet Academy',   role: 'Sarah · Tue & Thu',           initials: 'BB', color: '#FF2D55', updates: 1 },
    { name: 'North Suns FC',            role: 'Jake · Sat AM',               initials: 'NS', color: '#FF9F0A', updates: 0 },
  ]},
  { cat: 'Community', icon: '🌳', color: '#34C759', items: [
    { name: 'Bayside Library',          role: 'Family · Member',             initials: 'BL', color: '#34C759', updates: 0 },
    { name: 'Neighbourhood Watch',      role: 'Coral Ave area',              initials: 'NW', color: '#5AC8FA', updates: 2 },
  ]},
  { cat: 'Religion', icon: '✨', color: '#AF52DE', items: [
    { name: "St Andrew's Parish",       role: 'Family · Member',             initials: 'SA', color: '#AF52DE', updates: 0 },
  ]},
  { cat: 'Clubs & Societies', icon: '🎲', color: '#FF3B30', items: [
    { name: '1st Bayside Scout Group',  role: 'Jake · Cub Scout',            initials: '1B', color: '#FF3B30', updates: 4 },
    { name: 'Junior Chess Club',        role: 'Sarah · Wed 5:30 PM',         initials: 'JC', color: '#1A1F36', updates: 0 },
  ]},
];

export const CHATS = [
  { id:'c1', name:'Emma Watson',          last:'Can you pick up Sarah today?',       time:'2:42 PM', unread:2, color:'#FF2D55', initials:'EW', isFamily:true, online: true },
  { id:'c2', name:'1st Bayside Scouts',   last:'Akela: Camp gear list attached',     time:'1:08 PM', unread:5, color:'#FF3B30', initials:'1B', isOrg:true,   pinned:true },
  { id:'c3', name:'Sarah Watson',         last:'Mum said ok 👍',                     time:'12:30 PM',unread:0, color:'#5856D6', initials:'SW', isFamily:true, online: true },
  { id:'c4', name:'Bayside Primary',      last:'Mrs Lee: Form due Friday',           time:'11:14 AM',unread:1, color:'#0A84FF', initials:'BP', isOrg:true   },
  { id:'c5', name:'Ballet Parents',       last:'Janet: Sign up for the bake sale?',  time:'Yesterday',unread:0, color:'#FF2D55', initials:'BP', members: 12 },
  { id:'c6', name:'Coral Ave Neighbours', last:'Joel: Bin night reminder',           time:'Yesterday',unread:0, color:'#5AC8FA', initials:'CN', members: 28 },
  { id:'c7', name:'Margaret Watson',      last:'Photos from Easter 🐰',              time:'Mon',     unread:0, color:'#AF52DE', initials:'MW' },
  { id:'c8', name:'Jake Watson',          last:"Can I get McDonald's tonight?",      time:'Mon',     unread:0, color:'#34C759', initials:'JW', isFamily:true },
  { id:'c9', name:'North Suns FC',        last:'Coach: Game cancelled this Sat',     time:'Sun',     unread:0, color:'#FF9F0A', initials:'NS', isOrg:true },
];

export const PROPERTIES = [
  {
    id: 'home', name: 'Home', sub: '14 Coral Ave, Bayside', color: '#0A84FF', icon: '🏠',
    active: [
      { kind: 'Cleaning',     vendor: 'SparkleHome',     plan: 'Fortnightly · Tue', cost: '$110/visit', status: 'Active' },
      { kind: 'Lawn & garden',vendor: 'GreenThumb',      plan: 'Monthly · 1st Sat', cost: '$85/visit',  status: 'Active' },
      { kind: 'Internet',     vendor: 'Aussie Broadband',plan: '100/40 NBN',        cost: '$89/mo',     status: 'Active' },
      { kind: 'Electricity',  vendor: 'OVO Energy',      plan: 'Green plan',        cost: '$140/mo avg',status: 'Active' },
    ],
  },
  {
    id: 'beach', name: 'Beach house', sub: '8 Seaview Rd, Avoca', color: '#5AC8FA', icon: '🏖️',
    active: [
      { kind: 'Cleaning',     vendor: 'Coastal Clean',   plan: 'Per stay',          cost: '$180/visit', status: 'On demand' },
      { kind: 'Pool service', vendor: 'BluePool',        plan: 'Weekly · Wed',      cost: '$60/visit',  status: 'Active' },
    ],
  },
  {
    id: 'office', name: "Tim's office", sub: '120 Pitt St, Sydney', color: '#5856D6', icon: '🏢',
    active: [
      { kind: 'Cleaning', vendor: 'CityClean', plan: 'Daily', cost: 'Building inc.', status: 'Active' },
    ],
  },
];

export const SUBSCRIPTIONS = [
  { name: 'Netflix Premium',     category: 'Streaming', cost: '$25.99',  cycle: 'monthly',   next: '14 Jun', color: '#E50914', initials: 'NF' },
  { name: 'Spotify Family',      category: 'Streaming', cost: '$20.99',  cycle: 'monthly',   next: '02 Jun', color: '#1DB954', initials: 'SP' },
  { name: 'Disney+',             category: 'Streaming', cost: '$13.99',  cycle: 'monthly',   next: '21 Jun', color: '#113CCF', initials: 'D+' },
  { name: 'iCloud+ 2TB',         category: 'Cloud',     cost: '$14.99',  cycle: 'monthly',   next: '08 Jun', color: '#7E869E', initials: '☁️' },
  { name: 'Cambridge Tutoring',  category: 'Education', cost: '$180.00', cycle: 'monthly',   next: '01 Jun', color: '#5856D6', initials: 'CT' },
  { name: 'Bayside Ballet Term', category: 'Sport',     cost: '$320.00', cycle: 'quarterly', next: '14 Jul', color: '#FF2D55', initials: 'BB' },
  { name: 'Scouts Term 2',       category: 'Sport',     cost: '$145.00', cycle: 'quarterly', next: 'Due',    color: '#FF3B30', initials: '1B', overdue: true },
  { name: 'Costco Membership',   category: 'Shopping',  cost: '$60.00',  cycle: 'yearly',    next: '12 Oct', color: '#E31837', initials: 'CO' },
];

export const FINANCE_ACCOUNTS = [
  { kind: 'Bank',   name: 'CommBank Smart Access',  num: '••• 3421', balance: '$8,420.16',  color: '#FFCC00', logo: 'CBA' },
  { kind: 'Bank',   name: 'ING Savings Maximiser',  num: '••• 0188', balance: '$24,610.00', color: '#FF6200', logo: 'ING' },
  { kind: 'Card',   name: 'Visa Credit',            num: '••• 4221', balance: '-$842.50',   color: '#1A1F71', logo: 'VISA' },
  { kind: 'Card',   name: 'Amex Platinum',          num: '••• 1005', balance: '-$2,108.00', color: '#016FD0', logo: 'AMEX' },
  { kind: 'Wallet', name: 'Apple Pay',              num: 'Default device', balance: '—',    color: '#000',    logo: '' },
];

export const MY_PEOPLE = [
  { name: 'Emma Watson',    relation: 'Co-parent · spouse',         group: 'immediate',  initials: 'EW', color: '#FF2D55', verified: true },
  { name: 'Sarah Watson',   relation: 'Daughter · 12',              group: 'immediate',  initials: 'SW', color: '#5856D6' },
  { name: 'Jake Watson',    relation: 'Son · 10',                   group: 'immediate',  initials: 'JW', color: '#34C759' },
  { name: 'Margaret Watson',relation: 'Mother',                     group: 'secondary',  initials: 'MW', color: '#AF52DE' },
  { name: 'Robert Watson',  relation: 'Father',                     group: 'secondary',  initials: 'RW', color: '#FF9F0A' },
  { name: 'Claire Lin',     relation: 'Sister-in-law',              group: 'secondary',  initials: 'CL', color: '#5AC8FA' },
  { name: 'Tom Walsh',      relation: "Brother (Emma's)",           group: 'secondary',  initials: 'TW', color: '#FF3B30' },
  { name: "Janet O'Reilly", relation: 'Ballet parent · Bayside',    group: 'friends',    initials: 'JO', color: '#FF2D55' },
  { name: 'Joel Park',      relation: 'Neighbour · Coral Ave',      group: 'friends',    initials: 'JP', color: '#5AC8FA' },
  { name: 'Akela Mike',     relation: 'Scout Leader',               group: 'friends',    initials: 'AM', color: '#FF3B30' },
  { name: 'Dr Susan Liu',   relation: 'GP · Bayside Clinic',        group: 'friends',    initials: 'SL', color: '#34C759' },
  { name: 'Mrs Lee',        relation: "Sarah's teacher",            group: 'friends',    initials: 'ML', color: '#0A84FF' },
  { name: 'Marcus Lin',     relation: 'Housemate · since Jan 2025', group: 'housemates', initials: 'ML', color: '#5856D6', verified: true },
  { name: 'Priya Shah',     relation: 'Housemate · since Mar 2025', group: 'housemates', initials: 'PS', color: '#34C759', verified: true },
  { name: 'Ben Carter',     relation: 'Housemate · since Aug 2025', group: 'housemates', initials: 'BC', color: '#FF9F0A', verified: true },
];

export const SHAREHOUSE = {
  name: '14 Coral Ave',
  sub:  'Bayside · 4 housemates',
  members: [
    { id: 'me',     name: 'Tim Watson', initials: 'TW', color: '#0A84FF', share: 25, isMe: true,  paid: '$214.50' },
    { id: 'marcus', name: 'Marcus Lin', initials: 'ML', color: '#5856D6', share: 25, isMe: false, paid: '$0.00' },
    { id: 'priya',  name: 'Priya Shah', initials: 'PS', color: '#34C759', share: 25, isMe: false, paid: '$0.00' },
    { id: 'ben',    name: 'Ben Carter', initials: 'BC', color: '#FF9F0A', share: 25, isMe: false, paid: '$0.00' },
  ],
  services: [
    { id:'s1', emoji:'⚡️', name:'Electricity',     vendor:'OVO Energy',        cost:140,   cycle:'monthly',     split:'even',    payer:'me',     nextDate:'14 Jun', members:{ me:25, marcus:25, priya:25, ben:25 } },
    { id:'s2', emoji:'📶', name:'Internet',         vendor:'Aussie Broadband',  cost:89,    cycle:'monthly',     split:'even',    payer:'me',     nextDate:'02 Jun', members:{ me:25, marcus:25, priya:25, ben:25 } },
    { id:'s3', emoji:'🧹', name:'Cleaning',         vendor:'SparkleHome',       cost:220,   cycle:'fortnightly', split:'even',    payer:'priya',  nextDate:'30 May', members:{ me:25, marcus:25, priya:25, ben:25 } },
    { id:'s4', emoji:'📺', name:'Netflix Premium',  vendor:'Netflix',           cost:25.99, cycle:'monthly',     split:'percent', payer:'marcus', nextDate:'14 Jun', members:{ me:30, marcus:30, priya:20, ben:20 } },
    { id:'s5', emoji:'🌿', name:'Gardener',         vendor:'GreenThumb',        cost:85,    cycle:'monthly',     split:'custom',  payer:'ben',    nextDate:'05 Jun', members:{ me:30, marcus:30, priya:20, ben:20 } },
    { id:'s6', emoji:'💧', name:'Water',            vendor:'Sydney Water',      cost:220,   cycle:'quarterly',   split:'even',    payer:'me',     nextDate:'12 Jul', members:{ me:25, marcus:25, priya:25, ben:25 } },
  ],
};
