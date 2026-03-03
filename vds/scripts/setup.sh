#!/bin/bash
# ============================================
# BioArchive - VDS Kurulum Scripti
# Ubuntu 22.04 / Debian 12 icin optimize edilmistir
# ============================================

set -e

# Renkli cikti
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "============================================"
echo "  BioArchive VDS Kurulum Scripti"
echo "  bioarchive.com.tr"
echo "============================================"
echo -e "${NC}"

# Root kontrolu
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Bu script root olarak calistirilmalidir!${NC}"
    echo "Kullanim: sudo bash setup.sh"
    exit 1
fi

DOMAIN="bioarchive.com.tr"
API_DOMAIN="api.bioarchive.com.tr"
APP_DIR="/var/www/bioarchive"
DB_NAME="bioarchive"
DB_USER="bioarchive_user"

# Rastgele sifre olustur
DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)
JWT_SECRET=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 48)
JWT_REFRESH_SECRET=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 48)

echo -e "${YELLOW}[1/8] Sistem guncelleniyor...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}[2/8] Gerekli paketler yukleniyor...${NC}"
apt install -y \
    nginx \
    postgresql \
    postgresql-contrib \
    certbot \
    python3-certbot-nginx \
    git \
    curl \
    ufw \
    fail2ban \
    htop

# Node.js 20 LTS kurulumu
echo -e "${YELLOW}[3/8] Node.js 20 LTS kuruluyor...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# PM2 kurulumu
npm install -g pm2

echo -e "${YELLOW}[4/8] PostgreSQL yapilandiriliyor...${NC}"
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};" 2>/dev/null || true

echo -e "${YELLOW}[5/8] Uygulama dizini olusturuluyor...${NC}"
mkdir -p ${APP_DIR}
mkdir -p ${APP_DIR}/vds/api/uploads

# Proje dosyalarini kopyala (yerel kurulumda)
if [ -d "$(dirname "$0")/../api" ]; then
    cp -r "$(dirname "$0")/../api" "${APP_DIR}/vds/"
    cp -r "$(dirname "$0")/../../frontend" "${APP_DIR}/"
fi

echo -e "${YELLOW}[6/8] API bagimliiklari yukleniyor...${NC}"
cd ${APP_DIR}/vds/api
npm install --production

# .env dosyasini olustur
cat > ${APP_DIR}/vds/api/.env << EOF
NODE_ENV=production
PORT=3000
API_URL=https://${API_DOMAIN}

DB_HOST=localhost
DB_PORT=5432
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_SSL=false

JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_REFRESH_EXPIRES_IN=30d

AI_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

CORS_ORIGIN=https://${DOMAIN},https://www.${DOMAIN}

UPLOAD_MAX_SIZE=10485760
UPLOAD_DIR=./uploads

RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
EOF

# Veritabani semasini olustur
echo -e "${YELLOW}[7/8] Veritabani semasi olusturuluyor...${NC}"
cd ${APP_DIR}/vds/api
PGPASSWORD=${DB_PASSWORD} psql -U ${DB_USER} -d ${DB_NAME} -h localhost -f database/schema.sql
PGPASSWORD=${DB_PASSWORD} psql -U ${DB_USER} -d ${DB_NAME} -h localhost -f database/seed.sql

echo -e "${YELLOW}[8/8] Servisler yapilandiriliyor...${NC}"

# Nginx yapilandirmasi
cp "$(dirname "$0")/../nginx/bioarchive.conf" /etc/nginx/sites-available/bioarchive.conf
ln -sf /etc/nginx/sites-available/bioarchive.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Nginx test (SSL olmadan once)
nginx -t

# Firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# PM2 ile API'yi baslat
cd ${APP_DIR}/vds/api
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Nginx'i baslat
systemctl restart nginx

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Kurulum Tamamlandi!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "Veritabani Bilgileri:"
echo -e "  DB Adi:     ${BLUE}${DB_NAME}${NC}"
echo -e "  DB Kullanici: ${BLUE}${DB_USER}${NC}"
echo -e "  DB Sifre:   ${BLUE}${DB_PASSWORD}${NC}"
echo ""
echo -e "${YELLOW}ONEMLI: Bu bilgileri guvenli bir yere kaydedin!${NC}"
echo ""
echo -e "Sonraki Adimlar:"
echo -e "  1. DNS kayitlarini yapilandirin:"
echo -e "     ${BLUE}${DOMAIN}${NC}       -> Sunucu IP"
echo -e "     ${BLUE}www.${DOMAIN}${NC}   -> Sunucu IP"
echo -e "     ${BLUE}${API_DOMAIN}${NC}   -> Sunucu IP"
echo ""
echo -e "  2. SSL sertifikasi alin:"
echo -e "     ${BLUE}sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} -d ${API_DOMAIN}${NC}"
echo ""
echo -e "  3. .env dosyasindaki AI API anahtarini ekleyin:"
echo -e "     ${BLUE}nano ${APP_DIR}/vds/api/.env${NC}"
echo ""
echo -e "  4. PM2 ile servisi yeniden baslatin:"
echo -e "     ${BLUE}pm2 restart bioarchive-api${NC}"
echo ""
