# Database Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ ACCOUNT : has
    USER ||--o{ SESSION : has
    USER ||--o{ JOURNEY : has
    
    JOURNEY ||--o{ CONVERSATION : contains
    JOURNEY ||--o{ CHECKIN : contains
    JOURNEY ||--o{ TASK : contains
    JOURNEY ||--o{ MILESTONE : contains
    
    CONVERSATION ||--o{ MESSAGE : contains

    USER {
        string id PK
        string email UK
        string passwordHash
        string name
        string image
        enum subscriptionTier
        string timezone
        datetime createdAt
        datetime updatedAt
    }

    JOURNEY {
        string id PK
        string userId FK
        enum transitionType
        enum initialFeeling
        string initialContext
        int currentPhase
        enum status
        int streakDays
        int longestStreak
        datetime startedAt
        datetime completedAt
    }

    CONVERSATION {
        string id PK
        string journeyId FK
        datetime startedAt
        datetime endedAt
        int messageCount
        string contextSummary
    }

    MESSAGE {
        string id PK
        string conversationId FK
        enum role
        string content
        float sentimentScore
        string sentimentLabel
        int tokensUsed
        boolean flagged
        datetime createdAt
    }

    CHECKIN {
        string id PK
        string journeyId FK
        int moodScore
        string reflection
        string insight
        date checkInDate
    }

    TASK {
        string id PK
        string journeyId FK
        int phase
        string title
        string description
        boolean completed
        datetime completedAt
        int sortOrder
    }

    MILESTONE {
        string id PK
        string journeyId FK
        string milestoneKey UK
        string title
        string description
        datetime achievedAt
    }

    ACCOUNT {
        string id PK
        string userId FK
        string type
        string provider
        string providerAccountId
    }

    SESSION {
        string id PK
        string userId FK
        string sessionToken UK
        datetime expires
    }
```

## Tables Explained

| Table | Purpose |
|-------|---------|
| **USER** | Stores user accounts (email, password, preferences) |
| **JOURNEY** | One per user - their transition journey (career, move, etc.) |
| **CONVERSATION** | Chat sessions between user and AI |
| **MESSAGE** | Individual messages in a conversation |
| **CHECKIN** | Daily mood check-ins (1-5 score) |
| **TASK** | Roadmap tasks across 4 phases |
| **MILESTONE** | Achievements (first_conversation, week_1_complete, etc.) |
| **ACCOUNT** | OAuth provider accounts (Google, GitHub) |
| **SESSION** | Active login sessions |
