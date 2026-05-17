import { NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

export const runtime = "nodejs";

const templates: Record<string, () => Document> = {
  "bien-ban-hop": () =>
    new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "CÔNG TY TNHH INTERNAL SIGN",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: "BIÊN BẢN HỌP", bold: true, size: 28 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun("Thời gian: "),
                new TextRun({ text: "___/___/______  Giờ: ___:___", italics: true }),
              ],
            }),
            new Paragraph({ children: [new TextRun("Địa điểm: _______________________________________________")] }),
            new Paragraph({ children: [new TextRun("Chủ trì: _________________________________________________")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "I. THÀNH PHẦN THAM DỰ:", bold: true })] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "II. NỘI DUNG HỌP:", bold: true })] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "III. KẾT LUẬN:", bold: true })] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "{signature}", color: "AAAAAA", italics: true })] }),
          ],
        },
      ],
    }),

  "cong-van": () =>
    new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: "CÔNG TY TNHH INTERNAL SIGN", bold: true })],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph({ children: [new TextRun({ text: "Số: ___/CV-NS", italics: true })] }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true })],
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              children: [new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true })],
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              children: [new TextRun({ text: "_____, ngày ___ tháng ___ năm ______", italics: true })],
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [new TextRun({ text: "CÔNG VĂN", bold: true, size: 28 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: "V/v: _____________________________________________", italics: true })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun("Kính gửi: _______________________________________________")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun("Nội dung công văn:")] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun("Kính mong quý cơ quan xem xét và phối hợp thực hiện.")] }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [new TextRun({ text: "NGƯỜI KÝ CÔNG VĂN", bold: true })],
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "{signature}", color: "AAAAAA", italics: true })] }),
          ],
        },
      ],
    }),

  "hop-dong": () =>
    new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: "HỢP ĐỒNG CÔNG VIỆC NỘI BỘ", bold: true, size: 32 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: "Số: ___/HĐCV-___", italics: true })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "Hôm nay, ngày ___ tháng ___ năm _____, chúng tôi gồm:" })] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "BÊN A (Bên giao việc):", bold: true })] }),
            new Paragraph({ children: [new TextRun("Tên đơn vị: Công ty TNHH Internal Sign")] }),
            new Paragraph({ children: [new TextRun("Đại diện: _______________________________")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "BÊN B (Bên nhận việc):", bold: true })] }),
            new Paragraph({ children: [new TextRun("Họ và tên: ___________________________________")] }),
            new Paragraph({ children: [new TextRun("Phòng ban: __________________________________")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "ĐIỀU 1 - NỘI DUNG CÔNG VIỆC:", bold: true })] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "ĐIỀU 2 - THỜI GIAN THỰC HIỆN:", bold: true })] }),
            new Paragraph({ children: [new TextRun("Bắt đầu: ___/___/______    Kết thúc: ___/___/______")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "ĐIỀU 3 - CAM KẾT:", bold: true })] }),
            new Paragraph({ children: [new TextRun("Hai bên cam kết thực hiện đúng các điều khoản trên.")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "{signature}", color: "AAAAAA", italics: true })] }),
          ],
        },
      ],
    }),

  "phieu-de-xuat": () =>
    new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: "PHIẾU ĐỀ XUẤT", bold: true, size: 30 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun("Ngày: ___/___/______")] }),
            new Paragraph({ children: [new TextRun("Người đề xuất: _____________________________ Phòng ban: _______________")] }),
            new Paragraph({ children: [new TextRun("Tiêu đề đề xuất: _______________________________________________")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "NỘI DUNG ĐỀ XUẤT:", bold: true })] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "LÝ DO:", bold: true })] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "KẾT QUẢ DỰ KIẾN:", bold: true })] }),
            new Paragraph({ children: [new TextRun("___________________________________________________________")] }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [new TextRun({ text: "Ý KIẾN PHÊ DUYỆT:", bold: true })],
            }),
            new Paragraph({ children: [new TextRun("[ ] Đồng ý    [ ] Không đồng ý    [ ] Cần xem xét thêm")] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "{signature}", color: "AAAAAA", italics: true })] }),
          ],
        },
      ],
    }),

  "bao-cao-cong-nghe": () =>
    new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "BÁO CÁO PHÂN TÍCH CÔNG NGHỆ, THUẬT TOÁN VÀ HƯỚNG DẪN HỆ THỐNG KÝ SỐ",
                  bold: true,
                  size: 26,
                  color: "2E74B5",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Đề tài: Nghiên cứu giải pháp Ký số và Xác thực chéo văn bản nội bộ",
                  italics: true,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "I. GIỚI THIỆU CHUNG VỀ DỰ ÁN", bold: true, size: 22, color: "1B365D" }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "Hệ thống chữ ký số nội bộ (Internal Digital Signature) được xây dựng nhằm giải quyết nhu cầu xác thực danh tính nhân viên và bảo đảm tính toàn vẹn tuyệt đối của tài liệu văn phòng trong doanh nghiệp. Khác biệt với các hệ thống truyền thống yêu cầu mẫu sẵn, giải pháp này hỗ trợ ký trực tiếp chèn XML chữ ký và siêu dữ liệu ẩn vào cuối tài liệu Microsoft Word (.docx) bất kỳ."
                ),
              ],
            }),
            new Paragraph({ text: "" }),

            new Paragraph({
              children: [
                new TextRun({ text: "II. KIẾN TRÚC VÀ CÔNG NGHỆ SỬ DỤNG", bold: true, size: 22, color: "1B365D" }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "1. Next.js 14 (App Router): ", bold: true }),
                new TextRun(
                  "Đóng vai trò làm kiến trúc cốt lõi. Giúp tối ưu hóa tốc độ tải trang, quản lý API Route bảo mật cao và vận hành ổn định trên môi trường Serverless."
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "2. Web Crypto API: ", bold: true }),
                new TextRun(
                  "Thực hiện sinh cặp khóa mật mã, tạo chữ ký số và xác thực hoàn toàn 100% tại Client (Trình duyệt). Private Key của người dùng không bao giờ truyền qua mạng, đạt chuẩn bảo mật Zero-Trust."
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "3. PizZip & Mammoth: ", bold: true }),
                new TextRun(
                  "PizZip chịu trách nhiệm giải nén tệp .docx (dạng nén ZIP), chèn tệp siêu dữ liệu ẩn word/signature-meta.xml. Mammoth thực hiện trích xuất văn bản thô để băm SHA-256 chính xác."
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "4. Hybrid Persistence (Lưu trữ lai vĩnh viễn): ", bold: true }),
                new TextRun(
                  "Hỗ trợ ghi đĩa cục bộ (File System) ở môi trường phát triển máy cá nhân, đồng thời tích hợp Vercel KV REST API khi chạy cloud nhằm tránh reset tài khoản đã đăng ký sau khi kết thúc phiên làm việc."
                ),
              ],
            }),
            new Paragraph({ text: "" }),

            new Paragraph({
              children: [
                new TextRun({ text: "III. PHÂN TÍCH THUẬT TOÁN MÃ HÓA CỐT LÕI", bold: true, size: 22, color: "1B365D" }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "1. RSA-PSS (Probabilistic Signature Scheme) 2048-bit: ", bold: true }),
                new TextRun(
                  "Thuật toán chữ ký số bất đối xứng tiên tiến hàng đầu hiện nay. Bằng cách chèn ngẫu nhiên thành phần salt trước khi mã hóa chữ ký, RSA-PSS ngăn chặn hoàn toàn các cuộc tấn công toán học dò tìm khóa."
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "2. SHA-256 (Secure Hash Algorithm): ", bold: true }),
                new TextRun(
                  "Thuật toán băm một chiều sinh ra chuỗi định danh 256-bit duy nhất của văn bản. Chỉ cần thay đổi 1 ký tự, mã băm đầu ra sẽ thay đổi hoàn toàn, giúp phát hiện ngay lập tức hành vi sửa đổi trái phép."
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "3. Cơ chế Đăng nhập Challenge-Response: ", bold: true }),
                new TextRun(
                  "Quy trình bảo mật chống Replay Attack gồm: (1) Máy khách gửi yêu cầu đăng nhập. (2) Máy chủ trả về Challenge (UUIDv4 ngẫu nhiên). (3) Máy khách ký số bằng Private Key. (4) Máy chủ dùng Public Key giải mã xác thực chéo. Giao thức này loại bỏ hoàn toàn việc truyền mật khẩu."
                ),
              ],
            }),
            new Paragraph({ text: "" }),

            new Paragraph({
              children: [
                new TextRun({ text: "IV. CƠ CHẾ XÁC THỰC TOÀN VẸN VĂN BẢN SIÊU BỀN VỮNG", bold: true, size: 22, color: "1B365D" }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "Để khắc phục triệt để việc MS Word tự động căn chỉnh khoảng trắng hoặc định dạng lại cấu trúc file XML khi lưu làm sai lệch mã băm, hệ thống áp dụng cơ chế siêu bền vững: Bản sao văn bản thô gốc dạng Base64 được nhúng trực tiếp trong file siêu dữ liệu ẩn. Khi xác thực, hệ thống trích xuất văn bản thô hiện tại từ file Word, sử dụng Regex chính quy thông minh "
                ),
                new TextRun({ text: "/[\\s═\\-=_\\u2550\\u2500]+$/", color: "FF0000", bold: true }),
                new TextRun(
                  " để dọn sạch mọi dòng kẻ trang trí ở cuối văn bản, tiến hành chuẩn hóa NFC Unicode tiếng Việt trên cả 2 văn bản rồi đối chiếu trực tiếp. Đảm bảo tính toàn vẹn chính xác tuyệt đối."
                ),
              ],
            }),
            new Paragraph({ text: "" }),

            new Paragraph({
              children: [
                new TextRun({ text: "V. HƯỚNG DẪN VẬN HÀNH & SỬ DỤNG WEB", bold: true, size: 22, color: "1B365D" }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "1. Đăng ký tài khoản: ", bold: true }),
                new TextRun(
                  "Hệ thống sinh cặp khóa RSA-PSS trực tiếp trên máy khách. Hãy lưu Private Key về máy (.pem), Public Key tự động đẩy lên máy chủ và lưu trữ vĩnh viễn trên cơ sở dữ liệu."
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "2. Đăng nhập an toàn: ", bold: true }),
                new TextRun(
                  "Nhập tên đăng nhập, chọn tệp Private Key (.pem) của bạn để thực hiện ký số đăng nhập nhanh chóng mà không cần gõ mật khẩu."
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "3. Ký số tài liệu: ", bold: true }),
                new TextRun(
                  "Tải lên tệp Word bất kỳ. Hệ thống sẽ băm SHA-256 nội dung, ký số bằng Private Key, tự động xuất thêm tệp chữ ký rời .sig và lưu khối ký trực quan vào cuối tệp Word mới (_signed.docx) để tải về."
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "4. Xác thực chữ ký số: ", bold: true }),
                new TextRun(
                  "Kéo thả tệp Word đã ký vào trang Xác thực (/verify). Quy trình 5 bước tự động sẽ thực hiện: Mở file -> Tìm chữ ký -> Lấy Public Key từ DB -> So khớp văn bản gốc và hiện tại -> Xác minh tính toàn vẹn và hợp lệ của chữ ký số."
                ),
              ],
            }),
            
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({ text: "--------------------------------------------------------------------------------", color: "888888" }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        },
      ],
    }),
};

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const templateName = params.name;
  const generator = templates[templateName];

  if (!generator) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const doc = generator();
  const buffer = await Packer.toBuffer(doc);

  // Chuyển Buffer sang Uint8Array để tương thích với NextResponse (BodyInit)
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${templateName}.docx"`,
    },
  });
}
