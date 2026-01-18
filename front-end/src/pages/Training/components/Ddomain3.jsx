import React, { useState, useEffect } from 'react';
import '../styles/Ddomain3.css';
import Navbar from '../../../components/Navbar'; 
import Footer2 from '../../../components/Footer2'; 

const sampleEmails = [
  {
    id: 1,
    sender: 'IT Support',
    senderEmail: 'support@yourcompany.com',
    subject: 'Required: Password Reset for Your Account',
    body: `Dear Employee,

This is a mandatory password reset for all company accounts. Please click the link below to reset your password within the next 24 hours.

Reset Password: https://portal.yourcompany.com/reset

If you have any questions, please contact the IT Help Desk.

Best regards,
IT Support Team`,
    timestamp: '09:42 AM',
    date: 'Today',
    isPhishing: false,
    read: false,
    explanation: 'This is a legitimate email from your IT department with a valid company domain.'
  },
  {
    id: 2,
    sender: 'Amazon Security',
    senderEmail: 'noreply@amazon-security.com',
    subject: 'URGENT: Suspicious Activity Detected on Your Account',
    body: `Dear Amazon Customer,

We detected unusual login activity from an unrecognized device. Your account may be compromised.

Click here immediately to verify your account:
http://amazon-security-verify.com/account-check

If this wasn't you, please secure your account now.

Sincerely,
Amazon Security Team`,
    timestamp: 'Yesterday, 03:15 PM',
    date: 'Yesterday',
    isPhishing: true,
    read: false,
    explanation: 'Phishing attempt: Suspicious domain (amazon-security-verify.com), urgent language, and fake Amazon sender address.'
  },
  {
    id: 3,
    sender: 'Payroll Department',
    senderEmail: 'payroll@yourcompany.com',
    subject: 'New Payslip Available for Download',
    body: `Hello,

Your payslip for the current period is now available in the employee portal.

You can access it at: https://hr.yourcompany.com/payslips

Please download it at your earliest convenience.

Thank you,
Payroll Department`,
    timestamp: 'Mon, 10:30 AM',
    date: 'Monday',
    isPhishing: false,
    read: false,
    explanation: 'Legitimate internal email with proper company domain and normal business communication.'
  },
  {
    id: 4,
    sender: 'Microsoft Account Team',
    senderEmail: 'account-security@microsoft-support.net',
    subject: 'IMPORTANT: Your Account Will Be Suspended',
    body: `URGENT ACTION REQUIRED!

We detected multiple failed login attempts. Your Microsoft account will be suspended in 24 hours unless you verify your identity.

Verify now: http://microsoft-verification-center.com/secure

Do not ignore this warning.

Microsoft Security Center`,
    timestamp: 'Sun, 08:45 PM',
    date: 'Sunday',
    isPhishing: true,
    read: false,
    explanation: 'Phishing attempt: Fake Microsoft domain, threatening language, and urgent action demands.'
  },
  {
    id: 5,
    sender: 'HR Department',
    senderEmail: 'hr@yourcompany.com',
    subject: 'Mandatory Security Training Completion',
    body: `Dear Team Member,

This is a reminder to complete the quarterly security awareness training by end of week.

Access the training here: https://training.yourcompany.com/security

Completion is mandatory for all employees.

Best,
HR Department`,
    timestamp: 'Fri, 02:20 PM',
    date: 'Friday',
    isPhishing: false,
    read: false,
    explanation: 'Legitimate HR communication with proper internal links and professional tone.'
  }
];

const PhishingSimulator = () => {
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [userEmail] = useState('john.doe@company.com');
  const [view, setView] = useState('inbox'); // 'inbox' or 'email'

  useEffect(() => {
    // Shuffle emails for variety
    const shuffledEmails = [...sampleEmails].sort(() => Math.random() - 0.5);
    setEmails(shuffledEmails);
  }, []); // Empty dependency array is now safe since sampleEmails is constant

  const handleEmailClick = (email) => {
    setCurrentEmail(email);
    setView('email');
    
    // Mark as read
    setEmails(prev => prev.map(e => 
      e.id === email.id ? { ...e, read: true } : e
    ));
  };

  const handleAnswer = (isPhishingGuess) => {
    const isCorrect = isPhishingGuess === currentEmail.isPhishing;

    if (isCorrect) {
      setScore(score + 1);
    }

    setTotalAnswered(totalAnswered + 1);

    // Move to next email or end game
    const currentIndex = emails.findIndex(e => e.id === currentEmail.id);
    if (currentIndex < emails.length - 1) {
      setCurrentEmail(emails[currentIndex + 1]);
      setEmails(prev => prev.map((e, idx) => 
        idx === currentIndex + 1 ? { ...e, read: true } : e
      ));
    } else {
      setGameCompleted(true);
      saveScoreToAPI(score + (isCorrect ? 1 : 0), emails.length);
    }
  };

  // ✅ Updated API call
  const saveScoreToAPI = async (finalScore, totalQuestions) => {
    try {
      const token = localStorage.getItem("token"); // make sure you store token at login

      const response = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,   //required for authMiddleware
        },
        body: JSON.stringify({
          score: finalScore,
          total: totalQuestions,
          module: "Phishing Awareness"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save score");
      }

      console.log("Score saved successfully");
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  // ✅ Mark training complete in backend
  const markTrainingComplete = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/progress/complete-training", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ moduleName: "module3" }), // adjust module name
      });
      console.log("Training marked as complete in backend");
    } catch (err) {
      console.error("Failed to mark training as complete:", err);
    }
  };

  // ✅ When game completes → mark training complete
  useEffect(() => {
    if (gameCompleted) {
      markTrainingComplete();
    }
  }, [gameCompleted]);

  const restartGame = () => {
    const shuffledEmails = [...sampleEmails].sort(() => Math.random() - 0.5);
    setEmails(shuffledEmails);
    setCurrentEmail(null);
    setScore(0);
    setTotalAnswered(0);
    setGameCompleted(false);
    setView('inbox');
  };

  const progress = ((totalAnswered) / emails.length) * 100;

  if (gameCompleted) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="content-wrapper">
          <div className="phishing-simulator">
            <div className="email-client">
              <div className="email-header">
                <h1>Phishing Awareness Simulator</h1>
                <div className="user-info">
                  <span>{userEmail}</span>
                </div>
              </div>
              
              <div className="results-container">
                <div className="results-card">
                  <h2>Simulation Complete!</h2>
                  <div className="final-score">
                    Your Score: {score} out of {emails.length}
                  </div>
                  <div className="percentage">
                    {Math.round((score / emails.length) * 100)}%
                  </div>
                  
                  <div className="performance-feedback">
                    {score === emails.length ? (
                      <p>Perfect! You're a phishing detection expert! 🎯</p>
                    ) : score >= emails.length * 0.7 ? (
                      <p>Great job! You have good phishing awareness. 👍</p>
                    ) : score >= emails.length * 0.5 ? (
                      <p>Not bad, but there's room for improvement. 📚</p>
                    ) : (
                      <p>Consider taking additional security training. 🛡️</p>
                    )}
                  </div>

                  <button className="btn-restart" onClick={restartGame}>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer2 />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="content-wrapper">
        <div className="phishing-simulator">
          <div className="email-client">
            <div className="email-header">
              <h1>Phishing Awareness Simulator</h1>
              <div className="user-info">
                <span>{userEmail}</span>
                <div className="score-display">Score: {score}/{totalAnswered}</div>
              </div>
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="email-layout">
              {/* Sidebar */}
              <div className="email-sidebar">
                <div className="sidebar-item active">
                  <span className="icon">📥</span>
                  Inbox ({emails.length})
                </div>
                <div className="sidebar-item">
                  <span className="icon">📤</span>
                  Sent
                </div>
                <div className="sidebar-item">
                  <span className="icon">📝</span>
                  Drafts
                </div>
                <div className="sidebar-item">
                  <span className="icon">🗑️</span>
                  Trash
                </div>
              </div>

              {/* Email List */}
              <div className="email-list-container">
                {view === 'inbox' && (
                  <div className="email-list">
                    <div className="email-list-header">
                      <h2>Inbox</h2>
                      <div className="email-count">{emails.length} emails</div>
                    </div>
                    
                    <div className="emails">
                      {emails.map((email) => (
                        <div 
                          key={email.id}
                          className={`email-item ${email.read ? 'read' : 'unread'} ${currentEmail?.id === email.id ? 'selected' : ''}`}
                          onClick={() => handleEmailClick(email)}
                        >
                          <div className="email-checkbox">
                            <input type="checkbox" />
                          </div>
                          <div className="email-sender">
                            {!email.read && <span className="unread-dot"></span>}
                            {email.sender}
                          </div>
                          <div className="email-preview">
                            <span className="email-subject">{email.subject}</span>
                            <span className="email-snippet"> - {email.body.substring(0, 60)}...</span>
                          </div>
                          <div className="email-time">{email.timestamp}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email View */}
                {view === 'email' && currentEmail && (
                  <div className="email-view">
                    <div className="email-view-header">
                      <button className="back-button" onClick={() => setView('inbox')}>
                        ← Back to Inbox
                      </button>
                      <h2>{currentEmail.subject}</h2>
                    </div>

                    <div className="email-details">
                      <div className="email-from">
                        <strong>From:</strong> {currentEmail.sender} &lt;{currentEmail.senderEmail}&gt;
                      </div>
                      <div className="email-to">
                        <strong>To:</strong> {userEmail}
                      </div>
                      <div className="email-date">
                        <strong>Date:</strong> {currentEmail.date} at {currentEmail.timestamp}
                      </div>
                    </div>

                    <div className="email-content">
                      <pre>{currentEmail.body}</pre>
                    </div>

                    <div className="email-actions">
                      <p>Is this email legitimate or a phishing attempt?</p>
                      <div className="decision-buttons">
                        <button 
                          className="btn-legit"
                          onClick={() => handleAnswer(false)}
                        >
                          ✓ Legitimate Email
                        </button>
                        <button 
                          className="btn-phishing"
                          onClick={() => handleAnswer(true)}
                        >
                          ✗ Phishing Attempt
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer2 />
    </div>
  );
};

export default PhishingSimulator;

