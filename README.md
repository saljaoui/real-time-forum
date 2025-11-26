Real-Time Forum

A full-stack single-page application (SPA) built with Go, JavaScript, SQLite, and WebSockets for real-time communication, messaging, and typing indicators.
🎯 Project Overview

This project builds upon the classic forum concept by adding real-time capabilities including:

    User Authentication (registration & login)

    Post Management with categories and comments

    Private Messaging with real-time delivery

    Typing Indicators - See when someone is typing in real-time

    Online/Offline Status tracking

    Single-Page Application (SPA) architecture with DOM manipulation

Key Features

✨ Authentication & Authorization

    User registration with nickname, email, age, gender, first/last name

    Login via nickname or email + password

    Secure password hashing with bcrypt

    Session management with cookies

💬 Real-Time Communication

    WebSocket connections for instant messaging

    Typing indicators with smooth animations

    Online/offline user status

    Last message sorting in chat list

📝 Forum Features

    Create posts with categories

    Comment on posts

    Feed display for browsing

    Collapsible comments section

🏗️ Architecture

text
real-time-forum/
├── backend/
│   ├── main.go
│   ├── handlers/          # HTTP & WebSocket handlers
│   ├── models/            # Data structures
│   ├── db/                # Database layer
│   └── middleware/        # Auth & session middleware
├── frontend/
│   ├── index.html         # Single HTML file (SPA)
│   ├── css/
│   │   └── styles.css     # Responsive styling
│   └── js/
│       ├── main.js        # App initialization
│       ├── websocket.js   # WebSocket management
│       ├── typing.js      # Typing indicator engine
│       ├── auth.js        # Auth flow
│       ├── posts.js       # Posts & comments
│       ├── messages.js    # Private messaging
│       └── dom.js         # DOM utilities
├── database.db            # SQLite database
├── go.mod
├── go.sum
└── README
