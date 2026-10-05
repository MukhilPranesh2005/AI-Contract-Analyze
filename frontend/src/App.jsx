import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import OcrPortal from "./pages/OcrPortal";
import DigitalTwinPortal from "./pages/DigitalTwinPortal";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/digital-twin"
                    element={
                        <ProtectedRoute>
                            <DigitalTwinPortal />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analysis"
                    element={
                        <ProtectedRoute>
                            <DigitalTwinPortal />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ocr"
                    element={
                        <ProtectedRoute>
                            <OcrPortal />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;