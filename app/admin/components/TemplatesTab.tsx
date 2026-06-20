"use client";
import { useState } from "react";

export default function TemplatesTab({
  templates = [],
  categories = [],
  onEdit,
  onDelete,
  onAddTemplate,
  onAddCategory,
  onDeleteCategory,
}: any) {
  const [filterLayout, setFilterLayout] = useState("All Layouts");
  const filters = [
    "All Layouts",
    "Grid (2x2)",
    "Strip (1x3)",
    "Portrait (1x1)",
    "Animated GIF",
    "Boomerang",
  ];

  const DEMO_TEMPLATES =
    templates.length > 0
      ? templates
      : [
          {
            id: "t1",
            name: "Cyberpunk Nights",
            layout: "grid2x2",
            aspectRatio: "2:3",
            backgroundColor: "#0d1117",
            frameColor: "#00e0ff",
            description: "",
            badge: "GRID 2×2",
            created: "Oct 24, 2023",
          },
          {
            id: "t2",
            name: "Classic Elegance",
            layout: "strip",
            aspectRatio: "1:3",
            backgroundColor: "#1a1a2e",
            frameColor: "#e2e8f0",
            description: "",
            badge: "STRIP 1×3",
            created: "Nov 02, 2023",
          },
          {
            id: "t3",
            name: "Holographic Flare",
            layout: "single",
            aspectRatio: "3:4",
            backgroundColor: "#0f1c2e",
            frameColor: "#bd00ff",
            description: "",
            badge: "PORTRAIT 1×1",
            created: "Nov 15, 2023",
          },
          {
            id: "t4",
            name: "Neon Pulse",
            layout: "strip3",
            aspectRatio: "1:3",
            backgroundColor: "#0d1117",
            frameColor: "#4ade80",
            description: "",
            badge: "BOOMERANG",
            created: "Dec 01, 2023",
          },
          {
            id: "t5",
            name: "Party Confetti",
            layout: "grid3x2",
            aspectRatio: "2:3",
            backgroundColor: "#1a1010",
            frameColor: "#facc15",
            description: "",
            badge: "GRID 2×3",
            created: "Dec 05, 2023",
          },
        ];

  const badgeColors: Record<string, string> = {
    "GRID 2×2": "#00e0ff",
    "STRIP 1×3": "#e879f9",
    "PORTRAIT 1×1": "#f59e0b",
    BOOMERANG: "#4ade80",
    "GRID 2×3": "#00e0ff",
    default: "#bd00ff",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#e2e8f0",
              margin: 0,
            }}
          >
            Template Management
          </h2>
          <p style={{ color: "#556677", margin: "4px 0 0", fontSize: 14 }}>
            Configure and curate your visual booth layouts.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              background: "#131820",
              border: "1px solid #1e2a3a",
              borderRadius: 8,
              padding: "7px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16, color: "#556677" }}
            >
              search
            </span>
            <input
              placeholder="Search templates..."
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "#e2e8f0",
                fontSize: 13,
                width: 150,
              }}
            />
          </div>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 22, color: "#556677", cursor: "pointer" }}
          >
            notifications
          </span>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 22, color: "#556677", cursor: "pointer" }}
          >
            settings
          </span>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#bd00ff,#00e0ff)",
            }}
          />
        </div>
      </div>

      {/* Stats mini row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          { label: "TOTAL TEMPLATES", value: "24", icon: "grid_view" },
          {
            label: "MOST POPULAR",
            value: "Neon 2x2",
            icon: "trending_up",
            sub: true,
          },
          { label: "ACTIVE CUSTOM", value: "12", icon: "edit" },
          { label: "RECENT SYNC", value: "2m ago", icon: "bolt" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#131820",
              border: "1px solid #1e2a3a",
              borderRadius: 12,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "rgba(189,0,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18, color: "#bd00ff" }}
              >
                {s.icon}
              </span>
            </div>
            <div>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: 1,
                  color: "#556677",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontSize: s.sub ? 15 : 20,
                  fontWeight: 800,
                  color: "#e2e8f0",
                  margin: 0,
                }}
              >
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter pills + Add */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilterLayout(f)}
            style={{
              padding: "7px 16px",
              borderRadius: 99,
              border: "1px solid",
              borderColor: filterLayout === f ? "#00e0ff" : "#1e2a3a",
              background:
                filterLayout === f ? "rgba(0,224,255,0.15)" : "transparent",
              color: filterLayout === f ? "#00e0ff" : "#778899",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={onAddTemplate}
          style={{
            background: "linear-gradient(135deg,#bd00ff,#7b00cc)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "9px 18px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            add
          </span>
          Add Template
        </button>
      </div>

      {/* Template grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
        }}
      >
        {DEMO_TEMPLATES.map((t: any) => {
          const badge = t.badge || t.layout?.toUpperCase();
          const bc = badgeColors[badge] || badgeColors.default;
          return (
            <div
              key={t.id}
              style={{
                background: "#131820",
                border: "1px solid #1e2a3a",
                borderRadius: 14,
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                transition: "border-color 0.2s",
              }}
            >
              <div
                style={{
                  height: 160,
                  background: t.backgroundColor || "#0d1117",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: bc,
                    color: "#0d1117",
                    fontSize: 10,
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: 4,
                    letterSpacing: 0.8,
                  }}
                >
                  {badge}
                </span>
                <div
                  style={{
                    border: `2px solid ${t.frameColor || "#00e0ff"}`,
                    width: 60,
                    height: 80,
                    borderRadius: 6,
                    opacity: 0.8,
                    boxShadow: `0 0 20px ${t.frameColor || "#00e0ff"}55`,
                  }}
                />
              </div>
              <div style={{ padding: "14px 16px" }}>
                <h4
                  style={{
                    color: "#e2e8f0",
                    fontWeight: 700,
                    fontSize: 15,
                    margin: "0 0 4px",
                  }}
                >
                  {t.name}
                </h4>
                <p style={{ color: "#556677", fontSize: 12, margin: 0 }}>
                  Created: {t.created || "N/A"}
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    onClick={() => onEdit && onEdit(t)}
                    style={{
                      flex: 1,
                      background: "rgba(0,224,255,0.08)",
                      border: "1px solid rgba(0,224,255,0.2)",
                      color: "#00e0ff",
                      borderRadius: 8,
                      padding: "7px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Atur Posisi
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(t.id)}
                    style={{
                      flex: 1,
                      background: "rgba(248,113,113,0.08)",
                      border: "1px solid rgba(248,113,113,0.2)",
                      color: "#f87171",
                      borderRadius: 8,
                      padding: "7px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {/* Create New tile */}
        <div
          onClick={onAddTemplate}
          style={{
            background: "#131820",
            border: "2px dashed #1e2a3a",
            borderRadius: 14,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 260,
            cursor: "pointer",
            gap: 10,
            color: "#556677",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #1e2a3a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 24 }}
            >
              add
            </span>
          </div>
          <p
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: "#aabbcc",
              margin: 0,
            }}
          >
            Create New
          </p>
          <p style={{ fontSize: 12, color: "#556677", margin: 0 }}>
            Launch the template builder
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#e2e8f0",
            margin: "0 0 16px",
          }}
        >
          Recent Activity
        </h3>
        <div
          style={{
            background: "#131820",
            border: "1px solid #1e2a3a",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {["Template", "Action", "Admin", "Time"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      letterSpacing: 1,
                      color: "#556677",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      borderBottom: "1px solid #1e2a3a",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Cyberpunk Nights",
                  action: "Updated Layout",
                  admin: "Alex Rivers",
                  time: "15 mins ago",
                },
                {
                  name: "Classic Elegance",
                  action: "Added Asset",
                  admin: "Sarah Chen",
                  time: "2 hours ago",
                },
              ].map((r, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: "1px solid rgba(30,42,58,0.5)" }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: "rgba(189,0,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 16, color: "#bd00ff" }}
                      >
                        image
                      </span>
                    </div>
                    <span
                      style={{
                        color: "#e2e8f0",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {r.name}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        background: "rgba(0,224,255,0.1)",
                        color: "#00e0ff",
                        border: "1px solid rgba(0,224,255,0.2)",
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 6,
                      }}
                    >
                      {r.action}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "#aabbcc",
                      fontSize: 14,
                    }}
                  >
                    {r.admin}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "#556677",
                      fontSize: 13,
                    }}
                  >
                    {r.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
