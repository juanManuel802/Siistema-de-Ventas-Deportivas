import { useState } from "react";
import { Login } from "./components/login";
import { Home } from "./components/home";

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(
    sessionStorage.getItem("userId")
  );

  const handleLogin = (userId: string) => {
    sessionStorage.setItem("userId", userId);
    setCurrentUser(userId);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    setCurrentUser(null);
  };

  return currentUser ? (
    <Home userId={currentUser} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
