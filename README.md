# WealthCalc India — Multi-Asset Investment Calculator

![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4.24-purple?style=for-the-badge&logo=next.js)
![License](https://img.shields.io/badge/License-Not_Specified-gray?style=for-the-badge)

A comprehensive, modern, and responsive multi-asset investment, debt, and wealth growth calculator built specifically for Indian retail investors and financial planners. Designed with Next.js 14 App Router, Tailwind CSS, Recharts, and MongoDB Atlas.

---

## 2. Project Overview

**WealthCalc India** is an all-in-one financial planning suite that empowers users to simulate long-term wealth accumulation, analyze investment returns across multiple asset classes, and evaluate loan amortization schedules.

### The Problem It Solves
Traditional investment calculators are fragmented—investors often use one website for SIP calculations, another for rental yields, and a third for home loan EMIs. Moreover, most calculators ignore crucial real-world variables such as **Step-up SIPs**, **Expense Ratios**, **Inflation Adjustment**, and **Real Estate Capital Appreciation + Rental Yield dual returns**.

### Key Solution & Purpose
- **Multi-Asset Intelligence**: Seamlessly calculate projections for **ETFs / Mutual Funds**, **Cryptocurrency**, **Real Estate**, **Bank FDs**, and **Loans / EMIs**.
- **Real-World Precision**: Factors in step-up percentages, expense ratios, inflation erosion, compounding frequencies, and rental income.
- **Hybrid Storage & Auth**: Works offline in **Local Mode** using `localStorage` isolation or syncs across devices when signed in via **Google OAuth** or **Email/Password (NextAuth + MongoDB)**.
- **Client-Side Export**: Generate high-resolution PDF investment reports instantly using `html2canvas` and `jspdf`.

---

## 3. Live Demo

*(No live deployment URL is configured in the repository configuration. See the [Deployment](#19-deployment) section to host your own instance on Vercel or Netlify.)*

---

## 4. Screenshots / Project Preview

Below are the recommended screenshot previews for the application dashboard. Place your captured images inside the `/screenshots` directory.

<p align="center">
  <img src="./screenshots/home.png" alt="Home Calculator" width="48%" />
  <img src="./screenshots/dashboard.png" alt="Portfolio Dashboard" width="48%" />
</p>

### Recommended Screenshots to Capture:
1. **Home Calculator View** (`./screenshots/home.png`): Main interface showing SIP, Step-Up, and Growth Trajectory chart.
2. **Portfolio Dashboard** (`./screenshots/dashboard.png`): Combined net worth trajectory and multi-asset breakdown.
3. **Asset Selection View** (`./screenshots/asset-etf.png`): Multi-asset selector tabs (ETF/MF, Crypto, Real Estate, FD, Loan).
4. **Loan Amortization View** (`./screenshots/asset-loan.png`): EMI breakdown, principal vs interest distribution charts.
5. **Mobile View** (`./screenshots/mobile-view.png`): Responsive mobile layout with dark mode enabled.

---

## 5. Demo GIF / Video

*(A video/GIF demonstration has not yet been recorded. Add a recorded walkthrough to `./screenshots/demo.gif` to display a live interaction preview here.)*

---

## 6. Key Features

### Core Calculator Features
- 📈 **ETF / Mutual Fund Calculator**: SIP, Lumpsum, annual Step-up SIP %, Expense Ratio deduction, and Inflation-adjusted real corpus calculation.
- ₿ **Crypto DCA Calculator**: Dollar-cost averaging projections tailored for high-volatility digital assets.
- 🏠 **Real Estate Calculator**: Dual-income modeling incorporating property capital appreciation rate (%) alongside annual rental yield (%).
- 🏦 **Bank FD Calculator**: Fixed Deposit maturity calculator with flexible compounding frequencies (Monthly, Quarterly, Yearly).
- 🏛️ **Loan / EMI Amortization**: Complete loan EMI calculator displaying principal vs. interest breakdown, total outgo, and remaining balance schedule.

### User & Authentication Features
- 🔐 **Secure NextAuth Authentication**: Google OAuth 2.0 integration & custom Email/Password authentication with `bcryptjs` password hashing.
- 🔄 **Hybrid Data Sync (Cloud + Local)**: Automatically syncs saved calculation histories to MongoDB Atlas for logged-in users, while providing instant fallback to `localStorage` for guest users.
- 🌓 **Theme Customization**: Sleek Dark and Light mode toggle with smooth glassmorphism UI components.
- 📊 **Interactive Data Visualizations**: Custom line charts, area charts, and allocation pie charts powered by `Recharts`.
- 📄 **PDF & Share Reports**: Client-side single-click export of calculation results into styled PDF documents.

---

## 7. How It Works

```text
[ User Input ] (SIP, Rates, Tenure, Asset Type)
       │
       ▼
[ Client-Side Engine ] ──► (calculateReturns.ts / calculatePortfolio.ts)
       │
       ├─► [ Recharts Visualization ] (Interactive Charts & Tables)
       ├─► [ LocalStorage ] (Instant Guest Mode Cache)
       │
       ▼ (If Authenticated)
[ Next.js API Routes ] ──► [ MongoDB Atlas ] (Persistent User Portfolio & History)
```

1. **Asset & Parameter Input**: The user selects an asset class (ETF/MF, Crypto, Real Estate, FD, Loan) and adjusts sliders or numerical inputs.
2. **Deterministic Financial Math**: The browser computes compound interest, step-up escalations, expense ratio drag, or loan amortization schedules in real-time.
3. **Visualization & Report**: `Recharts` dynamically updates trajectory graphs, while `html2canvas` & `jspdf` allow instant PDF export.
4. **Cloud Persistence**: When logged in, calculations are sent via Next.js API endpoints (`/api/calculations`) to MongoDB Atlas under the user's isolated account.

---

## 8. System Architecture

```mermaid
flowchart TD
    subgraph Client ["Frontend (Next.js 14 App Router)"]
        A[User Browser] --> B[Header / Navbar]
        A --> C[AssetSelector / InputSection]
        C --> D[Financial Calculation Engine utils/calculateReturns.ts]
        D --> E[Recharts Visualization]
        D --> F[jsPDF / html2canvas Exporter]
    end

    subgraph Storage ["State & Storage Layer"]
        D --> G[Browser LocalStorage Guest Mode]
        C --> H[NextAuth Session Provider]
    end

    subgraph Backend ["Backend (Next.js Server API Routes)"]
        H --> I["/api/auth/[...nextauth]"]
        C --> J["/api/calculations (GET, POST, DELETE)"]
        C --> K["/api/signup & /api/forgot-password"]
        C --> L["/api/health"]
    end

    subgraph Database ["Cloud Database"]
        I --> M[(MongoDB Atlas Database)]
        J --> M
        K --> M
        L --> M
    end
```

---

## 9. Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 14.2.35 | React Framework with App Router & API routes |
| **Language** | TypeScript 5.0 | Type-safe financial interfaces & calculations |
| **Styling** | Tailwind CSS 3.3 | Custom utility styling with dark mode & glassmorphism |
| **Animations** | Framer Motion 12.38 | Micro-interactions and smooth tab transitions |
| **Visualizations** | Recharts 2.15 | Responsive financial line, area, and pie charts |
| **Authentication** | NextAuth.js 4.24 | OAuth (Google) & Credentials Provider (Bcrypt) |
| **Database** | MongoDB Atlas 7.1 | NoSQL cloud database for user accounts & saved portfolios |
| **Icons** | Lucide React | Modern vector icons |
| **PDF Export** | jsPDF + html2canvas | Client-side DOM-to-PDF rendering |

---

## 10. Project Structure

```text
ETF-calculator/
├── src/
│   ├── app/                         → Next.js App Router routes & endpoints
│   │   ├── api/                     → Serverless backend API routes
│   │   │   ├── auth/[...nextauth]/  → NextAuth authentication handler
│   │   │   ├── calculations/        → User calculation CRUD endpoints
│   │   │   ├── forgot-password/     → Password reset token generator
│   │   │   ├── health/              → Database connection diagnostic API
│   │   │   ├── reset-password/      → Password update API route
│   │   │   └── signup/              → User registration API route
│   │   ├── dashboard/               → Portfolio dashboard page
│   │   ├── forgot-password/         → Password reset request page
│   │   ├── login/                   → Login interface
│   │   ├── reset-password/          → Password update page
│   │   ├── signup/                  → User registration page
│   │   ├── globals.css              → Global styles & Tailwind utilities
│   │   ├── layout.tsx               → Root layout wrapper with NextAuth Provider
│   │   └── page.tsx                 → Main Multi-Asset Calculator landing page
│   ├── components/                  → React UI components
│   │   ├── Calculator/              → Calculator-specific components
│   │   │   ├── AssetSelector.tsx    → Multi-asset tab switcher
│   │   │   ├── ChartConstants.tsx   → Recharts styling configurations
│   │   │   ├── ChartsSection.tsx    → Growth trajectory & pie charts
│   │   │   ├── ComparisonDashboard.tsx → Side-by-side asset comparison
│   │   │   ├── DashboardNav.tsx     → Navigation tabs for views
│   │   │   ├── InputSection.tsx     → Dynamic parameter sliders & forms
│   │   │   ├── PortfolioDashboard.tsx → Combined net worth breakdown
│   │   │   ├── PortfolioManager.tsx → Saved asset manager
│   │   │   └── ResultsSection.tsx   → Summary cards & return key metrics
│   │   ├── UI/                      → Reusable primitive components (Slider, Toast, Tooltip)
│   │   ├── Header.tsx               → Main Navigation Bar & Theme toggle
│   │   └── Providers.tsx            → NextAuth Session Provider wrapper
│   ├── lib/                         → Core backend utilities
│   │   ├── auth.ts                  → NextAuth options & credentials authorization logic
│   │   └── mongodb.ts               → MongoDB MongoClient connection wrapper with HMR reuse
│   └── utils/                       → Financial computation engines
│       ├── assetConfig.ts           → Asset metadata, colors, & educational blurbs
│       ├── calculateReturns.ts      → Compounding, amortization, & return algorithms
│       └── formatCurrency.ts        → Indian Rupee (INR ₹) formatting utilities
├── public/                          → Static assets & favicon
├── screenshots/                     → Recommended location for project screenshots
├── .env.example                     → Template for required environment variables
├── next.config.js                   → Next.js configuration
├── package.json                     → Project dependencies and scripts
└── tailwind.config.ts               → Tailwind CSS theme configuration
```

---

## 11. Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher installed.
- **npm** or **yarn** / **pnpm** package manager.
- **MongoDB Atlas** database URI (optional for cloud persistence; fallback to LocalStorage exists).

### 1. Clone Repository

```bash
git clone https://github.com/Akshay-Nedunuri17/ETF-calculator.git
cd ETF-calculator
```

### 2. Install Dependencies

```bash
npm install
```
*(Note for Windows / OneDrive users: If symlink issues occur, use `npm install --no-bin-links`)*

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env.local
```

Configure your `.env.local` variables:

```env
# Database Connection (MongoDB Atlas)
MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/wealthcalc?retryWrites=true&w=majority

# NextAuth Authentication Configuration
NEXTAUTH_SECRET=a_secure_random_secret_key_for_jwt
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Credentials (Optional - for Google Login)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 12. Running Locally

Start the local Next.js development server:

```bash
npm run dev
```

Open your browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

### Available npm Scripts:
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the production bundle.
- `npm start`: Starts the production server after building.
- `npm run lint`: Runs Next.js ESLint check.

---

## 13. Database Setup

WealthCalc India uses **MongoDB Atlas** to persist user authentication accounts and saved calculation histories.

### Collections Schema

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        string name
        string email UK
        string password "Hashed with bcryptjs"
        string resetToken "Optional"
        date resetTokenExpiry "Optional"
        date createdAt
    }

    CALCULATIONS {
        ObjectId _id PK
        string userEmail FK
        string assetType "etf | crypto | realestate | fd | loan"
        object config "Input parameters object"
        date createdAt
    }

    USERS ||--o{ CALCULATIONS : "owns"
```

### Connection Management
The MongoDB connection in `src/lib/mongodb.ts` utilizes a global cached promise in development mode to prevent connection leaks during Next.js Hot Module Replacement (HMR).

---

## 14. API Documentation

| Method | Endpoint | Purpose | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Checks MongoDB connection status & returns advice | None (Public) |
| `POST` | `/api/signup` | Registers a new user account with hashed password | None (Public) |
| `POST` | `/api/forgot-password` | Generates a password reset token | None (Public) |
| `POST` | `/api/reset-password` | Updates user password using reset token | None (Public) |
| `GET` | `/api/calculations` | Fetches saved calculations for logged-in user | Required (NextAuth Session) |
| `POST` | `/api/calculations` | Saves a new calculation to user history | Required (NextAuth Session) |
| `DELETE` | `/api/calculations` | Deletes a saved calculation by ID | Required (NextAuth Session) |
| `ALL` | `/api/auth/[...nextauth]` | Handles OAuth & Credentials sign-in/sign-out | NextAuth Managed |

### Example API Request (`POST /api/calculations`)

**Request Payload**:
```json
{
  "assetType": "etf",
  "initialInvestment": 100000,
  "monthlyInvestment": 10000,
  "annualReturnRate": 12,
  "years": 10,
  "stepUpPercentage": 10,
  "expenseRatio": 0.5
}
```

**Response (201 Created)**:
```json
{
  "message": "Calculation saved",
  "id": "65fc8e2b10a9c84e12345678"
}
```

---

## 15. AI / ML Architecture

*(No AI/ML models are integrated in this repository. WealthCalc India relies on deterministic mathematical formulas for 100% financial calculation accuracy.)*

---

## 16. External Services

| Service | Purpose | Documentation Link |
| :--- | :--- | :--- |
| **MongoDB Atlas** | Cloud NoSQL database hosting user accounts & calculations | [MongoDB Docs](https://www.mongodb.com/docs/) |
| **Google OAuth 2.0** | Third-party single sign-on authentication | [Google Auth Docs](https://developers.google.com/identity) |
| **NextAuth.js** | Authentication management & JWT session engine | [NextAuth Docs](https://next-auth.js.org/) |

---

## 17. Security

- 🔐 **Password Hashing**: User passwords are encrypted using `bcryptjs` with salt rounds prior to storing in MongoDB.
- 🛡️ **Session Management**: JWT session tokens signed with `NEXTAUTH_SECRET`.
- 🔑 **Credential Protection**: Environment variables (`MONGODB_URI`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_SECRET`) are never exposed to the client side.
- 🛑 **Protected Routes**: API endpoints verify active session tokens using `getServerSession(authOptions)` before processing database read/write requests.

---

## 18. Responsive Design

The application interface is fully responsive across desktop, tablet, and mobile displays:
- **Desktop**: Grid layouts with side-by-side dynamic input sliders and live visual charts.
- **Tablet**: Collapsible navigation bar and adaptable multi-tab views.
- **Mobile**: Touch-friendly Radix UI sliders, sticky total corpus highlights, and slide-over navigation menus.

---

## 19. Deployment

### Deploying to Vercel

1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com/) and click **New Project**.
3. Import the `ETF-calculator` repository.
4. Add the required Environment Variables in Vercel Project Settings:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel deployment domain `https://your-app.vercel.app`)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
5. Click **Deploy**.

---

## 20. Performance & Optimization

- **Next.js 14 App Router**: Server-rendered layouts and fast route transitions.
- **Client Component Scoping**: Interactive input forms and charts are isolated in `"use client"` components to reduce bundle bloat.
- **Connection Reuse**: Cached MongoDB connection promise minimizes cold-start latency.
- **Dynamic Graphics**: High-performance canvas rendering via `Recharts` SVG charts.

---

## 21. Challenges & Solutions

### Challenge 1: Dynamic Amortization vs Multi-Asset Compounding Precision
* **Problem**: Different assets follow fundamentally different mathematical behavior (e.g., ETFs step-up monthly SIP compounding vs. Real Estate dual appreciation + rental yield vs. Loan decreasing principal amortization).
* **Solution**: Developed a unified dispatcher function (`calculateReturns.ts`) returning standardized `CalculationResult[]` interfaces while keeping underlying asset logic decoupled.

### Challenge 2: Graceful Offline & Database Fallback
* **Problem**: Unauthenticated guest users or users with offline/misconfigured MongoDB connections experienced crashes when trying to compute or save portfolios.
* **Solution**: Created a custom Database Health API (`/api/health`) and implemented isolated user-keyed `localStorage` fallbacks, enabling 100% features functionality in Guest/Offline mode.

---

## 22. Future Improvements

### Currently Implemented
- [x] Multi-Asset Calculator (ETF, Crypto, Real Estate, FD, Loan)
- [x] Step-up SIP & Expense Ratio parameters
- [x] NextAuth Credentials & Google Authentication
- [x] Combined Portfolio Net Worth Trajectory
- [x] Dark & Light mode visual themes
- [x] Client-side PDF Report Export

### Planned Improvements
- [ ] Export calculation data to Excel (.xlsx) / CSV formats
- [ ] Inflation-adjusted portfolio rebalancing recommendations
- [ ] Multi-currency support (USD $, EUR €, GBP £)
- [ ] Tax planning module for Indian IT Act slabs (LTCG / STCG on Mutual Funds & FDs)

---

## 23. Learning Outcomes

This project demonstrates practical expertise in:
- **Full-stack Web Development**: Next.js 14 App Router, Serverless API Routes, and React 18 client components.
- **Financial Engineering**: Mathematical modeling of compounding interest, loan EMIs, step-up annuities, expense drag, and inflation adjustments.
- **Authentication & Security**: NextAuth.js JWT workflows, Google OAuth 2.0 integration, and bcrypt password security.
- **Database Engineering**: Cloud NoSQL document modeling, indexing, and connection lifecycle management with MongoDB Atlas.
- **Responsive UI/UX Engineering**: Glassmorphism aesthetic design using Tailwind CSS, Framer Motion animations, and Recharts interactive graphs.

---

## 24. Screenshots Gallery

<p align="center">
  <img src="./screenshots/home.png" width="45%" alt="Calculator View" />
  <img src="./screenshots/dashboard.png" width="45%" alt="Dashboard View" />
</p>

---

## 25. Contributors

Developed by **[Akshay-Nedunuri17](https://github.com/Akshay-Nedunuri17)**.

---

## 26. License

No explicit license is currently specified for this repository. All rights reserved by the author.

---

## 27. GitHub Repository Links

- **Repository**: [https://github.com/Akshay-Nedunuri17/ETF-calculator](https://github.com/Akshay-Nedunuri17/ETF-calculator)
- **Issues**: [https://github.com/Akshay-Nedunuri17/ETF-calculator/issues](https://github.com/Akshay-Nedunuri17/ETF-calculator/issues)
- **Releases**: [https://github.com/Akshay-Nedunuri17/ETF-calculator/releases](https://github.com/Akshay-Nedunuri17/ETF-calculator/releases)
