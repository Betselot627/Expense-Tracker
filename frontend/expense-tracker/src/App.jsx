import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./context";

import SignUp from "./pages/Auth/SignUp";
import Income from "./pages/Dashboard/Income";
import Home from "./pages/Dashboard/Home";
import Login from "./pages/Auth/Login";
import Expense from "./pages/Dashboard/Expense";
import Transactions from "./pages/Dashboard/Transactions";
import OAuthCallback from "./pages/Auth/OAuthCallback";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </Router>
    </UserProvider>
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
