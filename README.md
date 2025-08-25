# SikAP – AI-Powered Micro-Lending Platform
SikAP is an **AI-powered micro-lending platform** designed to support **Filipino micro-entrepreneurs**. It helps users easily apply for loans, while loan officers and admins can efficiently review, assess, and approve applications.

---

## ✨ What You Can Do with SikAP

* **Borrowers**
  * Register and create your profile
  * Submit loan applications
  * Complete ESG (Environmental, Social, Governance) assessment questionnaires
  * Declare assets for collateral
  * Track your application status in real-time

* **Loan Officers**
  * Review incoming applications
  * Verify borrower documents and compliance
  * Evaluate ESG scores and asset valuations
  * Approve or reject applications
  * Generate loan offers and repayment plans

* **Admins**
  * Manage system users and permissions
  * Monitor application pipelines
  * Access analytics and insights on loan performance

---

## 🗂️ Application Pages & Routes

### Public Pages
- **`/`** - Landing page with SikAP branding, features overview, and call-to-action
- **`/programs`** - Available loan programs (Business, Motorcycle, Gadget, etc.)
- **`/about`** - Company information, team, milestones, and values
- **`/faq`** - Frequently asked questions organized by category
- **`/contact`** - Contact information and inquiry form

### Authentication
- **`/signin`** - User login with email/password
- **`/signup`** - New user registration with profile creation
- **`/application`** - Initial loan application form (pre-authentication)

### User Dashboard (`/dashboard/`)
- **`/dashboard`** - Main dashboard with overview, quick stats, and recent activity
- **`/dashboard/portfolio`** - Portfolio overview with financial summary and loan history
- **`/dashboard/loans`** - All loan applications with status tracking and action buttons
- **`/dashboard/loans/:id/details`** - Detailed loan offer view with terms and conditions
- **`/dashboard/agents`** - AI agents status and interaction history
- **`/dashboard/chatbot`** - AI-powered chat assistant for loan questions
- **`/dashboard/profile`** - User profile management and settings

### Forms & Processes
- **`/document-upload/:applicationId`** - Document upload portal with drag-and-drop interface
- **`/esg-compliance/:applicationId`** - ESG assessment questionnaire with progress tracking
- **`/asset-declaration/:applicationId`** - Asset declaration form for collateral information

### Loan Officer Dashboard (`/officer/`)
- **`/officer`**
  - Officer overview with application metrics and pending tasks
  - All loan applications with filtering, search, and batch actions
  - Comprehensive analytics with charts and performance metrics

---

## 🖥️ How to Run SikAP

### Prerequisites
* Node.js (v18 or newer)
* Supabase account (for database + authentication)
* n8n (workflow automation, cloud or self-hosted)
* Google Gemini API access (for AI features)

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-org>/sikap.git
   cd sikap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase keys, n8n webhook URLs, and Google API keys.

4. **Run development server**
   ```bash
   npm run dev
   ```
   The app will be available at **[http://localhost:3000](http://localhost:3000)**.

---

## 📂 Using the App

### For Borrowers
1. **Sign up / log in** (`/signin`, `/signup`) with your email.
2. **Complete your profile** (`/dashboard/profile`) with personal info, employment, documents.
3. **Submit a loan application** (`/dashboard/loans`) – the system will give you an initial AI decision (ACCEPT/REVIEW/REJECT).
4. If accepted, **fill out the ESG assessment** (`/esg-compliance/:applicationId`).
5. Optionally, **declare your assets** (`/asset-declaration/:applicationId`) as collateral.
6. Track the progress of your loan in your dashboard (`/dashboard/loans`).

### For Loan Officers
1. Log in with officer credentials (`/signin`).
2. Open the **Officer Dashboard** (`/officer/dashboard`) to view applications.
3. Review borrower profiles, documents, ESG results, and asset valuations (`/officer/requests`).
4. Approve or reject applications.
5. When approved, generate a **loan plan** and finalize the loan offer.

---

## 🎨 Page Previews

### Landing Page (`/`)
- Hero section with SikAP branding and value proposition
- Feature highlights with icons and descriptions
- Loan program cards with quick details
- Call-to-action buttons for registration
- Footer with company information

### User Dashboard (`/dashboard/`)
- Welcome message with user's name
- Application status cards with progress indicators
- Quick action buttons (New Application, View Loans, Upload Documents)
- Recent activity timeline
- AI agent status indicators

### Loans Page (`/dashboard/loans`)
- Application cards with status badges
- Progress bars showing completion percentage
- Action buttons (Continue Application, View Details, Upload Documents)
- Filtering and search functionality
- Real-time status updates

### Officer Dashboard (`/officer/dashboard`)
- Application metrics and KPIs
- Pending review queue with priority indicators
- Analytics charts (approval rates, processing times)
- Quick filters (New Applications, Under Review, Approved)
- Batch processing tools

### ESG Assessment (`/esg-compliance/:applicationId`)
- Multi-section questionnaire with progress tracking
- Category-based questions (Environment, Social, Governance, Financial Stability)
- Auto-save functionality for partial completion
- Score preview and submission confirmation
- Responsive design for mobile completion

---

## 📊 Application Flow

```
[ Borrower ]
     │
     ▼
 Loan Application (via SikAP web app)
     │
     ▼
[ AI Pre-Loan Agent ]
   ├── REJECT → End
   ├── REVIEW → Officer Review
   └── ACCEPT → Continue
                 │
                 ▼
        ESG Questionnaire
                 │
                 ▼
        [ AI ESG Evaluation ]
                 │
                 ▼
        Asset Declaration (optional)
                 │
                 ▼
 [ AI Asset Valuation + LTV Analysis ]
                 │
                 ▼
       Loan Officer Review & Approval
                 │
                 ▼
     Loan Plan Generated (terms, schedule)
                 │
                 ▼
      Borrower Accepts / Declines Offer
                 │
                 ▼
              Loan Finalized
```

---

## 🔒 Security & Compliance

* All users authenticate via **Supabase Auth** (secure login).
* Sensitive data is **encrypted** (AES-256).
* System follows **BSP** and **Data Privacy Act** guidelines.
* Role-based access ensures officers and borrowers only see what's relevant to them.

---

## 🚀 Deployment (Production)

When ready for production:
* Deploy the frontend to **Vercel** or **Netlify**
* Connect to your **Supabase** database
* Run workflows on your **n8n instance**
* Enable monitoring and backups

---

## 👥 About

* **Project:** SikAP – AI-Powered Micro-Lending
* **Version:** 1.0 (January 2025)
* **Authors:** SikAP Technical Team

