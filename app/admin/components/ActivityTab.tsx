"use client";
import { useState } from "react";
import StatusBadge from "./StatusBadge";

export default function ActivityTab() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const logs = [
    {
      ts: "Oct 24, 2023\n14:22:15",
      session: "Gala Night 2023",
      code: "#NB-8821-X",
      action: "Photo Export (Email)",
      status: "SUCCESS",
    },
    {
      ts: "Oct 24, 2023\n14:18:02",
      session: "Product Launch",
      code: "#NB-1102-A",
      action: "Cloud Sync Failed",
      status: "ERROR",
    },
    {
      ts: "Oct 24, 2023\n14:05:44",
      session: "Tech Summit VIP",
      code: "#NB-4491-K",
      action: "GIF Render Completed",
      status: "SUCCESS",
    },
    {
      ts: "Oct 24, 2023\n13:58:21",
      session: "Gala Night 2023",
      code: "#NB-8822-Y",
      action: "QR Code Interaction",
      status: "PENDING",
    },
    {
      ts: "Oct 24, 2023\n13:45:10",
      session: "Holiday Party",
      code: "#NB-5001-Z",
      action: "New Session Started",
      status: "SUCCESS",
    },
  ];

  const shown =
    filter === "errors" ? logs.filter((l) => l.status === "ERROR") : logs;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid #1e2a3a",
          paddingBottom: 16,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            background: "#131820",
            border: "1px solid #1e2a3a",
            borderRadius: 8,
            padding: "7px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flex: 1,
            maxWidth: 360,
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 16, color: "#556677" }}
          >
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity logs..."
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "#e2e8f0",
              fontSize: 13,
              flex: 1,
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

      <div>
        <h2
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: "#e2e8f0",
            margin: "0 0 6px",
          }}
        >
          Activity History
        </h2>
        <p style={{ color: "#556677", fontSize: 14, margin: "0 0 20px" }}>
          Real-time audit log of booth interactions and system events.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              background:
                filter === "all" ? "#00e0ff" : "rgba(255,255,255,0.04)",
              color: filter === "all" ? "#0d1117" : "#aabbcc",
            }}
          >
            All Logs
          </button>
          <button
            onClick={() => setFilter("errors")}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1px solid #1e2a3a",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              background:
                filter === "errors" ? "rgba(248,113,113,0.15)" : "transparent",
              color: filter === "errors" ? "#f87171" : "#aabbcc",
            }}
          >
            Errors Only
          </button>
          <div style={{ flex: 1 }} />
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #1e2a3a",
              background: "rgba(255,255,255,0.04)",
              color: "#aabbcc",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16 }}
            >
              tune
            </span>{" "}
            Filter
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #1e2a3a",
              background: "rgba(255,255,255,0.04)",
              color: "#aabbcc",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16 }}
            >
              download
            </span>{" "}
            Export
          </button>
        </div>
      </div>

      {/* Table */}
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
            <tr>
              {[
                "Timestamp",
                "Session Name",
                "User Code",
                "Action",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: 12,
                    color: "#556677",
                    fontWeight: 700,
                    borderBottom: "1px solid #1e2a3a",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((l, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid rgba(30,42,58,0.5)" }}
              >
                <td
                  style={{
                    padding: "16px 16px",
                    color: "#8899aa",
                    fontSize: 13,
                    whiteSpace: "pre-line",
                  }}
                >
                  {l.ts}
                </td>
                <td
                  style={{
                    padding: "16px 16px",
                    color: "#00e0ff",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {l.session}
                </td>
                <td
                  style={{
                    padding: "16px 16px",
                    color: "#e2e8f0",
                    fontSize: 13,
                  }}
                >
                  {l.code}
                </td>
                <td
                  style={{
                    padding: "16px 16px",
                    color: "#aabbcc",
                    fontSize: 14,
                  }}
                >
                  {l.action}
                </td>
                <td style={{ padding: "16px 16px" }}>
                  <StatusBadge status={l.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid #1e2a3a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, color: "#556677" }}>
            Showing 1 to 5 of 1,284 entries
          </span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {["<", "1", "2", "3", "...", "257", ">"].map((p, i) => (
              <button
                key={i}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 7,
                  border: "1px solid",
                  borderColor: p === "1" ? "#00e0ff" : "#1e2a3a",
                  background:
                    p === "1"
                      ? "rgba(0,224,255,0.15)"
                      : "rgba(255,255,255,0.03)",
                  color: p === "1" ? "#00e0ff" : "#778899",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
        }}
      >
        {[
          {
            label: "Peak Usage",
            value: "14:00 – 16:00",
            icon: "bolt",
            sub: "Most active time slot in last 24h.",
          },
          {
            label: "Export Rate",
            value: "94.2%",
            icon: "share",
            sub: "Users successfully sharing digital copies.",
          },
          {
            label: "Active Nodes",
            value: "12 Booths",
            icon: "hub",
            sub: "Currently transmitting log data live.",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#131820",
              border: "1px solid #1e2a3a",
              borderRadius: 14,
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "#556677",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  margin: 0,
                }}
              >
                {s.label}
              </p>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18, color: "#556677" }}
              >
                {s.icon}
              </span>
            </div>
            <h3
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#e2e8f0",
                margin: "0 0 8px",
              }}
            >
              {s.value}
            </h3>
            <p style={{ fontSize: 12, color: "#556677", margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
