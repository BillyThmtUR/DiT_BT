import { useEffect, useState } from "react";

/* ====== Barre de progression de lecture ====== */
function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;

      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className="progress" style={{ width: `${progress}%` }} />;
}

export default ProgressBar;