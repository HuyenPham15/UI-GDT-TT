import React, { useState } from "react";
import {
  Printer,
  FileText,
  Plus,
} from "lucide-react";
import {
  F,
  RED,
  BORDER,
  TEXT,
  MUTED,
  TH_STYLE,
  TD_STYLE,
  Badge,
  CapXetXu,
  TaiKhoanPhanQuyenBar,
} from "./shared";
import { formatSoBA } from "./AppHelpers";
import {
  KHIEU_NAI_LIST,
  filterVuAnListByRole,
  isVu234,
  getQuanHePhapLuat,
  getPartyLabels,
  UserRoleType,
  ChiTietTab,
} from "./App";
import { VuAnSearchFilterPanel } from "./VuAnSearchFilterPanel";

const paginBtn: React.CSSProperties = {
  padding: "4px 10px",
  border: `1px solid ${BORDER}`,
  borderRadius: 4,
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
  fontFamily: F,
  color: TEXT,
};

export type KhieuNaiTabId = "tat-ca" | "dang-giai-quyet" | "da-giai-quyet" | "qua-han";

export function QuanLyKhieuNaiView({
  userRole,
  setUserRole,
  onSelectKhieuNai,
}: {
  userRole?: UserRoleType;
  setUserRole?: (role: UserRoleType) => void;
  onSelectKhieuNai: (id: string, tab?: ChiTietTab) => void;
}) {
  const [activeTab, setActiveTab] = useState<KhieuNaiTabId>("dang-giai-quyet");

  const filteredGroups = filterVuAnListByRole(KHIEU_NAI_LIST, userRole);

  const tabs: { id: KhieuNaiTabId; label: string }[] = [
    { id: "tat-ca", label: "Tất cả" },
    { id: "dang-giai-quyet", label: "Đang giải quyết" },
    { id: "da-giai-quyet", label: "Đã giải quyết" },
    { id: "qua-han", label: "Quá hạn giải quyết" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#f9fafb", fontFamily: F }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        <span>Trang chủ</span> &nbsp;›&nbsp; <span>Quản lý án GĐT/TT</span> &nbsp;›&nbsp; <b style={{ color: TEXT }}>Quản lý khiếu nại</b>
      </div>

      {/* Title + Tabs */}
      <div style={{ background: "#fff", padding: "14px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>
            Quản lý khiếu nại
          </h1>
          {userRole && setUserRole && (
            <TaiKhoanPhanQuyenBar userRole={userRole} setUserRole={setUserRole} />
          )}
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((t) => {
            const active = t.id === activeTab;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "9px 16px",
                  fontSize: 13,
                  fontFamily: F,
                  fontWeight: active ? 600 : 400,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: active ? RED : MUTED,
                  borderBottom: active ? `2.5px solid ${RED}` : "2.5px solid transparent",
                  marginBottom: -1,
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 19-Field Comprehensive Filter Panel */}
      <VuAnSearchFilterPanel
        userRole={userRole}
        onSearch={() => alert("Đang tìm kiếm danh sách khiếu nại...")}
      />

      {/* Action Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 20px",
          background: "#fff",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1 }} />
        <button
          onClick={() => alert("Mở form thêm mới khiếu nại")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            background: RED,
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: F,
          }}
        >
          <Plus size={13} /> Thêm mới
        </button>

        <button
          onClick={() => window.print()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            background: "#fff",
            color: "#374151",
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: F,
          }}
        >
          <Printer size={13} /> In biểu đồ
        </button>
      </div>

      {/* Table Section */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 36 }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={TH_STYLE}><input type="checkbox" /></th>
              <th style={TH_STYLE}>STT</th>
              <th style={TH_STYLE}>SỐ & NGÀY THỤ LÝ</th>
              <th style={TH_STYLE}>THÔNG TIN BẢN ÁN/QĐ & QHPL</th>
              <th style={TH_STYLE}>ĐƯƠNG SỰ & NGƯỜI ĐỀ NGHỊ</th>
              <th style={TH_STYLE}>PHÂN CÔNG</th>
              <th style={TH_STYLE}>TRẠNG THÁI</th>
              <th style={{ ...TH_STYLE, textAlign: "center" }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.flatMap((group, groupIdx) =>
              group.rows.map((row, idx) => {
                const { label1, label2 } = getPartyLabels(row.loaiAn, userRole);
                const rowKey = `${group.id}-${row.stt}`;
                const globalIdx = groupIdx * group.rows.length + idx;
                return (
                  <tr
                    key={rowKey}
                    style={{ background: globalIdx % 2 === 0 ? "#fff" : "#fafafa" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = globalIdx % 2 === 0 ? "#fff" : "#fafafa")}
                  >
                    {/* Checkbox */}
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <input type="checkbox" />
                    </td>

                    {/* STT */}
                    <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12, fontFamily: F }}>
                      {globalIdx + 1}
                    </td>

                    {/* Số & Ngày thụ lý */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          Số: <b>{row.soThuLy}</b>
                        </span>
                        <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày TL: {row.ngayThuLy}</span>
                        <button
                          onClick={() => onSelectKhieuNai(group.id)}
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
                          }}
                        >
                          Số đơn {group.rows.length}
                        </button>
                        <span style={{ fontSize: 10, color: MUTED, fontFamily: F }}>({group.rows.length} đơn TLM)</span>
                        {row.extraTags?.map((t) => (
                          <Badge key={t} color="#1e40af" bg="#dbeafe">{t}</Badge>
                        ))}
                      </div>
                    </td>

                    {/* Thông tin BA/QĐ & QHPL */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: TEXT }}>Số BA: </span>
                          <span style={{ color: "#2563eb", fontWeight: 600 }}>{formatSoBA(row.soBA, row.loaiAn)}</span>
                          {row.ngayBA && (
                            <>
                              <span style={{ color: TEXT }}> Ngày: </span>
                              <span style={{ color: "#2563eb" }}>{row.ngayBA}</span>
                            </>
                          )}
                        </span>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          <span style={{ color: TEXT }}>Tại: </span>{row.toa}
                        </span>
                        <CapXetXu label={row.capXetXu} />
                        {isVu234(userRole, row.loaiAn) && (
                          <span style={{ fontSize: 11, color: "#047857", fontFamily: F, fontWeight: 500 }}>
                            <span style={{ color: TEXT, fontWeight: 400 }}>QHPL: </span>{getQuanHePhapLuat(row)}
                          </span>
                        )}
                        {row.anLoai === "chi-dao" && <Badge color="#92400e" bg="#fef3c7">Án chỉ đạo</Badge>}
                        {row.anLoai === "quoc-hoi" && <Badge color="#3730a3" bg="#e0e7ff">Án QH</Badge>}
                      </div>
                    </td>

                    {/* Đương sự & Người đề nghị */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: TEXT, fontWeight: 600 }}>{label1}:</span>{" "}
                          <span style={{ fontWeight: 600, color: TEXT }}>{row.nkn}</span>
                        </span>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: TEXT, fontWeight: 600 }}>NĐĐ:</span>{" "}
                          <span style={{ color: TEXT }}>{row.ndd}</span>
                        </span>
                      </div>
                    </td>

                    {/* Phân công */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: MUTED }}>TTV: </span>{row.ttv}
                        </span>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: MUTED }}>TP: </span>
                          {row.thamPhan || "–"}
                        </span>
                        <span style={{ fontSize: 11, fontFamily: F }}>
                          <span style={{ color: MUTED }}>LĐ: </span>{row.lanhDao}
                        </span>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {/* — Trình ký — */}
                        {row.kqgq === "chua-phan-cong"
                          ? <Badge color="#374151" bg="#f3f4f6">Chưa phân công TTV</Badge>
                          : row.kqgq === "trinh-tham-phan"
                            ? <Badge color="#0f766e" bg="#ccfbf1">Trình Thẩm phán</Badge>
                            : <Badge color="#1e40af" bg="#dbeafe">Trình Phó Chánh án</Badge>}

                        {/* — Trạng thái hồ sơ — */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: `1px dashed #e5e7eb`, paddingTop: 4 }}>
                          <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Hồ sơ</span>
                          {row.trangThaiHoSo === "chua-co" && (
                            <span style={{ fontSize: 11, color: "#6b7280", fontFamily: F }}>Chưa có hồ sơ</span>
                          )}
                          {row.trangThaiHoSo === "dang-muon" && (
                            <Badge color="#92400e" bg="#fef3c7">Đang mượn hồ sơ</Badge>
                          )}
                          {row.trangThaiHoSo === "da-co" && (
                            <Badge color="#065f46" bg="#d1fae5">Đã có hồ sơ</Badge>
                          )}
                          {row.trangThaiHoSo === "da-tra" && (
                            <Badge color="#1e40af" bg="#dbeafe">Đã trả hồ sơ</Badge>
                          )}
                          {row.trangThaiHoSo === "da-chuyen" && (
                            <Badge color="#6d28d9" bg="#ede9fe">Đã chuyển hồ sơ</Badge>
                          )}
                        </div>

                        {/* — Kết quả giải quyết khiếu nại — */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: `1px dashed #e5e7eb`, paddingTop: 4 }}>
                          <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Kết quả giải quyết</span>
                          {row.kqGiaiQuyet === "chua-co" && (
                            <span style={{ fontSize: 11, color: "#6b7280", fontFamily: F }}>Chưa có kết quả</span>
                          )}
                          {row.kqGiaiQuyet === "da-co" && (
                            <Badge color="#065f46" bg="#d1fae5">Chấp nhận kháng nghị</Badge>
                          )}
                          {row.kqGiaiQuyet === "da-co-con-don" && (
                            <Badge color="#991b1b" bg="#fee2e2">Không chấp nhận kháng nghị</Badge>
                          )}
                        </div>

                        {/* — Tờ trình — */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: `1px dashed #e5e7eb`, paddingTop: 4 }}>
                          <span style={{ fontSize: 10, color: MUTED, fontFamily: F, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Tờ trình</span>
                          {row.trangThaiToTrinh === "chua-co" && (
                            <span style={{ fontSize: 11, color: "#6b7280", fontFamily: F }}>Chưa có tờ trình</span>
                          )}
                          {row.trangThaiToTrinh === "dang-trinh" && (
                            <Badge color="#1e40af" bg="#dbeafe">Đang trình</Badge>
                          )}
                          {row.trangThaiToTrinh === "da-duyet" && (
                            <Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge>
                          )}
                          {row.trangThaiToTrinh === "bi-tra-lai" && (
                            <Badge color="#991b1b" bg="#fee2e2">Bị trả lại</Badge>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); onSelectKhieuNai(group.id, "to-trinh"); }}
                            style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 0", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#2563eb", fontFamily: F, textDecoration: "underline", textUnderlineOffset: 2, alignSelf: "flex-start" }}
                          >
                            <FileText size={11} />
                            Danh sách Tờ trình
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <button
                        onClick={() => onSelectKhieuNai(group.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 4,
                          borderRadius: 4,
                          fontSize: 18,
                          color: MUTED,
                          lineHeight: 1,
                        }}
                        title="Tùy chọn chi tiết"
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

        {/* Pagination Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1–{filteredGroups.reduce((s, g) => s + g.rows.length, 0)} trong tổng {filteredGroups.reduce((s, g) => s + g.rows.length, 0)} bản ghi</span>
          <div style={{ flex: 1 }} />
          <button style={paginBtn} disabled>‹</button>
          <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
          <button style={paginBtn}>›</button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}><option>10 / trang</option></select>
        </div>
      </div>
    </div>
  );
}

export default QuanLyKhieuNaiView;
