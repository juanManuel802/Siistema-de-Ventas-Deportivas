import { useState } from "react";
import { Login } from "./components/login";
import { Home } from "./components/home";

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  return currentUser ? (
    <Home userId={currentUser} onLogout={() => setCurrentUser(null)} />
  ) : (
    <Login onLogin={(userId) => setCurrentUser(userId)} />
  );
}
