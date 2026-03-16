# ShopSmooth - Modern E-Commerce Platform

A complete, production-ready e-commerce platform inspired by Shopify. Built with **Next.js 14** (frontend) and **Python FastAPI** (backend).

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Next.js 14                      │
│          (React, Tailwind, Framer Motion)         │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Store     │  │ Admin    │  │ Landing      │   │
│  │ Pages     │  │ Dashboard│  │ Page         │   │
│  └──────────┘  └──────────┘  └──────────────┘   │
└──────────────────────┬──────────────────────────┘
                       │ REST API
┌──────────────────────┴──────────────────────────┐
│                  FastAPI Backend                   │
│           (Python, SQLAlchemy, JWT)                │
│                                                   │
│  ┌──────┐ ┌────────┐ ┌─────────┐ ┌──────────┐  │
│  │ Auth │ │Products│ │ Orders  │ │ Payments │  │
│  └──────┘ └────────┘ └─────────┘ └──────────┘  │
└──────────────────────┬──────────────────────────┘
                       │
              ┌────────┴────────┐
              │  SQLite / PostgreSQL │
              └─────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| State | Zustand |
| Backend | Python FastAPI |
| Database | SQLite (dev) / PostgreSQL (prod) |
| ORM | SQLAlchemy |
| Auth | JWT (python-jose) |
| Payments | Razorpay |
| File Storage | Local / S3 |

## Features

### For Store Owners
- One-click store creation
- Product & inventory management
- Order processing & fulfillment
- Customer management
- Coupon & discount system
- Banner management
- Revenue analytics dashboard
- Custom domain connection
- Navbar color customization
- Payment gateway setup (Razorpay)
- Email notification setup
- Policy page editor
- Delivery configuration

### For Customers
- Beautiful, responsive storefront
- Product search & filtering
- Product reviews & ratings
- Shopping cart with drawer
- Secure checkout (Razorpay / COD)
- Order tracking
- Address management
- Wishlist
- Account management

### Design & UX
- Smooth page transitions (Framer Motion)
- Product card hover effects (zoom, quick-add)
- Search modal (Cmd+K)
- Cart slide-in drawer
- Skeleton loading states
- Toast notifications
- Mobile-first responsive design
- Dark mode support
- Custom store branding/colors

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm

### 1. Clone & Setup Backend

```bash
cd shopsmooth/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Initialize database with sample data
python init_db.py

# Start backend server
python run.py
```

Backend runs at: **http://localhost:8000**
API docs at: **http://localhost:8000/docs**

### 2. Setup Frontend

```bash
cd shopsmooth/frontend

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:3000**

### 3. Access the Platform

| Page | URL |
|------|-----|
| Landing Page | http://localhost:3000 |
| Store Admin Login | http://localhost:3000/auth/login |
| Admin Dashboard | http://localhost:3000/admin |
| Sample Store | http://localhost:3000/store/fashion-hub |

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Platform Admin | admin@shopsmooth.com | admin123 |
| Store Admin | storeadmin@fashionhub.com | store123 |
| Customer | customer@example.com | customer123 |

## Project Structure

```
shopsmooth/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── main.py            # FastAPI app entry
│   │   ├── config.py          # Settings
│   │   ├── database.py        # DB connection
│   │   ├── models/            # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── store.py
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   └── extras.py
│   │   ├── routers/           # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── stores.py
│   │   │   ├── products.py
│   │   │   ├── cart.py
│   │   │   ├── orders.py
│   │   │   ├── payments.py
│   │   │   ├── reviews.py
│   │   │   ├── customers.py
│   │   │   ├── coupons.py
│   │   │   ├── addresses.py
│   │   │   ├── uploads.py
│   │   │   └── domains.py
│   │   ├── utils/
│   │   │   ├── security.py    # JWT & passwords
│   │   │   └── helpers.py     # Utilities
│   │   └── middleware/
│   │       └── cors.py
│   ├── static/uploads/        # File uploads
│   ├── requirements.txt
│   ├── run.py
│   └── init_db.py
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── auth/          # Login/Register
│   │   │   ├── admin/         # Dashboard pages
│   │   │   └── store/[slug]/  # Store pages
│   │   ├── components/
│   │   │   ├── ui/            # Reusable components
│   │   │   └── layout/        # Layout components
│   │   ├── lib/
│   │   │   ├── api.ts         # API client
│   │   │   └── auth.ts        # Auth utilities
│   │   └── store/
│   │       └── useStore.ts    # Zustand state
│   ├── public/
│   ├── package.json
│   └── next.config.mjs
│
├── docs/                       # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CUSTOMIZATION.md
│
└── README.md
```

## API Documentation

FastAPI auto-generates interactive API docs:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Key Endpoints

```
Auth:
  POST /api/auth/register       - Register
  POST /api/auth/login          - Login (returns JWT)
  GET  /api/auth/me             - Current user

Store:
  GET  /api/stores              - List stores
  GET  /api/stores/{slug}       - Store details
  PUT  /api/stores/{id}         - Update store

Products:
  GET  /api/stores/{id}/products          - List products
  POST /api/stores/{id}/products          - Create product
  GET  /api/stores/{id}/products/{pid}    - Product detail

Cart:
  POST /api/cart/add            - Add to cart
  GET  /api/cart                - View cart

Orders:
  POST /api/orders              - Place order
  GET  /api/orders              - List orders

Payments:
  POST /api/payments/razorpay/create-order  - Create payment
  POST /api/payments/razorpay/verify        - Verify payment
```

## Deployment

### Self-Hosted VPS (Recommended)

#### Backend
```bash
# Install dependencies
pip install -r requirements.txt gunicorn

# Run with Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
```

#### Frontend
```bash
# Build
npm run build

# Run production server
npm start
```

#### Nginx Config
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Static uploads
    location /static/ {
        proxy_pass http://localhost:8000;
    }
}
```

### Docker

```bash
docker-compose up -d
```

## Custom Domain Setup

1. Go to Admin → Settings → Domain
2. Enter your custom domain
3. Add DNS records:
   - A Record: `@` → Your server IP
   - CNAME: `www` → Your server IP
4. Click "Verify Domain"
5. SSL auto-configured via Let's Encrypt

## Razorpay Integration

1. Create account at https://razorpay.com
2. Get API keys from Dashboard → Settings → API Keys
3. Add to backend `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```
4. Add to frontend `.env.local`:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
   ```
5. Go to Admin → Settings → Payment → Enable Online Payment

## Scaling

### Database Migration (SQLite → PostgreSQL)
```bash
# Update .env
DATABASE_URL=postgresql://user:pass@localhost/shopsmooth

# Run migrations
alembic upgrade head
```

### File Storage (Local → S3)
Configure AWS S3 in settings for production image storage.

### Caching
Add Redis for session caching and API response caching.

## License

MIT License

## Support

- Documentation: `/docs` directory
- Issues: GitHub Issues
- Email: support@shopsmooth.com

---

**ShopSmooth** - E-commerce made smooth.
