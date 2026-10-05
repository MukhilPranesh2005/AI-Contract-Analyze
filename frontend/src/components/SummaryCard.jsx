function SummaryCard({ summary }) {
    return (
        <div
            className="lt-card lt-animate-fade-up"
            style={{ padding: "24px 28px" }}
        >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div
                    style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #0b1437 0%, #1a2d6d 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        flexShrink: 0,
                    }}
                >
                    📄
                </div>
                <div>
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            color: "var(--lt-text-primary)",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        Executive Summary
                    </h2>
                    <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--lt-text-muted)", marginTop: "1px" }}>
                        AI-extracted contract overview
                    </p>
                </div>
            </div>

            <div
                style={{
                    height: "2px",
                    width: "36px",
                    background: "linear-gradient(90deg, #c9a84c, #f0c150)",
                    borderRadius: "2px",
                    marginBottom: "16px",
                }}
            />

            {summary ? (
                <p
                    style={{
                        margin: 0,
                        fontSize: "0.875rem",
                        lineHeight: "1.75",
                        color: "var(--lt-text-secondary)",
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    {summary}
                </p>
            ) : (
                <div
                    style={{
                        background: "var(--lt-surface-2)",
                        borderRadius: "10px",
                        padding: "20px",
                        textAlign: "center",
                        border: "1px dashed var(--lt-border)",
                    }}
                >
                    <p style={{ margin: 0, fontSize: "0.825rem", color: "var(--lt-text-muted)" }}>
                        Upload a contract to generate the executive summary.
                    </p>
                </div>
            )}
        </div>
    );
}

export default SummaryCard;