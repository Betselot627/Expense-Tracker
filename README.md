# Expense Tracker

A full-stack expense tracking application built with React, Node.js, Express, and MongoDB.

![Expense Tracker](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd expense-tracker

# Install dependencies
npm install
cd backend && npm install
cd ../frontend/expense-tracker && npm install

# Set up environment variables (see .env.example)
cp .env.example .env
cp frontend/expense-tracker/.env.example frontend/expense-tracker/.env

# Start the application
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend/expense-tracker && npm run dev
```

## ✨ Features

- 💰 Track income and expenses
- 📊 Visual analytics with charts
- 🌓 Dark mode support
- 👤 User authentication (Email & Google OAuth)
- 📱 Fully responsive design
- 📥 Export data to CSV
- 🔔 Modern toast notifications
- 🎨 Professional UI with Tailwind CSS

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS v4, Recharts, React Router

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Passport.js

## 📚 Documentation

Comprehensive documentation is available in the `docs` folder:

- **[Full Documentation](docs/README.md)** - Complete setup guide and features
- **[Architecture](docs/ARCHITECTURE.md)** - Technical architecture and design
- **[Contributing](docs/CONTRIBUTING.md)** - Contribution guidelines
- **[Frontend Guide](docs/FRONTEND.md)** - Frontend-specific documentation

## 🌐 Live Demo

- **Frontend:** [https://expense-tracker-betsi.vercel.app](https://expense-tracker-betsi.vercel.app)
- **Backend API:** [https://expense-tracker-s9zd.onrender.com](https://expense-tracker-s9zd.onrender.com)

## 📁 Project Structure

```
expense-tracker/
├── docs/                    # Documentation
├── backend/                 # Express API
├── frontend/expense-tracker # React application
├── .github/workflows/       # CI/CD
└── .env.example            # Environment variables template
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](docs/CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ by the Expense Tracker team

---

For detailed documentation, please visit the [docs](docs/) folder.
