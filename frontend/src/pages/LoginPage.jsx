import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import DnaBackground from "../components/DnaBackground";

export default function LoginPage() {
    const { login, register, demoLogin, loading, error, setError } = useAuth();
    const [mode, setMode] = useState("login"); // 'login' | 'register'
    const [email, setEmail] = useState("demo@lexitwin.ai");
    const [password, setPassword] = useState("demo123");
    const [name, setName] = useState("Sarah Jenkins, Esq.");
    const [role, setRole] = useState("Senior Legal Counsel");
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");
        if (setError) setError("");

        if (!email || !password) {
            setLocalError("Please fill in all required fields.");
            return;
        }

        if (password.length < 6) {
            setLocalError("Password must be at least 6 characters.");
            return;
        }

        try {
            if (mode === "login") {
                await login(email, password);
            } else {
                if (!name.trim()) {
                    setLocalError("Please provide your full legal/professional name.");
                    return;
                }
                await register(name, email, password, role);
            }
        } catch (err) {
            setLocalError(err.message || "Authentication error occurred.");
        }
    };

    const handleQuickDemo = async (demoRole = "Senior Legal Counsel") => {
        setLocalError("");
        try {
            await demoLogin(demoRole);
        } catch (err) {
            setLocalError(err.message || "Failed to start demo session.");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #070d24 0%, #0b1437 40%, #111d4a 75%, #182860 100%)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                fontFamily: "'Inter', sans-serif",
                color: "#ffffff",
            }}
        >
            {/* Movable White DNA Structures Animation in Blue Background */}
            <DnaBackground style={{ opacity: 0.9 }} strandCount={2} particleCount={50} />

            {/* Glowing decorative ambient background blobs */}
            <div
                style={{
                    position: "absolute",
                    top: "-120px",
                    left: "15%",
                    width: "500px",
                    height: "500px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0) 70%)",
                    filter: "blur(60px)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-150px",
                    right: "10%",
                    width: "600px",
                    height: "600px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(30,107,184,0.2) 0%, rgba(30,107,184,0) 70%)",
                    filter: "blur(70px)",
                    pointerEvents: "none",
                }}
            />

            {/* Top Navigation Strip */}
            <header
                style={{
                    padding: "20px 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    zIndex: 10,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #c9a84c 0%, #f0c150 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            boxShadow: "0 0 20px rgba(201,168,76,0.4)",
                        }}
                    >
                        ⚖️
                    </div>
                    <div>
                        <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.4px" }}>
                            Lexi<span style={{ color: "#f0c150" }}>Twin</span>
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "rgba(201,168,76,0.85)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            Neural Legal Verification & Intelligence Platform
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                        style={{
                            padding: "6px 14px",
                            borderRadius: "999px",
                            border: "1px solid rgba(201,168,76,0.35)",
                            background: "rgba(201,168,76,0.1)",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: "#f0c150",
                            letterSpacing: "0.05em",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                        }}
                    >
                        🔒 Authorized Personnel Access Only
                    </span>
                </div>
            </header>

            {/* Main Auth Container */}
            <main
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 24px",
                    zIndex: 5,
                }}
            >
                <div
                    style={{
                        maxWidth: "1160px",
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                        gap: "36px",
                        alignItems: "center",
                    }}
                >
                    {/* Left Column: Visual Showcase & Brand Value */}
                    <div style={{ padding: "10px 16px" }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "6px 14px",
                                borderRadius: "999px",
                                background: "rgba(201,168,76,0.15)",
                                border: "1px solid rgba(201,168,76,0.4)",
                                color: "#f0c150",
                                fontSize: "0.75rem",
                                fontWeight: 800,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                marginBottom: "20px",
                            }}
                        >
                            ✨ Precision Legal AI & Verified Neural Engine
                        </div>

                        <h1
                            style={{
                                fontSize: "clamp(2rem, 3.8vw, 3rem)",
                                fontWeight: 900,
                                lineHeight: 1.18,
                                letterSpacing: "-0.8px",
                                margin: "0 0 18px",
                            }}
                        >
                            Intelligent Contract Auditing & <span style={{ color: "#f0c150", textShadow: "0 0 24px rgba(240,193,80,0.3)" }}>Live Digital Twins</span>
                        </h1>

                        <p
                            style={{
                                fontSize: "1rem",
                                lineHeight: 1.7,
                                color: "rgba(255,255,255,0.7)",
                                margin: "0 0 28px",
                            }}
                        >
                            Sign in to access your secure enterprise workspace. Instantly extract obligations, quantify legal liabilities, execute OCR scans, and interact with live contract graph models.
                        </p>

                        {/* Interactive Feature Highlights */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "28px" }}>
                            {[
                                { icon: "📊", title: "Risk Scoring Matrix", desc: "Automated liability & penalty detection" },
                                { icon: "🤖", title: "Live Digital Twin", desc: "Bidirectional clause obligation mapping" },
                                { icon: "🔍", title: "Neural OCR Vision", desc: "High-accuracy scanned image extraction" },
                                { icon: "🛡️", title: "Enterprise Security", desc: "SOC2 Type II & zero-retention privacy" },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "12px",
                                        padding: "14px",
                                        backdropFilter: "blur(8px)",
                                    }}
                                >
                                    <div style={{ fontSize: "1.3rem", marginBottom: "6px" }}>{item.icon}</div>
                                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#fff", marginBottom: "3px" }}>{item.title}</div>
                                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{item.desc}</div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Trust Seal */}
                        <div style={{ display: "flex", alignItems: "center", gap: "18px", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ color: "#34d399" }}>✓</span> End-to-End Encrypted
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ color: "#34d399" }}>✓</span> Real-Time Graph AI
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ color: "#34d399" }}>✓</span> Strict Client Isolation
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Premium Glassmorphic Auth Form */}
                    <div
                        style={{
                            background: "rgba(17, 29, 74, 0.75)",
                            border: "1px solid rgba(201,168,76,0.3)",
                            borderRadius: "24px",
                            padding: "36px 32px",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(201,168,76,0.12)",
                            backdropFilter: "blur(20px)",
                            position: "relative",
                        }}
                    >
                        {/* Mode Switcher Tabs */}
                        <div
                            style={{
                                display: "flex",
                                background: "rgba(7,13,36,0.6)",
                                padding: "4px",
                                borderRadius: "12px",
                                border: "1px solid rgba(255,255,255,0.08)",
                                marginBottom: "24px",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => { setMode("login"); setLocalError(""); }}
                                style={{
                                    flex: 1,
                                    padding: "10px 0",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    cursor: "pointer",
                                    background: mode === "login" ? "linear-gradient(135deg, #c9a84c, #f0c150)" : "transparent",
                                    color: mode === "login" ? "#070d24" : "rgba(255,255,255,0.7)",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                🔑 Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => { setMode("register"); setLocalError(""); }}
                                style={{
                                    flex: 1,
                                    padding: "10px 0",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    cursor: "pointer",
                                    background: mode === "register" ? "linear-gradient(135deg, #c9a84c, #f0c150)" : "transparent",
                                    color: mode === "register" ? "#070d24" : "rgba(255,255,255,0.7)",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                ✍️ Create Account
                            </button>
                        </div>

                        {/* Header text */}
                        <div style={{ marginBottom: "20px" }}>
                            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 6px", color: "#fff" }}>
                                {mode === "login" ? "Welcome back to LexiTwin" : "Create your LexiTwin Account"}
                            </h2>
                            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", margin: 0 }}>
                                {mode === "login"
                                    ? "Enter your credentials or click 1-Click Demo Login below."
                                    : "Register your professional account to unlock all features."}
                            </p>
                        </div>

                        {/* Error Notification */}
                        {(localError || error) && (
                            <div
                                style={{
                                    background: "rgba(239,68,68,0.15)",
                                    border: "1px solid #ef4444",
                                    borderRadius: "10px",
                                    padding: "10px 14px",
                                    color: "#fca5a5",
                                    fontSize: "0.8rem",
                                    marginBottom: "18px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <span>⚠️</span>
                                <span>{localError || error}</span>
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit}>
                            {mode === "register" && (
                                <>
                                    <div style={{ marginBottom: "14px" }}>
                                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: "6px" }}>
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Adv. Jonathan Vance"
                                            required
                                            style={{
                                                width: "100%",
                                                padding: "11px 14px",
                                                borderRadius: "10px",
                                                border: "1px solid rgba(255,255,255,0.15)",
                                                background: "rgba(7,13,36,0.6)",
                                                color: "#fff",
                                                fontSize: "0.9rem",
                                                outline: "none",
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: "14px" }}>
                                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: "6px" }}>
                                            Professional Role
                                        </label>
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "11px 14px",
                                                borderRadius: "10px",
                                                border: "1px solid rgba(255,255,255,0.15)",
                                                background: "#070d24",
                                                color: "#fff",
                                                fontSize: "0.9rem",
                                                outline: "none",
                                            }}
                                        >
                                            <option value="Senior Legal Counsel">Senior Legal Counsel</option>
                                            <option value="Compliance Officer">Compliance Officer</option>
                                            <option value="Contract Risk Analyst">Contract Risk Analyst</option>
                                            <option value="General Counsel">General Counsel</option>
                                            <option value="Corporate Paralegal">Corporate Paralegal</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Email Input */}
                            <div style={{ marginBottom: "14px" }}>
                                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: "6px" }}>
                                    Corporate / Professional Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "11px 14px",
                                        borderRadius: "10px",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        background: "rgba(7,13,36,0.6)",
                                        color: "#fff",
                                        fontSize: "0.9rem",
                                        outline: "none",
                                    }}
                                />
                            </div>

                            {/* Password Input */}
                            <div style={{ marginBottom: "22px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "rgba(201,168,76,0.9)",
                                            fontSize: "0.72rem",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "11px 14px",
                                        borderRadius: "10px",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        background: "rgba(7,13,36,0.6)",
                                        color: "#fff",
                                        fontSize: "0.9rem",
                                        outline: "none",
                                    }}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "13px 20px",
                                    borderRadius: "12px",
                                    border: "none",
                                    background: "linear-gradient(135deg, #c9a84c 0%, #f0c150 100%)",
                                    color: "#070d24",
                                    fontSize: "0.95rem",
                                    fontWeight: 800,
                                    cursor: loading ? "not-allowed" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    boxShadow: "0 6px 20px rgba(201,168,76,0.35)",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                {loading ? (
                                    <span>⏳ Authenticating...</span>
                                ) : mode === "login" ? (
                                    <span>🚀 Log In to Services</span>
                                ) : (
                                    <span>✨ Create Account & Proceed</span>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                margin: "22px 0 18px",
                            }}
                        >
                            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.1)" }} />
                            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                OR FAST ACCESS
                            </span>
                            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.1)" }} />
                        </div>

                        {/* Quick 1-Click Demo Login */}
                        <button
                            type="button"
                            onClick={() => handleQuickDemo("Senior Legal Counsel")}
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px 18px",
                                borderRadius: "12px",
                                border: "1px solid rgba(201,168,76,0.4)",
                                background: "rgba(201,168,76,0.12)",
                                color: "#f0c150",
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                cursor: loading ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <span>⚡ Instant 1-Click Guest Pass (Legal Counsel Demo)</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer
                style={{
                    padding: "18px 24px",
                    textAlign: "center",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.4)",
                }}
            >
                © 2026 <strong style={{ color: "#f0c150" }}>LexiTwin</strong> — AI Legal Analyze & Document Verification Platform. All rights reserved.
            </footer>
        </div>
    );
}
