# 🌊 Drift

**Your AI-powered life transition companion**

Drift helps people navigate major life transitions—career changes, relocations, becoming a parent, and more—with personalized AI guidance, structured roadmaps, and community wisdom.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

---

## ✨ Features

- **🤖 AI Conversations** - Chat with an empathetic AI companion powered by Claude
- **🗺️ Personalized Roadmaps** - Phase-based guidance tailored to your transition type
- **📊 Daily Check-ins** - Track your emotional journey with mood logging
- **🏆 Milestone Tracking** - Celebrate progress with achievement milestones
- **🔐 Secure Auth** - Email/password authentication with NextAuth.js

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 14 (App Router) | React framework with SSR |
| **Language** | TypeScript | Type safety |
| **Database** | PostgreSQL (Supabase) | Data persistence |
| **ORM** | Prisma | Database access |
| **Auth** | NextAuth.js | Authentication |
| **AI** | Anthropic Claude | Conversational AI |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Components** | Radix UI + shadcn/ui | Accessible components |
| **Deployment** | Vercel | Hosting |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (recommend [Supabase](https://supabase.com) free tier)
- Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/drift.git
   cd drift
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your `.env` file:
   ```env
   # Database (from Supabase dashboard)
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   
   # NextAuth (generate with: openssl rand -base64 32)
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Anthropic
   ANTHROPIC_API_KEY="sk-ant-..."
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```
drift/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Auth pages (login, register)
│   │   ├── (dashboard)/   # Protected dashboard pages
│   │   ├── api/           # API routes
│   │   ├── onboarding/    # Onboarding flow
│   │   └── layout.tsx     # Root layout
│   ├── components/
│   │   ├── ui/            # Base UI components
│   │   ├── onboarding/    # Onboarding components
│   │   ├── dashboard/     # Dashboard components
│   │   └── chat/          # Chat components
│   ├── lib/
│   │   ├── db/            # Prisma client
│   │   ├── ai/            # Claude integration
│   │   └── utils.ts       # Utility functions
│   └── types/             # TypeScript types
└── public/                # Static assets
```

---

## 🏗️ Architecture Decisions

### Why Next.js App Router?
- Server Components for better performance
- Built-in API routes
- Easy deployment to Vercel
- Great developer experience

### Why Prisma + PostgreSQL?
- Type-safe database queries
- Easy migrations
- Supabase provides free PostgreSQL hosting
- Future-proof for scaling

### Why Claude for AI?
- Best-in-class empathy and safety
- Long context windows
- Consistent, helpful responses
- Built-in content moderation

---

## 🗄️ Database Schema

```
User ──────────┬──────────── Journey
               │                │
               │                ├── Conversation ── Message
               │                │
               │                ├── CheckIn
               │                │
               │                ├── Task
               │                │
               │                └── Milestone
```

See `prisma/schema.prisma` for full schema.

---

## 🔮 Roadmap

- [x] Authentication (email/password)
- [x] User registration
- [ ] Onboarding flow
- [ ] AI chat interface
- [ ] Dashboard
- [ ] Daily check-ins
- [ ] Roadmap visualization
- [ ] Push notifications
- [ ] Mobile app (React Native)

---

## 🧪 Running Tests

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e
```

---

## 📦 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/drift)

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) for Claude AI
- [Vercel](https://vercel.com) for hosting
- [Supabase](https://supabase.com) for database
- [shadcn/ui](https://ui.shadcn.com) for components

---

<p align="center">
  Built with ❤️ for people navigating life's transitions
</p>
