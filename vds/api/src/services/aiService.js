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

async function generateResponse(message, conversationHistory) {
  const provider = config.ai.provider;

  try {
    if (provider === 'openai') {
      return await generateOpenAI(message, conversationHistory);
    } else if (provider === 'anthropic') {
      return await generateAnthropic(message, conversationHistory);
    } else {
      return generateFallback(message);
    }
  } catch (err) {
    console.error('[AI] Hata:', err.message);
    // Fallback - yerel yanit ver
    return generateFallback(message);
  }
}

async function generateOpenAI(message, history) {
  const OpenAI = require('openai');
  const client = new OpenAI({ apiKey: config.ai.openai.apiKey });

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
  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: config.ai.anthropic.apiKey });

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
- Guncel arastirmalari takip etmeniz alanin gelisimini anlamanizi kolaylastirir

Daha spesifik bir soru sormak ister misiniz?`;
}

module.exports = { generateResponse };
