"use client";
import { useState } from "react";

export default function TemplatesTab({
  templates = [],
  categories = [],
  onEdit,
  onDelete,
  onAddTemplate,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: any) {
  const [filterLayout, setFilterLayout] = useState("All Layouts");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<"select" | "manual" | "upload">("select");
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    layout: "grid2x2",
    categoryId: "",
    photoCount: 4,
    thumbnail: "",
    frameColor: "#FFFFFF",
    backgroundColor: "#000000",
    textColor: "#000000",
    accentColor: "#FF5733",
    fonts: "Inter",
    hasLogo: true,
    hasDate: true,
    hasFrame: true,
    frameWidth: 20,
    aspectRatio: "1:3",
    overlayImage: "",
    slotsJson: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      finalValue = parseInt(value, 10) || 0;
    }
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [fieldName]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddTemplate) {
      onAddTemplate(formData);
    }
    setIsAddModalOpen(false);
    setCreationMode("select");
    // Reset form
    setFormData({
      name: "", description: "", layout: "grid2x2", categoryId: "", photoCount: 4, thumbnail: "",
      frameColor: "#FFFFFF", backgroundColor: "#000000", textColor: "#000000", accentColor: "#FF5733",
      fonts: "Inter", hasLogo: true, hasDate: true, hasFrame: true, frameWidth: 20, aspectRatio: "1:3",
      overlayImage: "", slotsJson: ""
    });
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategoryId) {
      if (onEditCategory && categoryName.trim()) {
        onEditCategory(editingCategoryId, { name: categoryName.trim(), description: categoryDescription.trim() });
      }
    } else {
      if (onAddCategory && categoryName.trim()) {
        onAddCategory({ name: categoryName.trim(), description: categoryDescription.trim() });
      }
    }
    setIsAddCategoryModalOpen(false);
    setCategoryName("");
    setCategoryDescription("");
    setEditingCategoryId(null);
  };

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

  const displayTemplates = DEMO_TEMPLATES.filter((t: any) => {
    if (filterCategory === "All Categories") return true;
    // Cek nama kategori dari relasi atau cari dari list categories by id
    const catName = t.Category?.name || categories.find((c: any) => c.id === t.categoryId)?.name;
    return catName === filterCategory;
  });

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
          { label: "TOTAL TEMPLATES", value: templates.length || DEMO_TEMPLATES.length, icon: "grid_view" },
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
        <button
          onClick={() => setFilterCategory("All Categories")}
          style={{
            padding: "7px 16px",
            borderRadius: 99,
            border: "1px solid",
            borderColor: filterCategory === "All Categories" ? "#00e0ff" : "#1e2a3a",
            background: filterCategory === "All Categories" ? "rgba(0,224,255,0.15)" : "transparent",
            color: filterCategory === "All Categories" ? "#00e0ff" : "#778899",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          All Categories
        </button>
        {categories.map((c: any) => (
          <div key={c.id} style={{ position: "relative", display: "inline-block" }}>
            <button
              onClick={() => setFilterCategory(c.name)}
              style={{
                padding: "7px 16px",
                borderRadius: 99,
                border: "1px solid",
                borderColor: filterCategory === c.name ? "#00e0ff" : "#1e2a3a",
                background: filterCategory === c.name ? "rgba(0,224,255,0.15)" : "transparent",
                color: filterCategory === c.name ? "#00e0ff" : "#778899",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {c.name}
            </button>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setEditingCategoryId(c.id);
                setCategoryName(c.name);
                setCategoryDescription(c.description || "");
                setIsAddCategoryModalOpen(true);
              }}
              className="material-symbols-outlined"
              title="Edit Category"
              style={{
                position: "absolute", top: -5, right: 14,
                background: "#1e2a3a", color: "#00e0ff",
                fontSize: 12, borderRadius: "50%",
                cursor: "pointer", border: "1px solid #131820",
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 18, height: 18, zIndex: 2
              }}
            >
              edit
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Hapus kategori "${c.name}"?`)) {
                  onDeleteCategory && onDeleteCategory(c.id);
                  if (filterCategory === c.name) setFilterCategory("All Categories");
                }
              }}
              className="material-symbols-outlined"
              title="Delete Category"
              style={{
                position: "absolute", top: -5, right: -5,
                background: "#1e2a3a", color: "#f87171",
                fontSize: 12, borderRadius: "50%",
                cursor: "pointer", border: "1px solid #131820",
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 18, height: 18, zIndex: 1
              }}
            >
              close
            </span>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => {
              setEditingCategoryId(null);
              setCategoryName("");
              setCategoryDescription("");
              setIsAddCategoryModalOpen(true);
            }}
            style={{
              background: "rgba(0,224,255,0.1)",
              border: "1px solid rgba(0,224,255,0.3)",
              color: "#00e0ff",
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
            Add Category
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
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
      </div>

      {/* Template grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
        }}
      >
        {displayTemplates.map((t: any) => {
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
          onClick={() => setIsAddModalOpen(true)}
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

      {/* Add Template Modal */}
      {isAddModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: "#131820", border: "1px solid #1e2a3a", borderRadius: 16,
            width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", padding: 24
          }}>
            {creationMode === "select" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", padding: "20px 10px" }}>
                <h3 style={{ color: "#e2e8f0", margin: 0, fontSize: 22 }}>How to create template?</h3>
                <p style={{ color: "#778899", margin: "-10px 0 10px", fontSize: 14 }}>Choose whether you want to upload a ready-made template or design manually.</p>
                
                <div style={{ display: "flex", gap: 16, width: "100%" }}>
                  <div onClick={() => setCreationMode("upload")} style={{ flex: 1, background: "#1a222c", border: "2px solid #1e2a3a", borderRadius: 16, padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", gap: 12, transition: "0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#00e0ff"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1e2a3a"}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#00e0ff" }}>upload_file</span>
                    <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 16 }}>Upload Image</span>
                    <span style={{ color: "#556677", fontSize: 12, textAlign: "center" }}>Directly upload your finished template photo.</span>
                  </div>
                  
                  <div onClick={() => setCreationMode("manual")} style={{ flex: 1, background: "#1a222c", border: "2px solid #1e2a3a", borderRadius: 16, padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", gap: 12, transition: "0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#bd00ff"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1e2a3a"}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#bd00ff" }}>design_services</span>
                    <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 16 }}>Create Manual</span>
                    <span style={{ color: "#556677", fontSize: 12, textAlign: "center" }}>Configure colors, frames, slots manually.</span>
                  </div>
                </div>
                
                <button onClick={() => setIsAddModalOpen(false)} style={{ marginTop: 10, background: "transparent", color: "#aabbcc", border: "none", padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>
                  Cancel
                </button>
              </div>
            )}

            {creationMode !== "select" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span className="material-symbols-outlined" onClick={() => setCreationMode("select")} style={{ color: "#aabbcc", cursor: "pointer" }}>arrow_back</span>
                  <h3 style={{ color: "#e2e8f0", margin: 0, fontSize: 20 }}>
                    {creationMode === "upload" ? "Upload Template" : "Add Manual Template"}
                  </h3>
                </div>

                <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Name *</label>
                      <input required name="name" value={formData.name} onChange={handleInputChange} style={{ width: "100%", padding: "10px", background: "#0d1117", border: "1px solid #1e2a3a", color: "#fff", borderRadius: 8 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Layout *</label>
                      <select name="layout" value={formData.layout} onChange={handleInputChange} style={{ width: "100%", padding: "10px", background: "#0d1117", border: "1px solid #1e2a3a", color: "#fff", borderRadius: 8 }}>
                        <option value="strip">Strip</option>
                        <option value="grid2x2">Grid 2x2</option>
                        <option value="single">Single</option>
                        <option value="strip3">Strip 3</option>
                        <option value="grid2x3">Grid 2x3</option>
                        <option value="grid2x4">Grid 2x4</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Category</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} style={{ width: "100%", padding: "10px", background: "#0d1117", border: "1px solid #1e2a3a", color: "#fff", borderRadius: 8 }}>
                      <option value="">No Category</option>
                      {categories.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {creationMode === "upload" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                      <div>
                        <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Upload Template File *</label>
                        <input type="file" required accept="image/*" onChange={(e) => handleFileChange(e, "overlayImage")} style={{ width: "100%", padding: "7px", background: "#0d1117", border: "1px solid #1e2a3a", color: "#fff", borderRadius: 8 }} />
                        {formData.overlayImage && <img src={formData.overlayImage} alt="preview" style={{ marginTop: 12, maxHeight: 150, borderRadius: 8, border: "1px solid #1e2a3a" }} />}
                      </div>
                    </div>
                  )}

                  {creationMode === "manual" && (
                    <>
                      <div>
                        <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Description *</label>
                        <textarea required name="description" value={formData.description} onChange={handleInputChange} style={{ width: "100%", padding: "10px", background: "#0d1117", border: "1px solid #1e2a3a", color: "#fff", borderRadius: 8 }} />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                        <div>
                          <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Photo Count *</label>
                          <input type="number" required name="photoCount" value={formData.photoCount} onChange={handleInputChange} style={{ width: "100%", padding: "10px", background: "#0d1117", border: "1px solid #1e2a3a", color: "#fff", borderRadius: 8 }} />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                        <div>
                          <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Frame Color</label>
                          <input type="color" name="frameColor" value={formData.frameColor} onChange={handleInputChange} style={{ width: "100%", height: 38, padding: 0, border: "none", borderRadius: 8 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Bg Color</label>
                          <input type="color" name="backgroundColor" value={formData.backgroundColor} onChange={handleInputChange} style={{ width: "100%", height: 38, padding: 0, border: "none", borderRadius: 8 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Text Color</label>
                          <input type="color" name="textColor" value={formData.textColor} onChange={handleInputChange} style={{ width: "100%", height: 38, padding: 0, border: "none", borderRadius: 8 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Accent Color</label>
                          <input type="color" name="accentColor" value={formData.accentColor} onChange={handleInputChange} style={{ width: "100%", height: 38, padding: 0, border: "none", borderRadius: 8 }} />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Fonts</label>
                          <input name="fonts" value={formData.fonts} onChange={handleInputChange} style={{ width: "100%", padding: "10px", background: "#0d1117", border: "1px solid #1e2a3a", color: "#fff", borderRadius: 8 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Aspect Ratio</label>
                          <input name="aspectRatio" value={formData.aspectRatio} onChange={handleInputChange} style={{ width: "100%", padding: "10px", background: "#0d1117", border: "1px solid #1e2a3a", color: "#fff", borderRadius: 8 }} />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Thumbnail</label>
                          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "thumbnail")} style={{ width: "100%", padding: "7px", background: "#0d1117", border: "1px solid #1e2a3a", color: "#fff", borderRadius: 8 }} />
                          {formData.thumbnail && <img src={formData.thumbnail} alt="thumb" style={{ marginTop: 8, maxHeight: 60, borderRadius: 4 }} />}
                        </div>
                        <div>
                          <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Overlay Image (Optional)</label>
                          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "overlayImage")} style={{ width: "100%", padding: "7px", background: "#0d1117", border: "1px solid #1e2a3a", color: "#fff", borderRadius: 8 }} />
                          {formData.overlayImage && <img src={formData.overlayImage} alt="overlay" style={{ marginTop: 8, maxHeight: 60, borderRadius: 4 }} />}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 24, padding: "10px 0" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#e2e8f0", fontSize: 14 }}>
                          <input type="checkbox" name="hasLogo" checked={formData.hasLogo} onChange={handleInputChange} />
                          Has Logo
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#e2e8f0", fontSize: 14 }}>
                          <input type="checkbox" name="hasDate" checked={formData.hasDate} onChange={handleInputChange} />
                          Has Date
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#e2e8f0", fontSize: 14 }}>
                          <input type="checkbox" name="hasFrame" checked={formData.hasFrame} onChange={handleInputChange} />
                          Has Frame
                        </label>
                      </div>
                    </>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
                    <button type="button" onClick={() => { setIsAddModalOpen(false); setCreationMode("select"); }} style={{ background: "transparent", color: "#e2e8f0", border: "1px solid #1e2a3a", padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
                    <button type="submit" style={{ background: "linear-gradient(135deg,#bd00ff,#7b00cc)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Save Template</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: "#131820", border: "1px solid #1e2a3a", borderRadius: 16,
            width: "100%", maxWidth: 400, padding: 24
          }}>
            <h3 style={{ color: "#e2e8f0", margin: "0 0 20px", fontSize: 20 }}>
              {editingCategoryId ? "Edit Category" : "Add New Category"}
            </h3>
            <form onSubmit={handleCategorySubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Category Name *</label>
                <input 
                  required 
                  autoFocus
                  value={categoryName} 
                  onChange={(e) => setCategoryName(e.target.value)} 
                  style={{ width: "100%", padding: "10px", background: "#0d1117", border: "1px solid #1e2a3a", color: "#fff", borderRadius: 8 }} 
                  placeholder="e.g. Wedding, Birthday, etc."
                />
              </div>
              <div>
                <label style={{ display: "block", color: "#aabbcc", fontSize: 13, marginBottom: 6 }}>Description</label>
                <textarea 
                  value={categoryDescription} 
                  onChange={(e) => setCategoryDescription(e.target.value)} 
                  style={{ width: "100%", padding: "10px", background: "#0d1117", border: "1px solid #1e2a3a", color: "#fff", borderRadius: 8, minHeight: "80px" }} 
                  placeholder="Optional description"
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
                <button type="button" onClick={() => {
                  setIsAddCategoryModalOpen(false);
                  setEditingCategoryId(null);
                }} style={{ background: "transparent", color: "#e2e8f0", border: "1px solid #1e2a3a", padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "rgba(0,224,255,0.15)", color: "#00e0ff", border: "1px solid rgba(0,224,255,0.3)", padding: "10px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
                  {editingCategoryId ? "Update Category" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
