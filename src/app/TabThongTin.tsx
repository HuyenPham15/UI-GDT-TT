import React, { useState, useEffect } from "react";
import { Eye, Trash2, Sliders } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE, Badge, getThoiHieuOptions, type UserRoleType } from "./shared";
import type { VuAnDetailData } from "./App";
import { LOAI_AN_OPTIONS, LoaiAn } from "./data";

export function SectionCard({ title, children, collapsible = false }: { title: string; children: React.ReactNode; collapsible?: boolean }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
      <div
        onClick={collapsible ? () => setOpen(v => !v) : undefined}
        style={{ display: "flex", alignItems: "center", padding: "11px 16px", borderBottom: open ? `1px solid ${BORDER}` : "none", cursor: collapsible ? "pointer" : "default", userSelect: "none" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>{title}</span>
        {collapsible && <span style={{ fontSize: 12, color: MUTED }}>{open ? "▼" : "▶"}</span>}
      </div>
      {open && <div style={{ padding: "16px" }}>{children}</div>}
    </div>
  );
}

export function InfoGrid({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px 32px" }}>
      {rows.map(([lbl, val]) => (
        <div key={lbl} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: F }}>{lbl}</span>
          <span style={{ fontSize: 12, color: TEXT, fontFamily: F, fontWeight: 500, lineHeight: 1.5 }}>{val}</span>
        </div>
      ))}
    </div>
  );
}



export interface TabThongTinMockData {
  thongTinChung: {
    maVuAn: string;
    loaiBanAn: string;
    thuTucGiaiQuyet: string;
    soBanAn: string;
    ngayBanAn: string;
    loaiAn: LoaiAn;
    toaRaBanAn: string;
    nguoiDon: string;
    nguoiBiDon?: string;
    noiDung?: string;
    congVan: {
      soNgay: string;
      donVi: string;
      loaiCongVan: string;
    };
    chiDao: {
      nguoiChiDao: string;
      chucVu: string;
      noiDung: string;
    };
    badges?: Array<{ label: string; color: string; bg: string }>;
  };
  denNghiGDT: {
    hasData: boolean;
    noiDung?: string;
  };
  quaTrinhGiaiQuyet: QuaTrinhGiaiQuyetRow[];
  thongTinThem: {
    thoiHieuDefault: string;
    quanHePL: string;
    quanHePLThongKe: string;
    quanHePLThongKeOptions: string[];
  };
  nguoiThamGiaToTung: {
    nhom1: { title: string; required?: boolean; rows: NguoiLienQuanRow[] };
    nhom2: { title: string; required?: boolean; rows: NguoiLienQuanRow[] };
    nhom3: { title: string; required?: boolean; hasCheckbox?: boolean; rows: NguoiLienQuanRow[] };
  };
}

// ── CẤU HÌNH FAKE DATA CHO 8 LOẠI ÁN DỄ SỬA ĐỔI / TÙY BIẾN ───────────────────
export const MOCK_DATA_BY_LOAI_AN: Record<LoaiAn, TabThongTinMockData> = {
  "Hình sự": {
    thongTinChung: {
      maVuAn: "VA26-002012: ĐẶNG THỊ DƯƠNG – Tội cố ý gây thương tích",
      loaiBanAn: "Sơ thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soBanAn: "124/2026/HS-ST",
      ngayBanAn: "20/07/2026",
      loaiAn: "Hình sự",
      nguoiDon: "Đặng Thị Dương",
      nguoiBiDon: "Hoàng Ngọc Hoa",
      noiDung: "Tội cố ý gây thương tích",
      toaRaBanAn: "Tòa án nhân dân khu vực 5 - Bắc Ninh",
      congVan: {
        soNgay: "Số 124/CV-VKSTC – 15/07/2026",
        donVi: "Viện kiểm sát nhân dân tối cao",
        loaiCongVan: "(Công văn kiến nghị GĐT)",
      },
      chiDao: {
        nguoiChiDao: "Nguyễn Văn A",
        chucVu: "Phó Chánh án TANDTC",
        noiDung: "Xem xét kỹ hồ sơ đánh giá thương tích và yếu tố phòng vệ chính đáng",
      },
      badges: [
        { label: "⭐ Án chỉ đạo", color: "#92400e", bg: "#fef3c7" },
        { label: "🏛 ÁN QH", color: "#3730a3", bg: "#e0e7ff" },
      ],
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-002012: ĐẶNG THỊ DƯƠNG – Tội cố ý gây thương tích",
        loai: "Bản án", giai: "Sơ thẩm",
        soBA: "124/2026/HS-ST", ngayBA: "20/07/2026",
        toa: "Tòa án nhân dân khu vực 5 - Bắc Ninh",
        thamPhans: ["Nguyễn Văn A", "Thẩm phán Bậc 1"],
      },
      {
        stt: 2,
        vuAn: "VA26-001649 – ĐẶNG THỊ DƯƠNG – Tội cố ý gây thương tích",
        loai: "Bản án", giai: "Phúc thẩm",
        soBA: "236/2026/HS-PT", ngayBA: "03/07/2026",
        toa: "Tòa án nhân dân tỉnh Bắc Ninh",
        thamPhans: [
          "Nguyễn Văn A (Chủ tọa)", "Thẩm phán Bậc 2",
          "Trần Văn B", "Thẩm phán Bậc 2",
          "Lê Thị C", "Thẩm phán Bậc 2",
        ],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "Không xác định thời hiệu",
      quanHePL: "Tội cố ý gây thương tích (Điều 134 BLHS)",
      quanHePLThongKe: "Các tội xâm phạm tính mạng, sức khỏe",
      quanHePLThongKeOptions: [
        "Các tội xâm phạm tính mạng, sức khỏe",
        "Các tội xâm phạm sở hữu",
        "Các tội phạm về chức vụ",
        "Các tội xâm phạm trật tự quản lý kinh tế",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Bị cáo",
        required: true,
        rows: [{ stt: 1, hoTen: "Đặng Thị Dương", ngaySinh: "1995", cccd: "036302091038", toiDanh: "Cố ý gây thương tích (Khoản 2 Điều 134 BLHS)", diaChi: "Số nhà 7, Xã Trường Sơn, Tỉnh Bắc Ninh" }],
      },
      nhom2: {
        title: "* Bị hại",
        required: true,
        rows: [{ stt: 1, hoTen: "Nguyễn Văn Bình", ngaySinh: "1992", cccd: "091310391131", diaChi: "Số nhà 10, Phường Chũ, Tỉnh Bắc Ninh" }],
      },
      nhom3: {
        title: "Người khiếu nại",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Trần Anh Tuấn", ngaySinh: "1988", cccd: "018210921313", diaChi: "Xã Vân Sơn, Tỉnh Bắc Ninh" }],
      },
    },
  },

  "Dân sự": {
    thongTinChung: {
      maVuAn: "VA26-003102: DƯƠNG THU HẰNG – Tranh chấp hợp đồng vay tài sản",
      loaiBanAn: "Sơ thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soBanAn: "102/2026/DS-ST",
      ngayBanAn: "18/06/2026",
      loaiAn: "Dân sự",
      nguoiDon: "Dương Thu Hằng",
      nguoiBiDon: "Nguyễn Văn Bình",
      noiDung: "Tranh chấp hợp đồng vay tài sản",
      toaRaBanAn: "Tòa án nhân dân tỉnh Bắc Ninh",
      congVan: {
        soNgay: "Số 45/CV-TA – 22/06/2026",
        donVi: "TAND tỉnh Bắc Ninh",
        loaiCongVan: "(Công văn chuyển đơn)",
      },
      chiDao: {
        nguoiChiDao: "Trần Văn B",
        chucVu: "Thẩm phán TANDTC",
        noiDung: "Thẩm tra kỹ hợp đồng thế chấp tài sản và nghĩa vụ bảo lãnh",
      },
      badges: [{ label: "⭐ Án chỉ đạo", color: "#92400e", bg: "#fef3c7" }],
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-003102: DƯƠNG THU HẰNG – Tranh chấp vay tài sản",
        loai: "Bản án", giai: "Sơ thẩm",
        soBA: "102/2026/DS-ST", ngayBA: "18/06/2026",
        toa: "Tòa án nhân dân huyện Tiên Du",
        thamPhans: ["Phạm Văn D", "Thẩm phán Bậc 1"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "3-nam",
      quanHePL: "Tranh chấp hợp đồng vay tài sản",
      quanHePLThongKe: "Tranh chấp hợp đồng dân sự",
      quanHePLThongKeOptions: [
        "Tranh chấp hợp đồng dân sự",
        "Tranh chấp quyền sở hữu tài sản",
        "Tranh chấp bồi thường thiệt hại ngoài hợp đồng",
        "Tranh chấp về thừa kế tài sản",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Nguyên đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Dương Thu Hằng", ngaySinh: "2002", cccd: "036302091038", diaChi: "Số nhà 7, Xã Trường Sơn, Tỉnh Bắc Ninh" }],
      },
      nhom2: {
        title: "* Bị đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Nguyễn Thành Đô", ngaySinh: "1997", cccd: "091310391131", diaChi: "Số nhà 10, Phường Chũ, Tỉnh Bắc Ninh" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Trần Anh Tuấn", ngaySinh: "1988", cccd: "018210921313", diaChi: "Xã Vân Sơn, Tỉnh Bắc Ninh" }],
      },
    },
  },

  "Hành chính": {
    thongTinChung: {
      maVuAn: "VA26-004150: PHẠM VĂN CƯỜNG – Khiếu kiện quyết định thu hồi đất",
      loaiBanAn: "Phúc thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soBanAn: "45/2026/HC-PT",
      ngayBanAn: "10/05/2026",
      loaiAn: "Hành chính",
      nguoiDon: "Phạm Văn Cường",
      nguoiBiDon: "UBND tỉnh Bắc Giang",
      noiDung: "Khiếu kiện quyết định thu hồi đất",
      toaRaBanAn: "Tòa án nhân dân cấp cao tại Hà Nội",
      congVan: {
        soNgay: "Số 88/CV-UBND – 12/05/2026",
        donVi: "UBND Tỉnh Bắc Giang",
        loaiCongVan: "(Công văn kiến nghị xem xét lại)",
      },
      chiDao: {
        nguoiChiDao: "Lê Văn C",
        chucVu: "Vụ trưởng Vụ 3",
        noiDung: "Rà soát căn cứ thu hồi đất và trình tự bồi thường giải phóng mặt bằng",
      },
      badges: [{ label: "🏛 ÁN QH", color: "#3730a3", bg: "#e0e7ff" }],
    },
    denNghiGDT: {
      hasData: true,
      noiDung: "Đề nghị xem xét bản án phúc thẩm do cho rằng quy trình bồi thường thu hồi đất chưa đúng thẩm quyền.",
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-004150: PHẠM VĂN CƯỜNG – Khiếu kiện QĐHC",
        loai: "Bản án", giai: "Phúc thẩm",
        soBA: "45/2026/HC-PT", ngayBA: "10/05/2026",
        toa: "Tòa án nhân dân cấp cao tại Hà Nội",
        thamPhans: ["Hoàng Văn E (Chủ tọa)", "Thẩm phán Bậc 3"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "1-nam",
      quanHePL: "Khiếu kiện quyết định hành chính về bồi thường, hỗ trợ tái định cư",
      quanHePLThongKe: "Khiếu kiện QĐHC trong quản lý đất đai",
      quanHePLThongKeOptions: [
        "Khiếu kiện QĐHC trong quản lý đất đai",
        "Khiếu kiện QĐHC về xử phạt VPHC",
        "Khiếu kiện hành vi hành chính",
        "Khiếu kiện QĐHC về quản lý thị trường",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Người khởi kiện",
        required: true,
        rows: [{ stt: 1, hoTen: "Phạm Văn Cường", ngaySinh: "1975", cccd: "024075001234", diaChi: "Phường Hoàng Văn Thụ, TP. Bắc Giang, Tỉnh Bắc Giang" }],
      },
      nhom2: {
        title: "* Người bị kiện",
        required: true,
        rows: [{ stt: 1, hoTen: "Ủy ban nhân dân huyện Yên Dũng", ngaySinh: "-", cccd: "-", diaChi: "Thị trấn Nham Biền, Huyện Yên Dũng, Tỉnh Bắc Giang" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Sở Tài nguyên và Môi trường tỉnh Bắc Giang", ngaySinh: "-", cccd: "-", diaChi: "TP. Bắc Giang, Tỉnh Bắc Giang" }],
      },
    },
  },

  "Kinh doanh thương mại": {
    thongTinChung: {
      maVuAn: "VA26-005201: CÔNG TY Á CHÂU – Tranh chấp hợp đồng mua bán hàng hóa",
      loaiBanAn: "Sơ thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soBanAn: "18/2026/KDTM-ST",
      ngayBanAn: "25/04/2026",
      loaiAn: "Kinh doanh thương mại",
      nguoiDon: "Công ty Á Châu",
      nguoiBiDon: "Ngân hàng TMCP Phương Đông",
      noiDung: "Tranh chấp hợp đồng tín dụng",
      toaRaBanAn: "Tòa án nhân dân tỉnh Bắc Ninh",
      congVan: {
        soNgay: "Số 05/CV-AC – 30/04/2026",
        donVi: "Công ty Á Châu",
        loaiCongVan: "(Đơn đề nghị kháng nghị GĐT)",
      },
      chiDao: {
        nguoiChiDao: "Nguyễn Văn A",
        chucVu: "Phó Chánh án TANDTC",
        noiDung: "Kiểm tra điều khoản phạt vi phạm và bồi thường thiệt hại hợp đồng",
      },
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-005201: CÔNG TY Á CHÂU – Tranh chấp hợp đồng mua bán",
        loai: "Bản án", giai: "Sơ thẩm",
        soBA: "18/2026/KDTM-ST", ngayBA: "25/04/2026",
        toa: "Tòa án nhân dân tỉnh Bắc Ninh",
        thamPhans: ["Đỗ Văn F", "Thẩm phán Bậc 2"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "3-nam",
      quanHePL: "Tranh chấp hợp đồng mua bán hàng hóa quốc tế",
      quanHePLThongKe: "Tranh chấp hợp đồng mua bán hàng hóa",
      quanHePLThongKeOptions: [
        "Tranh chấp hợp đồng mua bán hàng hóa",
        "Tranh chấp giữa công ty với các thành viên công ty",
        "Tranh chấp hợp đồng tín dụng, ngân hàng",
        "Tranh chấp hợp đồng thi công xây dựng",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Nguyên đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty Cổ phần Thương mại Á Châu", ngaySinh: "-", cccd: "MSDN: 0101234567", diaChi: "Số 15 Lê Duẩn, Quận Hoàn Kiếm, Hà Nội" }],
      },
      nhom2: {
        title: "* Bị đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty TNHH Đầu Khí & Vật tư Kỹ thuật", ngaySinh: "-", cccd: "MSDN: 0309876543", diaChi: "KCN Tiên Sơn, Tỉnh Bắc Ninh" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Ngân hàng TMCP Ngoại thương Việt Nam - CN Bắc Ninh", ngaySinh: "-", cccd: "-", diaChi: "TP. Bắc Ninh, Tỉnh Bắc Ninh" }],
      },
    },
  },

  "Hôn nhân gia đình": {
    thongTinChung: {
      maVuAn: "VA26-006305: LÊ THỊ MAI – Tranh chấp chia tài sản chung vợ chồng",
      loaiBanAn: "Phúc thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soBanAn: "88/2026/HNGĐ-PT",
      ngayBanAn: "12/03/2026",
      loaiAn: "Hôn nhân gia đình",
      nguoiDon: "Lê Thị Mai",
      nguoiBiDon: "Nguyễn Văn Hùng",
      noiDung: "Tranh chấp ly hôn và chia tài sản chung vợ chồng",
      toaRaBanAn: "Tòa án nhân dân tỉnh Bắc Ninh",
      congVan: {
        soNgay: "Số 12/CV-ĐN – 15/03/2026",
        donVi: "Văn phòng Luật sư Trí Đức",
        loaiCongVan: "(Công văn đề nghị kháng nghị)",
      },
      chiDao: {
        nguoiChiDao: "Phạm Thị D",
        chucVu: "Trưởng phòng GDT",
        noiDung: "Xác minh công sức đóng góp tạo lập khối tài sản nhà đất của vợ chồng",
      },
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-006305: LÊ THỊ MAI – Chia tài sản chung",
        loai: "Bản án", giai: "Phúc thẩm",
        soBA: "88/2026/HNGĐ-PT", ngayBA: "12/03/2026",
        toa: "Tòa án nhân dân tỉnh Bắc Ninh",
        thamPhans: ["Bùi Thị G", "Thẩm phán Bậc 2"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "3-nam",
      quanHePL: "Tranh chấp tài sản chung vợ chồng sau ly hôn",
      quanHePLThongKe: "Chia tài sản chung vợ chồng",
      quanHePLThongKeOptions: [
        "Chia tài sản chung vợ chồng",
        "Tranh chấp thay đổi người trực tiếp nuôi con",
        "Tranh chấp xác định cha, mẹ cho con",
        "Tranh chấp về cấp dưỡng",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Nguyên đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Lê Thị Mai", ngaySinh: "1989", cccd: "027189005678", diaChi: "Phường Võ Cường, TP. Bắc Ninh, Tỉnh Bắc Ninh" }],
      },
      nhom2: {
        title: "* Bị đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Hoàng Văn Nam", ngaySinh: "1986", cccd: "027186001234", diaChi: "Phường Suối Hoa, TP. Bắc Ninh, Tỉnh Bắc Ninh" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Nguyễn Thị Phương (Mẹ ruột ông Nam)", ngaySinh: "1960", cccd: "027160009876", diaChi: "Phường Suối Hoa, TP. Bắc Ninh" }],
      },
    },
  },

  "Lao động": {
    thongTinChung: {
      maVuAn: "VA26-007412: NGUYỄN VĂN HÙNG – Tranh chấp đơn phương chấm dứt HĐLĐ",
      loaiBanAn: "Sơ thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soBanAn: "09/2026/LĐ-ST",
      ngayBanAn: "05/02/2026",
      loaiAn: "Lao động",
      nguoiDon: "Nguyễn Văn Hùng",
      nguoiBiDon: "Công ty TNHH ABC",
      noiDung: "Tranh chấp đơn phương chấm dứt hợp đồng lao động",
      toaRaBanAn: "Tòa án nhân dân TP. Bắc Ninh",
      congVan: {
        soNgay: "Số 33/CV-LĐ – 10/02/2026",
        donVi: "Liên đoàn Lao động Tỉnh Bắc Ninh",
        loaiCongVan: "(Công văn đề nghị bảo vệ quyền lợi người lao động)",
      },
      chiDao: {
        nguoiChiDao: "Trần Văn B",
        chucVu: "Thẩm phán TANDTC",
        noiDung: "Thẩm tra quy trình sa thải và nghĩa vụ trợ cấp mất việc làm",
      },
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-007412: NGUYỄN VĂN HÙNG – Tranh chấp HĐLĐ",
        loai: "Bản án", giai: "Sơ thẩm",
        soBA: "09/2026/LĐ-ST", ngayBA: "05/02/2026",
        toa: "Tòa án nhân dân TP. Bắc Ninh",
        thamPhans: ["Ngô Văn H", "Thẩm phán Bậc 1"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "1-nam",
      quanHePL: "Tranh chấp về xử lý kỷ luật lao động theo hình thức sa thải",
      quanHePLThongKe: "Tranh chấp về đơn phương chấm dứt HĐLĐ",
      quanHePLThongKeOptions: [
        "Tranh chấp về đơn phương chấm dứt HĐLĐ",
        "Tranh chấp về bồi thường chi phí đào tạo",
        "Tranh chấp về bảo hiểm xã hội",
        "Tranh chấp bồi thường tai nạn lao động",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Nguyên đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Nguyễn Văn Hùng", ngaySinh: "1985", cccd: "012185004321", diaChi: "Phường Thị Cầu, TP. Bắc Ninh" }],
      },
      nhom2: {
        title: "* Bị đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty TNHH Electronics Việt Nam", ngaySinh: "-", cccd: "MSDN: 2300123456", diaChi: "KCN Yên Phong, Tỉnh Bắc Ninh" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Ban Quản lý các KCN tỉnh Bắc Ninh", ngaySinh: "-", cccd: "-", diaChi: "TP. Bắc Ninh, Tỉnh Bắc Ninh" }],
      },
    },
  },

  "Sở hữu trí tuệ": {
    thongTinChung: {
      maVuAn: "VA26-008520: CÔNG TY DƯỢC PHẨM X – Tranh chấp quyền sở hữu công nghiệp",
      loaiBanAn: "Phúc thẩm",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soBanAn: "14/2026/SHTT-PT",
      ngayBanAn: "19/01/2026",
      loaiAn: "Sở hữu trí tuệ",
      nguoiDon: "Công ty Dược phẩm X",
      nguoiBiDon: "Công ty Cổ phần Dược phẩm Y",
      noiDung: "Tranh chấp xâm phạm nhãn hiệu",
      toaRaBanAn: "Tòa án nhân dân cấp cao tại Hà Nội",
      congVan: {
        soNgay: "Số 102/SHTT – 22/01/2026",
        donVi: "Cục Sở hữu trí tuệ",
        loaiCongVan: "(Công văn ý kiến chuyên môn nhãn hiệu)",
      },
      chiDao: {
        nguoiChiDao: "Nguyễn Văn A",
        chucVu: "Phó Chánh án TANDTC",
        noiDung: "Đánh giá khả năng gây nhầm lẫn của nhãn hiệu sản phẩm dược",
      },
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-008520: CÔNG TY DƯỢC X – Tranh chấp SHTT",
        loai: "Bản án", giai: "Phúc thẩm",
        soBA: "14/2026/SHTT-PT", ngayBA: "19/01/2026",
        toa: "Tòa án nhân dân cấp cao tại Hà Nội",
        thamPhans: ["Trịnh Văn K (Chủ tọa)", "Thẩm phán Bậc 3"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "trong-han-1-nam",
      quanHePL: "Tranh chấp về bản quyền tác giả và quyền liên quan đối với nhãn hiệu",
      quanHePLThongKe: "Tranh chấp về bản quyền tác giả",
      quanHePLThongKeOptions: [
        "Tranh chấp về bản quyền tác giả",
        "Tranh chấp về nhãn hiệu và chỉ dẫn địa lý",
        "Tranh chấp về sáng chế và kiểu dáng công nghiệp",
        "Tranh chấp quyền đối với tên miền",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Nguyên đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty Cổ phần Dược phẩm X", ngaySinh: "-", cccd: "MSDN: 0102345678", diaChi: "Số 88 Phố Huế, Q. Hai Bà Trưng, Hà Nội" }],
      },
      nhom2: {
        title: "* Bị đơn",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty TNHH Sản xuất Hóa mỹ phẩm Y", ngaySinh: "-", cccd: "MSDN: 0308765432", diaChi: "Thị xã Từ Sơn, Tỉnh Bắc Ninh" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Cục Sở hữu trí tuệ - Bộ KH&CN", ngaySinh: "-", cccd: "-", diaChi: "386 Nguyễn Trãi, Thanh Xuân, Hà Nội" }],
      },
    },
  },

  "Phá sản": {
    thongTinChung: {
      maVuAn: "VA26-009633: CÔNG TY XÂY DỰNG Z – Yêu cầu mở thủ tục phá sản",
      loaiBanAn: "Quyết định",
      thuTucGiaiQuyet: "Giám đốc thẩm",
      soBanAn: "03/2026/QĐ-PS",
      ngayBanAn: "15/01/2026",
      loaiAn: "Phá sản",
      nguoiDon: "Công ty Cổ phần Xây dựng Z",
      nguoiBiDon: "Tòa án nhân dân TP. Bắc Ninh",
      noiDung: "Yêu cầu mở thủ tục phá sản",
      toaRaBanAn: "Tòa án nhân dân tỉnh Bắc Ninh",
      congVan: {
        soNgay: "Số 08/CV-PS – 20/01/2026",
        donVi: "TAND tỉnh Bắc Ninh",
        loaiCongVan: "(Quyết định chỉ định Quản tài viên)",
      },
      chiDao: {
        nguoiChiDao: "Vũ Văn L",
        chucVu: "Phó Vụ trưởng Vụ 4",
        noiDung: "Thẩm tra danh sách chủ nợ và bảng kê khai tài sản doanh nghiệp",
      },
    },
    denNghiGDT: {
      hasData: false,
    },
    quaTrinhGiaiQuyet: [
      {
        stt: 1,
        vuAn: "VA26-009633: CÔNG TY XÂY DỰNG Z – Thủ tục phá sản",
        loai: "Quyết định", giai: "Sơ thẩm",
        soBA: "03/2026/QĐ-PS", ngayBA: "15/01/2026",
        toa: "Tòa án nhân dân tỉnh Bắc Ninh",
        thamPhans: ["Lương Văn M", "Thẩm phán Bậc 2"],
      },
    ],
    thongTinThem: {
      thoiHieuDefault: "trong-han-1-nam",
      quanHePL: "Yêu cầu mở thủ tục phá sản doanh nghiệp",
      quanHePLThongKe: "Yêu cầu mở thủ tục phá sản",
      quanHePLThongKeOptions: [
        "Yêu cầu mở thủ tục phá sản",
        "Tuyên bố doanh nghiệp phá sản",
        "Tranh chấp liên quan đến thanh lý tài sản phá sản",
      ],
    },
    nguoiThamGiaToTung: {
      nhom1: {
        title: "* Người yêu cầu",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty TNHH Vật liệu Xây dựng Miền Bắc", ngaySinh: "-", cccd: "MSDN: 0103456789", diaChi: "Quận Cầu Giấy, Hà Nội" }],
      },
      nhom2: {
        title: "* Doanh nghiệp bị yêu cầu",
        required: true,
        rows: [{ stt: 1, hoTen: "Công ty Cổ phần Xây dựng & Hạ tầng Z", ngaySinh: "-", cccd: "MSDN: 2300987654", diaChi: "TP. Bắc Ninh, Tỉnh Bắc Ninh" }],
      },
      nhom3: {
        title: "Người có quyền lợi, nghĩa vụ liên quan",
        hasCheckbox: true,
        rows: [{ stt: 1, hoTen: "Quản tài viên Nguyễn Văn D (Doanh nghiệp QLTS)", ngaySinh: "1980", cccd: "010180007890", diaChi: "TP. Hà Nội" }],
      },
    },
  },
};

export type NguoiLienQuanRow = {
  stt: number;
  hoTen: string;
  ngaySinh: string;
  cccd: string;
  diaChi: string;
  diaViPhapLy?: string;
  toiDanhMucAn?: string;
  toiDanh?: string;
};

export interface QuaTrinhGiaiQuyetRow {
  stt: number;
  vuAn: string;
  loai: string;
  giai: string;
  soBA: string;
  ngayBA: string;
  toa: string;
  thamPhans: string[];
}

function NguoiLienQuanTable({ rows, noMarginBottom = false, showToiDanh = false, showDiaVi = true, defaultDiaVi }: { rows: NguoiLienQuanRow[]; noMarginBottom?: boolean; showToiDanh?: boolean; showDiaVi?: boolean; defaultDiaVi?: string }) {
  const headers = showToiDanh
    ? (showDiaVi
      ? ["STT", "Họ và tên/Tổ chức", "Ngày sinh", "CCCD", "Địa chỉ", "Địa vị pháp lý", "Thông tin tội danh, Mức án", "Người thao tác", "Thao tác"]
      : ["STT", "Họ và tên/Tổ chức", "Ngày sinh", "CCCD", "Địa chỉ", "Thông tin tội danh, Mức án", "Người thao tác", "Thao tác"])
    : (showDiaVi
      ? ["STT", "Họ và tên/Tổ chức", "Ngày sinh", "CCCD", "Địa chỉ", "Địa vị pháp lý", "Người thao tác", "Thao tác"]
      : ["STT", "Họ và tên/Tổ chức", "Ngày sinh", "CCCD", "Địa chỉ", "Người thao tác", "Thao tác"]);

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", marginBottom: noMarginBottom ? 0 : 16 }}>
      {showToiDanh && showDiaVi ? (
        <colgroup>
          <col style={{ width: 40 }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "11%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "11%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: 60 }} />
        </colgroup>
      ) : showToiDanh && !showDiaVi ? (
        <colgroup>
          <col style={{ width: 40 }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "25%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: 60 }} />
        </colgroup>
      ) : !showToiDanh && showDiaVi ? (
        <colgroup>
          <col style={{ width: 40 }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: 60 }} />
        </colgroup>
      ) : (
        <colgroup>
          <col style={{ width: 40 }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "11%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "36%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: 60 }} />
        </colgroup>
      )}
      <thead>
        <tr>
          {headers.map(h => (
            <th key={h} style={TH_STYLE}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={headers.length} style={{ ...TD_STYLE, textAlign: "center", padding: "20px 0", color: MUTED, fontSize: 12 }}>
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          rows.map((r, idx) => (
            <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, fontWeight: 500 }}>
                {r.hoTen}
                {((defaultDiaVi === "Bị cáo" || showToiDanh) && idx === 0) ? " (đầu vụ)" : ""}
              </td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, textAlign: "center" }}>{r.ngaySinh}</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, textAlign: "center" }}>{r.cccd || "-"}</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.diaChi}</td>
              {showDiaVi && (
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, textAlign: "center" }}>{r.diaViPhapLy || defaultDiaVi || (showToiDanh ? "Bị cáo" : "Đương sự")}</td>
              )}
              {showToiDanh && (
                <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.toiDanhMucAn || r.toiDanh || "-"}</td>
              )}
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, textAlign: "center" }}>{r.nguoiThaoTac || (idx % 2 === 0 ? "Nguyễn Thị Hương" : "Vũ Đức Thiện")}</td>
              <td style={{ ...TD_STYLE, textAlign: "center" }}>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem"><Eye size={13} color={MUTED} /></button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xóa"><Trash2 size={13} color={MUTED} /></button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function ThongTinKhieuNaiTable({ rows }: { rows?: Array<{ stt: number; nguoiKhieuNai: string; nguoiDuocKhieuNai: string; noiDungKhieuNai?: string; nguoiThaoTac?: string }> }) {
  const headers = ["STT", "Người khiếu nại", "Người được khiếu nại", "Nội dung khiếu nại", "Người thao tác", "Thao tác"];
  const data = rows || [];
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", marginBottom: 16 }}>
      <colgroup>
        <col style={{ width: 45 }} />
        <col style={{ width: "23%" }} />
        <col style={{ width: "23%" }} />
        <col style={{ width: "32%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: 60 }} />
      </colgroup>
      <thead>
        <tr>
          {headers.map(h => (
            <th key={h} style={TH_STYLE}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={headers.length} style={{ ...TD_STYLE, textAlign: "center", padding: "20px 0", color: MUTED, fontSize: 12 }}>
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          data.map((r, idx) => (
            <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12 }}>{r.stt}</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, fontWeight: 500 }}>{r.nguoiKhieuNai}</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.nguoiDuocKhieuNai}</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT }}>{r.noiDungKhieuNai || "-"}</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, textAlign: "center" }}>{r.nguoiThaoTac || (idx % 2 === 0 ? "Nguyễn Thị Hương" : "Vũ Đức Thiện")}</td>
              <td style={{ ...TD_STYLE, textAlign: "center" }}>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xem"><Eye size={13} color={MUTED} /></button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} title="Xóa"><Trash2 size={13} color={MUTED} /></button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function SlideDrawerAddBiCao({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (data: any) => void }) {
  const [hoTen, setHoTen] = useState("");
  const [gioiTinh, setGioiTinh] = useState("");
  const [ngaySinh, setNgaySinh] = useState("");
  const [cccd, setCccd] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [toiDanh, setToiDanh] = useState("");

  if (!open) return null;

  const handleSave = () => {
    onSave({
      hoTen: hoTen || "Nguyễn Văn A",
      ngaySinh: ngaySinh || "1990",
      cccd: cccd || "036090123456",
      diaChi: diaChi || "Bắc Ninh",
      diaViPhapLy: "Bị cáo",
      toiDanhMucAn: toiDanh || "Tội cố ý gây thương tích"
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px 11px",
    fontSize: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: 5,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    background: "#fff",
    fontFamily: F,
    color: TEXT,
    transition: "all 0.15s ease"
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11.5,
    color: TEXT,
    fontWeight: 600,
    marginBottom: 4,
    display: "block",
    fontFamily: F
  };

  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: 12.5,
    fontWeight: 700,
    color: RED,
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
    fontFamily: F
  };

  const drawerThStyle: React.CSSProperties = {
    ...TH_STYLE,
    whiteSpace: "nowrap",
    wordBreak: "normal",
    fontSize: 11.5,
    fontWeight: 700,
    color: TEXT
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9999, backdropFilter: "blur(2px)" }} />

      {/* Drawer Panel */}
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "calc(100vw - 250px)",
        maxWidth: 1180,
        minWidth: 850,
        background: "#fff",
        zIndex: 10000,
        boxShadow: "-10px 0 35px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        fontFamily: F
      }}>
        {/* Sticky Top Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: MUTED, fontWeight: 700, lineHeight: 1, padding: "4px 8px", borderRadius: 4 }}>✕</button>
          <span style={{ fontSize: 15, fontWeight: 700, color: RED, fontFamily: F }}>Thêm Danh sách bị cáo</span>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 22 }}>

          {/* Row 1: Phân loại & Tư cách */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
            <div>
              <label style={labelStyle}><span style={{ color: RED }}>*</span> Phân loại người tham gia tố tụng</label>
              <div style={{ display: "flex", gap: 20, marginTop: 8, fontSize: 12, fontFamily: F }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 500 }}>
                  <input type="radio" name="phanLoai" defaultChecked style={{ width: 15, height: 15, accentColor: RED, cursor: "pointer" }} /> Cá nhân
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 500 }}>
                  <input type="radio" name="phanLoai" style={{ width: 15, height: 15, accentColor: RED, cursor: "pointer" }} /> Cơ quan/Tổ chức
                </label>
              </div>
            </div>
            <div>
              <label style={labelStyle}><span style={{ color: RED }}>*</span> Tư cách tham gia tố tụng</label>
              <select style={{ ...inputStyle, background: "#f8fafc", cursor: "not-allowed" }} value="Bị cáo" disabled>
                <option value="Bị cáo">Bị cáo</option>
              </select>
            </div>
          </div>

          {/* Section 1: THÔNG TIN CON NGƯỜI */}
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 18 }}>
            <div style={sectionHeaderStyle}>
              <span style={{ color: RED }}>⊟</span> Thông tin con người
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "125px 1fr", gap: 24 }}>
              {/* Avatar Box */}
              <div style={{ width: 115, height: 145, background: "#f8fafc", border: `1px dashed #cbd5e1`, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: MUTED, fontSize: 11.5, textAlign: "center", padding: 10, gap: 6 }}>
                <span style={{ fontSize: 24 }}>👤</span>
                <span>Ảnh chân dung</span>
              </div>

              {/* Form Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px 16px" }}>
                <div>
                  <label style={labelStyle}><span style={{ color: RED }}>*</span> Họ và tên</label>
                  <input value={hoTen} onChange={e => setHoTen(e.target.value)} placeholder="Họ và tên" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}><span style={{ color: RED }}>*</span> Giới tính</label>
                  <select value={gioiTinh} onChange={e => setGioiTinh(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">Giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={labelStyle}><span style={{ color: RED }}>*</span> Ngày sinh</label>
                    <label style={{ fontSize: 10.5, color: MUTED, cursor: "pointer", fontFamily: F }}><input type="checkbox" style={{ accentColor: RED }} /> Không có căn cước</label>
                  </div>
                  <input value={ngaySinh} onChange={e => setNgaySinh(e.target.value)} placeholder="dd/mm/yyyy hoặc yyyy" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}><span style={{ color: RED }}>*</span> Số căn cước</label>
                  <div style={{ position: "relative" }}>
                    <input value={cccd} onChange={e => setCccd(e.target.value)} placeholder="nhập dữ liệu" style={inputStyle} />
                    <span style={{ position: "absolute", right: 10, top: 8, color: MUTED, fontSize: 13, pointerEvents: "none" }}>🔍</span>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Ngày cấp CCCD</label>
                  <input placeholder="Ngày cấp CCCD" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Nơi cấp CCCD</label>
                  <input placeholder="Nơi cấp CCCD" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Dân tộc</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }}><option>Dân tộc</option><option>Kinh</option><option>Tày</option><option>Thái</option></select>
                </div>
                <div>
                  <label style={labelStyle}>Tôn giáo</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }}><option>Tôn giáo</option><option>Không</option><option>Phật giáo</option><option>Công giáo</option></select>
                </div>

                <div>
                  <label style={labelStyle}>Quốc tịch</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} defaultValue="Việt Nam"><option>Việt Nam</option></select>
                </div>
                <div>
                  <label style={labelStyle}>Nghề nghiệp</label>
                  <input placeholder="Nghề nghiệp" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Nghề nghiệp rõ</label>
                  <input placeholder="Nghề nghiệp rõ" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Chức vụ/quyền hạn</label>
                  <input placeholder="Chức vụ/quyền hạn" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Nơi làm việc</label>
                  <input placeholder="Nơi làm việc" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Ngoại ngữ</label>
                  <input placeholder="Ngoại ngữ" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Trình độ văn hóa</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }}><option>Trình độ văn hóa</option><option>12/12</option></select>
                </div>
                <div>
                  <label style={labelStyle}>Trình độ đào tạo</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }}><option>Trình độ đào tạo</option><option>Đại học</option></select>
                </div>

                <div>
                  <label style={labelStyle}>Thành phần gia đình</label>
                  <input placeholder="Thành phần gia đình" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Số điện thoại</label>
                  <input placeholder="Số điện thoại" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input placeholder="Email" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Số fax</label>
                  <input placeholder="Số fax" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Checkboxes Công chức, Nghiện ma túy */}
            <div style={{ display: "flex", gap: 36, marginTop: 16, fontSize: 12, fontFamily: F, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={labelStyle}><span style={{ color: RED }}>*</span> Công chức, viên chức:</span>
                <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontWeight: 500 }}><input type="radio" name="congChuc" defaultChecked style={{ width: 14, height: 14, accentColor: RED }} /> Không</label>
                <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontWeight: 500 }}><input type="radio" name="congChuc" style={{ width: 14, height: 14, accentColor: RED }} /> Có</label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={labelStyle}><span style={{ color: RED }}>*</span> Nghiện ma túy:</span>
                <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontWeight: 500 }}><input type="radio" name="nghienMaTuy" defaultChecked style={{ width: 14, height: 14, accentColor: RED }} /> Không</label>
                <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontWeight: 500 }}><input type="radio" name="nghienMaTuy" style={{ width: 14, height: 14, accentColor: RED }} /> Có</label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 500 }}><input type="checkbox" style={{ accentColor: RED }} /> Là đảng viên</label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 500 }}><input type="checkbox" style={{ accentColor: RED }} /> Có tiền án tiền sự</label>
              </div>
            </div>
          </div>

          {/* DANH SÁCH GIẤY TỜ */}
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 10, fontFamily: F }}>DANH SÁCH GIẤY TỜ</div>
            <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${BORDER}`, tableLayout: "fixed" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ ...drawerThStyle, width: 50, textAlign: "center" }}>STT</th>
                  <th style={{ ...drawerThStyle, width: "25%" }}>Loại giấy tờ</th>
                  <th style={{ ...drawerThStyle, width: "25%" }}>Số</th>
                  <th style={{ ...drawerThStyle, width: "20%" }}>Ngày cấp</th>
                  <th style={{ ...drawerThStyle, width: "20%" }}>Nơi cấp</th>
                  <th style={{ ...drawerThStyle, width: 85, textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} style={{ ...TD_STYLE, textAlign: "center", padding: "16px 0", color: MUTED, fontSize: 12, fontFamily: F }}>
                    Chưa có giấy tờ. Nhấn Thêm giấy tờ để bổ sung.
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <button style={{ background: "#fff", border: `1px dashed ${BORDER}`, borderRadius: 5, padding: "6px 20px", cursor: "pointer", fontSize: 12, color: TEXT, fontFamily: F, fontWeight: 500 }}>
                + Thêm giấy tờ
              </button>
            </div>
          </div>

          {/* Ghi chú & Địa chỉ */}
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>Ghi chú</label>
              <input placeholder="Ghi chú" style={inputStyle} />
            </div>

            {/* Các loại Địa chỉ */}
            {["Nơi sinh", "Quê quán", "Nơi đăng ký HKTT", "Nơi tạm trú", "Nơi ở hiện tại"].map((lbl, idx) => (
              <div key={lbl} style={{ display: "grid", gridTemplateColumns: "150px 1fr 1fr 1fr 1fr 35px", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "flex", alignItems: "center", gap: 6, fontFamily: F }}>
                  <span style={{ fontSize: 14 }}>🏠</span> {lbl}
                </span>
                <input placeholder={lbl} value={idx === 4 ? diaChi : undefined} onChange={idx === 4 ? e => setDiaChi(e.target.value) : undefined} style={inputStyle} />
                <select style={{ ...inputStyle, cursor: "pointer" }}><option>Phường/Xã</option></select>
                <select style={{ ...inputStyle, cursor: "pointer" }}><option>Tỉnh/Thành phố</option></select>
                <select style={{ ...inputStyle, cursor: "pointer" }} defaultValue="Việt Nam"><option>Việt Nam</option></select>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: RED, fontSize: 15, padding: 4 }}>🗑</button>
              </div>
            ))}
          </div>

          {/* Section: THÔNG TIN QUAN HỆ */}
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={sectionHeaderStyle}><span style={{ color: RED }}>⊟</span> Thông tin quan hệ</div>
              <button style={{ background: RED, color: "#fff", border: "none", borderRadius: 4, padding: "5px 14px", cursor: "pointer", fontSize: 11.5, fontWeight: 600, fontFamily: F }}>+ Thêm quan hệ</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${BORDER}`, tableLayout: "fixed" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ ...drawerThStyle, width: 45, textAlign: "center" }}>STT</th>
                  <th style={drawerThStyle}>Họ tên</th>
                  <th style={drawerThStyle}>Ngày sinh</th>
                  <th style={drawerThStyle}>Giới tính</th>
                  <th style={drawerThStyle}>CCCD/CMT</th>
                  <th style={drawerThStyle}>Quan hệ</th>
                  <th style={drawerThStyle}>Nơi ở hiện nay</th>
                  <th style={drawerThStyle}>Chú thích</th>
                  <th style={{ ...drawerThStyle, width: 85, textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={9} style={{ ...TD_STYLE, textAlign: "center", padding: "16px 0", color: MUTED, fontSize: 12, fontFamily: F }}>
                    Không có dữ liệu
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section: THÔNG TIN TỘI DANH */}
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={sectionHeaderStyle}><span style={{ color: RED }}>⊟</span> Thông tin tội danh</div>
              <button style={{ background: RED, color: "#fff", border: "none", borderRadius: 4, padding: "5px 14px", cursor: "pointer", fontSize: 11.5, fontWeight: 600, fontFamily: F }}>+ Thêm tội danh</button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Tội danh chính / Mức án</label>
              <input value={toiDanh} onChange={e => setToiDanh(e.target.value)} placeholder="Nhập tội danh và mức án (VD: Tội cố ý gây thương tích – 3 năm tù)" style={inputStyle} />
            </div>
            <div style={{ background: "#fefce8", border: "1px solid #fef08a", borderRadius: 6, padding: "10px 14px", color: "#854d0e", fontSize: 12, display: "flex", alignItems: "center", gap: 8, fontFamily: F, marginBottom: 12 }}>
              <span style={{ fontSize: 14 }}>⚠️</span> Chọn một tội danh để xem hoặc thêm hình phạt.
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Hình phạt tổng hợp</label>
              <input placeholder="Nhập hình phạt tổng hợp" style={inputStyle} />
            </div>
          </div>

          {/* Section: THÔNG TIN THỐNG KÊ */}
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 18 }}>
            <div style={sectionHeaderStyle}><span style={{ color: RED }}>⊟</span> Thông tin thống kê</div>
            <div style={{ display: "flex", gap: 40, alignItems: "center", fontSize: 12, fontFamily: F, color: TEXT }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 500 }}>
                <input type="checkbox" style={{ width: 15, height: 15, accentColor: RED }} /> Đầu vụ
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 500 }}>
                <input type="checkbox" style={{ width: 15, height: 15, accentColor: RED }} /> Trẻ vị thành niên
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 500 }}>
                <input type="checkbox" style={{ width: 15, height: 15, accentColor: RED }} /> Tái phạm, tái phạm nguy hiểm
              </label>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div style={{ padding: "14px 24px", borderTop: `1px solid ${BORDER}`, background: "#fff", display: "flex", justifyContent: "center", gap: 14, flexShrink: 0 }}>
          <button onClick={handleSave} style={{ padding: "8px 32px", background: RED, color: "#fff", border: "none", borderRadius: 5, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: F }}>
            Lưu
          </button>
          <button onClick={onClose} style={{ padding: "8px 28px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 5, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: F }}>
            Đóng
          </button>
        </div>
      </div>
    </>
  );
}

export function TabThongTin({ detail, userRole }: { detail?: VuAnDetailData; userRole?: UserRoleType }) {
  // Lấy Loại án mặc định từ detail (nếu có) hoặc dựa trên userRole
  const getInitialLoaiAn = (): LoaiAn => {
    if (detail?.loaiAn && LOAI_AN_OPTIONS.includes(detail.loaiAn as LoaiAn)) {
      return detail.loaiAn as LoaiAn;
    }
    if (userRole === "vu-1" || userRole === "hinh-su") return "Hình sự";
    if (userRole === "vu-2" || userRole === "dan-su") return "Dân sự";
    if (userRole === "vu-3") return "Kinh doanh thương mại";
    if (userRole === "vu-4" || userRole === "hanh-chinh") return "Hành chính";
    return "Hình sự";
  };

  const [selectedLoaiAn, setSelectedLoaiAn] = useState<LoaiAn>(getInitialLoaiAn());
  const subHdr: React.CSSProperties = { display: "flex", alignItems: "center", padding: "10px 0 8px", borderBottom: `1px solid ${BORDER}`, marginBottom: 10 };

  // Cập nhật selectedLoaiAn khi userRole thay đổi
  useEffect(() => {
    if (userRole === "vu-1" || userRole === "hinh-su") setSelectedLoaiAn("Hình sự");
    else if (userRole === "vu-2" || userRole === "dan-su") setSelectedLoaiAn("Dân sự");
    else if (userRole === "vu-3") setSelectedLoaiAn("Kinh doanh thương mại");
    else if (userRole === "vu-4" || userRole === "hanh-chinh") setSelectedLoaiAn("Hành chính");
  }, [userRole]);

  // Cập nhật selectedLoaiAn khi prop detail thay đổi
  useEffect(() => {
    if (detail?.loaiAn && LOAI_AN_OPTIONS.includes(detail.loaiAn as LoaiAn)) {
      setSelectedLoaiAn(detail.loaiAn as LoaiAn);
    }
  }, [detail?.loaiAn]);

  // Lấy dữ liệu mock phù hợp cho Loại án hiện tại
  const mock = MOCK_DATA_BY_LOAI_AN[selectedLoaiAn] || MOCK_DATA_BY_LOAI_AN["Hình sự"];
  const isVu1 = userRole === "vu-1" || userRole === "hinh-su" || selectedLoaiAn === "Hình sự";

  // States hỗ trợ xem / chỉnh sửa thông tin thêm
  const [thoiHieu, setThoiHieu] = useState(mock.thongTinThem.thoiHieuDefault);
  const [denNghiOpen, setDenNghiOpen] = useState(mock.denNghiGDT.hasData);
  const [quanHePL, setQuanHePL] = useState(mock.thongTinThem.quanHePL);
  const [quanHePLThongKe, setQuanHePLThongKe] = useState(mock.thongTinThem.quanHePLThongKe);

  // State quản lý popup thêm mới thông tin khiếu nại
  const [showModalKhieuNai, setShowModalKhieuNai] = useState(false);
  const [khieuNaiList, setKhieuNaiList] = useState<Array<{ stt: number; nguoiKhieuNai: string; nguoiDuocKhieuNai: string; noiDungKhieuNai?: string }>>([]);
  const [formNguoiKhieuNai, setFormNguoiKhieuNai] = useState("");
  const [formNguoiDuocKhieuNai, setFormNguoiDuocKhieuNai] = useState("");
  const [formNoiDungKhieuNai, setFormNoiDungKhieuNai] = useState("");

  // State quản lý drawer thêm mới danh sách bị cáo
  const [showBiCaoDrawer, setShowBiCaoDrawer] = useState(false);
  const [biCaoList, setBiCaoList] = useState<NguoiLienQuanRow[]>(mock.nguoiThamGiaToTung.nhom1.rows);

  const handleSaveBiCao = (newBiCao: any) => {
    setBiCaoList(prev => [...prev, { ...newBiCao, stt: prev.length + 1 }]);
  };

  const handleAddKhieuNai = () => {
    if (!formNguoiKhieuNai || !formNguoiDuocKhieuNai) return;
    const newRow = {
      stt: khieuNaiList.length + 1,
      nguoiKhieuNai: formNguoiKhieuNai,
      nguoiDuocKhieuNai: formNguoiDuocKhieuNai,
      noiDungKhieuNai: formNoiDungKhieuNai || "—"
    };
    setKhieuNaiList([...khieuNaiList, newRow]);
    setShowModalKhieuNai(false);
    setFormNguoiKhieuNai("");
    setFormNguoiDuocKhieuNai("");
    setFormNoiDungKhieuNai("");
  };

  // Khi chọn Loại án khác, đồng bộ lại state theo mock tương ứng
  useEffect(() => {
    setThoiHieu(mock.thongTinThem.thoiHieuDefault);
    setDenNghiOpen(mock.denNghiGDT.hasData);
    setQuanHePL(mock.thongTinThem.quanHePL);
    setQuanHePLThongKe(mock.thongTinThem.quanHePLThongKe);
  }, [selectedLoaiAn]);

  // Merge dữ liệu thực từ detail nếu có
  // const displayMaVuAn = detail ? `${detail.maVuAn}: ${detail.tenVuAn}` : mock.thongTinChung.maVuAn;
  const displayLoaiBanAn = detail?.loaiBienAn || mock.thongTinChung.loaiBanAn;
  const displayThuTuc = detail?.namGiaiQuyet || mock.thongTinChung.thuTucGiaiQuyet;
  const displaySoNgayBA = detail?.soBanAn || mock.thongTinChung.soBanAn;
  const displayNgayBA = detail?.ngayBanAn || mock.thongTinChung.ngayBanAn;
  const displayToa = detail?.toaXetXu || mock.thongTinChung.toaRaBanAn;
  const displayNguoiDoan = detail?.nguoiDoan || mock.thongTinChung.nguoiDon;

  const isKhieuNai = Boolean(
    (detail as any)?.isKhieuNai ||
    (detail as any)?.entityWord === "Khiếu nại" ||
    (detail as any)?.moduleLabel === "Quản lý khiếu nại" ||
    // (typeof (detail as any)?.maVuAn === "string" && ((detail as any).maVuAn.startsWith("KN") || (detail as any).maVuAn.includes("KN"))) ||
    (typeof (detail as any)?.id === "string" && (detail as any).id.includes("KN")) ||
    (typeof (detail as any)?.tenVuAn === "string" && (detail as any).tenVuAn.toLowerCase().includes("khiếu nại"))
  );

  const detailTags: string[] = (detail as any)?.tags || [];
  const hasAnChiDao = detailTags.includes("an-chi-dao") || detailTags.includes("Án chỉ đạo") || (detail as any)?.anDacThu === "an-chi-dao" || (detail as any)?.anDacThu === "Án chỉ đạo";
  const hasAnQuocHoi = detailTags.includes("an-quoc-hoi") || detailTags.includes("Án quốc hội") || (detail as any)?.anDacThu === "an-quoc-hoi" || (detail as any)?.anDacThu === "Án quốc hội";

  const isQuyetDinhHeader =
    (detail as any)?.loaiBienAn?.toLowerCase().includes("quyết định") ||
    mock.thongTinChung.loaiBanAn?.toLowerCase().includes("quyết định") ||
    displaySoNgayBA?.toUpperCase().includes("QĐ") ||
    displaySoNgayBA?.toUpperCase().includes("QD");
  const docCodeHeader = isQuyetDinhHeader ? "QD" : "BA";

  const isPhucThamHeader =
    (detail as any)?.capXetXu?.toLowerCase().includes("phúc thẩm") ||
    (detail as any)?.loaiBienAn?.toLowerCase().includes("phúc thẩm") ||
    mock.thongTinChung.loaiBanAn?.toLowerCase().includes("phúc thẩm") ||
    displaySoNgayBA?.toUpperCase().includes("PT");
  const capCodeHeader = isPhucThamHeader ? "PT" : "ST";
  const baCodeHeader = `${docCodeHeader}${capCodeHeader}`;

  return (
    <div style={{ padding: 20 }}>

      {/* ── THÔNG TIN CHUNG ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "10px 16px", background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>
            {isKhieuNai ? "THÔNG TIN CHUNG CỦA VỤ VIỆC KHIẾU NẠI" : "THÔNG TIN CHUNG CỦA VỤ ÁN"}
          </span>

        </div>
        {hasAnChiDao && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", background: "#fef9c3", border: "1px solid #ca8a04", borderRadius: 4, fontSize: 11, fontWeight: 700, color: "#92400e", fontFamily: F }}>⭐ Án chỉ đạo</span>
        )}
        {hasAnQuocHoi && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", background: "#dbeafe", border: "1px solid #3b82f6", borderRadius: 4, fontSize: 11, fontWeight: 700, color: "#1e40af", fontFamily: F }}>🏛 Án QH</span>
        )}
        {mock.thongTinChung.badges && mock.thongTinChung.badges.map((b: any, i: number) => (
          <Badge key={i} color={b.color} bg={b.bg}>{b.label}</Badge>
        ))}
        {/* 4-column table: label | value | label | value */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              {/* <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, width: "12%", whiteSpace: "nowrap" as const }}>Mã vụ án</td> */}
              {/* <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, width: "38%" }}>{displayMaVuAn}</td> */}
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, width: "12%", whiteSpace: "nowrap" as const }}>Số {baCodeHeader}</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{displaySoNgayBA}</td>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap" as const }}>Ngày {baCodeHeader}</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{displayNgayBA}</td>


            </tr>
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap" as const }}>Loại án</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>{detail?.loaiAn || mock.thongTinChung.loaiAn || "Hình sự"}</td>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap" as const }}>Tòa ra {baCodeHeader}</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>{displayToa}</td>
            </tr>
            <tr>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, whiteSpace: "nowrap" as const, verticalAlign: "top" }}>Công văn</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, borderRight: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span>{mock.thongTinChung.congVan.soNgay}</span>
                  <span style={{ fontSize: 11, color: MUTED }}>{mock.thongTinChung.congVan.donVi}</span>
                  <span style={{ fontSize: 11, color: MUTED, fontStyle: "italic" }}>{mock.thongTinChung.congVan.loaiCongVan}</span>
                </div>
              </td>
              <td style={{ ...TD_STYLE, background: BG, fontWeight: 600, fontSize: 11, color: MUTED, borderRight: `1px solid ${BORDER}`, whiteSpace: "nowrap" as const, verticalAlign: "top" }}>Chỉ đạo</td>
              <td style={{ ...TD_STYLE, fontSize: 12, color: TEXT, verticalAlign: "top" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontWeight: 700, color: RED }}>{mock.thongTinChung.chiDao.nguoiChiDao}</span>
                  <span style={{ fontSize: 11, color: MUTED }}>{mock.thongTinChung.chiDao.chucVu}</span>
                  <span style={{ fontSize: 11, color: TEXT }}>{mock.thongTinChung.chiDao.noiDung}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* ── QUÁ TRÌNH GIẢI QUYẾT ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ color: "#f59e0b", fontSize: 14 }}>⚖</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F, flex: 1 }}>QUÁ TRÌNH GIẢI QUYẾT</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 45 }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "42%" }} />
            <col style={{ width: "26%" }} />
          </colgroup>
          <thead>
            <tr>
              {["STT", "VỤ ÁN", "THÔNG TIN BẢN ÁN/QUYẾT ĐỊNH", "THẨM PHÁN XÉT XỬ"].map(h => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mock.quaTrinhGiaiQuyet.map((r, idx) => {
              const isQuyetDinh =
                (r.loai && r.loai.toLowerCase().includes("quyết định")) ||
                (r.soBA && (r.soBA.toUpperCase().includes("QĐ") || r.soBA.toUpperCase().includes("QD")));
              const loaiCode = isQuyetDinh ? "QD" : "BA";

              const isPhucTham =
                (r.giai && r.giai.toLowerCase().includes("phúc thẩm")) ||
                (r.capXetXu && r.capXetXu.toLowerCase().includes("phúc thẩm")) ||
                (r.soBA && r.soBA.toUpperCase().includes("PT"));
              const giaiCode = isPhucTham ? "PT" : "ST";

              const labelSo = `Số ${loaiCode}${giaiCode}:`;
              const labelNgay = `Ngày ${loaiCode}${giaiCode}:`;

              return (
                <tr key={r.stt} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...TD_STYLE, textAlign: "center", color: MUTED, fontSize: 12, fontWeight: 500 }}>{r.stt}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11.5, color: "#2563eb", fontWeight: 600, lineHeight: 1.5 }}>{r.vuAn}</td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT, lineHeight: 1.6 }}>
                    <div>
                      <b>{labelSo}</b> <span style={{ fontWeight: 600 }}>{r.soBA}</span>
                      <span style={{ margin: "0 8px", color: "#cbd5e1" }}>|</span>
                      <b>{labelNgay}</b> <span style={{ color: TEXT }}>{r.ngayBA}</span>
                    </div>
                    <div><b>Tại:</b> {r.toa}</div>
                  </td>
                  <td style={{ ...TD_STYLE, fontSize: 11, color: TEXT }}>
                    {r.thamPhans.reduce<React.ReactNode[]>((acc, tp, i) => {
                      if (i % 2 === 0) {
                        acc.push(
                          <div key={i} style={{ marginBottom: i < r.thamPhans.length - 2 ? 6 : 0, lineHeight: 1.4 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: TEXT, fontFamily: F }}>{tp}</div>
                            {r.thamPhans[i + 1] && <div style={{ fontSize: 10.5, color: MUTED, fontFamily: F, fontStyle: "italic" }}>{r.thamPhans[i + 1]}</div>}
                          </div>
                        );
                      }
                      return acc;
                    }, [])}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Thông tin / Thời hiệu */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "12px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: RED, display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: F }}>Thông tin</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, color: MUTED, fontFamily: F }}>Thời hiệu giải quyết</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {getThoiHieuOptions(userRole, selectedLoaiAn).map(({ val, label }) => (
                <label key={val} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: TEXT, fontFamily: F, cursor: "pointer", whiteSpace: "nowrap" }}>
                  <input type="radio" name="thoiHieu" value={val} checked={thoiHieu === val || (!thoiHieu && val === "1 năm")} onChange={() => setThoiHieu(val)}
                    style={{ width: 14, height: 14, accentColor: RED, cursor: "pointer" }} />
                  {label}
                </label>
              ))}
            </div>
            {!isVu1 && (
              <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: RED }}>*</span> Quan hệ pháp luật</label>
                  <input
                    value={quanHePL}
                    onChange={e => setQuanHePL(e.target.value)}
                    style={{ padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 11, color: TEXT, fontFamily: F }}><span style={{ color: RED }}>*</span> Quan hệ pháp luật thống kê</label>
                  <select
                    value={quanHePLThongKe}
                    onChange={e => setQuanHePLThongKe(e.target.value)}
                    style={{ padding: "7px 10px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, outline: "none", width: "100%", background: "#fff", boxSizing: "border-box", cursor: "pointer" }}>
                    {mock.thongTinThem.quanHePLThongKeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* ── THÔNG TIN NGƯỜI LIÊN QUAN ── */}
      <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ padding: "11px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ color: RED, marginRight: 6 }}>⊟</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: F }}>
            {isKhieuNai ? "NGƯỜI ĐỨNG ĐƠN" : "NGƯỜI THAM GIA TỐ TỤNG"}
          </span>
        </div>
        <div style={{ padding: "0 16px 16px" }}>

          {selectedLoaiAn === "Hình sự" && !isKhieuNai ? (
            <>
              {/* Bảng 1: Thông tin khiếu nại */}

              {/* Bảng 2: Danh sách bị cáo */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px", borderTop: `1px solid ${BORDER}`, marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: F }}>
                  <span style={{ color: RED, marginRight: 4 }}>*</span>
                  <span style={{ color: TEXT }}>Danh sách bị cáo</span>
                </div>
                <button
                  onClick={() => setShowBiCaoDrawer(true)}
                  style={{ background: RED, color: "#fff", border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontSize: 11.5, fontWeight: 600, fontFamily: F }}>
                  + Thêm mới
                </button>
              </div>
              <NguoiLienQuanTable rows={biCaoList} showToiDanh={true} defaultDiaVi="Bị cáo" />

              {/* Bảng 3: Bị hại (giữ nguyên) */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px", borderTop: `1px solid ${BORDER}`, marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: F }}>
                  <span style={{ color: RED, marginRight: 4 }}>*</span>
                  <span style={{ color: TEXT }}>{mock.nguoiThamGiaToTung.nhom2.title.replace("* ", "")}</span>
                </div>
                <button style={{ background: RED, color: "#fff", border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontSize: 11.5, fontWeight: 600, fontFamily: F }}>
                  + Thêm mới
                </button>
              </div>
              <NguoiLienQuanTable rows={mock.nguoiThamGiaToTung.nhom2.rows} showToiDanh={false} showDiaVi={false} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px", borderTop: `1px solid ${BORDER}`, marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: F }}>
                  <span style={{ color: RED, marginRight: 4 }}>*</span>
                  <span style={{ color: TEXT }}>Thông tin khiếu nại</span>
                </div>
                <button
                  onClick={() => setShowModalKhieuNai(true)}
                  style={{ background: RED, color: "#fff", border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontSize: 11.5, fontWeight: 600, fontFamily: F }}>
                  + Thêm mới
                </button>
              </div>
              <ThongTinKhieuNaiTable rows={khieuNaiList} />

            </>
          ) : (
            <>
              {/* Nhóm 1: Người khiếu nại / Nguyên đơn / Người khởi kiện */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px", marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: F }}>
                  <span style={{ color: RED, marginRight: 4 }}>*</span>
                  <span style={{ color: TEXT }}>{isKhieuNai ? "Người đứng đơn" : mock.nguoiThamGiaToTung.nhom1.title.replace("* ", "")}</span>
                </div>
                <button style={{ background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontSize: 11.5, fontWeight: 600, fontFamily: F }}>+ Thêm mới</button>
              </div>
              <NguoiLienQuanTable
                rows={
                  selectedLoaiAn !== "Hình sự" && selectedLoaiAn !== "Hành chính" && !isKhieuNai
                    ? [{ stt: 1, hoTen: "Nguyên đơn", ngaySinh: "2001", cccd: "123456789", diaChi: "" }]
                    : mock.nguoiThamGiaToTung.nhom1.rows
                }
                noMarginBottom={isKhieuNai}
                showToiDanh={false}
                showDiaVi={false}
                defaultDiaVi="Nguyên đơn"
              />

              {!isKhieuNai && (
                <>
                  {/* Nhóm 2: Bị đơn (Dân sự/KDTM) / Người bị kiện (Hành chính) */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px", borderTop: `1px solid ${BORDER}`, marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: F }}>
                      <span style={{ color: RED, marginRight: 4 }}>*</span>
                      <span style={{ color: TEXT }}>{mock.nguoiThamGiaToTung.nhom2.title.replace("* ", "")}</span>
                    </div>
                    <button style={{ background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontSize: 11.5, fontWeight: 600, fontFamily: F }}>+ Thêm mới</button>
                  </div>
                  <NguoiLienQuanTable
                    rows={
                      selectedLoaiAn !== "Hình sự" && selectedLoaiAn !== "Hành chính"
                        ? [{ stt: 1, hoTen: "Bị đơn", ngaySinh: "12/12/2001", cccd: "123456780", diaChi: "" }]
                        : mock.nguoiThamGiaToTung.nhom2.rows
                    }
                    showToiDanh={false}
                    showDiaVi={false}
                    defaultDiaVi="Bị đơn"
                  />

                  {/* Nhóm 3: Người có quyền lợi, nghĩa vụ liên quan */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px", borderTop: `1px solid ${BORDER}`, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: F }}>{mock.nguoiThamGiaToTung.nhom3.title}</span>
                      <input type="checkbox" style={{ cursor: "pointer" }} />
                    </div>
                    <button style={{ background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontSize: 11.5, fontWeight: 600, fontFamily: F }}>+ Thêm mới</button>
                  </div>
                  <NguoiLienQuanTable
                    rows={
                      selectedLoaiAn !== "Hình sự" && selectedLoaiAn !== "Hành chính"
                        ? []
                        : mock.nguoiThamGiaToTung.nhom3.rows
                    }
                    noMarginBottom
                    showToiDanh={false}
                    showDiaVi={false}
                    defaultDiaVi="Người có quyền lợi, NV liên quan"
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Nút Sửa thông tin ── */}
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 12 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 32px", background: RED, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: F }}>
          ✏ Sửa thông tin
        </button>
      </div>

      {/* ── MODAL THÊM THÔNG TIN KHIẾU NẠI ── */}
      {showModalKhieuNai && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", borderRadius: 12, width: 640, maxWidth: "92vw", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04)", overflow: "hidden", fontFamily: F }}>
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: TEXT }}>Thêm thông tin khiếu nại</h3>
              <button
                onClick={() => setShowModalKhieuNai(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 18, lineHeight: 1, padding: 4 }}>
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "8px 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Row 1: Select 1 & Select 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: TEXT }}>
                    <span style={{ color: RED, marginRight: 4 }}>*</span>Người khiếu nại
                  </label>
                  <select
                    value={formNguoiKhieuNai}
                    onChange={e => setFormNguoiKhieuNai(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, outline: "none", background: "#fff", color: formNguoiKhieuNai ? TEXT : "#9ca3af", cursor: "pointer" }}>
                    <option value="" disabled hidden>Chọn người khiếu nại</option>
                    <option value="Đặng Thị Dương" style={{ color: TEXT }}>Đặng Thị Dương</option>
                    <option value="Nguyễn Văn Bình" style={{ color: TEXT }}>Nguyễn Văn Bình</option>
                    <option value="Trần Anh Tuấn" style={{ color: TEXT }}>Trần Anh Tuấn</option>
                    <option value="Dương Thu Hằng" style={{ color: TEXT }}>Dương Thu Hằng</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: TEXT }}>
                    <span style={{ color: RED, marginRight: 4 }}>*</span>Người được khiếu nại
                  </label>
                  <select
                    value={formNguoiDuocKhieuNai}
                    onChange={e => setFormNguoiDuocKhieuNai(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, outline: "none", background: "#fff", color: formNguoiDuocKhieuNai ? TEXT : "#9ca3af", cursor: "pointer" }}>
                    <option value="" disabled hidden>Chọn người được khiếu nại</option>
                    <option value="Viện kiểm sát nhân dân tỉnh Bắc Ninh" style={{ color: TEXT }}>Nguyễn Viết Khánh</option>
                    <option value="Tòa án nhân dân tỉnh Bắc Ninh" style={{ color: TEXT }}>Nguyễn Trọng Tuấn </option>
                    <option value="Tòa án nhân dân khu vực 5 - Bắc Ninh" style={{ color: TEXT }}>Lê Tuấn Đạt</option>
                    <option value="Ủy ban nhân dân tỉnh Bắc Ninh" style={{ color: TEXT }}>Lê Quang Hà</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Textarea Nội dung khiếu nại */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: TEXT }}>Nội dung khiếu nại</label>
                <textarea
                  rows={3}
                  value={formNoiDungKhieuNai}
                  onChange={e => setFormNoiDungKhieuNai(e.target.value)}
                  placeholder="Nhập nội dung khiếu nại..."
                  style={{ padding: "8px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 6, outline: "none", fontFamily: F, resize: "vertical" }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 20px 16px" }}>
              <button
                onClick={() => setShowModalKhieuNai(false)}
                style={{ padding: "7px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                Hủy
              </button>
              <button
                onClick={handleAddKhieuNai}
                style={{ padding: "7px 24px", background: RED, border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DRAWER THÊM DANH SÁCH BỊ CÁO ── */}
      <SlideDrawerAddBiCao
        open={showBiCaoDrawer}
        onClose={() => setShowBiCaoDrawer(false)}
        onSave={handleSaveBiCao}
      />
    </div>
  );
}
