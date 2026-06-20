"use client";

export default function StatusBadge({ status }: { status?: string | any }) {
  const map: Record<string, any> = {
    FINISHED: {
      label: "Selesai",
      bg: "#0f3d2e",
      color: "#4ade80",
      dot: "#4ade80",
    },
    CANCELLED: {
      label: "Batal",
      bg: "#2d1a2e",
      color: "#e879f9",
      dot: "#e879f9",
    },
    ACTIVE: { label: "Aktif", bg: "#0e2a3a", color: "#22d3ee", dot: "#22d3ee" },
    PENDING: {
      label: "Menunggu",
      bg: "#2d2a00",
      color: "#facc15",
      dot: "#facc15",
    },
    SUCCESS: {
      label: "Success",
      bg: "#0f3d2e",
      color: "#4ade80",
      dot: "#4ade80",
    },
    ERROR: { label: "Error", bg: "#3d0f0f", color: "#f87171", dot: "#f87171" },
  };
  const c = map[status] || map.PENDING;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 99,
        background: c.bg,
        color: c.color,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
        }}
      />
      {c.label}
    </span>
  );
}
