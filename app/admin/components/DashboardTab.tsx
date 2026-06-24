"use client";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";

export default function DashboardTab({
  sessions = [],
  onRefresh,
  searchQuery,
  setSearchQuery,
}: any) {
  const finished = sessions.filter((s: any) => s.status === "FINISHED").length;
  const cancelled = sessions.filter((s: any) => s.status === "CANCELLED").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            Dashboard Overview
          </h2>
          <p style={{ color: "#556677", margin: "4px 0 0", fontSize: 14 }}>
            Real-time performance metrics and session activity.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <span
              className="material-symbols-outlined"
              style={{ color: "#556677", cursor: "pointer", fontSize: 22 }}
            >
              notifications
            </span>
            <span
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 8,
                height: 8,
                background: "#bd00ff",
                borderRadius: "50%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16 }}>
        <StatCard
          label="Total Users"
          value={sessions.length.toLocaleString()}
          icon="groups"
          color="#bd00ff"
          sub="+ Live Sessions"
        />
        <StatCard
          label="Completed Sessions"
          value={finished.toLocaleString()}
          icon="check_circle"
          color="#00e0ff"
          sub="+8.2% conversion rate"
        />
        <StatCard
          label="Cancelled Sessions"
          value={cancelled.toLocaleString()}
          icon="cancel"
          color="#e879f9"
          sub="-2.4% drop rate"
        />
      </div>

      {/* Table card */}
      <div
        style={{
          background: "#131820",
          border: "1px solid #1e2a3a",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #1e2a3a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              color: "#e2e8f0",
              fontWeight: 700,
              fontSize: 15,
              margin: 0,
            }}
          >
            Recent Session Activity
          </h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <span
                className="material-symbols-outlined"
                style={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 16,
                  color: "#556677",
                }}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid #1e2a3a",
                  borderRadius: 8,
                  padding: "6px 10px 6px 30px",
                  color: "#e2e8f0",
                  fontSize: 13,
                  outline: "none",
                  width: 200,
                }}
              />
            </div>
            <button
              onClick={onRefresh}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #1e2a3a",
                borderRadius: 8,
                padding: "6px 8px",
                cursor: "pointer",
                color: "#556677",
                display: "flex",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                refresh
              </span>
            </button>
            <button
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #1e2a3a",
                borderRadius: 8,
                padding: "6px 8px",
                cursor: "pointer",
                color: "#556677",
                display: "flex",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                tune
              </span>
            </button>
            <button
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #1e2a3a",
                borderRadius: 8,
                padding: "6px 8px",
                cursor: "pointer",
                color: "#556677",
                display: "flex",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                download
              </span>
            </button>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {["User ID", "Event Name", "Status", "Timestamp", "Action"].map(
                (h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
                      textAlign: i >= 3 ? "right" : "left",
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
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "32px 16px",
                    textAlign: "center",
                    color: "#556677",
                    fontSize: 14,
                  }}
                >
                  No sessions found.
                </td>
              </tr>
            ) : (
              sessions.map((s: any) => (
                <tr
                  key={s.id}
                  style={{ borderBottom: "1px solid rgba(30,42,58,0.5)" }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "#bd00ff",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {s.userName || "#USR-GUEST"}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "#e2e8f0",
                      fontSize: 14,
                    }}
                  >
                    {s.sessionName || "NeonBooth Session"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <StatusBadge status={s.status} />
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      textAlign: "right",
                      color: "#556677",
                      fontSize: 13,
                    }}
                  >
                    {new Date(s.startTime).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    {s.isActive && (
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#f87171",
                          padding: 4,
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 18 }}
                        >
                          cancel
                        </span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #1e2a3a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "#556677" }}>
            Showing 1 to {Math.min(sessions.length, 5)} of {sessions.length}{" "}
            sessions
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #1e2a3a",
                color: "#aabbcc",
                borderRadius: 8,
                padding: "5px 14px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Previous
            </button>
            <button
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #1e2a3a",
                color: "#aabbcc",
                borderRadius: 8,
                padding: "5px 14px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* System Status row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div
          style={{
            background: "#131820",
            border: "1px solid #1e2a3a",
            borderRadius: 14,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(0,224,255,0.1)",
              border: "1px solid rgba(0,224,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "#00e0ff", fontSize: 22 }}
            >
              memory
            </span>
          </div>
          <div>
            <h4
              style={{
                color: "#e2e8f0",
                fontWeight: 700,
                fontSize: 14,
                margin: 0,
              }}
            >
              System Performance
            </h4>
            <p style={{ color: "#556677", fontSize: 13, margin: "4px 0 0" }}>
              Cloud processing is operating at 98.4% efficiency.
            </p>
          </div>
        </div>
        <div
          style={{
            background: "#131820",
            border: "1px solid #1e2a3a",
            borderRadius: 14,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(189,0,255,0.1)",
              border: "1px solid rgba(189,0,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "#bd00ff", fontSize: 22 }}
            >
              cloud_done
            </span>
          </div>
          <div>
            <h4
              style={{
                color: "#e2e8f0",
                fontWeight: 700,
                fontSize: 14,
                margin: 0,
              }}
            >
              Storage Usage
            </h4>
            <p style={{ color: "#556677", fontSize: 13, margin: "4px 0 0" }}>
              High-speed media storage: 4.2TB / 10TB used.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
