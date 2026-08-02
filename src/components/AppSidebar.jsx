import { NavLink } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

function SidebarIcon({ name }) {
  const commonProps = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "dashboard") {
    return (
      <svg {...commonProps}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    );
  }

  if (name === "history") {
    return (
      <svg {...commonProps}>
        <path d="M4 5.5h16" />
        <path d="M4 12h16" />
        <path d="M4 18.5h11" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    );
  }

  if (name === "create") {
    return (
      <svg {...commonProps}>
        <path d="M12 5v14M5 12h14" />
        <rect x="3" y="3" width="18" height="18" rx="4" />
      </svg>
    );
  }

  if (name === "logout") {
    return (
      <svg {...commonProps}>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function AppSidebar({ collapsed, nickname, onLogout, onToggle }) {
  const { t } = useLanguage();

  const collapseLabel = collapsed
    ? t("navigation.expandSidebar")
    : t("navigation.collapseSidebar");

  const linkClassName = ({ isActive }) =>
    `app-nav-item ${isActive ? "is-active" : ""}`;

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-top">
        <div className="app-sidebar-brand-row">
          <div className="app-sidebar-brand">
            <span className="app-sidebar-logo">W</span>
            <strong className="app-sidebar-brand-name">WorkNote</strong>
          </div>

          <button
            type="button"
            className="app-sidebar-toggle"
            onClick={onToggle}
            aria-label={collapseLabel}
            title={collapseLabel}
          >
            <span className={collapsed ? "is-rotated" : ""}>
              <SidebarIcon name="chevron" />
            </span>
          </button>
        </div>

        <nav className="app-sidebar-nav" aria-label="Main navigation">
          <NavLink
            to="/dashboard"
            title={collapsed ? t("navigation.dashboard") : undefined}
            className={linkClassName}
          >
            <span className="app-nav-icon">
              <SidebarIcon name="dashboard" />
            </span>
            <span className="app-nav-label">
              {t("navigation.dashboard")}
            </span>
          </NavLink>

          <div className="app-nav-group-label">
            {t("navigation.workLogGroup")}
          </div>

          <NavLink
            to="/work/list"
            title={collapsed ? t("navigation.workLogList") : undefined}
            className={linkClassName}
          >
            <span className="app-nav-icon">
              <SidebarIcon name="history" />
            </span>
            <span className="app-nav-label">
              {t("navigation.workLogList")}
            </span>
          </NavLink>

          <NavLink
            to="/work/create"
            title={collapsed ? t("navigation.workLogCreate") : undefined}
            className={linkClassName}
          >
            <span className="app-nav-icon">
              <SidebarIcon name="create" />
            </span>
            <span className="app-nav-label">
              {t("navigation.workLogCreate")}
            </span>
          </NavLink>
        </nav>
      </div>

      <div className="app-sidebar-footer">
        <div
          className="app-user-card"
          title={collapsed ? nickname : undefined}
        >
          <div className="app-user-avatar">
            {(nickname || "U").slice(0, 1).toUpperCase()}
          </div>

          <div className="app-user-text">
            <strong>{nickname || t("navigation.user")}</strong>
            <span>{t("navigation.member")}</span>
          </div>
        </div>

        <button
          type="button"
          className="app-logout-button"
          onClick={onLogout}
          title={collapsed ? t("navigation.logout") : undefined}
        >
          <SidebarIcon name="logout" />
          <span className="app-logout-label">
            {t("navigation.logout")}
          </span>
        </button>
      </div>
    </aside>
  );
}

export default AppSidebar;
