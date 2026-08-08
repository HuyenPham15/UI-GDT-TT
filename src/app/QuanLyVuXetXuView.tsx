import React, { useState, useRef, useEffect } from "react";
import { Search, RotateCcw, ChevronDown, ChevronUp, MoreVertical, X, Eye, Pencil, Printer, FileText, Trash2, Calendar, Save, Send } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge } from "./shared";
import { formatSoBA } from "./AppHelpers";
import { TaoDuThaoModal } from "./TaoDuThaoModal";
import { TrinhKyModal } from "./TrinhKyModal";
import { LichXetXuModal } from "./PhanCongHDXXView";

// ── Types ─────────────────────────────────────────────────────────────────────

type TrangThai =
  | "chua-xx-chua-ds"       // Chưa xét xử – chưa có danh sách
  | "chua-xx-da-ds"         // Chưa xét xử – đã có danh sách
  | "chua-thu-ly"           // Chưa thụ lý xét xử
  | "rut-khang-nghi"        // Rút kháng nghị
  | "da-xx"                 // Đã xét xử
  | "chuyen-tham-quyen";    // Chuyển thẩm quyền xét xử

type DetailTab = "thong-tin" | "thu-ly" | "phan-cong" | "to-trinh" | "qd-vu-an" | "ket-qua";

type VuXetXuRow = {
  id: number;
  maVuAn: string;
  tenVuAn: string;
  // List display fields (image-12)
  soThuLy: string;              // e.g. "54681978"
  ngayThuLy: string;            // e.g. "09/07/2026"
  soBA: string;
  ngayBA: string;
  toa: string;
  capXetXu: string;             // e.g. "Sơ thẩm"
  thoiHieu: string;             // e.g. "5 năm"
  tag?: "an-qh" | "an-tu-hinh" | "an-chi-dao";
  ndkn: string;
  ndd: string;
  ttv: string;
  ldv: string;
  tp: string;
  trangThai: TrangThai;
  thoiHanXX?: string;
  soQD?: string;
  ngayQD?: string;
  // Detail view fields (kept for backward compat)
  soNgayBAQD: string;
  toaRABAQD: string;
  soNgayKhangNghi: string;
  soNgayThuLy: string;
  vienKiemSat: string;
  toaAnGiaiQuyet: string;
  biCao: string;
  loaiAn: string;
  chuToa: string;
  hdxx: string;
  ngayXX: string;
  phongXX: string;
};

// ── Data ──────────────────────────────────────────────────────────────────────

const DANH_SACH_THAM_PHAN = [
  { id: "tp1", ten: "Lê Thị Thu Hiển", chucVu: "Chánh án TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp2", ten: "Nguyễn Như Thắng", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp3", ten: "Nguyễn Biên Thùy", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp4", ten: "Trần Hồng Hà", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp5", ten: "Ngô Hồng Phúc", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp6", ten: "Lê Thanh Phong", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp7", ten: "Nguyễn Văn Cường", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp8", ten: "Lê Văn Minh", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp9", ten: "Phạm Văn Nam", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp10", ten: "Trịnh Thị Minh Trang", chucVu: "Thẩm phán TAND tối cao", donVi: "Vụ Giám đốc kiểm tra I" },
  { id: "tp11", ten: "Phạm Thị Bích Ngọc", chucVu: "Thẩm phán cao cấp", donVi: "Tòa hình sự TAND cấp cao" },
  { id: "tp12", ten: "Võ Thị Thùy Giang", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp13", ten: "Trịnh Đức Minh", chucVu: "Thẩm phán cao cấp", donVi: "Vụ Giám đốc kiểm tra II" },
  { id: "tp14", ten: "Vũ Diệu Thùy", chucVu: "Thẩm phán TAND tối cao", donVi: "Vụ Giám đốc kiểm tra I" },
  { id: "tp15", ten: "Hoàng Quỳnh Trang", chucVu: "Thẩm phán cao cấp", donVi: "Tòa hình sự TAND cấp cao" },
  { id: "tp16", ten: "Lê Hồng Quang", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp17", ten: "Nguyễn Duy Giảng", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp18", ten: "Trương Việt Toàn", chucVu: "Thẩm phán TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" },
  { id: "tp19", ten: "Phạm Quốc Anh", chucVu: "Thẩm phán TAND tối cao", donVi: "Vụ Giám đốc kiểm tra III" },
];

const ROWS: VuXetXuRow[] = [
  // ── 1. HÌNH SỰ (Vụ I) ──────────────────────────────────────────────────────────
  {
    id: 1,
    maVuAn: "VA26-002148", tenVuAn: "ĐẶNG THIÊN DƯƠNG – Tội cố ý gây thương tích",
    soThuLy: "54681978", ngayThuLy: "09/07/2026",
    soBA: "5469/2026/HS-ST", ngayBA: "03/07/2026",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "5 năm", tag: "an-qh",
    ndkn: "Trần Văn Hải", ndd: "Nguyễn Đơn Hải",
    ttv: "Trịnh Thị Minh Trang", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiển",
    trangThai: "chua-xx-chua-ds",
    soNgayBAQD: "5469/2026/HS-ST – 03/07/2026", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    soNgayKhangNghi: "QDKN_2707 – 27/07/2026", soNgayThuLy: "54681978 – 09/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Trần Văn Hải", loaiAn: "Hình sự", chuToa: "Lê Thị Thu Hiển",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "Phòng xét xử số 1",
  },
  {
    id: 2,
    maVuAn: "VA26-002012", tenVuAn: "ĐẶNG THÌN DƯƠNG – Tội cố ý gây thương tích hoặc gây tổn hại cho sức khoẻ",
    soThuLy: "54681923", ngayThuLy: "09/07/2026",
    soBA: "54681139/2026/HS-PT", ngayBA: "03/07/2026",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Phúc thẩm", thoiHieu: "3 năm", tag: "an-tu-hinh",
    ndkn: "Phan Văn Hùng", ndd: "Nguyễn Văn Đạt",
    ttv: "Vô Thị Thúy Giang", ldv: "Nguyễn Như Thắng", tp: "Nguyễn Biên Thùy",
    trangThai: "chua-xx-da-ds", thoiHanXX: "19 ngày",
    soNgayBAQD: "54681139/2026/HS-PT – 03/07/2026", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    soNgayKhangNghi: "QDKN_1111 – 11/11/2024", soNgayThuLy: "54681923 – 09/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Phan Văn Hùng", loaiAn: "Hình sự", chuToa: "Nguyễn Biên Thùy",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "28/07/2026", phongXX: "Phòng xét xử số 2",
  },
  {
    id: 3,
    maVuAn: "VA26-001888", tenVuAn: "Tội vi phạm quy định về quản lý, sử dụng tài sản Nhà nước gây thất thoát",
    soThuLy: "–", ngayThuLy: "–",
    soBA: "112/2026/HS-ST", ngayBA: "15/06/2026",
    toa: "Tòa án nhân dân TP Hà Nội",
    capXetXu: "Sơ thẩm", thoiHieu: "5 năm", tag: "an-chi-dao",
    ndkn: "Trần Minh Quang", ndd: "Lê Thanh Tùng",
    ttv: "Trịnh Thị Minh Trang", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiển",
    trangThai: "chua-thu-ly",
    soNgayBAQD: "112/2026/HS-ST – 15/06/2026", toaRABAQD: "Tòa án nhân dân TP Hà Nội",
    soNgayKhangNghi: "QDKN_1888 – 20/06/2026", soNgayThuLy: "–",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Trần Minh Quang", loaiAn: "Hình sự", chuToa: "–",
    hdxx: "–", ngayXX: "–", phongXX: "–",
  },
  {
    id: 4,
    maVuAn: "VA26-001201", tenVuAn: "Tham ô tài sản nhà nước đặc biệt nghiêm trọng",
    soThuLy: "54681813", ngayThuLy: "09/07/2026",
    soBA: "18/2026/HS-ST", ngayBA: "08/07/2026",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm", tag: "an-chi-dao",
    ndkn: "Đỗ Thành Công", ndd: "Phan Kim Ngân",
    ttv: "Nguyễn Thị Hương", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiển",
    trangThai: "rut-khang-nghi", soQD: "54/2026/QĐ-CA", ngayQD: "09/07/2026",
    soNgayBAQD: "18/2026/HS-ST – 08/07/2026", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    soNgayKhangNghi: "QDKN_1201 – 01/05/2026", soNgayThuLy: "54681813 – 09/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Đỗ Thành Công", loaiAn: "Hình sự", chuToa: "Lê Thị Thu Hiển",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "–",
  },
  {
    id: 5,
    maVuAn: "VA26-001402", tenVuAn: "Tội lừa đảo chiếm đoạt tài sản quy mô lớn",
    soThuLy: "54681555", ngayThuLy: "10/05/2026",
    soBA: "99/2026/HS-PT", ngayBA: "20/04/2026",
    toa: "Tòa án nhân dân tỉnh Vĩnh Phúc",
    capXetXu: "Phúc thẩm", thoiHieu: "3 năm",
    ndkn: "Bùi Thị Tuyết", ndd: "Hoàng Văn Nam",
    ttv: "Hoàng Quỳnh Trang", ldv: "Nguyễn Như Thắng", tp: "Nguyễn Biên Thùy",
    trangThai: "da-xx", soQD: "102/2026/QĐ-GĐT", ngayQD: "25/06/2026",
    soNgayBAQD: "99/2026/HS-PT – 20/04/2026", toaRABAQD: "Tòa án nhân dân tỉnh Vĩnh Phúc",
    soNgayKhangNghi: "QDKN_1402 – 05/05/2026", soNgayThuLy: "54681555 – 10/05/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Bùi Thị Tuyết", loaiAn: "Hình sự", chuToa: "Nguyễn Biên Thùy",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "20/06/2026", phongXX: "Phòng xét xử số 1",
  },
  {
    id: 6,
    maVuAn: "VA26-001600", tenVuAn: "Tội vận chuyển trái phép chất ma túy qua biên giới",
    soThuLy: "54681600", ngayThuLy: "01/06/2026",
    soBA: "45/2026/HS-ST", ngayBA: "12/05/2026",
    toa: "Tòa án nhân dân tỉnh Quảng Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "5 năm", tag: "an-tu-hinh",
    ndkn: "Nguyễn Văn Lợi", ndd: "Trần Đức Tiến",
    ttv: "Vũ Diệu Thúy", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiển",
    trangThai: "chuyen-tham-quyen", soQD: "18/2026/QĐ-CTQ", ngayQD: "15/06/2026",
    soNgayBAQD: "45/2026/HS-ST – 12/05/2026", toaRABAQD: "Tòa án nhân dân tỉnh Quảng Ninh",
    soNgayKhangNghi: "QDKN_1600 – 20/05/2026", soNgayThuLy: "54681600 – 01/06/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Nguyễn Văn Lợi", loaiAn: "Hình sự", chuToa: "Lê Thị Thu Hiển",
    hdxx: "Hội đồng toàn thể", ngayXX: "–", phongXX: "–",
  },

  // ── 2. DÂN SỰ (Vụ II) ─────────────────────────────────────────────────────────
  {
    id: 7,
    maVuAn: "VA26-001543", tenVuAn: "Tranh chấp hợp đồng mua bán nhà ở và quyền sử dụng đất",
    soThuLy: "–", ngayThuLy: "–",
    soBA: "21/2026/DS-ST", ngayBA: "03/07/2026",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "Ngô Mai Trang", ndd: "Phạm Văn Thành, Lê Thị Nhải",
    ttv: "Hoàng Quỳnh Trang", ldv: "Lê Thị Thu Hiển", tp: "Nguyễn Như Thắng",
    trangThai: "chua-thu-ly",
    soNgayBAQD: "21/2026/DS-ST – 03/07/2026", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    soNgayKhangNghi: "QDKN_1543 – 15/06/2026", soNgayThuLy: "–",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Ngô Mai Trang", loaiAn: "Dân sự", chuToa: "Nguyễn Như Thắng",
    hdxx: "–", ngayXX: "–", phongXX: "–",
  },
  {
    id: 8,
    maVuAn: "VA26-000987", tenVuAn: "Tranh chấp quyền sử dụng đất và tài sản gắn liền với đất",
    soThuLy: "54681748", ngayThuLy: "08/07/2026",
    soBA: "08/2026/DS-ST", ngayBA: "08/07/2025",
    toa: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "Nguyễn Quốc Huy", ndd: "Lâm Gia Bảo",
    ttv: "Vũ Diệu Thúy", ldv: "Phạm Thị Bích Ngọc", tp: "Nguyễn Như Thắng",
    trangThai: "da-xx", soQD: "88/2026/QĐ-GĐT", ngayQD: "08/07/2026",
    soNgayBAQD: "08/2026/DS-ST – 08/07/2025", toaRABAQD: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    soNgayKhangNghi: "QDKN_0987 – 10/04/2026", soNgayThuLy: "54681748 – 08/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Nguyễn Quốc Huy", loaiAn: "Dân sự", chuToa: "Nguyễn Như Thắng",
    hdxx: "Hội đồng toàn thể", ngayXX: "18/06/2026", phongXX: "Phòng xét xử số 3",
  },
  {
    id: 9,
    maVuAn: "VA26-002300", tenVuAn: "Tranh chấp thừa kế tài sản và yêu cầu hủy giấy chứng nhận quyền sử dụng đất",
    soThuLy: "54682300", ngayThuLy: "12/07/2026",
    soBA: "77/2026/DS-PT", ngayBA: "28/06/2026",
    toa: "Tòa án nhân dân TP Đà Nẵng",
    capXetXu: "Phúc thẩm", thoiHieu: "5 năm", tag: "an-qh",
    ndkn: "Lê Văn Hùng", ndd: "Lê Thị Hồng",
    ttv: "Vô Thị Thúy Giang", ldv: "Lê Thị Thu Hiển", tp: "Nguyễn Như Thắng",
    trangThai: "chua-xx-chua-ds",
    soNgayBAQD: "77/2026/DS-PT – 28/06/2026", toaRABAQD: "Tòa án nhân dân TP Đà Nẵng",
    soNgayKhangNghi: "QDKN_2300 – 05/07/2026", soNgayThuLy: "54682300 – 12/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Lê Văn Hùng", loaiAn: "Dân sự", chuToa: "Nguyễn Như Thắng",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "Phòng xét xử số 2",
  },
  {
    id: 10,
    maVuAn: "VA26-002410", tenVuAn: "Tranh chấp hợp đồng vay tài sản và hợp đồng thế chấp quyền sử dụng đất",
    soThuLy: "54682410", ngayThuLy: "14/07/2026",
    soBA: "105/2026/DS-ST", ngayBA: "30/06/2026",
    toa: "Tòa án nhân dân tỉnh Bình Dương",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "Ngân hàng Thương mại Cổ phần Á Châu", ndd: "Trần Quốc Toản",
    ttv: "Nguyễn Thị Hương", ldv: "Phạm Thị Bích Ngọc", tp: "Trịnh Đức Minh",
    trangThai: "chua-xx-da-ds", thoiHanXX: "25 ngày",
    soNgayBAQD: "105/2026/DS-ST – 30/06/2026", toaRABAQD: "Tòa án nhân dân tỉnh Bình Dương",
    soNgayKhangNghi: "QDKN_2410 – 08/07/2026", soNgayThuLy: "54682410 – 14/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Trần Quốc Toản", loaiAn: "Dân sự", chuToa: "Trịnh Đức Minh",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "10/08/2026", phongXX: "Phòng xét xử số 1",
  },
  {
    id: 11,
    maVuAn: "VA26-002511", tenVuAn: "Tranh chấp quyền sở hữu trí tuệ và bồi thường thiệt hại ngoài hợp đồng",
    soThuLy: "54682511", ngayThuLy: "15/07/2026",
    soBA: "34/2026/DS-PT", ngayBA: "02/07/2026",
    toa: "Tòa án nhân dân TP Hồ Chí Minh",
    capXetXu: "Phúc thẩm", thoiHieu: "3 năm",
    ndkn: "Công ty Cổ phần Công nghệ ABC", ndd: "Công ty TNHH Truyền thông XYZ",
    ttv: "Trịnh Thị Minh Trang", ldv: "Lê Thị Thu Hiển", tp: "Nguyễn Như Thắng",
    trangThai: "rut-khang-nghi", soQD: "72/2026/QĐ-CA", ngayQD: "18/07/2026",
    soNgayBAQD: "34/2026/DS-PT – 02/07/2026", toaRABAQD: "Tòa án nhân dân TP Hồ Chí Minh",
    soNgayKhangNghi: "QDKN_2511 – 10/07/2026", soNgayThuLy: "54682511 – 15/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Công ty TNHH Truyền thông XYZ", loaiAn: "Dân sự", chuToa: "Nguyễn Như Thắng",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "–",
  },

  // ── 3. HÀNH CHÍNH (Vụ IV) ──────────────────────────────────────────────────────
  {
    id: 12,
    maVuAn: "VA26-000654", tenVuAn: "Khiếu kiện quyết định xử phạt vi phạm hành chính trong quản lý đất đai",
    soThuLy: "54681800", ngayThuLy: "08/07/2026",
    soBA: "0807/2026/HC-ST", ngayBA: "08/07/2025",
    toa: "Tòa án nhân dân quận Ninh Kiều",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "NGHIÊM THỊ XUÂN", ndd: "ỦY BAN NHÂN DÂN QUẬN NINH KIỀU",
    ttv: "Vô Thị Thúy Giang", ldv: "Nguyễn Như Thắng", tp: "Nguyễn Như Thắng",
    trangThai: "chuyen-tham-quyen", soQD: "29/2026/QĐ-CTQ", ngayQD: "12/07/2026",
    soNgayBAQD: "0807/2026/HC-ST – 08/07/2025", toaRABAQD: "Tòa án nhân dân quận Ninh Kiều",
    soNgayKhangNghi: "QDKN_0654 – 20/03/2026", soNgayThuLy: "54681800 – 08/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "ỦY BAN NHÂN DÂN QUẬN NINH KIỀU", loaiAn: "Hành chính", chuToa: "Nguyễn Như Thắng",
    hdxx: "Hội đồng toàn thể", ngayXX: "–", phongXX: "–",
  },
  {
    id: 13,
    maVuAn: "VA26-002613", tenVuAn: "Khiếu kiện quyết định thu hồi đất và cưỡng chế giải phóng mặt bằng",
    soThuLy: "54682613", ngayThuLy: "10/07/2026",
    soBA: "18/2026/HC-ST", ngayBA: "08/07/2026",
    toa: "Tòa án nhân dân cấp cao tại Hà Nội",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm", tag: "an-chi-dao",
    ndkn: "Đỗ Thành Công", ndd: "Ủy ban nhân dân tỉnh Bắc Ninh",
    ttv: "Trịnh Thị Minh Trang", ldv: "Nguyễn Như Thắng", tp: "Lê Thị Thu Hiển",
    trangThai: "chua-xx-chua-ds",
    soNgayBAQD: "18/2026/HC-ST – 08/07/2026", toaRABAQD: "Tòa án nhân dân cấp cao tại Hà Nội",
    soNgayKhangNghi: "QDKN_2613 – 09/07/2026", soNgayThuLy: "54682613 – 10/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Ủy ban nhân dân tỉnh Bắc Ninh", loaiAn: "Hành chính", chuToa: "Lê Thị Thu Hiển",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "Phòng xét xử số 1",
  },
  {
    id: 14,
    maVuAn: "VA26-002714", tenVuAn: "Khiếu kiện quyết định phê duyệt phương án bồi thường, hỗ trợ tái định cư",
    soThuLy: "54682714", ngayThuLy: "12/07/2026",
    soBA: "52/2026/HC-PT", ngayBA: "25/06/2026",
    toa: "Tòa án nhân dân cấp cao tại TP.HCM",
    capXetXu: "Phúc thẩm", thoiHieu: "3 năm",
    ndkn: "Phạm Văn Minh", ndd: "Ủy ban nhân dân TP Thủ Đức",
    ttv: "Hoàng Quỳnh Trang", ldv: "Phạm Thị Bích Ngọc", tp: "Trịnh Đức Minh",
    trangThai: "chua-xx-da-ds", thoiHanXX: "14 ngày",
    soNgayBAQD: "52/2026/HC-PT – 25/06/2026", toaRABAQD: "Tòa án nhân dân cấp cao tại TP.HCM",
    soNgayKhangNghi: "QDKN_2714 – 02/07/2026", soNgayThuLy: "54682714 – 12/07/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Ủy ban nhân dân TP Thủ Đức", loaiAn: "Hành chính", chuToa: "Trịnh Đức Minh",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "05/08/2026", phongXX: "Phòng xét xử số 2",
  },
  {
    id: 15,
    maVuAn: "VA26-002815", tenVuAn: "Khiếu kiện quyết định cấp giấy chứng nhận quyền sử dụng đất trái pháp luật",
    soThuLy: "–", ngayThuLy: "–",
    soBA: "99/2026/HC-ST", ngayBA: "12/07/2026",
    toa: "Tòa án nhân dân tỉnh Vĩnh Phúc",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "Nguyễn Văn Thanh", ndd: "Ủy ban nhân dân huyện Yên Lạc",
    ttv: "Vũ Diệu Thúy", ldv: "Lê Thị Thu Hiển", tp: "Nguyễn Như Thắng",
    trangThai: "chua-thu-ly",
    soNgayBAQD: "99/2026/HC-ST – 12/07/2026", toaRABAQD: "Tòa án nhân dân tỉnh Vĩnh Phúc",
    soNgayKhangNghi: "QDKN_2815 – 15/07/2026", soNgayThuLy: "–",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Ủy ban nhân dân huyện Yên Lạc", loaiAn: "Hành chính", chuToa: "–",
    hdxx: "–", ngayXX: "–", phongXX: "–",
  },
  {
    id: 16,
    maVuAn: "VA26-002916", tenVuAn: "Khiếu kiện quyết định áp dụng biện pháp ngăn chặn hành chính",
    soThuLy: "54682916", ngayThuLy: "05/06/2026",
    soBA: "14/2026/HC-ST", ngayBA: "10/05/2026",
    toa: "Tòa án nhân dân tỉnh Hải Dương",
    capXetXu: "Sơ thẩm", thoiHieu: "3 năm",
    ndkn: "Hoàng Văn Tuấn", ndd: "Cục trưởng Cục Thuế tỉnh Hải Dương",
    ttv: "Nguyễn Thị Hương", ldv: "Phạm Thị Bích Ngọc", tp: "Nguyễn Biên Thùy",
    trangThai: "da-xx", soQD: "44/2026/QĐ-GĐT", ngayQD: "28/06/2026",
    soNgayBAQD: "14/2026/HC-ST – 10/05/2026", toaRABAQD: "Tòa án nhân dân tỉnh Hải Dương",
    soNgayKhangNghi: "QDKN_2916 – 20/05/2026", soNgayThuLy: "54682916 – 05/06/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Cục trưởng Cục Thuế tỉnh Hải Dương", loaiAn: "Hành chính", chuToa: "Nguyễn Biên Thùy",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "20/06/2026", phongXX: "Phòng xét xử số 3",
  },
  {
    id: 17,
    maVuAn: "VA26-003017", tenVuAn: "Khiếu kiện hành vi hành chính từ chối giải quyết thủ tục đăng ký biến động đất đai",
    soThuLy: "54683017", ngayThuLy: "15/06/2026",
    soBA: "28/2026/HC-PT", ngayBA: "01/06/2026",
    toa: "Tòa án nhân dân cấp cao tại Hà Nội",
    capXetXu: "Phúc thẩm", thoiHieu: "3 năm",
    ndkn: "Trần Thị Mai", ndd: "Văn phòng Đăng ký đất đai tỉnh Hòa Bình",
    ttv: "Vô Thị Thúy Giang", ldv: "Lê Thị Thu Hiển", tp: "Lê Thị Thu Hiển",
    trangThai: "rut-khang-nghi", soQD: "81/2026/QĐ-CA", ngayQD: "02/07/2026",
    soNgayBAQD: "28/2026/HC-PT – 01/06/2026", toaRABAQD: "Tòa án nhân dân cấp cao tại Hà Nội",
    soNgayKhangNghi: "QDKN_3017 – 10/06/2026", soNgayThuLy: "54683017 – 15/06/2026",
    vienKiemSat: "Viện kiểm sát nhân dân tối cao", toaAnGiaiQuyet: "Tòa án nhân dân tối cao",
    biCao: "Văn phòng Đăng ký đất đai tỉnh Hòa Bình", loaiAn: "Hành chính", chuToa: "Lê Thị Thu Hiển",
    hdxx: "Hội đồng 5 thẩm phán", ngayXX: "–", phongXX: "–",
  },
];

const paginBtn: React.CSSProperties = { padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT };

const LIST_TABS = [
  { id: "tat-ca", label: "Tất cả", count: ROWS.length },
  { id: "chua-xx-chua-ds", label: "Chưa có DS xét xử", count: ROWS.filter(r => r.trangThai === "chua-xx-chua-ds").length },
];

const DETAIL_TABS: { key: DetailTab; label: string }[] = [
  { key: "thong-tin", label: "Thông tin vụ án" },
  { key: "thu-ly", label: "Thụ lý" },
  { key: "phan-cong", label: "Phân công" },
  { key: "to-trinh", label: "Tờ trình" },
  { key: "qd-vu-an", label: "Quyết định vụ án" },
  { key: "ket-qua", label: "Kết quả xét xử" },
];

// ── Trạng thái cell (rich – matches image-5) ─────────────────────────────────

function TrangThaiCell({ row }: { row: VuXetXuRow }) {
  switch (row.trangThai) {
    case "chua-xx-chua-ds":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid #16a34a`, borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#16a34a", background: "#fff" }}>Chưa xét xử</span>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Chưa có danh sách vụ xét xử</span>
        </div>
      );
    case "chua-xx-da-ds":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid #16a34a`, borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#16a34a", background: "#fff" }}>Chưa xét xử</span>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Đã có danh sách vụ xét xử</span>
          {row.thoiHanXX && (
            <span style={{ fontSize: 11, color: RED, fontFamily: F, fontStyle: "italic" }}>Thời hạn xét xử: {row.thoiHanXX}</span>
          )}
        </div>
      );
    case "chua-thu-ly":
      return (
        <div>
          <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid ${RED}`, borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: RED, background: "#fff" }}>Chưa thụ lý xét xử</span>
        </div>
      );
    case "rut-khang-nghi":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-block", padding: "3px 10px", border: "1px solid #0891b2", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#0891b2", background: "#ecfeff" }}>Rút kháng nghị</span>
          {row.soQD && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Số QĐ: {row.soQD}</span>}
          {row.ngayQD && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày QĐ: {row.ngayQD}</span>}
        </div>
      );
    case "da-xx":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "inline-block", padding: "3px 10px", border: "1px solid #6b7280", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#374151", background: "#f3f4f6" }}>Đã xét xử</span>
          {row.soQD !== undefined && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Số: {row.soQD}</span>}
          {row.ngayQD && <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Ngày QĐ: {row.ngayQD}</span>}
        </div>
      );
    case "chuyen-tham-quyen":
      return (
        <div>
          <span style={{ display: "inline-block", padding: "3px 10px", border: "1px solid #2563eb", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, color: "#2563eb", background: "#eff6ff" }}>Chuyển thẩm quyền xét xử</span>
        </div>
      );
  }
}

// ── Info grid ─────────────────────────────────────────────────────────────────

function InfoGrid({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {rows.map(([l1, v1, l2, v2], i) => (
          <tr key={i}>
            <td style={{ padding: "10px 14px", fontSize: 12, color: MUTED, fontFamily: F, background: BG, border: `1px solid ${BORDER}`, width: "18%", whiteSpace: "nowrap" as const }}>{l1}</td>
            <td style={{ padding: "10px 14px", fontSize: 12, color: TEXT, fontFamily: F, border: `1px solid ${BORDER}`, width: "32%" }}>{v1}</td>
            <td style={{ padding: "10px 14px", fontSize: 12, color: MUTED, fontFamily: F, background: BG, border: `1px solid ${BORDER}`, width: "18%", whiteSpace: "nowrap" as const }}>{l2}</td>
            <td style={{ padding: "10px 14px", fontSize: 12, color: TEXT, fontFamily: F, border: `1px solid ${BORDER}` }}>{v2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ThongTinChungBlock({ row }: { row: VuXetXuRow }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <button onClick={() => setOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 14, color: TEXT, padding: 0 }}>—</button>
        <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, letterSpacing: "0.3px", fontFamily: F }}>Thông tin chung của vụ án</span>
      </div>
      {open && (
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ padding: "8px 14px", background: BG, borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
          </div>
          <InfoGrid rows={[
            ["Mã vụ án – Tên vụ án", row.maVuAn, "Số – Ngày BA/QĐ", row.soNgayBAQD],
            ["Tòa ra BA/QĐ", row.toaRABAQD, "Số – Ngày Kháng nghị", row.soNgayKhangNghi],
            ["Số – Ngày thụ lý xét xử", row.soNgayThuLy, "Trạng thái", "Chưa xét xử"],
            ["Viện kiểm sát giải quyết", row.vienKiemSat, "Tòa án giải quyết", row.toaAnGiaiQuyet],
          ]} />
        </div>
      )}
    </div>
  );
}

// ── Tab: Thông tin vụ án ─────────────────────────────────────────────────────

function TabThongTin({ row }: { row: VuXetXuRow }) {
  const [sec1Open, setSec1Open] = useState(true);
  const [sec2Open, setSec2Open] = useState(true);
  const [kSuaOpen, setKSuaOpen] = useState(false);
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "9px 12px" };
  const inp: React.CSSProperties = { border: `1px solid ${BORDER}`, borderRadius: 4, padding: "7px 10px", fontSize: 12, fontFamily: F, outline: "none", background: "#fff", width: "100%", boxSizing: "border-box" as const };

  const actBtns = <div style={{ display: "flex", gap: 4 }}><button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><Eye size={14} /></button><button style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}><Trash2 size={14} /></button></div>;

  const PTab = ({ cols, rows, noData }: { cols: string[]; rows: React.ReactNode[][]; noData?: boolean }) => (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead><tr>{cols.map(c => <th key={c} style={TH}>{c}</th>)}</tr></thead>
      <tbody>
        {(noData || rows.length === 0)
          ? <tr><td colSpan={cols.length} style={{ padding: 16, textAlign: "center" as const, fontSize: 12, color: MUTED, fontFamily: F }}>Không có dữ liệu</td></tr>
          : rows.map((r, i) => <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>{r.map((c, j) => <td key={j} style={TD}>{c}</td>)}</tr>)
        }
      </tbody>
    </table>
  );

  return (
    <div>
      {/* Section 1 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <button onClick={() => setSec1Open(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 14, color: TEXT, padding: 0 }}>—</button>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, letterSpacing: "0.3px", fontFamily: F }}>Thông tin đề nghị Giám đốc thẩm / Tái thẩm</span>
        </div>
        {sec1Open && (
          <>
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ padding: "8px 14px", background: BG, borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
              </div>
              <InfoGrid rows={[
                ["Mã vụ án – Tên vụ án", row.maVuAn, "Số – Ngày BA/QĐ", row.soNgayBAQD],
                ["Tòa ra BA/QĐ", row.toaRABAQD, "Số – Ngày Kháng nghị", row.soNgayKhangNghi],
                ["Số – Ngày thụ lý xét xử", row.soNgayThuLy, "Trạng thái", "Chưa xét xử"],
                ["Viện kiểm sát giải quyết", row.vienKiemSat, "Tòa án giải quyết", row.toaAnGiaiQuyet],
              ]} />
            </div>
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin Hồ sơ Kháng nghị</span>
                <button onClick={() => setKSuaOpen(v => !v)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: kSuaOpen ? "#fee2e2" : "#fff", border: `1px solid ${kSuaOpen ? RED : BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: kSuaOpen ? RED : TEXT }}>
                  <Pencil size={12} /> Sửa
                </button>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div><label style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 5 }}>Ngày VKS trả/chuyển hồ sơ:</label><input style={inp} defaultValue="27/07/2026" readOnly={!kSuaOpen} /></div>
                  <div><label style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 5 }}>Số bút lục VKS trả/chuyển HS:</label><input style={inp} placeholder="Nhập số" readOnly={!kSuaOpen} /></div>
                  <div><label style={{ fontSize: 11, color: MUTED, fontFamily: F, display: "block", marginBottom: 5 }}>Người kháng nghị:</label><input style={inp} defaultValue="Viện trưởng viện kiểm sát nhân dân tối cao" readOnly={!kSuaOpen} /></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Section 2 */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <button onClick={() => setSec2Open(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 14, color: TEXT, padding: 0 }}>—</button>
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, letterSpacing: "0.3px", fontFamily: F }}>Thông tin người liên quan</span>
        </div>
        {sec2Open && (
          <>
            {[
              { title: "* Người khiếu nại", req: true, cols: ["STT", "Họ và tên/Tổ chức", "Năm sinh", "Địa chỉ", "Thao tác"], rows: [["1", "Phan Mai Hoa", "", "Tổ 3, phường Yên Nghĩa, TP Hà Nội", actBtns]] },
              {
                title: "* Bị cáo", req: true, cols: ["STT", "Họ và tên/Tổ chức", "Địa vị pháp lý", "Thông tin tội danh, Mức án", "Năm sinh", "Địa chỉ", "Thao tác"],
                rows: [["1", row.biCao, "Bị cáo đầu vụ", <div key="td" style={{ fontSize: 11, lineHeight: 1.5, fontFamily: F }}><div><b>Tội che giấu tội phạm (Tội danh chính)</b> Khoản 1 Điểm a</div><div style={{ color: MUTED }}>Tù có thời hạn – 15 năm, 6 tháng; Phạt tiền, khi không áp dụng hình phạt là phạt chính</div></div>, "2000", "Tổ 7, Xã Yên Định, Tỉnh Bắc Ninh", actBtns]]
              },
              { title: "Bị hại", req: false, cols: ["STT", "Họ và tên/Tổ chức", "Năm sinh", "Địa chỉ", "Thao tác"], rows: [] as React.ReactNode[][] },
            ].map(sec => (
              <div key={sec.title} style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ padding: "8px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>
                    {!sec.req && <input type="checkbox" style={{ cursor: "pointer" }} />}
                    {sec.title}
                  </label>
                  <button style={{ padding: "4px 12px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F, color: TEXT }}>+ Thêm mới</button>
                </div>
                <PTab cols={sec.cols} rows={sec.rows as React.ReactNode[][]} noData={sec.rows.length === 0} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── Tab: Thụ lý ───────────────────────────────────────────────────────────────

function TabThuLy({ row }: { row: VuXetXuRow }) {
  const [ketQuaOpen, setKetQuaOpen] = useState(true);
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "9px 12px", verticalAlign: "top" as const };

  return (
    <div>
      <ThongTinChungBlock row={row} />
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" defaultChecked style={{ cursor: "pointer", accentColor: RED }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, fontFamily: F }}>Thông tin thụ lý vụ án GĐT, TT</span>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, color: TEXT }}><Pencil size={12} /> Sửa thông tin</button>
        </div>
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" as const, fontSize: 12, fontFamily: F }}>
            <span><b style={{ color: MUTED }}>* Số thụ lý GĐT, TT:</b> <b style={{ color: TEXT }}>54682698</b></span>
            <span><b style={{ color: MUTED }}>* Ngày thụ lý:</b> <b style={{ color: TEXT }}>27/07/2026</b></span>
            <span><b style={{ color: MUTED }}>Người kháng nghị:</b> <span style={{ color: TEXT }}>Viện trưởng viện kiểm sát nhân dân tối cao</span></span>
            <span><b style={{ color: MUTED }}>Chuyển thẩm quyền xét xử:</b> <span style={{ color: TEXT }}>Không</span></span>
          </div>
        </div>
      </div>
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setKetQuaOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 14, color: TEXT }}>—</button>
          <input type="checkbox" defaultChecked style={{ cursor: "pointer", accentColor: RED }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, fontFamily: F }}>Kết quả theo giai đoạn</span>
        </div>
        {ketQuaOpen && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["STT", "Giai đoạn", "Thông tin thụ lý", "Bị cáo/Bị cáo & Tội danh", "Tòa án & Thẩm phán", "Kết quả"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              <tr style={{ background: "#fff" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>1</td>
                <td style={TD}><span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: F, background: "#dbeafe", color: "#1e40af" }}>Giám đốc thẩm</span></td>
                <td style={TD}><div>Số thụ lý: <b>54682698</b></div><div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Ngày: 27/07/2026</div></td>
                <td style={{ ...TD, fontWeight: 600 }}>{row.biCao}</td>
                <td style={TD}><div style={{ fontWeight: 600 }}>{row.toaAnGiaiQuyet}</div><div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{row.chuToa}</div></td>
                <td style={TD}></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Tab: Phân công ────────────────────────────────────────────────────────────

function TabPhanCong({ row }: { row: VuXetXuRow }) {
  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "9px 12px", verticalAlign: "top" as const };

  const PC_ROWS = [
    { vai: "Thẩm phán", ngay: "10/04/2026\n06/04/2026", ten: "Trịnh Đức Minh", phu: "Lê Đức Hòa", chuc: "Phó chánh án", nguoi: "Nguyễn Xuân Thành\n10/04/2026 – 10:20:10", hasDoc: true, hasLuu: false },
    { vai: "Lãnh đạo vụ", ngay: "14/04/2026", ten: "Hoàng Văn Hòa", phu: "", chuc: "Phó Vụ trưởng", nguoi: "Nguyễn Xuân Thành\n14/04/2026 – 10:20:10", hasDoc: false, hasLuu: false },
    { vai: "Thẩm tra viên", ngay: "16/04/2026", ten: "Nguyễn Ngọc Ngan", phu: "", chuc: "Thẩm tra viên chính", nguoi: "Nguyễn Xuân Thành\n14/04/2026 – 10:20:10", hasDoc: false, hasLuu: false },
    { vai: "Thư ký", ngay: "", ten: "", phu: "", chuc: "", nguoi: "", hasDoc: false, hasLuu: true },
  ];
  const HDXX_ROWS = [
    { vai: "Thẩm phán chủ tọa", nguoi: "Nguyễn Hoàng Hòa – 16/02/1989", chuc: "Phó chánh án – Thẩm phán tối cao", ngay: "12/02/2028" },
    { vai: "Thẩm phán thành viên hội đồng xét xử", nguoi: "Nguyễn Hoàng Hòa – 16/02/1989", chuc: "Thẩm phán bậc 3", ngay: "12/02/2028" },
    { vai: "Thẩm phán thành viên hội đồng xét xử", nguoi: "Nguyễn Hoàng Hòa – 16/02/1989", chuc: "Thẩm phán bậc 3", ngay: "12/02/2028" },
  ];
  const QD_ROWS = [
    { so: "12345681/2026/QĐ-TA", ngay: "31/03/2026", ten: "Quyết định thành lập hội đồng xét xử", nguoiKy: "Trần Văn Hành", chucVu: "Chánh tòa", tt: "Đã cấp số" },
  ];

  const Sec = ({ title }: { title: string }) => (
    <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
      <input type="checkbox" defaultChecked style={{ cursor: "pointer", accentColor: RED }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase" as const, fontFamily: F }}>{title}</span>
    </div>
  );

  return (
    <div>
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <InfoGrid rows={[
          ["Mã vụ án", row.maVuAn, "Số – Ngày thụ lý xét xử", row.soNgayThuLy],
          ["Số – Ngày BA/QĐ", row.soNgayBAQD, "Trạng thái", "Chưa xét xử"],
          ["Tòa ra bản án", row.toaRABAQD, "Viện kiểm sát giải quyết", row.vienKiemSat],
          ["Số – Ngày kháng nghị", row.soNgayKhangNghi, "Tòa án giải quyết", row.toaAnGiaiQuyet],
        ]} />
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <Sec title="Phân công giải quyết" />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["STT", "Vai trò", "Ngày phân công", "Họ và tên", "Chức danh/Chức vụ", "Người phân công/sửa", "Thao tác"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {PC_ROWS.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{i + 1}</td>
                <td style={TD}>{r.vai}</td>
                <td style={{ ...TD, whiteSpace: "pre-line" as const, fontSize: 11, color: MUTED }}>{r.ngay}</td>
                <td style={TD}>{r.ten && <div style={{ fontWeight: 600 }}>{r.ten}</div>}{r.phu && <div style={{ fontSize: 11, color: MUTED }}>{r.phu}</div>}</td>
                <td style={TD}>{r.chuc}</td>
                <td style={{ ...TD, whiteSpace: "pre-line" as const, fontSize: 11 }}>{r.nguoi}</td>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  {r.hasDoc && <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><FileText size={14} /></button>}
                  {r.hasLuu && <button style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: F }}>Lưu</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <Sec title="Thành phần hội đồng xét xử" />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["STT", "Vai trò", "Người được phân công", "Chức vụ – Chức danh tư pháp", "Ngày phân công"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {HDXX_ROWS.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{i + 1}</td>
                <td style={TD}>{r.vai}</td>
                <td style={{ ...TD, fontWeight: 600 }}>{r.nguoi}</td>
                <td style={TD}>{r.chuc}</td>
                <td style={{ ...TD, whiteSpace: "nowrap" as const }}>{r.ngay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <Sec title="Quyết định phân công" />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["STT", "Số quyết định", "Ngày quyết định", "Tên biểu mẫu", "Người ký", "Trạng thái cấp số", "Thao tác"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {QD_ROWS.map((r, i) => (
              <tr key={i} style={{ background: "#fff" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{i + 1}</td>
                <td style={{ ...TD, color: "#2563eb", fontWeight: 600 }}>{r.so}</td>
                <td style={{ ...TD, whiteSpace: "nowrap" as const }}>{r.ngay}</td>
                <td style={TD}>{r.ten}</td>
                <td style={TD}><div style={{ fontWeight: 600 }}>{r.nguoiKy}</div><div style={{ fontSize: 11, color: MUTED }}>{r.chucVu}</div></td>
                <td style={TD}><Badge color="#15803d" bg="#dcfce7">{r.tt}</Badge></td>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><Eye size={14} /></button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><FileText size={14} /></button>
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

// ── Tab: Tờ trình (copy vụ án, bỏ thông tin đơn) ────────────────────────────

function TabToTrinhXX({ row: _row }: { row: VuXetXuRow }) {
  const [showTaoTT, setShowTaoTT] = useState(false);
  const [showTrinhKy, setShowTrinhKy] = useState(false);
  const [showHoSo, setShowHoSo] = useState(false);
  const [showTaoDuThao, setShowTaoDuThao] = useState(false);
  const [thuHoiIdx, setThuHoiIdx] = useState<number | null>(null);
  const [lichSuData, setLichSuData] = useState([
    { ngayTrinh: "10/07/2026", lanh: "Nguyễn Văn C", capTrinh: "Phó Chánh án", vanBan: "Tờ trình xét xử vụ án số 2", yKien: "–", ngayDuyet: "–", trangThai: "cho-duyet", subRows: [] as { label: string; ngayDuyet: string }[] },
    { ngayTrinh: "07/07/2026", lanh: "Nguyễn Văn A", capTrinh: "Thẩm phán", vanBan: "Tờ trình xét xử vụ án số 1", yKien: "–", ngayDuyet: "07/07/2026", trangThai: "da-duyet", subRows: [] },
    { ngayTrinh: "08/07/2026", lanh: "Nguyễn Văn B", capTrinh: "Thẩm phán", vanBan: "Tờ trình xét xử vụ án số 1", yKien: "–", ngayDuyet: "08/07/2026", trangThai: "da-duyet", subRows: [{ label: "Dự thảo 01", ngayDuyet: "08/07/2026" }, { label: "Dự thảo 02", ngayDuyet: "08/07/2026" }] },
    { ngayTrinh: "06/07/2026", lanh: "Nguyễn Văn D", capTrinh: "Chánh án", vanBan: "Tờ trình xét xử vụ án số 1", yKien: "Hồ sơ chưa đầy đủ, đề nghị bổ sung tài liệu", ngayDuyet: "06/07/2026", trangThai: "tu-choi", subRows: [] },
  ]);
  const [filterVanBan, setFilterVanBan] = useState("");

  const vanBanRows = [
    { stt: 1, vanBan: "Tờ trình xét xử vụ án số 1", loai: "Tờ trình", ngayTao: "05/07/2026", nguoiKy: "Nguyễn Văn A", trangThai: "Đã ký số" },
    { stt: 2, vanBan: "Thông báo xét xử số 1", loai: "Thông báo", ngayTao: "09/07/2026", nguoiKy: "Nguyễn Văn B", trangThai: "Đã phát hành" },
    { stt: 3, vanBan: "Thông báo xét xử số 2", loai: "Thông báo", ngayTao: "09/07/2026", nguoiKy: "–", trangThai: "Chờ ký số" },
  ];

  const allVanBanOptions = Array.from(new Set(lichSuData.map(r => r.vanBan)));
  const filteredLichSu = lichSuData.filter(r => !filterVanBan || r.vanBan === filterVanBan);

  const TH: React.CSSProperties = { padding: "8px 10px", background: BG, fontWeight: 700, fontSize: 11, color: "#374151", fontFamily: F, textAlign: "left" as const, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}` };
  const TD: React.CSSProperties = { padding: "9px 10px", fontSize: 12, color: TEXT, fontFamily: F, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" as const };

  /* ── mini modal stubs ── */
  const Modal = ({ title, onClose }: { title: string; onClose: () => void }) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 480, padding: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={18} /></button>
        </div>
        <p style={{ fontSize: 12, color: MUTED, fontFamily: F, marginBottom: 16 }}>Chức năng đang phát triển...</p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "6px 18px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Đóng</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
      {showTaoTT && <Modal title="Tạo tờ trình" onClose={() => setShowTaoTT(false)} />}
      {showTrinhKy && <Modal title="Trình ký" onClose={() => setShowTrinhKy(false)} />}
      {showHoSo && <Modal title="Hồ sơ tờ trình" onClose={() => setShowHoSo(false)} />}
      {showTaoDuThao && <TaoDuThaoModal onClose={() => setShowTaoDuThao(false)} />}
      {thuHoiIdx !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 8, width: 380, padding: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            <p style={{ fontSize: 14, fontFamily: F, marginBottom: 20 }}>Bạn có chắc muốn thu hồi tờ trình này?</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setThuHoiIdx(null)} style={{ padding: "6px 16px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hủy</button>
              <button onClick={() => { setLichSuData(p => p.filter((_, i) => i !== thuHoiIdx)); setThuHoiIdx(null); }} style={{ padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* Văn bản */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Danh sách văn bản</span>
          <button onClick={() => setShowTrinhKy(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Trình ký</button>
          <button onClick={() => setShowTaoDuThao(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Tạo dự thảo</button>
          <button onClick={() => setShowTaoTT(true)} style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>+ Tạo tờ trình</button>
          <button onClick={() => setShowHoSo(true)} style={{ padding: "6px 14px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hồ sơ tờ trình</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["STT", "TÊN VĂN BẢN", "LOẠI", "NGÀY TẠO", "NGƯỜI KÝ", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {vanBanRows.map((r, idx) => (
              <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{r.stt}</td>
                <td style={{ ...TD, color: "#2563eb" }}>{r.vanBan}</td>
                <td style={TD}>{r.loai}</td>
                <td style={TD}>{r.ngayTao}</td>
                <td style={TD}>{r.nguoiKy}</td>
                <td style={TD}>
                  <Badge color={r.trangThai === "Đã phát hành" ? "#065f46" : r.trangThai === "Đã ký số" ? "#1e40af" : "#92400e"}
                    bg={r.trangThai === "Đã phát hành" ? "#d1fae5" : r.trangThai === "Đã ký số" ? "#dbeafe" : "#fef3c7"}>
                    {r.trangThai === "Chờ ký số" ? "Chờ ký" : r.trangThai}
                  </Badge>
                </td>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer" }}><Eye size={14} color="#0e7490" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lịch sử trình ký */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Lịch sử trình ký</span>
          <select value={filterVanBan} onChange={e => setFilterVanBan(e.target.value)}
            style={{ padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, background: "#fff" }}>
            <option value="">Lọc theo văn bản</option>
            {allVanBanOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead><tr>{["STT", "NGÀY TRÌNH", "LÃNH ĐẠO ĐƯỢC TRÌNH", "CẤP TRÌNH", "VĂN BẢN", "Ý KIẾN", "NGÀY DUYỆT", "TRẠNG THÁI", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {filteredLichSu.map((r, realIdx) => (
                <React.Fragment key={realIdx}>
                  <tr style={{ background: "#fff" }}>
                    <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{realIdx + 1}</td>
                    <td style={TD}>{r.ngayTrinh}</td>
                    <td style={TD}>{r.lanh}</td>
                    <td style={TD}>{r.capTrinh}</td>
                    <td style={{ ...TD, color: "#2563eb" }}>{r.vanBan}</td>
                    <td style={{ ...TD, fontSize: 11, whiteSpace: "pre-line" as const }}>{r.yKien}</td>
                    <td style={TD}>{r.ngayDuyet}</td>
                    <td style={TD}>
                      {r.trangThai === "cho-duyet"
                        ? <Badge color="#92400e" bg="#fef3c7">Chờ duyệt</Badge>
                        : r.trangThai === "tu-choi"
                          ? <Badge color="#991b1b" bg="#fee2e2">Từ chối</Badge>
                          : <Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge>}
                    </td>
                    <td style={{ ...TD, textAlign: "center" as const }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer" }} title="Xem"><Eye size={13} color="#0e7490" /></button>
                        {r.trangThai === "cho-duyet" && (
                          <button title="Thu hồi" onClick={() => setThuHoiIdx(realIdx)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <RotateCcw size={13} color="#dc2626" />
                          </button>
                        )}
                        <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                          <Send size={13} color={RED} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {r.subRows.map((sub, si) => (
                    <tr key={si} style={{ background: "#fafafa" }}>
                      <td style={{ ...TD, textAlign: "center" as const, color: MUTED }} />
                      <td colSpan={3} style={{ ...TD, paddingLeft: 28, fontSize: 11, color: MUTED }}>↳ {sub.label}</td>
                      <td colSpan={3} style={{ ...TD, fontSize: 11, color: MUTED }}>Ngày: {sub.ngayDuyet}</td>
                      <td style={TD}><Badge color="#065f46" bg="#d1fae5">Đã duyệt</Badge></td>
                      <td style={{ ...TD, textAlign: "center" as const }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer" }}><Eye size={13} color="#0e7490" /></button>
                          <button title="Trình ký" onClick={() => setShowTrinhKy(true)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <Send size={13} color={RED} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Shared: NoiNhanTable ─────────────────────────────────────────────────────

type NoiNhanRow = { id: number; noi: string; noiCT: string; ghiChu: string; editing: boolean };

const NOI_NHAN_OPTS = ["Viện kiểm sát", "Tòa án", "Cơ quan thi hành án", "Lưu hồ sơ", "Đương sự", "Luật sư"];
const NOI_CT_OPTS: Record<string, string[]> = {
  "Viện kiểm sát": ["VKSNDTC", "VKS cấp tỉnh", "VKS cấp huyện"],
  "Tòa án": ["TAND Tối cao", "TAND cấp tỉnh", "TAND cấp huyện"],
};

const nnSelSt: React.CSSProperties = { padding: "5px 28px 5px 8px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", width: "100%", background: "#fff", appearance: "none" as const, cursor: "pointer" };
const nnInpSt: React.CSSProperties = { padding: "5px 8px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", width: "100%", background: "#fff" };
const nnTH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "8px 12px", textAlign: "left" as const };
const nnTD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "8px 10px", verticalAlign: "middle" as const };

function NoiNhanTable({ rows, setRows }: { rows: NoiNhanRow[]; setRows: React.Dispatch<React.SetStateAction<NoiNhanRow[]>> }) {
  const add = () => setRows(p => [...p, { id: Date.now(), noi: "", noiCT: "", ghiChu: "", editing: true }]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <label style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: TEXT, display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          <span style={{ color: RED }}>*</span> Nơi nhận
        </label>
        <button onClick={add} style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
          Thêm nơi nhận
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${BORDER}` }}>
        <thead>
          <tr style={{ background: BG }}>
            {["STT", "NƠI NHẬN", "NƠI NHẬN CHI TIẾT", "GHI CHÚ", "THAO TÁC"].map(h => (
              <th key={h} style={{ ...nnTH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} style={{ background: "#fff" }}>
              <td style={{ ...nnTD, width: 40, textAlign: "center" as const, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{i + 1}</td>
              <td style={{ ...nnTD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
                {r.editing ? (
                  <div style={{ position: "relative" as const }}>
                    <select style={nnSelSt} value={r.noi}
                      onChange={e => setRows(p => p.map((x, xi) => xi === i ? { ...x, noi: e.target.value, noiCT: "" } : x))}>
                      <option value="">Chọn nơi nhận</option>
                      {NOI_NHAN_OPTS.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} color={MUTED} style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                ) : r.noi}
              </td>
              <td style={{ ...nnTD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
                {r.editing ? (
                  <div style={{ position: "relative" as const }}>
                    <select style={nnSelSt} value={r.noiCT}
                      onChange={e => setRows(p => p.map((x, xi) => xi === i ? { ...x, noiCT: e.target.value } : x))}>
                      <option value="">Chọn</option>
                      {(NOI_CT_OPTS[r.noi] ?? []).map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} color={MUTED} style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                ) : r.noiCT}
              </td>
              <td style={{ ...nnTD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
                {r.editing
                  ? <input placeholder="Nhập ghi chú" style={nnInpSt} value={r.ghiChu}
                    onChange={e => setRows(p => p.map((x, xi) => xi === i ? { ...x, ghiChu: e.target.value } : x))} />
                  : r.ghiChu}
              </td>
              <td style={{ ...nnTD, textAlign: "center" as const, whiteSpace: "nowrap" as const, borderBottom: `1px solid ${BORDER}` }}>
                {r.editing ? (
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button onClick={() => setRows(p => p.map((x, xi) => xi === i ? { ...x, editing: false } : x))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 12, fontFamily: F }}>Lưu</button>
                    <button onClick={() => setRows(p => p.filter((_, xi) => xi !== i))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 12, fontFamily: F }}>Hủy</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button onClick={() => setRows(p => p.map((x, xi) => xi === i ? { ...x, editing: true } : x))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 12, fontFamily: F, display: "flex", alignItems: "center", gap: 3 }}>
                      <Pencil size={12} /> Sửa
                    </button>
                    <button onClick={() => setRows(p => p.filter((_, xi) => xi !== i))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: RED, fontSize: 12, fontFamily: F, display: "flex", alignItems: "center", gap: 3 }}>
                      <Trash2 size={12} /> Xóa
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Modal: Quyết định rút kháng nghị ─────────────────────────────────────────

function ModalRutKhangNghi({ row, onClose }: { row: VuXetXuRow; onClose: () => void }) {
  const [loaiThayDoi, setLoaiThayDoi] = useState<"bo-sung" | "rut-khang-nghi">("rut-khang-nghi");
  const [noiNhan, setNoiNhan] = useState<NoiNhanRow[]>([]);
  const INP: React.CSSProperties = { padding: "6px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", width: "100%", background: "#fff" };
  const LBL: React.CSSProperties = { fontSize: 12, fontWeight: 600, fontFamily: F, color: TEXT, marginBottom: 4, display: "flex", alignItems: "center", gap: 2 };
  const REQ = <span style={{ color: RED }}>*</span>;
  const Fld = ({ label, req: r = true, children }: { label: string; req?: boolean; children: React.ReactNode }) => (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
      <label style={LBL}>{r && REQ} {label}</label>
      {children}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: 860, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" as const }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: F }}>⚡ Quyết định thay đổi (bổ sung/rút) kháng nghị GĐT (MS57) – GĐT</span>
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={18} /></button>
        </div>

        {/* Info block */}
        <div style={{ margin: "14px 20px 0", padding: "12px 16px", background: "#f8fafc", borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 12, fontFamily: F }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 24px" }}>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>Mã vụ án : <span style={{ color: TEXT, fontWeight: 400 }}>VA26-00321</span></span>
            <span>Số BA/QĐ : <span style={{ fontWeight: 600 }}>{formatSoBA("050526_CTH02")}</span></span>
            <span style={{ color: "#16a34a" }}>Giai đoạn : <span style={{ color: TEXT }}>Giám đốc thẩm, tái thẩm</span></span>
            <span style={{ color: "#16a34a" }}>Tên vụ án : <span style={{ color: TEXT }}>Vụ án Phan Văn Thành – bức cung</span></span>
            <span>Ngày ra BA/QĐ : <span style={{ fontWeight: 600 }}>05/05/2026</span></span>
            <span style={{ color: "#16a34a" }}>Tòa án giải quyết : <span style={{ color: TEXT }}>Tòa án nhân dân tối cao</span></span>
            <span style={{ color: "#16a34a" }}>Tên bị can đầu vụ : <span style={{ color: TEXT }}>Phan Văn Thành</span></span>
            <span>Tòa xét xử : <span style={{ fontWeight: 600 }}>Tòa án nhân dân tỉnh Hải Phòng</span></span>
            <span style={{ color: "#16a34a" }}>Trạng thái : <span style={{ color: "#ef4444" }}>Chưa có kết quả xét xử</span></span>
            <span style={{ color: "#16a34a" }}>Tội danh chính : <span style={{ color: TEXT }}>Bức cung</span></span>
          </div>
        </div>

        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column" as const, gap: 16 }}>
          {/* Section: Thông tin quyết định */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "8px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8, background: "#fef2f2" }}>
              <span style={{ display: "inline-block", width: 12, height: 12, background: RED, borderRadius: 2 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F, textTransform: "uppercase" as const }}>Thông tin quyết định</span>
            </div>
            <div style={{ padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
              <Fld label="Ngày quyết định">
                <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                  <input placeholder="Chọn ngày" style={{ ...INP, border: "none", borderRadius: 0, flex: 1 }} />
                  <Calendar size={14} color={MUTED} style={{ marginRight: 8 }} />
                </div>
              </Fld>
              <Fld label="Số quyết định" req={false}>
                <input placeholder="Nhập số quyết định" style={INP} />
              </Fld>
              <Fld label="Hậu tố" req={false}>
                <input defaultValue="QĐ-TANDTC" style={INP} />
              </Fld>
              <Fld label="Người ký ban hành">
                <div style={{ position: "relative" as const }}>
                  <select style={{ ...INP, appearance: "none" as const, cursor: "pointer" }}><option value="">Chọn người ký ban hành</option></select>
                  <ChevronDown size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </Fld>
            </div>
          </div>

          {/* Section: Nội dung quyết định */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "8px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8, background: "#fef2f2" }}>
              <span style={{ display: "inline-block", width: 12, height: 12, background: RED, borderRadius: 2 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: RED, fontFamily: F, textTransform: "uppercase" as const }}>Nội dung quyết định</span>
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column" as const, gap: 14 }}>
              <div>
                <label style={{ ...LBL, marginBottom: 8 }}>{REQ} Loại thay đổi</label>
                <div style={{ display: "flex", gap: 24 }}>
                  {(["bo-sung", "rut-khang-nghi"] as const).map(v => (
                    <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontFamily: F }}>
                      <input type="radio" name="loai-thay-doi" checked={loaiThayDoi === v} onChange={() => setLoaiThayDoi(v)}
                        style={{ accentColor: "#1d4ed8", width: 15, height: 15 }} />
                      {v === "bo-sung" ? "Bổ sung" : "Rút kháng nghị"}
                    </label>
                  ))}
                </div>
              </div>
              <Fld label="Nhận thấy">
                <textarea placeholder="Nhập nội dung nhận thấy..." rows={5}
                  style={{ ...INP, resize: "vertical" as const }} />
              </Fld>
              <NoiNhanTable rows={noiNhan} setRows={setNoiNhan} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "center", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Đóng</button>
          <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Lưu</button>
          <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Lấy số</button>
          <button style={{ padding: "7px 22px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Trình ký</button>
          <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Xem biểu mẫu</button>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Quyết định vụ án ─────────────────────────────────────────────────────

function TabQuyetDinhVuAn({ row }: { row: VuXetXuRow }) {
  const [search, setSearch] = useState("");
  const [loaiBM, setLoaiBM] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const ddRef2 = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ddRef2.current && !ddRef2.current.contains(e.target as Node)) setShowDropdown(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px" };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "10px 12px", verticalAlign: "top" as const };

  const QD_ROWS = [
    {
      id: 1, tenQD: "Quyết định đình chỉ do rút kháng nghị", soQD: "54682704/2026/QĐ-CA",
      ngayQD: "27/07/2026", nguoiKy: "Lê Thị Thu Hiền",
      nguoiTao: "Nguyễn Văn Tiến", ngayTao: "27/07/2026 18:15:46",
    },
  ];

  const filtered = QD_ROWS.filter(r =>
    !search || r.tenQD.toLowerCase().includes(search.toLowerCase()) || r.soQD.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {showModal && <ModalRutKhangNghi row={row} onClose={() => setShowModal(false)} />}
      {/* Thông tin chung */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "8px 14px", borderBottom: `1px solid ${BORDER}`, background: BG }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
        </div>
        <InfoGrid rows={[
          ["Mã vụ án – Tên vụ án", row.maVuAn, "Số – Ngày BA/QĐ", row.soNgayBAQD],
          ["Tòa ra BA/QĐ", row.toaRABAQD, "Số – Ngày Kháng nghị", row.soNgayKhangNghi],
          ["Số – Ngày thụ lý xét xử", row.soNgayThuLy, "Trạng thái", "Chưa xét xử"],
          ["Viện kiểm sát giải quyết", row.vienKiemSat, "Tòa án giải quyết", row.toaAnGiaiQuyet],
        ]} />
      </div>

      {/* Table section */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: RED, fontFamily: F, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 14 }}>▬</span> Quyết định vụ án
          </span>
        </div>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nhập từ khóa tìm kiếm"
              style={{ padding: "5px 10px", fontSize: 12, fontFamily: F, border: "none", outline: "none", width: 220 }} />
            <button style={{ padding: "5px 10px", background: RED, border: "none", cursor: "pointer" }}><Search size={13} color="#fff" /></button>
          </div>
          <div style={{ flex: 1 }} />
          <div ref={ddRef2} style={{ position: "relative" as const }}>
            <button onClick={() => setShowDropdown(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F, fontWeight: 600 }}>
              + Thêm quyết định <ChevronDown size={13} color="#fff" />
            </button>
            {showDropdown && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", zIndex: 300, minWidth: 300, overflow: "hidden" }}>
                {[
                  "Quyết định đình chỉ do rút kháng nghị",
                  "Biên bản nghị án",

                ].map((label, i) => (
                  <button key={label}
                    onClick={() => { setShowDropdown(false); setShowModal(true); }}
                    style={{ width: "100%", textAlign: "left" as const, padding: "10px 16px", background: "none", border: "none", borderTop: i > 0 ? `1px solid ${BORDER}` : "none", cursor: "pointer", fontSize: 13, fontFamily: F, color: TEXT }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
            <select value={loaiBM} onChange={e => setLoaiBM(e.target.value)}
              style={{ padding: "5px 12px", fontSize: 12, fontFamily: F, border: "none", outline: "none", background: "#fff", cursor: "pointer", appearance: "none" as const }}>
              <option value="">Loại biểu mẫu</option>
              <option>Quyết định đình chỉ do rút kháng nghị</option>
              <option>Biên bản nghị án</option>
              <option>Biên bản phiên tòa Hình sự GĐT</option>
            </select>
            <ChevronDown size={14} color={MUTED} style={{ marginRight: 8, flexShrink: 0 }} />
          </div>
          <button style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 8px", cursor: "pointer", color: MUTED }}>
            <RotateCcw size={14} />
          </button>
        </div>
        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["STT", "TÊN QUYẾT ĐỊNH", "SỐ QĐ", "NGÀY RA QĐ", "NGƯỜI KÝ", "NGƯỜI TẠO", "THAO TÁC"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...TD, textAlign: "center" as const, color: MUTED }}>{i + 1}</td>
                <td style={TD}>{r.tenQD}</td>
                <td style={{ ...TD, color: "#2563eb", fontWeight: 600 }}>{r.soQD}</td>
                <td style={{ ...TD, whiteSpace: "nowrap" as const }}>{r.ngayQD}</td>
                <td style={TD}>{r.nguoiKy}</td>
                <td style={TD}>
                  <div style={{ fontWeight: 600, fontFamily: F }}>{r.nguoiTao}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{r.ngayTao}</div>
                </td>
                <td style={{ ...TD, textAlign: "center" as const }}>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><Eye size={14} /></button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><FileText size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 24, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F }}>Không có dữ liệu</td></tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div style={{ padding: "8px 14px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, fontSize: 12, color: MUTED, fontFamily: F }}>
          <span>Hiển thị 1-{filtered.length} / {filtered.length}</span>
          <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "default", color: MUTED }}>‹</button>
          <button style={{ padding: "3px 8px", border: `1px solid ${RED}`, borderRadius: 4, background: RED, color: "#fff", fontWeight: 700, cursor: "pointer" }}>1</button>
          <button style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", cursor: "default", color: MUTED }}>›</button>
        </div>
      </div>
    </div>
  );
}

// ── Detail view ───────────────────────────────────────────────────────────────

function ChiTietVuXetXuView({ row, onBack }: { row: VuXetXuRow; onBack: () => void }) {
  const [tab, setTab] = useState<DetailTab>("thong-tin");

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#f9fafb", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, background: "#fff", flexShrink: 0 }}>
        Trang chủ › Quản lý GĐT/TT › Quản lý vụ xét xử GĐT › Chi tiết vụ xét xử
      </div>
      <div style={{ background: "#fff", padding: "14px 20px 0", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: F, padding: 0, marginBottom: 12 }}>
          ← Chi tiết án xét xử – {row.maVuAn}
        </button>
        <div style={{ display: "flex", flexWrap: "nowrap" as const, overflowX: "auto" as const }}>
          {DETAIL_TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "10px 18px", background: "none", border: "none", cursor: "pointer",
              fontSize: 13, fontFamily: F, fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? RED : "#4b5563",
              borderBottom: tab === t.key ? `2px solid ${RED}` : "2px solid transparent",
              whiteSpace: "nowrap" as const, marginBottom: -1,
            }}>{t.label}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
        {tab === "thong-tin" && <TabThongTin row={row} />}
        {tab === "thu-ly" && <TabThuLy row={row} />}
        {tab === "phan-cong" && <TabPhanCong row={row} />}
        {tab === "to-trinh" && <TabToTrinhXX row={row} />}
        {tab === "qd-vu-an" && <TabQuyetDinhVuAn row={row} />}
        {tab === "ket-qua" && <TabKetQua row={row} />}
      </div>
    </div>
  );
}

// ── Tab: Kết quả xét xử ──────────────────────────────────────────────────────

// ── TabKetQua helpers (module-level to avoid React re-mount issues) ───────────

const kqInpSt: React.CSSProperties = {
  padding: "6px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`,
  borderRadius: 4, outline: "none", width: "100%", background: "#fff",
};
const kqSelSt: React.CSSProperties = { ...kqInpSt, appearance: "none" as const, cursor: "pointer" };
const kqLblSt: React.CSSProperties = { fontSize: 12, fontFamily: F, fontWeight: 600, color: TEXT, display: "flex", alignItems: "center", gap: 2 };

function KqField({ label, required: r = true, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 4, minWidth: 0 }}>
      <label style={kqLblSt}>{r && <span style={{ color: RED }}>*</span>} {label}</label>
      {children}
    </div>
  );
}

function KqSelect({ placeholder: ph }: { placeholder: string }) {
  return (
    <div style={{ position: "relative" as const, width: "100%" }}>
      <select style={kqSelSt}><option value="">{ph}</option></select>
      <ChevronDown size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  );
}

function TabKetQua({ row }: { row: VuXetXuRow }) {
  const [apAnLe, setApAnLe] = useState<"khong" | "co">("khong");
  const [congBoBA, setCongBoBA] = useState<"co" | "khong">("co");
  const [noiNhan, setNoiNhan] = useState<NoiNhanRow[]>([
    { id: 1, noi: "Viện kiểm sát", noiCT: "VKSNDTC", ghiChu: "Kèm hồ sơ vụ án", editing: false },
  ]);
  const [vatChung] = useState<{ id: number; ten: string }[]>([]);

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "8px 10px", textAlign: "center" as const };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "9px 10px", verticalAlign: "middle" as const };

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
      {/* Thông tin chung */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", background: BG, borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Thông tin chung của vụ án</span>
        </div>
        <InfoGrid rows={[
          ["Mã vụ án", row.maVuAn, "Số – Ngày thụ lý xét xử", row.soNgayThuLy],
          ["Liên quan bản án sơ thẩm", row.soNgayBAQD, "Trạng thái", "Chưa xét xử"],
          ["Tòa ra bản án sơ thẩm", row.toaRABAQD, "Viện kiểm sát giải quyết", row.vienKiemSat],
          ["Thủ tục giải quyết", "Giám đốc thẩm", "Tòa án giải quyết", row.toaAnGiaiQuyet],
        ]} />
      </div>

      {/* Kết quả giám đốc thẩm / tái thẩm */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, background: RED, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, textTransform: "uppercase" as const }}>Kết quả giám đốc thẩm, tái thẩm</span>
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column" as const, gap: 14 }}>
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <KqField label="Ngày mở phiên tòa">
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                <input placeholder="Vui lòng chọn" style={{ ...kqInpSt, border: "none", borderRadius: 0, flex: 1 }} readOnly />
                <Calendar size={14} color={MUTED} style={{ marginRight: 8, flexShrink: 0 }} />
              </div>
            </KqField>
            <KqField label="Địa điểm">
              <KqSelect placeholder="Chọn địa điểm" />
            </KqField>
            <KqField label="Ngày quyết định" required={false}>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                <input defaultValue="22/07/2026" style={{ ...kqInpSt, border: "none", borderRadius: 0, flex: 1 }} />
                <Calendar size={14} color={MUTED} style={{ marginRight: 8, flexShrink: 0 }} />
              </div>
            </KqField>
            <KqField label="Số quyết định" required={false}>
              <input placeholder="nhập dữ liệu" style={kqInpSt} />
            </KqField>
          </div>
          {/* Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <KqField label="Người ký">
              <KqSelect placeholder="Vui lòng chọn" />
            </KqField>
            <KqField label="Ngày phát hành" required={false}>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                <input placeholder="Vui lòng chọn" style={{ ...kqInpSt, border: "none", borderRadius: 0, flex: 1 }} readOnly />
                <Calendar size={14} color={MUTED} style={{ marginRight: 8, flexShrink: 0 }} />
              </div>
            </KqField>
            <KqField label="Điều luật">
              <KqSelect placeholder="Chọn căn cứ điều luật" />
            </KqField>
            <KqField label="Khoản">
              <KqSelect placeholder="Chọn điều khoản" />
            </KqField>
          </div>
          {/* Row 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <KqField label="Kết quả GĐT,TT">
              <KqSelect placeholder="Vui lòng chọn" />
            </KqField>
            <KqField label="Nguyên nhân">
              <KqSelect placeholder="Chọn nguyên nhân" />
            </KqField>
            <KqField label="Áp dụng án lệ" required={false}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 4 }}>
                {(["khong", "co"] as const).map(v => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 12, fontFamily: F }}>
                    <input type="radio" name="ap-an-le" checked={apAnLe === v} onChange={() => setApAnLe(v)}
                      style={{ accentColor: "#1d4ed8", width: 15, height: 15 }} />
                    {v === "khong" ? "Không" : "Có"}
                  </label>
                ))}
              </div>
            </KqField>
          </div>
          {/* Row 4 – Có công bố bản án */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 12 }}>
            <KqField label="Có công bố bản án">
              <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 4 }}>
                {(["co", "khong"] as const).map(v => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 12, fontFamily: F }}>
                    <input type="radio" name="cong-bo" checked={congBoBA === v} onChange={() => setCongBoBA(v)}
                      style={{ accentColor: "#1d4ed8", width: 15, height: 15 }} />
                    {v === "co" ? "Có" : "Không"}
                  </label>
                ))}
              </div>
            </KqField>
          </div>

          {/* Nơi nhận */}
          <NoiNhanTable rows={noiNhan} setRows={setNoiNhan} />
        </div>
      </div>

      {/* Thông tin liên quan */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, background: RED, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, textTransform: "uppercase" as const }}>Thông tin liên quan</span>
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column" as const, gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: TEXT }}>Nội dung vụ án</label>
            <textarea placeholder="Nhập nội dung vụ án" rows={4}
              style={{ padding: "8px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", resize: "vertical" as const }} />
            <div style={{ textAlign: "right" as const, fontSize: 11, color: MUTED, fontFamily: F }}>0/4000</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: TEXT }}>Nhận định tòa án</label>
            <textarea placeholder="Nhập nhận định của tòa án" rows={4}
              style={{ padding: "8px 10px", fontSize: 12, fontFamily: F, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", resize: "vertical" as const }} />
            <div style={{ textAlign: "right" as const, fontSize: 11, color: MUTED, fontFamily: F }}>0/4000</div>
          </div>
        </div>
      </div>

      {/* Danh sách quyết định liên quan */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${BORDER}`, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>Danh sách quyết định liên quan</span>
        </div>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: BG }}>
                <th rowSpan={3} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, width: 40 }}>STT</th>
                <th colSpan={2} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Thông tin bị cáo/bị cáo</th>
                <th colSpan={4} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>BA/QĐ sơ thẩm (PT/GĐT,TT)</th>
                <th colSpan={4} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Quyết định GĐT,TT</th>
                <th rowSpan={3} style={{ ...TH, borderBottom: `1px solid ${BORDER}` }}>Thao tác</th>
              </tr>
              <tr style={{ background: BG }}>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Xét xử lại</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Đối với hình phạt</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tên</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tội danh</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt chính</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt bổ sung</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt tổng hợp</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Tội danh</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt chính</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt bổ sung</th>
                <th style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Hình phạt tổng hợp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...TD, textAlign: "center" as const, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>1</td>
                <td style={{ ...TD, textAlign: "center" as const, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}><input type="checkbox" /></td>
                <td style={{ ...TD, textAlign: "center" as const, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}><input type="checkbox" /></td>
                <td style={{ ...TD, fontWeight: 600, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>Trần Phi Hùng</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>
                  <div>• <strong>Tội che giấu tội phạm – Tội danh chính</strong></div>
                </td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Từ có thời hạn – 15 năm 6 tháng</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Phạt tiền, khi không áp dụng hình phạt là phạt chính – 2.000.000 VNĐ</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Từ có thời hạn – 15 năm 6 tháng: Phạt tiền, khi không áp dụng hình phạt là phạt chính – 2.000.000 VNĐ</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>
                  <div>• <strong>Tội che giấu tội phạm – Tội danh chính</strong></div>
                </td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Từ có thời hạn – 15 năm 6 tháng</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Phạt tiền, khi không áp dụng hình phạt là phạt chính – 2.000.000 VNĐ</td>
                <td style={{ ...TD, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, fontSize: 11 }}>Từ có thời hạn – 15 năm 6 tháng: Phạt tiền, khi không áp dụng hình phạt là phạt chính – 2.000.000 VNĐ</td>
                <td style={{ ...TD, textAlign: "center" as const, borderBottom: `1px solid ${BORDER}` }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 12, fontFamily: F, display: "flex", alignItems: "center", gap: 3 }}><Pencil size={12} /> Sửa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Xử lý vật chứng */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${BORDER}`, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Xử lý vật chứng</span>
          <button style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>+ Thêm mới</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: BG }}>
              {["STT", "Tên vật chứng, đồ vật, tài liệu", "Số lượng", "Tình trạng", "Thuộc sở hữu của", "Mô tả", "Nơi lưu giữ", "Hình thức xử lý", "Trả lại cho", "Thao tác"].map(h => (
                <th key={h} style={{ ...TH, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vatChung.length === 0 && (
              <tr><td colSpan={10} style={{ padding: 24, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F }}>Không có vật chứng</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Trách nhiệm dân sự */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${BORDER}`, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>Trách nhiệm dân sự</span>
          <button style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>+ Thêm quan hệ bồi thường</button>
        </div>
        <div style={{ padding: 32, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F, lineHeight: 1.8 }}>
          Chưa có mối quan hệ bồi thường nào. Nhấn "Thêm quan hệ bồi thường" để bắt đầu.
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, paddingBottom: 8 }}>
        <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Đóng</button>
        <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Lưu</button>
        <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Lấy số</button>
        <button style={{ padding: "7px 22px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>Trình ký</button>
        <button style={{ padding: "7px 22px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: F }}>Xem biểu mẫu</button>
      </div>
    </div>
  );
}

// ── Context menu ──────────────────────────────────────────────────────────────

function ContextMenu({ row, onClose, onXem }: { row: VuXetXuRow; onClose: () => void; onXem: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const item = (label: string, color: string, cb: () => void) => (
    <button key={label} onClick={() => { cb(); onClose(); }}
      style={{ display: "block", width: "100%", textAlign: "left" as const, padding: "8px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: F, color }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
    >{label}</button>
  );

  return (
    <div ref={ref} style={{ position: "absolute", right: 0, top: "100%", zIndex: 300, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", minWidth: 200, overflow: "hidden" }}>
      {item("👁 Xem chi tiết", TEXT, onXem)}
      {item("📅 Lịch xét xử", TEXT, () => { })}
      {item("📋 Biên bản xét xử", TEXT, () => { })}
      {item("📄 Bản án", TEXT, () => { })}
      {(row.trangThai === "chua-xx-chua-ds" || row.trangThai === "chua-xx-da-ds" || row.trangThai === "chua-thu-ly") && item("✏️ Chỉnh sửa", TEXT, onXem)}
      {(row.trangThai === "chua-xx-chua-ds" || row.trangThai === "chua-thu-ly") && item("🗑️ Xóa", "#ef4444", () => { })}
    </div>
  );
}

// ── Thêm vụ xét xử modal ─────────────────────────────────────────────────────

function HDXXDropdownSelectorPopover({
  soThuLy,
  chuToaName,
  initialSelected,
  onClose,
  onSave,
}: {
  soThuLy: string;
  chuToaName: string;
  initialSelected: string[];
  onClose: () => void;
  onSave: (selected: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([...initialSelected]);
  const [search, setSearch] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  const filteredJudges = DANH_SACH_THAM_PHAN.filter(
    j =>
      j.ten.toLowerCase().includes(search.toLowerCase()) ||
      j.chucVu.toLowerCase().includes(search.toLowerCase()) ||
      j.donVi.toLowerCase().includes(search.toLowerCase())
  );

  const allNonPresidingJudges = DANH_SACH_THAM_PHAN.filter(j => j.ten !== chuToaName);
  const isAllSelected = allNonPresidingJudges.length > 0 && allNonPresidingJudges.every(j => selected.includes(j.ten));

  const toggleAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      const namesToAdd = allNonPresidingJudges.map(j => j.ten);
      setSelected(namesToAdd);
    }
  };

  const selectPreset5 = () => {
    const preset4 = allNonPresidingJudges.slice(0, 4).map(j => j.ten);
    setSelected(preset4);
  };

  const toggleOne = (name: string) => {
    if (name === chuToaName) return; // Presiding judge is fixed
    setSelected(prev => (prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]));
  };

  return (
    <div
      ref={popoverRef}
      style={{
        position: "absolute",
        top: "100%",
        right: 0,
        marginTop: 4,
        width: 380,
        zIndex: 1500,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 12px 36px rgba(0,0,0,0.22)",
        border: "1px solid #cbd5e1",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: F,
        textAlign: "left" as const,
      }}
    >
      {/* Header Dropdown */}
      <div style={{ padding: "10px 12px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>
          Chọn Thẩm phán thành viên HĐXX
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Quick Mode Controls */}
      <div style={{ padding: "8px 12px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            type="button"
            onClick={toggleAll}
            style={{
              flex: 1,
              padding: "6px 10px",
              background: isAllSelected ? "#dbeafe" : "#fff",
              border: `1px solid ${isAllSelected ? "#2563eb" : BORDER}`,
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              color: isAllSelected ? "#1e40af" : TEXT,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
            }}
          >
            🏛️ Chọn tất cả (Hội đồng toàn thể)
          </button>
          <button
            type="button"
            onClick={() => setSelected(allNonPresidingJudges.slice(0, 4).map(j => j.ten))}
            style={{
              padding: "6px 10px",
              background: selected.length === 4 ? "#eff6ff" : "#fff",
              border: `1px solid ${selected.length === 4 ? "#2563eb" : BORDER}`,
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              color: selected.length === 4 ? "#1e40af" : TEXT,
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
            }}
          >
            HĐ 5 thẩm phán
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 10, fontFamily: F }}>
          <span style={{ color: isAllSelected ? "#15803d" : "#1e40af", fontWeight: 700 }}>
            {isAllSelected ? "✓ Hội đồng toàn thể (Chủ tọa: Chánh án TANDTC)" : selected.length === 4 ? "✓ Hội đồng 5 thẩm phán" : `Đã chọn: ${selected.length} thành viên`}
          </span>
          <span style={{ color: MUTED }}>Tổng: {selected.length + 1} Thẩm phán</span>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ padding: "6px 12px", background: "#f9fafb", borderBottom: `1px solid ${BORDER}` }}>
        <input
          placeholder="Tìm tên Thẩm phán..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "5px 8px", fontSize: 11, border: `1px solid ${BORDER}`, borderRadius: 4, outline: "none", fontFamily: F, boxSizing: "border-box" }}
        />
      </div>

      {/* Judges checklist */}
      <div style={{ maxHeight: 210, overflowY: "auto", padding: "6px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {filteredJudges.map(j => {
          const isPresiding = j.ten === chuToaName;
          const isChecked = selected.includes(j.ten);
          const isDisabled = isPresiding;
          return (
            <div
              key={j.id}
              onClick={() => {
                if (!isDisabled) toggleOne(j.ten);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 8px",
                borderRadius: 4,
                border: `1px solid ${isPresiding ? "#fde68a" : isChecked ? "#bfdbfe" : "#f1f5f9"}`,
                background: isPresiding ? "#fffbeb" : isChecked ? "#eff6ff" : "#fff",
                cursor: isDisabled ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <input
                type="checkbox"
                checked={isChecked || isPresiding}
                disabled={isDisabled}
                onChange={() => { }}
                style={{ cursor: isDisabled ? "not-allowed" : "pointer", width: 14, height: 14, accentColor: isPresiding ? "#92400e" : "#2563eb" }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: isChecked ? 700 : 500, color: isPresiding ? "#92400e" : isChecked ? "#1e40af" : TEXT }}>
                    {j.ten}
                  </span>
                  {isPresiding && (
                    <span style={{ fontSize: 9, padding: "0 4px", background: "#fef3c7", color: "#92400e", borderRadius: 2, fontWeight: 700 }}>
                      CHỦ TỌA
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {j.chucVu}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: "8px 12px", background: "#fafafa", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={() => setSelected([])}
          style={{ background: "none", border: "none", color: RED, cursor: "pointer", fontSize: 11, padding: 0 }}
        >
          Xóa tất cả ({selected.length})
        </button>
        <button
          onClick={() => {
            onSave(selected);
            onClose();
          }}
          style={{ padding: "5px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
        >
          Áp dụng ({selected.length} TV)
        </button>
      </div>
    </div>
  );
}

function ChonThanhVienHDXXDialog({
  soThuLy,
  tenVuAn,
  chuToaName,
  initialSelected,
  onClose,
  onSave,
}: {
  soThuLy: string;
  tenVuAn?: string;
  chuToaName?: string;
  initialSelected: string[];
  onClose: () => void;
  onSave: (selected: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([...initialSelected]);
  const [search, setSearch] = useState("");

  const filteredJudges = DANH_SACH_THAM_PHAN.filter(
    j =>
      j.ten.toLowerCase().includes(search.toLowerCase()) ||
      j.chucVu.toLowerCase().includes(search.toLowerCase()) ||
      j.donVi.toLowerCase().includes(search.toLowerCase())
  );

  // List of candidate judges excluding presiding judge
  const allNonPresidingJudges = DANH_SACH_THAM_PHAN.filter(j => j.ten !== chuToaName);
  const nonPresidingJudges = filteredJudges.filter(j => j.ten !== chuToaName);
  const isAllSelected = allNonPresidingJudges.length > 0 && allNonPresidingJudges.every(j => selected.includes(j.ten));

  const toggleAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      const namesToAdd = allNonPresidingJudges.map(j => j.ten);
      setSelected(namesToAdd);
    }
  };

  const toggleOne = (name: string) => {
    if (name === chuToaName) return; // Presiding judge is fixed as Presiding
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const selectPreset = (count: number) => {
    const presetNames = DANH_SACH_THAM_PHAN
      .filter(j => j.ten !== chuToaName)
      .slice(0, count)
      .map(j => j.ten);
    setSelected(presetNames);
  };

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div style={{ background: "#fff", borderRadius: 10, width: "90vw", maxWidth: 960, maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 16px 50px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, background: "#fafafa", flexShrink: 0 }}>
          <span style={{ fontSize: 18 }}>⚖</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>
              Chọn Thẩm phán thành viên Hội đồng xét xử
            </div>
            <div style={{ fontSize: 12, color: MUTED, fontFamily: F, marginTop: 2 }}>
              Vụ án: Số thụ lý <b style={{ color: "#2563eb" }}>{soThuLy}</b> {tenVuAn ? `– ${tenVuAn}` : ""}
              {chuToaName && (
                <span style={{ marginLeft: 10, color: "#92400e", background: "#fef3c7", border: "1px solid #fde68a", padding: "2px 8px", borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
                  Chủ tọa phiên tòa: {chuToaName}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            title="Đóng cửa sổ"
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: RED,
              padding: 0,
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar: Search + Quick filters */}
        <div style={{ padding: "14px 22px", borderBottom: `1px solid ${BORDER}`, background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                placeholder="Tìm kiếm theo tên thẩm phán, chức vụ, đơn vị công tác..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "8px 12px 8px 34px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 5, fontFamily: F, outline: "none", boxSizing: "border-box" }}
              />
              <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: MUTED }} />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleAll}
                  style={{ cursor: "pointer", width: 16, height: 16, accentColor: RED }}
                />
                <span>{isAllSelected ? "Bỏ chọn tất cả" : "Chọn toàn bộ Thẩm phán"} ({nonPresidingJudges.length})</span>
              </label>
              {selected.length > 0 && (
                <button onClick={() => setSelected([])} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: RED, fontFamily: F, textDecoration: "underline", padding: 0 }}>
                  Xóa tất cả lựa chọn ({selected.length})
                </button>
              )}
            </div>

            {/* Quick presets */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: MUTED, fontFamily: F, fontWeight: 500 }}>Mẫu chuẩn nhanh:</span>
              <button
                onClick={() => selectPreset(4)}
                style={{ padding: "4px 12px", background: selected.length === 4 ? "#fee2e2" : "#fff", border: `1px solid ${selected.length === 4 ? RED : BORDER}`, borderRadius: 4, fontSize: 12, fontFamily: F, color: selected.length === 4 ? RED : TEXT, cursor: "pointer", fontWeight: selected.length === 4 ? 700 : 500 }}
                title="Hội đồng 5 thẩm phán: 4 thành viên + 1 chủ tọa = 5 thẩm phán"
              >
                HĐ 5 thẩm phán
              </button>
              <button
                onClick={() => selectPreset(DANH_SACH_THAM_PHAN.length)}
                style={{ padding: "4px 12px", background: selected.length >= DANH_SACH_THAM_PHAN.length - 1 ? "#fee2e2" : "#fff", border: `1px solid ${selected.length >= DANH_SACH_THAM_PHAN.length - 1 ? RED : BORDER}`, borderRadius: 4, fontSize: 12, fontFamily: F, color: selected.length >= DANH_SACH_THAM_PHAN.length - 1 ? RED : TEXT, cursor: "pointer", fontWeight: selected.length >= DANH_SACH_THAM_PHAN.length - 1 ? 700 : 500 }}
              >
                HĐ Toàn thể Thẩm phán TANDTC
              </button>
            </div>
          </div>
        </div>

        {/* Selected count info banner */}
        <div style={{ padding: "10px 22px", background: selected.length === 4 || selected.length >= DANH_SACH_THAM_PHAN.length - 1 ? "#f0fdf4" : "#eff6ff", borderBottom: `1px solid ${selected.length === 4 || selected.length >= DANH_SACH_THAM_PHAN.length - 1 ? "#bbf7d0" : "#bfdbfe"}`, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, fontFamily: F, color: selected.length === 4 || selected.length >= DANH_SACH_THAM_PHAN.length - 1 ? "#166534" : "#1e40af" }}>
          <span>Đang chọn: <b>{selected.length}</b> Thẩm phán thành viên {chuToaName ? `(+ 1 Chủ tọa ${chuToaName} = ${selected.length + 1} Thẩm phán)` : ""}</span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>
            {selected.length === 0
              ? "Chưa chọn thẩm phán thành viên nào"
              : selected.length === 4
                ? "✓ Đạt chuẩn Hội đồng 5 thẩm phán"
                : selected.length >= DANH_SACH_THAM_PHAN.length - 1
                  ? "✓ Đạt chuẩn Hội đồng Toàn thể Thẩm phán TANDTC"
                  : selected.length < 4
                    ? `Cần chọn đủ 4 thành viên (hiện có ${selected.length})`
                    : `Hội đồng Thẩm phán`}
          </span>
        </div>

        {/* Judges List in 2 columns */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignContent: "start" }}>
          {filteredJudges.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "32px 0", color: MUTED, fontSize: 13, fontFamily: F }}>
              Không tìm thấy thẩm phán phù hợp với từ khóa &ldquo;{search}&rdquo;
            </div>
          ) : (
            filteredJudges.map(j => {
              const isPresiding = j.ten === chuToaName;
              const isChecked = selected.includes(j.ten);
              return (
                <div
                  key={j.id}
                  onClick={() => toggleOne(j.ten)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: 6,
                    border: `1px solid ${isPresiding ? "#fde68a" : isChecked ? "#93c5fd" : BORDER}`,
                    background: isPresiding ? "#fffbeb" : isChecked ? "#eff6ff" : "#fff",
                    cursor: isPresiding ? "default" : "pointer",
                    opacity: isPresiding ? 0.9 : 1,
                    transition: "all 0.15s ease",
                    boxShadow: isChecked ? "0 2px 6px rgba(37,99,235,0.08)" : "none",
                  }}
                  onMouseEnter={e => {
                    if (!isChecked && !isPresiding) e.currentTarget.style.background = "#f9fafb";
                  }}
                  onMouseLeave={e => {
                    if (!isChecked && !isPresiding) e.currentTarget.style.background = "#fff";
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked || isPresiding}
                    disabled={isPresiding}
                    onChange={() => { }}
                    style={{ cursor: isPresiding ? "default" : "pointer", width: 16, height: 16, accentColor: isPresiding ? "#92400e" : "#2563eb" }}
                  />

                  {/* Judge avatar / icon */}
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: isPresiding ? "#f59e0b" : isChecked ? "#2563eb" : "#e5e7eb", color: isPresiding || isChecked ? "#fff" : TEXT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {j.ten.charAt(0)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: isPresiding ? "#92400e" : isChecked ? "#1e40af" : TEXT, fontFamily: F }}>
                        {j.ten}
                      </span>
                      {isPresiding && (
                        <span style={{ fontSize: 10, padding: "1px 6px", background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", borderRadius: 3, fontWeight: 700, fontFamily: F }}>
                          CHỦ TỌA (Đã có trong HĐ)
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: MUTED, fontFamily: F, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {j.chucVu} • <span style={{ color: "#4b5563" }}>{j.donVi}</span>
                    </div>
                  </div>

                  {!isPresiding && isChecked && (
                    <span style={{ fontSize: 10, padding: "2px 8px", background: "#2563eb", color: "#fff", borderRadius: 10, fontWeight: 600, fontFamily: F, whiteSpace: "nowrap" }}>
                      Đã chọn
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: `1px solid ${BORDER}`, background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
          <button
            onClick={onClose}
            style={{ padding: "8px 18px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 5, cursor: "pointer", fontSize: 13, fontFamily: F, fontWeight: 500 }}
          >
            Hủy bỏ
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: MUTED, fontFamily: F }}>
              Tổng Hội đồng: <b style={{ color: TEXT }}>{selected.length} thành viên + 1 chủ tọa = {selected.length + 1} Thẩm phán</b>
            </span>
            <button
              onClick={() => {
                onSave(selected);
                onClose();
              }}
              style={{ padding: "8px 24px", background: RED, color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F, boxShadow: "0 2px 8px rgba(185,28,28,0.25)" }}
            >
              Xác nhận ({selected.length} thành viên)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function XemBieuMauChuongTrinhWordModal({
  userRole = "hinh-su",
  rows = [],
  lichXXInfo,
  soVanBan,
  onClose,
}: {
  userRole?: string;
  rows?: any[];
  lichXXInfo?: { ngayXX: string; thu: string; gioXX: string; phongXX: string };
  soVanBan?: string;
  onClose: () => void;
}) {
  // Lọc dữ liệu theo đúng phân quyền vai trò được chọn
  const displayModalRows = rows.filter(r => {
    const isHinhSu = (r.soBA && r.soBA.includes("HS")) || (r.qhpl && (r.qhpl.includes("BLHS") || r.qhpl.includes("Tội"))) || (r.tenVuAn && (r.tenVuAn.includes("BLHS") || r.tenVuAn.includes("Tội")));
    const isDanSu = (r.soBA && r.soBA.includes("DS")) || (r.qhpl && r.qhpl.includes("hợp đồng")) || (r.tenVuAn && r.tenVuAn.includes("hợp đồng"));
    const isHanhChinh = (r.soBA && r.soBA.includes("HC")) || (r.qhpl && r.qhpl.includes("Khiếu kiện")) || (r.tenVuAn && r.tenVuAn.includes("Khiếu kiện"));

    if (userRole === "hinh-su") return isHinhSu;
    if (userRole === "dan-su") return isDanSu || (!isHinhSu && !isHanhChinh);
    if (userRole === "hanh-chinh") return isHanhChinh;
    return true;
  });

  // Tập hợp danh sách tất cả các Thẩm phán (Chủ tọa + Thành viên HĐXX) trong danh sách
  const allJudgesSet = new Set<string>();
  displayModalRows.forEach(r => {
    const chuToa = r.chuToa || r.tp;
    if (chuToa && chuToa !== "–") allJudgesSet.add(chuToa);
    if (r.hdxxThanhVien && Array.isArray(r.hdxxThanhVien)) {
      r.hdxxThanhVien.forEach((tv: string) => {
        if (tv && tv !== "–") allJudgesSet.add(tv);
      });
    }
  });
  const danhSachThanhVienHDXX = Array.from(allJudgesSet).length > 0
    ? Array.from(allJudgesSet).join(", ")
    : "Trần Hồng Hà, Ngô Hồng Phúc, Lê Thanh Phong, Nguyễn Văn Cường, Lê Văn Minh";

  const workingTimeText = lichXXInfo
    ? `${lichXXInfo.thu} – Ngày ${lichXXInfo.ngayXX} (${lichXXInfo.gioXX})`
    : "Thứ Sáu – Ngày 05/6/2026 (buổi sáng từ 08h00 đến 12h00, buổi chiều từ 14h00 đến 17h30)";

  const getVuInfo = (role: string) => {
    if (role === "hinh-su") {
      return {
        headerTitle: "VỤ GIÁM ĐỐC, KIỂM TRA I",
        subTitle: "Vụ Giám đốc, kiểm tra I",
        loaiAn: "Hình sự",
        hauTo: "Vụ GĐKT I",
      };
    }
    if (role === "dan-su") {
      return {
        headerTitle: "VỤ GIÁM ĐỐC, KIỂM TRA II",
        subTitle: "Vụ Giám đốc, kiểm tra II",
        loaiAn: "Dân sự",
        hauTo: "Vụ GĐKT II",
      };
    }
    if (role === "hanh-chinh") {
      return {
        headerTitle: "VỤ GIÁM ĐỐC, KIỂM TRA IV",
        subTitle: "Vụ Giám đốc, kiểm tra IV",
        loaiAn: "Hành chính",
        hauTo: "Vụ GĐKT IV",
      };
    }
    return {
      headerTitle: "VỤ GIÁM ĐỐC, KIỂM TRA",
      subTitle: "các Vụ Giám đốc, kiểm tra",
      loaiAn: "Hình sự, Dân sự và Hành chính",
      hauTo: "Vụ GĐKT",
    };
  };

  const vuInfo = getVuInfo(userRole);

  const exportToWord = () => {
    const content = document.getElementById("word-doc-preview-area")?.innerHTML;
    if (!content) return;

    const htmlDoc = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Chương trình làm việc HĐXX</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; color: #000; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #000; padding: 6px 8px; font-size: 11pt; text-align: left; vertical-align: top; }
          th { font-weight: bold; background-color: #f2f2f2; text-align: center; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlDoc], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chuong_Trinh_Lam_Viec_HDXX_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1400, display: "flex", flexDirection: "column" }}>
      {/* Top bar (Word style) */}
      <div style={{ background: "#1e3a5f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 44, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
            <X size={18} />
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: F }}>
            📄 Biểu mẫu: Chương trình làm việc Hội đồng xét xử năm Thẩm phán TANDTC ({vuInfo.loaiAn})
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={exportToWord}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
          >
            <Printer size={14} /> Tải file Word (.docx)
          </button>
          <button
            onClick={() => window.print()}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
          >
            🖨️ In văn bản
          </button>
          <button
            onClick={onClose}
            style={{ padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Ribbon toolbar mock */}
      <div style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, padding: "6px 20px", display: "flex", alignItems: "center", gap: 12, fontSize: 12, fontFamily: F, flexShrink: 0 }}>
        <span style={{ fontWeight: 700, color: "#1e40af" }}>Times New Roman</span>
        <span style={{ color: MUTED }}>|</span>
        <span>Cỡ chữ: <b>13pt</b></span>
        <span style={{ color: MUTED }}>|</span>
        <span style={{ color: "#166534", fontWeight: 600 }}>✓ Định dạng chuẩn văn bản TANDTC</span>
      </div>

      {/* A4 Paper Container */}
      <div style={{ flex: 1, overflowY: "auto", background: "#e2e8f0", padding: "30px 20px", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            background: "#fff",
            width: "210mm",
            minHeight: "297mm",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            padding: "25mm 20mm",
            boxSizing: "border-box",
            fontFamily: "'Times New Roman', Times, serif",
            color: "#000",
            lineHeight: 1.4,
          }}
        >
          <div id="word-doc-preview-area">
            {/* Header 2 columns */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
              <tbody>
                <tr>
                  <td style={{ width: "45%", textAlign: "center", verticalAlign: "top", border: "none" }}>
                    <div style={{ fontWeight: "bold", fontSize: 13, textTransform: "uppercase" }}>TÒA ÁN NHÂN DÂN TỐI CAO</div>
                    <div style={{ fontSize: 12, marginTop: 4, fontWeight: "bold" }}>{vuInfo.headerTitle}</div>
                    <div style={{ fontSize: 11, marginTop: 3 }}>Số: {soVanBan ? <b>{soVanBan}/2026/{vuInfo.hauTo}</b> : `......./2026/${vuInfo.hauTo}`}</div>
                    <div style={{ borderBottom: "1px solid #000", width: 120, margin: "6px auto 0" }} />
                  </td>
                  <td style={{ width: "55%", textAlign: "center", verticalAlign: "top", border: "none" }}>
                    <div style={{ fontWeight: "bold", fontSize: 13, textTransform: "uppercase" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div style={{ fontWeight: "bold", fontSize: 13 }}>Độc lập - Tự do - Hạnh phúc</div>
                    <div style={{ borderBottom: "1px solid #000", width: 160, margin: "6px auto 0" }} />
                    <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 8 }}>Hà Nội, ngày 05 tháng 06 năm 2026</div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Document Title */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontWeight: "bold", fontSize: 15, textTransform: "uppercase", marginBottom: 4 }}>
                CHƯƠNG TRÌNH LÀM VIỆC
              </div>
              <div style={{ fontWeight: "bold", fontSize: 14, textTransform: "uppercase", marginBottom: 6 }}>
                CỦA HỘI ĐỒNG XÉT XỬ GỒM NĂM THẨM PHÁN TÒA ÁN NHÂN DÂN TỐI CAO
              </div>
              <div style={{ fontSize: 13, fontWeight: "bold", marginBottom: 6 }}>
                Xét xử các vụ án {vuInfo.loaiAn} do {vuInfo.subTitle} trình
              </div>
              <div style={{ fontSize: 12, fontStyle: "italic", marginBottom: 4 }}>
                Hội đồng xét xử gồm các Thẩm phán: <b>{danhSachThanhVienHDXX}</b>
              </div>
              <div style={{ fontSize: 12, fontStyle: "italic" }}>
                Thời gian làm việc: <b>{workingTimeText}</b>
              </div>
            </div>

            {/* Table - khớp với bảng bên ngoài, không có cột Thẩm phán thành viên HĐXX */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, border: "1px solid #000" }}>
              <thead>
                <tr style={{ background: "#f2f2f2" }}>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: "5%", fontWeight: "bold" }}>STT</th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: userRole === "hinh-su" ? "22%" : "18%", fontWeight: "bold" }}>
                    Thông tin bản án/ Tòa án xét xử
                  </th>
                  {userRole !== "hinh-su" && (
                    <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: "20%", fontWeight: "bold" }}>
                      Quan hệ pháp luật
                    </th>
                  )}
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: userRole === "hinh-su" ? "18%" : "15%", fontWeight: "bold" }}>
                    {userRole === "hinh-su" ? "Người khiếu nại" : "Người khởi kiện"}
                  </th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: userRole === "hinh-su" ? "18%" : "15%", fontWeight: "bold" }}>
                    {userRole === "hinh-su" ? "Bị cáo" : "Người bị kiện"}
                  </th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: "18%", fontWeight: "bold" }}>
                    Kháng nghị
                  </th>
                  <th style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", width: "15%", fontWeight: "bold" }}>
                    Thẩm phán Chủ tọa phiên tòa
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayModalRows.length === 0 ? (
                  <tr>
                    <td colSpan={userRole === "hinh-su" ? 6 : 7} style={{ border: "1px solid #000", padding: 20, textAlign: "center", fontStyle: "italic" }}>
                      Không có vụ án nào trong chương trình làm việc
                    </td>
                  </tr>
                ) : (
                  displayModalRows.map((r, i) => (
                    <tr key={i}>
                      <td style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", fontWeight: "bold" }}>{i + 1}</td>
                      <td style={{ border: "1px solid #000", padding: "6px 6px" }}>
                        <div><b>Số BA: {formatSoBA(r.soBA)}</b></div>
                        <div>Ngày: {r.ngayBA}</div>
                        <div style={{ color: "#444" }}>Tại: {r.tai || r.toa}</div>
                      </td>
                      {userRole !== "hinh-su" && (
                        <td style={{ border: "1px solid #000", padding: "6px 6px" }}>{r.qhpl || r.tenVuAn}</td>
                      )}
                      <td style={{ border: "1px solid #000", padding: "6px 6px" }}>{r.nguoiKhoiKien || r.ndkn}</td>
                      <td style={{ border: "1px solid #000", padding: "6px 6px" }}>{r.nguoiBiKien || r.biCao || r.ndd}</td>
                      <td style={{ border: "1px solid #000", padding: "6px 6px" }}>
                        <div>Số KN: <b>{r.soKhangNghi || r.soKN || "28/QĐ-VKSTC-V1"}</b></div>
                        <div>Ngày: {r.ngayKhangNghi || r.ngayKN || "27/07/2026"}</div>
                        {(r.nguoiKhangNghi || r.loaiKhangNghi) && <div style={{ color: "#444" }}>{r.nguoiKhangNghi || r.loaiKhangNghi}</div>}
                      </td>
                      <td style={{ border: "1px solid #000", padding: "6px 6px", textAlign: "center", fontWeight: "bold" }}>{r.chuToa || r.tp || "–"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


function ChonLichXetXuDialog({
  initialLich,
  onSave,
  onClose,
}: {
  initialLich: { ngayXX: string; thu: string; gioXX: string; phongXX: string };
  onSave: (lich: { ngayXX: string; thu: string; gioXX: string; phongXX: string }) => void;
  onClose: () => void;
}) {
  const [ngay, setNgay] = useState(initialLich.ngayXX || "05/06/2026");
  const [thu, setThu] = useState(initialLich.thu || "Thứ Sáu");
  const [gio, setGio] = useState(initialLich.gioXX || "Buổi sáng từ 08h00 đến 12h00, buổi chiều từ 14h00 đến 17h30");
  const [phong, setPhong] = useState(initialLich.phongXX || "Phòng xét xử số 1");

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div style={{ background: "#fff", borderRadius: 8, width: 480, maxWidth: "90vw", padding: "20px 24px", boxShadow: "0 12px 32px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}`, paddingBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={18} color="#2563eb" />
            <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>
              Chọn Lịch & Địa điểm xét xử
            </span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Thứ & Ngày xét xử */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Thứ:</label>
              <select value={thu} onChange={e => setThu(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F }}>
                <option value="Thứ Hai">Thứ Hai</option>
                <option value="Thứ Ba">Thứ Ba</option>
                <option value="Thứ Tư">Thứ Tư</option>
                <option value="Thứ Năm">Thứ Năm</option>
                <option value="Thứ Sáu">Thứ Sáu</option>
                <option value="Thứ Bảy">Thứ Bảy</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Ngày xét xử (dd/mm/yyyy):</label>
              <input type="text" value={ngay} onChange={e => setNgay(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, boxSizing: "border-box" as const }} placeholder="05/06/2026" />
            </div>
          </div>

          {/* Phòng xét xử */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Phòng xét xử:</label>
            <select value={phong} onChange={e => setPhong(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F }}>
              <option value="Phòng xét xử số 1">Phòng xét xử số 1 (Tầng 1 – Trụ sở TANDTC)</option>
              <option value="Phòng xét xử số 2">Phòng xét xử số 2 (Tầng 2 – Trụ sở TANDTC)</option>
              <option value="Phòng xét xử số 3 (Hội trường lớn)">Phòng xét xử số 3 (Hội trường lớn TANDTC)</option>
              <option value="Phòng xét xử trực tuyến số 1">Phòng xét xử trực tuyến số 1</option>
            </select>
          </div>

          {/* Ca / Giờ xét xử */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F, display: "block", marginBottom: 4 }}>Khung giờ / Ca xét xử:</label>
            <select value={gio} onChange={e => setGio(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F }}>
              <option value="Buổi sáng từ 08h00 đến 12h00, buổi chiều từ 14h00 đến 17h30">Cả ngày (Sáng từ 08h00 – 12h00 & Chiều từ 14h00 – 17h30)</option>
              <option value="Buổi sáng từ 08h00 đến 12h00">Ca Sáng (08h00 – 12h00)</option>
              <option value="Buổi chiều từ 14h00 đến 17h30">Ca Chiều (14h00 – 17h30)</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
          <button onClick={onClose} style={{ padding: "7px 16px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>Hủy bỏ</button>
          <button onClick={() => { onSave({ ngayXX: ngay, thu, gioXX: gio, phongXX: phong }); onClose(); }} style={{ padding: "7px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>Lưu lịch xét xử</button>
        </div>
      </div>
    </div>
  );
}

function PopupTrinhKyXetXuModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [nguoiDuocTrinh, setNguoiDuocTrinh] = useState("Lê Thị Thu Hiển – Chánh án TAND tối cao");
  const [mucDoUuTien, setMucDoUuTien] = useState<"binh-thuong" | "cao" | "thuong-khan">("binh-thuong");
  const [noiDungTrinh, setNoiDungTrinh] = useState("Kính trình Lãnh đạo xem xét, phê duyệt danh sách các vụ án đưa ra xét xử.");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 1600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          width: 520,
          maxWidth: "95vw",
          padding: "20px 24px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          fontFamily: F,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}`, paddingBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Send size={18} color={RED} />
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>
              Trình ký danh sách vụ xét xử
            </span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ padding: "30px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#166534", marginBottom: 6 }}>
              Trình ký thành công!
            </div>
            <div style={{ fontSize: 12, color: MUTED }}>
              Danh sách vụ xét xử đã được gửi đến <b>{nguoiDuocTrinh}</b>.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Người được trình */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                Người được trình <span style={{ color: RED }}>*</span>
              </label>
              <select
                value={nguoiDuocTrinh}
                onChange={e => setNguoiDuocTrinh(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: 12,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  fontFamily: F,
                  outline: "none",
                  background: "#fff",
                  color: TEXT,
                  fontWeight: 500,
                  boxSizing: "border-box" as const,
                }}
              >
                <option value="Lê Thị Thu Hiển – Chánh án TAND tối cao">Lê Thị Thu Hiển – Chánh án TAND tối cao</option>
                <option value="Nguyễn Như Thắng – Vụ trưởng Vụ GĐKT I">Nguyễn Như Thắng – Vụ trưởng Vụ GĐKT I</option>
                <option value="Hoàng Văn Hòa – Phó Vụ trưởng Vụ GĐKT I">Hoàng Văn Hòa – Phó Vụ trưởng Vụ GĐKT I</option>
                <option value="Trần Thị Hoa – Phó Vụ trưởng Vụ GĐKT II">Trần Thị Hoa – Phó Vụ trưởng Vụ GĐKT II</option>
                <option value="Nguyễn Biên Thùy – Thẩm phán TANDTC">Nguyễn Biên Thùy – Thẩm phán TANDTC</option>
                <option value="Tổ Thẩm phán / Hội đồng Thẩm phán TANDTC">Tổ Thẩm phán / Hội đồng Thẩm phán TANDTC</option>
              </select>
            </div>

            {/* Mức độ ưu tiên */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                Mức độ ưu tiên <span style={{ color: RED }}>*</span>
              </label>
              <select
                value={mucDoUuTien}
                onChange={e => setMucDoUuTien(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: 12,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  fontFamily: F,
                  outline: "none",
                  background: "#fff",
                  color: TEXT,
                  fontWeight: 500,
                  boxSizing: "border-box" as const,
                  cursor: "pointer",
                }}
              >
                <option value="binh-thuong">🟢 Bình thường</option>
                <option value="cao">🟡 Khẩn / Cao</option>
                <option value="thuong-khan">🔴 Thượng khẩn</option>
              </select>
            </div>

            {/* Nội dung trình ký */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                Nội dung trình ký
              </label>
              <textarea
                rows={4}
                value={noiDungTrinh}
                onChange={e => setNoiDungTrinh(e.target.value)}
                placeholder="Nhập nội dung hoặc ghi chú trình ký..."
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: 12,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  fontFamily: F,
                  outline: "none",
                  boxSizing: "border-box" as const,
                  resize: "vertical" as const,
                  lineHeight: 1.5,
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "8px 18px",
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: F,
                  fontWeight: 500,
                  color: TEXT,
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  padding: "8px 24px",
                  background: RED,
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: F,
                  boxShadow: "0 2px 8px rgba(185,28,28,0.25)",
                }}
              >
                Gửi trình ký
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type ModalVuAnRow = {
  stt: number;
  maVuAn?: string;
  soThuLy: string;
  soBA: string;
  ngayBA: string;
  tai: string;
  toa?: string;
  qhpl: string;
  tenVuAn?: string;
  nguoiKhoiKien: string;
  ndkn?: string;
  nguoiBiKien: string;
  biCao?: string;
  ndd?: string;
  soKhangNghi: string;
  soKN?: string;
  ngayKhangNghi: string;
  ngayKN?: string;
  nguoiKhangNghi: string;
  loaiKhangNghi?: string;
  chuToa: string;
  tp?: string;
  chuToaChucVu: string;
  hdxxThanhVien: string[];
  hdxxTen: string;
};

const MODAL_ROWS: ModalVuAnRow[] = [
  // ── Hình sự ──
  {
    stt: 1,
    maVuAn: "VA26-002148",
    soThuLy: "54681978",
    soBA: "5469/2026/HS-ST",
    ngayBA: "03/07/2026",
    tai: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    qhpl: "Tội cố ý gây thương tích (BLHS)",
    nguoiKhoiKien: "Trần Văn Hải",
    nguoiBiKien: "Nguyễn Đơn Hải",
    soKhangNghi: "28/QĐ-VKSTC-V1",
    ngayKhangNghi: "27/07/2026",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Lê Thị Thu Hiển",
    chuToaChucVu: "Chánh án TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong"],
    hdxxTen: "Hội đồng 5 thẩm phán",
  },
  {
    stt: 2,
    maVuAn: "VA26-002012",
    soThuLy: "54681923",
    soBA: "54681139/2026/HS-PT",
    ngayBA: "03/07/2026",
    tai: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    qhpl: "Tội cố ý gây thương tích hoặc gây tổn hại cho sức khỏe",
    nguoiKhoiKien: "Phan Văn Hùng",
    nguoiBiKien: "Nguyễn Văn Đạt",
    soKhangNghi: "11/QĐ-VKSTC-V1",
    ngayKhangNghi: "11/11/2024",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Nguyễn Biên Thùy",
    chuToaChucVu: "Thẩm phán TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường"],
    hdxxTen: "Hội đồng 5 thẩm phán",
  },
  {
    stt: 3,
    maVuAn: "VA26-001201",
    soThuLy: "54681813",
    soBA: "18/2026/HS-ST",
    ngayBA: "08/07/2026",
    tai: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    qhpl: "Tham ô tài sản nhà nước đặc biệt nghiêm trọng",
    nguoiKhoiKien: "Đỗ Thành Công",
    nguoiBiKien: "Phan Kim Ngân",
    soKhangNghi: "05/QĐ-VKSTC-V1",
    ngayKhangNghi: "01/05/2026",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Lê Thị Thu Hiển",
    chuToaChucVu: "Chánh án TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường", "Lê Văn Minh", "Phạm Văn Nam"],
    hdxxTen: "Hội đồng toàn thể",
  },
  // ── Dân sự ──
  {
    stt: 4,
    maVuAn: "VA26-001543",
    soThuLy: "54681543",
    soBA: "21/2026/DS-ST",
    ngayBA: "03/07/2026",
    tai: "Tòa án nhân dân khu vực 5 – Bắc Ninh",
    qhpl: "Tranh chấp hợp đồng mua bán nhà ở và quyền sử dụng đất",
    nguoiKhoiKien: "Ngô Mai Trang",
    nguoiBiKien: "Phạm Văn Thành, Lê Thị Nhải",
    soKhangNghi: "15/QĐ-VKSTC-V2",
    ngayKhangNghi: "15/06/2026",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Nguyễn Như Thắng",
    chuToaChucVu: "Thẩm phán TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường"],
    hdxxTen: "Hội đồng 5 thẩm phán",
  },
  {
    stt: 5,
    maVuAn: "VA26-002300",
    soThuLy: "54682300",
    soBA: "77/2026/DS-PT",
    ngayBA: "28/06/2026",
    tai: "Tòa án nhân dân TP Đà Nẵng",
    qhpl: "Tranh chấp thừa kế tài sản và hủy GCN QSDĐ",
    nguoiKhoiKien: "Lê Văn Hùng",
    nguoiBiKien: "Lê Thị Hồng",
    soKhangNghi: "33/QĐ-VKSTC-V2",
    ngayKhangNghi: "05/07/2026",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Nguyễn Như Thắng",
    chuToaChucVu: "Thẩm phán TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Lê Thị Thu Hiển", "Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc"],
    hdxxTen: "Hội đồng 5 thẩm phán",
  },
  // ── Hành chính ──
  {
    stt: 6,
    maVuAn: "VA26-000654",
    soThuLy: "54681800",
    soBA: "0807/2026/HC-ST",
    ngayBA: "08/07/2025",
    tai: "Tòa án nhân dân quận Ninh Kiều",
    qhpl: "Khiếu kiện quyết định xử phạt VPHC trong quản lý đất đai",
    nguoiKhoiKien: "NGHIÊM THỊ XUÂN",
    nguoiBiKien: "ỦY BAN NHÂN DÂN QUẬN NINH KIỀU",
    soKhangNghi: "20/QĐ-VKSTC-V4",
    ngayKhangNghi: "20/03/2026",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Nguyễn Như Thắng",
    chuToaChucVu: "Thẩm phán TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Lê Thị Thu Hiển", "Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong", "Nguyễn Văn Cường", "Lê Văn Minh"],
    hdxxTen: "Hội đồng toàn thể",
  },
  {
    stt: 7,
    maVuAn: "VA26-002613",
    soThuLy: "54682613",
    soBA: "18/2026/HC-ST",
    ngayBA: "08/07/2026",
    tai: "Tòa án nhân dân cấp cao tại Hà Nội",
    qhpl: "Khiếu kiện quyết định thu hồi đất và cưỡng chế GPMB",
    nguoiKhoiKien: "Đỗ Thành Công",
    nguoiBiKien: "Ủy ban nhân dân tỉnh Bắc Ninh",
    soKhangNghi: "42/QĐ-VKSTC-V4",
    ngayKhangNghi: "09/07/2026",
    nguoiKhangNghi: "Viện trưởng VKSNDTC",
    chuToa: "Lê Thị Thu Hiển",
    chuToaChucVu: "Chánh án TAND tối cao (Hội đồng Thẩm phán TANDTC)",
    hdxxThanhVien: ["Nguyễn Biên Thùy", "Trần Hồng Hà", "Ngô Hồng Phúc", "Lê Thanh Phong"],
    hdxxTen: "Hội đồng 5 thẩm phán",
  },
];

function ThemVuXetXuModal({ userRole = "hinh-su", onClose }: { userRole?: string; onClose: () => void }) {
  const [rows, setRows] = useState(MODAL_ROWS);
  const [selectingRowKey, setSelectingRowKey] = useState<string | null>(null);
  const [showBieuMauWord, setShowBieuMauWord] = useState(false);
  const [showLichXXModal, setShowLichXXModal] = useState(false);
  const [showTrinhKyModal, setShowTrinhKyModal] = useState(false);
  const [hasSelectedLich, setHasSelectedLich] = useState(false);
  const [isCapSo, setIsCapSo] = useState(false);
  const [soVanBan, setSoVanBan] = useState("");
  const [lichXXInfo, setLichXXInfo] = useState({
    ngayXX: "05/06/2026",
    thu: "Thứ Sáu",
    gioXX: "Buổi sáng: 08h00 - 12h00; Buổi chiều: 14h00 - 17h30",
    phongXX: "Phòng xét xử số 1",
  });

  const getRowKey = (r: ModalVuAnRow) => r.maVuAn || r.soBA || String(r.stt);

  const displayRows = rows.filter(r => {
    const isHinhSu = r.soBA.includes("HS") || r.qhpl.includes("BLHS") || r.qhpl.includes("Tội");
    if (userRole === "hinh-su") return isHinhSu;
    if (userRole === "dan-su") return !isHinhSu;
    return true;
  });

  const TH: React.CSSProperties = { ...TH_STYLE, fontSize: 11, padding: "9px 12px", whiteSpace: "nowrap" as const };
  const TD: React.CSSProperties = { ...TD_STYLE, fontSize: 12, padding: "10px 12px", verticalAlign: "top" as const };

  const trangThaiBadge = (key: string) => {
    if (key === "chua-xx") return <span style={{ display: "inline-block", padding: "3px 8px", border: `1px solid #16a34a`, borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: F, color: "#16a34a", background: "#fff", whiteSpace: "nowrap" as const }}>CHƯA XÉT XỬ</span>;
    if (key === "da-xx") return <span style={{ display: "inline-block", padding: "3px 8px", border: `1px solid #16a34a`, borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: F, color: "#16a34a", background: "#fff", whiteSpace: "nowrap" as const }}>ĐÃ XÉT XỬ</span>;
    return <span style={{ display: "inline-block", padding: "3px 8px", border: `1px solid #2563eb`, borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: F, color: "#2563eb", background: "#eff6ff", whiteSpace: "nowrap" as const }}>RÚT KHÁNG NGHỊ</span>;
  };

  const btn = (label: string, bg: string, color: string, border: string, onClick?: () => void) => (
    <button onClick={onClick ?? onClose} style={{ padding: "7px 18px", background: bg, color, border: `1px solid ${border}`, borderRadius: 4, fontSize: 13, fontFamily: F, fontWeight: 500, cursor: "pointer" }}>
      {label}
    </button>
  );

  const CHANH_AN_NAME = "Lê Thị Thu Hiển";

  const getHDXXName = (memberCount: number) => {
    if (memberCount === 0) return "Chưa chọn HĐXX";
    if (memberCount === 4) return "Hội đồng 5 thẩm phán";
    if (memberCount >= DANH_SACH_THAM_PHAN.length - 1) return "Hội đồng toàn thể";
    return `Hội đồng ${memberCount + 1} thẩm phán`;
  };

  const updateJudgesForRow = (rowKey: string, newJudges: string[]) => {
    const isToanThe = newJudges.length >= DANH_SACH_THAM_PHAN.length - 1;
    const chanhAnObj = DANH_SACH_THAM_PHAN.find(j => j.ten === CHANH_AN_NAME) || { chucVu: "Chánh án TAND tối cao", donVi: "Hội đồng Thẩm phán TANDTC" };

    setRows(prev =>
      prev.map((r) => {
        if (getRowKey(r) !== rowKey) return r;

        // Nếu chọn Hội đồng toàn thể, Chủ tọa tự động đổi thành Chánh án TAND tối cao
        const targetChuToa = isToanThe ? CHANH_AN_NAME : r.chuToa;
        const targetChuToaChucVu = isToanThe ? `${chanhAnObj.chucVu} (${chanhAnObj.donVi})` : r.chuToaChucVu;

        let finalMembers = isToanThe
          ? DANH_SACH_THAM_PHAN.filter(j => j.ten !== CHANH_AN_NAME).map(j => j.ten)
          : newJudges.filter(name => name !== targetChuToa);

        return {
          ...r,
          chuToa: targetChuToa,
          chuToaChucVu: targetChuToaChucVu,
          hdxxThanhVien: finalMembers,
          hdxxTen: getHDXXName(finalMembers.length),
        };
      })
    );
  };

  const updateChuToaForRow = (rowKey: string, judgeName: string) => {
    const judgeObj = DANH_SACH_THAM_PHAN.find(j => j.ten === judgeName);
    setRows(prev =>
      prev.map((r) => {
        if (getRowKey(r) !== rowKey) return r;
        const updatedMembers = r.hdxxThanhVien.filter(name => name !== judgeName);
        return {
          ...r,
          chuToa: judgeName,
          chuToaChucVu: judgeObj ? `${judgeObj.chucVu} (${judgeObj.donVi})` : r.chuToaChucVu,
          hdxxThanhVien: updatedMembers,
          hdxxTen: getHDXXName(updatedMembers.length),
        };
      })
    );
  };

  const removeJudgeFromRow = (rowKey: string, judgeName: string) => {
    setRows(prev =>
      prev.map((r) => {
        if (getRowKey(r) !== rowKey) return r;
        const updated = r.hdxxThanhVien.filter(name => name !== judgeName);
        return {
          ...r,
          hdxxThanhVien: updated,
          hdxxTen: getHDXXName(updated.length),
        };
      })
    );
  };

  const removeRowFromList = (rowKey: string) => {
    setRows(prev => prev.filter(r => getRowKey(r) !== rowKey));
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 8, width: "95vw", maxWidth: 1280, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 18, color: RED }}>⚠</span>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: F }}>Danh sách vụ xét xử đã chọn</span>

          {/* Nút Chọn Lịch Xét Xử */}
          <button
            onClick={() => setShowLichXXModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: hasSelectedLich ? "#f0fdf4" : "#eff6ff",
              color: hasSelectedLich ? "#166534" : "#1e40af",
              border: `1px solid ${hasSelectedLich ? "#bbf7d0" : "#93c5fd"}`,
              borderRadius: 5,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: F,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <Calendar size={14} color={hasSelectedLich ? "#166534" : "#2563eb"} />
            {hasSelectedLich ? `✓ Đã chọn lịch: ${lichXXInfo.ngayXX}` : "Chọn lịch xét xử"}
          </button>

          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}><X size={18} /></button>
        </div>

        {/* Status bar Lịch xét xử & Cấp số */}
        {(hasSelectedLich || isCapSo) && (
          <div style={{ padding: "8px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexShrink: 0, fontSize: 12, fontFamily: F }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {hasSelectedLich && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 700, color: "#1e40af", background: "#dbeafe", padding: "2px 8px", borderRadius: 4, border: "1px solid #bfdbfe", fontSize: 11 }}>
                  📅 Lịch xét xử: {lichXXInfo.thu} – {lichXXInfo.ngayXX}
                </span>
              )}
              {hasSelectedLich && <span style={{ color: MUTED }}>•</span>}
              {hasSelectedLich && <span><b>Phòng:</b> {lichXXInfo.phongXX}</span>}
              {hasSelectedLich && <span style={{ color: MUTED }}>•</span>}
              {hasSelectedLich && <span style={{ color: "#475569" }}><b>Thời gian:</b> {lichXXInfo.gioXX}</span>}
              {isCapSo && (
                <>
                  {hasSelectedLich && <span style={{ color: MUTED }}>•</span>}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 700, color: "#166534", background: "#dcfce7", padding: "2px 8px", borderRadius: 4, border: "1px solid #86efac", fontSize: 11 }}>
                    📄 Đã cấp số văn bản: {soVanBan}/2026/Vụ GĐKT
                  </span>
                </>
              )}
            </div>
            {hasSelectedLich && (
              <button
                onClick={() => setShowLichXXModal(true)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#2563eb", fontFamily: F, fontWeight: 600, textDecoration: "underline", padding: 0 }}
              >
                Sửa lịch ✎
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200 }}>
            <thead>
              <tr>
                {userRole === "hinh-su"
                  ? ["STT", "Thông tin bản án/ Tòa án xét xử", "Người khiếu nại", "Bị cáo", "Kháng nghị", "Thẩm phán chủ tọa phiên tòa", "Thẩm phán Hội đồng xét xử", "Thao tác"].map(h => (<th key={h} style={TH}>{h}</th>))
                  : ["STT", "Thông tin bản án/ Tòa án xét xử", "Quan hệ pháp luật", "Người khởi kiện", "Người bị kiện", "Kháng nghị", "Thẩm phán chủ tọa phiên tòa", "Thẩm phán Hội đồng xét xử", "Thao tác"].map(h => (<th key={h} style={TH}>{h}</th>))
                }
              </tr>
            </thead>
            <tbody>
              {displayRows.length === 0 && (
                <tr>
                  <td colSpan={userRole === "hinh-su" ? 8 : 9} style={{ padding: 32, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F }}>
                    Không có vụ án nào trong danh sách
                  </td>
                </tr>
              )}
              {displayRows.map((r, i) => {
                const rowKey = getRowKey(r);
                return (
                  <tr key={rowKey} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: `1px solid ${BORDER}` }}>
                    {/* STT */}
                    <td style={{ ...TD, textAlign: "center" as const, fontWeight: 700, color: TEXT, fontSize: 12 }}>{i + 1}</td>

                    {/* Thông tin BA/QĐ */}
                    <td style={TD}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6 }}>
                        <div>Số BA: <b>{formatSoBA(r.soBA)}</b></div>
                        <div style={{ color: MUTED }}>Ngày: {r.ngayBA}</div>
                        <div style={{ color: MUTED }}>Tại: {r.tai}</div>
                      </div>
                    </td>

                    {/* Quan hệ pháp luật (chỉ hiện khi Dân sự / Hành chính) */}
                    {userRole !== "hinh-su" && (
                      <td style={TD}>
                        <div style={{ fontSize: 11, color: "#1e40af", fontWeight: 500, fontFamily: F, lineHeight: 1.6 }}>
                          {r.qhpl}
                        </div>
                      </td>
                    )}

                    {/* Người khởi kiện / Người khiếu nại */}
                    <td style={TD}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6 }}>
                        <div style={{ fontWeight: 600, color: TEXT }}>{r.nguoiKhoiKien}</div>
                      </div>
                    </td>

                    {/* Người bị kiện / Bị cáo */}
                    <td style={TD}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6 }}>
                        <div style={{ fontWeight: 600, color: TEXT }}>{r.nguoiBiKien}</div>
                      </div>
                    </td>

                    {/* Kháng nghị */}
                    <td style={TD}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6 }}>
                        <div>Số KN: <b style={{ color: TEXT }}>{r.soKhangNghi}</b></div>
                        <div>Ngày kháng nghị: <span style={{ color: TEXT }}>{r.ngayKhangNghi}</span></div>
                        <div>Người kháng nghị: <span style={{ color: TEXT }}>{r.nguoiKhangNghi}</span></div>
                      </div>
                    </td>

                    {/* Thẩm phán chủ tọa phiên tòa */}
                    <td style={TD}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6, minWidth: 180 }}>
                        <select
                          value={r.chuToa}
                          onChange={e => updateChuToaForRow(rowKey, e.target.value)}
                          style={{
                            width: "100%",
                            padding: "5px 8px",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#1e3a8a",
                            border: `1px solid #93c5fd`,
                            borderRadius: 4,
                            background: "#eff6ff",
                            fontFamily: F,
                            outline: "none",
                            cursor: "pointer",
                            boxSizing: "border-box" as const,
                            marginBottom: 3,
                          }}
                        >
                          {!DANH_SACH_THAM_PHAN.some(j => j.ten === r.chuToa) && (
                            <option value={r.chuToa}>{r.chuToa} (TP được phân công)</option>
                          )}
                          {DANH_SACH_THAM_PHAN.map(j => (
                            <option key={j.id} value={j.ten}>
                              {j.ten} – {j.chucVu}
                            </option>
                          ))}
                        </select>

                        <div style={{ fontSize: 10, color: MUTED, lineHeight: 1.3 }}>
                          {r.chuToaChucVu}
                        </div>
                      </div>
                    </td>

                    {/* Thẩm phán Hội đồng xét xử */}
                    <td style={{ ...TD, position: "relative" as const }}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6, minWidth: 200 }}>
                        <div style={{ marginBottom: 6, position: "relative" }}>
                          <button
                            onClick={() => setSelectingRowKey(selectingRowKey === rowKey ? null : rowKey)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                              padding: "5px 8px",
                              background: selectingRowKey === rowKey ? "#eff6ff" : "#fff",
                              color: "#1e3a8a",
                              border: `1px solid ${selectingRowKey === rowKey ? "#2563eb" : "#93c5fd"}`,
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 700,
                              fontFamily: F,
                              cursor: "pointer",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                              boxSizing: "border-box" as const,
                            }}
                          >
                            <span style={{ display: "flex", alignItems: "center", gap: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                              🏛️ {r.hdxxTen}
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                              <span style={{ fontSize: 10, padding: "1px 5px", background: "#dbeafe", color: "#1e40af", borderRadius: 3, fontWeight: 600 }}>
                                {(r.hdxxThanhVien || []).length} TV
                              </span>
                              <ChevronDown size={13} style={{ color: "#2563eb", transform: selectingRowKey === rowKey ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }} />
                            </div>
                          </button>

                          {selectingRowKey === rowKey && (
                            <HDXXDropdownSelectorPopover
                              soThuLy={r.soThuLy}
                              chuToaName={r.chuToa}
                              initialSelected={r.hdxxThanhVien || []}
                              onClose={() => setSelectingRowKey(null)}
                              onSave={selected => updateJudgesForRow(rowKey, selected)}
                            />
                          )}
                        </div>

                        {(!r.hdxxThanhVien || r.hdxxThanhVien.length === 0) ? (
                          <div style={{ fontSize: 11, color: MUTED, fontStyle: "italic", padding: "4px 0" }}>
                            Chưa chọn thành viên (Chủ tọa: {r.chuToa})
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {(r.hdxxThanhVien || []).map((tv, idx) => (
                              <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", padding: "2px 6px", borderRadius: 3, border: "1px solid #e2e8f0" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 4, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                                  <span style={{ color: MUTED, fontSize: 10 }}>•</span>
                                  <span style={{ fontWeight: 500, fontSize: 11 }}>{tv}</span>
                                </div>
                                <button
                                  title={`Xóa ${tv} khỏi Hội đồng`}
                                  onClick={() => removeJudgeFromRow(rowKey, tv)}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: "0 2px", fontSize: 13, lineHeight: 1, fontWeight: 700 }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = RED; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Thao tác xóa khỏi danh sách */}
                    <td style={{ ...TD, textAlign: "center" as const, verticalAlign: "middle" as const }}>
                      <button
                        title="Xóa vụ án khỏi danh sách trình ký"
                        onClick={() => removeRowFromList(rowKey)}
                        style={{
                          background: "#fef2f2",
                          color: RED,
                          border: `1px solid #fca5a5`,
                          borderRadius: 4,
                          padding: "4px 8px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: MUTED, fontFamily: F, flex: 1 }}>
            Đã chọn <b style={{ color: TEXT }}>{displayRows.length}</b> vụ án xét xử cho danh sách trình ký.
          </span>
          {btn("Đóng", "#fff", TEXT, BORDER, onClose)}
          {btn("Lưu", RED, "#fff", RED)}
          {isCapSo ? (
            <button
              onClick={() => {
                setIsCapSo(false);
                setSoVanBan("");
              }}
              style={{
                padding: "7px 16px",
                background: "#fff1f2",
                color: "#e11d48",
                border: "1px solid #fca5a5",
                borderRadius: 4,
                fontSize: 13,
                fontFamily: F,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              ✕ Hủy cấp số
            </button>
          ) : (
            <button
              onClick={() => {
                setIsCapSo(true);
                setSoVanBan("128");
              }}
              style={{
                padding: "7px 16px",
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                fontSize: 13,
                fontFamily: F,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Lấy số
            </button>
          )}
          {btn("Trình ký", RED, "#fff", RED, () => setShowTrinhKyModal(true))}
          {btn("Xem biểu mẫu", "#fff", TEXT, BORDER, () => setShowBieuMauWord(true))}
        </div>
      </div>
      {showBieuMauWord && <XemBieuMauChuongTrinhWordModal userRole={userRole} rows={displayRows} lichXXInfo={hasSelectedLich ? lichXXInfo : undefined} soVanBan={isCapSo ? (soVanBan || "128") : undefined} onClose={() => setShowBieuMauWord(false)} />}
      {showTrinhKyModal && <PopupTrinhKyXetXuModal onClose={() => setShowTrinhKyModal(false)} />}
    </div>
  );
}

// ── Main list view ────────────────────────────────────────────────────────────

export default function QuanLyVuXetXuView() {
  const [activeTab, setActiveTab] = useState("tat-ca");
  const [userRole, setUserRole] = useState<"hinh-su" | "dan-su" | "hanh-chinh" | "toan-bo">("hinh-su");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [detail, setDetail] = useState<VuXetXuRow | null>(null);
  const [showThemModal, setShowThemModal] = useState(false);
  const [showBieuMauMain, setShowBieuMauMain] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const inSt: React.CSSProperties = { padding: "5px 8px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box" as const };
  const selSt: React.CSSProperties = { ...inSt, cursor: "pointer" };

  const fld = (lbl: string, type: "input" | "select" = "input", ph = "") => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 120 }}>
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

  const filteredByRole = ROWS.filter(r => {
    const isHinhSu = r.loaiAn === "Hình sự" || r.soBA.includes("HS");
    const isHanhChinh = r.loaiAn === "Hành chính" || r.soBA.includes("HC") || r.tenVuAn.includes("Khiếu kiện");
    const isDanSu = (r.loaiAn === "Dân sự" || r.soBA.includes("DS")) && !isHinhSu && !isHanhChinh;

    if (userRole === "hinh-su") return isHinhSu;
    if (userRole === "dan-su") return isDanSu;
    if (userRole === "hanh-chinh") return isHanhChinh;
    return true;
  });

  const listTabs = [
    { id: "tat-ca", label: "Tất cả", count: filteredByRole.length },
    { id: "chua-xx-chua-ds", label: "Chưa có DS xét xử", count: filteredByRole.filter(r => r.trangThai === "chua-xx-chua-ds").length },
    { id: "chua-xx-da-ds", label: "Đã có DS xét xử", count: filteredByRole.filter(r => r.trangThai === "chua-xx-da-ds").length },
    { id: "chua-thu-ly", label: "Chưa thụ lý xét xử", count: filteredByRole.filter(r => r.trangThai === "chua-thu-ly").length },
    { id: "rut-khang-nghi", label: "Rút kháng nghị", count: filteredByRole.filter(r => r.trangThai === "rut-khang-nghi").length },
    { id: "da-xx", label: "Đã xét xử", count: filteredByRole.filter(r => r.trangThai === "da-xx").length },
    { id: "chuyen-tham-quyen", label: "Chuyển thẩm quyền", count: filteredByRole.filter(r => r.trangThai === "chuyen-tham-quyen").length },
  ];

  const filtered = filteredByRole.filter(r => {
    // 1. Lọc theo Tab trạng thái
    if (activeTab !== "tat-ca" && r.trangThai !== activeTab) return false;

    // 2. Lọc theo Tìm kiếm
    if (search && !r.tenVuAn.toLowerCase().includes(search.toLowerCase()) && !r.maVuAn.toLowerCase().includes(search.toLowerCase()) && !r.biCao.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (detail) return <ChiTietVuXetXuView row={detail} onBack={() => setDetail(null)} />;

  return (
    <>
      {showThemModal && <ThemVuXetXuModal userRole={userRole} onClose={() => setShowThemModal(false)} />}
      {showBieuMauMain && <XemBieuMauChuongTrinhWordModal userRole={userRole} rows={filtered} onClose={() => setShowBieuMauMain(false)} />}
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        {/* Breadcrumb */}
        <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, fontFamily: F, flexShrink: 0, background: "#fff" }}>
          Trang chủ › Quản lý GĐT/TT › Quản lý vụ xét xử GĐT › Danh sách
        </div>

        {/* Title + Phân quyền tài khoản + tabs */}
        <div style={{ background: "#fff", padding: "14px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: F, margin: 0 }}>Danh sách vụ xét xử GĐT</h2>

            {/* Phân quyền tài khoản Vụ chuyên môn */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px", background: "#f8fafc", border: `1px solid ${BORDER}`, borderRadius: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F }}>
                👤 Tài khoản phân quyền:
              </span>
              <select
                value={userRole}
                onChange={e => setUserRole(e.target.value as any)}
                style={{
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: F,
                  color: userRole === "hinh-su" ? RED : userRole === "dan-su" ? "#1e40af" : userRole === "hanh-chinh" ? "#c2410c" : "#047857",
                  border: `1px solid ${userRole === "hinh-su" ? "#fca5a5" : userRole === "dan-su" ? "#93c5fd" : userRole === "hanh-chinh" ? "#fdba74" : "#a7f3d0"}`,
                  borderRadius: 4,
                  background: "#fff",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="hinh-su">🔴 Vụ I - Vụ GĐKT về Hình sự (Án Hình sự)</option>
                <option value="dan-su">🔵 Vụ II - Vụ GĐKT về Dân sự (Án Dân sự)</option>
                <option value="hanh-chinh">🟠 Vụ IV - Vụ GĐKT về Hành chính (Án Hành chính)</option>
                <option value="toan-bo">🟣 Lãnh đạo TANDTC / Quản trị viên (Toàn bộ Vụ án)</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" as const, overflowX: "auto" as const }}>
            {listTabs.map(t => {
              const active = t.id === activeTab;
              return (
                <button key={t.id} onClick={() => { setActiveTab(t.id); setPage(1); }}
                  style={{ padding: "10px 16px", fontSize: 13, fontFamily: F, fontWeight: active ? 600 : 400, background: "none", border: "none", cursor: "pointer", color: active ? RED : MUTED, borderBottom: active ? `2px solid ${RED}` : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" as const }}>
                  {t.label}{" "}
                  <span style={{ padding: "1px 6px", borderRadius: 20, fontSize: 11, background: active ? RED : "#e5e7eb", color: active ? "#fff" : MUTED, fontWeight: 600 }}>{t.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginBottom: 10 }}>
            {fld("Số thụ lý", "input", "Nhập số thụ lý")}
            {fld("Mã vụ án / Tên vụ án", "input", "Nhập mã hoặc tên")}
            {fld(userRole === "hinh-su" ? "Người khiếu nại / Bị cáo" : "Đương sự / Bị cáo", "input", "Nhập tên")}
            {dateRange("Ngày thụ lý")}

            {fld("Hội đồng xét xử", "select")}
          </div>
          {filterExpanded && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginBottom: 10 }}>
              {dateRange("Ngày xét xử")}
              {fld("Phòng xét xử", "select")}
              {fld("Chủ tọa", "input", "Nhập tên chủ tọa")}
              {fld("Trạng thái", "select")}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <button onClick={() => setFilterExpanded(v => !v)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#2563eb", fontFamily: F, padding: 0, fontWeight: 500 }}>
              {filterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {filterExpanded ? "Thu gọn" : "Mở rộng"}
            </button>

            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", background: "#7f1d1d", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}>
                <Search size={13} /> Tìm kiếm
              </button>
              {/* <button
                onClick={() => setShowThemModal(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: F }}
              >
                + Tạo danh sách vụ xét xử
              </button> */}
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "#fff", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ flex: 1 }} />
          {/* <button onClick={() => setShowBieuMauMain(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#1e40af", border: `1px solid #93c5fd`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            <FileText size={13} /> Xem biểu mẫu Word
          </button> */}
          <button onClick={() => setShowThemModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>
            Tạo danh sách vụ xét xử
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", color: "#374151", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: F }}>
            <Printer size={13} /> Xuất Excel
          </button>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" as const }}>
            <colgroup>
              <col style={{ width: 36 }} />
              <col style={{ width: 36 }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: 48 }} />
            </colgroup>
            <thead>
              <tr>
                <th style={TH_STYLE}><input type="checkbox" /></th>
                <th style={TH_STYLE}>STT</th>
                <th style={TH_STYLE}>SỐ & NGÀY THỤ LÝ XX</th>
                <th style={TH_STYLE}>
                  {userRole === "hinh-su" ? "THÔNG TIN BẢN ÁN HÌNH SỰ" : userRole === "dan-su" ? "THÔNG TIN BẢN ÁN & QHPL" : "THÔNG TIN BẢN ÁN / QUYẾT ĐỊNH & QHPL"}
                </th>
                <th style={TH_STYLE}>
                  {userRole === "hinh-su" ? "NGƯỜI KHIẾU NẠI / BỊ CÁO" : userRole === "dan-su" ? "NGƯỜI KHỞI KIỆN / NGƯỜI BỊ KIỆN" : "ĐƯƠNG SỰ / NGƯỜI THAM GIA TỐ TỤNG"}
                </th>
                <th style={TH_STYLE}>PHÂN CÔNG</th>
                <th style={TH_STYLE}>TRẠNG THÁI</th>
                <th style={{ ...TH_STYLE, textAlign: "center" as const }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 32, textAlign: "center" as const, color: MUTED, fontSize: 12, fontFamily: F }}>Không có dữ liệu</td></tr>
              )}
              {paginated.map((row, idx) => (
                <tr key={row.id}
                  style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f0f9ff")}
                  onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
                  onClick={() => setDetail(row)}
                >
                  <td style={{ ...TD_STYLE, textAlign: "center" as const }} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" style={{ cursor: "pointer" }} />
                  </td>
                  <td style={{ ...TD_STYLE, textAlign: "center" as const, color: MUTED, fontSize: 12 }}>{(page - 1) * PAGE_SIZE + idx + 1}</td>

                  {/* Số & Ngày thụ lý XX */}
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <span style={{ fontSize: 11, color: "#2563eb", fontFamily: F, fontWeight: 600 }}>Số: {row.soThuLy}</span>
                      <span style={{ fontSize: 11, color: TEXT, fontFamily: F }}>Ngày: {row.ngayThuLy}</span>
                    </div>
                  </td>

                  {/* Thông tin BA/QĐ */}
                  <td style={TD_STYLE}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.6 }}>
                        <span style={{ fontWeight: 600, color: TEXT }}>Số BA: {formatSoBA(row.soBA)}</span>
                        <span style={{ color: MUTED }}> Ngày: {row.ngayBA}</span>
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Tại: {row.toa}</div>
                      {userRole !== "hinh-su" && (
                        <div style={{ fontSize: 11, color: "#1e40af", fontWeight: 500, fontFamily: F }}>
                          QHPL: {row.tenVuAn}
                        </div>
                      )}
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                        <span style={{ display: "inline-block", padding: "1px 7px", background: "#dcfce7", color: "#15803d", borderRadius: 3, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                          Thời hiệu: {row.thoiHieu}
                        </span>
                        {row.tag === "an-qh" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa", borderRadius: 3, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                            🏠 ÁN QH
                          </span>
                        )}
                        {row.tag === "an-tu-hinh" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", background: "#fef2f2", color: RED, border: `1px solid ${RED}`, borderRadius: 10, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                            ● Án tử hình
                          </span>
                        )}
                        {row.tag === "an-chi-dao" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", background: "#fefce8", color: "#854d0e", border: "1px solid #fef08a", borderRadius: 3, fontSize: 10, fontWeight: 600, fontFamily: F }}>
                            ★ Án chỉ đạo
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Đương sự / Bị cáo */}
                  <td style={TD_STYLE}>
                    <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.8 }}>
                      {userRole === "hinh-su" ? (
                        <>
                          <div><span style={{ color: MUTED }}>Người khiếu nại: </span>{row.ndkn}</div>
                          <div><span style={{ color: MUTED }}>Bị cáo: </span>{row.biCao || row.ndd}</div>
                        </>
                      ) : userRole === "dan-su" ? (
                        <>
                          <div><span style={{ color: MUTED }}>Người khởi kiện: </span>{row.ndkn}</div>
                          <div><span style={{ color: MUTED }}>Người bị kiện: </span>{row.ndd}</div>
                        </>
                      ) : (
                        <>
                          <div><span style={{ color: MUTED }}>NĐKN / Người KN: </span>{row.ndkn}</div>
                          <div><span style={{ color: MUTED }}>Bị cáo / NĐĐ: </span>{row.biCao || row.ndd}</div>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Phân công */}
                  <td style={TD_STYLE}>
                    <div style={{ fontSize: 11, fontFamily: F, lineHeight: 1.8 }}>
                      <div><span style={{ color: MUTED }}>TTV: </span>{row.ttv}</div>
                      <div><span style={{ color: MUTED }}>LĐV: </span>{row.ldv}</div>
                      <div><span style={{ color: MUTED }}>TP: </span>{row.tp}</div>
                    </div>
                  </td>

                  <td style={TD_STYLE}>
                    <TrangThaiCell row={row} />
                  </td>
                  <td style={{ ...TD_STYLE, textAlign: "center" as const }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setDetail(row)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4, borderRadius: 4 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
            <span>Hiển thị {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} trong tổng {filtered.length} bản ghi</span>
            <div style={{ flex: 1 }} />
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ ...paginBtn, color: page === 1 ? MUTED : TEXT, cursor: page === 1 ? "default" : "pointer" }}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ ...paginBtn, background: p === page ? RED : "#fff", color: p === page ? "#fff" : TEXT, border: `1px solid ${p === page ? RED : BORDER}`, fontWeight: p === page ? 700 : 400 }}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ ...paginBtn, color: page === totalPages ? MUTED : TEXT, cursor: page === totalPages ? "default" : "pointer" }}>›</button>
            <select style={{ padding: "3px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, fontSize: 12 }}><option>10 / trang</option></select>
          </div>
        </div>
      </div>
    </>
  );
}
