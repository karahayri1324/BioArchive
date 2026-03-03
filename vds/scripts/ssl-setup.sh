#!/bin/bash
# ============================================
# BioArchive - SSL Sertifikasi Kurulumu
# Let's Encrypt ile ucretsiz SSL
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN="bioarchive.com.tr"
EMAIL="${1:-admin@bioarchive.com.tr}"

echo -e "${BLUE}BioArchive SSL Sertifikasi Kurulumu${NC}"
echo ""

if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Root olarak calistirin: sudo bash ssl-setup.sh admin@email.com${NC}"
    exit 1
fi

# Certbot yoksa kur
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
fi

echo -e "${YELLOW}SSL sertifikasi aliniyor...${NC}"
certbot --nginx \
    -d ${DOMAIN} \
    -d www.${DOMAIN} \
    -d api.${DOMAIN} \
    --email ${EMAIL} \
    --agree-tos \
    --non-interactive \
    --redirect

# Otomatik yenileme icin cron
echo -e "${YELLOW}Otomatik yenileme ayarlaniyor...${NC}"
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | sort -u | crontab -

echo ""
echo -e "${GREEN}SSL sertifikasi basariyla kuruldu!${NC}"
echo -e "Sertifika 90 gun gecerlidir ve otomatik olarak yenilenecektir."
echo ""
echo -e "Test edin:"
echo -e "  ${BLUE}https://${DOMAIN}${NC}"
echo -e "  ${BLUE}https://api.${DOMAIN}/api/health${NC}"
