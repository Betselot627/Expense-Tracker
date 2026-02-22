import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../../context";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      localStorage.setItem("token", token);
      login(token);
      navigate("/dashboard", { replace: true });
    } else if (error) {
      navigate("/login", {
        replace: true,
        state: { error: "Authentication failed. Please try again." },
      });
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
