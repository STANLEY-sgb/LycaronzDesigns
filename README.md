# LYCARONZ DESIGNS MVP - Complete Setup Guide

## 🚀 Quick Start

This is a complete Next.js 14 e-commerce website for LYCARONZ DESIGNS with admin dashboard, product management, and appointment booking system.

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

#### 1. Setup Project Structure
```bash
# Navigate to your project directory
cd lycaronz-designs

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

#### 2. Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate -- --name init
```

#### 3. Create Admin User
```bash
# Run the seed script (creates initial admin account)
node scripts/seed.js
```

#### 4. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000 to see your site!

---

## 📁 Project Structure

```
lycaronz-designs/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── products/          # Product CRUD
│   │   ├── appointments/      # Appointment CRUD
│   │   └── upload/            # File upload
│   ├── (customer)/            # Customer-facing routes
│   │   ├── page.tsx           # Homepage
│   │   ├── products/          # Products catalog
│   │   ├── product/[id]/      # Product detail
│   │   ├── book-appointment/  # Booking form
│   │   ├── contact/           # Contact page
│   │   └── about/             # About page
│   ├── (auth)/                # Protected routes
│   │   └── admin/             # Admin panel
│   │       ├── layout.tsx     # Admin layout
│   │       ├── login/         # Login page
│   │       ├── dashboard/     # Dashboard
│   │       ├── products/      # Product management
│   │       └── appointments/  # Appointment management
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ProductCard.tsx
│   ├── Toast.tsx
│   └── LoadingSkeletons.tsx
├── lib/
│   ├── prisma.ts              # Prisma client instance
│   ├── auth.ts                # Auth utilities
│   ├── constants.ts           # App constants
│   └── utils.ts               # Helper functions
├── public/
│   ├── logo.png               # LYCARONZ DESIGNS logo
│   └── images/                # Static images
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   └── seed.js                # Database seeding
├── .env.example               # Environment variables template
├── .env.local                 # Local environment (git ignored)
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
└── README.md                  # This file
```

---

## 🎨 Color Palette

The design uses an elegant palette from the LYCARONZ DESIGNS logo:

- **Primary**: #6B4C9A (Purple)
- **Secondary**: #D4A574 (Gold)
- **Accent**: #E85D6B (Coral)
- **Secondary Accent**: #0B6B6B (Teal)
- **Neutral**: #F5F5F5 (Off-white)

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here-generate-with-openssl-rand-hex-32"
NEXTAUTH_URL="http://localhost:3000"

# Vercel Blob (optional, for production)
BLOB_READ_WRITE_TOKEN="your-token-here"

# API Keys
NEXT_PUBLIC_WHATSAPP_NUMBER="256700000000"
```

---

## 🔑 Core Features

### 👥 Customer Features
- ✅ Modern responsive homepage with hero section
- ✅ Product catalog with filtering (Men/Women/Custom)
- ✅ Detailed product pages
- ✅ Appointment booking system
- ✅ Contact page with location map
- ✅ WhatsApp integration for quick contact

### 🛠️ Admin Features
- ✅ Secure admin login
- ✅ Dashboard with statistics
- ✅ Product management (CRUD)
- ✅ Image/video upload
- ✅ Appointment management
- ✅ Responsive design for mobile admin

### 🎯 Technical Features
- ✅ Server-side rendering (SSR)
- ✅ Static generation (SSG)
- ✅ API routes with authentication
- ✅ Database with Prisma ORM
- ✅ JWT-based auth
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states & skeletons
- ✅ Toast notifications
- ✅ Mobile-responsive

---

## 📱 Pages Overview

### Customer Pages

**Homepage** (`/`)
- Hero section with CTA buttons
- Featured products
- Why choose us section
- Contact CTA

**Products** (`/products`)
- Grid layout of all products
- Filters (category, price range)
- Search functionality
- Sort options

**Product Detail** (`/product/[id]`)
- Large product image
- Full description
- Price
- Contact to order button
- Related products

**Book Appointment** (`/book-appointment`)
- Name, phone, email inputs
- Date picker
- Service type selector
- Notes field
- Submit confirmation

**Contact** (`/contact`)
- Business information
- Google Maps embed
- WhatsApp button
- Contact form

**About** (`/about`)
- Brand story
- Why LYCARONZ DESIGNS
- Testimonials (expandable)

### Admin Pages

**Login** (`/admin/login`)
- Email input
- Password input
- Secure authentication

**Dashboard** (`/admin/dashboard`)
- Total products count
- Total appointments count
- Recent appointments
- Recent products
- Quick actions

**Product Management** (`/admin/products`)
- Table of all products
- Add new product form
- Edit product
- Delete product
- Image upload

**Appointment Management** (`/admin/appointments`)
- Table of all appointments
- Filter by status (pending, confirmed, completed)
- Update appointment status
- View details
- Delete appointment

---

## 🔐 Authentication

The app uses NextAuth.js with JWT-based authentication:

1. **Signup/Login**: Email and password
2. **Password Hashing**: bcryptjs (bcrypt hashing)
3. **Session Management**: JWT tokens in secure HTTP-only cookies
4. **Protected Routes**: Admin pages require authentication
5. **Multiple Admin Users**: Users stored in SQLite database

### Creating Admin Users

Use the seed script or create via admin panel:
```bash
node scripts/seed.js
```

Default credentials (created by seed script):
- Email: `admin@lycaronzdesigns.com`
- Password: `AdminPassword123!`

**Change these immediately after first login!**

---

## 🗄️ Database Schema

### Users Table
- id: UUID
- email: String (unique)
- password: String (hashed)
- name: String
- isAdmin: Boolean
- createdAt: DateTime
- updatedAt: DateTime

### Products Table
- id: UUID
- name: String
- description: String
- price: Float
- category: String (Men's/Women's/Custom)
- image: String (file path)
- imageUrl: String (Blob storage URL)
- video: String (Blob storage URL)
- featured: Boolean
- createdAt: DateTime
- updatedAt: DateTime

### Appointments Table
- id: UUID
- name: String
- phone: String
- email: String
- date: DateTime
- service: String (Repair/Custom/Fitting)
- notes: String
- status: String (pending/confirmed/completed)
- createdAt: DateTime
- updatedAt: DateTime

---

## 🚀 Deployment

### Deploy on Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/lycaronz-designs.git
git branch -M main
git push -u origin main
```

2. **Deploy**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables
- Deploy!

### Environment Variables for Production

Set these in Vercel project settings:

```
DATABASE_URL = file:./dev.db (or your DB URL)
NEXTAUTH_SECRET = (generate new)
NEXTAUTH_URL = https://yourdomain.vercel.app
BLOB_READ_WRITE_TOKEN = (get from Vercel)
```

---

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio

# Linting
npm run lint             # Run ESLint
```

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Appointments
- `GET /api/appointments` - Get all appointments (admin only)
- `GET /api/appointments/[id]` - Get single appointment
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/[id]` - Update appointment (admin only)
- `DELETE /api/appointments/[id]` - Delete appointment (admin only)

### Upload
- `POST /api/upload` - Upload image/video (admin only)

---

## 🔒 Security Considerations

1. **Password Hashing**: All passwords hashed with bcryptjs
2. **JWT Tokens**: Secure HTTP-only cookies
3. **CORS**: Configured for Vercel domains
4. **Rate Limiting**: Implement for production
5. **SQL Injection**: Protected by Prisma ORM
6. **XSS Protection**: Next.js default sanitization
7. **Environment Variables**: Never commit to git
8. **Admin Validation**: All admin endpoints verify authentication

---

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
rm prisma/dev.db
npm run prisma:migrate -- --name init
npm run seed
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Change port
npm run dev -- -p 3001
```

---

## 📞 Contact & Location

**LYCARONZ DESIGNS**
- Location: Kampala, Jemba Plaza, just after Old Taxi Park
- Phone: [Your phone number]
- Email: [Your email]
- WhatsApp: [Your WhatsApp number]

---

## 📄 License

This project is private and proprietary to LYCARONZ DESIGNS.

---

## 🤝 Support

For any issues or feature requests, please contact the development team.

**Built with ❤️ for LYCARONZ DESIGNS**

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Setup database: `npm run prisma:migrate`
3. ✅ Create admin user: `node scripts/seed.js`
4. ✅ Start dev server: `npm run dev`
5. ✅ Visit http://localhost:3000
6. ✅ Login to admin at http://localhost:3000/admin
7. ✅ Add your first products!
8. ✅ Deploy to Vercel!
"# LycaronzDesigns" 
