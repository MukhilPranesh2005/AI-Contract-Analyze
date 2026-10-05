function ObligationsCard({ obligations = [], error = false, hasAnalyzed = false }) {
    if (error) {
        return (
            <div className="lt-card" style={{ padding: "24px 28px", marginTop: "24px" }}>
                <p style={{ color: "var(--lt-danger)", fontSize: "0.875rem", margin: 0 }}>
                    ⚠️ Obligation extraction is currently unavailable.
                </p>
            </div>
        );
    }

    if (!hasAnalyzed) {
        return (
            <div className="lt-card" style={{ padding: "28px", marginTop: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #0b1437 0%, #1a2d6d 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📋</div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--lt-text-primary)", fontFamily: "'Inter', sans-serif" }}>Obligations & Responsibilities</h2>
                        <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--lt-text-muted)" }}>Party-level duty extraction</p>
                    </div>
                </div>
                <div style={{ height: "2px", width: "36px", background: "linear-gradient(90deg, #c9a84c, #f0c150)", borderRadius: "2px", marginBottom: "16px" }} />
                <div style={{ background: "var(--lt-surface-2)", borderRadius: "10px", padding: "20px", textAlign: "center", border: "1px dashed var(--lt-border)" }}>
                    <p style={{ margin: 0, fontSize: "0.825rem", color: "var(--lt-text-muted)" }}>Upload a contract to view extracted obligations and responsibilities.</p>
                </div>
            </div>
        );
    }

    if (!obligations || obligations.length === 0) {
        return (
            <div className="lt-card" style={{ padding: "28px", marginTop: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #0b1437 0%, #1a2d6d 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📋</div>
                    <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--lt-text-primary)", fontFamily: "'Inter', sans-serif" }}>Obligations & Responsibilities</h2>
                </div>
                <p style={{ margin: 0, fontSize: "0.825rem", color: "var(--lt-text-muted)" }}>No specific obligations were identified in this document.</p>
            </div>
        );
    }

    // Group by party
    const groupedByParty = obligations.reduce((acc, item) => {
        const partyKey = (item.party && item.party.trim()) ? item.party.trim() : "Not Specified";
        if (!acc[partyKey]) acc[partyKey] = [];
        acc[partyKey].push(item);
        return acc;
    }, {});

    return (
        <div className="lt-card lt-animate-fade-up" style={{ padding: "28px 32px", marginTop: "28px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #0b1437 0%, #1a2d6d 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                        📋
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--lt-text-primary)", fontFamily: "'Inter', sans-serif" }}>
                            Obligations & Responsibilities
                        </h2>
                        <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--lt-text-muted)", marginTop: "1px" }}>
                            {obligations.length} obligation{obligations.length !== 1 ? "s" : ""} across {Object.keys(groupedByParty).length} part{Object.keys(groupedByParty).length !== 1 ? "ies" : "y"}
                        </p>
                    </div>
                </div>
                <span
                    style={{
                        padding: "4px 12px",
                        borderRadius: "999px",
                        background: "rgba(11,20,55,0.07)",
                        border: "1px solid rgba(11,20,55,0.12)",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "var(--lt-navy-mid)",
                        letterSpacing: "0.04em",
                    }}
                >
                    {obligations.length} Duties Mapped
                </span>
            </div>

            <div style={{ height: "2px", width: "36px", background: "linear-gradient(90deg, #c9a84c, #f0c150)", borderRadius: "2px", marginBottom: "24px" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {Object.entries(groupedByParty).map(([party, partyObligations]) => (
                    <div key={party}>
                        {/* Party header row */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "14px",
                            }}
                        >
                            <span
                                style={{
                                    padding: "5px 14px",
                                    borderRadius: "8px",
                                    background: "var(--lt-navy)",
                                    color: "#f0c150",
                                    fontSize: "0.75rem",
                                    fontWeight: 800,
                                    letterSpacing: "0.04em",
                                    textTransform: "uppercase",
                                }}
                            >
                                👤 {party}
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "var(--lt-text-muted)", fontWeight: 500 }}>
                                {partyObligations.length} obligation{partyObligations.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gap: "12px",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            }}
                        >
                            {partyObligations.map((item, index) => {
                                const hasDeadline = item.deadline && item.deadline !== "Not specified";
                                const hasAmount = item.amount && item.amount !== "Not specified";

                                return (
                                    <div
                                        key={index}
                                        className="lt-card-interactive"
                                        style={{
                                            background: "var(--lt-white)",
                                            border: "1px solid var(--lt-border)",
                                            borderRadius: "12px",
                                            padding: "16px 18px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                            boxShadow: "0 1px 8px rgba(11,20,55,0.05)",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        {/* Obligation text */}
                                        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                                            <span style={{ color: "#0d9069", fontSize: "0.875rem", marginTop: "2px", flexShrink: 0 }}>✓</span>
                                            <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "var(--lt-text-primary)", lineHeight: 1.5 }}>
                                                {item.obligation || "Obligation details not specified"}
                                            </p>
                                        </div>

                                        {/* Metadata pills */}
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                            {hasAmount && (
                                                <span
                                                    style={{
                                                        padding: "3px 10px",
                                                        borderRadius: "6px",
                                                        background: "rgba(13,144,105,0.08)",
                                                        border: "1px solid rgba(13,144,105,0.2)",
                                                        fontSize: "0.72rem",
                                                        fontWeight: 700,
                                                        color: "#0d9069",
                                                    }}
                                                >
                                                    💰 {item.amount}
                                                </span>
                                            )}
                                            <span
                                                style={{
                                                    padding: "3px 10px",
                                                    borderRadius: "6px",
                                                    background: hasDeadline ? "rgba(11,20,55,0.06)" : "var(--lt-surface-2)",
                                                    border: `1px solid ${hasDeadline ? "rgba(11,20,55,0.14)" : "var(--lt-border)"}`,
                                                    fontSize: "0.72rem",
                                                    fontWeight: hasDeadline ? 700 : 500,
                                                    color: hasDeadline ? "var(--lt-navy)" : "var(--lt-text-muted)",
                                                    fontStyle: hasDeadline ? "normal" : "italic",
                                                }}
                                            >
                                                📅 {item.deadline || "No deadline specified"}
                                            </span>
                                        </div>

                                        {/* Source text */}
                                        {item.source_text && (
                                            <div
                                                style={{
                                                    background: "var(--lt-surface-2)",
                                                    border: "1px solid var(--lt-border)",
                                                    borderLeft: "3px solid #c9a84c",
                                                    borderRadius: "0 8px 8px 0",
                                                    padding: "8px 12px",
                                                    fontSize: "0.72rem",
                                                    color: "var(--lt-text-secondary)",
                                                    fontStyle: "italic",
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                "{item.source_text}"
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div
                                            style={{
                                                paddingTop: "8px",
                                                borderTop: "1px solid var(--lt-border)",
                                                fontSize: "0.7rem",
                                                color: "var(--lt-text-muted)",
                                            }}
                                        >
                                            {item.source_page ? `📄 Source: Page ${item.source_page}` : "📄 Page info unavailable"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ObligationsCard;
