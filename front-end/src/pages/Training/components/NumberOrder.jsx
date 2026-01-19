// src/components/NumberOrder.jsx (NeeraNumberOrdering)
import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NumberOrder.css";

export default function NeeraNumberOrdering({ onFinish, onComplete }) {
  const navigate = useNavigate();

  const steps = useMemo(() => [
    "Collect service and financial records",
    "Document processes",
    "Review findings against ISO standards",
    "Report gaps to leadership",
  ], []);

  const correctPositions = steps.reduce((acc, _, i) => { acc[i] = i + 1; return acc; }, {});

  const [values, setValues] = useState(() => steps.map(() => ""));
  const [showChecks, setShowChecks] = useState(false);
  const [result, setResult] = useState(null); // "correct" | "incorrect" | "invalid" | null
  const [message, setMessage] = useState("");

  const resetAll = useCallback(() => {
    setValues(steps.map(() => ""));
    setShowChecks(false);
    setResult(null);
    setMessage("");
  }, [steps]);

  const showAnswer = () => {
    setValues(steps.map((_, i) => String(i + 1)));
    setShowChecks(true);
    setResult("correct");
    setMessage("This is the correct order.");
  };

  const onChangeVal = (i, raw) => {
    const digit = (raw || "").replace(/[^\d]/g, "").slice(0, 1);
    let val = digit;
    if (val && !/[1-4]/.test(val)) val = "";

    const next = [...values];
    next[i] = val;
    setValues(next);
    setShowChecks(false);
    setResult(null);
    setMessage("");
  };

  const checkOrder = () => {
    const filled = values.every((v) => /[1-4]/.test(v));
    const unique = new Set(values).size === 4;

    if (!filled || !unique) {
      setShowChecks(false);
      setResult("invalid");
      setMessage(!filled
        ? "Please assign a number 1–4 to every step."
        : "Each number 1–4 can be used only once (no duplicates).");
      return;
    }

    const allCorrect = values.every((v, idx) => Number(v) === correctPositions[idx]);
    setShowChecks(true);
    setResult(allCorrect ? "correct" : "incorrect");
    setMessage(allCorrect
      ? " Correct! This is the right sequence."
      : " Not quite. Adjust the numbers and try again.");
  };

  const handleFinish = () => {
    if (!result || result === "invalid") return; // require a valid check first
    const correct = result === "correct" ? 1 : 0;
    onFinish?.({ correct, total: 1 });
    onComplete?.(); // advance parent to summary
  };

  return (
    <div className="neera-no-wrap">
     
      <header className="neera-no-header">
        <div>
          <h2 className="neera-no-title">Sequence Ordering</h2>
          <p className="neera-no-subtitle">
            Type the correct position <strong>(1–4)</strong> next to each step, then <strong>Check Order</strong>.
          </p>
        </div>
        <div className="neera-no-actionsTop">
          <button className="neera-no-btn neera-no-btn--ghost" onClick={resetAll}>Reset</button>
          <button className="neera-no-btn" onClick={checkOrder}>Check Order</button>
          <button className="neera-no-btn neera-no-btn--alt" onClick={showAnswer}>Show Answer</button>
        </div>
      </header>

      {result && (
        <div
          className={`neera-no-result ${
            result === "correct" ? "neera-no-result--ok"
            : result === "invalid" ? "neera-no-result--warn"
            : "neera-no-result--bad"
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      )}

      <form
        className="neera-no-list"
        onSubmit={(e) => { e.preventDefault(); checkOrder(); }}
      >
        {steps.map((txt, i) => {
          const expected = correctPositions[i];
          const valNum = Number(values[i]);
          const showOk = showChecks && valNum === expected;
          const showBad = showChecks && valNum !== expected;

          return (
            <div
              key={txt}
              className={[
                "neera-no-item",
                showOk ? "neera-no-item--ok" : "",
                showBad ? "neera-no-item--bad" : "",
              ].join(" ")}
            >
              <label htmlFor={`neera-no-input-${i}`} className="neera-no-label">{txt}</label>
              <input
                id={`neera-no-input-${i}`}
                className="neera-no-input"
                inputMode="numeric"
                pattern="[1-4]"
                placeholder="1–4"
                value={values[i]}
                onChange={(e) => onChangeVal(i, e.target.value)}
                aria-label={`Order for: ${txt}`}
                maxLength={1}
              />
              <span className="neera-no-help">{showChecks ? (showOk ? "✓" : "✗") : " "}</span>
            </div>
          );
        })}

        <div className="neera-no-actionsBottom">
          <button type="submit" className="neera-no-btn neera-no-btn--primary">Check Order</button>
          <button
            type="button"
            className="neera-no-btn neera-no-btn--primary"
            disabled={!result || result === "invalid"}
            onClick={handleFinish}
            style={{ marginLeft: "0.5rem" }}
          >
            Finish
          </button>
        </div>
      </form>
    </div>
  );
}
