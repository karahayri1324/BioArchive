/* ============================================
   BioArchive - Main Application
   ============================================ */

// ---- Icons (Inline SVGs) ----
const Icons = {
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  send: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  chat: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  bookmark: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
  bookmarkFill: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  heartFill: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  comment: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  moreH: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
  msgCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
  chevLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  chevRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
  share: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`,
  image: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
};


// ---- State ----
const State = {
  currentView: 'chat',
  messages: [],
  posts: [],
  savedPosts: [],
  isTyping: false,
  actionMenuOpen: false,
  uploadedFile: null,
  chatHistories: [],
  currentChatId: null,
  theme: localStorage.getItem('bioarchive-theme') || 'light',
};


// ---- Sample Data ----
const samplePosts = [
  {
    id: 1,
    author: { name: 'Dr. Ayse Kaya', initials: 'AK', color: '#4DBAB0' },
    title: 'CRISPR-Cas9 ile Genom Duzenleme: Son Gelismeler',
    body: 'CRISPR teknolojisindeki son gelismeler, genetik hastaliklarin tedavisinde umut verici sonuclar ortaya koyuyor. Ozellikle orak hucre anemisi ve beta talasemi gibi kan hastaliklarinda klinik deneylerde basarili sonuclar elde edildi.',
    tags: ['Genetik', 'CRISPR'],
    category: 'article',
    likes: 47,
    liked: false,
    bookmarked: false,
    date: '2 saat once',
    comments: [
      { id: 1, author: { name: 'Mehmet Demir', initials: 'MD', color: '#8B6CC1' }, text: 'Harika bir ozet olmus, tesekkurler!', date: '1 saat once' },
      { id: 2, author: { name: 'Elif Yildiz', initials: 'EY', color: '#D94F7A' }, text: 'CRISPR-Cas12 hakkinda da bir paylasim yapar misiniz?', date: '45 dk once' },
    ]
  },
  {
    id: 2,
    author: { name: 'Prof. Burak Ozturk', initials: 'BO', color: '#4A90D9' },
    title: 'Deniz Biyolojisi: Mercan Resifleri ve Iklim Degisikligi',
    body: 'Buyuk Set Resifi\'ndeki agartma olaylari son 5 yilda dramatik bir artis gosterdi. Okyanus sicakliklarindaki 1.5°C\'lik artis bile mercan ekosistemlerini ciddi sekilde tehdit ediyor. Yeni restorasyon teknikleri ve mercan bahcecilik projeleri umut vaat ediyor.',
    tags: ['Deniz Biyolojisi', 'Ekoloji'],
    category: 'research',
    likes: 32,
    liked: false,
    bookmarked: false,
    date: '5 saat once',
    comments: [
      { id: 3, author: { name: 'Zeynep Arslan', initials: 'ZA', color: '#3DAE85' }, text: 'Akdeniz\'deki mercan turleri icin de benzer bir tehdit soz konusu mu?', date: '3 saat once' },
    ]
  },
  {
    id: 3,
    author: { name: 'Selin Aksoy', initials: 'SA', color: '#E8853D' },
    title: 'Mitoz ve Mayoz Bolunme Karsilastirmasi',
    body: 'Hucre bolunmesinin iki temel tipi olan mitoz ve mayoz, farkli amaclarla gerceklesir. Mitoz buyume ve onarim icin, mayoz ise ureme hucreleri olusturmak icin gereklidir. Iste temel farklar ve benzerlikler...',
    tags: ['Hucre Biyolojisi', 'Not'],
    category: 'note',
    likes: 18,
    liked: false,
    bookmarked: false,
    date: '1 gun once',
    comments: []
  },
  {
    id: 4,
    author: { name: 'Can Yilmaz', initials: 'CY', color: '#D94F7A' },
    title: 'Protein sentezi asamalarinda kafam karisti',
    body: 'Arkadaslar, transkripsiyon ve translasyon arasindaki farki bir turlu oturtamiyorum. RNA polimeraz ve ribozomun rolu hakkinda yardimci olabilecek var mi? Ozellikle mRNA\'nin islenmesi konusu cok karisik geliyor.',
    tags: ['Molekuler Biyoloji', 'Soru'],
    category: 'question',
    likes: 8,
    liked: false,
    bookmarked: false,
    date: '2 gun once',
    comments: [
      { id: 4, author: { name: 'Dr. Ayse Kaya', initials: 'AK', color: '#4DBAB0' }, text: 'Transkripsiyon cekirdekte, translasyon sitoplazmada gerceklesir. Basitce: DNA → mRNA (transkripsiyon), mRNA → Protein (translasyon).', date: '1 gun once' },
      { id: 5, author: { name: 'Selin Aksoy', initials: 'SA', color: '#E8853D' }, text: 'Khan Academy\'nin bu konudaki videolari cok aciklayici, oneririm!', date: '1 gun once' },
    ]
  },
];

const chatHistories = [
  { id: 'c1', title: 'DNA Replikasyonu', date: 'Bugun' },
  { id: 'c2', title: 'Fotosentez sureci', date: 'Dun' },
  { id: 'c3', title: 'Evrim mekanizmalari', date: '2 gun once' },
];

const suggestedPrompts = [
  'DNA replikasyonu nasil calisir?',
  'Fotosentez surecini detayli acikla',
  'Hucre zarinin yapisini anlat',
  'Evrim teorisinin temel ilkeleri nelerdir?',
];

// AI response database
const aiResponses = {
  'dna': `**DNA Replikasyonu**

DNA replikasyonu, hucre bolunmesi oncesinde genetik materyalin kopyalanmasi surecidir. Bu islem yari-korunumlu (semi-conservative) bir mekanizma ile gerceklesir.

**Temel Asamalar:**

1. **Baslatma (Initiation):** Helikaz enzimi, DNA cift sarmalini acar ve replikasyon catalini olusturur.

2. **Uzama (Elongation):** DNA polimeraz III, serbest nukleotidleri kalip iplige komplementer olarak ekler. Onceku iplik surekli, gecikci iplik ise Okazaki fragmentleri halinde sentezlenir.

3. **Sonlanma (Termination):** Replikasyon catallari birlestiginde islem tamamlanir. DNA ligaz, Okazaki fragmentlerini birlestirir.

Her yeni DNA molekulu bir eski (kalip) ve bir yeni sentezlenmis iplikten olusur.`,

  'fotosentez': `**Fotosentez Sureci**

Fotosentez, bitkilerin gunes isigini kullanarak karbondioksit ve suyu glikoz ve oksijene donusturme surecidir.

**Genel Denklem:**
6CO₂ + 6H₂O + Isik Enerjisi → C₆H₁₂O₆ + 6O₂

**Iki Ana Asama:**

1. **Isiga Bagli Reaksiyonlar (Tilakoid):**
   - Klorofil, isik enerjisini emer
   - Su molekulleri parcalanir (fotoliz)
   - ATP ve NADPH uretilir
   - Oksijen serbest birakilir

2. **Isiktan Bagimsiz Reaksiyonlar (Calvin Dongusu - Stroma):**
   - CO₂ sabitlenir (karbon fiksasyonu)
   - ATP ve NADPH kullanilarak glikoz sentezlenir
   - RuBisCO enzimi anahtar rol oynar

Fotosentez, Dunya\'daki yasamin temelini olusturan en onemli biyokimyasal sureclerden biridir.`,

  'hucre zari': `**Hucre Zarinin Yapisi**

Hucre zari (plazma membrani), hucreyi cevreleyen ve ic ortami dis ortamdan ayiran secici gecirgen bir yapidir.

**Akici Mozaik Modeli:**

Hucre zari, Singer ve Nicolson tarafindan 1972'de onerilen akici mozaik modeline gore yapilanmistir:

- **Fosfolipit Cift Tabakasi:** Hidrofil (suyu seven) bas ve hidrofob (sudan kacan) kuyruk kisimlari vardir
- **Membran Proteinleri:**
  - *Integral proteinler:* Zarı tamamen katededer
  - *Periferik proteinler:* Zarin yuzeyine tutunur
- **Kolesterol:** Membran akiskanligini duzenler
- **Karbohidratlar:** Hucre taninmasinda rol oynar (glikokaliks)

**Fonksiyonlari:**
1. Secici gecirgenlik
2. Hucre iletisimi
3. Hucre taninmasi
4. Enzimatik aktivite`,

  'evrim': `**Evrim Teorisinin Temel Ilkeleri**

Charles Darwin ve Alfred Russel Wallace tarafindan gelistirilen evrim teorisi, canli turlerin zaman icerisinde degisime ugradigi ve ortak bir atadan tureditigi ilkesine dayanir.

**Ana Mekanizmalar:**

1. **Dogal Secilim:** Cevrelerine daha iyi uyum saglayan bireyler hayatta kalma ve ureme sansi daha yuksektir.

2. **Mutasyon:** DNA'daki rastgele degisimler, yeni genetik cesitlilik yaratir.

3. **Genetik Suruklenme:** Kucuk populasyonlarda rastgele gen frekans degisimleri.

4. **Gen Akisi:** Populasyonlar arasi gen transferi.

**Kanitlar:**
- Fosil kayitlari
- Karsilastirmali anatomi (homolog yapilar)
- Molekuler biyoloji (DNA benzerlikleri)
- Biyocografya
- Embriyoloji

Modern evrimsel sentez, Darwin'in dogal secilim teorisini Mendel genetigi ile birlestirerek olusturulmustur.`,

  'default': `Bu cok ilginc bir konu! Biyoloji alaninda pek cok farkli perspektiften incelenebilir.

Konuyla ilgili birkac onemli nokta paylasabilirim:

**Genel Bakis:**
Bu konuyu anlamak icin temel biyoloji kavramlarini bilmek onemlidir. Hucre yapisi, genetik mekanizmalar ve ekolojik iliskiler bu alanin temel taslarini olusturur.

**Oneriler:**
- Konuyla ilgili bilimsel makaleleri incelemenizi oneririm
- Deneysel calismalara goz atmaniz faydali olacaktir
- Guncel arastirmalari takip etmek, alanin gelisimini anlamanizi kolaylastirir

Daha spesifik bir soru sormak ister misiniz? Belirli bir alt konu hakkinda daha detayli bilgi verebilirim.`
};

// Flash card data
const flashCardSets = {
  'biyoloji': [
    { front: 'Mitokondri nedir?', back: 'Hucrenin enerji santrali olarak bilinen, ATP ureten organeldir. Cift zar yapisina sahiptir ve kendi DNA\'sina sahiptir.' },
    { front: 'Osmoz nedir?', back: 'Suyun, yari gecirgen bir zardan, dusuk cozunur konsantrasyonlu ortamdan yuksek cozunur konsantrasyonlu ortama dogru hareketi.' },
    { front: 'Enzim nedir?', back: 'Biyolojik katalizorlerdir. Kimyasal reaksiyonlarin aktivasyon enerjisini dusurerek reaksiyon hizini artirirlar. Cogu protein yapisindadir.' },
    { front: 'Meioz kac asama icerir?', back: 'Iki asama icerir: Meioz I (indirgenme bolunmesi) ve Meioz II (esitsel bolunme). Sonucta 4 haploid hucre olusur.' },
    { front: 'Fotosentezin genel denklemi?', back: '6CO₂ + 6H₂O + Isik → C₆H₁₂O₆ + 6O₂\nKarbondioksit + Su + Isik → Glikoz + Oksijen' },
    { front: 'DNA\'nin yapisi?', back: 'Cift sarmal yapisinda, nukleotidlerden olusur. Her nukleotid: fosforik asit + deoksiriboz seker + azotlu baz (A-T, G-C) icerir.' },
  ],
  'genetik': [
    { front: 'Genotip nedir?', back: 'Bir organizmanin genetik yapisidir. Alel cifleri ile ifade edilir (ornegin Aa, BB).' },
    { front: 'Fenotip nedir?', back: 'Bir organizmanin gozlenebilir ozellikleridir. Genotip ve cevre etkilesimi sonucu ortaya cikar.' },
    { front: 'Dominant alel?', back: 'Heterozigot durumda bile etkisini gosteren aleldir. Buyuk harf ile gosterilir (A).' },
    { front: 'Kodominans?', back: 'Her iki alelin de fenotipte esit sekilde ifade edildigi durumdur. Ornek: AB kan grubu.' },
  ]
};


// ---- Initialization ----
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(State.theme);
  loadFromStorage();
  initRouter();
  initSidebar();
  initChat();
  initCommunity();
  initModals();
  renderChatHistories();
});


// ---- Theme ----
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  State.theme = theme;
  localStorage.setItem('bioarchive-theme', theme);
  // Update toggle icons
  document.querySelectorAll('.theme-icon').forEach(el => {
    el.innerHTML = theme === 'dark' ? Icons.sun : Icons.moon;
  });
}

function toggleTheme() {
  applyTheme(State.theme === 'dark' ? 'light' : 'dark');
}


// ---- Local Storage ----
function loadFromStorage() {
  const saved = localStorage.getItem('bioarchive-posts');
  if (saved) {
    try { State.posts = JSON.parse(saved); } catch(e) { State.posts = [...samplePosts]; }
  } else {
    State.posts = [...samplePosts];
  }

  const savedBookmarks = localStorage.getItem('bioarchive-saved');
  if (savedBookmarks) {
    try { State.savedPosts = JSON.parse(savedBookmarks); } catch(e) { State.savedPosts = []; }
  }

  const savedMessages = localStorage.getItem('bioarchive-messages');
  if (savedMessages) {
    try { State.messages = JSON.parse(savedMessages); } catch(e) { State.messages = []; }
  }
}

function saveToStorage() {
  localStorage.setItem('bioarchive-posts', JSON.stringify(State.posts));
  localStorage.setItem('bioarchive-saved', JSON.stringify(State.savedPosts));
  localStorage.setItem('bioarchive-messages', JSON.stringify(State.messages));
}


// ---- Router ----
function initRouter() {
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
}

function switchView(viewName) {
  State.currentView = viewName;

  // Update nav items
  document.querySelectorAll('.nav-item[data-view]').forEach(el => {
    el.classList.toggle('active', el.dataset.view === viewName);
  });
  document.querySelectorAll('.mobile-tab[data-view]').forEach(el => {
    el.classList.toggle('active', el.dataset.view === viewName);
  });

  // Update views
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  const view = document.getElementById(viewName + 'View');
  if (view) view.classList.add('active');

  // Update mobile header title
  const titles = { chat: 'BioArchive AI', community: 'Topluluk', saved: 'Kaydedilenler' };
  const mobileTitle = document.querySelector('.mobile-header-title');
  if (mobileTitle) mobileTitle.textContent = titles[viewName] || 'BioArchive';

  // Close mobile sidebar
  closeMobileSidebar();

  // Render saved view if needed
  if (viewName === 'saved') renderSavedView();
}


// ---- Sidebar ----
function initSidebar() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('sidebarOverlay');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      document.getElementById('sidebar').classList.add('open');
      overlay.classList.add('visible');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', closeMobileSidebar);
  }

  // Theme toggles
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // New chat button
  const newChatBtn = document.getElementById('newChatBtn');
  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      State.messages = [];
      State.currentChatId = null;
      saveToStorage();
      renderChatMessages();
      switchView('chat');
    });
  }

  // Post detail back button
  const postDetailBack = document.getElementById('postDetailBack');
  if (postDetailBack) {
    postDetailBack.addEventListener('click', closePostDetail);
  }
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('visible');
}


// ---- Chat ----
function initChat() {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const plusBtn = document.getElementById('plusBtn');
  const actionMenu = document.getElementById('actionMenu');

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 150) + 'px';
    sendBtn.classList.toggle('active', input.value.trim().length > 0);
  });

  // Send message on Enter (Shift+Enter for new line)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  // Plus button toggle
  plusBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    State.actionMenuOpen = !State.actionMenuOpen;
    actionMenu.classList.toggle('visible', State.actionMenuOpen);
    plusBtn.classList.toggle('active', State.actionMenuOpen);
  });

  // Close action menu on outside click
  document.addEventListener('click', () => {
    if (State.actionMenuOpen) {
      State.actionMenuOpen = false;
      actionMenu.classList.remove('visible');
      plusBtn.classList.remove('active');
    }
  });
  actionMenu.addEventListener('click', (e) => e.stopPropagation());

  // Action menu items
  document.querySelectorAll('.action-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      State.actionMenuOpen = false;
      actionMenu.classList.remove('visible');
      plusBtn.classList.remove('active');
      handleAction(action);
    });
  });

  // Suggested prompts
  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.textContent;
      input.dispatchEvent(new Event('input'));
      sendMessage();
    });
  });

  // File input for image upload
  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }

  // Render existing messages
  renderChatMessages();
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text && !State.uploadedFile) return;

  // Hide welcome screen
  const welcome = document.getElementById('chatWelcome');
  if (welcome) welcome.style.display = 'none';

  // Create user message
  const userMsg = {
    id: Date.now(),
    type: 'user',
    text: text,
    image: State.uploadedFile || null,
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  };
  State.messages.push(userMsg);

  // Clear input
  input.value = '';
  input.style.height = 'auto';
  document.getElementById('sendBtn').classList.remove('active');
  clearUploadPreview();

  renderChatMessages();
  scrollChatToBottom();

  // AI model unavailable
  setTimeout(() => {
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      const aiMsg = {
        id: Date.now(),
        type: 'ai',
        text: null,
        error: true,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      State.messages.push(aiMsg);
      saveToStorage();
      renderChatMessages();
      scrollChatToBottom();
    }, 800 + Math.random() * 600);
  }, 400);
}

function generateAIResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('dna') || q.includes('replikasyon')) return aiResponses['dna'];
  if (q.includes('fotosentez') || q.includes('bitki')) return aiResponses['fotosentez'];
  if (q.includes('hucre zar') || q.includes('membran') || q.includes('zar')) return aiResponses['hucre zari'];
  if (q.includes('evrim') || q.includes('darwin') || q.includes('dogal secilim')) return aiResponses['evrim'];
  return aiResponses['default'];
}

function renderChatMessages() {
  const container = document.getElementById('chatMessagesInner');
  const welcome = document.getElementById('chatWelcome');

  if (State.messages.length === 0) {
    if (welcome) welcome.style.display = '';
    if (container) container.innerHTML = '';
    return;
  }

  if (welcome) welcome.style.display = 'none';

  let html = '';
  State.messages.forEach((msg, i) => {
    const delay = i * 0.05;
    if (msg.type === 'user') {
      html += `
        <div class="message user" style="animation-delay: ${delay}s">
          <div class="message-avatar"><span>K</span></div>
          <div class="message-content">
            <div class="message-sender">Sen</div>
            ${msg.image ? `<img src="${msg.image}" class="message-image" alt="Yuklenen gorsel">` : ''}
            <div class="message-text">${escapeHtml(msg.text)}</div>
            <div class="message-time">${msg.time}</div>
          </div>
        </div>`;
    } else if (msg.error) {
      html += `
        <div class="message ai" style="animation-delay: ${delay}s">
          <div class="message-avatar"><img src="assets/logo.jpeg" alt="AI"></div>
          <div class="message-content">
            <div class="message-sender">BioArchive AI</div>
            <div class="message-error">
              <div class="error-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              </div>
              <div class="error-text">
                <strong>Suanda yapay zeka modelimize ulasamiyoruz.</strong>
                <span>Lutfen daha sonra tekrar deneyin.</span>
              </div>
            </div>
            <div class="message-time">${msg.time}</div>
          </div>
        </div>`;
    } else {
      html += `
        <div class="message ai" style="animation-delay: ${delay}s">
          <div class="message-avatar"><img src="assets/logo.jpeg" alt="AI"></div>
          <div class="message-content">
            <div class="message-sender">BioArchive AI</div>
            <div class="message-text">${formatMarkdown(msg.text)}</div>
            <div class="message-time">${msg.time}</div>
          </div>
        </div>`;
    }
  });

  if (container) container.innerHTML = html;
}

function showTypingIndicator() {
  const container = document.getElementById('chatMessagesInner');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'message ai';
  el.id = 'typingIndicator';
  el.innerHTML = `
    <div class="message-avatar"><img src="assets/logo.jpeg" alt="AI"></div>
    <div class="message-content">
      <div class="message-sender">BioArchive AI</div>
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>`;
  container.appendChild(el);
  scrollChatToBottom();
}

function hideTypingIndicator() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function scrollChatToBottom() {
  const container = document.getElementById('chatMessages');
  if (container) {
    setTimeout(() => container.scrollTop = container.scrollHeight, 50);
  }
}

function renderChatHistories() {
  const container = document.getElementById('chatHistoryList');
  if (!container) return;

  let html = '';
  chatHistories.forEach(ch => {
    html += `
      <button class="chat-history-item" onclick="loadChatHistory('${ch.id}')">
        ${Icons.msgCircle}
        <span>${ch.title}</span>
      </button>`;
  });
  container.innerHTML = html;
}

function loadChatHistory(id) {
  // Simulated - in real app would load from server
  showToast('Sohbet gecmisi yuklendi');
  switchView('chat');
}


// ---- Actions (+ Button) ----
function handleAction(action) {
  switch(action) {
    case 'flashcard':
      openFlashCardModal();
      break;
    case 'pdf':
      openPdfModal();
      break;
    case 'video':
      openVideoModal();
      break;
    case 'image':
      document.getElementById('fileInput').click();
      break;
  }
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    State.uploadedFile = ev.target.result;
    showUploadPreview(file.name, file.size, ev.target.result);
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

function showUploadPreview(name, size, src) {
  const preview = document.getElementById('uploadPreview');
  if (!preview) return;
  preview.classList.add('visible');
  preview.querySelector('.upload-preview-img').src = src;
  preview.querySelector('.upload-preview-name').textContent = name;
  preview.querySelector('.upload-preview-size').textContent = formatFileSize(size);
}

function clearUploadPreview() {
  State.uploadedFile = null;
  const preview = document.getElementById('uploadPreview');
  if (preview) preview.classList.remove('visible');
}


// ---- Flash Cards ----
let currentFlashCardSet = [];
let currentFlashCardIndex = 0;

function openFlashCardModal() {
  openModal('flashCardModal');
  currentFlashCardSet = flashCardSets['biyoloji'];
  currentFlashCardIndex = 0;
  renderFlashCard();
}

function renderFlashCard() {
  const container = document.getElementById('flashCardContent');
  if (!container || currentFlashCardSet.length === 0) return;

  const card = currentFlashCardSet[currentFlashCardIndex];
  container.innerHTML = `
    <div class="flashcard-container">
      <div class="flashcard" id="currentFlashCard" onclick="this.classList.toggle('flipped')">
        <div class="flashcard-face flashcard-front">${card.front}</div>
        <div class="flashcard-face flashcard-back">${card.back}</div>
      </div>
    </div>
    <div class="flashcard-nav">
      <button class="flashcard-nav-btn" onclick="prevFlashCard()">${Icons.chevLeft}</button>
      <span class="flashcard-counter">${currentFlashCardIndex + 1} / ${currentFlashCardSet.length}</span>
      <button class="flashcard-nav-btn" onclick="nextFlashCard()">${Icons.chevRight}</button>
    </div>
    <p style="text-align:center;margin-top:12px;font-size:0.75rem;color:var(--text-tertiary)">Cevirmek icin karta tiklayin</p>`;
}

function prevFlashCard() {
  if (currentFlashCardIndex > 0) {
    currentFlashCardIndex--;
    renderFlashCard();
  }
}

function nextFlashCard() {
  if (currentFlashCardIndex < currentFlashCardSet.length - 1) {
    currentFlashCardIndex++;
    renderFlashCard();
  }
}

function selectFlashCardTopic(topic) {
  currentFlashCardSet = flashCardSets[topic] || flashCardSets['biyoloji'];
  currentFlashCardIndex = 0;
  renderFlashCard();
  // Update tab buttons
  document.querySelectorAll('.fc-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.topic === topic);
  });
}


// ---- PDF & Video Modals ----
function openPdfModal() {
  openModal('pdfModal');
}

function openVideoModal() {
  openModal('videoModal');
}

function simulatePdfSummary() {
  const input = document.getElementById('pdfUrlInput');
  if (!input || !input.value.trim()) {
    showToast('Lutfen bir PDF linki girin');
    return;
  }
  closeAllModals();

  // Add to chat
  const welcome = document.getElementById('chatWelcome');
  if (welcome) welcome.style.display = 'none';

  State.messages.push({
    id: Date.now(),
    type: 'user',
    text: `PDF Ozetle: ${input.value.trim()}`,
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  });
  renderChatMessages();
  scrollChatToBottom();

  setTimeout(() => {
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      State.messages.push({
        id: Date.now(),
        type: 'ai',
        text: null,
        error: true,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      });
      saveToStorage();
      renderChatMessages();
      scrollChatToBottom();
    }, 1000);
  }, 400);

  input.value = '';
  switchView('chat');
}

function simulateVideoSummary() {
  const input = document.getElementById('videoUrlInput');
  if (!input || !input.value.trim()) {
    showToast('Lutfen bir video linki girin');
    return;
  }
  closeAllModals();

  const welcome = document.getElementById('chatWelcome');
  if (welcome) welcome.style.display = 'none';

  State.messages.push({
    id: Date.now(),
    type: 'user',
    text: `Video Ozetle: ${input.value.trim()}`,
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  });
  renderChatMessages();
  scrollChatToBottom();

  setTimeout(() => {
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      State.messages.push({
        id: Date.now(),
        type: 'ai',
        text: null,
        error: true,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      });
      saveToStorage();
      renderChatMessages();
      scrollChatToBottom();
    }, 1000);
  }, 400);

  input.value = '';
  switchView('chat');
}


// ---- Community ----
function initCommunity() {
  renderPosts();

  // Tab switching
  document.querySelectorAll('.community-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.community-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderPosts(tab.dataset.filter);
    });
  });
}

function renderPosts(filter = 'all') {
  const container = document.getElementById('postsContainer');
  if (!container) return;

  let posts = State.posts;
  if (filter && filter !== 'all') {
    posts = posts.filter(p => p.category === filter);
  }

  let html = '';
  posts.forEach((post, i) => {
    const catClass = {
      'article': 'cat-article',
      'research': 'cat-research',
      'note': 'cat-note',
      'question': 'cat-question'
    }[post.category] || '';

    const catLabel = {
      'article': 'Makale',
      'research': 'Arastirma',
      'note': 'Not',
      'question': 'Soru'
    }[post.category] || '';

    html += `
      <article class="post-card" onclick="openPostDetail(${post.id})" style="animation-delay: ${i * 0.08}s">
        <div class="post-header">
          <div class="post-avatar" style="background: ${post.author.color}">${post.author.initials}</div>
          <div class="post-meta">
            <div class="post-author">${escapeHtml(post.author.name)}</div>
            <div class="post-date">${post.date}</div>
          </div>
        </div>
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        <div class="post-body"><p>${escapeHtml(post.body).substring(0, 200)}${post.body.length > 200 ? '...' : ''}</p></div>
        <div class="post-tags">
          ${catLabel ? `<span class="post-tag ${catClass}">${catLabel}</span>` : ''}
          ${post.tags.map(t => `<span class="post-tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="post-actions" onclick="event.stopPropagation()">
          <button class="post-action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
            ${post.liked ? Icons.heartFill : Icons.heart}
            <span>${post.likes}</span>
          </button>
          <button class="post-action-btn" onclick="openPostDetail(${post.id})">
            ${Icons.comment}
            <span>${post.comments.length}</span>
          </button>
          <button class="post-action-btn ${post.bookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark(${post.id})">
            ${post.bookmarked ? Icons.bookmarkFill : Icons.bookmark}
          </button>
          <button class="post-action-btn" onclick="sharePost(${post.id})">
            ${Icons.share}
          </button>
        </div>
      </article>`;
  });

  container.innerHTML = html || '<div class="saved-empty"><div class="saved-empty-icon">' + Icons.edit + '</div><h3>Henuz paylasim yok</h3><p>Bu kategoride henuz paylasim bulunmuyor.</p></div>';
}

function renderComments(comments) {
  return comments.map(c => `
    <div class="comment">
      <div class="comment-avatar" style="background: ${c.author.color}">${c.author.initials}</div>
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-author">${escapeHtml(c.author.name)}</span>
          <span class="comment-date">${c.date}</span>
        </div>
        <p class="comment-text">${escapeHtml(c.text)}</p>
      </div>
    </div>
  `).join('');
}

function toggleLike(postId) {
  const post = State.posts.find(p => p.id === postId);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  saveToStorage();
  renderPosts(getCurrentFilter());
}

function toggleBookmark(postId) {
  const post = State.posts.find(p => p.id === postId);
  if (!post) return;
  post.bookmarked = !post.bookmarked;

  if (post.bookmarked) {
    if (!State.savedPosts.includes(postId)) State.savedPosts.push(postId);
    showToast('Kaydedildi');
  } else {
    State.savedPosts = State.savedPosts.filter(id => id !== postId);
    showToast('Kayit kaldirildi');
  }

  saveToStorage();
  renderPosts(getCurrentFilter());
}

function toggleComments(postId) {
  const section = document.getElementById('comments-' + postId);
  if (section) section.classList.toggle('expanded');
}

function submitComment(postId) {
  const input = document.getElementById('commentInput-' + postId);
  if (!input || !input.value.trim()) return;

  const post = State.posts.find(p => p.id === postId);
  if (!post) return;

  post.comments.push({
    id: Date.now(),
    author: { name: 'Kullanici', initials: 'K', color: '#4DBAB0' },
    text: input.value.trim(),
    date: 'Simdi'
  });

  saveToStorage();
  renderPosts(getCurrentFilter());
  // Re-expand comments
  setTimeout(() => {
    const section = document.getElementById('comments-' + postId);
    if (section) section.classList.add('expanded');
  }, 50);

  showToast('Yorum eklendi');
}

function sharePost(postId) {
  const post = State.posts.find(p => p.id === postId);
  if (!post) return;

  if (navigator.share) {
    navigator.share({
      title: post.title,
      text: post.body.substring(0, 100) + '...',
    });
  } else {
    navigator.clipboard.writeText(post.title + '\n\n' + post.body).then(() => {
      showToast('Panoya kopyalandi');
    });
  }
}

function getCurrentFilter() {
  const active = document.querySelector('.community-tab.active');
  return active ? active.dataset.filter : 'all';
}


// ---- Post Detail View ----
let previousView = 'community';

function openPostDetail(postId) {
  const post = State.posts.find(p => p.id === postId);
  if (!post) return;

  previousView = State.currentView;

  // Switch to detail view
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  const detailView = document.getElementById('postDetailView');
  if (detailView) detailView.classList.add('active');

  // Update mobile header
  const mobileTitle = document.querySelector('.mobile-header-title');
  if (mobileTitle) mobileTitle.textContent = 'Paylasim';

  renderPostDetail(post);
}

function renderPostDetail(post) {
  const container = document.getElementById('postDetailContent');
  if (!container) return;

  const catClass = {
    'article': 'cat-article', 'research': 'cat-research',
    'note': 'cat-note', 'question': 'cat-question'
  }[post.category] || '';
  const catLabel = {
    'article': 'Makale', 'research': 'Arastirma',
    'note': 'Not', 'question': 'Soru'
  }[post.category] || '';

  let commentsHtml = '';
  if (post.comments.length === 0) {
    commentsHtml = '<div class="comments-empty">Henuz yorum yapilmamis. Ilk yorumu sen yap!</div>';
  } else {
    commentsHtml = post.comments.map(c => `
      <div class="detail-comment">
        <div class="comment-avatar" style="background:${c.author.color}">${c.author.initials}</div>
        <div class="comment-body">
          <div class="comment-header">
            <span class="comment-author">${escapeHtml(c.author.name)}</span>
            <span class="comment-date">${c.date}</span>
          </div>
          <p class="comment-text">${escapeHtml(c.text)}</p>
        </div>
      </div>
    `).join('');
  }

  container.innerHTML = `
    <article class="post-detail-card">
      <div class="post-header">
        <div class="post-avatar" style="background:${post.author.color}">${post.author.initials}</div>
        <div class="post-meta">
          <div class="post-author">${escapeHtml(post.author.name)}</div>
          <div class="post-date">${post.date}</div>
        </div>
      </div>
      <h3 class="post-title">${escapeHtml(post.title)}</h3>
      <div class="post-body"><p>${escapeHtml(post.body)}</p></div>
      <div class="post-tags">
        ${catLabel ? `<span class="post-tag ${catClass}">${catLabel}</span>` : ''}
        ${post.tags.map(t => `<span class="post-tag">${escapeHtml(t)}</span>`).join('')}
      </div>
      <div class="post-actions">
        <button class="post-action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLikeDetail(${post.id})">
          ${post.liked ? Icons.heartFill : Icons.heart}
          <span>${post.likes}</span>
        </button>
        <button class="post-action-btn">
          ${Icons.comment}
          <span>${post.comments.length}</span>
        </button>
        <button class="post-action-btn ${post.bookmarked ? 'bookmarked' : ''}" onclick="toggleBookmarkDetail(${post.id})">
          ${post.bookmarked ? Icons.bookmarkFill : Icons.bookmark}
        </button>
        <button class="post-action-btn" onclick="sharePost(${post.id})">
          ${Icons.share}
        </button>
      </div>
    </article>

    <div class="detail-comments-section">
      <div class="detail-comments-title">
        Yorumlar <span class="count-badge">${post.comments.length}</span>
      </div>
      ${commentsHtml}
      <div class="detail-comment-input-row">
        <input type="text" class="detail-comment-input" id="detailCommentInput-${post.id}" placeholder="Yorum yaz..." onkeydown="if(event.key==='Enter')submitDetailComment(${post.id})">
        <button class="detail-comment-submit" onclick="submitDetailComment(${post.id})">Gonder</button>
      </div>
    </div>
  `;
}

function closePostDetail() {
  switchView(previousView || 'community');
}

function toggleLikeDetail(postId) {
  const post = State.posts.find(p => p.id === postId);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  saveToStorage();
  renderPostDetail(post);
}

function toggleBookmarkDetail(postId) {
  const post = State.posts.find(p => p.id === postId);
  if (!post) return;
  post.bookmarked = !post.bookmarked;
  if (post.bookmarked) {
    if (!State.savedPosts.includes(postId)) State.savedPosts.push(postId);
    showToast('Kaydedildi');
  } else {
    State.savedPosts = State.savedPosts.filter(id => id !== postId);
    showToast('Kayit kaldirildi');
  }
  saveToStorage();
  renderPostDetail(post);
}

function submitDetailComment(postId) {
  const input = document.getElementById('detailCommentInput-' + postId);
  if (!input || !input.value.trim()) return;
  const post = State.posts.find(p => p.id === postId);
  if (!post) return;

  post.comments.push({
    id: Date.now(),
    author: { name: 'Kullanici', initials: 'K', color: '#4DBAB0' },
    text: input.value.trim(),
    date: 'Simdi'
  });
  saveToStorage();
  renderPostDetail(post);
  showToast('Yorum eklendi');
}


// ---- Create Post ----
function openCreatePostModal() {
  openModal('createPostModal');
  // Clear form
  const form = document.getElementById('createPostForm');
  if (form) form.reset();
  // Clear tags
  const tagsContainer = document.getElementById('postTagsContainer');
  if (tagsContainer) tagsContainer.innerHTML = '<input type="text" class="form-tag-input" id="postTagInput" placeholder="Etiket ekle...">';
  initTagInput();
}

let postTags = [];

function initTagInput() {
  const input = document.getElementById('postTagInput');
  if (!input) return;
  postTags = [];

  input.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
      e.preventDefault();
      addPostTag(input.value.trim());
      input.value = '';
    }
    if (e.key === 'Backspace' && !input.value && postTags.length > 0) {
      removePostTag(postTags.length - 1);
    }
  });
}

function addPostTag(tag) {
  if (postTags.includes(tag) || postTags.length >= 5) return;
  postTags.push(tag);
  renderPostTags();
}

function removePostTag(index) {
  postTags.splice(index, 1);
  renderPostTags();
}

function renderPostTags() {
  const container = document.getElementById('postTagsContainer');
  if (!container) return;

  let html = postTags.map((tag, i) => `
    <span class="form-tag-chip">
      ${escapeHtml(tag)}
      <button onclick="removePostTag(${i})">&times;</button>
    </span>
  `).join('');
  html += '<input type="text" class="form-tag-input" id="postTagInput" placeholder="Etiket ekle...">';
  container.innerHTML = html;
  initTagInput();
}

function submitPost() {
  const title = document.getElementById('postTitleInput').value.trim();
  const body = document.getElementById('postBodyInput').value.trim();
  const category = document.getElementById('postCategorySelect').value;

  if (!title || !body) {
    showToast('Lutfen baslik ve icerik girin');
    return;
  }

  const newPost = {
    id: Date.now(),
    author: { name: 'Kullanici', initials: 'K', color: '#4DBAB0' },
    title: title,
    body: body,
    tags: [...postTags],
    category: category,
    likes: 0,
    liked: false,
    bookmarked: false,
    date: 'Simdi',
    comments: []
  };

  State.posts.unshift(newPost);
  saveToStorage();
  closeAllModals();
  renderPosts(getCurrentFilter());
  showToast('Paylasim olusturuldu!');
}


// ---- Saved View ----
function renderSavedView() {
  const container = document.getElementById('savedContent');
  if (!container) return;

  const savedPosts = State.posts.filter(p => p.bookmarked);

  if (savedPosts.length === 0) {
    container.innerHTML = `
      <div class="saved-empty">
        <div class="saved-empty-icon">${Icons.bookmark}</div>
        <h3>Henuz kayit yok</h3>
        <p>Begendigniz paylasimlari kaydedin, burada gorunsun.</p>
      </div>`;
    return;
  }

  let html = '';
  savedPosts.forEach((post, i) => {
    html += `
      <article class="post-card" style="animation-delay: ${i * 0.08}s">
        <div class="post-header">
          <div class="post-avatar" style="background: ${post.author.color}">${post.author.initials}</div>
          <div class="post-meta">
            <div class="post-author">${escapeHtml(post.author.name)}</div>
            <div class="post-date">${post.date}</div>
          </div>
        </div>
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        <div class="post-body"><p>${escapeHtml(post.body).substring(0, 150)}...</p></div>
        <div class="post-actions">
          <button class="post-action-btn liked" onclick="toggleLike(${post.id})">
            ${Icons.heartFill}
            <span>${post.likes}</span>
          </button>
          <button class="post-action-btn bookmarked" onclick="toggleBookmark(${post.id}); renderSavedView();">
            ${Icons.bookmarkFill}
          </button>
        </div>
      </article>`;
  });

  container.innerHTML = html;
}


// ---- Modals ----
function initModals() {
  // Close on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  // Close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // Tag input init
  initTagInput();
}

function openModal(id) {
  const backdrop = document.getElementById(id);
  if (backdrop) {
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(el => {
    el.classList.remove('visible');
  });
  document.body.style.overflow = '';
}


// ---- Toast Notifications ----
function showToast(message, icon = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `${icon ? `<span class="toast-icon">${icon}</span>` : ''}${escapeHtml(message)}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 200);
  }, 2500);
}


// ---- Utility Functions ----
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatMarkdown(text) {
  if (!text) return '';
  let html = escapeHtml(text);

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Inline code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Lists
  html = html.replace(/^- (.*)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Numbered lists
  html = html.replace(/^\d+\. (.*)/gm, '<li>$1</li>');

  // Line breaks to paragraphs
  html = html.split('\n\n').map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<')) return p;
    return `<p>${p}</p>`;
  }).join('');

  // Single newlines to <br>
  html = html.replace(/([^>])\n([^<])/g, '$1<br>$2');

  return html;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Make functions globally available for onclick handlers
window.toggleLike = toggleLike;
window.toggleBookmark = toggleBookmark;
window.toggleComments = toggleComments;
window.submitComment = submitComment;
window.sharePost = sharePost;
window.openCreatePostModal = openCreatePostModal;
window.submitPost = submitPost;
window.prevFlashCard = prevFlashCard;
window.nextFlashCard = nextFlashCard;
window.selectFlashCardTopic = selectFlashCardTopic;
window.simulatePdfSummary = simulatePdfSummary;
window.simulateVideoSummary = simulateVideoSummary;
window.loadChatHistory = loadChatHistory;
window.clearUploadPreview = clearUploadPreview;
window.toggleTheme = toggleTheme;
window.State = State;
window.saveToStorage = saveToStorage;
window.renderChatMessages = renderChatMessages;
window.closeAllModals = closeAllModals;
window.removePostTag = removePostTag;
window.renderSavedView = renderSavedView;
window.openPostDetail = openPostDetail;
window.closePostDetail = closePostDetail;
window.toggleLikeDetail = toggleLikeDetail;
window.toggleBookmarkDetail = toggleBookmarkDetail;
window.submitDetailComment = submitDetailComment;
