<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CIC.TTB.ERP - Construction Management System

Enterprise Resource Planning system for construction project management with BIM integration, built with React, TypeScript, and Supabase.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Supabase** account (for database)
- **Google Gemini API** key (for AI features)

### Local Development

1. **Clone repository**:
   ```bash
   git clone https://github.com/anhnq-lab/cic-ttb-erp-.git
   cd cic-ttb-erp-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open browser**: [http://localhost:5000](http://localhost:5000)

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anhnq-lab/cic-ttb-erp-)

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Quick Deploy Steps:

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment guide (Vietnamese)
- **[Database Migrations](./database/migrations/)** - SQL schema and seed data
- **[API Documentation](./docs/)** - API endpoints and services

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS (via vanilla CSS)
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **AI**: Google Gemini API
- **Deployment**: Vercel
- **Charts**: Recharts
- **3D/BIM**: Three.js (planned)

## 📁 Project Structure

```
cic-ttb-erp/
├── components/        # React components
├── pages/            # Page components
├── services/         # API services
├── utils/            # Utility functions
├── database/         # Database migrations
│   └── migrations/   # SQL migration files
├── public/           # Static assets
├── types.ts          # TypeScript types
└── constants.ts      # App constants
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes (for AI) |

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📄 License

Private - CIC Internal Use Only

## 👥 Team

Construction Investment Corporation (CIC)

---

**Made with ❤️ by CIC Development Team**
