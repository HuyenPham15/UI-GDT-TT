import React, { useState } from "react";
import {
  Search, RefreshCw, Eye,
  ChevronDown, ChevronUp, RotateCcw, X, Save, Printer,
  Calendar, FileText, CheckCircle, Clock, Plus, Download, UserCheck, ArrowRight, Filter, AlertCircle, Check
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
  const isDonChoPheDuyet = tab === "don-cho-phe-duyet" || c.tabs?.includes("don-cho-phe-duyet");
  const isChoYKienTab = tab === "cho-y-kien";
  const isBac3Tab = tab === "da-co-vu-an" || isDonChoPheDuyet;
  const showDuKien = !isDaCoVuAn && !isChoYKienTab;

  const capThamPhanText = isBac3Tab ? "TPB3" : c.capThamPhan;
  const tpBac3List = ["Nguyễn Biên Thuỳ", "Trần Minh Đức", "Lê Văn Minh", "Chu Thị Thu Hiền", "Nguyễn Thị Hoa"];
  const thamPhanText = isBac3Tab ? (tpBac3List[c.id % tpBac3List.length] || c.thamPhan) : c.thamPhan;

  const soToTrinhText = (c as any).soToTrinh || `${12 + c.id}/TT-V1`;
  const ngayToTrinhText = (c as any).ngayToTrinh || "15/07/2026";

  let hinhThucText = c.hinhThuc;
  if (c.soCV) {
    hinhThucText = "Đơn đề nghị GĐT,TT kèm theo CV chuyển đơn";
  } else if (!hinhThucText || hinhThucText.toLowerCase() === "đơn") {
    hinhThucText = "Đơn đề nghị GĐT,TT";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {c.type === "don" ? (
        <>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F }}>
            Mã đơn: {c.maDon}
          </span>
          {!isChoYKienTab && (
            c.daThuLy ? (
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
                    Thụ lý mới: {c.thuLyMoi} - {c.ngaythuly}
                  </span>
                )}
              </>
            )
          )}
          {tab === "da-co-vu-an" && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
              Tờ trình: {soToTrinhText} - {ngayToTrinhText}
            </span>
          )}
          {!isChoYKienTab && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
              Thẩm phán{showDuKien ? " (Dự kiến)" : ""}: {thamPhanText} ({capThamPhanText})
            </span>
          )}
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Hình thức: {hinhThucText}
          </span>
        </>
      ) : (
        <>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F }}>
            Mã văn thư đến: {c.maVanThuDen} - {c.ngayVanThuDen}
          </span>
          {!isChoYKienTab && (
            <>
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
            </>
          )}
          {tab === "da-co-vu-an" && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
              Tờ trình: {soToTrinhText} - {ngayToTrinhText}
            </span>
          )}
          {!isChoYKienTab && (
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
              Thẩm phán{showDuKien ? " (Dự kiến)" : ""}: {thamPhanText} ({capThamPhanText})
            </span>
          )}
          <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
            Hình thức: {hinhThucText}
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
  if (!c.soBA && !c.toa && !c.soBASoTham && !c.soBAPhucTham) {
    return <span style={{ color: "#000000", fontSize: 11, fontFamily: F }}>-</span>;
  }

  const showQHPL = isVu234(userRole, c.loaiAn);
  const qhplText = getQuanHePhapLuat(c);

  const shortCode = c.loaiAn === "Hình sự" ? "HS" : c.loaiAn === "Dân sự" ? "DS" : c.loaiAn === "Hành chính" ? "HC" : "KDTM";

  // Sơ thẩm
  const soST = c.soBASoTham || (c.soBA?.includes("ST") ? c.soBA : `12/2025/${shortCode}-ST`);
  const ngayST = c.ngayBASoTham || (c.soBA?.includes("ST") ? c.ngayBA : "15/08/2025");
  const toaST = c.toaSoTham || (c.toa && !c.toa.includes("cấp cao") && !c.toa.includes("tối cao") ? c.toa : "TAND tỉnh Bắc Ninh");
  const isQD_ST = soST.toUpperCase().includes("QĐ") || soST.toUpperCase().includes("QD");
  const prefixST = isQD_ST ? "Số QDST" : "Số BAST";

  // Phúc thẩm - Bản án bị đề nghị GĐT/TT
  const soPT = c.soBAPhucTham || (c.soBA?.includes("PT") ? c.soBA : c.id % 2 === 0 ? "58/2025/HSPT-QĐ" : `45/2023/${shortCode}-PT`);
  const ngayPT = c.ngayBAPhucTham || (c.soBA?.includes("PT") ? c.ngayBA : "25/02/2025");
  const rawToaPT = c.toaPhucTham || (c.toa && (c.toa.includes("cấp cao") || c.toa.includes("tối cao")) ? c.toa : "TACC tại Hà Nội");

  let toaPTFormatted = rawToaPT;
  if (rawToaPT.includes("Hà Nội")) toaPTFormatted = `TACC tại Hà Nội(${shortCode}-PT)`;
  else if (rawToaPT.includes("Hồ Chí Minh") || rawToaPT.includes("TP.HCM")) toaPTFormatted = `TACC tại TP. Hồ Chí Minh(${shortCode}-PT)`;
  else if (rawToaPT.includes("Đà Nẵng")) toaPTFormatted = `TACC tại Đà Nẵng(${shortCode}-PT)`;
  else if (!rawToaPT.includes("-PT)")) toaPTFormatted = `${rawToaPT}(${shortCode}-PT)`;

  const isQD_PT = soPT.toUpperCase().includes("QĐ") || soPT.toUpperCase().includes("QD");
  const prefixPT = isQD_PT ? "Số QDPT" : "Số BAPT";

  // Xác định cấp bản án bị đề nghị GĐT/TT (Sơ thẩm hay Phúc thẩm)
  const isHighlightST = c.capDeNghi === "so-tham" || (c.capDeNghi === undefined && c.id % 2 === 1);
  const isHighlightPT = !isHighlightST;

  // Xác định có hay không có Quyết định GĐT/TT
  const showGDT = c.hasGDT !== undefined ? c.hasGDT : (c.id % 3 === 0);
  const soGDT = c.soBAGDT || `08/2026/QĐ-GĐT-${shortCode}`;
  const ngayGDT = c.ngayBAGDT || "20/05/2026";
  const toaGDT = c.toaGDT || "TAND tối cao (Hội đồng Thẩm phán)";
  const isQD_GDT = soGDT.toUpperCase().includes("QĐ") || soGDT.toUpperCase().includes("QD");
  const prefixGDT = isQD_GDT ? "Số QDGĐT" : "Số BAGĐT";

  const highlightContainerStyle: React.CSSProperties = {
    background: "#fefce8",
    border: "1px solid #facc15",
    borderRadius: 5,
    padding: "5px 7px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    boxShadow: "0 1px 2px rgba(234,179,8,0.15)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 11, fontFamily: F, lineHeight: 1.35, color: "#000000" }}>
      {/* Thông tin Sơ thẩm */}
      {soST && (
        isHighlightST ? (
          <div style={highlightContainerStyle}>
            <span style={{ color: "#000000", fontSize: 11 }}>
              {prefixST}: <b>{formatSoBA(soST, c.loaiAn)}</b>
              {ngayST && <span>  Ngày: <b>{ngayST}</b></span>}
            </span>
            <span style={{ color: "#000000", fontSize: 10.5 }}>Tòa: {toaST}</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ color: "#000000", fontSize: 11 }}>
              {prefixST}: <b>{formatSoBA(soST, c.loaiAn)}</b>
              {ngayST && <span>  Ngày: <b>{ngayST}</b></span>}
            </span>
            <span style={{ color: "#000000", fontSize: 10.5 }}>Tòa: {toaST}</span>
          </div>
        )
      )}

      {/* Thông tin Phúc thẩm */}
      {soPT && (
        isHighlightPT ? (
          <div style={highlightContainerStyle}>
            <span style={{ color: "#000000", fontSize: 11 }}>
              {prefixPT}: <b>{formatSoBA(soPT, c.loaiAn)}</b>
              {ngayPT && <span>  Ngày: <b>{ngayPT}</b></span>}
            </span>
            <span style={{ color: "#000000", fontSize: 10.5 }}>{toaPTFormatted}</span>
          </div>
        ) : (
          <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 4, display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ color: "#000000", fontSize: 11 }}>
              {prefixPT}: <b>{formatSoBA(soPT, c.loaiAn)}</b>
              {ngayPT && <span>  Ngày: <b>{ngayPT}</b></span>}
            </span>
            <span style={{ color: "#000000", fontSize: 10.5 }}>{toaPTFormatted}</span>
          </div>
        )
      )}

      {/* Thông tin Giám đốc thẩm (chỉ hiển thị khi có QĐ GĐT) */}
      {showGDT && (
        <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 4, display: "flex", flexDirection: "column", gap: 1 }}>
          <span style={{ color: "#000000", fontSize: 11 }}>
            {prefixGDT}: <b>{soGDT}</b>
            {ngayGDT && <span>  Ngày: <b>{ngayGDT}</b></span>}
          </span>
          <span style={{ color: "#000000", fontSize: 10.5 }}>Tòa: {toaGDT}</span>
        </div>
      )}

      {/* Thông tin bổ sung */}
      {c.thoiHieu && (
        <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 3, marginTop: 1 }}>
          <span style={{ color: "#000000" }}>Thời hiệu: </span>
          <span style={{ color: "#000000", fontWeight: 600 }}>
            {c.thoiHieu}
          </span>
        </div>
      )}

      {showQHPL && (
        <span style={{ fontSize: 10.5, color: "#000000", fontWeight: 500 }}>
          <span style={{ color: "#000000", fontWeight: 400 }}>QHPL: </span>{qhplText}
        </span>
      )}
    </div>
  );
}

// ── Thông tin vụ án cell ─────────────────────────────────────────────────────

function CellVuAn({ c, tab, onThemHoSo }: { c: DonCase; tab?: TabId; onThemHoSo?: () => void }) {
  const isDaCoVuAn = tab === "da-co-vu-an" || c.daThuLy;
  const isChoYKienOrTraLai = tab === "cho-y-kien" || tab === "tra-lai";
  const daGiaoTHS = c.daGiaoTHS !== undefined ? c.daGiaoTHS : (c.id % 2 === 0);

  const ttvList = ["Phạm Thị Minh", "Nguyễn Văn A", "Lê Văn Hùng", "Trịnh Đức Minh", "Hoàng Văn Tuấn"];
  const ttvText = c.ttv || ttvList[c.id % ttvList.length];

  const ldvList = ["Trần Văn Bình (Phó Vụ trưởng)", "Nguyễn Thị Nga (Vụ trưởng)", "Lê Hoàng Nam (Phó Vụ trưởng)", "Phạm Đức Anh (Phó Vụ trưởng)"];
  const ldvAssignedName = c.ldv || ldvList[c.id % ldvList.length];

  const tpBac3List = ["Nguyễn Biên Thuỳ", "Trần Minh Đức", "Lê Văn Minh", "Chu Thị Thu Hiền", "Nguyễn Thị Hoa"];
  const tpText = c.tpGiaiQuyet || c.thamPhan || tpBac3List[c.id % tpBac3List.length];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ textAlign: "left" }}>
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F, lineHeight: 1.4, display: "block", marginBottom: 2 }}>
          Tên vụ án: {c.tenVuAn || `Vụ án ${c.nguoiKhieuNai || "Đặng Thị Dương"} – Tội cố ý gây thương tích`}
        </span>

        {isChoYKienOrTraLai ? (
          <div style={{
            marginTop: 3, padding: "6px 8px",
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: 5, display: "flex", flexDirection: "column", gap: 3,
          }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#15803d", fontFamily: F, textTransform: "uppercase", letterSpacing: 0.3 }}>
              ĐÃ CÓ TBGQ: TBTLĐ SỐ 1
            </span>

            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              TTV giải quyết: <strong>{c.ttvGiaiQuyet || "Nguyễn Văn An"}</strong>
            </span>

            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              LĐV giải quyết: <strong>{ldvAssignedName}</strong>
            </span>

            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              TP giải quyết: <strong>{c.tpGiaiQuyet || "Đào Văn Nam"}</strong>
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              TTV: {ttvText}
            </span>
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              LĐV: {ldvAssignedName}
            </span>
            <span style={{ fontSize: 11, color: TEXT, fontFamily: F, display: "block" }}>
              TP: {tpText}
            </span>
          </div>
        )}

        {isDaCoVuAn && (
          <div style={{ marginTop: 4 }}>
            {daGiaoTHS ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "2px 7px",
                  background: "#dcfce7",
                  border: "1px solid #86efac",
                  borderRadius: 4,
                  color: "#166534",
                  fontSize: 10.5,
                  fontWeight: 700,
                  fontFamily: F,
                }}
                title="Đã giao tiểu hồ sơ"
              >
                ✓ Đã giao THS
              </span>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "2px 7px",
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  borderRadius: 4,
                  color: "#c2410c",
                  fontSize: 10.5,
                  fontWeight: 700,
                  fontFamily: F,
                }}
                title="Chưa giao tiểu hồ sơ"
              >
                ⏳ Chưa giao THS
              </span>
            )}
          </div>
        )}
      </div>

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
    const nguoiThaoTacText = c.nguoiThaoTac || "Nguyễn Văn Hùng";
    const ngayDuyet =
      (c as any).ngayDuyetToTrinh ||
      c.yKienLD?.[0]?.date ||
      c.ngayThaoTac ||
      c.ngayNhan ||
      "24/07/2026";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 11, color: TEXT, fontFamily: F, fontWeight: 500 }}>
          {nguoiThaoTacText} ({ngayDuyet})
        </span>
      </div>
    );
  }

  const hasData = c.ngayNhan || c.nguoiThaoTac || c.nguoiTra;
  if (!hasData)
    return <span style={{ color: MUTED, fontSize: 11, fontFamily: F }}>-</span>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 11, fontFamily: F }}>
      {c.ngayNhan && (
        <span style={{ color: TEXT }}>
          Ngày nhận: {c.ngayNhan}
        </span>
      )}
      {(c.nguoiThaoTac || c.ngayThaoTac) && (
        <span style={{ color: TEXT }}>
          Người thao tác: {c.nguoiThaoTac || "–"}{c.ngayThaoTac ? ` (${c.ngayThaoTac})` : ""}
        </span>
      )}
      {(c.nguoiTra || c.ngayTra) && (
        <span style={{ color: TEXT }}>
          Người trả: {c.nguoiTra || "–"}{c.ngayTra ? ` (${c.ngayTra})` : ""}
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
  userRole,
}: {
  tab: TabId;
  onGiaoTieuHoSo: () => void;
  onInBaoCao?: () => void;
  userRole?: UserRoleType;
}) {
  const currentCases = getCasesByTab(tab, userRole);
  const totalCases = currentCases.length;

  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        padding: "8px 20px", background: "#fff",
        borderBottom: `1px solid ${BORDER}`, flexShrink: 0, flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

      {/* Hiển thị góc phải bảng như ảnh mẫu */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: TEXT, fontFamily: F }}>
        {totalCases === 0 ? (
          <span style={{ color: RED, fontWeight: 600 }}>Không có kết quả nào phù hợp yêu cầu tìm kiếm !</span>
        ) : (
          <span>
            Hiển thị <b>1–{Math.min(totalCases, 10)}</b> trong tổng số <b style={{ color: RED }}>{totalCases}</b> bản ghi
          </span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 6 }}>
          <button style={paginBtn} disabled>‹</button>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: `1px solid ${RED}`,
              color: RED,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            1
          </span>
          <button style={paginBtn}>›</button>
          <select style={{ padding: "2px 6px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 11, outline: "none" }}>
            <option>10 / trang</option>
          </select>
        </div>
      </div>
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

  const lastColHeader = "THÔNG TIN VỤ ÁN";

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
        ? "NGƯỜI THAO TÁC"
        : tab === "cho-y-kien"
          ? "Ý KIẾN LÃNH ĐẠO"
          : "THÔNG TIN NHẬN/TRẢ";

  const hasNhanTraCol = tab !== "don-cho-phe-duyet" && tab !== "tat-ca";

  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        {hasNhanTraCol ? (
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
        ) : (
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 36 }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: 52 }} />
          </colgroup>
        )}
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
            {hasNhanTraCol && <th style={TH_STYLE}>{nhanTraHeader}</th>}
            <th style={{ ...TH_STYLE, textAlign: "center" }}>THAO TÁC</th>
          </tr>
        </thead>
        <tbody>
          {cases.length === 0 && (
            <tr>
              <td colSpan={hasNhanTraCol ? 8 : 7} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>
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
                <CellVuAn c={c} tab={tab} onThemHoSo={onThemHoSo} />
              </td>
              {hasNhanTraCol && (
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
                  ) : tab === "cho-y-kien" ? (
                    <CellYKienLD c={c} />
                  ) : (
                    <CellNhanTra c={c} tab={tab} />
                  )}
                </td>
              )}
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

// ── Giao tiểu hồ sơ view (Nhập thông tin, Quản lý theo dõi, In báo cáo) ───────

export function GiaoTieuHoSoView({ onClose, userRole }: { onClose: () => void; userRole?: UserRoleType }) {
  const [activeTab, setActiveTab] = useState<"giao-ttv" | "nhan-vphctp" | "so-theo-doi">("giao-ttv");
  const [expanded, setExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printType, setPrintType] = useState<"danh-sach" | "phieu-giao">("phieu-giao");
  const [showNewModal, setShowNewModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Sample data of THS cases
  const [giaoCases, setGiaoCases] = useState([
    {
      id: 1,
      maDon: "6966/2026/GĐT",
      soCV: "514 - 20/07/2026",
      thuLyMoi: "54682424",
      ngaythuly: "22/07/2026",
      hinhThuc: "CV kiến nghị GĐT, TT",
      nguoiKhieuNai: "Đỗ Tất Đạt",
      biCao: "Vũ Hòa Hảo",
      ndd: "NGUYỄN TRUNG HÒA",
      soBA: "12/2026/HS-PT",
      ngayBA: "20/07/2026",
      toa: "TAND Cấp cao tại Hà Nội",
      thoiHieu: "1 năm",
      loaiAn: "Hình sự",
      nguoiGiaoVPHCTP: "Nguyễn Văn Hùng (VPHCTP)",
      nguoiNhanVu: "Vũ Diệu Thúy",
      ngayVuNhan: "21/07/2026",
      ttvNhan: "Lý Thái Phúc",
      ngayTTVNhan: "22/07/2026",
      trangThaiTHS: "da-giao-ttv", // 'chua-nhan' | 'da-nhan-vu' | 'da-giao-ttv'
      soTap: "01 tập (150 trang)",
      ghiChu: "Đã bàn giao đầy đủ 01 bộ tiểu hồ sơ và đĩa ghi âm",
      soPhieuGiao: "PG-2026/089",
    },
    {
      id: 2,
      maDon: "6965/2026/GĐT",
      soCV: "513 - 20/07/2026",
      thuLyMoi: "54682425",
      ngaythuly: "22/07/2026",
      hinhThuc: "CV kiến nghị GĐT, TT",
      nguoiKhieuNai: "Trần Thị Hồng",
      biCao: "Lê Văn Tùng",
      ndd: "PHẠM VĂN THÀNH",
      soBA: "15/2026/HS-PT",
      ngayBA: "18/07/2026",
      toa: "TAND Cấp cao tại Hà Nội",
      thoiHieu: "2 năm",
      loaiAn: "Hình sự",
      nguoiGiaoVPHCTP: "Nguyễn Văn Hùng (VPHCTP)",
      nguoiNhanVu: "Phạm Thị Bích Ngọc",
      ngayVuNhan: "21/07/2026",
      ttvNhan: "Vũ Biêu Thư",
      ngayTTVNhan: "23/07/2026",
      trangThaiTHS: "da-giao-ttv",
      soTap: "02 tập (280 trang)",
      ghiChu: "Đã giao TTV nghiên cứu",
      soPhieuGiao: "PG-2026/090",
    },
    {
      id: 3,
      maDon: "6988/2026/GĐT",
      soCV: "520 - 22/07/2026",
      thuLyMoi: "54682490",
      ngaythuly: "22/07/2026",
      hinhThuc: "Đơn đề nghị GĐT, TT",
      nguoiKhieuNai: "Hoàng Đức Nam",
      biCao: "Nguyễn Văn Cường",
      ndd: "HOÀNG ĐỨC NAM",
      soBA: "45/2025/DS-ST",
      ngayBA: "10/05/2025",
      toa: "TAND tỉnh Bắc Ninh",
      thoiHieu: "6 tháng",
      loaiAn: "Dân sự",
      nguoiGiaoVPHCTP: "Đặng Thị Thảo (VPHCTP)",
      nguoiNhanVu: "Vũ Diệu Thúy",
      ngayVuNhan: "23/07/2026",
      ttvNhan: "",
      ngayTTVNhan: "",
      trangThaiTHS: "da-nhan-vu",
      soTap: "01 tập (95 trang)",
      ghiChu: "Chờ phân công TTV tiếp nhận",
      soPhieuGiao: "PG-2026/091",
    },
    {
      id: 4,
      maDon: "7012/2026/GĐT",
      soCV: "535 - 24/07/2026",
      thuLyMoi: "54682510",
      ngaythuly: "24/07/2026",
      hinhThuc: "CV kiến nghị GĐT, TT",
      nguoiKhieuNai: "Công ty TNHH Á Châu",
      biCao: "Ngân hàng TMCP Sài Gòn",
      ndd: "TRẦN VĂN ANH",
      soBA: "88/2025/KDTM-PT",
      ngayBA: "12/06/2025",
      toa: "TACC tại TP. Hồ Chí Minh",
      thoiHieu: "1 năm",
      loaiAn: "Kinh doanh thương mại",
      nguoiGiaoVPHCTP: "Phạm Văn Long (VPHCTP)",
      nguoiNhanVu: "",
      ngayVuNhan: "",
      ttvNhan: "",
      ngayTTVNhan: "",
      trangThaiTHS: "chua-nhan",
      soTap: "01 tập (110 trang)",
      ghiChu: "Mới chuyển từ VPHCTP, chờ Vụ nhận",
      soPhieuGiao: "PG-2026/092",
    },
  ]);

  // Form data for new handover modal
  const [newForm, setNewForm] = useState({
    maDon: "",
    soBA: "",
    nguoiGiao: "Nguyễn Văn Hùng (VPHCTP)",
    nguoiNhan: "Vũ Diệu Thúy",
    ttvNhan: "Lý Thái Phúc",
    ngayGiao: "25/07/2026",
    soTap: "01 tập",
    ghiChu: "Bàn giao hồ sơ vụ án GĐT",
  });

  const mainTabs = [
    { id: "giao-ttv", label: "1. Giao THS đến TTV" },
    { id: "nhan-vphctp", label: "2. Nhận THS từ VPHCTP" },
    { id: "so-theo-doi", label: "3. Sổ theo dõi & Lịch sử giao THS" },
  ] as const;

  // Filtered cases
  const filteredCases = giaoCases.filter((c) => {
    if (activeTab === "nhan-vphctp" && c.trangThaiTHS === "da-giao-ttv") return true;
    if (filterStatus === "da-giao" && c.trangThaiTHS !== "da-giao-ttv") return false;
    if (filterStatus === "chua-giao" && c.trangThaiTHS === "da-giao-ttv") return false;
    if (filterStatus === "da-nhan" && c.trangThaiTHS !== "da-nhan-vu") return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        c.maDon.toLowerCase().includes(q) ||
        c.soBA.toLowerCase().includes(q) ||
        c.nguoiKhieuNai.toLowerCase().includes(q) ||
        (c.ttvNhan && c.ttvNhan.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Checkbox Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCases.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCases.map((c) => c.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Inline Change Handlers
  const handleUpdateCase = (id: number, field: string, value: string) => {
    setGiaoCases((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "ttvNhan" && value) {
            updated.trangThaiTHS = "da-giao-ttv";
            if (!updated.ngayTTVNhan) updated.ngayTTVNhan = "25/07/2026";
          }
          if (field === "nguoiNhanVu" && value) {
            if (updated.trangThaiTHS === "chua-nhan") updated.trangThaiTHS = "da-nhan-vu";
            if (!updated.ngayVuNhan) updated.ngayVuNhan = "25/07/2026";
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Batch actions
  const handleBatchConfirmNhan = () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một bản ghi để xác nhận!");
      return;
    }
    setGiaoCases((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          return {
            ...item,
            trangThaiTHS: "da-nhan-vu",
            nguoiNhanVu: item.nguoiNhanVu || "Vũ Diệu Thúy",
            ngayVuNhan: item.ngayVuNhan || "25/07/2026",
          };
        }
        return item;
      })
    );
    setSaveSuccessMsg(`Đã xác nhận nhận THS thành công cho ${selectedIds.length} bản ghi!`);
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  const handleBatchGiaoTTV = () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một bản ghi để giao TTV!");
      return;
    }
    setGiaoCases((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          return {
            ...item,
            trangThaiTHS: "da-giao-ttv",
            ttvNhan: item.ttvNhan || "Lý Thái Phúc",
            ngayTTVNhan: item.ngayTTVNhan || "25/07/2026",
          };
        }
        return item;
      })
    );
    setSaveSuccessMsg(`Đã giao tiểu hồ sơ cho TTV thành công cho ${selectedIds.length} bản ghi!`);
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  const handleSaveData = () => {
    setSaveSuccessMsg("Đã lưu thông tin bàn giao tiểu hồ sơ thành công!");
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  const handleAddNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = giaoCases.length + 1;
    const newItem = {
      id: newId,
      maDon: newForm.maDon || `${7000 + newId}/2026/GĐT`,
      soCV: "540 - 25/07/2026",
      thuLyMoi: "54682600",
      hinhThuc: "Đơn đề nghị GĐT, TT",
      nguoiKhieuNai: "Nguyễn Văn Hùng",
      biCao: "Lê Thị Lan",
      ndd: "NGUYỄN VĂN HÙNG",
      soBA: newForm.soBA || "99/2025/HS-PT",
      ngayBA: "15/05/2025",
      toa: "TAND Cấp cao tại Hà Nội",
      thoiHieu: "1 năm",
      loaiAn: "Hình sự" as const,
      nguoiGiaoVPHCTP: newForm.nguoiGiao,
      nguoiNhanVu: newForm.nguoiNhan,
      ngayVuNhan: newForm.ngayGiao,
      ttvNhan: newForm.ttvNhan,
      ngayTTVNhan: newForm.ngayGiao,
      trangThaiTHS: newForm.ttvNhan ? "da-giao-ttv" : "da-nhan-vu",
      soTap: newForm.soTap,
      ghiChu: newForm.ghiChu,
      soPhieuGiao: `PG-2026/09${newId}`,
    };
    setGiaoCases([newItem, ...giaoCases]);
    setShowNewModal(false);
    setSaveSuccessMsg("Đã tạo mới bản ghi giao tiểu hồ sơ!");
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  const filterInputStyle: React.CSSProperties = {
    width: "100%",
    height: 32,
    padding: "0 8px",
    fontSize: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    background: "#fff",
    color: TEXT,
    boxSizing: "border-box",
  };

  const cellInputStyle: React.CSSProperties = {
    width: "100%",
    height: 30,
    padding: "0 6px",
    fontSize: 11,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    outline: "none",
    background: "#fff",
    color: TEXT,
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc", fontFamily: F }}>
      {/* Breadcrumb */}
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, background: "#fff", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          Trang chủ › Quản lý án GĐT/TT › Nhận đơn và TL vụ án › <b style={{ color: TEXT }}>Giao & Quản lý tiểu hồ sơ</b>
        </div>
        {saveSuccessMsg && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 10px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 4, color: "#15803d", fontSize: 11, fontWeight: 600 }}>
            <Check size={13} /> {saveSuccessMsg}
          </div>
        )}
      </div>

      {/* Main Sub Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, padding: "0 20px", background: "#fff", flexShrink: 0, justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex" }}>
          {mainTabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "12px 20px",
                  fontSize: 13,
                  fontFamily: F,
                  fontWeight: active ? 700 : 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: active ? "#800000" : "#6b7280",
                  borderBottom: active ? `2px solid #800000` : "2px solid transparent",
                  marginBottom: -1,
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Metric Badge */}
        <div style={{ display: "flex", gap: 8, fontSize: 11 }}>
          <span style={{ padding: "3px 9px", background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", borderRadius: 12, fontWeight: 600 }}>
            Tổng số: <b>{giaoCases.length}</b> THS
          </span>
          <span style={{ padding: "3px 9px", background: "#dcfce7", border: "1px solid #86efac", color: "#15803d", borderRadius: 12, fontWeight: 600 }}>
            Đã giao TTV: <b>{giaoCases.filter(c => c.trangThaiTHS === "da-giao-ttv").length}</b>
          </span>
          <span style={{ padding: "3px 9px", background: "#fff7ed", border: "1px solid #fed7aa", color: "#c2410c", borderRadius: 12, fontWeight: 600 }}>
            Chưa giao TTV: <b>{giaoCases.filter(c => c.trangThaiTHS !== "da-giao-ttv").length}</b>
          </span>
        </div>
      </div>

      {/* Filter Panel Box */}
      <div style={{ padding: "12px 20px 8px", flexShrink: 0 }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "12px 16px" }}>
          {/* Row 1 Filter Inputs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: expanded ? 10 : 0 }}>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Từ khóa / Mã đơn</div>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  placeholder="Mã đơn, Số BA, Tên đs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ ...filterInputStyle, paddingRight: 24 }}
                />
                <Search size={13} color="#9ca3af" style={{ position: "absolute", right: 7, pointerEvents: "none" }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Trạng thái tiểu hồ sơ</div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={filterInputStyle}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="da-giao">✓ Đã giao TTV</option>
                <option value="da-nhan">📥 Đã nhận Vụ (Chưa giao TTV)</option>
                <option value="chua-giao">⏳ Chưa giao TTV</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Thẩm tra viên nhận</div>
              <select style={filterInputStyle}>
                <option value="">Tất cả TTV</option>
                <option value="1">Lý Thái Phúc</option>
                <option value="2">Vũ Biêu Thư</option>
                <option value="3">Trần Thị Mai</option>
                <option value="4">Vũ Xuân Hiển</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Tòa ra bản án</div>
              <select style={filterInputStyle}>
                <option value="">Tất cả các tòa</option>
                <option value="1">TAND Cấp cao tại Hà Nội</option>
                <option value="2">TAND Cấp cao tại Đà Nẵng</option>
                <option value="3">TAND Cấp cao tại TP.HCM</option>
                <option value="4">TAND tỉnh Bắc Ninh</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Từ ngày giao</div>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input placeholder="dd/mm/yyyy" style={{ ...filterInputStyle, paddingRight: 24 }} />
                <Calendar size={13} color="#9ca3af" style={{ position: "absolute", right: 7, pointerEvents: "none" }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Đến ngày giao</div>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input placeholder="dd/mm/yyyy" style={{ ...filterInputStyle, paddingRight: 24 }} />
                <Calendar size={13} color="#9ca3af" style={{ position: "absolute", right: 7, pointerEvents: "none" }} />
              </div>
            </div>
          </div>

          {/* Collapsible Row 2 */}
          {expanded && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Số công văn chuyển</div>
                <input placeholder="Số CV chuyển" style={filterInputStyle} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Loại án</div>
                <select style={filterInputStyle}>
                  <option value="">Tất cả loại án</option>
                  <option value="HS">Hình sự</option>
                  <option value="DS">Dân sự</option>
                  <option value="HC">Hành chính</option>
                  <option value="KDTM">Kinh doanh thương mại</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Người giao VPHCTP</div>
                <select style={filterInputStyle}>
                  <option value="">Tất cả cán bộ VPHCTP</option>
                  <option value="1">Nguyễn Văn Hùng</option>
                  <option value="2">Đặng Thị Thảo</option>
                  <option value="3">Phạm Văn Long</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Cán bộ Vụ nhận</div>
                <select style={filterInputStyle}>
                  <option value="">Tất cả cán bộ Vụ</option>
                  <option value="1">Vũ Diệu Thúy</option>
                  <option value="2">Phạm Thị Bích Ngọc</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Tình trạng hồ sơ</div>
                <select style={filterInputStyle}>
                  <option value="">Đầy đủ tập THS</option>
                  <option value="1">Kèm đĩa ghi âm/CD</option>
                  <option value="2">Có đơn bổ sung</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>Số phiếu bàn giao</div>
                <input placeholder="PG-2026/..." style={filterInputStyle} />
              </div>
            </div>
          )}

          {/* Filter Footer Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 2 }}>
            <button
              onClick={() => setExpanded((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
                cursor: "pointer", fontSize: 12, color: "#2563eb", fontFamily: F, padding: 0,
              }}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} {expanded ? "Thu gọn bộ lọc" : "Mở rộng bộ lọc"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "5px 12px",
                  background: "#fff", color: "#374151", border: `1px solid ${BORDER}`,
                  borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F,
                }}
              >
                <RotateCcw size={13} /> Xóa bộ lọc
              </button>
              <button
                style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "5px 16px",
                  background: "#800000", color: "#fff", border: "none",
                  borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F,
                }}
              >
                <Search size={13} /> Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar Above Table */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "4px 20px 10px", flexShrink: 0 }}>
        {/* Left Side Management Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setShowNewModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
              background: "#16a34a", color: "#fff", border: "none", borderRadius: 4,
              cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <Plus size={14} /> Nhập thông tin bàn giao
          </button>
          <button
            onClick={handleBatchConfirmNhan}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
              background: "#2563eb", color: "#fff", border: "none", borderRadius: 4,
              cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F,
            }}
          >
            <CheckCircle size={14} /> Xác nhận nhận THS ({selectedIds.length})
          </button>
          <button
            onClick={handleBatchGiaoTTV}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
              background: "#d97706", color: "#fff", border: "none", borderRadius: 4,
              cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F,
            }}
          >
            <ArrowRight size={14} /> Phân công & Giao TTV ({selectedIds.length})
          </button>
          <button
            onClick={handleSaveData}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
              background: "#800000", color: "#fff", border: "none", borderRadius: 4,
              cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F,
            }}
          >
            <Save size={14} /> Lưu thay đổi
          </button>
        </div>

        {/* Right Side Report & Print Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => {
              setPrintType("danh-sach");
              setShowPrintModal(true);
            }}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
              background: "#fff", color: "#374151", border: `1px solid ${BORDER}`,
              borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F,
            }}
          >
            <Printer size={13} color="#4b5563" /> In báo cáo danh sách
          </button>
          <button
            onClick={() => {
              setPrintType("phieu-giao");
              setShowPrintModal(true);
            }}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
              background: "#0284c7", color: "#fff", border: "none",
              borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F,
              boxShadow: "0 1px 2px rgba(2,132,199,0.2)",
            }}
          >
            <FileText size={14} /> In phiếu bàn giao THS
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "6px 16px", background: "#fff", color: "#374151",
              border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer",
              fontSize: 12, fontFamily: F,
            }}
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Main View Body */}
      {activeTab === "so-theo-doi" ? (
        /* Tab 3: Sổ theo dõi & Lịch sử giao nhận THS */
        <div style={{ flex: 1, padding: "0 20px 20px", overflow: "auto" }}>
          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#800000", marginBottom: 14, fontFamily: F }}>
              📊 SỔ THEO DÕI & LỊCH SỬ BÀN GIAO TIỂU HỒ SƠ
            </h3>

            {/* Metrics overview */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>TỔNG TIỂU HỒ SƠ QUẢN LÝ</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#1e293b" }}>{giaoCases.length} hồ sơ</div>
                <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 4 }}>Đã ghi nhận trong sổ theo dõi</div>
              </div>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: 11, color: "#166534", marginBottom: 4 }}>ĐÃ GIAO ĐẾN TTV</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#15803d" }}>
                  {giaoCases.filter((c) => c.trangThaiTHS === "da-giao-ttv").length} hồ sơ
                </div>
                <div style={{ fontSize: 10.5, color: "#166534", marginTop: 4 }}>TTV đang giải quyết</div>
              </div>
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: 11, color: "#1e40af", marginBottom: 4 }}>VỤ ĐÃ TIẾP NHẬN</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#1d4ed8" }}>
                  {giaoCases.filter((c) => c.trangThaiTHS === "da-nhan-vu").length} hồ sơ
                </div>
                <div style={{ fontSize: 10.5, color: "#1e40af", marginTop: 4 }}>Đang chờ phân công TTV</div>
              </div>
              <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: 11, color: "#9a3412", marginBottom: 4 }}>CHỜ VỤ TIẾP NHẬN</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#c2410c" }}>
                  {giaoCases.filter((c) => c.trangThaiTHS === "chua-nhan").length} hồ sơ
                </div>
                <div style={{ fontSize: 10.5, color: "#9a3412", marginTop: 4 }}>Mới chuyển từ VPHCTP</div>
              </div>
            </div>

            {/* Audit History Log */}
            <h4 style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 10, fontFamily: F }}>
              📋 NHẬT KÝ LUÂN CHUYỂN & BÀN GIAO THS GẦN ĐÂY
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {giaoCases.map((item, idx) => (
                <div key={idx} style={{ padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 6, background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#800000" }}>{item.soPhieuGiao}</span>
                    <span style={{ fontSize: 12, color: TEXT }}>Mã đơn: <b>{item.maDon}</b></span>
                    <span style={{ fontSize: 12, color: MUTED }}>| Số BA: <b>{item.soBA}</b></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11 }}>
                    <span>Người giao: <b>{item.nguoiGiaoVPHCTP}</b></span>
                    <span>➔</span>
                    <span>TTV nhận: <b style={{ color: "#1d4ed8" }}>{item.ttvNhan || item.nguoiNhanVu || "Chưa nhận"}</b></span>
                    <span>Ngày: <b>{item.ngayTTVNhan || item.ngayVuNhan || "25/07/2026"}</b></span>
                    {item.trangThaiTHS === "da-giao-ttv" ? (
                      <span style={{ padding: "2px 7px", background: "#dcfce7", color: "#166534", borderRadius: 4, fontWeight: 700 }}>✓ Đã giao TTV</span>
                    ) : item.trangThaiTHS === "da-nhan-vu" ? (
                      <span style={{ padding: "2px 7px", background: "#dbeafe", color: "#1e40af", borderRadius: 4, fontWeight: 700 }}>📥 Vụ đã nhận</span>
                    ) : (
                      <span style={{ padding: "2px 7px", background: "#ffedd5", color: "#c2410c", borderRadius: 4, fontWeight: 700 }}>⏳ Chờ Vụ nhận</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Tab 1 & 2: Interactive Table View */
        <div style={{ flex: 1, overflow: "auto", padding: "0 20px 20px" }}>
          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: 36 }} />
                <col style={{ width: 38 }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "18%" }} />
                {activeTab === "giao-ttv" ? (
                  <>
                    <col style={{ width: "11%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "11%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "11%" }} />
                  </>
                ) : (
                  <>
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "11%" }} />
                    <col style={{ width: "13%" }} />
                  </>
                )}
              </colgroup>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                  <th style={{ ...TH_STYLE, textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={filteredCases.length > 0 && selectedIds.length === filteredCases.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th style={TH_STYLE}>STT</th>
                  <th style={TH_STYLE}>Thông tin đơn</th>
                  <th style={TH_STYLE}>Đương sự & Người đứng đơn</th>
                  <th style={TH_STYLE}>Thông tin BA/QĐ đề nghị GĐT,TT</th>
                  {activeTab === "giao-ttv" ? (
                    <>
                      <th style={TH_STYLE}>Người nhận Vụ GĐ,KT</th>
                      <th style={TH_STYLE}>Ngày Vụ nhận</th>
                      <th style={TH_STYLE}>TTV nhận THS</th>
                      <th style={TH_STYLE}>Ngày TTV nhận</th>
                      <th style={TH_STYLE}>Ghi chú & Trạng thái</th>
                    </>
                  ) : (
                    <>
                      <th style={TH_STYLE}>Người giao VPHCTP</th>
                      <th style={TH_STYLE}>Người nhận Vụ GĐ,KT</th>
                      <th style={TH_STYLE}>Ngày Vụ nhận</th>
                      <th style={TH_STYLE}>Ghi chú & Trạng thái</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredCases.length === 0 && (
                  <tr>
                    <td colSpan={activeTab === "giao-ttv" ? 10 : 9} style={{ ...TD_STYLE, textAlign: "center", color: MUTED, padding: 32 }}>
                      Không có bản ghi bàn giao tiểu hồ sơ nào phù hợp bộ lọc
                    </td>
                  </tr>
                )}
                {filteredCases.map((gc, idx) => (
                  <tr
                    key={gc.id}
                    style={{
                      background: selectedIds.includes(gc.id) ? "#f0f9ff" : idx % 2 === 0 ? "#fff" : "#fafafa",
                      borderBottom: `1px solid #f3f4f6`,
                    }}
                  >
                    <td style={{ ...TD_STYLE, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(gc.id)}
                        onChange={() => toggleSelect(gc.id)}
                      />
                    </td>
                    <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{idx + 1}</td>

                    {/* Cột 1: Thông tin đơn */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3, borderLeft: "3px solid #059669", paddingLeft: 6 }}>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          Mã đơn: <b style={{ color: RED }}>{gc.maDon}</b>
                        </span>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          CV chuyển: {gc.soCV}
                        </span>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          Thụ lý mới: <b>{gc.thuLyMoi} - {gc.ngaythuly}</b>
                        </span>
                        <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>
                          Hình thức: {gc.hinhThuc}
                        </span>
                      </div>
                    </td>

                    {/* Cột 2: Đương sự và người đứng đơn */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          Người khiếu nại: <b>{gc.nguoiKhieuNai}</b>
                        </span>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          Bị cáo: <b>{gc.biCao}</b>
                        </span>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          NĐD: <b>{gc.ndd}</b>
                        </span>
                      </div>
                    </td>

                    {/* Cột 3: Thông tin BA/QĐ */}
                    <td style={TD_STYLE}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          Số BA: <span style={{ color: "#2563eb", fontWeight: 600 }}>{formatSoBA(gc.soBA, gc.loaiAn)}</span>
                        </span>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          Ngày: <span style={{ color: "#2563eb" }}>{gc.ngayBA}</span>
                        </span>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          Tại: {gc.toa}
                        </span>
                        <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>
                          Số tập THS: <b style={{ color: "#047857" }}>{gc.soTap}</b>
                        </span>
                      </div>
                    </td>

                    {/* Các cột tương tác nhập liệu trực tiếp */}
                    {activeTab === "giao-ttv" ? (
                      <>
                        <td style={TD_STYLE}>
                          <select
                            value={gc.nguoiNhanVu}
                            onChange={(e) => handleUpdateCase(gc.id, "nguoiNhanVu", e.target.value)}
                            style={cellInputStyle}
                          >
                            <option value="" disabled>Chọn người nhận</option>
                            <option value="Vũ Diệu Thúy">Vũ Diệu Thúy</option>
                            <option value="Phạm Thị Bích Ngọc">Phạm Thị Bích Ngọc</option>
                            <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                          </select>
                        </td>
                        <td style={TD_STYLE}>
                          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <input
                              value={gc.ngayVuNhan}
                              onChange={(e) => handleUpdateCase(gc.id, "ngayVuNhan", e.target.value)}
                              placeholder="dd/mm/yyyy"
                              style={{ ...cellInputStyle, paddingRight: 22 }}
                            />
                            <Calendar size={12} color="#9ca3af" style={{ position: "absolute", right: 5, pointerEvents: "none" }} />
                          </div>
                        </td>
                        <td style={TD_STYLE}>
                          <select
                            value={gc.ttvNhan}
                            onChange={(e) => handleUpdateCase(gc.id, "ttvNhan", e.target.value)}
                            style={{
                              ...cellInputStyle,
                              borderColor: gc.ttvNhan ? "#86efac" : BORDER,
                              background: gc.ttvNhan ? "#f0fdf4" : "#fff",
                              fontWeight: gc.ttvNhan ? 600 : 400,
                            }}
                          >
                            <option value="">Chọn TTV nhận</option>
                            <option value="Lý Thái Phúc">Lý Thái Phúc</option>
                            <option value="Vũ Biêu Thư">Vũ Biêu Thư</option>
                            <option value="Trần Thị Mai">Trần Thị Mai</option>
                            <option value="Vũ Xuân Hiển">Vũ Xuân Hiển</option>
                            <option value="Đỗ Thị Thu Hằng">Đỗ Thị Thu Hằng</option>
                          </select>
                        </td>
                        <td style={TD_STYLE}>
                          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <input
                              value={gc.ngayTTVNhan}
                              onChange={(e) => handleUpdateCase(gc.id, "ngayTTVNhan", e.target.value)}
                              placeholder="dd/mm/yyyy"
                              style={{ ...cellInputStyle, paddingRight: 22 }}
                            />
                            <Calendar size={12} color="#9ca3af" style={{ position: "absolute", right: 5, pointerEvents: "none" }} />
                          </div>
                        </td>
                        <td style={TD_STYLE}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <input
                              value={gc.ghiChu}
                              onChange={(e) => handleUpdateCase(gc.id, "ghiChu", e.target.value)}
                              placeholder="Nhập ghi chú bàn giao"
                              style={cellInputStyle}
                            />
                            {gc.trangThaiTHS === "da-giao-ttv" ? (
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#166534", background: "#dcfce7", padding: "1px 6px", borderRadius: 3, border: "1px solid #86efac", display: "inline-block" }}>
                                ✓ Đã giao TTV
                              </span>
                            ) : gc.trangThaiTHS === "da-nhan-vu" ? (
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#1d4ed8", background: "#eff6ff", padding: "1px 6px", borderRadius: 3, border: "1px solid #bfdbfe", display: "inline-block" }}>
                                📥 Vụ đã nhận (Chờ TTV)
                              </span>
                            ) : (
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#c2410c", background: "#fff7ed", padding: "1px 6px", borderRadius: 3, border: "1px solid #fed7aa", display: "inline-block" }}>
                                ⏳ Chưa tiếp nhận
                              </span>
                            )}
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={TD_STYLE}>
                          <select
                            value={gc.nguoiGiaoVPHCTP}
                            onChange={(e) => handleUpdateCase(gc.id, "nguoiGiaoVPHCTP", e.target.value)}
                            style={cellInputStyle}
                          >
                            <option value="Nguyễn Văn Hùng (VPHCTP)">Nguyễn Văn Hùng (VPHCTP)</option>
                            <option value="Đặng Thị Thảo (VPHCTP)">Đặng Thị Thảo (VPHCTP)</option>
                            <option value="Phạm Văn Long (VPHCTP)">Phạm Văn Long (VPHCTP)</option>
                          </select>
                        </td>
                        <td style={TD_STYLE}>
                          <select
                            value={gc.nguoiNhanVu}
                            onChange={(e) => handleUpdateCase(gc.id, "nguoiNhanVu", e.target.value)}
                            style={cellInputStyle}
                          >
                            <option value="">Chọn người nhận Vụ</option>
                            <option value="Vũ Diệu Thúy">Vũ Diệu Thúy</option>
                            <option value="Phạm Thị Bích Ngọc">Phạm Thị Bích Ngọc</option>
                          </select>
                        </td>
                        <td style={TD_STYLE}>
                          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <input
                              value={gc.ngayVuNhan}
                              onChange={(e) => handleUpdateCase(gc.id, "ngayVuNhan", e.target.value)}
                              placeholder="dd/mm/yyyy"
                              style={{ ...cellInputStyle, paddingRight: 22 }}
                            />
                            <Calendar size={12} color="#9ca3af" style={{ position: "absolute", right: 5, pointerEvents: "none" }} />
                          </div>
                        </td>
                        <td style={TD_STYLE}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <input
                              value={gc.ghiChu}
                              onChange={(e) => handleUpdateCase(gc.id, "ghiChu", e.target.value)}
                              placeholder="Ghi chú nhận THS"
                              style={cellInputStyle}
                            />
                            {gc.trangThaiTHS !== "chua-nhan" ? (
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#166534", background: "#dcfce7", padding: "1px 6px", borderRadius: 3, border: "1px solid #86efac", display: "inline-block" }}>
                                ✓ Vụ đã tiếp nhận
                              </span>
                            ) : (
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#c2410c", background: "#fff7ed", padding: "1px 6px", borderRadius: 3, border: "1px solid #fed7aa", display: "inline-block" }}>
                                ⏳ Chờ Vụ tiếp nhận
                              </span>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Footer */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED }}>
              <span>Hiển thị 1–{filteredCases.length} trong tổng {filteredCases.length} bản ghi bàn giao</span>
              <div style={{ flex: 1 }} />
              <button style={{ padding: "2px 7px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 11 }} disabled>‹</button>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", border: "1px solid #800000", color: "#800000", fontSize: 12, fontWeight: 700 }}>
                1
              </span>
              <button style={{ padding: "2px 7px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 11 }} disabled>›</button>
              <select style={{ padding: "2px 6px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 11, outline: "none" }}>
                <option>10 / trang</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 1: NHẬP THÔNG TIN BÀN GIAO THS MỚI ──────────────────────────── */}
      {showNewModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 8, width: 680, maxWidth: "100%", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "14px 20px", background: "#800000", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F }}>
                📝 NHẬP THÔNG TIN BÀN GIAO TIỂU HỒ SƠ MỚI
              </div>
              <button onClick={() => setShowNewModal(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNewSubmit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: TEXT, display: "block", marginBottom: 4 }}>Mã đơn / Mã hồ sơ</label>
                  <input
                    required
                    placeholder="VD: 7025/2026/GĐT"
                    value={newForm.maDon}
                    onChange={(e) => setNewForm({ ...newForm, maDon: e.target.value })}
                    style={filterInputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: TEXT, display: "block", marginBottom: 4 }}>Số bản án / Quyết định đề nghị</label>
                  <input
                    required
                    placeholder="VD: 102/2025/HS-PT"
                    value={newForm.soBA}
                    onChange={(e) => setNewForm({ ...newForm, soBA: e.target.value })}
                    style={filterInputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: TEXT, display: "block", marginBottom: 4 }}>Người giao (VPHCTP / Vụ)</label>
                  <input
                    value={newForm.nguoiGiao}
                    onChange={(e) => setNewForm({ ...newForm, nguoiGiao: e.target.value })}
                    style={filterInputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: TEXT, display: "block", marginBottom: 4 }}>Người nhận (Vụ GĐKT)</label>
                  <select
                    value={newForm.nguoiNhan}
                    onChange={(e) => setNewForm({ ...newForm, nguoiNhan: e.target.value })}
                    style={filterInputStyle}
                  >
                    <option value="Vũ Diệu Thúy">Vũ Diệu Thúy</option>
                    <option value="Phạm Thị Bích Ngọc">Phạm Thị Bích Ngọc</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: TEXT, display: "block", marginBottom: 4 }}>Thẩm tra viên nhận THS</label>
                  <select
                    value={newForm.ttvNhan}
                    onChange={(e) => setNewForm({ ...newForm, ttvNhan: e.target.value })}
                    style={filterInputStyle}
                  >
                    <option value="">Chưa phân công TTV</option>
                    <option value="Lý Thái Phúc">Lý Thái Phúc</option>
                    <option value="Vũ Biêu Thư">Vũ Biêu Thư</option>
                    <option value="Trần Thị Mai">Trần Thị Mai</option>
                    <option value="Vũ Xuân Hiển">Vũ Xuân Hiển</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: TEXT, display: "block", marginBottom: 4 }}>Ngày bàn giao</label>
                  <input
                    type="text"
                    value={newForm.ngayGiao}
                    onChange={(e) => setNewForm({ ...newForm, ngayGiao: e.target.value })}
                    style={filterInputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: TEXT, display: "block", marginBottom: 4 }}>Số tập & Số trang Tiểu hồ sơ</label>
                <input
                  placeholder="VD: 01 tập (120 trang), đĩa CD ghi âm"
                  value={newForm.soTap}
                  onChange={(e) => setNewForm({ ...newForm, soTap: e.target.value })}
                  style={filterInputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: TEXT, display: "block", marginBottom: 4 }}>Ghi chú nội dung bàn giao</label>
                <textarea
                  rows={3}
                  placeholder="Nhập ghi chú chi tiết tình trạng bàn giao tiểu hồ sơ..."
                  value={newForm.ghiChu}
                  onChange={(e) => setNewForm({ ...newForm, ghiChu: e.target.value })}
                  style={{ ...filterInputStyle, height: "auto", padding: "8px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  style={{ padding: "7px 18px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: "7px 22px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
                >
                  <Save size={13} style={{ marginRight: 4, verticalAlign: "middle" }} /> Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: IN BÁO CÁO & PHIẾU BÀN GIAO TIỂU HỒ SƠ ───────────────────── */}
      {showPrintModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 8, width: 840, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            {/* Modal Header */}
            <div style={{ padding: "12px 20px", background: "#1e293b", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F, display: "flex", alignItems: "center", gap: 8 }}>
                <Printer size={16} /> XEM TRƯỚC VĂN BẢN IN BÀN GIAO TIỂU HỒ SƠ
              </div>
              <button onClick={() => setShowPrintModal(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            {/* Document Preview Box (Mẫu Phiếu bàn giao chuẩn TANDTC) */}
            <div style={{ flex: 1, padding: 30, overflow: "auto", background: "#e2e8f0" }}>
              <div id="print-area" style={{ background: "#fff", padding: "40px 50px", border: "1px solid #cbd5e1", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", fontFamily: "'Times New Roman', Times, serif", color: "#000", fontSize: 13, lineHeight: 1.5 }}>

                {/* Quốc hiệu Tiêu ngữ */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ textAlign: "center", width: "45%" }}>
                    <div style={{ fontSize: 12, fontWeight: "normal" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                    <div style={{ fontSize: 12, fontWeight: "bold" }}>VỤ GIÁM ĐỐC KIỂM TRA</div>
                    <div style={{ borderBottom: "1px solid #000", width: 80, margin: "4px auto 0" }} />
                  </div>
                  <div style={{ textAlign: "center", width: "50%" }}>
                    <div style={{ fontSize: 12, fontWeight: "bold" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div style={{ fontSize: 12, fontWeight: "bold" }}>Độc lập - Tự do - Hạnh phúc</div>
                    <div style={{ borderBottom: "1px solid #000", width: 120, margin: "4px auto 0" }} />
                    <div style={{ fontStyle: "italic", fontSize: 11, marginTop: 4 }}>Hà Nội, ngày 25 tháng 07 năm 2026</div>
                  </div>
                </div>

                {/* Document Title */}
                <div style={{ textAlign: "center", margin: "25px 0 15px" }}>
                  <div style={{ fontSize: 16, fontWeight: "bold", textTransform: "uppercase" }}>
                    {printType === "phieu-giao" ? "PHIẾU BÀN GIAO TIỂU HỒ SƠ VỤ ÁN GĐT/TT" : "BÁO CÁO TỔNG HỢP DANH SÁCH BÀN GIAO TIỂU HỒ SƠ"}
                  </div>
                  <div style={{ fontSize: 12, fontStyle: "italic" }}>
                    Số: PG-2026/089-Vụ GĐKT
                  </div>
                </div>

                {/* Meta details */}
                <div style={{ margin: "15px 0", fontSize: 13 }}>
                  <div>- <b>Đơn vị bàn giao:</b> Văn phòng Hành chính Tư pháp / Lãnh đạo Vụ Giám đốc Kiểm tra</div>
                  <div>- <b>Đơn vị / Cán bộ nhận:</b> Thẩm tra viên được phân công nghiên cứu giải quyết vụ án</div>
                  <div>- <b>Thời gian bàn giao:</b> 09 giờ 30 phút, ngày 25/07/2026</div>
                </div>

                {/* Table of items */}
                <table style={{ width: "100%", borderCollapse: "collapse", margin: "15px 0", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                      <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center", width: 35 }}>STT</th>
                      <th style={{ border: "1px solid #000", padding: "6px", textAlign: "left" }}>Mã đơn / Số BA/QĐ</th>
                      <th style={{ border: "1px solid #000", padding: "6px", textAlign: "left" }}>Đương sự / Tên vụ án</th>
                      <th style={{ border: "1px solid #000", padding: "6px", textAlign: "left" }}>Thẩm tra viên nhận</th>
                      <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center", width: 70 }}>Số tập THS</th>
                      <th style={{ border: "1px solid #000", padding: "6px", textAlign: "left" }}>Ghi chú tình trạng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.slice(0, 5).map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>{idx + 1}</td>
                        <td style={{ border: "1px solid #000", padding: "6px" }}>
                          <b>{item.maDon}</b><br />
                          <span style={{ fontSize: 11 }}>{item.soBA}</span>
                        </td>
                        <td style={{ border: "1px solid #000", padding: "6px" }}>
                          <b>{item.nguoiKhieuNai}</b> vs <b>{item.biCao}</b>
                        </td>
                        <td style={{ border: "1px solid #000", padding: "6px" }}>
                          {item.ttvNhan || "Vũ Diệu Thúy"}
                        </td>
                        <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>
                          {item.soTap || "01 tập"}
                        </td>
                        <td style={{ border: "1px solid #000", padding: "6px" }}>
                          {item.ghiChu || "Hồ sơ đầy đủ các tài liệu theo quy định"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ marginTop: 10, fontSize: 12, fontStyle: "italic" }}>
                  * Phiếu này được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản để làm căn cứ theo dõi hồ sơ.
                </div>

                {/* Signatures */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 35, textAlign: "center" }}>
                  <div style={{ width: "30%" }}>
                    <div style={{ fontWeight: "bold" }}>BÊN BÀN GIAO</div>
                    <div style={{ fontSize: 11, fontStyle: "italic" }}>(Ký và ghi rõ họ tên)</div>
                    <div style={{ height: 60 }} />
                    <div style={{ fontWeight: "bold" }}>Nguyễn Văn Hùng</div>
                  </div>
                  <div style={{ width: "30%" }}>
                    <div style={{ fontWeight: "bold" }}>BÊN TIẾP NHẬN</div>
                    <div style={{ fontSize: 11, fontStyle: "italic" }}>(Ký và ghi rõ họ tên)</div>
                    <div style={{ height: 60 }} />
                    <div style={{ fontWeight: "bold" }}>Lý Thái Phúc</div>
                  </div>
                  <div style={{ width: "35%" }}>
                    <div style={{ fontWeight: "bold" }}>LÃNH ĐẠO VỤ PHÊ DUYỆT</div>
                    <div style={{ fontSize: 11, fontStyle: "italic" }}>(Ký và ghi rõ họ tên)</div>
                    <div style={{ height: 60 }} />
                    <div style={{ fontWeight: "bold" }}>Trần Văn Bình</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer Controls */}
            <div style={{ padding: "12px 20px", background: "#f8fafc", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, color: MUTED }}>
                Đã sẵn sàng để in {filteredCases.length} bản ghi bàn giao tiểu hồ sơ.
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => window.print()}
                  style={{ padding: "8px 20px", background: "#800000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Printer size={14} /> 🖨️ Thực hiện in phiếu (Ctrl + P)
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  style={{ padding: "8px 18px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
      <ActionBar tab={activeTab} userRole={userRole} onGiaoTieuHoSo={onGiaoTieuHoSo} onInBaoCao={() => onInBaoCao?.(activeTab)} />
      <CaseTable tab={activeTab} userRole={userRole} onGiaoTieuHoSo={onGiaoTieuHoSo} onThemHoSo={onThemHoSo} />
    </>
  );
}
