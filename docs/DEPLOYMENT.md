# ShopSmooth - Deployment Guide

## Self-Hosted VPS Deployment

### Prerequisites
- Ubuntu 22.04+ VPS (DigitalOcean, AWS EC2, Linode, etc.)
- Domain name pointed to your VPS IP
- Minimum: 2GB RAM, 1 vCPU, 25GB SSD

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Install Nginx
sudo apt install nginx -y

# Install Certbot (SSL)
sudo apt install certbot python3-certbot-nginx -y

# Install process manager
sudo npm install -g pm2
```

### Step 2: Clone Project

```bash
cd /var/www
git clone <your-repo-url> shopsmooth
cd shopsmooth
```

### Step 3: Backend Setup

```bash
cd backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Create .env with production values
cp .env.example .env
nano .env  # Edit with production values

# Initialize database
python init_db.py

# Test run
python run.py
```

### Step 4: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local
echo 'NEXT_PUBLIC_API_URL=https://yourdomain.com/api' > .env.local
echo 'NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx' >> .env.local

# Build for production
npm run build
```

### Step 5: Create Systemd Service (Backend)

```bash
sudo nano /etc/systemd/system/shopsmooth-api.service
```

```ini
[Unit]
Description=ShopSmooth API
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/shopsmooth/backend
Environment="PATH=/var/www/shopsmooth/backend/venv/bin"
ExecStart=/var/www/shopsmooth/backend/venv/bin/gunicorn \
    -w 4 \
    -k uvicorn.workers.UvicornWorker \
    app.main:app \
    --bind 127.0.0.1:8000 \
    --access-logfile /var/log/shopsmooth/api-access.log \
    --error-logfile /var/log/shopsmooth/api-error.log
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo mkdir -p /var/log/shopsmooth
sudo chown www-data:www-data /var/log/shopsmooth
sudo systemctl enable shopsmooth-api
sudo systemctl start shopsmooth-api
```

### Step 6: Start Frontend with PM2

```bash
cd /var/www/shopsmooth/frontend
pm2 start npm --name "shopsmooth-web" -- start
pm2 save
pm2 startup
```

### Step 7: Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/shopsmooth
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 20M;

    # Frontend (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static uploads
    location /static/ {
        alias /var/www/shopsmooth/backend/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/shopsmooth /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8: SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 9: Verify

Visit https://yourdomain.com - Your ShopSmooth platform should be live!

---

## Custom Domain for Stores

### Architecture
Each store can have a custom domain. The platform handles this through:

1. Store owner adds domain in admin settings
2. DNS records are provided (A record pointing to server IP)
3. Owner configures DNS at their registrar
4. Platform verifies DNS
5. Nginx wildcard config routes requests
6. Let's Encrypt provides SSL

### Nginx Wildcard Config

```nginx
# For custom store domains
server {
    listen 80;
    server_name *.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
    }
}
```

---

## Monitoring

### Log Files
```bash
# API logs
tail -f /var/log/shopsmooth/api-access.log
tail -f /var/log/shopsmooth/api-error.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Frontend logs
pm2 logs shopsmooth-web
```

### Health Checks
```bash
# Backend health
curl http://localhost:8000/

# Frontend health
curl http://localhost:3000/
```

---

## Backup

### Database Backup
```bash
# SQLite
cp /var/www/shopsmooth/backend/shopsmooth.db /backups/shopsmooth-$(date +%Y%m%d).db

# PostgreSQL
pg_dump shopsmooth > /backups/shopsmooth-$(date +%Y%m%d).sql
```

### Automated Backup (Cron)
```bash
crontab -e
# Add:
0 2 * * * cp /var/www/shopsmooth/backend/shopsmooth.db /backups/shopsmooth-$(date +\%Y\%m\%d).db
```

---

## Updating

```bash
cd /var/www/shopsmooth

# Pull latest code
git pull origin main

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart shopsmooth-api

# Update frontend
cd ../frontend
npm install
npm run build
pm2 restart shopsmooth-web
```
