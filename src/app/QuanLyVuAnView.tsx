import React, { useState } from "react";
import {
  Search, Eye, ChevronDown, ChevronUp, ChevronRight, RotateCcw, X, Save, Printer,
  FileText, Send, Archive, RefreshCw, Download, Trash2,
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, Tag, TaiKhoanPhanQuyenBar, type UserRoleType } from "./shared";
import { formatSoBA } from "./AppHelpers";
import { getPartyLabels, isVu234, getQuanHePhapLuat } from "./App";
import { VuAnSearchFilterPanel } from "./VuAnSearchFilterPanel";
import { TabThongTin } from "./TabThongTin";
import { TaiLieuHoSoView } from "./TaiLieuHoSoView";
import { HoSoLuuTruView } from "./HoSoLuuTruView";

import { ThemKetQuaModal, ThemQuyetDinhHoanModal } from "./ThemKetQuaModal";
import { TaoDuThaoModal } from "./TaoDuThaoModal";
import { HoSoToTrinhModal, TrinhKyModal, HoSoKetQuaModal } from "./TrinhKyModal";

import {
  type VuAnRow, type VuAnGroup, type VuAnDetailData,
  VU_AN_LIST, KHIEU_NAI_LIST, VU_AN_DETAILS,
  filterVuAnListByRole,
} from "./VuAnData";



// ── Popup Xem nhanh danh sách đơn kèm Thông tin trình (Trình đến ai) ───────────
export function QuickViewDanhSachDonModal({
  group,
  onClose,
  onSelectVuAn,
  userRole,
  isKhieuNai = false,
}: {
  group: VuAnGroup;
  onClose: () => void;
  onSelectVuAn: (id: string, tab?: ChiTietTab) => void;
  userRole?: UserRoleType;
  isKhieuNai?: boolean;
}) {
  const detail = VU_AN_DETAILS[group.id] || VU_AN_DETAILS["VA26-002621"];

  const donList = (detail?.danhSachDon && detail.danhSachDon.length > 0)
    ? detail.danhSachDon.map((d, i) => {
      const row = group.rows[i] || group.rows[0];
      const isTrinhPhoCA = row?.kqgq === "trinh-pho-chanh-an";
      const isTrinhTP = row?.kqgq === "trinh-tham-phan" || (!isTrinhPhoCA && row?.thamPhan);
      const trinhDenAi = isTrinhPhoCA
        ? "Phó Chánh án TANDTC (Nguyễn Văn Quảng)"
        : isTrinhTP
          ? `Thẩm phán TANDTC (${row?.thamPhan || "Nguyễn Biên Thuỳ"})`
          : `Lãnh đạo Vụ (${row?.lanhDao || "Nguyễn Thị Bình - Vụ trưởng"})`;

      const trangThaiTrinh = (d as any).trangThaiTrinh || (row?.trangThaiToTrinh === "da-duyet" ? "Đã duyệt" : row?.trangThaiToTrinh === "dang-trinh" ? "Đang trình" : row?.soToTrinh ? "Đã duyệt" : "Chưa trình");
      const ngayTrinh = (d as any).ngayTrinh || row?.ngayThuLy || "20/07/2026";

      return {
        ...d,
        trinhDenAi,
        trangThaiTrinh,
        ngayTrinh,
      };
    })
    : group.rows.map((row, idx) => {
      const isTrinhPhoCA = row.kqgq === "trinh-pho-chanh-an";
      const isTrinhTP = row.kqgq === "trinh-tham-phan" || (!isTrinhPhoCA && row.thamPhan);
      const trinhDenAi = isTrinhPhoCA
        ? "Phó Chánh án TANDTC (Nguyễn Văn Quảng)"
        : isTrinhTP
          ? `Thẩm phán TANDTC (${row.thamPhan || "Nguyễn Biên Thuỳ"})`
          : `Lãnh đạo Vụ (${row.lanhDao || "Nguyễn Thị Bình - Vụ trưởng"})`;

      return {
        stt: idx + 1,
        maDon: (6988 + idx) + "",
        thongTinGQ: idx === 0 ? "Thụ lý mới" : "Đã thụ lý",
        soThuLy: row.soThuLy,
        ngayThuLy: row.ngayThuLy,
        ngayNhan: row.ngayThuLy,
        nguoiDung: row.ndd || row.nkn,
        phanLoai: isKhieuNai ? "Đơn khiếu nại tố tụng" : "Đơn đề nghị GĐT, TT",
        loaiDon: idx === 0 ? "DON_CHINH" : "DON_TRUNG",
        trinhDenAi,
        trangThaiTrinh: row.trangThaiToTrinh === "da-duyet" ? "Đã duyệt" : row.trangThaiToTrinh === "dang-trinh" ? "Đang trình" : "Chưa trình",
        ngayTrinh: row.ngayThuLy,
        noiDung: `Đề nghị xem xét bản án số ${row.soBA} theo thủ tục Giám đốc thẩm do có vi phạm tố tụng và tình tiết mới.`,
      };
    });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: F,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          width: "100%",
          maxWidth: 1080,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: `1px solid ${BORDER}`,
            background: "#f8fafc",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileText size={18} color="#800000" />
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", fontFamily: F }}>
              Danh sách đơn – {group.tenVuAn || group.maSo}
            </span>
            <Badge color="#1e40af" bg="#dbeafe">{donList.length} đơn</Badge>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: MUTED,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Strip */}
        <div
          style={{
            background: "#f1f5f9",
            padding: "10px 20px",
            borderBottom: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            fontSize: 12,
            fontFamily: F,
          }}
        >
          <div>
            <span style={{ color: MUTED }}>Mã {isKhieuNai ? "khiếu nại" : "vụ án"}: </span>
            <b style={{ color: "#800000" }}>{group.maSo}</b>
          </div>
          <div>
            <span style={{ color: MUTED }}>Loại án: </span>
            <b style={{ color: TEXT }}>{group.loaiAn || "Hình sự"}</b>
          </div>
          <div>
            <span style={{ color: MUTED }}>Thẩm tra viên: </span>
            <b style={{ color: TEXT }}>{group.rows[0]?.ttv || "Lý Thái Phúc"}</b>
          </div>
          <div>
            <span style={{ color: MUTED }}>Thẩm phán: </span>
            <b style={{ color: TEXT }}>{group.rows[0]?.thamPhan || "Nguyễn Biên Thuỳ"}</b>
          </div>
          <div>
            <span style={{ color: MUTED }}>Số BA/QĐ: </span>
            <b style={{ color: "#2563eb" }}>{formatSoBA(group.rows[0]?.soBA, group.loaiAn) || "12/2026/HS-PT"}</b>
          </div>
        </div>

        {/* Table Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 35 }} />
              <col style={{ width: 85 }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "23%" }} />
              <col style={{ width: "25%" }} />
            </colgroup>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                <th style={TH_STYLE}>STT</th>
                <th style={TH_STYLE}>MÃ ĐƠN</th>
                <th style={TH_STYLE}>THÔNG TIN THỤ LÝ</th>
                <th style={TH_STYLE}>NGƯỜI ĐỨNG ĐƠN</th>
                <th style={{ ...TH_STYLE, textAlign: "center" }}>PHÂN LOẠI</th>
                <th style={TH_STYLE}>THÔNG TIN TRÌNH (TRÌNH ĐẾN AI)</th>
                <th style={{ ...TH_STYLE, textAlign: "center" }}>KẾT QUẢ GIẢI QUYẾT</th>
              </tr>
            </thead>
            <tbody>
              {donList.map((d, idx) => (
                <tr
                  key={idx}
                  style={{
                    background: idx % 2 === 0 ? "#fff" : "#fafafa",
                    borderBottom: `1px solid #f3f4f6`,
                  }}
                >
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                  <td style={{ ...TD_STYLE, color: "#2563eb", fontWeight: 700 }}>{d.maDon}</td>
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: d.thongTinGQ === "Thụ lý mới" ? "#065f46" : TEXT }}>
                        {d.thongTinGQ}
                      </span>
                      {d.soThuLy && <span style={{ fontSize: 11, color: TEXT }}>Số: {d.soThuLy}</span>}
                      {d.ngayThuLy && <span style={{ fontSize: 11, color: MUTED }}>Ngày TL: {d.ngayThuLy}</span>}
                    </div>
                  </td>
                  <td style={{ ...TD_STYLE, fontWeight: 600, color: "#111827" }}>{d.nguoiDung}</td>
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: TEXT }}>{d.phanLoai}</span>
                      <Badge color={d.loaiDon === "DON_CHINH" ? "#1e40af" : "#991b1b"} bg={d.loaiDon === "DON_CHINH" ? "#dbeafe" : "#fee2e2"}>
                        {d.loaiDon === "DON_CHINH" ? "ĐƠN CHÍNH" : "Đơn trùng"}
                      </Badge>
                    </div>
                  </td>
                  {/* Cột Thông tin trình (Trình đến ai) */}
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>
                          👤 {d.trinhDenAi}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <Badge
                          color={d.trangThaiTrinh === "Đã duyệt" ? "#065f46" : d.trangThaiTrinh === "Đang trình" ? "#92400e" : "#4b5563"}
                          bg={d.trangThaiTrinh === "Đã duyệt" ? "#d1fae5" : d.trangThaiTrinh === "Đang trình" ? "#fef3c7" : "#f3f4f6"}
                        >
                          {d.trangThaiTrinh}
                        </Badge>
                        {d.ngayTrinh && (
                          <span style={{ fontSize: 10, color: MUTED }}>
                            Ngày: {d.ngayTrinh}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Cột Kết quả giải quyết */}
                  <td style={TD_STYLE}>
                    {(() => {
                      const isVu234Group = isVu234(userRole, group.loaiAn);
                      const knSuffix = isVu234Group
                        ? (group.loaiAn === "Hành chính" ? "HC" : group.loaiAn === "Kinh doanh thương mại" ? "KDTM" : "DS")
                        : "HS";
                      const kqType = (d as any).ketQuaGiaiQuyetType || (idx % 4 === 0 ? "khang-nghi" : idx % 4 === 1 ? "tra-loi-don" : idx % 4 === 2 ? "vks-giai-quyet" : "xep-don");

                      if (kqType === "khang-nghi") {
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Badge color="#065f46" bg="#d1fae5">⚖ Kháng nghị</Badge>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>Số: {(d as any).khangNghiSo || `${102 + idx}/2026/QĐ-KN-${knSuffix}`}</span>
                            <span style={{ fontSize: 10, color: MUTED }}>Ngày QĐ: {(d as any).khangNghiNgay || "15/07/2026"}</span>
                          </div>
                        );
                      }
                      if (kqType === "tra-loi-don") {
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Badge color="#1e40af" bg="#dbeafe">📩 Trả lời đơn</Badge>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>Số: {(d as any).traLoiSo || `${45 + idx}/TB-TANDTC`}</span>
                            <span style={{ fontSize: 10, color: MUTED }}>Ngày BH: {(d as any).traLoiNgay || "20/06/2026"}</span>
                          </div>
                        );
                      }
                      if (kqType === "vks-giai-quyet") {
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Badge color="#92400e" bg="#fef3c7">🏛 VKS đang giải quyết</Badge>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>Số CV: {(d as any).vksSo || `${210 + idx}/CV-VKSTC`}</span>
                            <span style={{ fontSize: 10, color: MUTED }}>Ngày CV: {(d as any).vksNgay || "08/08/2026"}</span>
                          </div>
                        );
                      }
                      // xep-don
                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Badge color="#374151" bg="#f3f4f6">📁 Xếp đơn</Badge>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>QĐ số: {(d as any).xepDonSo || `${12 + idx}/QĐ-XD`}</span>
                          <span style={{ fontSize: 10, color: MUTED }}>Ngày xếp: {(d as any).xepDonNgay || "02/05/2026"}</span>
                        </div>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: `1px solid ${BORDER}`,
            background: "#f8fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: MUTED }}>
            Tổng cộng: <b style={{ color: TEXT }}>{donList.length} đơn</b> thuộc {isKhieuNai ? "vụ việc khiếu nại" : "vụ án"}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                onClose();
                onSelectVuAn(group.id, "danh-sach-don");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 18px",
                background: "#800000",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: F,
              }}
            >
              Xem toàn bộ chi tiết {isKhieuNai ? "khiếu nại" : "vụ án"} →
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "7px 16px",
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: F,
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSoBALabel(soBAStr: string, isST: boolean) {
  const isQuyetDinh = soBAStr.toUpperCase().includes("QĐ") || soBAStr.toUpperCase().includes("QD");
  if (isQuyetDinh) {
    return isST ? "Số QDST" : "Số QDPT";
  } else {
    return isST ? "Số BAST" : "Số BAPT";
  }
}

// ── Render Cell Thông Tin Bản Án Đề Nghị & Giai đoạn còn lại ─────────────────────
export function renderThongTinBanAnCell(
  row: VuAnRow,
  effectiveLoaiAn: string,
  showQHPL: boolean = false
) {
  const isDeNghiPT = row.soBA.includes("PT") || row.capXetXu?.includes("Phúc") || row.capXetXu?.includes("Tái");
  const { label1, label2 } = getPartyLabels(effectiveLoaiAn);

  const soBA_DeNghi = formatSoBA(row.soBA, effectiveLoaiAn);
  const ngayBA_DeNghi = row.ngayBA || "20/07/2026";
  const toa_DeNghi = row.toa || "Tòa án nhân dân cấp cao";
  const label_DeNghi = getSoBALabel(row.soBA, !isDeNghiPT);

  // Derive remaining stage info (giai đoạn còn lại)
  let rawConLai = isDeNghiPT
    ? row.soBA.replace("HS-PT", "HS-ST").replace("DS-PT", "DS-ST").replace("KDTM-PT", "KDTM-ST").replace("HC-PT", "HC-ST")
    : row.soBA.replace("HS-ST", "HS-PT").replace("DS-ST", "DS-PT").replace("KDTM-ST", "KDTM-PT").replace("HC-ST", "HC-PT");

  if (rawConLai === row.soBA) {
    rawConLai = isDeNghiPT ? "08/2026/HS-ST" : "18/2026/HS-PT";
  }
  const soBA_ConLai = formatSoBA(rawConLai, effectiveLoaiAn);
  const ngayBA_ConLai = isDeNghiPT ? "15/03/2026" : "20/08/2026";
  const toa_ConLai = isDeNghiPT ? "TAND tỉnh/thành phố" : "TAND cấp cao";
  const label_ConLai = getSoBALabel(rawConLai, isDeNghiPT);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, lineHeight: 1.4, fontFamily: F }}>
      {/* 1. Bản án ĐỀ NGHỊ GĐT (HIGHLIGHTED, KHÔNG BORDER) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#000000ff", fontFamily: F }}>
            {label_DeNghi}: {soBA_DeNghi}
          </span>
          {ngayBA_DeNghi && (
            <span style={{ fontSize: 11, color: "#000000ff", fontWeight: 700, fontFamily: F }}>
              – Ngày BA: {ngayBA_DeNghi}
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#000000ff", fontFamily: F }}>
          Tòa ra BA: <span style={{ fontSize: 11, fontWeight: 700, color: "#000000ff", fontFamily: F }}>{toa_DeNghi}</span>
        </span>
      </div>

      {/* 2. Bản án Giai đoạn còn lại */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2, paddingTop: 3, borderTop: "1px dashed #e2e8f0", fontStyle: "italic" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#64748b", fontFamily: F }}>
            {label_ConLai}: {soBA_ConLai}
          </span>
          {ngayBA_ConLai && (
            <span style={{ fontSize: 11, color: "#64748b", fontFamily: F }}>
              – Ngày BA: {ngayBA_ConLai}
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, color: "#475569", fontFamily: F }}>
          Tòa ra BA: <span style={{ fontSize: 11, color: "#475569", fontFamily: F }}>{toa_ConLai}</span>
        </span>
      </div>
      {(row.nkn || row.biCao) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2, paddingTop: 3, borderTop: "1px dashed #e2e8f0" }}>
          {/* {row.nkn && (
            <span style={{ fontSize: 11, color: "#000000ff", fontFamily: F }}>
              <span style={{ fontWeight: 600 }}>{label1}:</span> {row.nkn}
            </span>
          )} */}
          {row.biCao && (
            <span style={{ fontSize: 11, color: "#000000ff", fontFamily: F }}>
              <span style={{ fontWeight: 600 }}>{label2}:</span> {row.biCao}
            </span>
          )}
        </div>
      )}

      {/* Thời hiệu */}
      {row.thoiHieu && (
        <div style={{ marginTop: 2 }}>
          <span style={{ fontSize: 10.5, color: "#000000ff", fontFamily: F }}>
            <span style={{ color: "#000000ff", fontFamily: F }}>Thời hiệu: </span>
            <span style={{ color: row.thoiHieu === "Không xác định thời hiệu" || row.thoiHieu === "Không có thời hiệu giải quyết" ? "#047857" : "#c2410c", fontWeight: 600, fontFamily: F }}>
              {row.thoiHieu}
            </span>
          </span>
        </div>
      )}

      {/* QHPL cho Vụ 2, 3, 4 */}
      {showQHPL && (
        <span style={{ fontSize: 10.5, color: "#047857", fontWeight: 500, fontFamily: F }}>
          <span style={{ color: TEXT, fontWeight: 400, fontFamily: F }}>QHPL: </span>{getQuanHePhapLuat(row)}
        </span>
      )}
    </div>
  );
}

export function renderBadgeHoSo(trangThaiHoSo?: string) {
  if (trangThaiHoSo === "chua-co") return <span style={{ fontSize: 11, color: "#6b7280", fontFamily: F }}>Chưa có hồ sơ</span>;
  if (trangThaiHoSo === "da-co") return <Badge color="#065f46" bg="#d1fae5">Đã có hồ sơ</Badge>;
  // if (trangThaiHoSo === "da-tra") return <Badge color="#1e40af" bg="#dbeafe">Đã trả hồ sơ</Badge>;
  // if (trangThaiHoSo === "da-chuyen") return <Badge color="#6d28d9" bg="#ede9fe">Đã chuyển hồ sơ</Badge>;
  return <span style={{ fontSize: 11, color: "#6b7280", fontFamily: F }}>Chưa có hồ sơ</span>;
}

// ── Render Cell Trạng Thái (Cấp trình & Kết quả trả lời đơn của từng đơn) ─────
export function renderCellTrangThaiDon(
  row: VuAnRow,
  group: VuAnGroup,
  idxInGroup: number,
  onQuickView?: () => void,
  onShowHoSo?: () => void,
  onShowKetQua?: (row: VuAnRow, type: string, numberStr: string) => void
) {
  const isTrinhPhoCA = row.kqgq === "trinh-pho-chanh-an";
  const ngayTaoToTrinh = row.ngayThuLy ? (() => {
    const parts = row.ngayThuLy.split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      let newDay = day + 3;
      let newMonth = month;
      if (newDay > 28) {
        newDay = 3;
        newMonth = month + 1;
      }
      return `${newDay.toString().padStart(2, "0")}/${newMonth.toString().padStart(2, "0")}/${year}`;
    }
    return "24/07/2026";
  })() : "24/07/2026";
  const isTrinhTP = row.kqgq === "trinh-tham-phan" || (!isTrinhPhoCA && row.thamPhan);
  const isChuaPhanCong = row.kqgq === "chua-phan-cong";

  const capTrinhList = [
    "Phó Chánh án TANDTC",
    "Vụ trưởng",
    "Thẩm phán TANDTC",
    "Phó Vụ trưởng",
    "Hội đồng Thẩm phán",
    "Tổ Thẩm phán",
    "Chánh án TANDTC",
  ];
  const capTrinhItem = capTrinhList[(row.stt + idxInGroup) % capTrinhList.length];

  const trangThaiToTrinhLabel = row.trangThaiToTrinh === "da-duyet"
    ? "Đã duyệt"
    : row.trangThaiToTrinh === "bi-tra-lai"
      ? "Bị trả lại"
      : isChuaPhanCong || row.trangThaiToTrinh === "chua-trinh"
        ? "Chưa trình"
        : `Trình ${capTrinhItem}`;

  const trangThaiBadgeProps = row.trangThaiToTrinh === "da-duyet"
    ? { color: "#065f46", bg: "#d1fae5" }
    : row.trangThaiToTrinh === "bi-tra-lai"
      ? { color: "#991b1b", bg: "#fee2e2" }
      : isChuaPhanCong || row.trangThaiToTrinh === "chua-trinh"
        ? { color: "#4b5563", bg: "#f3f4f6" }
        : { color: "#92400e", bg: "#fef3c7" };

  // Kết quả trả lời đơn của từng đơn
  let kqComponent = null;

  if (row.kqGiaiQuyet === "chua-co") {
    kqComponent = (
      <span style={{ fontSize: 11, color: "#6b7280", fontFamily: F }}>
        Chưa có kết quả
      </span>
    );
  } else {
    const typeIdx = (idxInGroup + group.rows.indexOf(row)) % 4;

    const isVu234Row = isVu234(undefined, row.loaiAn || group.loaiAn);
    const knSuffix = isVu234Row
      ? (row.loaiAn === "Hành chính" || group.loaiAn === "Hành chính" ? "HC" : row.loaiAn === "Kinh doanh thương mại" || group.loaiAn === "Kinh doanh thương mại" ? "KDTM" : "DS")
      : "HS";

    if (group.id === "VA26-003005-HS" || typeIdx === 0) {
      const soQuyetDinh = `${102 + idxInGroup}/2026/QĐ-KN-${knSuffix}`;
      kqComponent = (
        <button
          onClick={() => onShowKetQua?.(row, "khang-nghi", soQuyetDinh)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
            font: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            flexWrap: "wrap",
            cursor: "pointer",
            textAlign: "left",
          }}
          title="Xem bản in Quyết định kháng nghị"
        >
          <Badge color="#065f46" bg="#d1fae5">⚖ Kháng nghị</Badge>
          <span style={{ fontSize: 10.5, color: "#1d4ed8", fontWeight: 600, fontFamily: F, textDecoration: "underline" }}>
            (Số: {soQuyetDinh})
          </span>
        </button>
      );
    } else if (typeIdx === 1) {
      const soQuyetDinh = `${45 + idxInGroup}/TB-TANDTC`;
      kqComponent = (
        <button
          onClick={() => onShowKetQua?.(row, "tra-loi-don", soQuyetDinh)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
            font: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            flexWrap: "wrap",
            cursor: "pointer",
            textAlign: "left",
          }}
          title="Xem bản in Thông báo trả lời đơn"
        >
          <Badge color="#1e40af" bg="#dbeafe">📩 Trả lời đơn</Badge>
          <span style={{ fontSize: 10.5, color: "#1d4ed8", fontWeight: 600, fontFamily: F, textDecoration: "underline" }}>
            (Số: {soQuyetDinh})
          </span>
        </button>
      );
    } else if (typeIdx === 2) {
      const soQuyetDinh = `${210 + idxInGroup}/CV-VKSTC`;
      kqComponent = (
        <button
          onClick={() => onShowKetQua?.(row, "vks", soQuyetDinh)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
            font: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            flexWrap: "wrap",
            cursor: "pointer",
            textAlign: "left",
          }}
          title="Xem bản in Công văn trao đổi"
        >
          <Badge color="#92400e" bg="#fef3c7">🏛 VKS đang giải quyết</Badge>
          <span style={{ fontSize: 10.5, color: "#1d4ed8", fontWeight: 600, fontFamily: F, textDecoration: "underline" }}>
            (CV: {soQuyetDinh})
          </span>
        </button>
      );
    } else {
      const soQuyetDinh = `${12 + idxInGroup}/QĐ-XD`;
      kqComponent = (
        <button
          onClick={() => onShowKetQua?.(row, "xep-don", soQuyetDinh)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
            font: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            flexWrap: "wrap",
            cursor: "pointer",
            textAlign: "left",
          }}
          title="Xem bản in Quyết định xếp đơn"
        >
          <Badge color="#374151" bg="#f3f4f6">📁 Xếp đơn</Badge>
          <span style={{ fontSize: 10.5, color: "#1d4ed8", fontWeight: 600, fontFamily: F, textDecoration: "underline" }}>
            (QĐ: {soQuyetDinh})
          </span>
        </button>
      );
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, lineHeight: 1.35 }}>
      {/* 1. Tờ trình & Cấp trình (cùng dòng) */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", fontFamily: F }}>
          Tờ trình:
        </span>
        <button
          onClick={onShowHoSo}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
            font: "inherit",
            fontSize: 11,
            color: "#1d4ed8",
            cursor: "pointer",
            textAlign: "left",
            textDecoration: "underline",
            fontFamily: F,
          }}
          title="Xem bản in tờ trình"
        >
          Tờ trình thẩm tra vụ việc - {ngayTaoToTrinh}
        </button>
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          -
        </span>
        <Badge color={trangThaiBadgeProps.color} bg={trangThaiBadgeProps.bg}>
          {trangThaiToTrinhLabel}
        </Badge>
      </div>

      {/* 2. Kết quả trả lời đơn (cùng dòng) */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", borderTop: `1px dashed #e5e7eb`, paddingTop: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", fontFamily: F }}>
          Kết quả trả lời đơn:
        </span>
        {kqComponent}
      </div>
    </div>
  );
}

// ── Quản lý vụ án – Main View Component ───────────────────────────────────────
export type VuAnTabId = "tat-ca" | "dang-giai-quyet" | "da-giai-quyet";
export type ChiTietTab = "thong-tin" | "danh-sach-don" | "phan-cong" | "muon-tra-ho-so" | "to-trinh" | "giai-quyet-vb" | "tai-lieu" | "ho-so-luu-tru";

export default function QuanLyVuAnView({
  userRole,
  setUserRole,
  onSelectVuAn,
}: {
  userRole?: UserRoleType;
  setUserRole?: (role: UserRoleType) => void;
  onSelectVuAn: (id: string, tab?: ChiTietTab) => void;
}) {
  const [activeTab, setActiveTab] = useState<VuAnTabId>("dang-giai-quyet");
  const [quickViewDonGroup, setQuickViewDonGroup] = useState<VuAnGroup | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [showHoSo, setShowHoSo] = useState<any>(false);
  const [showKetQua, setShowKetQua] = useState<{ row: VuAnRow; type: string; numberStr: string } | null>(null);

  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const isHinhSu = !userRole || userRole === "vu-1" || userRole === "hinh-su" || userRole === "toan-bo";

  const roleGroups = filterVuAnListByRole(VU_AN_LIST, userRole);
  const filteredGroups = roleGroups
    .map((group) => {
      if (activeTab === "tat-ca") return group;
      if (activeTab === "dang-giai-quyet") {
        const rows = group.rows.filter((r) => r.kqGiaiQuyet === "chua-co" || r.kqGiaiQuyet === "da-co-con-don" || !r.kqGiaiQuyet);
        if (rows.length === 0) return null;
        return { ...group, rows };
      }
      if (activeTab === "da-giai-quyet") {
        const rows = group.rows.filter((r) => r.kqGiaiQuyet === "da-co");
        if (rows.length === 0) return null;
        return { ...group, rows };
      }
      return group;
    })
    .filter(Boolean) as VuAnGroup[];

  const tabs = [
    { id: "tat-ca", label: "Tất cả" },
    { id: "dang-giai-quyet", label: "Đang giải quyết" },
    { id: "da-giai-quyet", label: "Đã giải quyết" },
  ];

  const paginBtn: React.CSSProperties = {
    padding: "3px 9px", border: `1px solid ${BORDER}`, borderRadius: 4,
    background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        Trang chủ › Quản lý án GĐT/TT › Quản lý vụ án
      </div>

      {/* Title + Tabs */}
      <div style={{ background: "#fff", padding: "14px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Quản lý vụ án</h2>
          {userRole && setUserRole && (
            <TaiKhoanPhanQuyenBar userRole={userRole} setUserRole={setUserRole} />
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {tabs.map((t) => {
            const active = t.id === activeTab;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id as VuAnTabId)}
                style={{ padding: "10px 16px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400, background: "none", border: "none", cursor: "pointer", color: active ? RED : MUTED, borderBottom: active ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Panel */}
      <VuAnSearchFilterPanel
        userRole={userRole}
        onSearch={() => alert("Đang tìm kiếm danh sách vụ án...")}
      />

      {/* Action bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "#fff", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ flex: 1 }} />
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
          + Thêm mới
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
          <Printer size={13} /> In biểu đồ
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          {isHinhSu ? (
            <>
              <colgroup>
                <col style={{ width: 4 }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: 5 }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ ...TH_STYLE, textAlign: "center", padding: "4px 2px" }}><input type="checkbox" /></th>
                  <th style={TH_STYLE}>THÔNG TIN ĐƠN & THỤ LÝ</th>
                  <th style={TH_STYLE}>NGƯỜI ĐỨNG ĐƠN</th>
                  <th style={TH_STYLE}>TRẠNG THÁI</th>
                  <th style={TH_STYLE}>THÔNG TIN BẢN ÁN ĐỀ NGHỊ</th>
                  <th style={TH_STYLE}>PHÂN CÔNG</th>
                  <th style={{ ...TH_STYLE, textAlign: "center", padding: "4px 2px" }}>THAO TÁC</th>
                </tr>
              </thead>
            </>
          ) : (
            <>
              <colgroup>
                <col style={{ width: 3 }} />
                <col style={{ width: 4 }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: 5 }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ ...TH_STYLE, textAlign: "center", padding: "4px 2px" }}><input type="checkbox" /></th>
                  <th style={{ ...TH_STYLE, textAlign: "center", padding: "4px 2px" }}>STT</th>
                  <th style={TH_STYLE}>SỐ & NGÀY THỤ LÝ</th>
                  <th style={TH_STYLE}>NGƯỜI ĐỨNG ĐƠN</th>
                  <th style={TH_STYLE}>THÔNG TIN BẢN ÁN/QĐ & QHPL</th>
                  <th style={TH_STYLE}>PHÂN CÔNG</th>
                  <th style={TH_STYLE}>TRẠNG THÁI</th>
                  <th style={{ ...TH_STYLE, textAlign: "center", padding: "4px 2px" }}>THAO TÁC</th>
                </tr>
              </thead>
            </>
          )}
          <tbody>
            {isHinhSu
              ? filteredGroups.map((group, groupIdx) => {
                const isCollapsed = collapsedGroups[group.id];
                const firstRow = group.rows[0];
                const soBA = firstRow ? formatSoBA(firstRow.soBA, group.loaiAn || "Hình sự") : "";
                const ngayBA = firstRow?.ngayBA || "";
                const toa = firstRow?.toa || "";
                const isDeNghiPT = firstRow ? (firstRow.soBA.includes("PT") || firstRow.capXetXu?.includes("Phúc") || firstRow.capXetXu?.includes("Tái")) : false;
                const label_DeNghi = firstRow ? getSoBALabel(firstRow.soBA, !isDeNghiPT) : "Số BA";

                return (
                  <React.Fragment key={group.id}>
                    {/* Header Vụ án (Level 1: Dòng Mã Vụ Án hồng nhạt tinh gọn) */}
                    <tr
                      style={{
                        background: "#fef2f2",
                        borderTop: `1px solid #fecdd3`,
                        borderBottom: `1px solid #fecdd3`,
                      }}
                    >
                      <td style={{ ...TD_STYLE, textAlign: "center", background: "#fef2f2", padding: "4px 8px" }}>
                        <input type="checkbox" style={{ cursor: "pointer" }} />
                      </td>
                      <td colSpan={4} style={{ ...TD_STYLE, background: "#fef2f2", padding: "5px 10px" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}
                          onClick={() => toggleGroupCollapse(group.id)}
                        >
                          {isCollapsed ? <ChevronRight size={14} color="#2563eb" /> : <ChevronDown size={14} color="#2563eb" />}
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", fontFamily: F }}>
                            {groupIdx + 1}.
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", fontFamily: F }}>
                            {group.soBA || group.id}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", fontFamily: F }}>
                            – {group.ngayBA || group.id}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", fontFamily: F }}>
                            – {group.toa || group.id}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", fontFamily: F, display: "inline-flex", alignItems: "center" }}>
                            Tổng đơn đã thụ lý: <span style={{ color: "#2563eb", fontWeight: 700, marginLeft: 4 }}>{group.rows.length}</span>
                          </span>
                        </div>
                      </td>

                      <td style={{ ...TD_STYLE, background: "#fef2f2", padding: "5px 8px" }}>

                        <div style={{ display: "flex", alignItems: "center", gap: 5, borderTop: `1px dashed #e5e7eb`, paddingTop: 4, marginTop: 2 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", fontFamily: F }}>Hồ sơ:</span>
                          {renderBadgeHoSo(group.rows[0]?.trangThaiHoSo)}
                        </div>
                      </td>
                      <td style={{ ...TD_STYLE, background: "#fef2f2", padding: "5px 8px", textAlign: "center" }} />
                    </tr>

                    {/* Danh sách các đơn thuộc Vụ án (1 dòng = 1 đơn) */}
                    {!isCollapsed &&
                      group.rows.map((row, idx) => {
                        const effectiveLoaiAn = row.loaiAn || group.loaiAn || "Hình sự";
                        const { label1, label2 } = getPartyLabels(effectiveLoaiAn, userRole);
                        const rowKey = `${group.id}-${row.stt}-${idx}`;
                        const isFirst = idx === 0;
                        const totalRows = group.rows.length;

                        return (
                          <tr
                            key={rowKey}
                            style={{ background: "#ffffff" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
                          >
                            <td style={{ ...TD_STYLE, textAlign: "center", padding: "4px 8px" }}>
                              <input type="checkbox" style={{ cursor: "pointer" }} />
                            </td>

                            {/* Cột gộp chung: STT, THÔNG TIN ĐƠN & THỤ LÝ */}
                            <td style={{ ...TD_STYLE, padding: "5px 8px", lineHeight: 1.35 }}>
                              <div style={{ display: "flex", gap: 6 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                                      Số TL: {row.soThuLy}
                                    </span>
                                    <span style={{ fontSize: 10.5, color: TEXT, fontFamily: F }}>
                                      Ngày TL: {row.ngayThuLy}
                                    </span>
                                  </div>
                                  {row.anLoai === "quoc-hoi" && (
                                    <div style={{ fontSize: 10, color: "#475569", fontFamily: F, borderTop: "1px dashed #e2e8f0", paddingTop: 4, marginTop: 4, lineHeight: 1.3 }}>
                                      <span style={{ fontWeight: 600, color: "#3730a3" }}>Công văn QH:</span>{" "}
                                      <span>
                                        {row.stt % 3 === 0
                                          ? "Ban Dân nguyện"
                                          : row.stt % 3 === 1
                                            ? "Ủy ban Tư pháp"
                                            : "Văn phòng Quốc hội"}
                                      </span>{" "}
                                      –{" "}
                                      <span>
                                        Số {row.stt % 3 === 0
                                          ? "382/BDN-QH"
                                          : row.stt % 3 === 1
                                            ? "195/UBTP15"
                                            : "524/VPQH"}
                                      </span>{" "}
                                      –{" "}
                                      <span>
                                        {row.ngayThuLy ? (() => {
                                          const parts = row.ngayThuLy.split("/");
                                          if (parts.length === 3) {
                                            const day = parseInt(parts[0], 10);
                                            const month = parseInt(parts[1], 10);
                                            const year = parseInt(parts[2], 10);
                                            let prevDay = day - 5;
                                            let prevMonth = month;
                                            if (prevDay <= 0) {
                                              prevDay = 25;
                                              prevMonth = month - 1;
                                              if (prevMonth <= 0) prevMonth = 12;
                                            }
                                            return `${prevDay.toString().padStart(2, "0")}/${prevMonth.toString().padStart(2, "0")}/${year}`;
                                          }
                                          return "15/07/2026";
                                        })() : "15/07/2026"}
                                      </span>
                                    </div>
                                  )}

                                </div>
                              </div>
                              {/* Badges */}
                              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2 }}>
                                {row.anLoai === "chi-dao" && <Badge color="#92400e" bg="#fef3c7">Án chỉ đạo</Badge>}
                                {row.anLoai === "quoc-hoi" && <Badge color="#3730a3" bg="#e0e7ff">Án Quốc hội</Badge>}
                                {row.anLoai === "tu-hinh" && <Badge color="#991b1b" bg="#fee2e2">Án tử hình</Badge>}
                              </div>
                            </td>

                            {/* Cột 2: Đương sự & Người đứng đơn (theo từng đơn) */}
                            <td style={{ ...TD_STYLE, verticalAlign: "top", background: "#ffffff", padding: "6px 10px", lineHeight: 1.35 }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>

                                {row.ndd && (
                                  <div style={{ fontSize: 11, fontFamily: F, display: "flex", flexDirection: "column" }}>
                                    <div>
                                      <span style={{ color: TEXT, fontWeight: 500 }}>Người đứng đơn:</span>{" "}
                                      <span style={{ color: TEXT }}>{row.ndd}</span>
                                    </div>
                                    {row.dcd && (
                                      <div style={{ color: TEXT }}>
                                        <span>Địa chỉ: </span>
                                        <span>{row.dcd}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Cột 5: Trạng thái (Tờ trình & Kết quả trả lời đơn) */}
                            <td style={{ ...TD_STYLE, padding: "6px 8px", verticalAlign: "top" }}>
                              {renderCellTrangThaiDon(row, group, idx, () => setQuickViewDonGroup(group), () => setShowHoSo(row), (r, t, n) => setShowKetQua({ row: r, type: t, numberStr: n }))}
                            </td>
                            {/* 2 Cột chung (Thông tin bản án, Phân công) gộp ô theo rowSpan */}
                            {
                              isFirst && (
                                <>
                                  {/* Cột 3: Thông tin Bản án Đề nghị & Giai đoạn còn lại */}
                                  <td rowSpan={totalRows} style={{ ...TD_STYLE, verticalAlign: "top", background: "#ffffff", padding: "6px 10px", lineHeight: 1.35 }}>
                                    {renderThongTinBanAnCell(row, effectiveLoaiAn, false)}
                                  </td>

                                  {/* Cột 4: Phân công */}
                                  <td rowSpan={totalRows} style={{ ...TD_STYLE, verticalAlign: "middle", background: "#ffffff", padding: "6px 6px", lineHeight: 1.35 }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                      <span style={{ fontSize: 10.5, fontFamily: F, whiteSpace: "nowrap" }}>
                                        <span style={{ color: TEXT }}>TTV: </span>
                                        <span style={{ color: TEXT }}>{row.ttv}</span>
                                      </span>
                                      <span style={{ fontSize: 10.5, fontFamily: F, whiteSpace: "nowrap" }}>
                                        <span style={{ color: TEXT }}>LĐ: </span>
                                        <span style={{ color: TEXT }}>{row.lanhDao}</span>
                                      </span>
                                      <span style={{ fontSize: 10.5, fontFamily: F, whiteSpace: "nowrap" }}>
                                        <span style={{ color: TEXT }}>TP: </span>
                                        <span style={{ color: TEXT }}>{row.thamPhan}</span>
                                      </span>
                                    </div>
                                  </td>
                                </>
                              )
                            }
                            {/* Cột 6: Thao tác */}
                            {
                              isFirst && (
                                <td rowSpan={totalRows} style={{ ...TD_STYLE, textAlign: "center", padding: "5px 8px", background: "#ffffff", verticalAlign: "middle" }}>
                                  <button
                                    onClick={() => onSelectVuAn(group.id)}
                                    style={{ background: "none", border: "none", cursor: "pointer", padding: 3, borderRadius: 4 }}
                                    title="Xem chi tiết"
                                  >
                                    <Eye size={14} color="#6b7280" />
                                  </button>
                                </td>
                              )
                            }
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })
              : filteredGroups.flatMap((group) =>
                group.rows.map((row, idx) => {
                  const effectiveLoaiAn = row.loaiAn || group.loaiAn || "Dân sự";
                  const { label1, label2 } = getPartyLabels(effectiveLoaiAn, userRole);
                  const rowKey = `${group.id}-${row.stt}-${idx}`;
                  const globalIdx = filteredGroups.indexOf(group) * group.rows.length + idx;
                  return (
                    <tr
                      key={rowKey}
                      style={{ background: globalIdx % 2 === 0 ? "#fff" : "#fafafa" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = globalIdx % 2 === 0 ? "#fff" : "#fafafa")}
                    >
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <input type="checkbox" />
                      </td>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12, fontFamily: F }}>
                        {globalIdx + 1}
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <div style={{ fontSize: 10, color: "#475569", borderTop: "1px dashed #e2e8f0", paddingTop: 4, marginTop: 4, lineHeight: 1.3 }}>
                            <span style={{ fontSize: 10, color: MUTED }}>
                              Số: <b>{row.soThuLy}</b>
                            </span>
                            <span style={{ fontSize: 10, color: MUTED }}>– Ngày TL: {row.ngayThuLy}</span>
                          </div>
                          {row.anLoai === "quoc-hoi" && (
                            <div style={{ fontSize: 10, color: "#475569", borderTop: "1px dashed #e2e8f0", paddingTop: 4, marginTop: 4, lineHeight: 1.3 }}>
                              <span style={{ fontWeight: 600, color: "#3730a3" }}>Thông tin công văn:</span>{" "}
                              <span>
                                {row.stt % 3 === 0
                                  ? "Ban Dân nguyện"
                                  : row.stt % 3 === 1
                                    ? "Ủy ban Tư pháp"
                                    : "Văn phòng Quốc hội"}
                              </span>{" "}
                              –{" "}
                              <span>
                                Số {row.stt % 3 === 0
                                  ? "382/BDN-QH"
                                  : row.stt % 3 === 1
                                    ? "195/UBTP15"
                                    : "524/VPQH"}
                              </span>{" "}
                              –{" "}
                              <span>
                                {row.ngayThuLy ? (() => {
                                  const parts = row.ngayThuLy.split("/");
                                  if (parts.length === 3) {
                                    const day = parseInt(parts[0], 10);
                                    const month = parseInt(parts[1], 10);
                                    const year = parseInt(parts[2], 10);
                                    let prevDay = day - 5;
                                    let prevMonth = month;
                                    if (prevDay <= 0) {
                                      prevDay = 25;
                                      prevMonth = month - 1;
                                      if (prevMonth <= 0) prevMonth = 12;
                                    }
                                    return `${prevDay.toString().padStart(2, "0")}/${prevMonth.toString().padStart(2, "0")}/${year}`;
                                  }
                                  return "15/07/2026";
                                })() : "15/07/2026"}
                              </span>
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewDonGroup(group);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              fontSize: 11,
                              color: "#2563eb",
                              fontFamily: F,
                              textDecoration: "underline",
                              textAlign: "left",
                              fontWeight: 600,
                            }}
                            title="Xem nhanh danh sách đơn và thông tin trình"
                          >
                            Số đơn {group.rows.length}
                          </button>
                        </div>
                      </td>

                      <td style={TD_STYLE}>
                        {row.ndd && (
                          <div style={{ fontSize: 11, fontFamily: F, display: "flex", flexDirection: "column", gap: 2 }}>
                            <div>
                              <span style={{ color: TEXT, fontWeight: 500 }}>Người đứng đơn:</span>{" "}
                              <span style={{ color: TEXT }}>{row.ndd}</span>
                            </div>
                            {row.dcd && (
                              <div style={{ color: TEXT }}>
                                <span>Địa chỉ: </span>
                                <span>{row.dcd}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td style={{ ...TD_STYLE, verticalAlign: "top", padding: "6px 10px" }}>
                        {renderThongTinBanAnCell(row, effectiveLoaiAn, isVu234(userRole, row.loaiAn))}
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {row.kqgq !== "chua-phan-cong" && (
                            <span style={{ fontSize: 11, fontFamily: F }}>
                              <span style={{ color: MUTED }}>TTV: </span>{row.ttv}
                            </span>
                          )}
                          <span style={{ fontSize: 11, fontFamily: F }}>
                            <span style={{ color: MUTED }}>TP: </span>
                            {row.thamPhan || "–"}
                          </span>
                          {row.kqgq !== "chua-phan-cong" && (
                            <span style={{ fontSize: 11, fontFamily: F }}>
                              <span style={{ color: MUTED }}>LĐ: </span>{row.lanhDao}
                            </span>
                          )}

                        </div>
                      </td>
                      {/* Cột Trạng thái (Tờ trình & Kết quả trả lời đơn) */}
                      <td style={{ ...TD_STYLE, padding: "6px 8px", verticalAlign: "top", fontFamily: F }}>
                        {renderCellTrangThaiDon(row, group, idx, () => setQuickViewDonGroup(group), () => setShowHoSo(row), (r, t, n) => setShowKetQua({ row: r, type: t, numberStr: n }))}
                        <div style={{ display: "flex", alignItems: "center", gap: 5, borderTop: `1px dashed #e5e7eb`, paddingTop: 4, marginTop: 2 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", fontFamily: F }}>Hồ sơ:</span>
                          {renderBadgeHoSo(row.trangThaiHoSo)}
                        </div>
                      </td>
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <button
                          onClick={() => onSelectVuAn(group.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4, fontSize: 18, color: MUTED, lineHeight: 1 }}
                          title="Tùy chọn"
                        >
                          ⋮
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
          </tbody>
        </table>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1–{filteredGroups.reduce((s, g) => s + g.rows.length, 0)} trong tổng {filteredGroups.reduce((s, g) => s + g.rows.length, 0)} bản ghi</span>
          <div style={{ flex: 1 }} />
          <button style={paginBtn} disabled>‹</button>
          <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
          <button style={paginBtn}>›</button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}><option>10 / trang</option></select>
        </div>
      </div>

      {
        quickViewDonGroup && (
          <QuickViewDanhSachDonModal
            group={quickViewDonGroup}
            onClose={() => setQuickViewDonGroup(null)}
            onSelectVuAn={onSelectVuAn}
            userRole={userRole}
          />
        )
      }
      {
        showHoSo && (
          <HoSoToTrinhModal
            onlyPrint={typeof showHoSo === "object"}
            row={typeof showHoSo === "object" ? showHoSo : undefined}
            onClose={() => setShowHoSo(false)}
          />
        )
      }
      {
        showKetQua && (
          <HoSoKetQuaModal
            row={showKetQua.row}
            type={showKetQua.type}
            numberStr={showKetQua.numberStr}
            onClose={() => setShowKetQua(null)}
          />
        )
      }
    </div >
  );
}

// ── Sub-components for ChiTietVuAn ──────────────────────────────────────────

function ThongTinChungVuAnCard({ detail }: { detail?: VuAnDetailData }) {
  return (
    <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
      <div style={{ padding: "11px 16px", borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>THÔNG TIN CHUNG CỦA VỤ ÁN</span>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "10px 16px 0" }}>
        <Badge color="#854d0e" bg="#fefce8">⭐ Án chỉ đạo</Badge>
        <Badge color="#6b21a8" bg="#f3e8ff">🏛️ ÁN QH</Badge>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", marginTop: 10 }}>
        <colgroup>
          <col style={{ width: "16%" }} />
          <col style={{ width: "34%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "34%" }} />
        </colgroup>
        <tbody>
          {(() => {
            const isQDVuAn =
              detail?.loaiBienAn?.toLowerCase().includes("quyết định") ||
              detail?.soNgayBanAn?.toUpperCase().includes("QĐ") ||
              detail?.soNgayBanAn?.toUpperCase().includes("QD");
            const docCodeVuAn = isQDVuAn ? "QD" : "BA";

            const isPTVuAn =
              detail?.capXetXu?.toLowerCase().includes("phúc thẩm") ||
              detail?.loaiBienAn?.toLowerCase().includes("phúc thẩm") ||
              detail?.soNgayBanAn?.toUpperCase().includes("PT") ||
              detail?.soNgayBanAn?.toUpperCase().includes("HSPT");
            const capCodeVuAn = isPTVuAn ? "PT" : "ST";
            const baCodeVuAn = `${docCodeVuAn}${capCodeVuAn}`;

            return (
              <>
                <tr>
                  <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Mã vụ án</td>
                  <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
                    {detail?.maVuAn ? `${detail.maVuAn}: ${detail.tenVuAn}` : "VA26-002039: Nguyễn Văn Minh – Tội cướp tài sản"}
                  </td>

                  <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Số – Ngày {baCodeVuAn}</td>
                  <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{detail?.soNgayBanAn || "12/4/2026/HSPT – 30/12/2025"}</td>

                </tr>

                <tr>
                  <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}` }}>Loại án</td>
                  <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}` }}>{detail?.loaiAn || "Hình sự"}</td>
                  <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}` }}>Tòa ra {baCodeVuAn}</td>
                  <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{detail?.toaXetXu || "Tòa án nhân dân cấp cao tại Hà Nội"}</td>
                </tr>
              </>
            );
          })()}
          <tr>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>Công văn</td>
            <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, borderRight: `1px solid ${BORDER}`, lineHeight: 1.7 }}>
              <b>Số 124/CV-VKSTC – 15/07/2026</b><br />
              Viện kiểm sát nhân dân tối cao<br />
              <span style={{ color: MUTED, fontStyle: "italic" }}>(Công văn kiến nghị GĐT)</span>
            </td>
            <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>Chỉ đạo</td>
            <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, lineHeight: 1.7, verticalAlign: "top" }}>
              <b>Nguyễn Văn A</b><br />
              Phó Chánh án TANDTC<br />
              <span style={{ color: MUTED }}>Xem xét kỹ hồ sơ đánh giá thương tích và yếu tố phòng vệ chính đáng</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TabDanhSachDon({ detail }: { detail: VuAnDetailData }) {
  const rawList = detail?.danhSachDon || [];
  const detailTags: string[] = (detail as any)?.tags || [];
  const isDetailAnQuocHoi = detailTags.includes("an-quoc-hoi") || detailTags.includes("Án quốc hội") || (detail as any)?.anDacThu === "an-quoc-hoi" || (detail as any)?.anDacThu === "Án quốc hội";

  const danhSachDon = (rawList.length > 0 ? rawList : [
    { stt: 1, maDon: "CV-99210", thongTinGQ: "Thụ lý mới", soThuLy: "CV-2026/0088", ngayThuLy: "10/06/2026", ngayNhan: "10/06/2026", nguoiDung: "Văn phòng Quốc hội", phanLoai: "Công văn", loaiDon: "DON_CHINH", noiDung: "Công văn chuyển đơn của Đoàn Đại biểu Quốc hội về việc đề nghị xem xét kháng nghị GĐT.", isAnQuocHoi: true },
    { stt: 2, maDon: "KN-88421", thongTinGQ: "Đã thụ lý", soThuLy: "KN-2026/00142", ngayThuLy: "15/05/2026", ngayNhan: "15/05/2026", nguoiDung: "Nguyễn Thị Lan", phanLoai: "Đơn khiếu nại tố tụng", loaiDon: "DON_CHINH", noiDung: "Đơn đề nghị xem xét giám đốc thẩm đối với bản án sơ thẩm." }
  ]).map((d, idx) => {
    const isAnQuocHoi = isDetailAnQuocHoi || (d as any).isAnQuocHoi || (d as any).phanLoai?.includes("Quốc hội") || idx === 0;
    const isKhieuNai = Boolean(
      detail?.isKhieuNai ||
      detail?.entityWord === "Khiếu nại" ||
      (typeof detail?.maVuAn === "string" && (detail.maVuAn.startsWith("KN") || detail.maVuAn.includes("KN"))) ||
      (detail as any).maSo?.startsWith("KN")
    );
    let hT = isAnQuocHoi ? "Công văn" : d.phanLoai;
    if (isKhieuNai && hT === "Công văn") {
      hT = "Đơn khiếu nại tố cáo trong tố tụng";
    }
    return {
      ...d,
      hinhThucText: hT,
      isAnQuocHoi,
    };
  });

  return (
    <div style={{ padding: 20 }}>
      <ThongTinChungVuAnCard detail={detail} />
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Danh sách đơn</h3>
          <div style={{ flex: 1 }} />
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            Tách vụ kiện
          </button>
          <button style={{ marginLeft: 8, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
            <RefreshCw size={12} color={MUTED} />
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 40 }} /><col style={{ width: 75 }} />
            <col style={{ width: "18%" }} /><col style={{ width: "10%" }} />
            <col style={{ width: "14%" }} /><col style={{ width: "16%" }} />
            <col style={{ width: "28%" }} /><col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              {["STT", "Mã đơn", "Thông tin giải quyết đơn", "Ngày nhận đơn", "Người dùng đơn", "Hình thức / Phân loại", "Nội dung", "Thao tác"].map((h) => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {danhSachDon.length === 0 && (
              <tr><td colSpan={8} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>Không có dữ liệu</td></tr>
            )}
            {danhSachDon.map((d, idx) => (
              <tr key={d.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{d.stt}</td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: "#2563eb", fontSize: 12, fontWeight: 600 }}>{d.maDon}</td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: d.thongTinGQ === "Thụ lý mới" ? "#065f46" : MUTED, fontFamily: F }}>{d.thongTinGQ}</span>
                    {d.soThuLy && <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Số: {d.soThuLy}</span>}
                    {d.ngayThuLy && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{d.ngayThuLy}</span>}
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{d.ngayNhan}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{d.nguoiDung}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: TEXT, fontFamily: F }}>{d.hinhThucText}</span>
                    {d.isAnQuocHoi && <Tag type="an-quoc-hoi" />}
                    <Badge color={d.loaiDon === "DON_CHINH" ? "#1e40af" : "#991b1b"} bg={d.loaiDon === "DON_CHINH" ? "#dbeafe" : "#fee2e2"}>
                      {d.loaiDon === "DON_CHINH" ? "ĐƠN CHÍNH" : "Đơn trùng"}
                    </Badge>
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED, lineHeight: 1.5 }}>{d.noiDung}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} title="Xem"><Eye size={14} color={MUTED} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── XemBieuMauScreen – Word editor popup for phieu templates ────────────────
function XemBieuMauScreen({ loaiPhieu, onClose }: { loaiPhieu: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState("13pt");
  const [isSaved, setIsSaved] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const execCmd = (cmd: string, val?: string) => document.execCommand(cmd, false, val);
  const today = new Date();
  const todayStr = `ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  const tbBtnSt: React.CSSProperties = { padding: "4px 9px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F, color: TEXT, display: "flex", alignItems: "center", gap: 4 };
  const sepSt: React.CSSProperties = { width: 1, height: 18, background: BORDER, margin: "0 3px" };

  const isPhieuTra = loaiPhieu === "Phiếu trả";
  const isPhieuMuon = loaiPhieu === "Phiếu mượn" || loaiPhieu === "Phiếu chuyển";
  const isCongVan = loaiPhieu === "Công văn XM, BS" || loaiPhieu === "Công văn khác" || loaiPhieu === "Công văn xác minh";
  const title = isPhieuTra ? "PHIẾU TRẢ HỒ SƠ" : isPhieuMuon ? (loaiPhieu === "Phiếu chuyển" ? "PHIẾU CHUYỂN HỒ SƠ" : "PHIẾU MƯỢN HỒ SƠ") : "CÔNG VĂN XÁC MINH";
  const soHieu = hasNumber ? (isPhieuTra ? "18/2026/PT-TANDTC" : isPhieuMuon ? "12/2026/PM-TANDTC" : "527/2026/CV-TANDTC") : `.../${isPhieuTra ? "PT" : isPhieuMuon ? "PM" : "CV"}-TANDTC`;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 2000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 12px", overflowY: "auto" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 980, boxShadow: "0 24px 70px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 20px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <FileText size={16} color={RED} />
          <span style={{ fontSize: 14, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>Xem biểu mẫu – {loaiPhieu}</span>
          {isSaved && <span style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>✓ Đã lưu</span>}
          {hasNumber && <span style={{ fontSize: 11, background: "#f3e8ff", color: "#6b21a8", border: "1px solid #d8b4fe", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>🔢 Số: {soHieu}</span>}
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { setIsSaved(true); }} style={{ padding: "5px 14px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>💾 Lưu</button>
            <button onClick={() => setHasNumber(v => !v)} style={{ padding: "5px 14px", background: hasNumber ? "#dc2626" : "#7c3aed", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>{hasNumber ? "✕ Hủy số" : "🔢 Lấy số"}</button>
            <button style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>📩 Trình ký</button>
            <button onClick={onClose} style={{ padding: "5px 14px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>✕ Đóng</button>
          </div>
        </div>

        {/* Ribbon toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 16px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, flexWrap: "wrap" }}>
          <button onClick={() => execCmd("undo")} style={tbBtnSt}>↩ Hoàn tác</button>
          <button onClick={() => execCmd("redo")} style={tbBtnSt}>↪ Làm lại</button>
          <div style={sepSt} />
          <select onChange={e => execCmd("fontName", e.target.value)} style={{ ...tbBtnSt, padding: "4px 6px" }}>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Arial">Arial</option>
          </select>
          <select onChange={e => setFontSize(e.target.value)} value={fontSize} style={{ ...tbBtnSt, padding: "4px 6px" }}>
            {["11pt", "12pt", "13pt", "14pt"].map(s => <option key={s}>{s}</option>)}
          </select>
          <div style={sepSt} />
          <button onClick={() => execCmd("bold")} style={tbBtnSt}><b>B</b></button>
          <button onClick={() => execCmd("italic")} style={tbBtnSt}><i>I</i></button>
          <button onClick={() => execCmd("underline")} style={tbBtnSt}><u>U</u></button>
          <div style={sepSt} />
          <button onClick={() => execCmd("justifyLeft")} style={tbBtnSt}>⬅</button>
          <button onClick={() => execCmd("justifyCenter")} style={tbBtnSt}>↔</button>
          <button onClick={() => execCmd("justifyRight")} style={tbBtnSt}>➡</button>
          <button onClick={() => execCmd("justifyFull")} style={tbBtnSt}>☰</button>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 11, color: MUTED }}>Zoom:</span>
            <button onClick={() => setZoom(z => Math.max(60, z - 10))} style={tbBtnSt}>-</button>
            <span style={{ fontSize: 11, fontWeight: 700 }}>{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={tbBtnSt}>+</button>
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, overflowY: "auto", background: "#94a3b8", padding: "24px 16px", display: "flex", justifyContent: "center" }}>
          <div
            contentEditable
            suppressContentEditableWarning
            style={{
              background: "#fff", width: "100%", maxWidth: 750,
              minHeight: 1050, padding: "60px 72px 70px 72px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: fontSize, color: "#000", lineHeight: 1.65,
              outline: "none", boxSizing: "border-box",
              transform: `scale(${zoom / 100})`, transformOrigin: "top center",
            }}
          >
            {/* Quốc hiệu */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ textAlign: "center", width: "46%" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                <div style={{ fontWeight: 700, fontSize: 12 }}>VỤ GIÁM ĐỐC KIỂM TRA</div>
                <div style={{ width: 90, height: 1, background: "#000", margin: "4px auto" }} />
                <div style={{ fontSize: 12, marginTop: 4 }}>Số: <span style={{ background: hasNumber ? "#e9d5ff" : "#fef08a", padding: "1px 4px", fontWeight: 700 }}>{soHieu}</span></div>
              </div>
              <div style={{ textAlign: "center", width: "52%" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Độc lập – Tự do – Hạnh phúc</div>
                <div style={{ width: 160, height: 1, background: "#000", margin: "4px auto" }} />
                <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 4 }}>Hà Nội, {todayStr}</div>
              </div>
            </div>

            {/* Title */}
            <div style={{ textAlign: "center", fontWeight: 700, fontSize: 17, margin: "28px 0 20px", letterSpacing: 0.5 }}>{title}</div>

            {/* Content */}
            {isPhieuTra && (
              <>
                <div style={{ textIndent: 30, marginBottom: 14 }}>Kính gửi: <b>Viện kiểm sát nhân dân tối cao</b></div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Tòa án nhân dân tối cao trả lại hồ sơ vụ án <b>Phan Văn Thành – Bức cung</b> về Viện kiểm sát nhân dân tối cao theo quy định của pháp luật.
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 16 }}>
                  <tbody>
                    {[
                      ["Số BA/Quyết định", "050526_CTH02"],
                      ["Ngày ra bản án", "05/05/2026"],
                      ["Tòa xét xử", "Tòa án nhân dân tỉnh Hải Phòng"],
                      ["Giai đoạn", "Giám đốc thẩm, tái thẩm"],
                      ["Số phiếu", soHieu],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ border: "1px solid #999", padding: "5px 10px", width: "40%", fontWeight: 600 }}>{k}</td>
                        <td style={{ border: "1px solid #999", padding: "5px 10px" }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  <b>Thành phần hồ sơ trả về:</b> Hồ sơ vụ án (bao gồm biên bản, quyết định, bản án và các tài liệu liên quan).
                </div>
              </>
            )}
            {isPhieuMuon && (
              <>
                <div style={{ textIndent: 30, marginBottom: 14 }}>Kính gửi: <b>Viện kiểm sát nhân dân tối cao</b></div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Tòa án nhân dân tối cao đề nghị mượn hồ sơ vụ án <b>Phan Văn Thành – Bức cung</b> để phục vụ công tác nghiên cứu, giải quyết theo thủ tục giám đốc thẩm.
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 16 }}>
                  <tbody>
                    {[
                      ["Số BA/Quyết định", "050526_CTH02"],
                      ["Ngày ra bản án", "05/05/2026"],
                      ["Tòa xét xử", "Tòa án nhân dân tỉnh Hải Phòng"],
                      ["Thời hạn mượn", "30 ngày kể từ ngày nhận hồ sơ"],
                      ["Số phiếu", soHieu],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ border: "1px solid #999", padding: "5px 10px", width: "40%", fontWeight: 600 }}>{k}</td>
                        <td style={{ border: "1px solid #999", padding: "5px 10px" }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  <b>Mục đích mượn:</b> Nghiên cứu hồ sơ phục vụ xét xử giám đốc thẩm theo quy định pháp luật tố tụng hình sự.
                </div>
              </>
            )}
            {isCongVan && (
              <>
                <div style={{ textIndent: 30, marginBottom: 14 }}>Kính gửi: <b>Viện kiểm sát nhân dân tỉnh Hải Phòng</b></div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Tòa án nhân dân tối cao nhận được đề nghị giám đốc thẩm vụ án <b>Phan Văn Thành – Bức cung</b>. Để có cơ sở xem xét, giải quyết, Tòa án nhân dân tối cao đề nghị Viện kiểm sát nhân dân tỉnh Hải Phòng xác minh, bổ sung một số thông tin sau:
                </div>
                <div style={{ paddingLeft: 30, marginBottom: 14, lineHeight: 1.8 }}>
                  <div>1. Xác minh quá trình điều tra, truy tố, xét xử vụ án;</div>
                  <div>2. Bổ sung tài liệu, chứng cứ liên quan đến tội danh bức cung;</div>
                  <div>3. Cung cấp biên bản các phiên tòa sơ thẩm và phúc thẩm.</div>
                </div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Đề nghị Viện kiểm sát nhân dân tỉnh Hải Phòng trả lời bằng văn bản trong thời hạn <b>30 ngày</b> kể từ ngày nhận công văn này./.
                </div>
              </>
            )}

            {/* Signature */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
              <div style={{ fontSize: 12, fontStyle: "italic", lineHeight: 1.7, width: "45%" }}>
                <div style={{ fontWeight: 700, fontStyle: "normal", textDecoration: "underline", marginBottom: 4 }}>Nơi nhận:</div>
                <div>– Như kính gửi;</div>
                <div>– Đ/c Chánh án TANDTC (để b/c);</div>
                <div>– Lưu: VT, Vụ GĐ,KT.</div>
              </div>
              <div style={{ textAlign: "center", width: "48%", fontSize: 13, fontWeight: 700, lineHeight: 1.5 }}>
                <div>TL. CHÁNH ÁN</div>
                <div>KT. CHÁNH VĂN PHÒNG</div>
                <div>PHÓ CHÁNH VĂN PHÒNG</div>
                <div style={{ height: 70 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaoPhieuModal({ onClose }: { onClose: () => void }) {
  const [loaiPhieu, setLoaiPhieu] = useState("");
  const [showBieuMau, setShowBieuMau] = useState(false);
  const [ghiChu, setGhiChu] = useState("");
  const [diinhKem, setDinhKem] = useState(false);
  const [soPhieu, setSoPhieu] = useState("");
  const [daLaySo, setDaLaySo] = useState(false);
  const [noiNhanRows, setNoiNhanRows] = useState([
    { id: 1, noiNhan: "Viện kiểm sát", chiTiet: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án", editing: false },
  ]);
  const [addingRow, setAddingRow] = useState(false);
  const [newRow, setNewRow] = useState({ noiNhan: "", chiTiet: "", ghiChu: "" });

  const handleToggleLaySo = () => {
    if (!daLaySo) {
      const generatedNo = loaiPhieu === "Công văn xác minh"
        ? "527/2026/CV-TANDTC"
        : loaiPhieu === "Phiếu trả"
          ? "18/2026/PT-TANDTC"
          : "1/2026/CV-TANDTC";
      setSoPhieu(generatedNo);
      setDaLaySo(true);
    } else {
      setSoPhieu("");
      setDaLaySo(false);
    }
  };

  const inSt: React.CSSProperties = { padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box" };
  const selSt: React.CSSProperties = { ...inSt, cursor: "pointer" };
  const lbl = (text: string, required = false) => (
    <span style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 3, display: "block" }}>
      {required && <span style={{ color: RED }}>* </span>}{text}
    </span>
  );

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 940, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 14 }}>✏</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: RED, fontFamily: F, flex: 1 }}>
              {loaiPhieu === "Công văn XM, BS" ? "Tạo công văn xác minh, bổ sung" : loaiPhieu === "Công văn khác" ? "Tạo công văn" : loaiPhieu ? `Tạo ${loaiPhieu.toLowerCase()}` : "Tạo phiếu"}
            </span>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}><X size={18} color={MUTED} /></button>
          </div>

          <div style={{ padding: "16px 20px", overflowY: "auto" }}>
            <div style={{ background: "#f8fafc", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "12px 16px", marginBottom: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Mã vụ án: </span><b>VA26-00321</b></span>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Tên vụ án: </span>Vụ án Phan Văn Thành – bức cung</span>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Tên bị can đầu vụ: </span>Phan Văn Thành</span>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Tội danh chính: </span>Bức cung</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#0f766e" }}><span style={{ color: MUTED }}>Số BA/QĐ: </span><b>050526_CTH02</b></span>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#0f766e" }}><span style={{ color: MUTED }}>Ngày ra BA/QĐ: </span>05/05/2026</span>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#0f766e" }}><span style={{ color: MUTED }}>Tòa xét xử: </span>Tòa án nhân dân tỉnh Hải Phòng</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#0f766e" }}><span style={{ color: MUTED }}>Giai đoạn: </span>Giám đốc thẩm, tái thẩm</span>
                  <span style={{ fontSize: 11, fontFamily: F, color: "#0f766e" }}><span style={{ color: MUTED }}>Tòa án giải quyết: </span>Tòa án nhân dân tối cao</span>
                  <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Trạng thái: </span><span style={{ color: "#0f766e", fontWeight: 600 }}>Chưa có kết quả giải quyết đơn</span></span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ color: RED, fontSize: 14 }}>⊟</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Loại phiếu</span>
              </div>
              <div style={{ maxWidth: 300 }}>
                {lbl("Loại phiếu", true)}
                <select value={loaiPhieu} onChange={e => setLoaiPhieu(e.target.value)} style={selSt}>
                  <option value="">Chọn loại phiếu</option>
                  <option value="Phiếu mượn">Phiếu mượn</option>
                  <option value="Phiếu trả">Phiếu trả</option>
                  <option value="Phiếu chuyển">Phiếu chuyển</option>
                  <option value="Nhận hồ sơ">Nhận hồ sơ</option>
                  <option value="Công văn XM, BS">Công văn xác minh, bổ sung</option>
                  <option value="Công văn khác">Công văn khác</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <span style={{ color: RED, fontSize: 14 }}>⊟</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin quyết định</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px 14px", marginBottom: 10 }}>
                <div>
                  {lbl("Ngày lập phiếu", true)}
                  <input placeholder="Chọn ngày quyết định" style={inSt} />
                </div>
                <div>
                  {lbl("Số phiếu")}
                  <input value={soPhieu} onChange={e => setSoPhieu(e.target.value)} placeholder="Nhập số quyết định" style={inSt} />
                </div>
                <div>
                  {lbl("Người ký ban hành", true)}
                  <select style={selSt}><option value="">Chọn người ký</option><option>Nguyễn Văn A</option></select>
                </div>
                {loaiPhieu !== "Công văn XM, BS" && loaiPhieu !== "Công văn khác" && (
                  <div>
                    {lbl("Số bút lục")}
                    <input placeholder="Nhập số bút lục" style={inSt} />
                  </div>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px 14px", marginBottom: 10 }}>
                <div>
                  {lbl("Đơn vị giữ hồ sơ", true)}
                  <select style={selSt}><option value="">Chọn Đơn vị giữ hồ sơ</option><option>VKSNDTC</option></select>
                </div>
                <div>
                  {lbl("Tên đơn vị")}
                  <input placeholder="Nhập tên đơn vị" style={inSt} />
                </div>
                <div>
                  {lbl("Cán bộ", true)}
                  <select style={selSt}><option value="">Chọn cán bộ</option><option>Lý Thái Phúc</option></select>
                </div>
                <div>
                  {lbl("Tên cán bộ", true)}
                  <input placeholder="Nhập tên cán bộ" style={inSt} />
                </div>
              </div>
              <div>
                {lbl(loaiPhieu === "Công văn xác minh" ? "Nội dung" : "Ghi chú")}
                <textarea value={ghiChu} onChange={e => setGhiChu(e.target.value)} placeholder="Nhập ghi chú"
                  style={{ ...inSt, minHeight: 56, resize: "vertical" }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>
                  <span style={{ color: RED }}>* </span>Nơi nhận
                </span>
                <button
                  onClick={() => setAddingRow(true)}
                  style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
                  Thêm nơi nhận
                </button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: 40 }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "32%" }} />
                  <col style={{ width: 110 }} />
                </colgroup>
                <thead>
                  <tr>
                    {["STT", "NƠI NHẬN", "NƠI NHẬN CHI TIẾT", "GHI CHÚ", "THAO TÁC"].map(h => (
                      <th key={h} style={TH_STYLE}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {noiNhanRows.map((r, idx) => (
                    <tr key={r.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.id}</td>
                      <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.noiNhan}</td>
                      <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.chiTiet}</td>
                      <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.ghiChu}</td>
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#2563eb", fontFamily: F }}>✏ Sửa</button>
                          <button onClick={() => setNoiNhanRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#ef4444", fontFamily: F }}>🗑 Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {addingRow && (
                    <tr style={{ background: "#f0f9ff" }}>
                      <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{noiNhanRows.length + 1}</td>
                      <td style={TD_STYLE}>
                        <select value={newRow.noiNhan} onChange={e => setNewRow(p => ({ ...p, noiNhan: e.target.value }))} style={{ ...selSt, fontSize: 11 }}>
                          <option value="">Chọn nơi nhận</option>
                          <option>Viện kiểm sát</option>
                          <option>Tòa án</option>
                          <option>Cơ quan điều tra</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <select value={newRow.chiTiet} onChange={e => setNewRow(p => ({ ...p, chiTiet: e.target.value }))} style={{ ...selSt, fontSize: 11 }}>
                          <option value="">Chọn</option>
                          <option>VKSNDTC</option>
                          <option>VKSND cấp cao</option>
                        </select>
                      </td>
                      <td style={TD_STYLE}>
                        <input value={newRow.ghiChu} onChange={e => setNewRow(p => ({ ...p, ghiChu: e.target.value }))} placeholder="Nhập ghi chú" style={{ ...inSt, fontSize: 11 }} />
                      </td>
                      <td style={{ ...TD_STYLE, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                          <button onClick={() => { if (newRow.noiNhan) { setNoiNhanRows(p => [...p, { id: Date.now(), ...newRow, editing: false }]); setNewRow({ noiNhan: "", chiTiet: "", ghiChu: "" }); setAddingRow(false); } }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#0f766e", fontFamily: F, fontWeight: 600 }}>Lưu</button>
                          <button onClick={() => { setAddingRow(false); setNewRow({ noiNhan: "", chiTiet: "", ghiChu: "" }); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: MUTED, fontFamily: F }}>Hủy</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div onClick={() => setDinhKem(v => !v)} style={{ width: 36, height: 20, borderRadius: 10, background: diinhKem ? "#0f766e" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 2, left: diinhKem ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </div>
              <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>Đính kèm tài liệu, hồ sơ</span>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 4, borderTop: `1px solid ${BORDER}` }}>
              <button onClick={onClose} style={{ padding: "7px 20px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
              <button style={{ padding: "7px 20px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Lưu</button>
              <button onClick={handleToggleLaySo} style={{ padding: "7px 20px", background: daLaySo ? "#fef2f2" : "#fff", color: daLaySo ? "#dc2626" : "#374151", border: `1px solid ${daLaySo ? "#fca5a5" : BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
                {daLaySo ? "✕ Hủy cấp số" : "Lấy số"}
              </button>
              <button style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Trình ký</button>
              <button onClick={() => setShowBieuMau(true)} style={{ padding: "7px 20px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Xem biểu mẫu</button>
            </div>
          </div>
        </div>
      </div>
      {showBieuMau && <XemBieuMauScreen loaiPhieu={loaiPhieu} onClose={() => setShowBieuMau(false)} />}
    </>
  );
}

function TabMuonTraHoSo({ detail }: { detail: VuAnDetailData }) {
  const [showModal, setShowModal] = useState(false);
  const muonTraHoSo = detail?.muonTraHoSo || [];
  return (
    <div style={{ padding: 20 }}>
      {showModal && <TaoPhieuModal onClose={() => setShowModal(false)} />}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: F }}>Tổng số phiếu: {muonTraHoSo.length}</span>
          <div style={{ flex: 1 }} />
          <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            + Tạo phiếu
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <Printer size={13} /> In danh sách
          </button>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
            <RefreshCw size={12} color={MUTED} />
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 40 }} /><col style={{ width: "9%" }} /><col style={{ width: "7%" }} />
            <col style={{ width: "7%" }} /><col style={{ width: "9%" }} /><col style={{ width: "8%" }} />
            <col style={{ width: "13%" }} /><col style={{ width: "16%" }} /><col style={{ width: "14%" }} />
            <col style={{ width: "8%" }} /><col style={{ width: 56 }} />
          </colgroup>
          <thead>
            <tr>
              {["STT", "Loại phiếu", "Số phiếu", "Số bút lục", "Ngày ghi trên phiếu", "Ngày tạo", "Cán bộ", "Đơn vị giữ/chuyển hồ sơ", "Người ký duyệt", "Ghi chú", "Thao tác"].map((h) => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {muonTraHoSo.length === 0 && (
              <tr><td colSpan={11} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>Không có dữ liệu</td></tr>
            )}
            {muonTraHoSo.map((r, idx) => (
              <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.loaiPhieu}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: MUTED, textAlign: "center" }}>{r.soPhieu}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: MUTED, textAlign: "center" }}>{r.soBuLuc}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: MUTED, textAlign: "center" }}>{r.ngayGhiPhieu}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, textAlign: "center" }}>{r.ngayTao}</td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>{r.canBo}</span>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{r.chucVu}</span>
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.donVi}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>{r.nguoiKyDuyet}</span>
                    <Badge color="#92400e" bg="#fef3c7">{r.trangThaiKy}</Badge>
                  </div>
                </td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.ghiChu}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Sửa"><Eye size={13} color={MUTED} /></button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="In"><Printer size={13} color={MUTED} /></button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xóa"><X size={13} color="#ef4444" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabPhanCong({ detail }: { detail: VuAnDetailData }) {
  const thamPhanRows = [
    { stt: 3, giaiDoan: "Giải quyết đơn", hoTen: "Hoàng Ngọc Chiêu", chucDanh: "TPTC", ngayPC: "21/07/2026", nguoiTT: "Nguyễn Văn Hiển – Phó CA", thoiGianTT: "14:30 – 21/07/2026", ghiChu: "Phân công lại do TPB3 đề xuất kháng nghị" },
    { stt: 2, giaiDoan: "Giải quyết đơn", hoTen: "Hoàng Ngọc Ngã", chucDanh: "TPB3", ngayPC: "01/07/2026", nguoiTT: "Nguyễn Văn Hòa – Phó CA", thoiGianTT: "14:30 – 01/07/2026", ghiChu: "TP về hưu" },
    { stt: 1, giaiDoan: "Giải quyết đơn", hoTen: "Hoàng Ngọc Hoa", chucDanh: "TPB3", ngayPC: "21/06/2026", nguoiTT: "Nguyễn Văn Hiển – Trưởng phòng VP HCTP", thoiGianTT: "14:30 – 21/06/2026", ghiChu: "–" },
  ];

  const ttvRows = [
    { stt: 3, giaiDoan: "Giải quyết đơn", hoTenTTV: "Hoàng Ngọc Chiêu", chucDanhTTV: "Thẩm tra viên", ngayPCTTV: "21/07/2026", hoTenLD: "Nguyễn Văn Hiển", chucVuLD: "Phó Vụ trưởng", ngayPCLD: "21/07/2026" },
    { stt: 2, giaiDoan: "Giải quyết đơn", hoTenTTV: "Hoàng Ngọc Ngã", chucDanhTTV: "Thẩm tra viên", ngayPCTTV: "01/07/2026", hoTenLD: "Nguyễn Văn Hòa", chucVuLD: "Phó Vụ trưởng", ngayPCLD: "01/07/2026" },
    { stt: 1, giaiDoan: "Giải quyết đơn", hoTenTTV: "Hoàng Ngọc Hoa", chucDanhTTV: "Thẩm tra viên", ngayPCTTV: "21/06/2026", hoTenLD: "Nguyễn Văn Hiển", chucVuLD: "Phó Vụ trưởng", ngayPCLD: "21/06/2026" },
  ];

  const sectionHdr = (title: string) => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>{title}</span>
      <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
        <RefreshCw size={13} color={MUTED} />
      </button>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <ThongTinChungVuAnCard detail={detail} />
      <div style={{ marginBottom: 24 }}>
        {sectionHdr("Lịch sử phân công Thẩm phán")}
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "26%" }} />
            </colgroup>
            <thead>
              <tr>
                {["STT", "GIAI ĐOẠN", "HỌ VÀ TÊN THẨM PHÁN", "CHỨC DANH", "NGÀY PHÂN CÔNG", "NGƯỜI THAO TÁC", "GHI CHÚ"].map(h => (
                  <th key={h} style={TH_STYLE}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {thamPhanRows.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.giaiDoan}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, fontWeight: 600, color: TEXT }}>{r.hoTen}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, textAlign: "center" }}>
                    <Badge color="#1e40af" bg="#dbeafe">{r.chucDanh}</Badge>
                  </td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayPC}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>
                    <div>{r.nguoiTT}</div>
                    <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{r.thoiGianTT}</div>
                  </td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: MUTED }}>{r.ghiChu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        {sectionHdr("Lịch sử phân công TTV và LĐV")}
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>
            <thead>
              <tr>
                {["STT", "GIAI ĐOẠN", "HỌ VÀ TÊN TTV", "CHỨC DANH TTV", "NGÀY PHÂN CÔNG TTV", "HỌ VÀ TÊN LĐ", "TÊN CHỨC VỤ LĐ", "NGÀY PHÂN CÔNG LĐ"].map(h => (
                  <th key={h} style={TH_STYLE}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ttvRows.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.giaiDoan}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, fontWeight: 600, color: TEXT }}>{r.hoTenTTV}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.chucDanhTTV}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayPCTTV}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.hoTenLD}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>{r.chucVuLD}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, textAlign: "center" }}>{r.ngayPCLD}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function XemBieuMauToTrinhVuAnModal({
  onClose,
  detail,
  soToTrinh,
  ngayLap,
  loaiToTrinh,
  daKySo,
}: {
  onClose: () => void;
  detail?: VuAnDetailData;
  soToTrinh?: string;
  ngayLap?: string;
  loaiToTrinh?: string;
  daKySo?: boolean;
}) {
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState("13.5pt");
  const [fontFamily, setFontFamily] = useState("Times New Roman");

  const getDoiTuongText = () => {
    const loai = ((detail?.loaiAn || (detail as any)?.linhVuc || (detail as any)?.tenVuAn || detail?.maVuAn || "") + "").toLowerCase();
    if (loai.includes("hành chính") || loai.includes("hc")) {
      const nkk = (detail as any)?.nguoiKhoiKien || (detail as any)?.nkk || (detail as any)?.ndkn || "Nguyễn Văn A";
      const nbk = (detail as any)?.nguoiBiKien || (detail as any)?.nbk || (detail as any)?.ndd || "Ủy ban nhân dân tỉnh X";
      return `Người khởi kiện (NKK): ${nkk} – Người bị kiện (NBK): ${nbk}`;
    } else if (loai.includes("dân sự") || loai.includes("ds") || loai.includes("hôn nhân") || loai.includes("lao động") || loai.includes("kinh doanh") || loai.includes("kdtm")) {
      const nguyenDon = (detail as any)?.nguyenDon || (detail as any)?.ndkn || "Trần Thị B";
      const biDon = (detail as any)?.biDon || (detail as any)?.ndd || "Nguyễn Văn C";
      return `Nguyên đơn: ${nguyenDon} – Bị đơn: ${biDon}`;
    } else if (loai.includes("khiếu nại") || loai.includes("kn")) {
      const nkn = (detail as any)?.nguoiKhieuNai || (detail as any)?.nkn || (detail as any)?.ndkn || "Lê Văn D";
      const nbkn = (detail as any)?.nguoiBiKhieuNai || "Tòa án nhân dân cấp cao";
      return `Người khiếu nại: ${nkn} – Người bị khiếu nại: ${nbkn}`;
    } else {
      const biCan = (detail as any)?.tenBiCan || (detail as any)?.biCan || (detail as any)?.biCao || (detail as any)?.ndd || "Phan Văn Thành";
      return `Bị can/Bị cáo: ${biCan}`;
    }
  };

  const execCmd = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
  };

  const tbBtnSt: React.CSSProperties = {
    padding: "4px 8px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT, display: "inline-flex", alignItems: "center", gap: 4,
  };

  const selectSt: React.CSSProperties = {
    padding: "4px 6px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 12, fontFamily: F, background: "#fff", cursor: "pointer",
  };

  const sepSt: React.CSSProperties = {
    width: 1, height: 18, background: BORDER, margin: "0 2px",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#f1f5f9", zIndex: 3500, display: "flex", flexDirection: "column", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: F }}>
      <div style={{ background: "#2b579a", color: "#fff", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            ← Quay lại
          </button>
          <FileText size={20} color="#fff" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, fontFamily: F, display: "flex", alignItems: "center", gap: 8 }}>
              <span>Tờ trình thẩm tra vụ án đề xuất kháng nghị Giám đốc thẩm.docx</span>
              <span style={{ fontSize: 11, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>Chế độ chỉnh sửa Word trực tiếp</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => alert("Đã lưu nội dung Tờ trình Word thành công!")} style={{ padding: "7px 20px", background: "#15803d", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
            💾 Lưu thay đổi
          </button>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}>
            <X size={22} />
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, flexWrap: "wrap", fontSize: 12, fontFamily: F }}>
        <button onClick={() => execCmd("undo")} style={tbBtnSt} title="Hoàn tác">↩ Hoàn tác</button>
        <button onClick={() => execCmd("redo")} style={tbBtnSt} title="Làm lại">↪ Làm lại</button>
        <div style={sepSt} />

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
          <option value="16pt">16 pt</option>
        </select>
        <div style={sepSt} />

        <button onClick={() => execCmd("bold")} style={tbBtnSt} title="In đậm"><b>B</b></button>
        <button onClick={() => execCmd("italic")} style={tbBtnSt} title="In nghiêng"><i>I</i></button>
        <button onClick={() => execCmd("underline")} style={tbBtnSt} title="Gạch chân"><u>U</u></button>
        <div style={sepSt} />

        <button onClick={() => execCmd("justifyLeft")} style={tbBtnSt} title="Căn trái">⬅</button>
        <button onClick={() => execCmd("justifyCenter")} style={tbBtnSt} title="Căn giữa">↔</button>
        <button onClick={() => execCmd("justifyRight")} style={tbBtnSt} title="Căn phải">➡</button>
        <button onClick={() => execCmd("justifyFull")} style={tbBtnSt} title="Căn đều">☰</button>
        <div style={sepSt} />

        <button onClick={() => window.print()} style={tbBtnSt}><Printer size={13} /> In</button>
        <button onClick={() => alert("Đang tải file Word (.docx) về máy...")} style={{ ...tbBtnSt, background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0", fontWeight: 600 }}>
          <Download size={13} /> Tải file Word
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", fontSize: 12, color: MUTED }}>
          <span>Thu phóng:</span>
          <button onClick={() => setZoom(z => Math.max(60, z - 10))} style={tbBtnSt}>-</button>
          <span style={{ fontWeight: 600, color: TEXT, minWidth: 36, textAlign: "center" }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={tbBtnSt}>+</button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "30px 20px 60px 20px", display: "flex", justifyContent: "center", background: "#cbd5e1" }}>
        <div
          contentEditable
          suppressContentEditableWarning
          style={{
            width: 794, minHeight: 1123, background: "#fff", boxShadow: "0 6px 30px rgba(0,0,0,0.22)",
            padding: "54px 64px", boxSizing: "border-box", transform: `scale(${zoom / 100})`, transformOrigin: "top center",
            fontFamily: fontFamily, color: "#000", lineHeight: 1.6, fontSize: fontSize, outline: "none", cursor: "text",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, fontFamily: fontFamily }}>
            <tbody>
              <tr>
                <td style={{ width: "45%", textAlign: "center", verticalAlign: "top" }}>
                  <div style={{ fontWeight: "bold", fontSize: "12pt" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                  <div style={{ fontWeight: "bold", fontSize: "12pt" }}>VỤ GIÁM ĐỐC, KIỂM TRA I</div>
                  <div style={{ fontSize: "12pt", marginTop: 4 }}>
                    Số: {soToTrinh || "...... /TTr-TANDTC-V1"}
                  </div>
                </td>
                <td style={{ width: "55%", textAlign: "center", verticalAlign: "top" }}>
                  <div style={{ fontWeight: "bold", fontSize: "12pt" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: "bold", fontSize: "12.5pt", textDecoration: "underline" }}>Độc lập – Tự do – Hạnh phúc</div>
                  <div style={{ fontSize: "12pt", fontStyle: "italic", marginTop: 4 }}>
                    Hà Nội, ngày {ngayLap ? ngayLap.split("/")[0] || "..." : "..."} tháng {ngayLap ? ngayLap.split("/")[1] || "..." : "..."} năm 2026
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ textAlign: "center", margin: "24px 0 14px" }}>
            <div style={{ fontSize: "15pt", fontWeight: "bold", textTransform: "uppercase" }}>
              {isKhieuNai ? "TỜ TRÌNH THẨM TRA VỤ VIỆC KHIẾU NẠI" : "TỜ TRÌNH THẨM TRA VỤ ÁN"}
            </div>
            <div style={{ fontSize: "13pt", fontWeight: "bold", marginTop: 4 }}>
              {isKhieuNai
                ? `Về việc giải quyết đơn khiếu nại của đương sự đối với ${detail?.tenVuAn || "Vụ việc"}`
                : `Về việc giải quyết đơn đề nghị giám đốc thẩm đối với ${detail?.tenVuAn || "Vụ án"}`}
            </div>
            <div style={{ fontSize: "12pt", fontStyle: "italic", marginTop: 2, color: "#374151" }}>
              ({getDoiTuongText()})
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: "13pt", fontWeight: "bold", marginBottom: 20 }}>
            Kính gửi: Đồng chí Phó Chánh án Tòa án nhân dân tối cao
          </div>

          <div style={{ textAlign: "justify", lineHeight: 1.65 }}>
            <p style={{ fontWeight: "bold", margin: "10px 0 4px" }}>
              {isKhieuNai ? "I. TÓM TẮT NỘI DUNG ĐƠN KHIẾU NẠI VÀ QUÁ TRÌNH XỬ LÝ:" : "I. TÓM TẮT NỘI DUNG VỤ ÁN VÀ QUÁ TRÌNH TỐ TỤNG:"}
            </p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>- <b>Đương sự / Đối tượng trong vụ việc:</b> {getDoiTuongText()}</p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>
              {isKhieuNai
                ? "- Thụ lý đơn khiếu nại của đương sự đối với quyết định/hành vi tố tụng của Tòa án nhân dân cấp dưới."
                : "- Thụ lý đơn đề nghị giám đốc thẩm số 09D732899 của đương sự đối với Bản án phúc thẩm số 89/2026/PT của Tòa án nhân dân cấp cao."}
            </p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>
              {isKhieuNai
                ? "- Tóm tắt nội dung khiếu nại và các tài liệu, chứng cứ có liên quan do người khiếu nại cung cấp."
                : "- Tóm tắt hành vi phạm tội và các chứng cứ đã được thu thập trong quá trình điều tra, truy tố, xét xử sơ thẩm và phúc thẩm."}
            </p>

            <p style={{ fontWeight: "bold", margin: "14px 0 4px" }}>II. QUAN ĐIỂM THẨM TRA CỦA THẨM TRA VIÊN:</p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>Qua nghiên cứu toàn diện hồ sơ và các tài liệu chứng cứ có liên quan, Thẩm tra viên nhận thấy:</p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>
              {isKhieuNai
                ? "1. Căn cứ quy định của pháp luật về khiếu nại trong hoạt động tố tụng, việc khiếu nại của đương sự là có cơ sở xem xét."
                : "1. Tòa án cấp sơ thẩm và phúc thẩm có vi phạm nghiêm trọng thủ tục tố tụng trong việc đánh giá chứng cứ và không triệu tập đầy đủ người có quyền lợi, nghĩa vụ liên quan."}
            </p>
            <p style={{ margin: "4px 0", textIndent: "1cm" }}>
              {isKhieuNai
                ? "2. Các tài liệu xác minh cho thấy nội dung yêu cầu khiếu nại phù hợp với các quy định pháp luật hiện hành."
                : "2. Kết luận trong bản án không phù hợp với những tình tiết khách quan của vụ án, gây thiệt hại nghiêm trọng đến quyền và lợi ích hợp pháp của đương sự."}
            </p>

            <p style={{ fontWeight: "bold", margin: "14px 0 4px" }}>III. KIẾN NGHỊ VÀ ĐỀ XUẤT XỬ LÝ:</p>
            {isKhieuNai ? (
              <>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>Căn cứ Luật Khiếu nại và các quy định pháp luật về tố tụng, kính trình Đồng chí Lãnh đạo xem xét:</p>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>- <b>Phương án đề xuất:</b> Chấp nhận khiếu nại của đương sự.</p>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>- Ban hành quyết định giải quyết khiếu nại theo đúng trình tự thủ tục quy định của pháp luật.</p>
              </>
            ) : (
              <>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>Căn cứ Điều 371 và Điều 373 Bộ luật Tố tụng hình sự năm 2015, kính trình Đồng chí Phó Chánh án Tòa án nhân dân tối cao xem xét:</p>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>- <b>Ban hành Quyết định kháng nghị giám đốc thẩm</b> đối với Bản án hình sự phúc thẩm số 89/2026/HS-PT.</p>
                <p style={{ margin: "4px 0", textIndent: "1cm" }}>- Đề nghị Hội đồng Thẩm phán Tòa án nhân dân tối cao xét xử hủy bản án phúc thẩm để điều tra, xét xử lại theo đúng quy định của pháp luật.</p>
              </>
            )}

            <p style={{ fontStyle: "italic", margin: "14px 0 24px" }}>
              (Đính kèm: Dự thảo văn bản giải quyết và toàn bộ tài liệu hồ sơ có liên quan).
            </p>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24, fontFamily: fontFamily }}>
            <tbody>
              <tr>
                <td style={{ width: "50%", textAlign: "center", verticalAlign: "top", fontSize: "12pt" }}>
                  <div style={{ fontWeight: "bold" }}>Ý KIẾN CỦA THẨM PHÁN</div>
                  <div style={{ height: 70 }} />
                  <div style={{ fontWeight: "bold" }}>{detail?.thamPhan || "Nguyễn Biên Thuỳ"}</div>
                </td>
                <td style={{ width: "50%", textAlign: "center", verticalAlign: "top", fontSize: "12pt" }}>
                  <div style={{ fontWeight: "bold" }}>THẨM TRA VIÊN BÁO CÁO</div>
                  <div style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {daKySo && (
                      <div style={{ border: "2px solid #dc2626", color: "#dc2626", padding: "3px 10px", borderRadius: 4, fontSize: "10pt", fontWeight: "bold", transform: "rotate(-5deg)" }}>
                        ✓ KÝ SỐ: Lý Thái Phúc
                      </div>
                    )}
                  </div>
                  <div style={{ fontWeight: "bold" }}>{detail?.thamTraVien || "Lý Thái Phúc"}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Modal Chọn đơn cần xử lý (Popup từ nút Thêm đơn xử lý) ───────────────────
function ModalChonDonCanXuLy({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (selectedList: any[]) => void;
}) {
  const [tuKhoa, setTuKhoa] = useState("");
  const [ngayNhan, setNgayNhan] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([1]);

  const sampleDonList = [
    {
      id: 1,
      stt: 1,
      maDon: "4393",
      thongTinGQ: "Thụ lý mới",
      soNgayGQ: "Số 10 - 22/05/2026",
      ngayNhanDon: "22/05/2026",
      nguoiDungDon: "Hoàng Anh",
      phanLoai: "Đơn đề nghị GĐT, TT",
      loaiDonSub: "Đơn chính",
      trangThaiTrinh: "-",
      ketQua: "Chưa có kết quả",
    },
    {
      id: 2,
      stt: 2,
      maDon: "4395",
      thongTinGQ: "Đã thụ lý",
      soNgayGQ: "",
      ngayNhanDon: "23/05/2026",
      nguoiDungDon: "Trần Văn Bình",
      phanLoai: "Đơn đề nghị GĐT, TT",
      loaiDonSub: "",
      trangThaiTrinh: "Tờ trình số 2",
      ketQua: "Nghiên cứu, xác minh, bổ sung",
    },
    {
      id: 3,
      stt: 3,
      maDon: "4395",
      thongTinGQ: "Thụ lý trùng TP",
      soNgayGQ: "Số 12 - 23/05/2026",
      ngayNhanDon: "23/05/2026",
      nguoiDungDon: "Trần Văn Bình",
      phanLoai: "Đơn đề nghị GĐT, TT",
      loaiDonSub: "",
      trangThaiTrinh: "Tờ trình số 2",
      ketQua: "Nghiên cứu, xác minh, bổ sung",
    },
    {
      id: 4,
      stt: 4,
      maDon: "4395",
      thongTinGQ: "Thụ lý trùng TP",
      soNgayGQ: "Số 12 - 23/05/2026",
      ngayNhanDon: "23/05/2026",
      nguoiDungDon: "Trần Văn Bình",
      phanLoai: "Đơn đề nghị GĐT, TT",
      loaiDonSub: "",
      trangThaiTrinh: "Tờ trình số 1",
      ketQua: "Chưa có kết quả",
    },
  ];

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(sampleDonList.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleConfirm = () => {
    const selectedList = sampleDonList.filter(item => selectedIds.includes(item.id));
    if (selectedList.length === 0) {
      alert("Vui lòng chọn ít nhất 1 đơn cần xử lý!");
      return;
    }
    onSelect(selectedList);
  };

  const filteredList = sampleDonList.filter(item => {
    const kw = tuKhoa.toLowerCase().trim();
    if (!kw) return true;
    return (
      item.maDon.toLowerCase().includes(kw) ||
      item.nguoiDungDon.toLowerCase().includes(kw)
    );
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1600, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 8, width: "100%", maxWidth: 960, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 12px 40px rgba(0,0,0,0.25)", overflow: "hidden" }}>

        {/* Header Bar */}
        <div style={{ background: "#800000", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: F }}>
            Chọn đơn cần xử lý
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 2, display: "flex", alignItems: "center" }}>
            <X size={18} />
          </button>
        </div>

        {/* Filter Section */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "flex-end", gap: 14, background: "#fff", flexShrink: 0 }}>
          <div style={{ flex: 1, maxWidth: 260 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}>Từ khóa</label>
            <input
              type="text"
              value={tuKhoa}
              onChange={e => setTuKhoa(e.target.value)}
              placeholder="Nhập mã đơn, người đứng đơn"
              style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box", outline: "none" }}
            />
          </div>

          <div style={{ flex: 1, maxWidth: 200 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}>Ngày nhận đơn</label>
            <input
              type="text"
              value={ngayNhan}
              onChange={e => setNgayNhan(e.target.value)}
              placeholder="DD/MM/YYYY"
              style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box", outline: "none" }}
            />
          </div>

          <button
            type="button"
            style={{ padding: "7px 18px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
          >
            Tìm kiếm
          </button>

          <button
            type="button"
            onClick={() => { setTuKhoa(""); setNgayNhan(""); }}
            style={{ padding: "7px 18px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 500 }}
          >
            Làm mới
          </button>
        </div>

        {/* List Header Info */}
        <div style={{ padding: "12px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F }}>
            Danh sách đơn
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#800000", fontFamily: F }}>
            Đã chọn: {selectedIds.length} đơn
          </span>
        </div>

        {/* Main Table */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F, tableLayout: "fixed" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                <th style={{ ...TH_STYLE, width: 36, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredList.length}
                    onChange={e => handleToggleSelectAll(e.target.checked)}
                    style={{ cursor: "pointer" }}
                  />
                </th>
                <th style={{ ...TH_STYLE, width: 42, textAlign: "center" }}>STT</th>
                <th style={{ ...TH_STYLE, width: 90 }}>Mã đơn</th>
                <th style={{ ...TH_STYLE, width: 170 }}>Thông tin giải quyết đơn</th>
                <th style={{ ...TH_STYLE, width: 120 }}>Ngày nhận đơn</th>
                <th style={{ ...TH_STYLE, width: 130 }}>Người đứng đơn</th>
                <th style={{ ...TH_STYLE, width: 150 }}>Phân loại</th>
                <th style={{ ...TH_STYLE, width: 130 }}>Trạng thái trình gần nhất</th>
                <th style={{ ...TH_STYLE, width: 140 }}>Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((row) => {
                const isChecked = selectedIds.includes(row.id);
                return (
                  <tr key={row.id} style={{ background: isChecked ? "#fff8f8" : "#fff", borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSelect(row.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                    <td style={{ ...TD_STYLE, textAlign: "center", color: "#6b7280" }}>{row.stt}</td>
                    <td style={{ ...TD_STYLE, fontWeight: 700, color: "#111827" }}>{row.maDon}</td>
                    <td style={{ ...TD_STYLE }}>
                      <div style={{ color: "#111827" }}>{row.thongTinGQ}</div>
                      {row.soNgayGQ && <div style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>{row.soNgayGQ}</div>}
                    </td>
                    <td style={{ ...TD_STYLE, color: "#111827" }}>{row.ngayNhanDon}</td>
                    <td style={{ ...TD_STYLE, color: "#111827" }}>{row.nguoiDungDon}</td>
                    <td style={{ ...TD_STYLE }}>
                      <div style={{ color: "#111827" }}>{row.phanLoai}</div>
                      {row.loaiDonSub && (
                        <div style={{ color: "#2563eb", fontWeight: 700, fontSize: 11, marginTop: 2 }}>
                          {row.loaiDonSub}
                        </div>
                      )}
                    </td>
                    <td style={{ ...TD_STYLE, fontStyle: row.trangThaiTrinh !== "-" ? "italic" : "normal", fontWeight: row.trangThaiTrinh !== "-" ? 700 : 400, color: "#111827" }}>
                      {row.trangThaiTrinh}
                    </td>
                    <td style={{ ...TD_STYLE, fontStyle: "italic", color: "#6b7280" }}>
                      {row.ketQua}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Bar */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: "#6b7280", fontFamily: F }}>
            1-3 trong 10 đơn
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button style={{ width: 26, height: 26, background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>1</button>
              <button style={{ width: 26, height: 26, background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>›</button>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: "7px 20px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 500 }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                style={{ padding: "7px 24px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
              >
                Chọn đơn xử lý
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Modal Áp dụng ý kiến cho đơn khác (Popup từ nút ◇ / sao chép ý kiến) ───────
function ModalApDungYKienChoDonKhac({
  onClose,
  onApply,
}: {
  onClose: () => void;
  onApply: (selectedIds: number[]) => void;
}) {
  const sampleTargetList = [
    {
      id: 101,
      code: "DH23648",
      name: "Phạm Minh Tuấn",
      sub: "TLM: 24 - 20/05/2026",
    },
    {
      id: 102,
      code: "DH43902",
      name: "Phạm Minh Tuấn",
      sub: "TLMTTP: 25 - 22/05/2026",
    },
  ];

  const [selectedIds, setSelectedIds] = useState<number[]>([101]);

  const handleToggle = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirmApply = () => {
    onApply(selectedIds);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1700, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 8, width: "100%", maxWidth: 520, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", overflow: "hidden" }}>
        {/* Header Bar */}
        <div style={{ background: "#800000", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: F }}>
            Áp dụng ý kiến cho đơn khác
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 2, display: "flex", alignItems: "center" }}>
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "28px 24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
          {sampleTargetList.map(item => {
            const isChecked = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id)}
                style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer", userSelect: "none" }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    border: isChecked ? "none" : "1.5px solid #94a3b8",
                    background: isChecked ? "#800000" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  {isChecked && "✓"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", fontFamily: F }}>
                    {item.code} - {item.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 3, fontFamily: F }}>
                    {item.sub}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12 }}>
            <button
              type="button"
              onClick={handleConfirmApply}
              style={{ background: "#800000", color: "#fff", border: "none", borderRadius: 6, padding: "8px 36px", fontSize: 14, fontWeight: 700, fontFamily: F, cursor: "pointer" }}
            >
              Áp dụng
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ background: "#800000", color: "#fff", border: "none", borderRadius: 6, padding: "8px 36px", fontSize: 14, fontWeight: 700, fontFamily: F, cursor: "pointer" }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaoToTrinhModal({
  onClose,
  onSave,
  detail,
  userRole,
}: {
  onClose: () => void;
  onSave?: (data: { daDinhKemHoSo: boolean; countHoSo: number; soTT: string }) => void;
  onKySo?: () => void;
  detail?: VuAnDetailData;
  userRole?: UserRoleType;
}) {
  const isVu234Role = isVu234(userRole, detail?.loaiAn);
  const isKhieuNai =
    detail?.isKhieuNai ||
    detail?.entityWord === "Khiếu nại" ||
    detail?.moduleLabel === "Quản lý khiếu nại" ||
    (typeof detail?.maVuAn === "string" && (detail.maVuAn.startsWith("KN") || detail.maVuAn.includes("KN"))) ||
    (typeof detail?.id === "string" && detail.id.includes("KN")) ||
    (typeof detail?.tenVuAn === "string" && detail.tenVuAn.toLowerCase().includes("khiếu nại"));

  const [ngayLap, setNgayLap] = useState("09/08/2026");
  const [tomTatNoiDung, setTomTatNoiDung] = useState("");
  const [dienBienQuaTrinh, setDienBienQuaTrinh] = useState("");

  const [donXuLyList, setDonXuLyList] = useState([
    {
      id: 1,
      nguoiGui: (detail as any)?.nkn || (detail as any)?.nguoiKhieuNai || "Trần Văn Hùng",
      tlm: "TLM: 10 – 22/05/2026",
      deXuat: isKhieuNai ? "Chấp nhận khiếu nại" : "Kháng nghị",
      noiDung: isKhieuNai
        ? "Đề xuất Lãnh đạo Vụ xem xét, trình Chánh án TANDTC chấp nhận nội dung khiếu nại của đương sự, ban hành quyết định giải quyết khiếu nại theo quy định."
        : "Đồng ý. Giao TTV hoàn thiện dự thảo văn bản trả lời đơn gửi Lãnh đạo Vụ xem xét, trình Chánh án TANDTC.",
    },
  ]);

  const [showBieuMau, setShowBieuMau] = useState(false);
  const [showChonDonXuLyModal, setShowChonDonXuLyModal] = useState(false);
  const [showApDungYKienModal, setShowApDungYKienModal] = useState(false);
  const [activeDonForCopy, setActiveDonForCopy] = useState<any>(null);

  const handleSelectDonFromModal = (selectedList: any[]) => {
    const newItems = selectedList.map((don, i) => ({
      id: Date.now() + i + Math.random(),
      nguoiGui: `${don.nguoiDungDon} (Đương sự)`,
      tlm: `Mã đơn: ${don.maDon} - ${don.ngayNhanDon}`,
      deXuat: isKhieuNai ? "Chấp nhận khiếu nại" : "Kháng nghị",
      noiDung: isKhieuNai
        ? "Đề xuất chấp nhận khiếu nại của đương sự."
        : "Đồng ý. Giao TTV hoàn thiện dự thảo văn bản gửi Lãnh đạo Vụ xem xét, trình Chánh án TANDTC.",
    }));
    setDonXuLyList(prev => [...prev, ...newItems]);
    setShowChonDonXuLyModal(false);
  };

  const handleApplyYKien = (targetIds: number[]) => {
    if (activeDonForCopy) {
      setDonXuLyList(prev =>
        prev.map(d => {
          if (targetIds.includes(d.id) || targetIds.length > 0) {
            return { ...d, deXuat: activeDonForCopy.deXuat, noiDung: activeDonForCopy.noiDung };
          }
          return d;
        })
      );
    }
    alert("Đã áp dụng ý kiến cho các đơn đã chọn!");
    setShowApDungYKienModal(false);
  };

  const handleAddDonXuLy = () => {
    setShowChonDonXuLyModal(true);
  };

  const handleDeleteDon = (id: number) => {
    if (donXuLyList.length <= 1) {
      alert("Phải có ít nhất 1 đơn xử lý trong tờ trình!");
      return;
    }
    setDonXuLyList(prev => prev.filter(d => d.id !== id));
  };

  const handleUpdateDon = (id: number, field: string, value: string) => {
    setDonXuLyList(prev =>
      prev.map(d => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ daDinhKemHoSo: true, countHoSo: donXuLyList.length, soTT: "12/TTr-TANDTC-V1" });
    }
    alert("Đã lưu tờ trình thành công!");
    onClose();
  };

  const maVuAn = detail?.maVuAn || (isKhieuNai ? "KN26-002039" : "VA26-002039");
  const tenVuAn = detail?.tenVuAn || (isKhieuNai ? "Vụ việc khiếu nại của ông/bà Nguyễn Văn Minh" : "Vụ án Nguyễn Văn Minh – Tội cướp tài sản");
  const tenBiCan = "Nguyễn Văn Minh";
  const toiDanh = "Tội cướp tài sản";
  const soBA = "124/2025/HSPT";
  const ngayBA = "20/12/2025";
  const toaXetXu = "Tòa án nhân dân cấp cao tại Hà Nội";
  const toaAnGiaiQuyet = "Tòa án nhân dân tối cao";
  const trangThai = isKhieuNai ? "Chưa có kết quả giải quyết khiếu nại" : "Chưa có kết quả giải quyết đơn";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1400, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      {showBieuMau && (
        <XemBieuMauToTrinhVuAnModal
          onClose={() => setShowBieuMau(false)}
          detail={detail}
          soToTrinh="12/2026/TTr-TANDTC-V1"
          ngayLap={ngayLap}
          loaiToTrinh={isKhieuNai ? "Tờ trình thẩm tra đề xuất giải quyết khiếu nại" : "Tờ trình thẩm tra vụ án đề xuất Kháng nghị Giám đốc thẩm"}
          daKySo={true}
        />
      )}

      <div style={{ background: "#fff", borderRadius: 8, width: "100%", maxWidth: 780, boxShadow: "0 10px 40px rgba(0,0,0,0.25)", marginBottom: 24, overflow: "hidden", fontFamily: F }}>
        <div style={{ display: "flex", alignItems: "center", padding: "16px 20px 14px", borderBottom: "1px solid #e5e7eb" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", fontFamily: F, flex: 1 }}>
            {isKhieuNai ? "Thêm mới tờ trình khiếu nại" : "Thêm mới tờ trình vụ án"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, display: "flex", alignItems: "center" }}><X size={18} /></button>
        </div>

        <div style={{ padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 16, maxHeight: "82vh", overflowY: "auto" }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: "14px 18px", background: "#fff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 0.95fr", gap: "10px 18px", fontSize: 12, fontFamily: F, lineHeight: 1.5 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div><span style={{ color: "#374151" }}>Mã {isKhieuNai ? "khiếu nại" : "vụ án"}: </span><span style={{ fontWeight: 700, color: "#111827" }}>{maVuAn}</span></div>
                <div><span style={{ color: "#374151" }}>Tên {isKhieuNai ? "khiếu nại" : "vụ án"}: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{tenVuAn}</span></div>
                {isKhieuNai ? (
                  <>
                    <div><span style={{ color: "#374151" }}>Người khiếu nại: </span><span style={{ fontWeight: 600, color: "#111827" }}>{(detail as any)?.nkn || (detail as any)?.nguoiKhieuNai || "Trần Văn Hùng"}</span></div>
                    <div><span style={{ color: "#374151" }}>Nội dung KN: </span><span style={{ fontWeight: 600, color: "#111827" }}>Khiếu nại quyết định giải quyết</span></div>
                  </>
                ) : !isVu234Role ? (
                  null
                ) : (
                  <>
                    <div><span style={{ color: "#374151" }}>Nguyên đơn: </span><span style={{ fontWeight: 600, color: "#111827" }}>{detail?.nguyenDon || "Nguyễn Văn A"}</span></div>
                    <div><span style={{ color: "#374151" }}>Bị đơn: </span><span style={{ fontWeight: 600, color: "#111827" }}>{detail?.biDon || "Trần Thị B"}</span></div>
                  </>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div><span style={{ color: "#374151" }}>Số BA/QĐ: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{soBA}</span></div>
                <div><span style={{ color: "#374151" }}>Ngày ra BA/QĐ: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{ngayBA}</span></div>
                <div><span style={{ color: "#374151" }}>Tòa xét xử: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{toaXetXu}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div><span style={{ color: "#374151" }}>Tòa án giải quyết: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{toaAnGiaiQuyet}</span></div>
                <div><span style={{ color: "#374151" }}>Trạng thái: </span><span style={{ color: "#0891b2", fontWeight: 600 }}>{trangThai}</span></div>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}><span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Ngày lập tờ trình</label>
            <input type="text" value={ngayLap} onChange={e => setNgayLap(e.target.value)} placeholder="dd/mm/yyyy" style={{ padding: "8px 12px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 4, fontFamily: F, width: 200, outline: "none", background: "#fff", boxSizing: "border-box", color: "#111827" }} />
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F, borderBottom: "1px solid #e5e7eb", paddingBottom: 6, marginBottom: 10 }}>
              {isKhieuNai ? "I. NỘI DUNG ĐƠN KHIẾU NẠI" : "I. NỘI DUNG VỤ ÁN"}
            </div>
            <label style={{ fontSize: 12, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}>
              <span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Tóm tắt nội dung
            </label>
            <textarea value={tomTatNoiDung} onChange={e => setTomTatNoiDung(e.target.value)} placeholder={isKhieuNai ? "Nhập tóm tắt nội dung đơn khiếu nại và yêu cầu của người khiếu nại" : "Nhập tóm tắt nội dung vụ án"} rows={4} style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 4, fontFamily: F, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }} />
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F, borderBottom: "1px solid #e5e7eb", paddingBottom: 6, marginBottom: 10 }}>II. QUÁ TRÌNH GIẢI QUYẾT</div>
            <label style={{ fontSize: 12, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}><span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Diễn biến quá trình giải quyết</label>
            <textarea value={dienBienQuaTrinh} onChange={e => setDienBienQuaTrinh(e.target.value)} placeholder="Nhập quá trình giải quyết vụ án" rows={4} style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 4, fontFamily: F, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }} />
          </div>

          {isKhieuNai ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, borderBottom: "1px solid #e5e7eb", paddingBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, background: RED, borderRadius: 2 }} />
                  III. ĐỀ XUẤT GIẢI QUYẾT KHIẾU NẠI
                </span>
                <button
                  type="button"
                  onClick={() => setShowBieuMau(true)}
                  style={{ background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, padding: "5px 12px", fontSize: 12, fontWeight: 600, fontFamily: F, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                >
                  <FileText size={13} /> Xem biểu mẫu
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", fontFamily: F, display: "block", marginBottom: 8 }}>
                    <span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Đề xuất giải quyết
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                    {[
                      "Chấp nhận khiếu nại",
                      "Không chấp nhận khiếu nại",
                      "Xếp đơn",
                      "Nghiên cứu, xác minh, bổ sung",
                    ].map(opt => {
                      const isChecked = (donXuLyList[0]?.deXuat || "Chấp nhận khiếu nại") === opt;
                      return (
                        <label
                          key={opt}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            cursor: "pointer",
                            fontSize: 13,
                            fontFamily: F,
                            color: "#111827",
                          }}
                        >
                          <input
                            type="radio"
                            name="de-xuat-khieu-nai"
                            checked={isChecked}
                            onChange={() => handleUpdateDon(donXuLyList[0]?.id || 1, "deXuat", opt)}
                            style={{ accentColor: "#1d4ed8", width: 16, height: 16, cursor: "pointer" }}
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}>
                    Nội dung đề xuất chi tiết / Căn cứ giải quyết
                  </label>
                  <textarea
                    value={donXuLyList[0]?.noiDung || ""}
                    onChange={e => handleUpdateDon(donXuLyList[0]?.id || 1, "noiDung", e.target.value)}
                    placeholder="Nhập nội dung phân tích căn cứ và đề xuất chi tiết giải quyết khiếu nại..."
                    rows={4}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 4, fontFamily: F, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5, color: "#111827" }}
                  />
                </div>
              </div>
            </div>
          ) : isVu234Role ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, borderBottom: "1px solid #e5e7eb", paddingBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F }}>III. ĐỀ XUẤT GIẢI QUYẾT</span>
                <button
                  type="button"
                  onClick={() => setShowBieuMau(true)}
                  style={{ background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, padding: "5px 12px", fontSize: 12, fontWeight: 600, fontFamily: F, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                >
                  <FileText size={13} /> Xem biểu mẫu
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}>
                    <span style={{ color: "#dc2626", marginRight: 3 }}>*</span>Đề xuất giải quyết
                  </label>
                  <select
                    value={donXuLyList[0]?.deXuat || "Kháng nghị"}
                    onChange={e => handleUpdateDon(donXuLyList[0]?.id || 1, "deXuat", e.target.value)}
                    style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13, fontFamily: F, background: "#fff", color: "#111827", outline: "none", cursor: "pointer", width: 340 }}
                  >
                    <option value="Kháng nghị">Kháng nghị</option>
                    <option value="Không kháng nghị">Không kháng nghị (Thông báo không kháng nghị)</option>
                    <option value="Yêu cầu xác minh">Yêu cầu xác minh / Bổ sung hồ sơ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#374151", fontFamily: F, display: "block", marginBottom: 6 }}>
                    Nội dung đề xuất chi tiết
                  </label>
                  <textarea
                    value={donXuLyList[0]?.noiDung || ""}
                    onChange={e => handleUpdateDon(donXuLyList[0]?.id || 1, "noiDung", e.target.value)}
                    placeholder="Nhập nội dung đề xuất giải quyết vụ án..."
                    rows={4}
                    style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 4, fontFamily: F, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5, color: "#111827" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F }}>III. ĐỀ XUẤT GIẢI QUYẾT</span>
                <button type="button" onClick={handleAddDonXuLy} style={{ background: "#800000", color: "#fff", border: "none", borderRadius: 4, padding: "6px 14px", fontSize: 12, fontWeight: 700, fontFamily: F, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>Thêm đơn xử lý</button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
                <thead>
                  <tr style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
                    <th style={{ padding: "8px 10px", width: 50, textAlign: "center", fontWeight: 600, color: "#374151", borderRight: "1px solid #e5e7eb" }}>STT</th>
                    <th style={{ padding: "8px 12px", width: 180, textAlign: "left", fontWeight: 600, color: "#374151", borderRight: "1px solid #e5e7eb" }}>Đơn</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#374151", borderRight: "1px solid #e5e7eb" }}>Đề xuất giải quyết</th>
                    <th style={{ padding: "8px 10px", width: 80, textAlign: "center", fontWeight: 600, color: "#374151" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {donXuLyList.map((item, idx) => (
                    <tr key={item.id} style={{ background: "#fff", borderBottom: idx < donXuLyList.length - 1 ? "1px solid #e5e7eb" : "none", verticalAlign: "top" }}>
                      <td style={{ padding: "12px 10px", textAlign: "center", color: "#374151", borderRight: "1px solid #e5e7eb", fontSize: 12 }}>{idx + 1}</td>
                      <td style={{ padding: "12px 12px", borderRight: "1px solid #e5e7eb" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                          <span style={{ fontSize: 13, color: "#4b5563", marginTop: -1 }}>📄</span>
                          <div>
                            <div style={{ fontWeight: 600, color: "#111827", fontSize: 12 }}>{item.nguoiGui}</div>
                            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{item.tlm}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 12px", borderRight: "1px solid #e5e7eb" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <select value={item.deXuat} onChange={e => handleUpdateDon(item.id, "deXuat", e.target.value)} style={{ padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 12, fontFamily: F, background: "#fff", color: "#111827", outline: "none", cursor: "pointer", width: "100%" }}>
                            <option value="Trả lời đơn">Trả lời đơn</option>
                            <option value="Kháng nghị">Kháng nghị</option>
                            <option value="Xếp đơn">Xếp đơn</option>
                            <option value="Viện kiểm sát đang xử lý">Viện kiểm sát đang xử lý</option>
                            <option value="Nghiên cứu xác minh">Nghiên cứu xác minh / Bổ sung</option>
                          </select>

                          <textarea value={item.noiDung} onChange={e => handleUpdateDon(item.id, "noiDung", e.target.value)} rows={3} style={{ width: "100%", padding: "6px 10px", fontSize: 12, border: "1px solid #d1d5db", borderRadius: 4, fontFamily: F, outline: "none", lineHeight: 1.5, boxSizing: "border-box", resize: "vertical", color: "#111827" }} />
                        </div>
                      </td>
                      <td style={{ padding: "12px 10px", textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDonForCopy(item);
                              setShowApDungYKienModal(true);
                            }}
                            title="Áp dụng ý kiến cho đơn khác"
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 14, padding: 2 }}
                          >
                            ◇
                          </button>
                          <button type="button" onClick={() => handleDeleteDon(item.id)} title="Xóa đơn" style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13, padding: 2 }}><Trash2 size={14} color="#ef4444" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, padding: "14px 20px", borderTop: "1px solid #e5e7eb", background: "#fff" }}>
          <button type="button" onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, fontWeight: 500 }}>Đóng</button>
          <button type="button" onClick={handleSave} style={{ padding: "7px 32px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Lưu</button>
        </div>
      </div>

      {showChonDonXuLyModal && (
        <ModalChonDonCanXuLy
          onClose={() => setShowChonDonXuLyModal(false)}
          onSelect={handleSelectDonFromModal}
        />
      )}

      {showApDungYKienModal && (
        <ModalApDungYKienChoDonKhac
          onClose={() => setShowApDungYKienModal(false)}
          onApply={handleApplyYKien}
        />
      )}
    </div>
  );
}

function ThuHoiConfirmDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 420, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontFamily: F, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>Xác nhận thu hồi lần trình</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: MUTED, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: "20px 20px 24px" }}>
          <p style={{ fontSize: 13, color: TEXT, margin: 0 }}>Bạn có chắc chắn muốn thu hồi lần trình này không?</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 20px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={onClose} style={{ padding: "7px 24px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Hủy</button>
          <button onClick={onConfirm} style={{ padding: "7px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Xác nhận thu hồi</button>
        </div>
      </div>
    </div>
  );
}

function TabToTrinh({ detail, userRole }: { detail?: VuAnDetailData; userRole?: UserRoleType }) {
  const [showTaoTT, setShowTaoTT] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showHoSo, setShowHoSo] = useState(false);
  const [showTaoDuThao, setShowTaoDuThao] = useState(false);
  const [thuHoiIdx, setThuHoiIdx] = useState<number | null>(null);

  const [filterDon, setFilterDon] = useState("");
  const [filterVanBan, setFilterVanBan] = useState("");
  const [filterLanhDao, setFilterLanhDao] = useState("");

  const MAU_Y_KIEN_OPTIONS = [
    "Kháng nghị",
    "Nghiên cứu xác minh, bố sung",
    "Trả lời đơn",
    "Xếp đơn",
    "Viện kiểm sát đnag giải quyết",
    "Trả lời đơn",
  ];

  const [lichSuBatches, setLichSuBatches] = useState([
    {
      id: "batch-1",
      lanTrinh: "Lần 4",
      ngayTrinh: "12/08/2026",
      dsVanBan: [
        "Dự thảo Kháng nghị",
      ],
      ngayDuyetCuoi: "–",
      trangThaiChung: "cho-duyet",
      dsLanhDao: [
        {
          lanhDao: "Lê Hoàng Nam",
          chucVu: "Phó Vụ trưởng Vụ 1",
          ngayDuyet: "–",
          trangThai: "cho-y-kien" as const,
          danhSachYKienTheoDon: [] as Array<{ donLabel: string; mauYKien: string }>,
          yKienChungVanBan: undefined as string | undefined,
        },
      ],
    },
    {
      id: "batch-2",
      lanTrinh: "Lần 3",
      ngayTrinh: "11/08/2026",
      dsVanBan: [
        "Tờ trình thẩm tra bổ sung tài liệu chứng cứ",
        "Dự thảo Quyết định kháng nghị giám đốc thẩm (Bản điều chỉnh)",
      ],
      ngayDuyetCuoi: "–",
      trangThaiChung: "cho-duyet",
      dsLanhDao: [
        {
          lanhDao: detail?.thamPhan || "Nguyễn Biên Thuỳ",
          chucVu: "Thẩm phán phụ trách",
          ngayDuyet: "–",
          trangThai: "cho-y-kien" as const,
          danhSachYKienTheoDon: [],
        },
        {
          lanhDao: "Phan Văn Nam",
          chucVu: "Phó Chánh án TANDTC",
          ngayDuyet: "–",
          trangThai: "cho-y-kien" as const,
          danhSachYKienTheoDon: [],
        },
      ],
    },
    {
      id: "batch-3",
      lanTrinh: "Lần 2",
      ngayTrinh: "09/08/2026",
      dsVanBan: [
        "Tờ trình thẩm tra vụ án đề xuất Kháng nghị GĐT",
      ],
      ngayDuyetCuoi: "10/08/2026",
      trangThaiChung: "da-duyet",
      dsLanhDao: [
        {
          lanhDao: detail?.thamPhan || "Nguyễn Biên Thuỳ",
          chucVu: "Thẩm phán phụ trách",
          ngayDuyet: "09/08/2026",
          trangThai: "da-duyet" as const,
          danhSachYKienTheoDon: [
            { donLabel: "Đơn 1 (DH23648 - Phạm Minh Tuấn)", mauYKien: "Kháng nghị" },
            { donLabel: "Đơn 2 (DH43902 - Nguyễn Văn Nam)", mauYKien: "Nghiên cứu xác minh, bố sung" },
          ],
          yKienChungVanBan: "Hồ sơ vụ án đủ căn cứ kháng nghị theo Điều 373 BLTTHS. Yêu cầu Thẩm tra viên khẩn trương hoàn thiện các tài liệu đính kèm trước khi chuyển Lãnh đạo Vụ xem xét.",
        },
        {
          lanhDao: "Trần Văn B",
          chucVu: "Phó Vụ trưởng Vụ 1",
          ngayDuyet: "09/08/2026",
          trangThai: "da-duyet" as const,
          danhSachYKienTheoDon: [
            { donLabel: "Đơn 1 (DH23648 - Phạm Minh Tuấn)", mauYKien: "Trả lời đơn" },
            { donLabel: "Đơn 2 (DH43902 - Nguyễn Văn Nam)", mauYKien: "Trả lời đơn" },
          ],
          yKienChungVanBan: "Nhất trí với báo cáo thẩm tra của Thẩm phán phụ trách. Kính trình Phó Chánh án phê duyệt Quyết định Kháng nghị.",
        },
        {
          lanhDao: "Phan Văn Nam",
          chucVu: "Phó Chánh án TANDTC",
          ngayDuyet: "10/08/2026",
          trangThai: "da-duyet" as const,
          danhSachYKienTheoDon: [
            { donLabel: "Đơn 1 (DH23648 - Phạm Minh Tuấn)", mauYKien: "Kháng nghị" },
            { donLabel: "Đơn 2 (DH43902 - Nguyễn Văn Nam)", mauYKien: "Viện kiểm sát đnag giải quyết" },
          ],
          yKienChungVanBan: "Đồng ý ban hành Quyết định Kháng nghị GĐT đối với Đơn 1. Giao Vụ 1 thông báo tạm hoãn xử lý cho người nộp đơn đối với Đơn 2.",
        },
      ],
    },
    {
      id: "batch-4",
      lanTrinh: "Lần 1",
      ngayTrinh: "08/08/2026",
      dsVanBan: [
        "Dự thảo Quyết định tạm hoãn thi hành án",
        "Dự thảo Thông báo trả lời đơn đề nghị",
      ],
      ngayDuyetCuoi: "08/08/2026",
      trangThaiChung: "da-duyet",
      dsLanhDao: [
        {
          lanhDao: "Lê Hoàng Nam",
          chucVu: "Phó Vụ trưởng Vụ 1",
          ngayDuyet: "08/08/2026",
          trangThai: "da-duyet" as const,
          danhSachYKienTheoDon: [
            { donLabel: "Đơn 1 (DH23648 - Phạm Minh Tuấn)", mauYKien: "Xếp đơn" },
          ],
          yKienChungVanBan: "Duyệt ban hành Quyết định tạm hoãn thi hành án thời hạn 03 tháng theo quy định.",
        },
        {
          lanhDao: "Lý Thái Phúc",
          chucVu: "Phó Chánh án TANDTC",
          ngayDuyet: "08/08/2026",
          trangThai: "da-duyet" as const,
          danhSachYKienTheoDon: [
            { donLabel: "Đơn 1 (DH23648 - Phạm Minh Tuấn)", mauYKien: "Nhất trí ý kiến Thẩm phán phụ trách" },
          ],
          yKienChungVanBan: "Phê duyệt ký số phát hành quyết định.",
        },
      ],
    },
  ]);

  const maDonStr = (detail as any)?.maDon || "DN26";
  const nguoiStr = detail?.nguoiKhieuNai || (detail as any)?.nguoiDungDon || "Đặng Thị Dương";
  const soTLStr = detail?.soThuLy || "28";
  const ngayTLStr = detail?.ngayThuLy || "15/05/2026";

  const formattedDonStr = `Mã đơn: ${maDonStr} - ${nguoiStr}\nSố TL: ${soTLStr} - Ngày TL: ${ngayTLStr}`;

  const [vanBanList, setVanBanList] = useState([
    { stt: 1, loai: "to-trinh", vanBan: "Tờ trình thẩm tra vụ án", don: formattedDonStr, ngayTao: "09/08/2026", nguoiKy: detail?.thamTraVien, trangThai: "–", daDinhKemHoSo: true, soHoSo: 5 },
    { stt: 2, loai: "du-thao", vanBan: "Dự thảo Chấp nhận khiếu nại", don: `Mã đơn: DN26 - Nguyễn Văn Bình\nSố TL: 28 - Ngày TL: 18/05/2026`, ngayTao: "09/08/2026", nguoiKy: "–", trangThai: "Chờ ký số", daDinhKemHoSo: true, soHoSo: 3 },
    { stt: 3, loai: "du-thao", vanBan: "Dự thảo Quyết định không chấp nhận khiếu nại", don: formattedDonStr, ngayTao: "08/08/2026", nguoiKy: detail?.thamTraVien || "Lý Thái Phúc (TTV)", trangThai: "Đã ký số", daDinhKemHoSo: true, soHoSo: 1 },
  ]);

  const handleSaveToTrinh = (data?: { daDinhKemHoSo: boolean; countHoSo: number; soTT: string }) => {
    const toTrinhCount = vanBanList.filter(x => x.vanBan.includes("Tờ trình")).length + 1;
    const count = data?.countHoSo ?? 5;
    const isAttached = data?.daDinhKemHoSo ?? true;

    const newRow = { stt: 1, loai: "to-trinh", vanBan: `Tờ trình thẩm tra vụ án số ${toTrinhCount}`, don: formattedDonStr, ngayTao: "09/08/2026", nguoiKy: detail?.thamTraVien || "Lý Thái Phúc (TTV)", trangThai: "–", daDinhKemHoSo: isAttached, soHoSo: count };
    setVanBanList(prev => [newRow, ...prev.map((r, i) => ({ ...r, stt: i + 2 }))]);
  };

  const handleDeleteVanBan = (stt: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mục này không?")) {
      setVanBanList(prev => prev.filter(r => r.stt !== stt));
    }
  };

  const handleTrinhVanBanClick = () => {
    const hasMissingHoSo = vanBanList.some(r => r.vanBan.includes("Tờ trình") && (!r.daDinhKemHoSo || r.soHoSo === 0));
    if (hasMissingHoSo) {
      alert("⚠️ Cảnh báo: Tờ trình phải được đính kèm hồ sơ, tài liệu trước khi thực hiện Trình văn bản! Vui lòng chọn/đính kèm hồ sơ cho Tờ trình.");
      return;
    }
    const hasUnsigned = vanBanList.some(
      r => !r.vanBan.toLowerCase().includes("tờ trình") && (r.trangThai === "Chưa ký số" || r.trangThai === "Chờ ký số")
    );
    if (hasUnsigned) {
      alert("⚠️ Cảnh báo: Các văn bản Dự thảo phải được KÝ SỐ trước khi ấn Trình văn bản!");
      return;
    }
    setShowTrinhKy(true);
  };

  const allDonOptions = Array.from(new Set(lichSuBatches.flatMap(b => b.dsLanhDao.flatMap(l => (l.danhSachYKienTheoDon || []).map(d => d.donLabel)))));
  const allVanBanOptions = Array.from(new Set(lichSuBatches.flatMap(b => b.dsVanBan)));
  const allLanhDaoOptions = Array.from(new Set(lichSuBatches.flatMap(b => b.dsLanhDao.map(l => l.lanhDao))));

  const filteredBatches = lichSuBatches.filter(b => {
    const matchVanBan = !filterVanBan || b.dsVanBan.includes(filterVanBan);
    const matchLanhDao = !filterLanhDao || b.dsLanhDao.some(l => l.lanhDao === filterLanhDao);
    const matchDon = !filterDon || b.dsLanhDao.some(l => (l.danhSachYKienTheoDon || []).some(d => d.donLabel === filterDon));
    return matchVanBan && matchLanhDao && matchDon;
  });

  const TH: React.CSSProperties = { padding: "8px 10px", background: BG, fontWeight: 700, fontSize: 11, color: "#374151", fontFamily: F, textAlign: "left", borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word" };
  const TD: React.CSSProperties = { padding: "9px 10px", fontSize: 12, color: TEXT, fontFamily: F, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word", overflowWrap: "break-word", verticalAlign: "top" };

  const handleSaveDuThao = (data?: any) => {
    let tenDuThao = "Dự thảo Thông báo trả lời đơn đề nghị";
    if (data?.ketQuaGQ === "khang-nghi") {
      tenDuThao = "Dự thảo Quyết định kháng nghị giám đốc thẩm";
    } else if (data?.ketQuaGQ === "xep-don") {
      tenDuThao = "Dự thảo Thông báo xếp đơn đề nghị";
    } else if (data?.ketQuaGQ === "vks-dang-giai-quyet") {
      tenDuThao = "Dự thảo Thông báo trả lời đơn";
    }
    const newRow = { stt: 1, loai: "du-thao", vanBan: tenDuThao, don: formattedDonStr, ngayTao: data?.ngayQuyetDinh || "09/08/2026", nguoiKy: data?.nguoiKy || "Nguyễn Biên Thuỳ", trangThai: "Chờ ký số", daDinhKemHoSo: true, soHoSo: 3 };
    setVanBanList(prev => [newRow, ...prev.map((r, i) => ({ ...r, stt: i + 2 }))]);
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      {showTaoTT && <TaoToTrinhModal onClose={() => setShowTaoTT(false)} onSave={handleSaveToTrinh} detail={detail} userRole={userRole} />}
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showHoSo && <HoSoToTrinhModal row={detail ? {
        loaiAn: detail.loaiAn,
        biCao: detail.tenVuAn ? detail.tenVuAn.replace("Vụ án", "").replace("Vụ khiếu nại", "").split("–")[0].trim() : undefined,
        soBA: detail.soNgayBanAn ? detail.soNgayBanAn.split("–")[0].trim() : undefined,
        ngayBA: detail.soNgayBanAn ? detail.soNgayBanAn.split("–")[1]?.trim() : undefined,
        toa: detail.toaXetXu,
      } : undefined} onClose={() => setShowHoSo(false)} />}
      {showTaoDuThao && <TaoDuThaoModal onClose={() => setShowTaoDuThao(false)} detail={detail} onSave={handleSaveDuThao} />}
      {thuHoiIdx !== null && (
        <ThuHoiConfirmDialog
          onClose={() => setThuHoiIdx(null)}
          onConfirm={() => { setLichSuBatches(p => p.filter((_, i) => i !== thuHoiIdx)); setThuHoiIdx(null); }}
        />
      )}

      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách văn bản & Tờ trình</span>
          <button onClick={handleTrinhVanBanClick} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <Send size={13} /> Trình văn bản
          </button>
          <button onClick={() => setShowTaoDuThao(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            + Tạo dự thảo
          </button>
          <button onClick={() => setShowTaoTT(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <RefreshCw size={13} /> Tạo tờ trình
          </button>
          <button onClick={() => setShowHoSo(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            <Archive size={13} /> Hồ sơ tờ trình
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 600 }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: !isVu234(userRole, detail?.loaiAn) ? "32%" : "48%" }} />
              {!isVu234(userRole, detail?.loaiAn) && <col style={{ width: "18%" }} />}
              <col style={{ width: !isVu234(userRole, detail?.loaiAn) ? "11%" : "12%" }} />
              <col style={{ width: !isVu234(userRole, detail?.loaiAn) ? "14%" : "15%" }} />
              <col style={{ width: !isVu234(userRole, detail?.loaiAn) ? "12%" : "13%" }} />
              <col style={{ width: 100 }} />
            </colgroup>
            <thead>
              <tr>
                {(!isVu234(userRole, detail?.loaiAn)
                  ? ["STT", "TÊN VĂN BẢN", "ĐƠN ", "NGÀY TẠO", "NGƯỜI KÝ", "TRẠNG THÁI", "THAO TÁC"]
                  : ["STT", "TÊN VĂN BẢN", "NGÀY TẠO", "NGƯỜI KÝ", "TRẠNG THÁI", "THAO TÁC"]
                ).map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vanBanList.map((r, idx) => {
                const isToTrinh = r.loai === "to-trinh" || r.vanBan.toLowerCase().includes("tờ trình");
                return (
                  <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ ...TD, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                    <td style={{ ...TD, color: "#2563eb", fontWeight: 600 }}>
                      📄 {r.vanBan}
                    </td>
                    {!isVu234(userRole, detail?.loaiAn) && (
                      <td style={{ ...TD, whiteSpace: "pre-line" as const }}>{r.don}</td>
                    )}
                    <td style={TD}>{r.ngayTao}</td>
                    <td style={TD}>{r.nguoiKy}</td>
                    <td style={TD}>
                      {isToTrinh ? (
                        <span style={{ color: MUTED }}>–</span>
                      ) : r.trangThai === "Chưa ký số" ? (
                        <Badge color="#991b1b" bg="#fee2e2">Chưa ký số</Badge>
                      ) : (
                        <Badge
                          color={r.trangThai === "Đã phát hành" ? "#065f46" : r.trangThai === "Đã ký số" ? "#1e40af" : "#92400e"}
                          bg={r.trangThai === "Đã phát hành" ? "#d1fae5" : r.trangThai === "Đã ký số" ? "#dbeafe" : "#fef3c7"}
                        >
                          {r.trangThai}
                        </Badge>
                      )}
                    </td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        {isToTrinh && (
                          <button onClick={() => setShowTrinhKy(true)} title="Trình lại tờ trình" style={{ background: "none", border: "none", cursor: "pointer", padding: 3, display: "inline-flex", alignItems: "center" }}>
                            <RotateCcw size={14} color="#1d4ed8" />
                          </button>
                        )}
                        {isToTrinh && (
                          <button onClick={() => handleDeleteVanBan(r.stt)} title="Xóa tờ trình" style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }}>
                            <Trash2 size={14} color="#dc2626" />
                          </button>
                        )}
                        {!isToTrinh && (r.trangThai === "Chưa ký số" || r.trangThai === "Chờ ký số") && (
                          <button onClick={() => handleDeleteVanBan(r.stt)} title="Xóa dự thảo" style={{ background: "none", border: "none", cursor: "padding: 3" }}>
                            <Trash2 size={14} color="#dc2626" />
                          </button>
                        )}
                        <button onClick={() => { if (isToTrinh) setShowTaoTT(true); else setShowTaoDuThao(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title={isToTrinh ? "Xem chi tiết tờ trình" : "Xem chi tiết dự thảo"}>
                          <Eye size={14} color="#0e7490" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lịch sử trình ký */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Lịch sử trình ký</span>
          {!isVu234(userRole, detail?.loaiAn) && (
            <select value={filterDon} onChange={e => setFilterDon(e.target.value)} style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
              <option value="">Lọc theo đơn</option>
              {allDonOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}

          <select value={filterVanBan} onChange={e => setFilterVanBan(e.target.value)} style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
            <option value="">Lọc theo văn bản</option>
            {allVanBanOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 850 }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "19%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "10%" }} />
              {/* <col style={{ width: "10%" }} /> */}
              <col style={{ width: 75 }} />
            </colgroup>
            <thead>
              <tr>{["STT", "NGÀY TRÌNH", "VĂN BẢN", "LÃNH ĐẠO ĐƯỢC TRÌNH", "Ý KIẾN LÃNH ĐẠO", "NGÀY DUYỆT", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch, bIdx) => {
                const docCount = batch.dsVanBan.length;
                const leaderCount = batch.dsLanhDao.length;
                const rowCount = Math.max(docCount, leaderCount, 1);

                return Array.from({ length: rowCount }).map((_, rIdx) => {
                  const ld = batch.dsLanhDao[rIdx];
                  const vbName = batch.dsVanBan[rIdx];

                  const isLastLeader = rIdx === leaderCount - 1;
                  const leaderRowSpan = (isLastLeader && leaderCount < rowCount) ? (rowCount - leaderCount + 1) : 1;

                  const isLastDoc = rIdx === docCount - 1;
                  const docRowSpan = (isLastDoc && docCount < rowCount) ? (rowCount - docCount + 1) : 1;

                  const isBatchBorder = rIdx === rowCount - 1;

                  return (
                    <tr
                      key={`${batch.id}-${rIdx}`}
                      style={{
                        background: bIdx % 2 === 0 ? "#fff" : "#fafafa",
                        borderBottom: isBatchBorder ? `1px solid ${BORDER}` : `1px dashed #e2e8f0`,
                      }}
                    >
                      {/* STT */}
                      {rIdx === 0 && (
                        <td rowSpan={rowCount} style={{ ...TD, textAlign: "center", color: MUTED, verticalAlign: "middle" }}>
                          {bIdx + 1}
                        </td>
                      )}

                      {/* NGÀY TRÌNH */}
                      {rIdx === 0 && (
                        <td rowSpan={rowCount} style={{ ...TD, fontWeight: 600, verticalAlign: "middle" }}>
                          <div style={{ color: TEXT }}>{batch.ngayTrinh}</div>
                          <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{batch.lanTrinh}</div>
                        </td>
                      )}

                      {/* VĂN BẢN */}
                      {rIdx < docCount && (
                        <td rowSpan={docRowSpan} style={{ ...TD, color: "#2563eb", fontWeight: 600, verticalAlign: "middle" }}>
                          📄 {vbName}
                        </td>
                      )}

                      {/* LÃNH ĐẠO ĐƯỢC TRÌNH (Từng dòng Lãnh đạo riêng) */}
                      {rIdx < leaderCount && (
                        <td rowSpan={leaderRowSpan} style={{ ...TD, verticalAlign: "top" }}>
                          <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 12 }}>👤 {ld.lanhDao}</div>
                          <div style={{ fontSize: 11, color: MUTED }}>({ld.chucVu})</div>

                        </td>
                      )}

                      {/* Ý KIẾN / ĐƠN (Từng dòng Ý kiến riêng) */}
                      {rIdx < leaderCount && (
                        <td rowSpan={leaderRowSpan} style={{ ...TD, verticalAlign: "top" }}>
                          {isVu234(userRole, detail?.loaiAn) ? (
                            /* Dành cho Vụ 2, 3, 4: Ý kiến theo văn bản / vụ án (Không hiển thị Đơn 1, Đơn 2) */
                            <div>
                              {ld.danhSachYKienTheoDon && ld.danhSachYKienTheoDon.length > 0 && (
                                <div style={{ marginBottom: ld.yKienChungVanBan ? 6 : 0 }}>
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 4,
                                      background: "#f0fdf4",
                                      color: "#166534",
                                      border: "1px solid #bbf7d0",
                                      padding: "2px 8px",
                                      borderRadius: 4,
                                      fontSize: 11,
                                      fontWeight: 600,
                                    }}
                                  >
                                    📋 {ld.danhSachYKienTheoDon[0].mauYKien}
                                  </span>
                                </div>
                              )}
                              {ld.yKienChungVanBan ? (
                                <div style={{ fontSize: 11, color: "#1e293b", background: "#f8fafc", padding: "6px 8px", borderRadius: 4, borderLeft: "3px solid #0284c7" }}>
                                  <span style={{ fontWeight: 700, color: "#0369a1" }}>💬 Ý kiến cho văn bản: </span>
                                  <span>{ld.yKienChungVanBan}</span>
                                </div>
                              ) : (!ld.danhSachYKienTheoDon || ld.danhSachYKienTheoDon.length === 0) ? (
                                <div style={{ fontSize: 11.5, color: MUTED, fontStyle: "italic", padding: "4px 0" }}>
                                  ⏳ (Chưa có ý kiến)
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            /* Dành cho Vụ 1: Ý kiến theo đơn */
                            <div>
                              {/* 1. Mẫu ý kiến chọn từ Combobox theo từng Đơn */}
                              {ld.danhSachYKienTheoDon && ld.danhSachYKienTheoDon.length > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: ld.yKienChungVanBan ? 6 : 0 }}>
                                  {ld.danhSachYKienTheoDon.map((item, iIdx) => (
                                    <div key={iIdx} style={{ fontSize: 11.5 }}>
                                      <span style={{ fontWeight: 700, color: "#0f766e" }}>{item.donLabel}: </span>
                                      <span
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: 4,
                                          background: "#f0fdf4",
                                          color: "#166534",
                                          border: "1px solid #bbf7d0",
                                          padding: "1px 7px",
                                          borderRadius: 4,
                                          fontSize: 10.5,
                                          fontWeight: 600,
                                        }}
                                      >
                                        📋 {item.mauYKien}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* 2. Ý kiến nhập tự do (Freetext) cho CẢ VĂN BẢN */}
                              {ld.yKienChungVanBan ? (
                                <div style={{ fontSize: 11, color: "#1e293b", background: "#f8fafc", padding: "6px 8px", borderRadius: 4, borderLeft: "3px solid #0284c7" }}>
                                  <span style={{ fontWeight: 700, color: "#0369a1" }}>💬 Ý kiến chung cho văn bản: </span>
                                  <span>{ld.yKienChungVanBan}</span>
                                </div>
                              ) : (!ld.danhSachYKienTheoDon || ld.danhSachYKienTheoDon.length === 0) ? (
                                <div style={{ fontSize: 11.5, color: MUTED, fontStyle: "italic", padding: "4px 0" }}>
                                  ⏳ (Chưa có ý kiến)
                                </div>
                              ) : null}
                            </div>
                          )}
                        </td>
                      )}

                      {/* NGÀY DUYỆT (Từng dòng Ngày duyệt riêng) */}
                      {rIdx < leaderCount && (
                        <td rowSpan={leaderRowSpan} style={{ ...TD, verticalAlign: "top" }}>
                          <div style={{ fontWeight: 600, color: ld.ngayDuyet && ld.ngayDuyet !== "–" ? TEXT : MUTED, fontSize: 12 }}>
                            📅 {ld.ngayDuyet || "–"}
                          </div>
                          <div style={{ fontSize: 10.5, color: MUTED, marginTop: 2 }}>
                            {ld.trangThai === "da-duyet" ? "Đã duyệt" : ld.trangThai === "tu-choi" ? "Từ chối" : "Chưa duyệt"}
                          </div>
                        </td>
                      )}

                      {/* THAO TÁC */}
                      {rIdx === 0 && (
                        <td rowSpan={rowCount} style={{ ...TD, textAlign: "center", verticalAlign: "middle" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
                            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem">
                              <Eye size={13} color="#0e7490" />
                            </button>
                            {batch.trangThaiChung === "cho-duyet" && (
                              <button title="Thu hồi" onClick={() => setThuHoiIdx(bIdx)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                  <path d="M2 8a6 6 0 1 0 1.5-3.9" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            )}
                            {batch.trangThaiChung === "tu-choi" ? (
                              <button title="Trình lại tờ trình" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", alignItems: "center" }}>
                                <RotateCcw size={13} color="#1d4ed8" />
                              </button>
                            ) : (
                              <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", alignItems: "center" }}>
                                <Send size={13} color={RED} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TabGiaiQuyetVB({ detail, userRole }: { detail?: VuAnDetailData; userRole?: UserRole }) {
  const [showThemKetQua, setShowThemKetQua] = useState(false);
  const [showThemHoan, setShowThemHoan] = useState(false);
  const [showTaiLieuHoSoModal, setShowTaiLieuHoSoModal] = useState(false);
  const [searchHoan, setSearchHoan] = useState("");
  const [isHoanChecked, setIsHoanChecked] = useState(true);
  const [quyetDinhHoanList, setQuyetDinhHoanList] = useState<Array<{
    stt: number;
    biCao: string;
    tenQuyetDinh: string;
    soQuyetDinh: string;
    ngayQuyetDinh: string;
    nguoiKy: string;
    nguoiTao: string;
  }>>([]);

  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleAddQuyetDinhHoan = (newItem: any) => {
    setQuyetDinhHoanList(prev => [
      ...prev,
      {
        stt: prev.length + 1,
        ...newItem,
      },
    ]);
  };

  const isKhieuNai = Boolean(
    detail?.isKhieuNai ||
    detail?.entityWord === "Khiếu nại" ||
    detail?.moduleLabel === "Quản lý khiếu nại" ||
    (typeof detail?.maVuAn === "string" && (detail.maVuAn.startsWith("KN") || detail.maVuAn.includes("KN"))) ||
    (typeof detail?.id === "string" && detail.id.includes("KN")) ||
    (typeof detail?.tenVuAn === "string" && detail.tenVuAn.toLowerCase().includes("khiếu nại"))
  );

  const isVu234Case = isVu234(userRole, detail?.loaiAn);

  const groups = isKhieuNai ? [
    {
      id: "chap-nhan-khieu-nai", title: "Chấp nhận khiếu nại",
      items: [
        {
          stt: 1,
          maDon: "1531",
          nguoiDungDon: isVu234Case ? "Công ty TNHH Đầu tư Thành Phát" : "Phạm Minh Tuấn",
          soTLNgayTL: "TL: 2026/045 - 15/05/2026",
          soQuyetDinh: "179/2026/QĐ-GQKN",
          ngayQuyetDinh: "09/07/2026",
          ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình - Vụ trưởng", status: "Đã duyệt - 10/07/2026" }, { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã duyệt - 09/07/2026" }],
          nguoiKy: { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã có hiệu lực - 09/07/2026", isDone: true },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:41:00" },
        },
      ],
    },
    {
      id: "khong-chap-nhan-khieu-nai", title: "Không chấp nhận khiếu nại",
      items: [
        {
          stt: 1,
          maDon: "1532, 1432",
          nguoiDungDon: isVu234Case ? "Lê Hoàng Anh (Người khởi kiện)" : "Trần Văn Hùng",
          soTLNgayTL: "TL: 2026/089 - 20/06/2026",
          soQuyetDinh: "180/2026/QĐ-GQKN",
          ngayQuyetDinh: "09/07/2026",
          ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình - Vụ trưởng", status: "Đã duyệt - 10/07/2026" }],
          nguoiKy: { ten: "Nguyễn Văn Quảng - Phó CA", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:43:08" },
        },
      ],
    },
  ] : isVu234Case ? [
    {
      id: "khang-nghi", title: "Kháng nghị",
      items: [
        {
          stt: 1,
          maDon: "Công ty TNHH Nam Hải",
          nguoiDungDon: "Công ty TNHH Nam Hải (Nguyên đơn)",
          soTLNgayTL: "TL: 2026/088 - 14/05/2026",
          soQuyetDinh: "45/2026/KN-DS",
          ngayQuyetDinh: "15/07/2026",
          ngayPhatHanh: "16/07/2026",
          nguoiDuyet: [{ ten: "Trần Văn Nam - Vụ trưởng Vụ 2", status: "Đã duyệt - 15/07/2026" }, { ten: "Phạm Thị Lan - TPTC", status: "Đã duyệt - 15/07/2026" }],
          nguoiKy: { ten: "Nguyễn Văn Quảng - Phó CA", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Lê Thị Thảo", thoiGian: "15/07/2026 10:20:00" },
        },
      ],
    },
    {
      id: "tra-loi-don", title: "Trả lời đơn",
      items: [
        {
          stt: 1,
          maDon: "Phạm Hoàng Nam",
          nguoiDungDon: "Phạm Hoàng Nam (Bị đơn)",
          soTLNgayTL: "TL: 2026/105 - 02/06/2026",
          soQuyetDinh: "128/2026/TB-TA",
          ngayQuyetDinh: "18/07/2026",
          ngayPhatHanh: "19/07/2026",
          nguoiDuyet: [{ ten: "Trần Văn Nam - Vụ trưởng Vụ 2", status: "Đã duyệt - 18/07/2026" }, { ten: "Nguyễn Thị Hoa - TPB", status: "Đã duyệt - 18/07/2026" }],
          nguoiKy: { ten: "Phạm Quốc Hùng - TPB", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Nguyễn Văn Minh", thoiGian: "18/07/2026 15:30:00" },
        },
        {
          stt: 2,
          maDon: "Lê Văn Tùng & Hoàng Thị Mai",
          nguoiDungDon: "Lê Văn Tùng & Hoàng Thị Mai",
          soTLNgayTL: "TL: 2026/142 - 20/06/2026",
          soQuyetDinh: "142/2026/TB-TA",
          ngayQuyetDinh: "22/07/2026",
          ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Đặng Thị Phương - Phó Vụ trưởng", status: "Đã duyệt - 22/07/2026" }],
          nguoiKy: { ten: "Phạm Quốc Hùng - TPB", status: "Đã có hiệu lực - 22/07/2026", isDone: true },
          nguoiTao: { ten: "Lê Thị Thảo", thoiGian: "22/07/2026 09:15:00" },
        },
      ],
    },
  ] : [
    {
      id: "khang-nghi", title: "Kháng nghị",
      items: [
        {
          stt: 1,
          maDon: "Nguyễn Hữu Tiến, Mai Xuân Nam",
          nguoiDungDon: "Nguyễn Hữu Tiến, Mai Xuân Nam",
          soTLNgayTL: "TL: 2026/045 - 15/05/2026",
          soQuyetDinh: "179/2026/KN-HS",
          ngayQuyetDinh: "09/07/2026",
          ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình - Vụ trưởng", status: "Đã duyệt - 10/07/2026" }, { ten: "Nguyễn Thị Hoa - TPTC", status: "Đã duyệt - 09/07/2026" }],
          nguoiKy: { ten: "Nguyễn Văn Quảng - Phó CA", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:43:08" },
        },
      ],
    },
    {
      id: "tra-loi-don", title: "Trả lời đơn",
      items: [
        {
          stt: 1,
          maDon: "Mã Đáo Ngựa",
          nguoiDungDon: "Mã Đáo Ngựa",
          soTLNgayTL: "TL: 2026/045 - 15/05/2026",
          soQuyetDinh: "179/2026/TB-TA",
          ngayQuyetDinh: "09/07/2026",
          ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình - Vụ trưởng", status: "Đã duyệt - 10/07/2026" }, { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã duyệt - 09/07/2026" }],
          nguoiKy: { ten: "Nguyễn Thị Hoa - TPB3", status: "Chưa có hiệu lực", isDone: false },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:41:00" },
        },
        {
          stt: 2,
          maDon: "1234",
          nguoiDungDon: "Nguyễn Văn Nam",
          soTLNgayTL: "TL: 2026/102 - 01/07/2026",
          soQuyetDinh: "179/2026/TB-TA",
          ngayQuyetDinh: "09/07/2026",
          ngayPhatHanh: "Chưa cập nhật",
          nguoiDuyet: [{ ten: "Nguyễn Thị Bình", status: "Đã duyệt - 10/07/2026" }],
          nguoiKy: { ten: "Nguyễn Thị Hoa - TPB3", status: "Đã có hiệu lực - 09/07/2026", isDone: true },
          nguoiTao: { ten: "Nguyễn Cao Thắng", thoiGian: "09/07/2026 14:00:38" },
        },
      ],
    },
  ];

  const thSt: React.CSSProperties = { padding: "10px 8px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#374151", fontFamily: F, whiteSpace: "nowrap" };
  const tdSt: React.CSSProperties = { padding: "10px 8px", fontSize: 12, fontFamily: F, verticalAlign: "top" };

  return (
    <div style={{ padding: 20, fontFamily: F }}>
      {!isKhieuNai && showThemHoan && (
        <ThemQuyetDinhHoanModal
          onClose={() => setShowThemHoan(false)}
          detail={detail}
          onSave={handleAddQuyetDinhHoan}
        />
      )}

      {/* Modal Xem / Quản lý tài liệu hồ sơ số hóa */}
      {showTaiLieuHoSoModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "#fff", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "8px 16px", background: "#800000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: F }}>📁 Quản lý tài liệu hồ sơ số hóa - Vụ án {detail?.maVuAn || "VA26-00321"}</span>
            <button onClick={() => setShowTaiLieuHoSoModal(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, fontFamily: F }}>
              <X size={16} /> Đóng xem hồ sơ
            </button>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <TaiLieuHoSoView vuAnId={detail?.maVuAn || "VA26-00321"} tenVuAn={detail?.tenVuAn || "Vụ án"} onBack={() => setShowTaiLieuHoSoModal(false)} />
          </div>
        </div>
      )}

      {/* Thông tin quyết định hoãn thi hành án – Chỉ hiển thị cho Vụ án, không hiển thị cho Khiếu nại */}
      {!isKhieuNai && (
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827", fontFamily: F }}>
              Thông tin quyết định hoãn thi hành án
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: TEXT, cursor: "pointer", fontFamily: F }}>
                <input
                  type="checkbox"
                  checked={isHoanChecked}
                  onChange={e => setIsHoanChecked(e.target.checked)}
                  style={{ accentColor: "#800000", cursor: "pointer" }}
                />
                <span>Quyết định hoãn thi hành án</span>
              </label>
              <div style={{ position: "relative", width: 220 }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchHoan}
                  onChange={e => setSearchHoan(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "5px 10px 5px 28px",
                    fontSize: 12,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    fontFamily: F,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <Search size={13} color={MUTED} style={{ position: "absolute", left: 8, top: 7, pointerEvents: "none" }} />
              </div>
            </div>

            <button
              onClick={() => setShowThemHoan(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                background: "#800000",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: F,
              }}
            >
              + Thêm mới
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ ...thSt, width: 50, textAlign: "center" }}>STT</th>
                  <th style={{ ...thSt, width: 140 }}>Tên Bị cáo</th>
                  <th style={{ ...thSt }}>Tên quyết định</th>
                  <th style={{ ...thSt, width: 120 }}>Số QĐ</th>
                  <th style={{ ...thSt, width: 110 }}>Ngày ra QĐ</th>
                  <th style={{ ...thSt, width: 160 }}>Người ký</th>
                  <th style={{ ...thSt, width: 140 }}>Người tạo</th>
                  <th style={{ ...thSt, width: 80, textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {quyetDinhHoanList.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "28px 16px", color: MUTED, fontSize: 13, fontStyle: "italic", borderBottom: "1px solid #f3f4f6" }}>
                      Chưa có quyết định hoãn thi hành án
                    </td>
                  </tr>
                ) : (
                  quyetDinhHoanList
                    .filter(r => !searchHoan || r.tenQuyetDinh.toLowerCase().includes(searchHoan.toLowerCase()) || r.biCao.toLowerCase().includes(searchHoan.toLowerCase()) || r.soQuyetDinh.toLowerCase().includes(searchHoan.toLowerCase()))
                    .map((r, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6", background: "#fff" }}>
                        <td style={{ ...tdSt, textAlign: "center", color: "#6b7280" }}>{r.stt}</td>
                        <td style={{ ...tdSt, color: "#111827", fontWeight: 600 }}>{r.biCao}</td>
                        <td style={{ ...tdSt, color: "#2563eb", fontWeight: 500 }}>{r.tenQuyetDinh}</td>
                        <td style={{ ...tdSt, fontWeight: 500 }}>{r.soQuyetDinh}</td>
                        <td style={{ ...tdSt, color: "#374151" }}>{r.ngayQuyetDinh}</td>
                        <td style={{ ...tdSt, color: "#374151" }}>{r.nguoiKy}</td>
                        <td style={{ ...tdSt, color: "#6b7280" }}>{r.nguoiTao}</td>
                        <td style={{ ...tdSt, textAlign: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem chi tiết">
                              <Eye size={14} color="#0e7490" />
                            </button>
                            <button onClick={() => setQuyetDinhHoanList(prev => prev.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xóa">
                              <Trash2 size={14} color="#dc2626" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showThemKetQua && (
        <ThemKetQuaModal
          onClose={() => { setShowThemKetQua(false); setSelectedDetail(null); }}
          detail={selectedDetail || detail}
        />
      )}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginTop: isKhieuNai ? 0 : 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", fontFamily: F }}>
            {isKhieuNai ? "Kết quả giải quyết khiếu nại" : "Kết quả giải quyết đơn"}
          </span>
          <button onClick={() => { setSelectedDetail(detail); setShowThemKetQua(true); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: F }}>
            + Thêm kết quả giải quyết
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {groups.map(g => {
            const isCollapsed = !!collapsedGroups[g.id];
            return (
              <div key={g.id} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
                  <div onClick={() => toggleGroup(g.id)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: F }}>{g.title}</span>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>{isCollapsed ? "▼" : "▲"}</span>
                  </div>
                  {(g.id === "khang-nghi" || g.title.toLowerCase().includes("kháng nghị")) && (
                    <button
                      type="button"
                      onClick={() => setShowTaiLieuHoSoModal(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#800000",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: F,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      + Thêm hồ sơ
                    </button>
                  )}
                </div>

                {!isCollapsed && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
                      <thead>
                        <tr style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
                          <th style={{ ...thSt, width: 50, textAlign: "center" }}>STT</th>
                          <th style={{ ...thSt, width: 170 }}>Thông tin đơn</th>
                          <th style={{ ...thSt, width: 140 }}>Số quyết định</th>
                          <th style={{ ...thSt, width: 120 }}>Ngày quyết định</th>
                          <th style={{ ...thSt, width: 120 }}>Ngày phát hành</th>
                          <th style={{ ...thSt, width: 220 }}>Người duyệt</th>
                          <th style={{ ...thSt, width: 200 }}>Người ký</th>
                          <th style={{ ...thSt, width: 180 }}>Người tạo</th>
                          <th style={{ ...thSt, width: 80, textAlign: "center" }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.items.map((r, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6", background: "#fff" }}>
                            <td style={{ ...tdSt, textAlign: "center", color: "#6b7280" }}>{r.stt}</td>
                            <td style={{ ...tdSt }}>
                              <div style={{ fontWeight: 600, color: "#111827" }}>
                                {(r as any).nguoiDungDon || (r.maDon ? `${r.maDon}` : "Phạm Minh Tuấn")}
                              </div>
                              <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                                {(r as any).soTLNgayTL || "TL: 2026/045 - 15/05/2026"}
                              </div>
                            </td>
                            <td style={{ ...tdSt }}>
                              <span onClick={() => { setSelectedDetail({ ...detail, soQuyetDinh: r.soQuyetDinh }); setShowThemKetQua(true); }} style={{ color: "#1d4ed8", fontWeight: 500, cursor: "pointer" }}>
                                {r.soQuyetDinh}
                              </span>
                            </td>
                            <td style={{ ...tdSt, color: "#374151" }}>{r.ngayQuyetDinh}</td>
                            <td style={{ ...tdSt, color: "#6b7280" }}>{r.ngayPhatHanh}</td>
                            <td style={{ ...tdSt }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {r.nguoiDuyet.map((nd, i) => (
                                  <div key={i} style={{ lineHeight: 1.3 }}>
                                    <div style={{ color: "#111827", fontWeight: 500 }}>{nd.ten}</div>
                                    <div style={{ color: "#16a34a", fontSize: 11 }}>{nd.status}</div>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td style={{ ...tdSt }}>
                              <div style={{ lineHeight: 1.3 }}>
                                <div style={{ color: "#111827", fontWeight: 500 }}>{r.nguoiKy.ten}</div>
                                <div style={{ color: r.nguoiKy.isDone ? "#16a34a" : "#6b7280", fontSize: 11 }}>{r.nguoiKy.status}</div>
                              </div>
                            </td>
                            <td style={{ ...tdSt }}>
                              <div style={{ lineHeight: 1.3 }}>
                                <div style={{ color: "#111827", fontWeight: 500 }}>{r.nguoiTao.ten}</div>
                                <div style={{ color: "#6b7280", fontSize: 11 }}>{r.nguoiTao.thoiGian}</div>
                              </div>
                            </td>
                            <td style={{ ...tdSt, textAlign: "center" }}>
                              <button onClick={() => { setSelectedDetail({ ...detail, soQuyetDinh: r.soQuyetDinh }); setShowThemKetQua(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} title="Xem chi tiết">
                                <Eye size={15} color="#6b7280" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

function TabTaiLieu({ detail }: { detail?: VuAnDetailData }) {
  return (
    <div style={{ height: "calc(100vh - 110px)", width: "100%", overflow: "hidden" }}>
      <TaiLieuHoSoView vuAnId={detail?.maVuAn} tenVuAn={detail?.tenVuAn} />
    </div>
  );
}

function TabHoSoLuuTru({ detail }: { detail?: VuAnDetailData }) {
  return (
    <div style={{ height: "calc(100vh - 110px)", width: "100%", overflow: "hidden" }}>
      <HoSoLuuTruView vuAnId={detail?.maVuAn} tenVuAn={detail?.tenVuAn} />
    </div>
  );
}

// ── Chi tiết vụ án View Component ───────────────────────────────────────────
export function ChiTietVuAnView({
  vuAnId,
  userRole,
  onBack,
  initialTab = "danh-sach-don",
  moduleLabel = "Quản lý vụ án",
  detailLabel = "Chi tiết vụ án",
  entityWord = "Vụ án"
}: {
  vuAnId?: string;
  userRole?: UserRoleType;
  onBack: () => void;
  initialTab?: ChiTietTab;
  moduleLabel?: string;
  detailLabel?: string;
  entityWord?: string;
}) {
  const [activeTab, setActiveTab] = useState<ChiTietTab>(initialTab || "thong-tin");
  const safeVuAnId = vuAnId || "KN26-004128";
  const fallbackDetail = VU_AN_DETAILS["KN26-004128"] || VU_AN_DETAILS["VA26-002039"] || Object.values(VU_AN_DETAILS)[0];
  const rawDetail = VU_AN_DETAILS[safeVuAnId] || fallbackDetail;

  const safeModuleLabel = moduleLabel || "Quản lý vụ án";
  const safeDetailLabel = detailLabel || "Chi tiết vụ án";
  const safeEntityWord = entityWord || "Vụ án";

  const detail: VuAnDetailData = {
    ...fallbackDetail,
    ...rawDetail,
    maVuAn: (typeof safeVuAnId === "string" && safeVuAnId.startsWith("KN")) ? safeVuAnId : (rawDetail?.maVuAn || safeVuAnId),
    tenVuAn: rawDetail?.tenVuAn || fallbackDetail?.tenVuAn || "Vụ án hình sự sơ thẩm",
    loaiAn: rawDetail?.loaiAn || fallbackDetail?.loaiAn || "Hình sự",
    danhSachDon: rawDetail?.danhSachDon || fallbackDetail?.danhSachDon || [],
    muonTraHoSo: rawDetail?.muonTraHoSo || fallbackDetail?.muonTraHoSo || [],
    moduleLabel: safeModuleLabel,
    detailLabel: safeDetailLabel,
    entityWord: safeEntityWord,
    isKhieuNai: safeModuleLabel === "Quản lý khiếu nại" || safeEntityWord === "Khiếu nại" || (typeof safeVuAnId === "string" && safeVuAnId.startsWith("KN")),
  };

  const tabs: Array<{ id: ChiTietTab; label: string; count?: number }> = [
    { id: "thong-tin", label: "Thông tin chung" },
    { id: "danh-sach-don", label: "Danh sách đơn", count: detail?.danhSachDon?.length || 3 },
    { id: "phan-cong", label: "Phân công" },
    { id: "muon-tra-ho-so", label: "Mượn/trả hồ sơ", count: detail?.muonTraHoSo?.length || 2 },
    { id: "to-trinh", label: "Tờ trình", count: 3 },
    { id: "giai-quyet-vb", label: "Giải quyết văn bản", count: 3 },
    { id: "tai-lieu", label: "Tài liệu vụ án", count: 4 },
    { id: "ho-so-luu-tru", label: "Hồ sơ lưu trữ" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc", overflow: "hidden", fontFamily: F }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            ← Quay lại
          </button>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: F }}>
            Trang chủ › Quản lý án GĐT/TT › {safeModuleLabel} › <b style={{ color: TEXT }}>{safeDetailLabel}: {detail.maVuAn}</b>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>Tên {(safeEntityWord || "Vụ án").toLowerCase()}:</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1e40af", fontFamily: F }}>{detail.tenVuAn}</span>
          <Badge color="#065f46" bg="#d1fae5">Đang giải quyết</Badge>
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`, background: "#fff", padding: "0 20px", flexShrink: 0, overflowX: "auto" }}>
        {tabs.map((t) => {
          const isActive = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "12px 18px", fontSize: 13, fontFamily: F,
                fontWeight: isActive ? 700 : 500,
                background: "none", border: "none", cursor: "pointer",
                color: isActive ? RED : MUTED,
                borderBottom: isActive ? `2px solid ${RED}` : "2px solid transparent",
                marginBottom: -1, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "thong-tin" && <TabThongTin detail={detail} userRole={userRole} />}
        {activeTab === "danh-sach-don" && <TabDanhSachDon detail={detail} />}
        {activeTab === "phan-cong" && <TabPhanCong detail={detail} />}
        {activeTab === "muon-tra-ho-so" && <TabMuonTraHoSo detail={detail} />}
        {activeTab === "to-trinh" && <TabToTrinh detail={detail} userRole={userRole} />}
        {activeTab === "giai-quyet-vb" && <TabGiaiQuyetVB detail={detail} userRole={userRole} />}
        {activeTab === "tai-lieu" && <TabTaiLieu detail={detail} />}
        {activeTab === "ho-so-luu-tru" && <TabHoSoLuuTru detail={detail} />}
      </div>
    </div>
  );
}
