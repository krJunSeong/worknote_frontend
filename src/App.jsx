import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import WorkLogListPage from "./pages/WorkLogListPage";
import WorkLogEditorPage from "./pages/WorkLogEditorPage";
import ReportPage from "./pages/ReportPage";
import CalendarPage from "./pages/CalendarPage";
import GoalPage from "./pages/GoalPage";
import WorkLogDetailPage from "./pages/WorkLogDetailPage";
import LandingPage from "./pages/LandingPage";
import { useLanguage } from "./i18n/LanguageContext";

function getInitialRoute() {
  return localStorage.getItem("userId")
    ? "/dashboard"
    : "/login";
}

function App() {
  const { language } = useLanguage();

  useEffect(() => {
    document.title =
      language === "ja"
        ? "WorkNote | AI業務記録"
        : "WorkNote | AI 업무 기록";
  }, [language]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* <Route
          path="/"
          element={<Navigate to={getInitialRoute()} replace />}
        /> */}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/work"
            element={<Navigate to="/work/list" replace />}
          />
          <Route path="/work/list" element={<WorkLogListPage />} />
          <Route path="/work/create" element={<WorkLogEditorPage />} />
          <Route
            path="/work/edit/:workLogId"
            element={<WorkLogEditorPage />}
          />
          <Route
            path="/work/view/:workLogId"
            element={<WorkLogDetailPage />}
          />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/goals" element={<GoalPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={getInitialRoute()} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
