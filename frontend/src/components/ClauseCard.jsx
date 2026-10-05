function ClauseCard({ clauses = [] }) {
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
                        background: "linear-gradient(135deg, #1a2d6d 0%, #0b1437 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        flexShrink: 0,
                    }}
                >
                    📑
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
                        Important Clauses
                    </h2>
                    <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--lt-text-muted)", marginTop: "1px" }}>
                        {clauses.length > 0 ? `${clauses.length} clause${clauses.length !== 1 ? "s" : ""} identified` : "Extracted key provisions"}
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

            {clauses.length === 0 ? (
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
                        No clauses identified yet. Upload a contract to extract key provisions.
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {clauses.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "10px",
                                padding: "12px 14px",
                                background: "var(--lt-surface-2)",
                                border: "1px solid var(--lt-border)",
                                borderRadius: "10px",
                                transition: "border-color 0.2s, background 0.2s",
                            }}
                        >
                            <span
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #0b1437, #1a2d6d)",
                                    color: "#f0c150",
                                    fontSize: "0.6rem",
                                    fontWeight: 800,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    marginTop: "1px",
                                }}
                            >
                                {index + 1}
                            </span>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "0.825rem",
                                    color: "var(--lt-text-secondary)",
                                    lineHeight: "1.55",
                                    fontFamily: "'Inter', sans-serif",
                                }}
                            >
                                {typeof item === "object" && item !== null
                                    ? (item.clause || item.title || item.text || item.description || JSON.stringify(item))
                                    : String(item)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ClauseCard;