import React from "react";
import { Search, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, getAnDacThuOptions, getThoiHieuOptions, type UserRoleType } from "./shared";
import { LOAI_AN_OPTIONS } from "./data";

type FieldType = "input" | "select" | "date" | "dateRange";

interface FieldDef {
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
}

type RowCell = FieldDef | "diaChi" | "anDacThu" | "thoiHieu" | null;

const SEARCH_ROWS: [RowCell, RowCell, RowCell, RowCell][] = [
  [
    { label: "Mã đơn", type: "input", placeholder: "Mã đơn" },
    { label: "Số BA/QĐ", type: "input", placeholder: "Số BA/QĐ" },
    { label: "Ngày BA/QĐ", type: "date" },
    { label: "Tòa ra BA/QĐ", type: "select", placeholder: "-- Chọn --" },
  ],
  [
    { label: "Thời gian nhận đơn", type: "dateRange", placeholder: "Chọn khoảng ngày" },
    { label: "Chi tiết", type: "input", placeholder: "Chi tiết" },
    { label: "Thẩm phán", type: "select", placeholder: "-- Tất cả --" },
    "anDacThu",
  ],
  [
    "diaChi",
    { label: "Phân loại đơn", type: "select", placeholder: "-- Tất cả --" },
    { label: "Số CCCD", type: "input", placeholder: "Số CCCD" },
    { label: "Người gửi đơn", type: "input", placeholder: "Người gửi đơn" },
  ],
  [
    { label: "Khoảng thời gian chuyển", type: "dateRange", placeholder: 'Chọn ngày chuyển'},
    { label: "Hình thức đơn", type: "select", placeholder: "-- Tất cả --" },
    { label: "Số thụ lý", type: "input", placeholder: "Số thụ lý" },
  ],
  [
    { label: "Ngày thụ lý", type: "dateRange" },
    { label: "Thụ lý đơn", type: "select", placeholder: "-- Tất cả --" },
    { label: "Số CV chuyển", type: "input", placeholder: "Số CV chuyển" },
  ],
  [
    { label: "Ngày CV chuyển", type: "date" },
    { label: "TTV giải quyết đơn", type: "select", placeholder: "-- Tất cả --" },
    { label: "Loại án", type: "select", placeholder: "-- Tất cả --", options: [...LOAI_AN_OPTIONS] },
    { label: "Giao THS", type: "select", placeholder: "-- Tất cả --" },
  ],
  [
    { label: "Nơi chuyển", type: "select", placeholder: "-- Tất cả --" },
    { label: "Số tờ trình phân công thẩm phán", type: "input", placeholder: "Số tờ trình phân công thẩm phán" },
    { label: "Ngày tờ trình", type: "date" },
    "thoiHieu",
  ],
];

export function SearchFilterPanel({
  expanded,
  onToggle,
  userRole,
}: {
  expanded: boolean;
  onToggle: () => void;
  userRole?: UserRoleType;
}) {
  const [selectedLoaiAn, setSelectedLoaiAn] = React.useState<string>("");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 10px",
    fontSize: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    fontFamily: F,
    color: TEXT,
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none",
    cursor: "pointer",
    color: MUTED,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    color: MUTED,
    fontFamily: F,
    marginBottom: 4,
    display: "block",
  };

  const renderField = ({ label, type, placeholder, options }: FieldDef) => (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <span style={labelStyle}>{label}</span>
  
      {type === "select" ? (
        <select
          style={selectStyle}
          defaultValue=""
          value={label === "Loại án" ? selectedLoaiAn : undefined}
          onChange={label === "Loại án" ? (e) => setSelectedLoaiAn(e.target.value) : undefined}
        >
          <option value="">{placeholder ?? "-- Chọn --"}</option>
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : type === "dateRange" ? (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="date"
            style={{ ...inputStyle, flex: 1 }}
          />
          <input
            type="date"
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>
      ) : (
        <input
          type={type === "date" ? "date" : "text"}
          placeholder={placeholder ?? label}
          style={inputStyle}
        />
      )}
    </div>
  );

  const diaChiGui = (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <span style={labelStyle}>Địa chỉ gửi</span>
      <div style={{ display: "flex", gap: 8 }}>
        <select style={{ ...selectStyle, flex: 1 }} defaultValue="">
          <option value="">-- Tỉnh/Thành --</option>
        </select>
        <select style={{ ...selectStyle, flex: 1 }} defaultValue="">
          <option value="">-- Quận/Huyện --</option>
        </select>
      </div>
    </div>
  );

  const visibleRows = expanded ? SEARCH_ROWS : SEARCH_ROWS.slice(0, 1);

  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "14px 20px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px 16px",
          marginBottom: 12,
        }}
      >
        {visibleRows.flatMap((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const key = `${rowIdx}-${colIdx}`;
            if (cell === null) return <div key={key} />;
            if (cell === "diaChi") return <React.Fragment key={key}>{diaChiGui}</React.Fragment>;
            if (cell === "anDacThu") {
              const options = getAnDacThuOptions(userRole, selectedLoaiAn);
              return (
                <div key={key} style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={labelStyle}>Án đặc thù</span>
                  <select style={selectStyle} defaultValue="">
                    <option value="">-- Tất cả --</option>
                    {options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              );
            }
            if (cell === "thoiHieu") {
              const options = getThoiHieuOptions(userRole, selectedLoaiAn);
              return (
                <div key={key} style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={labelStyle}>Thời hiệu</span>
                  <select style={selectStyle} defaultValue="">
                    <option value="">-- Tất cả --</option>
                    {options.map((o) => (
                      <option key={o.val} value={o.val}>{o.label}</option>
                    ))}
                  </select>
                </div>
              );
            }
            return <React.Fragment key={key}>{renderField(cell)}</React.Fragment>;
          }),
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <button
          onClick={onToggle}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            color: "#2563eb",
            fontFamily: F,
            padding: 0,
            fontWeight: 500,
          }}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? "Thu gọn" : "Mở rộng"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 18px",
              background: "#7f1d1d",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: F,
            }}
          >
            <Search size={13} />
            Tìm kiếm
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
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
            <RotateCcw size={13} />
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}
