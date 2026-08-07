import React, { useState } from "react";
import { Search, Eye, X, Printer, FileText, Pencil, Send, Paperclip, Trash2 } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge } from "./shared";
import { TaoToTrinhModal, ThuHoiConfirmDialog } from "./AppHelpers";
import { TrinhKyModal, HoSoToTrinhModal } from "./TrinhKyModal";
import { TaoDuThaoModal } from "./TaoDuThaoModal";

// ── Types & Data ─────────────────────────────────────────────────────────────

export type CongVanTab = "tat-ca" | "den" | "di";

type CVRow = {
  stt: string;
  soCV: string;
  ngayCV: string;
  loai: "den" | "di";
  soThuLy: string;
  ngayThuLy: string;
  donVi: string;
  phanHoi: string;
  phanCong: string;
  coKQGG: boolean;
};

export const CV_ROWS: CVRow[] = [
  {
    stt: "01",
    soCV: "Số CV: 07",
    ngayCV: "24/06/2026",
    loai: "den",
    soThuLy: "123",
    ngayThuLy: "27/07/2026",
    donVi: "Tòa án nhân dân tỉnh Tuyên Quang",
    phanHoi: "Số CV: CV-TR-01\nNgày: 08/07/2026",
    phanCong: "TTV: Nguyễn Văn An",
    coKQGG: true,
  },
  {
    stt: "02",
    soCV: "Số CV: 12/CV-VP",
    ngayCV: "16/07/2026",
    loai: "di",
    soThuLy: "456",
    ngayThuLy: "20/07/2026",
    donVi: "VKSND Tối cao",
    phanHoi: "–",
    phanCong: "TTV: Lê Thị Bình",
    coKQGG: false,
  },
  {
    stt: "03",
    soCV: "Số CV: 88/TB-TAND",
    ngayCV: "02/08/2026",
    loai: "den",
    soThuLy: "789",
    ngayThuLy: "05/08/2026",
    donVi: "TAND TP. Hà Nội",
    phanHoi: "–",
    phanCong: "TTV: Trần Minh Đức",
    coKQGG: true,
  },
  {
    stt: "04",
    soCV: "Số CV: 102/CV-BTP",
    ngayCV: "10/08/2026",
    loai: "di",
    soThuLy: "101",
    ngayThuLy: "12/08/2026",
    donVi: "Bộ Tư Pháp",
    phanHoi: "–",
    phanCong: "TTV: Nguyễn Văn An",
    coKQGG: false,
  },
];

// ── TaoCongVanModal ───────────────────────────────────────────────────────────

const NOI_NHAN_OPTIONS: Record<"toa-an" | "vien-kiem-sat", string[]> = {
  "toa-an": ["Tòa án nhân dân tối cao", "Tòa án nhân dân cấp cao tại Hà Nội", "Tòa án nhân dân cấp cao tại Đà Nẵng", "Tòa án nhân dân cấp cao tại TP. Hồ Chí Minh", "Tòa án nhân dân tỉnh Tuyên Quang", "Tòa án nhân dân TP. Hà Nội"],
  "vien-kiem-sat": ["Viện kiểm sát nhân dân tối cao", "Viện kiểm sát nhân dân cấp cao tại Hà Nội", "Viện kiểm sát nhân dân cấp cao tại Đà Nẵng", "Viện kiểm sát nhân dân cấp cao tại TP. Hồ Chí Minh"],
};

export function TaoCongVanModal({ onClose }: { onClose: () => void }) {
  const [noiNhanRows, setNoiNhanRows] = useState([
    { id: 1, noiNhan: "Viện kiểm sát", chiTiet: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án", editing: false },
    { id: 2, noiNhan: "", chiTiet: "", ghiChu: "", editing: true },
  ]);
  const [noiNhanLoai, setNoiNhanLoai] = useState<"" | "toa-an" | "vien-kiem-sat" | "khac">("");
  const [noiNhanCuThe, setNoiNhanCuThe] = useState("");
  const [noiNhanKhac, setNoiNhanKhac] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const inSt: React.CSSProperties = { width: "100%", border: `1px solid ${BORDER}`, borderRadius: 5, padding: "8px 10px", fontSize: 12, fontFamily: F, outline: "none", boxSizing: "border-box", background: "#fff" };
  const lblSt: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F, marginBottom: 5 };
  const TH2: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "8px 10px" };
  const TD2: React.CSSProperties = { ...TD_STYLE, fontSize: 11, padding: "8px 10px", verticalAlign: "middle" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 900, maxWidth: "95vw", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ background: RED, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: F }}>Tạo công văn</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}><X size={18} /></button>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <div style={{ color: RED, fontWeight: 700, fontSize: 12, fontFamily: F, marginBottom: 16 }}>THÔNG TIN CÔNG VĂN</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={lblSt}>Ngày tạo CV</label>
              <input type="date" style={inSt} />
            </div>
            <div>
              <label style={lblSt}>Số CV</label>
              <input placeholder="Nhập số CV" style={inSt} />
            </div>
            <div>
              <label style={lblSt}>Người ký</label>
              <input placeholder="Chọn người ký" style={inSt} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: noiNhanLoai ? "1fr 1fr" : "1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={lblSt}>Nơi nhận</label>
              <select
                value={noiNhanLoai}
                onChange={e => { setNoiNhanLoai(e.target.value as typeof noiNhanLoai); setNoiNhanCuThe(""); setNoiNhanKhac(""); }}
                style={{ ...inSt, cursor: "pointer" }}
              >
                <option value="">Chọn nơi nhận</option>
                <option value="toa-an">Tòa án</option>
                <option value="vien-kiem-sat">Viện kiểm sát</option>
                <option value="khac">Khác</option>
              </select>
            </div>
            {(noiNhanLoai === "toa-an" || noiNhanLoai === "vien-kiem-sat") && (
              <div>
                <label style={lblSt}>{noiNhanLoai === "toa-an" ? "Tòa án nhận" : "Viện kiểm sát nhận"}</label>
                <select value={noiNhanCuThe} onChange={e => setNoiNhanCuThe(e.target.value)} style={{ ...inSt, cursor: "pointer" }}>
                  <option value="">Chọn đơn vị nhận</option>
                  {NOI_NHAN_OPTIONS[noiNhanLoai].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            )}
            {noiNhanLoai === "khac" && (
              <div>
                <label style={lblSt}>Nơi nhận khác</label>
                <input
                  value={noiNhanKhac}
                  onChange={e => setNoiNhanKhac(e.target.value)}
                  placeholder="Nhập tên nơi nhận"
                  style={inSt}
                />
              </div>
            )}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={lblSt}>Nội dung công văn</label>
            <textarea placeholder="Nhập nội dung công văn" style={{ ...inSt, minHeight: 90, resize: "vertical" }} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={lblSt}>File đính kèm</label>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: `1px dashed ${BORDER}`, borderRadius: 5, padding: "16px 10px", cursor: "pointer", color: MUTED, fontSize: 12, fontFamily: F }}>
              <Paperclip size={15} />
              Kéo thả hoặc chọn file để tải lên
              <input
                type="file"
                multiple
                onChange={e => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length) setAttachments(p => [...p, ...files]);
                  e.target.value = "";
                }}
                style={{ display: "none" }}
              />
            </label>
            {attachments.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {attachments.map((file, idx) => (
                  <div key={`${file.name}-${idx}`} style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${BORDER}`, borderRadius: 5, padding: "6px 10px" }}>
                    <FileText size={14} color={MUTED} />
                    <span style={{ flex: 1, fontSize: 12, color: TEXT, fontFamily: F, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{(file.size / 1024).toFixed(0)} KB</span>
                    <button onClick={() => setAttachments(p => p.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 6, padding: 14, marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 12 }}>Trả lời cho công văn</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <div>
                <label style={lblSt}>Số CV</label>
                <input placeholder="Nhập số CV" style={inSt} />
              </div>
              <div>
                <label style={lblSt}>Ngày CV</label>
                <input type="date" style={inSt} />
              </div>
              <div>
                <label style={lblSt}>Đơn vị gửi</label>
                <input placeholder="Nhập đơn vị gửi" style={inSt} />
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: F, marginBottom: 10 }}>Nơi nhận</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "28%" }} />
              <col />
            </colgroup>
            <thead>
              <tr>
                {["STT","NƠI NHẬN","NƠI NHẬN CHI TIẾT","GHI CHÚ","THAO TÁC"].map(h => (
                  <th key={h} style={TH2}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {noiNhanRows.map((r, idx) => (
                <tr key={r.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD2, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                  {r.editing ? (
                    <>
                      <td style={TD2}><input placeholder="Chọn nơi nhận" defaultValue={r.noiNhan} style={{ ...inSt, fontSize: 11 }} /></td>
                      <td style={TD2}>
                        <select style={{ ...inSt, fontSize: 11 }}>
                          <option value="">Chọn</option>
                          <option>VKSNDTC</option>
                          <option>TAND TC</option>
                          <option>Bộ Tư Pháp</option>
                        </select>
                      </td>
                      <td style={TD2}><input placeholder="Nhập ghi chú" defaultValue={r.ghiChu} style={{ ...inSt, fontSize: 11 }} /></td>
                      <td style={{ ...TD2, whiteSpace: "nowrap" }}>
                        <button onClick={() => setNoiNhanRows(p => p.map(x => x.id === r.id ? { ...x, editing: false } : x))} style={{ background: "none", border: "none", cursor: "pointer", color: RED, fontSize: 12, fontFamily: F, fontWeight: 600 }}>Lưu</button>
                        {" "}
                        <button onClick={() => setNoiNhanRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 12, fontFamily: F }}>Hủy</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={TD2}>{r.noiNhan}</td>
                      <td style={TD2}>{r.chiTiet}</td>
                      <td style={TD2}>{r.ghiChu}</td>
                      <td style={{ ...TD2, whiteSpace: "nowrap" }}>
                        <button onClick={() => setNoiNhanRows(p => p.map(x => x.id === r.id ? { ...x, editing: true } : x))} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 12, fontFamily: F }}>✏ Sửa</button>
                        {" "}
                        <button onClick={() => setNoiNhanRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 12, fontFamily: F }}>🗑 Xóa</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setNoiNhanRows(p => [...p, { id: Date.now(), noiNhan: "", chiTiet: "", ghiChu: "", editing: true }])}
            style={{ marginTop: 8, background: "none", border: `1px dashed ${BORDER}`, borderRadius: 4, padding: "5px 14px", cursor: "pointer", fontSize: 12, color: MUTED, fontFamily: F }}
          >
            + Thêm nơi nhận
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, borderTop: `1px solid ${BORDER}`, padding: "14px 20px" }}>
          <button onClick={onClose} style={{ padding: "7px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
          <button style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
          <button style={{ padding: "7px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Lấy số</button>
          <button style={{ padding: "7px 20px", background: "#7f1d1d", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Trình duyệt</button>
          <button style={{ padding: "7px 20px", background: "#7f1d1d", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Trình ký</button>
          <button style={{ padding: "7px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Xem biểu mẫu</button>
        </div>
      </div>
    </div>
  );
}

// ── ChiTietCongVanView ────────────────────────────────────────────────────────

type CVDetailTab = "thong-tin" | "to-trinh" | "ket-qua";

// ── Tờ trình tab ──────────────────────────────────────────────────────────────

function TabToTrinhCV() {
  const [showTaoTT,     setShowTaoTT]     = useState(false);
  const [showTrinhKy,   setShowTrinhKy]   = useState(false);
  const [showHoSo,      setShowHoSo]      = useState(false);
  const [showTaoDuThao, setShowTaoDuThao] = useState(false);
  const [thuHoiIdx, setThuHoiIdx]  = useState<number | null>(null);
  const [lichSuData, setLichSuData] = useState([
    { ngayTrinh: "10/07/2026", lanh: "Nguyễn Văn C", capTrinh: "Phó Chánh án", vanBan: "Tờ trình công văn số 1", yKien: "–",                                             ngayDuyet: "–",          trangThai: "cho-duyet", subRows: [] as { label: string; ngayDuyet: string }[] },
    { ngayTrinh: "07/07/2026", lanh: "Nguyễn Văn A", capTrinh: "Thẩm phán",    vanBan: "Tờ trình công văn số 1", yKien: "Trả lời đơn: 009876",                            ngayDuyet: "07/07/2026", trangThai: "da-duyet",  subRows: [] },
    { ngayTrinh: "08/07/2026", lanh: "Nguyễn Văn B", capTrinh: "Thẩm phán",    vanBan: "Tờ trình công văn số 1", yKien: "Trả lời đơn: 009876",                            ngayDuyet: "08/07/2026", trangThai: "da-duyet",  subRows: [] },
    { ngayTrinh: "06/07/2026", lanh: "Nguyễn Văn D", capTrinh: "Chánh án",     vanBan: "Tờ trình công văn số 1", yKien: "Nội dung chưa đáp ứng yêu cầu, đề nghị chỉnh sửa", ngayDuyet: "06/07/2026", trangThai: "tu-choi",   subRows: [] },
  ]);
  const [filterDon, setFilterDon]       = useState("");
  const [filterVanBan, setFilterVanBan] = useState("");

  const vanBanRows = [
    { stt: 1, vanBan: "Tờ trình công văn số 1",         loai: "Tờ trình",          ngayTao: "05/07/2026", nguoiKy: "Nguyễn Văn A", trangThai: "Đã ký số" },
    { stt: 2, vanBan: "Thông báo trả lời công văn số 1", loai: "Thông báo trả lời", ngayTao: "09/07/2026", nguoiKy: "Nguyễn Văn B", trangThai: "Đã phát hành" },
  ];

  const allDonOptions    = Array.from(new Set(lichSuData.flatMap(r => r.yKien === "–" ? [] : r.yKien.split("\n").map(s => s.trim()).filter(Boolean))));
  const allVanBanOptions = Array.from(new Set(lichSuData.map(r => r.vanBan)));
  const filteredLichSu   = lichSuData.filter(r => {
    const matchDon    = !filterDon    || r.yKien.includes(filterDon);
    const matchVanBan = !filterVanBan || r.vanBan === filterVanBan;
    return matchDon && matchVanBan;
  });

  const TH: React.CSSProperties = { padding: "8px 10px", background: BG, fontWeight: 700, fontSize: 11, color: "#374151", fontFamily: F, textAlign: "left", borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word" };
  const TD: React.CSSProperties = { padding: "9px 10px", fontSize: 12, color: TEXT, fontFamily: F, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word", overflowWrap: "break-word", verticalAlign: "top" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {showTaoTT     && <TaoToTrinhModal  onClose={() => setShowTaoTT(false)} />}
      {showTrinhKy   && <TrinhKyModal     onClose={() => setShowTrinhKy(false)} />}
      {showHoSo      && <HoSoToTrinhModal onClose={() => setShowHoSo(false)} />}
      {showTaoDuThao && <TaoDuThaoModal   onClose={() => setShowTaoDuThao(false)} />}
      {thuHoiIdx !== null && (
        <ThuHoiConfirmDialog
          onClose={() => setThuHoiIdx(null)}
          onConfirm={() => { setLichSuData(p => p.filter((_, i) => i !== thuHoiIdx)); setThuHoiIdx(null); }}
        />
      )}

      {/* Danh sách văn bản */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách văn bản</span>
          <button onClick={() => setShowTrinhKy(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Trình ký</button>
          <button onClick={() => setShowTaoDuThao(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Tạo dự thảo</button>
          <button onClick={() => setShowTaoTT(true)} style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>+ Tạo tờ trình</button>
          <button onClick={() => setShowHoSo(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hồ sơ tờ trình</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 40 }} /><col /><col style={{ width: "14%" }} /><col style={{ width: "12%" }} /><col style={{ width: "14%" }} /><col style={{ width: "14%" }} /><col style={{ width: 72 }} />
          </colgroup>
          <thead>
            <tr>{["STT","TÊN VĂN BẢN","LOẠI","NGÀY TẠO","NGƯỜI KÝ","TRẠNG THÁI","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {vanBanRows.slice(0, 1).map((r, idx) => (
              <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center", color: MUTED }}>{r.stt}</td>
                <td style={{ ...TD, color: "#2563eb" }}>{r.vanBan}</td>
                <td style={TD}>{r.loai}</td>
                <td style={TD}>{r.ngayTao}</td>
                <td style={TD}>{r.nguoiKy}</td>
                <td style={TD}>
                  <Badge color={r.trangThai === "Đã phát hành" ? "#065f46" : "#1e40af"} bg={r.trangThai === "Đã phát hành" ? "#d1fae5" : "#dbeafe"}>{r.trangThai === "Chờ ký số" ? "Chờ ký" : r.trangThai}</Badge>
                </td>
                <td style={{ ...TD, textAlign: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }}><Eye size={14} color="#0e7490" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lịch sử trình ký */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Lịch sử trình ký</span>
          <select value={filterDon} onChange={e => setFilterDon(e.target.value)} style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
            <option value="">Lọc theo đơn</option>
            {allDonOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterVanBan} onChange={e => setFilterVanBan(e.target.value)} style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
            <option value="">Lọc theo văn bản</option>
            {allVanBanOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 700 }}>
            <colgroup>
              <col style={{ width: 40 }} /><col style={{ width: "10%" }} /><col style={{ width: "14%" }} /><col style={{ width: "12%" }} /><col style={{ width: "22%" }} /><col style={{ width: "16%" }} /><col style={{ width: "10%" }} /><col style={{ width: "11%" }} /><col style={{ width: 90 }} />
            </colgroup>
            <thead>
              <tr>{["STT","NGÀY TRÌNH","LÃNH ĐẠO ĐƯỢC TRÌNH","CẤP TRÌNH","VĂN BẢN","Ý KIẾN","NGÀY DUYỆT","TRẠNG THÁI","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredLichSu.map((r, realIdx) => (
                <React.Fragment key={"ls-" + realIdx}>
                  <tr style={{ background: "#fff" }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>{realIdx + 1}</td>
                    <td style={TD}>{r.ngayTrinh}</td>
                    <td style={TD}>{r.lanh}</td>
                    <td style={TD}>{r.capTrinh}</td>
                    <td style={{ ...TD, color: "#2563eb" }}>{r.vanBan}</td>
                    <td style={{ ...TD, fontSize: 11, whiteSpace: "pre-line" }}>{r.yKien}</td>
                    <td style={TD}>{r.ngayDuyet}</td>
                    <td style={TD}>
                      {r.trangThai === "cho-duyet"
                        ? <Badge color="#92400e" bg="#fef3c7">Chờ duyệt</Badge>
                        : r.trangThai === "tu-choi"
                        ? <Badge color="#991b1b" bg="#fee2e2">Từ chối</Badge>
                        : <Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge>}
                    </td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={13} color="#0e7490" /></button>
                        {r.trangThai === "cho-duyet" && (
                          <button title="Thu hồi" onClick={() => setThuHoiIdx(realIdx)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                              <path d="M2 8a6 6 0 1 0 1.5-3.9" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2 4v4h4" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        )}
                        <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                          <Send size={13} color={RED} />
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Kết quả giải quyết tab ────────────────────────────────────────────────────

const KQGQ_ROWS = [
  { stt: "01", cachGQ: "Qua công văn",      ngayTao: "08/07/2026", soCV: "CV-TR-01", noiDung: "Đã hoàn thành trả lời công văn theo yêu cầu",     ghiChu: "Chuyển phát nhanh" },
  { stt: "02", cachGQ: "Trao đổi trực tiếp", ngayTao: "–",          soCV: "–",        noiDung: "Đã trao đổi trực tiếp và thống nhất phương hướng", ghiChu: "Tại phòng họp số 2" },
];

function ThemKetQuaGQModal({ onClose }: { onClose: () => void }) {
  const [cach, setCach] = useState<"qua-cv" | "truc-tiep">("qua-cv");
  const [noiDung, setNoiDung] = useState("");
  const [ghiChu, setGhiChu]   = useState("");

  const inSt: React.CSSProperties = {
    width: "100%", border: `1px solid ${BORDER}`, borderRadius: 5,
    padding: "8px 10px", fontSize: 12, fontFamily: F, outline: "none",
    boxSizing: "border-box", background: "#fff",
  };
  const lblSt: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F, marginBottom: 5 };
  const reqStar = <span style={{ color: RED }}>*</span>;
  const radio = (val: typeof cach, label: string) => (
    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>
      <input type="radio" checked={cach === val} onChange={() => setCach(val)}
        style={{ accentColor: RED, width: 15, height: 15, cursor: "pointer" }} />
      {label}
    </label>
  );

  const handleLamMoi = () => { setCach("qua-cv"); setNoiDung(""); setGhiChu(""); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1400, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 560, maxWidth: "95vw", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        {/* Header */}
        <div style={{ padding: "18px 22px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>Thêm kết quả giải quyết công văn</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}><X size={18} /></button>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "20px 22px" }}>
          {/* Cách giải quyết */}
          <div style={{ marginBottom: 18 }}>
            <label style={lblSt}>Cách giải quyết</label>
            <div style={{ display: "flex", gap: 24 }}>
              {radio("truc-tiep", "Trao đổi trực tiếp")}
              {radio("qua-cv",   "Qua công văn")}
            </div>
          </div>

          {/* Fields only shown when Qua công văn */}
          {cach === "qua-cv" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={lblSt}>{reqStar} Ngày tạo CV</label>
                <div style={{ position: "relative" }}>
                  <input type="date" placeholder="dd/mm/yyyy" style={inSt} />
                </div>
              </div>
              <div>
                <label style={lblSt}>{reqStar} Số CV</label>
                <input placeholder="Nhập số công văn" style={inSt} />
              </div>
              <div>
                <label style={lblSt}>Người ký</label>
                <input placeholder="Nhập tên người ký" style={inSt} />
              </div>
            </div>
          )}

          {/* Ngày trao đổi — always shown */}
          <div style={{ marginBottom: 14 }}>
            <label style={lblSt}>{reqStar} Ngày trao đổi</label>
            <div style={{ position: "relative" }}>
              <input type="date" placeholder="dd/mm/yyyy" style={inSt} />
            </div>
          </div>

          {/* Nội dung */}
          <div style={{ marginBottom: 6 }}>
            <label style={lblSt}>Nội dung</label>
            <textarea
              value={noiDung}
              onChange={e => setNoiDung(e.target.value)}
              placeholder="Nhập nội dung ý kiến"
              maxLength={1000}
              style={{ ...inSt, minHeight: 100, resize: "vertical" }}
            />
            <div style={{ textAlign: "right", fontSize: 11, color: MUTED, fontFamily: F }}>{noiDung.length} / 1000</div>
          </div>

          {/* Ghi chú */}
          <div style={{ marginBottom: 6 }}>
            <label style={lblSt}>Ghi chú</label>
            <textarea
              value={ghiChu}
              onChange={e => setGhiChu(e.target.value)}
              placeholder="Nhập ghi chú"
              maxLength={1000}
              style={{ ...inSt, minHeight: 80, resize: "vertical" }}
            />
            <div style={{ textAlign: "right", fontSize: 11, color: MUTED, fontFamily: F }}>{ghiChu.length} / 1000</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "12px 22px", borderTop: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={onClose} style={{ padding: "7px 16px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>Đóng</button>
            <button onClick={handleLamMoi} style={{ padding: "7px 16px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>Làm mới</button>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {cach === "qua-cv" && (
              <>
                <button style={{ padding: "7px 14px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>Xem biểu mẫu</button>
                <button style={{ padding: "7px 14px", background: "#7f1d1d", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>Trình duyệt</button>
                <button style={{ padding: "7px 14px", background: "#7f1d1d", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>Trình ký</button>
              </>
            )}
            <button style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabKetQuaCV() {
  const [showModal, setShowModal] = useState(false);
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 10px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 11, padding: "10px 10px", verticalAlign: "top" };

  return (
    <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
      {showModal && <ThemKetQuaGQModal onClose={() => setShowModal(false)} />}
      <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Kết quả giải quyết công văn</span>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
          + Thêm kết quả giải quyết
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: 44 }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "12%" }} />
          <col />
          <col style={{ width: "16%" }} />
          <col style={{ width: 72 }} />
        </colgroup>
        <thead>
          <tr>{["STT","CÁCH GIẢI QUYẾT","NGÀY TẠO CV","SỐ CV","NỘI DUNG","GHI CHÚ","THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {KQGQ_ROWS.map((r, idx) => (
            <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ ...TD, textAlign: "center", color: MUTED }}>{r.stt}</td>
              <td style={TD}>{r.cachGQ}</td>
              <td style={TD}>{r.ngayTao}</td>
              <td style={TD}>{r.soCV}</td>
              <td style={TD}>{r.noiDung}</td>
              <td style={TD}>{r.ghiChu}</td>
              <td style={{ ...TD, textAlign: "center" }}>
                <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={14} color={RED} /></button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Pencil size={13} color={RED} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChiTietCongVanView({ row, onBack }: { row: CVRow; onBack: () => void }) {
  const [tab, setTab] = useState<CVDetailTab>("thong-tin");

  const tabs: { id: CVDetailTab; label: string }[] = [
    { id: "thong-tin", label: "Thông tin công văn" },
    { id: "to-trinh",  label: "Tờ trình" },
    { id: "ket-qua",   label: "Kết quả giải quyết công văn" },
  ];

  const inSt: React.CSSProperties = { width: "100%", border: `1px solid ${BORDER}`, borderRadius: 5, padding: "8px 10px", fontSize: 12, fontFamily: F, outline: "none", boxSizing: "border-box", background: "#fff" };
  const lblSt: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", fontFamily: F, marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.04em" };
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 11, padding: "10px 12px", verticalAlign: "top" };

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#f9fafb" }}>
      <div style={{ padding: "20px 28px 0" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 10 }}>
          Trang chủ &rsaquo; Quản lý án &rsaquo; Công văn trao đổi &rsaquo; <span style={{ color: TEXT }}>Chi tiết công văn</span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <button onClick={onBack} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 10px", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center" }}>←</button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>
            Chi tiết công văn số 13, Ngày 20/07/2026
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, marginBottom: 20 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "8px 20px", background: "none", border: "none",
                borderBottom: tab === t.id ? `2px solid ${RED}` : "2px solid transparent",
                color: tab === t.id ? RED : "#6b7280",
                fontFamily: F, fontSize: 13, fontWeight: tab === t.id ? 700 : 400,
                cursor: "pointer", marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 28px 28px" }}>
        {tab === "thong-tin" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Card: Thông tin công văn */}
            <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 14 }}>Thông tin công văn</div>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: 44 }} />
                  <col style={{ width: "28%" }} />
                  <col />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: 120 }} />
                </colgroup>
                <thead>
                  <tr>
                    {["STT","THÔNG TIN CÔNG VĂN","ĐƠN VỊ GỬI","NGƯỜI DUYỆT/NGƯỜI KÝ","THAO TÁC"].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: "#fff" }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>01</td>
                    <td style={TD}>
                      <div style={{ fontWeight: 700, color: TEXT, fontFamily: F }}>{row.soCV}</div>
                      <div style={{ color: MUTED, fontFamily: F, fontSize: 11 }}>Ngày CV: {row.ngayCV}</div>
                    </td>
                    <td style={TD}>{row.donVi}</td>
                    <td style={TD}>Nguyễn Văn Bình</td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, color: RED, fontSize: 12, fontFamily: F, fontWeight: 600 }}>
                        <Eye size={13} color={RED} /> Xem chi tiết
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Card: Thông tin thụ lý và phân công */}
            <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 16 }}>Thông tin thụ lý và phân công</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={lblSt}>SỐ THỤ LÝ</label>
                  <input defaultValue="123/TL-TA" style={inSt} />
                </div>
                <div>
                  <label style={lblSt}>NGÀY THỤ LÝ</label>
                  <input type="date" defaultValue="2026-07-08" style={inSt} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={lblSt}>TTV</label>
                  <select style={{ ...inSt }}>
                    <option>Chu Thị Thu Hiền – 10/02/1978 – Thẩm tra viên</option>
                    <option>Nguyễn Văn An – Thẩm tra viên</option>
                    <option>Lê Thị Bình – Thẩm tra viên</option>
                  </select>
                </div>
                <div>
                  <label style={lblSt}>NGÀY PHÂN CÔNG TTV</label>
                  <input type="date" defaultValue="2026-07-08" style={inSt} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button style={{ padding: "7px 28px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
              </div>
            </div>
          </div>
        )}

        {tab === "to-trinh" && <TabToTrinhCV />}

        {tab === "ket-qua" && <TabKetQuaCV />}
      </div>
    </div>
  );
}

// ── CongVanTraoDoiView (list + detail) ───────────────────────────────────────

export default function CongVanTraoDoiView() {
  const [tab, setTab] = useState<CongVanTab>("tat-ca");
  const [search, setSearch] = useState("");
  const [showTaoCV, setShowTaoCV] = useState(false);
  const [selectedCV, setSelectedCV] = useState<CVRow | null>(null);

  if (selectedCV) {
    return <ChiTietCongVanView row={selectedCV} onBack={() => setSelectedCV(null)} />;
  }

  const filtered = CV_ROWS.filter(r => {
    if (tab === "den" && r.loai !== "den") return false;
    if (tab === "di"  && r.loai !== "di")  return false;
    if (search && !r.soCV.toLowerCase().includes(search.toLowerCase()) &&
        !r.donVi.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs: { id: CongVanTab; label: string }[] = [
    { id: "tat-ca", label: "Tất cả" },
    { id: "den",    label: "Công văn đến" },
    { id: "di",     label: "Công văn đi" },
  ];

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "10px 8px", whiteSpace: "nowrap" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 11, padding: "10px 8px", verticalAlign: "top" };

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#f9fafb" }}>
      {showTaoCV && <TaoCongVanModal onClose={() => setShowTaoCV(false)} />}
      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 10, color: MUTED, fontFamily: F, marginBottom: 6 }}>
          Quản lý án &rsaquo; <span style={{ color: RED, fontWeight: 600 }}>Công văn trao đổi</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT, fontFamily: F, margin: "0 0 16px" }}>Công văn trao đổi</h1>

        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`, marginBottom: 20 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "8px 18px", background: "none", border: "none",
                borderBottom: tab === t.id ? `2px solid ${RED}` : "2px solid transparent",
                color: tab === t.id ? RED : "#6b7280",
                fontFamily: F, fontSize: 13, fontWeight: tab === t.id ? 700 : 400,
                cursor: "pointer", marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 28px 28px" }}>
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: 20 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={14} color={MUTED} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm công văn..."
                style={{ width: "100%", paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: `1px solid ${BORDER}`, borderRadius: 5, fontSize: 12, fontFamily: F, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <button onClick={() => setShowTaoCV(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: RED, color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F, whiteSpace: "nowrap" }}>
              + Thêm công văn
            </button>
            <button style={{ padding: 8, background: "none", border: `1px solid ${BORDER}`, borderRadius: 5, cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Printer size={15} color={MUTED} />
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 36 }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: 80 }} />
            </colgroup>
            <thead>
              <tr>
                {["STT","THÔNG TIN CÔNG VĂN","THÔNG TIN THỤ LÝ","ĐƠN VỊ GỬI/NHẬN","CÔNG VĂN PHẢN HỒI","PHÂN CÔNG","TRẠNG THÁI","THAO TÁC"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD, textAlign: "center", color: MUTED }}>{r.stt}</td>
                  <td style={TD}>
                    <div style={{ fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 3 }}>{r.soCV}</div>
                    <div style={{ color: MUTED, fontFamily: F, marginBottom: 5 }}>Ngày CV: {r.ngayCV}</div>
                    <span style={{
                      display: "inline-block", padding: "2px 8px", borderRadius: 3, fontSize: 10, fontWeight: 700, fontFamily: F,
                      background: r.loai === "den" ? "#dbeafe" : "#fff7ed",
                      color: r.loai === "den" ? "#1d4ed8" : "#c2410c",
                    }}>
                      {r.loai === "den" ? "CÔNG VĂN ĐẾN" : "CÔNG VĂN ĐI"}
                    </span>
                  </td>
                  <td style={TD}>
                    <div style={{ color: TEXT, fontFamily: F }}>Số thụ lý: {r.soThuLy}</div>
                    <div style={{ color: MUTED, fontFamily: F }}>Ngày thụ lý: {r.ngayThuLy}</div>
                  </td>
                  <td style={TD}><span style={{ color: TEXT, fontFamily: F }}>{r.donVi}</span></td>
                  <td style={TD}>
                    {r.phanHoi === "–" ? (
                      <span style={{ color: MUTED }}>–</span>
                    ) : (
                      r.phanHoi.split("\n").map((ln, i) => <div key={i} style={{ color: TEXT, fontFamily: F }}>{ln}</div>)
                    )}
                  </td>
                  <td style={TD}><span style={{ color: TEXT, fontFamily: F }}>{r.phanCong}</span></td>
                  <td style={TD}>
                    <span style={{
                      display: "inline-block", padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: F,
                      background: r.coKQGG ? "#dcfce7" : "#f3f4f6",
                      color: r.coKQGG ? "#15803d" : "#6b7280",
                    }}>
                      {r.coKQGG ? "CÓ KQGG" : "CHƯA CÓ KQGG"}
                    </span>
                  </td>
                  <td style={{ ...TD, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}>
                      <button onClick={() => setSelectedCV(r)} style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xem">
                        <Eye size={15} color="#6b7280" />
                      </button>
                      {!r.coKQGG && (
                        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xóa">
                          <span style={{ fontSize: 15, color: "#ef4444" }}>🗑</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>
              Hiển thị <b>{filtered.length}</b> của <b>{filtered.length}</b> bản ghi
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>HIỂN THỊ:</span>
              <select style={{ border: `1px solid ${BORDER}`, borderRadius: 4, padding: "3px 8px", fontSize: 12, fontFamily: F }}>
                <option>10 dòng</option>
                <option>20 dòng</option>
                <option>50 dòng</option>
              </select>
              <div style={{ display: "flex", gap: 2 }}>
                {["‹‹","‹","1","›","››"].map((p, i) => (
                  <button key={i} style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 3, background: p === "1" ? RED : "#fff", color: p === "1" ? "#fff" : MUTED, fontSize: 12, cursor: "pointer", fontFamily: F }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
