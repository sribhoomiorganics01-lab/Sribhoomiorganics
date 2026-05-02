# Sri Bhoomi Organics - Deployment Guide

## Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sribhoomi
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXX
NODE_ENV=production
```

### Client (.env)
```env
REACT_APP_API_URL=https://your-server.vercel.app/api
REACT_APP_RAZORPAY_KEY=rzp_live_XXXXXXXXXX
```

### Admin (.env)
```env
REACT_APP_API_URL=https://your-server.vercel.app/api
```

## Deployment Platforms

### 1. MongoDB Atlas (Database)
1. Create account at mongodb.com
2. Create free cluster (M0)
3. Create database user
4. Whitelist IP 0.0.0.0/0 (for development)
5. Get connection string

### 2. Backend (Render or Railway)

**Render:**
1. Connect GitHub repo
2. Create Web Service
3. Root directory: `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from .env

**Railway:**
1. Connect GitHub repo
2. Select server folder
3. Add environment variables
4. Deploy

### 3. Frontend (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. In client folder: `vercel`
3. Add environment variables in Vercel dashboard:
   - `REACT_APP_API_URL` = backend URL
   - `REACT_APP_RAZORPAY_KEY` = Razorpay key

### 4. Admin Panel (Vercel)

1. In admin folder: `vercel`
2. Add environment variables:
   - `REACT_APP_API_URL` = backend URL

## Domain Setup

After deployment, update:
1. Client `.env` → `REACT_APP_API_URL` = your-backend-url
2. Admin `.env` → `REACT_APP_API_URL` = your-backend-url
3. Server CORS → Add your Vercel domain

## Razorpay Setup

1. Create Razorpay account
2. Get API Key and Secret from Dashboard
3. Add Webhook for payment confirmation
4. Update keys in all .env files

## Post-Deployment Checklist

- [ ] Test user registration/login
- [ ] Test product browsing
- [ ] Test add to cart
- [ ] Test checkout flow
- [ ] Test Razorpay payment
- [ ] Test COD order
- [ ] Verify admin panel access
- [ ] Check mobile responsiveness
