# Expense Tracker

A full-stack expense tracking application built with React, Node.js, Express, and MongoDB.

## Features

- 💰 Track income and expenses
- 📊 Visual analytics with charts
- 🌓 Dark mode support
- 👤 User authentication (Email & Google OAuth)
- 📱 Fully responsive design
- 📥 Export data to CSV
- 🔔 Modern toast notifications
- 🎨 Professional UI with Tailwind CSS

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS v4
- Recharts (data visualization)
- React Router
- Axios
- Google OAuth

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Passport.js (Google OAuth)
- Multer (file uploads)
- bcryptjs

## Project Structure

```
expense-tracker/
├── frontend/
│   └── expense-tracker/
│       ├── src/
│       │   ├── assets/          # Images and static files
│       │   ├── components/      # Reusable components
│       │   │   ├── common/      # Common UI components
│       │   │   ├── layout/      # Layout components
│       │   │   ├── modals/      # Modal dialogs
│       │   │   └── inputs/      # Form inputs
│       │   ├── context/         # React context providers
│       │   ├── hooks/           # Custom React hooks
│       │   ├── pages/           # Page components
│       │   │   ├── Auth/        # Authentication pages
│       │   │   └── Dashboard/   # Dashboard pages
│       │   └── utils/           # Utility functions
│       ├── public/              # Public assets
│       └── package.json
├── backend/
│   ├── config/                  # Configuration files
│   ├── controllers/             # Route controllers
│   ├── middleware/              # Express middleware
│   ├── models/                  # Mongoose models
│   ├── routes/                  # API routes
│   ├── uploads/                 # User uploads
│   └── server.js
└── .github/
    └── workflows/               # GitHub Actions

```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd expense-tracker
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Install frontend dependencies

```bash
cd frontend/expense-tracker
npm install
```

4. Set up environment variables

Backend `.env`:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Running the Application

1. Start the backend server

```bash
cd backend
npm start
```

2. Start the frontend development server

```bash
cd frontend/expense-tracker
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Deployment

### Frontend (Vercel)

- Connected to GitHub for automatic deployments
- Production URL: https://expense-tracker-betsi.vercel.app

### Backend (Render)

- Deployed on Render
- Production URL: https://expense-tracker-s9zd.onrender.com

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/google` - Google OAuth login

### Income

- `GET /api/v1/income` - Get all income
- `POST /api/v1/income` - Add income
- `DELETE /api/v1/income/:id` - Delete income
- `GET /api/v1/income/download-csv` - Download CSV

### Expense

- `GET /api/v1/expense` - Get all expenses
- `POST /api/v1/expense` - Add expense
- `DELETE /api/v1/expense/:id` - Delete expense
- `GET /api/v1/expense/download-csv` - Download CSV

### Dashboard

- `GET /api/v1/dashboard` - Get dashboard data

### User

- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile
- `POST /api/v1/user/profile-photo` - Upload profile photo

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
