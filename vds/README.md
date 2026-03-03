# BioArchive - VDS Kurulum Rehberi

Bu rehber, BioArchive'i bir VDS (Virtual Dedicated Server) uzerinde sifirdan kurmak icin gereken tum adimlari icerir.

---

## Gereksinimler

| Bilesken | Minimum | Onerilen |
|----------|---------|----------|
| **Isletim Sistemi** | Ubuntu 20.04 LTS | Ubuntu 22.04 LTS |
| **RAM** | 1 GB | 2 GB+ |
| **Disk** | 20 GB SSD | 40 GB+ SSD |
| **CPU** | 1 vCPU | 2 vCPU+ |

**Domain:** `bioarchive.com.tr` (A kayitlari sunucu IP'sine yonlendirilmis olmali)

---

## 1. Otomatik Kurulum (Onerilen)

Tek komutla her seyi kurar:

```bash
ssh root@SUNUCU_IP
git clone https://github.com/kullanici/bioarchive.git /var/www/bioarchive
cd /var/www/bioarchive
chmod +x vds/scripts/setup.sh
sudo bash vds/scripts/setup.sh
```

Script tamamlandiginda ekranda veritabani bilgileri gorunecektir. **Bu bilgileri kaydedin!**

---

## 2. Manuel Kurulum (Adim Adim)

### 2.1 Sistem Guncelleme
```bash
apt update && apt upgrade -y
```

### 2.2 Node.js 20 LTS Kurulumu
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v  # v20.x.x olmali
```

### 2.3 PostgreSQL Kurulumu
```bash
apt install -y postgresql postgresql-contrib

# Veritabani ve kullanici olustur
sudo -u postgres psql << 'SQL'
CREATE USER bioarchive_user WITH PASSWORD 'GUCLU_SIFRE_BURAYA';
CREATE DATABASE bioarchive OWNER bioarchive_user;
GRANT ALL PRIVILEGES ON DATABASE bioarchive TO bioarchive_user;
SQL
```

### 2.4 Proje Dosyalarini Yukle
```bash
mkdir -p /var/www/bioarchive
cd /var/www/bioarchive
git clone https://github.com/kullanici/bioarchive.git .
```

### 2.5 API Bagimliiklari
```bash
cd /var/www/bioarchive/vds/api
npm install --production
```

### 2.6 Ortam Degiskenleri
```bash
cp .env.example .env
nano .env
```

Asagidaki degerleri doldurun:
```
DB_PASSWORD=yukarda_belirledginiz_sifre
JWT_SECRET=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 48)
JWT_REFRESH_SECRET=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 48)
OPENAI_API_KEY=sk-xxxx  (isteginize bagli)
```

### 2.7 Veritabani Semasini Olustur
```bash
cd /var/www/bioarchive/vds/api
npm run db:migrate
npm run db:seed
```

### 2.8 PM2 Kurulumu ve Baslat
```bash
npm install -g pm2
cd /var/www/bioarchive/vds/api
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 2.9 Nginx Kurulumu
```bash
apt install -y nginx

# Config dosyasini kopyala
cp /var/www/bioarchive/vds/nginx/bioarchive.conf /etc/nginx/sites-available/
ln -sf /etc/nginx/sites-available/bioarchive.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test et
nginx -t

# Baslat
systemctl restart nginx
systemctl enable nginx
```

### 2.10 Firewall
```bash
apt install -y ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 2.11 Fail2ban
```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

---

## 3. DNS Yapilandirmasi

Domain yoneticinizde (orn. Cloudflare, GoDaddy, Turhost) asagidaki kayitlari olusturun:

| Tip | Host | Deger | TTL |
|-----|------|-------|-----|
| **A** | `@` (bioarchive.com.tr) | `SUNUCU_IP` | 3600 |
| **A** | `www` | `SUNUCU_IP` | 3600 |
| **A** | `api` | `SUNUCU_IP` | 3600 |

DNS yayilimi genellikle 5-30 dakika surer. Kontrol etmek icin:
```bash
dig bioarchive.com.tr +short
dig api.bioarchive.com.tr +short
```

---

## 4. SSL Sertifikasi (HTTPS)

DNS kayitlari yayildiktan sonra:

```bash
chmod +x /var/www/bioarchive/vds/scripts/ssl-setup.sh
sudo bash /var/www/bioarchive/vds/scripts/ssl-setup.sh admin@bioarchive.com.tr
```

Veya manuel olarak:
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d bioarchive.com.tr -d www.bioarchive.com.tr -d api.bioarchive.com.tr \
  --email admin@bioarchive.com.tr --agree-tos --non-interactive --redirect
```

Otomatik yenileme icin cron ekleyin:
```bash
crontab -e
# Ekleyin:
0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'
```

---

## 5. AI Entegrasyonu

### OpenAI Kullanmak Icin
1. https://platform.openai.com adresinden API anahtari alin
2. `.env` dosyasini duzenleyin:
```bash
nano /var/www/bioarchive/vds/api/.env
```
```
AI_PROVIDER=openai
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
```

### Anthropic (Claude) Kullanmak Icin
```
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

Degisiklikten sonra servisi yeniden baslatin:
```bash
pm2 restart bioarchive-api
```

---

## 6. Docker ile Kurulum (Alternatif)

Docker tercih ediyorsaniz:

```bash
# Docker ve Docker Compose kur
curl -fsSL https://get.docker.com | sh

# Proje dizinine git
cd /var/www/bioarchive/vds/docker
cp .env.example .env
nano .env  # Degiskenleri doldurun

# Servisleri baslat
docker compose up -d

# Durum kontrol
docker compose ps
docker compose logs -f api
```

### Docker Komutlari
```bash
docker compose up -d          # Tum servisleri baslat
docker compose down            # Tum servisleri durdur
docker compose restart api     # Sadece API'yi yeniden baslat
docker compose logs -f api     # API loglarini izle
docker compose exec db psql -U bioarchive_user bioarchive  # DB'ye baglan
```

---

## 7. Yonetim Komutlari

### PM2
```bash
pm2 status                     # Servis durumu
pm2 logs bioarchive-api        # Canli loglar
pm2 logs bioarchive-api --lines 100  # Son 100 satir
pm2 restart bioarchive-api     # Yeniden baslat
pm2 reload bioarchive-api      # Zero-downtime reload
pm2 monit                      # CPU/RAM izleme paneli
pm2 delete bioarchive-api      # Servisi kaldir
```

### Nginx
```bash
nginx -t                       # Yapilandirma testi
systemctl restart nginx        # Yeniden baslat
systemctl status nginx         # Durum
tail -f /var/log/nginx/bioarchive-api-error.log  # Hata loglari
```

### PostgreSQL
```bash
# Veritabanina baglan
sudo -u postgres psql -d bioarchive

# Veritabanini yedekle
pg_dump -U bioarchive_user bioarchive > backup_$(date +%Y%m%d).sql

# Yedehi geri yukle
psql -U bioarchive_user bioarchive < backup_20240101.sql

# Tablo boyutlari
sudo -u postgres psql -d bioarchive -c "
SELECT relname as table, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_catalog.pg_statio_user_tables ORDER BY pg_total_relation_size(relid) DESC;"
```

### Guncelleme
```bash
cd /var/www/bioarchive
git pull origin main

# Backend guncelleme
cd vds/api
npm install --production
pm2 restart bioarchive-api

# Frontend guncelleme otomatik uygulanir (Nginx statik dosya sunar)
```

---

## 8. Izleme ve Sorun Giderme

### API Saglik Kontrolu
```bash
curl -s https://api.bioarchive.com.tr/api/health | jq
```

### Yaygın Sorunlar

**API calismiyorsa:**
```bash
pm2 logs bioarchive-api --lines 50
# .env dosyasini kontrol edin
# Veritabani baglantisini kontrol edin
```

**502 Bad Gateway:**
```bash
# API'nin calistiginden emin olun
pm2 status
# Port 3000'in acik oldugunu kontrol edin
ss -tlnp | grep 3000
```

**SSL sertifika hatasi:**
```bash
# Sertifika durumunu kontrol edin
certbot certificates
# Manuel yenileme
certbot renew
```

**Veritabani baglanti hatasi:**
```bash
# PostgreSQL'in calistigini kontrol edin
systemctl status postgresql
# Baglanti testi
PGPASSWORD=sifre psql -U bioarchive_user -d bioarchive -h localhost -c "SELECT 1"
```

---

## 9. Yedekleme

### Otomatik Yedekleme (Cron)
```bash
# Yedekleme scripti olustur
cat > /opt/bioarchive-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups/bioarchive"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M)

# Veritabani yedegi
PGPASSWORD=DB_SIFRE pg_dump -U bioarchive_user -h localhost bioarchive | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# 30 gunden eski yedekleri sil
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
EOF

chmod +x /opt/bioarchive-backup.sh

# Her gun saat 02:00'de calistir
crontab -e
# Ekleyin:
0 2 * * * /opt/bioarchive-backup.sh
```

---

## Mimari Diyagram

```
                    bioarchive.com.tr
                          |
                     [Cloudflare]  (opsiyonel CDN)
                          |
                    [VDS Sunucu]
                          |
                     ┌────┴────┐
                     │  Nginx  │
                     │  (443)  │
                     └────┬────┘
                ┌─────────┴─────────┐
                │                   │
    bioarchive.com.tr      api.bioarchive.com.tr
                │                   │
         [Statik Dosyalar]    [Reverse Proxy]
         /var/www/bioarchive       │
         /frontend/           ┌────┴────┐
                              │  PM2    │
                              │ Node.js │
                              │  :3000  │
                              └────┬────┘
                                   │
                              ┌────┴────┐
                              │ Postgres│
                              │  :5432  │
                              └─────────┘
```
