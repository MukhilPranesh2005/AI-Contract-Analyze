import { useState, useRef, useEffect } from "react";
import api from "../services/api";

import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import RiskCard from "../components/RiskCard";
import ClauseCard from "../components/ClauseCard";
import RecommendationCard from "../components/RecommendationCard";
import ObligationsCard from "../components/ObligationsCard";
import DigitalTwinDashboard from "../components/DigitalTwinDashboard";
import ChatBox from "../components/ChatBox";
import DnaBackground from "../components/DnaBackground";

const SAMPLE_DOCUMENTS = [
    {
        title: "Sample NDA Image",
        description: "Confidentiality & Non-Disclosure Agreement",
        svgData: "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000" style="background:#ffffff; font-family:serif; color:#111827; padding:40px;">
  <text x="400" y="70" font-size="22" font-weight="bold" text-anchor="middle" fill="#1e3a8a">NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT</text>
  <line x1="100" y1="85" x2="700" y2="85" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="60" y="130" font-size="14" fill="#334155">This Agreement is entered into on October 15, 2025 by and between:</text>
  <text x="60" y="160" font-size="14" font-weight="bold" fill="#0f172a">1. Disclosing Party: Apex Global Technologies Inc., Delaware, USA.</text>
  <text x="60" y="185" font-size="14" font-weight="bold" fill="#0f172a">2. Receiving Party: Quantum Innovations Ltd., London, UK.</text>
  
  <text x="60" y="230" font-size="16" font-weight="bold" fill="#1e40af">1. Definition of Confidential Information</text>
  <text x="60" y="255" font-size="13" fill="#334155">All proprietary software code, customer lists, technical data, architecture schematics,</text>
  <text x="60" y="275" font-size="13" fill="#334155">financial records, and business secrets disclosed in writing or orally.</text>

  <text x="60" y="320" font-size="16" font-weight="bold" fill="#1e40af">2. Obligations of Receiving Party</text>
  <text x="60" y="345" font-size="13" fill="#334155">The Receiving Party shall maintain strict confidentiality using reasonable care,</text>
  <text x="60" y="365" font-size="13" fill="#334155">shall not disclose information to third parties without prior written consent, and</text>
  <text x="60" y="385" font-size="13" fill="#334155">must destroy all confidential materials within 14 days of termination.</text>

  <text x="60" y="430" font-size="16" font-weight="bold" fill="#1e40af">3. Term and Duration</text>
  <text x="60" y="455" font-size="13" fill="#334155">This Agreement shall remain in full force and effect for 3 years from the Effective Date.</text>
  <text x="60" y="475" font-size="13" fill="#334155">Trade secrets obligations shall survive perpetually.</text>

  <text x="60" y="520" font-size="16" font-weight="bold" fill="#1e40af">4. Liquidated Damages & Liability</text>
  <text x="60" y="545" font-size="13" fill="#334155">Any breach of confidentiality terms shall incur liquidated damages of $150,000 USD</text>
  <text x="60" y="565" font-size="13" fill="#334155">without prejudice to injunctive relief or judicial remedies.</text>

  <text x="60" y="610" font-size="16" font-weight="bold" fill="#1e40af">5. Governing Law & Jurisdiction</text>
  <text x="60" y="635" font-size="13" fill="#334155">Governed by the laws of the State of New York, excluding conflict of law rules.</text>

  <text x="60" y="720" font-size="14" font-weight="bold">IN WITNESS WHEREOF, the parties hereto have executed this Agreement:</text>
  <text x="60" y="780" font-size="14" fill="#0f172a">Signature: __________________________</text>
  <text x="60" y="805" font-size="13" fill="#64748b">Apex Global Technologies Inc. (CEO)</text>

  <text x="450" y="780" font-size="14" fill="#0f172a">Signature: __________________________</text>
  <text x="450" y="805" font-size="13" fill="#64748b">Quantum Innovations Ltd. (Director)</text>
</svg>
`)
    }
];

function OcrPortal() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [imageInfo, setImageInfo] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // OCR extraction states
    const [isExtracting, setIsExtracting] = useState(false);
    const [ocrError, setOcrError] = useState("");
    const [extractedText, setExtractedText] = useState("");
    const [ocrStats, setOcrStats] = useState(null);
    const [copied, setCopied] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Analysis states
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState("");
    const [summary, setSummary] = useState("");
    const [risk, setRisk] = useState("");
    const [clauses, setClauses] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [obligations, setObligations] = useState([]);
    const [digitalTwin, setDigitalTwin] = useState(null);
    const [obligationsError, setObligationsError] = useState(false);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    const fileInputRef = useRef(null);
    const textEditorRef = useRef(null);
    const analysisSectionRef = useRef(null);

    // Handle paste event from clipboard (e.g. screenshot paste)
    useEffect(() => {
        function handlePaste(e) {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    const blob = items[i].getAsFile();
                    loadLocalFile(blob, `clipboard_image_${Date.now()}.png`);
                    break;
                }
            }
        }
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, []);

    function loadLocalFile(file, overrideName) {
        if (!file) return;
        const name = overrideName || file.name;
        setSelectedImage(file);
        setOcrError("");

        const previewUrl = URL.createObjectURL(file);
        setImagePreviewUrl(previewUrl);

        setImageInfo({
            name: name,
            size: (file.size / 1024).toFixed(1) + " KB",
            type: file.type || "image/png",
            lastModified: new Date(file.lastModified || Date.now()).toLocaleDateString()
        });

        // Trigger OCR automatically when image is chosen
        extractTextFromImageFile(file, name);
    }

    function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (file) {
            loadLocalFile(file);
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave() {
        setIsDragging(false);
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && (file.type.startsWith("image/") || file.name.match(/\.(png|jpg|jpeg|webp|bmp|tiff|tif)$/i))) {
            loadLocalFile(file);
        } else {
            setOcrError("Please drop a valid image file (PNG, JPG, JPEG, WEBP, BMP, TIFF).");
        }
    }

    // Load sample document
    async function loadSample(sample) {
        setOcrError("");
        setImagePreviewUrl(sample.svgData);
        setImageInfo({
            name: `${sample.title}.svg`,
            size: "18.4 KB",
            type: "image/svg+xml",
            lastModified: "Sample Template"
        });

        // Convert sample SVG to image file/blob
        try {
            const res = await fetch(sample.svgData);
            const blob = await res.blob();
            const sampleFile = new File([blob], `${sample.title}.svg`, { type: "image/svg+xml" });
            setSelectedImage(sampleFile);
            extractTextFromImageFile(sampleFile, sample.title);
        } catch (err) {
            console.error("Failed to load sample:", err);
            setOcrError("Could not load sample image.");
        }
    }

    // OCR API Call
    async function extractTextFromImageFile(file, filename) {
        setIsExtracting(true);
        setOcrError("");
        setExtractedText("");
        setOcrStats(null);
        setHasAnalyzed(false);

        try {
            const formData = new FormData();
            formData.append("file", file, filename || file.name || "document.png");

            const response = await api.post("/ocr/extract", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const data = response.data;
            setExtractedText(data.text || "");
            setOcrStats({
                wordCount: data.word_count || (data.text ? data.text.split(/\s+/).length : 0),
                charCount: data.char_count || (data.text ? data.text.length : 0),
                lineCount: data.line_count || (data.text ? data.text.split("\n").length : 0),
                mimeType: data.mime_type || file.type
            });
        } catch (err) {
            console.error("OCR Extraction failed:", err);
            const msg =
                err.response?.data?.detail ||
                err.message ||
                "Failed to extract text from the image. Please verify backend service.";
            setOcrError(msg);
        } finally {
            setIsExtracting(false);
        }
    }

    // Trigger AI Contract Analysis on Extracted OCR Text
    async function analyzeOcrText() {
        if (!extractedText.trim()) {
            setAnalysisError("No text available to analyze. Please extract OCR text first.");
            return;
        }

        setIsAnalyzing(true);
        setAnalysisError("");

        try {
            const analyzeResponse = await api.post("/analyze", {
                text: extractedText
            });

            const analysis = analyzeResponse.data.analysis;

            setSummary(analysis.summary || "");
            setRisk(analysis.risk || "");
            setClauses(analysis.important_clauses || analysis.clauses || []);
            setRecommendations(analysis.recommendations || []);

            if (analysis && Array.isArray(analysis.obligations)) {
                setObligations(analysis.obligations);
                setObligationsError(false);
            } else {
                setObligations([]);
                setObligationsError(false);
            }

            if (analysis && analysis.digital_twin) {
                setDigitalTwin(analysis.digital_twin);
            } else {
                setDigitalTwin(null);
            }

            setHasAnalyzed(true);

            // Smooth scroll to analysis section
            setTimeout(() => {
                if (analysisSectionRef.current) {
                    analysisSectionRef.current.scrollIntoView({ behavior: "smooth" });
                }
            }, 150);
        } catch (err) {
            console.error("Analysis of OCR text failed:", err);
            const msg =
                err.response?.data?.detail ||
                err.message ||
                "Failed to analyze extracted document text.";
            setAnalysisError(msg);
        } finally {
            setIsAnalyzing(false);
        }
    }

    function handleCopy() {
        if (!extractedText) return;
        navigator.clipboard.writeText(extractedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleDownload(format = "txt") {
        if (!extractedText) return;
        const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const baseName = (imageInfo?.name || "extracted_contract").replace(/\.[^/.]+$/, "");
        link.href = url;
        link.download = `${baseName}_ocr.${format}`;
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            <Navbar />

            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900 text-white py-10 px-6 shadow-md mb-8">
                {/* Animated White DNA Structures Background */}
                <DnaBackground style={{ opacity: 0.75 }} />

                <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3 tracking-wide">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            Multimodal Vision OCR Engine
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Document OCR Text Extraction
                        </h1>
                        <p className="text-indigo-200 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
                            Upload scanned legal agreements, contract photos, PDF screenshots, invoices, or legal stamps.
                            Our high-fidelity vision AI transcribes clauses verbatim and instantly runs comprehensive legal risk analysis.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition flex items-center gap-2 cursor-pointer text-sm"
                        >
                            <span>📁</span>
                            <span>Upload Image</span>
                        </button>
                        <button
                            onClick={() => loadSample(SAMPLE_DOCUMENTS[0])}
                            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl backdrop-blur-sm transition flex items-center gap-2 cursor-pointer text-sm"
                        >
                            <span>✨</span>
                            <span>Try Sample NDA</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Hidden input for upload */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/tiff,.png,.jpg,.jpeg,.webp,.bmp,.tiff"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Upload & Drag Zone */}
                {!imagePreviewUrl && (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
                            isDragging
                                ? "border-indigo-600 bg-indigo-50 scale-[1.01] shadow-xl"
                                : "border-indigo-300 bg-white hover:border-indigo-500 hover:bg-slate-50/80 shadow-sm"
                        }`}
                    >
                        <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-indigo-100 to-blue-100 text-indigo-600 rounded-2xl flex items-center justify-center text-4xl shadow-inner mb-4">
                            📷
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                            Drag & Drop Contract Image here, or Click to Browse
                        </h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                            Supports PNG, JPG, JPEG, WEBP, BMP, TIFF photos, scanned agreements, and clipboard screenshots (Press <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-xs font-mono font-bold">Ctrl+V</kbd> anywhere).
                        </p>
                        <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                            <span>💡 Tip: High resolution and clear lighting yield the most precise clause extraction</span>
                        </div>
                    </div>
                )}

                {/* Error Banner */}
                {ocrError && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3 shadow-sm">
                        <span className="text-xl">⚠️</span>
                        <div>
                            <p className="font-semibold">OCR Processing Error</p>
                            <p className="text-sm mt-0.5">{ocrError}</p>
                        </div>
                    </div>
                )}

                {/* Main Workspace: Image Preview + Extracted Text */}
                {imagePreviewUrl && (
                    <div className="grid lg:grid-cols-12 gap-6 mt-2">
                        {/* Left Column: Image Viewer (5 cols) */}
                        <div className="lg:col-span-5 bg-white rounded-2xl shadow-md border border-slate-200/80 p-5 flex flex-col">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🖼️</span>
                                    <h2 className="font-bold text-slate-800 text-base">Original Document Image</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
                                    >
                                        Change Image
                                    </button>
                                </div>
                            </div>

                            {/* Image container */}
                            <div className="relative rounded-xl overflow-hidden bg-slate-900/5 border border-slate-200 flex-1 min-h-[360px] max-h-[540px] flex items-center justify-center p-2 group">
                                <img
                                    src={imagePreviewUrl}
                                    alt="Uploaded contract for OCR"
                                    className="max-h-[500px] w-auto object-contain rounded-lg shadow-sm transition group-hover:scale-[1.01]"
                                />
                                {isExtracting && (
                                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 text-center animate-fade-in">
                                        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="font-bold text-lg">AI Vision OCR in Progress...</p>
                                        <p className="text-xs text-indigo-200 mt-1">Scanning text lines, legal clauses & structure</p>
                                    </div>
                                )}
                            </div>

                            {/* File details footer */}
                            {imageInfo && (
                                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 text-center text-xs text-slate-500">
                                    <div className="truncate px-1">
                                        <span className="font-semibold block text-slate-700">File</span>
                                        <span className="truncate block" title={imageInfo.name}>{imageInfo.name}</span>
                                    </div>
                                    <div className="px-1 border-x border-slate-200">
                                        <span className="font-semibold block text-slate-700">Size</span>
                                        <span>{imageInfo.size}</span>
                                    </div>
                                    <div className="px-1">
                                        <span className="font-semibold block text-slate-700">Status</span>
                                        <span className={isExtracting ? "text-amber-600 font-semibold" : "text-emerald-600 font-semibold"}>
                                            {isExtracting ? "Extracting..." : "Ready"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: OCR Text Workspace & Actions (7 cols) */}
                        <div className="lg:col-span-7 bg-white rounded-2xl shadow-md border border-slate-200/80 p-5 flex flex-col">
                            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 mb-3 gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">📝</span>
                                    <div>
                                        <h2 className="font-bold text-slate-800 text-base">Extracted Document Text</h2>
                                        {ocrStats && (
                                            <p className="text-[11px] text-slate-500">
                                                {ocrStats.wordCount} words • {ocrStats.charCount} characters • {ocrStats.lineCount} lines
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                        onClick={handleCopy}
                                        disabled={!extractedText || isExtracting}
                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                        title="Copy extracted text"
                                    >
                                        <span>{copied ? "✅" : "📋"}</span>
                                        <span>{copied ? "Copied!" : "Copy Text"}</span>
                                    </button>

                                    <button
                                        onClick={() => handleDownload("txt")}
                                        disabled={!extractedText || isExtracting}
                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                        title="Download as TXT"
                                    >
                                        <span>💾</span>
                                        <span>Save TXT</span>
                                    </button>

                                    <button
                                        onClick={analyzeOcrText}
                                        disabled={!extractedText || isExtracting || isAnalyzing}
                                        className="px-4 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Analyzing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>⚖️</span>
                                                <span>Analyze Contract</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Search bar inside extracted text */}
                            <div className="mb-3 relative">
                                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search keywords in extracted text (e.g. damages, confidentiality, termination)..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-8 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                                />
                            </div>

                            {/* Text Area / Editor */}
                            <div className="flex-1 flex flex-col min-h-[340px]">
                                {isExtracting ? (
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                                        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                                        <p className="font-semibold text-slate-700 text-sm">Digitizing Image Text...</p>
                                        <p className="text-xs text-slate-400 mt-1">Our AI is reading and structuring the contract contents</p>
                                    </div>
                                ) : (
                                    <textarea
                                        ref={textEditorRef}
                                        value={extractedText}
                                        onChange={(e) => setExtractedText(e.target.value)}
                                        placeholder="Extracted contract text will appear here. You can also edit or tweak before running analysis..."
                                        className="w-full flex-1 min-h-[340px] p-4 text-xs sm:text-sm font-mono text-slate-800 bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-y leading-relaxed"
                                    />
                                )}
                            </div>

                            {/* Bottom action trigger banner */}
                            {extractedText && !hasAnalyzed && (
                                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">✨</span>
                                        <p className="text-xs text-indigo-900 font-medium">
                                            OCR extraction complete! Click <strong>Analyze Contract</strong> to inspect risks, clauses, and obligations.
                                        </p>
                                    </div>
                                    <button
                                        onClick={analyzeOcrText}
                                        disabled={isAnalyzing}
                                        className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
                                    >
                                        {isAnalyzing ? "Analyzing..." : "Analyze Contract Now →"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Analysis Error */}
                {analysisError && (
                    <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl shadow-sm">
                        ⚠️ <strong>Analysis Error:</strong> {analysisError}
                    </div>
                )}

                {/* Legal AI Analysis Results (Rendered upon clicking Analyze) */}
                {hasAnalyzed && (
                    <div ref={analysisSectionRef} className="mt-12 space-y-8 animate-fade-in">
                        <div className="flex items-center justify-between pb-3 border-b-2 border-indigo-200">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <span>⚖️</span>
                                    <span>Legal Analysis of OCR Document</span>
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    AI-generated risk assessment, clause breakdown, and contractual obligations
                                </p>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                                Analysis Ready
                            </span>
                        </div>

                        {/* Summary & Risk & Clauses & Recommendations Grid */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            <SummaryCard summary={summary} />
                            <RiskCard risk={risk} />
                            <ClauseCard clauses={clauses} />
                            <RecommendationCard recommendations={recommendations} />
                        </div>

                        {/* Contract Digital Twin Interactive Dashboard */}
                        {digitalTwin && (
                            <DigitalTwinDashboard
                                digitalTwin={digitalTwin}
                                contractText={extractedText}
                                contractName={imageInfo?.name || "OCR Contract Document"}
                            />
                        )}

                        {/* Obligations Card */}
                        <ObligationsCard
                            obligations={obligations}
                            error={obligationsError}
                            hasAnalyzed={hasAnalyzed}
                        />

                        {/* Interactive Legal Chatbot */}
                        <ChatBox
                            documentText={extractedText}
                            fileName={imageInfo?.name || "OCR Document"}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default OcrPortal;
