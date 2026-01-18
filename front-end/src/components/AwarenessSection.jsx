import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLock,
  FaShieldAlt,
  FaFileAlt,
  FaWifi,
  FaUserShield,
  FaMobileAlt,
} from "react-icons/fa";
import "../styles/AwarenessSection.css";
import TokenCard from "./TokenCards"; // import token card

//import images
import passwordImg from "../images/Password.png";
import phishingImg from "../images/phishing.png";
import sensitiveImg from "../images/sensitive-data.png";
import wifiImg from "../images/wifi.jpg";
import multiImg from "../images/multifactor.png";
import updateImg from "../images/update.jpg";

const cards = [
  {
    id: 1,
    title: "Use Strong Passwords",
    short: "Create unique, complex passwords for all accounts",
    long: "Strong passwords are essential for protecting accounts. Use at least 12 characters, mix letters, numbers, and symbols, and never reuse passwords across multiple platforms.",
    icon: <FaLock />,
    image: passwordImg, // add your image path
  },
  {
    id: 2,
    title: "Avoid Phishing Emails",
    short: "Recognize and avoid suspicious email attempts",
    long: "Phishing emails trick you into sharing personal data. Always verify sender details, avoid clicking suspicious links, and never share confidential information via email.",
    icon: <FaShieldAlt />,
    image: phishingImg,
  },
  {
    id: 3,
    title: "Protect Sensitive Data",
    short: "Secure handling of confidential information",
    long: "Always encrypt sensitive files, restrict access to authorized users only, and avoid storing data on unsecured devices or public cloud services.",
    icon: <FaFileAlt />,
    image: sensitiveImg,
  },
  {
    id: 4,
    title: "Use Secure Wi-Fi",
    short: "Avoid public Wi-Fi or use a VPN when connecting",
    long: "Public Wi-Fi networks are unsafe. If you must connect, always use a VPN to encrypt your traffic and prevent attackers from intercepting your data.",
    icon: <FaWifi />,
    image: wifiImg,
  },
  {
    id: 5,
    title: "Enable Multi-Factor Authentication",
    short: "Add an extra layer of protection to your accounts",
    long: "MFA requires more than just a password. Even if someone steals your credentials, they won’t be able to access your account without the second authentication factor.",
    icon: <FaUserShield />,
    image: multiImg,
  },
  {
    id: 6,
    title: "Keep Software Updated",
    short: "Regularly update apps and devices to patch security flaws",
    long: "Outdated apps and devices may have vulnerabilities. Always install updates and security patches promptly to reduce your risk of cyberattacks.",
    icon: <FaMobileAlt />,
    image: updateImg,
  },
];

const AwarenessSection = () => {
  const [selected, setSelected] = useState(null);

  return (
    <section className="awareness">
      <h2>Stay Cyber Aware</h2>
      <p>
        Learn the best practices to protect your organization and yourself
        online.
      </p>

      <div className="awareness-images">
        {cards.map((card) => (
          <div
            key={card.id}
            className="awareness-card"
            onClick={() => setSelected(card)}
          >
            <div className="awareness-icon">{card.icon}</div>
            <h4>{card.title}</h4>
            <p>{card.short}</p>
          </div>
        ))}
      </div>

      {/* Modal Popup as TokenCard */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="semodal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="semodal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <TokenCard
                name={selected.title}
                type="[Cyber Awareness Token]"
                description={selected.long}
                image={selected.image} // ✅ dynamic per card
              />
              <button className="seclose-btn" onClick={() => setSelected(null)}>
                ✖ Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AwarenessSection;


