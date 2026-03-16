# ShopSmooth - Quick Start Guide

## 🚀 Project Status

**Backend**: ✅ **COMPLETE & READY**
- FastAPI application with all core routers (auth, stores, products, cart, orders, payments)
- SQLite database with sample data initialized
- Razorpay payment gateway integration
- JWT authentication
- Multi-store support

**Frontend**: 🔨 **IN PROGRESS** (Foundation Complete)
- Next.js 14 setup
- UI component library (Button, Input, Badge, Modal)
- State management (Zustand)
- Foundation laid for pages and layouts

---

## ⚡ Quick Start (Backend)

### Prerequisites
- Python 3.9+
- pip

### 1. Install Backend Dependencies
```bash
cd shopsmooth/backend
python3 -m pip install -r requirements.txt
```

### 2. Initialize Database (Optional - Already Done)
```bash
python3 init_db.py
```

This creates:
- All database tables
- Demo store: "Fashion Corner"
- 4 demo products with variants
- Demo admin and customer accounts

### 3. Start Backend Server
```bash
python3 run.py
```

Server starts on: **http://localhost:8000**

API Documentation: **http://localhost:8000/api/docs**

---

## 🧪 Backend Testing

### Get API Docs
Open http://localhost:8000/api/docs in your browser - interactive Swagger UI

### Quick API Test Commands

**1. Register as Store Admin**
```bash
curl -X POST "http://localhost:8000/api/auth/store-admin/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mystore@example.com",
    "username": "mystore",
    "password": "securepass123",
    "first_name": "Store",
    "last_name": "Owner",
    "store_name": "My Awesome Store",
    "store_email": "store@example.com"
  }'
```

**2. Login as Customer**
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@shopsmooth.local",
    "password": "customer123"
  }'
```

**3. List Products**
```bash
curl "http://localhost:8000/api/products/" \
  -H "Accept: application/json"
```

**4. Add to Cart** (need JWT token from login)
```bash
curl -X POST "http://localhost:8000/api/cart/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "product_id": 1,
    "quantity": 2,
    "variant_id": null
  }'
```

---

## 📦 Demo Credentials

### Store Admin
- **Email**: admin@shopsmooth.local
- **Password**: admin123
- **Store**: Fashion Corner

### Customer
- **Email**: customer@shopsmooth.local
- **Password**: customer123

---

## 🎨 Environment Variables

Create `.env` file in `backend/` directory:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
ENVIRONMENT=development

# Database
DATABASE_URL=sqlite:///./shopsmooth.db

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30

# Razorpay Configuration (Get from https://razorpay.com)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 🛠️ Project Structure

```
shopsmooth/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── routers/         # API endpoints (auth, stores, products, cart, orders, payments)
│   │   ├── utils/           # Security, helpers
│   │   ├── config.py        # Pydantic settings
│   │   ├── database.py      # SQLAlchemy setup
│   │   └── main.py          # FastAPI app
│   ├── run.py               # Entry point
│   ├── init_db.py           # Database initialization
│   ├── requirements.txt     # Python dependencies
│   └── shopsmooth.db        # SQLite database
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # Reusable React components
│   │   ├── lib/            # Utilities (API, auth)
│   │   ├── store/          # Zustand state management
│   │   └── types/          # TypeScript types
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── DEPLOYMENT.md       # VPS deployment guide
│   ├── CUSTOMIZATION.md    # Store customization guide
│   └── API.md              # API documentation
│
└── README.md
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register customer
- `POST /api/auth/login` - Login
- `POST /api/auth/store-admin/register` - Register store admin
- `GET /api/auth/me` - Get current user profile

### Stores
- `GET /api/stores/` - List all published stores
- `GET /api/stores/{slug}` - Get store by slug
- `PUT /api/stores/{store_id}` - Update store (admin)
- `PUT /api/stores/{store_id}/appearance` - Update colors (admin)
- `GET /api/stores/{store_id}/analytics` - Get dashboard analytics (admin)

### Products
- `GET /api/products/` - List products
- `GET /api/products/{product_id}` - Get product detail
- `POST /api/products/` - Create product (admin)
- `PUT /api/products/{product_id}` - Update product (admin)

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/items` - Add to cart
- `PUT /api/cart/items/{item_id}` - Update cart item
- `DELETE /api/cart/items/{item_id}` - Remove from cart
- `DELETE /api/cart/` - Clear cart

### Orders
- `GET /api/orders/` - List orders
- `POST /api/orders/` - Create order from cart
- `GET /api/orders/{order_id}` - Get order details
- `PUT /api/orders/{order_id}/status` - Update status (admin)
- `POST /api/orders/{order_id}/cancel` - Cancel order

### Payments (Razorpay)
- `POST /api/payments/create-razorpay-order` - Initialize payment
- `POST /api/payments/verify-payment` - Verify payment signature
- `POST /api/payments/webhook` - Razorpay webhook
- `GET /api/payments/order/{order_id}` - Get payment status

---

## 🔧 Features Implemented

### ✅ Backend Core
- [x] Multi-store architecture
- [x] JWT authentication & authorization
- [x] Store admin & customer roles
- [x] Product catalog with variants
- [x] Shopping cart management
- [x] Order creation & tracking
- [x] Razorpay payment integration
- [x] Store customization (colors, branding)
- [x] Analytics dashboard API

### 🔨 Frontend (In Progress)
- [x] Project scaffolding
- [x] Component library (UI components)
- [x] State management setup
- [ ] Admin dashboard pages
- [ ] Customer store pages
- [ ] Payment flow UI
- [ ] Animations & transitions

---

## 📚 Next Steps

1. **Complete Frontend Pages** (High Priority)
   - Admin dashboard with orders, products, customers
   - Store appearance/customization UI
   - Customer product browsing and checkout
   - Payment form integration

2. **Add Animations** (Medium Priority)
   - Product card hover effects
   - Page transitions
   - Loading states
   - Success notifications

3. **Testing** (High Priority)
   - End-to-end tests
   - API endpoint verification
   - Payment flow testing

4. **Deployment** (After Testing)
   - Docker containerization
   - VPS setup with Nginx
   - SSL certificates
   - Database backups

---

## 💡 Tips

### For Development
- Backend logs are verbose on `http://localhost:8000/api/docs`
- Use Swagger UI to test API endpoints without writing curl commands
- Database file is at `backend/shopsmooth.db` - you can delete it to start fresh

### For Production
- Change `JWT_SECRET_KEY` to a strong random value
- Set `ENVIRONMENT=production`
- Use PostgreSQL instead of SQLite
- Configure proper CORS origins
- Set up environment variables for Razorpay keys

---

## ❓ FAQ

**Q: How do I reset the database?**
A: Delete `shopsmooth.db` and run `python3 init_db.py` again

**Q: Where's the frontend?**
A: Frontend scaffold is ready in `frontend/`. Pages and components are being added.

**Q: How do I use Razorpay in testing?**
A: Use test keys from your Razorpay dashboard. Test mode doesn't charge money.

**Q: Can I use PostgreSQL instead of SQLite?**
A: Yes! Change `DATABASE_URL` to PostgreSQL connection string in `.env`

---

## 🎯 Architecture Highlights

- **FastAPI**: Modern, fast Python web framework
- **SQLAlchemy**: Powerful ORM for database operations
- **Razorpay**: Industry-leading payment gateway
- **Next.js 14**: React with server-side rendering
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations

---

## 📞 Support

For issues, check the logs:
- Backend: Terminal where `python3 run.py` is running
- Frontend: Browser console (F12)
- Database: `backend/shopsmooth.db`

---

**Happy Building! 🚀**
