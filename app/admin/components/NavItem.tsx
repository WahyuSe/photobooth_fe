"use client";

export default function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        background: active ? "rgba(0,224,255,0.15)" : "transparent",
        color: active ? "#00e0ff" : "#8899aa",
        fontWeight: active ? 700 : 500,
        fontSize: 14,
        boxShadow: active ? "inset 0 0 0 1px rgba(0,224,255,0.25)" : "none",
        transition: "all 0.15s",
        textAlign: "left",
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
        {icon}
      </span>
      {label}
    </button>
  );
}
