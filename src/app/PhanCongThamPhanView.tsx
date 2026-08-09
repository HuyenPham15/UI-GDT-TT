import React, { useState } from "react";
import { Search, RotateCcw, Calendar, ChevronDown, ChevronUp, Printer, Trash2 } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE } from "./shared";

export function PhanCongThamPhanView() {
  const [activeTab, setActiveTab] = useState<"ngau-nhien" | "chi-dinh" | "ket-qua">("chi-dinh");
  const [filterType, setFilterType] = useState<"tat-ca" | "bac-3" | "toi-cao">("toi-cao");
  const [hinhThucFilter, setHinhThucFilter] = useState("don-tpb3");
  const [filterExpanded, setFilterExpanded] = useState(true);

  // Selected judge in table header toolbar
  const [bulkJudge, setBulkJudge] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([1]);

  // Sample Data matching screenshot exactly
  const [records, setRecords] = useState([
    {
      id: 1,
      soThuLy: ["Số: 4 - 29/06/2026", "Số: 5 - 29/06/2026"],
      moTaDon: "Số đơn 2(2 đơn TLM)",
      nguoiDungDon: "",
      hinhThuc: "Đơn đề nghị GĐT, TT",
      soBA: "123",
      ngayBA: "23/06/2026",
      toaBA: "Tòa án nhân dân tỉnh Cần Thơ",
      ngayPhanCong: "23/06/2026",
      thamPhan: "Lê Thị Thu Hiền",
      ghiChu: "",
    },
    {
      id: 2,
      soThuLy: ["Số: 5 - 29/06/2026"],
      moTaDon: "Số đơn 5 (1 đơn TLM)",
      nguoiDungDon: "Chu Văn An",
      hinhThuc: "Đơn đề nghị GĐT, TT",
      soBA: "123",
      ngayBA: "23/06/2026",
      toaBA: "Tòa án nhân dân tỉnh Cần Thơ",
      ngayPhanCong: "23/06/2026",
      thamPhan: "Lê Thị Thu Hiền",
      ghiChu: "",
    },
  ]);

  const [congVanRecords, setCongVanRecords] = useState([
    {
      id: 101,
      soThuLy: ["Số: 12/2026/TL-CV - 15/07/2026"],
      moTaDon: "Công văn trao đổi",
      soCongVan: "CV-2026/088",
      ngayCongVan: "10/07/2026",
      donViGui: "Viện kiểm sát nhân dân tối cao",
      trichYeu: "V/v trao đổi thông tin giải quyết hồ sơ vụ án",
      soBA: "123",
      ngayBA: "23/06/2026",
      toaBA: "Tòa án nhân dân tỉnh Cần Thơ",
      ngayPhanCong: "23/06/2026",
      thamPhan: "Lê Thị Thu Hiền",
      ghiChu: "",
    },
    {
      id: 102,
      soThuLy: ["Số: 15/2026/TL-CV - 18/07/2026"],
      moTaDon: "Công văn trao đổi",
      soCongVan: "CV-2026/092",
      ngayCongVan: "12/07/2026",
      donViGui: "Tòa án nhân dân tỉnh Bắc Ninh",
      trichYeu: "V/v phối hợp xác minh chứng cứ",
      soBA: "456",
      ngayBA: "25/06/2026",
      toaBA: "Tòa án nhân dân tỉnh Bắc Ninh",
      ngayPhanCong: "24/06/2026",
      thamPhan: "Nguyễn Văn A",
      ghiChu: "",
    },
  ]);

  const [tuHinhRecords, setTuHinhRecords] = useState([
    {
      id: 201,
      soThuLy: ["Số: 08/2026/TL-TH - 20/07/2026"],
      moTaDon: "Hồ sơ tử hình",
      soLuongBiAn: "02 bị án",
      danhSachBiAn: "Nguyễn Văn Hùng, Lê Văn Nam",
      hinhThuc: "Hồ sơ tử hình",
      soBA: "158/2026/HS-ST",
      ngayBA: "15/06/2026",
      toaBA: "Tòa án nhân dân tỉnh Nghệ An",
      ngayPhanCong: "20/07/2026",
      thamPhan: "Lê Thị Thu Hiền",
      ghiChu: "",
    },
    {
      id: 202,
      soThuLy: ["Số: 14/2026/TL-TH - 22/07/2026"],
      moTaDon: "Hồ sơ tử hình",
      soLuongBiAn: "01 bị án",
      danhSachBiAn: "Trần Đình Trọng",
      hinhThuc: "Hồ sơ tử hình",
      soBA: "99/2026/HS-ST",
      ngayBA: "10/05/2026",
      toaBA: "Tòa án nhân dân tỉnh Thanh Hóa",
      ngayPhanCong: "22/07/2026",
      thamPhan: "Nguyễn Văn A",
      ghiChu: "",
    },
  ]);

  const isCongVanMode = hinhThucFilter === "cong-van-trao-doi";
  const isTuHinhMode = hinhThucFilter === "ho-so-tu-hinh";
  const currentRecords = isCongVanMode ? congVanRecords : isTuHinhMode ? tuHinhRecords : records;

  const toggleSelectRow = (id: number) => {
    setSelectedRowIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkAssign = () => {
    if (selectedRowIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 đơn để phân công!");
      return;
    }
    if (!bulkJudge) {
      alert("Vui lòng chọn Thẩm phán để phân công!");
      return;
    }
    setRecords(prev =>
      prev.map(r => selectedRowIds.includes(r.id) ? { ...r, thamPhan: bulkJudge } : r)
    );
    alert(`Đã phân công chỉ định thành công ${selectedRowIds.length} đơn cho Thẩm phán ${bulkJudge}!`);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "7px 11px", fontSize: 12,
    border: `1px solid ${BORDER}`, borderRadius: 4,
    fontFamily: F, color: TEXT, outline: "none", background: "#fff",
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "#f9fafb", fontFamily: F }}>

      {/* Breadcrumb Header */}
      <div style={{ padding: "10px 24px", fontSize: 12, color: TEXT, fontFamily: F, background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        Trang chủ &nbsp;/&nbsp; Quản lý đơn &nbsp;/&nbsp; <b style={{ color: TEXT }}>Phân công thẩm phán</b>
      </div>

      {/* Page Title */}
      <div style={{ padding: "16px 24px 8px 24px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT, margin: 0, fontFamily: F }}>Phân công thẩm phán</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, background: "#f9fafb", padding: "0 24px", gap: 32 }}>
        {[
          { id: "ngau-nhien", label: "DS chưa phân công ngẫu nhiên (2)" },
          { id: "chi-dinh", label: "DS chưa phân công chỉ định (2)" },
          { id: "ket-qua", label: "Quản lý kết quả phân công" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "12px 0", fontSize: 13, fontFamily: F, fontWeight: isActive ? 700 : 500,
                background: "none", border: "none", cursor: "pointer",
                color: isActive ? RED : TEXT,
                borderBottom: isActive ? `2.5px solid ${RED}` : "2.5px solid transparent",
                marginBottom: -1, whiteSpace: "nowrap", transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Container */}
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Filter Card */}
        <div style={{ background: "#fff", borderRadius: 6, border: `1px solid ${BORDER}`, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Radio Row */}
          <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 13, fontFamily: F }}>
            {[
              { id: "tat-ca", label: "Tất cả" },
              { id: "bac-3", label: "Thẩm phán bậc 3" },
              { id: "toi-cao", label: "Thẩm phán tối cao" },
            ].map(item => {
              const isSelected = filterType === item.id;
              return (
                <label
                  key={item.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? RED : TEXT,
                    fontFamily: F,
                    fontSize: 13,
                  }}
                >
                  <input
                    type="radio"
                    name="filterType"
                    checked={isSelected}
                    onChange={() => setFilterType(item.id as any)}
                    style={{ accentColor: RED, cursor: "pointer" }}
                  />
                  {item.label}
                </label>
              );
            })}
          </div>

          {/* Form Fields Grid */}
          {filterExpanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Line 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: TEXT, marginBottom: 4, fontFamily: F }}>Tên tòa án</div>
                  <input value="Tòa án nhân dân tối cao" readOnly style={{ ...inputStyle, background: "#f8fafc", color: TEXT }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: TEXT, marginBottom: 4, fontFamily: F }}>Nhập đơn từ ngày đến ngày</div>
                  <div style={{ position: "relative" }}>
                    <input placeholder="Vui lòng chọn" style={inputStyle} />
                    <Calendar size={14} color={TEXT} style={{ position: "absolute", right: 10, top: 9, pointerEvents: "none" }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: TEXT, marginBottom: 4, fontFamily: F }}>Số BA/QĐ</div>
                  <input placeholder="Nhập dữ liệu" style={inputStyle} />
                </div>
              </div>

              {/* Line 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: TEXT, marginBottom: 4, fontFamily: F }}>Hình thức</div>
                  <select
                    value={hinhThucFilter}
                    onChange={e => setHinhThucFilter(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="don-tpb3">Đơn TPB3 GQ cần phân công TPTC</option>
                    <option value="ho-so-tu-hinh">Hồ sơ tử hình</option>
                    <option value="cong-van-trao-doi">Công văn trao đổi</option>
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: TEXT, marginBottom: 4, fontFamily: F }}>Số thụ lý</div>
                  <input placeholder="nhập dữ liệu" style={inputStyle} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: TEXT, marginBottom: 4, fontFamily: F }}>Ngày thụ lý từ ngày đến ngày</div>
                  <div style={{ position: "relative" }}>
                    <input placeholder="Vui lòng chọn" style={inputStyle} />
                    <Calendar size={14} color={TEXT} style={{ position: "absolute", right: 10, top: 9, pointerEvents: "none" }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: TEXT, marginBottom: 4, fontFamily: F }}>Người nhập đơn</div>
                  <select style={inputStyle}>
                    <option value="">Vui lòng chọn</option>
                  </select>
                </div>
              </div>

              {/* Line 3: Loại án Checkboxes */}
              <div>
                <div style={{ fontSize: 12, color: TEXT, marginBottom: 6, fontFamily: F }}>Loại án</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 18, fontSize: 12, color: TEXT, fontFamily: F }}>
                  {["Hình sự", "Dân sự", "Hành chính", "Kinh doanh thương mại", "Hôn nhân gia đình", "Lao động", "Sở hữu trí tuệ", "Phá sản"].map(item => (
                    <label key={item} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: F, fontSize: 12, color: TEXT, fontWeight: 400 }}>
                      <input type="checkbox" style={{ accentColor: RED, cursor: "pointer" }} />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Filter Footer Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
            <button
              onClick={() => alert("Mở danh sách thẩm phán")}
              style={{ background: "none", border: "none", color: "#2563eb", fontSize: 12, fontFamily: F, cursor: "pointer", padding: 0 }}
            >
              Danh sách thẩm phán
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => setFilterExpanded(v => !v)}
                style={{ background: "none", border: "none", color: "#2563eb", fontSize: 12, fontFamily: F, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                {filterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {filterExpanded ? "Thu gọn" : "Mở rộng"}
              </button>

              <button
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 18px", background: RED, color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                }}>
                <Search size={14} /> Tìm kiếm
              </button>

              <button
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", background: "#fff", color: "#374151",
                  border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontFamily: F,
                }}>
                <RotateCcw size={14} /> Xóa bộ lọc
              </button>
            </div>
          </div>

        </div>

        {/* Table Header Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontSize: 12, fontFamily: F }}>
            Đã chọn <b style={{ color: TEXT }}>{selectedRowIds.length}</b> mục
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {activeTab !== "ngau-nhien" && (
              <>
                <select
                  value={bulkJudge}
                  onChange={e => setBulkJudge(e.target.value)}
                  style={{ ...inputStyle, width: 170 }}
                >
                  <option value="">-- Chọn thẩm phán --</option>
                  <option value="Lê Thị Thu Hiền">Lê Thị Thu Hiền</option>
                  <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                  <option value="Trần Văn B">Trần Văn B</option>
                  <option value="Phạm Văn C">Phạm Văn C</option>
                </select>

                <button
                  onClick={handleBulkAssign}
                  style={{
                    padding: "7px 16px", background: RED, color: "#fff",
                    border: "none", borderRadius: 4, cursor: "pointer",
                    fontSize: 12, fontWeight: 700, fontFamily: F,
                  }}>
                  Phân công chỉ định ({selectedRowIds.length} đơn)
                </button>
              </>
            )}

            {activeTab === "ngau-nhien" && (
              <button
                onClick={() => alert(`Đã phân công ngẫu nhiên thành công ${selectedRowIds.length} đơn!`)}
                style={{
                  padding: "7px 16px", background: RED, color: "#fff",
                  border: "none", borderRadius: 4, cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: F,
                }}>
                Phân công ngẫu nhiên ({selectedRowIds.length} đơn)
              </button>
            )}

            <button
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", background: "#fff", color: TEXT,
                border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer",
                fontSize: 12, fontFamily: F,
              }}>
              <Printer size={14} /> In danh sách
            </button>

            <button
              onClick={() => {
                if (selectedRowIds.length === 0) alert("Chưa chọn dòng nào!");
                else {
                  setRecords(prev => prev.filter(r => !selectedRowIds.includes(r.id)));
                  setSelectedRowIds([]);
                }
              }}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "none", border: "none", color: "#2563eb",
                cursor: "pointer", fontSize: 12, fontFamily: F,
              }}>
              <RotateCcw size={14} /> Xóa
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ background: "#fff", borderRadius: 6, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ background: BG }}>
                <th style={{ ...TH_STYLE, width: 40, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={currentRecords.length > 0 && selectedRowIds.length === currentRecords.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedRowIds(currentRecords.map(r => r.id));
                      else setSelectedRowIds([]);
                    }}
                  />
                </th>
                <th style={{ ...TH_STYLE, width: 45, textAlign: "center" }}>STT</th>
                <th style={{ ...TH_STYLE, width: 220 }}>{isTuHinhMode ? "THÔNG TIN BẢN ÁN ĐỀ NGHỊ" : "THÔNG TIN THỤ LÝ"}</th>
                {isCongVanMode ? (
                  <th style={{ ...TH_STYLE, width: 380 }}>THÔNG TIN CÔNG VĂN</th>
                ) : isTuHinhMode ? (
                  <th style={{ ...TH_STYLE, width: 380 }}>SỐ LƯỢNG BỊ ÁN TỬ HÌNH</th>
                ) : (
                  <>
                    <th style={{ ...TH_STYLE, width: 220 }}>THÔNG TIN NGƯỜI ĐỨNG ĐƠN</th>
                    <th style={{ ...TH_STYLE, width: 240 }}>THÔNG TIN BA/QĐ ĐỀ NGHỊ GĐT,TT</th>
                  </>
                )}
                <th style={{ ...TH_STYLE, width: 130, textAlign: "center" }}>NGÀY PHÂN CÔNG</th>
                <th style={{ ...TH_STYLE, width: 170 }}>THẨM PHÁN</th>
                <th style={{ ...TH_STYLE, width: 160 }}>GHI CHÚ</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((r, idx) => (
                <tr
                  key={r.id}
                  style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
                >
                  <td style={{ ...TD_STYLE, textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedRowIds.includes(r.id)}
                      onChange={() => toggleSelectRow(r.id)}
                    />
                  </td>
                  <td style={{ ...TD_STYLE, textAlign: "center", fontSize: 12 }}>{idx + 1}</td>

                  {/* Thông tin thụ lý HOẶC Thông tin bản án đề nghị */}
                  {isTuHinhMode ? (
                    <td style={{ ...TD_STYLE, fontSize: 12, fontFamily: F }}>
                      <div><b style={{ color: TEXT }}>Số BA/QĐ:</b> {r.soBA}</div>
                      <div style={{ fontSize: 12, color: TEXT, marginTop: 2 }}>
                        <span>Ngày: </span><span style={{ color: TEXT }}>{r.ngayBA}</span>
                      </div>
                      <div style={{ fontSize: 12, color: TEXT, marginTop: 2 }}>
                        <span>Tại: </span><span style={{ color: TEXT }}>{r.toaBA}</span>
                      </div>
                    </td>
                  ) : (
                    <td style={{ ...TD_STYLE, fontSize: 12, fontFamily: F }}>
                      {r.soThuLy.map((s, i) => (
                        <div key={i} style={{ fontWeight: 600, color: TEXT, marginBottom: 2 }}>{s}</div>
                      ))}
                      <div style={{ fontSize: 12, color: TEXT, marginTop: 2 }}>{r.moTaDon}</div>
                    </td>
                  )}

                  {/* Cột chính tùy theo hình thức */}
                  {isCongVanMode ? (
                    <td style={{ ...TD_STYLE, fontSize: 12, fontFamily: F }}>
                      <div style={{ color: TEXT, fontWeight: 600 }}>
                        {(r as any).soCongVan} <span style={{ color: TEXT, fontWeight: 400 }}>(Ngày {(r as any).ngayCongVan})</span>
                      </div>
                      <div style={{ fontSize: 12, marginTop: 3 }}>
                        <span>Đơn vị gửi: </span><b style={{ color: TEXT }}>{(r as any).donViGui}</b>
                      </div>
                      <div style={{ fontSize: 12, color: TEXT, marginTop: 3 }}>
                        <span>Trích yếu: </span><span style={{ color: TEXT }}>{(r as any).trichYeu}</span>
                      </div>
                    </td>
                  ) : isTuHinhMode ? (
                    <td style={{ ...TD_STYLE, fontSize: 12, fontFamily: F }}>
                      <div style={{ color: TEXT }}>
                        <b>Số lượng bị án tử hình:</b> <span style={{ color: RED, fontWeight: 700 }}>{(r as any).soLuongBiAn || "01 bị án"}</span>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td style={{ ...TD_STYLE, fontSize: 12, fontFamily: F }}>
                        <div style={{ color: TEXT }}>
                          <b>Người đứng đơn:</b> {(r as any).nguoiDungDon}
                        </div>
                        <div style={{ fontSize: 12, color: TEXT, marginTop: 3 }}>
                          <span>Hình thức: </span><b style={{ color: TEXT }}>{(r as any).hinhThuc}</b>
                        </div>
                      </td>

                      <td style={{ ...TD_STYLE, fontSize: 12, fontFamily: F }}>
                        <div><b style={{ color: TEXT }}>Số BA/QĐ:</b> {r.soBA}</div>
                        <div style={{ fontSize: 12, color: TEXT, marginTop: 2 }}>
                          <span>Ngày: </span><span style={{ color: TEXT }}>{r.ngayBA}</span>
                        </div>
                        <div style={{ fontSize: 12, color: TEXT, marginTop: 2 }}>
                          <span>Tại: </span><span style={{ color: TEXT }}>{r.toaBA}</span>
                        </div>
                      </td>
                    </>
                  )}

                  {/* Ngày phân công */}
                  <td style={{ ...TD_STYLE, textAlign: "center", fontSize: 12, color: TEXT, fontFamily: F }}>
                    {r.ngayPhanCong}
                  </td>

                  {/* Thẩm phán select */}
                  <td style={{ ...TD_STYLE, fontFamily: F }}>
                    <select
                      value={r.thamPhan}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRecords(prev => prev.map(item => item.id === r.id ? { ...item, thamPhan: val } : item));
                      }}
                      style={{ ...inputStyle, padding: "5px 8px" }}
                    >
                      <option value="Lê Thị Thu Hiền">Lê Thị Thu Hiền</option>
                      <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                      <option value="Trần Văn B">Trần Văn B</option>
                      <option value="Phạm Văn C">Phạm Văn C</option>
                    </select>
                  </td>

                  {/* Ghi chú input */}
                  <td style={{ ...TD_STYLE, fontFamily: F }}>
                    <input
                      placeholder="Nhập ghi chú"
                      value={r.ghiChu}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRecords(prev => prev.map(item => item.id === r.id ? { ...item, ghiChu: val } : item));
                      }}
                      style={{ ...inputStyle, padding: "5px 8px" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
