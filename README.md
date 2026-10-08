# Yash Cloth Stores — Product Showcase & Private Management Portal

A full-stack, production-ready product showcase and management system built for **Yash Cloth Stores**, Bajaria, Nagpur.

- **Customer Website:** Clean white/light aesthetic, 9 product categories, interactive doormat placement & feature showcase, product detail modals, and instant WhatsApp inquiry.
- **Store Owner Portal:** Private, authenticated admin dashboard connected to **MongoDB Atlas** and **Cloudinary** for managing products, uploading photos, toggling availability, and adjusting prices.

---

## 🏬 Store Information

- **Store Name:** Yash Cloth Stores
- **Showroom Address:** Yash Cloth Stores, Bajaria, near Nagpur Inn Hotel, Nagpur, Maharashtra
- **Phone:** `9370278715` (Direct call)
- **WhatsApp:** `9356591979` (Inquiries & stock updates)
- **Hours:** Monday to Sunday: 10:00 AM – 9:00 PM

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Tailwind CSS v4, React Router 7, Lucide Icons, Vite |
| **Backend** | Node.js, Express, Multer (Memory Storage) |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Image Storage** | Cloudinary (Persistent high-resolution cloud storage with automatic format & quality optimization) |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt.js password hashing |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
The `.env` file is protected and ignored by Git:
```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/test?retryWrites=true&w=majority
JWT_SECRET=f35052f1fe468215cac50eceee09f88c3db3f2b0c2a65263cf06d03468b3cf10
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run Development Server (Both Backend & Frontend)
```bash
npm run dev
```
- **Customer Showcase Website:** [http://localhost:3000](http://localhost:3000)
- **Store Owner Portal:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Backend API Server:** [http://localhost:5001](http://localhost:5001)

### 4. Build for Production
```bash
npm run build
```

---

## 🔐 Store Owner Portal (`/admin`)

The private portal is accessible at `/admin` (or via the discreet **Owner Portal** link in the footer).

### Features:
1. **Secure Admin Authentication (`/admin/login`):**
   - Protected routes with JWT authentication.
   - Session verification and logout.
2. **Dashboard Overview:**
   - Real-time statistics: Total Products, Categories (9), In-Stock, and Out-of-Stock items.
   - Quick action to add products or preview the live store.
3. **Product Management (`/admin` → Products):**
   - Search products by name or description.
   - Filter by category.
   - Instant 1-click toggle: **In Stock** vs **Out of Stock**.
   - Instant 1-click toggle: **Visible** vs **Hidden (Draft)**.
   - Edit any product's details and images.
   - Delete product with automatic Cloudinary asset cleanup.
4. **Add / Edit Product (`/admin` → Add Product):**
   - Product Name (required)
   - Category dropdown (Doormats, Bedsheets, Comforters, Blankets, Towels & Napkins, Carpets, Curtains, Sofa Covers, Floor Mats)
   - Price in ₹ (optional)
   - Size / Dimensions (optional, e.g. *King Size 108x108 in*)
   - Short Summary (for product card) & Detailed Description
   - Multiple Image Upload (Drag-and-drop or file picker) → Uploads directly to Cloudinary
   - Custom specifications (Key-value pairs like *Material*, *Backing*, *Care*)
5. **Categories View:**
   - Displays all 9 collections with live product counts from MongoDB.

---

## 🌐 API Endpoints

### Public Endpoints:
- `GET /api/health` — API health check
- `GET /api/categories` — Get 9 categories with live product counts
- `GET /api/products` — Get visible products (supports `?category=` and `?search=`)
- `GET /api/products/:id` — Get single product details

### Protected Admin Endpoints (Require `Authorization: Bearer <token>`):
- `POST /api/auth/login` — Admin login (returns JWT)
- `GET  /api/auth/me` — Verify token & retrieve admin profile
- `PUT  /api/auth/change-password` — Change admin password
- `GET  /api/products/admin/stats` — Metrics for admin dashboard
- `POST /api/products` — Create new product with Cloudinary images (`multipart/form-data`)
- `PUT  /api/products/:id` — Update product details and images
- `DELETE /api/products/:id` — Delete product and clean up Cloudinary assets
- `PATCH /api/products/:id/status` — Toggle stock availability
- `PATCH /api/products/:id/visibility` — Toggle visibility (show/hide)

---

## 🛋️ Customer Experience Preservation

All existing visual design and user interactions remain completely intact:
- Clean white/off-white palette with warm earth accents (`#8C6542`).
- Sticky glass navigation with scroll transition.
- Large hero section with doormat entrance visual.
- 9 Category cards with hover zoom and click-to-filter.
- Multi-room doormat placement carousel and 4 engineered feature highlights.
- Modal image gallery with thumbnail navigation and keyboard shortcuts.
- Direct contact section and floating WhatsApp assistance.
