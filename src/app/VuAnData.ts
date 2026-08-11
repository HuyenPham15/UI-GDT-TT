// ── VuAnData.ts ──────────────────────────────────────────────────────────────
// Pure data & types – tách riêng để tránh lỗi Vite Fast Refresh
// (không được export React components trong file này)
// ─────────────────────────────────────────────────────────────────────────────
import { type LoaiAn } from "./data";
import { type UserRoleType } from "./shared";

// ── Types & Interfaces ────────────────────────────────────────────────────────
export interface VuAnRow {
  stt: number; lan: string;
  soThuLy: string; ngayThuLy: string;
  soBA: string; ngayBA: string;
  toa: string; capXetXu: string;
  thoiHieu?: string;
  anLoai?: "chi-dao" | "quoc-hoi" | "tvtn" | "tu-hinh" | string;
  loaiAn?: string;
  quanHePhapLuat?: string;
  nkn: string; biCao: string; ndd: string;
  ttv: string; lanhDao: string;
  kqgq: "chua-phan-cong" | "trinh-pho-chanh-an" | "trinh-tham-phan";
  trangThaiHoSo: "chua-co" | "dang-muon" | "da-co" | "da-tra" | "da-chuyen";
  kqGiaiQuyet: "chua-co" | "da-co" | "da-co-con-don";
  trangThaiToTrinh: "chua-co" | "dang-trinh" | "da-duyet" | "bi-tra-lai";
  soToTrinh: number;
  thamPhan?: string;
  extraTags?: string[];
}

export interface VuAnGroup {
  id: string;
  maSo: string;
  tenVuAn: string;
  soVuAnGiaiQuyet: number;
  loaiAn?: LoaiAn | string;
  rows: VuAnRow[];
}

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
  thamPhan?: string;
  thamTraVien?: string;
  isKhieuNai?: boolean;
  entityWord?: string;
  moduleLabel?: string;
  detailLabel?: string;
}

// ── Helper ────────────────────────────────────────────────────────────────────
export function filterVuAnListByRole(groups: VuAnGroup[], userRole?: UserRoleType): VuAnGroup[] {
  if (!userRole || userRole === "toan-bo") return groups;
  if (userRole === "vu-1" || userRole === "hinh-su") {
    return groups.filter(g => g.loaiAn === "Hình sự" || (!g.loaiAn && !g.id.includes("DS") && !g.id.includes("KDTM") && !g.id.includes("HC") && !g.id.includes("LD") && !g.id.includes("HNGD")));
  }
  if (userRole === "vu-2" || userRole === "dan-su") {
    return groups.filter(g => g.loaiAn === "Dân sự" || g.id.includes("DS"));
  }
  if (userRole === "vu-3") {
    return groups.filter(g => g.loaiAn === "Kinh doanh thương mại" || g.loaiAn === "Lao động" || g.loaiAn === "Hôn nhân gia đình" || g.loaiAn === "Phá sản" || g.loaiAn === "Sở hữu trí tuệ" || g.id.includes("KDTM") || g.id.includes("LD") || g.id.includes("HNGD") || g.id.includes("PS"));
  }
  if (userRole === "vu-4" || userRole === "hanh-chinh") {
    return groups.filter(g => g.loaiAn === "Hành chính" || g.id.includes("HC"));
  }
  return groups;
}

// ── Data: Danh sách vụ án ─────────────────────────────────────────────────────
export const VU_AN_LIST: VuAnGroup[] = [
  // ── Vụ I: Hình sự ──
  {
    id: "VA26-002621", maSo: "VA26-002621",
    tenVuAn: "Vụ án Đặng Thị Dương – Tội cố ý gây thương tích",
    soVuAnGiaiQuyet: 2,
    loaiAn: "Hình sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "5:44682424", ngayThuLy: "20/07/2026",
        soBA: "12/2026/HS-PT", ngayBA: "20/07/2026",
        toa: "Tòa án nhân dân cấp cao tại Hà Nội", capXetXu: "Tái thẩm",
        thoiHieu: "1 năm",
        anLoai: "quoc-hoi",
        loaiAn: "Hình sự",
        nkn: "Đặng Thị Dương", biCao: "Hoàng Ngọc Hoa", ndd: "Lập Thái Phúc",
        ttv: "Lý Thái Phúc", lanhDao: "GD Giải quyết đơn", thamPhan: "Nguyễn Biên Thuỳ",
        kqgq: "chua-phan-cong", trangThaiHoSo: "chua-co", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
      {
        stt: 2, lan: "Lần 2: Số đơn 1 (1 đơn TLM)",
        soThuLy: "5:44682425", ngayThuLy: "22/07/2026",
        soBA: "12/2026/HS-PT", ngayBA: "20/07/2026",
        toa: "Tòa án nhân dân cấp cao tại Hà Nội", capXetXu: "Tái thẩm",
        thoiHieu: "Không xác định thời hiệu",
        anLoai: "chi-dao",
        loaiAn: "Hình sự",
        nkn: "Đặng Thị Dương", biCao: "Hoàng Ngọc Hoa", ndd: "Lập Thái Phúc",
        ttv: "Lý Thái Phúc", lanhDao: "GD Giải quyết đơn", thamPhan: "Nguyễn Biên Thuỳ",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
  {
    id: "VA26-002138", maSo: "VA26-002138",
    tenVuAn: "Vụ án Hoàng Hoa Thám – Tội cố ý gây thương tích",
    soVuAnGiaiQuyet: 3,
    loaiAn: "Hình sự",
    rows: [
      {
        stt: 3, lan: "Lần 1: Số đơn 3 (1 đơn TLM)",
        soThuLy: "5:4684H06", ngayThuLy: "07/07/2026",
        soBA: "56/2026/HS-PT", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân cấp cao – Bắc Ninh", capXetXu: "Phúc thẩm",
        thoiHieu: "Không xác định thời hiệu",
        anLoai: "chi-dao",
        loaiAn: "Hình sự",
        nkn: "Phạm Ngọc Hoa", biCao: "Hoàng Hoa Vân", ndd: "Hoàng Hoa Vân",
        ttv: "Vũ Biêu Thư", lanhDao: "Lê Thị Bình Ngọc", thamPhan: "Trần Minh Đức",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co-con-don", trangThaiToTrinh: "dang-trinh", soToTrinh: 2,
      },
      {
        stt: 2, lan: "Lần 2: Số đơn 2 (1 đơn TLM)",
        soThuLy: "5:4684606", ngayThuLy: "07/07/2026",
        soBA: "56/2026/HS-PT", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân cấp cao – Bắc Ninh", capXetXu: "Phúc thẩm",
        thoiHieu: "1 năm",
        loaiAn: "Hình sự",
        nkn: "Phạm Ngọc Hoa", biCao: "Hoàng Hoa Vân", ndd: "Hoàng Hoa Vân",
        ttv: "Nguyễn Thị Bình", lanhDao: "Lê Thị Bình Ngọc", thamPhan: "Trần Minh Đức",
        kqgq: "chua-phan-cong", trangThaiHoSo: "dang-muon", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 1,
      },
      {
        stt: 1, lan: "Lần 1: Số đơn 2 (1 đơn TLM)",
        soThuLy: "5:4684606", ngayThuLy: "07/07/2026",
        soBA: "56/2026/HS-PT", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân cấp cao – Bắc Ninh", capXetXu: "Phúc thẩm",
        thoiHieu: "1 năm",
        anLoai: "quoc-hoi",
        loaiAn: "Hình sự",
        nkn: "Phạm Ngọc Hoa", biCao: "Hoàng Hoa Vân", ndd: "Hoàng Hoa Vân",
        ttv: "Vũ Biêu Thư", lanhDao: "Lê Thị Bình Ngọc", thamPhan: "Trần Minh Đức",
        kqgq: "chua-phan-cong", trangThaiHoSo: "chua-co", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
    ],
  },
  // ── Vụ II: Dân sự ──
  {
    id: "VA26-001543-DS", maSo: "VA26-001543",
    tenVuAn: "Vụ án Ngô Mai Trang – Tranh chấp hợp đồng mua bán nhà ở và QSDĐ",
    soVuAnGiaiQuyet: 2,
    loaiAn: "Dân sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54681543", ngayThuLy: "03/07/2026",
        soBA: "21/2026/DS-ST", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân tỉnh Bắc Ninh", capXetXu: "Sơ thẩm",
        thoiHieu: "3 năm",
        anLoai: "quoc-hoi",
        nkn: "Ngô Mai Trang", biCao: "Công ty TNHH Bất động sản Hoàng Gia", ndd: "Luật sư Trần Văn Nam",
        ttv: "Trần Thị Mai", lanhDao: "Trần Thị Hoa", thamPhan: "Nguyễn Thị Hương",
        kqgq: "trinh-tham-phan", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
  {
    id: "VA26-002300-DS", maSo: "VA26-002300",
    tenVuAn: "Vụ án Lê Văn Hùng – Tranh chấp thừa kế quyền sử dụng đất",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Dân sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54682300", ngayThuLy: "28/06/2026",
        soBA: "77/2026/DS-PT", ngayBA: "28/06/2026",
        toa: "Tòa án nhân dân TP Đà Nẵng", capXetXu: "Phúc thẩm",
        thoiHieu: "5 năm",
        anLoai: "chi-dao",
        nkn: "Lê Văn Hùng", biCao: "Lê Thị Bích", ndd: "Luật sư Phạm Quốc Tuấn",
        ttv: "Vũ Xuân Hiển", lanhDao: "Nguyễn Tiến Mạnh", thamPhan: "Phạm Văn Lợi",
        kqgq: "chua-phan-cong", trangThaiHoSo: "chua-co", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
    ],
  },
  // ── Vụ III: Kinh doanh thương mại ──
  {
    id: "VA26-001890-KDTM", maSo: "VA26-001890",
    tenVuAn: "Vụ án Công ty CP Xây lắp Dầu khí – Tranh chấp hợp đồng tín dụng và bảo lãnh",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Kinh doanh thương mại",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54681890", ngayThuLy: "19/06/2026",
        soBA: "45/2026/KDTM-ST", ngayBA: "19/06/2026",
        toa: "Tòa án nhân dân TP Hồ Chí Minh", capXetXu: "Sơ thẩm",
        thoiHieu: "3 năm",
        anLoai: "chi-dao",
        nkn: "Ngân hàng TMCP Ngoại thương Việt Nam", biCao: "Công ty CP Xây lắp Dầu khí", ndd: "Nguyễn Văn Thắng",
        ttv: "Đỗ Thị Thu Hằng", lanhDao: "Nguyễn Như Thắng", thamPhan: "Chu Thị Thu Hiền",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co-con-don", trangThaiToTrinh: "dang-trinh", soToTrinh: 1,
      },
    ],
  },
  // ── Vụ IV: Hành chính ──
  {
    id: "VA26-001104-HC", maSo: "VA26-001104",
    tenVuAn: "Vụ án Phạm Văn Cường – Khiếu kiện Quyết định thu hồi đất và bồi thường tái định cư",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Hành chính",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54681104", ngayThuLy: "25/07/2026",
        soBA: "12/2026/HC-ST", ngayBA: "25/07/2026",
        toa: "Tòa án nhân dân tỉnh Bắc Giang", capXetXu: "Sơ thẩm",
        thoiHieu: "1 năm",
        anLoai: "quoc-hoi",
        nkn: "Phạm Văn Cường", biCao: "Ủy ban nhân dân huyện Yên Dũng", ndd: "Hoàng Minh Tâm",
        ttv: "Hoàng Minh Tâm", lanhDao: "Vũ Xuân Hiển", thamPhan: "Nguyễn Tiến Dũng",
        kqgq: "chua-phan-cong", trangThaiHoSo: "dang-muon", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
    ],
  },
  {
    id: "VA26-003005-HS", maSo: "VA26-003005",
    tenVuAn: "Vụ án Lê Anh Tuấn – Tội cướp tài sản có tổ chức theo khoản 4 Điều 168 Bộ luật Hình sự",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Hình sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn TLM)",
        soThuLy: "54683005", ngayThuLy: "18/07/2026",
        soBA: "57/2026/HS-ST", ngayBA: "16/07/2026",
        toa: "Tòa án nhân dân tỉnh Thanh Hóa", capXetXu: "Sơ thẩm",
        thoiHieu: "1 năm",
        anLoai: "chi-dao",
        nkn: "Lê Anh Tuấn", biCao: "Ngô Văn Quyết", ndd: "Luật sư Đặng Minh Tuấn",
        ttv: "Nguyễn Thị Bình", lanhDao: "Nguyễn Như Thắng", thamPhan: "Lê Văn Minh",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
];

// ── Data: Danh sách khiếu nại ─────────────────────────────────────────────────
export const KHIEU_NAI_LIST: VuAnGroup[] = [
  {
    id: "KN26-004128", maSo: "KN26-004128",
    tenVuAn: "Vụ khiếu nại Quyết định giải quyết đơn số 45/QĐ-TANDTC của TAND tỉnh Hà Nam",
    soVuAnGiaiQuyet: 2,
    loaiAn: "Hình sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (1 đơn khiếu nại)",
        soThuLy: "KN-2026/00142", ngayThuLy: "15/05/2026",
        soBA: "12/2026/HS-ST", ngayBA: "10/04/2026",
        toa: "Tòa án nhân dân tỉnh Hà Nam", capXetXu: "Sơ thẩm",
        thoiHieu: "1 năm",
        anLoai: "chi-dao",
        nkn: "Nguyễn Thị Lan (KN-88421)", biCao: "Phạm Văn Tuấn", ndd: "Luật sư Trần Văn Nam",
        ttv: "Vũ Diệu Thúy", lanhDao: "Phạm Thị Bích Ngọc", thamPhan: "Nguyễn Thị Hương",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
      {
        stt: 2, lan: "Lần 2: Số đơn 1 (Đơn khiếu nại bổ sung)",
        soThuLy: "KN-2026/00143", ngayThuLy: "20/06/2026",
        soBA: "12/2026/HS-ST", ngayBA: "10/04/2026",
        toa: "Tòa án nhân dân tỉnh Hà Nam", capXetXu: "Sơ thẩm",
        thoiHieu: "Không xác định thời hiệu",
        anLoai: "quoc-hoi",
        nkn: "Nguyễn Thị Lan (KN-88421)", biCao: "Phạm Văn Tuấn", ndd: "Luật sư Trần Văn Nam",
        ttv: "Vũ Diệu Thúy", lanhDao: "Phạm Thị Bích Ngọc", thamPhan: "Nguyễn Thị Hương",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
  {
    id: "KN26-005230-DS", maSo: "KN26-005230",
    tenVuAn: "Khiếu nại Thông báo không kháng nghị số 128/TB-TA về vụ tranh chấp đất đai Bắc Ninh",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Dân sự",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (Khiếu nại thông báo)",
        soThuLy: "KN-2026/00189", ngayThuLy: "02/06/2026",
        soBA: "54681139", ngayBA: "03/05/2026",
        toa: "Tòa án nhân dân cấp cao tại Hà Nội", capXetXu: "Giám đốc thẩm",
        thoiHieu: "3 năm",
        anLoai: "quoc-hoi",
        extraTags: ["Khiếu nại TB giải quyết"],
        nkn: "Phạm Văn Hùng (KN-74291)", biCao: "Ngô Quỳnh Trang", ndd: "Nguyễn Văn Hùng",
        ttv: "Nguyễn Thị Hoa", lanhDao: "Nguyễn Như Thắng", thamPhan: "Chu Thị Thu Hiền",
        kqgq: "trinh-tham-phan", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co-con-don", trangThaiToTrinh: "dang-trinh", soToTrinh: 1,
      },
    ],
  },
  {
    id: "KN26-003891-KDTM", maSo: "KN26-003891",
    tenVuAn: "Khiếu nại Quyết định xử lý hành vi cản trở hoạt động tố tụng số 08/QĐ-XPHC",
    soVuAnGiaiQuyet: 2,
    loaiAn: "Kinh doanh thương mại",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (Khiếu nại biện pháp khẩn cấp)",
        soThuLy: "KN-2026/00245", ngayThuLy: "20/07/2026",
        soBA: "08/2026/QĐ-KDTM", ngayBA: "18/07/2026",
        toa: "Tòa án nhân dân TP. Đà Nẵng", capXetXu: "Sơ thẩm",
        thoiHieu: "5 năm",
        anLoai: "chi-dao",
        extraTags: ["Khẩn cấp"],
        nkn: "Trần Minh Đức (ĐD Công ty CP Minh Phát)", biCao: "Công ty TNHH Hoàng Gia", ndd: "Đặng Quốc Tuấn",
        ttv: "Đỗ Thị Thu Hằng", lanhDao: "Nguyễn Tiến Mạnh", thamPhan: "Phạm Văn Lợi",
        kqgq: "chua-phan-cong", trangThaiHoSo: "chua-co", kqGiaiQuyet: "chua-co", trangThaiToTrinh: "chua-co", soToTrinh: 0,
      },
    ],
  },
  {
    id: "KN26-006102-HC", maSo: "KN26-006102",
    tenVuAn: "Khiếu nại việc chậm trả lời đơn đề nghị kháng nghị giám đốc thẩm bản án hành chính",
    soVuAnGiaiQuyet: 1,
    loaiAn: "Hành chính",
    rows: [
      {
        stt: 1, lan: "Lần 1: Số đơn 1 (Khiếu nại thời hạn)",
        soThuLy: "KN-2026/00310", ngayThuLy: "10/08/2026",
        soBA: "19/2026/HC-PT", ngayBA: "12/04/2026",
        toa: "Tòa án nhân dân tối cao", capXetXu: "Giám đốc thẩm",
        thoiHieu: "1 năm",
        anLoai: "quoc-hoi",
        extraTags: ["Khiếu nại thời hạn giải quyết"],
        nkn: "Hoàng Thị Thu", biCao: "Ủy ban nhân dân tỉnh Thanh Hóa", ndd: "Nguyễn Văn Tiến",
        ttv: "Hoàng Minh Tâm", lanhDao: "Vũ Xuân Hiển", thamPhan: "Nguyễn Tiến Dũng",
        kqgq: "trinh-pho-chanh-an", trangThaiHoSo: "da-co", kqGiaiQuyet: "da-co", trangThaiToTrinh: "da-duyet", soToTrinh: 1,
      },
    ],
  },
];

// ── Data: Chi tiết vụ án ──────────────────────────────────────────────────────
export const VU_AN_DETAILS: Record<string, VuAnDetailData> = {
  "KN26-004128": {
    maVuAn: "KN26-004128", tenVuAn: "Vụ khiếu nại Quyết định giải quyết đơn số 45/QĐ-TANDTC của TAND tỉnh Hà Nam",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "12/2026/HS-ST – 10/04/2026", loaiAn: "Hình sự",
    toaXetXu: "Tòa án nhân dân tỉnh Hà Nam",
    danhSachDon: [
      { stt: 1, maDon: "KN-88421", thongTinGQ: "Thụ lý mới", soThuLy: "KN-2026/00142", ngayThuLy: "15/05/2026", ngayNhan: "15/05/2026", nguoiDung: "Nguyễn Thị Lan", phanLoai: "Đơn khiếu nại tố tụng", loaiDon: "DON_CHINH", noiDung: "Khiếu nại hành vi tố tụng và Quyết định trả lại đơn đề nghị giám đốc thẩm đối với bản án hình sự sơ thẩm số 12/2026/HS-ST." },
    ],
    muonTraHoSo: [
      { stt: 1, loaiPhieu: "Phiếu mượn", soPhieu: "PM-KN-001", soBuLuc: "08", ngayGhiPhieu: "18/05/2026", ngayTao: "18/05/2026", canBo: "Vũ Diệu Thúy", chucVu: "Thẩm tra viên", donVi: "Vụ 1 - TANDTC", nguoiKyDuyet: "Phạm Thị Bích Ngọc", trangThaiKy: "Đã ký", ghiChu: "Hồ sơ khiếu nại" },
    ],
  },
  "KN26-005230-DS": {
    maVuAn: "KN26-005230", tenVuAn: "Khiếu nại Thông báo không kháng nghị số 128/TB-TA về vụ tranh chấp đất đai Bắc Ninh",
    loaiBienAn: "Giám đốc thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "128/TB-TA – 03/05/2026", loaiAn: "Dân sự",
    toaXetXu: "Tòa án nhân dân cấp cao tại Hà Nội",
    danhSachDon: [
      { stt: 1, maDon: "KN-74291", thongTinGQ: "Đã thụ lý", soThuLy: "KN-2026/00189", ngayThuLy: "02/06/2026", ngayNhan: "02/06/2026", nguoiDung: "Phạm Văn Hùng", phanLoai: "Khiếu nại TB giải quyết", loaiDon: "DON_CHINH", noiDung: "Đề nghị xem xét lại Thông báo không kháng nghị giám đốc thẩm liên quan đến diện tích 350m2 đất thừa kế." },
    ],
    muonTraHoSo: [],
  },
  "KN26-003891-KDTM": {
    maVuAn: "KN26-003891", tenVuAn: "Khiếu nại Quyết định xử lý hành vi cản trở hoạt động tố tụng số 08/QĐ-XPHC",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "08/2026/QĐ-KDTM – 18/07/2026", loaiAn: "Kinh doanh thương mại",
    toaXetXu: "Tòa án nhân dân TP. Đà Nẵng",
    danhSachDon: [
      { stt: 1, maDon: "KN-90214", thongTinGQ: "Thụ lý mới", soThuLy: "KN-2026/00245", ngayThuLy: "20/07/2026", ngayNhan: "20/07/2026", nguoiDung: "Trần Minh Đức", phanLoai: "Khiếu nại biện pháp khẩn cấp", loaiDon: "DON_CHINH", noiDung: "Khiếu nại việc áp dụng biện pháp khẩn cấp tạm thời phong tỏa tài khoản ngân hàng không đúng quy định." },
    ],
    muonTraHoSo: [],
  },
  "KN26-006102-HC": {
    maVuAn: "KN26-006102", tenVuAn: "Khiếu nại việc chậm trả lời đơn đề nghị kháng nghị giám đốc thẩm bản án hành chính",
    loaiBienAn: "Giám đốc thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "19/2026/HC-PT – 12/04/2026", loaiAn: "Hành chính",
    toaXetXu: "Tòa án nhân dân tối cao",
    danhSachDon: [
      { stt: 1, maDon: "KN-61020", thongTinGQ: "Đã có KQ", soThuLy: "KN-2026/00310", ngayThuLy: "10/08/2026", ngayNhan: "10/08/2026", nguoiDung: "Hoàng Thị Thu", phanLoai: "Khiếu nại thời hạn giải quyết", loaiDon: "DON_CHINH", noiDung: "Khiếu nại thời hạn giải quyết đơn đề nghị giám đốc thẩm kéo dài quá quy định pháp luật." },
    ],
    muonTraHoSo: [],
  },
  "VA26-002621": {
    maVuAn: "VA26-002039", tenVuAn: "Nguyễn Văn Minh – Tội cướp tài sản",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "12/4/2026/HSPT – 30/12/2025", loaiAn: "Hình sự",
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
  "VA26-001543-DS": {
    maVuAn: "VA26-001543", tenVuAn: "Ngô Mai Trang – Tranh chấp hợp đồng mua bán nhà ở và QSDĐ",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "21/2026/DS-ST – 03/07/2026", loaiAn: "Dân sự",
    toaXetXu: "Tòa án nhân dân tỉnh Bắc Ninh",
    danhSachDon: [
      { stt: 1, maDon: "7122", thongTinGQ: "Thụ lý mới", soThuLy: "54681543", ngayThuLy: "03/07/2026", ngayNhan: "03/07/2026", nguoiDung: "Ngô Mai Trang", phanLoai: "Đơn đề nghị GĐT", loaiDon: "DON_CHINH", noiDung: "Đề nghị xem xét bản án sơ thẩm về tranh chấp quyền sử dụng đất và nhà ở do vi phạm nghiêm trọng thủ tục tố tụng." },
    ],
    muonTraHoSo: [
      { stt: 1, loaiPhieu: "Phiếu mượn", soPhieu: "PM-DS-001", soBuLuc: "15", ngayGhiPhieu: "05/07/2026", ngayTao: "05/07/2026", canBo: "Trần Thị Mai", chucVu: "Thẩm tra viên", donVi: "TAND tỉnh Bắc Ninh", nguoiKyDuyet: "Trần Thị Hoa", trangThaiKy: "Đã ký", ghiChu: "Hồ sơ gốc vụ án" },
    ],
  },
  "VA26-002300-DS": {
    maVuAn: "VA26-002300", tenVuAn: "Lê Văn Hùng – Tranh chấp thừa kế quyền sử dụng đất",
    loaiBienAn: "Phúc thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "77/2026/DS-PT – 28/06/2026", loaiAn: "Dân sự",
    toaXetXu: "Tòa án nhân dân TP Đà Nẵng",
    danhSachDon: [
      { stt: 1, maDon: "7150", thongTinGQ: "Thụ lý mới", soThuLy: "54682300", ngayThuLy: "28/06/2026", ngayNhan: "28/06/2026", nguoiDung: "Lê Văn Hùng", phanLoai: "Đơn đề nghị GĐT", loaiDon: "DON_CHINH", noiDung: "Đề nghị kháng nghị Giám đốc thẩm bản án phúc thẩm về phân chia di sản thừa kế." },
    ],
    muonTraHoSo: [],
  },
  "VA26-001890-KDTM": {
    maVuAn: "VA26-001890", tenVuAn: "Công ty CP Xây lắp Dầu khí – Tranh chấp hợp đồng tín dụng và bảo lãnh",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "45/2026/KDTM-ST – 19/06/2026", loaiAn: "Kinh doanh thương mại",
    toaXetXu: "Tòa án nhân dân TP Hồ Chí Minh",
    danhSachDon: [
      { stt: 1, maDon: "7210", thongTinGQ: "Thụ lý mới", soThuLy: "54681890", ngayThuLy: "19/06/2026", ngayNhan: "19/06/2026", nguoiDung: "Ngân hàng TMCP Ngoại thương", phanLoai: "Đơn đề nghị GĐT", loaiDon: "DON_CHINH", noiDung: "Yêu cầu Giám đốc thẩm do áp dụng sai quy định về nghĩa vụ bảo lãnh và lãi suất nợ quá hạn." },
    ],
    muonTraHoSo: [],
  },
  "VA26-001104-HC": {
    maVuAn: "VA26-001104", tenVuAn: "Phạm Văn Cường – Khiếu kiện Quyết định thu hồi đất và bồi thường tái định cư",
    loaiBienAn: "Sơ thẩm", namGiaiQuyet: "Giám đốc thẩm",
    soNgayBanAn: "12/2026/HC-ST – 25/07/2026", loaiAn: "Hành chính",
    toaXetXu: "Tòa án nhân dân tỉnh Bắc Giang",
    danhSachDon: [
      { stt: 1, maDon: "7305", thongTinGQ: "Thụ lý mới", soThuLy: "54681104", ngayThuLy: "25/07/2026", ngayNhan: "25/07/2026", nguoiDung: "Phạm Văn Cường", phanLoai: "Đơn đề nghị GĐT", loaiDon: "DON_CHINH", noiDung: "Khiếu kiện quyết định thu hồi đất không đúng thẩm quyền và giá bồi thường chưa thỏa đáng." },
    ],
    muonTraHoSo: [],
  },
};
