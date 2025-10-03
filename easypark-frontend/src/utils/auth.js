// utils/auth.js

export const logout = () => {
  localStorage.removeItem("token");   // ✅ we're only using 'token' now
};

export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const jwt_decode = (await import("jwt-decode")).default;
    const decoded = jwt_decode(token);
    if (!decoded.exp) return false;
    if (Date.now() >= decoded.exp * 1000) return false;
    return true;
  } catch {
    return false;
  }
};
