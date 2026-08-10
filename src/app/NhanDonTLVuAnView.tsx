import React, { useState } from "react";
import {
  Search, RefreshCw, Eye,
  ChevronDown, ChevronUp, RotateCcw, X, Save, Printer,
} from "lucide-react";
import {
  TAB_CONFIG, getCasesByTab, countByTab,
  type DonCase, type TabId,
} from "./data";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, VuAnBtn, Tag, type UserRoleType } from "./shared";
import { formatSoBA } from "./AppHelpers";
import { getPartyLabels, isVu234, getQuanHePhapLuat } from "./App";
import { SearchFilterPanel } from "./SearchFilterPanel";

// ── Thông tin đơn cell ───────────────────────────────────────────────────────

function CellThongTinDon({ c, tab }: { c: DonCase; tab?: TabId }) {
  const isDaCoVuAn = tab === "da-co-vu-an" || c.tabs?.includes("da-co-vu-an") || c.daThuLy;
  const showDuKien = !isDaCoVuAn;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {c.type === "don" ? (
        <>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F }}>
            Mã đơn: {c.maDon}
          </span>
          {c.daThuLy ? (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Đã thụ lý</span>
          ) : (
            <>
              {c.soCV && (
                <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                  CV chuyển: {c.soCV} - {c.ngayCV}
                </span>
              )}
              {c.thuLyMoi && (
                <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                  Thụ lý mới: {c.thuLyMoi}
                </span>
              )}
            </>
          )}
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Thẩm phán{showDuKien ? " (Dự kiến)" : ""}: {c.thamPhan} ({c.capThamPhan})
          </span>
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Hình thức: {c.hinhThuc}
          </span>
        </>
      ) : (
        <>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F }}>
            Mã văn thư đến: {c.maVanThuDen} - {c.ngayVanThuDen}
          </span>
          {c.soHSKN && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
              Số HSKN: {c.soHSKN} - {c.ngayHSKN}
            </span>
          )}
          {c.thuLyXetXu && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
              Thụ lý xét xử: {c.thuLyXetXu}
            </span>
          )}
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Thẩm phán{showDuKien ? " (Dự kiến)" : ""}: {c.thamPhan} ({c.capThamPhan})
          </span>
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Hình thức: {c.hinhThuc}
          </span>
        </>
      )}
      {c.tags.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2, alignItems: "flex-start" }}>
          {c.tags.map((t) => <Tag key={t} type={t} />)}
        </div>
      )}
    </div>
  );
}

// ── Đương sự cell ────────────────────────────────────────────────────────────

function CellDuongSu({ c, userRole }: { c: DonCase; userRole?: UserRoleType }) {
  const { label1, label2 } = getPartyLabels(c.loaiAn, userRole);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {c.nguoiKhieuNai && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>{label1}: </span>
          <span style={{ fontWeight: 600, color: TEXT }}>{c.nguoiKhieuNai}</span>
        </span>
      )}
      {c.biCao && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>{label2}: </span>
          <span style={{ fontWeight: 600, color: TEXT }}>{c.biCao}</span>
        </span>
      )}
      {c.ndd && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>NĐD: </span>
          <span style={{ fontWeight: 600, color: TEXT }}>{c.ndd}</span>
        </span>
      )}
      {c.nguoiKhangNghi && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>Người kháng nghị: </span>
          <span style={{ fontWeight: 600, color: TEXT }}>{c.nguoiKhangNghi}</span>
        </span>
      )}
    </div>
  );
}

// ── BA/QĐ cell ───────────────────────────────────────────────────────────────

function CellBA({ c, userRole }: { c: DonCase; userRole?: UserRoleType }) {
  if (!c.soBA && !c.toa) return <span style={{ color: TEXT, fontSize: 11, fontFamily: F }}>-</span>;
  const showQHPL = isVu234(userRole, c.loaiAn);
  const qhplText = getQuanHePhapLuat(c);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {c.soBA && (
        <span style={{ fontSize: 11, fontFamily: F }}>
          <span style={{ color: TEXT }}>Số BA: </span>
          <span style={{ color: "#2563eb", fontWeight: 600 }}>{formatSoBA(c.soBA, c.loaiAn)}</span>
          {c.ngayBA && (
            <>
              <span style={{ color: TEXT }}> Ngày: </span>
              <span style={{ color: "#2563eb" }}>{c.ngayBA}</span>
            </>
          )}
        </span>
      )}
      {c.toa && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>Tại: </span>{c.toa}
        </span>
      )}
      {c.thoiHieu && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>Thời hiệu: </span>
          <span style={{ color: c.thoiHieu === "Không xác định thời hiệu" ? "#047857" : "#c2410c", fontWeight: 600 }}>{c.thoiHieu}</span>
        </span>
      )}
      {showQHPL && (
        <span style={{ fontSize: 11, color: "#047857", fontFamily: F, fontWeight: 500 }}>
          <span style={{ color: TEXT, fontWeight: 400 }}>QHPL: </span>{qhplText}
        </span>
      )}
      {c.hoiDongThamPhanPhucTham && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>HĐTP cấp phúc thẩm: </span>{c.hoiDongThamPhanPhucTham}
        </span>
      )}
      {c.thamPhanChuToaPhucTham && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: TEXT }}>Thẩm phán chủ tọa cấp phúc thẩm: </span>{c.thamPhanChuToaPhucTham}
        </span>
      )}
    </div>
  );
}

// ── Thông tin vụ án cell ─────────────────────────────────────────────────────

function CellVuAn({ c, onThemHoSo }: { c: DonCase; onThemHoSo?: () => void }) {
  const hasGiaiQuyet = !!(c.thongBaoBoSung || c.ttvGiaiQuyet || c.tpGiaiQuyet);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {c.maVuAn && (
        <div style={{ textAlign: "left" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: TEXT, fontFamily: F, display: "block" }}>
            Mã vụ án: {c.maVuAn}
          </span>
          {c.tenVuAn && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, lineHeight: 1.4, display: "block" }}>
              Tên vụ án: {c.tenVuAn}
            </span>
          )}
          {c.ttv && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              TTV: {c.ttv}
            </span>
          )}
        </div>
      )}
      {hasGiaiQuyet && (
        <div style={{
          marginTop: 2, padding: "6px 8px",
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: 5, display: "flex", flexDirection: "column", gap: 3,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#15803d", fontFamily: F, textTransform: "uppercase", letterSpacing: 0.4 }}>
            Đã có TBGQ: TBTLĐ số 1
          </span>
          {c.ttvGiaiQuyet && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              TTV giải quyết: <strong>{c.ttvGiaiQuyet}</strong>
            </span>
          )}
          {c.tpGiaiQuyet && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              TP giải quyết: <strong>{c.tpGiaiQuyet}</strong>
            </span>
          )}
        </div>
      )}
      {c.vuAnActions && c.vuAnActions.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {c.vuAnActions.map((a) => (
            <VuAnBtn
              key={a}
              action={a}
              onClick={a === "them-vu-an" ? onThemHoSo : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Ý kiến lãnh đạo cell ─────────────────────────────────────────────────────

function CellYKienLD({ c }: { c: DonCase }) {
  if (!c.yKienLD?.length)
    return <span style={{ color: MUTED, fontSize: 11, fontFamily: F }}>-</span>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
      {c.yKienLD.map((y, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Badge
            color={y.decision === "thu-moi" ? "#065f46" : "#991b1b"}
            bg={y.decision === "thu-moi" ? "#d1fae5" : "#fee2e2"}
          >
            {y.decision === "thu-moi" ? "Thụ lý mới" : "Không thụ lý"}
          </Badge>
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            {y.name} – {y.role}
          </span>
          <span style={{ fontSize: 11, color: "#16a34a", fontFamily: F }}>
            Đã duyệt - {y.date}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Nhận/Trả cell ────────────────────────────────────────────────────────────

function CellNhanTra({ c, tab }: { c: DonCase; tab?: TabId }) {
  if (tab === "da-co-vu-an") {
    const ngayDuyet =
      (c as any).ngayDuyetToTrinh ||
      c.yKienLD?.[0]?.date ||
      c.ngayThaoTac ||
      c.ngayNhan ||
      "24/07/2026";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 12, color: TEXT, fontFamily: F, fontWeight: 500 }}>
          {ngayDuyet}
        </span>
      </div>
    );
  }

  const hasData = c.ngayNhan || c.nguoiThaoTac || c.nguoiTra;
  if (!hasData)
    return <span style={{ color: MUTED, fontSize: 11, fontFamily: F }}>-</span>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {c.ngayNhan && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Ngày nhận: {c.ngayNhan}
        </span>
      )}
      {c.nguoiThaoTac && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Người thao tác: {c.nguoiThaoTac}
        </span>
      )}
      {c.ngayThaoTac && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Ngày thao tác: {c.ngayThaoTac}
        </span>
      )}
      {c.nguoiTra && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Người trả: {c.nguoiTra}
        </span>
      )}
      {c.ngayTra && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Ngày trả: {c.ngayTra}
        </span>
      )}
    </div>
  );
}

// ── Action bar ───────────────────────────────────────────────────────────────

function ActionBar({
  tab,
  onGiaoTieuHoSo,
  onInBaoCao,
}: {
  tab: TabId;
  onGiaoTieuHoSo: () => void;
  onInBaoCao?: () => void;
}) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 20px", background: "#fff",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ flex: 1 }} />
      <button
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", background: "#fff", color: RED,
          border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer",
          fontSize: 12, fontWeight: 600, fontFamily: F,
        }}
      >
        ↩ Trả đơn
      </button>
      {tab === "da-co-vu-an" && (
        <button
          onClick={onGiaoTieuHoSo}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", background: "#16a34a", color: "#fff",
            border: "none", borderRadius: 4, cursor: "pointer",
            fontSize: 12, fontWeight: 600, fontFamily: F,
          }}
        >
          ✓ Giao tiểu hồ sơ
        </button>
      )}
      <button
        onClick={onInBaoCao}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", background: "#fff", color: "#374151",
          border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer",
          fontSize: 12, fontWeight: 600, fontFamily: F,
        }}
      >
        <Printer size={13} /> In báo cáo
      </button>
      <button
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 30, height: 30, background: "#fff",
          border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer",
        }}
      >
        <RefreshCw size={13} color={MUTED} />
      </button>
    </div>
  );
}

// ── Pagination button style ───────────────────────────────────────────────────

const paginBtn: React.CSSProperties = {
  padding: "3px 9px", border: `1px solid ${BORDER}`, borderRadius: 4,
  background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F,
};

// ── Main list table ───────────────────────────────────────────────────────────

function CaseTable({
  tab,
  onGiaoTieuHoSo,
  onThemHoSo,
  overrideCases,
  userRole,
}: {
  tab: TabId;
  onGiaoTieuHoSo: () => void;
  onThemHoSo: () => void;
  overrideCases?: DonCase[];
  userRole?: UserRoleType;
}) {
  const cases = overrideCases ?? getCasesByTab(tab, userRole);

  const lastColHeader =
    tab === "cho-y-kien" ? "Ý KIẾN LÃNH ĐẠO" : "THÔNG TIN VỤ ÁN";

  const duongSuHeader =
    userRole === "vu-1" || userRole === "hinh-su"
      ? "NGƯỜI KHIẾU NẠI & BỊ CÁO"
      : userRole === "vu-4" || userRole === "hanh-chinh"
        ? "NGƯỜI KHỞI KIỆN & NGƯỜI BỊ KIỆN"
        : userRole === "vu-2" || userRole === "vu-3" || userRole === "dan-su"
          ? "NGUYÊN ĐƠN & BỊ ĐƠN"
          : "ĐƯƠNG SỰ & NGƯỜI ĐỨNG ĐƠN";

  const baHeader = isVu234(userRole)
    ? "THÔNG TIN BA/QĐ ĐỀ NGHỊ GĐT,TT & QHPL"
    : "THÔNG TIN BA/QĐ ĐỂ NGHỊ GĐT,TT";

  const nhanTraHeader =
    tab === "tra-lai"
      ? "LÝ DO TRẢ LẠI"
      : tab === "da-co-vu-an"
        ? "NGÀY DUYỆT TỜ TRÌNH"
        : "THÔNG TIN NHẬN/TRẢ";

  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: 36 }} />
          <col style={{ width: 36 }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: 52 }} />
        </colgroup>
        <thead>
          <tr>
            <th style={TH_STYLE}>
              <input type="checkbox" />
            </th>
            <th style={TH_STYLE}>STT</th>
            <th style={TH_STYLE}>THÔNG TIN ĐƠN</th>
            <th style={TH_STYLE}>{duongSuHeader}</th>
            <th style={TH_STYLE}>{baHeader}</th>
            <th style={TH_STYLE}>{lastColHeader}</th>
            <th style={TH_STYLE}>{nhanTraHeader}</th>
            <th style={{ ...TH_STYLE, textAlign: "center" }}>THAO TÁC</th>
          </tr>
        </thead>
        <tbody>
          {cases.length === 0 && (
            <tr>
              <td colSpan={8} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
          {cases.map((c, idx) => (
            <tr
              key={c.id}
              style={{ background: idx % 2 === 0 ? "#ffffff" : "#fafafa" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = idx % 2 === 0 ? "#ffffff" : "#fafafa")
              }
            >
              <td style={{ ...TD_STYLE, textAlign: "center" }}>
                <input type="checkbox" />
              </td>
              <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 13, fontFamily: F }}>
                {idx + 1}
              </td>
              <td style={TD_STYLE}><CellThongTinDon c={c} tab={tab} /></td>
              <td style={TD_STYLE}><CellDuongSu c={c} userRole={userRole} /></td>
              <td style={TD_STYLE}><CellBA c={c} userRole={userRole} /></td>
              <td style={TD_STYLE}>
                {tab === "cho-y-kien" ? (
                  <CellYKienLD c={c} />
                ) : (
                  <CellVuAn c={c} onThemHoSo={onThemHoSo} />
                )}
              </td>
              <td style={TD_STYLE}>
                {tab === "tra-lai" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: RED, fontFamily: F }}>
                      Lý do trả:
                    </span>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F, lineHeight: 1.4 }}>
                      {c.lyDoTraLai || "Đơn không thuộc thẩm quyền giải quyết theo thủ tục giám đốc thẩm, tái thẩm"}
                    </span>
                    {c.ngayTra && (
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}>
                        Ngày trả: {c.ngayTra}
                      </span>
                    )}
                  </div>
                ) : (
                  <CellNhanTra c={c} tab={tab} />
                )}
              </td>
              <td style={{ ...TD_STYLE, textAlign: "center" }}>
                <button
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: 4, borderRadius: 4,
                  }}
                  title="Xem chi tiết"
                >
                  <Eye size={15} color="#6b7280" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderTop: `1px solid ${BORDER}`,
          background: "#fff", fontSize: 12, color: MUTED, fontFamily: F,
        }}
      >
        <span>Hiển thị 1–{Math.min(cases.length, 10)} trong tổng {cases.length} bản ghi</span>
        <div style={{ flex: 1 }} />
        <button style={paginBtn} disabled>‹</button>
        <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
        <button style={paginBtn}>›</button>
        <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}>
          <option>10 / trang</option>
        </select>
      </div>
    </div>
  );
}

// ── Giao tiểu hồ sơ view ─────────────────────────────────────────────────────

export function GiaoTieuHoSoView({ onClose, userRole }: { onClose: () => void; userRole?: UserRoleType }) {
  const [subTab, setSubTab] = useState<"chua-nhan" | "da-nhan" | "chua-giao" | "da-giao">("da-giao");
  const [expanded, setExpanded] = useState(false);

  const subTabs = [
    { id: "chua-nhan", label: "Chưa nhận Tiểu hồ sơ" },
    { id: "da-nhan", label: "Đã nhận Tiểu hồ sơ" },
    { id: "chua-giao", label: "Chưa giao tiểu hồ sơ" },
    { id: "da-giao", label: "Đã giao tiểu hồ sơ" },
  ] as const;

  const giaoCases = [
    {
      maDon: "6966", soCV: "514", ngayCV: "20/07/2026", thuLyMoi: "54682424",
      thamPhan: "CV kiến nghị GĐT, TT",
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hảo", ndd: "NGUYỄN TRUNG HOÀ",
      soBA: "CVKN_GDT", ngayBA: "20/07/2026",
      toa: "Tòa án nhân dân cấp cao tại Hà Nội",
      loaiAn: "Hình sự",
    },
    {
      maDon: "6967", soCV: "515", ngayCV: "21/07/2026", thuLyMoi: "54682425",
      thamPhan: "CV kiến nghị GĐT, TT",
      nguoiKhieuNai: "Trần Văn Hòa", biCao: "Nguyễn Thị Lan", ndd: "LÝ VĂN MINH",
      soBA: "123/2026/DS-ST", ngayBA: "21/07/2026",
      toa: "Tòa án nhân dân tỉnh Hà Nam",
      loaiAn: "Dân sự",
      quanHePhapLuat: "Tranh chấp hợp đồng vay tài sản",
    },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "5px 8px", fontSize: 12,
    border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none",
  };

  const duongSuHeader =
    userRole === "vu-1" || userRole === "hinh-su"
      ? "Người khiếu nại & Bị cáo"
      : userRole === "vu-4" || userRole === "hanh-chinh"
        ? "Người khởi kiện & Người bị kiện"
        : userRole === "vu-2" || userRole === "vu-3" || userRole === "dan-su"
          ? "Nguyên đơn & Bị đơn"
          : "Đương sự và người đứng đơn";

  const baHeader = isVu234(userRole)
    ? "Thông tin BA/QĐ đề nghị GĐT,TT & QHPL"
    : "Thông tin BA/QĐ để nghị GĐT,TT";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F }}>
        Trang chủ › Quản lý án GĐT/TT › Nhận đơn và TL vụ án › Giao tiểu hồ sơ
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", borderBottom: `2px solid ${BORDER}`, padding: "0 20px" }}>
        {subTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            style={{
              padding: "12px 20px", fontSize: 13, fontFamily: F, fontWeight: 500,
              background: "none", border: "none", cursor: "pointer",
              color: subTab === t.id ? RED : MUTED,
              borderBottom: subTab === t.id ? `2px solid ${RED}` : "2px solid transparent",
              marginBottom: -2,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div style={{ padding: "12px 20px", background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
          {["Người đứng đơn", "Số bản án/quyết định", "Ngày bản án/quyết định", "Tòa ra bản án/quyết định", "Ngày nhận đơn", "Thụ lý đơn"].map((lbl) => (
            <div key={lbl} style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 110 }}>
              <span style={{ fontSize: 11, color: MUTED, marginBottom: 2, fontFamily: F }}>{lbl}</span>
              <input placeholder={lbl} style={inputStyle} />
            </div>
          ))}
        </div>
        {expanded && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
            {["Số công văn chuyển", "Ngày công văn chuyển", "Thẩm phán", "Loại án", "Giao tiểu hồ sơ", "Thẩm tra viên"].map((lbl) => (
              <div key={lbl} style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 110 }}>
                <span style={{ fontSize: 11, color: MUTED, marginBottom: 2, fontFamily: F }}>{lbl}</span>
                <input placeholder={lbl} style={inputStyle} />
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setExpanded((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#2563eb", fontFamily: F }}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} {expanded ? "Thu gọn" : "Mở rộng"}
          </button>
          <div style={{ flex: 1 }} />
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            <Search size={13} /> Tìm kiếm
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <RotateCcw size={13} /> Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 40 }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "7%" }} />
          </colgroup>
          <thead>
            <tr>
              {["STT", "Thông tin đơn", duongSuHeader, baHeader, "Người giao VPHCTP", "Người nhận Vụ GĐ,KT", "Ngày Vụ nhận", "TTV nhận", "Ngày TTV nhận", "Ghi chú"].map((h) => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {giaoCases.map((gc, idx) => {
              const { label1, label2 } = getPartyLabels(gc.loaiAn, userRole);
              const showQHPL = isVu234(userRole, gc.loaiAn);
              const qhpl = getQuanHePhapLuat(gc);
              return (
                <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 13 }}>{idx + 1}</td>
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F }}>Mã đơn: {gc.maDon}</span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>CV chuyển: {gc.soCV} - {gc.ngayCV}</span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Thụ lý mới: {gc.thuLyMoi}</span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Hình thức: {gc.thamPhan}</span>
                    </div>
                  </td>
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: TEXT }}>{label1}: </span><span style={{ fontWeight: 600, color: TEXT }}>{gc.nguoiKhieuNai}</span></span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: TEXT }}>{label2}: </span><span style={{ fontWeight: 600, color: TEXT }}>{gc.biCao}</span></span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: TEXT }}>NĐD: </span><span style={{ fontWeight: 600, color: TEXT }}>{gc.ndd}</span></span>
                    </div>
                  </td>
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 11, fontFamily: F }}>
                        <span style={{ color: TEXT }}>Số BA: </span>
                        <span style={{ color: "#2563eb", fontWeight: 600 }}>{formatSoBA(gc.soBA, gc.loaiAn)}</span>
                        <span style={{ color: TEXT }}> Ngày: </span>
                        <span style={{ color: "#2563eb" }}>{gc.ngayBA}</span>
                      </span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: TEXT }}>Tại: </span>{gc.toa}</span>
                      {showQHPL && (
                        <span style={{ fontSize: 11, color: "#047857", fontWeight: 500, fontFamily: F }}>
                          <span style={{ color: TEXT, fontWeight: 400 }}>QHPL: </span>{qhpl}
                        </span>
                      )}
                    </div>
                  </td>
                  {["Chọn người giao", "Chọn người nhận", "dd/mm/yyyy", "Chọn người nhận", "dd/mm/yyyy", "Nhập ghi chú"].map((ph) => (
                    <td key={ph} style={TD_STYLE}>
                      <input placeholder={ph} style={{ width: "100%", padding: "5px 8px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none" }} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff" }}>
          <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>Hiển thị 1–2 trong tổng 2 bản ghi</span>
          <button style={paginBtn} disabled>‹</button>
          <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
          <button style={paginBtn}>›</button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}><option>10 / trang</option></select>
          <div style={{ flex: 1 }} />
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            <Save size={13} /> Lưu
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", background: "#0f766e", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            <Printer size={13} /> In danh sách
          </button>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <X size={13} /> Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────

function Breadcrumb({ extra }: { extra?: string }) {
  return (
    <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0 }}>
      Trang chủ › Quản lý án GĐT/TT › Nhận đơn và TL vụ án{extra ? ` › ${extra}` : ""} › Danh sách
    </div>
  );
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

function TabBar({
  activeTab,
  onTabChange,
  userRole,
}: {
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
  userRole?: UserRoleType;
}) {
  return (
    <div
      style={{
        display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`,
        background: "#fff", padding: "0 20px", flexShrink: 0,
        flexWrap: "wrap",
      }}
    >
      {TAB_CONFIG.map((t) => {
        const active = t.id === activeTab;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _count = countByTab(t.id as TabId, userRole);
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id as TabId)}
            style={{
              padding: "12px 16px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400,
              background: "none", border: "none", cursor: "pointer",
              color: active ? RED : MUTED,
              borderBottom: active ? `2px solid ${RED}` : "2px solid transparent",
              marginBottom: -1, whiteSpace: "nowrap",
              transition: "color 0.15s",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Main "Nhận đơn và TL vụ án" view ─────────────────────────────────────────

export default function NhanDonTLVuAnView({
  userRole,
  activeTab,
  setActiveTab,
  filterExpanded,
  setFilterExpanded,
  onGiaoTieuHoSo,
  onThemHoSo,
  onInBaoCao,
}: {
  userRole?: UserRoleType;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  filterExpanded: boolean;
  setFilterExpanded: (v: boolean | ((prev: boolean) => boolean)) => void;
  onGiaoTieuHoSo: () => void;
  onThemHoSo: () => void;
  onInBaoCao?: (tabId: TabId) => void;
}) {
  return (
    <>
      <Breadcrumb />
      <TabBar activeTab={activeTab} userRole={userRole} onTabChange={setActiveTab} />
      <SearchFilterPanel expanded={filterExpanded} userRole={userRole} onToggle={() => setFilterExpanded((v) => !v)} />
      <ActionBar tab={activeTab} onGiaoTieuHoSo={onGiaoTieuHoSo} onInBaoCao={() => onInBaoCao?.(activeTab)} />
      <CaseTable tab={activeTab} userRole={userRole} onGiaoTieuHoSo={onGiaoTieuHoSo} onThemHoSo={onThemHoSo} />
    </>
  );
}
