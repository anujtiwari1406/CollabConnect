import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CollabLanding from "./pages/collabLanding";
import BrandMatchingForm from "./pages/BrandMatchingForm";
import InfluencerMatchingForm from "./pages/InfluencerMatchingForm";
import BrandDashboard from "./pages/brandDashboard";
import InfluencerDashboard from "./pages/InfluencerDashboard";
import MatchResultPage from "./pages/MatchResultPage";
import ChatPage from "./pages/ChatPage";
import History from "./pages/History";
import DeliverablesDashboard from "./pages/DeliverablesDashboard";
import CollabInsights from "./pages/CollabInsights";
import SafetyTrust from "./pages/SafetyTrust";
import BrandForm from "./pages/brandForm";
import InfluencerForm from "./pages/influencerForm";
import Auth from "./pages/Auth";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Context providers
import { SocketProvider } from "./context/SocketContext";

export default function App() {
  return (
    <Router>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<CollabLanding />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          
          {/* Protected Routes */}
          <Route path="/brand-form" element={<ProtectedRoute><BrandForm /></ProtectedRoute>} />
          <Route path="/influencer-form" element={<ProtectedRoute><InfluencerForm /></ProtectedRoute>} />
          <Route path="/brand-matching" element={<ProtectedRoute><BrandMatchingForm /></ProtectedRoute>} />
          <Route path="/influencer-matching" element={<ProtectedRoute><InfluencerMatchingForm /></ProtectedRoute>} />
          <Route path="/brand-dashboard" element={<ProtectedRoute><BrandDashboard /></ProtectedRoute>} />
          <Route path="/influencer-dashboard" element={<ProtectedRoute><InfluencerDashboard /></ProtectedRoute>} />
          <Route path="/match-results" element={<ProtectedRoute><MatchResultPage /></ProtectedRoute>} />
          <Route path="/chat/:chatId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/chat/recent" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/deliverables" element={<ProtectedRoute><DeliverablesDashboard /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><CollabInsights /></ProtectedRoute>} />
          <Route path="/safety" element={<ProtectedRoute><SafetyTrust /></ProtectedRoute>} />
        </Routes>
      </SocketProvider>
    </Router>
  );
}


