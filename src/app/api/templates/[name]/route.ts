import { NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";

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

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${templateName}.docx"`,
    },
  });
}
