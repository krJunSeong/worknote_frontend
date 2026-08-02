import { useEffect, useMemo, useState } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import "./AppLayout.css";

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const userId = Number(localStorage.getItem("userId"));
  const nickname = localStorage.getItem("nickname") || "";

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(collapsed));
  }, [collapsed]);

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith("/report")) {
      return t("navigation.aiReport");
    }

    if (location.pathname.startsWith("/work/create")) {
      return t("navigation.workLogCreate");
    }

    if (location.pathname.startsWith("/work/edit")) {
      return t("workLog.editTitle");
    }

    if (location.pathname.startsWith("/work")) {
      return t("navigation.workLogList");
    }

    return t("navigation.dashboard");
  }, [location.pathname, t]);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("loginId");
    localStorage.removeItem("nickname");

    navigate("/login", { replace: true });
  };

  return (
    <div className={`app-shell ${collapsed ? "is-collapsed" : ""}`}>
      <AppSidebar
        collapsed={collapsed}
        nickname={nickname}
        onLogout={handleLogout}
        onToggle={() => setCollapsed((previous) => !previous)}
      />

      <div className="app-shell-main">
        <header className="app-topbar">
          <div className="app-topbar-title">
            <span>{t("navigation.workspace")}</span>
            <strong>{pageTitle}</strong>
          </div>

          <LanguageSelector />
        </header>

        <div className="app-shell-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
