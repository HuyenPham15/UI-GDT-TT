import React, { useState } from "react";
import { Search, RotateCcw, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED } from "./shared";
import { LOAI_AN_OPTIONS } from "./data";
import { UserRoleType } from "./App";

export const DANH_SACH_TOA_AN_FILTER = [
  "Tòa án nhân dân tối cao",
  "Tòa án nhân dân cấp cao tại Hà Nội",
  "Tòa án nhân dân cấp cao tại Đà Nẵng",
  "Tòa án nhân dân cấp cao tại TP Hồ Chí Minh",
  "Tòa án nhân dân thành phố Hà Nội",
  "Tòa án nhân dân TP Hồ Chí Minh",
  "Tòa án nhân dân TP Hải Phòng",
  "Tòa án nhân dân TP Đà Nẵng",
  "Tòa án nhân dân TP Cần Thơ",
  "Tòa án nhân dân tỉnh Bắc Ninh",
  "Tòa án nhân dân tỉnh An Giang",
  "Tòa án nhân dân tỉnh Vĩnh Phúc",
  "Tòa án nhân dân tỉnh Hà Nam",
];

export const DANH_SACH_LANH_DAO_FILTER = [
  "Phạm Thị Bích Ngọc - Phó Vụ trưởng",
  "Lê Thị Thu Hiền - Phó Vụ trưởng",
  "Nguyễn Như Thắng - Vụ trưởng",
  "Nguyễn Biên Thùy - Phó Vụ trưởng",
  "Trần Hồng Hà - Vụ trưởng",
  "Nguyễn Văn Cường - Phó Vụ trưởng",
];

export const DANH_SACH_TTV_FILTER = [
  "Nguyễn Thị Thúy Hường",
  "Vũ Xuân Hiền",
  "Nguyễn Thị Hường",
  "Nguyễn Đức Thiện",
  "Vũ Diệu Thúy",
  "Đặng Thị Mai",
  "Trần Văn Hưng",
  "Lê Thị Lan",
  "Hoàng Ngọc Chiêu",
  "Đinh Thị Vân Anh",
];

export const DANH_SACH_THAM_PHAN_FILTER = [
  "Lê Thị Thu Hiền",
  "Nguyễn Văn A",
  "Trần Văn B",
  "Phạm Văn C",
  "Nguyễn Thị Hương",
  "Vũ Đức Thiện",
  "Hoàng Ngọc Chiêu",
];

export interface VuAnFilterValues {
  // Mặc định (1-11)
  loaiAn: string;
  toaRaBA: string;
  soBA: string;
  ngayBA: string;
  biCao: string;
  thuLyTuNgay: string;
  thuLyDenNgay: string;
  lanhDaoVu: string;
  thamTraVien: string;
  thamPhan: string;
  thuocAn: string;
  thoiHieu: string;
  // Mở rộng (12-19)
  hoanTHA: string;
  trangThaiHoSo: string;
  ketQuaGiaiQuyet: string;
  rutKhangNghi: string;
  toTrinhLanhDao: string;
  toTrinhTuNgay: string;
  toTrinhDenNgay: string;
  yeuCauTrinhTiep: string;
  yKienToTrinh: string;
}

const INITIAL_FILTER_VALUES: VuAnFilterValues = {
  loaiAn: "",
  toaRaBA: "",
  soBA: "",
  ngayBA: "",
  biCao: "",
  thuLyTuNgay: "",
  thuLyDenNgay: "",
  lanhDaoVu: "",
  thamTraVien: "",
  thamPhan: "",
  thuocAn: "",
  thoiHieu: "",
  hoanTHA: "",
  trangThaiHoSo: "",
  ketQuaGiaiQuyet: "",
  rutKhangNghi: "",
  toTrinhLanhDao: "",
  toTrinhTuNgay: "",
  toTrinhDenNgay: "",
  yeuCauTrinhTiep: "",
  yKienToTrinh: "",
};

export function VuAnSearchFilterPanel({
  userRole,
  onSearch,
  onReset,
}: {
  userRole?: UserRoleType;
  onSearch?: (filters: VuAnFilterValues) => void;
  onReset?: () => void;
}) {
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [filters, setFilters] = useState<VuAnFilterValues>(INITIAL_FILTER_VALUES);

  const isVu1 = userRole === "vu-1" || userRole === "hinh-su" || !userRole;

  const thuocAnOptions = isVu1
    ? ["Án Quốc hội", "Án chỉ đạo", "Án TVTN", "Án tử hình"]
    : ["Án Quốc hội", "Án chỉ đạo"];

  const biCaoLabel = isVu1
    ? "Bị cáo"
    : userRole === "vu-4" || userRole === "hanh-chinh"
    ? "Người bị kiện"
    : "Bị đơn";

  const handleChange = (key: keyof VuAnFilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTER_VALUES);
    if (onReset) onReset();
  };

  const handleSearch = () => {
    if (onSearch) onSearch(filters);
    else alert("Đang tìm kiếm theo tiêu chí bộ lọc...");
  };

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
    cursor: "pointer",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: MUTED,
    marginBottom: 4,
    fontFamily: F,
    display: "block",
  };

  return (
    <div
      style={{
        background: "#fff",
        borderBottom: `1px solid ${BORDER}`,
        padding: "14px 20px",
        flexShrink: 0,
        fontFamily: F,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* ── HÀNG 1 MẶC ĐỊNH (1-4): Loại án | Tòa ra BA/QĐ | Số BA/QĐ | Ngày BA/QĐ ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
          {/* 1. Loại án */}
          <div>
            <label style={labelStyle}>Loại án</label>
            <select
              value={filters.loaiAn}
              onChange={(e) => handleChange("loaiAn", e.target.value)}
              style={selectStyle}
            >
              <option value="">– Tất cả –</option>
              {LOAI_AN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 2. Tòa ra BA/QĐ */}
          <div>
            <label style={labelStyle}>Tòa ra BA/QĐ</label>
            <select
              value={filters.toaRaBA}
              onChange={(e) => handleChange("toaRaBA", e.target.value)}
              style={selectStyle}
            >
              <option value="">– Tất cả –</option>
              {DANH_SACH_TOA_AN_FILTER.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* 3. Số BA/QĐ */}
          <div>
            <label style={labelStyle}>Số BA/QĐ</label>
            <input
              placeholder="Nhập số BA/QĐ"
              value={filters.soBA}
              onChange={(e) => handleChange("soBA", e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* 4. Ngày BA/QĐ */}
          <div>
            <label style={labelStyle}>Ngày BA/QĐ</label>
            <div style={{ position: "relative" }}>
              <input
                placeholder="dd/mm/yyyy"
                value={filters.ngayBA}
                onChange={(e) => handleChange("ngayBA", e.target.value)}
                style={inputStyle}
              />
              <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>
        </div>

        {/* ── HÀNG 2 MẶC ĐỊNH (5-8): Bị cáo | Thụ lý từ ngày – Đến ngày | Lãnh đạo vụ | Thẩm tra viên ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
          {/* 5. Bị cáo */}
          <div>
            <label style={labelStyle}>{biCaoLabel}</label>
            <input
              placeholder={`Nhập tên ${biCaoLabel.toLowerCase()}`}
              value={filters.biCao}
              onChange={(e) => handleChange("biCao", e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* 6. Thụ lý từ ngày – Đến ngày */}
          <div>
            <label style={labelStyle}>Thụ lý từ ngày – Đến ngày</label>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                placeholder="Từ ngày"
                value={filters.thuLyTuNgay}
                onChange={(e) => handleChange("thuLyTuNgay", e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              />
              <span style={{ color: MUTED, fontSize: 11 }}>→</span>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  placeholder="Đến ngày"
                  value={filters.thuLyDenNgay}
                  onChange={(e) => handleChange("thuLyDenNgay", e.target.value)}
                  style={inputStyle}
                />
                <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>
          </div>

          {/* 7. Lãnh đạo vụ */}
          <div>
            <label style={labelStyle}>Lãnh đạo vụ</label>
            <select
              value={filters.lanhDaoVu}
              onChange={(e) => handleChange("lanhDaoVu", e.target.value)}
              style={selectStyle}
            >
              <option value="">– Tất cả –</option>
              {DANH_SACH_LANH_DAO_FILTER.map((ld) => (
                <option key={ld} value={ld}>{ld}</option>
              ))}
            </select>
          </div>

          {/* 8. Thẩm tra viên */}
          <div>
            <label style={labelStyle}>Thẩm tra viên</label>
            <select
              value={filters.thamTraVien}
              onChange={(e) => handleChange("thamTraVien", e.target.value)}
              style={selectStyle}
            >
              <option value="">– Tất cả –</option>
              {DANH_SACH_TTV_FILTER.map((ttv) => (
                <option key={ttv} value={ttv}>{ttv}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── HÀNG 3 MẶC ĐỊNH (9-11): Thẩm phán | Thuộc án | Thời hiệu ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
          {/* 9. Thẩm phán */}
          <div>
            <label style={labelStyle}>Thẩm phán</label>
            <select
              value={filters.thamPhan}
              onChange={(e) => handleChange("thamPhan", e.target.value)}
              style={selectStyle}
            >
              <option value="">– Tất cả –</option>
              {DANH_SACH_THAM_PHAN_FILTER.map((tp) => (
                <option key={tp} value={tp}>{tp}</option>
              ))}
            </select>
          </div>

          {/* 10. Thuộc án */}
          <div>
            <label style={labelStyle}>Thuộc án</label>
            <select
              value={filters.thuocAn}
              onChange={(e) => handleChange("thuocAn", e.target.value)}
              style={selectStyle}
            >
              <option value="">– Tất cả –</option>
              {thuocAnOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 11. Thời hiệu */}
          <div>
            <label style={labelStyle}>Thời hiệu</label>
            <select
              value={filters.thoiHieu}
              onChange={(e) => handleChange("thoiHieu", e.target.value)}
              style={selectStyle}
            >
              <option value="">– Tất cả –</option>
              <option value="Không có thời hiệu giải quyết">Không có thời hiệu giải quyết</option>
              <option value="1 năm">1 năm</option>
              <option value="3 năm">3 năm</option>
              <option value="5 năm">5 năm</option>
            </select>
          </div>

          <div />
        </div>

        {/* ── MỞ RỘNG (12-19) ── */}
        {filterExpanded && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: `1px dashed ${BORDER}`, paddingTop: 12 }}>
            {/* Hàng 4 Mở rộng (12-15): Hoãn THA | Trạng thái hồ sơ | Kết quả giải quyết | Rút kháng nghị */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
              {/* 12. Hoãn THA */}
              <div>
                <label style={labelStyle}>Hoãn THA</label>
                <select
                  value={filters.hoanTHA}
                  onChange={(e) => handleChange("hoanTHA", e.target.value)}
                  style={selectStyle}
                >
                  <option value="">– Tất cả –</option>
                  <option value="Có">Có</option>
                  <option value="Không">Không</option>
                </select>
              </div>

              {/* 13. Trạng thái hồ sơ */}
              <div>
                <label style={labelStyle}>Trạng thái hồ sơ</label>
                <select
                  value={filters.trangThaiHoSo}
                  onChange={(e) => handleChange("trangThaiHoSo", e.target.value)}
                  style={selectStyle}
                >
                  <option value="">– Tất cả –</option>
                  <option value="Chưa có hồ sơ">Chưa có hồ sơ</option>
                  <option value="Đang mượn hồ sơ">Đang mượn hồ sơ</option>
                  <option value="Đã có hồ sơ">Đã có hồ sơ</option>
                  <option value="Đã trả hồ sơ">Đã trả hồ sơ</option>
                  <option value="Đã chuyển hồ sơ">Đã chuyển hồ sơ</option>
                </select>
              </div>

              {/* 14. Kết quả giải quyết */}
              <div>
                <label style={labelStyle}>Kết quả giải quyết</label>
                <select
                  value={filters.ketQuaGiaiQuyet}
                  onChange={(e) => handleChange("ketQuaGiaiQuyet", e.target.value)}
                  style={selectStyle}
                >
                  <option value="">– Tất cả –</option>
                  <option value="Trả lời đơn">Trả lời đơn</option>
                  <option value="Kháng nghị">Kháng nghị</option>
                  <option value="Xếp đơn">Xếp đơn</option>
                  <option value="VKS đang giải quyết">VKS đang giải quyết</option>
                </select>
              </div>

              {/* 15. Rút kháng nghị */}
              <div>
                <label style={labelStyle}>Rút kháng nghị</label>
                <select
                  value={filters.rutKhangNghi}
                  onChange={(e) => handleChange("rutKhangNghi", e.target.value)}
                  style={selectStyle}
                >
                  <option value="">– Tất cả –</option>
                  <option value="Có">Có</option>
                  <option value="Không">Không</option>
                </select>
              </div>
            </div>

            {/* Hàng 5 Mở rộng (16-19): Tờ trình lãnh đạo | Tờ trình từ ngày - đến ngày | Yêu cầu trình tiếp | Ý kiến tờ trình */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
              {/* 16. Tờ trình lãnh đạo */}
              <div>
                <label style={labelStyle}>Tờ trình lãnh đạo</label>
                <select
                  value={filters.toTrinhLanhDao}
                  onChange={(e) => handleChange("toTrinhLanhDao", e.target.value)}
                  style={selectStyle}
                >
                  <option value="">– Tất cả –</option>
                  <option value="Trình Thẩm phán">Trình Thẩm phán</option>
                  <option value="Trình Vụ trưởng">Trình Vụ trưởng</option>
                  <option value="Trình Phó Chánh án">Trình Phó Chánh án</option>
                  <option value="Trình Chánh án">Trình Chánh án</option>
                  <option value="Trình Tổ thẩm phán">Trình Tổ thẩm phán</option>
                  <option value="Trình HĐTP">Trình HĐTP</option>
                </select>
              </div>

              {/* 17. Tờ trình từ ngày - đến ngày */}
              <div>
                <label style={labelStyle}>Tờ trình từ ngày – Đến ngày</label>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    placeholder="Từ ngày"
                    value={filters.toTrinhTuNgay}
                    onChange={(e) => handleChange("toTrinhTuNgay", e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <span style={{ color: MUTED, fontSize: 11 }}>→</span>
                  <div style={{ position: "relative", flex: 1 }}>
                    <input
                      placeholder="Đến ngày"
                      value={filters.toTrinhDenNgay}
                      onChange={(e) => handleChange("toTrinhDenNgay", e.target.value)}
                      style={inputStyle}
                    />
                    <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>
              </div>

              {/* 18. Yêu cầu trình tiếp */}
              <div>
                <label style={labelStyle}>Yêu cầu trình tiếp</label>
                <select
                  value={filters.yeuCauTrinhTiep}
                  onChange={(e) => handleChange("yeuCauTrinhTiep", e.target.value)}
                  style={selectStyle}
                >
                  <option value="">– Tất cả –</option>
                  <option value="Trình Thẩm phán">Trình Thẩm phán</option>
                  <option value="Trình Vụ trưởng">Trình Vụ trưởng</option>
                  <option value="Trình Phó Chánh án">Trình Phó Chánh án</option>
                  <option value="Trình Chánh án">Trình Chánh án</option>
                  <option value="Trình Tổ thẩm phán">Trình Tổ thẩm phán</option>
                  <option value="Trình HĐTP">Trình HĐTP</option>
                </select>
              </div>

              {/* 19. Ý kiến tờ trình */}
              <div>
                <label style={labelStyle}>Ý kiến tờ trình</label>
                <select
                  value={filters.yKienToTrinh}
                  onChange={(e) => handleChange("yKienToTrinh", e.target.value)}
                  style={selectStyle}
                >
                  <option value="">– Tất cả –</option>
                  <option value="Trả lời đơn">Trả lời đơn</option>
                  <option value="Kháng nghị">Kháng nghị</option>
                  <option value="Xếp đơn">Xếp đơn</option>
                  <option value="VKS đang giải quyết">VKS đang giải quyết</option>
                  <option value="Nghiên cứu, xác minh, bổ sung">Nghiên cứu, xác minh, bổ sung</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Footer Actions ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
          <button
            onClick={() => setFilterExpanded((v) => !v)}
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
            {filterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {filterExpanded ? "Thu gọn bộ lọc" : "Mở rộng bộ lọc"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={handleSearch}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 18px",
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
              <Search size={13} /> Tìm kiếm
            </button>

            <button
              onClick={handleReset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: F,
              }}
            >
              <RotateCcw size={13} /> Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VuAnSearchFilterPanel;
