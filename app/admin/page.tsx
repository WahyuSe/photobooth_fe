"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

import Sidebar from "./components/Sidebar";
import DashboardTab from "./components/DashboardTab";
import TemplatesTab from "./components/TemplatesTab";
import ActivityTab from "./components/ActivityTab";
import SessionConfigTab from "./components/SessionConfigTab";

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("sessions");
  const [sessions, setSessions] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventConfig, setEventConfig] = useState({
    eventName: "Photobooth Event",
    startDate: "",
    endDate: "",
    quota: 0,
    userSessionDuration: 300,
    page1Duration: 10,
    page2Duration: 15,
    page3Duration: 20,
    photoCountdown: 5,
  });
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [newSessionUser, setNewSessionUser] = useState("Tamu");
  const [newSessionName, setNewSessionName] = useState("");
  const [newSessionDuration, setNewSessionDuration] = useState(10);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("pb_admin_token");
      if (storedToken) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    if (activeTab === "sessions" || activeTab === "sessions_list") {
      const t = setTimeout(() => fetchSessions(), 300);
      return () => clearTimeout(t);
    }
    if (activeTab === "templates") {
      fetchTemplates();
      fetchCategories();
    }
    if (activeTab === "settings") {
      fetchEventConfig();
    }
  }, [token, searchQuery, activeTab]);

  async function fetchSessions() {
    try {
      const q = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
      const r = await fetch(`${API_URL}/api/sessions/history${q}`);
      const d = await r.json();
      if (d.success) setSessions(d.data);
    } catch {}
  }
  async function fetchTemplates() {
    try {
      const r = await fetch(`${API_URL}/api/templates`);
      const d = await r.json();
      if (d.success) setTemplates(d.data);
    } catch {}
  }
  async function fetchCategories() {
    try {
      const r = await fetch(`${API_URL}/api/admin/categories`);
      const d = await r.json();
      if (d.success) setCategories(d.data);
    } catch {}
  }
  async function fetchEventConfig() {
    try {
      const r = await fetch(`${API_URL}/api/admin/event/config`);
      const d = await r.json();
      if (d.success && d.data) {
        const c = d.data;
        c.startDate = c.startDate
          ? new Date(c.startDate).toISOString().slice(0, 16)
          : "";
        c.endDate = c.endDate
          ? new Date(c.endDate).toISOString().slice(0, 16)
          : "";
        setEventConfig(c);
      }
    } catch {}
  }

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const d = await r.json();
      if (d.success) {
        localStorage.setItem("pb_admin_token", d.token);
        setToken(d.token);
      }
    } catch {}
  };

  const createSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/sessions/create-pending`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: newSessionUser,
          sessionName: newSessionName,
          durationMinutes: Number(newSessionDuration),
        }),
      });
      setShowSessionModal(false);
      fetchSessions();
    } catch {}
  };

  const saveEventConfig = async () => {
    try {
      await fetch(`${API_URL}/api/admin/event/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventConfig),
      });
    } catch {}
  };

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0d1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#131820",
            border: "1px solid #1e2a3a",
            borderRadius: 16,
            padding: "40px 36px",
            width: 360,
            boxShadow: "0 0 60px rgba(189,0,255,0.15)",
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#bd00ff",
              textAlign: "center",
              margin: "0 0 6px",
            }}
          >
            NeonBooth PRO
          </h2>
          <p
            style={{
              color: "#556677",
              textAlign: "center",
              fontSize: 13,
              margin: "0 0 28px",
            }}
          >
            Admin Console
          </p>
          <form
            onSubmit={login}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: "#0d1117",
                border: "1px solid #1e2a3a",
                borderRadius: 8,
                padding: "12px 14px",
                color: "#e2e8f0",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg,#bd00ff,#7b00cc)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(189,0,255,0.4)",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── MAIN LAYOUT ───────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: "#e2e8f0",
        fontFamily: "system-ui,sans-serif",
        display: "flex",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet"
      />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => {
          localStorage.removeItem("pb_admin_token");
          setToken(null);
        }}
      />

      <main
        style={{
          marginLeft: 228,
          flex: 1,
          minHeight: "100vh",
          padding: "32px 36px",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {activeTab === "sessions" && (
          <DashboardTab
            sessions={sessions}
            onNewSession={() => setShowSessionModal(true)}
            onRefresh={fetchSessions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        {activeTab === "templates" && (
          <TemplatesTab templates={templates} categories={categories} />
        )}
        {activeTab === "sessions_list" && (
          <SessionConfigTab
            eventConfig={eventConfig}
            setEventConfig={setEventConfig}
            onSave={saveEventConfig}
          />
        )}
        {activeTab === "activity" && <ActivityTab />}
      </main>

      {/* New Session Modal */}
      {showSessionModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSessionModal(false);
          }}
        >
          <div
            style={{
              background: "#131820",
              border: "1px solid #1e2a3a",
              borderRadius: 16,
              padding: 28,
              width: 420,
              boxShadow: "0 0 40px rgba(189,0,255,0.2)",
            }}
          >
            <h2
              style={{
                color: "#bd00ff",
                fontWeight: 800,
                fontSize: 18,
                margin: "0 0 20px",
              }}
            >
              Mulai Sesi Baru
            </h2>
            <form
              onSubmit={createSession}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              {[
                {
                  label: "Nama User",
                  val: newSessionUser,
                  set: setNewSessionUser,
                  type: "text",
                  req: true,
                },
                {
                  label: "Nama Event/Sesi",
                  val: newSessionName,
                  set: setNewSessionName,
                  type: "text",
                  req: false,
                },
                {
                  label: "Durasi (Menit)",
                  val: newSessionDuration,
                  set: (v: string) => setNewSessionDuration(parseInt(v)),
                  type: "number",
                  req: true,
                },
              ].map((f) => (
                <div key={f.label}>
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
                    {f.label}
                  </label>
                  <input
                    required={f.req}
                    type={f.type}
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      background: "#0d1117",
                      border: "1px solid #1e2a3a",
                      borderRadius: 8,
                      padding: "10px 12px",
                      color: "#e2e8f0",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid #1e2a3a",
                    color: "#aabbcc",
                    borderRadius: 8,
                    padding: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg,#bd00ff,#7b00cc)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Buat Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
