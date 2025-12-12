# System Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["Client (Browser)"]
        UI[React Components]
        State[Zustand Store]
    end

    subgraph NextJS["Next.js Application"]
        Pages[Pages & Layouts]
        API[API Routes]
        Auth[NextAuth.js]
    end

    subgraph External["External Services"]
        AI[OpenRouter API]
        DB[(PostgreSQL)]
    end

    UI <--> State
    UI <--> Pages
    Pages <--> API
    API <--> Auth
    API <--> DB
    API <--> AI

    style Client fill:#1a1a2e,stroke:#e8b4a0,color:#fff
    style NextJS fill:#2c3e50,stroke:#a0c4b8,color:#fff
    style External fill:#34495e,stroke:#e8b4a0,color:#fff
```

## Component Details

### Client Layer
| Component | Technology | Purpose |
|-----------|------------|---------|
| React Components | Next.js + React 18 | UI rendering |
| Zustand Store | Zustand | Client-side state (onboarding) |

### Application Layer
| Component | Technology | Purpose |
|-----------|------------|---------|
| Pages | Next.js App Router | Route handling, SSR |
| API Routes | Next.js Route Handlers | REST endpoints |
| NextAuth.js | NextAuth v4 | Authentication |

### External Services
| Service | Provider | Purpose |
|---------|----------|---------|
| Database | Supabase (PostgreSQL) | Data persistence |
| AI | OpenRouter (Mistral/Llama) | Chat responses |

---

## API Routes Architecture

```mermaid
flowchart LR
    subgraph Auth["/api/auth"]
        A1[POST /register]
        A2[POST /...nextauth]
    end

    subgraph Journeys["/api/journeys"]
        J1[POST / - Create]
        J2[GET / - Read]
    end

    subgraph Conversations["/api/conversations"]
        C1[POST / - Create]
        C2[GET / - List]
        C3[POST /:id/messages]
        C4[GET /:id/messages]
    end

    subgraph CheckIns["/api/check-ins"]
        K1[POST / - Create]
        K2[GET / - List]
    end
```

## Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant A as API
    participant D as Database
    participant AI as OpenRouter

    U->>C: Types message
    C->>A: POST /api/conversations/:id/messages
    A->>D: Save user message
    A->>D: Get journey context
    A->>AI: Send prompt + context
    AI-->>A: AI response
    A->>D: Save AI message
    A-->>C: Return both messages
    C-->>U: Display response
```
