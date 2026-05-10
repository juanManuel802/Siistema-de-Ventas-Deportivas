import { useState } from "react";

export function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin();
        }}
        className="flex flex-col gap-6 w-full max-w-sm px-8"
      >
        <div className="text-center tracking-widest text-black mb-4">BRAND</div>
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
          SIGN IN
        </button>
      </form>
    </div>
  );
}
