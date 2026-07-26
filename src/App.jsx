import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AiReportPage from "./pages/AiReportPage";
import LoginPage from "./pages/LoginPage";
import WorkLogPage from "./pages/WorkLogPage";
import DashboardPage from "./pages/DashboardPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/work" element={<WorkLogPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports/ai" element={<AiReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;