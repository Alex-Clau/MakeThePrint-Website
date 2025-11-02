# 3D Models Online Store (SPA) 🛒✨

[![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.4.0-orange?logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.1.16-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Cloud-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![EmailJS](https://img.shields.io/badge/EmailJS-Serverless-7952B3?logo=emailjs&logoColor=white)](https://www.emailjs.com/)

> ⚠️ **Status:** Still under maintenance and in active development.  
> Expect new features, UI updates, and backend improvements soon!

---

A modern **React Single Page Application (SPA)** built for **MakeThePrint**,  
a **small business just starting out** in the 3D printing and model design space.

This working website allows users to **browse, search, and favorite 3D models**,  
then **place orders directly via email**.  
Users who **sign up and verify their email** get full access to favorites, order placement, and product reviews.

[🎨 Live Demo](https://yourproject.web.app)

---

## ✨ Features

### 🧭 User Experience
- 🔐 **Authentication & Verification** – Secure Firebase Auth with email/password signup and verification.
- ❤️ **Favorites System** – Save your favorite 3D models and manage them across sessions.
- 🛒 **Order via Email** – Verified users can place orders directly through email.
- 📝 **User Reviews** – Authenticated users can leave reviews for products (admin approval required).
- 🔍 **Smart Browsing** – Filter by category, search, and sort by price.
- 📱 **Responsive Design** – Fully optimized for mobile, tablet, and desktop.
- ⚡ **SPA Navigation** – Instant, smooth page transitions with no full reloads.

### 👨‍💼 Admin Features
- 🔒 **Protected Dashboard** – Role-based access control for admin users only.
- ➕ **Product Management** – Add, edit, delete, or feature 3D models.
- 🧾 **Review Moderation** – Approve or reject user reviews in real-time.

### ⚙️ Performance & Sync
- ⚡ **Smart Caching** – Multi-layer caching with a 5-minute TTL.
- 🔄 **Real-time Sync** – Favorites and reviews update instantly across the app.
- 💾 **Data Persistence** – User data and preferences are stored locally and in Firestore.

---

## 🛠️ Tech Stack

### 🖥️ Frontend
- **React 19.2.0** – UI library with Hooks
- **React Router 7.9.4** – SPA routing with data loaders
- **Tailwind CSS 4.1.16** – Utility-first styling
- **Lucide React** – Icon library

### 🔧 Backend & Services
- **Firebase 12.4.0**
    - Authentication with email/password and verification
    - Firestore database for items, reviews, and user data
    - Hosting for live deployment
- **Cloudinary** – Image hosting and optimization
- **EmailJS** – Serverless email integration for handling orders

### ⚛️ State Management & Utilities
- **React Context API** – Global state for products, favorites, and reviews
- **Custom Hooks** – Modular, reusable logic (`useAuthCheck`, `useFilteredItems`, `useLogout`)
- **localStorage API** – Persistent local caching and offline support

---

## 📝 Key Implementation Details

- **User Authentication**
    - Firebase Auth manages sign-up/login and email verification.
    - Only verified users can favorite, review, or place orders.

- **Favorites System**
    - Optimistic UI updates with rollback on errors.
    - Synced with Firestore and cached locally for speed.

- **Admin Dashboard**
    - Protected by role-based route guard.
    - Real-time item management and Cloudinary uploads.

- **Search & Filtering**
    - Debounced search, category filters, and price sorting.
    - Configurable grid/list views with pagination.

- **SPA Architecture**
    - Powered by React Router with pre-fetched route data.
    - Smooth, instant client-side navigation without reloads.

---

## 📊 Performance Metrics (Local Testing)

| Metric | Value | Status | Notes |
|--------|-------|--------|-------|
| **Largest Contentful Paint (LCP)** | 1.06 s | ✅ Excellent | Fast loading of main heading |
| **Cumulative Layout Shift (CLS)** | 0 | ✅ Excellent | No unexpected layout shifts |
| **Interaction to Next Paint (INP)** | 88 ms | ✅ Excellent | Very responsive user interactions |
| **Pointer Interactions** | 16–64 ms | ✅ Excellent | Buttons and menus respond instantly |

**Interpretation:**
- ⚡ **LCP < 1.5s** → Quick main content load
- 🧩 **CLS = 0** → Perfect visual stability
- ⚡ **INP < 100ms** → Instant, fluid UI responsiveness

---

## 💡 About This Project

This is a **working website built for MakeThePrint**,  
a **small 3D modeling and printing business that’s just starting out**.

It provides a **professional online presence** with an easy-to-manage admin dashboard and a **smooth, app-like experience** for customers.  
The project demonstrates how small businesses can use **modern React SPAs** to create **fast, elegant, and efficient online stores** without complex infrastructure.

> 🧰 **Note:** The project is still being actively improved — new UI enhancements, performance tweaks, and backend features are on the way!

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.
