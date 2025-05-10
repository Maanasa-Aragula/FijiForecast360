import { useEffect } from "react";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const t = setTimeout(onFinish, 3000);
    return () => clearTimeout(t);
  }, [onFinish]);

  const icons = ["🌿", "⛅", "🛣️", "🏥", "👥"];

  return (
    <div
      className="
        fixed inset-0 h-screen w-screen z-50
        flex items-center justify-center
        bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]
        overflow-hidden
      "
    >
      {/* Floating Emoji Icons */}
      {icons.map((icon, idx) => (
        <span
          key={idx}
          className="absolute animate-floating"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: "35px",
            animationDelay: `${Math.random() * 3}s`,
          }}
        >
          {icon}
        </span>
      ))}

      {/* Centered & properly sized logo */}
      <img
        src="/icons/logo.webp"
        alt="FijiForecast360 Logo"
        className="
          z-10 animate-fade-in-out
          h-12 w-auto object-contain max-w-[300px]
        "
        onClick={onFinish}
      />
    </div>
  );
}
