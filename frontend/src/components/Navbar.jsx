import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const location = useLocation();
    const { user, logout, isAuthenticated } = useAuth();
    const isHome = location.pathname === "/" || location.pathname === "/analysis";
    const isDigitalTwin = location.pathname === "/digital-twin";
    const isOcr = location.pathname === "/ocr";

    const links = [
        {
            to: "/",
            active: isHome,
            icon: "📄",
            label: "Document Analyzer",
        },
        {
            to: "/digital-twin",
            active: isDigitalTwin,
            icon: "🤖",
            label: "Contract Digital Twin",
            badge: { text: "Live Twin", color: "gold" },
        },
        {
            to: "/ocr",
            active: isOcr,
            icon: "🔍",
            label: "OCR Extractor",
            badge: { text: "Neural Vision", color: "navy" },
        },
    ];

    return (
        <nav
            style={{
                background: "linear-gradient(98deg, #070d24 0%, #0b1437 50%, #111d4a 100%)",
                borderBottom: "1px solid rgba(201,168,76,0.22)",
                position: "sticky",
                top: 0,
                zIndex: 50,
                boxShadow: "0 4px 28px 0 rgba(7,13,36,0.45)",
                backdropFilter: "blur(12px)",
            }}
        >
            <div
                style={{
                    maxWidth: "1320px",
                    margin: "0 auto",
                    padding: "0 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: "68px",
                    gap: "16px",
                    flexWrap: "wrap",
                }}
            >
                {/* ─── Brand Mark ─── */}
                <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* Logo mark */}
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "11px",
                            background: "linear-gradient(135deg, #c9a84c 0%, #f0c150 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            flexShrink: 0,
                            boxShadow: "0 0 18px rgba(201,168,76,0.35)",
                        }}
                    >
                        ⚖️
                    </div>
                    <div>
                        <div
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "1.2rem",
                                fontWeight: 850,
                                color: "#ffffff",
                                lineHeight: 1.15,
                                letterSpacing: "-0.4px",
                            }}
                        >
                            Lexi<span style={{ color: "#f0c150" }}>Twin</span>
                        </div>
                        <div
                            style={{
                                fontSize: "0.64rem",
                                color: "rgba(201,168,76,0.85)",
                                fontWeight: 600,
                                letterSpacing: "0.07em",
                                textTransform: "uppercase",
                                marginTop: "2px",
                            }}
                        >
                            AI Legal Analyze & Document Verification
                        </div>
                    </div>
                </Link>

                {/* ─── Navigation Links ─── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "14px",
                        padding: "5px 6px",
                        backdropFilter: "blur(10px)",
                        flexWrap: "wrap",
                    }}
                >
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "7px",
                                padding: "8px 14px",
                                borderRadius: "9px",
                                fontSize: "0.82rem",
                                fontWeight: link.active ? 700 : 600,
                                textDecoration: "none",
                                color: link.active ? "#070d24" : "rgba(255,255,255,0.82)",
                                background: link.active
                                    ? "linear-gradient(135deg, #c9a84c 0%, #f0c150 100%)"
                                    : "transparent",
                                transition: "all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
                                whiteSpace: "nowrap",
                                boxShadow: link.active ? "0 2px 10px rgba(201,168,76,0.3)" : "none",
                            }}
                        >
                            <span style={{ fontSize: "0.95rem" }}>{link.icon}</span>
                            <span>{link.label}</span>
                            {link.badge && (
                                <span
                                    style={{
                                        padding: "2px 7px",
                                        borderRadius: "999px",
                                        fontSize: "0.6rem",
                                        fontWeight: 800,
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        background: link.active
                                            ? "rgba(7,13,36,0.2)"
                                            : link.badge.color === "gold"
                                            ? "rgba(201,168,76,0.25)"
                                            : "rgba(255,255,255,0.12)",
                                        color: link.active ? "#070d24" : "#f0c150",
                                        border: link.active ? "none" : "1px solid rgba(201,168,76,0.3)",
                                    }}
                                >
                                    {link.badge.text}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>

                {/* ─── Right: User Profile & Session Controls ─── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    {isAuthenticated && user ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(201,168,76,0.3)",
                                borderRadius: "12px",
                                padding: "4px 10px 4px 6px",
                            }}
                        >
                            {/* User Avatar Initial */}
                            <div
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "8px",
                                    background: "linear-gradient(135deg, #1e6bb8 0%, #111d4a 100%)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 800,
                                    fontSize: "0.85rem",
                                }}
                            >
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>

                            <div style={{ lineHeight: 1.2 }}>
                                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap" }}>
                                    {user.name || "Legal Analyst"}
                                </div>
                                <div style={{ fontSize: "0.62rem", color: "#f0c150", fontWeight: 600, textTransform: "uppercase" }}>
                                    {user.role || "Verified Member"}
                                </div>
                            </div>

                            {/* Sign Out Button */}
                            <button
                                type="button"
                                onClick={logout}
                                title="Sign out of LexiTwin"
                                style={{
                                    marginLeft: "6px",
                                    padding: "5px 9px",
                                    borderRadius: "7px",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    background: "rgba(239,68,68,0.15)",
                                    color: "#fca5a5",
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    transition: "all 0.15s ease",
                                }}
                            >
                                <span>Sign Out</span>
                            </button>
                        </div>
                    ) : (
                        <div
                            style={{
                                padding: "6px 14px",
                                borderRadius: "999px",
                                border: "1px solid rgba(201,168,76,0.35)",
                                background: "rgba(201,168,76,0.1)",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                color: "#f0c150",
                                letterSpacing: "0.05em",
                                whiteSpace: "nowrap",
                            }}
                        >
                            ✦ Neural Platform v2.0
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;