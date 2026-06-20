"use client";
import NavItem from "./NavItem";

export default function Sidebar({ activeTab, setActiveTab, onLogout }: any) {
  const nav = [
    { id: "sessions", icon: "dashboard", label: "Dashboard" },
    { id: "templates", icon: "auto_awesome", label: "Templates" },
    { id: "sessions_list", icon: "calendar_month", label: "Sessions" },
    { id: "activity", icon: "bar_chart", label: "Activity" },
  ];
  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: 228,
        background: "#0d1117",
        borderRight: "1px solid #1e2a3a",
        display: "flex",
        flexDirection: "column",
        padding: "24px 14px",
        zIndex: 50,
      }}
    >
      <div style={{ padding: "0 8px 24px" }}>
        <h1
          style={{ fontSize: 18, fontWeight: 800, color: "#bd00ff", margin: 0 }}
        >
          NeonBooth PRO
        </h1>
        <p
          style={{
            fontSize: 11,
            color: "#556677",
            margin: "4px 0 0",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Admin Console
        </p>
      </div>

      <nav
        style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}
      >
        {nav.map((n) => (
          <NavItem
            key={n.id}
            icon={n.icon}
            label={n.label}
            active={activeTab === n.id}
            onClick={() => setActiveTab(n.id)}
          />
        ))}
      </nav>

      <div
        style={{
          borderTop: "1px solid #1e2a3a",
          paddingTop: 14,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <NavItem
          icon="help_outline"
          label="Support"
          active={false}
          onClick={() => {}}
        />
        <NavItem
          icon="logout"
          label="Logout"
          active={false}
          onClick={onLogout}
        />
      </div>
    </aside>
  );
}
