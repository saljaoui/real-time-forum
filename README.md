### forum-project

```
forum-project/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── backend/
│   ├── cmd/
│   │   └── main.go
│   ├── internal/
│   │   ├── auth/
│   │   ├── models/
│   │   ├── handlers/
│   │   ├── middleware/
│       |── database/
|       └── rote/
│   
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── templates/
├── README.md
└── go.mod
```



### Backend
```
Backend:
- Go (standard packages)
- SQLite for database
- bcrypt for password encryption
- UUID for session management

Frontend:
- Pure HTML/CSS/JavaScript (no frameworks allowed)
- Templates for rendering

Infrastructure:
- Docker for containerization
- Git for version control
```

### db-schema.mermaid
```mermaid
erDiagram
    Users {
        int id PK
        string email
        string username
        string password_hash
        datetime created_at
    }
    Posts {
        int id PK
        int user_id FK
        string title
        string content
        datetime created_at
    }
    Comments {
        int id PK
        int post_id FK
        int user_id FK
        string content
        datetime created_at
    }
    Categories {
        int id PK
        string name
        string description
    }
    Post_Categories {
        int post_id FK
        int category_id FK
    }
    Reactions {
        int id PK
        int user_id FK
        int post_id FK
        int comment_id FK
        string type
    }
    Sessions {
        string uuid PK
        int user_id FK
        datetime expires_at
    }

    Users ||--o{ Posts : creates
    Users ||--o{ Comments : writes
    Posts ||--o{ Comments : has
    Posts ||--o{ Post_Categories : belongs_to
    Categories ||--o{ Post_Categories : has
    Users ||--o{ Reactions : makes
    Posts ||--o{ Reactions : receives
    Comments ||--o{ Reactions : receives
    Users ||--o{ Sessions : has
