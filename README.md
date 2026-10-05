# ⚖️ LexiTwin AI — Enterprise AI Contract & Document Analyzer

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-GitHub_Pages-gold?style=for-the-badge&logo=github)](https://YOUR_GITHUB_USERNAME.github.io/AI-Contract-Analyzer/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-Automated_Deploy-2ea44f?style=for-the-badge&logo=githubactions)](.github/workflows/deploy.yml)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_Python_3.12-009688?style=for-the-badge&logo=fastapi)](backend)
[![React](https://img.shields.io/badge/Frontend-React_18_Vite_Tailwind-61DAFB?style=for-the-badge&logo=react)](frontend)
[![Gemini](https://img.shields.io/badge/AI_Engine-Google_Gemini_Pro-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

> **LexiTwin AI** is an enterprise-grade AI legal intelligence system designed for in-depth contract analysis, automated obligation extraction, live contract digital twin simulation, neural OCR vision extraction, and interactive legal AI chat.

---

## 🌐 Live Interactive Demo

Try the application live in your browser (no installation needed!):

👉 **[Launch Live GitHub Pages Demo](https://YOUR_GITHUB_USERNAME.github.io/AI-Contract-Analyzer/)**

*(Note: Replace `YOUR_GITHUB_USERNAME` with your GitHub username once pushed).*

> 💡 **Demo Mode Included**: The live demo comes pre-loaded with interactive sample contracts (Mutual NDA, SaaS Master Agreement, Executive Employment Agreement) and an intelligent mock AI fallback so anyone can test the entire workflow (extraction, digital twins, OCR, chat) directly on GitHub Pages!

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 📑 **Document Analysis** | Upload PDF or DOCX contracts to generate comprehensive legal summaries, risk scoring, and key clause breakdowns. |
| 🎯 **Obligation & Responsibility Extraction** | Automatically maps **Who** (Party), **What** (Action), **When** (Deadline), and **Amount** (Financials) across all clauses. |
| 🤖 **Contract Digital Twin** | Creates a dynamic simulation model with compliance scores, risk matrices, and entity relationship maps. |
| 🔍 **Neural Vision OCR** | Upload photos or scanned contract images and extract full legal text with confidence metrics. |
| 💬 **Contextual Legal AI Chat** | Ask questions about your contract in real-time, clarify liabilities, and simulate negotiation strategies. |
| 🛡️ **Role-Based Authentication** | Enterprise session security with quick demo bypass for evaluators. |

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, Tailwind CSS v4, HashRouter (optimized for static GitHub Pages CDNs)
- **Backend**: FastAPI (Python), Google Gemini 1.5/Pro Generative AI SDK, PyPDF, python-docx, Pillow OCR
- **Deployment**: GitHub Pages (Automated GitHub Actions CI/CD) + Docker / Render ready

---

## 🚀 How to Enable the GitHub Pages Demo

Follow these simple steps after pushing this repository to GitHub:

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: setup live demo and github actions"
   git branch -M master
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/AI-Contract-Analyzer.git
   git push -u origin master
   ```
2. Go to your repository on **GitHub** → **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build the React app and deploy your live demo to:
   ```
   https://YOUR_GITHUB_USERNAME.github.io/AI-Contract-Analyzer/
   ```

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/AI-Contract-Analyzer.git
cd AI-Contract-Analyzer
```

### 2. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
# Set your Gemini API key in backend/.env:
# GEMINI_API_KEY=your_gemini_api_key_here

uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup (React + Vite)
```bash
cd ../frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).