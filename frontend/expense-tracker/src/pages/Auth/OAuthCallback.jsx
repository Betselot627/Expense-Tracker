import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      // For frontend-only, just treat code as token (not secure)
      window.opener.postMessage({ token: code }, window.location.origin);
    }
    navigate("/login");
  }, [searchParams, navigate]);

  return <div>Logging in...</div>;
};

export default OAuthCallback;