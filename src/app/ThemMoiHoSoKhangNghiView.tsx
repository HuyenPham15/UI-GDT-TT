import React, { useState } from "react";
import { ArrowLeft, Plus, Search, Edit3, Trash2, Calendar, Paperclip, Save } from "lucide-react";
import { F, RED, BORDER, TEXT, MUTED, BG, TH_STYLE, TD_STYLE } from "./shared";

export function ThemMoiHoSoKhangNghiView({ onBack }: { onBack: () => void }) {
  const [hinhThucDon, setHinhThucDon] = useState("Hồ sơ Kháng nghị GĐT/TT");
  const [thuTucGiaiQuyet, setThuTucGiaiQuyet] = useState("Giám đốc thẩm");
  const [loaiQDBA, setLoaiQDBA] = useState("Bản án");
  const [loaiAn, setLoaiAn] = useState("");
  const [soBanAn, setSoBanAn] = useState("");
  const [ngayBanAn, setNgayBanAn] = useState("");
  const [toaAnRaBanAn, setToaAnRaBanAn] = useState("");
  const [capXetXu, setCapXetXu] = useState("Sơ thẩm");
  const [thoiHieu, setThoiHieu] = useState("1 năm");

  const lbl: React.CSSProperties = { fontSize: 12, color: TEXT, fontFamily: F, display: "block", marginBottom: 6, fontWeight: 600 };
  const inp: React.CSSProperties = { padding: "8px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 4, fontFamily: F, width: "100%", boxSizing: "border-box", background: "#fff", outline: "none" };
  const sel: React.CSSProperties = { ...inp, cursor: "pointer" };
  
  const groupTitle: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: RED, display: "flex", alignItems: "center", gap: 8, marginBottom: 16 };
  const groupLine = <div style={{ width: 12, height: 2, background: RED }} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", fontFamily: F, flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "12px 24px", borderBottom: `1px solid ${BORDER}`, background: "#fff", flexShrink: 0 }}>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>
          Trang chủ / Quản lý đơn / <span style={{ color: TEXT }}>Thêm đơn</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, display: "flex", alignItems: "center" }}>
            <ArrowLeft size={20} />
          </button>
          <span style={{ fontSize: 18, fontWeight: 700, color: TEXT }}>Thêm mới Hồ sơ Kháng nghị GĐT/TT</span>
        </div>
      </div>

      {/* Main content scrollable */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px", background: "#fff" }}>
        
        {/* Top Dropdowns */}
        <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
          <div style={{ flex: 1 }}>
            <label style={{ ...lbl, color: RED }}>* Hình thức đơn</label>
            <select value={hinhThucDon} onChange={e => setHinhThucDon(e.target.value)} style={sel}>
              <option>Hồ sơ Kháng nghị GĐT/TT</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ ...lbl, color: RED }}>* Thủ tục giải quyết</label>
            <select value={thuTucGiaiQuyet} onChange={e => setThuTucGiaiQuyet(e.target.value)} style={sel}>
              <option>Giám đốc thẩm</option>
              <option>Tái thẩm</option>
            </select>
          </div>
        </div>

        {/* Thông tin bản án đề nghị */}
        <div style={{ marginBottom: 32 }}>
          <div style={groupTitle}>{groupLine} Thông tin bản án đề nghị</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20, marginBottom: 16 }}>
            <div>
              <label style={{ ...lbl, color: RED }}>* Loại QĐ/BA</label>
              <select value={loaiQDBA} onChange={e => setLoaiQDBA(e.target.value)} style={sel}>
                <option>Bản án</option>
                <option>Quyết định</option>
              </select>
            </div>
            <div>
              <label style={{ ...lbl, color: RED }}>* Loại án</label>
              <select value={loaiAn} onChange={e => setLoaiAn(e.target.value)} style={sel}>
                <option value="">Chọn loại án</option>
                <option>Hình sự</option>
                <option>Dân sự</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24 }}>
              <input type="checkbox" id="chkGDT" style={{ width: 16, height: 16, accentColor: RED }} />
              <label htmlFor="chkGDT" style={{ fontSize: 13, cursor: "pointer", color: TEXT }}>Không có nội dung GĐT, TT</label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24 }}>
              <input type="checkbox" id="chkThoiHieu" style={{ width: 16, height: 16, accentColor: RED }} />
              <label htmlFor="chkThoiHieu" style={{ fontSize: 13, cursor: "pointer", color: TEXT }}>Ẩn quá thời hiệu giải quyết</label>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 2fr 1fr", gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ ...lbl, color: RED }}>* Số bản án</label>
              <input value={soBanAn} onChange={e => setSoBanAn(e.target.value)} placeholder="Nhập số bản án" style={inp} />
            </div>
            <div>
              <label style={{ ...lbl, color: RED }}>* Ngày bản án</label>
              <div style={{ position: "relative" }}>
                <input value={ngayBanAn} onChange={e => setNgayBanAn(e.target.value)} placeholder="Chọn ngày" style={{ ...inp, paddingRight: 32 }} />
                <Calendar size={16} color={MUTED} style={{ position: "absolute", right: 10, top: 10, pointerEvents: "none" }} />
              </div>
            </div>
            <div>
              <label style={{ ...lbl, color: RED }}>* Tòa án ra bản án</label>
              <select value={toaAnRaBanAn} onChange={e => setToaAnRaBanAn(e.target.value)} style={sel}>
                <option value="">Chọn tòa án</option>
                <option>TAND tỉnh Bắc Ninh</option>
              </select>
            </div>
            <div>
              <label style={{ ...lbl, color: TEXT }}>Cấp xét xử</label>
              <div style={{ display: "flex", gap: 8 }}>
                <select value={capXetXu} onChange={e => setCapXetXu(e.target.value)} style={{ ...sel, flex: 1 }}>
                  <option>Sơ thẩm</option>
                  <option>Phúc thẩm</option>
                </select>
                <button style={{ padding: "0 12px", background: "#f8fafc", border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
                  <Search size={16} color={MUTED} />
                </button>
              </div>
            </div>
          </div>

          {/* Thời hiệu */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "16px", background: "#fafafa", borderRadius: 6, border: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>Thời hiệu</span>
            <div style={{ width: 1, height: 16, background: BORDER }} />
            {["Không xác định thời hiệu", "1 năm", "3 năm", "5 năm"].map(t => (
              <label key={t} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: TEXT }}>
                <input 
                  type="radio" 
                  name="thoiHieu" 
                  checked={thoiHieu === t} 
                  onChange={() => setThoiHieu(t)} 
                  style={{ width: 16, height: 16, accentColor: RED }} 
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        {/* Danh sách bản án/quyết định liên quan */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Danh sách bản án/quyết định liên quan</div>
            <button style={{ padding: "6px 16px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Plus size={14} /> Thêm
            </button>
          </div>
          
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ ...TH_STYLE, padding: "12px 10px", textAlign: "center" }}>STT</th>
                <th style={{ ...TH_STYLE, padding: "12px 10px" }}>Vụ án</th>
                <th style={{ ...TH_STYLE, padding: "12px 10px", textAlign: "center" }}>Nguồn vụ án</th>
                <th style={{ ...TH_STYLE, padding: "12px 10px" }}>Loại BA/QĐ</th>
                <th style={{ ...TH_STYLE, padding: "12px 10px", textAlign: "center" }}>Giai đoạn</th>
                <th style={{ ...TH_STYLE, padding: "12px 10px" }}>Số bản án</th>
                <th style={{ ...TH_STYLE, padding: "12px 10px" }}>Ngày ra bản án</th>
                <th style={{ ...TH_STYLE, padding: "12px 10px" }}>Tòa án ra bản án</th>
                <th style={{ ...TH_STYLE, padding: "12px 10px", textAlign: "center" }}>Trạng thái bản án</th>
                <th style={{ ...TH_STYLE, padding: "12px 10px", textAlign: "center" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {[
                { stt: 1, vuAn: "Nguyễn Văn An kiện UBND tỉnh Bắc Ninh", nguon: "QLA", loai: "Bản án", giaiDoan: "Sơ thẩm", so: "15/2021/HS-ST", ngay: "10/05/2021", toa: "TAND khu vực 5 - Bắc Ninh", trangThai: "Đang giải quyết", bgNguon: "#e0f2fe", colorNguon: "#0284c7", bgGd: "#e0f2fe", colorGd: "#0284c7", bgTt: "#e0f2fe", colorTt: "#0284c7" },
                { stt: 2, vuAn: "Nguyễn Văn An kiện UBND tỉnh Bắc Ninh", nguon: "Kho số hóa", loai: "Bản án", giaiDoan: "Phúc thẩm", so: "15/2023/HS-PT", ngay: "12/03/2023", toa: "TAND tỉnh Bắc Ninh", trangThai: "Đã giải quyết", bgNguon: "#ffedd5", colorNguon: "#c2410c", bgGd: "#ffedd5", colorGd: "#c2410c", bgTt: "#dcfce7", colorTt: "#15803d" },
                { stt: 3, vuAn: "Nguyễn Văn An và cộng sự - tranh chấp đất đai", nguon: "Thêm mới", loai: "Bản án", giaiDoan: "Phúc thẩm", so: "15/2023/HS-PT", ngay: "12/03/2023", toa: "TAND tỉnh Bắc Ninh", trangThai: "Đã giải quyết", bgNguon: "#f1f5f9", colorNguon: "#475569", bgGd: "#ffedd5", colorGd: "#c2410c", bgTt: "#dcfce7", colorTt: "#15803d", canDelete: true },
                { stt: 4, vuAn: "Nguyễn Văn An kiện UBND tỉnh Bắc Ninh", nguon: "QLA", loai: "Quyết định", giaiDoan: "Giám đốc thẩm", so: "15/2024/GĐT-HS", ngay: "20/01/2024", toa: "TAND tỉnh Bắc Ninh", trangThai: "Đã giải quyết", bgNguon: "#e0f2fe", colorNguon: "#0284c7", bgGd: "#ffedd5", colorGd: "#c2410c", bgTt: "#dcfce7", colorTt: "#15803d" },
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <td style={{ ...TD_STYLE, padding: "12px 10px", textAlign: "center", fontSize: 12 }}>{r.stt}</td>
                  <td style={{ ...TD_STYLE, padding: "12px 10px", fontSize: 13, color: "#0284c7" }}>{r.vuAn}</td>
                  <td style={{ ...TD_STYLE, padding: "12px 10px", textAlign: "center" }}>
                    <span style={{ display: "inline-block", padding: "2px 8px", background: r.bgNguon, color: r.colorNguon, fontSize: 11, borderRadius: 12 }}>{r.nguon}</span>
                  </td>
                  <td style={{ ...TD_STYLE, padding: "12px 10px", fontSize: 12 }}>{r.loai}</td>
                  <td style={{ ...TD_STYLE, padding: "12px 10px", textAlign: "center" }}>
                    <span style={{ display: "inline-block", padding: "2px 8px", background: r.bgGd, color: r.colorGd, fontSize: 11, borderRadius: 12 }}>{r.giaiDoan}</span>
                  </td>
                  <td style={{ ...TD_STYLE, padding: "12px 10px", fontSize: 12 }}>{r.so}</td>
                  <td style={{ ...TD_STYLE, padding: "12px 10px", fontSize: 12 }}>{r.ngay}</td>
                  <td style={{ ...TD_STYLE, padding: "12px 10px", fontSize: 12 }}>{r.toa}</td>
                  <td style={{ ...TD_STYLE, padding: "12px 10px", textAlign: "center" }}>
                    <span style={{ display: "inline-block", padding: "2px 8px", background: r.bgTt, color: r.colorTt, fontSize: 11, borderRadius: 12 }}>{r.trangThai}</span>
                  </td>
                  <td style={{ ...TD_STYLE, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      {(i === 1 || i === 2) && <Edit3 size={16} color="#0284c7" cursor="pointer" />}
                      {r.canDelete && <Trash2 size={16} color={RED} cursor="pointer" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quyết định kháng nghị */}
        <div style={{ marginBottom: 32 }}>
          <div style={groupTitle}>{groupLine} Quyết định kháng nghị</div>
          
          <div style={{ padding: "20px", border: `1px solid ${BORDER}`, borderRadius: 8, background: "#fafafa" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 16 }}>Thông tin Quyết định kháng nghị</div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ ...lbl, color: RED }}>* Số QĐKN</label>
                <input placeholder="Nhập số quyết định kháng nghị" style={inp} />
              </div>
              <div>
                <label style={{ ...lbl, color: RED }}>* Ngày QĐKN</label>
                <div style={{ position: "relative" }}>
                  <input placeholder="Chọn ngày" style={{ ...inp, paddingRight: 32 }} />
                  <Calendar size={16} color={MUTED} style={{ position: "absolute", right: 10, top: 10, pointerEvents: "none" }} />
                </div>
              </div>
              <div>
                <label style={{ ...lbl, color: RED }}>* Người kháng nghị</label>
                <select style={sel}>
                  <option value="">Chọn người kháng nghị</option>
                  <option>Chánh án TANDTC</option>
                  <option>Viện trưởng VKSNDTC</option>
                </select>
              </div>
              <div>
                <label style={{ ...lbl, color: TEXT }}>* Số bút lục VKS chuyển</label>
                <input placeholder="Nhập số bút lục" style={inp} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ ...lbl, color: TEXT, display: "flex", alignItems: "center", gap: 6 }}>Nội dung đơn <span style={{ color: "#0284c7", fontWeight: 400, cursor: "pointer" }}>[ Gợi ý ]</span></label>
              <textarea placeholder="Nhập nội dung đơn" rows={3} style={{ ...inp, resize: "vertical" }} />
            </div>

            <div style={{ width: 250 }}>
              <label style={{ ...lbl, color: TEXT }}>Ý kiến chỉ đạo</label>
              <select style={sel}>
                <option>Không</option>
                <option>Có</option>
              </select>
            </div>
          </div>
        </div>

        {/* Xử lý đơn */}
        <div style={{ marginBottom: 32 }}>
          <div style={groupTitle}>{groupLine} Xử lý đơn</div>
          
          <div style={{ padding: "16px 20px", border: `1px solid ${BORDER}`, borderRadius: 8, background: "#fafafa" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Thẩm quyền đơn</div>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: TEXT }}>
                <input type="radio" name="thamQuyen" style={{ width: 16, height: 16, accentColor: RED }} />
                Đơn thuộc thẩm quyền của thẩm phán tối cao
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: TEXT }}>
                <input type="radio" name="thamQuyen" defaultChecked style={{ width: 16, height: 16, accentColor: RED }} />
                Đơn thuộc thẩm quyền của thẩm phán bậc 3
              </label>
            </div>
          </div>
        </div>

        {/* Người liên quan */}
        <div style={{ marginBottom: 32 }}>
          <div style={groupTitle}>{groupLine} Người liên quan</div>
          
          <div style={{ marginBottom: 24 }}>
            <label style={{ ...lbl, color: TEXT }}>Quan hệ pháp luật</label>
            <input placeholder="Nhập quan hệ pháp luật" style={inp} />
          </div>

          <div style={{ padding: "20px", border: `1px solid ${BORDER}`, borderRadius: 8, background: "#fafafa" }}>
            
            {/* Người khiếu nại */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Người khiếu nại</div>
                <button style={{ padding: "4px 12px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  <Plus size={14} /> Thêm mới
                </button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9" }}>
                    <th style={{ ...TH_STYLE, padding: "10px", textAlign: "center" }}>STT</th>
                    <th style={{ ...TH_STYLE, padding: "10px" }}>Họ và tên</th>
                    <th style={{ ...TH_STYLE, padding: "10px" }}>Khiếu nại cho bị cáo</th>
                    <th style={{ ...TH_STYLE, padding: "10px" }}>Nội dung khiếu nại</th>
                    <th style={{ ...TH_STYLE, padding: "10px", textAlign: "center" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} style={{ padding: "20px", textAlign: "center", color: MUTED, fontSize: 12, fontStyle: "italic", border: `1px solid ${BORDER}` }}>
                      Chưa có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bị cáo */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Bị cáo</div>
                <button style={{ padding: "4px 12px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  <Plus size={14} /> Thêm mới
                </button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9" }}>
                    <th style={{ ...TH_STYLE, padding: "10px", textAlign: "center" }}>STT</th>
                    <th style={{ ...TH_STYLE, padding: "10px" }}>Họ và tên</th>
                    <th style={{ ...TH_STYLE, padding: "10px" }}>Năm sinh</th>
                    <th style={{ ...TH_STYLE, padding: "10px" }}>Địa chỉ</th>
                    <th style={{ ...TH_STYLE, padding: "10px" }}>Tội danh</th>
                    <th style={{ ...TH_STYLE, padding: "10px", textAlign: "center" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: MUTED, fontSize: 12, fontStyle: "italic", border: `1px solid ${BORDER}` }}>
                      Chưa có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bị hại */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Bị hại</div>
                <button style={{ padding: "4px 12px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  <Plus size={14} /> Thêm mới
                </button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9" }}>
                    <th style={{ ...TH_STYLE, padding: "10px", textAlign: "center" }}>STT</th>
                    <th style={{ ...TH_STYLE, padding: "10px" }}>Họ và tên</th>
                    <th style={{ ...TH_STYLE, padding: "10px" }}>Năm sinh</th>
                    <th style={{ ...TH_STYLE, padding: "10px" }}>Địa chỉ</th>
                    <th style={{ ...TH_STYLE, padding: "10px", textAlign: "center" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} style={{ padding: "20px", textAlign: "center", color: MUTED, fontSize: 12, fontStyle: "italic", border: `1px solid ${BORDER}` }}>
                      Chưa có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

      {/* Footer Fixed */}
      <div style={{ padding: "14px 24px", background: "#fff", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "center", gap: 16, flexShrink: 0 }}>
        <button style={{ padding: "8px 24px", background: "#fff", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <Paperclip size={16} /> Tải file
        </button>
        <button style={{ padding: "8px 24px", background: RED, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <Save size={16} /> Lưu thông tin
        </button>
      </div>

    </div>
  );
}

export default ThemMoiHoSoKhangNghiView;
