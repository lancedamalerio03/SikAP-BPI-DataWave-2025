---

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

1. **Sign up / log in** with your email.
2. **Complete your profile** (personal info, employment, documents).
3. **Submit a loan application** – the system will give you an initial AI decision (ACCEPT/REVIEW/REJECT).
4. If accepted, **fill out the ESG assessment**.
5. Optionally, **declare your assets** as collateral.
6. Track the progress of your loan in your dashboard.

### For Loan Officers

1. Log in with officer credentials.
2. Open the **Officer Dashboard** to view applications.
3. Review borrower profiles, documents, ESG results, and asset valuations.
4. Approve or reject applications.
5. When approved, generate a **loan plan** and finalize the loan offer.

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
* Role-based access ensures officers and borrowers only see what’s relevant to them.

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

---


