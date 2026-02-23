# Zenox Dev Dashboard - Technical Specification

## 1. Project Overview

**Project Name:** Zenox Dev Dashboard  
**Type:** Full-stack Lead & Task Management Web Application  
**Core Functionality:** A premium dashboard for freelancers to manage business leads collected from Google Maps and track call status with revenue tracking  
**Target Users:** Single admin user (freelancer)

---

## 2. UI/UX Specification

### 2.1 Layout Structure

**Overall Layout:**
- Collapsible sidebar (240px expanded, 72px collapsed)
- Main content area with header
- Fixed header with user info

**Page Sections:**
- Sidebar: Navigation with icons and labels
- Header: Page title, user avatar
- Content: Page-specific content with cards

**Responsive Breakpoints:**
- Mobile: < 768px (sidebar becomes overlay)
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 2.2 Visual Design

**Color Palette:**
- Background Primary: `#0a0a0f` (deep black)
- Background Secondary: `#12121a` (dark navy)
- Background Card: `rgba(18, 18, 26, 0.8)` (glassmorphism)
- Accent Primary: `#6366f1` (indigo)
- Accent Secondary: `#8b5cf6` (purple)
- Accent Glow: `rgba(99, 102, 241, 0.3)` (neon glow)
- Text Primary: `#f8fafc` (white)
- Text Secondary: `#94a3b8` (gray)
- Success: `#10b981` (green)
- Warning: `#f59e0b` (amber)
- Error: `#ef4444` (red)
- Border: `rgba(99, 102, 241, 0.2)`

**Typography:**
- Font Family: 'Outfit', sans-serif (headings), 'DM Sans', sans-serif (body)
- Headings: 32px (h1), 24px (h2), 20px (h3), 16px (h4)
- Body: 14px (regular), 12px (small)
- Font Weights: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Visual Effects:**
- Glassmorphism: `backdrop-filter: blur(12px)`, `background: rgba(18, 18, 26, 0.8)`
- Neon glow: `box-shadow: 0 0 20px rgba(99, 102, 241, 0.3)`
- Border glow: `border: 1px solid rgba(99, 102, 241, 0.3)`
- Hover transitions: 200ms ease-out
- Card hover: translateY(-2px), increased glow

---

## 3. Functionality Specification

### 3.1 Authentication

**Login Page:**
- Email input
- Password input
- Login button
- Error message display

**JWT Implementation:**
- Token stored in localStorage
- Token included in API requests
- Token expiration: 7 days
- Protected route middleware

### 3.2 Lead Management

**Add Lead:**
- Business Name (required, text)
- Phone Number (required, tel)
- Category (dropdown: Restaurant, Hotel, Shop, Office, Factory, Other)
- City (text)
- Notes (textarea)
- Status: default "pending"
- Submit: POST to API, show success toast

**Lead Statuses:**
- pending: Initial state
- waiting: Called, awaiting response
- approved: Deal closed, enter price
- rejected: Not interested

**Status Change:**
- Dropdown in table row
- On "approved": Open modal to enter price
- Price saved, revenue auto-updated

**Lead Actions:**
- Edit: Modal with pre-filled form
- Delete: Confirmation, then DELETE request
- Search: Filter by business name or phone
- Category filter: Dropdown filter

### 3.3 Dashboard

**Statistic Cards:**
- Total Leads (count)
- Pending (count, amber color)
- Waiting (count, blue color)
- Approved (count, green color)
- Rejected (count, red color)
- Total Revenue (sum of approved prices)

**Charts:**
- Leads by Category: Bar chart (horizontal)
- Status Distribution: Pie/Donut chart
- Monthly Revenue: Line chart (last 6 months)

---

## 4. Technical Architecture

### 4.1 Backend (Node.js + Express)

**API Endpoints:**

```
POST /api/auth/login      - User login
POST /api/auth/register  - User registration
GET  /api/auth/me        - Get current user

GET    /api/leads              - Get all leads (with filters)
GET    /api/leads/:id          - Get single lead
POST   /api/leads              - Create lead
PUT    /api/leads/:id          - Update lead
DELETE /api/leads/:id          - Delete lead
PUT    /api/leads/:id/status   - Update lead status
GET    /api/leads/stats        - Get dashboard stats
GET    /api/leads/chart-data   - Get chart data
```

**Middleware:**
- authMiddleware: Verify JWT token
- errorMiddleware: Handle errors

### 4.2 Database (MySQL)

**Database:** zenox_dashboard

**Table: users**
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Table: leads**
```sql
CREATE TABLE leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  business_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  category ENUM('Restaurant', 'Hotel', 'Shop', 'Office', 'Factory', 'Other') DEFAULT 'Other',
  city VARCHAR(255),
  notes TEXT,
  status ENUM('pending', 'waiting', 'approved', 'rejected') DEFAULT 'pending',
  price DECIMAL(10,2) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4.3 Frontend (React + Vite)

**Dependencies:**
- react, react-dom
- react-router-dom
- axios
- recharts
- framer-motion
- react-icons
- tailwindcss, postcss, autoprefixer

**Folder Structure:**
```
client/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   ├── UI/
│   │   └── Charts/
│   ├── pages/
│   ├── context/
│   ├── hooks/
│   ├── api/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
```

---

## 5. Default Credentials

**Admin User (create on first run):**
- Name: Admin
- Email: admin@zenox.com
- Password: admin123

---

## 6. How to Run

1. **Start MySQL** and ensure it's running on localhost

2. **Configure Database** (edit server/.env):
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password (leave empty if no password)
   DB_NAME=zenox_dashboard
   ```

3. **Start Backend:**
   ```bash
   cd server
   npm start
   ```

4. **Start Frontend:**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the Dashboard:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
