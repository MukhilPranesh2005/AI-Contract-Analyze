from app.services.ai_service import extract_digital_twin_only, analyze_contract

SAMPLE_DIGITAL_TWIN_TEMPLATES = [
    {
        "id": "saas_msa",
        "title": "Enterprise Cloud SaaS Agreement (Digital Twin Sample)",
        "contract_name": "Enterprise Cloud Services & Data Processing Agreement",
        "parties": ["Skyline Cloud Inc. (Vendor)", "Global Financial Services Corp. (Customer)"],
        "effective_date": "January 1, 2026",
        "governing_law": "State of New York, USA",
        "contract_text": """MASTER SOFTWARE AS A SERVICE AND DATA PROCESSING AGREEMENT

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
5.2 Data Destruction upon Termination: Within fourteen (14) days following expiration or termination, Vendor must securely export all Customer Data in standard encrypted JSON/SQL format to Customer and deliver a signed Certificate of Data Destruction within thirty (30) days thereafter.""",
        "summary_metrics": {
            "total_obligations": 8,
            "high_risk_obligations": 3,
            "critical_deadlines": 6,
            "actionable_items": 8
        },
        "items": [
            {
                "id": "DT-01",
                "obligation": "Maintain minimum 99.95% monthly system uptime and provide 72 hours prior notice for scheduled maintenance.",
                "responsible_party": "Skyline Cloud Inc. (Vendor)",
                "deadline": "Continuous Monthly / 72h advance notice",
                "status": "Active",
                "evidence": "Monthly Automated Availability Log & Maintenance Dispatch Records",
                "contractual_consequence": "10% service fee credit for <99.95% uptime; 25% fee credit + immediate termination right without penalty if <99.0%",
                "clause_reference": "Section 1.1 & 1.2 - Service Level Commitment & SLA Penalties",
                "source_clause_text": "Vendor shall guarantee minimum platform uptime of 99.95% measured monthly, excluding scheduled maintenance windows notified at least 72 hours in advance. If monthly uptime falls below 99.95%, Customer shall be entitled to a service credit of 10% of monthly subscription fees; if below 99.0%, Customer shall be entitled to a 25% credit and right to terminate immediately without penalty.",
                "category": "Delivery & Milestones",
                "risk_level": "High",
                "source_page": 1
            },
            {
                "id": "DT-02",
                "obligation": "Remit payment for recurring software subscription fees upon receipt of valid electronic invoice.",
                "responsible_party": "Global Financial Services Corp. (Customer)",
                "deadline": "Within 30 calendar days of invoice receipt (Net 30)",
                "status": "Pending",
                "evidence": "Bank Electronic Wire Confirmation / Accounts Payable Remittance Advice",
                "contractual_consequence": "1.5% monthly late interest accrual; potential service suspension upon 10 days written cure notice",
                "clause_reference": "Section 2.1 & 2.2 - Payment Schedule & Late Payment Remedies",
                "source_clause_text": "Customer shall pay all recurring subscription fees within thirty (30) calendar days of receiving a valid electronic invoice. Unpaid invoices after 30 days shall accrue interest at 1.5% per month or the legal maximum, whichever is lower, and Vendor reserves the right to suspend platform access upon 10 days written cure notice.",
                "category": "Financial & Payment",
                "risk_level": "Medium",
                "source_page": 1
            },
            {
                "id": "DT-03",
                "obligation": "Maintain active SOC 2 Type II and ISO 27001 certifications and deliver annual audit reports to Customer.",
                "responsible_party": "Skyline Cloud Inc. (Vendor)",
                "deadline": "Within 30 days of each calendar year end (by January 30 annually)",
                "status": "Active",
                "evidence": "Certified Independent Auditor SOC 2 Type II & ISO 27001 Attestation Reports",
                "contractual_consequence": "Material breach with 30-day cure period; Customer audit rights triggered and potential agreement termination for default",
                "clause_reference": "Section 3.1 - Security Standards",
                "source_clause_text": "Vendor shall maintain SOC 2 Type II and ISO 27001 certifications throughout the term and provide annual audit verification reports to Customer within thirty (30) days of each calendar year end.",
                "category": "Compliance & Regulatory",
                "risk_level": "High",
                "source_page": 2
            },
            {
                "id": "DT-04",
                "obligation": "Provide immediate written notice of any confirmed security breach and submit comprehensive remediation plan.",
                "responsible_party": "Skyline Cloud Inc. (Vendor)",
                "deadline": "Within 24 hours of breach discovery (notice); within 5 business days (remediation plan)",
                "status": "Requires Review",
                "evidence": "Timestamped Written Breach Notification & Formal Root Cause Analysis Incident Report",
                "contractual_consequence": "Direct liability for GDPR/regulatory fines, uncapped indemnification, and immediate termination for cause",
                "clause_reference": "Section 3.2 - Data Breach Notification",
                "source_clause_text": "In the event of any confirmed security incident or unauthorized access to Customer Personal Data, Vendor must notify Customer in writing within twenty-four (24) hours of discovery and submit a full incident remediation plan within five (5) business days.",
                "category": "Compliance & Regulatory",
                "risk_level": "Critical",
                "source_page": 2
            },
            {
                "id": "DT-05",
                "obligation": "Allow Customer or designated independent auditor to inspect security controls and processing logs.",
                "responsible_party": "Skyline Cloud Inc. (Vendor)",
                "deadline": "Upon 14 business days prior written notice by Customer",
                "status": "Upcoming",
                "evidence": "Written Audit Notification & Mutual Audit Sign-Off Protocol",
                "contractual_consequence": "Suspension of vendor privileges and right to escalate to regulatory supervisory authority",
                "clause_reference": "Section 4.2 - Annual Compliance Audit",
                "source_clause_text": "Customer or its designated independent auditor shall have the right, upon 14 business days prior written notice, to inspect Vendor's security controls and processing logs during normal business hours.",
                "category": "Governance & Audit",
                "risk_level": "Medium",
                "source_page": 2
            },
            {
                "id": "DT-06",
                "obligation": "Submit written notice if either party elects not to renew agreement upon term expiration.",
                "responsible_party": "Both Parties (Vendor / Customer)",
                "deadline": "At least 60 calendar days prior to expiration of current term",
                "status": "Upcoming",
                "evidence": "Formal Non-Renewal Notice via Registered Certified Mail / Written Receipt",
                "contractual_consequence": "Automatic mandatory 1-year agreement extension and binding payment commitment",
                "clause_reference": "Section 5.1 - Term & Renewal",
                "source_clause_text": "This Agreement commences on January 1, 2026 and shall continue for an initial period of three (3) years with automatic 1-year renewals unless either party gives 60 days written notice of non-renewal.",
                "category": "Termination & Liabilities",
                "risk_level": "Low",
                "source_page": 3
            },
            {
                "id": "DT-07",
                "obligation": "Export complete Customer Data in standard encrypted JSON/SQL format upon contract termination.",
                "responsible_party": "Skyline Cloud Inc. (Vendor)",
                "deadline": "Within 14 calendar days following expiration or termination",
                "status": "Pending",
                "evidence": "Secure Data Transfer Manifest & Customer Data Receipt Confirmation",
                "contractual_consequence": "Daily liquidated damages of $1,000 USD per day of withholding, plus conversion damages",
                "clause_reference": "Section 5.2 - Data Destruction upon Termination",
                "source_clause_text": "Within fourteen (14) days following expiration or termination, Vendor must securely export all Customer Data in standard encrypted JSON/SQL format to Customer and deliver a signed Certificate of Data Destruction within thirty (30) days thereafter.",
                "category": "Termination & Liabilities",
                "risk_level": "High",
                "source_page": 3
            },
            {
                "id": "DT-08",
                "obligation": "Perform permanent data sanitization and provide formal signed Certificate of Data Destruction.",
                "responsible_party": "Skyline Cloud Inc. (Vendor)",
                "deadline": "Within 30 calendar days following contract termination",
                "status": "Pending",
                "evidence": "Signed Certificate of Data Destruction (NIST 800-88 compliant)",
                "contractual_consequence": "Severe statutory liability under privacy laws and perpetual non-disclosure liability",
                "clause_reference": "Section 5.2 - Data Destruction upon Termination",
                "source_clause_text": "deliver a signed Certificate of Data Destruction within thirty (30) days thereafter.",
                "category": "Confidentiality & IP",
                "risk_level": "Critical",
                "source_page": 3
            }
        ]
    }
]


def get_sample_digital_twins():
    return SAMPLE_DIGITAL_TWIN_TEMPLATES


def analyze_for_digital_twin(text: str):
    analysis = analyze_contract(text)
    return analysis.get("digital_twin", {})
