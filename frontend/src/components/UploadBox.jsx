import { useState } from "react";
import { Link } from "react-router-dom";
import { SAMPLE_CONTRACTS } from "../services/mockDemoData";

function UploadBox({ onAnalyze }) {
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    async function handleSelectSample(sample) {
        setFileName(sample.filename);
        setLoading(true);
        // Create a synthetic file or pass text object
        const mockFile = new File([sample.text], sample.filename, { type: "application/pdf" });
        await onAnalyze(mockFile);
        setLoading(false);
    }

    async function handleChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        setLoading(true);
        await onAnalyze(file);
        setLoading(false);
    }

    function handleDragOver(e) {
        e.preventDefault();
        setIsDragging(true);
    }
    function handleDragLeave() {
        setIsDragging(false);
    }
    async function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        if (!file.name.match(/\.(pdf|docx)$/i)) {
            alert("Please upload a PDF or DOCX file.");
            return;
        }
        setFileName(file.name);
        setLoading(true);
        await onAnalyze(file);
        setLoading(false);
    }

    return (
        <div className="lt-card lt-animate-fade-up" style={{ padding: "32px 36px" }}>
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                    <h2
                        style={{
                            margin: 0,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "1.25rem",
                            fontWeight: 800,
                            color: "var(--lt-text-primary)",
                            letterSpacing: "-0.3px",
                        }}
                    >
                        Contract Intelligence Engine
                    </h2>
                    <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "var(--lt-text-muted)" }}>
                        Upload a legal contract to extract obligations, risks, clauses &amp; generate a Digital Twin
                    </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "5px 12px",
                            borderRadius: "999px",
                            background: "rgba(13,144,105,0.08)",
                            border: "1px solid rgba(13,144,105,0.25)",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#0d9069",
                            letterSpacing: "0.04em",
                        }}
                    >
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0d9069", display: "inline-block" }} />
                        AI Engine Active
                    </span>
                </div>
            </div>

            {/* Drop Zone */}
            <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: isDragging
                        ? "2px solid #c9a84c"
                        : loading
                        ? "2px dashed var(--lt-navy)"
                        : "2px dashed var(--lt-border)",
                    borderRadius: "14px",
                    padding: "40px 24px",
                    background: isDragging
                        ? "rgba(201,168,76,0.04)"
                        : loading
                        ? "rgba(11,20,55,0.02)"
                        : "var(--lt-surface-2)",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.25s",
                    textAlign: "center",
                    minHeight: "180px",
                    boxShadow: isDragging ? "0 0 20px rgba(201,168,76,0.15)" : "none",
                }}
            >
                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                        <div
                            style={{
                                width: "56px",
                                height: "56px",
                                borderRadius: "16px",
                                background: "linear-gradient(135deg, #0b1437 0%, #1a2d6d 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "24px",
                                animation: "lt-glow-pulse 1.5s ease-in-out infinite",
                            }}
                        >
                            🤖
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, color: "var(--lt-text-primary)", fontSize: "0.9rem" }}>
                                LexiTwin AI Analyzing...
                            </p>
                            <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "10px" }}>
                                <span className="lt-typing-dot" />
                                <span className="lt-typing-dot" />
                                <span className="lt-typing-dot" />
                            </div>
                            <p style={{ margin: "8px 0 0", fontSize: "0.75rem", color: "var(--lt-text-muted)" }}>
                                Extracting clauses, obligations & building Digital Twin
                            </p>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "18px",
                                background: "linear-gradient(135deg, #0b1437 0%, #1a2d6d 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "26px",
                                boxShadow: "0 4px 16px rgba(11,20,55,0.18)",
                            }}
                        >
                            📂
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, color: "var(--lt-text-primary)", fontSize: "0.9rem" }}>
                                {isDragging ? "Drop your contract here" : "Drop PDF or DOCX, or click to browse"}
                            </p>
                            <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "var(--lt-text-muted)" }}>
                                Supports PDF &amp; DOCX • Max 50MB • All data processed securely
                            </p>
                        </div>
                        <button
                            type="button"
                            className="lt-btn-gold"
                            style={{ marginTop: "4px", pointerEvents: "none" }}
                        >
                            <span>⬆</span> Browse Files
                        </button>
                    </div>
                )}
                <input
                    type="file"
                    accept=".pdf,.docx"
                    hidden
                    disabled={loading}
                    onChange={handleChange}
                />
            </label>

            {/* Uploaded file badge */}
            {fileName && !loading && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "16px",
                        padding: "10px 14px",
                        background: "rgba(13,144,105,0.06)",
                        border: "1px solid rgba(13,144,105,0.22)",
                        borderRadius: "10px",
                    }}
                >
                    <span style={{ fontSize: "1.1rem" }}>✅</span>
                    <div>
                        <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, color: "#0d9069" }}>
                            Document loaded & analyzed
                        </p>
                        <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--lt-text-muted)" }}>
                            {fileName}
                        </p>
                    </div>
                </div>
            )}

            {/* Sample Contracts Selector Bar */}
            <div
                style={{
                    marginTop: "20px",
                    padding: "12px 16px",
                    background: "var(--lt-surface-2)",
                    border: "1px solid var(--lt-border)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "0.85rem" }}>⚡</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--lt-text-primary)" }}>
                        Try Instant Demo Samples:
                    </span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {SAMPLE_CONTRACTS.map((sample) => (
                        <button
                            key={sample.id}
                            type="button"
                            disabled={loading}
                            onClick={() => handleSelectSample(sample)}
                            style={{
                                padding: "5px 12px",
                                borderRadius: "8px",
                                border: "1px solid rgba(201,168,76,0.3)",
                                background: "rgba(201,168,76,0.06)",
                                color: "var(--lt-navy)",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = "#c9a84c";
                                e.currentTarget.style.color = "#0b1437";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = "rgba(201,168,76,0.06)";
                                e.currentTarget.style.color = "var(--lt-navy)";
                            }}
                        >
                            <span>📑</span> {sample.name.replace(" (Sample)", "")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom hint bar */}
            <div
                style={{
                    marginTop: "16px",
                    paddingTop: "14px",
                    borderTop: "1px solid var(--lt-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px",
                }}
            >
                <span style={{ fontSize: "0.75rem", color: "var(--lt-text-muted)" }}>
                    Have a scanned image or photo of a contract?
                </span>
                <Link
                    to="/ocr"
                    style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--lt-navy)",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "5px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--lt-border)",
                        background: "var(--lt-surface-2)",
                        transition: "border-color 0.2s",
                    }}
                >
                    🔍 Use OCR Extractor →
                </Link>
            </div>
        </div>
    );
}

export default UploadBox;