import React, { useState } from "react";
import { X, FileText, Calendar } from "lucide-react";
import { F, BORDER, TEXT, MUTED } from "./shared";
import { TrinhKyModal } from "./TrinhKyModal";

// ── Word preview / editor modal cho Dự thảo văn bản giải quyết ─────────────────
function XemBieuMauDuThaoModal({
  onClose,
  detail,
  ketQua,
  soQuyetDinh,
  ngayQuyetDinh,
  nguoiKy,
  noiDung,
}: {
  onClose: () => void;
  detail?: any;
  ketQua: "tra-loi" | "khang-nghi" | "xep-don" | "vks-dang-giai-quyet";
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  nguoiKy: string;
  noiDung: string;
}) {
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState("13.5pt");
  const [fontFamily, setFontFamily] = useState("Times New Roman");

  const titleDoc =
    ketQua === "khang-nghi"
      ? "QUYẾT ĐỊNH KHÁNG NGHỊ GIÁM ĐỐC THẨM"
      : ketQua === "xep-don"
      ? "THÔNG BÁO VỀ VIỆC XẾP ĐƠN ĐỀ NGHỊ GIÁM ĐỐC THẨM"
      : ketQua === "vks-dang-giai-quyet"
      ? "THÔNG BÁO VỀ VIỆC VIỆN KIỂM SÁT ĐANG GIẢI QUYẾT ĐƠN"
      : "THÔNG BÁO VỀ VIỆC GIẢI QUYẾT ĐƠN ĐỀ NGHỊ GIÁM ĐỐC THẨM";

  const execCmd = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
  };

  const tbBtnSt: React.CSSProperties = {
    padding: "4px 8px",
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: F,
    color: TEXT,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  };

  const selectSt: React.CSSProperties = {
    padding: "4px 6px",
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontSize: 12,
    fontFamily: F,
    background: "#fff",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#f1f5f9",
        zIndex: 3500,
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        fontFamily: F,
      }}
    >
      {/* Header Ribbon bar Word Style */}
      <div
        style={{
          background: "#2b579a",
          color: "#fff",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: F,
            }}
          >
            ← Quay lại
          </button>
          <FileText size={20} color="#fff" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, fontFamily: F, display: "flex", alignItems: "center", gap: 8 }}>
              <span>{titleDoc}.docx</span>
              <span style={{ fontSize: 11, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>
                Chế độ chỉnh sửa Word trực tiếp
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => alert("Đã lưu nội dung Dự thảo Word thành công!")}
            style={{
              padding: "7px 20px",
              background: "#15803d",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: F,
            }}
          >
            💾 Lưu thay đổi
          </button>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}>
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Word Toolbar */}
      <div
        style={{
          background: "#fff",
          borderBottom: `1px solid ${BORDER}`,
          padding: "7px 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          flexWrap: "wrap",
          fontSize: 12,
          fontFamily: F,
        }}
      >
        <button onClick={() => execCmd("undo")} style={tbBtnSt} title="Hoàn tác">↩ Hoàn tác</button>
        <button onClick={() => execCmd("redo")} style={tbBtnSt} title="Làm lại">↪ Làm lại</button>
        <div style={{ width: 1, height: 18, background: BORDER, margin: "0 2px" }} />

        <select onChange={e => { setFontFamily(e.target.value); execCmd("fontName", e.target.value); }} value={fontFamily} style={selectSt}>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Arial">Arial</option>
          <option value="Roboto">Roboto</option>
        </select>

        <select onChange={e => { setFontSize(e.target.value); execCmd("fontSize", "3"); }} value={fontSize} style={selectSt}>
          <option value="12pt">12 pt</option>
          <option value="13pt">13 pt</option>
          <option value="13.5pt">13.5 pt</option>
          <option value="14pt">14 pt</option>
        </select>
        <div style={{ width: 1, height: 18, background: BORDER, margin: "0 2px" }} />

        <button onClick={() => execCmd("bold")} style={tbBtnSt} title="In đậm"><b>B</b></button>
        <button onClick={() => execCmd("italic")} style={tbBtnSt} title="In nghiêng"><i>I</i></button>
        <button onClick={() => execCmd("underline")} style={tbBtnSt} title="Gạch chân"><u>U</u></button>
        <div style={{ width: 1, height: 18, background: BORDER, margin: "0 2px" }} />

        <button onClick={() => execCmd("justifyLeft")} style={tbBtnSt} title="Căn trái">⬅</button>
        <button onClick={() => execCmd("justifyCenter")} style={tbBtnSt} title="Căn giữa">↔</button>
        <button onClick={() => execCmd("justifyRight")} style={tbBtnSt} title="Căn phải">➡</button>
        <button onClick={() => execCmd("justifyFull")} style={tbBtnSt} title="Căn đều">☰</button>
        <div style={{ width: 1, height: 18, background: BORDER, margin: "0 2px" }} />

        <button onClick={() => window.print()} style={tbBtnSt}>🖨 In</button>
        <button onClick={() => alert("Đang tải file Word (.docx) về máy...")} style={{ ...tbBtnSt, background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0", fontWeight: 600 }}>
          📥 Tải file Word
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", fontSize: 12, color: MUTED }}>
          <span>Thu phóng:</span>
          <button onClick={() => setZoom(z => Math.max(60, z - 10))} style={tbBtnSt}>-</button>
          <span style={{ fontWeight: 600, color: TEXT, minWidth: 36, textAlign: "center" }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={tbBtnSt}>+</button>
        </div>
      </div>

      {/* Editable Canvas */}
      <div style={{ flex: 1, overflow: "auto", padding: "30px 20px 60px 20px", display: "flex", justifyContent: "center", background: "#cbd5e1" }}>
        <div
          contentEditable
          suppressContentEditableWarning
          style={{
            width: 794,
            minHeight: 1123,
            background: "#fff",
            boxShadow: "0 6px 30px rgba(0,0,0,0.22)",
            padding: "54px 64px",
            boxSizing: "border-box",
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            fontFamily: fontFamily,
            color: "#000",
            lineHeight: 1.6,
            fontSize: fontSize,
            outline: "none",
            cursor: "text",
          }}
        >
          {/* Header */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
            <tbody>
              <tr>
                <td style={{ width: "45%", textAlign: "center", verticalAlign: "top" }}>
                  <div style={{ fontWeight: "bold", fontSize: "12pt" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                  <div style={{ fontSize: "12pt", marginTop: 4 }}>
                    Số: {soQuyetDinh || "...... /QĐ-TANDTC"}
                  </div>
                </td>
                <td style={{ width: "55%", textAlign: "center", verticalAlign: "top" }}>
                  <div style={{ fontWeight: "bold", fontSize: "12pt" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: "bold", fontSize: "12.5pt", textDecoration: "underline" }}>
                    Độc lập – Tự do – Hạnh phúc
                  </div>
                  <div style={{ fontSize: "12pt", fontStyle: "italic", marginTop: 4 }}>
                    Hà Nội, ngày {ngayQuyetDinh ? ngayQuyetDinh.split("/")[0] || "..." : "..."} tháng {ngayQuyetDinh ? ngayQuyetDinh.split("/")[1] || "..." : "..."} năm 2026
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Title */}
          <div style={{ textAlign: "center", margin: "24px 0 16px" }}>
            <div style={{ fontSize: "15pt", fontWeight: "bold", textTransform: "uppercase" }}>{titleDoc}</div>
            <div style={{ fontSize: "13pt", fontWeight: "bold", marginTop: 4 }}>
              Đối với {detail?.tenVuAn || "Vụ án hình sự Phan Văn Thành – Bức cung"}
            </div>
          </div>

          {/* Content */}
          <div style={{ textAlign: "justify", lineHeight: 1.65 }}>
            <p style={{ margin: "10px 0", textIndent: "1cm" }}>
              Căn cứ Bộ luật Tố tụng hình sự năm 2015; Luật Tổ chức Tòa án nhân dân năm 2024;
            </p>
            <p style={{ margin: "10px 0", textIndent: "1cm" }}>
              Sau khi xem xét đơn đề nghị giám đốc thẩm và hồ sơ vụ án liên quan đến Bản án hình sự số 050526_CTH02 ngày 05/05/2026 của Tòa án nhân dân tỉnh Hải Phòng;
            </p>
            <p style={{ margin: "10px 0", textIndent: "1cm" }}>
              {noiDung ||
                (ketQua === "khang-nghi"
                  ? "Quyết định kháng nghị toàn bộ bản án phúc thẩm để xét xử lại theo thủ tục giám đốc thẩm theo đúng quy định của pháp luật."
                  : ketQua === "xep-don"
                  ? "Xét thấy đơn đề nghị không có tài liệu chứng cứ mới hoặc đã được giải quyết đúng pháp luật. Tòa án nhân dân tối cao quyết định xếp đơn theo quy định."
                  : ketQua === "vks-dang-giai-quyet"
                  ? "Hiện tại Viện kiểm sát nhân dân đang thụ lý và xem xét giải quyết hồ sơ vụ án theo thẩm quyền. Tòa án nhân dân tối cao thông báo để quý cơ quan/đương sự được biết."
                  : "Xét thấy không có căn cứ để kháng nghị theo thủ tục giám đốc thẩm đối với bản án nêu trên. Tòa án nhân dân tối cao thông báo để đương sự được biết.")}
            </p>
          </div>

          {/* Signatures */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 40 }}>
            <tbody>
              <tr>
                <td style={{ width: "50%", textAlign: "left", verticalAlign: "top", fontSize: "11pt" }}>
                  <div style={{ fontWeight: "bold", fontStyle: "italic" }}>Nơi nhận:</div>
                  <div>- Như kính gửi;</div>
                  <div>- VKSND tối cao;</div>
                  <div>- Lưu: Hồ sơ vụ án, Vụ 1.</div>
                </td>
                <td style={{ width: "50%", textAlign: "center", verticalAlign: "top", fontSize: "12pt" }}>
                  <div style={{ fontWeight: "bold" }}>NGƯỜI KÝ BAN HÀNH</div>
                  <div style={{ height: 80 }} />
                  <div style={{ fontWeight: "bold" }}>{nguoiKy || "Nguyễn Biên Thuỳ"}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Modal Tạo Dự thảo chuẩn theo thiết kế thực tế của Quản lý vụ án ────────────
export function TaoDuThaoModal({
  onClose,
  detail,
  onSave,
}: {
  onClose: () => void;
  detail?: any;
  onSave?: (data: any) => void;
}) {
  // Top Case Info values (Fallback theo đúng ảnh)
  const maVuAn = detail?.maVuAn || "VA26-00321";
  const tenVuAn = detail?.tenVuAn || "Vụ án Phan Văn Thành – bức cung";
  const tenBiCan = "Phan Văn Thành";
  const toiDanh = "Bức cung";
  const soBA = "050526_CTH02";
  const ngayBA = "05/05/2026";
  const toaXetXu = "Tòa án nhân dân tỉnh Hải Phòng";
  const giaiDoan = "Giám đốc thẩm, tái thẩm";
  const toaAnGiaiQuyet = "Tòa án nhân dân tối cao";
  const trangThai = "Chưa có kết quả xét xử";

  // Section 1: Thông tin đơn
  const [donLienQuan, setDonLienQuan] = useState("2 đơn/người được chọn");
  const [ketQuaGQ, setKetQuaGQ] = useState<"tra-loi" | "khang-nghi" | "xep-don" | "vks-dang-giai-quyet">("tra-loi");

  // Section 2: Thông tin quyết định
  const [ngayQuyetDinh, setNgayQuyetDinh] = useState("09/08/2026");
  const [soQuyetDinh, setSoQuyetDinh] = useState("");
  const [nguoiKy, setNguoiKy] = useState("Nguyễn Biên Thuỳ - Thẩm phán TANDTC");
  const [ngayPhatHanh, setNgayPhatHanh] = useState("");
  const [noiDung, setNoiDung] = useState("");

  const [daLaySo, setDaLaySo] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showBieuMau, setShowBieuMau] = useState(false);

  // Section 3: Nơi nhận table
  const [noiNhanList, setNoiNhanList] = useState([
    { id: 1, noiNhan: "Khác", noiNhanChiTiet: "Như kính gửi", ghiChu: "–" },
    { id: 2, noiNhan: "Tòa án nhân dân", noiNhanChiTiet: "Đ/c Chánh án TANDTC", ghiChu: "để báo cáo" },
  ]);

  const [isAddingNoiNhan, setIsAddingNoiNhan] = useState(false);
  const [newNoiNhan, setNewNoiNhan] = useState("Khác");
  const [newChiTiet, setNewChiTiet] = useState("");
  const [newGhiChu, setNewGhiChu] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNoiNhan, setEditNoiNhan] = useState("");
  const [editChiTiet, setEditChiTiet] = useState("");
  const [editGhiChu, setEditGhiChu] = useState("");

  const handleStartEdit = (r: { id: number; noiNhan: string; noiNhanChiTiet: string; ghiChu: string }) => {
    setEditingId(r.id);
    setEditNoiNhan(r.noiNhan);
    setEditChiTiet(r.noiNhanChiTiet);
    setEditGhiChu(r.ghiChu);
  };

  const handleSaveEdit = (id: number) => {
    if (!editChiTiet.trim()) {
      alert("Vui lòng nhập nơi nhận chi tiết!");
      return;
    }
    setNoiNhanList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, noiNhan: editNoiNhan, noiNhanChiTiet: editChiTiet.trim(), ghiChu: editGhiChu.trim() || "–" }
          : item
      )
    );
    setEditingId(null);
  };

  const handleSaveNewNoiNhan = () => {
    if (!newChiTiet.trim()) {
      alert("Vui lòng nhập nơi nhận chi tiết!");
      return;
    }
    setNoiNhanList(prev => [
      ...prev,
      {
        id: Date.now(),
        noiNhan: newNoiNhan,
        noiNhanChiTiet: newChiTiet.trim(),
        ghiChu: newGhiChu.trim() || "–",
      },
    ]);
    setIsAddingNoiNhan(false);
    setNewChiTiet("");
    setNewGhiChu("");
  };

  const handleDeleteNoiNhan = (id: number) => {
    setNoiNhanList(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleLaySo = () => {
    if (!daLaySo) {
      const num = Math.floor(Math.random() * 900 + 100);
      const generated = `${num}/2026/${ketQuaGQ === "khang-nghi" ? "QĐ-TANDTC" : "TB-TANDTC"}`;
      setSoQuyetDinh(generated);
      setDaLaySo(true);
      alert(`Đã cấp số quyết định/dự thảo thành công: ${generated}`);
    } else {
      setSoQuyetDinh("");
      setDaLaySo(false);
      alert("Đã hủy cấp số!");
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        soQuyetDinh,
        ngayQuyetDinh,
        nguoiKy,
        ketQuaGQ,
        noiDung,
        noiNhanList,
      });
    }
    alert("Đã lưu thông tin dự thảo thành công!");
    onClose();
  };

  const inSt: React.CSSProperties = {
    padding: "7px 10px",
    fontSize: 12,
    border: "1px solid #d1d5db",
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    width: "100%",
    background: "#fff",
    boxSizing: "border-box",
    color: "#111827",
  };

  const lblSt: React.CSSProperties = {
    fontSize: 12,
    color: "#374151",
    fontFamily: F,
    display: "block",
    marginBottom: 5,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1400,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        overflowY: "auto",
        padding: "20px 16px",
      }}
    >
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showBieuMau && (
        <XemBieuMauDuThaoModal
          onClose={() => setShowBieuMau(false)}
          detail={detail}
          ketQua={ketQuaGQ}
          soQuyetDinh={soQuyetDinh}
          ngayQuyetDinh={ngayQuyetDinh}
          nguoiKy={nguoiKy}
          noiDung={noiDung}
        />
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          width: "100%",
          maxWidth: 780,
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          marginBottom: 24,
          overflow: "hidden",
          fontFamily: F,
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 20px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <span style={{ fontSize: 16, color: "#991b1b" }}>📄</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", fontFamily: F }}>
              Tạo Dự thảo
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: "16px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxHeight: "82vh",
            overflowY: "auto",
          }}
        >
          {/* Top Case Information Box (Mint Green background & border) */}
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 6,
              padding: "12px 16px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1fr 1fr",
                gap: "8px 16px",
                fontSize: 12,
                fontFamily: F,
                lineHeight: 1.5,
              }}
            >
              {/* Col 1 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div>
                  <span style={{ color: "#374151" }}>Mã vụ án: </span>
                  <span style={{ color: "#0f766e", fontWeight: 700 }}>{maVuAn}</span>
                </div>
                <div>
                  <span style={{ color: "#374151" }}>Tên vụ án: </span>
                  <span style={{ color: "#0f766e", fontWeight: 600 }}>{tenVuAn}</span>
                </div>
                <div>
                  <span style={{ color: "#374151" }}>Tên bị can đầu vụ: </span>
                  <span style={{ color: "#0f766e", fontWeight: 600 }}>{tenBiCan}</span>
                </div>
                <div>
                  <span style={{ color: "#374151" }}>Tội danh chính: </span>
                  <span style={{ color: "#0f766e", fontWeight: 600 }}>{toiDanh}</span>
                </div>
              </div>

              {/* Col 2 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div>
                  <span style={{ color: "#374151" }}>Số BA/QĐ: </span>
                  <span style={{ color: "#0f766e", fontWeight: 600 }}>{soBA}</span>
                </div>
                <div>
                  <span style={{ color: "#374151" }}>Ngày ra BA/QĐ: </span>
                  <span style={{ color: "#0f766e", fontWeight: 600 }}>{ngayBA}</span>
                </div>
                <div>
                  <span style={{ color: "#374151" }}>Tòa xét xử: </span>
                  <span style={{ color: "#0f766e", fontWeight: 600 }}>{toaXetXu}</span>
                </div>
              </div>

              {/* Col 3 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div>
                  <span style={{ color: "#374151" }}>Giai đoạn: </span>
                  <span style={{ color: "#0f766e", fontWeight: 600 }}>{giaiDoan}</span>
                </div>
                <div>
                  <span style={{ color: "#374151" }}>Tòa án giải quyết: </span>
                  <span style={{ color: "#0f766e", fontWeight: 600 }}>{toaAnGiaiQuyet}</span>
                </div>
                <div>
                  <span style={{ color: "#374151" }}>Trạng thái: </span>
                  <span style={{ color: "#dc2626", fontWeight: 700 }}>{trangThai}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Thông tin đơn */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
              <span>■ Thông tin đơn</span>
            </div>

            <div>
              <label style={lblSt}>
                <span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Đơn liên quan
              </label>
              <select
                value={donLienQuan}
                onChange={e => setDonLienQuan(e.target.value)}
                style={{ ...inSt, cursor: "pointer" }}
              >
                <option value="2 đơn/người được chọn">2 đơn/người được chọn</option>
                <option value="1. Đơn 09D732899 - Phạm Minh Tuấn">1. Đơn 09D732899 - Phạm Minh Tuấn</option>
                <option value="2. Đơn 10D732900 - Trần Văn Hùng">2. Đơn 10D732900 - Trần Văn Hùng</option>
              </select>
            </div>

            <div>
              <label style={lblSt}>
                <span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Kết quả giải quyết đơn
              </label>
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: "#111827" }}>
                  <input
                    type="radio"
                    name="ketQuaGQ"
                    checked={ketQuaGQ === "tra-loi"}
                    onChange={() => setKetQuaGQ("tra-loi")}
                    style={{ accentColor: "#800000", cursor: "pointer" }}
                  />
                  <span style={{ fontWeight: ketQuaGQ === "tra-loi" ? 700 : 400 }}>Trả lời đơn</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: "#111827" }}>
                  <input
                    type="radio"
                    name="ketQuaGQ"
                    checked={ketQuaGQ === "khang-nghi"}
                    onChange={() => setKetQuaGQ("khang-nghi")}
                    style={{ accentColor: "#800000", cursor: "pointer" }}
                  />
                  <span style={{ fontWeight: ketQuaGQ === "khang-nghi" ? 700 : 400 }}>Kháng nghị</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: "#111827" }}>
                  <input
                    type="radio"
                    name="ketQuaGQ"
                    checked={ketQuaGQ === "xep-don"}
                    onChange={() => setKetQuaGQ("xep-don")}
                    style={{ accentColor: "#800000", cursor: "pointer" }}
                  />
                  <span style={{ fontWeight: ketQuaGQ === "xep-don" ? 700 : 400 }}>Xếp đơn</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: "#111827" }}>
                  <input
                    type="radio"
                    name="ketQuaGQ"
                    checked={ketQuaGQ === "vks-dang-giai-quyet"}
                    onChange={() => setKetQuaGQ("vks-dang-giai-quyet")}
                    style={{ accentColor: "#800000", cursor: "pointer" }}
                  />
                  <span style={{ fontWeight: ketQuaGQ === "vks-dang-giai-quyet" ? 700 : 400 }}>Viện kiểm sát đang giải quyết</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Thông tin quyết định */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#800000", fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
              <span>■ Thông tin quyết định</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={lblSt}>Ngày quyết định</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={ngayQuyetDinh}
                    onChange={e => setNgayQuyetDinh(e.target.value)}
                    placeholder="Chọn ngày quyết định"
                    style={{ ...inSt, paddingRight: 28 }}
                  />
                  <Calendar size={14} color="#9ca3af" style={{ position: "absolute", right: 8, top: 9, pointerEvents: "none" }} />
                </div>
              </div>

              <div>
                <label style={lblSt}>Số quyết định</label>
                <input
                  type="text"
                  value={soQuyetDinh}
                  onChange={e => setSoQuyetDinh(e.target.value)}
                  placeholder="Nhập số quyết định"
                  style={inSt}
                />
              </div>

              <div>
                <label style={lblSt}>
                  <span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Người ký ban hành
                </label>
                <select
                  value={nguoiKy}
                  onChange={e => setNguoiKy(e.target.value)}
                  style={{ ...inSt, cursor: "pointer" }}
                >
                  <option value="Nguyễn Biên Thuỳ - Thẩm phán TANDTC">Nguyễn Biên Thuỳ - Thẩm phán TANDTC</option>
                  <option value="Phan Văn Nam - Phó Chánh án TANDTC">Phan Văn Nam - Phó Chánh án TANDTC</option>
                  <option value="Lê Hoàng Nam - Vụ trưởng Vụ 1">Lê Hoàng Nam - Vụ trưởng Vụ 1</option>
                  <option value="Lý Thái Phúc - Thẩm tra viên">Lý Thái Phúc - Thẩm tra viên</option>
                </select>
              </div>

              <div>
                <label style={lblSt}>Ngày phát hành</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={ngayPhatHanh}
                    onChange={e => setNgayPhatHanh(e.target.value)}
                    placeholder="Chọn ngày quyết định"
                    style={{ ...inSt, paddingRight: 28 }}
                  />
                  <Calendar size={14} color="#9ca3af" style={{ position: "absolute", right: 8, top: 9, pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            <div>
              <label style={lblSt}>
                <span style={{ color: "#dc2626", marginRight: 3 }}>*</span>
                {ketQuaGQ === "khang-nghi"
                  ? "Nội dung quyết định kháng nghị"
                  : ketQuaGQ === "xep-don"
                  ? "Nội dung thông báo xếp đơn"
                  : ketQuaGQ === "vks-dang-giai-quyet"
                  ? "Nội dung thông báo Viện kiểm sát đang giải quyết"
                  : "Nội dung trả lời"}
              </label>
              <textarea
                value={noiDung}
                onChange={e => setNoiDung(e.target.value)}
                placeholder={
                  ketQuaGQ === "khang-nghi"
                    ? "Nhập nội dung quyết định kháng nghị"
                    : ketQuaGQ === "xep-don"
                    ? "Nhập lý do và nội dung xếp đơn"
                    : ketQuaGQ === "vks-dang-giai-quyet"
                    ? "Nhập thông tin tình trạng xử lý của VKS"
                    : "Nhập nội dung trả lời"
                }
                rows={3}
                style={{ ...inSt, resize: "vertical", lineHeight: 1.5 }}
              />
            </div>
          </div>

          {/* Section 3: Nơi nhận */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ ...lblSt, marginBottom: 0, fontWeight: 600 }}>
                <span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Nơi nhận
              </label>
              <button
                type="button"
                onClick={() => setIsAddingNoiNhan(true)}
                style={{
                  background: "#800000",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "5px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: F,
                  cursor: "pointer",
                }}
              >
                Thêm nơi nhận
              </button>
            </div>

            <div style={{ border: "1px solid #e5e7eb", borderRadius: 4, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
                <thead>
                  <tr style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
                    <th style={{ padding: "8px 10px", width: 50, textAlign: "center", fontWeight: 600, color: "#374151", borderRight: "1px solid #e5e7eb" }}>
                      STT
                    </th>
                    <th style={{ padding: "8px 12px", width: 160, textAlign: "left", fontWeight: 600, color: "#374151", borderRight: "1px solid #e5e7eb" }}>
                      NƠI NHẬN
                    </th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#374151", borderRight: "1px solid #e5e7eb" }}>
                      NƠI NHẬN CHI TIẾT
                    </th>
                    <th style={{ padding: "8px 12px", width: 140, textAlign: "left", fontWeight: 600, color: "#374151", borderRight: "1px solid #e5e7eb" }}>
                      GHI CHÚ
                    </th>
                    <th style={{ padding: "8px 10px", width: 130, textAlign: "center", fontWeight: 600, color: "#374151" }}>
                      THAO TÁC
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {noiNhanList.map((item, idx) =>
                    editingId === item.id ? (
                      <tr key={item.id} style={{ background: "#eff6ff", borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #e5e7eb" }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: "6px 8px", borderRight: "1px solid #e5e7eb" }}>
                          <select
                            value={editNoiNhan}
                            onChange={e => setEditNoiNhan(e.target.value)}
                            style={{ ...inSt, padding: "4px 8px" }}
                          >
                            <option value="Khác">Khác</option>
                            <option value="Tòa án nhân dân">Tòa án nhân dân</option>
                            <option value="Viện kiểm sát nhân dân">Viện kiểm sát nhân dân</option>
                            <option value="Công an">Công an</option>
                          </select>
                        </td>
                        <td style={{ padding: "6px 8px", borderRight: "1px solid #e5e7eb" }}>
                          <input
                            value={editChiTiet}
                            onChange={e => setEditChiTiet(e.target.value)}
                            style={{ ...inSt, padding: "4px 8px" }}
                            placeholder="Nhập nơi nhận chi tiết"
                          />
                        </td>
                        <td style={{ padding: "6px 8px", borderRight: "1px solid #e5e7eb" }}>
                          <input
                            value={editGhiChu}
                            onChange={e => setEditGhiChu(e.target.value)}
                            style={{ ...inSt, padding: "4px 8px" }}
                            placeholder="Nhập ghi chú"
                          />
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(item.id)}
                              style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}
                            >
                              Lưu
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              style={{ background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}
                            >
                              Hủy
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr
                        key={item.id}
                        style={{
                          background: "#fff",
                          borderBottom: idx < noiNhanList.length - 1 ? "1px solid #e5e7eb" : "none",
                        }}
                      >
                        <td style={{ padding: "9px 10px", textAlign: "center", color: "#374151", borderRight: "1px solid #e5e7eb" }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: "9px 12px", color: "#111827", borderRight: "1px solid #e5e7eb" }}>
                          {item.noiNhan}
                        </td>
                        <td style={{ padding: "9px 12px", color: "#111827", borderRight: "1px solid #e5e7eb" }}>
                          {item.noiNhanChiTiet}
                        </td>
                        <td style={{ padding: "9px 12px", color: "#6b7280", borderRight: "1px solid #e5e7eb" }}>
                          {item.ghiChu}
                        </td>
                        <td style={{ padding: "9px 10px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(item)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 12, fontWeight: 500, padding: 0 }}
                            >
                              — Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNoiNhan(item.id)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 12, fontWeight: 500, padding: 0 }}
                            >
                              🗑 Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}

                  {/* Inline adding row */}
                  {isAddingNoiNhan && (
                    <tr style={{ background: "#fffdf5", borderTop: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #e5e7eb" }}>
                        {noiNhanList.length + 1}
                      </td>
                      <td style={{ padding: "6px 8px", borderRight: "1px solid #e5e7eb" }}>
                        <select
                          value={newNoiNhan}
                          onChange={e => setNewNoiNhan(e.target.value)}
                          style={{ ...inSt, padding: "4px 8px" }}
                        >
                          <option value="Khác">Khác</option>
                          <option value="Tòa án nhân dân">Tòa án nhân dân</option>
                          <option value="Viện kiểm sát nhân dân">Viện kiểm sát nhân dân</option>
                          <option value="Công an">Công an</option>
                        </select>
                      </td>
                      <td style={{ padding: "6px 8px", borderRight: "1px solid #e5e7eb" }}>
                        <input
                          value={newChiTiet}
                          onChange={e => setNewChiTiet(e.target.value)}
                          style={{ ...inSt, padding: "4px 8px" }}
                          placeholder="Nhập nơi nhận chi tiết"
                        />
                      </td>
                      <td style={{ padding: "6px 8px", borderRight: "1px solid #e5e7eb" }}>
                        <input
                          value={newGhiChu}
                          onChange={e => setNewGhiChu(e.target.value)}
                          style={{ ...inSt, padding: "4px 8px" }}
                          placeholder="Nhập ghi chú"
                        />
                      </td>
                      <td style={{ padding: "6px 8px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button
                            type="button"
                            onClick={handleSaveNewNoiNhan}
                            style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}
                          >
                            Lưu
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingNoiNhan(false)}
                            style={{ background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}
                          >
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
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            padding: "14px 20px",
            borderTop: "1px solid #e5e7eb",
            background: "#fff",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "7px 22px",
              background: "#fff",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: F,
              fontWeight: 500,
            }}
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: "7px 26px",
              background: "#800000",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: F,
            }}
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={handleToggleLaySo}
            style={{
              padding: "7px 20px",
              background: "#fff",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: F,
              fontWeight: 500,
            }}
          >
            {daLaySo ? "Hủy lấy số" : "Lấy số"}
          </button>
          <button
            type="button"
            onClick={() => setShowTrinhKy(true)}
            style={{
              padding: "7px 26px",
              background: "#800000",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: F,
            }}
          >
            Trình ký
          </button>
          <button
            type="button"
            onClick={() => setShowBieuMau(true)}
            style={{
              padding: "7px 20px",
              background: "#fff",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: F,
              fontWeight: 500,
            }}
          >
            Xem biểu mẫu
          </button>
        </div>
      </div>
    </div>
  );
}
