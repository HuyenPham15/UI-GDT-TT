import React, { useState } from "react";
import { Search, RotateCcw, Calendar, ChevronDown, ChevronUp, X } from "lucide-react";
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
  loaiAn: string;
  toaRaBA: string;
  soBA: string;
  ngayBA: string;
  biCao: string;
  soThuLy: string;
  lanhDaoVu: string;
  thamTraVien: string;
  thamPhan: string;
  thuocAn: string;
  thoiHieu: string;
  hoanTHA: string;
  trangThaiHoSo: string;
  thuLyTuNgay: string;
  thuLyDenNgay: string;
  toTrinhLanhDao: string;
  toTrinhTuNgay: string;
  toTrinhDenNgay: string;
  yeuCauTrinhTiep: string;
  yKienToTrinh: string;
  ketQuaGiaiQuyet: string;
  hinhThucDon: string;
  phanLoaiDon: string;
  capXetXu: string;
  ketQuaXetXu: string;
  ngayTuyenAn: string;
  rutKhangNghi: string;
  ngayRutKhangNghi: string;

  // Tiêu chí mới bổ sung
  soKhangNghi: string;
  ngayKhangNghi: string;
  nguoiKhangNghi: string;
  thamQuyenXX: string;
  apDungAnLe: string;

  // Loại công văn & thông báo
  loaiCongVan: string;
  thongBao: string;
}

export const INITIAL_FILTER_VALUES: VuAnFilterValues = {
  loaiAn: "",
  toaRaBA: "",
  soBA: "",
  ngayBA: "",
  biCao: "",
  soThuLy: "",
  lanhDaoVu: "",
  thamTraVien: "",
  thamPhan: "",
  thuocAn: "",
  thoiHieu: "",
  hoanTHA: "",
  trangThaiHoSo: "",
  thuLyTuNgay: "",
  thuLyDenNgay: "",
  toTrinhLanhDao: "",
  toTrinhTuNgay: "",
  toTrinhDenNgay: "",
  yeuCauTrinhTiep: "",
  yKienToTrinh: "",
  ketQuaGiaiQuyet: "",
  hinhThucDon: "",
  phanLoaiDon: "",
  capXetXu: "",
  ketQuaXetXu: "",
  ngayTuyenAn: "",
  rutKhangNghi: "",
  ngayRutKhangNghi: "",
  // soKhangNghi: "",
  // ngayKhangNghi: "",
  // nguoiKhangNghi: "",
  // thamQuyenXX: "",
  // apDungAnLe: "",
  loaiCongVan: "",
  thongBao: "",
};

export const FILTER_LABELS: Record<keyof VuAnFilterValues, string> = {
  loaiAn: "Loại án",
  toaRaBA: "Tòa ra BA/QĐ",
  soBA: "Số BA/QĐ",
  ngayBA: "Ngày BA/QĐ",
  biCao: "Bị cáo/Đương sự",
  thamPhan: "Thẩm phán",
  lanhDaoVu: "Lãnh đạo phụ trách",
  thamTraVien: "Cán bộ giải quyết",
  thuocAn: "Thuộc án",
  thoiHieu: "Án thời hiệu",
  hoanTHA: "Hoãn thi hành án",
  trangThaiHoSo: "Trạng thái hồ sơ",
  soThuLy: "Số thụ lý",
  thuLyTuNgay: "Thụ lý từ ngày",
  thuLyDenNgay: "Thụ lý đến ngày",
  toTrinhLanhDao: "Tờ trình lãnh đạo",
  toTrinhTuNgay: "Tờ trình từ ngày",
  toTrinhDenNgay: "Tờ trình đến ngày",
  yeuCauTrinhTiep: "Yêu cầu trình tiếp",
  yKienToTrinh: "Ý kiến tờ trình",
  ketQuaGiaiQuyet: "Kết quả giải quyết",
  hinhThucDon: "Hình thức đơn",
  phanLoaiDon: "Loại BA GDT",
  capXetXu: "Cấp xét xử",
  ketQuaXetXu: "Kết quả xét xử",
  ngayTuyenAn: "Ngày tuyên án",
  rutKhangNghi: "Rút kháng nghị",
  ngayRutKhangNghi: "Ngày rút KN",
  // soKhangNghi: "Số kháng nghị",
  // ngayKhangNghi: "Ngày kháng nghị",
  // nguoiKhangNghi: "Người kháng nghị",
  // thamQuyenXX: "Thẩm quyền xét xử",
  // apDungAnLe: "Áp dụng án lệ",
  loaiCongVan: "Loại công văn",
  thongBao: "Thông báo",
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

  const handleChange = (key: keyof VuAnFilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveTag = (key: keyof VuAnFilterValues) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: "" };
      if (onSearch) onSearch(next);
      return next;
    });
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTER_VALUES);
    if (onReset) onReset();
  };

  const handleSearch = () => {
    if (onSearch) onSearch(filters);
  };

  const activeTags = Object.entries(filters).filter(([_, val]) => Boolean(val));

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "5px 8px",
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
    fontWeight: 600,
    color: "#475569",
    marginBottom: 3,
    fontFamily: F,
    display: "block",
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderBottom: `1px solid ${BORDER}`,
        padding: "12px 20px",
        flexShrink: 0,
        fontFamily: F,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* ── BỘ LỌC CƠ BẢN: GRID 4 CỘT ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px 14px" }}>
          {/* 1. Loại án */}
          <div>
            <label style={labelStyle}>Loại án</label>
            <select value={filters.loaiAn} onChange={(e) => handleChange("loaiAn", e.target.value)} style={selectStyle}>
              <option value="">– Tất cả –</option>
              {LOAI_AN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 2. Tòa ra BA/QĐ */}
          <div>
            <label style={labelStyle}>Tòa ra BA/QĐ</label>
            <select value={filters.toaRaBA} onChange={(e) => handleChange("toaRaBA", e.target.value)} style={selectStyle}>
              <option value="">– Tất cả –</option>
              {DANH_SACH_TOA_AN_FILTER.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* 3. Số BA/QĐ */}
          <div>
            <label style={labelStyle}>Số BA/QĐ</label>
            <input placeholder="Nhập số BA/QĐ" value={filters.soBA} onChange={(e) => handleChange("soBA", e.target.value)} style={inputStyle} />
          </div>

          {/* 4. Ngày BA/QĐ */}
          <div>
            <label style={labelStyle}>Ngày BA/QĐ</label>
            <div style={{ position: "relative" }}>
              <input placeholder="dd/mm/yyyy" value={filters.ngayBA} onChange={(e) => handleChange("ngayBA", e.target.value)} style={inputStyle} />
              <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* 5. Bị cáo / Đương sự */}
          <div>
            <label style={labelStyle}>Bị cáo / Đương sự</label>
            <input placeholder="Nhập tên bị cáo/đương sự" value={filters.biCao} onChange={(e) => handleChange("biCao", e.target.value)} style={inputStyle} />
          </div>

          {/* 6. Số thụ lý */}
          <div>
            <label style={labelStyle}>Thẩm phán</label>
            <select value={filters.thamPhan} onChange={(e) => handleChange("thamPhan", e.target.value)} style={selectStyle}>
              <option value="">– Tất cả –</option>
              {DANH_SACH_THAM_PHAN_FILTER.map((tp) => (
                <option key={tp} value={tp}>{tp}</option>
              ))}
            </select>
          </div>

          {/* 7. Lãnh đạo phụ trách */}
          <div>
            <label style={labelStyle}>Lãnh đạo phụ trách</label>
            <select value={filters.lanhDaoVu} onChange={(e) => handleChange("lanhDaoVu", e.target.value)} style={selectStyle}>
              <option value="">– Tất cả –</option>
              {DANH_SACH_LANH_DAO_FILTER.map((ld) => (
                <option key={ld} value={ld}>{ld}</option>
              ))}
            </select>
          </div>

          {/* 8. Cán bộ giải quyết */}
          <div>
            <label style={labelStyle}>Cán bộ giải quyết</label>
            <select value={filters.thamTraVien} onChange={(e) => handleChange("thamTraVien", e.target.value)} style={selectStyle}>
              <option value="">– Tất cả –</option>
              {DANH_SACH_TTV_FILTER.map((ttv) => (
                <option key={ttv} value={ttv}>{ttv}</option>
              ))}
            </select>
          </div>

          {/* 9. Thẩm phán */}


          {/* 10. Thuộc án */}

          {/* 12. Hoãn thi hành án */}
          <div>
            <label style={labelStyle}>Số thụ lý</label>
            <input placeholder="Nhập số thụ lý" value={filters.soThuLy} onChange={(e) => handleChange("soThuLy", e.target.value)} style={inputStyle} />
          </div>
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
                <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── MỞ RỘNG BỘ LỌC: PHẲNG DẠNG GRID 4 CỘT TRỰC QUAN (KHÔNG CHIA TAB/BOX BAR) ── */}
        {filterExpanded && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px 14px", borderTop: `1px dashed ${BORDER}`, paddingTop: 10 }}>
            {/* Hồ sơ & Thụ lý */}
            <div>
              <label style={labelStyle}>Trạng thái hồ sơ</label>
              <select value={filters.trangThaiHoSo} onChange={(e) => handleChange("trangThaiHoSo", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Chưa có hồ sơ">Chưa có hồ sơ</option>
                <option value="Đang mượn hồ sơ">Đang mượn hồ sơ</option>
                <option value="Đã có hồ sơ">Đã có hồ sơ</option>
                <option value="Đã trả hồ sơ">Đã trả hồ sơ</option>
                <option value="Đã chuyển hồ sơ">Đã chuyển hồ sơ</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Hồ sơ từ ngày – Đến ngày</label>
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
                  <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>
            </div>
            {/* Thụ lý từ ngày – Đến ngày (Gộp 2 cột thành 1 ô khoảng thời gian) */}
            <div>
              <label style={labelStyle}>Hình thức đơn</label>
              <select value={filters.hinhThucDon} onChange={(e) => handleChange("hinhThucDon", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="GDT">GĐT</option>
                <option value="CV">Công văn</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Loại BA GDT</label>
              <select value={filters.phanLoaiDon} onChange={(e) => handleChange("phanLoaiDon", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Đơn đề nghị">Đơn đề nghị GDT</option>
                <option value="Công văn kiến nghị">Rút hồ sơ đoàn kiểm tra</option>
                <option value="Công văn kiến nghị">Chủ động GDT qua bản án</option>
              </select>
            </div>

            {/* Tờ trình */}
            <div>
              <label style={labelStyle}>Tờ trình lãnh đạo</label>
              <select value={filters.toTrinhLanhDao} onChange={(e) => handleChange("toTrinhLanhDao", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Trình Thẩm phán">Trình Thẩm phán</option>
                <option value="Trình Vụ trưởng">Trình Vụ trưởng</option>
                <option value="Trình Phó Chánh án">Trình Phó Chánh án</option>
                <option value="Trình Chánh án">Trình Chánh án</option>
                <option value="Trình HĐTP">Trình HĐTP</option>
              </select>
            </div>
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
                  <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Ý kiến tờ trình</label>
              <select value={filters.yKienToTrinh} onChange={(e) => handleChange("yKienToTrinh", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Trả lời đơn">Trả lời đơn</option>
                <option value="Kháng nghị">Kháng nghị</option>
                <option value="Xếp đơn">Xếp đơn</option>
                <option value="VKS đang giải quyết">VKS đang giải quyết</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Yêu cầu trình tiếp</label>
              <select value={filters.yeuCauTrinhTiep} onChange={(e) => handleChange("yeuCauTrinhTiep", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Trình Thẩm phán">Trình Thẩm phán</option>
                <option value="Trình Vụ trưởng">Trình Vụ trưởng</option>
                <option value="Trình Phó Chánh án">Trình Phó Chánh án</option>
                <option value="Trình Chánh án">Trình Chánh án</option>
              </select>
            </div>

            {/* Giải quyết đơn */}
            <div>
              <label style={labelStyle}>Kết quả giải quyết</label>
              <select value={filters.ketQuaGiaiQuyet} onChange={(e) => handleChange("ketQuaGiaiQuyet", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Trả lời đơn">Trả lời đơn</option>
                <option value="Kháng nghị">Kháng nghị</option>
                <option value="Xếp đơn">Xếp đơn</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Kết quả từ ngày – Đến ngày</label>
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
                  <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Kết quả xét xử</label>
              <input placeholder="Nhập kết quả xét xử" value={filters.ketQuaXetXu} onChange={(e) => handleChange("ketQuaXetXu", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Kết quả xét xử từ ngày – Đến ngày</label>
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
                  <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>
            </div>
            {/* Xét xử */}
            <div>
              <label style={labelStyle}>Cấp xét xử</label>
              <select value={filters.capXetXu} onChange={(e) => handleChange("capXetXu", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Giám đốc thẩm">Giám đốc thẩm</option>
                <option value="Tái thẩm">Tái thẩm</option>
              </select>
            </div>
            {/* 
            <div>
              <label style={labelStyle}>Ngày tuyên án</label>
              <input placeholder="dd/mm/yyyy" value={filters.ngayTuyenAn} onChange={(e) => handleChange("ngayTuyenAn", e.target.value)} style={inputStyle} />
            </div> */}

            {/* Rút kháng nghị */}
            <div>
              <label style={labelStyle}>Rút kháng nghị</label>
              <select value={filters.rutKhangNghi} onChange={(e) => handleChange("rutKhangNghi", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Có">Có</option>
                <option value="Không">Không</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Rút kháng nghị từ ngày – Đến ngày</label>
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
                  <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Hoãn thi hành án</label>
              <select value={filters.hoanTHA} onChange={(e) => handleChange("hoanTHA", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Có">Có</option>
                <option value="Không">Không</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Thuộc án</label>
              <select value={filters.thuocAn} onChange={(e) => handleChange("thuocAn", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Án Quốc hội">Án Quốc hội</option>
                <option value="Án chỉ đạo">Án chỉ đạo</option>
                <option value="Người chưa thành niên">Người chưa thành niên</option>
                <option value="Án tử hình">Án tử hình</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Thông báo</label>
              <select value={filters.thongBao} onChange={(e) => handleChange("thongBao", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Không có thông báo TT">Chưa có thông báo TT</option>
                <option value="Có thông báo TT">Có thông báo TT</option>
                <option value="Chưa có thông báo KQ">Chưa có thông báo KQ</option>
                <option value="Có thông báo KQ">Có thông báo KQ</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Án thời hiệu</label>
              <select value={filters.thoiHieu} onChange={(e) => handleChange("thoiHieu", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Không có thời hiệu giải quyết">Không có thời hiệu giải quyết</option>
                <option value="Còn thời hiệu">Còn thời hiệu</option>
                <option value="Hết thời hiệu">Hết thời hiệu</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Loại công văn</label>
              <select value={filters.loaiCongVan} onChange={(e) => handleChange("loaiCongVan", e.target.value)} style={selectStyle}>
                <option value="">– Loại công văn –</option>
              </select>
            </div>

            {/* <div>
              <label style={labelStyle}>Số kháng nghị</label>
              <input placeholder="Nhập số kháng nghị" value={filters.soKhangNghi} onChange={(e) => handleChange("soKhangNghi", e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Ngày kháng nghị</label>
              <div style={{ position: "relative" }}>
                <input placeholder="dd/mm/yyyy" value={filters.ngayKhangNghi} onChange={(e) => handleChange("ngayKhangNghi", e.target.value)} style={inputStyle} />
                <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Người kháng nghị</label>
              <input placeholder="Nhập người kháng nghị" value={filters.nguoiKhangNghi} onChange={(e) => handleChange("nguoiKhangNghi", e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Thẩm quyền xét xử</label>
              <select value={filters.thamQuyenXX} onChange={(e) => handleChange("thamQuyenXX", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Hội đồng Thẩm phán TANDTC">Hội đồng Thẩm phán TANDTC</option>
                <option value="Ủy ban Thẩm phán TAND cấp cao">Ủy ban Thẩm phán TAND cấp cao</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Án lệ áp dụng</label>
              <select value={filters.apDungAnLe} onChange={(e) => handleChange("apDungAnLe", e.target.value)} style={selectStyle}>
                <option value="">– Tất cả –</option>
                <option value="Có">Có áp dụng</option>
                <option value="Không">Không áp dụng</option>
              </select>
            </div> */}
          </div>
        )}

        {/* ── ACTIVE FILTER TAGS VỚI NÚT XÓA TỪNG TAG (NẰM NGOÀI BLOCK MỞ RỘNG) ── */}
        {activeTags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {activeTags.map(([key, val]) => (
              <span
                key={key}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  color: "#1d4ed8",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: F,
                }}
              >
                <span style={{ fontWeight: 600 }}>{FILTER_LABELS[key as keyof VuAnFilterValues]}:</span> {val}
                <X
                  size={12}
                  style={{ cursor: "pointer", color: "#2563eb" }}
                  onClick={() => handleRemoveTag(key as keyof VuAnFilterValues)}
                />
              </span>
            ))}
            <button
              onClick={handleReset}
              style={{
                background: "none",
                border: "none",
                color: RED,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: F,
                padding: "2px 4px",
              }}
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {/* ── NÚT THAO TÁC (TÌM KIẾM MÀU ĐỎ & XÓA BỘ LỌC) ── */}
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
              fontWeight: 600,
            }}
          >
            {filterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {filterExpanded ? "Thu gọn bộ lọc nâng cao" : "Mở rộng bộ lọc nâng cao"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={handleSearch}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 20px",
                background: RED,
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: F,
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              <Search size={14} /> Tìm kiếm
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
