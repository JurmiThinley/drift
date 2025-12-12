# User Flow Diagram

```mermaid
flowchart TD
    A[User visits drift.app] --> B{Has account?}
    
    B -->|No| C[Register Page]
    C --> D[Enter email & password]
    D --> E[Account created in DB]
    E --> F[Auto login]
    
    B -->|Yes| G[Login Page]
    G --> H[Enter credentials]
    H --> I{Valid?}
    I -->|No| G
    I -->|Yes| F
    
    F --> J{Has journey?}
    
    J -->|No| K[Onboarding]
    K --> L[Step 1: Select transition type]
    L --> M[Step 2: Select feeling]
    M --> N[Step 3: Add context]
    N --> O[Create Journey + Tasks]
    O --> P[Dashboard]
    
    J -->|Yes| P
    
    P --> Q{User action}
    
    Q -->|Chat| R[Chat Page]
    R --> S[Start conversation]
    S --> T[AI generates greeting]
    T --> U[User sends message]
    U --> V[AI responds]
    V --> W{Continue?}
    W -->|Yes| U
    W -->|No| P
    
    Q -->|Check-in| X[Daily Check-in]
    X --> Y[Select mood 1-5]
    Y --> Z[Optional reflection]
    Z --> AA[Save to DB]
    AA --> P
    
    Q -->|View Roadmap| AB[Roadmap View]
    AB --> AC[See tasks by phase]
    AC --> AD[Mark task complete]
    AD --> P
    
    Q -->|Logout| AE[Logout]
    AE --> A
```

## Flow Explained

1. **Entry**: User lands on homepage
2. **Auth**: Register or login
3. **Onboarding**: First-time users complete 3 steps
4. **Dashboard**: Central hub for all features
5. **Chat**: Talk to AI companion
6. **Check-in**: Daily mood tracking
7. **Roadmap**: View and complete tasks
