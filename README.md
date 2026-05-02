# Sri Bhoomi Organics - Complete Ecommerce Platform

A fully functional B2B + SaaS ecommerce web application for organic products, built with modern tech stack.

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Step 1: Setup Backend

```bash
cd server
npm install
npm run seed    # Seeds database with 60+ products
npm run dev     # Runs on http://localhost:5000
```

### Step 2: Setup Client (User Website)

```bash
cd client
npm install
npm start       # Runs on http://localhost:3000
```

### Step 3: Setup Admin Panel

```bash
cd admin
npm install
npm start       # Runs on http://localhost:3001
```

---

## 🔐 Default Credentials

### Admin Account
- **Email:** admin@sribhoomi.com
- **Password:** admin123
- **Access:** http://localhost:3001

### User Account
- Register through the website at http://localhost:3000/register

---

## 📁 Project Structure

```
├── server/                    # Backend API
│   ├── controllers/           # Business logic
│   ├── middleware/           # Auth & validation
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── utils/                # Database seeder
│   └── server.js             # Entry point
│
├── client/                    # User Frontend (React)
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── context/          # Auth & Cart state
│       └── pages/            # Page components
│
└── admin/                     # Admin Panel (React)
    └── src/
        ├── components/       # Admin layout & components
        └── pages/             # Admin pages
```

---

## 🎯 Features Implemented

### User Website
- ✅ **Home Page** - Hero, Featured Products, Best Sellers, Categories, Testimonials
- ✅ **Products Page** - Category filters, Price filter, Search, Sorting, Pagination
- ✅ **Product Detail** - Full info, Reviews, Related products
- ✅ **Cart Page** - Quantity controls, Remove items, Free delivery tracker
- ✅ **Checkout** - Multi-step with Razorpay integration + COD
- ✅ **User Dashboard** - Profile, Orders, Settings
- ✅ **Auth Pages** - Login, Register with validation

### Admin Panel
- ✅ **Dashboard** - Stats cards, Recent orders, Top products, Revenue
- ✅ **Products Management** - Add, Edit, Delete with modal forms
- ✅ **Orders Management** - Status filters, Order details, Update status
- ✅ **Categories Management** - Add, Edit, Delete categories
- ✅ **Users Management** - View all registered users

### Technical Features
- ✅ JWT Authentication (Admin & User roles)
- ✅ Razorpay Payment Integration (Online + COD)
- ✅ MongoDB with Mongoose ODM
- ✅ React Query for data fetching
- ✅ Framer Motion animations
- ✅ Tailwind CSS responsive design
- ✅ Toast notifications
- ✅ Cart persistence (localStorage)

---

## 🛠️ API Endpoints

### Auth APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | User login |
| GET | /api/auth/profile | Get user profile |
| PUT | /api/auth/profile | Update profile |

### Product APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get products (with filters) |
| GET | /api/products/featured | Get featured products |
| GET | /api/products/best-sellers | Get best sellers |
| GET | /api/products/slug/:slug | Get product by slug |
| POST | /api/products/:id/reviews | Add review |

### Order APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create order |
| POST | /api/orders/verify | Verify payment |
| GET | /api/orders/my-orders | Get user orders |
| PUT | /api/orders/:id/cancel | Cancel order |

### Category APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | Get all categories |

### Admin APIs (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/stats | Dashboard statistics |
| GET | /api/admin/orders | Get all orders |
| PUT | /api/admin/orders/:id/status | Update order status |
| POST | /api/admin/products | Create product |
| PUT | /api/admin/products/:id | Update product |
| DELETE | /api/admin/products/:id | Delete product |
| GET | /api/admin/users | Get all users |
| POST | /api/admin/categories | Create category |
| PUT | /api/admin/categories/:id | Update category |
| DELETE | /api/admin/categories/:id | Delete category |

---

## 🛍️ Product Categories

1. 🌾 Grains & Flours
2. 🍫 Chocolates & Beverages
3. 🧼 Natural Soaps
4. 🏺 Traditional Products
5. 🫒 Oils & Ghee
6. 🍪 Snacks & Biscuits
7. 🍚 Rice & Millets
8. 🫘 Pulses & Nuts
9. 🌿 Herbal & Health
10. 🏠 Home & Personal Care
11. 🍎 Fruits & Vegetables

---

## 💳 Razorpay Integration

The app includes full Razorpay integration:

1. **Online Payment**: Credit/Debit Card, UPI, Net Banking, Wallets
2. **Cash on Delivery**: COD option available
3. **Backend Verification**: Payment signature verification on server

To use with real Razorpay:
1. Create account at [Razorpay](https://razorpay.com)
2. Get your API keys
3. Update `.env` file in server:
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```
4. Update the `key` in Checkout.js component

---

## ⚙️ Environment Variables

Create `.env` file in `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sribhoomi
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXX
NODE_ENV=development
```

---

## 🎨 Design Features

- **Color Scheme**: Green primary (#2e7d32), Earthy browns, Cream backgrounds
- **Typography**: Playfair Display for headings, Inter for body text
- **Animations**: Smooth Framer Motion transitions
- **Responsive**: Mobile-first design with breakpoints at 640px, 768px, 1024px
- **Premium UI**: Modern card layouts, subtle shadows, rounded corners

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control (admin vs user)
- Protected API routes
- Input validation
- Secure payment verification

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

## 🧪 Testing

### Test Admin Login:
1. Go to http://localhost:3001
2. Login with: admin@sribhoomi.com / admin123

### Test User Flow:
1. Go to http://localhost:3000
2. Register a new account or login
3. Browse products, add to cart
4. Complete checkout with test payment

---

## 📦 Dependencies

### Server
- express, mongoose, cors, dotenv
- bcryptjs, jsonwebtoken
- razorpay, express-validator
- morgan

### Client
- react, react-dom, react-router-dom
- axios, framer-motion
- react-hot-toast
- @tanstack/react-query
- lucide-react

### Admin
- react, react-dom, react-router-dom
- axios, framer-motion
- react-hot-toast
- lucide-react

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Support

For support, email hello@sribhoomi.com

---

Built with ❤️ for Sri Bhoomi Organics
