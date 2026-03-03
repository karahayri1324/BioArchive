# BioArchive

**Yapay Zeka Destekli Biyoloji Ogrenme ve Topluluk Platformu**

BioArchive, biyoloji ogrencileri ve arastirmacilar icin gelistirilmis, AI destekli ogrenme araci ve topluluk platformudur. Kullanicilar biyoloji sorularini AI asistana sorabilir, toplulukta icerik paylasabilir, flash kartlarla calisabilir ve PDF/video ozetleme araclari kullanabilir.

**Canli:** [https://bioarchive.com.tr](https://bioarchive.com.tr)
**API:** [https://api.bioarchive.com.tr](https://api.bioarchive.com.tr)

---

## Ozellikler

### AI Asistan
- Biyoloji konularinda akilli sohbet (OpenAI / Anthropic destegi)
- Markdown formatli detayli yanitlar
- Konusma gecmisi kaydetme
- Gorsel yukleme ve analiz
- Offline modda yerel yanit verme

### Topluluk
- Makale, Arastirma, Not ve Soru kategorilerinde paylasim
- Begeni, yorum ve kaydetme sistemi
- Etiket sistemi ile icerik organizasyonu
- Paylasim linkleri (native share API destegi)

### Flash Kartlar
- Hazir biyoloji ve genetik kartlari
- Kullanici tarafindan olusturulabilen kart setleri
- 3D cevrilme animasyonu ile interaktif ogrenme

### Kullanici Sistemi
- Kayit ve giris (JWT tabanli)
- Profil yonetimi
- Kaydedilen paylasimlari goruntuleme

### Ek Araclar
- PDF belge ozetleme (AI destekli)
- Video icerik ozetleme
- Karanlik/aydinlik tema destegi
- Tamamen duyarli (responsive) tasarim
- Mobil uyumlu bottom tab bar

---

## Proje Yapisi

```
BioArchive/
├── README.md                    # Bu dosya
├── .gitignore
│
├── frontend/                    # Frontend (SPA)
│   ├── index.html              # Ana HTML dosyasi
│   ├── css/
│   │   └── style.css           # Tum stiller (~2100 satir)
│   ├── js/
│   │   ├── config.js           # API URL ve sabitler
│   │   ├── api.js              # Backend API client
│   │   ├── state.js            # Durum yonetimi & ornek veri
│   │   ├── app.js              # Ana entry point & router
│   │   └── components/
│   │       ├── icons.js        # SVG ikon kutuphanesi
│   │       ├── auth.js         # Giris/kayit islemleri
│   │       ├── chat.js         # AI sohbet modulu
│   │       ├── community.js    # Topluluk & post yonetimi
│   │       ├── modals.js       # Modal sistemi & flash kartlar
│   │       └── utils.js        # Yardimci fonksiyonlar
│   └── assets/
│       └── logo.jpeg           # BioArchive logosu
│
└── vds/                         # Sunucu Tarafı (Backend + Deploy)
    ├── api/                     # Node.js/Express API
    │   ├── package.json
    │   ├── .env.example         # Ortam degiskenleri sablonu
    │   ├── ecosystem.config.js  # PM2 yapilandirmasi
    │   ├── src/
    │   │   ├── index.js         # API giris noktasi
    │   │   ├── config.js        # Ortam degiskenleri parse
    │   │   ├── middleware/
    │   │   │   ├── auth.js      # JWT kimlik dogrulama
    │   │   │   ├── rateLimit.js # Istek sinirlandirma
    │   │   │   └── errorHandler.js
    │   │   ├── routes/
    │   │   │   ├── auth.js      # POST /api/auth/*
    │   │   │   ├── chat.js      # POST /api/chat/*
    │   │   │   ├── posts.js     # CRUD /api/posts/*
    │   │   │   ├── comments.js  # CRUD /api/comments/*
    │   │   │   ├── flashcards.js # CRUD /api/flashcards/*
    │   │   │   └── users.js     # GET/PUT /api/users/*
    │   │   ├── models/
    │   │   │   └── db.js        # PostgreSQL baglantisi
    │   │   └── services/
    │   │       └── aiService.js # OpenAI/Anthropic entegrasyonu
    │   ├── database/
    │   │   ├── schema.sql       # Veritabani semasi (9 tablo)
    │   │   ├── seed.sql         # Ornek veriler
    │   │   ├── migrate.js       # Sema olusturma scripti
    │   │   └── seed.js          # Veri ekleme scripti
    │   └── uploads/             # Yuklenen dosyalar
    │
    ├── nginx/
    │   └── bioarchive.conf      # Nginx yapilandirmasi
    │                            # (bioarchive.com.tr + api subdomain)
    ├── docker/
    │   ├── Dockerfile.api       # API Docker image
    │   ├── Dockerfile.frontend  # Frontend Docker image
    │   ├── docker-compose.yml   # PostgreSQL + API + Frontend
    │   ├── nginx-docker.conf    # Docker icin Nginx config
    │   └── .env.example         # Docker ortam degiskenleri
    │
    └── scripts/
        ├── setup.sh             # Otomatik VDS kurulum scripti
        └── ssl-setup.sh         # Let's Encrypt SSL kurulumu
```

---

## Hizli Baslangic (Yerel Gelistirme)

### Ongereksinimler
- Node.js 18+ (tercihen 20 LTS)
- PostgreSQL 14+

### 1. Repoyu Klonla
```bash
git clone https://github.com/kullanici/bioarchive.git
cd bioarchive
```

### 2. Veritabanini Olustur
```bash
sudo -u postgres psql -c "CREATE USER bioarchive_user WITH PASSWORD 'local_dev_123';"
sudo -u postgres psql -c "CREATE DATABASE bioarchive OWNER bioarchive_user;"
```

### 3. API'yi Baslat
```bash
cd vds/api
cp .env.example .env
# .env dosyasindaki DB_PASSWORD'u yukarda belirledginiz sifre ile degistirin

npm install
npm run db:migrate
npm run db:seed
npm run dev
```
API `http://localhost:3000` adresinde calisacak.

### 4. Frontend'i Baslat
```bash
cd frontend
npx serve -p 5500
# veya: python3 -m http.server 5500
```

### 5. Tarayicida Ac
```
http://localhost:5500
```

> **Not:** API calismiyorsa frontend otomatik olarak "offline mod"a gecer ve yerel ornek verilerle calisir.

---

## API Endpoint Referansi

Base URL: `https://api.bioarchive.com.tr/api`

### Kimlik Dogrulama (Auth)
| Metot | Endpoint | Auth | Aciklama |
|-------|----------|------|----------|
| `POST` | `/auth/register` | Hayir | Yeni kullanici kaydi |
| `POST` | `/auth/login` | Hayir | Kullanici girisi |
| `POST` | `/auth/refresh` | Hayir | Token yenileme |
| `GET` | `/auth/me` | Evet | Mevcut kullanici bilgisi |

**Kayit Ornegi:**
```bash
curl -X POST https://api.bioarchive.com.tr/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ahmet",
    "email": "ahmet@ornek.com",
    "password": "guclu_sifre_123",
    "displayName": "Ahmet Yilmaz"
  }'
```

**Giris Ornegi:**
```bash
curl -X POST https://api.bioarchive.com.tr/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login": "ahmet", "password": "guclu_sifre_123"}'
```

### AI Sohbet
| Metot | Endpoint | Auth | Aciklama |
|-------|----------|------|----------|
| `POST` | `/chat/message` | Evet | AI'a mesaj gonder |
| `GET` | `/chat/conversations` | Evet | Konusmalar listesi |
| `GET` | `/chat/conversations/:id` | Evet | Konusma detayi + mesajlar |
| `DELETE` | `/chat/conversations/:id` | Evet | Konusma sil |

**Mesaj Gonderme:**
```bash
curl -X POST https://api.bioarchive.com.tr/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"message": "DNA replikasyonu nasil calisir?"}'
```

### Paylasimlari (Posts)
| Metot | Endpoint | Auth | Aciklama |
|-------|----------|------|----------|
| `GET` | `/posts?category=article&page=1&sort=newest` | Opsiyonel | Paylasimlari listele |
| `GET` | `/posts/:id` | Opsiyonel | Paylasim detayi + yorumlar |
| `POST` | `/posts` | Evet | Yeni paylasim olustur |
| `PUT` | `/posts/:id` | Evet | Paylasim guncelle (yazar) |
| `DELETE` | `/posts/:id` | Evet | Paylasim sil (yazar) |
| `POST` | `/posts/:id/like` | Evet | Begeni toggle |
| `POST` | `/posts/:id/bookmark` | Evet | Kaydet toggle |

### Yorumlar
| Metot | Endpoint | Auth | Aciklama |
|-------|----------|------|----------|
| `POST` | `/comments` | Evet | Yorum ekle |
| `DELETE` | `/comments/:id` | Evet | Yorum sil (yazar) |

### Flash Kartlar
| Metot | Endpoint | Auth | Aciklama |
|-------|----------|------|----------|
| `GET` | `/flashcards?topic=Genetik` | Opsiyonel | Kart setleri listele |
| `GET` | `/flashcards/:setId/cards` | Opsiyonel | Kartlari getir |
| `POST` | `/flashcards` | Evet | Yeni kart seti olustur |

### Kullanicilar
| Metot | Endpoint | Auth | Aciklama |
|-------|----------|------|----------|
| `GET` | `/users/:username` | Hayir | Kullanici profili |
| `PUT` | `/users/profile` | Evet | Kendi profilini guncelle |
| `GET` | `/users/me/bookmarks` | Evet | Kaydedilen paylasimlari |

### Saglik Kontrolu
```bash
curl https://api.bioarchive.com.tr/api/health
# {"status":"ok","service":"BioArchive API","version":"1.0.0",...}
```

---

## VDS Kurulumu (Production)

### Gereksinimler
- Ubuntu 22.04 LTS veya Debian 12
- En az 1 GB RAM, 20 GB disk
- Root veya sudo erisimi

### Yontem 1: Otomatik Kurulum Scripti

```bash
# Sunucuya baglan
ssh root@SUNUCU_IP

# Proje dosyalarini yukle
git clone https://github.com/kullanici/bioarchive.git /var/www/bioarchive
cd /var/www/bioarchive

# Otomatik kurulum (her seyi yapar)
chmod +x vds/scripts/setup.sh
sudo bash vds/scripts/setup.sh
```

Script asagidakileri otomatik yapar:
1. Sistem guncelleme
2. Node.js 20 LTS kurulumu
3. PostgreSQL kurulumu ve yapilandirmasi
4. Nginx kurulumu
5. PM2 kurulumu
6. Veritabani olusturma ve veri ekleme
7. UFW firewall yapilandirmasi
8. Fail2ban kurulumu

### Yontem 2: Docker ile Kurulum

```bash
cd /var/www/bioarchive/vds/docker
cp .env.example .env
nano .env  # Degiskenleri doldurun

docker compose up -d
```

### DNS Yapilandirmasi

Domain yoneticinizde asagidaki A kayitlarini olusturun:

| Tip | Host | Deger |
|-----|------|-------|
| A | `@` (bioarchive.com.tr) | SUNUCU_IP |
| A | `www` | SUNUCU_IP |
| A | `api` | SUNUCU_IP |

### SSL Sertifikasi

DNS kayitlari yayildiktan sonra (genellikle 5-30 dakika):

```bash
chmod +x vds/scripts/ssl-setup.sh
sudo bash vds/scripts/ssl-setup.sh admin@bioarchive.com.tr
```

### AI API Anahtarini Ekleme

```bash
nano /var/www/bioarchive/vds/api/.env
# OPENAI_API_KEY satarina anahtarinizi yapistin
# veya Anthropic kullanmak icin:
# AI_PROVIDER=anthropic
# ANTHROPIC_API_KEY=sk-ant-xxxxx

# Servisi yeniden baslat
pm2 restart bioarchive-api
```

### PM2 Komutlari
```bash
pm2 status                    # Servis durumu
pm2 logs bioarchive-api       # Canli loglar
pm2 restart bioarchive-api    # Yeniden baslat
pm2 monit                     # CPU/RAM izleme
```

---

## Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Backend** | Node.js 20 + Express.js 4 |
| **Veritabani** | PostgreSQL 16 |
| **Auth** | JWT (access + refresh token) |
| **AI** | OpenAI API / Anthropic API |
| **Web Sunucu** | Nginx (reverse proxy) |
| **Process** | PM2 (cluster mode) |
| **Container** | Docker & Docker Compose |
| **SSL** | Let's Encrypt (Certbot) |
| **Guvenlik** | Helmet, CORS, Rate Limit, Fail2ban |

---

## Ortam Degiskenleri

Tam liste icin: `vds/api/.env.example`

| Degisken | Aciklama | Varsayilan |
|----------|----------|------------|
| `NODE_ENV` | Ortam | `development` |
| `PORT` | API portu | `3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_NAME` | Veritabani adi | `bioarchive` |
| `DB_USER` | DB kullanicisi | `bioarchive_user` |
| `DB_PASSWORD` | DB sifresi | - |
| `JWT_SECRET` | JWT imza anahtari (32+ karakter) | - |
| `AI_PROVIDER` | `openai` veya `anthropic` | `openai` |
| `OPENAI_API_KEY` | OpenAI API anahtari | - |
| `CORS_ORIGIN` | Izin verilen origin'ler | `http://localhost:5500` |

---

## Guvenlik Onlemleri

- Tum sifreler **bcrypt** ile hashlenir (12 round)
- **JWT** token tabanli kimlik dogrulama (access + refresh)
- **Rate limiting**: Genel 100/15dk, Chat 10/dk, Auth 20/15dk
- **Helmet.js** guvenlik headerlari
- **CORS** politikasi (sadece izinli domainler)
- **XSS korumasi** (escapeHtml fonksiyonu)
- **SQL Injection korumasi** (parameterized queries)
- **HTTPS zorunlu** (HSTS header)
- **Fail2ban** kaba kuvvet korumasi
- **UFW** firewall (sadece 22, 80, 443 portlari)

---

## Lisans

MIT License
