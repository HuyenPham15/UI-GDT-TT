import React, { useState } from "react";
import { Eye, FileText } from "lucide-react";
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

const paginBtn: React.CSSProperties = { padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT };

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
  const [activeTab, setActiveTab] = useState<KhieuNaiTabId>("tat-ca");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [collapsedLan, setCollapsedLan] = useState<Record<string, boolean>>({});

  const filteredGroups = filterVuAnListByRole(KHIEU_NAI_LIST, userRole);

  const tabs = [
    { id: "tat-ca", label: "Tất cả" },
    { id: "dang-giai-quyet", label: "Đang giải quyết" },
    { id: "da-giai-quyet", label: "Đã giải quyết" },
    { id: "qua-han", label: "Quá hạn giải quyết" },
  ];

  const inSt: React.CSSProperties = { padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff" };
  const selSt: React.CSSProperties = { ...inSt, cursor: "pointer" };

  const fld = (lbl: string, type: "input" | "select" = "input", ph = "", opts?: string[]) => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 110 }}>
      <span style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 3 }}>{lbl}</span>
      {type === "select"
        ? <select style={selSt}>
          <option>– Tất cả –</option>
          {opts?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        : <input placeholder={ph || lbl} style={inSt} />}
    </div>
  );

  const dateRange = (lbl: string) => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 170 }}>
      <span style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 3 }}>{lbl}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input placeholder="Từ ngày" style={{ ...inSt, flex: 1 }} />
        <span style={{ fontSize: 10, color: MUTED }}>→</span>
        <input placeholder="Đến ngày" style={{ ...inSt, flex: 1 }} />
      </div>
    </div>
  );

  const toggleGroup = (id: string) => setCollapsed((p) => ({ ...p, [id]: !p[id] }));
  const toggleLan = (key: string) => setCollapsedLan((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        Trang chủ › Quản lý án GĐT/TT › Quản lý khiếu nại › Danh sách
      </div>

      {/* Title + Tabs */}
      <div style={{ background: "#fff", padding: "14px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Danh sách khiếu nại</h2>
          {userRole && setUserRole && (
            <TaiKhoanPhanQuyenBar userRole={userRole} setUserRole={setUserRole} />
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {tabs.map((t) => {
            const active = t.id === activeTab;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id as KhieuNaiTabId)}
                style={{ padding: "10px 16px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400, background: "none", border: "none", cursor: "pointer", color: active ? RED : MUTED, borderBottom: active ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          {fld("Số đơn khiếu nại", "input", "Nhập số đơn")}
          {fld("Người khiếu nại", "input", "Nhập tên")}
          {dateRange("Ngày nhận đơn")}
          {dateRange("Thụ lý từ ngày")}
          {dateRange("Tờ trình từ ngày")}
          {fld("Trạng thái hồ sơ", "select")}
        </div>
        {filterExpanded && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            {fld("Kết quả giải quyết đơn", "select", "", ["Chấp nhận kháng nghị", "Không chấp nhận kháng nghị"])}
            {fld("Loại án", "select")}
            {fld("Tòa ra BA/QĐ", "select")}
            {fld("Ngày BA/QĐ", "input", "dd/mm/yyyy")}
            {fld("Người bị khiếu nại", "input", "Nhập tên")}
            {fld("Thuộc án", "select")}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setFilterExpanded((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#2563eb", fontFamily: F }}>
            <span>{filterExpanded ? "Thu gọn bộ lọc ▲" : "Mở rộng bộ lọc ▼"}</span>
          </button>
          <div style={{ flex: 1 }} />
          <button style={{ padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            Tìm kiếm
          </button>
          <button style={{ padding: "6px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            Đặt lại
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: F }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={TH_STYLE}><input type="checkbox" /></th>
              <th style={TH_STYLE}>STT</th>
              <th style={TH_STYLE}>SỐ & NGÀY THỤ LÝ</th>
              <th style={TH_STYLE}>THÔNG TIN BẢN ÁN/QUYẾT ĐỊNH & QHPL</th>
              <th style={TH_STYLE}>ĐƯƠNG SỰ & NGƯỜI ĐỨNG ĐƠN</th>
              <th style={TH_STYLE}>PHÂN CÔNG</th>
              <th style={TH_STYLE}>TRẠNG THÁI</th>
              <th style={{ ...TH_STYLE, textAlign: "center" }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map((group, groupIdx) => {
              const isCollapsed = collapsed[group.id];
              return (
                <React.Fragment key={group.id}>
                  {/* ── Group header row ── */}
                  <tr style={{ background: "#fce7e7", cursor: "pointer" }} onClick={() => toggleGroup(group.id)}>
                    <td style={{ padding: "8px 6px", borderBottom: `1px solid ${BORDER}`, background: "#fce7e7", textAlign: "center" }}>
                      <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                    </td>
                    <td style={{ padding: "8px 6px", borderBottom: `1px solid ${BORDER}`, background: "#fce7e7", textAlign: "center", fontWeight: 700, fontSize: 14, color: RED, fontFamily: F }}>
                      {groupIdx + 1}
                    </td>
                    <td colSpan={6} style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}`, background: "#fce7e7" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, color: MUTED }}>{isCollapsed ? "▶" : "▼"}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); onSelectKhieuNai(group.id); }}
                          style={{ fontSize: 13, fontWeight: 700, color: "#1e40af", fontFamily: F, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>
                          {group.maSo}
                        </button>
                        <span style={{ fontSize: 13, color: TEXT, fontFamily: F }}>– {group.tenVuAn}</span>
                        <Badge color="#0f766e" bg="#ccfbf1">({group.soVuAnGiaiQuyet} vụ án giải quyết)</Badge>
                      </div>
                    </td>
                  </tr>
                  {!isCollapsed && group.rows.map((row, idx) => {
                    const lanKey = `${group.id}-${row.stt}`;
                    const isLanCollapsed = collapsedLan[lanKey];
                    return (
                      <React.Fragment key={lanKey}>
                        {/* ── Lần sub-header (collapsible) ── */}
                        <tr style={{ background: "#fff5f5", cursor: "pointer" }} onClick={() => toggleLan(lanKey)}>
                          <td colSpan={2} style={{ borderBottom: `1px solid ${BORDER}`, background: "#fff5f5" }} />
                          <td colSpan={6} style={{ padding: "5px 12px 5px 16px", borderBottom: `1px solid ${BORDER}`, background: "#fff5f5" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 11, color: MUTED }}>{isLanCollapsed ? "▶" : "▼"}</span>
                              <span style={{ fontSize: 11, color: MUTED, fontFamily: F, fontStyle: "italic" }}>{row.lan}</span>
                            </div>
                          </td>
                        </tr>
                        {/* ── Data row ── */}
                        {!isLanCollapsed && (
                          <tr
                            style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
                          >
                            <td style={{ ...TD_STYLE, textAlign: "center" }}><input type="checkbox" /></td>
                            <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>–</td>
                            <td style={TD_STYLE}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Số: <b>{row.soThuLy}</b></span>
                                <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày TL: {row.ngayThuLy}</span>
                                {row.extraTags.map((t) => <Badge key={t} color="#1e40af" bg="#dbeafe">{t}</Badge>)}
                              </div>
                            </td>
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
                                <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: TEXT }}>Tại: </span>{row.toa}</span>
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
                            <td style={TD_STYLE}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {(() => {
                                  const { label1, label2 } = getPartyLabels(row.loaiAn, userRole);
                                  return (
                                    <>
                                      <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: TEXT }}>{label1}: </span><span style={{ fontWeight: 600, color: TEXT }}>{row.nkn}</span></span>
                                      <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: TEXT }}>{label2}: </span><span style={{ fontWeight: 600, color: TEXT }}>{row.biCao}</span></span>
                                      <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: TEXT }}>NĐD: </span><span style={{ fontWeight: 600, color: TEXT }}>{row.ndd}</span></span>
                                    </>
                                  );
                                })()}
                              </div>
                            </td>
                            <td style={TD_STYLE}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>TTV: </span>{row.ttv}</span>
                                <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>LĐ: </span>{row.lanhDao}</span>
                              </div>
                            </td>
                            <td style={TD_STYLE}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {/* 1. KQGQ status */}
                                {row.kqgq === "chua-phan-cong"
                                  ? <Badge color="#374151" bg="#f3f4f6">Chưa phân công TTV</Badge>
                                  : <Badge color="#1e40af" bg="#dbeafe">Trình Phó Chánh án</Badge>}
                                {/* 2. Kết quả giải quyết khiếu nại */}
                                {row.kqGiaiQuyet === "chua-co" && <Badge color="#991b1b" bg="#fee2e2">Chưa có kết quả</Badge>}
                                {row.kqGiaiQuyet === "da-co" && <Badge color="#065f46" bg="#d1fae5">Chấp nhận kháng nghị</Badge>}
                                {row.kqGiaiQuyet === "da-co-con-don" && <Badge color="#991b1b" bg="#fee2e2">Không chấp nhận kháng nghị</Badge>}
                                {/* 3. Danh sách tờ trình */}
                                <button
                                  onClick={(e) => { e.stopPropagation(); onSelectKhieuNai(group.id, "to-trinh"); }}
                                  style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 0", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#2563eb", fontFamily: F, textDecoration: "underline", textUnderlineOffset: 2, alignSelf: "flex-start" }}>
                                  <FileText size={11} />
                                  {row.soToTrinh > 0 ? `${row.soToTrinh} tờ trình` : "Tờ trình"}
                                </button>
                              </div>
                            </td>
                            <td style={{ ...TD_STYLE, textAlign: "center" }}>
                              <button onClick={() => onSelectKhieuNai(group.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4 }} title="Xem chi tiết">
                                <Eye size={15} color={MUTED} />
                              </button>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1–{filteredGroups.length} trong tổng {filteredGroups.length} bản ghi</span>
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
