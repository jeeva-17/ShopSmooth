# ShopSmooth - Customization Guide

## Store Branding

### Navbar Colors
Go to Admin → Settings → Appearance

| Setting | Description | Default |
|---------|-------------|---------|
| Primary Color | Main gradient color | #667eea |
| Secondary Color | Gradient end color | #764ba2 |
| Text Color | Navbar text/icons | #ffffff |
| Accent Color | Buttons, links | #6366f1 |

Colors are applied via CSS variables:
```css
:root {
  --navbar-primary: #667eea;
  --navbar-secondary: #764ba2;
  --navbar-text: #ffffff;
  --accent: #6366f1;
}
```

### Logo & Favicon
- Upload store logo (recommended: 200x60px, PNG/SVG)
- Upload favicon (32x32px, ICO/PNG)
- Go to Admin → Settings → General

---

## Product Management

### Adding Products
1. Go to Admin → Products → Add Product
2. Fill in product details:
   - Name, description
   - Category
   - Price, compare-at price (for showing discount)
   - Images (drag & drop, multiple supported)
   - Stock quantity
   - SEO title & description
3. Toggle "Featured" to show on homepage
4. Toggle "Active" to publish

### Product Variants
1. Enable "Has Variants" on product
2. Add variant options:
   - Size: S, M, L, XL
   - Color: Red, Blue, Green
3. Set individual prices and stock per variant

### Categories
- Create hierarchical categories
- Set display order
- Add category images

---

## Payment Configuration

### Razorpay Setup
1. Create account: https://razorpay.com
2. Get API keys: Dashboard → Settings → API Keys
3. Admin → Settings → Payment
4. Enter Key ID and Key Secret
5. Enable Online Payment

### Cash on Delivery
- Toggle in Admin → Settings → Payment
- Available for all products by default

---

## Delivery Settings

### Configuration
Admin → Settings → Delivery

| Setting | Description |
|---------|-------------|
| Enable Delivery | Allow home delivery |
| Enable Pickup | Allow store pickup |
| Delivery Charge | Flat rate delivery fee |
| Free Delivery Above | Orders above this amount get free delivery |
| Estimated Days | Expected delivery timeframe |

---

## Custom Domain

### Setup Process
1. Admin → Settings → Domain
2. Enter your domain (e.g., mystore.com)
3. Add DNS records at your registrar:
   ```
   Type: A
   Name: @
   Value: <your-server-ip>

   Type: CNAME
   Name: www
   Value: <your-server-ip>
   ```
4. Wait for DNS propagation (up to 48 hours)
5. Click "Verify Domain"
6. SSL certificate auto-generated

---

## Email Notifications

### SMTP Setup
Admin → Settings → Email

| Setting | Example (Gmail) |
|---------|----------------|
| SMTP Server | smtp.gmail.com |
| SMTP Port | 587 |
| Username | your@gmail.com |
| Password | App-specific password |

### Email Types
- Order confirmation
- Payment receipt
- Shipping notification
- Delivery confirmation
- Password reset

---

## Policy Pages

### Editing
Admin → Settings → Pages

Available pages:
- About Us
- Privacy Policy
- Terms & Conditions
- Return & Refund Policy
- Shipping Policy

All pages support rich text editing.

---

## Coupon System

### Creating Coupons
Admin → Coupons → Create

| Field | Description |
|-------|-------------|
| Code | Unique coupon code (e.g., SAVE20) |
| Discount Type | Percentage or Fixed amount |
| Discount Value | Amount (e.g., 20 for 20%) |
| Max Discount | Cap for percentage discounts |
| Min Order Value | Minimum cart value required |
| Usage Limit | Max times coupon can be used |
| Valid From/Until | Coupon validity period |

---

## Banner Management

### Creating Banners
Admin → Banners → Create

- Upload banner image (recommended: 1920x600px)
- Add title, subtitle
- Set link URL and button text
- Set display order
- Schedule with start/end dates

---

## Analytics

### Dashboard Metrics
- Total Revenue (with period comparison)
- Total Orders
- Total Customers
- Average Order Value
- Top Selling Products
- Revenue Chart (daily/weekly/monthly)
- Recent Orders

---

## API Integration

### Authentication
All API requests require JWT token:
```
Authorization: Bearer <token>
```

### Webhooks
Configure webhooks for:
- New order
- Payment received
- Order status change

### Rate Limiting
- 100 requests/minute for authenticated users
- 30 requests/minute for public endpoints

---

## Scaling Tips

### Database
- Start with SQLite for development
- Migrate to PostgreSQL for production
- Add read replicas for high traffic

### Caching
- Add Redis for session storage
- Cache product listings
- Cache store settings

### CDN
- Use Cloudflare for static assets
- Configure image CDN for product images

### Search
- Add Elasticsearch for advanced product search
- Implement full-text search with filters
