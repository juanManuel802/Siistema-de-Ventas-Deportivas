import { useState } from "react";
import { Login } from "./components/login";
import { Home } from "./components/home";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn ? <Home /> : <Login onLogin={() => setLoggedIn(true)} />;
}
