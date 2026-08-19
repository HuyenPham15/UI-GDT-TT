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

type RowCell = FieldDef | "diaChi" | "anDacThu" | "thoiHieu" | "trangThai" | "trangThaiRadio" | null;

const SEARCH_ROWS: RowCell[][] = [
  [
    { label: "Người gửi đơn", type: "input" },
    { label: "Số BA/QĐ", type: "input" },
    { label: "Ngày BA/QĐ", type: "date" },
  ],
  [
    { label: "Tòa ra BA/QĐ", type: "select", placeholder: "--- Chọn ---" },
    { label: "Nhận đơn từ", type: "date" },
    { label: "Đến ngày", type: "date" },
  ],
  [
    "diaChi",
    { label: "Chi tiết", type: "input" },
    { label: "Thẩm phán", type: "select", placeholder: "--- Tất cả ---" },
  ],
  [
    { label: "Phân loại đơn", type: "select", placeholder: "--- Tất cả ---", options: ["Đơn khiếu nại sau khi đã giải quyết", "Đơn đề nghị GĐT/TT", "Công văn kiến nghị GĐT/TT", "Đơn khiếu nại quyết định"] },
    { label: "Số CMND", type: "input" },
    { label: "Mã đơn", type: "input" },
  ],
  [
    { label: "Ngày chuyển từ", type: "date" },
    { label: "Đến ngày", type: "date" },
    { label: "Hình thức đơn", type: "select", placeholder: "--- Tất cả ---" },
  ],
  [
    { label: "Ngày thụ lý từ", type: "date" },
    { label: "Đến ngày", type: "date" },
    { label: "Số thụ lý", type: "input" },
  ],
  [
    { label: "Thụ lý đơn", type: "select", placeholder: "--Tất cả--" },
    { label: "Số CV chuyển", type: "input" },
    { label: "Ngày CV chuyển", type: "date" },
  ],
  [
    { label: "Cán bộ giải quyết đơn", type: "select", placeholder: "--- Tất cả ---" },
    { label: "Loại án", type: "select", options: [...LOAI_AN_OPTIONS] },
    { label: "Giao THS", type: "select", placeholder: "--Tất cả--" },
  ],
  [
    "trangThaiRadio",
    null,
    { label: "Nơi chuyển", type: "select", placeholder: "--Tất cả--" },
  ],
];

const SEARCH_ROWS_KHANG_NGHI: RowCell[][] = [
  [
    { label: "Mã văn thư đến", type: "input", placeholder: "Mã văn thư đến" },
    { label: "Số kháng nghị", type: "input", placeholder: "Số kháng nghị" },
    { label: "Ngày kháng nghị", type: "dateRange" },
    { label: "Người kháng nghị", type: "select", placeholder: "--Tất cả--" },
    { label: "Khoảng thời gian văn thư đến", type: "dateRange", placeholder: "Chọn khoảng ngày" },

  ],
  [
    { label: "Số BA/QĐ", type: "input", placeholder: "Số BA/QĐ" },

    { label: "Ngày BA/QĐ", type: "date" },
    { label: "Tòa ra BA/QĐ", type: "select", placeholder: "-- Chọn --" },
  ],
  [
    "anDacThu",
    { label: "Số thụ lý xét xử", type: "input", placeholder: "Số thụ lý xét xử" },
    { label: "Khoảng thời gian thụ lý xét xử", type: "dateRange" },
  ],
  [
    { label: "Số VT đi", type: "input", placeholder: "Số CV chuyển" },
    { label: "Ngày VT đi", type: "date" },
    { label: "TTV giải quyết", type: "select", placeholder: "-- Tất cả --" },
    { label: "Loại án", type: "select", placeholder: "-- Tất cả --", options: [...LOAI_AN_OPTIONS] },
  ],
  [
    { label: "Nơi chuyển", type: "select", placeholder: "-- Tất cả --" },
    "thoiHieu",
    null,
    null,
  ],
];

export function SearchFilterPanel({
  expanded,
  onToggle,
  userRole,
  isHoSoKhangNghi,
}: {
  expanded: boolean;
  onToggle: () => void;
  userRole?: UserRoleType;
  isHoSoKhangNghi?: boolean;
}) {
  const [selectedLoaiAn, setSelectedLoaiAn] = React.useState<string>("");

  React.useEffect(() => {
    if (userRole === "vu-1" || userRole === "hinh-su") {
      setSelectedLoaiAn("Hình sự");
    } else if (userRole === "vu-2" || userRole === "dan-su") {
      setSelectedLoaiAn("Dân sự");
    } else if (userRole === "vu-3") {
      setSelectedLoaiAn("Dân sự chung");
    } else if (userRole === "vu-4" || userRole === "hanh-chinh") {
      setSelectedLoaiAn("Hành chính");
    } else {
      setSelectedLoaiAn("");
    }
  }, [userRole]);

  const inputStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    padding: "5px 10px",
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
    color: TEXT,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: TEXT,
    fontFamily: F,
    width: 130,
    flexShrink: 0,
  };
  const fieldContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  };

  const renderField = ({ label, type, placeholder, options }: FieldDef) => (
    <div style={fieldContainerStyle}>
      <span style={labelStyle}>{label}</span>

      {type === "select" ? (
        <select
          style={selectStyle}
          defaultValue=""
          value={label === "Loại án" ? selectedLoaiAn : undefined}
          onChange={label === "Loại án" ? (e) => setSelectedLoaiAn(e.target.value) : undefined}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {(() => {
            if (label === "Loại án") {
              let finalOptions: string[] = [];
              if (userRole === "vu-1" || userRole === "hinh-su") {
                finalOptions = ["Hình sự"];
              } else if (userRole === "vu-2" || userRole === "dan-su") {
                finalOptions = ["Dân sự"];
              } else if (userRole === "vu-3") {
                const filtered = (options || []).filter((opt) => opt !== "Hành chính");
                finalOptions = [...filtered, "Dân sự chung"];
              } else if (userRole === "vu-4" || userRole === "hanh-chinh") {
                finalOptions = ["Dân sự", "Hành chính"];
              } else {
                finalOptions = [...(options || []), "Dân sự chung"];
              }
              return finalOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ));
            }
            return (options || []).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ));
          })()}
        </select>
      ) : type === "dateRange" ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, minWidth: 0 }}>
          <input
            type="date"
            style={inputStyle}
          />
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>đến</span>
          <input
            type="date"
            style={inputStyle}
          />
        </div>
      ) : (
        <input
          type={type === "date" ? "date" : "text"}
          placeholder={placeholder}
          style={inputStyle}
        />
      )}
    </div>
  );

  const diaChiGui = (
    <div style={fieldContainerStyle}>
      <span style={labelStyle}>Địa chỉ gửi</span>
      <div style={{ display: "flex", gap: 8, flex: 1, minWidth: 0 }}>
        <select style={selectStyle} defaultValue="">
          <option value="">--- Tỉnh/Thành ---</option>
        </select>
        <select style={selectStyle} defaultValue="">
          <option value="">--- Quận/Huyện ---</option>
        </select>
      </div>
    </div>
  );

  const targetRows = isHoSoKhangNghi ? SEARCH_ROWS_KHANG_NGHI : SEARCH_ROWS;
  const visibleRows = expanded ? targetRows : targetRows.slice(0, isHoSoKhangNghi ? 1 : 3);

  return (
    <div style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, padding: "14px 20px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isHoSoKhangNghi ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
          gap: "10px 24px",
          marginBottom: 12,
        }}
      >
        {visibleRows.flatMap((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const key = `${rowIdx}-${colIdx}`;
            if (cell === null) return <div key={key} />;
            if (cell === "diaChi") return <React.Fragment key={key}>{diaChiGui}</React.Fragment>;
            if (cell === "trangThai") {
              return (
                <div key={key} style={fieldContainerStyle}>
                  <span style={labelStyle}>Trạng thái</span>
                  <select style={selectStyle} defaultValue="">
                    <option value="">-- Tất cả --</option>
                    <option value="chua-nhan">Chưa nhận</option>
                    <option value="da-nhan">Đã nhận</option>
                    <option value="tra-lai">Trả lại</option>
                  </select>
                </div>
              );
            }
            if (cell === "trangThaiRadio") {
              return (
                <div key={key} style={fieldContainerStyle}>
                  <span style={labelStyle}>Trạng thái</span>
                  <div style={{ display: "flex", gap: 12, flex: 1, alignItems: "center", fontSize: 12, fontFamily: F, color: TEXT }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                      <input type="radio" name="trangThai" defaultChecked />
                      Chưa nhận
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                      <input type="radio" name="trangThai" />
                      Đã nhận
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                      <input type="radio" name="trangThai" />
                      Trả lại
                    </label>
                  </div>
                </div>
              );
            }
            if (cell === "anDacThu") {
              const options = getAnDacThuOptions(userRole, selectedLoaiAn);
              return (
                <div key={key} style={fieldContainerStyle}>
                  <span style={labelStyle}>Thuộc án</span>
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
                <div key={key} style={fieldContainerStyle}>
                  <span style={labelStyle}>Thời hiệu</span>
                  <select style={selectStyle} defaultValue="">
                    <option value="">-- Tất cả --</option>
                    <option value="15">Đã hết thời hiệu</option>
                    <option value="30">Còn thời hiệu dưới một tháng</option>
                    <option value="45">Còn thời hiệu dưới hai tháng</option>
                    <option value="60">Còn thời hiệu dưới ba tháng</option>
                    <option value="90">Còn thời hiệu dưới sáu tháng</option>
                    <option value="120">Còn thời hiệu dưới 1 năm</option>
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

