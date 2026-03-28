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

    // ---- Veteriner / Hayvan Bilimleri ----

    'kedi_bobrek': '## Kedilerde Kronik Bobrek Hastaligi (KBH)\n\nKronik bobrek hastaligi (KBH), ozellikle ileri yastaki kedilerde en sik karsilasilan sistemik hastaliklar arasinda yer alir. 15 yas ustu kedilerin yaklasik **%30-40**\'inda KBH tespit edilmektedir.\n\n### Etiyoloji (Neden Olusur?)\n\nKBH\'nin olusumunda birden fazla faktor rol oynar:\n\n- **Tubulointerstitiyel nefrit:** En yaygin histopatolojik bulgudur. Bobrek tubuluslerinde kronik iltihap ve fibrozis gorulur.\n- **Iskemi ve hipoksi:** Bobrek dokusuna yetersiz kan akimi, nefron kaybiyla sonuclanir.\n- **Genetik yatkinlik:** Ozellikle Pers ve Abyssinian irklarinda polikistik bobrek hastaligi (PKD) sik gorulur.\n- **Kronik dehidratasyon:** Dusuk nemli diyetler (kuru mama agirlikli beslenme) bobrek uzerindeki yuku artirir.\n- **Yaslanma:** Ilerleyen yasla birlikte fonksiyonel nefron sayisi dogal olarak azalir.\n\n### Klinik Belirtiler\n\n| Evre | Belirtiler |\n|------|------------|\n| **Evre I-II** | Poliuri (cok idrara cikma), polidipsi (cok su icme), hafif kilo kaybi |\n| **Evre III** | Istahsizlik, kusma, dehidratasyon, kas erimesi, matlasmis tuy yapisi |\n| **Evre IV** | Siddetli uremik sendrom, agiz ulserasyon-lari, norolojik belirtiler, anemi, metabolik asidoz |\n\n### Tani Yontemleri\n\n- **Serum biyokimyasi:** BUN, kreatinin ve SDMA duzeyleri degerlendirilir. SDMA, kreatinine gore daha erken donemde yukselme gosterir.\n- **Tam idrar analizi:** Dusuk idrar yogunlugu (izosthenuria, USG < 1.035) onemli bir bulgudur.\n- **Ultrasonografi:** Bobrek boyutu, ekojenite artisi ve yapisal degisiklikler incelenir.\n- **IRIS Evrelemesi:** International Renal Interest Society kriterlerine gore hastalik 4 evrede siniflandirilir.\n\n### Tedavi Yaklasimi\n\nKBH\'de tedavi kur saglayici degil, **hastaligi yavaslatma ve yasam kalitesini artirma** amaciyla uygulanir:\n\n- Renal diyet (dusuk fosfor, sinirli protein)\n- Subkutan sivi tedavisi\n- Fosfor baglayicilar ve potasyum takviyesi\n- ACE inhibitorleri (proteinuri kontrolu)\n- Anti-emetikler (mide bulantisi icin)\n\n---\n**Kaynak:** Reynolds, B.S. & Bhatt, D.L. (2013). *Feline chronic kidney disease: Pathophysiology and management.* Journal of Feline Medicine and Surgery, 15(9), 733-752. [PubMed: 23811694](https://pubmed.ncbi.nlm.nih.gov/23811694/)',

    'kedi_hipertiroidi': '## Kedilerde Hipertiroidizm\n\nFelin hipertiroidizm, kedilerde en sik teshis edilen endokrin bozukluktur. Genellikle **10 yas ve uzeri** kedilerde gorulur ve tiroid bezinin asiri hormon uretmesiyle karakterizedir.\n\n### Patofizyoloji (Nasil Gelisir?)\n\n- **Tiroid adenomu:** Vakalarin **%97-99**\'unda benign (iyi huylu) tiroid adenomatoz hiperplazisi veya adenomu sorumludur. Malign tiroid karsinomu oldukca nadirdir (%1-3).\n- **Bilateral tutulum:** Vakalarin yaklasik **%70**\'inde her iki tiroid lobu da etkilenir.\n- **Artmis T4 uretimi:** Hiperplastik tiroid dokusu, TSH\'den bagimsiz olarak asiri triiyodotironin (T3) ve tiroksin (T4) salgilar.\n\n### Olasi Risk Faktorleri\n\n- Konserve mama tuketimi (ozellikle pop-top kutu kapakli olanlar)\n- Cevresel endokrin bozucular (PBDE - polibrominli difenil eterler)\n- Soya bazli bilesenler iceren diyetler\n- Ic mekan yasam tarzi\n\n### Klinik Bulgular\n\n- **Kilo kaybi** (artmis istaha ragmen - polifaji)\n- **Tasikardi** (kalp hizi > 240 atim/dk)\n- **Poliuri ve polidipsi** (cok idrara cikma, cok su icme)\n- **Hiperaktivite**, huzursuzluk, agresyon\n- **Kusma ve ishal**\n- **Tuy dokulumu**, matlasmis tuy yapisi\n- **Palpe edilebilir tiroid nodulu** (boyun bolgesi muayenesi)\n\n### Tani\n\n- **Serum total T4 olcumu:** Cogu vakada belirgin yuksektir (>4 µg/dL). Normal T4 hastaligi dislamaz.\n- **Serbest T4 (fT4):** Total T4 normal sinirda olan suphe olgularda daha sensitiftir.\n- **Tiroid sintigrafisi (Tc-99m):** Bilateral tutulumu ve ektopik tiroid dokusunu gosterir.\n\n### Tedavi Secenekleri\n\n| Yontem | Aciklama |\n|--------|----------|\n| **Metimazol** | Anti-tiroid ilac; hormon sentezini inhibe eder. Oral veya transdermal uygulanir. |\n| **Radyoaktif iyot (I-131)** | Altin standart tedavi. Tek doz enjeksiyonla hiperplastik doku selektif olarak yok edilir. |\n| **Cerrahi tiroidektomi** | Bilateral tutulumda dikkatli cerrahi gerektirir; paratiroid hasar riski vardir. |\n| **Iyot kisitli diyet** | Hill\'s y/d gibi diyetler, hafif vakalarda alternatif olarak kullanilabilir. |\n\n---\n**Kaynak:** Peterson, M.E. (2012). *Hyperthyroidism in cats: What\'s causing this epidemic of thyroid disease and can we prevent it?* Journal of Feline Medicine and Surgery, 14(11), 804-818. [PubMed: 22154541](https://pubmed.ncbi.nlm.nih.gov/22154541/)',

    'kedi_fip': '## Feline Infeksiyoz Peritonit (FIP)\n\nFIP, kedilerde felin koronavirusun (FCoV) mutasyona ugramis formu tarafindan olusturulan, progressif ve genellikle olumcul seyreden bir viral hastaliktir.\n\n### Patogenez (Nasil Ilerler?)\n\n**1. Felin Koronavirus (FCoV) Enfeksiyonu**\n- Kedilerin buyuk cogunlugu (%25-40) FCoV ile enfektedir, ozellikle cok kedili ortamlarda bu oran %80-90\'a cikar.\n- FCoV genellikle hafif enterit (bagirsak iltihabı) veya asemptomatik enfeksiyona neden olur.\n\n**2. Virulensi Yuksek Mutasyon**\n- FCoV\'un makrofaj tropizmi kazandigi mutasyonlar sonucu virus, FIPV (FIP virusu) formuna donusur.\n- Bu mutasyon, virusun monosit/makrofajlarda replike olabilmesini saglar.\n\n**3. Immunopatoloji**\n- FIPV enfekte makrofajlar vaskuler endotele tutunur ve **piyogranulomatoz vaskulit** olusturur.\n- Immun kompleks birikimi, kompleman aktivasyonu ve sitokin firtinasi hastalik patogenezinin temelini olusturur.\n- **Hucrelerarasi bagisiklik** guclu kedilerde hastalik gelismeyebilir; **humoral bagisiklik** baskin olanlarda hastalik ilerler.\n\n### Klinik Formlar\n\n**Efuzif (Yas) Form:**\n- Karin veya gogus bosluklarinda protein zengini sari efuzyon birikimi\n- Abdominal distansiyon, solunum guclugu\n- Ates, kilo kaybi, istahsizlik\n\n**Non-efuzif (Kuru) Form:**\n- Granulomatoz lezyonlar: bobrekler, karaciger, dalak, lenf dugumleri, gozler, MSS\n- Norolojik belirtiler: ataksi, nistagmus, nobet\n- Okuler belirtiler: uveit, retinal vaskulit\n- Kronik ates, kilo kaybi\n\n### Tani Zorlugu\n\nFIP tanisi klinik pratikte en zorlayici tanilardan biridir:\n\n- **Efuzyon analizi:** Rivalta testi pozitif, protein > 3.5 g/dL, albumin/globulin orani < 0.4\n- **Serum biyokimyasi:** Hiperglobulinemi, dusuk A:G orani\n- **RT-PCR:** Efuzyon veya dokuda FCoV RNA tespiti\n- **Immunohistokimya:** Dokularda FCoV antijeninin gosterilmesi (kesin tani)\n\n### Tedavide Yeni Gelismeler\n\nGectigimiz yillarda FIP tedavisinde devrim niteliginde gelismeler yasanmistir:\n\n- **GS-441524** (nukleozid analoğu): Antiviral etki ile remisyon saglayan calismalar dikkat cekmistir.\n- **GC376** (proteaz inhibitoru): Klinik deneylerde umut verici sonuclar elde edilmistir.\n- Destek tedavisi: Anti-inflamatuvar tedavi, immun modulasyon, nutrisyonel destek.\n\n---\n**Kaynak:** Pedersen, N.C. (2020). *The long history of feline infectious peritonitis and recent advances in understanding its pathogenesis, treatment, and prevention.* Veterinary Journal, 268, 105592. [PubMed: 32994336](https://pubmed.ncbi.nlm.nih.gov/32994336/)',

    'kopek_kalp_kurdu': '## Kopeklerde Kalp Kurdu Hastaligi (Dirofilariosis)\n\nKalp kurdu hastaligi, **Dirofilaria immitis** adli nematodun (ipliksi solucan) neden oldugu, kardiyopulmoner sistemi etkileyen ciddi ve potansiyel olarak olumcul bir paraziter hastaliktir.\n\n### Yasam Dongusu ve Bulasma\n\n**Vektor:** Sivrisinekler (Aedes, Culex, Anopheles turleri)\n\n1. **Enfekte sivrisinek** kopegi isirdiginda L3 evre larvalar deri altina birakir.\n2. Larvalar **deri altinda L4 ve L5 evreye** gelisir (2-3 ay).\n3. Genc eriskinler kan dolasimiyla **pulmoner arterlere** ve agir enfeksiyonlarda **sag kalbe** ulasir.\n4. Eriskin solucanlar **15-30 cm** uzunluga erisir ve 5-7 yil yasayabilir.\n5. Eriskin disiler **mikrofilaryalar** uretir; bunlar kan dolasimina karisir ve yeni sivrisinekler tarafindan alinir.\n6. **Prepatent periyot** (enfeksiyondan eriskin olgunlasmaya kadar): yaklasik **6-7 ay**.\n\n### Klinik Bulgular\n\n| Sinif | Bulgular |\n|-------|----------|\n| **Sinif I (Hafif)** | Asemptomatik veya ara sira oksuruk |\n| **Sinif II (Orta)** | Oksuruk, egzersiz intoleransi, hafif radyografik bulgular |\n| **Sinif III (Agir)** | Kronik oksuruk, dispne, sag kalp yetmezligi bulgulari (asit, jugular dolgunluk), kaeksi |\n| **Sinif IV (Caval Sendrom)** | Akut hemolitik kriz, sok, DIC, olum. Sag atriyum ve vena kavada solucan yigisimi |\n\n### Tani\n\n- **Antijen testi (ELISA/SNAP):** Eriskin disi solucanlarin salgiladigi antijenleri tespit eder. Enfeksiyondan en az 6-7 ay sonra pozitiflesir.\n- **Mikrofilari tespiti:** Modifiye Knott testi veya filtre testi ile periferal kanda L1 larva aranir.\n- **Torakal radyografi:** Pulmoner arter genislemesi, sag ventrikul buyumesi.\n- **Ekokardiyografi:** Pulmoner arterlerde veya sag kalpte solucanlar gorulebilir.\n\n### Tedavi Protokolu\n\n**Adulticid tedavi (Eriskin solucan oldurmesi):**\n- **Melarsomin dihidroklorid** (Immiticide): AHS (American Heartworm Society) protokolune gore 3 enjeksiyon (1. gun → 1 ay ara → 2 ardisik gun).\n- Tedavi oncesi ve sonrasi **kesin egzersiz kisitlamasi** (pulmoner tromboemboli riski!).\n- **Doksisiklin** (4 hafta): Wolbachia endosimbiyontunu elimine eder.\n- **Prednizolon**: Anti-inflamatuvar destek.\n\n**Mikrofilaricid tedavi:** Lakton grubu endektositler (ivermektin, milbemisin oksim).\n\n**Profilaksi (Koruma):**\n- Aylik ivermektin, milbemisin oksim veya moksidestin bazli koruyucu ilaclar.\n- Yillik antijen testi ile tarama.\n\n---\n**Kaynak:** American Heartworm Society. (2014). *Current canine guidelines for the prevention, diagnosis, and management of heartworm infection in dogs.* [PubMed: 24390396](https://pubmed.ncbi.nlm.nih.gov/24390396/)',

    'kopek_kalca_displazisi': '## Kopeklerde Kalca Displazisi (Hip Dysplasia)\n\nKalca displazisi, kalca ekleminin (koksofemoral eklem) anormal gelisimiyle karakterize edilen, **multifaktoriyel ve herediter** bir ortopedik hastaliktir. Buyuk ve dev irk kopeklerde yaygindir.\n\n### Etiyoloji ve Patogenez\n\n**Genetik Faktorler:**\n- Poligenik kalitim modeli ile aktarilir (tek gen degil, birden fazla gen sorumludur).\n- Yuksek riskli irklar: Alman Coban, Labrador Retriever, Golden Retriever, Rottweiler, Saint Bernard, Bulldog.\n- Kalitim orani (heritabilite): irklar arasi degiskenliktir, ortalama **%0.2-0.6** arasindadir.\n\n**Cevresel Faktorler:**\n- **Hizli buyume ve asiri beslenme:** Yavru donemde yuksek kalorili ve kalsiyum agirlikli diyet, eklem gelisimini olumsuz etkiler.\n- **Asiri egzersiz:** Yavru donemde agir egzersiz, olgunlasmamis eklem yapilarinda hasar olusturur.\n- **Obezite:** Eklem uzerindeki mekanik yuklemenin artmasi, displazinin klinik belirtilerini agrlestirir.\n\n**Patoloji:**\n1. Femur basi ile asetabulum arasi uyumsuzluk (eklem gevşekliği - laxity)\n2. Subluksasyon (kismi cikik) ve anormal eklem yuklenmesi\n3. Eklem kikilrdak erozyonu ve sinoviyal iltihap\n4. Sekonder osteoartrit gelisimi (dejeneratif eklem hastaligi)\n\n### Klinik Belirtiler\n\n**Yavru donem (5-12 ay):**\n- Arka bacaklarda topallama, \"tavsan ziplama\" seklinde kosma\n- Ayaga kalkmada gucluk\n- Egzersiz intoleransi, oynamak istememe\n\n**Eriskin donem (kronik):**\n- Kronik arka bacak topalligi\n- Kas atrofisi (uyluk kaslarinda erime)\n- Merdiven cikmada zorluk\n- Eklem hareketinde agri, krepitasyon (eklem sesi)\n- Soguk havalarda ve uzun istirahat sonrasi semptomlarin artmasi\n\n### Tani\n\n- **Ortolani testi:** Fizik muayenede eklem gevşekliğini degerlendiren manipulatif test.\n- **Pelvik radyografi (VD pozisyon):** Norberg acisi < 105° patolojik kabul edilir.\n- **PennHIP yontemi:** Distraksiyon indeksi (DI) olcumu; hassasiyet orani yuksektir.\n- **BT / MR:** Ileri vakalarda eklem yapisinin detayli degerlendirilmesi.\n\n### Tedavi\n\n**Konservatif (Cerrahi Disi):**\n- Kilo kontrolu ve diyet duzenlenmesi\n- NSAID\'ler (meloksikam, karprofen) - agri ve iltihap kontrolu\n- Glukozamin, kondroitin sulfat takviyesi\n- Fizik tedavi ve rehabilitasyon (hidroterapi, kontollu egzersiz)\n\n**Cerrahi Secenekler:**\n- **Triple pelvik osteotomi (TPO):** Genc hayvanlarda, henuz artrit gelismeden uygulanir.\n- **Femur basi eksizyonu (FHO):** Kucuk irklarda veya ekonomik kisitlama olanlarda tercih edilir.\n- **Total kalca protezi (THP):** Altin standart; agir vakalarda tam fonksiyon restorasyonu saglar.\n\n---\n**Kaynak:** Fries, C.L. & Remedios, A.M. (2016). *Treatment of canine hip dysplasia: A review.* Canadian Veterinary Journal, 36(8), 494-502. [PubMed: 27687915](https://pubmed.ncbi.nlm.nih.gov/27687915/)',

    'kopek_diyabet': '## Kopeklerde Diabetes Mellitus\n\nDiabetes mellitus (DM), insülin eksikligi veya insülin direnci sonucu olusan kronik bir metabolik hastalikdir. Kopeklerde en sik **Tip 1 diyabet** (insülin bagimlı) gorulur.\n\n### Etiyoloji\n\n- **Immun aracili beta hucre yikimi:** Pankreas Langerhans adaciklarin-daki beta hücrelerin otoimmun tahribi en yaygin nedendir.\n- **Pankreatit:** Kronik veya tekrarlayan pankreatit, beta hucre hasari olusturabilir.\n- **Genetik yatkinlik:** Samoyed, Avustralya Teriyeri, Schnauzer, Bichon Frise, Poodle gibi irklarda daha sik gorulur.\n- **Dioestrus (Progesteron iliskili):** Kisirlaştirilmamis disi kopeklerde progesteron kaynakli buyume hormonu artisi, gecici insülin direnci olusturabilir.\n- **Obezite ve yaslilik:** Risk faktorleridir.\n\n### Klinik Belirtiler (Klasik Dort P)\n\n1. **Poliuri** - Artmis idrar miktari (osmotik diurez)\n2. **Polidipsi** - Asiri su icme (dehidrasyonu telafi)\n3. **Polifaji** - Artmis istah (hucreler glikozu kullanamaz)\n4. **Kilo kaybi** - Yag ve kas yikimi (katabolik durum)\n\nIleri vakalarda:\n- **Diyabetik ketoasidoz (DKA):** Kusma, dehidratasyon, Kussmaul solunumu, aseton kokusu, letarji → acil durumdur!\n- **Diyabetik katarakt:** Kopeklerde cok yaygindir (%80); lens fibrillerinde sorbitol birikimi.\n- **Hepatomegali:** Hepatik lipidoz.\n\n### Tani\n\n- **Kan glikozu:** Aclik kan sekeri > 200 mg/dL (persistan hiperglisemi).\n- **Fruktosamin:** Son 2-3 haftalik ortalama glisemik kontrolu yansitir (> 400 µmol/L).\n- **Tam idrar analizi:** Glikozuri (idrarda seker), ketonuri (ketoasidoz gostergesi).\n- **Serum biyokimyasi:** Hiperkolesterolemi, artmis ALT, ALP.\n- **Pankreas spesifik lipaz (cPLI):** Eslik eden pankreatiti degerlendirmek icin.\n\n### Tedavi\n\n**Insülin Tedavisi:**\n- **Orta etkili insülin (Caninsulin/Vetpen - porsin lente insülin):** Baslangiç dozu 0.25-0.5 IU/kg, 12 saatte bir SC enjeksiyon.\n- **Glisemik egri:** 12-24 saatlik kan sekeri takibi ile doz ayarlamasi.\n- Hedef: Kan glikozu 100-250 mg/dL arasinda tutmak.\n\n**Diyet Yonetimi:**\n- Yuksek lifli, kompleks karbohidratli diyet\n- Sabit yemek saatleri (insülin enjeksiyonu ile senkronize)\n- Obez hastalarda kilo verme programi\n\n**Disi Kopeklerde:** Ovariohisterektomi (kisirlaştirma) onerilir → progesteron kaynakli insülin direncini ortadan kaldirir.\n\n**Izleme:** Duzenli fruktosamin olcumu, glisemik egri takibi, idrar analizi.\n\n---\n**Kaynak:** Catchpole, B. et al. (2013). *Canine diabetes mellitus: Can old dogs teach us new tricks?* Diabetologia, 48(10), 1948-1956. [PubMed: 24985109](https://pubmed.ncbi.nlm.nih.gov/24985109/)',

    'sigir_solunum': '## Sigirlarda Solunum Yolu Hastaliklari (Bovine Respiratory Disease - BRD)\n\nBovine Respiratory Disease (BRD), sigir yetistiriciligi-nin dunya genelinde en onemli saglik ve ekonomik sorunlarindan biridir. ABD\'de yillik **1 milyar dolardan fazla** ekonomik kayba neden olmaktadir.\n\n### Etiyoloji (Multifaktoriyel)\n\nBRD, **stres + viral enfeksiyon + bakteriyel superenfeksiyon** uclusunun etkilesimiyle ortaya cikar:\n\n**Viral Etkenler (Primer):**\n- **BRSV** (Bovine Respiratory Syncytial Virus)\n- **BHV-1** (Bovine Herpesvirus-1 / IBR virusu)\n- **BVDV** (Bovine Viral Diarrhea Virus)\n- **PI-3** (Parainfluenza-3 virusu)\n\n**Bakteriyel Etkenler (Sekonder):**\n- *Mannheimia haemolytica* (en yaygin)\n- *Pasteurella multocida*\n- *Histophilus somni*\n- *Mycoplasma bovis*\n\n**Stres ve Predispozan Faktorler:**\n- Tasinma stresi (\"shipping fever\")\n- Karma gruplama ve yeni ortama adaptasyon\n- Hava kosullari degisiklikleri, yetersiz havalandirma\n- Yem degisiklikleri, suttten kesme\n- Immunosupresyon\n\n### Patogenez\n\n1. Stres → kortizon artisi → immunosupresyon\n2. Viral etkenler solunum yolu epitelini hasar → mukosilier klirens bozulur\n3. Firsat bakterileri alt solunum yollarini kolonize eder\n4. **Fibrinoz bronkopnomoni** gelisir → lokotoksinler akciğer dokusunu tahrip eder\n5. Plevrit, akciğer apsesi, sistemik enfeksiyon gelisebilir\n\n### Klinik Belirtiler\n\n- Ates (> 40°C), depresyon, istahsizlik\n- Seros → mukopurulent burun akintisi\n- Oksuruk, takipne, dispne\n- Bas ve boyun uzatarak nefes alma\n- Goz yasarmasi, kulak dusuklugu\n- Ileri vakalarda: agizdan solunum, siyanoz\n\n### Tani\n\n- Klinik bulgular + anamnez (tasinma, gruplama hikayesi)\n- **Torakal ultrasonografi:** Pulmoner konsolidasyon, plevral efuzyon\n- **Transtrakeal aspirat (TTA):** Bakteriyel kultur ve antibiyogram\n- **BAL (Bronkoalveoler lavaj):** Sitoloji ve mikrobiyolojik analiz\n- **Hizli antijen testleri:** BRSV, BHV-1, BVDV icin\n- **Postmortem:** Kranioventral fibrinoz bronkopnomoni patognomiktir\n\n### Tedavi ve Korunma\n\n**Tedavi:**\n- Genis spektrumlu antibiyotikler: Tulathomisin, florfenikol, tilmikosin, enrofloksasin\n- NSAID\'ler: Meloksikam, flunixin meglumine (ates ve iltihap kontrolu)\n- Destek tedavisi: Sivi tedavi, vitamin takviyesi\n\n**Korunma:**\n- Asllama programlari (canli/olu asilar: IBR, BVDV, PI3, BRSV, Mannheimia)\n- Biyogüvenlik onlemleri ve karantina uygulamalari\n- Stres faktorlerinin minimizasyonu\n- Uygun barinma ve havalandirma kosullari\n- Metafilaksi: Risk grubuna toplu antibiyotik uygulamasi (tartismali)\n\n---\n**Kaynak:** Griffin, D. et al. (2017). *Bovine respiratory disease: Looking back, looking forward.* Veterinary Clinics of North America: Food Animal Practice, 26(2), 273-289. [PubMed: 28460660](https://pubmed.ncbi.nlm.nih.gov/28460660/)',

    'sigir_tuberkuloz': '## Sigirlarda Tuberkuloz (Bovine Tuberculosis)\n\nSigir tuberkulozu, **Mycobacterium bovis** tarafindan olusturulan, kronik seyirli, **zoonoz** (hayvandan insana bulasan) ve **ihbari mecburi** bir enfeksiyon hastaligidir.\n\n### Etken\n\n- *Mycobacterium bovis* - Mycobacterium tuberculosis kompleksinin bir uyesidir.\n- Aside direncli basil (ARB), hucrelerarasi zorunlu patojen.\n- Cevrede uzun sure canliligini koruyabilir (toprakta aylarca, gubre-de haftalarca).\n\n### Bulasma Yollari\n\n**Primer Yollar:**\n- **Aerosol/inhalasyon:** En yaygin bulasma yolu. Enfekte hayvanlarin solunum sekresyonlari ile.\n- **Oral yol:** Kontamine sut, yem ve su ile alinir.\n\n**Diger Yollar:**\n- Konjenital (uterus ici) bulasma\n- Deri yaralari yoluyla (nadir)\n- **Yaban hayati rezervuarlari:** Ingiltere\'de porsuklarin (badger), Yeni Zelanda\'da opossumlarin rolu kanitlanmistir.\n\n**Zoonoz Potansiyel:**\n- Pastorize edilmemis sut ve sut urunleri ile insanlara bulasabilir.\n- Enfekte hayvanlarla yakin temas (meslek hastaligi: veteriner hekim, kasap, ciftci).\n\n### Patogenez\n\n1. *M. bovis* alveoler makrofajlar tarafindan fagosite edilir.\n2. Bakteri, fagolizozom fuzyonunu engelleyerek makrofaj icinde hayatta kalir ve cogalir.\n3. **Granulom (Tuberkulom)** olusumu: Merkezde kazeoz nekroz, etrafinda epiteloid hucreler, Langhans tipi dev hucreler, lenfositler.\n4. Enfeksiyon **lenf dugumleri** yoluyla yayilir (lenfojen yayilim).\n5. Ileri vakalarda **hematojen yayilim** (miliyer tuberkuloz): Akciger, karaciger, bobrek, uterus tutulumu.\n\n### Klinik Belirtiler\n\n- Cogu vaka **subklinik** seyreder (belirgin klinik bulgu vermez).\n- Ileri vakalarda: kronik oksuruk, kilo kaybi, lenfadenopati, dusuk sut verimi.\n- **Mezbaha bulgulari:** Retro faryngeal, bronsiyal ve mediastinal lenf dugumlerinde kazeoz nekrotik lezyonlar.\n\n### Tani\n\n**In Vivo (Canli Hayvanda):**\n\n| Test | Aciklama |\n|------|----------|\n| **Tuberkulin Deri Testi (TST)** | Altın standart tarama testi. Kaudal kıvrım testi (CCT) veya karsilastirmali servikal test (CCT). Intradermal PPD enjeksiyonu, 72 saat sonra deri kalinligi olcumu. |\n| **Interferon-gamma (IFN-γ) testi** | ELISA bazli kan testi. TST\'ye tamamlayici; daha yuksek duyarlilik. |\n\n**Postmortem:**\n- Makroskopik lezyon muayenesi (lenf dugumlerinde tuberkulom)\n- Histopatoloji (granulomatoz iltihap, ARB boyama)\n- **Bakteriyel kultur:** Kesin tani (Lowenstein-Jensen besiyeri, 8-12 hafta)\n- **PCR:** Hizli molekuler tani, tur tespiti\n\n### Kontrol ve Eradikasyon\n\n- **Test et - kes politikasi:** Pozitif hayvanlarin itlafi (birçok ulkede zorunlu).\n- Sutun pastorizasyonu\n- Hayvan hareketlerinin kontrolu ve izlenebilirlik\n- Yaban hayati rezervuarlarinin yonetimi\n- Asilama: **BCG asisi** (M. bovis icin) - bazi ulkelerde yaban hayatinda denenmektedir; ancak TST\'yi interfere ettigi icin rutin kullanimi sinirlidir.\n\n---\n**Kaynak:** Waters, W.R. et al. (2011). *Bovine tuberculosis vaccine research: Historical perspectives and recent advances.* Vaccine, 29(16), 2611-2619. [PubMed: 21376755](https://pubmed.ncbi.nlm.nih.gov/21376755/)',

    'sigir_bvd': '## Bovine Viral Diyare (BVD)\n\nBovine Viral Diyare (BVD), **BVDV (Bovine Viral Diarrhea Virus)** tarafindan olusturulan, sigirlarda onemli ureme, solunum ve immunosupresif problemlere yol acan bir viral hastaliktir.\n\n### Etken\n\n- **Pestivirus** genusu, *Flaviviridae* ailesi.\n- Iki biyotip: **Sitopatik (cp)** ve **Non-sitopatik (ncp)**.\n- Iki genotip: **BVDV-1** (daha yaygin) ve **BVDV-2** (daha virulan).\n\n### Enfeksiyon Tipleri ve Semptomlar\n\n**1. Akut (Gecici) Enfeksiyon:**\n- Immunokompetan hayvanlarda. Genellikle hafif veya subklinik seyreder.\n- Belirtiler: Hafif ates, burun akintisi, gecici lositte dusus, hafif ishal.\n- **Immunosupresyon:** BVDV lenfositleri hedef alir → sekonder enfeksiyonlara (BRD) yatkinlik olusturur.\n- Virusun 2-3 hafta icinde eliminasyonu, ardından bagisiklik gelisir.\n\n**2. Agir Akut Enfeksiyon (BVDV-2):**\n- Yuksek ates, hemoraji (kanama egilimi), trombositopeni.\n- **Hemorrajik sendrom:** Deri, mukoza ve ic organlarda kanamalar.\n- Mortalite orani yuksek.\n\n**3. Persistan Enfeksiyon (PI Hayvanlar):**\n- Gebeliğin **30-125. gunlerinde** fetusun ncp BVDV ile enfeksiyonu sonucu gelisir.\n- Fetus immun tolerans gelistirir → virus \"kendi\" olarak taninir, eliminasyon saglanamaz.\n- PI hayvanlar **omur boyu virus sacar** → surude en onemli enfeksiyon kaynagi.\n- Genellikle zayif, gelisimi geri, sik hastalanan bireylerdir (ancak klinik olarak normal gorunebilirler).\n\n**4. Mucosal Disease (Mukozal Hastalik):**\n- **Yalnizca PI hayvanlarda** gorulur.\n- ncp virusun sitopatik forma mutasyonu veya sitopatik sus ile superenfeksiyon sonucu tetiklenir.\n- **%100 olumcul** seyir.\n- Belirtiler: Agir ishal (kanli), oral mukoza ulserasyonlari, ates, dehidratasyon, olum (2-3 hafta icinde).\n\n**5. Ureme Sistemi Etkileri:**\n\n| Gebelik Donemi | Etki |\n|----------------|------|\n| **Erken (0-45 gun)** | Embriyonik olum, infertilite |\n| **30-125 gun** | PI buzagi dogumu (immun tolerans) |\n| **100-150 gun** | Konjenital malformasyonlar (serebellar hipoplazi, mikrosefali, retinal displazi) |\n| **150+ gun** | Fetus immunokompetandır → normal buzagi veya zayif buzagi |\n| **Her donem** | Abort |\n\n### Tani\n\n- **Antijen testi (ELISA - Ear notch):** PI hayvanlarin tespiti icin kulak dokusu ornegi. 3 hafta arayla iki pozitif test → PI onay.\n- **RT-PCR:** Virus RNA tespiti (kan, doku, sut orneklerinde). Yuksek duyarlilik.\n- **Virus izolasyonu:** Hucre kulturunde uretim (referans yontem).\n- **Antikor testi (seroloji):** Surude maruz kalma durumunu degerlendirmek icin. Asili hayvanlarda yorumlamasi zorlaşır.\n- **Tank sutu PCR/ELISA:** Suru duzeyinde tarama.\n\n### Kontrol Stratejileri\n\n1. **PI hayvanlarin tespiti ve suruden uzaklastirilmasi** - En kritik basamak.\n2. **Asilama:** Canli atenüe veya olu asilar. Ozellikle gebelik oncesi immunizasyon onemlidir (fetal koruma).\n3. **Biyoguvenlik:** Yeni gelen hayvanlarin karantinasi ve test edilmesi.\n4. **Suru kapatma:** Asilama + PI eliminasyonu ile surude eradikasyon.\n5. Avrupa\'da bircok ulkede (Iskandinavya, Almanya, Avusturya) basarili eradikasyon programlari uygulanmaktadir.\n\n---\n**Kaynak:** Lanyon, S.R. et al. (2014). *Bovine viral diarrhoea: Pathogenesis and diagnosis.* Veterinary Journal, 199(2), 201-209. [PubMed: 25533699](https://pubmed.ncbi.nlm.nih.gov/25533699/)',

    'default': 'Bu ilginc bir konu! Daha spesifik bir soru sormak ister misiniz?'
  },

  suggestedPrompts: [
    'DNA replikasyonu nasil calisir?',
    'Fotosentez surecini detayli acikla',
    'Hucre zarinin yapisini anlat',
    'Evrim teorisinin temel ilkeleri nelerdir?',
  ],
};

// ---- Flash Kart Bankasi (AI Uretimi icin) ----
// Her eleman: [anahtar_kelimeler_dizisi, kartlar_dizisi]
const FlashCardBank = [
  // -- Hucre Biyolojisi --
  [['hucre', 'cell', 'organel', 'membran', 'zar', 'sitoplazma'], [
    { front: 'Mitokondri\'nin gorevi nedir?', back: 'Hucrenin enerji santrali olarak bilinir. Aerobik solunum ile ATP uretir. Cift zar yapisina ve kendi DNA\'sina (mtDNA) sahiptir.' },
    { front: 'Endoplazmik retikulum (ER) tipleri nelerdir?', back: 'Granutlu ER (ribozom tasir, protein sentezi) ve Duz ER (lipid sentezi, detoksifikasyon, kalsiyum depolama). Cekirdek zarinin devami niteligindedir.' },
    { front: 'Golgi aygiti ne ise yarar?', back: 'Proteinlerin islenmesi, paketlenmesi ve hucre disi/icine yonlendirilmesinden sorumludur. Cis (alim) ve trans (gonderim) yuzu vardir.' },
    { front: 'Lizozom nedir?', back: 'Hucrenin sindirim organeli. Asidik ortamda (pH ~4.8) hidrolitik enzimler icerir. Otofaji, fagositoz ve eskimis organellerin geri donusumunu saglar.' },
    { front: 'Hucre zari modeli nedir?', back: 'Akici Mozaik Modeli (Singer & Nicolson, 1972): Fosfolipit cift tabaka icinde yuzey ve transmembran proteinleri, kolesterol ve glikolipitler yer alir.' },
    { front: 'Aktif tasima ve pasif tasima farki?', back: 'Pasif tasima: ATP gerektirmez, konsantrasyon gradyani yonunde (difuzyon, osmoz). Aktif tasima: ATP harcar, gradyana karsi (Na+/K+ pompasi).' },
    { front: 'Ribozom nedir ve nerede bulunur?', back: 'Protein sentezinden sorumlu organel. rRNA ve proteinlerden olusur. Serbest (sitoplazmada) veya bagli (GER uzerinde) olarak bulunur. 70S (prokaryot) ve 80S (okaryot).' },
    { front: 'Sentriyol ve is bolgesi?', back: 'Mikrotubullerden olusan silindirik yapilar. Hucre bolunmesi sirasinda is iplikleri olusturur. Hayvan hucrelerinde bulunur, bitki hucrelerinde genelde yoktur.' },
    { front: 'Peroksizom ne yapar?', back: 'Yag asitlerinin beta-oksidasyonu ve toksik maddelerin (etanol, H2O2) detoksifikasyonu. Katalaz enzimi icerir.' },
    { front: 'Plastidin tipleri nelerdir?', back: 'Kloroplast (fotosentez), kromoplast (pigment - meyve rengi), lokoplast (nisasta depolama - amiloplast). Yalnizca bitki hucrelerinde bulunur.' },
    { front: 'Vakuol\'un bitki hucresindeki rolu?', back: 'Buyuk merkezi vakuol: su depolama, turgor basinci saglama, atik madde biriktirme, pigment depolama (antosiyanin). Hucre hacminin %90\'ini kaplayabilir.' },
    { front: 'Sitoiskelet elemanlari nelerdir?', back: 'Mikrotubuller (en kalin, 25nm - hucre bolunmesi), ara filamentler (mekanik dayaniklilik), aktin filamanlar (en ince, 7nm - hucre hareketi, kontraksiyon).' },
    { front: 'Hucre zarinda kolesterolun gorevi?', back: 'Membran akiskanligini duzenler. Yuksek sicaklikta katilastirici, dusuk sicaklikta akiskanlik saglayici etki gosterir. Yalnizca hayvan hucrelerinde bulunur.' },
    { front: 'Endositoz tipleri?', back: 'Fagositoz (kati madde alimi - \"hucre yeme\"), pinositoz (sivi alimi - \"hucre icme\"), reseptor aracili endositoz (spesifik molekul alimi, klatrin kapli cukur).' },
    { front: 'Prokaryot ve okaryot hucre farklari?', back: 'Prokaryot: cekirdek yok, 70S ribozom, peptidoglikan hucre duvari, sirkuler DNA. Okaryot: zar ile cevrili cekirdek, 80S ribozom, lineer DNA, organel icerir.' },
  ]],

  // -- DNA ve RNA --
  [['dna', 'rna', 'nukleotid', 'replikasyon', 'transkripsiyon', 'genetik materyal'], [
    { front: 'DNA\'nin yapisi nasil tanimlanir?', back: 'Watson-Crick modeli (1953): Cift sarmal, antiparalel iki polinukleotid zinciri. Baz eslesmeleri: A-T (2 H bagi), G-C (3 H bagi). 3.4 nm sarmal adimi, 10 baz cifti/tur.' },
    { front: 'DNA replikasyonu nasil baslar?', back: 'Origin of replication (ori) noktasindan baslar. Helikaz cift sarmali acar, SSB proteinleri tekli zinciri stabilize eder, Primaz RNA primer sentezler.' },
    { front: 'DNA polimeraz III ne yapar?', back: 'Ana replikasyon enzimi. 5\'→3\' yonunde yeni zincir sentezler. 3\'→5\' eksonukleaz aktivitesi ile proofreading (hata duzeltme) yapar. Hata orani: ~10^-7.' },
    { front: 'Onden giden ve geri kalan zincir farki?', back: 'Onden giden (leading): Surekli sentez, tek primer yeterli. Geri kalan (lagging): Kesintili sentez, Okazaki fragmentleri (100-200 nt), cok primer gerekir.' },
    { front: 'RNA cesitleri nelerdir?', back: 'mRNA (mesajci - protein kodu tasir), tRNA (tasiyici - aminoasit getirir), rRNA (ribozomal - ribozom yapisi), snRNA, miRNA, siRNA (duzenleyici).' },
    { front: 'Transkripsiyon nedir?', back: 'DNA\'dan RNA sentezi. RNA polimeraz kalip zinciri 3\'→5\' okur, mRNA\'yi 5\'→3\' sentezler. Prokaryotta tek RNA polimeraz; okaryotta RNA Pol I, II, III.' },
    { front: 'Okaryotik mRNA islenmesi adimlari?', back: '5\' cap eklenmesi (7-metilguanozin), 3\' poli-A kuyrugu, splicing (intronlarin cikarilmasi, ekzonlarin birlesmesi - spliceosome ile).' },
    { front: 'Translasyon asamalari?', back: 'Baslatma (AUG - Met, kucuk alt birim + mRNA + tRNA), Uzama (kodon okuma, peptid bagi olusumu), Sonlanma (dur kodonu: UAA, UAG, UGA - release faktor).' },
    { front: 'Genetik kod ozellikleri?', back: 'Universaldir (neredeyse tum canililarda ayni), dejeneredir (birden fazla kodon ayni aminoasidi kodlar), non-overlapping (ust uste binmez), virgulsuz (arasiz okunur).' },
    { front: 'Telomeraz nedir ve neden onemli?', back: 'Kromozom uclarindaki telomerleri uzatan enzim. Reverse transkriptaz aktivitesine sahiptir. Kok hucreler ve kanser hucrelerinde aktiftir. Normal hucrelerde inaktif → yaslanma.' },
    { front: 'DNA onarim mekanizmalari?', back: 'Baz cikarim onarimi (BER), nukleotid cikarim onarimi (NER), mismatch onarimi (MMR), cift zincir kirik onarimi (NHEJ ve homolog rekombinasyon).' },
    { front: 'Chargaff kurali nedir?', back: 'Cift zincirli DNA\'da: A = T ve G = C orani. Purin toplami = Pirimidin toplami. (A+G = T+C). Baz eslesme kuralinin temelini olusturur.' },
  ]],

  // -- Genetik ve Kalitim --
  [['genetik', 'kalitim', 'mendel', 'alel', 'genotip', 'fenotip', 'miras', 'gen'], [
    { front: 'Mendel\'in 1. Yasasi (Ayrilma)?', back: 'Her bireyde bir karakter icin iki alel bulunur. Gamet olusumunda bu aleller birbirinden ayrilir ve her gamete birer alel gider.' },
    { front: 'Mendel\'in 2. Yasasi (Bagimsiz Dagilis)?', back: 'Farkli karakterlere ait alel ciftleri, gamet olusumu sirasinda birbirinden bagimsiz olarak dagitilir. (Yalnizca farkli kromozom-lardaki genler icin gecerlidir.)' },
    { front: 'Kodominans nedir?', back: 'Her iki alelin de fenotipte tam olarak ifade edildigi durum. Ornek: AB kan grubu (IA ve IB alelleri birlikte ifade edilir).' },
    { front: 'Eksik baskinlik nedir?', back: 'Heterozigot bireyin fenotipinin iki homozigotun arasinda oldugu durum. Ornek: Kirmizi x Beyaz aslanagzi → Pembe cicek.' },
    { front: 'Epistazi nedir?', back: 'Bir gen lokusundaki alellerin, baska bir lokusdaki genlerin ifadesini bastirmasi/degistirmesi. Ornek: Labradorlarda E geni pigment birikimine izin verir veya engellerr.' },
    { front: 'X\'e bagli kalitim ozelligi?', back: 'X kromozomundaki genler. Erkekler hemizigottur (tek kopya). Anneden ogula tasitir. Ornek: Hemofili, renk korlugu, kas distrofisi.' },
    { front: 'Pedigree analizinde otozomal resesif kalitim belirtileri?', back: 'Etkilenmemis ebeveynlerden etkilenmis cocuk dogabilir, her iki cinste esit gorulur, akraba evliliklerinde sikligi artar, nesil atlayabilir.' },
    { front: 'Hardy-Weinberg dengesi kosullari?', back: 'Buyuk populasyon, rastgele ciftlesme, mutasyon yok, goc yok, dogal secilim yok. Denklem: p² + 2pq + q² = 1 (genotip frekanslari).' },
    { front: 'Poligenik kalitim nedir?', back: 'Birden fazla genin birlikte etki ederek bir fenotipik ozelligi belirlemesi. Ornek: Boy uzunlugu, deri rengi, zeka. Normal (Gauss) dagilim gosterir.' },
    { front: 'Genetik suruklenme nedir?', back: 'Kucuk populasyonlarda rastgele olay olarak alel frekanslarinin degismesi. Kurucu etkisi ve darbogazetkisi iki onemli ornektir.' },
    { front: 'Otozomal dominant kalitim ozellikleri?', back: 'Her nesilde gorulur, etkilenmis bireyin en az bir ebeveyni etkilenmistir, %50 aktarim olasitigi. Ornek: Huntington, akondroplazi, Marfan sendromu.' },
    { front: 'Crossing over nedir?', back: 'Meioz I\'de homolog kromozomlarin kromatidleri arasinda genetik materyal degisimi. Genetik cesitliligi arttirir. Rekombinasyon frekansı gen haritalamada kullanilir.' },
  ]],

  // -- Fotosentez --
  [['fotosentez', 'kloroplast', 'isik', 'calvin', 'bitki'], [
    { front: 'Fotosentezin genel denklemi?', back: '6CO₂ + 6H₂O + Isik Enerjisi → C₆H₁₂O₆ + 6O₂. Isik enerjisini kimyasal enerjiye (glikoz) donusturur.' },
    { front: 'Isiga bagli reaksiyonlar nerede gerceklesir?', back: 'Kloroplastin tilakoid zarlarinda. Fotosistem II (P680) ve Fotosistem I (P700) calisir. Su parcalanir (fotoliz), O₂ acigar, ATP ve NADPH uretilir.' },
    { front: 'Calvin dongusu (karanlik reaksiyonlar)?', back: 'Kloroplast stromasinda gerceklesir. CO₂ fiksasyonu (RuBisCO enzimi), reduksiyon (G3P uretimi), rejenerasyon (RuBP yenilenmesi). 3 tur = 1 G3P.' },
    { front: 'Fotosistem II ve I farki?', back: 'FSII: Reaksiyon merkezi P680, suyu parçalar, O₂ acigar. FSI: Reaksiyon merkezi P700, NADPH uretir. Elektron akisi: H₂O → FSII → FSI → NADP⁺.' },
    { front: 'C3, C4 ve CAM bitkileri farki?', back: 'C3: Calvin dongusu direkt (pirinc, bugday). C4: CO₂ once OAA\'ya baglanir, Kranz anatomisi (misir, seker kamisi). CAM: Gece CO₂ alir, gunduz kullanir (kaktus).' },
    { front: 'Kemiozmotik fosforilasyon (fotosentezde)?', back: 'Elektron tasinimı sirasinda H⁺ iyonlari tilakoid lumenine pompalanir. H⁺ gradyani ATP sentaz uzerinden akarak ATP uretir (fotofosforilasyon).' },
    { front: 'Klorofil cesitleri?', back: 'Klorofil a: Birincil pigment, mavi-mor ve kirmizi isigi emer. Klorofil b: Yardimci pigment, mavi ve turuncu isigi emer. Karotenoidler ve fikobilinler de yardimci pigmentlerdir.' },
    { front: 'Fotorespirasyonun zarari nedir?', back: 'RuBisCO enziminin O₂\'yi fikse etmesi. CO₂ yerine O₂ baglar, organik karbon kaybina yol acar. C3 bitkilerinde %25-50 verim kaybi. C4 bitkileri bunu onler.' },
    { front: 'Isik reaksiyonlarinda su nasil parcalanir?', back: 'Fotoliz: FSII\'deki Mn4Ca kumesinde 2H₂O → 4H⁺ + 4e⁻ + O₂. Elektronlar FSII\'ye, protonlar lümene verilir, O₂ yan urun olarak acigar.' },
    { front: 'RuBisCO enziminin onemi?', back: 'Yeryuzundeki en bol protein. Calvin dongusunde CO₂ fiksasyonunu katalize eder (CO₂ + RuBP → 2 PGA). Hem oksijenaz hem karboksilaz aktivitesi vardir.' },
  ]],

  // -- Evrim --
  [['evrim', 'darwin', 'secilim', 'adaptasyon', 'tur', 'turklesme', 'filogeni'], [
    { front: 'Dogal secilimin kosullari?', back: '1) Fenotipik varyasyon, 2) Varyasyonun kalitilabilirligi, 3) Ureme basarisi farki (bazi fenotiplerin daha cok ureyen birey birakmasi).' },
    { front: 'Homolog ve analog yapilar farki?', back: 'Homolog: Ortak atadan gelen benzer yapilar (insan kolu, balina yuzereci). Analog: Farkli kokenden benzer islev (kus kanadi, bocek kanadi) - yakinsamali evrim.' },
    { front: 'Turklesme (spesiasyon) turleri?', back: 'Allopatrik (cografi izolasyon), Simpatrik (ayni bolge, farkli nis), Peripatrik (kucuk periferal populasyon), Parapatrik (bitisik bolgeler, sinirli gen akisi).' },
    { front: 'Genetik suruklenme nedir?', back: 'Kucuk populasyonlarda rastgele alel frekans degisimi. Adaptif degil. Kurucu etkisi (yeni koloni) ve darbogazetkisi (populasyon azalmasi) iki onemli tipi.' },
    { front: 'Evrimsel fit (fitness) nedir?', back: 'Bir bireyin ureme basarisi - gelecek nesle aktardigi gen kopyasi sayisi. En uygun (fit) bireyler en fazla yasayabilir yavrulari birakir.' },
    { front: 'Kesintili denge teorisi?', back: 'Gould & Eldredge: Evrim hizli turklesme donemleri + uzun durgunluk (staz) donemleri seklinde ilerler. Gradual (yavas) evrime alternatif model.' },
    { front: 'Koevrim nedir?', back: 'Iki veya daha fazla turun birbirlerinin evrimini karsilikli etkilemeleri. Ornek: Cicek-tozlayici, avcı-av, parazit-konak iliskileri.' },
    { front: 'Molekuler saat nedir?', back: 'Protein veya DNA dizilerindeki mutasyon birikiminin sabit oranda oldugu varsayimiyla turlerin ayrilma zamanini tahmin etme yontemi.' },
    { front: 'Secilim turleri nelerdir?', back: 'Stabilize edici (orta deger secilir), Yonlu (bir uca dogru kayis), Parcalayici (iki uc secilir, orta elenir). Cinsel secilim de ayri bir kategori.' },
    { front: 'Vestigial (kalinti) yapilar neye ornektir?', back: 'Atalarindan kalan islevi azalmis/kaybolmus yapilar. Ornek: Insan appendiksi, balina pelvis kemigi, yilan arka bacak kalintisi. Evrimsel gecmise kanit.' },
  ]],

  // -- Ekoloji --
  [['ekoloji', 'ekosistem', 'populasyon', 'habitat', 'biyom', 'besin', 'cevre'], [
    { front: 'Ekolojinin organizasyon seviyeleri?', back: 'Birey → Populasyon → Komunite → Ekosistem → Biyom → Biyosfer. Her seviye kendine ozgu dinamiklere sahiptir.' },
    { front: 'Besin piramidi neden kuculur?', back: 'Enerji transferi verimi yaklasik %10 (Lindeman\'in %10 kurali). Her trofik seviyede enerjinin ~%90\'i metabolik islemler ve isi olarak kaybedilir.' },
    { front: 'Nisas nedir?', back: 'Bir turun ekosistemde isgal ettigi rol ve kullandigi kaynaklarin toplami. Temel nis (potansiyel) ve gerceklesen nis (rekabet sonrasi) olmak uzere ikiye ayrilir.' },
    { front: 'r ve K secilim stratejileri?', back: 'r-strateji: Cok yavru, az ebeveyn bakimi, kisa omur (bocekler). K-strateji: Az yavru, cok ebeveyn bakimi, uzun omur, tasimakapasitesine yakin (filler).' },
    { front: 'Biyolojik buyutme (biyomagnifikasyon)?', back: 'Toksik maddelerin besin zincirinde yukariya dogru konsantrasyonunun artmasi. Ornek: DDT\'nin kus yumurtalarina etkisi, civa birikimi balik → insan.' },
    { front: 'Azot dongusu adimlari?', back: 'Azot fiksasyonu (N₂→NH₃), nitrifikasyon (NH₃→NO₂⁻→NO₃⁻), asimilasyon (bitki alimi), ammonifikasyon (organik→NH₃), denitrifikasyon (NO₃⁻→N₂).' },
    { front: 'Birincil ve ikincil sukses farki?', back: 'Birincil: Bos/yeni alanda baslar (lav akintisi ustu, buzul cekilmesi). Ikincil: Bozulmus ama toprak mevcut alanda baslar (yangin, sel sonrasi). Daha hizlidir.' },
    { front: 'Simbioz turleri nelerdir?', back: 'Mutualizm (+/+): Her iki tur yararlanir. Kommensalizm (+/0): Biri yararlanir, digeri etkilenmez. Parazitizm (+/-): Biri yararlanir, digeri zarar gorur.' },
    { front: 'Karbon dongusu neden onemli?', back: 'CO₂ fotosentezle organik bilesize donusur, solunum ile geri verilir. Fosil yakitlar, kalkerlekayaclar uzun sureli depo. Insan kaynakli CO₂ artisi sera etkisini guclendiriyor.' },
    { front: 'Biyocesillik neden onemlidir?', back: 'Ekosistem direnci ve esnekligi saglar, ilacc/gida kaynaklari sunar, besin aglari stabilize eder, toprak verimliligi korur. Tur kaybi domino etkisi yaratabilir.' },
  ]],

  // -- Mikrobiyoloji --
  [['mikrobiyoloji', 'bakteri', 'virus', 'mantar', 'enfeksiyon', 'antibiyotik', 'mikroorganizma'], [
    { front: 'Gram pozitif ve negatif bakteri farki?', back: 'Gram (+): Kalin peptidoglikan tabaka, mor boyanir (Staphylococcus). Gram (-): Ince peptidoglikan + dis membran, pembe boyanir (E. coli). Tedavi yaklasimi farklidir.' },
    { front: 'Virusun temel yapisi?', back: 'Nukleik asit (DNA veya RNA) + protein kapsid. Bazi viruslerde lipid zarf bulunur. Obligat hucrelerarasi parazit - kendi basina cogalamaz.' },
    { front: 'Bakteriyel konjugasyon nedir?', back: 'Bir bakteriden digerine F pilus araciligiyla plazmid DNA aktarimi. Yatay gen transferi yontemi. Antibiyotik direnc genlerinin yayilmasinda onemli rol oynar.' },
    { front: 'Koch postulatlari?', back: '1) Etken tum hastalarda bulunmali, 2) Saf kultur elde edilmeli, 3) Saglikli konaga verilince hastalik olusturmali, 4) Hasta konaktan tekrar izole edilmeli.' },
    { front: 'Antibiyotik direnc mekanizmalari?', back: 'Enzim uretimi (beta-laktamaz), hedef degisimi (PBP mutasyonu), efluks pompasi (ilaci disa atar), gecirgenlik azalma (porin kanal degisimi).' },
    { front: 'Endospor nedir?', back: 'Bazi Gram (+) bakterilerin (Bacillus, Clostridium) olumsuz kosullarda olusturdugu dayanikli dorm yapidir. Isiya, kimyasallara, UV\'ye direnclidir.' },
    { front: 'Litik ve lizogenik virus dongusu farki?', back: 'Litik: Hizli cogalma → hucre parcalanmasi → virus salimi. Lizogenik: Virus DNA\'si konak genomuna entegre olur (profaj), hucreyle birlikte cogalir.' },
    { front: 'Normal flora (mikrobiota) onemi?', back: 'Patojenlere karsi rekabet, vitamin sentezi (K, B12), immun sistem gelisimi, sindirime katki. Disbiyoz cok sayida hastalikla iliskilendirilmistir.' },
    { front: 'CRISPR-Cas9 sistemi nedir?', back: 'Bakterilerin antiviral savunma sistemi. Biotekno-lojide genom duzenleme araci olarak kullanilir. Guide RNA ile hedef DNA kesilir ve degistirilir.' },
    { front: 'Biyofilm nedir?', back: 'Bakterilerin yuzeyler uzerinde olusturdugu, ekstrasel-uler polimer matriks (EPS) icine gomulu topluluk yapisi. Antibiyotiklere 1000x direncli olabilir.' },
  ]],

  // -- Biyokimya --
  [['biyokimya', 'enzim', 'protein', 'lipid', 'karbohidrat', 'metabolizma', 'amino'], [
    { front: 'Enzim nedir ve nasil calisir?', back: 'Biyolojik katalizor (genelde protein). Aktivasyon enerjisini dusurur, reaksiyon hizini 10⁶-10¹² kat arttirir. Substrat spesifiktir (anahtar-kilit modeli / uyarlanmis uyum).' },
    { front: 'ATP\'nin yapisi ve onemi?', back: 'Adenozin + 3 fosfat grubu. Yuksek enerjili fosfat baglari icerir. Hidroliz: ATP → ADP + Pi + enerji (~7.3 kcal/mol). Hucrenin evrensel enerji birimidir.' },
    { front: 'Protein yapisinin 4 seviyesi?', back: 'Birincil: Aminoasit dizilimi. Ikincil: alfa-sarmal, beta-tabakai (H baglari). Ucuncul: 3B katlama. Dorduncul: Birden fazla polipeptid birlesmesi.' },
    { front: 'Michaelis-Menten kinettigi?', back: 'V = Vmax[S]/(Km + [S]). Km: Vmax\'in yarisina ulasildigi substrat konsantrasyonu. Dusuk Km = yuksek afinite. Enzim kinetigi temel denklemidir.' },
    { front: 'Kompetitif ve non-kompetitif inhibisyon farki?', back: 'Kompetitif: Inhibitor aktif bolgeye baglanir, Km artar, Vmax degismez. Non-kompetitif: Allosterik bolgeye baglanir, Km degismez, Vmax duser.' },
    { front: 'Glikoliz nedir?', back: 'Glikozun 2 piruvata parcalanmasi (sitoplazmada). 10 adim, net 2 ATP + 2 NADH uretir. Hem aerobik hem anaerobik solunumun ilk asamasidir.' },
    { front: 'Krebs (sitrik asit) dongusu?', back: 'Mitokondrinin matriksinde gerceklesir. Asetil-CoA\'yi oksitler. 1 tur: 3 NADH, 1 FADH₂, 1 GTP, 2 CO₂. 2 tur/glikoz.' },
    { front: 'Doymus ve doymamis yag asidi farki?', back: 'Doymus: C-C arasiinda cift bag yok, duz zincir, oda sicakliginda kati (tereyagi). Doymamis: Cift bag var, bukuk zincir, oda sicakliginda sivi (zeytinyagi).' },
    { front: 'Denaturatyson nedir?', back: 'Proteinin 3B yapisinin bozulmasi (asiri isi, pH, kimyasal). Birincil yapi korunur, fonksiyon kaybolur. Bazen geri donusumsuz (pisirilmis yumurta).' },
    { front: 'Koenzim ve kofaktor farki?', back: 'Kofaktor: Enzim aktivitesi icin gereken inorganik iyonlar (Zn²⁺, Mg²⁺, Fe²⁺). Koenzim: Organik molekuller (NAD⁺, FAD, CoA). Her ikisi de enzim fonksiyonu icin gereklidir.' },
  ]],

  // -- Anatomi / Fizyoloji --
  [['anatomi', 'fizyoloji', 'organ', 'kas', 'sinir', 'kalp', 'akciger', 'iskelet', 'vucud', 'sistem'], [
    { front: 'Kalbin 4 odacigi?', back: 'Sag atriyum (kirli kan alir), Sag ventrikul (akcigere pompalar), Sol atriyum (temiz kan alir), Sol ventrikul (vucuda pompalar - en kalin duvarli).' },
    { front: 'Sinir hucresinde aksiyon potansiyeli?', back: 'Istirahatte -70mV. Depolarizasyon: Na⁺ kanallari acilir (+30mV). Repolarizasyon: K⁺ kanallari acilir. Refrakter periyot: Yeni uyari uretilmez.' },
    { front: 'Solunum mekaninigi nasil calisir?', back: 'Inspirasyon: Diyafram kasitir, gogus genisler, basinc duser, hava girer. Ekspirasyon: Diyafram gevseer, gogus daralir, basinc artar, hava cikar.' },
    { front: 'Kan gruplari ve uyumluluk?', back: 'A: Anti-B antikoru. B: Anti-A antikoru. AB: Antikor yok (universel alici). O: Her iki antikor (universel verici). Rh faktoru de onemli (+/-).' },
    { front: 'Iskelet kasi, duz kas ve kalp kasi farklari?', back: 'Iskelet: Cizgili, istemli, cok cekirdekli. Duz kas: Ciizgisiz, istemsiz, tek cekirdekli (ic organlar). Kalp: Cizgili, istemsiz, dallanmis, interkalerdisk.' },
    { front: 'Bosaltim sistemi nasil calisir?', back: 'Bobrek: Kanin suzmesi (nefron). Glomerular filtrasyon → Tubuler geri emilim → Tubuler sekresyon → Idrar olusumu. Gunluk ~180L filtrat, ~1.5L idrar.' },
    { front: 'Hormonal duzenlenme ornegi: Kan sekeri?', back: 'Yuksek KS → Pankreas beta hucreleri insulin salgilar → Glikoz alimi artar, KS duser. Dusuk KS → Alfa hucreleri glukagon salgilar → Glikojen parcalanir.' },
    { front: 'Bagisiklik sistemi: Dogal vs edinilmis?', back: 'Dogal (innate): Hizli, non-spesifik (deri, fagositler, NK hucreleri). Edinilmis (adaptive): Yavas ama spesifik (T ve B lenfositler, antikor uretimi, hafiza).' },
    { front: 'Sinaptik iletim nasil gerceklesir?', back: 'Aksiyon potansiyeli sinaps oncesi terminale ulasir → Ca²⁺ kanallari acilir → Vezikuller ekzositoz ile norotransmitter salgilar → Postsinaptik reseptorlere baglanir.' },
    { front: 'Deri katmanlari nelerdir?', back: 'Epidermis (ustte, keratinositler, melanositler), Dermis (altta, bag doku, kan damarlari, sinirler, ter bezleri, kil kokukleri), Hipodermis (yag dokusu).' },
  ]],

  // -- Veteriner / Hayvan Bilimleri --
  [['veteriner', 'hayvan', 'kedi', 'kopek', 'sigir', 'at', 'kus', 'balik', 'parazit'], [
    { front: 'Kedi FIP hastaligi nedir?', back: 'Feline Infeksiyoz Peritonit. Felin koronavirusun mutasyonuyla gelisir. Yas (efuzif) ve kuru (granulomatoz) formlari vardir. GS-441524 ile tedavi arastirmalaarii surmektedir.' },
    { front: 'Kopeklerde asii takvimi nasil baslar?', back: '6-8 hafta: Karma asi (DHPPi). 10-12 hafta: 2. doz + Leptospira. 14-16 hafta: 3. doz + Kuduz. Yillik rapel. Ic/dis parazit koruma aylik.' },
    { front: 'Sigirda BVD neden onemlidir?', back: 'Persistan enfekte (PI) buzagilar omur boyu virus sacar. Immunosupresyon yapar (BRD\'ye yatkinlik). Ureme bozukluklari, abort. PI hayvan tespiti ve ayrilmasi kritiktir.' },
    { front: 'Zoonotik hastalik ornekleri?', back: 'Kuduz (virus), Bruselloz (bakteri), Toksoplazmoz (protozoa), Sigir tuberkulozu (M. bovis), Leptospiroz, Salmonelloz, Lyme hastaligi.' },
    { front: 'Kopeklerde kalp kurdu nasil bulasir?', back: 'Sivrisinek aracili. L3 larva deriye birakilir → L4/L5\'e gelisir → Pulmoner arterlere ve sag kalbe yerlesti. 6-7 ay prepatent periyot. Aylik profilaksi onemli.' },
    { front: 'Kedilerde kronik bobrek hastaligi (KBH)?', back: '15 yas ustu kedilerin %30-40\'inda gorulur. Poliuri, polidipsi, kilo kaybi. SDMA erken tani markeri. Renal diyet + sivi tedavisi + fosfor kontrolu ile yonetilir.' },
    { front: 'Ruminant sindirim sistemi?', back: 'Dort bolumlii mide: Rumen (fermentasyon, mikroflora), Retikulum (yabanci cisim filtresi), Omasum (su geri emilimi), Abomasum (asidik sindirim - \"gercek mide\").' },
    { front: 'Aseptik cerrahi teknigi nedir?', back: 'Ameliyat bolgesinin kontaminasyonunu onleme. Steril eldiven/alet, hasta drape edilmesi, ameliyat bolgesi dezenfeksiyonu, steril alan korunmasi.' },
    { front: 'Kopeklerde displazi nedir?', back: 'Kalca ekleminde asetabulum-femur basi uyumsuzlugu. Genetik + cevresel (hizli buyume, obezite). Buyuk irklarda sik. TPO, FHO veya total kalca protezi ile tedavi.' },
    { front: 'Koyunlarda ayak hastaliklari?', back: 'Piyeten (Dichelobacter nodosus): Bulasiicai, topallama, kotu koku. Tedavi: Ayak banyosu (CuSO₄, ZnSO₄), antibiyotik, tirnak kesimi, izolasyon.' },
  ]],

  // -- Molekuler Biyoloji (ek) --
  [['molekuler', 'pcr', 'klonlama', 'biyoteknoloji', 'gen muhendisligi', 'rekombinant'], [
    { front: 'PCR (Polimeraz Zincir Reaksiyonu) nedir?', back: 'DNA\'nin in vitro cogaltilma teknigi. 3 adim: Denatiirasyon (94°C), Primer baglama (50-60°C), Uzama (72°C, Taq polimeraz). 30-40 dongu → milyarlarca kopya.' },
    { front: 'Restriksiyon enzimleri ne yapar?', back: 'Spesifik DNA dizilerini (palindromik) taniyan ve kesen enzimler. Yapisskan uclar (EcoRI) veya kunt uclar (SmaI) olusturur. Klonlama ve gen muhendisliginde temel arac.' },
    { front: 'Plazmid nedir ve klonlamada nasil kullanilir?', back: 'Kucuk, dairesel, otonom cöglalan DNA. Vektor olarak kullanilir: Hedef gen eklenir, bakteriye transformasyon ile sokulur, bakteri genni cogaltir.' },
    { front: 'Jel elektroforez ne icin kullanilir?', back: 'DNA/RNA/protein fragmentlerini boyutlarina gore ayirma teknigi. Agaroz (nükleik asit) veya poliakrilamid (protein) jeli. Kucuk fragmentler hizli goc eder.' },
    { front: 'Western, Southern ve Northern blot farklari?', back: 'Southern: DNA tespiti. Northern: RNA tespiti. Western: Protein tespiti (SDS-PAGE + antikor). Isim gelisi: Southern kisiden, digerleri yon espirisi.' },
    { front: 'CRISPR-Cas9 nasil calisir?', back: 'Guide RNA (gRNA) hedef DNA dizisine baglanir. Cas9 nukleaz cift zinciri keser. Hata egilimli NHEJ veya hassas HDR ile onarilir. Gen knockout/knockin mumkun.' },
    { front: 'cDNA kutuphanesi nedir?', back: 'mRNA\'dan ters transkriptaz ile sentezlenen complementer DNA koleksiyonu. Sadece ifade edilen genleri (ekzonlari) icerir. Intron icermez.' },
    { front: 'Gen terapisi nedir?', back: 'Hastalikli genlerin fonksiyonel kopya ile degistirilmesi veya duzeltilmesi. Viral vektörler (AAV, lentivirus) veya non-viral yontemler (lipozon, elektroporasyon) kullanilir.' },
  ]],
];

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
