"use client";

export default function StatCard({ label, value, icon, color, sub }: any) {
  return (
    <div
      style={{
        background: "#131820",
        border: "1px solid #1e2a3a",
        borderRadius: 14,
        padding: "20px 22px",
        position: "relative",
        overflow: "hidden",
        flex: 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 16,
          top: 16,
          opacity: 0.08,
          fontSize: 56,
          lineHeight: 1,
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 56, color }}
        >
          {icon}
        </span>
      </div>
      <p
        style={{
          fontSize: 11,
          letterSpacing: 1.2,
          color: "#556677",
          fontWeight: 700,
          textTransform: "uppercase",
          margin: "0 0 8px",
        }}
      >
        {label}
      </p>
      <h3 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 10px", color }}>
        {value}
      </h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
          trending_up
        </span>
        {sub}
      </div>
    </div>
  );
}
