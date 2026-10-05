/**
 * LexiTwin AI - Offline / Interactive Demo Fallback Engine
 * Provides realistic, high-fidelity contract analysis, OCR, digital twin data & legal AI chat
 * for GitHub Pages live demo and offline environments.
 */

export const SAMPLE_CONTRACTS = [
    {
        id: "nda",
        name: "Standard Mutual NDA (Sample)",
        filename: "Mutual_Non_Disclosure_Agreement.pdf",
        text: `MUTUAL NON-DISCLOSURE AGREEMENT
This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of October 1, 2026 ("Effective Date"), by and between:
1. Innovatech Global Corp, a Delaware corporation ("Disclosing Party"), and
2. Apex AI Solutions Ltd., a California company ("Receiving Party").

1. PURPOSE & SCOPE
The parties wish to explore a potential business partnership regarding Enterprise AI Contract Analysis and Digital Twin simulation technologies ("Purpose"). In connection with this Purpose, each party may disclose certain confidential technical and commercial information.

2. OBLIGATIONS & RESTRICTIONS
(a) The Receiving Party agrees to hold all Confidential Information in strict confidence and not disclose such information to any third party without prior written consent.
(b) The Receiving Party shall protect Confidential Information using at least the same degree of care it uses for its own proprietary data, but not less than reasonable care.
(c) The Receiving Party must return or securely destroy all tangible and digital Confidential Information within fourteen (14) days following written demand.
(d) The Receiving Party shall immediately notify the Disclosing Party in writing within twenty-four (24) hours of discovering any unauthorized disclosure or security breach.

3. FINANCIAL & LIQUIDATED DAMAGES
In the event of an intentional or material breach of Section 2, the breaching party shall pay liquidated damages of $250,000 USD to cover initial forensic discovery and immediate injunctive relief costs, without prejudice to other statutory remedies.

4. NON-SOLICITATION & NON-COMPETE
For a period of twelve (12) months following the termination of discussions, neither party shall directly solicit for employment any key engineers or executive personnel of the other party without prior written agreement.

5. TERM AND TERMINATION
This Agreement shall remain in effect for two (2) years from the Effective Date. The confidentiality obligations regarding trade secrets shall survive indefinitely.

6. GOVERNING LAW & JURISDICTION
This Agreement shall be governed by and construed under the laws of the State of Delaware. Any dispute arising out of this Agreement shall be resolved exclusively in the state or federal courts located in New Castle County, Delaware.`
    },
    {
        id: "saas",
        name: "Enterprise SaaS Master Agreement (Sample)",
        filename: "Enterprise_SaaS_Service_Agreement.pdf",
        text: `ENTERPRISE SAAS MASTER SERVICES AGREEMENT
This SaaS Master Services Agreement ("Agreement") is made between CloudScale Systems Inc. ("Vendor" / "Provider") and Horizon Global Enterprises LLC ("Customer" / "Client").

1. SUBSCRIPTION SERVICES & SLA
Vendor grants Customer a non-exclusive, non-transferable subscription to access the CloudScale AI Platform. Vendor warrants an uptime Service Level Agreement (SLA) of 99.9% monthly availability. In the event uptime falls below 99.5%, Vendor will issue a 15% service credit on the subsequent billing cycle.

2. PAYMENT TERMS & OBLIGATIONS
(a) Customer shall pay an annual platform subscription fee of $120,000 USD, payable annually in advance within thirty (30) days of invoice date (Net 30).
(b) Late payments shall accrue interest at 1.5% per month or the maximum rate permitted by law.
(c) Customer must complete annual security audit questionnaires and notify Vendor of any authorized user access changes within five (5) business days.

3. DATA PROTECTION & CYBERSECURITY
(a) Vendor shall maintain SOC 2 Type II and ISO 27001 certifications throughout the term.
(b) Vendor agrees to notify Customer within forty-eight (48) hours in the event of a verified data breach affecting Customer data.
(c) Customer retains full ownership of all uploaded data, models, and derivative prompt outputs.

4. LIMITATION OF LIABILITY & INDEMNIFICATION
(a) Neither party's aggregate liability under this agreement shall exceed the total fees paid by Customer in the preceding twelve (12) months, except for breaches of confidentiality or gross negligence.
(b) Vendor shall defend, indemnify, and hold Customer harmless from third-party claims alleging that the Software infringes any valid patent or copyright.

5. TERM, RENEWAL & TERMINATION
This Agreement commences on November 1, 2026 for an initial term of three (3) years. It shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to expiration.`
    },
    {
        id: "employment",
        name: "Executive Employment Contract (Sample)",
        filename: "Executive_Employment_Agreement.docx",
        text: `EXECUTIVE EMPLOYMENT & CONFIDENTIALITY AGREEMENT
This Employment Agreement is entered into between NexaTech Industries ("Employer" / "Company") and Alexander Sterling ("Executive" / "Employee").

1. POSITION & DUTIES
The Company agrees to employ the Executive as Chief Technology Officer (CTO). The Executive will report directly to the Chief Executive Officer and Board of Directors.

2. COMPENSATION & BENEFIT OBLIGATIONS
(a) Base Salary: The Company shall pay the Executive an annual base salary of $280,000 USD, payable bi-weekly in accordance with standard payroll practices.
(b) Performance Bonus: The Executive is eligible for an annual performance bonus of up to 35% of base salary upon meeting KPI targets set by the Board.
(c) Equity Grant: The Company will grant 150,000 restricted stock units (RSUs) vesting over four (4) years with a one-year cliff.

3. EMPLOYEE OBLIGATIONS & WORK SCHEDULE
(a) The Executive agrees to devote full business time, attention, and effort to Company business.
(b) The Executive must disclose all inventions, software code, and patentable ideas developed during employment to the Company within ten (10) days of conception.
(c) The Executive must provide sixty (60) days written notice prior to voluntary resignation.

4. NON-COMPETE & RESTRICTIVE COVENANTS
During employment and for twenty-four (24) months following separation, Executive shall not engage in, advise, or consult for any direct competitive AI legaltech business in North America or the EU.

5. SEVERANCE & TERMINATION
If terminated without Cause, the Company will pay severance equal to six (6) months of base salary ($140,000 USD) and extend COBRA healthcare coverage for six (6) months.`
    }
];

export function generateMockAnalysis(documentText = "") {
    const textLower = documentText.toLowerCase();
    const isNDA = textLower.includes("confidential") || textLower.includes("non-disclosure") || textLower.includes("disclosing");
    const isSaaS = textLower.includes("saas") || textLower.includes("subscription") || textLower.includes("sla") || textLower.includes("vendor");
    const isEmployment = textLower.includes("employee") || textLower.includes("employment") || textLower.includes("salary") || textLower.includes("cto");

    let summary = "";
    let risk = "";
    let clauses = [];
    let recommendations = [];
    let obligations = [];

    if (isNDA) {
        summary = "This document is a Bilateral Non-Disclosure Agreement (NDA) between Innovatech Global Corp and Apex AI Solutions Ltd. It governs the exchange of proprietary technical and commercial data for evaluation of AI contract analysis technologies. Key provisions include a 2-year general term with indefinite trade secret protection, strict 14-day return/destruction rules, and predetermined $250,000 liquidated damages for breach.";
        risk = "Medium Risk. The contract contains a fixed $250,000 liquidated damages clause and a 12-month non-solicitation restriction that may limit commercial flexibility. However, confidentiality terms and governing law (Delaware) are standard.";
        clauses = [
            {
                clause: "Section 2(c) - Document Destruction",
                category: "Data & IP Governance",
                risk: "Low Risk",
                explanation: "Requires complete return or certified destruction of confidential information within 14 days of demand.",
                recommendation: "Ensure automated deletion scripts and chain-of-custody logging are documented."
            },
            {
                clause: "Section 3 - Liquidated Damages ($250,000 USD)",
                category: "Financial Liability",
                risk: "High Risk",
                explanation: "Imposes a strict $250,000 financial liability for breach without requiring proof of actual pecuniary damages.",
                recommendation: "Negotiate to replace liquidated damages with actual provable damages or insert a mutual liability cap."
            },
            {
                clause: "Section 4 - Non-Solicitation Covenants",
                category: "Operational Restrictions",
                risk: "Medium Risk",
                explanation: "Restricts hiring or soliciting any engineers or executives for 12 months after termination.",
                recommendation: "Clarify that general public job postings or unsolicited applications do not violate this covenant."
            },
            {
                clause: "Section 5 - Survival of Trade Secrets",
                category: "IP Protection",
                risk: "Low Risk",
                explanation: "Confidentiality obligations for trade secrets persist indefinitely beyond the 2-year term.",
                recommendation: "Standard industry clause. Maintain clear classification of trade secrets."
            }
        ];
        recommendations = [
            "Negotiate a cure period (e.g., 10 business days) prior to enforcement of the liquidated damages clause.",
            "Insert an exception to non-solicitation for responses to general public recruitments or headhunter solicitations.",
            "Add mutual indemnity protection in case of third-party IP claims during evaluation.",
            "Establish secure escrow procedures for shared algorithmic source codes."
        ];
        obligations = [
            {
                party: "Receiving Party (Apex AI Solutions)",
                obligation: "Maintain strict confidentiality using at least reasonable degree of care",
                deadline: "Indefinite / Duration of Term",
                amount: "N/A",
                clause_text: "The Receiving Party agrees to hold all Confidential Information in strict confidence...",
                page_number: 1
            },
            {
                party: "Receiving Party (Apex AI Solutions)",
                obligation: "Return or securely destroy all confidential materials",
                deadline: "Within 14 days of written demand",
                amount: "N/A",
                clause_text: "The Receiving Party must return or securely destroy all tangible and digital Confidential Information within fourteen (14) days...",
                page_number: 1
            },
            {
                party: "Breaching Party",
                obligation: "Pay liquidated damages for intentional or material breach",
                deadline: "Upon formal demand following breach",
                amount: "$250,000 USD",
                clause_text: "The breaching party shall pay liquidated damages of $250,000 USD to cover initial forensic discovery...",
                page_number: 1
            },
            {
                party: "Both Parties",
                obligation: "Refrain from soliciting key engineers or executives",
                deadline: "12 months following termination",
                amount: "N/A",
                clause_text: "Neither party shall directly solicit for employment any key engineers or executive personnel...",
                page_number: 1
            },
            {
                party: "Receiving Party",
                obligation: "Provide written notification of any security breach or unauthorized disclosure",
                deadline: "Within 24 hours of discovery",
                amount: "N/A",
                clause_text: "The Receiving Party shall immediately notify the Disclosing Party in writing within twenty-four (24) hours...",
                page_number: 1
            }
        ];
    } else if (isSaaS) {
        summary = "This agreement is a 3-year Enterprise SaaS Master Services Agreement between CloudScale Systems Inc. (Vendor) and Horizon Global Enterprises LLC (Customer). It provides access to CloudScale AI platform with a 99.9% uptime SLA, annual subscription fees of $120,000 (Net 30), SOC 2 compliance warranties, and a 12-month trailing fee liability cap.";
        risk = "Low to Medium Risk. Solid liability caps and SLA credit provisions. Customer should monitor automatic renewal 60-day notification window to avoid unwanted commitment extensions.";
        clauses = [
            {
                clause: "Section 1 - 99.9% Uptime SLA & Service Credits",
                category: "Service Levels",
                risk: "Low Risk",
                explanation: "Provides 15% billing credit if monthly platform availability drops below 99.5%.",
                recommendation: "Ensure monitoring tools are connected to verify Vendor's reported availability."
            },
            {
                clause: "Section 2(a) - Annual Platform Fees ($120,000 USD Net 30)",
                category: "Payment Terms",
                risk: "Medium Risk",
                explanation: "Requires upfront annual fee payment with 1.5% monthly late payment interest penalty.",
                recommendation: "Request quarterly milestone payments or a 45-day invoice payment cycle."
            },
            {
                clause: "Section 4(a) - 12-Month Aggregate Liability Cap",
                category: "Liability & Indemnity",
                risk: "Low Risk",
                explanation: "Caps mutual liability to fees paid in preceding 12 months with carve-outs for confidentiality breaches.",
                recommendation: "Standard commercial balance. Protects both parties against catastrophic open-ended claims."
            },
            {
                clause: "Section 5 - Automatic Renewal (60-Day Notice Window)",
                category: "Term & Termination",
                risk: "Medium Risk",
                explanation: "Automatically extends the agreement by one year unless cancelled 60 days before expiration.",
                recommendation: "Set a calendar alert 90 days prior to annual contract expiration."
            }
        ];
        recommendations = [
            "Set automated calendar reminders 75 days before annual renewal date to review contract performance.",
            "Request quarterly billing in place of advance annual lump sum payment.",
            "Include GDPR Data Processing Addendum (DPA) and Standard Contractual Clauses (SCC) for cross-border data transfer.",
            "Clarify dedicated disaster recovery RPO (Recovery Point Objective) and RTO (Recovery Time Objective)."
        ];
        obligations = [
            {
                party: "Customer (Horizon Global)",
                obligation: "Pay annual platform subscription fee",
                deadline: "Within 30 days of invoice date (Net 30)",
                amount: "$120,000 USD / Year",
                clause_text: "Customer shall pay an annual platform subscription fee of $120,000 USD, payable annually in advance...",
                page_number: 1
            },
            {
                party: "Vendor (CloudScale Systems)",
                obligation: "Maintain 99.9% platform availability SLA",
                deadline: "Continuous monthly measurement",
                amount: "15% billing credit if < 99.5%",
                clause_text: "Vendor warrants an uptime Service Level Agreement (SLA) of 99.9% monthly availability...",
                page_number: 1
            },
            {
                party: "Vendor (CloudScale Systems)",
                obligation: "Notify Customer of verified data security breach",
                deadline: "Within 48 hours of verification",
                amount: "N/A",
                clause_text: "Vendor agrees to notify Customer within forty-eight (48) hours in the event of a verified data breach...",
                page_number: 1
            },
            {
                party: "Either Party",
                obligation: "Provide written notice of non-renewal to prevent auto-renewal",
                deadline: "At least 60 days prior to contract expiration",
                amount: "N/A",
                clause_text: "It shall automatically renew for successive one-year terms unless either party provides written notice...",
                page_number: 1
            }
        ];
    } else if (isEmployment) {
        summary = "This is an Executive Employment Agreement appointing Alexander Sterling as Chief Technology Officer (CTO) at NexaTech Industries. It establishes a $280,000 base salary, 35% performance bonus, 150,000 RSUs with 4-year vesting, a 24-month non-compete covenant, and 6 months severance upon termination without cause.";
        risk = "Medium to High Risk. The 24-month post-employment non-compete covenant is broad and may be contested in jurisdictions with strict non-compete bans (e.g., California/FTC rules). Compensation and severance packages are well-structured.";
        clauses = [
            {
                clause: "Section 2(a) - Base Salary & Equity Compensation",
                category: "Executive Compensation",
                risk: "Low Risk",
                explanation: "Establishes $280,000 annual base salary and 150,000 RSUs vesting over 4 years with 1-year cliff.",
                recommendation: "Ensure double-trigger acceleration clause is included in case of change of control/acquisition."
            },
            {
                clause: "Section 3(c) - Resignation Notice Period",
                category: "Operational Notice",
                risk: "Low Risk",
                explanation: "Requires 60 days prior written notice before executive voluntary departure.",
                recommendation: "Standard executive handoff transition requirement."
            },
            {
                clause: "Section 4 - 24-Month Restrictive Non-Compete",
                category: "Post-Employment Restraints",
                risk: "High Risk",
                explanation: "Barring executive from AI legaltech sector across North America and EU for 2 full years.",
                recommendation: "Narrow geographical scope and reduce duration to 12 months with gardening leave compensation."
            },
            {
                clause: "Section 5 - Severance Package ($140,000 USD + Healthcare)",
                category: "Termination & Severance",
                risk: "Low Risk",
                explanation: "Provides 6 months base salary ($140,000) and 6 months COBRA coverage upon termination without cause.",
                recommendation: "Fair executive termination protection standard."
            }
        ];
        recommendations = [
            "Add double-trigger equity acceleration in case of corporate merger or acquisition.",
            "Negotiate gardening leave compensation during the post-employment non-compete period.",
            "Verify compliance of non-compete covenant with state/local employment regulations.",
            "Clarify specific measurable KPI benchmarks for the 35% annual performance bonus."
        ];
        obligations = [
            {
                party: "Employer (NexaTech Industries)",
                obligation: "Pay executive annual base salary",
                deadline: "Bi-weekly payroll schedule",
                amount: "$280,000 USD / Year",
                clause_text: "The Company shall pay the Executive an annual base salary of $280,000 USD...",
                page_number: 1
            },
            {
                party: "Executive (Alexander Sterling)",
                obligation: "Disclose all inventions and patentable code to the Company",
                deadline: "Within 10 days of conception",
                amount: "N/A",
                clause_text: "The Executive must disclose all inventions, software code, and patentable ideas developed...",
                page_number: 1
            },
            {
                party: "Executive (Alexander Sterling)",
                obligation: "Provide written notice prior to voluntary resignation",
                deadline: "60 days prior to departure",
                amount: "N/A",
                clause_text: "The Executive must provide sixty (60) days written notice prior to voluntary resignation.",
                page_number: 1
            },
            {
                party: "Employer (NexaTech Industries)",
                obligation: "Pay severance package if terminated without Cause",
                deadline: "Within 30 days of separation",
                amount: "$140,000 USD + 6 mo COBRA",
                clause_text: "The Company will pay severance equal to six (6) months of base salary ($140,000 USD)...",
                page_number: 1
            },
            {
                party: "Executive (Alexander Sterling)",
                obligation: "Abide by non-compete restrictive covenants",
                deadline: "24 months post-separation",
                amount: "N/A",
                clause_text: "During employment and for twenty-four (24) months following separation, Executive shall not engage...",
                page_number: 1
            }
        ];
    } else {
        // Generic fallback for any user-uploaded contract
        const previewExcerpt = documentText.slice(0, 120).replace(/\n/g, " ");
        summary = `Comprehensive legal analysis of document (${previewExcerpt || "Uploaded Contract"}). The agreement outlines rights, obligations, liability allocations, and governance provisions between the executing parties.`;
        risk = "Moderate Risk. The document establishes binding legal commitments with standard commercial liability thresholds, dispute resolution mechanisms, and operational compliance timelines.";
        clauses = [
            {
                clause: "Clause 1 - Scope of Agreement & Obligations",
                category: "Operational Scope",
                risk: "Low Risk",
                explanation: "Defines the deliverables, performance standards, and mutual operational requirements.",
                recommendation: "Ensure milestones are matched with verifiable acceptance criteria."
            },
            {
                clause: "Clause 2 - Financial Considerations & Payment Deadlines",
                category: "Financial Liability",
                risk: "Medium Risk",
                explanation: "Outlines invoice issuance, payment schedules, and interest penalties for delinquent accounts.",
                recommendation: "Confirm payment terms align with enterprise cashflow schedules."
            },
            {
                clause: "Clause 3 - Confidentiality & Data Security",
                category: "Data Protection",
                risk: "Low Risk",
                explanation: "Mandates confidential treatment of proprietary technical, business, and personal data.",
                recommendation: "Ensure encryption standards and data return protocols are documented."
            },
            {
                clause: "Clause 4 - Termination & Dispute Resolution",
                category: "Governance & Jurisdiction",
                risk: "Medium Risk",
                explanation: "Sets forth termination for convenience notice periods and binding arbitration venues.",
                recommendation: "Review notice windows to prevent unexpected contractual rollover."
            }
        ];
        recommendations = [
            "Establish automated tracking for recurring obligations and milestone deadlines.",
            "Verify indemnification clauses for reciprocal balance between parties.",
            "Ensure dispute resolution mechanisms provide a mandatory amicable negotiation window prior to litigation."
        ];
        obligations = [
            {
                party: "Primary Party / Contractor",
                obligation: "Deliver agreed services and milestones in accordance with specifications",
                deadline: "As defined in project schedule",
                amount: "N/A",
                clause_text: "The performing party shall execute all deliverables in accordance with professional standards.",
                page_number: 1
            },
            {
                party: "Client / Counterparty",
                obligation: "Remit invoice payments and provide required project assets",
                deadline: "Within 30 days of milestone delivery",
                amount: "Per agreed fee schedule",
                clause_text: "Client shall make payment within thirty (30) days of verified deliverable acceptance.",
                page_number: 1
            },
            {
                party: "Both Parties",
                obligation: "Maintain strict confidentiality of proprietary information",
                deadline: "Indefinite / Duration of Term",
                amount: "N/A",
                clause_text: "Each party covenants to protect all confidential proprietary information from unauthorized disclosure.",
                page_number: 1
            }
        ];
    }

    const digitalTwin = {
        twin_id: "twin_" + Math.random().toString(36).substring(2, 9),
        contract_name: isNDA ? "Mutual NDA" : isSaaS ? "SaaS Master Agreement" : isEmployment ? "Executive Employment Agreement" : "Analyzed Document",
        health_score: isSaaS ? 92 : isNDA ? 84 : 79,
        risk_index: isSaaS ? 18 : isNDA ? 36 : 42,
        active_obligations_count: obligations.length,
        critical_flags: isNDA ? 1 : isEmployment ? 2 : 0,
        timeline_events: [
            { date: "Day 0", event: "Effective Execution Date", status: "Completed" },
            { date: "Day 14", event: "Data Protection Verification", status: "Upcoming" },
            { date: "Day 30", event: "First Milestone & Financial Review", status: "Pending" },
            { date: "Day 60", event: "Notice Window / Operational Checkpoint", status: "Scheduled" }
        ],
        entity_map: [
            { entity: "Party A (Originator)", role: "Disclosing / Provider", compliance_rate: "98%" },
            { entity: "Party B (Counterparty)", role: "Receiving / Client", compliance_rate: "94%" }
        ],
        ai_recommendation_summary: recommendations[0] || "Maintain proactive milestone tracking."
    };

    return {
        summary,
        risk,
        important_clauses: clauses,
        clauses,
        recommendations,
        obligations,
        digital_twin: digitalTwin
    };
}

export function generateMockChatReply(userMessage, documentText = "") {
    const q = userMessage.toLowerCase();
    if (q.includes("risk") || q.includes("dangerous") || q.includes("concern") || q.includes("warning")) {
        return "Based on my analysis of the contract, the primary risks include:\n1. **Liquidated Damages & Financial Liabilities**: Pre-set penalty amounts that may apply without requiring proof of actual pecuniary loss.\n2. **Restrictive Covenants**: Post-term restrictions (such as non-solicitation or non-compete) that could restrict hiring or business operations.\n3. **Tight Notification Windows**: Strict breach/notice windows (such as 24-48 hours) that require automated monitoring to avoid default.";
    }
    if (q.includes("obligation") || q.includes("duty") || q.includes("who") || q.includes("deadline")) {
        return "Key obligations extracted from this agreement include:\n- **Confidentiality & Care**: Strict protection of proprietary data using high standards of care.\n- **Return / Destruction of Materials**: Mandatory return or destruction of materials within the stipulated timeline (typically 14 days upon request).\n- **Payment & Reporting**: Adherence to Net-30 payment timelines and milestone deliveries.\n\nYou can view the full structured breakdown under the **Obligations** section above.";
    }
    if (q.includes("terminate") || q.includes("cancel") || q.includes("exit") || q.includes("renew")) {
        return "Under the termination provisions:\n- The contract specifies notice requirements (typically 30-60 days prior written notice).\n- Check whether automatic renewal clauses are active; if so, set a calendar notification before the non-renewal cutoff date.\n- Confidentiality obligations for trade secrets survive the termination of the agreement.";
    }
    if (q.includes("payment") || q.includes("price") || q.includes("fee") || q.includes("amount") || q.includes("cost")) {
        return "The financial terms specify structured payments upon invoice delivery (Net 30 terms) with interest penalties applicable to overdue balances. Ensure all invoices are cross-checked against completed milestones before authorization.";
    }
    return `In response to your query regarding "${userMessage}":\n\nAccording to the contract terms, both parties are bound by the stipulated governance, confidentiality, and performance requirements. Ensure that all actions comply with the governing law jurisdiction and that written notice is provided for any material modifications.\n\nLet me know if you would like me to drill into any specific clause or calculate exact compliance deadlines!`;
}

export function generateMockOcrResult(filename = "Sample_Scanned_Contract.png") {
    const text = `CONFIDENTIAL SETTLEMENT & RELEASE AGREEMENT
Date: October 5, 2026
Between: Apex Corporate Holdings LLC ("Party A") and Vanguard Technologies Inc. ("Party B")

1. RECITALS
WHEREAS, the parties desire to amicably resolve all outstanding matters regarding intellectual property licensing and software deployment;

2. SETTLEMENT PAYMENT OBLIGATIONS
Party A agrees to pay Party B a total settlement sum of $75,000 USD within fifteen (15) calendar days of signing.
Upon receipt of said funds, Party B shall release all claims against Party A and its affiliates.

3. MUTUAL NON-DISCLOSURE
Neither party shall disclose the terms or settlement amount to any third party except legal and tax advisors.

IN WITNESS WHEREOF, the authorized representatives have executed this Agreement.`;

    const wordCount = text.split(/\s+/).length;
    const charCount = text.length;
    const lineCount = text.split("\n").length;

    return {
        text,
        word_count: wordCount,
        char_count: charCount,
        line_count: lineCount,
        mime_type: "image/png",
        confidence_score: 98.6
    };
}
