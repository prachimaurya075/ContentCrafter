# ContentCrafter

A full-stack AI-powered content generation platform that combines chat-based AI assistance, genre-based content management, and real-time trending topic discovery from LinkedIn and Twitter.

## ✨ Features

### Module 1: Chat-Based Content Generation
- Real-time AI writing assistance using Stream Chat
- Interactive chat interface with AI responses
- Writing prompts and suggestions
- Message persistence and history

### Module 2: Genre-Based Content Discovery
- Browse content by multiple genres
- Advanced search and filtering
- Full content display view
- Content recommendations

### Module 3: Trendy Topics Discovery
- Real-time trending topics from LinkedIn and Twitter
- Automatic content generation based on trends
- Topic ranking and filtering
- Integration with AI content generator

### Core Features
- Firebase Authentication (Login/Signup)
- Secure user sessions and token management
- Real-time AI content generation via Gemini API
- Stream Chat integration for live messaging
- Responsive dark-themed UI
- Error handling and status indicators

## 🛠️ Tech Stack

### Frontend
- **React** 18+
- **Vite** - Build tool
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework
- **Firebase** - Authentication & Database
- **Gemini AI API** - Content generation
- **Stream Chat API** - Real-time messaging
- **MongoDB** - Additional data storage

### External APIs
- **Gemini AI** - Content generation
- **Stream Chat** - Real-time messaging
- **Firebase Authentication** - User auth

## 🚀 Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase account
- Gemini AI API key
- Stream Chat API keys
- LinkedIn & Twitter API credentials

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Update .env with your API keys
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your API keys
npm run dev
```

## 💻 Usage

### Starting the Application

```bash
# Frontend (runs on http://localhost:5173)
cd frontend && npm run dev

# Backend (runs on http://localhost:5000)
cd backend && npm run dev
```
## 📁 Project Structure

```
ContentCrafter/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/ (Shadcn components)
│   │   │   └── ...
│   │   ├── module/
│   │   │   ├── ChatBased/
│   │   │   ├── GenreBased/
│   │   │   └── ...
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   └── ...
│   ├── streamchat/
│   └── ...
│
└── README.md
```

## 🔐 Security

- Firebase Authentication for user management
- Secure token generation and validation
- API key protection via environment variables
- CORS configuration
- Input validation and sanitization
- Error handling and logging