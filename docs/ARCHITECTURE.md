# Project Architecture

## Overview

Expense Tracker is a full-stack MERN application with a modern, component-based architecture.

## Frontend Architecture

### Technology Stack

- **React 18**: UI library with hooks
- **Vite**: Build tool and dev server
- **Tailwind CSS v4**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Recharts**: Data visualization
- **Axios**: HTTP client

### Folder Structure

```
src/
├── assets/              # Static assets (images, icons)
├── components/          # Reusable components
│   ├── common/          # Common UI components (Toast, LoadingScreen)
│   ├── layout/          # Layout components (Sidebar)
│   ├── modals/          # Modal dialogs (ConfirmModal, ImageModal)
│   ├── inputs/          # Form input components
│   └── index.js         # Barrel exports
├── context/             # React Context providers
│   ├── ThemeContext.jsx # Dark mode management
│   ├── UserContext.js   # User authentication state
│   └── UserProvider.jsx # User context provider
├── hooks/               # Custom React hooks (future use)
├── pages/               # Page components
│   ├── Auth/            # Authentication pages
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   │   └── OAuthCallback.jsx
│   ├── Dashboard/       # Dashboard pages
│   │   ├── Home.jsx
│   │   ├── Income.jsx
│   │   ├── Expense.jsx
│   │   ├── Transactions.jsx
│   │   └── Profile.jsx
│   ├── NotFound.jsx
│   └── index.js         # Barrel exports
├── utils/               # Utility functions
│   ├── axiosInstance.js # Configured Axios instance
│   ├── apiPath.js       # API endpoint constants
│   └── index.js         # Barrel exports
├── App.jsx              # Main app component with routes
├── main.jsx             # Application entry point
└── index.css            # Global styles and Tailwind config
```

### Component Organization

#### Common Components

- **Toast**: Notification system for success/error messages
- **LoadingScreen**: Full-page loading indicator

#### Layout Components

- **Sidebar**: Navigation sidebar with responsive mobile menu

#### Modal Components

- **ConfirmModal**: Reusable confirmation dialog
- **ImageModal**: Image lightbox viewer
- **DeleteConfirmModal**: Legacy delete confirmation (to be deprecated)

#### Input Components

- **ProfilePhotoSelector**: Profile photo upload component

### State Management

#### Context API

- **UserContext**: Global user authentication state
- **ThemeContext**: Dark mode toggle and persistence

#### Local State

- Component-level state using `useState`
- Form state management
- UI state (modals, toasts)

### Routing

Protected routes require authentication:

- `/dashboard` - Home dashboard
- `/income` - Income management
- `/expense` - Expense management
- `/transactions` - All transactions
- `/profile` - User profile

Public routes:

- `/login` - User login
- `/signup` - User registration
- `/auth/callback` - OAuth callback

### Styling

- **Tailwind CSS v4** with custom configuration
- **Dark mode** using `dark:` variant
- **Responsive design** with mobile-first approach
- **Custom animations** for smooth transitions

## Backend Architecture

### Technology Stack

- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **Passport.js**: OAuth authentication
- **Multer**: File upload handling

### Folder Structure

```
backend/
├── config/              # Configuration files
│   ├── db.js            # MongoDB connection
│   └── passport.js      # Passport OAuth config
├── controllers/         # Route controllers
│   ├── authController.js
│   ├── dashboardController.js
│   ├── expenseController.js
│   └── incomeController.js
├── middleware/          # Express middleware
│   ├── authMiddleware.js    # JWT verification
│   └── uploadMiddleware.js  # File upload handling
├── models/              # Mongoose models
│   ├── User.js
│   ├── Income.js
│   └── Expense.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── expenseRoutes.js
│   └── incomeRoutes.js
├── uploads/             # User uploaded files
│   └── profileImages/
└── server.js            # Application entry point
```

### API Design

RESTful API with the following structure:

- `/api/v1/auth/*` - Authentication endpoints
- `/api/v1/income/*` - Income management
- `/api/v1/expense/*` - Expense management
- `/api/v1/dashboard/*` - Dashboard data
- `/api/v1/user/*` - User profile

### Database Schema

#### User Model

```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  googleId: String,
  profilePhoto: String,
  createdAt: Date
}
```

#### Income Model

```javascript
{
  userId: ObjectId (ref: User),
  icon: String,
  source: String,
  amount: Number,
  date: Date,
  createdAt: Date
}
```

#### Expense Model

```javascript
{
  userId: ObjectId (ref: User),
  icon: String,
  category: String,
  amount: Number,
  date: Date,
  createdAt: Date
}
```

### Authentication Flow

1. **Email/Password**:
   - User registers with email and password
   - Password is hashed with bcrypt
   - JWT token issued on successful login
   - Token stored in localStorage on client

2. **Google OAuth**:
   - User clicks "Sign in with Google"
   - Redirected to Google consent screen
   - Google returns authorization code
   - Backend exchanges code for user info
   - JWT token issued and returned to client

### Security

- Passwords hashed with bcryptjs
- JWT tokens for stateless authentication
- CORS configured for specific origins
- Environment variables for sensitive data
- Input validation and sanitization
- Protected routes with auth middleware

## Deployment

### Frontend (Vercel)

- Automatic deployments from GitHub
- Environment variables configured in Vercel dashboard
- Build command: `npm run build`
- Output directory: `dist`

### Backend (Render)

- Automatic deployments from GitHub
- Environment variables configured in Render dashboard
- Start command: `node server.js`
- MongoDB Atlas for database

## Performance Optimizations

- Code splitting with React lazy loading
- Image optimization
- Efficient re-renders with React.memo
- Debounced search inputs
- Pagination for large datasets
- Caching with Axios interceptors

## Future Enhancements

- [ ] Add budget planning features
- [ ] Implement recurring transactions
- [ ] Add category customization
- [ ] Export to PDF reports
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Data backup and restore
