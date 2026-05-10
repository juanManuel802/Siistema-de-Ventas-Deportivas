import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
  "Running shoes",
  "Training jacket",
  "Football boots",
  "Classic sneakers",
];

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setActive(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search"
        value={value}
        onFocus={() => setActive(true)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-4 bg-[#f4f4f4] border border-transparent focus:border-black outline-none text-black placeholder:text-[#888]"
      />
      {active && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e5e5e5] z-50">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                onChange(s);
                setActive(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-[#f4f4f4] text-black border-b border-[#f0f0f0] last:border-b-0"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
