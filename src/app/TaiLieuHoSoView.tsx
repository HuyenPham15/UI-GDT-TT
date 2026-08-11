import React, { useState } from "react";
import {
  FileText, Folder, FolderOpen, Star, MoreVertical, Plus, Upload,
  RefreshCw, Archive, Download, Printer, Maximize2, ZoomIn, ZoomOut,
  ChevronDown, ChevronRight, X, MessageSquare, ListFilter, Check,
  ExternalLink, Layers, Search, Sparkles
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, Badge } from "./shared";

export type TaiLieuItem = {
  id: string;
  soButLuc: string;
  name: string;
  type: "pdf" | "docx" | "zip" | "image";
  size: string;
  date: string;
  giaiDoanId: "hien-tai" | "so-tham" | "phuc-tham";
  pageCount?: number;
  contentTitle?: string;
  contentSub?: string;
  paragraphs?: string[];
};

const FOLDERS = [
  { id: "hien-tai", name: "Giai đoạn hiện tại" },
  { id: "so-tham", name: "Sơ thẩm" },
  { id: "phuc-tham", name: "Phúc thẩm" },
] as const;

const SAMPLE_DOCS: TaiLieuItem[] = [
  // Giai đoạn hiện tại
  {
    id: "sample",
    soButLuc: "01 - 15",
    name: "Don_de_nghi_giam_doc_tham_nguyen_don",
    type: "pdf",
    size: "1.8 MB",
    date: "28/07/2026",
    giaiDoanId: "hien-tai",
    pageCount: 15,
    contentTitle: "ĐƠN ĐỀ NGHỊ XEM XẾT THEO THỦ TỤC GIÁM ĐỐC THẨM",
    contentSub: "Kính gửi: Chánh án TAND Tối cao - Viện trưởng VKSND Tối cao",
    paragraphs: [
      "Tôi là người đại diện hợp pháp của người bị hại làm đơn này đề nghị xem xét lại toàn bộ bản án phúc thẩm đã có hiệu lực pháp luật do có tình tiết mới làm thay đổi bản chất vụ án.",
      "Kính đề nghị Quý cấp xem xét kháng nghị theo thẩm quyền đúng quy định pháp luật."
    ]
  },
  {
    id: "to-trinh-gdt",
    soButLuc: "81 - 150",
    name: "To_trinh_de_xuat_khang_nghi_giam_doc_tham",
    type: "pdf",
    size: "3.5 MB",
    date: "22/07/2026",
    giaiDoanId: "hien-tai",
    pageCount: 70,
    contentTitle: "TỜ TRÌNH ĐỀ XUẤT KHÁNG NGHỊ GIÁM ĐỐC THẨM",
    contentSub: "Thẩm tra viên thụ lý báo cáo Lãnh đạo Vụ Giám đốc kiểm tra",
    paragraphs: [
      "Kính trình Lãnh đạo Vụ xem xét phê duyệt Quyết định Kháng nghị Giám đốc thẩm đối với Bản án phúc thẩm số 89/2026/HS-PT.",
      "Hồ sơ vụ án đủ căn cứ kháng nghị theo quy định tại Điều 373 Bộ luật Tố tụng hình sự."
    ]
  },

  // Sơ thẩm
  {
    id: "ban-an-st",
    soButLuc: "16 - 45",
    name: "Ban_an_hinh_su_so_tham_124_HSST",
    type: "pdf",
    size: "4.2 MB",
    date: "20/07/2026",
    giaiDoanId: "so-tham",
    pageCount: 30,
    contentTitle: "BẢN ÁN HÌNH SỰ SƠ THẨM",
    contentSub: "Số: 124/2026/HS-ST - Ngày 20/07/2026 - TAND Tỉnh",
    paragraphs: [
      "TÒA ÁN NHÂN DÂN TỈNH ĐỒNG NAI\nNHÂN DANH NƯỚC CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n\nHội đồng xét xử sơ thẩm gồm có: Thẩm phán - Chủ tọa phiên tòa cùng các Hội thẩm nhân dân.",
      "Căn cứ điểm a khoản 1 Điều 353, Điều 357 Bộ luật Tố tụng hình sự; tuyên phạt bị cáo mức án theo đúng tội danh và khung hình phạt quy định tại Bộ luật Hình sự."
    ]
  },
  {
    id: "kham-nghiem",
    soButLuc: "151 - 220",
    name: "Bien_ban_kham_nghiem_hien_truong_bo_sung",
    type: "pdf",
    size: "3.1 MB",
    date: "15/07/2026",
    giaiDoanId: "so-tham",
    pageCount: 70,
    contentTitle: "BIÊN BẢN KHÁM NGHIỆM HIỆN TRƯỜNG SƠ THẨM",
    contentSub: "Cơ quan CSĐT Công an Tỉnh phối hợp Viện kiểm sát nhân dân",
    paragraphs: [
      "Hồi 08 giờ 30 phút ngày 15/07/2026 tiến hành khám nghiệm hiện trường tại khu vực xảy ra vụ việc.",
      "Có sự chứng kiến của người làm chứng và các bên liên quan, sơ đồ hiện trường và các dấu vết vật chứng được ghi nhận đầy đủ theo phụ lục đính kèm."
    ]
  },

  // Phúc thẩm
  {
    id: "ban-an-pt",
    soButLuc: "46 - 80",
    name: "Ban_an_hinh_su_phuc_tham_89_HSPT",
    type: "pdf",
    size: "2.8 MB",
    date: "20/07/2026",
    giaiDoanId: "phuc-tham",
    pageCount: 35,
    contentTitle: "BẢN ÁN HÌNH SỰ PHÚC THẨM",
    contentSub: "Số: 89/2026/HS-PT - Ngày 20/07/2026 - TAND Cấp cao",
    paragraphs: [
      "TÒA ÁN NHÂN DÂN CẤP CAO TẠI HÀ NỘI\nNHÂN DANH NƯỚC CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n\nHội đồng xét xử phúc thẩm quyết định giữ nguyên bản án sơ thẩm."
    ]
  },
  {
    id: "khang-cao",
    soButLuc: "221 - 280",
    name: "Don_khang_cao_phien_toa_phuc_tham",
    type: "pdf",
    size: "3.2 MB",
    date: "25/07/2026",
    giaiDoanId: "phuc-tham",
    pageCount: 60,
    contentTitle: "ĐƠN KHÁNG CÁO CỦA BỊ CÁO",
    contentSub: "Nộp tại Tòa án nhân dân Cấp cao",
    paragraphs: [
      "Tôi xin kháng cáo toàn bộ bản án phúc thẩm và đề nghị xét xử lại theo trình tự Giám đốc thẩm."
    ]
  }
];

export function TaiLieuHoSoView({
  vuAnId = "VA26-002621",
  tenVuAn = "Vụ giải quyết đơn 7135",
  onBack,
}: {
  vuAnId?: string;
  tenVuAn?: string;
  onBack?: () => void;
}) {
  const [selectedDocId, setSelectedDocId] = useState<string>("sample");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    "hien-tai": true,
    "so-tham": true,
    "phuc-tham": true,
  });

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  // Viewer Controls
  const [zoom, setZoom] = useState<number>(210);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [notes, setNotes] = useState<Array<{ id: number; page: number; text: string; time: string; author: string }>>([
    { id: 1, page: 1, text: "Kiểm tra lại đối chiếu bút lục số 14 và lời khai nhân chứng", time: "28/07/2026 14:20", author: "Lý Thái Phúc (TTV)" }
  ]);
  const [newNoteText, setNewNoteText] = useState("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ "ban-an-st": true });

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFavorite = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const selectedDoc = SAMPLE_DOCS.find(d => d.id === selectedDocId) || SAMPLE_DOCS[0];

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    setNotes(prev => [
      ...prev,
      {
        id: Date.now(),
        page: currentPage,
        text: newNoteText.trim(),
        time: "Hôm nay 15:10",
        author: "Thẩm tra viên"
      }
    ]);
    setNewNoteText("");
    showToast("Đã thêm ghi chú mới vào tài liệu!");
  };

  return (
    <div style={{ display: "flex", height: "100%", width: "100%", background: "#f8fafc", overflow: "hidden", fontFamily: F, position: "relative" }}>
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#065f46",
            color: "#fff",
            padding: "8px 20px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 4000,
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── LEFT PANEL (Tài liệu hồ sơ sidebar) ─────────────────────────── */}
      <div
        style={{
          width: 320,
          minWidth: 300,
          maxWidth: 360,
          background: "#fff",
          borderRight: `1px solid ${BORDER}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Panel Header */}
        <div
          style={{
            padding: "12px 14px",
            borderBottom: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={16} color={RED} />
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>
              Tài liệu hồ sơ
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: MUTED }}>
            <button
              title="Đổi bố cục hiển thị"
              style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
            >
              <Maximize2 size={13} />
            </button>
            <button
              title="Bộ lọc nâng cao"
              style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
            >
              <ListFilter size={14} />
            </button>
          </div>
        </div>

        {/* Label Header for Documents */}
        <div style={{ padding: "10px 14px 6px", borderBottom: `1px solid ${BORDER}`, background: "#fafafa" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.5 }}>
            DANH SÁCH TÀI LIỆU ({SAMPLE_DOCS.length})
          </span>
        </div>

        {/* Folder Accordion Tree */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
          {FOLDERS.map(folder => {
            const folderDocs = SAMPLE_DOCS.filter(d => d.giaiDoanId === folder.id);
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
                    {folderDocs.length}
                  </span>
                </div>

                {/* Docs inside folder */}
                {isOpen && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 8, marginTop: 2 }}>
                    {folderDocs.map(doc => {
                      const isSelected = selectedDocId === doc.id;
                      const isFav = favorites[doc.id];
                      return (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDocId(doc.id)}
                          style={{
                            padding: "9px 11px",
                            borderRadius: 6,
                            border: `1px solid ${isSelected ? "#fecaca" : BORDER}`,
                            background: isSelected ? "#fef2f2" : "#fff",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            transition: "all 0.15s",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                            <FileText size={15} color={isSelected ? RED : "#dc2626"} style={{ marginTop: 2, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: RED, marginBottom: 2 }}>
                                  [BL {doc.soButLuc}]
                                </span>
                                <button
                                  onClick={e => toggleFavorite(doc.id, e)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 1,
                                    color: isFav ? "#eab308" : "#94a3b8",
                                  }}
                                >
                                  <Star size={13} fill={isFav ? "#eab308" : "none"} />
                                </button>
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  fontWeight: isSelected ? 700 : 500,
                                  color: isSelected ? RED : TEXT,
                                  lineHeight: 1.35,
                                  wordBreak: "break-word",
                                }}
                              >
                                {doc.name}
                              </div>
                              <div style={{ fontSize: 10.5, color: MUTED, marginTop: 4 }}>
                                PDF · {doc.pageCount || 1} trang · {doc.size}
                              </div>
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

        {/* Bottom Actions Fixed Footer */}
        <div
          style={{
            padding: "10px 12px",
            borderTop: `1px solid ${BORDER}`,
            display: "flex",
            flexDirection: "column",
            gap: 7,
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                flex: 1,
                padding: "7px 10px",
                background: RED,
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: F,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <Upload size={12} /> Tải lên tài liệu
            </button>
            <button
              onClick={() => {
                showToast("Đang đồng bộ hồ sơ số hóa từ hệ thống quản lý...");
                setTimeout(() => showToast("Đã đồng bộ hồ sơ số hóa thành công!"), 1500);
              }}
              style={{
                flex: 1,
                padding: "7px 10px",
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: F,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                whiteSpace: "nowrap",
              }}
            >
              <RefreshCw size={12} /> Đồng bộ hồ sơ số hóa
            </button>
          </div>

          <button
            onClick={() => {
              showToast("Đã lưu trữ tài liệu vào kho hồ sơ số hóa.");
            }}
            style={{
              width: "100%",
              padding: "7px 10px",
              background: "#fff",
              color: TEXT,
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: F,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Archive size={12} /> Lưu trữ
          </button>
        </div>
      </div>

      {/* ── RIGHT MAIN PANEL (PDF Viewer Canvas) ─────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", position: "relative" }}>
        {/* PDF Top Toolbar */}
        <div
          style={{
            height: 44,
            background: "#fff",
            borderBottom: `1px solid ${BORDER}`,
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          {/* File Name */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={15} color={RED} />
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>
              [BL {selectedDoc.soButLuc}] {selectedDoc.name}
            </span>
          </div>

          {/* Viewer Controls: Zoom + Page nav + Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Zoom selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => setZoom(z => Math.max(50, z - 10))}
                style={{
                  background: "none",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 3,
                  cursor: "pointer",
                  padding: "3px 6px",
                  fontSize: 12,
                  color: TEXT,
                }}
              >
                -
              </button>
              <select
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                style={{
                  padding: "3px 8px",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 3,
                  fontSize: 12,
                  fontFamily: F,
                  background: "#fff",
                  color: TEXT,
                  cursor: "pointer",
                }}
              >
                <option value={100}>100%</option>
                <option value={150}>150%</option>
                <option value={180}>180%</option>
                <option value={200}>200%</option>
                <option value={210}>210%</option>
                <option value={250}>250%</option>
              </select>
              <button
                onClick={() => setZoom(z => Math.min(300, z + 10))}
                style={{
                  background: "none",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 3,
                  cursor: "pointer",
                  padding: "3px 6px",
                  fontSize: 12,
                  color: TEXT,
                }}
              >
                +
              </button>
            </div>

            <div style={{ width: 1, height: 18, background: BORDER }} />

            {/* Page navigation */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: MUTED }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
              >
                ▲
              </button>
              <span style={{ fontWeight: 600, color: TEXT }}>{currentPage}</span>
              <span>/ {selectedDoc.pageCount || 1}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(selectedDoc.pageCount || 1, p + 1))}
                style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
              >
                ▼
              </button>
            </div>

            <div style={{ width: 1, height: 18, background: BORDER }} />

            {/* Print & Download */}
            <button
              onClick={() => showToast("Đang tải file PDF xuống máy...")}
              title="Tải xuống"
              style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}
            >
              <Download size={15} />
            </button>
            <button
              onClick={() => window.print()}
              title="In tài liệu"
              style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}
            >
              <Printer size={15} />
            </button>
            <button
              onClick={() => showToast("Đã mở rộng chế độ xem toàn màn hình")}
              title="Mở rộng"
              style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}
            >
              <ExternalLink size={15} />
            </button>
          </div>
        </div>

        {/* Main Document Body & Right Notes Collapsible */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
          {/* Scrollable PDF Canvas */}
          <div
            style={{
              flex: 1,
              overflow: "auto",
              background: "#cbd5e1",
              padding: "28px 20px 48px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* White A4 Page */}
            <div
              style={{
                width: 760,
                minHeight: 1040,
                background: "#fff",
                boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
                padding: "54px 64px",
                boxSizing: "border-box",
                transform: `scale(${zoom / 210})`,
                transformOrigin: "top center",
                fontFamily: "'Times New Roman', serif",
                color: "#111827",
                lineHeight: 1.6,
                fontSize: "13.5pt",
              }}
            >
              {/* Document Title Header */}
              <div style={{ fontSize: "24pt", fontWeight: "700", color: "#1f2937", marginBottom: 8, textAlign: "center" }}>
                {selectedDoc.contentTitle || selectedDoc.name}
              </div>
              <div style={{ fontSize: "14pt", fontStyle: "italic", color: "#4b5563", marginBottom: 32, textAlign: "center" }}>
                {selectedDoc.contentSub || "Tài liệu hồ sơ vụ án số hóa"}
              </div>

              {/* Document Paragraphs */}
              {selectedDoc.paragraphs?.map((p, pIdx) => (
                <p
                  key={pIdx}
                  style={{
                    textAlign: "justify",
                    marginBottom: 20,
                    lineHeight: 1.65,
                    color: "#374151",
                    fontSize: "12pt",
                    textIndent: 24,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Far Right Vertical Tab for Ghi chú */}
          <div
            onClick={() => setShowNotes(!showNotes)}
            style={{
              width: 28,
              background: "#fff",
              borderLeft: `1px solid ${BORDER}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: "16px 0",
              color: showNotes ? RED : MUTED,
              gap: 8,
              userSelect: "none",
              boxShadow: "-1px 0 3px rgba(0,0,0,0.03)",
            }}
          >
            <MessageSquare size={13} />
            <div
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: F,
                letterSpacing: 1,
              }}
            >
              Ghi chú
            </div>
          </div>

          {/* Collapsible Notes Drawer */}
          {showNotes && (
            <div
              style={{
                width: 280,
                background: "#fff",
                borderLeft: `1px solid ${BORDER}`,
                display: "flex",
                flexDirection: "column",
                boxShadow: "-4px 0 16px rgba(0,0,0,0.08)",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  padding: "12px 14px",
                  borderBottom: `1px solid ${BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>
                  Ghi chú tài liệu ({notes.length})
                </span>
                <button
                  onClick={() => setShowNotes(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Notes List */}
              <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                {notes.map(n => (
                  <div
                    key={n.id}
                    style={{
                      background: "#f8fafc",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 6,
                      padding: "8px 10px",
                      fontSize: 11,
                      fontFamily: F,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: MUTED, marginBottom: 4, fontSize: 10 }}>
                      <span style={{ fontWeight: 600, color: RED }}>Trang {n.page}</span>
                      <span>{n.time}</span>
                    </div>
                    <div style={{ color: TEXT, lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: 10, color: MUTED, marginTop: 4, fontStyle: "italic" }}>
                      Bởi: {n.author}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <div style={{ padding: "10px 12px", borderTop: `1px solid ${BORDER}`, background: "#fff" }}>
                <textarea
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  placeholder="Nhập ghi chú cho trang hiện tại..."
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    fontSize: 11,
                    fontFamily: F,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "none",
                  }}
                />
                <button
                  onClick={handleAddNote}
                  style={{
                    marginTop: 6,
                    width: "100%",
                    padding: "5px 0",
                    background: RED,
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: F,
                  }}
                >
                  + Thêm ghi chú
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Tải lên tài liệu mới ──────────────────────────────────── */}
      {showUploadModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 3500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowUploadModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 8,
              width: 520,
              padding: "20px 24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              fontFamily: F,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>Tải lên tài liệu hồ sơ mới</h3>
              <button onClick={() => setShowUploadModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>
                  Tên tài liệu / Văn bản <span style={{ color: RED }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bản án sơ thẩm, Đơn đề nghị, Biên bản..."
                  style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>
                    Loại tài liệu
                  </label>
                  <select style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, boxSizing: "border-box" }}>
                    <option>Tài liệu chứng cứ</option>
                    <option>Bản án / Quyết định</option>
                    <option>Đơn thư đề nghị</option>
                    <option>Tờ trình / Dự thảo</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>
                    Phân loại phạm vi
                  </label>
                  <select style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, boxSizing: "border-box" }}>
                    <option>Tất cả thành viên</option>
                    <option>Cá nhân TTV</option>
                    <option>Được chia sẻ</option>
                  </select>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                style={{
                  border: `2px dashed ${BORDER}`,
                  borderRadius: 8,
                  padding: "24px 16px",
                  textAlign: "center",
                  background: "#f8fafc",
                  cursor: "pointer",
                  marginTop: 4,
                }}
              >
                <Upload size={28} color={RED} style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Kéo thả file vào đây hoặc bấm để chọn tệp</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Hỗ trợ định dạng PDF, DOCX, PNG, JPG (Tối đa 50MB)</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                style={{ padding: "7px 18px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  showToast("Đã tải lên tài liệu mới thành công!");
                }}
                style={{ padding: "7px 22px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
              >
                Xác nhận tải lên
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
