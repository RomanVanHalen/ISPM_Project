import React, { useCallback, useEffect, useState } from "react";
import "../styles/Ddomain1.css";


const DEMO_EMAILS = [
  {
    id: 1,
    sender: "HR <hr@company-secure.com>",
    rawSender: "hr@company-secure.com",
    subject: "Urgent: Update your payroll info",
    preview: "Please update your payroll details immediately to avoid delay in your salary.",
    time: "09:12 AM",
    explanation:
      "Spoofed sender + external URL. Real HR would use internal domain and not ask for bank details via a link.",
    indicators: ["Sender spoofing", "External domain in link", "Sense of urgency"],
    isPhish: true,
  },
  {
    id: 2,
    sender: "IT Support <it-support@yourcompany.com>",
    rawSender: "it-support@yourcompany.com",
    subject: "Scheduled maintenance tonight",
    preview: "Routine maintenance at 11PM — no action required.",
    time: "08:50 AM",
    explanation: "Legitimate internal notification; no credential requests.",
    indicators: ["Internal domain", "No credential request"],
    isPhish: false,
  },
  {
    id: 3,
    sender: "Payroll <payroll@pay-roll.co>",
    rawSender: "payroll@pay-roll.co",
    subject: "Failed payment — update required",
    preview: "Your payroll deposit failed. Click here to verify your bank details.",
    time: "Yesterday",
    explanation: "Sender domain is suspicious (pay-roll.co) and asks for bank details.",
    indicators: ["Odd domain spelling", "Credential harvesting link"],
    isPhish: true,
  },
  {
    id: 4,
    sender: "LinkedIn <invitations@linkedin.com>",
    rawSender: "invitations@linkedin.com",
    subject: "2 people viewed your profile",
    preview: "See who viewed your profile — view now.",
    time: "Mon",
    explanation: "Typical notification from a known provider. Check link destination if unsure.",
    indicators: ["Known sender", "Promotional content"],
    isPhish: false,
  },
  {
    id: 5,
    sender: "CEO <ceo@company-secure.com>",
    rawSender: "ceo@company-secure.com",
    subject: "Can you process an urgent payment?",
    preview: "Hi — please send $3,200 to this vendor immediately. Use the attached invoice.",
    time: "Today",
    explanation:
      "Business Email Compromise style: unusual payment request from executive. Always verify through another channel.",
    indicators: ["Unusual request", "High urgency", "Attachment + payment instruction"],
    isPhish: true,
  },
];

export default function Ddomain1({
  fetchEmailsUrl = "/api/emails",
  submitBatchUrl = "/api/answers/batch",
  useBackend = false, // set to true to attempt real backend calls
}) {
  const [emails, setEmails] = useState([]);
  const [selected, setSelected] = useState(() => new Set());
  const [activeEmailId, setActiveEmailId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const loadEmails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!useBackend) {
        // use demo data so page never shows "Failed to load emails"
        setEmails(DEMO_EMAILS);
      } else {
        const res = await fetch(fetchEmailsUrl);
        if (!res.ok) throw new Error("Failed to load emails from backend");
        const data = await res.json();
        setEmails(Array.isArray(data) ? data : []);
      }
      setSelected(new Set());
      setSubmitted(false);
      setResults(null);
      setActiveEmailId(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error while loading emails.");
      // fallback to demo emails so user can still use the UI
      setEmails(DEMO_EMAILS);
    } finally {
      setLoading(false);
    }
  }, [fetchEmailsUrl, useBackend]);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  const toggleSelect = (id) => {
    if (submitted) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const submitAnswers = async () => {
    if (submitted) return;
    setLoading(true);
    setError(null);
    try {
      const attempts = emails.map((e) => ({
        emailId: e.id,
        userMarkedPhish: selected.has(e.id),
      }));

      if (!useBackend) {
        // Local grading (demo mode)
        const details = emails.map((e) => {
          const userMarked = selected.has(e.id);
          return {
            emailId: e.id,
            userMarked,
            correctMark: e.isPhish,
            explanation: e.explanation,
            indicators: e.indicators,
          };
        });
        const correct = details.reduce((acc, d) => acc + (d.userMarked === d.correctMark ? 1 : 0), 0);
        const payload = { total: emails.length, correct, details };
        setResults(payload);
        setSubmitted(true);
      } else {
        const res = await fetch(submitBatchUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attempts }),
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Submit failed");
        }
        const data = await res.json();
        setResults(data);
        setSubmitted(true);

        // merge explanations/indicators if returned
        if (Array.isArray(data.details)) {
          setEmails((prev) =>
            prev.map((e) => {
              const d = data.details.find((x) => x.emailId === e.id);
              if (d) return { ...e, explanation: d.explanation, indicators: d.indicators, isPhish: d.correctMark };
              return e;
            })
          );
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Submit error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelected(new Set());
    setSubmitted(false);
    setResults(null);
    setError(null);
    setActiveEmailId(null);
  };

  const activeEmail = emails.find((x) => x.id === activeEmailId) || null;

  return (
    <div className="dd1-container">
      <div className="dd1-card">
        <div className="dd1-grid">
          <aside className="dd1-inbox-col" aria-label="Inbox column">
            <div className="dd1-inbox-header">
              <h3>Inbox — Phishing Simulation</h3>
              <div className="dd1-meta">{loading ? "Loading..." : `${emails.length} emails`}</div>
            </div>

            {error && <div className="dd1-alert">Error: {error}</div>}

            <div className="dd1-list" role="list">
              {!emails.length && !loading ? (
                <div className="dd1-empty">No emails to show.</div>
              ) : (
                emails.map((e) => {
                  const isSelected = selected.has(e.id);
                  const active = activeEmailId === e.id;
                  return (
                    <button
                      key={e.id}
                      onClick={() => setActiveEmailId(e.id)}
                      className={`dd1-mail-item ${active ? "active" : ""}`}
                      aria-pressed={isSelected}
                    >
                      <input
                        aria-label={`Mark email "${e.subject}" as phishing`}
                        type="checkbox"
                        checked={isSelected}
                        onChange={(ev) => {
                          ev.stopPropagation();
                          toggleSelect(e.id);
                        }}
                        disabled={submitted}
                        className="dd1-checkbox"
                      />
                      <div className="dd1-mail-body">
                        <div className="dd1-mail-top">
                          <div className="dd1-sender" title={e.sender}>{e.sender}</div>
                          <div className="dd1-time">{e.time || ""}</div>
                        </div>
                        <div className="dd1-subject">{e.subject}</div>
                        <div className="dd1-preview">{e.preview}</div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="dd1-inbox-actions">
              <button className="dd1-btn primary" onClick={submitAnswers} disabled={submitted || loading}>
                Submit
              </button>
              <button className="dd1-btn ghost" onClick={reset}>
                Reset
              </button>
              <div className="dd1-score">{results ? `${results.correct}/${results.total}` : `0/${emails.length}`}</div>
            </div>

            <div className="dd1-tip">Tip: Hover links in real emails to preview the URL. When in doubt, verify via phone.</div>
          </aside>

          <main className="dd1-preview-col" aria-live="polite">
            {!activeEmail ? (
              <div className="dd1-empty-preview">
                <div className="dd1-empty-title">Select an email to preview</div>
                <div className="dd1-empty-sub">Mark suspicious ones as <strong>Phishing</strong>.</div>
              </div>
            ) : (
              <section className="dd1-email-view" aria-label={`Email preview: ${activeEmail.subject}`}>
                <header className="dd1-email-header">
                  <div>
                    <div className="dd1-label">From</div>
                    <div className="dd1-from">{activeEmail.sender}</div>
                    <div className="dd1-raw">{activeEmail.rawSender || ""}</div>
                  </div>
                  <div className="dd1-email-meta">
                    <div className="dd1-time-large">{activeEmail.time || ""}</div>
                  </div>
                </header>

                <article className="dd1-email-body">
                  <h4 className="dd1-email-subject">{activeEmail.subject}</h4>
                  <p className="dd1-email-preview">{activeEmail.preview}</p>

                  <div className="dd1-actions-row">
                    <button
                      onClick={() => toggleSelect(activeEmail.id)}
                      className={`dd1-btn ${selected.has(activeEmail.id) ? "danger" : "outline"}`}
                      disabled={submitted}
                    >
                      {selected.has(activeEmail.id) ? "Marked as Phish" : "Mark as Phish"}
                    </button>

                    {!submitted && (
                      <button
                        className="dd1-btn ghost"
                        onClick={() => {
                          const hints = (activeEmail.indicators || []).join(", ") || "No quick indicators provided.";
                          alert(`Look for: ${hints}\n\nTip: Hover links to check real URLs and verify via a different channel.`);
                        }}
                      >
                        Show Indicators
                      </button>
                    )}

                    {submitted && results && (
                      <div className={`dd1-result-badge ${activeEmail.isPhish ? "bad" : "good"}`}>
                        {activeEmail.isPhish ? "Phishing — Explanation shown" : "Legitimate"}
                      </div>
                    )}
                  </div>

                  {submitted && results && (
                    <div className="dd1-explanation">
                      <div className="dd1-ex-title">Why:</div>
                      <div className="dd1-ex-text">{activeEmail.explanation || "No explanation available."}</div>
                      {activeEmail.indicators && activeEmail.indicators.length > 0 && (
                        <div className="dd1-indicators">Indicators: {activeEmail.indicators.join(" • ")}</div>
                      )}
                    </div>
                  )}

                  <div className="dd1-quick-actions">
                    <button className="dd1-qa">Verify by phone</button>
                    <button className="dd1-qa">Check sender domain</button>
                    <button className="dd1-qa">Report</button>
                  </div>
                </article>
              </section>
            )}

            {submitted && results && (
              <aside className="dd1-results-panel" aria-label="Results summary">
                <div className="dd1-results-top">
                  <div>
                    <div className="dd1-small">Module Results</div>
                    <div className="dd1-large">{results.correct}/{results.total} correct</div>
                  </div>
                  <div>
                    <button
                      className="dd1-btn outline"
                      onClick={() => {
                        const breakdown = results.details
                          .map((d) => `#${d.emailId} — You: ${d.userMarked ? "Phish" : "Legit"} | Actual: ${d.correctMark ? "Phish" : "Legit"}`)
                          .join("\n");
                        alert(breakdown + "\n\nOpen emails for detailed explanations.");
                      }}
                    >
                      View Breakdown
                    </button>
                  </div>
                </div>

                <div className="dd1-results-list">
                  {results.details.map((d) => (
                    <div key={d.emailId} className="dd1-result-row">
                      <div className="dd1-result-id">#{d.emailId}</div>
                      <div className="dd1-result-text">
                        You: <strong>{d.userMarked ? "Phish" : "Legit"}</strong> • Actual: <strong>{d.correctMark ? "Phish" : "Legit"}</strong>
                        <div className="dd1-result-ex">{d.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
