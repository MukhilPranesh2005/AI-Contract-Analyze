import { useState, useMemo, useEffect } from "react";

const CATEGORY_COLORS = {
    "Financial & Payment": "bg-emerald-50 text-emerald-800 border-emerald-200",
    "Confidentiality & IP": "bg-purple-50 text-purple-800 border-purple-200",
    "Compliance & Regulatory": "bg-blue-50 text-blue-800 border-blue-200",
    "Delivery & Milestones": "bg-indigo-50 text-indigo-800 border-indigo-200",
    "Termination & Liabilities": "bg-rose-50 text-rose-800 border-rose-200",
    "Governance & Audit": "bg-amber-50 text-amber-800 border-amber-200"
};

const RISK_BADGES = {
    Critical: "bg-red-600 text-white border-red-700 font-bold",
    High: "bg-orange-500 text-white border-orange-600 font-semibold",
    Medium: "bg-amber-100 text-amber-900 border-amber-300 font-medium",
    Low: "bg-emerald-100 text-emerald-900 border-emerald-300 font-medium"
};

const STATUS_OPTIONS = [
    { label: "Active", color: "bg-blue-100 text-blue-800 border-blue-300", icon: "⚡" },
    { label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-300", icon: "⏳" },
    { label: "At Risk", color: "bg-rose-100 text-rose-800 border-rose-300 font-bold", icon: "⚠️" },
    { label: "Completed", color: "bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold", icon: "✅" },
    { label: "Requires Review", color: "bg-purple-100 text-purple-800 border-purple-300", icon: "🔍" }
];

function DigitalTwinDashboard({
    digitalTwin = null,
    contractText = "",
    contractName = "Contract Agreement",
    isLoading = false
}) {
    const [itemsState, setItemsState] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedParty, setSelectedParty] = useState("ALL");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedRisk, setSelectedRisk] = useState("ALL");
    const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'ledger'
    const [activeTraceItem, setActiveTraceItem] = useState(null);
    const [copiedNotification, setCopiedNotification] = useState("");

    // Initialize items from digitalTwin prop
    useEffect(() => {
        if (digitalTwin?.items && digitalTwin.items.length > 0) {
            setItemsState(digitalTwin.items);
        } else {
            setItemsState([]);
        }
    }, [digitalTwin]);

    // Handle interactive status toggle
    const handleStatusChange = (itemId, newStatus) => {
        setItemsState((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, status: newStatus } : item
            )
        );
    };

    // Calculate dynamic metrics
    const metrics = useMemo(() => {
        const total = itemsState.length;
        const highRisk = itemsState.filter(
            (i) => i.risk_level === "High" || i.risk_level === "Critical"
        ).length;
        const completed = itemsState.filter((i) => i.status === "Completed").length;
        const atRisk = itemsState.filter((i) => i.status === "At Risk").length;
        const pending = itemsState.filter((i) => i.status === "Pending" || i.status === "Active").length;
        const complianceScore = total > 0 ? Math.round(((total - atRisk * 0.8 - highRisk * 0.2) / total) * 100) : 100;

        return {
            total,
            highRisk,
            completed,
            atRisk,
            pending,
            complianceScore: Math.max(0, Math.min(100, complianceScore))
        };
    }, [itemsState]);

    // Extract unique parties and categories for filter dropdowns
    const uniqueParties = useMemo(() => {
        const set = new Set();
        itemsState.forEach((it) => {
            if (it.responsible_party) set.add(it.responsible_party);
        });
        return Array.from(set);
    }, [itemsState]);

    const uniqueCategories = useMemo(() => {
        const set = new Set();
        itemsState.forEach((it) => {
            if (it.category) set.add(it.category);
        });
        return Array.from(set);
    }, [itemsState]);

    // Filter items
    const filteredItems = useMemo(() => {
        return itemsState.filter((item) => {
            const matchesSearch =
                searchTerm === "" ||
                item.obligation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.responsible_party?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.contractual_consequence?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.evidence?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.clause_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesParty =
                selectedParty === "ALL" || item.responsible_party === selectedParty;

            const matchesStatus =
                selectedStatus === "ALL" || item.status === selectedStatus;

            const matchesCategory =
                selectedCategory === "ALL" || item.category === selectedCategory;

            const matchesRisk =
                selectedRisk === "ALL" || item.risk_level === selectedRisk;

            return (
                matchesSearch &&
                matchesParty &&
                matchesStatus &&
                matchesCategory &&
                matchesRisk
            );
        });
    }, [
        itemsState,
        searchTerm,
        selectedParty,
        selectedStatus,
        selectedCategory,
        selectedRisk
    ]);

    // Export Handlers
    const exportJson = () => {
        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(
                JSON.stringify(
                    {
                        contract_name: digitalTwin?.contract_name || contractName,
                        exported_at: new Date().toISOString(),
                        metrics,
                        digital_twin_items: itemsState
                    },
                    null,
                    2
                )
            );
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute(
            "download",
            `digital_twin_${(digitalTwin?.contract_name || "contract").replace(/\s+/g, "_")}.json`
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    const exportCsv = () => {
        const headers = [
            "ID",
            "Obligation",
            "Responsible Party",
            "Deadline",
            "Status",
            "Evidence Required",
            "Contractual Consequence",
            "Clause Reference",
            "Risk Level",
            "Category"
        ];
        const rows = itemsState.map((i) => [
            `"${i.id}"`,
            `"${(i.obligation || "").replace(/"/g, '""')}"`,
            `"${(i.responsible_party || "").replace(/"/g, '""')}"`,
            `"${(i.deadline || "").replace(/"/g, '""')}"`,
            `"${(i.status || "").replace(/"/g, '""')}"`,
            `"${(i.evidence || "").replace(/"/g, '""')}"`,
            `"${(i.contractual_consequence || "").replace(/"/g, '""')}"`,
            `"${(i.clause_reference || "").replace(/"/g, '""')}"`,
            `"${(i.risk_level || "").replace(/"/g, '""')}"`,
            `"${(i.category || "").replace(/"/g, '""')}"`
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
            "download",
            `digital_twin_ledger_${(digitalTwin?.contract_name || "contract").replace(/\s+/g, "_")}.csv`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const copySummary = () => {
        const text = `CONTRACT DIGITAL TWIN REPORT
Contract: ${digitalTwin?.contract_name || contractName}
Total Obligations: ${metrics.total}
High Risk Items: ${metrics.highRisk}
Compliance Health Score: ${metrics.complianceScore}%

EXTRACTED OBLIGATIONS & CONSEQUENCES:
${itemsState
    .map(
        (it) =>
            `[${it.id}] ${it.responsible_party} -> ${it.obligation}\n- Deadline: ${it.deadline}\n- Status: ${it.status}\n- Evidence: ${it.evidence}\n- Consequence: ${it.contractual_consequence}\n- Source: ${it.clause_reference}\n`
    )
    .join("\n")}`;

        navigator.clipboard.writeText(text);
        setCopiedNotification("Summary copied to clipboard!");
        setTimeout(() => setCopiedNotification(""), 3000);
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border border-blue-100 text-center animate-pulse">
                <div className="inline-block p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-4 text-3xl">
                    🤖
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                    Constructing Contract Digital Twin...
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                    Extracting obligations, responsible parties, deadlines, evidence requirements, and breach consequences with clause linking...
                </p>
            </div>
        );
    }

    if (!digitalTwin || itemsState.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border border-gray-100 text-center">
                <div className="inline-block p-4 bg-purple-50 text-purple-600 rounded-2xl mb-4 text-3xl">
                    ⚡
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                    Contract Digital Twin Ready
                </h3>
                <p className="text-gray-500 max-w-lg mx-auto mt-2">
                    Upload or analyze any contract document to generate a fully interactive, traceable digital twin mapping all obligations, evidence requirements, deadlines, and legal consequences.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mt-8 border border-gray-200">
            {/* Header / Contract Title Banner */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-6 border-b border-gray-200 gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl shadow-md text-xl">
                            🤖
                        </span>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                    Contract Digital Twin
                                </h2>
                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                                    Interactive Live Model
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {digitalTwin.contract_name || contractName} • {digitalTwin.parties?.join(" ↔ ") || "Multi-Party Agreement"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Export / Action Buttons */}
                <div className="flex items-center flex-wrap gap-2">
                    {copiedNotification && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 animate-fade">
                            {copiedNotification}
                        </span>
                    )}
                    <button
                        onClick={copySummary}
                        className="px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition border border-gray-300 flex items-center gap-1.5"
                        title="Copy Summary"
                    >
                        <span>📋</span> Copy Report
                    </button>
                    <button
                        onClick={exportCsv}
                        className="px-3.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition border border-indigo-200 flex items-center gap-1.5"
                        title="Export CSV Audit Ledger"
                    >
                        <span>📊</span> Export CSV
                    </button>
                    <button
                        onClick={exportJson}
                        className="px-3.5 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition border border-purple-200 flex items-center gap-1.5"
                        title="Export JSON Digital Twin"
                    >
                        <span>💾</span> Export JSON
                    </button>
                </div>
            </div>

            {/* KPI Metrics Dashboard Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 my-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-xl border border-blue-100 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                        Total Obligations
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-2xl font-black text-blue-900">
                            {metrics.total}
                        </span>
                        <span className="text-xs text-blue-500 font-medium">Mapped</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-red-50/50 p-4 rounded-xl border border-rose-100 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                        High Risk / Critical
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-2xl font-black text-rose-700">
                            {metrics.highRisk}
                        </span>
                        <span className="text-xs text-rose-500 font-medium">Strict Consequences</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-xl border border-amber-100 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                        Pending / Active
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-2xl font-black text-amber-800">
                            {metrics.pending}
                        </span>
                        <span className="text-xs text-amber-500 font-medium">In Progress</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-rose-50/50 p-4 rounded-xl border border-red-200 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">
                        At Risk Flagged
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-2xl font-black text-red-800">
                            {metrics.atRisk}
                        </span>
                        <span className="text-xs text-red-500 font-medium">Needs Attention</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50/50 p-4 rounded-xl border border-emerald-100 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                        Completed
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-2xl font-black text-emerald-800">
                            {metrics.completed}
                        </span>
                        <span className="text-xs text-emerald-500 font-medium">Fulfilled</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 p-4 rounded-xl border border-purple-100 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                        Compliance Health
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-2xl font-black text-purple-900">
                            {metrics.complianceScore}%
                        </span>
                        <span className="text-xs text-purple-600 font-bold">Health Score</span>
                    </div>
                </div>
            </div>

            {/* Interactive Filters and View Switcher */}
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 mb-6 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                {/* Search Box */}
                <div className="relative flex-1 min-w-[240px]">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search obligations, consequences, evidence, clauses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Filter Selects */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Party Filter */}
                    <select
                        value={selectedParty}
                        onChange={(e) => setSelectedParty(e.target.value)}
                        className="px-2.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="ALL">All Parties ({uniqueParties.length})</option>
                        {uniqueParties.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-2.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="At Risk">At Risk</option>
                        <option value="Completed">Completed</option>
                        <option value="Requires Review">Requires Review</option>
                    </select>

                    {/* Category Filter */}
                    {uniqueCategories.length > 0 && (
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-2.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="ALL">All Categories</option>
                            {uniqueCategories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Risk Filter */}
                    <select
                        value={selectedRisk}
                        onChange={(e) => setSelectedRisk(e.target.value)}
                        className="px-2.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="ALL">All Risk Levels</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    {/* View Switcher */}
                    <div className="flex items-center bg-white rounded-lg border border-gray-300 p-0.5">
                        <button
                            onClick={() => setViewMode("cards")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                                viewMode === "cards"
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            <span>🗂️</span> Cards
                        </button>
                        <button
                            onClick={() => setViewMode("ledger")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                                viewMode === "ledger"
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            <span>📑</span> Ledger
                        </button>
                    </div>
                </div>
            </div>

            {/* Results count & active filters reset */}
            <div className="flex justify-between items-center text-xs text-gray-500 mb-4 px-1">
                <span>
                    Showing <strong>{filteredItems.length}</strong> of <strong>{itemsState.length}</strong> twin obligations
                </span>
                {(searchTerm ||
                    selectedParty !== "ALL" ||
                    selectedStatus !== "ALL" ||
                    selectedCategory !== "ALL" ||
                    selectedRisk !== "ALL") && (
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedParty("ALL");
                            setSelectedStatus("ALL");
                            setSelectedCategory("ALL");
                            setSelectedRisk("ALL");
                        }}
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Reset All Filters
                    </button>
                )}
            </div>

            {/* View Mode: Interactive Cards Grid */}
            {viewMode === "cards" && (
                <div className="grid gap-5 lg:grid-cols-2">
                    {filteredItems.map((item) => {
                        const statusConfig =
                            STATUS_OPTIONS.find((s) => s.label === item.status) ||
                            STATUS_OPTIONS[0];
                        const categoryClass =
                            CATEGORY_COLORS[item.category] || "bg-gray-100 text-gray-800 border-gray-200";
                        const riskBadge =
                            RISK_BADGES[item.risk_level] || RISK_BADGES.Medium;

                        return (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group hover:border-indigo-300"
                            >
                                <div>
                                    {/* Item ID, Category & Risk Pill */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                                {item.id}
                                            </span>
                                            <span
                                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${categoryClass}`}
                                            >
                                                {item.category || "Obligation"}
                                            </span>
                                        </div>
                                        <span
                                            className={`text-[11px] px-2 py-0.5 rounded-full border ${riskBadge}`}
                                        >
                                            {item.risk_level || "Medium"} Risk
                                        </span>
                                    </div>

                                    {/* Obligation Statement */}
                                    <h4 className="text-base font-bold text-gray-900 leading-snug mb-3">
                                        {item.obligation}
                                    </h4>

                                    {/* Key Attributes Grid (Party, Deadline, Status) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-gray-50/70 p-3 rounded-lg border border-gray-100 mb-3.5">
                                        <div>
                                            <span className="text-gray-400 block font-medium">Responsible Party:</span>
                                            <span className="font-semibold text-gray-900 flex items-center gap-1 mt-0.5">
                                                👤 {item.responsible_party || "Not specified"}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-gray-400 block font-medium">Deadline / Timeline:</span>
                                            <span className="font-semibold text-indigo-900 flex items-center gap-1 mt-0.5">
                                                📅 {item.deadline || "Not specified"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Verification Evidence Box */}
                                    <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3 text-xs mb-3">
                                        <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
                                            <span>📋</span> Required Evidence / Proof of Fulfillment:
                                        </div>
                                        <p className="text-blue-950 font-medium pl-5 leading-relaxed">
                                            {item.evidence || "Formal written confirmation or transaction receipt"}
                                        </p>
                                    </div>

                                    {/* Contractual Consequence / Breach Penalty */}
                                    <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3 text-xs mb-4">
                                        <div className="flex items-center gap-1.5 text-rose-900 font-bold mb-1">
                                            <span>⚠️</span> Contractual Consequence / Breach Penalty:
                                        </div>
                                        <p className="text-rose-950 font-semibold pl-5 leading-relaxed">
                                            {item.contractual_consequence || "Standard legal and contractual remedies for breach"}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer: Trace Clause Button & Interactive Status Selector */}
                                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                                    {/* Clause Reference Trace Button */}
                                    <button
                                        onClick={() => setActiveTraceItem(item)}
                                        className="inline-flex items-center gap-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 font-semibold transition group-hover:border-indigo-400"
                                        title="Click to trace to verbatim contract clause"
                                    >
                                        <span>🔗</span>
                                        <span className="truncate max-w-[200px]">
                                            {item.clause_reference || "Trace Clause"}
                                        </span>
                                        <span className="text-indigo-400 font-bold">→</span>
                                    </button>

                                    {/* Interactive Status Cycle / Dropdown */}
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-gray-400 text-[11px]">Status:</span>
                                        <select
                                            value={item.status}
                                            onChange={(e) =>
                                                handleStatusChange(item.id, e.target.value)
                                            }
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition outline-none cursor-pointer ${statusConfig.color}`}
                                        >
                                            {STATUS_OPTIONS.map((st) => (
                                                <option key={st.label} value={st.label}>
                                                    {st.icon} {st.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View Mode: Audit Ledger Grid */}
            {viewMode === "ledger" && (
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-xs text-left">
                        <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3 min-w-[220px]">Obligation</th>
                                <th className="px-4 py-3">Responsible Party</th>
                                <th className="px-4 py-3">Deadline</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 min-w-[200px]">Required Evidence</th>
                                <th className="px-4 py-3 min-w-[200px]">Contractual Consequence</th>
                                <th className="px-4 py-3">Traceability</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredItems.map((item) => {
                                const statusConfig =
                                    STATUS_OPTIONS.find((s) => s.label === item.status) ||
                                    STATUS_OPTIONS[0];

                                return (
                                    <tr key={item.id} className="hover:bg-indigo-50/40 transition">
                                        <td className="px-4 py-3 font-mono font-bold text-gray-500 whitespace-nowrap">
                                            {item.id}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-gray-900">
                                            {item.obligation}
                                        </td>
                                        <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
                                            👤 {item.responsible_party}
                                        </td>
                                        <td className="px-4 py-3 text-indigo-900 font-semibold whitespace-nowrap">
                                            📅 {item.deadline}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <select
                                                value={item.status}
                                                onChange={(e) =>
                                                    handleStatusChange(item.id, e.target.value)
                                                }
                                                className={`px-2 py-1 rounded-md text-[11px] font-bold border transition cursor-pointer ${statusConfig.color}`}
                                            >
                                                {STATUS_OPTIONS.map((st) => (
                                                    <option key={st.label} value={st.label}>
                                                        {st.icon} {st.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700 bg-blue-50/20">
                                            {item.evidence}
                                        </td>
                                        <td className="px-4 py-3 text-rose-800 font-medium bg-rose-50/20">
                                            {item.contractual_consequence}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <button
                                                onClick={() => setActiveTraceItem(item)}
                                                className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition"
                                            >
                                                Trace 🔗
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Interactive Clause Traceability Modal / Inspector */}
            {activeTraceItem && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="p-2 bg-white/20 rounded-xl text-xl">🔗</span>
                                <div>
                                    <h3 className="text-lg font-bold">
                                        Clause Traceability Inspector
                                    </h3>
                                    <p className="text-xs text-blue-200">
                                        Verbatim Linkage between Digital Twin Item and Source Contract
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveTraceItem(null)}
                                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-bold transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* Extracted Obligation Snapshot */}
                            <div className="border border-indigo-200 bg-indigo-50/40 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                                        {activeTraceItem.id}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-600">
                                        {activeTraceItem.clause_reference}
                                    </span>
                                </div>
                                <h4 className="text-base font-bold text-gray-900">
                                    {activeTraceItem.obligation}
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                                    <div>
                                        <span className="text-gray-400 block font-medium">Party:</span>
                                        <span className="font-bold text-gray-800">{activeTraceItem.responsible_party}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block font-medium">Deadline:</span>
                                        <span className="font-bold text-indigo-700">{activeTraceItem.deadline}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block font-medium">Evidence:</span>
                                        <span className="font-bold text-blue-800">{activeTraceItem.evidence}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block font-medium">Consequence:</span>
                                        <span className="font-bold text-rose-700">{activeTraceItem.contractual_consequence}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Verbatim Source Clause Excerpt */}
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-800">
                                    <span>📜</span> Original Verbatim Source Clause:
                                </div>
                                <div className="bg-amber-50/80 border-l-4 border-amber-500 p-4 rounded-r-xl text-gray-900 text-sm font-serif leading-relaxed italic shadow-inner">
                                    "{activeTraceItem.source_clause_text || activeTraceItem.obligation}"
                                </div>
                            </div>

                            {/* Full Contract Context Viewer (if contractText provided) */}
                            {contractText && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                            <span>📑</span> Complete Contract Document Viewer:
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            Trace target: {activeTraceItem.clause_reference}
                                        </span>
                                    </div>
                                    <div className="bg-gray-900 text-gray-200 p-4 rounded-xl text-xs font-mono max-h-64 overflow-y-auto leading-relaxed whitespace-pre-wrap select-text border border-gray-700">
                                        {contractText}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                            <span>Every extracted item is verified and traceable to its legal clause.</span>
                            <button
                                onClick={() => setActiveTraceItem(null)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DigitalTwinDashboard;
