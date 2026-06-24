"use client";
import { useState } from "react";

export default function SessionConfigTab({ eventConfig, setEventConfig, onSave }: any) {
  const [showPopup, setShowPopup] = useState(false);

  const handleSave = async (isNew: boolean = false) => {
    await onSave(isNew);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };
  const sliderField = (label: string, id: string, min: number, max: number, value: number, onChange: any) => (
    <div style={{ flex: 1 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <label
          style={{
            fontSize: 10,
            letterSpacing: 1,
            color: "#556677",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
        <span style={{ fontSize: 11, color: "#e2e8f0", fontWeight: 700 }}>
          {value}s
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ width: "100%", accentColor: "#bd00ff" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "#556677",
          marginTop: 2,
        }}
      >
        <span>{min}s</span>
        <span>{max}s</span>
      </div>
    </div>
  );

  return (
    <div
      style={{
        maxWidth: 900,
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid #1e2a3a", paddingBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              color: "#00e0ff",
              fontWeight: 700,
              fontSize: 14,
              margin: 0,
              letterSpacing: 0.5,
            }}
          >
            Session Configuration
          </p>
          <div style={{ display: "flex", gap: 12 }}>
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
      </div>

      <div>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#e2e8f0",
            margin: "0 0 6px",
          }}
        >
          Create New Session
        </h2>
        <p style={{ color: "#556677", fontSize: 14, margin: 0 }}>
          Define the parameters for your next high-energy event booth.
        </p>
      </div>

      {/* Identity & Schedule */}
      <div
        style={{
          background: "#131820",
          border: "1px solid #1e2a3a",
          borderRadius: 14,
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: "#aabbcc", fontSize: 20 }}
          >
            calendar_month
          </span>
          <h3
            style={{
              color: "#e2e8f0",
              fontWeight: 700,
              fontSize: 16,
              margin: 0,
            }}
          >
            Identity &amp; Schedule
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 10,
                letterSpacing: 1,
                color: "#556677",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Session Name
            </label>
            <input
              type="text"
              placeholder="e.g. Cyber Tokyo Gala 2024"
              value={eventConfig.eventName || ""}
              onChange={(e) =>
                setEventConfig({ ...eventConfig, eventName: e.target.value })
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#0d1117",
                border: "1px solid #1e2a3a",
                borderRadius: 8,
                padding: "12px 14px",
                color: "#e2e8f0",
                fontSize: 15,
                outline: "none",
              }}
            />
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  letterSpacing: 1,
                  color: "#556677",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Start Date & Time
              </label>
              <div style={{ position: "relative" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 16,
                    color: "#556677",
                  }}
                >
                  calendar_today
                </span>
                <input
                  type="datetime-local"
                  value={eventConfig.startDate?.slice(0, 16) || ""}
                  onChange={(e) =>
                    setEventConfig({
                      ...eventConfig,
                      startDate: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#0d1117",
                    border: "1px solid #1e2a3a",
                    borderRadius: 8,
                    padding: "12px 14px 12px 36px",
                    color: "#e2e8f0",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  letterSpacing: 1,
                  color: "#556677",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                End Date & Time
              </label>
              <div style={{ position: "relative" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 16,
                    color: "#556677",
                  }}
                >
                  calendar_today
                </span>
                <input
                  type="datetime-local"
                  value={eventConfig.endDate?.slice(0, 16) || ""}
                  onChange={(e) =>
                    setEventConfig({ ...eventConfig, endDate: e.target.value })
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#0d1117",
                    border: "1px solid #1e2a3a",
                    borderRadius: 8,
                    padding: "12px 14px 12px 36px",
                    color: "#e2e8f0",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capacity & Flow */}
      <div
        style={{
          background: "#131820",
          border: "1px solid #1e2a3a",
          borderRadius: 14,
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: "#aabbcc", fontSize: 20 }}
          >
            group
          </span>
          <h3
            style={{
              color: "#e2e8f0",
              fontWeight: 700,
              fontSize: 16,
              margin: 0,
            }}
          >
            Capacity &amp; Flow
          </h3>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: 10,
                letterSpacing: 1,
                color: "#556677",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Total Quota (Sessions)
            </label>
            <div style={{ position: "relative" }}>
              <span
                className="material-symbols-outlined"
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 16,
                  color: "#556677",
                }}
              >
                supervisor_account
              </span>
              <input
                type="number"
                placeholder="500"
                value={eventConfig.quota || ""}
                onChange={(e) =>
                  setEventConfig({
                    ...eventConfig,
                    quota: parseInt(e.target.value) || 0,
                  })
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#0d1117",
                  border: "1px solid #1e2a3a",
                  borderRadius: 8,
                  padding: "12px 14px 12px 36px",
                  color: "#e2e8f0",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 10,
                letterSpacing: 1,
                color: "#556677",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Duration Per Quota (Seconds)
            </label>
            <div style={{ position: "relative" }}>
              <span
                className="material-symbols-outlined"
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 16,
                  color: "#556677",
                }}
              >
                timer
              </span>
              <input
                type="number"
                placeholder="120"
                value={eventConfig.userSessionDuration || ""}
                onChange={(e) =>
                  setEventConfig({
                    ...eventConfig,
                    userSessionDuration: parseInt(e.target.value) || 0,
                  })
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#0d1117",
                  border: "1px solid #1e2a3a",
                  borderRadius: 8,
                  padding: "12px 14px 12px 36px",
                  color: "#e2e8f0",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Journey Timings */}
      <div
        style={{
          background: "#131820",
          border: "1px solid #1e2a3a",
          borderRadius: 14,
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: "#aabbcc", fontSize: 20 }}
          >
            edit_note
          </span>
          <h3
            style={{
              color: "#e2e8f0",
              fontWeight: 700,
              fontSize: 16,
              margin: 0,
            }}
          >
            User Journey Timings
          </h3>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
          }}
        >
          {sliderField(
            "Grid Select (sec)",
            "p1",
            5,
            30,
            eventConfig.page1Duration || 10,
            (v: number) => setEventConfig({ ...eventConfig, page1Duration: v }),
          )}
          {sliderField(
            "Photo Preview (sec)",
            "p2",
            5,
            30,
            eventConfig.page2Duration || 15,
            (v: number) => setEventConfig({ ...eventConfig, page2Duration: v }),
          )}
          {sliderField(
            "Template Select (sec)",
            "p3",
            5,
            30,
            eventConfig.page3Duration || 20,
            (v: number) => setEventConfig({ ...eventConfig, page3Duration: v }),
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          onClick={() => handleSave(false)}
          style={{
            alignSelf: "flex-start",
            background: "transparent",
            color: "#e2e8f0",
            border: "1px solid #1e2a3a",
            borderRadius: 10,
            padding: "12px 28px",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          💾 Update Config
        </button>
        <button
          onClick={() => handleSave(true)}
          style={{
            alignSelf: "flex-start",
            background: "linear-gradient(135deg,#bd00ff,#7b00cc)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 28px",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 0 24px rgba(189,0,255,0.4)",
          }}
        >
          ✨ Save as New Session (Reset Quota)
        </button>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            bottom: 30,
            right: 30,
            background: "linear-gradient(135deg,#00e0ff,#0077ff)",
            color: "#fff",
            padding: "16px 24px",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 10px 30px rgba(0, 224, 255, 0.3)",
            zIndex: 1000,
            animation: "slideIn 0.3s ease-out forwards",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
            check_circle
          </span>
          <div>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Success</h4>
            <p style={{ margin: "2px 0 0", fontSize: 13, opacity: 0.9 }}>Configuration saved successfully!</p>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
