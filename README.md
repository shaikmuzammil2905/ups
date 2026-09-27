# Livkam Power Technologies — E-Commerce Platform

> **Smart Power. Sustainable Future.**
> Official Authorized Dealer of APC, Delta, Luminous, Microtek, Vertiv, Numeric, Elnova, Exide, Amaron & Quanta.

---

## 🌟 Overview
Livkam Power Technologies is a full-featured, responsive, production-grade e-commerce web platform built for high-uptime power backup equipment, industrial Online UPS systems, SMF/Tubular batteries, home inverters, solar power units, and technical field engineering services in Bengaluru and Pan-India.

---

## 🛠️ Key Features

### 🛍️ E-Commerce & Product Management
- **Catalog & Product Details (`/products`, `/products/:slug`)**: Multi-image thumbnail gallery, live stock indicators, SKU barcodes, capacity ratings, interactive WhatsApp instant quote generation, and technical specification data tables.
- **Dynamic Category Browsing (`/categories`, `/category/:slug`)**:
  - Online UPS (1kVA - 200kVA)
  - SMF Batteries (VRLA AGM Sealed)
  - Tubular Batteries (Deep cycle Torr Tubular)
  - Lithium UPS & Storage (LiFePO4 51.2V)
  - Home Inverters (Pure Sine Wave)
  - UPS Engineering Services
  - Automatic Voltage Stabilizers
  - Small Backups (Line-Interactive 600VA - 2kVA)
- **Authorized Brand Ecosystem (`/brands`, `/brands/:slug`)**: Dedicated OEM brand showcase for APC by Schneider Electric, Delta, Luminous, Microtek, Vertiv Liebert, Numeric Legrand, Elnova, Exide, Amaron, and Quanta.
- **Live Search & Autocomplete (`/search?q=...`)**: Instant search across product titles, brand names, SKUs, and capacity ratings with dropdown suggestions.
- **Cart & Checkout (`/cart`)**: Real-time sliding drawer and dedicated checkout page with automatic GST calculations (18%), discount codes (`LIVKAM500`), free delivery threshold calculation, and celebratory confetti animation upon order confirmation.
- **Customer Account (`/account`)**: Authentication (Login/Register toggle), active order tracking with history, saved delivery addresses, and personal wishlist management.

### ⚡ Field Services & Technical Knowledge Base
- **Engineering Services (`/services`, `/services/:slug`)**: UPS Installation, Preventive Maintenance, 24/7 Emergency Repair, Battery Replacement & Buyback, Annual Maintenance Contracts (AMC), Site Inspection, and Power Quality Audits with interactive scheduling.
- **Educational Guides (`/posts`, `/posts/:slug`)**: Expert buying guides, battery life optimization tips, and sizing calculators authored by certified engineers.
- **Showroom & Store Contact (`/about`, `/contact`)**: Showroom location at Banashankari 2nd Stage, Bengaluru, phone hotlines, interactive enquiry forms, and embedded Google Maps.

---

## 💻 Tech Stack
- **Framework**: React 19 + Vite 6
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 + Custom Glassmorphism / Power Gradients
- **State Management**: React Context (`CartContext`, `AuthContext`) with persistent LocalStorage
- **Icons**: Lucide React
- **Animations**: CSS Keyframe Float Animations + Canvas Confetti

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📍 Business Information
- **Business**: Livkam Power Technologies
- **Proprietor**: Venu B N
- **Phones**: +91 8884988990 / +91 9945535819
- **Email**: info@livkampower.in
- **Address**: 21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bendre Nagar, Bengaluru, Karnataka 560070
- **GSTIN**: 29CYMPN3694M1ZC
