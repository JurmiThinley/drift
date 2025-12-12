# Drift - UML Diagrams

This folder contains UML diagrams documenting the Drift application architecture.

## 📊 Diagrams

| File | Description |
|------|-------------|
| [DATABASE_ERD.md](./DATABASE_ERD.md) | Entity Relationship Diagram - Database schema |
| [USER_FLOW.md](./USER_FLOW.md) | User journey through the application |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture & API routes |
| [CLASS_DIAGRAM.md](./CLASS_DIAGRAM.md) | Component classes and relationships |
| [SEQUENCE_DIAGRAMS.md](./SEQUENCE_DIAGRAMS.md) | Step-by-step flows for key features |

## 🔍 Quick Overview

### Database Structure
```
User → Journey → Conversation → Message
                → Task
                → CheckIn
                → Milestone
```

### Tech Stack
```
Frontend:  Next.js 14 + React + Tailwind
Backend:   Next.js API Routes
Database:  PostgreSQL (Supabase)
Auth:      NextAuth.js
AI:        OpenRouter (Mistral/Llama)
State:     Zustand
```

### Key Flows
1. **Registration** → Create account → Auto login → Onboarding
2. **Onboarding** → Select transition → Select feeling → Add context → Create journey
3. **Chat** → Start conversation → AI greeting → User message → AI response
4. **Check-in** → Select mood → Optional reflection → Update streak

## 📝 Viewing Diagrams

These diagrams use [Mermaid](https://mermaid.js.org/) syntax. To view them:

1. **GitHub** - Renders automatically in `.md` files
2. **VS Code** - Install "Markdown Preview Mermaid Support" extension
3. **Online** - Paste into [mermaid.live](https://mermaid.live)

## 🗂️ Project Structure

```
drift-app/
├── src/
│   ├── app/                    # Pages & API routes
│   │   ├── (auth)/             # Login, Register
│   │   ├── (dashboard)/        # Dashboard, Chat
│   │   ├── onboarding/         # 3-step wizard
│   │   └── api/                # REST endpoints
│   ├── components/             # React components
│   │   ├── ui/                 # Base components
│   │   ├── chat/               # Chat UI
│   │   └── onboarding/         # Step components
│   └── lib/                    # Utilities
│       ├── ai/                 # AI integration
│       ├── db/                 # Database client
│       └── stores/             # Zustand stores
└── prisma/
    └── schema.prisma           # Database schema
```
