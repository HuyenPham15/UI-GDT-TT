export type TabId =
  | "tat-ca"
  | "cho-y-kien"
  | "don-cho-phe-duyet"
  | "ho-so-khang-nghi"
  | "da-co-vu-an"
  | "tra-lai";

export type VuAnAction =
  | "chuyen-vu-an"
  | "huy-ghep"
  | "them-vu-an"
  | "ghep-vu-an";

export type TrangThaiVuAn =
  | "don-cho-phe-duyet"
  | "da-co-vu-an"
  | "thong-bao-giai-quyet"
  | "chua-co-hs";

export type LoaiAn =
  | "Hình sự"
  | "Dân sự"
  | "Hành chính"
  | "Kinh doanh thương mại"
  | "Hôn nhân gia đình"
  | "Lao động"
  | "Sở hữu trí tuệ"
  | "Phá sản";

export type VuPhuTrach =
  | "Vụ GD, KT về hình sự"
  | "Vụ GDT, KT về dân sự"
  | "Vụ Giám đốc, kiểm tra về hành chính"
  | "Vụ Giám đốc, kiểm tra về kinh doanh, thương mại, phá sản, lao động, gia đình và người chưa thành niên";

export const LOAI_AN_OPTIONS: LoaiAn[] = [
  "Hình sự",
  "Dân sự",
  "Hành chính",
  "Kinh doanh thương mại",
  "Hôn nhân gia đình",
  "Lao động",
  "Sở hữu trí tuệ",
  "Phá sản",
];

export const VU_OPTIONS: VuPhuTrach[] = [
  "Vụ GD, KT về hình sự",
  "Vụ GDT, KT về dân sự",
  "Vụ Giám đốc, kiểm tra về hành chính",
  "Vụ Giám đốc, kiểm tra về kinh doanh, thương mại, phá sản, lao động, gia đình và người chưa thành niên",
];

export function getVuByLoaiAn(loaiAn: LoaiAn): VuPhuTrach {
  switch (loaiAn) {
    case "Hình sự":
      return "Vụ GD, KT về hình sự";
    case "Dân sự":
      return "Vụ GDT, KT về dân sự";
    case "Hành chính":
      return "Vụ Giám đốc, kiểm tra về hành chính";
    default:
      return "Vụ Giám đốc, kiểm tra về kinh doanh, thương mại, phá sản, lao động, gia đình và người chưa thành niên";
  }
}

export interface LeaderOpinion {
  name: string;
  role: string;
  decision: "thuy-moi" | "khong-thu-ly";
  date: string;
}

export interface DonCase {
  id: number;
  type: "don" | "hskn";
  tabs: TabId[];
  loaiAn: LoaiAn;
  vu: VuPhuTrach;

  // Thông tin đơn (type=don)
  maDon?: string;
  soCV?: string;
  ngayCV?: string;
  thuLyMoi?: string;
  daThuLy?: boolean;

  // Thông tin đơn (type=hskn)
  maVanThuDen?: string;
  ngayVanThuDen?: string;
  soHSKN?: string;
  ngayHSKN?: string;
  thuLyXetXu?: string;

  // Chung
  thamPhan: string;
  capThamPhan: string;
  hinhThuc: string;
  tags: string[]; // "an-dan-de" | "an-tu-hinh"

  // Đương sự
  nguoiKhieuNai?: string;
  biCao?: string;
  ndd?: string;
  nguoiKhangNghi?: string;

  // BA/QĐ
  soBA: string;
  ngayBA: string;
  toa: string;
  capXetXu: string;
  hoiDongThamPhanPhucTham?: string;
  thamPhanChuToaPhucTham?: string;

  // Vụ án
  maVuAn?: string;
  tenVuAn?: string;
  ttv?: string;
  trangThai: TrangThaiVuAn;
  trangThai2?: TrangThaiVuAn;
  vuAnActions?: VuAnAction[];

  // Kết quả giải quyết trước đó
  thongBaoBoSung?: string;
  ttvGiaiQuyet?: string;
  tpGiaiQuyet?: string;

  // Ý kiến lãnh đạo
  yKienLD?: LeaderOpinion[];

  // Nhận/Trả
  ngayNhan?: string;
  nguoiThaoTac?: string;
  ngayThaoTac?: string;
  nguoiTra?: string;
  ngayTra?: string;
}

export type ToTrinhScope = "case" | "submission";

export interface ToTrinh {
  id: string;
  title: string;
  scope: ToTrinhScope;
  targetId: string;
  authorId?: string;
  createdAt?: string;
  content?: string;
}

export const TOTRINHS: ToTrinh[] = [
  {
    id: "tt-1",
    title: "Tờ trình toàn vụ án VA26-010301",
    scope: "case",
    targetId: "VA26-010301",
    authorId: "Nguyễn Văn A",
    createdAt: "20/07/2026",
    content: "Tờ trình đề nghị xem xét toàn bộ vụ án VA26-010301",
  },
  {
    id: "tt-2",
    title: "Tờ trình theo đơn 5101",
    scope: "submission",
    targetId: "5101",
    authorId: "Lý Thái Phúc",
    createdAt: "22/07/2026",
    content: "Tờ trình liên quan đến đơn số 5101, đề nghị xử lý theo đơn giải quyết",
  },
];

export function getToTrinhsByCase(maVuAn: string): ToTrinh[] {
  return TOTRINHS.filter((t) => t.scope === "case" && t.targetId === maVuAn);
}

export function getToTrinhsBySubmission(maDonOrId: string): ToTrinh[] {
  return TOTRINHS.filter((t) => t.scope === "submission" && t.targetId === maDonOrId);
}

// ── Mock data: 8 loại án × 5 bản ghi, phân bổ 4 vụ ─────────────────────────

interface LoaiAnMeta {
  loaiAn: LoaiAn;
  vuAnTitles: string[];
}

const LOAI_AN_META: LoaiAnMeta[] = [
  {
    loaiAn: "Hình sự",
    vuAnTitles: [
      "Vụ án NGUYỄN VĂN AN - Tội cố ý gây thương tích",
      "Vụ án TRẦN VĂN BÌNH - Tội trộm cắp tài sản",
      "Vụ án LÊ THỊ CÚC - Tội lừa đảo chiếm đoạt tài sản",
      "Vụ án PHẠM VĂN DŨNG - Tội giết người",
      "Vụ án HOÀNG THỊ EM - Tội mua bán trái phép chất ma túy",
    ],
  },
  {
    loaiAn: "Dân sự",
    vuAnTitles: [
      "Vụ án TRẦN VĂN HÒA - Tranh chấp đất đai",
      "Vụ án NGUYỄN THỊ LAN - Tranh chấp hợp đồng chuyển nhượng",
      "Vụ án LÝ VĂN MINH - Tranh chấp quyền sử dụng đất",
      "Vụ án ĐỖ THỊ NGỌC - Tranh chấp thừa kế",
      "Vụ án VŨ VĂN PHÚC - Tranh chấp hợp đồng vay vốn",
    ],
  },
  {
    loaiAn: "Hành chính",
    vuAnTitles: [
      "Vụ án PHẠM VĂN QUANG - Khiếu kiện quyết định hành chính về thu hồi đất",
      "Vụ án NGUYỄN THỊ SƯƠNG - Khiếu kiện quyết định kỷ luật cán bộ",
      "Vụ án TRẦN VĂN TÙNG - Khiếu kiện quyết định xử phạt vi phạm hành chính",
      "Vụ án LÊ THỊ UYÊN - Khiếu kiện quyết định cấp giấy phép xây dựng",
      "Vụ án HOÀNG VĂN VIỆT - Khiếu kiện quyết định thu hồi giấy phép kinh doanh",
    ],
  },
  {
    loaiAn: "Kinh doanh thương mại",
    vuAnTitles: [
      "Vụ án CÔNG TY ABC - Tranh chấp hợp đồng mua bán hàng hóa",
      "Vụ án NGUYỄN VĂN XUÂN - Tranh chấp hợp đồng đại lý thương mại",
      "Vụ án TRẦN THỊ YẾN - Tranh chấp hợp đồng vận chuyển hàng hóa",
      "Vụ án LÊ VĂN ZINH - Tranh chấp hợp đồng bảo lãnh thương mại",
      "Vụ án PHẠM THỊ ÁNH - Tranh chấp hợp đồng ủy thác xuất nhập khẩu",
    ],
  },
  {
    loaiAn: "Hôn nhân gia đình",
    vuAnTitles: [
      "Vụ án NGUYỄN VĂN BẢO - Ly hôn",
      "Vụ án TRẦN THỊ CHÂU - Chia tài sản chung vợ chồng",
      "Vụ án LÊ VĂN ĐỨC - Tranh chấp quyền nuôi con",
      "Vụ án PHẠM THỊ HẰNG - Xác nhận không có quan hệ hôn nhân",
      "Vụ án HOÀNG VĂN KHÁNH - Thay đổi nội dung giám hộ",
    ],
  },
  {
    loaiAn: "Lao động",
    vuAnTitles: [
      "Vụ án NGUYỄN VĂN LONG - Tranh chấp hợp đồng lao động",
      "Vụ án TRẦN THỊ MAI - Tranh chấp chấm dứt hợp đồng lao động",
      "Vụ án LÊ VĂN NAM - Tranh chấp tiền lương, phụ cấp",
      "Vụ án PHẠM THỊ OANH - Tranh chấp bồi thường tai nạn lao động",
      "Vụ án VŨ VĂN PHONG - Tranh chấp kỷ luật lao động",
    ],
  },
  {
    loaiAn: "Sở hữu trí tuệ",
    vuAnTitles: [
      "Vụ án CÔNG TY XYZ - Vi phạm quyền tác giả phần mềm",
      "Vụ án NGUYỄN VĂN QUÝ - Vi phạm quyền nhãn hiệu",
      "Vụ án TRẦN THỊ RUBY - Vi phạm quyền sáng chế",
      "Vụ án LÊ VĂN SƠN - Vi phạm quyền thiết kế kiểu dáng công nghiệp",
      "Vụ án PHẠM THỊ THU - Vi phạm quyền đối với giống cây trồng",
    ],
  },
  {
    loaiAn: "Phá sản",
    vuAnTitles: [
      "Vụ án CÔNG TY TNHH DELTA - Giải quyết phá sản doanh nghiệp",
      "Vụ án CÔNG TY CP OMEGA - Giải quyết phá sản doanh nghiệp",
      "Vụ án NGUYỄN VĂN TÀI - Giải quyết phá sản cá nhân kinh doanh",
      "Vụ án TRẦN THỊ UY - Giải quyết phá sản hợp tác xã",
      "Vụ án LÊ VĂN VINH - Giải quyết phá sản doanh nghiệp tư nhân",
    ],
  },
];

const THAM_PHAN_LIST = ["Đỗ Tất Thống", "Lê Thị Hoa", "Trần Minh Hải", "Nguyễn Thị Lan", "Cao Thị Mai"];
const CAP_THAM_PHAN_LIST = ["TPB3", "TPB2", "TPTC", "TPB1", "TPB3"];
const TOA_LIST = [
  "Tòa án nhân dân khu vực 7 - Đà Nẵng",
  "Tòa án nhân dân tỉnh Bắc Ninh",
  "Tòa án nhân dân tỉnh Hà Nam",
  "Tòa án nhân dân tỉnh Đồng Nai",
  "Tòa án nhân dân cấp cao tại Hà Nội",
];
const NKN_LIST = ["Đỗ Tất Đạt", "Phạm Văn Tú", "Lê Văn Dũng", "Trần Văn Khoa", "Vũ Thanh Tùng"];
const BICAO_LIST = ["Vũ Hoa Hảo", "Hoàng Thị Minh", "Bùi Thị Thu", "Lý Thị Hồng", "Đỗ Hữu Bình"];
const NDD_LIST = ["Võ Hoài Trầm", "Nguyễn Quốc Bảo", "Võ Thành Nhân", "Đặng Hoàng Nam", "Hoàng Mỹ Linh"];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function buildCase(loaiIdx: number, recIdx: number, globalId: number): DonCase {
  const meta = LOAI_AN_META[loaiIdx];
  const loaiAn = meta.loaiAn;
  const vu = getVuByLoaiAn(loaiAn);
  const maVuAn = `VA26-${String(loaiIdx + 1).padStart(2, "0")}${pad2(recIdx + 1)}01`;
  const maDon = String(5100 + globalId);
  const thamPhan = THAM_PHAN_LIST[recIdx % THAM_PHAN_LIST.length];
  const capThamPhan = CAP_THAM_PHAN_LIST[recIdx % CAP_THAM_PHAN_LIST.length];
  const toa = TOA_LIST[recIdx % TOA_LIST.length];
  const nguoiKhieuNai = NKN_LIST[recIdx % NKN_LIST.length];
  const biCao = BICAO_LIST[recIdx % BICAO_LIST.length];
  const ndd = NDD_LIST[recIdx % NDD_LIST.length];
  const tenVuAn = meta.vuAnTitles[recIdx];
  const soCV = String(10 + recIdx + loaiIdx);
  const ngayCV = `${pad2(recIdx + 1)}/06/2026`;
  const SHORT_MAP: Record<string, string> = {
    "Hình sự": "HS",
    "Dân sự": "DS",
    "Hành chính": "HC",
    "Kinh doanh thương mại": "KDTM",
    "Hôn nhân gia đình": "HNGĐ",
    "Lao động": "LĐ",
    "Sở hữu trí tuệ": "SHTT",
    "Phá sản": "PS",
  };
  const shortCode = SHORT_MAP[loaiAn] || "HS";
  const capCode = recIdx % 3 === 0 ? "PT" : "ST";
  const soBA = `${pad2(recIdx + 1)}06/${shortCode}-${capCode}`;
  const ngayBA = `${pad2(recIdx + 1)}/06/2026`;
  const thuLyMoi = String(2330000 + globalId);

  const base = {
    id: globalId,
    loaiAn,
    vu,
    thamPhan,
    capThamPhan,
    tags: recIdx % 2 === 0 ? (["an-dan-de"] as string[]) : [],
    nguoiKhieuNai,
    biCao,
    ndd,
    soBA,
    ngayBA,
    toa,
    capXetXu: recIdx % 3 === 0 ? "Phúc thẩm" : "Sơ thẩm",
  };

  // 5 mẫu bản ghi cho mỗi loại án, phân bổ các tab
  switch (recIdx) {
    case 0:
      return {
        ...base,
        type: "don",
        tabs: ["tat-ca", "cho-y-kien", "don-cho-phe-duyet"],
        maDon,
        soCV,
        ngayCV,
        thuLyMoi,
        hinhThuc: "Đơn đề nghị GĐT/TT",
        maVuAn,
        tenVuAn,
        ttv: "Nguyễn Văn A",
        trangThai: "don-cho-phe-duyet",
        yKienLD: [
          { name: "Nguyễn Thị Bình", role: "Vụ trưởng", decision: recIdx % 2 === 0 ? "khong-thu-ly" : "thuy-moi", date: "10/07/2026" },
          { name: "Nguyễn Văn Tiến", role: "Phó CA", decision: "khong-thu-ly", date: "10/07/2026" },
        ],
      };
    case 1:
      return {
        ...base,
        type: "don",
        tabs: ["tat-ca", "don-cho-phe-duyet"],
        maDon,
        soCV,
        ngayCV,
        thuLyMoi,
        hinhThuc: "Đơn khiếu nại tư pháp tố tụng",
        trangThai: "don-cho-phe-duyet",
        vuAnActions: ["ghep-vu-an", "them-vu-an"],
        ...(recIdx === 1 && loaiIdx % 2 === 0 ? { daThuLy: true } : {}),
      };
    case 2:
      return {
        ...base,
        type: "don",
        tabs: ["tat-ca", "da-co-vu-an"],
        maDon,
        soCV,
        ngayCV,
        thuLyMoi,
        hinhThuc: "Đơn đề nghị GĐT/TT",
        maVuAn,
        tenVuAn,
        ttv: "Nguyễn Văn A",
        trangThai: "da-co-vu-an",
        vuAnActions: ["chuyen-vu-an", "huy-ghep"],
        ngayNhan: `${10 + recIdx}/6/2026`,
      };
    // case 3:
    //   return {
    //     ...base,
    //     type: "hskn",
    //     tabs: loaiIdx % 2 === 0
    //       ? ["tat-ca", "ho-so-khang-nghi", "da-co-vu-an"]
    //       : ["tat-ca", "ho-so-khang-nghi"],
    //     maVanThuDen: maDon,
    //     ngayVanThuDen: ngayCV,
    //     soHSKN: String(Number(maDon) + 1),
    //     ngayHSKN: ngayCV,
    //     thuLyXetXu: thuLyMoi,
    //     hinhThuc: "Hồ sơ kháng nghị",
    //     nguoiKhangNghi: loaiIdx % 2 === 0 ? "VKSNDTC" : "TANDTC",
    //     maVuAn: loaiIdx % 2 === 0 ? maVuAn : undefined,
    //     tenVuAn: loaiIdx % 2 === 0 ? tenVuAn : undefined,
    //     trangThai: loaiIdx % 2 === 0 ? "da-co-vu-an" : "don-cho-phe-duyet",
    //     vuAnActions: loaiIdx % 2 === 0 ? ["huy-ghep"] : ["them-vu-an"],
    //     nguoiThaoTac: "Nguyễn Hảo",
    //     ngayThaoTac: "10/6/2026",
    //   };
    default:
      return {
        ...base,
        type: "don",
        tabs: ["tat-ca", "tra-lai"],
        maDon,
        soCV,
        ngayCV,
        thuLyMoi,
        hinhThuc: "Đơn báo phát hiện vi phạm PL",
        maVuAn,
        tenVuAn,
        trangThai: "da-co-vu-an",
        thongBaoBoSung: "Thông báo trả lời đơn số 1",
        ttvGiaiQuyet: "Nguyễn Văn An",
        tpGiaiQuyet: "Đào Văn Nam",
        nguoiTra: "Trần Quốc Hải",
        ngayTra: `${14 + recIdx}/6/2026`,
      };
  }
}

export const CASES: DonCase[] = LOAI_AN_META.flatMap((_, loaiIdx) =>
  Array.from({ length: 5 }, (_, recIdx) =>
    buildCase(loaiIdx, recIdx, loaiIdx * 5 + recIdx + 1),
  ),
);

export const TAB_CONFIG = [
  { id: "tat-ca", label: "Tất cả", count: "30" },
  { id: "cho-y-kien", label: "Chờ xin ý kiến", count: "6" },
  { id: "don-cho-phe-duyet", label: "Đơn chờ phê duyệt", count: "6" },
  // { id: "ho-so-khang-nghi", label: "Hồ sơ kháng nghị", count: "6" },
  { id: "da-co-vu-an", label: "Đã có vụ án", count: "6" },
  { id: "tra-lai", label: "Trả lại", count: "6" },
] as const;

export function filterCasesByRole(cases: DonCase[], userRole?: string): DonCase[] {
  if (!userRole || userRole === "toan-bo") return cases;
  if (userRole === "vu-1" || userRole === "hinh-su") return cases.filter((c) => c.loaiAn === "Hình sự");
  if (userRole === "vu-2" || userRole === "dan-su") return cases.filter((c) => c.loaiAn === "Dân sự");
  if (userRole === "vu-3" || userRole === "kdtm-ld")
    return cases.filter(
      (c) =>
        c.loaiAn === "Kinh doanh thương mại" ||
        c.loaiAn === "Phá sản" ||
        c.loaiAn === "Lao động" ||
        c.loaiAn === "Hôn nhân gia đình" ||
        c.loaiAn === "Sở hữu trí tuệ"
    );
  if (userRole === "vu-4" || userRole === "hanh-chinh") return cases.filter((c) => c.loaiAn === "Hành chính");
  return cases;
}

export function getCasesByTab(tab: TabId, userRole?: string): DonCase[] {
  const tabCases = CASES.filter((c) => c.tabs.includes(tab));
  return filterCasesByRole(tabCases, userRole);
}

export function countByTab(tab: TabId, userRole?: string): string {
  const n = getCasesByTab(tab, userRole).length;
  return String(n);
}

export function getCasesByLoaiAn(loaiAn: LoaiAn): DonCase[] {
  return CASES.filter((c) => c.loaiAn === loaiAn);
}

export function getCasesByVu(vu: VuPhuTrach): DonCase[] {
  return CASES.filter((c) => c.vu === vu);
}
