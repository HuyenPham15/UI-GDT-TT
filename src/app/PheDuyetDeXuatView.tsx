import React, { useState } from "react";
import { Search, Download, Printer, ChevronDown, Eye, RotateCcw, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, X } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, Badge, TaiKhoanPhanQuyenBar, type UserRoleType } from "./shared";

type Screen = "list" | "detail" | "bieu-mau";
type ListTab = "tat-ca" | "cho-duyet" | "da-duyet" | "tu-choi";
type DetailTab = "y-kien" | "thong-tin" | "ho-so";

const TH: React.CSSProperties = { padding: "9px 12px", background: BG, fontWeight: 700, fontSize: 11, color: "#374151", fontFamily: F, textAlign: "left" as const, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}` };
const TD: React.CSSProperties = { padding: "10px 12px", fontSize: 12, color: TEXT, fontFamily: F, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" as const };

const ROWS = [
  { id: 1, loaiAn: "hinh-su", tenDA: "Số TB: 10/YCBS – VA26-002012 (Hình sự)\nNgày TB: 9/7/2026", noiDung: "Giấy yêu cầu bổ sung", nguoi: "Vũ Văn Yến", ngay: "21/07/2026\n15:35:41", trangThai: "da-duyet", yKien: "Đã duyệt", uuTien: false },
  { id: 2, loaiAn: "dan-su", tenDA: "VA26-003102: Dương Thu Hằng – Tranh chấp hợp đồng vay tài sản", noiDung: "Tờ trình thẩm tra vụ việc số 1", nguoi: "Vũ Văn Yến", ngay: "21/07/2026\n11:19:29", trangThai: "da-duyet", yKien: "Đã duyệt", uuTien: false },
  { id: 3, loaiAn: "hanh-chinh", tenDA: "VA26-004150: Phạm Văn Cường – Khiếu kiện quyết định thu hồi đất", noiDung: "Công văn gửi nội bộ", nguoi: "Vũ Văn Yến", ngay: "21/07/2026\n11:19:24", trangThai: "da-duyet", yKien: "Đồng ý", uuTien: true },
  { id: 4, loaiAn: "hinh-su", tenDA: "VA26-002148: Đặng Thiên Dương – Tội cố ý gây thương tích\nTAND tỉnh Bắc Ninh", noiDung: "Tờ trình thẩm tra vụ việc số 2", nguoi: "Vũ Văn Yến", ngay: "21/07/2026\n16:29:54", trangThai: "da-duyet", yKien: "Đồng ý", uuTien: false },
  { id: 5, loaiAn: "vu-3", tenDA: "VA26-005201: Công ty Á Châu – Tranh chấp hợp đồng mua bán hàng hóa", noiDung: "Dự thảo trả lời đơn 00D9321 – Trần Minh Tuấn", nguoi: "Vũ Văn Yến", ngay: "21/07/2026\n11:19:39", trangThai: "da-duyet", yKien: "Đồng ý", uuTien: false },
  { id: 6, loaiAn: "hanh-chinh", tenDA: "VA26-004155: Nguyễn Văn Tiến – Khiếu kiện quyết định hành chính", noiDung: "Dự thảo trả lời đơn 000D987 – Chu Văn An", nguoi: "Nguyễn Văn Tiến", ngay: "21/07/2026\n09:37:27", trangThai: "da-duyet", yKien: "Đồng ý", uuTien: false },
  { id: 7, loaiAn: "vu-3", tenDA: "VA26-005300: Vụ án Công ty TNHH Delta – Giải quyết phá sản doanh nghiệp", noiDung: "Tờ trình xem xét thủ tục phá sản", nguoi: "Lý Thái Phúc", ngay: "22/07/2026\n14:10:00", trangThai: "da-duyet", yKien: "Đã duyệt", uuTien: true },
];

// ── Màn 3: Xem biểu mẫu (Word editor mock) ───────────────────────────────────

export function XemBieuMauScreen({ onClose, loaiPhieu }: { onClose: () => void; loaiPhieu?: string }) {
  const menuItems = ["Tệp", "Trang chủ", "Chèn", "Vẽ", "Bố cục", "Tham khảo", "Công tác", "Bảo vệ", "View", "Plugin"];
  const tools = ["B", "I", "U", "abo", "≡", "≡", "≡"];

  const isCongVanXacMinh = loaiPhieu === "Công văn xác minh";
  const docTitle = isCongVanXacMinh
    ? "Công văn yêu cầu chuyển hồ sơ vụ án - 527/CV-TANDTC"
    : loaiPhieu
    ? `${loaiPhieu} hồ sơ vụ án - /2026/${loaiPhieu === "Phiếu trả" ? "PT" : "PM"}-TA`
    : "Giấy xác nhận - /2026/TB-TA";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", flexDirection: "column", background: "#f3f3f3", fontFamily: F }}>
      {/* Top bar */}
      <div style={{ background: "#1e3a5f", color: "#fff", display: "flex", alignItems: "center", padding: "0 16px", height: 40, gap: 8 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
          <ChevronLeft size={16} /> Quay lại
        </button>
        <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{docTitle}</span>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
          ✏ Trình ký
        </button>
      </div>

      {/* Menu bar */}
      <div style={{ background: "#1e3a5f", borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", padding: "0 16px", height: 32 }}>
        {menuItems.map(m => (
          <button key={m} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.85)", fontSize: 12, padding: "0 10px", height: "100%" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            {m}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", padding: "4px 16px", gap: 6, height: 36 }}>
        <button style={{ padding: "2px 6px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: MUTED }}>↩</button>
        <button style={{ padding: "2px 6px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: MUTED }}>↪</button>
        <button style={{ padding: "2px 6px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: MUTED }}>🖨</button>
        <div style={{ width: 1, height: 20, background: BORDER, margin: "0 4px" }} />
        <select style={{ fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 3, padding: "1px 4px", fontFamily: "Times New Roman, serif" }}>
          <option>Times New Roman</option>
        </select>
        <select style={{ fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 3, padding: "1px 4px", width: 48 }}>
          <option>14</option>
        </select>
        <div style={{ width: 1, height: 20, background: BORDER, margin: "0 4px" }} />
        {tools.map((t, i) => (
          <button key={i} style={{ padding: "2px 6px", border: "none", background: "none", cursor: "pointer", fontSize: 12, fontFamily: "serif", fontWeight: t === "B" ? 700 : 400, fontStyle: t === "I" ? "italic" : "normal", textDecoration: t === "U" ? "underline" : t === "abo" ? "line-through" : "none", color: TEXT }}>{t}</button>
        ))}
        <div style={{ width: 1, height: 20, background: BORDER, margin: "0 4px" }} />
        <span style={{ fontSize: 11, color: MUTED }}>CharacterSt</span>
        <span style={{ fontSize: 11, color: MUTED, marginLeft: 6 }}>FakeCharac</span>
        <span style={{ fontSize: 11, color: MUTED, marginLeft: 6 }}>ParagraphStyle</span>
      </div>

      {/* Document area */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", padding: "32px 16px", background: "#e8e8e8" }}>
        {/* Side icons */}
        <div style={{ position: "fixed", left: 12, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 12, zIndex: 3100 }}>
          {["📋","💬","ℹ","🖼"].map((ic, i) => (
            <button key={i} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#555" }}>{ic}</button>
          ))}
        </div>
        {/* Search icon on right */}
        <div style={{ position: "fixed", right: 12, top: "30%", zIndex: 3100 }}>
          <Search size={18} color="#555" />
        </div>

        {/* A4 page */}
        <div contentEditable suppressContentEditableWarning style={{ background: "#fff", width: 595, minHeight: 842, boxShadow: "0 2px 16px rgba(0,0,0,0.18)", padding: "50px 60px", fontFamily: "Times New Roman, serif", color: "#000", lineHeight: 1.5, outline: "none" }}>
          {isCongVanXacMinh ? (
            <div>
              {/* Header two-column */}
              <div style={{ display: "grid", gridTemplateColumns: "45% 55%", gap: 12, marginBottom: 20, fontSize: 13 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Số: 527/CV-TANDTC</div>
                  <div style={{ fontSize: 12, fontStyle: "italic", marginTop: 2 }}>V/v: Yêu cầu chuyển hồ sơ vụ án</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Độc lập - Tự do - Hạnh phúc</div>
                  <div style={{ borderBottom: "1px solid #000", width: 160, margin: "4px auto 8px" }} />
                  <div style={{ fontStyle: "italic", fontSize: 12 }}>Hà Nội, ngày 14 tháng 5 năm 2026</div>
                </div>
              </div>

              {/* Recipient */}
              <div style={{ textAlign: "center", margin: "24px 0 20px" }}>
                <span style={{ fontWeight: 700, fontStyle: "italic", fontSize: 14 }}>
                  Kính gửi: Tòa Phúc thẩm Tòa án nhân dân tối cao tại Thành phố Hồ Chí Minh
                </span>
              </div>

              {/* Body */}
              <div style={{ textAlign: "justify", fontSize: 13, lineHeight: 1.75, display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ textIndent: 30, margin: 0 }}>
                  Căn cứ vào khoản 1 Điều 46 Luật Tổ chức Tòa án nhân dân và Điều 18 Bộ luật tố tụng dân sự;
                </p>

                <p style={{ textIndent: 30, margin: 0 }}>
                  Để có cơ sở giải quyết đơn đề nghị xem xét theo thủ tục giám đốc thẩm, tái thẩm của đương sự, đề nghị Tòa Phúc thẩm Tòa án nhân dân tối cao tại Thành phố Hồ Chí Minh chuyển cho Vụ Giám đốc, kiểm tra II Tòa án nhân dân tối cao hồ sơ vụ án <i>“Tranh chấp hợp đồng đặt cọc”</i> giữa các đương sự là:
                </p>

                <div style={{ paddingLeft: 40, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div>- Nguyên đơn: <b>Ông Võ Đông Phong</b></div>
                  <div>- Bị đơn: <b>Ông Phạm Thành Tài</b></div>
                </div>

                <p style={{ textIndent: 30, margin: 0 }}>
                  Do Ủy ban Thẩm phán Tòa án nhân dân cấp cao tại Thành phố Hồ Chí Minh xét xử tại Quyết định giám đốc thẩm số 157/2024/DS-GĐT ngày 11/06/2024.
                </p>

                <p style={{ fontStyle: "italic", textIndent: 30, margin: 0 }}>
                  (Hồ sơ gửi chuyển phát nhanh về địa chỉ: Vụ Giám đốc, kiểm tra II, Tòa án nhân dân tối cao - số 1 Phạm Văn Bạch, Cầu Giấy, Hà Nội trong thời hạn 07 ngày kể từ ngày nhận được Công văn yêu cầu chuyển hồ sơ vụ án).
                </p>

                <p style={{ textIndent: 30, margin: 0 }}>
                  Trường hợp hồ sơ vụ án đã được chuyển cho cơ quan, đơn vị khác thì đề nghị Quý Tòa thông báo lại cho Vụ Giám đốc, kiểm tra II Tòa án nhân dân tối cao để theo dõi.
                </p>
              </div>

              {/* Footer signatures */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 36, fontSize: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontStyle: "italic", marginBottom: 4 }}>Nơi nhận:</div>
                  <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                    <div>- Như trên;</div>
                    <div>- Đ/c Chánh án TANDTC (để b/c);</div>
                    <div>- Lưu VP, Vụ Giám đốc, kiểm tra II-TANDTC, THS.</div>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700 }}>TL. CHÁNH ÁN</div>
                  <div style={{ fontWeight: 700, textTransform: "uppercase" }}>KT. VỤ TRƯỞNG VỤ GIÁM ĐỐC,</div>
                  <div style={{ fontWeight: 700, textTransform: "uppercase" }}>KIỂM TRA II</div>
                </div>
              </div>
            </div>
          ) : loaiPhieu === "Phiếu mượn" ? (
            <div>
              {/* Header two-column */}
              <div style={{ display: "grid", gridTemplateColumns: "45% 55%", gap: 12, marginBottom: 20, fontSize: 13 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Số: 1/2026/CV-TANDTC</div>
                  <div style={{ fontSize: 12, fontStyle: "italic", marginTop: 2 }}>V/v: Yêu cầu chuyển hồ sơ vụ án</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Độc lập - Tự do - Hạnh phúc</div>
                  <div style={{ borderBottom: "1px solid #000", width: 160, margin: "4px auto 8px" }} />
                  <div style={{ fontStyle: "italic", fontSize: 12 }}>Hà Nội, ngày 28 tháng 2 năm 2026</div>
                </div>
              </div>

              {/* Recipient */}
              <div style={{ textAlign: "center", margin: "24px 0 20px" }}>
                <span style={{ fontWeight: 700, fontStyle: "italic", fontSize: 14 }}>
                  Kính gửi: Tòa án nhân dân tỉnh Quảng Ngãi
                </span>
              </div>

              {/* Body */}
              <div style={{ textAlign: "justify", fontSize: 13, lineHeight: 1.75, display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ textIndent: 30, margin: 0 }}>
                  Căn cứ vào khoản 1 Điều 20 Luật Tổ chức Tòa án nhân dân và Điều 18 Bộ luật Tố tụng dân sự;
                </p>

                <p style={{ textIndent: 30, margin: 0 }}>
                  Để có cơ sở giải quyết đơn đề nghị xem xét theo thủ tục giám đốc thẩm của đương sự, đề nghị Tòa án nhân dân tỉnh Quảng Ngãi chỉ đạo chuyển cho Vụ Giám đốc, kiểm tra về dân sự - Tòa án nhân dân tối cao hồ sơ vụ án giữa các đương sự là:
                </p>

                <div style={{ paddingLeft: 40, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div>- Nguyên đơn: <b>Võ Thị Hoàng Oanh</b></div>
                  <div>- Bị đơn: <b>Nguyễn Thị Kim Bích</b></div>
                </div>

                <p style={{ textIndent: 30, margin: 0 }}>
                  Do Tòa án nhân dân tỉnh Quảng Ngãi xét xử phúc thẩm tại Bản án phúc thẩm số 56/2017/DSPT ngày 14/06/2017.
                </p>

                <p style={{ fontStyle: "italic", textIndent: 30, margin: 0 }}>
                  (Hồ sơ gửi chuyển phát nhanh về địa chỉ: Vụ Giám đốc kiểm tra II, Tòa án nhân dân tối cao – ngõ 1 Phạm Văn Bạch, Cầu Giấy, Hà Nội trong thời hạn 07 ngày kể từ ngày nhận được Công văn yêu cầu chuyển hồ sơ vụ án)
                </p>

                <p style={{ textIndent: 30, margin: 0 }}>
                  Trường hợp hồ sơ vụ án đã được chuyển cho cơ quan, đơn vị khác thì đề nghị thông báo cho để theo dõi.
                </p>
              </div>

              {/* Footer signatures */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 36, fontSize: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontStyle: "italic", marginBottom: 4 }}>Nơi nhận:</div>
                  <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                    <div>- Như trên;</div>
                    <div>- Đ/c Chánh án TANDTC (để b/c);</div>
                    <div>- Lưu VP, Vụ Giám đốc, kiểm tra về dân sự-TANDTC, THS.</div>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700 }}>TL. CHÁNH ÁN</div>
                  <div style={{ fontWeight: 700, textTransform: "uppercase" }}>KT. VỤ TRƯỞNG VỤ GIÁM ĐỐC,</div>
                  <div style={{ fontWeight: 700, textTransform: "uppercase" }}>KIỂM TRA VỀ DÂN SỰ</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Header two-column */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24, fontSize: 13 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                  <div style={{ borderBottom: "1px solid #000", width: 120, margin: "4px auto" }} />
                  <div>Số: 12/TTr-TTV</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: 700 }}>Độc lập - Tự do - Hạnh phúc</div>
                  <div style={{ borderBottom: "1px solid #000", width: 180, margin: "4px auto" }} />
                  <div style={{ fontStyle: "italic" }}>Hà Nội, ngày 08 tháng 04 năm 2026</div>
                </div>
              </div>

              {/* Title */}
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                {loaiPhieu ? loaiPhieu.toUpperCase() : "TỜ TRÌNH"}
              </div>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, marginBottom: 20 }}>
                {loaiPhieu ? "HỒ SƠ VỤ ÁN" : "THẨM TRA VỤ VIỆC"}
              </div>

              {/* Body */}
              <p style={{ marginBottom: 12, fontSize: 13, lineHeight: 1.7 }}>
                <strong>Kính trình:</strong> Lãnh đạo Tòa án nhân dân tối cao
              </p>
              <p style={{ marginBottom: 12, fontSize: 13, lineHeight: 1.7 }}>
                Căn cứ đơn đề nghị xem xét theo thủ tục giám đốc thẩm, tái thẩm và các tài liệu có trong hồ sơ vụ việc; Thẩm tra viên báo cáo kết quả nghiên cứu hồ sơ như sau:
              </p>
              <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>I. THÔNG TIN CHUNG</p>
              <ol style={{ paddingLeft: 24, fontSize: 13, lineHeight: 2, marginBottom: 12 }}>
                <li>Số bản án: 137120/2026/HSST-QĐ</li>
                <li>Tòa án xét xử: Tòa án nhân dân tối cao</li>
                <li>Người đề nghị: Nguyễn Văn A</li>
                <li>Nội dung đề nghị: Xem xét lại bản án theo thủ tục giám đốc thẩm, tái thẩm.</li>
              </ol>
              <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>II. NHẬN XÉT, ĐỀ XUẤT</p>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>
                Qua kiểm tra, hồ sơ có nội dung cần xin ý kiến lãnh đạo để thống nhất hướng xử lý. Thẩm tra viên kính đề nghị lãnh đạo xem xét, cho ý kiến chỉ đạo làm căn cứ thực hiện các bước tiếp theo theo đúng quy định.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom status bar */}
      <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}`, padding: "4px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: MUTED }}>
        <span>Trang 1 trên 1 &nbsp; Word count: 185</span>
        <span>🌐 English - United States &nbsp;&nbsp; Đơn vị phát triển: Gtel ICT 2025 &nbsp;&nbsp; 100%</span>
      </div>
    </div>
  );
}

// ── Modal: Lịch sử cho ý kiến ────────────────────────────────────────────────

const LICH_SU_DATA = [
  { don: "TLMT-10", nguoiGui: "Trần Văn Hùng", ngayNhan: "22/05/2026",
    rows: [
      { ngay: "15/05/2026", nguoi: "Nguyễn Văn B (Vụ trưởng)", noiDung: "Trả lời đơn" },
      { ngay: "10/05/2026", nguoi: "Trần Văn C (Thẩm tra viên)", noiDung: "Trả lời đơn" },
    ],
  },
  { don: "ĐTL", nguoiGui: "Trần Văn Hùng", ngayNhan: "20/05/2026",
    rows: [
      { ngay: "18/05/2026", nguoi: "Nguyễn Văn B (Vụ trưởng)", noiDung: "Trả lời đơn" },
    ],
  },
  { don: "TLMT-09", nguoiGui: "Trần Văn Hùng", ngayNhan: "22/05/2026",
    rows: [
      { ngay: "12/05/2026", nguoi: "Lê Thị D (Thẩm tra viên)", noiDung: "Trả lời đơn" },
    ],
  },
];

function LichSuModal({ idx, onClose }: { idx: number; onClose: () => void }) {
  const data = LICH_SU_DATA[idx];
  if (!data) return null;

  const thTd: React.CSSProperties = { padding: "8px 14px", fontSize: 12, fontFamily: F, borderBottom: `1px solid ${BORDER}`, textAlign: "left" as const };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 520, boxShadow: "0 8px 40px rgba(0,0,0,0.2)", overflow: "hidden", fontFamily: F }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Lịch sử cho ý kiến</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>
              Đơn: {data.don} | Người gửi: {data.nguoiGui} | Ngày nhận: {data.ngayNhan}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: BG }}>
              {["NGÀY", "NGƯỜI CHO Ý KIẾN", "NỘI DUNG Ý KIẾN"].map(h => (
                <th key={h} style={{ ...thTd, fontWeight: 700, fontSize: 11, color: "#374151", borderRight: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...thTd, borderRight: `1px solid ${BORDER}`, whiteSpace: "nowrap" as const, color: MUTED }}>{r.ngay}</td>
                <td style={{ ...thTd, borderRight: `1px solid ${BORDER}`, fontWeight: 600 }}>{r.nguoi}</td>
                <td style={{ ...thTd, color: MUTED }}>{r.noiDung}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "6px 24px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

// ── Màn 2: Phê duyệt ý kiến (detail) ────────────────────────────────────────

const Y_KIEN_OPTIONS = ["Trả lời đơn", "Kháng nghị", "VKS đang xử lý", "Xếp đơn", "Nghiên cứu, xác minh, bổ sung"];

function PheDuyetDetail({ onClose, onXemBieuMau }: { onClose: () => void; onXemBieuMau: () => void }) {
  const [tab, setTab] = useState<DetailTab>("y-kien");
  const [yKien, setYKien] = useState("Kháng nghị");
  const [noiDungYKien, setNoiDungYKien] = useState("");
  const [gqRutGon, setGqRutGon] = useState(false);
  const [lichSuIdx, setLichSuIdx] = useState<number | null>(null);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "10px 20px", fontSize: 13, fontFamily: F, fontWeight: active ? 700 : 400,
    color: active ? RED : TEXT, background: "none", border: "none", cursor: "pointer",
    borderBottom: active ? `2px solid ${RED}` : "2px solid transparent",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, fontFamily: F }}>
      {lichSuIdx !== null && <LichSuModal idx={lichSuIdx} onClose={() => setLichSuIdx(null)} />}
      {/* Red header */}
      <div style={{ background: RED, color: "#fff", padding: "14px 24px" }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Phê duyệt ý kiến</div>
        <div style={{ fontSize: 12, marginTop: 4, opacity: 0.9 }}>Tờ trình vụ án thẩm tra hình sự - Vụ án Phan Văn Thành - bức cung</div>
      </div>

      {/* Split layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left panel */}
        <div style={{ width: 520, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: `1px solid ${BORDER}`, overflowY: "auto" }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
            {([["y-kien", "Ý kiến lãnh đạo"], ["thong-tin", "Thông tin tờ trình"], ["ho-so", "Hồ sơ tờ trình"]] as [DetailTab, string][]).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={tabStyle(tab === k)}>{l}</button>
            ))}
          </div>

          {tab === "y-kien" && (
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
              {/* Checkbox */}
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={gqRutGon} onChange={e => setGqRutGon(e.target.checked)} style={{ width: 14, height: 14, accentColor: "#1d4ed8" }} />
                Giải quyết theo thủ tục rút gọn
              </label>

              {/* Ý kiến */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Ý kiến</span>
                  <button onClick={() => setLichSuIdx(0)} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 12, fontFamily: F }}>Lịch sử cho ý kiến</button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  {Y_KIEN_OPTIONS.map(opt => (
                    <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer", color: TEXT }}>
                      <input type="radio" name="y-kien" checked={yKien === opt} onChange={() => setYKien(opt)} style={{ width: 14, height: 14, accentColor: RED }} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Nội dung ý kiến */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 6 }}><span style={{ color: RED }}>*</span> Nội dung ý kiến</div>
                <textarea value={noiDungYKien} onChange={e => setNoiDungYKien(e.target.value)} placeholder="Vui lòng nhập ý kiến..." rows={7}
                  style={{ width: "100%", padding: "8px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", resize: "vertical" as const, boxSizing: "border-box" as const }} />
              </div>

              {/* Đề xuất trình tiếp */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 8, textTransform: "uppercase" as const }}>Đề Xuất Trình Tiếp</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {["Cấp trình", "Chọn lãnh đạo"].map((ph, i) => (
                    <div key={i} style={{ position: "relative" as const }}>
                      <select style={{ width: "100%", padding: "6px 28px 6px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", appearance: "none" as const, background: "#fff", cursor: "pointer" }}>
                        <option value="">{ph}</option>
                      </select>
                      <ChevronDown size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "thong-tin" && (
            <div style={{ padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 0", fontSize: 12 }}>
                {[["Số tờ trình", "12/TTr-TTV"], ["Ngày tờ trình", "08/04/2026"], ["Người tạo", "Vũ Văn Yến"], ["Vụ việc", "Vụ án Phan Văn Thành – bức cung"], ["Trạng thái", "Chờ duyệt"]].map(([k, v]) => (
                  <React.Fragment key={k}>
                    <span style={{ color: MUTED, fontWeight: 600 }}>{k}</span>
                    <span style={{ color: TEXT }}>{v}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {tab === "ho-so" && (
            <div style={{ padding: 20, color: MUTED, fontSize: 12, textAlign: "center" as const, marginTop: 40 }}>Không có hồ sơ đính kèm</div>
          )}

          {/* Footer buttons */}
          <div style={{ borderTop: `1px solid ${BORDER}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const, flexShrink: 0 }}>
            <button style={{ padding: "6px 18px", background: RED, color: "#fff", border: `2px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu</button>
            <button style={{ padding: "6px 18px", background: "#fff", color: RED, border: `2px dashed ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>Sửa biểu mẫu</button>
            <button style={{ padding: "6px 18px", background: RED, color: "#fff", border: `2px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu và ký</button>
            <button style={{ padding: "6px 18px", background: "#fff", color: TEXT, border: `2px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Từ chối</button>
            <button onClick={onClose} style={{ padding: "6px 18px", background: "#fff", color: TEXT, border: `2px dashed ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
          </div>
        </div>

        {/* Right panel: PDF preview */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#e8e8e8" }}>
          {/* PDF toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 16px", background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
            <ZoomIn size={15} color={MUTED} style={{ cursor: "pointer" }} />
            <span style={{ fontSize: 12, color: TEXT }}>100%</span>
            <ZoomOut size={15} color={MUTED} style={{ cursor: "pointer" }} />
            <div style={{ flex: 1 }} />
            <ChevronLeft size={15} color={MUTED} style={{ cursor: "pointer" }} />
            <span style={{ fontSize: 12, color: TEXT }}>1 /2</span>
            <ChevronRight size={15} color={MUTED} style={{ cursor: "pointer" }} />
            <div style={{ flex: 1 }} />
            <Download size={15} color={MUTED} style={{ cursor: "pointer" }} />
            <Printer size={15} color={MUTED} style={{ cursor: "pointer" }} />
            <button onClick={onXemBieuMau} style={{ padding: "4px 12px", background: "none", border: `1px solid ${BORDER}`, borderRadius: 3, cursor: "pointer", fontSize: 11, fontFamily: F, color: TEXT }}>Xem biểu mẫu</button>
          </div>

          {/* PDF page */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", padding: "24px" }}>
            <div style={{ background: "#fff", width: 440, minHeight: 620, boxShadow: "0 2px 12px rgba(0,0,0,0.15)", padding: "40px 48px", fontFamily: "Times New Roman, serif", fontSize: 12, lineHeight: 1.8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16, textAlign: "center" as const, fontSize: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                  <div style={{ borderBottom: "1px solid #000", width: 90, margin: "3px auto" }} />
                  <div>Số: 12/TTr-TTV</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 11 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA<br />VIỆT NAM</div>
                  <div style={{ fontWeight: 700, fontSize: 11 }}>Độc lập - Tự do - Hạnh phúc</div>
                  <div style={{ borderBottom: "1px solid #000", width: 120, margin: "3px auto" }} />
                  <div style={{ fontStyle: "italic", fontSize: 11 }}>Hà Nội, ngày 08 tháng 04 năm 2026</div>
                </div>
              </div>
              <div style={{ textAlign: "center", fontWeight: 700, marginBottom: 2 }}>TỜ TRÌNH</div>
              <div style={{ textAlign: "center", fontWeight: 700, marginBottom: 16 }}>THẨM TRA VỤ VIỆC</div>
              <p style={{ marginBottom: 10 }}><strong>Kính trình:</strong> Lãnh đạo Tòa án nhân dân tối cao</p>
              <p style={{ marginBottom: 10 }}>Căn cứ đơn đề nghị xem xét theo thủ tục giám đốc thẩm, tái thẩm và các tài liệu có trong hồ sơ vụ việc; Thẩm tra viên báo cáo kết quả nghiên cứu hồ sơ như sau:</p>
              <p style={{ fontWeight: 700, marginBottom: 6 }}>I. THÔNG TIN CHUNG</p>
              <ol style={{ paddingLeft: 18, marginBottom: 10 }}>
                <li>Số bản án: 137120/2026/HSST-QĐ</li>
                <li>Tòa án xét xử: Tòa án nhân dân tối cao</li>
                <li>Người đề nghị: Nguyễn Văn A</li>
                <li>Nội dung đề nghị: Xem xét lại bản án theo thủ tục giám đốc thẩm, tái thẩm.</li>
              </ol>
              <p style={{ fontWeight: 700, marginBottom: 6 }}>II. NHẬN XÉT, ĐỀ XUẤT</p>
              <p>Qua kiểm tra, hồ sơ có nội dung cần xin ý kiến lãnh đạo để thống nhất hướng xử lý. Thẩm tra viên kính đề nghị lãnh đạo xem xét, cho ý kiến chỉ đạo làm căn cứ thực hiện các bước tiếp theo theo đúng quy định.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PheDuyetDeXuatView({
  userRole: propUserRole,
  setUserRole: propSetUserRole,
}: {
  userRole?: UserRoleType;
  setUserRole?: (role: UserRoleType) => void;
} = {}) {
  const [internalRole, setInternalRole] = useState<UserRoleType>("vu-1");
  const userRole = propUserRole ?? internalRole;
  const setUserRole = propSetUserRole ?? setInternalRole;
  const [screen, setScreen] = useState<Screen>("list");
  const [activeTab, setActiveTab] = useState<ListTab>("da-duyet");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  if (screen === "bieu-mau") return <XemBieuMauScreen onClose={() => setScreen("detail")} />;
  if (screen === "detail") return <PheDuyetDetail onClose={() => setScreen("list")} onXemBieuMau={() => setScreen("bieu-mau")} />;

  const filteredByRole = ROWS.filter(r => {
    if (userRole === "vu-1" || userRole === "hinh-su") return r.loaiAn === "vu-1" || r.loaiAn === "hinh-su";
    if (userRole === "vu-2" || userRole === "dan-su") return r.loaiAn === "vu-2" || r.loaiAn === "dan-su";
    if (userRole === "vu-3") return r.loaiAn === "vu-3" || r.loaiAn === "kdtm-ld";
    if (userRole === "vu-4" || userRole === "hanh-chinh") return r.loaiAn === "vu-4" || r.loaiAn === "hanh-chinh";
    return true;
  });

  const TABS: { id: ListTab; label: string; count: number }[] = [
    { id: "tat-ca", label: "Tất cả", count: filteredByRole.length },
    { id: "cho-duyet", label: "Chờ duyệt", count: filteredByRole.filter(r => r.trangThai === "cho-duyet").length },
    { id: "da-duyet", label: "Đã duyệt", count: filteredByRole.filter(r => r.trangThai === "da-duyet").length },
    { id: "tu-choi", label: "Từ chối", count: filteredByRole.filter(r => r.trangThai === "tu-choi").length },
  ];

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 16px", background: "none", border: "none", cursor: "pointer",
    fontSize: 13, fontFamily: F, fontWeight: active ? 700 : 400,
    color: active ? RED : TEXT,
    borderBottom: active ? `2px solid ${RED}` : "2px solid transparent",
    display: "flex", alignItems: "center", gap: 6,
  });

  const filteredRows = activeTab === "tat-ca" ? filteredByRole
    : activeTab === "da-duyet" ? filteredByRole.filter(r => r.trangThai === "da-duyet")
    : filteredByRole.filter(r => r.trangThai === activeTab);

  return (
    <div style={{ padding: "20px 24px", fontFamily: F, overflowY: "auto", height: "100%" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>
        Trang chủ / Công tác lãnh đạo / Phê duyệt đề xuất / <span style={{ color: TEXT }}>Danh sách đề xuất</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, margin: 0 }}>Danh sách đề xuất</h2>
        <TaiKhoanPhanQuyenBar userRole={userRole} setUserRole={setUserRole} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, marginBottom: 16 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={tabStyle(activeTab === t.id)}>
            {t.label}
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              minWidth: 20, height: 20, borderRadius: 10, fontSize: 11, fontWeight: 700,
              background: activeTab === t.id ? RED : "#e5e7eb",
              color: activeTab === t.id ? "#fff" : MUTED, padding: "0 5px",
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Filter panel */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          {[["Người tạo đề xuất", "Chọn người tạo"], ["Loại đề xuất", "Chọn loại"], ["Trạng thái", "Chọn trạng thái"]].map(([label, ph]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{label}</label>
              <div style={{ position: "relative" as const }}>
                <select style={{ width: "100%", padding: "6px 28px 6px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", appearance: "none" as const, background: "#fff", cursor: "pointer" }}>
                  <option value="">{ph}</option>
                </select>
                <ChevronDown size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày tạo đề xuất</label>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input type="date" defaultValue="2026-07-21" style={{ flex: 1, padding: "5px 8px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none" }} />
              <span style={{ color: MUTED, fontSize: 12 }}>→</span>
              <input type="date" defaultValue="2026-07-21" style={{ flex: 1, padding: "5px 8px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none" }} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <Search size={13} color="#fff" /> Tìm kiếm
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: MUTED }}>
            <X size={13} /> Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
        {/* Table header bar */}
        <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách đề xuất</span>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}>
            <Download size={13} /> Kết xuất
          </button>
          <button style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 8px", cursor: "pointer", marginLeft: 6 }}>
            <RotateCcw size={13} color={MUTED} />
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr>
                {["STT", "Tên dự án/Tên quyết định", "Nội dung đề xuất", "Người đề xuất", "Ngày đề xuất", "Trạng thái", "Ý kiến lãnh đạo", "Thao tác"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r, i) => (
                <tr key={r.id}
                  style={{ background: selectedRow === r.id ? "#fef2f2" : i % 2 === 0 ? "#fff" : "#fafafa", cursor: "pointer" }}
                  onClick={() => setSelectedRow(r.id)}>
                  <td style={{ ...TD, textAlign: "center" as const, color: MUTED, width: 40 }}>{i + 1}</td>
                  <td style={{ ...TD, fontWeight: 600, whiteSpace: "pre-line" as const }}>{r.tenDA}</td>
                  <td style={TD}>
                    <span style={{ color: r.noiDung.startsWith("Dự thảo") ? "#2563eb" : TEXT }}>{r.noiDung}</span>
                    {r.uuTien && <Badge color="#92400e" bg="#fef3c7" style={{ marginLeft: 6 }}>Ưu tiên</Badge>}
                  </td>
                  <td style={TD}>{r.nguoi}</td>
                  <td style={{ ...TD, whiteSpace: "pre-line" as const, fontSize: 11 }}>{r.ngay}</td>
                  <td style={TD}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: "#dcfce7", borderRadius: 12, fontSize: 11, fontWeight: 600, color: "#15803d" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
                      Đã duyệt
                    </div>
                  </td>
                  <td style={{ ...TD, color: "#16a34a", fontWeight: 600 }}>{r.yKien}</td>
                  <td style={{ ...TD, textAlign: "center" as const }}>
                    <button onClick={e => { e.stopPropagation(); setScreen("detail"); }}
                      style={{ background: "none", border: selectedRow === r.id ? `1px dashed #2563eb` : "none", borderRadius: 4, cursor: "pointer", padding: "4px 8px" }}>
                      <Eye size={15} color="#0e7490" />
                    </button>
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
