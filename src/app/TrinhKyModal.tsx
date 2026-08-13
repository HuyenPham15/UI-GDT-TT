import React, { useState } from "react";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Search,
  Download,
  Printer,
  FileText,
  File,
  X,
  Folder,
  ChevronDown,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge } from "./shared";

// ── Modal / Màn hình Hồ sơ tờ trình (Đồng bộ chuẩn giao diện theo mẫu ảnh) ─────────────
export function HoSoToTrinhModal({
  row,
  onClose,
  onSave,
  onlyPrint = false,
}: {
  row?: any;
  onClose: () => void;
  onSave?: (doc: { ten: string; loai: string; size: string; ngay: string }) => void;
  onlyPrint?: boolean;
}) {
  const isHinhSu = !row || (row.loaiAn || "").includes("Hình sự");
  const caseTypeLabel = isHinhSu ? "hình sự" : "dân sự";
  const partyName = row?.biCao || row?.nkn || "Nguyễn Văn A";
  const address = row?.dcd || "Số 12, phố Phan Đình Phùng, phường Quán Thánh, quận Ba Đình, TP. Hà Nội";
  const soBA = row?.soBA || "12/2023/HS-ST";
  const ngayBA = row?.ngayBA || "25/06/2023";
  const toa = row?.toa || "TAND quận Thanh Xuân";
  const ttv = row?.ttv || "Lý Thái Phúc";

  // Danh sách 5 văn bản mặc định như ảnh mẫu
  const [docList, setDocList] = useState<Array<{ id: string; ten: string; loai: string; ngay: string; size?: string }>>([
    { id: "tt-1", ten: `Tờ trình thẩm tra vụ án ${caseTypeLabel} - ${partyName}`, loai: "PDF", ngay: row?.ngayThuLy || "25/06/2026", size: "1.2 MB" },
    { id: "tt-2", ten: `Bản án sơ thẩm số ${soBA}`, loai: "PDF", ngay: ngayBA, size: "850 KB" },
    { id: "tt-3", ten: "Quyết định kháng nghị giám đốc thẩm", loai: "PDF", ngay: "25/06/2026", size: "510 KB" },
    { id: "tt-4", ten: "Biên bản lấy lời khai nhân chứng", loai: "FILE", ngay: "25/06/2026", size: "420 KB" },
    { id: "tt-5", ten: "Kết luận giám định pháp y", loai: "PDF", ngay: "25/06/2026", size: "640 KB" },
  ]);

  const [selectedDocId, setSelectedDocId] = useState("tt-1");
  const [checkedDocIds, setCheckedDocIds] = useState<Record<string, boolean>>({});
  const [showChonTaiLieuModal, setShowChonTaiLieuModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(190);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15;

  // Toggle checkbox 1 văn bản
  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedDocIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Xóa văn bản đơn lẻ
  const handleDeleteDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocList(prev => prev.filter(d => d.id !== id));
    if (selectedDocId === id) {
      const remaining = docList.filter(d => d.id !== id);
      if (remaining.length > 0) setSelectedDocId(remaining[0].id);
    }
  };

  // Xóa hàng loạt văn bản đã tích chọn
  const handleBatchDelete = () => {
    const idsToDelete = Object.keys(checkedDocIds).filter(id => checkedDocIds[id]);
    if (idsToDelete.length === 0) {
      alert("Vui lòng chọn ít nhất một văn bản để xóa.");
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${idsToDelete.length} văn bản khỏi Hồ sơ tờ trình?`)) {
      setDocList(prev => prev.filter(d => !checkedDocIds[d.id]));
      setCheckedDocIds({});
      const remaining = docList.filter(d => !checkedDocIds[d.id]);
      if (remaining.length > 0) setSelectedDocId(remaining[0].id);
    }
  };

  // Tài liệu đang được chọn xem preview
  const currentDoc = docList.find(d => d.id === selectedDocId) || docList[0];

  const renderPaperContent = () => {
    return (
      <>
        {/* Header Phụ lục */}
        <div style={{ textAlign: "center", fontWeight: 700, fontSize: 13, textTransform: "uppercase", marginBottom: 4 }}>
          PHỤ LỤC I
        </div>
        <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, textTransform: "uppercase", marginBottom: 4 }}>
          TỜ TRÌNH THẨM TRA VỤ ÁN {caseTypeLabel.toUpperCase()}
        </div>
        <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 11, marginBottom: 20 }}>
          (Kèm theo Quyết định số 75/QĐ-CA ngày 06 tháng 4 năm 2026 của Chánh án Tòa án nhân dân tối cao)
        </div>

        {/* Hai cột cơ quan ban hành & Quốc hiệu */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div style={{ textAlign: "center", width: "45%" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>VỤ GIÁM ĐỐC, KIỂM TRA ....</div>
            <div style={{ width: 80, borderBottom: "1px solid #000", margin: "4px auto" }} />
          </div>
          <div style={{ textAlign: "center", width: "50%" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div style={{ fontSize: 11, fontWeight: 700 }}>Độc lập - Tự do - Hạnh phúc</div>
            <div style={{ width: 120, borderBottom: "1px solid #000", margin: "4px auto 8px" }} />
            <div style={{ fontStyle: "italic", fontSize: 11 }}>Hà Nội, ngày &nbsp;&nbsp; tháng &nbsp;&nbsp; năm 202..</div>
          </div>
        </div>

        {/* Tiêu đề Tờ trình */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 14, textTransform: "uppercase", marginBottom: 4 }}>TỜ TRÌNH</div>
          <div style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", marginBottom: 6 }}>CHÁNH ÁN TÒA ÁN NHÂN DÂN TỐI CAO</div>
          <div style={{ fontStyle: "italic", fontSize: 11.5, lineHeight: 1.5 }}>
            Về vụ án {partyName} {isHinhSu ? 'bị kết án về tội "......" ở tỉnh, thành phố.....' : 'tranh chấp hợp đồng mua bán nhà ở và QSDĐ...'}<br />
            Bản án sơ thẩm số {soBA} ngày {ngayBA} của {toa}
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div style={{ fontSize: 12, textAlign: "justify" }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>1. {isHinhSu ? "Người bị kết án" : "Đương sự / Bị đơn"}</div>
          <p style={{ margin: "0 0 10px", textIndent: 24 }}>
            Họ và tên: <b>{partyName}</b>; Sinh năm: 1988 tại TP. Hà Nội; Nơi ĐKHKTT / Địa chỉ: {address}; Nghề nghiệp: Lao động tự do; Tiền án, tiền sự: Không.
          </p>

          <div style={{ fontWeight: 700, marginBottom: 6 }}>2. Tóm tắt nội dung vụ án và quá trình giải quyết</div>
          <p style={{ margin: "0 0 10px", textIndent: 24 }}>
            Theo các tài liệu có trong hồ sơ vụ án, {isHinhSu ? `khoảng 21h30 ngày 15/01/2023, tại khu vực đường Nguyễn Trãi, quận Thanh Xuân, ${partyName} đã có hành vi điều khiển phương tiện giao thông vi phạm quy định, gây thiệt hại nghiêm trọng.` : `vụ án phát sinh tranh chấp hợp đồng và quyền sử dụng đất đai giữa các đương sự liên quan đến quyền lợi của ${partyName}.`}
          </p>
          <p style={{ margin: "0 0 10px", textIndent: 24 }}>
            Tại Bản án sơ thẩm số {soBA} ngày {ngayBA} của Tòa án nhân dân {toa} đã quyết định tuyên xử giải quyết đối với các yêu cầu của đương sự.
          </p>

          <div style={{ fontWeight: 700, marginBottom: 6 }}>3. Nhận định và đề xuất của Thẩm tra viên</div>
          <p style={{ margin: "0 0 10px", textIndent: 24 }}>
            Qua nghiên cứu toàn bộ hồ sơ vụ án, Thẩm tra viên <b>{ttv}</b> nhận thấy có một số nội dung chưa được làm rõ tại bản án trước đó, cần được xem xét giải quyết khách quan.
          </p>
          <p style={{ margin: "0 0 10px", textIndent: 24 }}>
            Kính trình Chánh án Tòa án nhân dân tối cao xem xét giải quyết vụ việc theo thủ tục Giám đốc thẩm/Tái thẩm đối với Bản án nêu trên theo đúng quy định của pháp luật.
          </p>
        </div>
      </>
    );
  };

  // ── Mode: chỉ mở popup in tờ trình chứ không trỏ thẳng đến hồ sơ ──
  if (onlyPrint) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1600, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: F }}>
        <div style={{ background: "#fff", borderRadius: 8, width: "95%", maxWidth: 840, height: "90%", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
          {/* Top Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", fontFamily: F }}>
              Xem trước bản in tờ trình
            </span>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 22,
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          {/* Action Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 20px",
              background: "#f9fafb",
              borderBottom: `1px solid ${BORDER}`,
              flexShrink: 0,
              fontFamily: F,
            }}
          >
            {/* Zoom controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
                title="Thu nhỏ"
              >
                <ZoomOut size={16} />
              </button>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", minWidth: 45, textAlign: "center" }}>
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(300, prev + 10))}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
                title="Phóng to"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Print and Download buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => alert(`Đang tải xuống tờ trình: Tờ trình thẩm tra vụ án ${caseTypeLabel} - ${partyName}`)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
                title="Tải xuống PDF"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => window.print()}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
                title="In tờ trình"
              >
                <Printer size={16} />
              </button>
            </div>
          </div>

          {/* Paper Viewport */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", padding: "24px 16px", background: "#6b7280" }}>
            <div
              style={{
                background: "#fff",
                width: "100%",
                maxWidth: 680,
                minHeight: 960,
                padding: "44px 56px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                fontFamily: "'Times New Roman', Times, serif",
                color: "#000",
                lineHeight: 1.7,
                boxSizing: "border-box",
                transform: `scale(${zoomLevel / 190})`,
                transformOrigin: "top center",
                marginBottom: 40,
              }}
            >
              {renderPaperContent()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Mode: hiển thị toàn màn hình Hồ sơ tờ trình (như ban đầu) ──
  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 1600, display: "flex", flexDirection: "column", fontFamily: F }}>
      {/* ── Modal Bổ sung tài liệu vào hồ sơ tờ trình ── */}
      {showChonTaiLieuModal && (
        <ChonTaiLieuBoSungModal
          onClose={() => setShowChonTaiLieuModal(false)}
          onAddDocs={(selectedDocs) => {
            setDocList(prev => {
              const next = [...prev];
              selectedDocs.forEach(newDoc => {
                if (!next.some(x => x.ten === newDoc.ten)) {
                  next.push(newDoc);
                }
              });
              return next;
            });
            setShowChonTaiLieuModal(false);
          }}
        />
      )}

      {/* ── Top Header Bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, background: "#fff" }}>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
            fontFamily: F,
          }}
        >
          <ArrowLeft size={16} /> Hồ sơ tờ trình
        </button>
      </div>

      {/* ── Main Layout Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* ── Left Panel: Danh sách văn bản ── */}
        <div style={{ width: 440, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0, background: "#fff" }}>
          {/* Header Danh sách văn bản & Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, background: "#fff" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827", fontFamily: F }}>
              Danh sách văn bản ({docList.length})
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={handleBatchDelete}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 12px",
                  background: "#fff",
                  color: "#374151",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: F,
                }}
              >
                <Trash2 size={13} /> Xóa
              </button>
              <button
                onClick={() => setShowChonTaiLieuModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 12px",
                  background: "#800000",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: F,
                }}
              >
                + Thêm tài liệu vào THS
              </button>
            </div>
          </div>

          {/* List of Document Cards */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
            {docList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: MUTED, fontSize: 13 }}>
                Chưa có văn bản nào trong Hồ sơ tờ trình.<br />
                Nhấn <b>+ Thêm tài liệu</b> để bổ sung tài liệu.
              </div>
            ) : (
              docList.map(doc => {
                const isSelected = doc.id === selectedDocId;
                const isChecked = !!checkedDocIds[doc.id];
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 6,
                      border: isSelected ? `1px solid #991b1b` : `1px solid #e5e7eb`,
                      background: isSelected ? "#fffdfd" : "#fff",
                      marginBottom: 8,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxShadow: isSelected ? "0 1px 4px rgba(153, 27, 27, 0.1)" : "none",
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) e.currentTarget.style.background = "#fff";
                    }}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => { }}
                      onClick={e => toggleCheck(doc.id, e)}
                      style={{ cursor: "pointer", accentColor: RED, width: 15, height: 15 }}
                    />

                    {/* PDF / File Icon */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FileText size={20} color="#dc2626" />
                    </div>

                    {/* Document Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? "#991b1b" : "#111827",
                          fontFamily: F,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: 1.4,
                        }}
                        title={doc.ten}
                      >
                        {doc.ten}
                      </div>
                      <div style={{ fontSize: 11, color: "#6b7280", fontFamily: F, marginTop: 2 }}>
                        {doc.loai} - {doc.ngay}
                      </div>
                    </div>

                    {/* Trash Delete Icon */}
                    <button
                      onClick={e => handleDeleteDoc(doc.id, e)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 4,
                        color: "#9ca3af",
                        display: "flex",
                        alignItems: "center",
                      }}
                      title="Xóa tài liệu"
                      onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Panel: PDF Viewer / Document Preview ── */}
        <div style={{ flex: 1, background: "#6b7280", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Viewer Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 16px",
              background: "#fff",
              borderBottom: `1px solid ${BORDER}`,
              flexShrink: 0,
              fontFamily: F,
            }}
          >
            {/* Zoom Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
                title="Thu nhỏ"
              >
                <ZoomOut size={16} />
              </button>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", minWidth: 45, textAlign: "center" }}>
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(300, prev + 10))}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
                title="Phóng to"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Page Navigation */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
                title="Trang trước"
              >
                ‹
              </button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: "#374151",
                }}
              >
                <input
                  type="text"
                  value={currentPage}
                  onChange={() => { }}
                  style={{
                    width: 28,
                    textAlign: "center",
                    padding: "2px 0",
                    border: "1px solid #d1d5db",
                    borderRadius: 3,
                    fontSize: 12,
                    fontFamily: F,
                  }}
                />
                <span>/ {totalPages}</span>
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
                title="Trang sau"
              >
                ›
              </button>
            </div>

            {/* Action Tools */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => alert("Đang tải xuống tài liệu: " + currentDoc?.ten)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
                title="Tải xuống PDF"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => window.print()}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
                title="In tài liệu"
              >
                <Printer size={16} />
              </button>
            </div>
          </div>

          {/* Document Content Viewport */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", padding: "24px 16px" }}>
            <div
              style={{
                background: "#fff",
                width: "100%",
                maxWidth: 680,
                minHeight: 960,
                padding: "44px 56px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                fontFamily: "'Times New Roman', Times, serif",
                color: "#000",
                lineHeight: 1.7,
                boxSizing: "border-box",
                transform: `scale(${zoomLevel / 190})`,
                transformOrigin: "top center",
                marginBottom: 40,
              }}
            >
              {renderPaperContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal Chọn tài liệu bổ sung (Giao diện Hồ sơ lưu trữ chuẩn theo ảnh mẫu) ─────────────────
function ChonTaiLieuBoSungModal({
  onClose,
  onAddDocs,
  tenVuAn = "Nguyễn Văn Minh – Tội cướp tài sản",
}: {
  onClose: () => void;
  onAddDocs: (docs: Array<{ id: string; ten: string; loai: string; ngay: string; size?: string }>) => void;
  tenVuAn?: string;
}) {
  const [hasData, setHasData] = useState<boolean>(true);
  const [selectedDocKey, setSelectedDocKey] = useState<string | null>("bl-01");
  const [selectedKeys, setSelectedKeys] = useState<Record<string, boolean>>({
    "bl-01": true,
    "bl-02": true,
  });
  const [showHistory, setShowHistory] = useState(false);

  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    "hien-tai": true,
    "so-tham": true,
    "phuc-tham": true,
  });

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const FOLDERS = [
    { id: "hien-tai", name: "Giai đoạn hiện tại" },
    { id: "so-tham", name: "Sơ thẩm" },
    { id: "phuc-tham", name: "Phúc thẩm" },
  ] as const;

  const sampleItems = [
    // Giai đoạn hiện tại
    {
      id: "bl-01",
      soButLuc: "01 - 15",
      ten: "Đơn đề nghị xem xét theo thủ tục Giám đốc thẩm và các phụ lục",
      loai: "PDF",
      ngay: "20/07/2026",
      soTrang: 15,
      size: "1.2 MB",
      giaiDoanId: "hien-tai",
    },
    {
      id: "bl-02",
      soButLuc: "81 - 150",
      ten: "Báo cáo thẩm tra vụ án và Tờ trình đề xuất Kháng nghị GĐT",
      loai: "PDF",
      ngay: "22/07/2026",
      soTrang: 70,
      size: "3.5 MB",
      giaiDoanId: "hien-tai",
    },
    // Sơ thẩm
    {
      id: "bl-03",
      soButLuc: "16 - 45",
      ten: "Bản án hình sự sơ thẩm số 124/2026/HS-ST",
      loai: "PDF",
      ngay: "20/07/2026",
      soTrang: 30,
      size: "2.4 MB",
      giaiDoanId: "so-tham",
    },
    {
      id: "bl-04",
      soButLuc: "151 - 220",
      ten: "Biên bản hỏi cung bị can và kết luận giám định pháp y sơ thẩm",
      loai: "FILE",
      ngay: "22/07/2026",
      soTrang: 70,
      size: "4.5 MB",
      giaiDoanId: "so-tham",
    },
    // Phúc thẩm
    {
      id: "bl-05",
      soButLuc: "46 - 80",
      ten: "Bản án hình sự phúc thẩm số 89/2026/HS-PT",
      loai: "PDF",
      ngay: "20/07/2026",
      soTrang: 35,
      size: "2.8 MB",
      giaiDoanId: "phuc-tham",
    },
    {
      id: "bl-06",
      soButLuc: "221 - 280",
      ten: "Đơn kháng cáo của bị cáo và biên bản phiên tòa phúc thẩm",
      loai: "PDF",
      ngay: "25/07/2026",
      soTrang: 60,
      size: "3.2 MB",
      giaiDoanId: "phuc-tham",
    },
  ];

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirm = () => {
    const selected = sampleItems
      .filter(f => selectedKeys[f.id])
      .map(f => ({
        id: "doc-" + Math.random().toString(36).substr(2, 9),
        ten: f.ten,
        loai: f.loai,
        ngay: f.ngay,
        size: f.size,
      }));

    if (selected.length === 0) {
      alert("Vui lòng chọn ít nhất một tài liệu.");
      return;
    }

    onAddDocs(selected);
  };

  const activeDoc = sampleItems.find(x => x.id === selectedDocKey);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1700,
        display: "flex",
        flexDirection: "column",
        fontFamily: F,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Top Header Bar ── */}
        <div
          style={{
            height: 48,
            background: "#fff",
            borderBottom: `1px solid ${BORDER}`,
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                color: TEXT,
                display: "flex",
                alignItems: "center",
              }}
              title="Quay lại"
            >
              <ArrowLeft size={17} />
            </button>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>
              Hồ sơ lưu trữ - Vụ án: {tenVuAn}
            </span>
          </div>

          {/* Quick state switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => {
                setHasData(!hasData);
                setSelectedDocKey(null);
              }}
              style={{
                padding: "4px 10px",
                background: hasData ? "#f0fdf4" : "#f1f5f9",
                color: hasData ? "#166534" : MUTED,
                border: `1px solid ${hasData ? "#bbf7d0" : BORDER}`,
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: F,
              }}
            >
              {hasData ? "● Đang xem: Dữ liệu hồ sơ mẫu" : "○ Đang xem: Trạng thái chưa có hồ sơ"}
            </button>
          </div>
        </div>

        {/* ── Sub-Header Bar ── */}
        <div
          style={{
            height: 38,
            background: "#fafafa",
            borderBottom: `1px solid ${BORDER}`,
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            fontSize: 12,
            fontFamily: F,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: TEXT, width: 280 }}>
              <span style={{ fontSize: 14 }}>≡</span> Hồ sơ lưu trữ
            </div>
            <div style={{ color: activeDoc ? "#1d4ed8" : MUTED, fontWeight: activeDoc ? 600 : 400 }}>
              {activeDoc ? activeDoc.ten : "Chưa chọn tài liệu"}
            </div>
          </div>

          {/* Right History Tab */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: MUTED,
              fontFamily: F,
              padding: "4px 8px",
            }}
          >
            <span>🕒</span> Lịch sử
          </button>
        </div>

        {/* ── Main Split Body ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
          {/* ── Left Sidebar Panel ── */}
          <div
            style={{
              width: 320,
              minWidth: 300,
              maxWidth: 340,
              background: "#fff",
              borderRight: `1px solid ${BORDER}`,
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            {/* Label Header for Documents */}
            <div style={{ padding: "10px 14px 6px", borderBottom: `1px solid ${BORDER}`, background: "#fafafa" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.5 }}>
                DANH SÁCH TÀI LIỆU ({hasData ? sampleItems.length : 0})
              </span>
            </div>

            {/* Content Area: Folders & Files Tree */}
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
              {!hasData ? (
                /* Empty State */
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: 220,
                    color: "#94a3b8",
                    textAlign: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "#f8fafc",
                      border: `1px dashed #cbd5e1`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Folder size={26} color="#94a3b8" />
                  </div>
                  <span style={{ fontSize: 12, color: "#64748b", fontFamily: F }}>
                    Chưa có hồ sơ lưu trữ
                  </span>
                </div>
              ) : (
                /* Folder Accordion List */
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {FOLDERS.map(folder => {
                    const folderItems = sampleItems.filter(item => item.giaiDoanId === folder.id);
                    const isOpen = openFolders[folder.id] ?? true;

                    return (
                      <div key={folder.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {/* Folder Header */}
                        <div
                          onClick={() => toggleFolder(folder.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "7px 10px",
                            borderRadius: 6,
                            background: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            cursor: "pointer",
                            userSelect: "none",
                          }}
                        >
                          {isOpen ? <ChevronDown size={14} color="#64748b" /> : <ChevronRight size={14} color="#64748b" />}
                          <Folder size={15} color="#d97706" fill="#fef3c7" />
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", flex: 1, fontFamily: F }}>
                            {folder.name}
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#475569",
                              background: "#e2e8f0",
                              padding: "1px 7px",
                              borderRadius: 10,
                            }}
                          >
                            {folderItems.length}
                          </span>
                        </div>

                        {/* Items inside folder */}
                        {isOpen && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 8, marginTop: 2 }}>
                            {folderItems.map(item => {
                              const isSelected = item.id === selectedDocKey;
                              const isChecked = !!selectedKeys[item.id];
                              return (
                                <div
                                  key={item.id}
                                  onClick={() => setSelectedDocKey(item.id)}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 8,
                                    padding: "8px 10px",
                                    borderRadius: 6,
                                    border: isSelected ? "1px solid #991b1b" : "1px solid #e2e8f0",
                                    background: isSelected ? "#fff5f5" : "#fff",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => { }}
                                    onClick={e => toggleSelect(item.id, e)}
                                    style={{ marginTop: 2, cursor: "pointer", accentColor: RED }}
                                  />
                                  <FileText size={15} color="#dc2626" style={{ marginTop: 2, flexShrink: 0 }} />
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                      style={{
                                        fontSize: 12,
                                        fontWeight: isSelected ? 700 : 500,
                                        color: isSelected ? "#991b1b" : "#1e293b",
                                        lineHeight: 1.3,
                                      }}
                                    >
                                      [BL {item.soButLuc}] {item.ten}
                                    </div>
                                    <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                                      {item.loai} · {item.soTrang} trang · {item.size}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Button */}
            <div style={{ padding: "10px 14px", borderTop: `1px solid ${BORDER}`, background: "#fafafa" }}>
              <button
                onClick={() => alert("Chức năng tải hồ sơ xuống máy")}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "7px 12px",
                  background: "#fff",
                  color: "#374151",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: F,
                }}
              >
                <Download size={14} /> Tải hồ sơ xuống
              </button>
            </div>
          </div>

          {/* ── Right Document Viewer ── */}
          <div
            style={{
              flex: 1,
              background: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {!hasData || !activeDoc ? (
              /* Empty State matching Screenshot */
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  textAlign: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "#f1f5f9",
                    border: `1px dashed #cbd5e1`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileText size={30} color="#94a3b8" />
                </div>
                <span style={{ fontSize: 13, color: "#64748b", fontFamily: F }}>
                  Chưa có hồ sơ lưu trữ
                </span>
              </div>
            ) : (
              /* Populated Document Preview */
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div
                  style={{
                    padding: "8px 16px",
                    background: "#fff",
                    borderBottom: `1px solid ${BORDER}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 12,
                  }}
                >
                  <div style={{ fontWeight: 600, color: TEXT }}>
                    📄 {activeDoc.ten}
                  </div>
                  <div style={{ display: "flex", gap: 10, color: MUTED }}>
                    <span>Số trang: {activeDoc.soTrang}</span>
                    <span>·</span>
                    <span>Dung lượng: {activeDoc.size}</span>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", padding: 24, background: "#6b7280" }}>
                  <div
                    style={{
                      background: "#fff",
                      width: "100%",
                      maxWidth: 680,
                      minHeight: 900,
                      padding: "44px 56px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                      fontFamily: "'Times New Roman', Times, serif",
                      color: "#000",
                      lineHeight: 1.7,
                      boxSizing: "border-box",
                    }}
                  >
                    <div style={{ textAlign: "center", fontWeight: 700, fontSize: 13, textTransform: "uppercase", marginBottom: 4 }}>
                      TÒA ÁN NHÂN DÂN TỐI CAO
                    </div>
                    <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, textTransform: "uppercase", marginBottom: 20 }}>
                      {activeDoc.ten}
                    </div>
                    <p style={{ textAlign: "justify", textIndent: 24, fontSize: 12 }}>
                      Căn cứ hồ sơ vụ án hình sự đối với bị cáo <b>Nguyễn Văn Minh</b> về tội "Cướp tài sản" theo quy định tại Điều 168 Bộ luật Hình sự. Toàn bộ tài liệu, chứng cứ, biên bản lấy lời khai và kết luận giám định đã được lưu trữ đầy đủ trong hệ thống lưu trữ điện tử.
                    </p>
                    <p style={{ textAlign: "justify", textIndent: 24, fontSize: 12 }}>
                      Tài liệu này được trích xuất từ Hồ sơ lưu trữ điện tử nhằm phục vụ công tác nghiên cứu, thẩm tra và lập Hồ sơ tờ trình xem xét theo thủ tục Giám đốc thẩm.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Modal Footer Bar (Đóng & Xác nhận bổ sung) ── */}
        <div
          style={{
            height: 52,
            background: "#fff",
            borderTop: `1px solid ${BORDER}`,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "7px 20px",
              background: "#fff",
              color: "#374151",
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: F,
            }}
          >
            Đóng
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: "7px 22px",
              background: RED,
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: F,
            }}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Trình ký – Tab Thông tin tờ trình ─────────────────────────────────────────
export function TrinhKyThongTinTab() {
  const [selected, setSelected] = useState("tong-hop");
  const docs = [
    {
      key: "tong-hop",
      label: "Tờ trình thẩm tra vụ việc",
      date: null,
      isDefault: true,
    },
    {
      key: "phieu-chanh-an",
      label: "Phiếu ký – Chánh án Nguyễn Hòa Bình",
      date: "15/07/2026",
      isDefault: false,
    },
    {
      key: "phieu-pho-ca-mai",
      label: "Phiếu ký – Phó Chánh án Nguyễn Thị Mai",
      date: "13/07/2026",
      isDefault: false,
    },
    {
      key: "phieu-vu-truong",
      label: "Phiếu ký – Vụ trưởng Lê Quang Minh",
      date: "11/07/2026",
      isDefault: false,
    },
    {
      key: "phieu-pho-vt-hoa",
      label: "Phiếu ký – Phó Vụ trưởng Trần Thị Hoa",
      date: "09/07/2026",
      isDefault: false,
    },
    {
      key: "phieu-tp-hiep",
      label: "Phiếu ký – Thẩm phán Nguyễn Tiến Hiệp",
      date: "08/07/2026",
      isDefault: false,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: -6 }}>
      {docs.map((d, idx) => (
        <div key={d.key}
          onClick={() => setSelected(d.key)}
          style={{
            display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px",
            cursor: "pointer", borderBottom: `1px solid ${BORDER}`,
            background: selected === d.key ? "#fef2f2" : idx === 0 ? "#f9fafb" : "#fff",
            borderLeft: selected === d.key ? `3px solid ${RED}` : "3px solid transparent",
          }}>
          <div style={{ marginTop: 2, flexShrink: 0 }}>
            {d.isDefault
              ? <span style={{ fontSize: 15 }}>📋</span>
              : <span style={{ fontSize: 14 }}>🖊</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: selected === d.key ? 700 : 500, color: d.isDefault ? RED : TEXT, fontFamily: F, wordBreak: "break-word" }}>{d.label}</div>
            {d.isDefault && (
              <span style={{ display: "inline-block", fontSize: 10, background: "#fee2e2", color: RED, borderRadius: 10, padding: "1px 7px", marginTop: 2, fontFamily: F }}>Mặc định</span>
            )}
          </div>
          {d.date && <div style={{ fontSize: 10, color: MUTED, fontFamily: F, flexShrink: 0, marginTop: 2 }}>{d.date}</div>}
        </div>
      ))}
    </div>
  );
}

// ── Trình ký – Tab Hồ sơ tờ trình ─────────────────────────────────────────────
export function TrinhKyHoSoTab() {
  const [selectedFile, setSelectedFile] = useState("hoa-pdf");
  const folders = [
    { key: "tai-lieu", label: "Tài liệu đánh dấu", count: 0 },
    { key: "tieu-ho-so", label: "Tiểu hồ sơ", count: 1 },
    { key: "ths1", label: "THS1", count: 0 },
  ];
  const files = [
    { key: "hoa-pdf", label: "Hoa", type: "PDF", size: "391 KB" },
    { key: "hoa-word", label: "Hoa", type: "Word", size: "400 KB" },
    { key: "cong-van", label: "Công văn gửi nội bộ", type: "PDF", size: "714 KB" },
  ];

  return (
    <div style={{ marginTop: -6, marginLeft: -16, marginRight: -16, display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F, fontWeight: 600, padding: "8px 12px", borderBottom: `2px solid ${RED}`, cursor: "pointer" }}>Giai đoạn hiện tại</span>
        <span style={{ fontSize: 11, color: MUTED, fontFamily: F, padding: "8px 12px", cursor: "pointer" }}>Các giai đoạn còn lại</span>
      </div>
      {/* Folders */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {folders.map(f => (
          <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", fontSize: 12, color: TEXT, fontFamily: F, cursor: "pointer", borderBottom: `1px solid ${BORDER}` }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <span style={{ fontSize: 10, color: MUTED }}>▶</span>
            <span>📁</span>
            <span style={{ flex: 1 }}>{f.label}</span>
            <span style={{ fontSize: 11, color: MUTED }}>{f.count}</span>
          </div>
        ))}
        {/* Open folder */}
        <div style={{ padding: "7px 12px", fontSize: 12, fontFamily: F }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, cursor: "pointer" }}>
            <span style={{ fontSize: 10, color: MUTED }}>▼</span>
            <span>📁</span>
            <span style={{ color: TEXT }}>03/06/2026</span>
            <span style={{ marginLeft: "auto", background: "#374151", color: "#fff", fontSize: 10, borderRadius: 10, padding: "1px 6px" }}>3</span>
          </div>
          {files.map(f => (
            <div key={f.key}
              onClick={() => setSelectedFile(f.key)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px 5px 20px", borderRadius: 4, cursor: "pointer", background: selectedFile === f.key ? "#fce7e7" : "none", marginBottom: 2 }}
              onMouseEnter={e => { if (selectedFile !== f.key) e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={e => { if (selectedFile !== f.key) e.currentTarget.style.background = "none"; }}>
              <input type="checkbox" readOnly checked={selectedFile === f.key} style={{ cursor: "pointer", accentColor: RED }} />
              <span>{f.type === "PDF" ? "📄" : "📝"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: selectedFile === f.key ? 600 : 400, color: TEXT }}>{f.label}</div>
                <div style={{ fontSize: 10, color: MUTED }}>{f.type} · {f.size}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Trình ký modal ─────────────────────────────────────────────────────────────
export function TrinhKyModal({ onClose }: { onClose: () => void }) {
  const [leftTab, setLeftTab] = useState<"noi-dung" | "thong-tin" | "ho-so">("noi-dung");
  const [capTrinh, setCapTrinh] = useState("Trình Phó vụ trưởng");
  const [uuTien, setUuTien] = useState("Binh-thuong");
  // For single-select cap trinh
  const [nguoiDon, setNguoiDon] = useState("");
  // For multi-select (To TP / HDTP / Du thao)
  const [checkedPeople, setCheckedPeople] = useState<Record<string, boolean>>({});
  const [danhSach, setDanhSach] = useState([
    { id: 1, cap: "Trình Phó vụ trưởng", lanh: "Trần Thị Hoa – Phó Vụ trưởng", uu: "Bình thường", uuKey: "Binh-thuong" },
  ]);

  const selSt: React.CSSProperties = { padding: "6px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", background: "#fff", width: "100%", cursor: "pointer" };

  const CAP_TRINH_OPTIONS = [
    "Trình Phó vụ trưởng",
    "Trình Vụ trưởng",
    "Trình thẩm phán",
    "Trình phó chánh án",
    "Trình chánh án",
    "Báo cáo tổ Thẩm phán",
    "Báo cáo Hội đồng thẩm phán",
    "Nghiên cứu lại, xác minh, bổ sung",
    "Trình dự thảo trả lời đơn",
    "Trình dự thảo kháng nghị",
  ];

  const UU_TIEN_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    "Cao": { label: "Cao", color: "#7f1d1d", bg: "#fee2e2" },
    "Binh-thuong": { label: "Bình thường", color: "#374151", bg: "#f3f4f6" },
    "Thap": { label: "Thấp", color: "#065f46", bg: "#d1fae5" },
  };

  // People lists per cấp trình type
  const TO_TP_LIST = [
    "Nguyễn Văn An – Thẩm phán", "Trần Thị Bình – Thẩm phán", "Lê Minh Cường – Thẩm phán",
    "Phạm Thị Dung – Thẩm phán", "Hoàng Văn Em – Thẩm phán", "Ngô Thị Phượng – Thẩm phán",
    "Bùi Quang Giang – Thẩm phán", "Đỗ Thị Hương – Thẩm phán", "Vũ Minh Khoa – Thẩm phán",
    "Đinh Thị Lan – Thẩm phán",
  ];
  const HDTP_LIST = [
    "Nguyễn Hòa Bình – Chánh án TANDTC", "Lê Minh Trí – Phó Chánh án", "Nguyễn Văn Du – Phó Chánh án",
    "Trần Văn Độ – Phó Chánh án", "Lê Hồng Quang – Thẩm phán TANDTC", "Nguyễn Duy Giảng – Thẩm phán TANDTC",
    "Trương Việt Toàn – Thẩm phán TANDTC", "Phạm Quốc Anh – Thẩm phán TANDTC",
    "Bùi Ngọc Hòa – Thẩm phán TANDTC", "Đặng Văn Khanh – Thẩm phán TANDTC",
    "Mai Thị Minh – Thẩm phán TANDTC", "Hồ Tấn Tài – Thẩm phán TANDTC",
    "Phan Thị Bình Thuận – Thẩm phán TANDTC", "Dương Tấn Thanh – Thẩm phán TANDTC",
  ];
  const DU_THAO_LIST = [
    "Nguyễn Tiến Hiệp – Thẩm phán phân công",
    "Trần Thị Hoa – Phó Vụ trưởng",
    "Lê Quang Minh – Vụ trưởng",
    "Nguyễn Thị Mai – Phó Chánh án",
    "Nguyễn Hòa Bình – Chánh án",
  ];

  const isCheckboxType = ["Báo cáo tổ Thẩm phán", "Báo cáo Hội đồng thẩm phán", "Trình dự thảo trả lời đơn", "Trình dự thảo kháng nghị"].includes(capTrinh);
  const checkboxList = capTrinh === "Báo cáo tổ Thẩm phán" ? TO_TP_LIST : capTrinh === "Báo cáo Hội đồng thẩm phán" ? HDTP_LIST : DU_THAO_LIST;

  const getSingleOptions = () => {
    if (capTrinh === "Trình Phó vụ trưởng") return ["Trần Thị Hoa – Phó Vụ trưởng", "Nguyễn Thị Lan – Phó Vụ trưởng"];
    if (capTrinh === "Trình Vụ trưởng") return ["Lê Quang Minh – Vụ trưởng"];
    if (capTrinh === "Trình thẩm phán") return ["Nguyễn Tiến Hiệp – Thẩm phán phân công", "Lê Văn Tùng – Thẩm phán tái phân công"];
    if (capTrinh === "Trình phó chánh án") return ["Nguyễn Thị Mai – Phó Chánh án", "Lê Minh Trí – Phó Chánh án", "Nguyễn Văn Du – Phó Chánh án"];
    if (capTrinh === "Trình chánh án") return ["Nguyễn Hòa Bình – Chánh án TANDTC"];
    if (capTrinh === "Nghiên cứu lại, xác minh, bổ sung") return ["Lý Thái Phúc – Thẩm tra viên", "Nguyễn Minh Tú – Thẩm tra viên"];
    return [];
  };

  const getDefaultNguoiDon = (cap: string) => getSingleOptions()[0] ?? "";

  const handleCapTrinhChange = (val: string) => {
    setCapTrinh(val);
    setNguoiDon("");
    if (val === "Báo cáo Hội đồng thẩm phán") {
      const init: Record<string, boolean> = {};
      HDTP_LIST.forEach(p => { init[p] = true; });
      setCheckedPeople(init);
    } else {
      setCheckedPeople({});
    }
  };

  const togglePerson = (name: string) => {
    setCheckedPeople(p => ({ ...p, [name]: !p[name] }));
  };

  const handleAddDanhSach = () => {
    const uu = UU_TIEN_CONFIG[uuTien] || UU_TIEN_CONFIG["Binh-thuong"];
    const base = Date.now();
    if (isCheckboxType) {
      const selected = checkboxList.filter(p => checkedPeople[p]);
      if (selected.length === 0) return;
      setDanhSach(prev => [
        ...prev,
        ...selected.map((name, i) => ({ id: base + i, cap: capTrinh, lanh: name, uu: uu.label, uuKey: uuTien })),
      ]);
    } else {
      const name = nguoiDon || getDefaultNguoiDon(capTrinh);
      if (!name) return;
      setDanhSach(prev => [...prev, { id: base, cap: capTrinh, lanh: name, uu: uu.label, uuKey: uuTien }]);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1600, display: "flex", flexDirection: "column" }}>
      {/* Dark red header */}
      <div style={{ background: "#7f1d1d", padding: "12px 20px", flexShrink: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: F }}>Trình ký</span>
      </div>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left panel */}
        <div style={{ width: 360, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0, background: "#fff" }}>
          {/* Sub-tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            {([["noi-dung", "Nội dung xin ý kiến"], ["thong-tin", "Thông tin tờ trình"], ["ho-so", "Hồ sơ tờ trình"]] as const).map(([k, lbl]) => (
              <button key={k} onClick={() => setLeftTab(k)}
                style={{ flex: 1, padding: "9px 4px", fontSize: 11, fontFamily: F, fontWeight: leftTab === k ? 700 : 400, background: "none", border: "none", cursor: "pointer", color: leftTab === k ? RED : MUTED, borderBottom: leftTab === k ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1 }}>
                {lbl}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>
            {leftTab === "noi-dung" && (
              <>
                {/* Cấp trình + Ưu tiên */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 }}><span style={{ color: RED }}>*</span> Cấp trình</span>
                    <select value={capTrinh} onChange={e => handleCapTrinhChange(e.target.value)} style={selSt}>
                      {CAP_TRINH_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 3 }}>Mức độ ưu tiên</span>
                    <select value={uuTien} onChange={e => setUuTien(e.target.value)} style={selSt}>
                      <option value="Cao">Cao</option>
                      <option value="Binh-thuong">Bình thường</option>
                      <option value="Thap">Thấp</option>
                    </select>
                  </div>
                </div>
                {/* Người được trình – dynamic UI */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 6 }}><span style={{ color: RED }}>*</span> Người được trình</span>
                  {!isCheckboxType ? (
                    <select value={nguoiDon || getDefaultNguoiDon(capTrinh)} onChange={e => setNguoiDon(e.target.value)} style={selSt}>
                      {getSingleOptions().map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 4, maxHeight: 180, overflowY: "auto", background: "#fafafa" }}>
                      {checkboxList.map(person => (
                        <label key={person} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", fontSize: 11, fontFamily: F, cursor: "pointer", borderBottom: `1px solid ${BORDER}` }}>
                          <input
                            type="checkbox"
                            checked={!!checkedPeople[person]}
                            onChange={() => togglePerson(person)}
                            style={{ accentColor: RED, cursor: "pointer", flexShrink: 0 }}
                          />
                          <span style={{ wordBreak: "break-word" }}>{person}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAddDanhSach}
                  style={{ width: "100%", padding: "7px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 600, marginBottom: 14 }}>
                  Thêm người được trình
                </button>
                {/* Danh sách đã thêm */}
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: 11 }}>
                  <colgroup><col style={{ width: "32%" }} /><col style={{ width: "33%" }} /><col style={{ width: "22%" }} /><col style={{ width: 36 }} /></colgroup>
                  <thead>
                    <tr>
                      {["Cấp trình", "Người được trình", "Ưu tiên", ""].map((h, i) => (
                        <th key={i} style={{ ...TH_STYLE, fontSize: 10 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {danhSach.map((r, idx) => {
                      const uuCfg = UU_TIEN_CONFIG[r.uuKey] || UU_TIEN_CONFIG["Binh-thuong"];
                      return (
                        <tr key={`ds-${r.id}`} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                          <td style={{ ...TD_STYLE, fontSize: 10 }}>{r.cap}</td>
                          <td style={{ ...TD_STYLE, fontSize: 10, fontWeight: 600 }}>{r.lanh}</td>
                          <td style={{ ...TD_STYLE }}>
                            <Badge color={uuCfg.color} bg={uuCfg.bg}>{uuCfg.label}</Badge>
                          </td>
                          <td style={{ ...TD_STYLE, textAlign: "center" }}>
                            <button onClick={() => setDanhSach(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", padding: 1, color: "#ef4444" }}>🗑</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
            {leftTab === "thong-tin" && (
              <TrinhKyThongTinTab />
            )}
            {leftTab === "ho-so" && (
              <TrinhKyHoSoTab />
            )}
          </div>
          <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <button onClick={onClose} style={{ padding: "7px 20px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
            <button style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Trình ký</button>
          </div>
        </div>

        {/* Right – PDF preview */}
        <div style={{ flex: 1, background: "#6b7280", overflow: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", background: "#4b5563", flexShrink: 0 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: 13 }}>🔄</button>
            <span style={{ fontSize: 12, color: "#d1d5db", fontFamily: F }}>100%</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: 13 }}>⛶</button>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: "#d1d5db", fontFamily: F }}>‹ 1 / 2 ›</span>
            <div style={{ flex: 1 }} />
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: 13 }}>⬇</button>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: 13 }}>🖨</button>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: 32, overflowY: "auto" }}>
            <div style={{ background: "#fff", width: "100%", maxWidth: 640, padding: "48px 64px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)", fontFamily: "serif", lineHeight: 1.9, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, fontSize: 12 }}>
                <div style={{ fontWeight: 700 }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: 700 }}>Độc lập - Tự do - Hạnh phúc</div>
                  <hr style={{ border: "none", borderTop: "1px solid #000", margin: "4px 0" }} />
                </div>
              </div>
              <div style={{ fontSize: 11, marginBottom: 4 }}>Số: 12/TTr-TTV</div>
              <div style={{ textAlign: "right", fontStyle: "italic", fontSize: 12, marginBottom: 20 }}>Hà Nội, ngày 08 tháng 04 năm 2026</div>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>TỜ TRÌNH</div>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>THẨM TRA VỤ VIỆC</div>
              <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 12, marginBottom: 20 }}>Kính trình: Lãnh đ o Tòa án nhân dân t i cao</div>
              <p style={{ textAlign: "justify", marginBottom: 16, fontSize: 12 }}>Căn cứ đơn đề nghị xem xét theo thủ tục giám đốc thẩm, tái thẩm và các tài liệu có trong hồ sơ vụ việc; Thẩm tra viên báo cáo kết quả nghiên cứu hồ sơ như sau:</p>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>I. THÔNG TIN CHUNG</div>
              <div style={{ fontSize: 12, marginBottom: 4, paddingLeft: 16 }}>Số bản án: 137120/2026/HSST-QĐ</div>
              <div style={{ fontSize: 12, marginBottom: 4, paddingLeft: 16 }}>Tòa án xét xử: Tòa án nhân dân tối cao</div>
              <div style={{ fontSize: 12, marginBottom: 4, paddingLeft: 16 }}>Người đề nghị: Nguyễn Văn A</div>
              <div style={{ fontSize: 12, marginBottom: 16, paddingLeft: 16 }}>Nội dung đề nghị: Xem xét lại bản án theo thủ tục giám đốc thẩm, tái thẩm.</div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>II. NHẬN XÉT, ĐỀ XUẤT</div>
              <p style={{ textAlign: "justify", fontSize: 12, marginBottom: 40 }}>Qua kiểm tra, hồ sơ có nội dung cần xin ý kiến lãnh đạo để thống nhất hướng xử lý. Thẩm tra viên kính đề nghị lãnh đạo xem xét, cho ý kiến chỉ đạo làm căn cứ thực hiện các bước tiếp theo theo đúng quy định.</p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <div>
                  <div style={{ fontStyle: "italic" }}>N i nh n:</div>
                  <div>- Như trên;</div>
                  <div>- Lưu hồ sơ.</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, marginBottom: 40 }}>THẨM TRA VIÊN</div>
                  <div style={{ fontWeight: 700 }}>Nguyễn Tiến Hiệp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HoSoKetQuaModal({
  row,
  type,
  numberStr,
  onClose,
}: {
  row: any;
  type: string;
  numberStr: string;
  onClose: () => void;
}) {
  const isHinhSu = !row || (row.loaiAn || "").includes("Hình sự");
  const partyName = row?.biCao || row?.nkn || "Nguyễn Văn A";
  const address = row?.dcd || "Số 12, phố Phan Đình Phùng, phường Quán Thánh, quận Ba Đình, TP. Hà Nội";
  const soBA = row?.soBA || "12/2023/HS-ST";
  const ngayBA = row?.ngayBA || "25/06/2023";
  const toa = row?.toa || "TAND quận Thanh Xuân";
  const ttv = row?.ttv || "Lý Thái Phúc";

  const [zoomLevel, setZoomLevel] = useState(190);

  const renderPaperContent = () => {
    if (type === "khang-nghi") {
      return (
        <>
          {/* Header Quốc hiệu */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div style={{ textAlign: "center", width: "45%" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
              <div style={{ width: 80, borderBottom: "1px solid #000", margin: "4px auto" }} />
              <div style={{ fontSize: 11 }}>Số: {numberStr}</div>
            </div>
            <div style={{ textAlign: "center", width: "50%" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div style={{ fontSize: 11, fontWeight: 700 }}>Độc lập - Tự do - Hạnh phúc</div>
              <div style={{ width: 120, borderBottom: "1px solid #000", margin: "4px auto 8px" }} />
              <div style={{ fontStyle: "italic", fontSize: 11 }}>Hà Nội, ngày &nbsp;&nbsp; tháng &nbsp;&nbsp; năm 202..</div>
            </div>
          </div>

          {/* Tiêu đề */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", marginBottom: 4 }}>QUYẾT ĐỊNH KHÁNG NGHỊ GIÁM ĐỐC THẨM</div>
            <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", marginBottom: 6 }}>CHÁNH ÁN TÒA ÁN NHÂN DÂN TỐI CAO</div>
          </div>

          <div style={{ fontSize: 12, textAlign: "justify" }}>
            <p style={{ margin: "0 0 10px", textIndent: 24 }}>
              Căn cứ Bộ luật Tố tụng {isHinhSu ? "hình sự" : "dân sự"};
            </p>
            <p style={{ margin: "0 0 10px", textIndent: 24 }}>
              Sau khi nghiên cứu hồ sơ vụ án {isHinhSu ? `đối với bị cáo ${partyName}` : `tranh chấp hợp đồng liên quan đến ${partyName}`} đối với Bản án sơ thẩm số {soBA} ngày {ngayBA} của Tòa án nhân dân {toa};
            </p>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>NHẬN THẤY:</div>
            <p style={{ margin: "0 0 10px", textIndent: 24 }}>
              Có vi phạm nghiêm trọng trong việc đánh giá chứng cứ và áp dụng pháp luật tại bản án sơ thẩm/phúc thẩm. Các tài liệu chưa làm rõ đầy đủ động cơ, mục đích hoặc nghĩa vụ hợp đồng liên quan trực tiếp đến đương sự.
            </p>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>QUYẾT ĐỊNH:</div>
            <p style={{ margin: "0 0 10px", textIndent: 24 }}>
              1. Kháng nghị đối với Bản án sơ thẩm/phúc thẩm nêu trên của Tòa án nhân dân {toa} theo thủ tục Giám đốc thẩm.
            </p>
            <p style={{ margin: "0 0 10px", textIndent: 24 }}>
              2. Tạm đình chỉ thi hành bản án cho đến khi có quyết định Giám đốc thẩm.
            </p>
          </div>
        </>
      );
    }

    if (type === "tra-loi-don") {
      return (
        <>
          {/* Header Quốc hiệu */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div style={{ textAlign: "center", width: "45%" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
              <div style={{ width: 80, borderBottom: "1px solid #000", margin: "4px auto" }} />
              <div style={{ fontSize: 11 }}>Số: {numberStr}</div>
            </div>
            <div style={{ textAlign: "center", width: "50%" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div style={{ fontSize: 11, fontWeight: 700 }}>Độc lập - Tự do - Hạnh phúc</div>
              <div style={{ width: 120, borderBottom: "1px solid #000", margin: "4px auto 8px" }} />
              <div style={{ fontStyle: "italic", fontSize: 11 }}>Hà Nội, ngày &nbsp;&nbsp; tháng &nbsp;&nbsp; năm 202..</div>
            </div>
          </div>

          {/* Tiêu đề */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", marginBottom: 4 }}>THÔNG BÁO GIẢI QUYẾT ĐƠN ĐỀ NGHỊ</div>
            <div style={{ fontStyle: "italic", fontSize: 11.5 }}>
              (V/v: Trả lời đơn đề nghị kháng nghị giám đốc thẩm của đương sự)
            </div>
          </div>

          <div style={{ fontSize: 12, textAlign: "justify" }}>
            <p style={{ margin: "0 0 10px", textIndent: 24 }}>
              Kính gửi: <b>{row?.nkn || "Đương sự"}</b> (Địa chỉ: {address})
            </p>
            <p style={{ margin: "0 0 10px", textIndent: 24 }}>
              Tòa án nhân dân tối cao nhận được đơn đề nghị của ông/bà về việc kháng nghị giám đốc thẩm đối với Bản án sơ thẩm số {soBA} ngày {ngayBA} của Tòa án nhân dân {toa}.
            </p>
            <p style={{ margin: "0 0 10px", textIndent: 24 }}>
              Sau khi nghiên cứu tài liệu chứng cứ trong hồ sơ vụ án, Tòa án nhân dân tối cao nhận thấy các quyết định của bản án đã có hiệu lực pháp luật là hoàn toàn có căn cứ và đúng quy định pháp luật. Không có vi phạm nghiêm trọng nào làm thay đổi bản chất vụ việc.
            </p>
            <p style={{ margin: "0 0 10px", textIndent: 24 }}>
              Do đó, Tòa án nhân dân tối cao thông báo không có căn cứ kháng nghị giám đốc thẩm đối với bản án nêu trên.
            </p>
          </div>
        </>
      );
    }

    if (type === "vks") {
      return (
        <>
          {/* Header Quốc hiệu */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div style={{ textAlign: "center", width: "45%" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
              <div style={{ width: 80, borderBottom: "1px solid #000", margin: "4px auto" }} />
              <div style={{ fontSize: 11 }}>Số: {numberStr}</div>
            </div>
            <div style={{ textAlign: "center", width: "50%" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div style={{ fontSize: 11, fontWeight: 700 }}>Độc lập - Tự do - Hạnh phúc</div>
              <div style={{ width: 120, borderBottom: "1px solid #000", margin: "4px auto 8px" }} />
              <div style={{ fontStyle: "italic", fontSize: 11 }}>Hà Nội, ngày &nbsp;&nbsp; tháng &nbsp;&nbsp; năm 202..</div>
            </div>
          </div>

          {/* Tiêu đề */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", marginBottom: 4 }}>CÔNG VĂN TRAO ĐỔI NGHIÊN CỨU</div>
            <div style={{ fontStyle: "italic", fontSize: 11.5 }}>
              (V/v: Chuyển hồ sơ nghiên cứu, trao đổi ý kiến nghiệp vụ với VKSNDTC)
            </div>
          </div>

          <div style={{ fontSize: 12, textAlign: "justify" }}>
            <p style={{ margin: "0 0 10px", textIndent: 24 }}>
              Kính gửi: <b>Viện kiểm sát nhân dân tối cao (Vụ 1/2/9/10)</b>
            </p>
            <p style={{ margin: "0 0 10px", textIndent: 24 }}>
              Liên quan đến vụ án {isHinhSu ? `bị cáo ${partyName}` : `tranh chấp hợp đồng liên quan đến ${partyName}`} theo Bản án sơ thẩm số {soBA} ngày {ngayBA} của Tòa án nhân dân {toa};
            </p>
            <p style={{ margin: "0 0 10px", textIndent: 24 }}>
              Tòa án nhân dân tối cao trân trọng chuyển kèm hồ sơ vụ án để quý Viện cùng nghiên cứu, trao đổi ý kiến thống nhất về hướng xử lý đối với đơn đề nghị kháng nghị giám đốc thẩm của đương sự.
            </p>
            <p style={{ margin: "0 0 10px", textIndent: 24 }}>
              Đề nghị quý Viện phản hồi ý kiến bằng văn bản trong thời hạn quy định.
            </p>
          </div>
        </>
      );
    }

    // Default: Xếp đơn
    return (
      <>
        {/* Header Quốc hiệu */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div style={{ textAlign: "center", width: "45%" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
            <div style={{ width: 80, borderBottom: "1px solid #000", margin: "4px auto" }} />
            <div style={{ fontSize: 11 }}>Số: {numberStr}</div>
          </div>
          <div style={{ textAlign: "center", width: "50%" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div style={{ fontSize: 11, fontWeight: 700 }}>Độc lập - Tự do - Hạnh phúc</div>
            <div style={{ width: 120, borderBottom: "1px solid #000", margin: "4px auto 8px" }} />
            <div style={{ fontStyle: "italic", fontSize: 11 }}>Hà Nội, ngày &nbsp;&nbsp; tháng &nbsp;&nbsp; năm 202..</div>
          </div>
        </div>

        {/* Tiêu đề */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", marginBottom: 4 }}>QUYẾT ĐỊNH XẾP LƯU ĐƠN</div>
          <div style={{ fontStyle: "italic", fontSize: 11.5 }}>
            (V/v: Xếp lưu đơn đề nghị kháng nghị giám đốc thẩm do hết thời hạn / không bổ sung chứng cứ)
          </div>
        </div>

        <div style={{ fontSize: 12, textAlign: "justify" }}>
          <p style={{ margin: "0 0 10px", textIndent: 24 }}>
            Căn cứ Quy chế giải quyết đơn đề nghị giám đốc thẩm, tái thẩm của Tòa án nhân dân tối cao;
          </p>
          <p style={{ margin: "0 0 10px", textIndent: 24 }}>
            Xét đơn đề nghị của ông/bà: <b>{row?.nkn || "Đương sự"}</b> liên quan đến vụ án {partyName} theo Bản án số {soBA} của Tòa án nhân dân {toa}.
          </p>
          <p style={{ margin: "0 0 10px", textIndent: 24 }}>
            Lý do xếp lưu đơn: Đơn đề nghị trùng lặp đã được giải quyết hoặc đương sự không bổ sung tài liệu chứng cứ hợp lệ sau khi đã nhận được thông báo yêu cầu bổ sung trong thời hạn luật định.
          </p>
          <p style={{ margin: "0 0 10px", textIndent: 24 }}>
            Tòa án nhân dân tối cao quyết định xếp lưu hồ sơ đơn đề nghị nêu trên.
          </p>
        </div>
      </>
    );
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1600, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 8, width: "95%", maxWidth: 840, height: "90%", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", fontFamily: F }}>
            Xem trước bản in kết quả giải quyết
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 22,
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Action Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 20px",
            background: "#f9fafb",
            borderBottom: `1px solid ${BORDER}`,
            flexShrink: 0,
            fontFamily: F,
          }}
        >
          {/* Zoom controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
              title="Thu nhỏ"
            >
              <ZoomOut size={16} />
            </button>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", minWidth: 45, textAlign: "center" }}>
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(300, prev + 10))}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
              title="Phóng to"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Print and Download buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => alert(`Đang tải xuống tài liệu: ${numberStr}`)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
              title="Tải xuống PDF"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => window.print()}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}
              title="In kết quả"
            >
              <Printer size={16} />
            </button>
          </div>
        </div>

        {/* Paper Viewport */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", padding: "24px 16px", background: "#6b7280" }}>
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: 680,
              minHeight: 960,
              padding: "44px 56px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              fontFamily: "'Times New Roman', Times, serif",
              color: "#000",
              lineHeight: 1.7,
              boxSizing: "border-box",
              transform: `scale(${zoomLevel / 190})`,
              transformOrigin: "top center",
              marginBottom: 40,
            }}
          >
            {renderPaperContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
