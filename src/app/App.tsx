import React, { useState } from "react";
import {
  Search, Grid3X3, Bell, Moon, RefreshCw, Eye,
  ChevronDown, ChevronUp, RotateCcw, X, Save, Printer,
  FileText, List, Users, FolderOpen, CheckCircle2, Files, Archive, Send, Calendar,
  ArrowLeftRight, FileSpreadsheet, Paperclip, FolderPlus, Trash2,
} from "lucide-react";
import Sidebar, { type View } from "./Sidebar";
import {
  TAB_CONFIG, getCasesByTab,
  type DonCase, type TabId, type VuAnAction,
} from "./data";
import ThemHoSoScreen from "@/imports/ThemHồSơKnChiTiết";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, StatusBadge, VuAnBtn, Tag } from "./shared";
import { formatSoBA } from "./AppHelpers";
import { SectionCard, InfoGrid, TabThongTin } from "./TabThongTin";
import { HoSoToTrinhModal, TrinhKyModal } from "./TrinhKyModal";
import { TaoDuThaoModal } from "./TaoDuThaoModal";
import { ThemKetQuaModal } from "./ThemKetQuaModal";
import PhanCongHDXXView from "./PhanCongHDXXView";
import CongVanTraoDoiView, { XemBieuMauCongVanModal } from "./CongVanTraoDoiView";
import QuanLyVuXetXuView from "./QuanLyVuXetXuView";
import PheDuyetDeXuatView from "./PheDuyetDeXuatView";
import { SearchFilterPanel } from "./SearchFilterPanel";

// ── Thông tin đơn cell ───────────────────────────────────────────────────────

function CellThongTinDon({ c }: { c: DonCase }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {c.type === "don" ? (
        <>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F }}>
            Mã đơn: {c.maDon}
          </span>
          {c.daThuLy ? (
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Đã thụ lý</span>
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
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Thẩm phán {c.trangThai !== "da-co-vu-an" && <span style={{ color: MUTED }}>(Dự kiến)</span>}: {" "}
            {c.thamPhan} ({c.capThamPhan})
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
            Thẩm phán{" "}
            {c.trangThai !== "da-co-vu-an" && <span style={{ color: MUTED }}>(Dự kiến)</span>}: {" "}
            {c.thamPhan} ({c.capThamPhan})
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

function CellDuongSu({ c }: { c: DonCase }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {c.nguoiKhieuNai && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: MUTED }}>Nguyên đơn: </span>{c.nguoiKhieuNai}
        </span>
      )}
      {c.biCao && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: MUTED }}>Bị đơn: </span>{c.biCao}
        </span>
      )}
      {c.ndd && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: MUTED }}>NĐD: </span>{c.ndd}
        </span>
      )}
      {c.nguoiKhangNghi && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          <span style={{ color: MUTED }}>Người kháng nghị: </span>{c.nguoiKhangNghi}
        </span>
      )}
    </div>
  );
}

// ── BA/QĐ cell ───────────────────────────────────────────────────────────────

function CellBA({ c }: { c: DonCase }) {
  if (!c.soBA && !c.toa) return <span style={{ color: MUTED, fontSize: 11, fontFamily: F }}>-</span>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {c.soBA && (
        <span style={{ fontSize: 11, color: "#2563eb", fontFamily: F }}>
          Số BA: {formatSoBA(c.soBA, c.loaiAn)}{c.ngayBA ? ` Ngày: ${c.ngayBA}` : ""}
        </span>
      )}
      {c.toa && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Tại: {c.toa}
        </span>
      )}
      {/* {c.capXetXu } */}
      {c.hoiDongThamPhanPhucTham && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          HĐTP cấp phúc thẩm: {c.hoiDongThamPhanPhucTham}
        </span>
      )}
      {c.thamPhanChuToaPhucTham && (
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
          Thẩm phán chủ tọa cấp phúc thẩm: {c.thamPhanChuToaPhucTham}
        </span>
      )}
    </div>
  );
}

// ── Thông tin vụ án cell ─────────────────────────────────────────────────────

function CellVuAn({ c, onThemHoSo }: { c: DonCase; onThemHoSo?: () => void }) {
  const isFaded = !!c.thamPhan && !!c.maVuAn;
  const hasGiaiQuyet = !!(c.thongBaoBoSung || c.ttvGiaiQuyet || c.tpGiaiQuyet);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {c.maVuAn && (
        <div style={{ textAlign: "left", opacity: isFaded ? 0.4 : 1 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: TEXT, fontFamily: F, display: "block" }}>
            Mã vụ án: {c.maVuAn}
          </span>
          {c.tenVuAn && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, lineHeight: 1.4, display: "block" }}>
              Tên vụ án: {c.tenVuAn}
            </span>
          )}
          {c.ttv && (
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block" }}>
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
            color={y.decision === "thuy-moi" ? "#065f46" : "#991b1b"}
            bg={y.decision === "thuy-moi" ? "#d1fae5" : "#fee2e2"}
          >
            {y.decision === "thuy-moi" ? "Thụy mới" : "Không thụ lý"}
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

function CellNhanTra({ c }: { c: DonCase }) {
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
}: {
  tab: TabId;
  onGiaoTieuHoSo: () => void;
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

// ── Main list table ───────────────────────────────────────────────────────────

function CaseTable({
  tab,
  onGiaoTieuHoSo,
  onThemHoSo,
  overrideCases,
}: {
  tab: TabId;
  onGiaoTieuHoSo: () => void;
  onThemHoSo: () => void;
  overrideCases?: DonCase[];
}) {
  const cases = overrideCases ?? getCasesByTab(tab);

  const lastColHeader =
    tab === "cho-y-kien" ? "Ý KIẾN LÃNH ĐẠO" : "THÔNG TIN VỤ ÁN";

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
            <th style={TH_STYLE}>ĐƯƠNG SỰ & NGƯỜI ĐỨNG ĐƠN</th>
            <th style={TH_STYLE}>THÔNG TIN BA/QĐ ĐỂ NGHỊ GĐT,TT</th>
            <th style={TH_STYLE}>{lastColHeader}</th>
            <th style={TH_STYLE}>THÔNG TIN NHẬN/TRẢ</th>
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
              <td style={TD_STYLE}><CellThongTinDon c={c} /></td>
              <td style={TD_STYLE}><CellDuongSu c={c} /></td>
              <td style={TD_STYLE}><CellBA c={c} /></td>
              <td style={TD_STYLE}>
                {tab === "cho-y-kien" ? (
                  <CellYKienLD c={c} />
                ) : (
                  <CellVuAn c={c} onThemHoSo={onThemHoSo} />
                )}
              </td>
              <td style={TD_STYLE}><CellNhanTra c={c} /></td>
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

const paginBtn: React.CSSProperties = {
  padding: "3px 9px", border: `1px solid ${BORDER}`, borderRadius: 4,
  background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F,
};

// ── Giao tiểu hồ sơ view ─────────────────────────────────────────────────────

function GiaoTieuHoSoView({ onClose }: { onClose: () => void }) {
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
    },
    {
      maDon: "6966", soCV: "514", ngayCV: "20/07/2026", thuLyMoi: "54682424",
      thamPhan: "CV kiến nghị GĐT, TT",
      nguoiKhieuNai: "Đỗ Tất Đạt", biCao: "Vũ Hoa Hảo", ndd: "NGUYỄN TRUNG HOÀ",
      soBA: "CVKN_GDT", ngayBA: "20/07/2026",
      toa: "Tòa án nhân dân cấp cao tại Hà Nội",
    },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "5px 8px", fontSize: 12,
    border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none",
  };

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
              {["STT", "Thông tin đơn", "Đương sự và người đứng đơn", "Thông tin BA/QĐ để nghị GĐT,TT", "Người giao VPHCTP", "Người nhận Vụ GĐ,KT", "Ngày Vụ nhận", "TTV nhận", "Ngày TTV nhận", "Ghi chú"].map((h) => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {giaoCases.map((gc, idx) => (
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
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: MUTED }}>Nguyên đơn: </span>{gc.nguoiKhieuNai}</span>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: MUTED }}>Bị đơn: </span>{gc.biCao}</span>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: MUTED }}>NĐD: </span>{gc.ndd}</span>
                  </div>
                </td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 11, color: "#2563eb", fontFamily: F }}>Số BA: {formatSoBA(gc.soBA, gc.loaiAn)} Ngày: {gc.ngayBA}</span>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Tại: {gc.toa}</span>
                    {/* <CapXetXu label="Sơ thẩm" /> */}
                  </div>
                </td>
                {["Chọn người giao", "Chọn người nhận", "dd/mm/yyyy", "Chọn người nhận", "dd/mm/yyyy", "Nhập ghi chú"].map((ph) => (
                  <td key={ph} style={TD_STYLE}>
                    <input placeholder={ph} style={{ width: "100%", padding: "5px 8px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none" }} />
                  </td>
                ))}
              </tr>
            ))}
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

// ── Top bar ───────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        gap: 10, padding: "0 20px", height: 48,
        borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0,
      }}
    >
      <Search size={17} color={MUTED} style={{ cursor: "pointer" }} />
      <Grid3X3 size={17} color={MUTED} style={{ cursor: "pointer" }} />
      <span style={{ position: "relative" }}>
        <Bell size={17} color={MUTED} style={{ cursor: "pointer" }} />
        <span style={{
          position: "absolute", top: -5, right: -6,
          background: RED, color: "#fff", borderRadius: 20,
          fontSize: 9, padding: "1px 4px", fontFamily: F, fontWeight: 700,
        }}>3</span>
      </span>
      <Moon size={17} color={MUTED} style={{ cursor: "pointer" }} />
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: "#d1d5db", display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", fontSize: 12, color: "#374151", fontFamily: F, fontWeight: 600,
      }}>
        A
      </div>
    </div>
  );
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
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
            {t.label}{" "}
            <span style={{
              display: "inline-flex", alignItems: "center",
              padding: "1px 6px", borderRadius: 20, fontSize: 11,
              background: active ? RED : "#e5e7eb",
              color: active ? "#fff" : MUTED,
              fontWeight: 600, marginLeft: 2,
            }}>
              {t.count}
            </span>
          </button>
        );
      })}
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

// ── Phân công TTV ────────────────────────────────────────────────────────────

const TTV_CASES = [
  {
    id: 1,
    tag: null,
    soThuLy: "2329146",
    ngayThuLy: "04/06/2026",
    soBA: "BA 040626",
    ngayBA: "01/06/2026",
    toa: "Tòa án nhân dân thành phố Đà Nẵng",
    capXetXu: "Phúc thẩm",
    nguoiKhieuNai: "ThuLTH",
    biCao: "Nguyễn A",
    ndd: "ThuLTH",
    thamTraVien: "GD Giải quyết đơn",
    lanhDao: "GD Giải quyết đơn",
  },
  {
    id: 2,
    tag: "da-co-vu-giai-quyet",
    soThuLy: "2329146",
    ngayThuLy: "04/06/2026",
    soBA: "BA 040626",
    ngayBA: "01/06/2026",
    toa: "Tòa án nhân dân thành phố Đà Nẵng",
    capXetXu: "Phúc thẩm",
    nguoiKhieuNai: "ThuLTH",
    biCao: "Nguyễn A",
    ndd: "ThuLTH",
    thamTraVien: "GD Giải quyết đơn",
    lanhDao: "GD Giải quyết đơn",
  },
];

const DA_PHAN_CONG_CASES = [
  {
    id: 1,
    tag: null,
    soThuLy: "2329146",
    ngayThuLy: "04/06/2026",
    soBA: "BA 040626",
    ngayBA: "01/06/2026",
    toa: "Tòa án nhân dân thành phố Đà Nẵng",
    capXetXu: "Phúc thẩm",
    nguoiKhieuNai: "ThuLTH",
    biCao: "Nguyễn A",
    ndd: "ThuLTH",
    ngayTTVNhanTHS: "24/07/2026",
    ngayPhanCongTTV: "24/07/2026",
    thamTraVien: "Lý Chiến Thắng",
    ngayPhanCongLD: "24/07/2026",
    lanhDao: "GD Xét xử GĐT",
  },
  {
    id: 2,
    tag: "da-co-vu-giai-quyet",
    soThuLy: "2329146",
    ngayThuLy: "04/06/2026",
    soBA: "BA 040626",
    ngayBA: "01/06/2026",
    toa: "Tòa án nhân dân thành phố Đà Nẵng",
    capXetXu: "Phúc thẩm",
    nguoiKhieuNai: "ThuLTH",
    biCao: "Nguyễn A",
    ndd: "ThuLTH",
    ngayTTVNhanTHS: "22/07/2026",
    ngayPhanCongTTV: "22/07/2026",
    thamTraVien: "Lý Chiến Thắng",
    ngayPhanCongLD: "22/07/2026",
    lanhDao: "GD Xét xử GĐT",
  },
];

function PhanCongTTVView() {
  const [mainTab, setMainTab] = useState<"chua" | "da">("chua");
  const [mode, setMode] = useState<"ngau-nhien" | "chi-dinh">("ngau-nhien");
  const [filterExpanded, setFilterExpanded] = useState(false);

  const inputSt: React.CSSProperties = {
    width: "100%", padding: "6px 10px", fontSize: 12,
    border: `1px solid ${BORDER}`, borderRadius: 4,
    fontFamily: F, color: TEXT, outline: "none", background: "#fff",
  };
  const selectSt: React.CSSProperties = { ...inputSt, cursor: "pointer" };

  const fld = (label: string, type: "input" | "select" | "date" = "input", ph = "") => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 120 }}>
      <span style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 3 }}>{label}</span>
      {type === "select"
        ? <select style={selectSt}><option value="">{ph || "Vui lòng chọn"}</option></select>
        : <input type="text" placeholder={ph || label} style={inputSt} />}
    </div>
  );

  const cases = mainTab === "chua" ? TTV_CASES : DA_PHAN_CONG_CASES;

  const TH: React.CSSProperties = {
    ...TH_STYLE, fontSize: 11,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        Trang chủ › Quản lý án GĐT/TT › Danh sách phân công TTV
      </div>

      {/* Main tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, background: "#fff", padding: "0 20px", flexShrink: 0 }}>
        {[
          { id: "chua", label: "Chưa phân công TTV", count: "1" },
          { id: "da", label: "Đã phân công TTV", count: null },
        ].map((t) => {
          const active = mainTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setMainTab(t.id as "chua" | "da")}
              style={{
                padding: "12px 18px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400,
                background: "none", border: "none", cursor: "pointer",
                color: active ? RED : MUTED,
                borderBottom: active ? `2px solid ${RED}` : "2px solid transparent",
                marginBottom: -1, whiteSpace: "nowrap",
              }}
            >
              {t.label}
              {t.count && (
                <span style={{
                  marginLeft: 4, padding: "1px 6px", borderRadius: 20, fontSize: 11,
                  background: active ? RED : "#e5e7eb",
                  color: active ? "#fff" : MUTED, fontWeight: 600,
                }}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter panel */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 20px", flexShrink: 0 }}>
        {/* Radio */}
        <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
          {[
            { id: "ngau-nhien", label: "Phân công ngẫu nhiên" },
            { id: "chi-dinh", label: "Phân công chỉ định" },
          ].map((r) => (
            <label key={r.id} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}>
              <input
                type="radio"
                name="phan-cong-mode"
                checked={mode === r.id}
                onChange={() => setMode(r.id as "ngau-nhien" | "chi-dinh")}
                style={{ accentColor: RED, cursor: "pointer" }}
              />
              {r.label}
            </label>
          ))}
        </div>

        {/* Filter rows */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          {/* Ngày thụ lý range */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 160 }}>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 3 }}>Ngày thụ lý</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input placeholder="Từ ngày" style={{ ...inputSt, flex: 1 }} />
              <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>→</span>
              <input placeholder="Đến ngày" style={{ ...inputSt, flex: 1 }} />
            </div>
          </div>
          {fld("Số thụ lý", "input", "Số thụ lý")}
          {fld("Loại án", "select")}
          {fld("Giai đoạn", "select")}
        </div>

        {filterExpanded && (
          <>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              {fld("Tòa ra bản án/quyết định", "select", "Chọn tòa ra bản án/quyết định")}
              {fld("Số bản án/quyết định", "input", "Nhập số bản án/quyết định")}
              {fld("Ngày bản án/quyết định", "input", "Vui lòng chọn")}
              {fld("NKN/Người khiếu nại", "input", "Nhập tên")}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              {fld("Bị cáo", "input", "Nhập tên")}
              {(mode === "chi-dinh" || mainTab === "da") && fld("Thẩm tra viên", mainTab === "da" ? "input" : "select", mainTab === "da" ? "Nhập tên" : "Chọn thẩm tra viên")}
              {(mode === "chi-dinh" || mainTab === "da") && fld("Lãnh đạo phụ trách", "select", "Chọn lãnh đạo phụ trách")}
            </div>
          </>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setFilterExpanded((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#2563eb", fontFamily: F }}
          >
            {filterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {filterExpanded ? "Thu gọn" : "Mở rộng"}
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

      {/* Action bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "#fff", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ flex: 1 }} />
        {mainTab === "da" ? (
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#0f766e", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            Tạo phiếu ký
          </button>
        ) : (
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            Phân công
          </button>
        )}
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
          <Printer size={13} /> In báo cáo
        </button>
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
          <RefreshCw size={13} color={MUTED} />
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 48 }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: 48 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={TH}><input type="checkbox" /></th>
              <th style={TH}>STT</th>
              <th style={TH}>Số & Ngày thụ lý</th>
              <th style={TH}>Thông tin bản án/quyết định và QHPL</th>
              <th style={TH}>Đương sự</th>
              <th style={TH}>Ngày TTV nhận THS</th>
              <th style={TH}>Ngày phân công TTV</th>
              <th style={TH}>Thẩm tra viên</th>
              <th style={TH}>Ngày phân công LĐ</th>
              <th style={TH}>Lãnh đạo</th>
              <th style={{ ...TH, textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c, idx) => (
              <tr
                key={c.id}
                style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
              >
                <td style={{ ...TD_STYLE, textAlign: "center" }}><input type="checkbox" /></td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 13 }}>{idx + 1}</td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {"tag" in c && c.tag === "da-co-vu-giai-quyet" && (
                      <Badge color="#fff" bg={RED}>Đã có vụ giải quyết</Badge>
                    )}
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Số: <b>{c.soThuLy}</b></span>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày TL: {c.ngayThuLy}</span>
                  </div>
                </td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 11, color: "#2563eb", fontFamily: F }}>
                      Số BA: {formatSoBA(c.soBA, c.loaiAn)} Ngày: {c.ngayBA}
                    </span>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Tại: {c.toa}</span>
                    {/* <CapXetXu label={c.capXetXu} /> */}
                  </div>
                </td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: MUTED }}>Nguyên đơn: </span>{c.nguoiKhieuNai}</span>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: MUTED }}>Bị đơn: </span>{c.biCao}</span>
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: MUTED }}>NĐD: </span>{c.ndd}</span>
                  </div>
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>
                  {"ngayTTVNhanTHS" in c ? c.ngayTTVNhanTHS || "-" : "-"}
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>
                  {"ngayPhanCongTTV" in c ? c.ngayPhanCongTTV || "-" : "-"}
                </td>
                <td style={TD_STYLE}>
                  {mode === "chi-dinh" && mainTab === "chua" ? (
                    <select style={{ width: "100%", padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none" }}>
                      <option value="">Chọn thẩm tra viên</option>
                      <option>Lý Chiến Thắng</option>
                      <option>Lê Chiến Thắng</option>
                      <option>GD Giải quyết đơn</option>
                    </select>
                  ) : (
                    <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>{c.thamTraVien}</span>
                  )}
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>
                  {"ngayPhanCongLD" in c ? c.ngayPhanCongLD || "-" : "-"}
                </td>
                <td style={{ ...TD_STYLE }}>
                  <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>{c.lanhDao}</span>
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4 }} title="Xem chi tiết">
                    <Eye size={15} color="#6b7280" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1–{cases.length} trong tổng {cases.length} bản ghi</span>
          <div style={{ flex: 1 }} />
          <button style={paginBtn} disabled>‹</button>
          <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
          <button style={paginBtn}>›</button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}>
            <option>10 / trang</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ── Cấu hình TTV báo cáo ─────────────────────────────────────────────────────

const CAU_HINH_DATA = [
  { id: 1, hoTen: "Bùi Nguyễn Khánh (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Tiến Mạnh - Phó Vụ trưởng" },
  { id: 2, hoTen: "Bùi Quang Huy (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 3, hoTen: "Bùi Thị Vân Anh (TP)", chucDanh: "Thẩm phán bậc 1", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 4, hoTen: "Bùi Việt Anh (TP)", chucDanh: "Thẩm phán bậc 2", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 5, hoTen: "Chi Thị Đức (TK)", chucDanh: "Thẩm tra viên", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 6, hoTen: "Chu Thị Thoam (TP)", chucDanh: "Thẩm tra viên", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 7, hoTen: "Chị Thị Nhụng (TTV)", chucDanh: "Thẩm tra viên", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 8, hoTen: "Dương Thảo Phương (TTV)", chucDanh: "Thẩm tra viên", nghiepVu: "Giải quyết án", lanhDao: "" },
  { id: 9, hoTen: "Giáng Tiêu Thọ (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "" },
  { id: 10, hoTen: "Hoàng Ngô An (TK)", chucDanh: "Thư ký Tòa án", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 11, hoTen: "Hoàng Ngọc Điệu (TTV)", chucDanh: "Thẩm tra viên chính", nghiepVu: "Giải quyết án", lanhDao: "Trần Quốc Hành - Phó Vụ trưởng" },
  { id: 12, hoTen: "Hoàng Thanh Thủy (TK)", chucDanh: "Thẩm tra viên", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 13, hoTen: "Hoàng Thị Nhã Phương (TTV)", chucDanh: "Thẩm tra viên", nghiepVu: "Giải quyết án", lanhDao: "Nguyễn Văn Hiền - Phó Vụ trưởng" },
  { id: 14, hoTen: "Lê Thanh Tùng (TTV)", chucDanh: "Thẩm tra viên", nghiepVu: "Xử lý nghiệp vụ", lanhDao: "" },
];

const CHUC_DANH_OPTIONS = ["Thư ký Tòa án", "Thẩm phán bậc 1", "Thẩm phán bậc 2", "Thẩm tra viên", "Thẩm tra viên chính", "Thẩm tra viên cao cấp"];
const NGHIEP_VU_OPTIONS = ["Giải quyết án", "Xử lý nghiệp vụ", "Báo cáo thống kê"];
const LANH_DAO_OPTIONS = [
  "Nguyễn Tiến Mạnh - Phó Vụ trưởng",
  "Nguyễn Văn Hiền - Phó Vụ trưởng",
  "Trần Quốc Hành - Phó Vụ trưởng",
  "GD Xét xử GĐT",
];

function CauHinhTTVView() {
  const [showBanner, setShowBanner] = useState(true);
  const [rows, setRows] = useState(CAU_HINH_DATA.map((r) => ({ ...r })));

  const selSt: React.CSSProperties = {
    width: "100%", padding: "5px 6px", fontSize: 11,
    border: `1px solid ${BORDER}`, borderRadius: 4,
    fontFamily: F, outline: "none", background: "#fff", cursor: "pointer",
  };

  const update = (id: number, key: keyof typeof CAU_HINH_DATA[0], val: string) =>
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [key]: val } : r));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
        Trang chủ › Quản lý án GĐT/TT › Cấu hình TTV báo cáo
      </div>

      {/* Filter bar */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 140 }}>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Lãnh đạo</span>
            <select style={selSt}>
              <option value="">- Tất cả -</option>
              {LANH_DAO_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 140 }}>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Thẩm tra viên</span>
            <select style={selSt}>
              <option value="">- Tất cả -</option>
              {CAU_HINH_DATA.map((r) => <option key={r.id}>{r.hoTen}</option>)}
            </select>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            <Search size={13} /> Tìm kiếm
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <Printer size={13} /> In biểu mẫu
          </button>
        </div>
      </div>

      {/* Banner + Lưu cấu hình */}
      <div style={{ padding: "8px 20px", background: BG, flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
        {showBanner && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 6, fontSize: 12, color: "#166534", fontFamily: F, fontWeight: 500 }}>
            <span style={{ fontSize: 16 }}>✓</span>
            Cập nhật dữ liệu thành công!
            <button onClick={() => setShowBanner(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#166534", fontSize: 16, lineHeight: 1 }}>×</button>
          </div>
        )}
        {!showBanner && <div style={{ flex: 1 }} />}
        <button
          onClick={() => setShowBanner(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F, flexShrink: 0 }}
        >
          <Save size={13} /> Lưu cấu hình
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 44 }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "28%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr>
              <th style={TH_STYLE}>STT</th>
              <th style={TH_STYLE}>Họ và tên</th>
              <th style={TH_STYLE}>Chức danh</th>
              <th style={TH_STYLE}>Nghiệp vụ Thẩm tra viên</th>
              <th style={TH_STYLE}>Lãnh đạo</th>
              <th style={TH_STYLE}>Người thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr
                key={r.id}
                style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
              >
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.id}</td>
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, fontWeight: 500 }}>{r.hoTen}</td>
                <td style={TD_STYLE}>
                  <select value={r.chucDanh} onChange={(e) => update(r.id, "chucDanh", e.target.value)} style={selSt}>
                    {CHUC_DANH_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td style={TD_STYLE}>
                  <select value={r.nghiepVu} onChange={(e) => update(r.id, "nghiepVu", e.target.value)} style={selSt}>
                    {NGHIEP_VU_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td style={TD_STYLE}>
                  <select value={r.lanhDao} onChange={(e) => update(r.id, "lanhDao", e.target.value)} style={selSt}>
                    <option value="">- Tất cả -</option>
                    {LANH_DAO_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td style={TD_STYLE}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>Nguyễn Văn A</span>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>11/06/2026</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1–{rows.length} trong tổng {rows.length} bản ghi</span>
          <div style={{ flex: 1 }} />
          <button style={paginBtn} disabled>‹</button>
          <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
          <button style={paginBtn}>›</button>
          <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}>
            <option>10 / trang</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ── Quản lý vụ án ─────────────────────────────────────────────────────────────

interface VuAnRow {
  stt: number; lan: string;
  soThuLy: string; ngayThuLy: string;
  soBA: string; ngayBA: string;
  toa: string; capXetXu: string;
  extraTags: string[];
  anLoai?: "dan-su";
  nkn: string; biCao: string; ndd: string;
  ttv: string; lanhDao: string;
  kqgq: "chua-phan-cong" | "trinh-pho-chanh-an";
  kqGiaiQuyet: "chua-co" | "da-co" | "da-co-con-don";
  soToTrinh: number;
}

interface VuAnGroup {
  id: string; maSo: string;
  tenVuAn: string; soVuAnGiaiQuyet: number;
  rows: VuAnRow[];
}

const VU_AN_LIST: VuAnGroup[] = [
  {
    id: "VA26-002621", maSo: "VA26-002621",
    tenVuAn: "Vụ án Đặng Thị Dương – Tội cố ý gây thương tích",
    soVuAnGiaiQuyet: 2,
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "5:44682424", ngayThuLy: "20/07/2026",
        soBA: "CVKN_GDT", ngayBA: "20/07/2026",
        toa: "Tòa án nhân dân cấp cao tại Hà Nội", capXetXu: "Tái thẩm",
        extraTags: ["Tiếp nhận đơn"],
        anLoai: "dan-su",
        nkn: "Đặng Thị Dương", biCao: "Hoàng Ngọc Hoa", ndd: "Lập Thái Phúc",
        ttv: "Lý Thái Phúc", lanhDao: "GD Giải quyết đơn",
        kqgq: "chua-phan-cong", kqGiaiQuyet: "chua-co", soToTrinh: 0,
      },
      {
        stt: 2, lan: "Lần 2: Số đơn 1 (1 đơn TLM)",
        soThuLy: "5:44682425", ngayThuLy: "22/07/2026",
        soBA: "CVKN_GDT", ngayBA: "20/07/2026",
        toa: "Tòa án nhân dân cấp cao tại Hà Nội", capXetXu: "Tái thẩm",
        extraTags: [],
        nkn: "Đặng Thị Dương", biCao: "Hoàng Ngọc Hoa", ndd: "Lập Thái Phúc",
        ttv: "Lý Thái Phúc", lanhDao: "GD Giải quyết đơn",
        kqgq: "trinh-pho-chanh-an", kqGiaiQuyet: "da-co", soToTrinh: 1,
      },
    ],
  },
  {
    id: "VA26-002138", maSo: "VA26-002138",
    tenVuAn: "Vụ án Hoàng Hoa Thám – Tội cố ý gây thương tích",
    soVuAnGiaiQuyet: 3,
    rows: [
      {
        stt: 3, lan: "Lần 1: Số đơn 3 (1 đơn TLM)",
        soThuLy: "5:4684H06", ngayThuLy: "07/07/2026",
        soBA: "5A648139", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân cấp cao – Bắc Ninh", capXetXu: "Phúc thẩm",
        extraTags: [],
        anLoai: "dan-su",
        nkn: "Phạm Ngọc Hoa", biCao: "Hoàng Hoa Vân", ndd: "Hoàng Hoa Vân",
        ttv: "Vũ Biêu Thư", lanhDao: "Lê Thị Bình Ngọc",
        kqgq: "trinh-pho-chanh-an", kqGiaiQuyet: "da-co-con-don", soToTrinh: 2,
      },
      {
        stt: 2, lan: "Lần 2: Số đơn 2 (1 đơn TLM)",
        soThuLy: "5:4684606", ngayThuLy: "07/07/2026",
        soBA: "5A648139", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân cấp cao – Bắc Ninh", capXetXu: "Phúc thẩm",
        extraTags: [],
        nkn: "Phạm Ngọc Hoa", biCao: "Hoàng Hoa Vân", ndd: "Hoàng Hoa Vân",
        ttv: "Nguyễn Thị Bình", lanhDao: "Lê Thị Bình Ngọc",
        kqgq: "chua-phan-cong", kqGiaiQuyet: "da-co", soToTrinh: 1,
      },
      {
        stt: 1, lan: "Lần 1: Số đơn 2 (1 đơn TLM)",
        soThuLy: "5:4684606", ngayThuLy: "07/07/2026",
        soBA: "5A648139", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân cấp cao – Bắc Ninh", capXetXu: "Phúc thẩm",
        extraTags: [],
        anLoai: "dan-su",
        nkn: "Phạm Ngọc Hoa", biCao: "Hoàng Hoa Vân", ndd: "Hoàng Hoa Vân",
        ttv: "Vũ Biêu Thư", lanhDao: "Lê Thị Bình Ngọc",
        kqgq: "chua-phan-cong", kqGiaiQuyet: "chua-co", soToTrinh: 0,
      },
    ],
  },
];

export interface VuAnDetailData {
  maVuAn: string; tenVuAn: string;
  loaiBienAn: string; namGiaiQuyet: string;
  soNgayBanAn: string; loaiAn: string; toaXetXu: string;
  danhSachDon: Array<{
    stt: number; maDon: string; thongTinGQ: string;
    soThuLy: string; ngayThuLy: string; ngayNhan: string;
    nguoiDung: string; phanLoai: string; loaiDon: string; noiDung: string;
  }>;
  muonTraHoSo: Array<{
    stt: number; loaiPhieu: string; soPhieu: string; soBuLuc: string;
    ngayGhiPhieu: string; ngayTao: string; canBo: string; chucVu: string;
    donVi: string; nguoiKyDuyet: string; trangThaiKy: string; ghiChu: string;
  }>;
}

const VU_AN_DETAILS: Record<string, VuAnDetailData> = {
  "VA26-002621": {
    maVuAn: "VA26-002039", tenVuAn: "Nguyễn Văn Minh – Tội cướp tài sản",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "12/4/2026/HSPT – 30/12/2025", loaiAn: "Dân sự",
    toaXetXu: "Tòa án nhân dân cấp cao tại Hà Nội",
    danhSachDon: [
      { stt: 1, maDon: "6988", thongTinGQ: "Thụ lý mới", soThuLy: "5434565D", ngayThuLy: "21/07/2026", ngayNhan: "21/07/2026", nguoiDung: "Nguyễn Văn Minh", phanLoai: "Đơn đề nghị GĐT.TT", loaiDon: "DON_CHINH", noiDung: "Đề nghị xem xét bản án theo thủ tục Giám đốc thẩm vì cho rằng có vi phạm nghiêm trọng trong việc đánh giá chứng cứ; chưa xem xét đầy đủ các tình tiết giảm nhẹ và có địa thiếu tố áp dụng theo quy định..." },
      { stt: 2, maDon: "7005", thongTinGQ: "Đã thụ lý", soThuLy: "", ngayThuLy: "", ngayNhan: "21/07/2026", nguoiDung: "Nguyễn Văn Minh", phanLoai: "Đơn đề nghị GĐT.TT", loaiDon: "DON_TRUNG", noiDung: "Đề nghị xem xét bản án theo thủ tục Giám đốc thẩm vì cho rằng có vi phạm nghiêm trọng trong việc đánh giá chứng cứ; chưa xem xét đầy đủ các tình tiết giảm nhẹ..." },
      { stt: 3, maDon: "7004", thongTinGQ: "Đã thụ lý", soThuLy: "", ngayThuLy: "", ngayNhan: "21/07/2026", nguoiDung: "Nguyễn Văn Minh", phanLoai: "Đơn đề nghị GĐT.TT", loaiDon: "DON_TRUNG", noiDung: "Đề nghị xem xét bản án theo thủ tục Giám đốc thẩm vì cho rằng có vi phạm nghiêm trọng trong việc đánh giá chứng cứ; chưa xem xét đầy đủ các tình tiết giảm nhẹ..." },
    ],
    muonTraHoSo: [
      { stt: 1, loaiPhieu: "Phiếu mượn", soPhieu: "PM-2026-001", soBuLuc: "12", ngayGhiPhieu: "20/07/2026", ngayTao: "20/07/2026", canBo: "Lý Thái Phúc", chucVu: "Thẩm tra viên", donVi: "Viện kiểm sát nhân dân tối cao", nguoiKyDuyet: "Nguyễn Văn A – Vụ trưởng", trangThaiKy: "Đã ký", ghiChu: "Kèm hồ sơ vụ án" },
      { stt: 2, loaiPhieu: "Phiếu trả", soPhieu: "PT-2026-001", soBuLuc: "12", ngayGhiPhieu: "25/07/2026", ngayTao: "25/07/2026", canBo: "Lý Thái Phúc", chucVu: "Thẩm tra viên", donVi: "Viện kiểm sát nhân dân tối cao", nguoiKyDuyet: "Nguyễn Văn A – Vụ trưởng", trangThaiKy: "Chờ ký", ghiChu: "Trả hồ sơ sau khi nghiên cứu" },
    ],
  },
  "VA26-002138": {
    maVuAn: "VA26-002138", tenVuAn: "Phùng Văn Nam – Tội cố ý gây thương tích hoặc gây tổn hại cho sức khoẻ của người khác",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "12/4/2026/HSPT – 30/12/2025", loaiAn: "Hình sự",
    toaXetXu: "Tòa án nhân dân cấp cao tại Hà Nội",
    danhSachDon: [],
    muonTraHoSo: [
      { stt: 1, loaiPhieu: "Phiếu mượn", soPhieu: "–", soBuLuc: "–", ngayGhiPhieu: "–", ngayTao: "24/07/2026", canBo: "Vũ Xuân Hiển", chucVu: "Thẩm tra viên chính", donVi: "Viện kiểm sát nhân dân khu vực 11", nguoiKyDuyet: "Nguyễn Văn A – Vụ trưởng", trangThaiKy: "Chờ ký", ghiChu: "Ghi chú" },
    ],
  },
};

// ── Quản lý vụ án – List view ─────────────────────────────────────────────────

type VuAnTabId = "tat-ca" | "khang-nghi" | "vks-giai-quyet" | "tra-lai-don";

function QuanLyVuAnView({ onSelectVuAn }: { onSelectVuAn: (id: string, tab?: ChiTietTab) => void }) {
  const [activeTab, setActiveTab] = useState<VuAnTabId>("tat-ca");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [collapsedLan, setCollapsedLan] = useState<Record<string, boolean>>({});

  const tabs = [
    { id: "tat-ca", label: "Tất cả", count: 17 },
    { id: "khang-nghi", label: "Kháng nghị", count: 3 },
    { id: "vks-giai-quyet", label: "VKS giải quyết", count: 0 },
    { id: "tra-lai-don", label: "Trả lại đơn", count: 2 },
  ];

  const inSt: React.CSSProperties = { padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff" };
  const selSt: React.CSSProperties = { ...inSt, cursor: "pointer" };

  const fld = (lbl: string, type: "input" | "select" = "input", ph = "") => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 110 }}>
      <span style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 3 }}>{lbl}</span>
      {type === "select"
        ? <select style={selSt}><option>– Tất cả –</option></select>
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
        Trang chủ › Quản lý án GĐT/TT › Quản lý vụ án
      </div>

      {/* Title + Tabs */}
      <div style={{ background: "#fff", padding: "14px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: "0 0 10px" }}>Quản lý vụ án</h2>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {tabs.map((t) => {
            const active = t.id === activeTab;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id as VuAnTabId)}
                style={{ padding: "10px 16px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400, background: "none", border: "none", cursor: "pointer", color: active ? RED : MUTED, borderBottom: active ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" }}>
                {t.label}{" "}
                <span style={{ padding: "1px 6px", borderRadius: 20, fontSize: 11, background: active ? RED : "#e5e7eb", color: active ? "#fff" : MUTED, fontWeight: 600 }}>{t.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          {fld("Số BA/QĐ", "input", "Nhập số BA/QĐ")}
          {fld("NKN/Người khiếu nại", "input", "Nhập tên")}
          {dateRange("Tòa ra BA/QĐ")}
          {dateRange("Thụ lý từ ngày")}
          {dateRange("Tổ trình từ ngày")}
          {fld("Trạng thái hồ sơ", "select")}
        </div>
        {filterExpanded && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            {fld("Kết quả thụ lý", "select")}
            {fld("Loại án", "select")}
            {fld("Tòa ra BA/QĐ", "select")}
            {fld("Ngày BA/QĐ", "input", "dd/mm/yyyy")}
            {fld("Bị cáo/Bị can", "input", "Nhập tên")}
            {fld("Thuộc án", "select")}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setFilterExpanded((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#2563eb", fontFamily: F }}>
            {filterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {filterExpanded ? "Thu gọn" : "Mở rộng"}
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
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 36 }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: 48 }} />
          </colgroup>
          <thead>
            <tr>
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
            {VU_AN_LIST.map((group, groupIdx) => {
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
                          onClick={(e) => { e.stopPropagation(); onSelectVuAn(group.id); }}
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
                                <span style={{ fontSize: 11, color: "#2563eb", fontFamily: F }}>Số BA: {formatSoBA(row.soBA, row.loaiAn)} Ngày: {row.ngayBA}</span>
                                <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Tại: {row.toa}</span>
                                <CapXetXu label={row.capXetXu} />
                                {row.anLoai === "chi-dao" && <Badge color="#92400e" bg="#fef3c7">Án chỉ đạo</Badge>}
                                {/* {row.anLoai === "tu-hinh" && <Badge color="#7f1d1d" bg="#fee2e2">Án tử hình</Badge>} */}
                                {row.anLoai === "quoc-hoi" && <Badge color="#3730a3" bg="#e0e7ff">Án QH</Badge>}
                              </div>
                            </td>
                            <td style={TD_STYLE}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Nguyên đơn: </span>{row.nkn}</span>
                                <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Bị đơn: </span>{row.biCao}</span>
                                <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>NĐD: </span>{row.ndd}</span>
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
                                {/* 2. Kết quả giải quyết */}
                                {row.kqGiaiQuyet === "chua-co" && <Badge color="#991b1b" bg="#fee2e2">Chưa có kết quả</Badge>}
                                {row.kqGiaiQuyet === "da-co" && <Badge color="#065f46" bg="#d1fae5">Đã có kết quả</Badge>}
                                {row.kqGiaiQuyet === "da-co-con-don" && <Badge color="#92400e" bg="#fef3c7">Đã có KQ nhưng vẫn còn đơn TLM</Badge>}
                                {/* 3. Danh sách tờ trình */}
                                <button
                                  onClick={(e) => { e.stopPropagation(); onSelectVuAn(group.id, "to-trinh"); }}
                                  style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 0", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#2563eb", fontFamily: F, textDecoration: "underline", textUnderlineOffset: 2, alignSelf: "flex-start" }}>
                                  <FileText size={11} />
                                  {row.soToTrinh > 0 ? `${row.soToTrinh} tờ trình` : "Tờ trình"}
                                </button>
                              </div>
                            </td>
                            <td style={{ ...TD_STYLE, textAlign: "center" }}>
                              <button onClick={() => onSelectVuAn(group.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4 }} title="Xem chi tiết">
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
          <span>Hiển thị 1–4 trong tổng 17 bản ghi</span>
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

// ── Quản lý khiếu nại – List view (giống Quản lý vụ án) ───────────────────────

type KhieuNaiTabId = "tat-ca" | "dang-giai-quyet" | "da-giai-quyet" | "qua-han";

function QuanLyKhieuNaiView({ onSelectKhieuNai }: { onSelectKhieuNai: (id: string, tab?: ChiTietTab) => void }) {
  const [activeTab, setActiveTab] = useState<KhieuNaiTabId>("tat-ca");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [collapsedLan, setCollapsedLan] = useState<Record<string, boolean>>({});

  const tabs = [
    { id: "tat-ca", label: "Tất cả", count: 17 },
    { id: "dang-giai-quyet", label: "Đang giải quyết", count: 12 },
    { id: "da-giai-quyet", label: "Đã giải quyết", count: 3 },
    { id: "qua-han", label: "Quá hạn giải quyết", count: 2 },
  ];

  const inSt: React.CSSProperties = { padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff" };
  const selSt: React.CSSProperties = { ...inSt, cursor: "pointer" };

  const fld = (lbl: string, type: "input" | "select" = "input", ph = "") => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 110 }}>
      <span style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 3 }}>{lbl}</span>
      {type === "select"
        ? <select style={selSt}><option>– Tất cả –</option></select>
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
        <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: "0 0 10px" }}>Danh sách khiếu nại</h2>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {tabs.map((t) => {
            const active = t.id === activeTab;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id as KhieuNaiTabId)}
                style={{ padding: "10px 16px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400, background: "none", border: "none", cursor: "pointer", color: active ? RED : MUTED, borderBottom: active ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" }}>
                {t.label}{" "}
                <span style={{ padding: "1px 6px", borderRadius: 20, fontSize: 11, background: active ? RED : "#e5e7eb", color: active ? "#fff" : MUTED, fontWeight: 600 }}>{t.count}</span>
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
            {fld("Kết quả thụ lý", "select")}
            {fld("Loại án", "select")}
            {fld("Tòa ra BA/QĐ", "select")}
            {fld("Ngày BA/QĐ", "input", "dd/mm/yyyy")}
            {fld("Người bị khiếu nại", "input", "Nhập tên")}
            {fld("Thuộc án", "select")}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setFilterExpanded((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#2563eb", fontFamily: F }}>
            {filterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {filterExpanded ? "Thu gọn" : "Mở rộng"}
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
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 36 }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: 48 }} />
          </colgroup>
          <thead>
            <tr>
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
            {VU_AN_LIST.map((group, groupIdx) => {
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
                                <span style={{ fontSize: 11, color: "#2563eb", fontFamily: F }}>Số BA: {formatSoBA(row.soBA, row.loaiAn)} Ngày: {row.ngayBA}</span>
                                <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Tại: {row.toa}</span>
                                <CapXetXu label={row.capXetXu} />
                                {row.anLoai === "chi-dao" || "" && <Badge color="#92400e" bg="#fef3c7">Án chỉ đạo</Badge>}
                                {/* {row.anLoai === "tu-hinh" && <Badge color="#7f1d1d" bg="#fee2e2">Án tử hình</Badge>} */}
                                {row.anLoai === "quoc-hoi" && <Badge color="#3730a3" bg="#e0e7ff">Án QH</Badge>}
                              </div>
                            </td>
                            <td style={TD_STYLE}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Nguyên đơn: </span>{row.nkn}</span>
                                <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>Bị đơn: </span>{row.biCao}</span>
                                <span style={{ fontSize: 11, fontFamily: F }}><span style={{ color: MUTED }}>NĐD: </span>{row.ndd}</span>
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
                                {/* 2. Kết quả giải quyết */}
                                {row.kqGiaiQuyet === "chua-co" && <Badge color="#991b1b" bg="#fee2e2">Chưa có kết quả</Badge>}
                                {row.kqGiaiQuyet === "da-co" && <Badge color="#065f46" bg="#d1fae5">Đã có kết quả</Badge>}
                                {row.kqGiaiQuyet === "da-co-con-don" && <Badge color="#92400e" bg="#fef3c7">Đã có KQ nhưng vẫn còn đơn TLM</Badge>}
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
          <span>Hiển thị 1–4 trong tổng 17 bản ghi</span>
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

// ── Chi tiết vụ án ─────────────────────────────────────────────────────────────

type ChiTietTab = "thong-tin" | "danh-sach-don" | "phan-cong" | "muon-tra-ho-so" | "to-trinh" | "giai-quyet-vb" | "tai-lieu" | "ho-so-luu-tru";

function TabDanhSachDon({ detail }: { detail: VuAnDetailData }) {
  return (
    <div style={{ padding: 20 }}>
      {/* Thông tin chung */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: "16px 20px", marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, margin: "0 0 12px" }}>Thông tin chung của vụ án</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px 28px" }}>
          {([
            ["Mã vụ án", detail.maVuAn],
            ["Loại biện án", detail.loaiBienAn],
            ["Năm giải quyết", detail.namGiaiQuyet],
            ["Số – Ngày bản án", detail.soNgayBanAn],
            ["Loại án", detail.loaiAn],
            ["Tòa xét xử án", detail.toaXetXu],
          ] as const).map(([lbl, val]) => (
            <div key={lbl} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{lbl}</span>
              <span style={{ fontSize: 12, color: TEXT, fontFamily: F, fontWeight: 500 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danh sách đơn table */}
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
            <col style={{ width: 40 }} /><col style={{ width: 60 }} />
            <col style={{ width: "18%" }} /><col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} /><col style={{ width: "16%" }} />
            <col style={{ width: "30%" }} /><col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              {["STT", "Mã đơn", "Thông tin giải quyết đơn", "Ngày nhận đơn", "Người dùng đơn", "Phân loại", "Nội dung", "Thao tác"].map((h) => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detail.danhSachDon.length === 0 && (
              <tr><td colSpan={8} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>Không có dữ liệu</td></tr>
            )}
            {detail.danhSachDon.map((d, idx) => (
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
                    <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>{d.phanLoai}</span>
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

function TaoPhieuModal({ onClose }: { onClose: () => void }) {
  const [loaiPhieu, setLoaiPhieu] = useState("Phiếu mượn");
  const [showBieuMau, setShowBieuMau] = useState(false);
  const [ghiChu, setGhiChu] = useState("");
  const [diinhKem, setDinhKem] = useState(false);
  const [noiNhanRows, setNoiNhanRows] = useState([
    { id: 1, noiNhan: "Viện kiểm sát", chiTiet: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án", editing: false },
  ]);
  const [addingRow, setAddingRow] = useState(false);
  const [newRow, setNewRow] = useState({ noiNhan: "", chiTiet: "", ghiChu: "" });

  const inSt: React.CSSProperties = { padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box" };
  const selSt: React.CSSProperties = { ...inSt, cursor: "pointer" };
  const lbl = (text: string, required = false) => (
    <span style={{ fontSize: 11, color: MUTED, fontFamily: F, marginBottom: 3, display: "block" }}>
      {required && <span style={{ color: RED }}>* </span>}{text}
    </span>
  );

  if (showBieuMau) {
    return <XemBieuMauScreen onClose={() => setShowBieuMau(false)} />;
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 940, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 24 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 14 }}>✏</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Tạo phiếu</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}><X size={18} color={MUTED} /></button>
        </div>

        <div style={{ padding: "16px 20px", overflowY: "auto" }}>
          {/* Info card */}
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

          {/* Loại phiếu */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ color: RED, fontSize: 14 }}>⊟</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Loại phiếu</span>
            </div>
            <div style={{ maxWidth: 300 }}>
              {lbl("Loại phiếu", true)}
              <select value={loaiPhieu} onChange={e => setLoaiPhieu(e.target.value)} style={selSt}>
                <option>Phiếu mượn</option>
                <option>Phiếu trả</option>
              </select>
            </div>
          </div>

          {/* Thông tin quyết định */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <span style={{ color: RED, fontSize: 14 }}>⊟</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin quyết định</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px 14px", marginBottom: 10 }}>
              <div>
                {lbl("Ngày lập phiếu", true)}
                <div style={{ position: "relative" }}>
                  <input placeholder="Chọn ngày quyết định" style={inSt} />
                </div>
              </div>
              <div>
                {lbl("Số phiếu")}
                <input placeholder="Nhập số quyết định" style={inSt} />
              </div>
              <div>
                {lbl("Người ký ban hành", true)}
                <select style={selSt}><option value="">Chọn người ký</option><option>Nguyễn Văn A</option></select>
              </div>
              <div>
                {lbl("Số bút lục")}
                <input placeholder="Nhập số bút lục" style={inSt} />
              </div>
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
              {lbl("Ghi chú")}
              <textarea value={ghiChu} onChange={e => setGhiChu(e.target.value)} placeholder="Nhập ghi chú"
                style={{ ...inSt, minHeight: 56, resize: "vertical" }} />
            </div>
          </div>

          {/* Nơi nhận */}
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
                        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#2563eb", fontFamily: F, display: "flex", alignItems: "center", gap: 3 }}>
                          ✏ Sửa
                        </button>
                        <button
                          onClick={() => setNoiNhanRows(p => p.filter(x => x.id !== r.id))}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#ef4444", fontFamily: F, display: "flex", alignItems: "center", gap: 3 }}>
                          🗑 Xóa
                        </button>
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
                        <button
                          onClick={() => {
                            if (newRow.noiNhan) {
                              setNoiNhanRows(p => [...p, { id: Date.now(), ...newRow, editing: false }]);
                              setNewRow({ noiNhan: "", chiTiet: "", ghiChu: "" });
                              setAddingRow(false);
                            }
                          }}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#0f766e", fontFamily: F, fontWeight: 600 }}>Lưu</button>
                        <button
                          onClick={() => { setAddingRow(false); setNewRow({ noiNhan: "", chiTiet: "", ghiChu: "" }); }}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: MUTED, fontFamily: F }}>Hủy</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Toggle đính kèm */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div
              onClick={() => setDinhKem(v => !v)}
              style={{ width: 36, height: 20, borderRadius: 10, background: diinhKem ? "#0f766e" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 2, left: diinhKem ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
            <span style={{ fontSize: 12, color: TEXT, fontFamily: F }}>Đính kèm tài liệu, hồ sơ</span>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 4, borderTop: `1px solid ${BORDER}` }}>
            <button onClick={onClose} style={{ padding: "7px 20px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
            <button style={{ padding: "7px 20px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Lưu</button>
            <button style={{ padding: "7px 20px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Lấy số</button>
            <button style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Trình ký</button>
            <button onClick={() => setShowBieuMau(true)} style={{ padding: "7px 20px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Xem biểu mẫu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabMuonTraHoSo({ detail }: { detail: VuAnDetailData }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div style={{ padding: 20 }}>
      {showModal && <TaoPhieuModal onClose={() => setShowModal(false)} />}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: F }}>Tổng số phiếu: {detail.muonTraHoSo.length}</span>
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
            {detail.muonTraHoSo.length === 0 && (
              <tr><td colSpan={11} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>Không có dữ liệu</td></tr>
            )}
            {detail.muonTraHoSo.map((r, idx) => (
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

      {/* Thông tin chung của vụ án */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "10px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "16%" }} /><col style={{ width: "34%" }} />
            <col style={{ width: "16%" }} /><col style={{ width: "34%" }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Mã vụ án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>VA26-002039: Nguyễn Văn Minh – Tội cướp tài sản</td>
              <td style={{ ...TD_STYLE, background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Loại bản án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>Sơ thẩm</td>
            </tr>
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Thủ tục giải quyết</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Giám đốc thẩm</td>
              <td style={{ ...TD_STYLE, background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Số – Ngày bản án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>BA_2107 – 21/07/2026</td>
            </tr>
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}` }}>Loại án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}` }}>Hình sự</td>
              <td style={{ ...TD_STYLE, background: BG, fontSize: 11, color: MUTED, fontWeight: 600, borderRight: `1px solid ${BORDER}` }}>Tòa ra bản án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>Tòa án nhân dân khu vực 5 – Bắc Ninh</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Lịch sử phân công Thẩm phán */}
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

      {/* Lịch sử phân công TTV và LĐV */}
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

// ── Tạo tờ trình modal ────────────────────────────────────────────────────────
function TaoToTrinhModal({
  onClose,
  onSave,
  onKySo
}: {
  onClose: () => void;
  onSave?: (data: { daDinhKemHoSo: boolean; countHoSo: number }) => void;
  onKySo?: () => void;
}) {
  const [ngayLap, setNgayLap] = useState("");
  const [dienBien, setDienBien] = useState("");
  const [noiDungDeXuat, setNoiDungDeXuat] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [daKySo, setDaKySo] = useState(false);
  const [daLaySo, setDaLaySo] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showBieuMau, setShowBieuMau] = useState(false);

  const [selectedHoSo, setSelectedHoSo] = useState([
    { id: 1, ten: "Hồ sơ công văn số 32/CV-TAND (Bản quét gốc PDF)", dungLuong: "2.4 MB", checked: true },
    { id: 2, ten: "Dự thảo Công văn trao đổi nghiệp vụ gửi TAND tỉnh Thanh Hóa (.docx)", dungLuong: "145 KB", checked: true },
    { id: 3, ten: "Biên bản tổng hợp ý kiến vướng mắc áp dụng pháp luật", dungLuong: "520 KB", checked: true },
    { id: 4, ten: "Tài liệu đính kèm vụ án thụ lý số 32", dungLuong: "1.8 MB", checked: false },
  ]);

  const toggleHoSo = (id: number) => {
    setSelectedHoSo(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddCustomFile = () => {
    const fileName = prompt("Nhập tên file tài liệu/hồ sơ đính kèm mới:");
    if (fileName && fileName.trim()) {
      setSelectedHoSo(prev => [
        ...prev,
        { id: Date.now(), ten: fileName.trim(), dungLuong: "Vừa tải lên", checked: true }
      ]);
    }
  };

  const RBORDER = "#f3c9c9";
  const inSt: React.CSSProperties = {
    padding: "8px 12px",
    fontSize: 13,
    border: `1px solid ${RBORDER}`,
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    width: "100%",
    background: "#fff",
    boxSizing: "border-box"
  };
  const fieldLbl: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
    fontFamily: F,
    display: "block",
    marginBottom: 6
  };

  const handleSave = () => {
    const countHoSo = selectedHoSo.filter(h => h.checked).length;
    const daDinhKemHoSo = countHoSo > 0;
    setIsSaved(true);
    if (onSave) {
      onSave({ daDinhKemHoSo, countHoSo });
    }
    alert("Đã lưu thông tin tờ trình thành công!");
  };

  const handleKySoModal = () => {
    setDaKySo(true);
    if (onKySo) {
      onKySo();
    }
    alert("Đã ký số tờ trình thành công!");
  };

  const handleTrinhKyModalClick = () => {
    if (!daKySo) {
      alert("⚠️ Cảnh báo: Người tạo văn bản phải thực hiện KÝ SỐ trước khi ấn Trình ký!");
      return;
    }
    setShowTrinhKy(true);
  };

  const handleToggleLaySo = () => {
    if (!daLaySo) {
      setDaLaySo(true);
      alert("Đã cấp số tờ trình thành công: 05/TTr-TAND!");
    } else {
      setDaLaySo(false);
      alert("Đã hủy cấp số tờ trình!");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1400, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showBieuMau && <XemBieuMauCongVanModal onClose={() => setShowBieuMau(false)} />}

      <div style={{ background: "#fff", borderRadius: 8, width: "100%", maxWidth: 880, boxShadow: "0 10px 40px rgba(0,0,0,0.2)", marginBottom: 24, overflow: "hidden" }}>
        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Thêm mới tờ trình</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Top Info Banner Card */}
          <div style={{ background: "#fcf5f5", border: `1px solid ${RBORDER}`, borderRadius: 4, padding: "14px 18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px 24px", fontSize: 13, fontFamily: F }}>
              <div>
                <span style={{ color: "#0284c7", fontWeight: 700 }}>Số CV / Tờ trình : </span>
                <span style={{ color: daLaySo ? "#166534" : TEXT, fontWeight: daLaySo ? 700 : 400 }}>{daLaySo ? "05/TTr-TAND" : "32/CV-TAND"}</span>
              </div>
              <div>
                <span style={{ color: "#0284c7", fontWeight: 700 }}>Số thụ lý : </span>
                <span style={{ color: TEXT }}>32</span>
              </div>
              <div>
                <span style={{ color: "#0284c7", fontWeight: 700 }}>Đơn vị gửi : </span>
                <span style={{ color: TEXT }}>Tòa án nhân dân tỉnh Thanh Hóa</span>
              </div>
              <div>
                <span style={{ color: "#0284c7", fontWeight: 700 }}>Ngày CV : </span>
                <span style={{ color: TEXT }}>02/07/2026</span>
              </div>
              <div>
                <span style={{ color: "#0284c7", fontWeight: 700 }}>Ngày thụ lý : </span>
                <span style={{ color: TEXT }}>02/07/2026</span>
              </div>
            </div>
          </div>

          {/* Ngày lập tờ trình */}
          <div>
            <label style={fieldLbl}>
              <span style={{ color: RED, marginRight: 3 }}>*</span>Ngày lập tờ trình
            </label>
            <div style={{ position: "relative", maxWidth: 260 }}>
              <input
                type="date"
                value={ngayLap}
                onChange={e => setNgayLap(e.target.value)}
                style={{ ...inSt, paddingRight: 36 }}
              />
              <Calendar size={18} color="#6b7280" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* II. THÔNG TIN CÔNG VĂN */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 12, borderBottom: `1px solid ${RBORDER}`, paddingBottom: 6 }}>
              II. THÔNG TIN CÔNG VĂN
            </div>
            <label style={fieldLbl}>
              <span style={{ color: RED, marginRight: 3 }}>*</span>Diễn biến quá trình giải quyết
            </label>
            <textarea
              value={dienBien}
              onChange={e => setDienBien(e.target.value)}
              placeholder="Nhập quá trình giải quyết vụ án"
              style={{ ...inSt, minHeight: 100, resize: "vertical" }}
            />
          </div>

          {/* III. ĐỀ XUẤT XỬ LÝ */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, marginBottom: 12, borderBottom: `1px solid ${RBORDER}`, paddingBottom: 6 }}>
              III. ĐỀ XUẤT XỬ LÝ
            </div>
            <label style={fieldLbl}>
              <span style={{ color: RED, marginRight: 3 }}>*</span>Nội dung
            </label>
            <textarea
              value={noiDungDeXuat}
              onChange={e => setNoiDungDeXuat(e.target.value)}
              placeholder="Nhập đề xuất xử lý"
              style={{ ...inSt, minHeight: 100, resize: "vertical" }}
            />
          </div>

          {/* Modal Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 16, borderTop: `1px solid ${BORDER}`, marginTop: 4 }}>
            <button
              onClick={onClose}
              style={{ padding: "7px 20px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, fontWeight: 500 }}>
              Đóng
            </button>

            {!isSaved ? (
              <button
                onClick={handleSave}
                style={{ padding: "7px 28px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>
                Lưu
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowBieuMau(true)}
                  style={{ padding: "7px 16px", background: "#fff", color: "#0284c7", border: "1px solid #0284c7", borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, fontWeight: 600 }}>
                  Xem biểu mẫu
                </button>

                <button
                  onClick={handleKySoModal}
                  disabled={daKySo}
                  style={{
                    padding: "7px 16px",
                    background: daKySo ? "#d1fae5" : "#166534",
                    color: daKySo ? "#065f46" : "#fff",
                    border: daKySo ? "1px solid #6ee7b7" : "none",
                    borderRadius: 4,
                    cursor: daKySo ? "default" : "pointer",
                    fontSize: 13,
                    fontFamily: F,
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4
                  }}>
                  {daKySo ? "✓ Đã ký số" : "✍ Ký số"}
                </button>

                <button
                  onClick={handleToggleLaySo}
                  style={{ padding: "7px 16px", background: daLaySo ? "#fff" : "#1d4ed8", color: daLaySo ? "#dc2626" : "#fff", border: daLaySo ? "1px solid #fca5a5" : "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F, fontWeight: 600 }}>
                  {daLaySo ? "Hủy lấy số" : "Lấy số"}
                </button>

                <button
                  onClick={() => setShowTrinhKy(true)}
                  style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F, display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <Send size={14} /> Trình ký
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Confirm thu hồi dialog ─────────────────────────────────────────────────────
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

// ── Tab Tờ trình ─────────────────────────────────────────────────────────────
function TabToTrinh() {
  const [showTaoTT, setShowTaoTT] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showHoSo, setShowHoSo] = useState(false);
  const [showTaoDuThao, setShowTaoDuThao] = useState(false);
  const [thuHoiIdx, setThuHoiIdx] = useState<number | null>(null);
  const [lichSuData, setLichSuData] = useState([
    { ngayTrinh: "10/07/2026", lanh: "Nguyễn Văn C", capTrinh: "Phó Chánh án", vanBan: "Tờ trình thẩm tra vụ án số 2", yKien: "–", ngayDuyet: "–", trangThai: "cho-duyet", subRows: [] as { label: string; ngayDuyet: string }[] },
    { ngayTrinh: "07/07/2026", lanh: "Nguyễn Văn A", capTrinh: "Thẩm phán", vanBan: "Tờ trình thẩm tra vụ án số 1", yKien: "Trả lời đơn: 009876 - Phạm Minh Tuấn\nTiếp đơn: 009879 - Nguyễn Văn An", ngayDuyet: "07/07/2026", trangThai: "da-duyet", subRows: [] },
    { ngayTrinh: "08/07/2026", lanh: "Nguyễn Văn B", capTrinh: "Thẩm phán", vanBan: "Tờ trình thẩm tra vụ án số 1", yKien: "Trả lời đơn: 009876 - Phạm Minh Tuấn", ngayDuyet: "08/07/2026", trangThai: "da-duyet", subRows: [{ label: "Dự thảo 01", ngayDuyet: "08/07/2026" }, { label: "Dự thảo 02", ngayDuyet: "08/07/2026" }] },
    { ngayTrinh: "06/07/2026", lanh: "Nguyễn Văn D", capTrinh: "Chánh án", vanBan: "Tờ trình thẩm tra vụ án số 1", yKien: "Tài liệu đính kèm chưa đầy đủ, đề nghị hoàn thiện hồ sơ trước khi trình lại", ngayDuyet: "06/07/2026", trangThai: "tu-choi", subRows: [] },
  ]);
  const [filterDon, setFilterDon] = useState("");
  const [filterVanBan, setFilterVanBan] = useState("");

  const [vanBanList, setVanBanList] = useState([
    { stt: 1, vanBan: "Tờ trình thẩm tra vụ án số 1", don: "09D732899 - Phạm Minh Tuấn\n09D732900 - Nguyễn Văn An", ngayTao: "05/07/2026", nguoiKy: "Nguyễn Văn A", trangThai: "Đã ký số", daDinhKemHoSo: true, soHoSo: 3 },
    { stt: 2, vanBan: "Thông báo trả lời đơn 0902345 số 1", don: "09D732899 - Phạm Minh Tuấn", ngayTao: "09/07/2026", nguoiKy: "Nguyễn Văn B", trangThai: "Đã phát hành", daDinhKemHoSo: true, soHoSo: 1 },
    { stt: 3, vanBan: "Thông báo trả lời đơn 0902344 số 2", don: "09D732900 - Nguyễn Văn An", ngayTao: "09/07/2026", nguoiKy: "–", trangThai: "Chờ ký số", daDinhKemHoSo: true, soHoSo: 1 },
  ]);

  const handleSaveToTrinh = (data?: { daDinhKemHoSo: boolean; countHoSo: number }) => {
    const toTrinhCount = vanBanList.filter(x => x.vanBan.includes("Tờ trình")).length + 1;
    const newStt = vanBanList.length + 1;
    const count = data?.countHoSo ?? 3;
    const isAttached = data?.daDinhKemHoSo ?? (count > 0);

    const newRow = {
      stt: newStt,
      vanBan: `Tờ trình thẩm tra vụ án số ${toTrinhCount}`,
      don: "09D732899 - Phạm Minh Tuấn",
      ngayTao: "07/08/2026",
      nguoiKy: "–",
      trangThai: "Chưa ký số",
      daDinhKemHoSo: isAttached,
      soHoSo: count
    };
    setVanBanList(prev => [newRow, ...prev.map((r, i) => ({ ...r, stt: i + 2 }))]);
    // Giữ nguyên popup mở sau khi lưu để hiển thị các nút Trình ký, Lấy số, Xem biểu mẫu
    if (!isAttached) {
      alert("Đã tạo tờ trình mới thành công! Lưu ý: Tờ trình hiện chưa được đính kèm hồ sơ. Bạn phải Đính kèm hồ sơ và Ký số trước khi thực hiện Trình văn bản.");
    } else {
      alert(`Đã tạo tờ trình mới thành công! Tờ trình đã được đính kèm ${count} hồ sơ/tài liệu. Vui lòng Ký số trước khi Trình văn bản.`);
    }
  };

  const handleKySo = (stt: number) => {
    setVanBanList(prev => prev.map(r => r.stt === stt ? { ...r, trangThai: "Đã ký số", nguoiKy: "Nguyễn Văn A (Người lập)" } : r));
    alert("Đã ký số văn bản thành công!");
  };

  const handleDeleteVanBan = (stt: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tờ trình chưa ký số này không?")) {
      setVanBanList(prev => prev.filter(r => r.stt !== stt));
    }
  };

  const handleTrinhVanBanClick = () => {
    // Check 1: Tờ trình phải đính kèm hồ sơ trước khi trình văn bản
    const hasMissingHoSo = vanBanList.some(r => r.vanBan.includes("Tờ trình") && (!r.daDinhKemHoSo || r.soHoSo === 0));
    if (hasMissingHoSo) {
      alert("⚠️ Cảnh báo: Tờ trình phải được đính kèm hồ sơ, tài liệu trước khi thực hiện Trình văn bản! Vui lòng chọn/đính kèm hồ sơ cho Tờ trình.");
      return;
    }

    // Check 2: Người tạo phải ký số trước khi trình văn bản
    const hasUnsigned = vanBanList.some(r => r.trangThai === "Chưa ký số" || r.trangThai === "Chờ ký số");
    if (hasUnsigned) {
      alert("⚠️ Cảnh báo: Người tạo văn bản phải thực hiện KÝ SỐ trước khi ấn Trình văn bản!");
      return;
    }
    setShowTrinhKy(true);
  };

  const allDonOptions = Array.from(new Set(
    lichSuData.flatMap(r => r.yKien === "–" ? [] : r.yKien.split("\n").map(s => s.trim()).filter(Boolean))
  ));
  const allVanBanOptions = Array.from(new Set(lichSuData.map(r => r.vanBan)));
  const filteredLichSu = lichSuData.filter(r => {
    const matchDon = !filterDon || r.yKien.includes(filterDon);
    const matchVanBan = !filterVanBan || r.vanBan === filterVanBan;
    return matchDon && matchVanBan;
  });

  const TH: React.CSSProperties = { padding: "8px 10px", background: BG, fontWeight: 700, fontSize: 11, color: "#374151", fontFamily: F, textAlign: "left", borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word" };
  const TD: React.CSSProperties = { padding: "9px 10px", fontSize: 12, color: TEXT, fontFamily: F, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, wordBreak: "break-word", overflowWrap: "break-word", verticalAlign: "top" };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      {showTaoTT && <TaoToTrinhModal onClose={() => setShowTaoTT(false)} onSave={handleSaveToTrinh} />}
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showHoSo && <HoSoToTrinhModal onClose={() => setShowHoSo(false)} />}
      {showTaoDuThao && <TaoDuThaoModal onClose={() => setShowTaoDuThao(false)} />}
      {thuHoiIdx !== null && (
        <ThuHoiConfirmDialog
          onClose={() => setThuHoiIdx(null)}
          onConfirm={() => { setLichSuData(p => p.filter((_, i) => i !== thuHoiIdx)); setThuHoiIdx(null); }}
        />
      )}

      {/* ── Văn bản ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách văn bản</span>
          <button onClick={handleTrinhVanBanClick} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}><Send size={13} /> Trình văn bản</button>
          <button onClick={() => setShowTaoDuThao(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>+ Tạo dự thảo</button>
          <button onClick={() => setShowTaoTT(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}><RefreshCw size={13} /> Tạo tờ trình</button>
          <button onClick={() => setShowHoSo(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}><Archive size={13} /> Hồ sơ tờ trình</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 520 }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: 110 }} />
            </colgroup>
            <thead>
              <tr>{["STT", "TÊN VĂN BẢN", "ĐƠN", "NGÀY TẠO", "NGƯỜI KÝ", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {vanBanList.map((r, idx) => (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD, textAlign: "center", color: MUTED }}>{idx + 1}</td>
                  <td style={{ ...TD, color: "#2563eb", fontWeight: 600 }}>{r.vanBan}</td>
                  <td style={{ ...TD, whiteSpace: "pre-line" as const }}>{r.don}</td>
                  <td style={TD}>{r.ngayTao}</td>
                  <td style={TD}>{r.nguoiKy}</td>
                  <td style={TD}>
                    {r.trangThai === "Chưa ký số" ? (
                      <Badge color="#991b1b" bg="#fee2e2">Chưa ký số</Badge>
                    ) : (
                      <Badge color={r.trangThai === "Đã phát hành" ? "#065f46" : r.trangThai === "Đã ký số" ? "#1e40af" : "#92400e"}
                        bg={r.trangThai === "Đã phát hành" ? "#d1fae5" : r.trangThai === "Đã ký số" ? "#dbeafe" : "#fef3c7"}>
                        {r.trangThai === "Chờ ký số" ? "Chờ ký" : r.trangThai}
                      </Badge>
                    )}
                  </td>
                  <td style={{ ...TD, textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      {(r.trangThai === "Chưa ký số" || r.trangThai === "Chờ ký số") && (
                        <button
                          onClick={() => handleDeleteVanBan(r.stt)}
                          title="Xóa tờ trình chưa ký số"
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 3, display: "inline-flex", alignItems: "center" }}
                        >
                          <Trash2 size={14} color="#dc2626" />
                        </button>
                      )}
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xem">
                        <Eye size={14} color="#0e7490" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Lịch sử trình ký ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Lịch sử trình ký</span>
          {/* Filter by đơn */}
          <select value={filterDon} onChange={e => setFilterDon(e.target.value)}
            style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
            <option value="">Lọc theo đơn</option>
            {allDonOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {/* Filter by văn bản */}
          <select value={filterVanBan} onChange={e => setFilterVanBan(e.target.value)}
            style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff", color: TEXT }}>
            <option value="">Lọc theo văn bản</option>
            {allVanBanOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 700 }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: 90 }} />
            </colgroup>
            <thead>
              <tr>{["STT", "NGÀY TRÌNH", "LÃNH ĐẠO ĐƯỢC TRÌNH", "CẤP TRÌNH", "VĂN BẢN", "Ý KIẾN/ĐƠN", "NGÀY DUYỆT", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredLichSu.map((r) => {
                const realIdx = lichSuData.indexOf(r);
                return (
                  <React.Fragment key={"main-" + realIdx}>
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
                        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem">
                            <Eye size={13} color="#0e7490" />
                          </button>
                          {r.trangThai === "cho-duyet" && (
                            <button title="Thu hồi" onClick={() => setThuHoiIdx(realIdx)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M2 8a6 6 0 1 0 1.5-3.9" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 4v4h4" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          )}
                          <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                            <Send size={13} color={RED} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {r.subRows.map((sub, si) => (
                      <tr key={"sub-" + realIdx + "-" + si} style={{ background: "#fafafa" }}>
                        <td style={{ ...TD, textAlign: "center", color: MUTED }} />
                        <td colSpan={3} style={{ ...TD, paddingLeft: 28, fontSize: 11, color: MUTED }}>↳ {sub.label}</td>
                        <td style={{ ...TD, fontSize: 11, color: MUTED }} colSpan={3}>Ngày: {sub.ngayDuyet}</td>
                        <td style={TD}><Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge></td>
                        <td style={{ ...TD, textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
                            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem">
                              <Eye size={13} color="#0e7490" />
                            </button>
                            <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                              <Send size={13} color={RED} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {showTrinhKy && <TrinhKyModal onClose={() => setShowTrinhKy(false)} />}
      {showTaoDuThao && <TaoDuThaoModal onClose={() => setShowTaoDuThao(false)} />}
      {thuHoiIdx !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 20, width: 360, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: TEXT }}>Xác nhận thu hồi</div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>Bạn có chắc chắn muốn thu hồi tờ trình này?</div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setThuHoiIdx(null)} style={{ padding: "5px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 12 }}>Hủy</button>
              <button onClick={() => { setLichSuData(prev => prev.filter((_, i) => i !== thuHoiIdx)); setThuHoiIdx(null); }} style={{ padding: "5px 12px", border: "none", borderRadius: 4, background: RED, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Thu hồi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab Giải quyết văn bản ───────────────────────────────────────────────────
function TabGiaiQuyetVB({ detail }: { detail: VuAnDetailData }) {
  const vbList = [
    { stt: 1, soVB: "12/TB-TANDTC", loaiVB: "Thông báo thụ lý đơn đề nghị GĐT", ngayBanHanh: "21/07/2026", nguoiKy: "Phan Văn Nam – Phó Chánh án", trangThai: "Đã ban hành", ghiChu: "Gửi nguyên đơn & VKS" },
    { stt: 2, soVB: "35/CV-GĐT", loaiVB: "Công văn yêu cầu chuyển hồ sơ vụ án", ngayBanHanh: "15/07/2026", nguoiKy: "Lê Hoàng Nam – Vụ trưởng Vụ 1", trangThai: "Đã gửi", ghiChu: "Yêu cầu TAND tỉnh Bắc Ninh chuyển hồ sơ gốc" },
    { stt: 3, soVB: "08/QĐ-GĐT", loaiVB: "Quyết định phân công Thẩm tra viên nghiên cứu", ngayBanHanh: "10/07/2026", nguoiKy: "Phan Văn Nam – Phó Chánh án", trangThai: "Đã duyệt", ghiChu: "Phân công TTV Hoàng Ngọc Chiêu" },
  ];
  return (
    <div style={{ padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách văn bản giải quyết ({vbList.length})</span>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            + Thêm văn bản mới
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr>
              {["STT", "SỐ VĂN BẢN", "LOẠI VĂN BẢN", "NGÀY BAN HÀNH", "NGƯỜI KÝ", "TRẠNG THÁI", "GHI CHÚ", "THAO TÁC"].map(h => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vbList.map((r, idx) => (
              <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{r.stt}</td>
                <td style={{ ...TD_STYLE, color: "#2563eb", fontWeight: 600 }}>{r.soVB}</td>
                <td style={{ ...TD_STYLE, color: TEXT }}>{r.loaiVB}</td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: TEXT }}>{r.ngayBanHanh}</td>
                <td style={{ ...TD_STYLE, color: TEXT }}>{r.nguoiKy}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}><Badge color="#065f46" bg="#d1fae5">{r.trangThai}</Badge></td>
                <td style={{ ...TD_STYLE, color: MUTED }}>{r.ghiChu}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }} title="Xem chi tiết"><Eye size={14} color="#0e7490" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab Tài liệu đính kèm ─────────────────────────────────────────────────────
function TabTaiLieu() {
  const docs = [
    { stt: 1, ten: "Bản án hình sự sơ thẩm số 124/2026/HS-ST (Bản quét gốc PDF)", dungLuong: "4.2 MB", loai: "PDF", ngayTai: "20/07/2026", nguoiTai: "Lý Thái Phúc (TTV)" },
    { stt: 2, ten: "Đơn đề nghị giám đốc thẩm của bà Đặng Thị Dương", dungLuong: "1.8 MB", loai: "PDF", ngayTai: "18/07/2026", nguoiTai: "Nguyễn Văn Hưng (Cán bộ)" },
    { stt: 3, ten: "Tài liệu chứng cứ bổ sung về biên bản khám nghiệm hiện trường", dungLuong: "6.5 MB", loai: "ZIP", ngayTai: "22/07/2026", nguoiTai: "Lý Thái Phúc (TTV)" },
    { stt: 4, ten: "Dự thảo Tờ trình thẩm tra vụ án (.docx)", dungLuong: "180 KB", loai: "DOCX", ngayTai: "25/07/2026", nguoiTai: "Lý Thái Phúc (TTV)" },
  ];
  return (
    <div style={{ padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Hồ sơ, tài liệu chứng cứ đính kèm ({docs.length})</span>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            + Tải lên tài liệu mới
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr>
              {["STT", "TÊN TÀI LIỆU", "ĐỊNH DẠNG", "DUNG LƯỢNG", "NGÀY TẢI LÊN", "NGƯỜI TẢI", "THAO TÁC"].map(h => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {docs.map((r, idx) => (
              <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{r.stt}</td>
                <td style={{ ...TD_STYLE, color: "#2563eb", fontWeight: 600 }}>📄 {r.ten}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}><Badge color="#1e40af" bg="#dbeafe">{r.loai}</Badge></td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED }}>{r.dungLuong}</td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: TEXT }}>{r.ngayTai}</td>
                <td style={{ ...TD_STYLE, color: TEXT }}>{r.nguoiTai}</td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 3, color: "#2563eb", fontSize: 12, fontWeight: 600, fontFamily: F }}>Tải về</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab Hồ sơ lưu trữ ────────────────────────────────────────────────────────
function TabHoSoLuuTru({ detail }: { detail: VuAnDetailData }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, padding: "20px 24px" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F, margin: "0 0 16px" }}>Thông tin quản lý và lưu trữ hồ sơ vụ án</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px 32px" }}>
          {[
            ["Mã định danh lưu trữ", "LT-2026-VA002621"],
            ["Kho lưu trữ", "Kho lưu trữ án GĐT – TANDTC Tầng 3 Nhà B"],
            ["Dãy / Kệ lưu trữ", "Kệ số 12 – Ngăn B3"],
            ["Hộp số / Cặp số", "Hộp HS-2026/045"],
            ["Cán bộ quản lý kho", "Nguyễn Văn Hưng – Văn thư Lưu trữ"],
            ["Tình trạng hồ sơ", "Đang được TTV mượn nghiên cứu (Phiếu mượn PM-2026-001)"],
            ["Số lượng tập hồ sơ", "03 tập – Tổng 480 bút lục"],
            ["Ngày nhập kho ban đầu", "20/07/2026"],
          ].map(([lbl, val]) => (
            <div key={lbl} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{lbl}</span>
              <span style={{ fontSize: 13, color: TEXT, fontFamily: F, fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Chi tiết vụ án View Component ───────────────────────────────────────────
function ChiTietVuAnView({
  vuAnId,
  onBack,
  initialTab = "danh-sach-don",
  moduleLabel = "Quản lý vụ án",
  detailLabel = "Chi tiết vụ án",
  entityWord = "Vụ án"
}: {
  vuAnId: string;
  onBack: () => void;
  initialTab?: ChiTietTab;
  moduleLabel?: string;
  detailLabel?: string;
  entityWord?: string;
}) {
  const [activeTab, setActiveTab] = useState<ChiTietTab>(initialTab);
  const detail = VU_AN_DETAILS[vuAnId] || VU_AN_DETAILS["VA26-002621"];

  const tabs: Array<{ id: ChiTietTab; label: string; count?: number }> = [
    { id: "thong-tin", label: "Thông tin chung" },
    { id: "danh-sach-don", label: "Danh sách đơn", count: detail?.danhSachDon?.length || 3 },
    { id: "phan-cong", label: "Phân công" },
    { id: "muon-tra-ho-so", label: "Mượn/trả hồ sơ", count: detail?.muonTraHoSo?.length || 2 },
    { id: "to-trinh", label: "Tờ trình", count: 3 },
    { id: "giai-quyet-vb", label: "Giải quyết văn bản", count: 3 },
    { id: "tai-lieu", label: "Tài liệu đính kèm", count: 4 },
    { id: "ho-so-luu-tru", label: "Hồ sơ lưu trữ" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc", overflow: "hidden", fontFamily: F }}>
      {/* Breadcrumb + Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", background: "#fff", color: RED,
              border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer",
              fontSize: 12, fontWeight: 700, fontFamily: F,
            }}
          >
            ← Quay lại danh sách
          </button>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: F }}>
            Trang chủ › Quản lý án GĐT/TT › {moduleLabel} › <b style={{ color: TEXT }}>{detailLabel}: {detail.maVuAn}</b>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>Tên {entityWord.toLowerCase()}:</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1e40af", fontFamily: F }}>{detail.tenVuAn}</span>
          <Badge color="#065f46" bg="#d1fae5">Đang giải quyết</Badge>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
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
              {t.count !== undefined && (
                <span
                  style={{
                    padding: "1px 6px", borderRadius: 12, fontSize: 10,
                    background: isActive ? RED : "#e2e8f0",
                    color: isActive ? "#fff" : MUTED, fontWeight: 700,
                  }}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "thong-tin" && <TabThongTin detail={detail} />}
        {activeTab === "danh-sach-don" && <TabDanhSachDon detail={detail} />}
        {activeTab === "phan-cong" && <TabPhanCong detail={detail} />}
        {activeTab === "muon-tra-ho-so" && <TabMuonTraHoSo detail={detail} />}
        {activeTab === "to-trinh" && <TabToTrinh />}
        {activeTab === "giai-quyet-vb" && <TabGiaiQuyetVB detail={detail} />}
        {activeTab === "tai-lieu" && <TabTaiLieu />}
        {activeTab === "ho-so-luu-tru" && <TabHoSoLuuTru detail={detail} />}
      </div>
    </div>
  );
}

function WordEditorView({ onBack, record }: { onBack: () => void; record?: any }) {
  const [fontSize, setFontSize] = useState("13pt");
  const [zoom, setZoom] = useState(100);

  // State active document type: "quyet-dinh-khang-nghi" | "cong-van-chuyen"
  const [activeDocType, setActiveDocType] = useState<"quyet-dinh-khang-nghi" | "cong-van-chuyen">("cong-van-chuyen");

  // State workflow: isSaved, hasNumber, isSubmitted, showPreviewModal, showTrinhKyModal
  const [isSaved, setIsSaved] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTrinhKyModal, setShowTrinhKyModal] = useState(false);

  // Field values dynamically mapped from record or user directives:
  const toaGiuHoSo = record?.toaGiuHoSo || "Tòa án nhân dân tối cao";
  const donViToaAnCap = record?.capToaAn || "TỐI CAO";

  // 1. Khi tạo biểu mẫu thì chưa hiển thị số: "Số: .../TANDTC - Vụ X"
  // Khi đã lấy số: "Số: 05/TANDTC - Vụ X" (Vụ 1: Hình sự, Vụ 2: Dân sự, Vụ 3: KDTM/HNGĐ/LĐ, Vụ 4: Hành chính)
  const getVuSuffixByRecord = (loaiAn?: string, soBA?: string, donViNhan?: string) => {
    const l = (loaiAn || "").toLowerCase();
    const dv = (donViNhan || "").toLowerCase();
    const ba = (soBA || "").toLowerCase();

    if (dv.includes("vụ 1") || dv.includes("vụ i") || l.includes("hình sự") || ba.includes("hs")) return "Vụ 1";
    if (dv.includes("vụ 2") || dv.includes("vụ ii") || l.includes("dân sự") || ba.includes("ds")) return "Vụ 2";
    if (dv.includes("vụ 3") || dv.includes("vụ iii") || l.includes("thương mại") || l.includes("kdtm") || l.includes("hôn nhân") || l.includes("gia đình") || l.includes("lao động") || ba.includes("kdtm") || ba.includes("hngđ") || ba.includes("lđ")) return "Vụ 3";
    if (dv.includes("vụ 4") || dv.includes("vụ iv") || l.includes("hành chính") || ba.includes("hc")) return "Vụ 4";

    return "Vụ 1";
  };

  const vuSuffix = getVuSuffixByRecord(record?.loaiAn, record?.soBA, record?.donViNhan);
  const hậuTốVu = `TANDTC - ${vuSuffix}`;
  const soCongVan = hasNumber ? `05/${hậuTốVu}` : `.../${hậuTốVu}`;

  // Tự động tính hậu tố QĐ Kháng nghị theo loại án của Hồ sơ (KN-HS, KN-DS, KN-HC, KN-KDTM, KN-HNGĐ, KN-LĐ)
  const getDecisionSuffix = (loaiAn?: string, soBA?: string) => {
    const l = (loaiAn || "").toLowerCase();
    const ba = (soBA || "").toLowerCase();

    if (l.includes("hình sự") || ba.includes("hs")) return "KN-HS";
    if (l.includes("hành chính") || ba.includes("hc")) return "KN-HC";
    if (l.includes("thương mại") || l.includes("kdtm") || ba.includes("kdtm") || l.includes("kinh doanh")) return "KN-KDTM";
    if (l.includes("hôn nhân") || l.includes("hngđ") || ba.includes("hngđ") || l.includes("gia đình")) return "KN-HNGĐ";
    if (l.includes("lao động") || ba.includes("lđ")) return "KN-LĐ";
    if (l.includes("dân sự") || ba.includes("ds")) return "KN-DS";

    return "KN-DS";
  };

  const suffixKN = getDecisionSuffix(record?.loaiAn, record?.soBA);
  const rawSoKN = record?.soKhangNghi || "28/2026/KN-DS";
  const soQDKNFormatted = rawSoKN.includes("KN-")
    ? rawSoKN.replace(/KN-[A-ZĐGH]+/, suffixKN)
    : rawSoKN.includes("/")
      ? `${rawSoKN.split('/')[0]}/${rawSoKN.split('/')[1] || "2026"}/${suffixKN}`
      : `28/2026/${suffixKN}`;

  const diaDanh = "Hà Nội";
  const ngayChuyenText = record?.ngayChuyenText || "ngày 26 tháng 01 năm 2026";

  const donViNhan = record?.donViNhan || "Viện kiểm sát nhân dân tối cao";
  const tenDuongSu = record?.nguoiKhieuNai || "bà Đặng Thị Dương";
  const diaChiDuongSu = record?.diaChiDuongSu || "(SĐT: 0944.808.080) 190 Nguyễn Văn Hưởng, phường An Khánh, Thành phố Hồ Chí Minh";
  const ngayDeDon = record?.ngayDeDon || "17/10/2025";
  const noiDungDon = record?.noiDungDon || "Tố cáo ông Lê Văn Đông Viện trưởng Viện kiểm sát nhân dân Thành phố Hồ Chí Minh vi phạm thời hạn giải quyết khiếu nại. Đề nghị Viện trưởng Viện kiểm sát nhân dân tối cao có ý kiến chỉ đạo, giải quyết đơn khiếu nại của ông.";
  const vietTatDonVi = "TANDTC";

  const handleSaveForm = () => {
    setIsSaved(true);
    alert(`Đã lưu biểu mẫu ${activeDocType === "cong-van-chuyen" ? "Công văn chuyển" : "Quyết định kháng nghị"} thành công! Bạn có thể thực hiện Trình ký hoặc Lấy số.`);
  };

  const handleToggleCapSo = () => {
    if (hasNumber) {
      setHasNumber(false);
      alert("Đã hủy cấp số công văn.");
    } else {
      setHasNumber(true);
      alert(`Đã tự động lấy số công văn thành công!\nSố công văn được cấp: 05/${hậuTốVu}`);
    }
  };

  const handleTrinhKy = () => {
    setShowTrinhKyModal(true);
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
  };

  const tbBtnSt: React.CSSProperties = {
    padding: "5px 10px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT, display: "flex", alignItems: "center", gap: 5
  };

  const selectSt: React.CSSProperties = {
    padding: "5px 8px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT
  };

  const sepSt: React.CSSProperties = {
    width: 1, height: 20, background: BORDER, margin: "0 4px"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", flex: 1, overflow: "hidden", fontFamily: F }}>

      {/* Breadcrumb Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: F }}>
            Trang chủ › Quản lý án GĐT/TT › Hồ sơ kháng nghị › <b style={{ color: TEXT }}>
              Biểu mẫu {activeDocType === "cong-van-chuyen" ? "PHIẾU CHUYỂN ĐƠN" : "QUYẾT ĐỊNH KHÁNG NGHỊ"} (Word Editor)
            </b>
          </div>
          {isSaved && (
            <span style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
              ✓ Đã lưu biểu mẫu
            </span>
          )}
          {hasNumber && (
            <span style={{ fontSize: 11, background: "#f3e8ff", color: "#6b21a8", border: "1px solid #d8b4fe", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
              🔢 Số: {activeDocType === "cong-van-chuyen" ? `05/${hậuTốVu}` : soQDKN}
            </span>
          )}
          {isSubmitted && (
            <span style={{ fontSize: 11, background: "#dbeafe", color: "#1d4ed8", border: "1px solid #93c5fd", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
              📩 Đã trình ký
            </span>
          )}
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            ← Quay lại
          </button>

          {!isSaved ? (
            <button onClick={handleSaveForm} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 20px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F, boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}>
              <Save size={14} /> Lưu biểu mẫu
            </button>
          ) : (
            <>
              <button onClick={handleTrinhKy} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#0284c7", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <Send size={14} /> Trình ký
              </button>
              <button onClick={handleToggleCapSo} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: hasNumber ? "#dc2626" : "#7c3aed", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                {hasNumber ? "❌ Hủy cấp số" : "🔢 Lấy số"}
              </button>
              <button onClick={() => setShowPreviewModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#475569", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
                <Eye size={14} /> Xem biểu mẫu
              </button>
              <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: RED, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
                ✖ Đóng
              </button>
            </>
          )}
        </div>
      </div>

      {/* Word Ribbon Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, flexWrap: "wrap", fontSize: 12 }}>
        {/* Undo / Redo */}
        <button onClick={() => execCmd("undo")} style={tbBtnSt} title="Hoàn tác (Ctrl+Z)">↩ Hoàn tác</button>
        <button onClick={() => execCmd("redo")} style={tbBtnSt} title="Làm lại (Ctrl+Y)">↪ Làm lại</button>
        <div style={sepSt} />

        {/* Font Family & Size */}
        <select onChange={(e) => execCmd("fontName", e.target.value)} style={selectSt}>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Arial">Arial</option>
          <option value="Roboto">Roboto</option>
          <option value="Courier New">Courier New</option>
        </select>

        <select onChange={(e) => { setFontSize(e.target.value); execCmd("fontSize", "3"); }} value={fontSize} style={selectSt}>
          <option value="12pt">12 pt</option>
          <option value="13pt">13 pt</option>
          <option value="14pt">14 pt</option>
          <option value="16pt">16 pt</option>
          <option value="18pt">18 pt</option>
        </select>
        <div style={sepSt} />

        {/* Text formatting */}
        <button onClick={() => execCmd("bold")} style={tbBtnSt} title="In đậm (Ctrl+B)"><b>B</b></button>
        <button onClick={() => execCmd("italic")} style={tbBtnSt} title="In nghiêng (Ctrl+I)"><i>I</i></button>
        <button onClick={() => execCmd("underline")} style={tbBtnSt} title="Gạch chân (Ctrl+U)"><u>U</u></button>
        <button onClick={() => execCmd("strikeThrough")} style={tbBtnSt} title="Gạch ngang"><s>S</s></button>
        <div style={sepSt} />

        {/* Text alignments */}
        <button onClick={() => execCmd("justifyLeft")} style={tbBtnSt} title="Căn trái">⬅ Căn trái</button>
        <button onClick={() => execCmd("justifyCenter")} style={tbBtnSt} title="Căn giữa">↔ Căn giữa</button>
        <button onClick={() => execCmd("justifyRight")} style={tbBtnSt} title="Căn phải">➡ Căn phải</button>
        <button onClick={() => execCmd("justifyFull")} style={tbBtnSt} title="Căn đều 2 bên">☰ Căn đều</button>
        <div style={sepSt} />

        {/* Bullet and Numbered Lists */}
        <button onClick={() => execCmd("insertUnorderedList")} style={tbBtnSt} title="Danh sách chấm">• Danh sách</button>
        <button onClick={() => execCmd("insertOrderedList")} style={tbBtnSt} title="Danh sách số">1. Danh sách</button>

        {/* Zoom controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", fontSize: 12, color: MUTED }}>
          <span>Tỷ lệ xem:</span>
          <button onClick={() => setZoom(z => Math.max(70, z - 10))} style={tbBtnSt}>-</button>
          <span style={{ fontWeight: 700, color: TEXT }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={tbBtnSt}>+</button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "#cbd5e1" }}>

        {/* CỘT BÊN TRÁI: CHO CHỌN VĂN BẢN KHI XEM BIỂU MẪU (2 VĂN BẢN) */}
        <div style={{ width: 260, background: "#f8fafc", borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: TEXT, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={16} color={RED} /> DANH SÁCH VĂN BẢN
          </div>

          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Item 1: Quyết định kháng nghị */}
            <div
              onClick={() => setActiveDocType("quyet-dinh-khang-nghi")}
              style={{
                padding: "12px 14px", borderRadius: 6, cursor: "pointer",
                background: activeDocType === "quyet-dinh-khang-nghi" ? "#e0f2fe" : "#fff",
                border: activeDocType === "quyet-dinh-khang-nghi" ? "1px solid #0284c7" : `1px solid ${BORDER}`,
                boxShadow: activeDocType === "quyet-dinh-khang-nghi" ? "0 2px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s"
              }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: activeDocType === "quyet-dinh-khang-nghi" ? "#0369a1" : TEXT, display: "flex", alignItems: "center", gap: 6 }}>
                📄 Quyết định kháng nghị
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>
                Biểu mẫu QĐ Kháng nghị GĐT
              </div>
            </div>

            {/* Item 2: Công văn chuyển */}
            <div
              onClick={() => setActiveDocType("cong-van-chuyen")}
              style={{
                padding: "12px 14px", borderRadius: 6, cursor: "pointer",
                background: activeDocType === "cong-van-chuyen" ? "#e0f2fe" : "#fff",
                border: activeDocType === "cong-van-chuyen" ? "1px solid #0284c7" : `1px solid ${BORDER}`,
                boxShadow: activeDocType === "cong-van-chuyen" ? "0 2px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s"
              }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: activeDocType === "cong-van-chuyen" ? "#0369a1" : TEXT, display: "flex", alignItems: "center", gap: 6 }}>
                📄 Công văn chuyển
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>
                Biểu mẫu Phiếu chuyển đơn
              </div>
            </div>
          </div>
        </div>

        {/* Right Editable Word Canvas Container */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 20px 60px 20px", gap: 32 }}>

          {activeDocType === "cong-van-chuyen" ? (
            /* Biểu mẫu Công văn chuyển (1 Trang A4) */
            <div
              contentEditable
              suppressContentEditableWarning
              style={{
                background: "#fff",
                width: "100%",
                maxWidth: 780,
                minHeight: 1050,
                padding: "60px 72px 70px 72px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: fontSize,
                color: "#000",
                lineHeight: 1.6,
                outline: "none",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                position: "relative",
                boxSizing: "border-box",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
                <div style={{ textAlign: "center", width: "46%" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>TÒA ÁN NHÂN DÂN {donViToaAnCap}</div>
                  <div style={{ width: 90, height: 1, background: "#000", margin: "4px auto" }} />
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    Số: <span style={{ background: hasNumber ? "#e9d5ff" : "#fef08a", padding: "1px 4px", fontWeight: 700 }}>{soCongVan}</span>
                  </div>
                </div>

                <div style={{ textAlign: "center", width: "52%" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Độc lập - Tự do - Hạnh phúc</div>
                  <div style={{ width: 150, height: 1, background: "#000", margin: "4px auto" }} />
                  <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 4 }}>
                    {diaDanh}, {ngayChuyenText}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18, margin: "32px 0 24px 0", letterSpacing: 0.5 }}>
                PHIẾU CHUYỂN ĐƠN
              </div>

              <div style={{ textIndent: 30, marginBottom: 16 }}>
                Kính gửi: <b>{donViNhan}</b>
              </div>

              <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 16 }}>
                <b>{toaGiuHoSo}</b> nhận được đơn của <b>{tenDuongSu}</b> {diaChiDuongSu} đề ngày {ngayDeDon} {noiDungDon}
              </div>

              <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 40 }}>
                Sau khi nghiên cứu đơn, <b>{toaGiuHoSo}</b> chuyển đơn nêu trên đến Quý cơ quan để xem xét, giải quyết theo thẩm quyền./.
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48 }}>
                <div style={{ fontSize: 12, fontStyle: "italic", lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 700, fontStyle: "normal", textDecoration: "underline", marginBottom: 4 }}>Nơi nhận:</div>
                  <div>- Như kính gửi;</div>
                  <div>- Đ/c Chánh án {vietTatDonVi} (để b/c);</div>
                  <div>- Đ/c Chánh Văn phòng {vietTatDonVi} (để b/c);</div>
                  <div>- {tenDuongSu} (để biết);</div>
                  <div>- Lưu: TMTH, HCTP, VP{vietTatDonVi}.</div>
                </div>

                <div style={{ textAlign: "center", width: "48%", fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>
                  <div>TL. CHÁNH ÁN</div>
                  <div>KT. CHÁNH VĂN PHÒNG</div>
                  <div>PHÓ CHÁNH VĂN PHÒNG</div>
                  <div style={{ height: 75 }} />
                </div>
              </div>

              {/* Indicator phân trang */}
              <div style={{ position: "absolute", bottom: 20, right: 30, fontSize: 11, color: "#64748b", fontFamily: F, fontWeight: 600 }}>
                Trang 1 / 1
              </div>
            </div>
          ) : (
            /* Biểu mẫu Quyết định kháng nghị mẫu Vụ 2 (Thiết kế trang A4 chuẩn Word) */
            <>
              {/* ── TRANG 1 / 3 ── */}
              <div
                contentEditable
                suppressContentEditableWarning
                style={{
                  background: "#fff",
                  width: "100%",
                  maxWidth: 780,
                  minHeight: 1050,
                  padding: "54px 72px 60px 72px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: fontSize,
                  color: "#000",
                  lineHeight: 1.55,
                  outline: "none",
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                  position: "relative",
                  boxSizing: "border-box",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ textAlign: "center", width: "46%" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                    <div style={{ width: 90, height: 1, background: "#000", margin: "4px auto" }} />
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      Số: <span style={{ background: "#e0e7ff", padding: "1px 4px", fontWeight: 700 }}>{soQDKNFormatted}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "center", width: "52%" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>Độc lập - Tự do - Hạnh phúc</div>
                    <div style={{ width: 150, height: 1, background: "#000", margin: "4px auto" }} />
                    <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 4 }}>
                      Hà Nội, ngày 07 tháng 4 năm 2026
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "center", margin: "18px 0 14px 0" }}>
                  <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: 0.5 }}>QUYẾT ĐỊNH</div>
                  <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: 0.5 }}>KHÁNG NGHỊ GIÁM ĐỐC THẨM</div>
                  <div style={{ fontSize: 13, fontStyle: "italic", marginTop: 4 }}>
                    Đối với Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023<br />của Tòa án nhân dân tỉnh Kiên Giang
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>
                    CHÁNH ÁN TÒA ÁN NHÂN DÂN TỐI CAO
                  </div>
                </div>

                <div style={{ textAlign: "justify", marginBottom: 6 }}>
                  Căn cứ Điều 326, khoản 1 Điều 331, khoản 2 Điều 332 Bộ luật Tố tụng dân sự năm 2015 (sửa đổi, bổ sung theo Luật số 85/2025/QH15);
                </div>
                <div style={{ textAlign: "justify", marginBottom: 10 }}>
                  Căn cứ khoản 1 Điều 3 Nghị quyết số 225/2025/QH15;
                </div>

                <div style={{ textAlign: "justify", marginBottom: 10 }}>
                  Sau khi nghiên cứu hồ sơ vụ án dân sự “Tranh chấp hợp đồng chuyển nhượng quyền sử dụng đất và đòi lại đất” giữa các đương sự:
                </div>

                <div style={{ marginBottom: 10, paddingLeft: 12 }}>
                  <div style={{ fontWeight: 700 }}>- Nguyên đơn:</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>1. Bà Lâm Thị Đèo, sinh năm 1955; cư trú tại: Ấp Bãi Chướng, đặc khu Phú Quốc, tỉnh An Giang.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>2. Ông Lâm Thành Thủ, sinh năm 1969; cư trú tại: Ấp Minh Phong, xã Bình An, tỉnh An Giang.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>3. Ông Lâm Thành Thủy, sinh năm 1976; cư trú tại: Ấp An Cư, đặc khu Kiên Hải, tỉnh An Giang.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>4. Ông Lâm Thành Sự, sinh năm 1978; cư trú tại: Ấp An Cư, đặc khu Kiên Hải, tỉnh An Giang.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>5. Bà Nguyễn Thị Mỹ, sinh năm 1961; cư trú tại: Ấp Hai Lành, xã Hòa Thuận, tỉnh An Giang.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>6. Bà Lâm Thị Kim Ngọc, sinh năm 1990; cư trú tại: Ấp Hai Lành, xã Hòa Thuận, tỉnh An Giang.</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>7. Ông Lâm Minh Ngoan, sinh năm 1995; cư trú tại: Ấp Hai Lành, xã Hòa Thuận, tỉnh An Giang.</div>
                </div>

                <div style={{ marginBottom: 10, paddingLeft: 12 }}>
                  <div style={{ fontWeight: 700 }}>- Bị đơn:</div>
                  <div style={{ paddingLeft: 10, textAlign: "justify" }}>Ông Vũ Thành Đô, sinh năm 1958; cư trú tại: Ấp An Phú, đặc khu Kiên Hải, tỉnh An Giang.</div>
                </div>

                {/* Indicator phân trang */}
                <div style={{ position: "absolute", bottom: 18, right: 30, fontSize: 11, color: "#64748b", fontFamily: F, fontWeight: 600 }}>
                  Trang 1 / 3
                </div>
              </div>

              {/* ── TRANG 2 / 3 ── */}
              <div
                contentEditable
                suppressContentEditableWarning
                style={{
                  background: "#fff",
                  width: "100%",
                  maxWidth: 780,
                  minHeight: 1050,
                  padding: "54px 72px 60px 72px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: fontSize,
                  color: "#000",
                  lineHeight: 1.55,
                  outline: "none",
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                  position: "relative",
                  boxSizing: "border-box",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #cbd5e1", paddingBottom: 6, marginBottom: 16, fontSize: 11, color: "#64748b" }}>
                  <span>TÒA ÁN NHÂN DÂN TỐI CAO</span>
                  <span>Số: {soQDKNFormatted}</span>
                </div>

                <div style={{ fontWeight: 700, textAlign: "center", margin: "8px 0 10px 0" }}>
                  NHẬN THẤY:
                </div>

                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 14 }}>
                  Tại Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023, Tòa án nhân dân tỉnh Kiên Giang quyết định chấp nhận yêu cầu khởi kiện của các nguyên đơn, tuyên bố hợp đồng chuyển nhượng quyền sử dụng đất lập ngày 30/8/1998 giữa cụ Nguyễn Thị Năm với ông Vũ Thành Đô là vô hiệu, buộc ông Vũ Thành Đô trả lại 1.500m² đất và bồi hoàn thành quả lao động...
                </div>

                <div style={{ fontWeight: 700, textAlign: "center", margin: "12px 0 10px 0" }}>
                  XÉT THẤY:
                </div>

                <div style={{ textAlign: "justify", marginBottom: 10 }}>
                  <b>[1].</b> Phần đất đang tranh chấp theo đo đạc thực tế có diện tích 2.159,4m² (gồm 03 thửa: thửa số 01 là 700,8m², thửa số 02 là 713m² và thửa số 03 là 745,6m²) tại ấp An Cư, xã An Sơn, huyện Kiên Hải. Nguồn gốc đất do cụ Lâm Văn Tư và cụ Nguyễn Thị Năm khai khẩn, trồng cây từ năm 1990 nhưng chưa kê khai đăng ký cấp Giấy chứng nhận quyền sử dụng đất. Do đó có cơ sở xác định bản chất của giao dịch ngày 30/8/1998 giữa cụ Năm và ông Đô là chuyển nhượng quyền sử dụng đất nhưng chưa đủ điều kiện chuyển nhượng theo quy định Luật Đất đai 1993, giao dịch vô hiệu.
                </div>

                <div style={{ textAlign: "justify", marginBottom: 10 }}>
                  <b>[2].</b> Việc ông Đô chuyển nhượng diện tích đất cho ông Trần Minh Lợi ngày 15/9/2016 khi chưa được cấp Giấy chứng nhận quyền sử dụng đất đã vi phạm khoản 1 Điều 168 Luật Đất đai 2013 nên vô hiệu theo quy định tại Điều 117, Điều 123 Bộ luật Dân sự 2015.
                </div>

                <div style={{ textAlign: "justify", marginBottom: 10 }}>
                  <b>[3].</b> Theo các văn bản xác minh của UBND huyện Kiên Hải, phần đất tranh chấp thuộc phạm vi quy hoạch rừng phòng hộ theo Quyết định số 4041/QĐ-UB ngày 31/12/1998; đến năm 2012 được đưa ra khỏi quy hoạch nhưng chưa được Nhà nước giao, cho thuê hoặc công nhận quyền sử dụng cho bất kỳ tổ chức, cá nhân nào. Do đó, phần đất tranh chấp thuộc quỹ đất do Nhà nước thống nhất quản lý theo Điều 4, Điều 5, Điều 59 Luật Đất đai 2013.
                </div>

                <div style={{ textAlign: "justify", marginBottom: 16 }}>
                  <b>[4].</b> Tòa án cấp sơ thẩm và cấp phúc thẩm xác định giao dịch vô hiệu nhưng chưa có ý kiến của cơ quan nhà nước có thẩm quyền về quản lý đất đai là không đúng pháp luật. Cần thiết phải hủy Bản án phúc thẩm và sơ thẩm để giải quyết lại vụ án theo đúng quy định.
                </div>

                <div style={{ fontStyle: "italic", textAlign: "right", marginBottom: 12 }}>
                  Vì các lẽ trên;
                </div>

                {/* Indicator phân trang */}
                <div style={{ position: "absolute", bottom: 20, right: 30, fontSize: 11, color: "#64748b", fontFamily: F, fontWeight: 600 }}>
                  Trang 2 / 3
                </div>
              </div>

              {/* ── TRANG 3 / 3 ── */}
              <div
                contentEditable
                suppressContentEditableWarning
                style={{
                  background: "#fff",
                  width: "100%",
                  maxWidth: 780,
                  minHeight: 1020,
                  padding: "60px 72px 70px 72px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: fontSize,
                  color: "#000",
                  lineHeight: 1.6,
                  outline: "none",
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                  position: "relative",
                  boxSizing: "border-box",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 20, fontSize: 11, color: "#64748b" }}>
                  <span>TÒA ÁN NHÂN DÂN TỐI CAO</span>
                  <span>Số: {soQDKNFormatted}</span>
                </div>

                <div style={{ fontWeight: 700, textAlign: "center", margin: "10px 0 16px 0" }}>
                  QUYẾT ĐỊNH:
                </div>

                <div style={{ textAlign: "justify", marginBottom: 12 }}>
                  <b>1.</b> Kháng nghị Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023 của Tòa án nhân dân tỉnh Kiên Giang về vụ án “Tranh chấp hợp đồng chuyển nhượng quyền sử dụng đất và đòi lại đất” giữa nguyên đơn là bà Lâm Thị Đèo, ông Lâm Thành Thủ, ông Lâm Thành Thủy... với bị đơn ông Vũ Thành Đô và 05 người có quyền lợi, nghĩa vụ liên quan.
                </div>

                <div style={{ textAlign: "justify", marginBottom: 12 }}>
                  <b>2.</b> Đề nghị Hội đồng Thẩm phán Tòa án nhân dân tối cao xét xử giám đốc thẩm, hủy Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023 của Tòa án nhân dân tỉnh Kiên Giang và hủy Bản án dân sự sơ thẩm số 10/2022/DSST ngày 15/6/2022 của Tòa án nhân dân huyện Kiên Hải, tỉnh Kiên Giang; giao hồ sơ vụ án cho Tòa án nhân dân khu vực 1 - An Giang giải quyết lại theo thủ tục sơ thẩm đúng quy định của pháp luật.
                </div>

                <div style={{ textAlign: "justify", marginBottom: 44 }}>
                  <b>3.</b> Tạm đình chỉ thi hành Bản án dân sự phúc thẩm số 74/2023/DS-PT ngày 10/4/2023 của Tòa án nhân dân tỉnh Kiên Giang cho đến khi có Quyết định giám đốc thẩm.
                </div>

                {/* Signature Block & Nơi nhận */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
                  <div style={{ fontSize: 12, fontStyle: "italic", lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700, fontStyle: "normal", textDecoration: "underline", marginBottom: 4 }}>Nơi nhận:</div>
                    <div>- Chánh án TANDTC (để báo cáo);</div>
                    <div>- Vụ 9 - VKSNDTC (kèm hồ sơ vụ án);</div>
                    <div>- TAND tỉnh An Giang;</div>
                    <div>- TAND khu vực 1 - An Giang;</div>
                    <div>- Phòng THADS khu vực 1 - An Giang;</div>
                    <div>- Các đương sự (theo địa chỉ);</div>
                    <div>- Thẩm phán TANDTC Đào Thị Minh Thủy;</div>
                    <div>- Lưu: TK Phó Chánh án, VT, Vụ II - TANDTC (03 bản).</div>
                  </div>

                  <div style={{ textAlign: "center", width: "48%", fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>
                    <div>KT. CHÁNH ÁN</div>
                    <div>PHÓ CHÁNH VĂN PHÒNG</div>
                    <div style={{ height: 75 }} />
                    <div style={{ textDecoration: "underline" }}>Nguyễn Văn Tiến</div>
                  </div>
                </div>

                {/* Indicator phân trang */}
                <div style={{ position: "absolute", bottom: 20, right: 30, fontSize: 11, color: "#64748b", fontFamily: F, fontWeight: 600 }}>
                  Trang 3 / 3
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* Modal Preview khi bấm "Xem biểu mẫu" */}
      {showPreviewModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 8, width: 800, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", fontFamily: F, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>
                👁️ Xem trước văn bản PHIẾU CHUYỂN ĐƠN
              </span>
              <button onClick={() => setShowPreviewModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={MUTED} /></button>
            </div>

            <div style={{ flex: 1, padding: 30, background: "#cbd5e1", overflowY: "auto", display: "flex", justifyContent: "center" }}>
              <div style={{ background: "#fff", width: "100%", maxWidth: 680, padding: "40px 50px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", fontFamily: "'Times New Roman', Times, serif", fontSize: 13, color: "#000", lineHeight: 1.6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ textAlign: "center", width: "46%" }}>
                    <div style={{ fontWeight: 700, fontSize: 12.5 }}>TÒA ÁN NHÂN DÂN {donViToaAnCap}</div>
                    <div style={{ width: 80, height: 1, background: "#000", margin: "4px auto" }} />
                    <div style={{ fontSize: 12, marginTop: 4 }}>Số: <b>{soCongVan}</b></div>
                  </div>
                  <div style={{ textAlign: "center", width: "52%" }}>
                    <div style={{ fontWeight: 700, fontSize: 12.5 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div style={{ fontWeight: 700, fontSize: 12.5 }}>Độc lập - Tự do - Hạnh phúc</div>
                    <div style={{ width: 140, height: 1, background: "#000", margin: "4px auto" }} />
                    <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 4 }}>{diaDanh}, {ngayChuyenText}</div>
                  </div>
                </div>

                <div style={{ textAlign: "center", fontWeight: 700, fontSize: 16, margin: "24px 0 18px 0" }}>PHIẾU CHUYỂN ĐƠN</div>
                <div style={{ textIndent: 30, marginBottom: 12 }}>Kính gửi: <b>{donViNhan}</b></div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 12 }}><b>{toaGiuHoSo}</b> nhận được đơn của <b>{tenDuongSu}</b> {diaChiDuongSu} đề ngày {ngayDeDon} {noiDungDon}</div>
                <div style={{ textIndent: 30, textAlign: "justify", marginBottom: 28 }}>Sau khi nghiên cứu đơn, <b>{toaGiuHoSo}</b> chuyển đơn nêu trên đến Quý cơ quan để xem xét, giải quyết theo thẩm quyền./.</div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36 }}>
                  <div style={{ fontSize: 11.5, fontStyle: "italic", lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 700, fontStyle: "normal", textDecoration: "underline", marginBottom: 2 }}>Nơi nhận:</div>
                    <div>- Như kính gửi;</div>
                    <div>- Đ/c Chánh án {vietTatDonVi} (để b/c);</div>
                    <div>- Đ/c Chánh Văn phòng {vietTatDonVi} (để b/c);</div>
                    <div>- {tenDuongSu} (để biết);</div>
                    <div>- Lưu: TMTH, HCTP, VP{vietTatDonVi}.</div>
                  </div>
                  <div style={{ textAlign: "center", width: "48%", fontSize: 12, fontWeight: 700 }}>
                    <div>TL. CHÁNH ÁN</div>
                    <div>KT. CHÁNH VĂN PHÒNG</div>
                    <div>PHÓ CHÁNH VĂN PHÒNG</div>
                    <div style={{ height: 60 }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff" }}>
              <button onClick={() => setShowPreviewModal(false)} style={{ padding: "6px 18px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Trình ký Lãnh đạo khi bấm "Trình ký" */}
      {showTrinhKyModal && (
        <ModalTrinhKy record={record} onClose={() => { setShowTrinhKyModal(false); setIsSubmitted(true); }} />
      )}

    </div>
  );
}

function ModalTrinhKy({ record, onClose }: { record?: any; onClose: () => void }) {
  const [nguoiKy, setNguoiKy] = useState("Chu Thị Thu Hiền");
  const [mucDoUuTien, setMucDoUuTien] = useState("Bình thường");
  const [noiDungKy, setNoiDungKy] = useState("");

  const handleSubmit = () => {
    alert(`Đã gửi trình duyệt ký thành công cho ${nguoiKy}!`);
    onClose();
  };

  const darkRed = "#700000";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 12, width: 620, maxWidth: "92vw", padding: 28, boxShadow: "0 20px 40px rgba(0,0,0,0.25)", fontFamily: F, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", fontFamily: F }}>
            Nhập thông tin trình ký
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 13, fontFamily: F }}>
            close
          </button>
        </div>

        {/* Form Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* 1. Người ký văn bản */}
          <div>
            <label style={{ fontSize: 13, color: "#64748b", fontFamily: F, display: "block", marginBottom: 8, fontWeight: 500 }}>
              Người ký văn bản
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={nguoiKy}
                onChange={e => setNguoiKy(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px", fontSize: 14,
                  border: "1px solid #cbd5e1", borderRadius: 6,
                  fontFamily: F, color: "#0f172a", background: "#fff",
                  boxSizing: "border-box", appearance: "none", outline: "none", cursor: "pointer"
                }}>
                <option value="Chu Thị Thu Hiền">Chu Thị Thu Hiền</option>
                <option value="Nguyễn Văn Dũng">Nguyễn Văn Dũng</option>
                <option value="Phạm Văn Hải - Chánh án TANDTC">Phạm Văn Hải - Chánh án TANDTC</option>
                <option value="Trần Thị Lan - Phó Chánh án phụ trách khối Hình sự">Trần Thị Lan - Phó Chánh án phụ trách khối Hình sự</option>
                <option value="Lê Hoàng Nam - Vụ trưởng Vụ 1">Lê Hoàng Nam - Vụ trưởng Vụ 1</option>
              </select>
              <ChevronDown size={18} color="#64748b" style={{ position: "absolute", right: 14, top: 13, pointerEvents: "none" }} />
            </div>
          </div>

          {/* 2. Mức độ ưu tiên */}
          <div>
            <label style={{ fontSize: 13, color: "#64748b", fontFamily: F, display: "block", marginBottom: 8, fontWeight: 500 }}>
              Mức độ ưu tiên
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={mucDoUuTien}
                onChange={e => setMucDoUuTien(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px", fontSize: 14,
                  border: "1px solid #cbd5e1", borderRadius: 6,
                  fontFamily: F, color: "#0f172a", background: "#fff",
                  boxSizing: "border-box", appearance: "none", outline: "none", cursor: "pointer"
                }}>
                <option value="Bình thường">Bình thường</option>
                <option value="Cao">Cao</option>
                <option value="Thấp">Thấp</option>
              </select>
              <ChevronDown size={18} color="#64748b" style={{ position: "absolute", right: 14, top: 13, pointerEvents: "none" }} />
            </div>
          </div>

          {/* 3. Nội dung trình duyệt ký */}
          <div>
            <label style={{ fontSize: 13, color: "#64748b", fontFamily: F, display: "block", marginBottom: 8, fontWeight: 500 }}>
              Nội dung trình duyệt ký
            </label>
            <div style={{ position: "relative" }}>
              <textarea
                value={noiDungKy}
                onChange={e => setNoiDungKy(e.target.value)}
                placeholder="Nhập nội dung trình duyệt ký"
                maxLength={4000}
                style={{
                  width: "100%", padding: "12px 14px", paddingBottom: 32, fontSize: 14,
                  border: "1px solid #cbd5e1", borderRadius: 6, fontFamily: F,
                  minHeight: 120, boxSizing: "border-box", outline: "none", resize: "vertical"
                }}
              />
              <span style={{ position: "absolute", bottom: 10, right: 14, fontSize: 12, color: "#94a3b8", fontFamily: F }}>
                {noiDungKy.length} / 4000
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 28px", background: darkRed, color: "#fff",
              border: "none", borderRadius: 6, cursor: "pointer",
              fontSize: 14, fontWeight: 700, fontFamily: F
            }}>
            Trình ký
          </button>

          <button
            onClick={onClose}
            style={{
              padding: "10px 28px", background: "#fff", color: "#0f172a",
              border: "1px solid #cbd5e1", borderRadius: 6, cursor: "pointer",
              fontSize: 14, fontWeight: 700, fontFamily: F
            }}>
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}

function ModalTraHoSo({ onClose, onConfirm }: { onClose: () => void; onConfirm: (lyDo: string) => void }) {
  const [ngayThaoTac, setNgayThaoTac] = useState("07/08/2026");
  const [canBo, setCanBo] = useState("Lý Thái Phúc");
  const [lyDo, setLyDo] = useState("");

  const handleConfirmTra = () => {
    if (!lyDo.trim()) {
      alert("Vui lòng nhập lý do trả hồ sơ!");
      return;
    }
    onConfirm(lyDo);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 480, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", fontFamily: F }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: `1px solid ${BORDER}`, paddingBottom: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>
            Trả lại hồ sơ kháng nghị đến
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Cán bộ thực hiện</label>
              <input value={canBo} onChange={e => setCanBo(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Ngày thực hiện</label>
              <input type="text" value={ngayThaoTac} onChange={e => setNgayThaoTac(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Lý do trả hồ sơ *</label>
            <textarea value={lyDo} onChange={e => setLyDo(e.target.value)} placeholder="Nhập lý do trả lại hồ sơ..." style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, minHeight: 70, boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "7px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hủy</button>
          <button onClick={handleConfirmTra} style={{ padding: "7px 20px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
            Xác nhận Trả
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalTaoCongVan({ record, onClose, onConfirm }: { record?: any; onClose: () => void; onConfirm: (config: any) => void }) {
  const getInitialDonViNhan = () => {
    if (!record) return "Viện kiểm sát nhân dân tối cao";
    const toaRA = record.toaRaBanAn || "";
    const dvNhan = record.donViNhan || "";
    if (toaRA.toLowerCase().includes("tỉnh") || dvNhan.toLowerCase().includes("tỉnh")) {
      return dvNhan.toLowerCase().includes("tỉnh") ? dvNhan : "Tòa án nhân dân tỉnh Hà Nam";
    }
    return "Viện kiểm sát nhân dân tối cao";
  };

  const [loaiVanBan, setLoaiVanBan] = useState("Phiếu chuyển đơn");
  const [donViNhan, setDonViNhan] = useState(getInitialDonViNhan());
  const [toaGiuHoSo, setToaGiuHoSo] = useState(record?.toaGiuHoSo || "Tòa án nhân dân tối cao");
  const [duongSu, setDuongSu] = useState(record?.nguoiKhieuNai ? `${record.nguoiKhieuNai}` : "bà Đặng Thị Dương");
  const [noiDung, setNoiDung] = useState(record?.noiDungDon || "Tố cáo ông Lê Văn Đông Viện trưởng Viện kiểm sát nhân dân Thành phố Hồ Chí Minh vi phạm thời hạn giải quyết khiếu nại.");

  const getVuSuffix = () => {
    const l = (record?.loaiAn || "").toLowerCase();
    const dv = (donViNhan || "").toLowerCase();
    const ba = (record?.soBA || "").toLowerCase();

    if (dv.includes("vụ 1") || dv.includes("vụ i") || l.includes("hình sự") || ba.includes("hs")) return "Vụ 1";
    if (dv.includes("vụ 2") || dv.includes("vụ ii") || l.includes("dân sự") || ba.includes("ds")) return "Vụ 2";
    if (dv.includes("vụ 3") || dv.includes("vụ iii") || l.includes("thương mại") || l.includes("kdtm") || l.includes("hôn nhân") || l.includes("gia đình") || l.includes("lao động") || ba.includes("kdtm") || ba.includes("hngđ") || ba.includes("lđ")) return "Vụ 3";
    if (dv.includes("vụ 4") || dv.includes("vụ iv") || l.includes("hành chính") || ba.includes("hc")) return "Vụ 4";

    return "Vụ 1";
  };

  const vuSuffixCurrent = getVuSuffix();
  const hậuTốVuModal = `TANDTC - ${vuSuffixCurrent}`;
  const soCongVanModal = hasNumber ? `05/${hậuTốVuModal}` : `.../${hậuTốVuModal}`;

  const [isSaved, setIsSaved] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    alert("Đã lưu biểu mẫu công văn thành công! Bạn có thể thực hiện Trình ký, Lấy số hoặc Xem biểu mẫu.");
  };

  const handleToggleCapSo = () => {
    if (hasNumber) {
      setHasNumber(false);
      alert("Đã hủy cấp số công văn.");
    } else {
      setHasNumber(true);
      alert(`Đã tự động cấp số công văn: ${soCongVanModal}`);
    }
  };

  const handleXemBiêuMau = () => {
    onConfirm({
      loaiVanBan,
      donViNhan,
      toaGiuHoSo,
      nguoiKhieuNai: duongSu,
      noiDungDon: noiDung,
      hasNumber,
      soCongVan: soCongVanModal,
      ...record
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", borderRadius: 10, width: 580, maxWidth: "92vw", padding: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.25)", fontFamily: F, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${BORDER}`, paddingBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F }}>
              Tạo biểu mẫu công văn
            </span>
            {isSaved && (
              <span style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                ✓ Đã lưu biểu mẫu
              </span>
            )}
            {hasNumber && (
              <span style={{ fontSize: 11, background: "#f3e8ff", color: "#6b21a8", border: "1px solid #d8b4fe", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                🔢 Số: 05/TANDTC - Vụ 1
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={20} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Tên loại văn bản / biểu mẫu *</label>
            <select value={loaiVanBan} onChange={e => setLoaiVanBan(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, background: "#fff", color: TEXT, boxSizing: "border-box" }}>
              <option value="Phiếu chuyển đơn">Phiếu chuyển (Công văn chuyển)</option>
            </select>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 12, color: TEXT, fontFamily: F, fontWeight: 600 }}>Đơn vị nhận *</label>
              <span style={{ fontSize: 11, color: "#2563eb", fontFamily: F, fontStyle: "italic" }}>(Tự động lấy từ Quyết định kháng nghị)</span>
            </div>
            <select
              value={donViNhan}
              onChange={e => setDonViNhan(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, background: "#f8fafc", color: TEXT, boxSizing: "border-box" }}>
              <option value="Viện kiểm sát nhân dân tối cao">Viện kiểm sát nhân dân tối cao</option>
              <option value="Tòa án nhân dân tỉnh Hà Nam">Tòa án nhân dân tỉnh Hà Nam</option>
              <option value="Tòa án nhân dân cấp cao tại Hà Nội">Tòa án nhân dân cấp cao tại Hà Nội</option>
              <option value="Vụ Giám đốc, kiểm tra I">Vụ Giám đốc, kiểm tra I (Hình sự)</option>
              <option value="Vụ Giám đốc, kiểm tra II">Vụ Giám đốc, kiểm tra II (Dân sự)</option>
              <option value="Vụ Giám đốc, kiểm tra III">Vụ Giám đốc, kiểm tra III (KDTM, Lao động, HNGĐ)</option>
              <option value="Vụ Giám đốc, kiểm tra IV">Vụ Giám đốc, kiểm tra IV (Hành chính)</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Tòa án giữ hồ sơ</label>
              <input value={toaGiuHoSo} onChange={e => setToaGiuHoSo(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Đương sự</label>
              <input value={duongSu} onChange={e => setDuongSu(e.target.value)} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 }}>Nội dung đơn</label>
            <textarea value={noiDung} onChange={e => setNoiDung(e.target.value)} rows={3} style={{ width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, fontFamily: F, boxSizing: "border-box" }} />
          </div>
        </div>

        {/* Footer Buttons Workflow */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
          {!isSaved ? (
            /* Ban đầu chưa lưu: Nút "Lưu biểu mẫu" và "Đóng" */
            <>
              <button
                onClick={handleSave}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 20px", background: "#16a34a", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}>
                <Save size={15} /> Lưu biểu mẫu
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "8px 18px", background: "#fff", color: TEXT,
                  border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontFamily: F,
                }}>
                Đóng
              </button>
            </>
          ) : (
            /* ĐÃ LƯU BIỂU MẪU -> Hiển thị COMBO nút: Trình ký, Lấy số, Xem biểu mẫu, Đóng */
            <>
              <button
                onClick={() => setShowTrinhKy(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", background: "#0284c7", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Trình ký
              </button>

              <button
                onClick={handleToggleCapSo}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px",
                  background: hasNumber ? "#dc2626" : "#7c3aed",
                  color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                {hasNumber ? "Hủy cấp số" : "Lấy số"}
              </button>

              <button
                onClick={handleXemBiêuMau}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", background: "#475569", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Xem biểu mẫu
              </button>

              <button
                onClick={onClose}
                style={{
                  padding: "8px 18px", background: "#fff", color: TEXT,
                  border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontFamily: F,
                }}>
                ✖ Đóng
              </button>
            </>
          )}
        </div>

        {/* Modal Trình ký Lãnh đạo */}
        {showTrinhKy && <ModalTrinhKy record={record} onClose={() => setShowTrinhKy(false)} />}
      </div>
    </div>
  );
}

function HoSoKhangNghiView({ onTaoCongVan }: { onTaoCongVan?: (config?: any) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<"di" | "den">("di");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [showTrinhKyModal, setShowTrinhKyModal] = useState(false);
  const [showChuyenModal, setShowChuyenModal] = useState(false);
  const [showTraHoSoModal, setShowTraHoSoModal] = useState(false);
  const [showTaoCongVanModal, setShowTaoCongVanModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [listDi, setListDi] = useState([
    {
      id: 1,
      maDon: "KN-DI-001",
      soKhangNghi: "10/2026/QĐKN",
      ngayKhangNghi: "25/07/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân tối cao",
      soBA: "124/2026/HS-ST",
      ngayBA: "20/07/2026",
      toaRaBanAn: "TAND tỉnh Hà Nam",
      loaiAn: "Hình sự",
      nguoiKhieuNai: "Đặng Thị Dương",
      donViNhan: "Viện kiểm sát nhân dân tối cao",
      ngayChuyen: "22/07/2026",
      soCVChuyen: "CV-2026/088",
      trangThai: "Đã chuyển",
    },
    {
      id: 2,
      maDon: "KN-DI-002",
      soKhangNghi: "12/2026/QĐKN",
      ngayKhangNghi: "18/06/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tối cao",
      soBA: "102/2026/DS-ST",
      ngayBA: "18/06/2026",
      toaRaBanAn: "TAND quận Hoàn Kiếm, Hà Nội",
      loaiAn: "Dân sự",
      nguoiKhieuNai: "Dương Thu Hằng",
      donViNhan: "Tòa án nhân dân cấp cao tại Hà Nội",
      ngayChuyen: "25/07/2026",
      soCVChuyen: "CV-2026/092",
      trangThai: "Chờ chuyển",
    },
    {
      id: 3,
      maDon: "KN-DI-003",
      soKhangNghi: "15/2026/QĐKN",
      ngayKhangNghi: "10/05/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân tối cao",
      soBA: "45/2026/HC-PT",
      ngayBA: "10/05/2026",
      toaRaBanAn: "TAND tỉnh Vĩnh Phúc",
      loaiAn: "Hành chính",
      nguoiKhieuNai: "Phạm Văn Cường",
      donViNhan: "Vụ Giám đốc kiểm tra I",
      ngayChuyen: "--",
      soCVChuyen: "",
      trangThai: "Chưa chuyển",
    },
  ]);

  const handleChuyenHoSoDi = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng tích chọn ít nhất 1 hồ sơ kháng nghị để thực hiện chuyển!");
      return;
    }

    const selectedRecords = listDi.filter(item => selectedItems.includes(item.id));
    const missingCVRecord = selectedRecords.find(item => !item.soCVChuyen || item.soCVChuyen === "---" || item.soCVChuyen.trim() === "");

    if (missingCVRecord) {
      alert(`Hồ sơ "${missingCVRecord.soKhangNghi || missingCVRecord.maDon}" chưa có công văn chuyển. Vui lòng tạo công văn chuyển trước khi chuyển hồ sơ!`);
      return;
    }

    setListDi(prev =>
      prev.map(item =>
        selectedItems.includes(item.id)
          ? { ...item, trangThai: "Đã chuyển" }
          : item
      )
    );

    alert(`Đã chuyển hồ sơ kháng nghị thành công! Trạng thái cập nhật sang "Đã chuyển".`);
  };

  const handleOpenTaoCongVan = (rowTarget?: any) => {
    let target = rowTarget;

    if (!target) {
      if (selectedItems.length > 0) {
        target = listDi.find(item => selectedItems.includes(item.id));
      } else {
        target = listDi.find(item => !item.soCVChuyen || item.soCVChuyen.trim() === "") || listDi[0];
      }
    }

    if (target && target.soCVChuyen && target.soCVChuyen.trim() !== "" && target.soCVChuyen !== "---") {
      alert(`Hồ sơ "${target.soKhangNghi || target.maDon}" đã có công văn chuyển (${target.soCVChuyen}).`);
      return;
    }

    setSelectedRecord(target);
    setShowTaoCongVanModal(true);
  };

  const [listDen, setListDen] = useState([
    {
      id: 101,
      maDon: "KN-DEN-001",
      soKhangNghi: "08/2026/QĐKN",
      ngayKhangNghi: "03/07/2026",
      nguoiKhangNghi: "Viện trưởng Viện kiểm sát nhân dân tỉnh Bắc Ninh",
      soBA: "236/2026/HS-PT",
      ngayBA: "03/07/2026",
      toaRaBanAn: "TAND tỉnh Bắc Ninh",
      loaiAn: "Hình sự",
      nguoiKhieuNai: "Nguyễn Văn Bình",
      donViGui: "Viện kiểm sát nhân dân tỉnh Bắc Ninh",
      ngayNhan: "24/07/2026",
      nguoiNhan: "Lý Thái Phúc",
      trangThai: "Đã nhận",
    },
    {
      id: 102,
      maDon: "KN-DEN-002",
      soKhangNghi: "14/2026/QĐKN",
      ngayKhangNghi: "25/04/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân tỉnh Bắc Ninh",
      soBA: "18/2026/KDTM-ST",
      ngayBA: "25/04/2026",
      toaRaBanAn: "TAND tỉnh Bắc Ninh",
      loaiAn: "Kinh doanh thương mại",
      nguoiKhieuNai: "Công ty Cổ phần Thương mại Á Châu",
      donViGui: "TAND tỉnh Bắc Ninh",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
    {
      id: 103,
      maDon: "KN-DEN-003",
      soKhangNghi: "21/2026/QĐKN",
      ngayKhangNghi: "12/03/2026",
      nguoiKhangNghi: "Chánh án Tòa án nhân dân quận Đống Đa",
      soBA: "88/2026/HNGĐ-PT",
      ngayBA: "12/03/2026",
      toaRaBanAn: "TAND quận Đống Đa, Hà Nội",
      loaiAn: "Hôn nhân gia đình",
      nguoiKhieuNai: "Lê Thị Mai",
      donViGui: "Văn phòng Luật sư Trí Đức",
      ngayNhan: "--",
      nguoiNhan: "--",
      trangThai: "Chờ nhận",
    },
  ]);

  const handleNhanHoSo = (targetId?: number) => {
    const targetIds = targetId !== undefined ? [targetId] : (selectedItems.length > 0 ? selectedItems : [102, 103]);
    setListDen(prevList =>
      prevList.map(item =>
        targetIds.includes(item.id)
          ? {
            ...item,
            trangThai: "Đã nhận",
            nguoiNhan: item.nguoiNhan === "--" || !item.nguoiNhan ? "Lý Thái Phúc" : item.nguoiNhan,
            ngayNhan: item.ngayNhan === "--" || !item.ngayNhan ? "07/08/2026" : item.ngayNhan,
          }
          : item
      )
    );
    alert(`Đã tiếp nhận ${targetIds.length} hồ sơ kháng nghị đến thành công! Trạng thái cập nhật sang "Đã nhận".`);
  };

  const handleConfirmTraHoSo = (lyDo: string) => {
    const targetIds = selectedRecord ? [selectedRecord.id] : (selectedItems.length > 0 ? selectedItems : [102]);
    setListDen(prevList =>
      prevList.map(item =>
        targetIds.includes(item.id)
          ? {
            ...item,
            trangThai: "Đã trả",
          }
          : item
      )
    );
    setShowTraHoSoModal(false);
    alert(`Đã trả lại ${targetIds.length} hồ sơ kháng nghị đến thành công!\nLý do: ${lyDo}\nTrạng thái cập nhật sang "Đã trả".`);
  };

  const currentList = activeSubTab === "di" ? listDi : listDen;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", flex: 1, overflow: "auto", fontFamily: F }}>
      {/* Breadcrumb */}
      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F }}>
        Trang chủ › Quản lý án GĐT/TT › Hồ sơ kháng nghị
      </div>

      {/* 2 Sub-Tabs Header */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`, background: "#fff", padding: "0 20px", flexShrink: 0 }}>
        <button
          onClick={() => setActiveSubTab("di")}
          style={{
            padding: "12px 20px", fontSize: 13, fontFamily: F,
            fontWeight: activeSubTab === "di" ? 700 : 400,
            background: "none", border: "none", cursor: "pointer",
            color: activeSubTab === "di" ? RED : MUTED,
            borderBottom: activeSubTab === "di" ? `2px solid ${RED}` : "2px solid transparent",
            marginBottom: -1, display: "flex", alignItems: "center", gap: 6,
          }}>
          Hồ sơ kháng nghị đi
          <span style={{
            padding: "1px 7px", borderRadius: 20, fontSize: 11,
            background: activeSubTab === "di" ? RED : "#e5e7eb",
            color: activeSubTab === "di" ? "#fff" : MUTED, fontWeight: 600,
          }}>{listDi.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab("den")}
          style={{
            padding: "12px 20px", fontSize: 13, fontFamily: F,
            fontWeight: activeSubTab === "den" ? 700 : 400,
            background: "none", border: "none", cursor: "pointer",
            color: activeSubTab === "den" ? RED : MUTED,
            borderBottom: activeSubTab === "den" ? `2px solid ${RED}` : "2px solid transparent",
            marginBottom: -1, display: "flex", alignItems: "center", gap: 6,
          }}>
          Hồ sơ kháng nghị đến
          <span style={{
            padding: "1px 7px", borderRadius: 20, fontSize: 11,
            background: activeSubTab === "den" ? RED : "#e5e7eb",
            color: activeSubTab === "den" ? "#fff" : MUTED, fontWeight: 600,
          }}>{listDen.length}</span>
        </button>
      </div>

      {/* Search filter panel */}
      <SearchFilterPanel expanded={filterExpanded} onToggle={() => setFilterExpanded(v => !v)} />

      {/* Action Bar with requested buttons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>
            {activeSubTab === "di" ? "Danh sách Hồ sơ kháng nghị" : "Danh sách Hồ sơ kháng nghị"}
          </span>
          <Badge color="#1e40af" bg="#dbeafe">{currentList.length} hồ sơ</Badge>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* 2 NÚT TÁCH BIỆT: Tạo công văn & Trình ký cho Kháng nghị đi */}
          {activeSubTab === "di" && (
            <>
              <button
                onClick={() => handleOpenTaoCongVan()}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", background: "#0284c7", color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Tạo công văn
              </button>

              <button
                onClick={handleChuyenHoSoDi}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", background: RED, color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                Chuyển hồ sơ
              </button>
            </>
          )}

          {/* 2 NÚT TÁCH BIỆT: Nhận hồ sơ (cập nhật Đã nhận) & Trả hồ sơ (có mở popup) */}
          {activeSubTab === "den" && (
            <>
              <button
                onClick={() => handleNhanHoSo()}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", background: "#0f766e", color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                <CheckCircle2 size={14} /> Nhận hồ sơ
              </button>

              <button
                onClick={() => { setSelectedRecord(null); setShowTraHoSoModal(true); }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", background: "#fff", color: RED,
                  border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                }}>
                <RotateCcw size={14} /> Trả hồ sơ
              </button>
            </>
          )}

          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <FileSpreadsheet size={14} color="#16a34a" /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ flex: 1, padding: "12px 20px", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ ...TH_STYLE, width: 40, textAlign: "center" }}>
                <input type="checkbox" onChange={(e) => {
                  if (e.target.checked) setSelectedItems(currentList.map(item => item.id));
                  else setSelectedItems([]);
                }} />
              </th>
              <th style={{ ...TH_STYLE, width: 50, textAlign: "center" }}>STT</th>
              <th style={{ ...TH_STYLE, width: 170 }}>THÔNG TIN KHÁNG NGHỊ</th>
              <th style={{ ...TH_STYLE, width: 140 }}>SỐ BẢN ÁN / QĐ</th>
              {/* <th style={{ ...TH_STYLE, width: 120 }}>LOẠI ÁN</th> */}
              {/* <th style={{ ...TH_STYLE, width: 160 }}>ĐƯƠNG SỰ</th> */}
              <th style={{ ...TH_STYLE, width: 220 }}>{activeSubTab === "di" ? "ĐƠN VỊ NHẬN / CÔNG VĂN CHUYỂN" : "ĐƠN VỊ GỬI / NGƯỜI NHẬN"}</th>
              <th style={{ ...TH_STYLE, width: 110, textAlign: "center" }}>TRẠNG THÁI</th>
              <th style={{ ...TH_STYLE, width: 110, textAlign: "center" }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {currentList.map((row, idx) => (
              <tr
                key={row.id}
                style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
              >
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(row.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedItems(p => [...p, row.id]);
                      else setSelectedItems(p => p.filter(i => i !== row.id));
                    }}
                  />
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12, fontFamily: F }}>{idx + 1}</td>
                <td style={{ ...TD_STYLE, fontFamily: F, fontSize: 12 }}>
                  <div style={{ color: RED, fontWeight: 600 }}><span style={{ color: MUTED, fontWeight: 400 }}>Số KN: </span>{(row as any).soKhangNghi}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Ngày KN: </span>{(row as any).ngayKhangNghi}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Người KN: </span>{(row as any).nguoiKhangNghi}</div>
                </td>
                <td style={{ ...TD_STYLE, fontFamily: F, fontSize: 12 }}>
                  <div style={{ color: "#2563eb", fontWeight: 600 }}><span style={{ color: MUTED, fontWeight: 400 }}>Số BA/QĐ: </span>{row.soBA}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Ngày bản án: </span>{row.ngayBA}</div>
                  <div style={{ fontSize: 11, color: TEXT, fontFamily: F, marginTop: 2 }}><span style={{ color: MUTED }}>Tòa ra bản án: </span>{(row as any).toaRaBanAn}</div>
                </td>
                {/* <td style={{ ...TD_STYLE, color: TEXT, fontFamily: F, fontSize: 12 }}>{row.loaiAn}</td> */}
                {/* <td style={{ ...TD_STYLE, color: TEXT, fontFamily: F, fontSize: 12 }}>{row.nguoiKhieuNai}</td> */}
                <td style={{ ...TD_STYLE, color: TEXT, fontSize: 11, fontFamily: F }}>
                  {activeSubTab === "di" ? (
                    <>
                      <div><b style={{ fontFamily: F }}>Đơn vị nhận:</b> {(row as any).donViNhan}</div>
                      <div><b style={{ fontFamily: F }}>CV chuyển:</b> {(row as any).soCVChuyen} ({(row as any).ngayChuyen})</div>
                    </>
                  ) : (
                    <>
                      <div><b style={{ fontFamily: F }}>Đơn vị gửi:</b> {(row as any).donViGui}</div>
                      <div><b style={{ fontFamily: F }}>Người nhận:</b> {(row as any).nguoiNhan} ({(row as any).ngayNhan})</div>
                    </>
                  )}
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <Badge
                    color={row.trangThai.includes("Đã") ? "#065f46" : "#92400e"}
                    bg={row.trangThai.includes("Đã") ? "#d1fae5" : "#fef3c7"}>
                    {row.trangThai}
                  </Badge>
                </td>
                <td style={{ ...TD_STYLE, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    {/* <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem chi tiết"><Eye size={15} color="#6b7280" /></button> */}
                    {activeSubTab === "di" ? (
                      <>
                        <button onClick={() => onTaoCongVan?.(row)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem biểu mẫu"><FileText size={14} color="#0284c7" /></button>
                        <button onClick={() => { setSelectedRecord(row); setShowTrinhKyModal(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Đi trình ký Lãnh đạo"><Send size={14} color={RED} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleNhanHoSo(row.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Tiếp nhận hồ sơ"><CheckCircle2 size={14} color="#0f766e" /></button>
                        <button onClick={() => { setSelectedRecord(row); setShowTraHoSoModal(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Trả lại hồ sơ"><RotateCcw size={14} color={RED} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0 }}>
        <span>Hiển thị 1–{currentList.length} trong tổng {currentList.length} bản ghi</span>
        <div style={{ flex: 1 }} />
        <button style={paginBtn} disabled>‹</button>
        <button style={{ ...paginBtn, background: RED, color: "#fff", border: `1px solid ${RED}` }}>1</button>
        <button style={paginBtn}>›</button>
        <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}>
          <option>10 / trang</option>
        </select>
      </div>

      {/* Modal Tạo biểu mẫu công văn */}
      {showTaoCongVanModal && (
        <ModalTaoCongVan
          record={selectedRecord}
          onClose={() => setShowTaoCongVanModal(false)}
          onConfirm={(cfg) => {
            setShowTaoCongVanModal(false);
            if (selectedRecord) {
              const assignedCV = cfg.soCongVan || "CV-2026/108";
              const assignedDonVi = cfg.donViNhan || selectedRecord.donViNhan || "Viện kiểm sát nhân dân tối cao";
              setListDi(prev =>
                prev.map(item =>
                  item.id === selectedRecord.id
                    ? {
                      ...item,
                      donViNhan: assignedDonVi,
                      soCVChuyen: assignedCV,
                      ngayChuyen: "07/08/2026",
                      trangThai: item.trangThai === "Chưa chuyển" ? "Chờ chuyển" : item.trangThai
                    }
                    : item
                )
              );
            }
            onTaoCongVan?.(cfg);
          }}
        />
      )}

      {/* Modal Trình ký Lãnh đạo */}
      {showTrinhKyModal && <ModalTrinhKy record={selectedRecord} onClose={() => setShowTrinhKyModal(false)} />}

      {/* Modal Chuyển */}
      {showChuyenModal && <ModalChuyen onClose={() => setShowChuyenModal(false)} />}

      {/* Modal Trả lại hồ sơ */}
      {showTraHoSoModal && <ModalTraHoSo onClose={() => setShowTraHoSoModal(false)} onConfirm={handleConfirmTraHoSo} />}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────


type AppView = "list" | "giao-tieu-ho-so" | "them-ho-so" | "phan-cong-ttv" | "cau-hinh-ttv" | "quan-ly-vu-an" | "chi-tiet-vu-an" | "cong-van-trao-doi" | "phan-cong-hdxx" | "quan-ly-vu-xet-xu" | "phe-duyet-de-xuat" | "quan-ly-khieu-nai" | "chi-tiet-khieu-nai" | "ho-so-khang-nghi" | "tao-cong-van";

export default function App() {
  const [appView, setAppView] = useState<AppView>("list");
  const [activeTab, setActiveTab] = useState<TabId>("don-cho-phe-duyet");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [selectedVuAnId, setSelectedVuAnId] = useState<string>("VA26-002621");

  const sidebarView: View =
    appView === "giao-tieu-ho-so" ? "giao-tieu-ho-so"
      : appView === "them-ho-so" ? "them-ho-so"
        : appView === "phan-cong-ttv" ? "phan-cong-ttv"
          : appView === "cau-hinh-ttv" ? "cau-hinh-ttv"
            : appView === "quan-ly-vu-an" || appView === "chi-tiet-vu-an" ? "quan-ly-vu-an"
              : appView === "quan-ly-khieu-nai" || appView === "chi-tiet-khieu-nai" ? "quan-ly-khieu-nai"
                : appView === "cong-van-trao-doi" ? "cong-van-trao-doi"
                  : appView === "phan-cong-hdxx" ? "phan-cong-hdxx"
                    : appView === "quan-ly-vu-xet-xu" ? "quan-ly-vu-xet-xu"
                      : appView === "phe-duyet-de-xuat" ? "phe-duyet-de-xuat"
                        : appView === "ho-so-khang-nghi" || appView === "tao-cong-van" ? "ho-so-khang-nghi"
                          : activeTab === "cho-y-kien" ? "cho-y-kien"
                            : activeTab === "da-co-vu-an" ? "da-co-vu-an"
                              : "don-cho-phe-duyet";

  const handleSidebarNav = (v: View) => {
    if (v === "phan-cong-ttv") { setAppView("phan-cong-ttv"); return; }
    if (v === "cau-hinh-ttv") { setAppView("cau-hinh-ttv"); return; }
    if (v === "quan-ly-vu-an") { setAppView("quan-ly-vu-an"); return; }
    if (v === "quan-ly-khieu-nai") { setAppView("quan-ly-khieu-nai"); return; }
    if (v === "giao-tieu-ho-so") { setAppView("giao-tieu-ho-so"); return; }
    if (v === "them-ho-so") { setAppView("them-ho-so"); return; }
    if (v === "cong-van-trao-doi") { setAppView("cong-van-trao-doi"); return; }
    if (v === "phan-cong-hdxx") { setAppView("phan-cong-hdxx"); return; }
    if (v === "quan-ly-vu-xet-xu") { setAppView("quan-ly-vu-xet-xu"); return; }
    if (v === "phe-duyet-de-xuat") { setAppView("phe-duyet-de-xuat"); return; }
    if (v === "ho-so-khang-nghi") { setAppView("ho-so-khang-nghi"); return; }
    setAppView("list");
    const tabMap: Record<string, TabId> = {
      "don-cho-phe-duyet": "don-cho-phe-duyet",
      "cho-y-kien": "cho-y-kien",
      "da-co-vu-an": "da-co-vu-an",
    };
    if (tabMap[v]) setActiveTab(tabMap[v]);
  };

  const [selectedVuAnTab, setSelectedVuAnTab] = useState<ChiTietTab>("danh-sach-don");

  const handleSelectVuAn = (id: string, tab: ChiTietTab = "danh-sach-don") => {
    setSelectedVuAnId(id);
    setSelectedVuAnTab(tab);
    setAppView("chi-tiet-vu-an");
  };

  const [selectedKhieuNaiId, setSelectedKhieuNaiId] = useState<string>("VA26-002621");
  const [selectedKhieuNaiTab, setSelectedKhieuNaiTab] = useState<ChiTietTab>("danh-sach-don");
  const [activeCongVanConfig, setActiveCongVanConfig] = useState<any>(null);

  const handleSelectKhieuNai = (id: string, tab: ChiTietTab = "danh-sach-don") => {
    setSelectedKhieuNaiId(id);
    setSelectedKhieuNaiTab(tab);
    setAppView("chi-tiet-khieu-nai");
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", fontFamily: F, overflow: "hidden", background: "#f9fafb" }}>
      <Sidebar currentView={sidebarView} onNavigate={handleSidebarNav} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopBar />

        {appView === "phan-cong-ttv" ? (
          <PhanCongTTVView />
        ) : appView === "cau-hinh-ttv" ? (
          <CauHinhTTVView />
        ) : appView === "quan-ly-vu-an" ? (
          <QuanLyVuAnView onSelectVuAn={handleSelectVuAn} />
        ) : appView === "chi-tiet-vu-an" ? (
          <ChiTietVuAnView key={selectedVuAnId + selectedVuAnTab} vuAnId={selectedVuAnId} onBack={() => setAppView("quan-ly-vu-an")} initialTab={selectedVuAnTab} />
        ) : appView === "quan-ly-khieu-nai" ? (
          <QuanLyKhieuNaiView onSelectKhieuNai={handleSelectKhieuNai} />
        ) : appView === "chi-tiet-khieu-nai" ? (
          <ChiTietVuAnView
            key={selectedKhieuNaiId + selectedKhieuNaiTab}
            vuAnId={selectedKhieuNaiId}
            onBack={() => setAppView("quan-ly-khieu-nai")}
            initialTab={selectedKhieuNaiTab}
            moduleLabel="Quản lý khiếu nại"
            detailLabel="Chi tiết khiếu nại"
            entityWord="Khiếu nại"
          />
        ) : appView === "phan-cong-hdxx" ? (
          <PhanCongHDXXView />
        ) : appView === "quan-ly-vu-xet-xu" ? (
          <QuanLyVuXetXuView />
        ) : appView === "phe-duyet-de-xuat" ? (
          <PheDuyetDeXuatView />
        ) : appView === "cong-van-trao-doi" ? (
          <CongVanTraoDoiView />
        ) : appView === "ho-so-khang-nghi" ? (
          <HoSoKhangNghiView onTaoCongVan={(cfg) => { setActiveCongVanConfig(cfg); setAppView("tao-cong-van"); }} />
        ) : appView === "tao-cong-van" ? (
          <WordEditorView record={activeCongVanConfig} onBack={() => setAppView("ho-so-khang-nghi")} />
        ) : appView === "giao-tieu-ho-so" ? (
          <GiaoTieuHoSoView onClose={() => setAppView("list")} />
        ) : appView === "them-ho-so" ? (
          <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
            <button
              onClick={() => setAppView("list")}
              style={{
                position: "absolute", top: 12, left: 12, zIndex: 10,
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", background: "#fff", color: RED,
                border: `1px solid ${RED}`, borderRadius: 4, cursor: "pointer",
                fontSize: 12, fontWeight: 600, fontFamily: F,
              }}
            >
              ← Quay lại
            </button>
            <ThemHoSoScreen />
          </div>
        ) : (
          <>
            <Breadcrumb />
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
            <SearchFilterPanel expanded={filterExpanded} onToggle={() => setFilterExpanded((v) => !v)} />
            <ActionBar tab={activeTab} onGiaoTieuHoSo={() => setAppView("giao-tieu-ho-so")} />
            <CaseTable tab={activeTab} onGiaoTieuHoSo={() => setAppView("giao-tieu-ho-so")} onThemHoSo={() => setAppView("them-ho-so")} />
          </>
        )}
      </div>
    </div>
  );
}
