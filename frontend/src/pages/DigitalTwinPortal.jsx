import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import DigitalTwinDashboard from "../components/DigitalTwinDashboard";
import ChatBox from "../components/ChatBox";
import DnaBackground from "../components/DnaBackground";

const SAMPLE_TWIN_CONTRACTS = [
    {
        id: "saas_msa",
        title: "Enterprise SaaS & Service Level Agreement",
        description: "Cloud software subscription, SLA guarantees, data security & termination provisions",
        sampleText: `MASTER SOFTWARE AS A SERVICE AND DATA PROCESSING AGREEMENT

This Master Agreement is entered into on January 1, 2026, by and between Skyline Cloud Inc. ("Vendor") and Global Financial Services Corp. ("Customer").

1. SERVICE LEVEL COMMITMENT & AVAILABILITY
1.1 Uptime Guarantee: Vendor shall guarantee minimum platform uptime of 99.95% measured monthly, excluding scheduled maintenance windows notified at least 72 hours in advance.
1.2 SLA Penalties & Credits: If monthly uptime falls below 99.95%, Customer shall be entitled to a service credit of 10% of monthly subscription fees; if below 99.0%, Customer shall be entitled to a 25% credit and right to terminate immediately without penalty.

2. PAYMENT TERMS AND INVOICING
2.1 Payment Schedule: Customer shall pay all recurring subscription fees within thirty (30) calendar days of receiving a valid electronic invoice.
2.2 Late Payment Remedies: Unpaid invoices after 30 days shall accrue interest at 1.5% per month or the legal maximum, whichever is lower, and Vendor reserves the right to suspend platform access upon 10 days written cure notice.

3. DATA PROTECTION, GDPR & SECURITY COMPLIANCE
3.1 Security Standards: Vendor shall maintain SOC 2 Type II and ISO 27001 certifications throughout the term and provide annual audit verification reports to Customer within thirty (30) days of each calendar year end.
3.2 Data Breach Notification: In the event of any confirmed security incident or unauthorized access to Customer Personal Data, Vendor must notify Customer in writing within twenty-four (24) hours of discovery and submit a full incident remediation plan within five (5) business days.

4. INTELLECTUAL PROPERTY & AUDIT RIGHTS
4.1 Customer Data Ownership: Customer retains sole and exclusive ownership of all proprietary data, trade secrets, and customer records uploaded to the system.
4.2 Annual Compliance Audit: Customer or its designated independent auditor shall have the right, upon 14 business days prior written notice, to inspect Vendor's security controls and processing logs during normal business hours.

5. TERM, TERMINATION AND DATA RETURN
5.1 Term: This Agreement commences on January 1, 2026 and shall continue for an initial period of three (3) years with automatic 1-year renewals unless either party gives 60 days written notice of non-renewal.
5.2 Data Destruction upon Termination: Within fourteen (14) days following expiration or termination, Vendor must securely export all Customer Data in standard encrypted JSON/SQL format to Customer and deliver a signed Certificate of Data Destruction within thirty (30) days thereafter.`
    },
    {
        id: "nda_ip",
        title: "Mutual Confidentiality & IP Agreement",
        description: "Bilateral trade secrets, non-disclosure restrictions, 14-day return obligation & liquidated damages",
        sampleText: `MUTUAL NON-DISCLOSURE AND PROPRIETARY INFORMATION AGREEMENT

This Mutual Non-Disclosure Agreement is executed between Apex Global Technologies Inc. ("Disclosing Party") and Quantum Innovations Ltd. ("Receiving Party").

1. OBLIGATIONS OF NON-DISCLOSURE
1.1 Strict Confidentiality: Receiving Party shall hold all proprietary blueprints, software algorithms, customer data, and commercial pricing in strict confidence and use the same degree of care as for its own trade secrets.
1.2 Permitted Purpose: Confidential Information shall be used exclusively for evaluating the strategic cloud integration partnership.

2. TIMELINES AND RETURN OF ASSETS
2.1 Asset Return and Destruction: Within fourteen (14) business days following receipt of written demand or termination of discussions, Receiving Party must return or certify destruction of all tangible and digital confidential files.
2.2 Written Certification: A senior officer of Receiving Party must provide a signed compliance declaration within 7 days of asset destruction.

3. REMEDIES AND LIQUIDATED DAMAGES
3.1 Monetary Damages: Any unauthorized disclosure or breach of Section 1 shall obligate Receiving Party to pay liquidated damages of $150,000 USD per incident in addition to injunctive relief without bond.

4. GOVERNING LAW & TERM
4.1 Term: The confidentiality obligations regarding technical trade secrets shall survive perpetually, and for commercial data for a duration of five (5) years from effective date.`
    }
];

function DigitalTwinPortal() {
    const [contractText, setContractText] = useState(SAMPLE_TWIN_CONTRACTS[0].sampleText);
    const [fileName, setFileName] = useState("Enterprise_SaaS_Agreement.docx");
    const [digitalTwin, setDigitalTwin] = useState(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedSampleId, setSelectedSampleId] = useState("saas_msa");
    const fileInputRef = useRef(null);

    // Load initial sample digital twin on mount
    useEffect(() => {
        loadSampleTwin(SAMPLE_TWIN_CONTRACTS[0]);
    }, []);

    async function loadSampleTwin(sample) {
        setSelectedSampleId(sample.id);
        setContractText(sample.sampleText);
        setFileName(`${sample.title}.docx`);
        extractTwinFromText(sample.sampleText, sample.title);
    }

    async function extractTwinFromText(textToAnalyze, docName) {
        if (!textToAnalyze || !textToAnalyze.trim()) {
            setErrorMsg("Please provide contract text or upload a document.");
            return;
        }

        setIsExtracting(true);
        setErrorMsg("");

        try {
            const response = await api.post("/analyze", {
                text: textToAnalyze
            });

            const analysis = response.data.analysis;
            if (analysis && analysis.digital_twin) {
                setDigitalTwin(analysis.digital_twin);
            } else {
                // Fallback constructor
                setDigitalTwin({
                    contract_name: docName || "Contract Document",
                    parties: ["Party A", "Party B"],
                    effective_date: "As per agreement",
                    summary_metrics: {
                        total_obligations: analysis.obligations?.length || 0,
                        high_risk_obligations: 1,
                        critical_deadlines: 2,
                        actionable_items: analysis.obligations?.length || 0
                    },
                    items: (analysis.obligations || []).map((ob, idx) => ({
                        id: `DT-${idx + 1 < 10 ? "0" : ""}${idx + 1}`,
                        obligation: ob.obligation,
                        responsible_party: ob.party || "Not specified",
                        deadline: ob.deadline || "Not specified",
                        status: "Active",
                        evidence: "Written acknowledgement or transaction record",
                        contractual_consequence: "Standard breach liability",
                        clause_reference: `Section clause #${idx + 1}`,
                        source_clause_text: ob.source_text || ob.obligation,
                        category: "Operational & Milestones",
                        risk_level: "Medium"
                    }))
                });
            }
        } catch (err) {
            console.error("Twin extraction failed:", err);
            const msg =
                err.response?.data?.detail ||
                err.message ||
                "Failed to construct Digital Twin. Please check backend server status.";
            setErrorMsg(msg);
        } finally {
            setIsExtracting(false);
        }
    }

    // Handle user document upload (.pdf, .docx, .txt)
    async function handleFileUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setSelectedSampleId("");
        setIsExtracting(true);
        setErrorMsg("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await api.post("/upload", formData);
            const extractedDocText = uploadRes.data.text;
            setContractText(extractedDocText || "");

            // Extract digital twin
            await extractTwinFromText(extractedDocText, file.name);
        } catch (err) {
            console.error("Upload error:", err);
            setErrorMsg(err.response?.data?.detail || err.message || "Failed to upload and process file.");
            setIsExtracting(false);
        }
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--lt-surface)", display: "flex", flexDirection: "column" }}>
            <Navbar />

            {/* ─── Hero Banner ─── */}
            <div
                className="lt-hero-bg"
                style={{
                    position: "relative",
                    overflow: "hidden",
                    padding: "48px 24px 40px",
                }}
            >
                {/* Animated White DNA Structures Background */}
                <DnaBackground style={{ opacity: 0.8 }} />

                <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(201,168,76,0.07)", pointerEvents: "none" }} />
                <div style={{ maxWidth: "780px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
                        <div
                            style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "18px",
                                background: "linear-gradient(135deg, #c9a84c 0%, #f0c150 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "28px",
                                flexShrink: 0,
                                boxShadow: "0 0 24px rgba(201,168,76,0.35)",
                            }}
                        >
                            🤖
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "999px", border: "1px solid rgba(201,168,76,0.35)", background: "rgba(201,168,76,0.1)", fontSize: "0.65rem", fontWeight: 700, color: "#f0c150", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
                                ⚡ LexiTwin Autonomous Entity Modeling
                            </div>
                            <h1 style={{ margin: "0 0 10px", fontFamily: "'Inter', sans-serif", fontSize: "clamp(1.6rem,4vw,2.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
                                Contract Digital Twin
                            </h1>
                            <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "560px" }}>
                                Transform static legal agreements into a live, interactive obligation twin—traceable to every original clause, with evidence requirements, deadlines, and breach consequences mapped in real time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Content Area ─── */}
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px", flex: 1 }}>

                {/* Contract Source Selector Card */}
                <div className="lt-card" style={{ padding: "28px 32px", marginBottom: "28px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", paddingBottom: "20px", borderBottom: "1px solid var(--lt-border)", marginBottom: "20px" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #0b1437, #1a2d6d)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                                    📂
                                </div>
                                <h3 style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--lt-text-primary)" }}>
                                    Select Contract Source
                                </h3>
                            </div>
                            <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--lt-text-muted)", marginLeft: "42px" }}>
                                Choose a pre-built sample or upload your own PDF/DOCX for live twin generation
                            </p>
                        </div>
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".pdf,.docx,.txt"
                                style={{ display: "none" }}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="lt-btn-gold"
                            >
                                <span>⬆</span> Upload Contract (PDF/DOCX)
                            </button>
                        </div>
                    </div>

                    {/* Sample Contract Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                        {SAMPLE_TWIN_CONTRACTS.map((sample) => {
                            const isSelected = selectedSampleId === sample.id;
                            return (
                                <div
                                    key={sample.id}
                                    onClick={() => loadSampleTwin(sample)}
                                    style={{
                                        padding: "16px 20px",
                                        borderRadius: "12px",
                                        border: isSelected ? "2px solid var(--lt-gold)" : "2px solid var(--lt-border)",
                                        background: isSelected ? "rgba(201,168,76,0.04)" : "var(--lt-surface-2)",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        boxShadow: isSelected ? "0 0 0 3px rgba(201,168,76,0.12)" : "none",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{ fontSize: "1rem" }}>📑</span>
                                            <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--lt-text-primary)" }}>{sample.title}</span>
                                        </div>
                                        {isSelected && (
                                            <span style={{ padding: "3px 10px", borderRadius: "999px", background: "var(--lt-navy)", color: "#f0c150", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.05em" }}>
                                                ACTIVE
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--lt-text-muted)", lineHeight: 1.5 }}>
                                        {sample.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                    <div style={{ marginBottom: "20px", padding: "14px 18px", background: "#fef2f2", border: "1px solid #fca5a5", borderLeft: "4px solid #ef4444", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", color: "#991b1b" }}>
                        <span>⚠️</span>
                        <div><strong>Error:</strong> {errorMsg}</div>
                    </div>
                )}

                {/* Interactive Digital Twin Dashboard */}
                <DigitalTwinDashboard
                    digitalTwin={digitalTwin}
                    contractText={contractText}
                    contractName={fileName}
                    isLoading={isExtracting}
                />

                {/* AI Chat */}
                <div style={{ marginTop: "28px" }}>
                    <ChatBox documentText={contractText} fileName={fileName} />
                </div>
            </div>

            {/* ─── Footer ─── */}
            <footer
                style={{
                    marginTop: "auto",
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

export default DigitalTwinPortal;

