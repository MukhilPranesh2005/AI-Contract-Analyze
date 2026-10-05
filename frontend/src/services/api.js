import axios from "axios";
import {
    SAMPLE_CONTRACTS,
    generateMockAnalysis,
    generateMockChatReply,
    generateMockOcrResult,
} from "./mockDemoData";

// Resolve API base URL (can be customized via VITE_API_URL or defaults to localhost)
const rawBaseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: rawBaseURL,
    timeout: 30000,
});

// Attach Authorization header from localStorage if token exists
api.interceptors.request.use(
    (config) => {
        try {
            const storedUser = localStorage.getItem("lexitwin_auth_user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user?.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            }
        } catch (e) {
            console.error("Error reading auth token:", e);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Fallback to interactive demo mock data if backend server is unreachable
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const url = error.config?.url || "";
        const isNetworkError = !error.response || error.code === "ERR_NETWORK" || error.code === "ECONNABORTED" || error.response?.status >= 500 || error.response?.status === 404;

        if (isNetworkError) {
            console.warn(`[LexiTwin Live Demo Fallback] Backend not reachable at ${url}. Serving interactive demo data.`);

            // 1. Auth Login / Register / Demo
            if (url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/demo")) {
                let parsedBody = {};
                try {
                    parsedBody = typeof error.config.data === "string" ? JSON.parse(error.config.data) : (error.config.data || {});
                } catch {
                    parsedBody = {};
                }
                const email = parsedBody.email || "counsel@enterprise.law";
                const name = parsedBody.name || email.split("@")[0].replace(".", " ").replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
                return {
                    status: 200,
                    statusText: "OK (Demo Mode)",
                    data: {
                        success: true,
                        user: {
                            id: "usr_" + Math.random().toString(36).substring(2, 9),
                            name: name || "Sarah Jenkins, Esq.",
                            email: email,
                            role: parsedBody.role || "Senior Legal Counsel",
                            organization: parsedBody.organization || "Enterprise Legal Ops",
                            token: "tok_demo_" + Math.random().toString(36).substring(2, 12),
                        },
                    },
                };
            }

            // 2. Upload Document
            if (url.includes("/upload")) {
                let text = SAMPLE_CONTRACTS[0].text;
                let filename = "sample_contract.pdf";

                if (error.config.data instanceof FormData) {
                    const file = error.config.data.get("file");
                    if (file && file.name) {
                        filename = file.name;
                        const match = SAMPLE_CONTRACTS.find(
                            (c) => c.filename.toLowerCase() === file.name.toLowerCase() || file.name.toLowerCase().includes(c.id)
                        );
                        if (match) {
                            text = match.text;
                        } else {
                            // Synthesize contract text based on file name
                            text = `LEGAL CONTRACT & SERVICE AGREEMENT (${file.name})\n` + SAMPLE_CONTRACTS[0].text;
                        }
                    }
                }

                return {
                    status: 200,
                    statusText: "OK (Demo Mode)",
                    data: {
                        filename,
                        text,
                        message: "File uploaded and processed via LexiTwin Engine",
                    },
                };
            }

            // 3. Analyze Document & Digital Twin Extraction
            if (url.includes("/analyze")) {
                let text = "";
                try {
                    const dataObj = typeof error.config.data === "string" ? JSON.parse(error.config.data) : error.config.data;
                    text = dataObj?.text || "";
                } catch {
                    text = "";
                }

                const analysis = generateMockAnalysis(text);
                return {
                    status: 200,
                    statusText: "OK (Demo Mode)",
                    data: {
                        analysis,
                    },
                };
            }

            // 4. OCR Image Extraction
            if (url.includes("/ocr/extract")) {
                const ocrResult = generateMockOcrResult();
                return {
                    status: 200,
                    statusText: "OK (Demo Mode)",
                    data: ocrResult,
                };
            }

            // 5. AI Legal Chat
            if (url.includes("/chat")) {
                let message = "";
                let docText = "";
                try {
                    const dataObj = typeof error.config.data === "string" ? JSON.parse(error.config.data) : error.config.data;
                    message = dataObj?.message || "";
                    docText = dataObj?.document_text || "";
                } catch {
                    message = "";
                }

                const reply = generateMockChatReply(message, docText);
                return {
                    status: 200,
                    statusText: "OK (Demo Mode)",
                    data: {
                        reply,
                    },
                };
            }
        }

        return Promise.reject(error);
    }
);

export default api;