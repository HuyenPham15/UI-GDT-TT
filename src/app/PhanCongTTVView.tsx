import React, { useState } from "react";
import {
  Search,
  RotateCcw,
  Calendar,
  ChevronDown,
  ChevronUp,
  Printer,
  Eye,
  X,
  UserCheck,
} from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, TH_STYLE, TD_STYLE } from "./shared";
import { getSoBALabel } from "./AppHelpers";
import { LOAI_AN_OPTIONS } from "./data";

const DANH_SACH_TTV = [
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

const DANH_SACH_LANH_DAO = [
  "Phạm Thị Bích Ngọc - Phó Vụ trưởng",
  "Lê Thị Thu Hiền - Phó Vụ trưởng",
  "Nguyễn Như Thắng - Vụ trưởng",
  "Nguyễn Biên Thùy - Phó Vụ trưởng",
  "Trần Hồng Hà - Vụ trưởng",
  "Nguyễn Văn Cường - Phó Vụ trưởng",
];

interface CaseRow {
  id: number;
  soThuLy: string;
  ngayThuLy: string;
  soBA: string;
  ngayBA: string;
  toaAn: string;
  giaiDoan: string;
  qhpl: string;
  ndkn: string;
  nbk: string;
  ngayNhanTHS: string;
  giaiDoanPC: string;
  ngayPCTTV: string;
  ttv: string;
  ngayPCLD: string;
  lanhDao: string;
  hasGDXX?: boolean;
  ngayPCTTV_XX?: string;
  ttv_XX?: string;
  ngayPCLD_XX?: string;
  lanhDao_XX?: string;
}

const INITIAL_CHUA_PHAN_CONG: CaseRow[] = [
  {
    id: 1,
    soThuLy: "125/2026/TL-GĐT",
    ngayThuLy: "15/07/2026",
    soBA: "12/2026/HS-PT",
    ngayBA: "20/05/2026",
    toaAn: "Tòa án nhân dân cấp cao tại Hà Nội",
    giaiDoan: "Phúc thẩm",
    qhpl: "Tội cố ý gây thương tích",
    ndkn: "Đặng Thị Dương",
    nbk: "Hoàng Ngọc Hoa",
    ngayNhanTHS: "18/07/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
  {
    id: 2,
    soThuLy: "89/2026/TL-GĐT",
    ngayThuLy: "18/07/2026",
    soBA: "56/2026/HS-ST",
    ngayBA: "03/06/2026",
    toaAn: "Tòa án nhân dân tỉnh Bắc Ninh",
    giaiDoan: "Sơ thẩm",
    qhpl: "Tội lừa đảo chiếm đoạt tài sản",
    ndkn: "Phạm Ngọc Hoa",
    nbk: "Hoàng Hoa Vân",
    ngayNhanTHS: "20/07/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
  {
    id: 3,
    soThuLy: "204/2026/TL-TT",
    ngayThuLy: "20/07/2026",
    soBA: "108/2026/HC-PT",
    ngayBA: "07/06/2026",
    toaAn: "Tòa án nhân dân TP Đà Nẵng",
    giaiDoan: "Phúc thẩm",
    qhpl: "Khiếu kiện quyết định thu hồi đất",
    ndkn: "Lê Văn Hùng",
    nbk: "UBND quận Hải Châu",
    ngayNhanTHS: "22/07/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
  {
    id: 4,
    soThuLy: "312/2026/TL-GĐT",
    ngayThuLy: "22/07/2026",
    soBA: "45/2026/DS-ST",
    ngayBA: "12/06/2026",
    toaAn: "Tòa án nhân dân tỉnh Hà Nam",
    giaiDoan: "Sơ thẩm",
    qhpl: "Tranh chấp thừa kế tài sản",
    ndkn: "Nguyễn Văn Tuấn",
    nbk: "Vũ Thị Hương",
    ngayNhanTHS: "24/07/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
  {
    id: 5,
    soThuLy: "415/2026/TL-GĐT",
    ngayThuLy: "25/07/2026",
    soBA: "78/2026/HS-PT",
    ngayBA: "15/06/2026",
    toaAn: "Tòa án nhân dân cấp cao tại TP.HCM",
    giaiDoan: "Phúc thẩm",
    qhpl: "Tội vi phạm quy định giao thông đường bộ",
    ndkn: "Trần Quốc Bảo",
    nbk: "Nguyễn Văn Cường",
    ngayNhanTHS: "26/07/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
  {
    id: 6,
    soThuLy: "508/2026/TL-TT",
    ngayThuLy: "28/07/2026",
    soBA: "92/2026/KDTM-ST",
    ngayBA: "18/06/2026",
    toaAn: "Tòa án nhân dân thành phố Hà Nội",
    giaiDoan: "Sơ thẩm",
    qhpl: "Tranh chấp hợp đồng tín dụng",
    ndkn: "Ngân hàng TMCP X",
    nbk: "Công ty TNHH Hưng Thịnh",
    ngayNhanTHS: "30/07/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
  {
    id: 7,
    soThuLy: "612/2026/TL-GĐT",
    ngayThuLy: "01/08/2026",
    soBA: "115/2026/HS-ST",
    ngayBA: "20/06/2026",
    toaAn: "Tòa án nhân dân tỉnh Hải Dương",
    giaiDoan: "Sơ thẩm",
    qhpl: "Tội vi phạm quy định về quản lý đất đai",
    ndkn: "Hoàng Thị Mai",
    nbk: "Đào Văn Nam",
    ngayNhanTHS: "03/08/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
  {
    id: 8,
    soThuLy: "720/2026/TL-GĐT",
    ngayThuLy: "04/08/2026",
    soBA: "130/2026/HC-PT",
    ngayBA: "25/06/2026",
    toaAn: "Tòa án nhân dân tỉnh Đồng Nai",
    giaiDoan: "Phúc thẩm",
    qhpl: "Khiếu kiện quyết định bồi thường GPMB",
    ndkn: "Vũ Đình Trọng",
    nbk: "UBND TP Biên Hòa",
    ngayNhanTHS: "05/08/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "-",
    ttv: "-",
    ngayPCLD: "-",
    lanhDao: "-",
  },
];

const INITIAL_DA_PHAN_CONG: CaseRow[] = [
  {
    id: 101,
    soThuLy: "3539/2026/TL-GĐT",
    ngayThuLy: "25/05/2026",
    soBA: "35/2026/HS-PT",
    ngayBA: "20/05/2026",
    toaAn: "Tòa án nhân dân tỉnh An Giang",
    giaiDoan: "Phúc thẩm",
    qhpl: "Tội lạm dụng tín nhiệm chiếm đoạt tài sản",
    ndkn: "Nguyễn Văn Rô",
    nbk: "Phạm Văn Tiến",
    ngayNhanTHS: "10/06/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "25/05/2026",
    ttv: "Nguyễn Thị Thúy Hường",
    ngayPCLD: "25/05/2026",
    lanhDao: "Phạm Thị Bích Ngọc - Phó Vụ trưởng",
    hasGDXX: true,
    ngayPCTTV_XX: "25/06/2026",
    ttv_XX: "Nguyễn Thị Thúy Hường",
    ngayPCLD_XX: "25/06/2026",
    lanhDao_XX: "Phạm Thị Bích Ngọc - Phó Vụ trưởng",
  },
  {
    id: 102,
    soThuLy: "2328/2026/TL-TT",
    ngayThuLy: "02/06/2026",
    soBA: "32/2026/HS-ST",
    ngayBA: "20/05/2026",
    toaAn: "Tòa án nhân dân tỉnh Bắc Ninh",
    giaiDoan: "Sơ thẩm",
    qhpl: "Tội cố ý gây thương tích",
    ndkn: "Hoàng Anh Việt",
    nbk: "Trần Văn Cường",
    ngayNhanTHS: "15/06/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "05/06/2026",
    ttv: "Vũ Xuân Hiền",
    ngayPCLD: "05/06/2026",
    lanhDao: "Lê Thị Thu Hiền - Phó Vụ trưởng",
  },
  {
    id: 103,
    soThuLy: "2398/2026/TL-GĐT",
    ngayThuLy: "27/05/2026",
    soBA: "28/2026/HC-ST",
    ngayBA: "20/05/2026",
    toaAn: "Tòa án nhân dân tỉnh An Giang",
    giaiDoan: "Sơ thẩm",
    qhpl: "Khiếu kiện quyết định xử phạt vi phạm hành chính",
    ndkn: "Hoàng Văn Tuấn",
    nbk: "Chủ tịch UBND tỉnh An Giang",
    ngayNhanTHS: "18/06/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "27/05/2026",
    ttv: "Nguyễn Thị Hường",
    ngayPCLD: "27/05/2026",
    lanhDao: "Nguyễn Như Thắng - Vụ trưởng",
    hasGDXX: true,
    ngayPCTTV_XX: "25/06/2026",
    ttv_XX: "Nguyễn Thị Hường",
    ngayPCLD_XX: "25/06/2026",
    lanhDao_XX: "Nguyễn Như Thắng - Vụ trưởng",
  },
  {
    id: 104,
    soThuLy: "2371/2026/TL-GĐT",
    ngayThuLy: "27/05/2026",
    soBA: "158/2026/DS-PT",
    ngayBA: "23/05/2026",
    toaAn: "Tòa án nhân dân thành phố Hà Nội",
    giaiDoan: "Phúc thẩm",
    qhpl: "Tranh chấp quyền sử dụng đất",
    ndkn: "Nguyễn Văn Bình",
    nbk: "Nguyễn Thị Kim",
    ngayNhanTHS: "20/06/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "01/06/2026",
    ttv: "Nguyễn Đức Thiện",
    ngayPCLD: "01/06/2026",
    lanhDao: "Nguyễn Như Thắng - Vụ trưởng",
  },
  {
    id: 105,
    soThuLy: "5468/2026/TL-GĐT",
    ngayThuLy: "08/06/2026",
    soBA: "78/2026/DS-ST",
    ngayBA: "01/06/2026",
    toaAn: "Tòa án nhân dân tỉnh Vĩnh Phúc",
    giaiDoan: "Sơ thẩm",
    qhpl: "Tranh chấp hợp đồng đặt cọc",
    ndkn: "Đỗ Văn Hải",
    nbk: "Trần Thị Nga",
    ngayNhanTHS: "22/06/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "10/06/2026",
    ttv: "Vũ Diệu Thúy",
    ngayPCLD: "10/06/2026",
    lanhDao: "Nguyễn Biên Thùy - Phó Vụ trưởng",
    hasGDXX: true,
    ngayPCTTV_XX: "28/06/2026",
    ttv_XX: "Vũ Diệu Thúy",
    ngayPCLD_XX: "28/06/2026",
    lanhDao_XX: "Nguyễn Biên Thùy - Phó Vụ trưởng",
  },
  {
    id: 106,
    soThuLy: "5469/2026/TL-TT",
    ngayThuLy: "15/06/2026",
    soBA: "112/2026/HC-ST",
    ngayBA: "10/06/2026",
    toaAn: "Tòa án nhân dân TP Cần Thơ",
    giaiDoan: "Sơ thẩm",
    qhpl: "Khiếu kiện bồi thường thiệt hại",
    ndkn: "Lê Thị Tuyết",
    nbk: "UBND TP Cần Thơ",
    ngayNhanTHS: "25/06/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "18/06/2026",
    ttv: "Đặng Thị Mai",
    ngayPCLD: "18/06/2026",
    lanhDao: "Phạm Thị Bích Ngọc - Phó Vụ trưởng",
  },
  {
    id: 107,
    soThuLy: "6712/2026/TL-GĐT",
    ngayThuLy: "20/06/2026",
    soBA: "95/2026/HS-PT",
    ngayBA: "12/06/2026",
    toaAn: "Tòa án nhân dân cấp cao tại Đà Nẵng",
    giaiDoan: "Phúc thẩm",
    qhpl: "Tội trộm cắp tài sản",
    ndkn: "Trần Văn Hùng",
    nbk: "Phạm Thị Nga",
    ngayNhanTHS: "28/06/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "22/06/2026",
    ttv: "Trần Văn Hưng",
    ngayPCLD: "22/06/2026",
    lanhDao: "Trần Hồng Hà - Vụ trưởng",
    hasGDXX: true,
    ngayPCTTV_XX: "02/07/2026",
    ttv_XX: "Trần Văn Hưng",
    ngayPCLD_XX: "02/07/2026",
    lanhDao_XX: "Trần Hồng Hà - Vụ trưởng",
  },
  {
    id: 108,
    soThuLy: "8910/2026/TL-GĐT",
    ngayThuLy: "25/06/2026",
    soBA: "140/2026/KDTM-PT",
    ngayBA: "18/06/2026",
    toaAn: "Tòa án nhân dân thành phố Hà Nội",
    giaiDoan: "Phúc thẩm",
    qhpl: "Tranh chấp hợp đồng mua bán hàng hóa",
    ndkn: "Công ty TNHH Vận tải Y",
    nbk: "Công ty CP Sản xuất Z",
    ngayNhanTHS: "30/06/2026",
    giaiDoanPC: "GĐ Giải quyết đơn",
    ngayPCTTV: "28/06/2026",
    ttv: "Hoàng Ngọc Chiêu",
    ngayPCLD: "28/06/2026",
    lanhDao: "Nguyễn Văn Cường - Phó Vụ trưởng",
    hasGDXX: true,
    ngayPCTTV_XX: "05/07/2026",
    ttv_XX: "Hoàng Ngọc Chiêu",
    ngayPCLD_XX: "05/07/2026",
    lanhDao_XX: "Nguyễn Văn Cường - Phó Vụ trưởng",
  },
];

const isRowHinhSu = (r?: CaseRow | null) => {
  if (!r) return false;
  const loai = (r as any).loaiAn ? String((r as any).loaiAn).toLowerCase() : "";
  const soBA = r.soBA ? r.soBA.toUpperCase() : "";
  const soTL = r.soThuLy ? r.soThuLy.toUpperCase() : "";
  const qh = r.qhpl ? r.qhpl.toLowerCase() : "";
  return (
    loai.includes("hình sự") ||
    soBA.includes("/HS") ||
    soTL.includes("/HS") ||
    qh.includes("tội")
  );
};

export function PhanCongTTVView() {
  const [activeTab, setActiveTab] = useState<"chua-phan-cong" | "da-phan-cong">("chua-phan-cong");
  const [phanCongMode, setPhanCongMode] = useState<"ngau-nhien" | "chi-dinh">("ngau-nhien");
  const [filterExpanded, setFilterExpanded] = useState(true);

  // Form Filter states
  const [fNgayTLTu, setFNgayTLTu] = useState("");
  const [fNgayTLDen, setFNgayTLDen] = useState("");
  const [fSoTL, setFSoTL] = useState("");
  const [fLoaiAn, setFLoaiAn] = useState("");
  const [fGiaiDoan, setFGiaiDoan] = useState("");
  const [fToaRaBA, setFToaRaBA] = useState("");
  const [fSoBA, setFSoBA] = useState("");
  const [fNgayBA, setFNgayBA] = useState("");
  const [fNguoiKN, setFNguoiKN] = useState("");
  const [fBiDon, setFBiDon] = useState("");
  const [fTTV, setFTTV] = useState("");
  const [fLanhDao, setFLanhDao] = useState("");

  // Table row data
  const [chuaPCRows, setChuaPCRows] = useState<CaseRow[]>(INITIAL_CHUA_PHAN_CONG);
  const [daPCRows, setDaPCRows] = useState<CaseRow[]>(INITIAL_DA_PHAN_CONG);

  // Selected row checkbox IDs
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Popups
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<CaseRow | null>(null);

  // Modal assign inputs
  const [assignTTV, setAssignTTV] = useState(DANH_SACH_TTV[0]);
  const [assignLD, setAssignLD] = useState(DANH_SACH_LANH_DAO[0]);

  const handleResetFilters = () => {
    setFNgayTLTu("");
    setFNgayTLDen("");
    setFSoTL("");
    setFLoaiAn("");
    setFGiaiDoan("");
    setFToaRaBA("");
    setFSoBA("");
    setFNgayBA("");
    setFNguoiKN("");
    setFBiDon("");
    setFTTV("");
    setFLanhDao("");
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>, list: CaseRow[]) => {
    if (e.target.checked) {
      const ids = list.map((r) => r.id);
      setSelectedIds(ids);
      if (activeTab === "chua-phan-cong" && phanCongMode === "chi-dinh") {
        setChuaPCRows((prevRows) =>
          prevRows.map((r) => {
            if (ids.includes(r.id)) {
              return {
                ...r,
                ttv: r.ttv === "-" ? DANH_SACH_TTV[0] : r.ttv,
                lanhDao: r.lanhDao === "-" ? DANH_SACH_LANH_DAO[0] : r.lanhDao,
              };
            }
            return r;
          })
        );
      }
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      if (activeTab === "chua-phan-cong" && phanCongMode === "chi-dinh" && next.includes(id)) {
        setChuaPCRows((prevRows) =>
          prevRows.map((r) => {
            if (r.id === id) {
              return {
                ...r,
                ttv: r.ttv === "-" ? DANH_SACH_TTV[0] : r.ttv,
                lanhDao: r.lanhDao === "-" ? DANH_SACH_LANH_DAO[0] : r.lanhDao,
              };
            }
            return r;
          })
        );
      }
      return next;
    });
  };

  const handleExecutePhanCong = () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng tích chọn ít nhất 1 vụ án để phân công TTV!");
      return;
    }

    if (phanCongMode === "ngau-nhien") {
      const assignedRows: CaseRow[] = [];
      const remainingRows: CaseRow[] = [];

      chuaPCRows.forEach((r) => {
        if (selectedIds.includes(r.id)) {
          const randTTV = DANH_SACH_TTV[Math.floor(Math.random() * DANH_SACH_TTV.length)];
          const randLD = DANH_SACH_LANH_DAO[Math.floor(Math.random() * DANH_SACH_LANH_DAO.length)];
          assignedRows.push({
            ...r,
            giaiDoanPC: "GĐ Giải quyết đơn",
            ngayPCTTV: "26/06/2026",
            ttv: randTTV,
            ngayPCLD: "26/06/2026",
            lanhDao: randLD,
          });
        } else {
          remainingRows.push(r);
        }
      });

      setChuaPCRows(remainingRows);
      setDaPCRows((prev) => [...assignedRows, ...prev]);
      setSelectedIds([]);
      alert(`Đã phân công ngẫu nhiên thành công ${assignedRows.length} vụ án cho Thẩm tra viên!`);
      setActiveTab("da-phan-cong");
    } else {
      const assignedRows: CaseRow[] = [];
      const remainingRows: CaseRow[] = [];

      chuaPCRows.forEach((r) => {
        if (selectedIds.includes(r.id)) {
          assignedRows.push({
            ...r,
            giaiDoanPC: "GĐ Giải quyết đơn",
            ngayPCTTV: "26/06/2026",
            ttv: r.ttv === "-" ? DANH_SACH_TTV[0] : r.ttv,
            ngayPCLD: "26/06/2026",
            lanhDao: r.lanhDao === "-" ? DANH_SACH_LANH_DAO[0] : r.lanhDao,
          });
        } else {
          remainingRows.push(r);
        }
      });

      setChuaPCRows(remainingRows);
      setDaPCRows((prev) => [...assignedRows, ...prev]);
      setSelectedIds([]);
      alert(`Đã phân công chỉ định thành công ${assignedRows.length} vụ án!`);
      setActiveTab("da-phan-cong");
    }
  };

  const handleConfirmChiDinh = () => {
    const assignedRows: CaseRow[] = [];
    const remainingRows: CaseRow[] = [];

    chuaPCRows.forEach((r) => {
      if (selectedIds.includes(r.id)) {
        assignedRows.push({
          ...r,
          giaiDoanPC: "GĐ Giải quyết đơn",
          ngayPCTTV: "26/06/2026",
          ttv: assignTTV,
          ngayPCLD: "26/06/2026",
          lanhDao: assignLD,
        });
      } else {
        remainingRows.push(r);
      }
    });

    setChuaPCRows(remainingRows);
    setDaPCRows((prev) => [...assignedRows, ...prev]);
    setSelectedIds([]);
    setShowAssignModal(false);
    alert(`Đã phân công chỉ định thành công cho Thẩm tra viên: ${assignTTV} và Lãnh đạo: ${assignLD}!`);
    setActiveTab("da-phan-cong");
  };

  const handleChangeTTV = (id: number, val: string, isXX: boolean) => {
    setDaPCRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          if (isXX) {
            return { ...row, ttv_XX: val };
          }
          return { ...row, ttv: val };
        }
        return row;
      })
    );
  };

  const handleChangeLĐ = (id: number, val: string, isXX: boolean) => {
    setDaPCRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          if (isXX) {
            return { ...row, lanhDao_XX: val };
          }
          return { ...row, lanhDao: val };
        }
        return row;
      })
    );
  };

  const handleChangeChuaPCTTV = (id: number, val: string) => {
    setChuaPCRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          return { ...row, ttv: val };
        }
        return row;
      })
    );
  };

  const handleChangeChuaPCLĐ = (id: number, val: string) => {
    setChuaPCRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          return { ...row, lanhDao: val };
        }
        return row;
      })
    );
  };

  const currentRows = activeTab === "chua-phan-cong" ? chuaPCRows : daPCRows;

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

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: MUTED,
    marginBottom: 4,
    fontFamily: F,
    display: "block",
  };

  const TH_CUSTOM: React.CSSProperties = {
    ...TH_STYLE,
    padding: "9px 12px",
    fontSize: 11,
    fontWeight: 700,
    color: "#374151",
    background: "#f8fafc",
    borderBottom: `1px solid ${BORDER}`,
    borderRight: `1px solid ${BORDER}`,
    whiteSpace: "nowrap",
  };

  const TD_CUSTOM: React.CSSProperties = {
    ...TD_STYLE,
    padding: "10px 12px",
    fontSize: 12,
    color: TEXT,
    borderBottom: `1px solid ${BORDER}`,
    borderRight: `1px solid ${BORDER}`,
    verticalAlign: "top",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "#f9fafb", fontFamily: F }}>
      {/* Breadcrumb Header */}
      <div style={{ padding: "10px 24px", fontSize: 12, color: MUTED, fontFamily: F, background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <span>Trang chủ</span> &nbsp;/&nbsp; <span>Quản lý án GĐT/TT</span> &nbsp;/&nbsp; <span style={{ color: TEXT, fontWeight: 600 }}>Danh sách phân công TTV</span>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Page Title */}
        <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: 0, fontFamily: F }}>
          Danh sách phân công TTV
        </h1>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 24, borderBottom: `1px solid ${BORDER}`, background: "transparent" }}>
          <button
            onClick={() => {
              setActiveTab("chua-phan-cong");
              setSelectedIds([]);
            }}
            style={{
              padding: "8px 4px 12px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "chua-phan-cong" ? `2.5px solid ${RED}` : "2.5px solid transparent",
              color: activeTab === "chua-phan-cong" ? RED : MUTED,
              fontWeight: activeTab === "chua-phan-cong" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            Chưa phân công TTV
          </button>
          <button
            onClick={() => {
              setActiveTab("da-phan-cong");
              setSelectedIds([]);
            }}
            style={{
              padding: "8px 4px 12px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "da-phan-cong" ? `2.5px solid ${RED}` : "2.5px solid transparent",
              color: activeTab === "da-phan-cong" ? RED : MUTED,
              fontWeight: activeTab === "da-phan-cong" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            Đã phân công TTV
          </button>
        </div>
        {/* Radio Option for Tab 1 */}
        {activeTab === "chua-phan-cong" && (
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: -4 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: TEXT, cursor: "pointer" }}>
              <input
                type="radio"
                name="phan-cong-mode"
                checked={phanCongMode === "ngau-nhien"}
                onChange={() => setPhanCongMode("ngau-nhien")}
                style={{ accentColor: RED, width: 15, height: 15, cursor: "pointer" }}
              />
              Phân công ngẫu nhiên
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: TEXT, cursor: "pointer" }}>
              <input
                type="radio"
                name="phan-cong-mode"
                checked={phanCongMode === "chi-dinh"}
                onChange={() => setPhanCongMode("chi-dinh")}
                style={{ accentColor: RED, width: 15, height: 15, cursor: "pointer" }}
              />
              Phân công chỉ định
            </label>
          </div>
        )}

        {/* Search Filter Box */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
          {filterExpanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Ngày thụ lý</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input
                      placeholder="Từ ngày"
                      value={fNgayTLTu}
                      onChange={(e) => setFNgayTLTu(e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <span style={{ color: MUTED, fontSize: 11 }}>→</span>
                    <div style={{ position: "relative", flex: 1 }}>
                      <input
                        placeholder="Đến ngày"
                        value={fNgayTLDen}
                        onChange={(e) => setFNgayTLDen(e.target.value)}
                        style={inputStyle}
                      />
                      <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Số thụ lý</label>
                  <input
                    placeholder="Số thụ lý"
                    value={fSoTL}
                    onChange={(e) => setFSoTL(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Loại án</label>
                  <select
                    value={fLoaiAn}
                    onChange={(e) => setFLoaiAn(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Vui lòng chọn</option>
                    {LOAI_AN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Giai đoạn</label>
                  <select
                    value={fGiaiDoan}
                    onChange={(e) => setFGiaiDoan(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Vui lòng chọn</option>
                    <option value="Sơ thẩm">Sơ thẩm</option>
                    <option value="Phúc thẩm">Phúc thẩm</option>
                    <option value="Giám đốc thẩm">Giám đốc thẩm</option>
                    <option value="Tái thẩm">Tái thẩm</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Tòa ra bản án/quyết định</label>
                  <select
                    value={fToaRaBA}
                    onChange={(e) => setFToaRaBA(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Chọn tòa ra bản án/quyết định</option>
                    <option value="TAND tối cao">Tòa án nhân dân tối cao</option>
                    <option value="TAND cấp cao tại Hà Nội">Tòa án nhân dân cấp cao tại Hà Nội</option>
                    <option value="TAND TP Hà Nội">Tòa án nhân dân TP Hà Nội</option>
                    <option value="TAND tỉnh Bắc Ninh">Tòa án nhân dân tỉnh Bắc Ninh</option>
                    <option value="TAND tỉnh An Giang">Tòa án nhân dân tỉnh An Giang</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Số bản án/quyết định</label>
                  <input
                    placeholder="Nhập số bản án/quyết định"
                    value={fSoBA}
                    onChange={(e) => setFSoBA(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Ngày bản án/quyết định</label>
                  <div style={{ position: "relative" }}>
                    <input
                      placeholder="Vui lòng chọn"
                      value={fNgayBA}
                      onChange={(e) => setFNgayBA(e.target.value)}
                      style={inputStyle}
                    />
                    <Calendar size={13} color={MUTED} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Nguyên đơn/Người khiếu nại</label>
                  <input
                    placeholder="Nhập tên"
                    value={fNguoiKN}
                    onChange={(e) => setFNguoiKN(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Row 3 - Luôn hiển thị đầy đủ TTV và LĐV */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 16px" }}>
                <div>
                  <label style={labelStyle}>Bị đơn/Bị cáo</label>
                  <input
                    placeholder="Nhập tên"
                    value={fBiDon}
                    onChange={(e) => setFBiDon(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Thẩm tra viên (TTV)</label>
                  <select
                    value={fTTV}
                    onChange={(e) => setFTTV(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Chọn thẩm tra viên</option>
                    {DANH_SACH_TTV.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Lãnh đạo vụ (LĐV)</label>
                  <select
                    value={fLanhDao}
                    onChange={(e) => setFLanhDao(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Chọn lãnh đạo vụ</option>
                    {DANH_SACH_LANH_DAO.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div />
              </div>
            </div>
          )}

          {/* Filter Footer Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: filterExpanded ? 14 : 0 }}>
            <button
              onClick={() => setFilterExpanded(!filterExpanded)}
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
              {filterExpanded ? "Thu gọn" : "Mở rộng"}
            </button>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => alert("Đang lọc danh sách phân công TTV...")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 18px",
                  background: RED,
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: F,
                }}
              >
                <Search size={13} /> Tìm kiếm
              </button>

              <button
                onClick={handleResetFilters}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  background: "#fff",
                  color: TEXT,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: F,
                }}
              >
                <RotateCcw size={13} /> Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Table Action Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          {activeTab === "chua-phan-cong" ? (
            <button
              onClick={handleExecutePhanCong}
              style={{
                padding: "7px 18px",
                background: RED,
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: F,
              }}
            >
              Phân công
            </button>
          ) : (
            <button
              onClick={() => alert("Đã lưu thông tin phân công thành công!")}
              style={{
                padding: "7px 16px",
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: F,
              }}
            >
              Lưu phân công
            </button>
          )}

          <button
            onClick={() => window.print()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              background: RED,
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            <Printer size={13} /> In báo cáo
          </button>

          <button
            onClick={() => alert("Đã làm mới danh sách!")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              cursor: "pointer",
              color: TEXT,
            }}
            title="Làm mới"
          >
            <RotateCcw size={14} color={MUTED} />
          </button>
        </div>

        {/* Main Data Table */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200 }}>
              <thead>
                <tr>
                  <th style={{ ...TH_CUSTOM, width: 36, textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === currentRows.length && currentRows.length > 0}
                      onChange={(e) => handleSelectAll(e, currentRows)}
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th style={{ ...TH_CUSTOM, width: 44, textAlign: "center" }}>STT</th>
                  <th style={{ ...TH_CUSTOM, width: "10%" }}>Số & Ngày thụ lý</th>
                  <th style={{ ...TH_CUSTOM, width: "21%" }}>Thông tin bản án/quyết định và QHPL</th>
                  <th style={{ ...TH_CUSTOM, width: "11%" }}>Đương sự</th>
                  <th style={{ ...TH_CUSTOM, width: "9%" }}>Ngày TTV nhận THS</th>
                  <th style={{ ...TH_CUSTOM, width: "8%" }}>Ngày phân công TTV</th>
                  <th style={{ ...TH_CUSTOM, width: "16%" }}>Thẩm tra viên (TTV)</th>
                  <th style={{ ...TH_CUSTOM, width: "8%" }}>Ngày phân công LĐ</th>
                  <th style={{ ...TH_CUSTOM, width: "17%" }}>Lãnh đạo vụ (LĐV)</th>
                  <th style={{ ...TH_CUSTOM, width: 60, textAlign: "center", borderRight: "none" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ ...TD_CUSTOM, textAlign: "center", padding: 36, color: MUTED }}>
                      Không có bản ghi nào
                    </td>
                  </tr>
                ) : (
                  currentRows.map((r, index) => {
                    const isSelected = selectedIds.includes(r.id);
                    return (
                      <tr
                        key={r.id}
                        style={{
                          background: isSelected ? "#eff6ff" : index % 2 === 0 ? "#fff" : "#fafafa",
                          transition: "background 0.1s",
                        }}
                      >
                        <td style={{ ...TD_CUSTOM, textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRow(r.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                        <td style={{ ...TD_CUSTOM, textAlign: "center", fontWeight: 600, color: MUTED }}>
                          {index + 1}
                        </td>
                        <td style={TD_CUSTOM}>
                          {r.soThuLy !== "-" ? (
                            <div>
                              <div><b>Số:</b> {r.soThuLy}</div>
                              <div style={{ color: MUTED, marginTop: 2, fontSize: 11 }}><b>Ngày TL:</b> {r.ngayThuLy}</div>
                            </div>
                          ) : (
                            <span style={{ color: MUTED }}>-</span>
                          )}
                        </td>
                        <td style={TD_CUSTOM}>
                          <div>
                            <div><b>{getSoBALabel(r.soBA, r.loaiAn, r.giaiDoan)}</b> {r.soBA} &nbsp; <b>Ngày:</b> {r.ngayBA}</div>
                            <div style={{ color: MUTED, marginTop: 2, fontSize: 11 }}><b>Tại:</b> {r.toaAn}</div>

                            {r.qhpl && !isRowHinhSu(r) && (
                              <div style={{ color: "#2563eb", marginTop: 4, fontSize: 11, fontWeight: 500 }}>
                                <b>QHPL:</b> {r.qhpl}
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={TD_CUSTOM}>
                          {r.ndkn || r.nbk ? (
                            <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                              {r.ndkn && <div><b>NĐ/NKK:</b> {r.ndkn}</div>}
                              {r.nbk && <div><b>BĐ/NBK:</b> {r.nbk}</div>}
                            </div>
                          ) : (
                            <span style={{ color: MUTED }}>-</span>
                          )}
                        </td>
                        <td style={TD_CUSTOM}>
                          <span style={{ color: MUTED }}>{r.ngayNhanTHS}</span>
                        </td>
                        {(() => {
                          const isXX = r.giaiDoanPC.includes("Xét xử") || Boolean(r.hasGDXX);
                          return (
                            <>
                              <td style={TD_CUSTOM}>
                                <div>
                                  {isXX && (
                                    <div style={{ marginBottom: 6, paddingBottom: 4, borderBottom: "1px dashed #cbd5e1" }}>
                                      <div style={{ fontSize: 11, fontWeight: 600, color: "#1e40af" }}>GĐ Giải quyết đơn</div>
                                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{r.ngayPCTTV_XX || "20/05/2026"}</div>
                                    </div>
                                  )}
                                  <div style={{ fontSize: 11, fontWeight: isXX ? 700 : 600, color: isXX ? "#047857" : "#1e40af" }}>
                                    {isXX ? "GĐ Xét xử GĐT, TT" : "GĐ Giải quyết đơn"}
                                  </div>
                                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{r.ngayPCTTV}</div>
                                </div>
                              </td>
                              <td style={TD_CUSTOM}>
                                <div>
                                  {isXX && (
                                    <div style={{ marginBottom: 6, paddingBottom: 4, borderBottom: "1px dashed #cbd5e1" }}>
                                      <div style={{ fontSize: 11, fontWeight: 600, color: "#1e40af" }}>GĐ Giải quyết đơn</div>
                                      <div style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginTop: 2 }}>
                                        {r.ttv_XX || r.ttv}
                                      </div>
                                    </div>
                                  )}
                                  <div style={{ fontSize: 11, fontWeight: isXX ? 700 : 600, color: isXX ? "#047857" : "#1e40af" }}>
                                    {isXX ? "GĐ Xét xử GĐT, TT" : "GĐ Giải quyết đơn"}
                                  </div>
                                  {activeTab === "da-phan-cong" && isSelected && isXX ? (
                                    <select
                                      value={r.ttv}
                                      onChange={(e) => handleChangeTTV(r.id, e.target.value, false)}
                                      style={{ ...inputStyle, padding: "2px 4px 2px 2px", fontSize: 10.5, marginTop: 2, height: 26, width: "100%" }}
                                      title={r.ttv}
                                    >
                                      {DANH_SACH_TTV.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                  ) : activeTab === "chua-phan-cong" && phanCongMode === "chi-dinh" && isSelected ? (
                                    <select
                                      value={r.ttv === "-" ? DANH_SACH_TTV[0] : r.ttv}
                                      onChange={(e) => handleChangeChuaPCTTV(r.id, e.target.value)}
                                      style={{ ...inputStyle, padding: "2px 4px 2px 2px", fontSize: 10.5, marginTop: 2, height: 26, width: "100%" }}
                                      title={r.ttv}
                                    >
                                      {DANH_SACH_TTV.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                  ) : (
                                    <div style={{ fontSize: 11, fontWeight: r.ttv !== "-" ? 600 : 400, color: r.ttv !== "-" ? TEXT : MUTED, marginTop: 2 }}>
                                      {r.ttv !== "-" ? r.ttv : <span style={{ color: "#d97706", fontStyle: "italic", fontSize: 11 }}>Chưa phân công</span>}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td style={TD_CUSTOM}>
                                <div>
                                  {isXX && (
                                    <div style={{ marginBottom: 6, paddingBottom: 4, borderBottom: "1px dashed #cbd5e1" }}>
                                      <div style={{ fontSize: 11, fontWeight: 600, color: "#1e40af" }}>GĐ Giải quyết đơn</div>
                                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{r.ngayPCLD_XX || "20/05/2026"}</div>
                                    </div>
                                  )}
                                  <div style={{ fontSize: 11, fontWeight: isXX ? 700 : 600, color: isXX ? "#047857" : "#1e40af" }}>
                                    {isXX ? "GĐ Xét xử GĐT, TT" : "GĐ Giải quyết đơn"}
                                  </div>
                                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{r.ngayPCLD}</div>
                                </div>
                              </td>
                              <td style={TD_CUSTOM}>
                                <div>
                                  {isXX && (
                                    <div style={{ marginBottom: 6, paddingBottom: 4, borderBottom: "1px dashed #cbd5e1" }}>
                                      <div style={{ fontSize: 11, fontWeight: 600, color: "#1e40af" }}>GĐ Giải quyết đơn</div>
                                      <div style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginTop: 2 }}>
                                        {r.lanhDao_XX || r.lanhDao}
                                      </div>
                                    </div>
                                  )}
                                  <div style={{ fontSize: 11, fontWeight: isXX ? 700 : 600, color: isXX ? "#047857" : "#1e40af" }}>
                                    {isXX ? "GĐ Xét xử GĐT, TT" : "GĐ Giải quyết đơn"}
                                  </div>
                                  {activeTab === "da-phan-cong" && isSelected && isXX ? (
                                    <select
                                      value={r.lanhDao}
                                      onChange={(e) => handleChangeLĐ(r.id, e.target.value, false)}
                                      style={{ ...inputStyle, padding: "2px 4px 2px 2px", fontSize: 10.5, marginTop: 2, height: 26, width: "100%" }}
                                      title={r.lanhDao}
                                    >
                                      {DANH_SACH_LANH_DAO.map(l => <option key={l} value={l}>{l.split(" - ")[0]}</option>)}
                                    </select>
                                  ) : activeTab === "chua-phan-cong" && phanCongMode === "chi-dinh" && isSelected ? (
                                    <select
                                      value={r.lanhDao === "-" ? DANH_SACH_LANH_DAO[0] : r.lanhDao}
                                      onChange={(e) => handleChangeChuaPCLĐ(r.id, e.target.value)}
                                      style={{ ...inputStyle, padding: "2px 4px 2px 2px", fontSize: 10.5, marginTop: 2, height: 26, width: "100%" }}
                                      title={r.lanhDao}
                                    >
                                      {DANH_SACH_LANH_DAO.map(l => <option key={l} value={l}>{l.split(" - ")[0]}</option>)}
                                    </select>
                                  ) : (
                                    <div style={{ fontSize: 11, fontWeight: r.lanhDao !== "-" ? 600 : 400, color: r.lanhDao !== "-" ? TEXT : MUTED, marginTop: 2 }}>
                                      {r.lanhDao !== "-" ? r.lanhDao : <span style={{ color: "#d97706", fontStyle: "italic", fontSize: 11 }}>Chưa phân công</span>}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </>
                          );
                        })()}
                        <td style={{ ...TD_CUSTOM, textAlign: "center", borderRight: "none" }}>
                          <button
                            onClick={() => setShowDetailModal(r)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#2563eb",
                              padding: 4,
                              borderRadius: 4,
                            }}
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "#fff", fontSize: 12, color: MUTED, fontFamily: F }}>
            <div>
              Hiển thị 1-{currentRows.length} trong tổng {activeTab === "chua-phan-cong" ? chuaPCRows.length : daPCRows.length} bản ghi
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>‹</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${RED}`, background: RED, color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>1</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>2</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>3</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>4</button>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>5</button>
              <span>...</span>
              <button style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>65</button>
              <button style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>›</button>
              <select style={{ padding: "4px 8px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 12, fontFamily: F, background: "#fff", outline: "none", marginLeft: 8 }}>
                <option>10 / trang</option>
                <option>20 / trang</option>
                <option>50 / trang</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Phân công chỉ định */}
      {showAssignModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 560, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: F }}>
            <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, color: RED }}>
                <UserCheck size={18} /> Phân công chỉ định Thẩm tra viên & Lãnh đạo vụ
              </div>
              <button onClick={() => setShowAssignModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "10px 14px", borderRadius: 6, fontSize: 12, color: "#1e40af" }}>
                Đang phân công cho <b>{selectedIds.length}</b> vụ án đã chọn.
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                  Chọn Thẩm tra viên (TTV) giải quyết (*)
                </label>
                <select
                  value={assignTTV}
                  onChange={(e) => setAssignTTV(e.target.value)}
                  style={{ ...inputStyle, padding: "8px 12px", fontSize: 13 }}
                >
                  {DANH_SACH_TTV.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 6 }}>
                  Chọn Lãnh đạo vụ (LĐV) phụ trách (*)
                </label>
                <select
                  value={assignLD}
                  onChange={(e) => setAssignLD(e.target.value)}
                  style={{ ...inputStyle, padding: "8px 12px", fontSize: 13 }}
                >
                  {DANH_SACH_LANH_DAO.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ padding: "12px 20px", background: "#f8fafc", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setShowAssignModal(false)}
                style={{ padding: "7px 16px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 500 }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmChiDinh}
                style={{ padding: "7px 20px", border: "none", background: RED, color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
              >
                ✓ Xác nhận phân công
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem chi tiết vụ án */}
      {showDetailModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 640, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: F }}>
            <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: RED }}>
                📄 Thông tin chi tiết vụ án
              </div>
              <button onClick={() => setShowDetailModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Số & Ngày thụ lý:</span>
                <span>{showDetailModal.soThuLy} – {showDetailModal.ngayThuLy}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Số & Ngày bản án:</span>
                <span>{showDetailModal.soBA} – {showDetailModal.ngayBA}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Tòa án ra bản án:</span>
                <span>{showDetailModal.toaAn}</span>
              </div>
              {!isRowHinhSu(showDetailModal) && showDetailModal.qhpl && (
                <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ color: MUTED, fontWeight: 600 }}>Quan hệ pháp luật:</span>
                  <span>{showDetailModal.qhpl}</span>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Đương sự:</span>
                <span>{showDetailModal.ndkn ? `NĐ/NKK: ${showDetailModal.ndkn} - BĐ/NBK: ${showDetailModal.nbk}` : "Chưa cập nhật"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Thẩm tra viên (TTV):</span>
                <span style={{ fontWeight: 600, color: "#1e40af" }}>{showDetailModal.ttv}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "6px 0" }}>
                <span style={{ color: MUTED, fontWeight: 600 }}>Lãnh đạo vụ (LĐV):</span>
                <span style={{ fontWeight: 600, color: "#1e40af" }}>{showDetailModal.lanhDao}</span>
              </div>
            </div>
            <div style={{ padding: "12px 20px", background: "#f8fafc", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowDetailModal(null)}
                style={{ padding: "7px 20px", border: `1px solid ${BORDER}`, background: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhanCongTTVView;
