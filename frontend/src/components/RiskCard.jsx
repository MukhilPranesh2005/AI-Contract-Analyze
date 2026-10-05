function RiskCard({ risk }) {
    const riskKey = risk?.toLowerCase() || "none";

    const riskConfig = {
        low: {
            label: "Low Risk",
            color: "#166534",
            bg: "#f0fdf4",
            border: "#86efac",
            bar: "#22c55e",
            barWidth: "28%",
            icon: "✅",
            description: "Contract is well-structured with minimal legal exposure.",
        },
        medium: {
            label: "Medium Risk",
            color: "#92400e",
            bg: "#fffbeb",
            border: "#fcd34d",
            bar: "#f59e0b",
            barWidth: "58%",
            icon: "⚡",
            description: "Some clauses warrant review before execution.",
        },
        high: {
            label: "High Risk",
            color: "#9a3412",
            bg: "#fff7ed",
            border: "#fdba74",
            bar: "#f97316",
            barWidth: "80%",
            icon: "⚠️",
            description: "Significant risk exposure — legal review strongly advised.",
        },
        critical: {
            label: "Critical Risk",
            color: "#991b1b",
            bg: "#fef2f2",
            border: "#fca5a5",
            bar: "#ef4444",
            barWidth: "100%",
            icon: "🚨",
            description: "Immediate legal counsel required before proceeding.",
        },
    };

    const config = riskConfig[riskKey] || {
        label: risk || "Awaiting Analysis",
        color: "var(--lt-text-muted)",
        bg: "var(--lt-surface-2)",
        border: "var(--lt-border)",
        bar: "var(--lt-border)",
        barWidth: "0%",
        icon: "📊",
        description: "Upload a contract to assess risk exposure.",
    };

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
                        background: "linear-gradient(135deg, #c9a84c 0%, #f0c150 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        flexShrink: 0,
                    }}
                >
                    ⚠️
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
                        Risk Assessment
                    </h2>
                    <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--lt-text-muted)", marginTop: "1px" }}>
                        Legal exposure scoring
                    </p>
                </div>
            </div>

            <div
                style={{
                    height: "2px",
                    width: "36px",
                    background: "linear-gradient(90deg, #c9a84c, #f0c150)",
                    borderRadius: "2px",
                    marginBottom: "20px",
                }}
            />

            {/* Risk Badge */}
            <div
                style={{
                    background: config.bg,
                    border: `1px solid ${config.border}`,
                    borderRadius: "12px",
                    padding: "16px 20px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "1.5rem" }}>{config.icon}</span>
                        <div>
                            <p style={{ margin: 0, fontSize: "0.7rem", color: config.color, fontWeight: 600, opacity: 0.75, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                                Contract Risk
                            </p>
                            <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: config.color, fontFamily: "'Inter', sans-serif" }}>
                                {config.label}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Risk bar */}
                <div
                    style={{
                        height: "6px",
                        background: "rgba(0,0,0,0.06)",
                        borderRadius: "3px",
                        overflow: "hidden",
                        marginBottom: "10px",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: config.barWidth,
                            background: config.bar,
                            borderRadius: "3px",
                            transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
                        }}
                    />
                </div>

                <p style={{ margin: 0, fontSize: "0.78rem", color: config.color, opacity: 0.85, lineHeight: 1.5 }}>
                    {config.description}
                </p>
            </div>
        </div>
    );
}

export default RiskCard;