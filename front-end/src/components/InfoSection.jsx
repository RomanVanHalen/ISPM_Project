// AwarenessSection.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/InfoSection.css";
import zxcvbn from "zxcvbn";

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const formatSeconds = (sec) => {
  if (!isFinite(sec) || sec < 0) return "Instantly";
  if (sec < 1) return `${(sec * 1000).toFixed(0)} ms`;
  const units = [
    ["yr", 31557600],
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
    ["s", 1],
  ];
  let rem = Math.floor(sec);
  const parts = [];
  for (const [label, size] of units) {
    const val = Math.floor(rem / size);
    if (val > 0) {
      parts.push(`${val}${label}`);
      rem -= val * size;
    }
    if (parts.length >= 2) break; // keep it short
  }
  return parts.length ? parts.join(" ") : "1s";
};

const scoreToLabel = ["Very Weak", "Weak", "Okay", "Strong", "Excellent"];

const AwarenessSection = () => {
  const [pwd, setPwd] = useState("");
  const [focused, setFocused] = useState(false);

  // evaluate with zxcvbn
  const result = useMemo(() => zxcvbn(pwd), [pwd]);

  // choose a crack-time scenario (realistic & educational)
  const crackSeconds =
    result.crack_times_seconds.offline_slow_hashing_1e4_per_second;

  // animate the displayed time
  const [animVal, setAnimVal] = useState(0);
  const prevTargetRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const from = prevTargetRef.current || 0;
    const to = crackSeconds;
    const duration = 700; // ms
    cancelAnimationFrame(rafRef.current);

    const tick = (t) => {
      const p = clamp((t - start) / duration, 0, 1);
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p; // ease in-out
      setAnimVal(from + (to - from) * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else {
        setAnimVal(to);
        prevTargetRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [crackSeconds]);

  const score = result.score; // 0..4
  const pct = ((score + 1) / 5) * 100;

  const suggestions = [
    result.feedback.warning && result.feedback.warning,
    ...result.feedback.suggestions,
  ].filter(Boolean);

  // extra actionable tips (beyond zxcvbn)
  const customTips = [];
  if (pwd && pwd.length < 12) customTips.push("Use at least 12–16 characters.");
  if (!/[A-Z]/.test(pwd)) customTips.push("Add an uppercase letter.");
  if (!/[a-z]/.test(pwd)) customTips.push("Add a lowercase letter.");
  if (!/[0-9]/.test(pwd)) customTips.push("Add a number.");
  if (!/[^A-Za-z0-9]/.test(pwd)) customTips.push("Add a symbol (!@#$…).");
  if (/^(.)\1{2,}/.test(pwd))
    customTips.push("Avoid repeated characters (e.g., aaa, 111).");
  if (/\s/.test(pwd)) customTips.push("Avoid spaces in passwords.");
  if (pwd && pwd.length >= 20 && score >= 3)
    customTips.push("Nice! Consider a passphrase you can remember.");

  return (
    <section className="cyber-awareness-section psc-section">
      <div className="psc-card">
        <h2 className="psc-title">Password Strength Challenge</h2>

        <label className="psc-label" htmlFor="psc-input">
          Enter a password to test
        </label>
        <div
          className={`psc-input-wrap ${
            focused ? "psc-input-wrap--focus" : ""
          }`}
        >
          <input
            id="psc-input"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Type here…"
            className="psc-input"
            autoComplete="new-password"
          />
        </div>

        <div className="psc-meter">
          <div className="psc-meter-track" aria-hidden />
          <div
            className={`psc-meter-fill psc-meter--s${score}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="psc-meta">
          <span className={`psc-badge psc-badge--s${score}`}>
            {scoreToLabel[score]}
          </span>
          <span className="psc-entropy">
            Entropy: {result.guesses_log10.toFixed(1)} log10 guesses
          </span>
        </div>

        <div className="psc-time">
          <div className="psc-time-label">Estimated crack time</div>
          <div className="psc-time-value">{formatSeconds(animVal)}</div>
          <div className="psc-time-sub">
            (offline slow hashing, ~10k guesses/sec)
          </div>
        </div>

        {(suggestions.length > 0 || customTips.length > 0) && (
          <div className="psc-tips">
            <div className="psc-tips-title">How to improve</div>
            <ul className="psc-tips-list">
              {suggestions.map((s, i) => (
                <li key={`sug-${i}`}>{s}</li>
              ))}
              {customTips.map((s, i) => (
                <li key={`ct-${i}`}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default AwarenessSection;
