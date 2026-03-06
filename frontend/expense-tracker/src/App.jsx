import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./context";
import { ThemeProvider } from "./context/ThemeContext";

import SignUp from "./pages/Auth/SignUp";
import Income from "./pages/Dashboard/Income";
import Home from "./pages/Dashboard/Home";
import Login from "./pages/Auth/Login";
import Expense from "./pages/Dashboard/Expense";
import Transactions from "./pages/Dashboard/Transactions";
import Profile from "./pages/Dashboard/Profile";
import OAuthCallback from "./pages/Auth/OAuthCallback";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
