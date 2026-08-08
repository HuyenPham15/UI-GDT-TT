import React, { useState } from "react";
import { X, Pencil, Trash2 } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE } from "./shared";
import { XemBieuMauCongVanModal } from "./CongVanTraoDoiView";
import { TrinhKyModal } from "./TrinhKyModal";

export function TaoDuThaoModal({ onClose }: { onClose: () => void }) {
  const [cach, setCach] = useState<"truc-tiep" | "qua-cv">("qua-cv");
  const [ngayTaoCV, setNgayTaoCV] = useState("");
  const [soCV, setSoCV] = useState("");
  const [nguoiKy, setNguoiKy] = useState("");
  const [noiNhanType, setNoiNhanType] = useState("");
  const [donViNhan, setDonViNhan] = useState("");
  const [ngayTraoDoi, setNgayTraoDoi] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [ghiChu, setGhiChu] = useState("");

  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showBieuMau, setShowBieuMau] = useState(false);

  const [noiNhanList, setNoiNhanList] = useState([
    { id: 1, loai: "Viện kiểm sát", donVi: "Viện kiểm sát nhân dân tối cao", ghiChu: "Kèm hồ sơ vụ án" }
  ]);

  const [isSaved, setIsSaved] = useState(false);
  const [daCapSo, setDaCapSo] = useState(false);

  const handleLamMoi = () => {
    setCach("qua-cv");
    setNgayTaoCV("");
    setSoCV("");
    setNguoiKy("");
    setNoiNhanType("");
    setDonViNhan("");
    setNgayTraoDoi("");
    setNoiDung("");
    setGhiChu("");
    setIsSaved(false);
    setDaCapSo(false);
  };

  const handleSave = () => {
    setIsSaved(true);
  };

  const inSt: React.CSSProperties = {
    width: "100%", border: `1px solid ${BORDER}`, borderRadius: 5,
    padding: "8px 10px", fontSize: 12, fontFamily: F, outline: "none",
    boxSizing: "border-box", background: "#fff",
  };
  const lblSt: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F, marginBottom: 5 };
  const reqStar = <span style={{ color: RED, marginRight: 2 }}>*</span>;

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "8px 10px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 11, padding: "9px 10px" };

  const [isAddingNoiNhan, setIsAddingNoiNhan] = useState(false);
  const [newLoai, setNewLoai] = useState("Viện kiểm sát");
  const [newDonVi, setNewDonVi] = useState("");
  const [newGhiChu, setNewGhiChu] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLoai, setEditLoai] = useState("");
  const [editDonVi, setEditDonVi] = useState("");
  const [editGhiChu, setEditGhiChu] = useState("");

  const handleStartEdit = (r: { id: number; loai: string; donVi: string; ghiChu: string }) => {
    setEditingId(r.id);
    setEditLoai(r.loai);
    setEditDonVi(r.donVi);
    setEditGhiChu(r.ghiChu);
  };

  const handleSaveEdit = (id: number) => {
    if (!editDonVi.trim()) {
      alert("Vui lòng nhập tên đơn vị nhận!");
      return;
    }
    setNoiNhanList(prev => prev.map(item => item.id === id ? { ...item, loai: editLoai, donVi: editDonVi.trim(), ghiChu: editGhiChu.trim() || "–" } : item));
    setEditingId(null);
  };

  const handleAddNoiNhan = () => {
    setIsAddingNoiNhan(true);
    setNewLoai(noiNhanType || "Viện kiểm sát");
    setNewDonVi(donViNhan || "");
    setNewGhiChu("");
  };

  const handleSaveInlineNoiNhan = () => {
    if (!newDonVi.trim()) {
      alert("Vui lòng nhập tên đơn vị nhận!");
      return;
    }
    setNoiNhanList(prev => [
      ...prev,
      {
        id: Date.now(),
        loai: newLoai,
        donVi: newDonVi.trim(),
        ghiChu: newGhiChu.trim() || "–"
      }
    ]);
    setIsAddingNoiNhan(false);
    setNewDonVi("");
    setNewGhiChu("");
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1400, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showBieuMau && <XemBieuMauCongVanModal onClose={() => setShowBieuMau(false)} />}

      <div style={{ background: "#fff", borderRadius: 8, width: 720, maxWidth: "95vw", maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        {/* Header */}
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>Tạo dự thảo</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}><X size={18} /></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Cách giải quyết */}
          <div>
            <label style={lblSt}>Cách giải quyết</label>
            <div style={{ display: "flex", gap: 24, alignItems: "center", marginTop: 6 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>
                <input
                  type="radio"
                  name="cachGQ_duThao"
                  checked={cach === "truc-tiep"}
                  onChange={() => setCach("truc-tiep")}
                  style={{ accentColor: RED, width: 15, height: 15, cursor: "pointer" }}
                />
                Trao đổi trực tiếp
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>
                <input
                  type="radio"
                  name="cachGQ_duThao"
                  checked={cach === "qua-cv"}
                  onChange={() => setCach("qua-cv")}
                  style={{ accentColor: RED, width: 15, height: 15, cursor: "pointer" }}
                />
                Qua công văn
              </label>
            </div>
          </div>

          {/* Form fields khi chọn Qua công văn */}
          {cach === "qua-cv" && (
            <>
              {/* Row 1: Ngày tạo CV - Số CV - Người ký */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div>
                  <label style={lblSt}>{reqStar} Ngày tạo CV</label>
                  <input
                    type="date"
                    value={ngayTaoCV}
                    onChange={e => setNgayTaoCV(e.target.value)}
                    style={inSt}
                  />
                </div>
                <div>
                  <label style={lblSt}>{reqStar} Số CV</label>
                  <input
                    placeholder="Nhập số công văn"
                    value={soCV}
                    onChange={e => setSoCV(e.target.value)}
                    style={inSt}
                  />
                </div>
                <div>
                  <label style={lblSt}>Người ký</label>
                  <input
                    placeholder="Nhập tên người ký"
                    value={nguoiKy}
                    onChange={e => setNguoiKy(e.target.value)}
                    style={inSt}
                  />
                </div>
              </div>

              {/* Row 2: Nơi nhận - Đơn vị nhận */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={lblSt}>Nơi nhận</label>
                  <select
                    value={noiNhanType}
                    onChange={e => setNoiNhanType(e.target.value)}
                    style={{ ...inSt, cursor: "pointer" }}>
                    <option value="">-- Vui lòng chọn --</option>
                    <option value="Viện kiểm sát">Viện kiểm sát</option>
                    <option value="Tòa án">Tòa án</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label style={lblSt}>Đơn vị nhận</label>
                  <input
                    placeholder={noiNhanType ? "Nhập đơn vị nhận" : "Chọn nơi nhận trước"}
                    value={donViNhan}
                    onChange={e => setDonViNhan(e.target.value)}
                    disabled={!noiNhanType}
                    style={{ ...inSt, background: !noiNhanType ? "#f9fafb" : "#fff" }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Row 3: Ngày trao đổi */}
          <div>
            <label style={lblSt}>{reqStar} Ngày trao đổi</label>
            <input
              type="date"
              value={ngayTraoDoi}
              onChange={e => setNgayTraoDoi(e.target.value)}
              style={inSt}
            />
          </div>

          {/* Row 4: Nội dung */}
          <div>
            <label style={lblSt}>Nội dung</label>
            <textarea
              value={noiDung}
              onChange={e => setNoiDung(e.target.value.slice(0, 1000))}
              placeholder="Nhập nội dung ý kiến"
              style={{ ...inSt, minHeight: 90, resize: "vertical" }}
            />
            <div style={{ textAlign: "right", fontSize: 11, color: MUTED, fontFamily: F, marginTop: 4 }}>
              {noiDung.length} / 1000
            </div>
          </div>

          {/* Row 5: Ghi chú */}
          <div>
            <label style={lblSt}>Ghi chú</label>
            <textarea
              value={ghiChu}
              onChange={e => setGhiChu(e.target.value.slice(0, 1000))}
              placeholder="Nhập ghi chú"
              style={{ ...inSt, minHeight: 80, resize: "vertical" }}
            />
            <div style={{ textAlign: "right", fontSize: 11, color: MUTED, fontFamily: F, marginTop: 4 }}>
              {ghiChu.length} / 1000
            </div>
          </div>

          {/* Row 6: Bảng Nơi nhận */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>
                Nơi nhận
              </div>
              <button
                onClick={handleAddNoiNhan}
                style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: F, display: "flex", alignItems: "center", gap: 4 }}>
                + Thêm nơi nhận
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: 44 }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "35%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: 90 }} />
              </colgroup>
              <thead>
                <tr>
                  {["STT", "LOẠI NƠI NHẬN", "TÊN ĐƠN VỊ NHẬN", "GHI CHÚ", "THAO TÁC"].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {noiNhanList.map((r, idx) => (
                  editingId === r.id ? (
                    <tr key={r.id} style={{ background: "#eff6ff" }}>
                      <td style={{ ...TD, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                      <td style={TD}>
                        <select
                          value={editLoai}
                          onChange={e => setEditLoai(e.target.value)}
                          style={{ ...inSt, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>
                          <option value="Viện kiểm sát">Viện kiểm sát</option>
                          <option value="Tòa án">Tòa án</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </td>
                      <td style={TD}>
                        <input
                          value={editDonVi}
                          onChange={e => setEditDonVi(e.target.value)}
                          placeholder="Nhập tên đơn vị nhận"
                          style={{ ...inSt, padding: "4px 8px", fontSize: 11 }}
                        />
                      </td>
                      <td style={TD}>
                        <input
                          value={editGhiChu}
                          onChange={e => setEditGhiChu(e.target.value)}
                          placeholder="Nhập ghi chú"
                          style={{ ...inSt, padding: "4px 8px", fontSize: 11 }}
                        />
                      </td>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}>
                          <button
                            onClick={() => handleSaveEdit(r.id)}
                            style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer", fontFamily: F, fontWeight: 600 }}>
                            Lưu
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{ background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer", fontFamily: F }}>
                            Hủy
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={r.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ ...TD, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                      <td style={TD}>{r.loai}</td>
                      <td style={TD}>{r.donVi}</td>
                      <td style={TD}>{r.ghiChu}</td>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center" }}>
                          <button onClick={() => handleStartEdit(r)} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontFamily: F, fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 3, padding: 0 }}>
                            <Pencil size={12} color="#2563eb" />
                          </button>
                          <button onClick={() => setNoiNhanList(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontFamily: F, fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 3, padding: 0 }}>
                            <Trash2 size={12} color="#ef4444" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                ))}
                {isAddingNoiNhan && (
                  <tr style={{ background: "#fffdf5" }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>{noiNhanList.length + 1}</td>
                    <td style={TD}>
                      <select
                        value={newLoai}
                        onChange={e => setNewLoai(e.target.value)}
                        style={{ ...inSt, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>
                        <option value="Viện kiểm sát">Viện kiểm sát</option>
                        <option value="Tòa án">Tòa án</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </td>
                    <td style={TD}>
                      <input
                        placeholder="Nhập tên đơn vị nhận"
                        value={newDonVi}
                        onChange={e => setNewDonVi(e.target.value)}
                        style={{ ...inSt, padding: "4px 8px", fontSize: 11 }}
                      />
                    </td>
                    <td style={TD}>
                      <input
                        placeholder="Nhập ghi chú"
                        value={newGhiChu}
                        onChange={e => setNewGhiChu(e.target.value)}
                        style={{ ...inSt, padding: "4px 8px", fontSize: 11 }}
                      />
                    </td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}>
                        <button
                          onClick={handleSaveInlineNoiNhan}
                          style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer", fontFamily: F, fontWeight: 600 }}>
                          Lưu
                        </button>
                        <button
                          onClick={() => setIsAddingNoiNhan(false)}
                          style={{ background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer", fontFamily: F }}>
                          Hủy
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "12px 22px", borderTop: `1px solid ${BORDER}`, flexWrap: "wrap", gap: 8 }}>
          <button onClick={onClose} style={{ padding: "7px 16px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>Đóng</button>
          {!isSaved ? (
            <button onClick={handleSave} style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
          ) : (
            <>
              <button onClick={() => setShowTrinhKy(true)} style={{ padding: "7px 14px", background: "#7f1d1d", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>Trình ký</button>
              <button onClick={() => setShowBieuMau(true)} style={{ padding: "7px 14px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>Xem biểu mẫu</button>
              <button
                onClick={() => setDaCapSo(!daCapSo)}
                style={{
                  padding: "7px 16px",
                  background: daCapSo ? "#ef4444" : "#fff",
                  color: daCapSo ? "#fff" : TEXT,
                  border: daCapSo ? "none" : `1px solid ${BORDER}`,
                  borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: daCapSo ? 700 : 400, fontFamily: F
                }}>
                {daCapSo ? "Hủy cấp số" : "Lấy số"}
              </button>
              <button onClick={handleSave} style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
