import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import { AIProvider } from "./context/AIContext";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import VisaScoring from "./pages/VisaScoring";
import TrackRequest from "./pages/TrackRequest";
import Dashboard from "./pages/Dashboard";
import Orientation from "./pages/Orientation";
import DocumentsLibrary from "./pages/DocumentsLibrary";
import TravelFlow from "./pages/TravelFlow";
import SmartDiagnosis from "./pages/SmartDiagnosis";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/a-propos" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/orientation" element={<Orientation />} />
      <Route path="/travel-flow" element={<TravelFlow />} />
      <Route path="/smart-diagnosis" element={<SmartDiagnosis />} />
      <Route path="/instructions" element={<DocumentsLibrary />} />
      <Route path="/documents" element={<Navigate to="/instructions" replace />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/visa-map" element={<Navigate to="/services" replace />} />
      <Route path="/visa-scoring" element={<VisaScoring />} />
      <Route path="/suivi" element={<TrackRequest />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() { 
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AIProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Navbar />
              <AppRoutes />
              <Footer />
              <Chatbot />
            </BrowserRouter>
          </AIProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
