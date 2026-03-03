/* ============================================
   BioArchive - State Yonetimi
   ============================================ */

const State = {
  currentView: 'chat',
  user: null,
  messages: [],
  posts: [],
  savedPosts: [],
  isTyping: false,
  actionMenuOpen: false,
  uploadedFile: null,
  chatHistories: [],
  currentChatId: null,
  currentConversationId: null,
  theme: localStorage.getItem(Config.STORAGE_KEYS.THEME) || 'light',
  isOnline: true, // API'ye erisim var mi?
};

// ---- Ornek Veri (Offline mod icin) ----
const SampleData = {
  posts: [
    {
      id: 1,
      author: { displayName: 'Dr. Ayse Kaya', initials: 'AK', avatarColor: '#4DBAB0' },
      title: 'CRISPR-Cas9 ile Genom Duzenleme: Son Gelismeler',
      body: 'CRISPR teknolojisindeki son gelismeler, genetik hastaliklarin tedavisinde umut verici sonuclar ortaya koyuyor. Ozellikle orak hucre anemisi ve beta talasemi gibi kan hastaliklarinda klinik deneylerde basarili sonuclar elde edildi.',
      tags: ['Genetik', 'CRISPR'],
      category: 'article',
      likesCount: 47,
      liked: false,
      bookmarked: false,
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      comments: [
        { id: 1, author: { displayName: 'Mehmet Demir', initials: 'MD', avatarColor: '#8B6CC1' }, content: 'Harika bir ozet olmus, tesekkurler!', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 2, author: { displayName: 'Elif Yildiz', initials: 'EY', avatarColor: '#D94F7A' }, content: 'CRISPR-Cas12 hakkinda da bir paylasim yapar misiniz?', createdAt: new Date(Date.now() - 2700000).toISOString() },
      ]
    },
    {
      id: 2,
      author: { displayName: 'Prof. Burak Ozturk', initials: 'BO', avatarColor: '#4A90D9' },
      title: 'Deniz Biyolojisi: Mercan Resifleri ve Iklim Degisikligi',
      body: 'Buyuk Set Resifi\'ndeki agartma olaylari son 5 yilda dramatik bir artis gosterdi. Okyanus sicakliklarindaki 1.5°C\'lik artis bile mercan ekosistemlerini ciddi sekilde tehdit ediyor.',
      tags: ['Deniz Biyolojisi', 'Ekoloji'],
      category: 'research',
      likesCount: 32,
      liked: false,
      bookmarked: false,
      createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
      comments: [
        { id: 3, author: { displayName: 'Zeynep Arslan', initials: 'ZA', avatarColor: '#3DAE85' }, content: 'Akdeniz\'deki mercan turleri icin de benzer bir tehdit soz konusu mu?', createdAt: new Date(Date.now() - 3 * 3600000).toISOString() },
      ]
    },
    {
      id: 3,
      author: { displayName: 'Selin Aksoy', initials: 'SA', avatarColor: '#E8853D' },
      title: 'Mitoz ve Mayoz Bolunme Karsilastirmasi',
      body: 'Hucre bolunmesinin iki temel tipi olan mitoz ve mayoz, farkli amaclarla gerceklesir. Mitoz buyume ve onarim icin, mayoz ise ureme hucreleri olusturmak icin gereklidir.',
      tags: ['Hucre Biyolojisi', 'Not'],
      category: 'note',
      likesCount: 18,
      liked: false,
      bookmarked: false,
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      comments: []
    },
    {
      id: 4,
      author: { displayName: 'Can Yilmaz', initials: 'CY', avatarColor: '#D94F7A' },
      title: 'Protein sentezi asamalarinda kafam karisti',
      body: 'Arkadaslar, transkripsiyon ve translasyon arasindaki farki bir turlu oturtamiyorum. RNA polimeraz ve ribozomun rolu hakkinda yardimci olabilecek var mi?',
      tags: ['Molekuler Biyoloji', 'Soru'],
      category: 'question',
      likesCount: 8,
      liked: false,
      bookmarked: false,
      createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
      comments: [
        { id: 4, author: { displayName: 'Dr. Ayse Kaya', initials: 'AK', avatarColor: '#4DBAB0' }, content: 'Transkripsiyon cekirdekte, translasyon sitoplazmada gerceklesir.', createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
      ]
    },
  ],

  chatHistories: [
    { id: 'c1', title: 'DNA Replikasyonu', date: 'Bugun' },
    { id: 'c2', title: 'Fotosentez sureci', date: 'Dun' },
    { id: 'c3', title: 'Evrim mekanizmalari', date: '2 gun once' },
  ],

  flashCardSets: {
    'biyoloji': [
      { front: 'Mitokondri nedir?', back: 'Hucrenin enerji santrali olarak bilinen, ATP ureten organeldir. Cift zar yapisina sahiptir ve kendi DNA\'sina sahiptir.' },
      { front: 'Osmoz nedir?', back: 'Suyun, yari gecirgen bir zardan, dusuk cozunur konsantrasyonlu ortamdan yuksek cozunur konsantrasyonlu ortama dogru hareketi.' },
      { front: 'Enzim nedir?', back: 'Biyolojik katalizorlerdir. Kimyasal reaksiyonlarin aktivasyon enerjisini dusurerek reaksiyon hizini artirirlar.' },
      { front: 'Meioz kac asama icerir?', back: 'Iki asama icerir: Meioz I (indirgenme bolunmesi) ve Meioz II (esitsel bolunme). Sonucta 4 haploid hucre olusur.' },
      { front: 'Fotosentezin genel denklemi?', back: '6CO₂ + 6H₂O + Isik → C₆H₁₂O₆ + 6O₂' },
      { front: 'DNA\'nin yapisi?', back: 'Cift sarmal yapisinda, nukleotidlerden olusur. Her nukleotid: fosforik asit + deoksiriboz seker + azotlu baz (A-T, G-C) icerir.' },
    ],
    'genetik': [
      { front: 'Genotip nedir?', back: 'Bir organizmanin genetik yapisidir. Alel cifleri ile ifade edilir (ornegin Aa, BB).' },
      { front: 'Fenotip nedir?', back: 'Bir organizmanin gozlenebilir ozellikleridir. Genotip ve cevre etkilesimi sonucu ortaya cikar.' },
      { front: 'Dominant alel?', back: 'Heterozigot durumda bile etkisini gosteren aleldir. Buyuk harf ile gosterilir (A).' },
      { front: 'Kodominans?', back: 'Her iki alelin de fenotipte esit sekilde ifade edildigi durumdur. Ornek: AB kan grubu.' },
    ]
  },

  aiResponses: {
    'dna': '**DNA Replikasyonu**\n\nDNA replikasyonu, hucre bolunmesi oncesinde genetik materyalin kopyalanmasi surecidir.\n\n**Temel Asamalar:**\n\n1. **Baslatma:** Helikaz enzimi, DNA cift sarmalini acar.\n2. **Uzama:** DNA polimeraz III, nukleotidleri ekler.\n3. **Sonlanma:** Replikasyon catallari birlesir.',
    'fotosentez': '**Fotosentez Sureci**\n\n6CO₂ + 6H₂O + Isik → C₆H₁₂O₆ + 6O₂\n\n1. **Isiga Bagli Reaksiyonlar (Tilakoid)**\n2. **Calvin Dongusu (Stroma)**',
    'hucre': '**Hucre Zarinin Yapisi**\n\nAkici Mozaik Modeli:\n- Fosfolipit Cift Tabakasi\n- Membran Proteinleri\n- Kolesterol\n- Karbohidratlar',
    'evrim': '**Evrim Teorisi**\n\n1. Dogal Secilim\n2. Mutasyon\n3. Genetik Suruklenme\n4. Gen Akisi',
    'default': 'Bu ilginc bir konu! Daha spesifik bir soru sormak ister misiniz?'
  },

  suggestedPrompts: [
    'DNA replikasyonu nasil calisir?',
    'Fotosentez surecini detayli acikla',
    'Hucre zarinin yapisini anlat',
    'Evrim teorisinin temel ilkeleri nelerdir?',
  ],
};

// ---- Storage Fonksiyonlari ----
function loadFromStorage() {
  // Kullanici bilgisi
  const savedUser = localStorage.getItem(Config.STORAGE_KEYS.USER);
  if (savedUser) {
    try { State.user = JSON.parse(savedUser); } catch { State.user = null; }
  }

  // Postlar
  const savedPosts = localStorage.getItem(Config.STORAGE_KEYS.POSTS);
  if (savedPosts) {
    try { State.posts = JSON.parse(savedPosts); } catch { State.posts = [...SampleData.posts]; }
  } else {
    State.posts = [...SampleData.posts];
  }

  // Kaydedilenler
  const savedBookmarks = localStorage.getItem(Config.STORAGE_KEYS.SAVED);
  if (savedBookmarks) {
    try { State.savedPosts = JSON.parse(savedBookmarks); } catch { State.savedPosts = []; }
  }

  // Mesajlar
  const savedMessages = localStorage.getItem(Config.STORAGE_KEYS.MESSAGES);
  if (savedMessages) {
    try { State.messages = JSON.parse(savedMessages); } catch { State.messages = []; }
  }
}

function saveToStorage() {
  localStorage.setItem(Config.STORAGE_KEYS.POSTS, JSON.stringify(State.posts));
  localStorage.setItem(Config.STORAGE_KEYS.SAVED, JSON.stringify(State.savedPosts));
  localStorage.setItem(Config.STORAGE_KEYS.MESSAGES, JSON.stringify(State.messages));
  if (State.user) {
    localStorage.setItem(Config.STORAGE_KEYS.USER, JSON.stringify(State.user));
  }
}
