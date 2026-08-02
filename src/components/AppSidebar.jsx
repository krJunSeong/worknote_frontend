import { NavLink } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";

function AppSidebar({ nickname, onLogout }) {
  const { t } = useLanguage();

  return (
    <aside className="app-sidebar">
      <div>
        <div className="app-sidebar-brand"><span>W</span><strong>WorkNote</strong></div>
        <nav className="app-sidebar-nav" aria-label="Main navigation">
          <NavLink to="/dashboard" className={({ isActive }) => `app-nav-item ${isActive ? "is-active" : ""}`}>
            <span className="app-nav-icon">▦</span><span>{t("navigation.dashboard")}</span>
          </NavLink>
          <NavLink to="/work" className={({ isActive }) => `app-nav-item ${isActive ? "is-active" : ""}`}>
            <span className="app-nav-icon">✎</span><span>{t("navigation.workLog")}</span>
          </NavLink>
          <NavLink to="/report" className={({ isActive }) => `app-nav-item ${isActive ? "is-active" : ""}`}>
            <span className="app-nav-icon">▤</span><span>{t("navigation.aiReport")}</span>
          </NavLink>
        </nav>
      </div>

      <div className="app-sidebar-footer">
        <LanguageSelector />
        <div className="app-user-card">
          <div className="app-user-avatar">{(nickname || "U").slice(0, 1).toUpperCase()}</div>
          <div><strong>{nickname || t("navigation.user")}</strong><span>{t("navigation.member")}</span></div>
        </div>
        <button type="button" className="app-logout-button" onClick={onLogout}>{t("navigation.logout")}</button>
      </div>
    </aside>
  );
}

export default AppSidebar;
