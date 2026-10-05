import { useState } from "react";
import api from "../services/api";

import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import SummaryCard from "../components/SummaryCard";
import RiskCard from "../components/RiskCard";
import ClauseCard from "../components/ClauseCard";
import RecommendationCard from "../components/RecommendationCard";
import ObligationsCard from "../components/ObligationsCard";
import DigitalTwinDashboard from "../components/DigitalTwinDashboard";
import ChatBox from "../components/ChatBox";
import DnaBackground from "../components/DnaBackground";

const FEATURES = [
    { icon: "🔍", title: "Smart Extraction", desc: "Obligations, parties & deadlines" },
    { icon: "⚡", title: "Risk Scoring", desc: "Instant legal risk assessment" },
    { icon: "🤖", title: "Digital Twin", desc: "Live interactive obligation map" },
    { icon: "💬", title: "AI Legal Chat", desc: "Ask anything about your contract" },
];

function Home() {
    const [summary, setSummary] = useState("");
    const [risk, setRisk] = useState("");
    const [clauses, setClauses] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [obligations, setObligations] = useState([]);
    const [digitalTwin, setDigitalTwin] = useState(null);
    const [obligationsError, setObligationsError] = useState(false);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [apiError, setApiError] = useState("");
    const [documentText, setDocumentText] = useState("");
    const [fileName, setFileName] = useState("");

    async function analyzeDocument(file) {
        setApiError("");
        if (file && file.name) setFileName(file.name);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadResponse = await api.post("/upload", formData);
            const text = uploadResponse.data.text;
            setDocumentText(text || "");

            const analyzeResponse = await api.post("/analyze", { text });
            const analysis = analyzeResponse.data.analysis;

            setSummary(analysis.summary || "");
            setRisk(analysis.risk || "");
            setClauses(analysis.important_clauses || analysis.clauses || []);
            setRecommendations(analysis.recommendations || []);

            if (analysis && Array.isArray(analysis.obligations)) {
                setObligations(analysis.obligations);
                setObligationsError(false);
            } else {
                setObligations([]);
                setObligationsError(false);
            }

            if (analysis && analysis.digital_twin) {
                setDigitalTwin(analysis.digital_twin);
            } else {
                setDigitalTwin(null);
            }

            setHasAnalyzed(true);
        } catch (err) {
            console.error("Analysis failed:", err);
            const msg = err.response?.data?.detail || err.message || "Failed to analyze document. Please check backend server status.";
            setApiError(msg);
        }
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--lt-surface)" }}>
            <Navbar />

            {/* ─── Hero Header ─── */}
            {!hasAnalyzed && (
                <div
                    className="lt-hero-bg"
                    style={{
                        position: "relative",
                        overflow: "hidden",
                        padding: "56px 24px 48px",
                        textAlign: "center",
                    }}
                >
                    {/* Animated White DNA Structures Background */}
                    <DnaBackground style={{ opacity: 0.85 }} />

                    {/* Background decorative circles */}
                    <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(201,168,76,0.06)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(26,45,109,0.35)", pointerEvents: "none" }} />

                    <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto" }}>
                        {/* Elevated Visual Pill */}
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "8px 20px",
                                borderRadius: "999px",
                                border: "1px solid rgba(240,193,80,0.5)",
                                background: "linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(17,29,74,0.7) 100%)",
                                boxShadow: "0 0 24px rgba(201,168,76,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                                backdropFilter: "blur(12px)",
                                fontSize: "0.74rem",
                                fontWeight: 800,
                                color: "#ffffff",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                marginBottom: "22px",
                                position: "relative",
                            }}
                        >
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: "#34d399",
                                    boxShadow: "0 0 8px #34d399",
                                }}
                            />
                            <span style={{ color: "#f0c150" }}>✨ Next-Gen Neural Legal Intelligence</span>
                            <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
                            <span style={{ color: "rgba(255,255,255,0.9)" }}>Enterprise Grade</span>
                        </div>

                        <h1
                            style={{
                                margin: "0 0 16px",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "clamp(2rem, 5vw, 3rem)",
                                fontWeight: 900,
                                color: "#ffffff",
                                lineHeight: 1.15,
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Lexi<span style={{ color: "#f0c150" }}>Twin</span>
                            <span style={{ display: "block", fontSize: "clamp(1rem, 2.5vw, 1.4rem)", fontWeight: 500, color: "rgba(255,255,255,0.7)", marginTop: "8px", letterSpacing: "0" }}>
                                AI Legal Analyze & Document Verification
                            </span>
                        </h1>

                        <p
                            style={{
                                margin: "0 auto 32px",
                                maxWidth: "520px",
                                fontSize: "0.95rem",
                                color: "rgba(255,255,255,0.65)",
                                lineHeight: 1.7,
                            }}
                        >
                            Upload any legal contract — instantly extract obligations, risks, clauses, and build a fully traceable interactive Digital Twin.
                        </p>

                        {/* Feature pills row */}
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
                            {FEATURES.map((f) => (
                                <div
                                    key={f.title}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "8px 16px",
                                        borderRadius: "10px",
                                        background: "rgba(255,255,255,0.07)",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        backdropFilter: "blur(6px)",
                                    }}
                                >
                                    <span style={{ fontSize: "1rem" }}>{f.icon}</span>
                                    <div style={{ textAlign: "left" }}>
                                        <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>{f.title}</p>
                                        <p style={{ margin: 0, fontSize: "0.65rem", color: "rgba(255,255,255,0.55)" }}>{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Main Content ─── */}
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
                <UploadBox onAnalyze={analyzeDocument} />

                {/* Error Alert */}
                {apiError && (
                    <div
                        style={{
                            marginTop: "20px",
                            padding: "14px 18px",
                            background: "#fef2f2",
                            border: "1px solid #fca5a5",
                            borderLeft: "4px solid #ef4444",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "0.85rem",
                            color: "#991b1b",
                        }}
                    >
                        <span style={{ fontSize: "1.1rem" }}>⚠️</span>
                        <div>
                            <strong>Analysis Error:</strong> {apiError}
                        </div>
                    </div>
                )}

                {/* ─── Analysis Results ─── */}
                {hasAnalyzed && (
                    <>
                        {/* Section divider */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                                margin: "36px 0 24px",
                            }}
                        >
                            <div style={{ height: "2px", flex: 1, background: "var(--lt-border)" }} />
                            <span
                                style={{
                                    padding: "6px 18px",
                                    borderRadius: "999px",
                                    background: "var(--lt-navy)",
                                    color: "#f0c150",
                                    fontSize: "0.72rem",
                                    fontWeight: 800,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                ⚖️ Analysis Results — {fileName}
                            </span>
                            <div style={{ height: "2px", flex: 1, background: "var(--lt-border)" }} />
                        </div>

                        {/* 2-col grid for top cards */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                                gap: "20px",
                            }}
                        >
                            <SummaryCard summary={summary} />
                            <RiskCard risk={risk} />
                            <ClauseCard clauses={clauses} />
                            <RecommendationCard recommendations={recommendations} />
                        </div>

                        {/* Digital Twin */}
                        {digitalTwin && (
                            <DigitalTwinDashboard
                                digitalTwin={digitalTwin}
                                contractText={documentText}
                                contractName={fileName}
                            />
                        )}

                        {/* Obligations */}
                        <ObligationsCard
                            obligations={obligations}
                            error={obligationsError}
                            hasAnalyzed={hasAnalyzed}
                        />

                        {/* Chat */}
                        <ChatBox documentText={documentText} fileName={fileName} />
                    </>
                )}
            </div>

            {/* ─── Footer ─── */}
            <footer
                style={{
                    marginTop: "60px",
                    padding: "24px",
                    background: "var(--lt-navy)",
                    textAlign: "center",
                    borderTop: "1px solid rgba(201,168,76,0.18)",
                }}
            >
                <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>
                    © 2026 <span style={{ color: "#f0c150", fontWeight: 700 }}>LexiTwin</span> — AI Legal Analyze & Document Verification Platform
                </p>
            </footer>
        </div>
    );
}

export default Home;