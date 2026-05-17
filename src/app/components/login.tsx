import { useState } from "react";
import { USERS } from "../../data/users";

export function Login({ onLogin }: { onLogin: (userId: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen w-full flex">
      {/* Left half — background image with dark overlay */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80"
          alt="Athlete in motion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Right half — form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const match = USERS.find(
              (u) => u.username === username && u.password === password,
            );
            if (match) {
              setError("");
              onLogin(match.id);
            } else {
              setError("Usuario o contraseña incorrectos");
            }
          }}
          className="flex flex-col gap-6 w-full max-w-sm px-8"
        >
          <div>
            <div className="text-3xl tracking-widest text-black font-bold">Unillanos Sport Store</div>
            <p className="text-sm text-gray-400 mt-1">Tu deporte. Tu perfil.</p>
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-12 px-4 bg-[#f4f4f4] border border-transparent focus:border-black outline-none text-black placeholder:text-[#888]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 px-4 bg-[#f4f4f4] border border-transparent focus:border-black outline-none text-black placeholder:text-[#888]"
          />
          <button
            type="submit"
            className="h-12 bg-black text-white hover:bg-[#222] transition-colors tracking-wider"
          >
            Iniciar Sesión
          </button>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}
