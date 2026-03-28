const config = require('../config');

const SYSTEM_PROMPT = `Sen BioArchive AI, biyoloji alaninda uzmanlasmis bir yapay zeka asistanisin.
Gorevlerin:
- Biyoloji konularinda dogru ve detayli bilgi vermek
- Ogrencilere ve arastirmacilara yardimci olmak
- Sorulari Turkce olarak, anlasilir ve akademik bir dilde yanitlamak
- Gerektiginde kaynaklar onermek
- Markdown formatlama kullanarak duzgun yapilandirilmis yanitlar vermek

Uzmanlik alanlarin:
- Hucre biyolojisi ve molekuler biyoloji
- Genetik ve genomik
- Ekoloji ve evrim biyolojisi
- Fizyoloji (bitki ve hayvan)
- Mikrobiyoloji
- Biyokimya
- Deniz biyolojisi

Her zaman bilimsel kaynaklara dayali, dogru bilgi ver. Emin olmadigin konularda bunu belirt.`;

// Singleton AI client'lari (her istekte yeniden olusturulmasin)
let openaiClient = null;
let anthropicClient = null;

function getOpenAIClient() {
  if (!openaiClient) {
    const OpenAI = require('openai');
    openaiClient = new OpenAI({ apiKey: config.ai.openai.apiKey });
  }
  return openaiClient;
}

function getAnthropicClient() {
  if (!anthropicClient) {
    const Anthropic = require('@anthropic-ai/sdk');
    anthropicClient = new Anthropic({ apiKey: config.ai.anthropic.apiKey });
  }
  return anthropicClient;
}

async function generateResponse(message, conversationHistory) {
  const provider = config.ai.provider;

  try {
    if (provider === 'openai' && config.ai.openai.apiKey) {
      return await generateOpenAI(message, conversationHistory);
    } else if (provider === 'anthropic' && config.ai.anthropic.apiKey) {
      return await generateAnthropic(message, conversationHistory);
    } else {
      return generateFallback(message);
    }
  } catch (err) {
    console.error('[AI] Hata:', err.message);
    return generateFallback(message);
  }
}

async function generateOpenAI(message, history) {
  const client = getOpenAIClient();

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map(m => ({ role: m.role, content: m.content })),
  ];

  const response = await client.chat.completions.create({
    model: config.ai.openai.model,
    messages,
    max_tokens: 2000,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

async function generateAnthropic(message, history) {
  const client = getAnthropicClient();

  const messages = history.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }));

  const response = await client.messages.create({
    model: config.ai.anthropic.model,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages,
  });

  return response.content[0].text;
}

// API anahtari yoksa veya hata olursa yerel yanit ver
function generateFallback(message) {
  const q = message.toLowerCase();

  // Veteriner - Kedi
  if ((q.includes('kedi') || q.includes('felin')) && (q.includes('bobrek') || q.includes('böbrek') || q.includes('kidney') || q.includes('renal'))) {
    return `## Kedilerde Kronik Bobrek Hastaligi (KBH)

Kronik bobrek hastaligi (KBH), ozellikle ileri yastaki kedilerde en sik karsilasilan sistemik hastaliklar arasinda yer alir. 15 yas ustu kedilerin yaklasik **%30-40**'inda KBH tespit edilmektedir.

### Etiyoloji (Neden Olusur?)

- **Tubulointerstitiyel nefrit:** En yaygin histopatolojik bulgudur. Bobrek tubuluslerinde kronik iltihap ve fibrozis gorulur.
- **Iskemi ve hipoksi:** Bobrek dokusuna yetersiz kan akimi, nefron kaybiyla sonuclanir.
- **Genetik yatkinlik:** Ozellikle Pers ve Abyssinian irklarinda polikistik bobrek hastaligi (PKD) sik gorulur.
- **Kronik dehidratasyon:** Dusuk nemli diyetler (kuru mama agirlikli beslenme) bobrek uzerindeki yuku artirir.
- **Yaslanma:** Ilerleyen yasla birlikte fonksiyonel nefron sayisi dogal olarak azalir.

### Klinik Belirtiler

| Evre | Belirtiler |
|------|------------|
| **Evre I-II** | Poliuri (cok idrara cikma), polidipsi (cok su icme), hafif kilo kaybi |
| **Evre III** | Istahsizlik, kusma, dehidratasyon, kas erimesi, matlasmis tuy yapisi |
| **Evre IV** | Siddetli uremik sendrom, agiz ulserasyonlari, norolojik belirtiler, anemi, metabolik asidoz |

### Tani Yontemleri

- **Serum biyokimyasi:** BUN, kreatinin ve SDMA duzeyleri degerlendirilir. SDMA, kreatinine gore daha erken donemde yukselme gosterir.
- **Tam idrar analizi:** Dusuk idrar yogunlugu (izosthenuria, USG < 1.035) onemli bir bulgudur.
- **Ultrasonografi:** Bobrek boyutu, ekojenite artisi ve yapisal degisiklikler incelenir.
- **IRIS Evrelemesi:** International Renal Interest Society kriterlerine gore hastalik 4 evrede siniflandirilir.

### Tedavi Yaklasimi

KBH'de tedavi kur saglayici degil, **hastaligi yavaslatma ve yasam kalitesini artirma** amaciyla uygulanir:

- Renal diyet (dusuk fosfor, sinirli protein)
- Subkutan sivi tedavisi
- Fosfor baglayicilar ve potasyum takviyesi
- ACE inhibitorleri (proteinuri kontrolu)
- Anti-emetikler (mide bulantisi icin)

---
**Kaynak:** Reynolds, B.S. & Bhatt, D.L. (2013). *Feline chronic kidney disease.* Journal of Feline Medicine and Surgery, 15(9), 733-752. [PubMed: 23811694](https://pubmed.ncbi.nlm.nih.gov/23811694/)`;
  }

  if ((q.includes('kedi') || q.includes('felin')) && (q.includes('hipertiroidi') || q.includes('tiroid'))) {
    return `## Kedilerde Hipertiroidizm

Felin hipertiroidizm, kedilerde en sik teshis edilen endokrin bozukluktur. Genellikle **10 yas ve uzeri** kedilerde gorulur ve tiroid bezinin asiri hormon uretmesiyle karakterizedir.

### Patofizyoloji (Nasil Gelisir?)

- **Tiroid adenomu:** Vakalarin **%97-99**'unda benign tiroid adenomatoz hiperplazisi veya adenomu sorumludur.
- **Bilateral tutulum:** Vakalarin yaklasik **%70**'inde her iki tiroid lobu da etkilenir.
- **Artmis T4 uretimi:** Hiperplastik tiroid dokusu, TSH'den bagimsiz olarak asiri T3 ve T4 salgilar.

### Olasi Risk Faktorleri

- Konserve mama tuketimi (ozellikle pop-top kutu kapakli olanlar)
- Cevresel endokrin bozucular (PBDE - polibrominli difenil eterler)
- Soya bazli bilesenler iceren diyetler
- Ic mekan yasam tarzi

### Klinik Bulgular

- **Kilo kaybi** (artmis istaha ragmen - polifaji)
- **Tasikardi** (kalp hizi > 240 atim/dk)
- **Poliuri ve polidipsi**
- **Hiperaktivite**, huzursuzluk, agresyon
- **Kusma ve ishal**
- **Palpe edilebilir tiroid nodulu** (boyun bolgesi muayenesi)

### Tedavi Secenekleri

| Yontem | Aciklama |
|--------|----------|
| **Metimazol** | Anti-tiroid ilac; hormon sentezini inhibe eder. |
| **Radyoaktif iyot (I-131)** | Altin standart tedavi. Tek doz enjeksiyonla hiperplastik doku selektif olarak yok edilir. |
| **Cerrahi tiroidektomi** | Bilateral tutulumda dikkatli cerrahi gerektirir. |
| **Iyot kisitli diyet** | Hafif vakalarda alternatif olarak kullanilabilir. |

---
**Kaynak:** Peterson, M.E. (2012). *Hyperthyroidism in cats.* Journal of Feline Medicine and Surgery, 14(11), 804-818. [PubMed: 22154541](https://pubmed.ncbi.nlm.nih.gov/22154541/)`;
  }

  if (q.includes('fip') || ((q.includes('kedi') || q.includes('felin')) && q.includes('peritonit'))) {
    return `## Feline Infeksiyoz Peritonit (FIP)

FIP, kedilerde felin koronavirusun (FCoV) mutasyona ugramis formu tarafindan olusturulan, progressif ve genellikle olumcul seyreden bir viral hastaliktir.

### Patogenez (Nasil Ilerler?)

**1. Felin Koronavirus (FCoV) Enfeksiyonu**
- Kedilerin buyuk cogunlugu (%25-40) FCoV ile enfektedir, cok kedili ortamlarda bu oran %80-90'a cikar.
- FCoV genellikle hafif enterit veya asemptomatik enfeksiyona neden olur.

**2. Virulensi Yuksek Mutasyon**
- FCoV'un makrofaj tropizmi kazandigi mutasyonlar sonucu virus FIPV formuna donusur.
- Bu mutasyon, virusun monosit/makrofajlarda replike olabilmesini saglar.

**3. Immunopatoloji**
- FIPV enfekte makrofajlar vaskuler endotele tutunur ve **piyogranulomatoz vaskulit** olusturur.
- Immun kompleks birikimi, kompleman aktivasyonu ve sitokin firtinasi hastalik patogenezinin temelini olusturur.

### Klinik Formlar

**Efuzif (Yas) Form:** Karin veya gogus bosluklarinda protein zengini sari efuzyon birikimi, abdominal distansiyon, solunum guclugu.

**Non-efuzif (Kuru) Form:** Granulomatoz lezyonlar (bobrekler, karaciger, gozler, MSS), norolojik belirtiler, uveit.

### Tedavide Yeni Gelismeler

- **GS-441524** (nukleozid analogu): Antiviral etki ile remisyon saglayan calismalar dikkat cekmistir.
- **GC376** (proteaz inhibitoru): Klinik deneylerde umut verici sonuclar elde edilmistir.

---
**Kaynak:** Pedersen, N.C. (2020). *The long history of feline infectious peritonitis.* Veterinary Journal, 268, 105592. [PubMed: 32994336](https://pubmed.ncbi.nlm.nih.gov/32994336/)`;
  }

  if ((q.includes('kopek') || q.includes('köpek')) && (q.includes('kalp kurdu') || q.includes('dirofilar') || q.includes('heartworm'))) {
    return `## Kopeklerde Kalp Kurdu Hastaligi (Dirofilariosis)

Kalp kurdu hastaligi, **Dirofilaria immitis** adli nematodun neden oldugu, kardiyopulmoner sistemi etkileyen ciddi ve potansiyel olarak olumcul bir paraziter hastaliktir.

### Yasam Dongusu ve Bulasma

**Vektor:** Sivrisinekler (Aedes, Culex, Anopheles turleri)

1. Enfekte sivrisinek kopegi isirdiginda L3 evre larvalar deri altina birakir.
2. Larvalar deri altinda L4 ve L5 evreye gelisir (2-3 ay).
3. Genc eriskinler kan dolasimiyla **pulmoner arterlere** ve agir enfeksiyonlarda **sag kalbe** ulasir.
4. Eriskin solucanlar **15-30 cm** uzunluga erisir ve 5-7 yil yasayabilir.
5. **Prepatent periyot:** yaklasik **6-7 ay**.

### Klinik Bulgular

| Sinif | Bulgular |
|-------|----------|
| **Sinif I (Hafif)** | Asemptomatik veya ara sira oksuruk |
| **Sinif II (Orta)** | Oksuruk, egzersiz intoleransi |
| **Sinif III (Agir)** | Kronik oksuruk, dispne, sag kalp yetmezligi bulgulari |
| **Sinif IV (Caval Sendrom)** | Akut hemolitik kriz, sok, DIC, olum |

### Tedavi

- **Melarsomin dihidroklorid** (Immiticide): AHS protokolune gore 3 enjeksiyon.
- Tedavi oncesi ve sonrasi **kesin egzersiz kisitlamasi**.
- **Doksisiklin** (4 hafta): Wolbachia endosimbiyontunu elimine eder.
- Aylik profilaksi: ivermektin, milbemisin oksim veya moksidestin bazli ilaclar.

---
**Kaynak:** American Heartworm Society. (2014). *Current canine guidelines for heartworm infection.* [PubMed: 24390396](https://pubmed.ncbi.nlm.nih.gov/24390396/)`;
  }

  if ((q.includes('kopek') || q.includes('köpek')) && (q.includes('kalca') || q.includes('kalça') || q.includes('displazi') || q.includes('hip'))) {
    return `## Kopeklerde Kalca Displazisi (Hip Dysplasia)

Kalca displazisi, kalca ekleminin anormal gelisimiyle karakterize edilen, **multifaktoriyel ve herediter** bir ortopedik hastaliktir. Buyuk ve dev irk kopeklerde yaygindir.

### Etiyoloji

**Genetik Faktorler:**
- Poligenik kalitim modeli ile aktarilir.
- Yuksek riskli irklar: Alman Coban, Labrador, Golden Retriever, Rottweiler, Saint Bernard.
- Kalitim orani: ortalama **%0.2-0.6**.

**Cevresel Faktorler:**
- Hizli buyume ve asiri beslenme
- Asiri egzersiz (yavru donemde)
- Obezite

### Patoloji

1. Femur basi ile asetabulum arasi uyumsuzluk (eklem gevsekligi)
2. Subluksasyon ve anormal eklem yuklenmesi
3. Eklem kikilrdak erozyonu ve sinoviyal iltihap
4. Sekonder osteoartrit gelisimi

### Tedavi

**Konservatif:** Kilo kontrolu, NSAID'ler, glukozamin/kondroitin, fizik tedavi.

**Cerrahi:**
- **Triple pelvik osteotomi (TPO):** Genc hayvanlarda.
- **Femur basi eksizyonu (FHO):** Kucuk irklarda.
- **Total kalca protezi (THP):** Altin standart.

---
**Kaynak:** Fries, C.L. & Remedios, A.M. (2016). *Treatment of canine hip dysplasia.* Canadian Veterinary Journal. [PubMed: 27687915](https://pubmed.ncbi.nlm.nih.gov/27687915/)`;
  }

  if ((q.includes('kopek') || q.includes('köpek')) && (q.includes('diyabet') || q.includes('diabet') || q.includes('seker') || q.includes('şeker'))) {
    return `## Kopeklerde Diabetes Mellitus

Diabetes mellitus (DM), insulin eksikligi veya insulin direnci sonucu olusan kronik bir metabolik hastalikdir. Kopeklerde en sik **Tip 1 diyabet** gorulur.

### Etiyoloji

- **Immun aracili beta hucre yikimi:** En yaygin neden.
- **Pankreatit:** Kronik pankreatit beta hucre hasari olusturabilir.
- **Genetik yatkinlik:** Samoyed, Schnauzer, Bichon Frise, Poodle gibi irklarda daha sik.
- **Dioestrus:** Kisirlaştirilmamis disi kopeklerde progesteron kaynakli insulin direnci.

### Klinik Belirtiler (Klasik Dort P)

1. **Poliuri** - Artmis idrar miktari
2. **Polidipsi** - Asiri su icme
3. **Polifaji** - Artmis istah
4. **Kilo kaybi** - Yag ve kas yikimi

Ileri vakalarda: **Diyabetik ketoasidoz (DKA)** → acil durumdur!

### Tedavi

- **Insulin:** Porsin lente insulin, 0.25-0.5 IU/kg, 12 saatte bir SC.
- **Diyet:** Yuksek lifli, kompleks karbohidratli diyet, sabit yemek saatleri.
- **Disi kopeklerde:** Ovariohisterektomi onerilir.
- **Izleme:** Fruktosamin olcumu, glisemik egri takibi.

---
**Kaynak:** Catchpole, B. et al. (2013). *Canine diabetes mellitus.* Diabetologia. [PubMed: 24985109](https://pubmed.ncbi.nlm.nih.gov/24985109/)`;
  }

  if ((q.includes('sigir') || q.includes('sığır') || q.includes('bovine')) && (q.includes('solunum') || q.includes('respiratory') || q.includes('brd'))) {
    return `## Sigirlarda Solunum Yolu Hastaliklari (BRD)

Bovine Respiratory Disease (BRD), sigir yetistiriciliğinin en onemli saglik ve ekonomik sorunlarindan biridir.

### Etiyoloji (Multifaktoriyel)

BRD, **stres + viral enfeksiyon + bakteriyel superenfeksiyon** uclusunun etkilesimiyle ortaya cikar:

**Viral Etkenler:** BRSV, BHV-1, BVDV, PI-3
**Bakteriyel Etkenler:** *Mannheimia haemolytica*, *Pasteurella multocida*, *Histophilus somni*, *Mycoplasma bovis*
**Stres Faktorleri:** Tasinma ("shipping fever"), karma gruplama, hava degisiklikleri

### Patogenez

1. Stres → kortizon artisi → immunosupresyon
2. Viral etkenler solunum yolu epitelini hasar → mukosilier klirens bozulur
3. Firsat bakterileri kolonize eder
4. **Fibrinoz bronkopnomoni** gelisir

### Klinik Belirtiler

Ates (> 40°C), burun akintisi, oksuruk, takipne, dispne, depresyon, istahsizlik.

### Tedavi ve Korunma

**Tedavi:** Genis spektrumlu antibiyotikler (tulathomisin, florfenikol), NSAID'ler.
**Korunma:** Asilama, biyoguvenlik, stres minimizasyonu, uygun barinma.

---
**Kaynak:** Griffin, D. et al. (2017). *Bovine respiratory disease.* Vet Clinics NA: Food Animal Practice. [PubMed: 28460660](https://pubmed.ncbi.nlm.nih.gov/28460660/)`;
  }

  if ((q.includes('sigir') || q.includes('sığır') || q.includes('bovine')) && (q.includes('tuberkuloz') || q.includes('verem') || q.includes('tuberculosis'))) {
    return `## Sigirlarda Tuberkuloz (Bovine Tuberculosis)

Sigir tuberkulozu, **Mycobacterium bovis** tarafindan olusturulan, kronik seyirli, **zoonoz** ve **ihbari mecburi** bir enfeksiyon hastaligidir.

### Bulasma Yollari

- **Aerosol/inhalasyon:** En yaygin yol. Enfekte hayvanlarin solunum sekresyonlari ile.
- **Oral yol:** Kontamine sut, yem ve su ile.
- **Yaban hayati rezervuarlari:** Porsuklar (Ingiltere), opossumlar (Yeni Zelanda).
- **Zoonoz:** Pastorize edilmemis sut ile insanlara bulasabilir.

### Tani

| Test | Aciklama |
|------|----------|
| **Tuberkulin Deri Testi (TST)** | Altin standart tarama. Intradermal PPD, 72 saat sonra degerlendirme. |
| **IFN-γ testi** | ELISA bazli kan testi, TST'ye tamamlayici. |
| **Bakteriyel kultur** | Kesin tani (8-12 hafta). |
| **PCR** | Hizli molekuler tani. |

### Kontrol

- **Test et - kes politikasi:** Pozitif hayvanlarin itlafi.
- Sutun pastorizasyonu, hayvan hareketlerinin kontrolu.
- Yaban hayati rezervuarlarinin yonetimi.

---
**Kaynak:** Waters, W.R. et al. (2011). *Bovine tuberculosis vaccine research.* Vaccine. [PubMed: 21376755](https://pubmed.ncbi.nlm.nih.gov/21376755/)`;
  }

  if (q.includes('bvd') || ((q.includes('sigir') || q.includes('sığır') || q.includes('bovine')) && (q.includes('viral diyare') || q.includes('viral diarrhea')))) {
    return `## Bovine Viral Diyare (BVD)

BVD, **BVDV** tarafindan olusturulan, sigirlarda onemli ureme, solunum ve immunosupresif problemlere yol acan bir viral hastaliktir.

### Enfeksiyon Tipleri

**1. Akut Enfeksiyon:** Hafif ates, burun akintisi, gecici lositte dusus, immunosupresyon.

**2. Persistan Enfeksiyon (PI Hayvanlar):**
- Gebeliğin 30-125. gunlerinde fetus enfeksiyonu sonucu gelisir.
- Fetus immun tolerans gelistirir, virus "kendi" olarak taninir.
- PI hayvanlar **omur boyu virus sacar** → surude en onemli kaynak.

**3. Mucosal Disease:** Yalnizca PI hayvanlarda, **%100 olumcul**.

**4. Ureme Etkileri:** Embriyonik olum, PI buzagi, konjenital malformasyonlar, abort.

### Tani

- **Antijen ELISA (Ear notch):** PI hayvanlarin tespiti.
- **RT-PCR:** Virus RNA tespiti.
- **Tank sutu PCR:** Suru duzeyinde tarama.

### Kontrol

1. PI hayvanlarin tespiti ve uzaklastirilmasi (en kritik basamak).
2. Asilama (canli/olu asilar).
3. Biyoguvenlik ve karantina.

---
**Kaynak:** Lanyon, S.R. et al. (2014). *Bovine viral diarrhoea: Pathogenesis and diagnosis.* Veterinary Journal. [PubMed: 25533699](https://pubmed.ncbi.nlm.nih.gov/25533699/)`;
  }

  const responses = {
    'dna': `**DNA Replikasyonu**

DNA replikasyonu, hucre bolunmesi oncesinde genetik materyalin kopyalanmasi surecidir. Bu islem yari-korunumlu (semi-conservative) bir mekanizma ile gerceklesir.

**Temel Asamalar:**

1. **Baslatma (Initiation):** Helikaz enzimi, DNA cift sarmalini acar ve replikasyon catalini olusturur.
2. **Uzama (Elongation):** DNA polimeraz III, serbest nukleotidleri kalip iplige komplementer olarak ekler.
3. **Sonlanma (Termination):** Replikasyon catallari birlestiginde islem tamamlanir.

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

2. **Calvin Dongusu (Stroma):**
   - CO₂ sabitlenir (karbon fiksasyonu)
   - ATP ve NADPH kullanilarak glikoz sentezlenir`,

    'hucre': `**Hucre Zarinin Yapisi**

Hucre zari (plazma membrani), hucreyi cevreleyen ve ic ortami dis ortamdan ayiran secici gecirgen bir yapidir.

**Akici Mozaik Modeli:**
- **Fosfolipit Cift Tabakasi:** Hidrofil bas ve hidrofob kuyruk
- **Membran Proteinleri:** Integral ve periferik proteinler
- **Kolesterol:** Membran akiskanligini duzenler
- **Karbohidratlar:** Hucre taninmasinda rol oynar`,

    'evrim': `**Evrim Teorisinin Temel Ilkeleri**

**Ana Mekanizmalar:**

1. **Dogal Secilim:** Cevrelerine daha iyi uyum saglayan bireyler hayatta kalma sansi daha yuksektir.
2. **Mutasyon:** DNA'daki rastgele degisimler yeni genetik cesitlilik yaratir.
3. **Genetik Suruklenme:** Kucuk populasyonlarda rastgele gen frekans degisimleri.
4. **Gen Akisi:** Populasyonlar arasi gen transferi.

**Kanitlar:** Fosil kayitlari, karsilastirmali anatomi, molekuler biyoloji, biyocografya.`,
  };

  for (const [key, response] of Object.entries(responses)) {
    if (q.includes(key)) return response;
  }

  return `Bu ilginc bir soru! Biyoloji alaninda pek cok farkli perspektiften incelenebilir.

**Genel Bakis:**
Bu konuyu anlamak icin temel biyoloji kavramlarini bilmek onemlidir.

**Oneriler:**
- Konuyla ilgili bilimsel makaleleri incelemenizi oneririm
- Deneysel calismalara goz atmaniz faydali olacaktir
- Guncel arastirmalari takip etmeniz alanin gelisimini kolaylastirir

Daha spesifik bir soru sormak ister misiniz?`;
}

module.exports = { generateResponse };
