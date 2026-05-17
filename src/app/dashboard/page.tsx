"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signData } from "@/utils/crypto";

const TEMPLATES = [
  { id: "bien-ban-hop", label: "Biên Bản Họp", icon: "📋", desc: "Biên bản ghi nhớ cuộc họp nội bộ" },
  { id: "cong-van", label: "Công Văn", icon: "📄", desc: "Công văn chính thức gửi nội/ngoại bộ" },
  { id: "hop-dong", label: "Hợp Đồng Công Việc", icon: "📝", desc: "Hợp đồng phân công công việc nội bộ" },
  { id: "phieu-de-xuat", label: "Phiếu Đề Xuất", icon: "💡", desc: "Phiếu đề xuất ý kiến / yêu cầu" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [privateKeyCopied, setPrivateKeyCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [privateKey, setPrivateKey] = useState<string>("");

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      router.push("/login");
      return;
    }
    setCurrentUser(user);
    const pk = localStorage.getItem("privateKey") || "";
    setPrivateKey(pk);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  // Tải biểu mẫu từ API
  const handleDownloadTemplate = (templateId: string) => {
    const link = document.createElement("a");
    link.href = `/api/templates/${templateId}`;
    link.download = `${templateId}.docx`;
    link.click();
  };

  // Tải về Private Key dạng file .pem
  const handleDownloadPrivateKey = () => {
    const content = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----\n\nChủ sở hữu: ${currentUser}\nNgày tạo: ${new Date().toLocaleDateString("vi-VN")}\n\n[CẢNH BÁO] Giữ bí mật file này. Không chia sẻ cho bất kỳ ai!`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `private_key_${currentUser}.pem`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Sao chép Private Key
  const handleCopyKey = () => {
    navigator.clipboard.writeText(privateKey);
    setPrivateKeyCopied(true);
    setTimeout(() => setPrivateKeyCopied(false), 2000);
  };

  // Ký số file
  const handleSign = async () => {
    if (!file) {
      setStatus("⚠️ Vui lòng chọn một file Word (.docx)!");
      return;
    }
    if (!privateKey) {
      setStatus("⚠️ Không tìm thấy Private Key. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      setStatus("📖 Đang đọc nội dung file...");
      const mammoth = (await import("mammoth")).default;
      const PizZip = (await import("pizzip")).default;
      const Docxtemplater = (await import("docxtemplater")).default;

      const arrayBuffer = await file.arrayBuffer();

      setStatus("🔐 Đang băm nội dung (SHA-256)...");
      const result = await mammoth.extractRawText({ arrayBuffer });
      const textContent = result.value;

      setStatus("✍️ Đang ký số bằng Private Key...");
      const signature = await signData(textContent, privateKey);

      setStatus("📎 Đang nhúng chữ ký vào file Word...");
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      doc.render({
        signature: `\n\n═══════════════════════════════════\nCHỮ KÝ SỐ XÁC THỰC\n═══════════════════════════════════\nNgười ký: ${currentUser}\nThời gian: ${new Date().toLocaleString("vi-VN")}\nMã chữ ký: ${signature}\n═══════════════════════════════════`,
      });

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = URL.createObjectURL(out);
      const newName = file.name.replace(".docx", "_signed.docx");
      setDownloadUrl(url);
      setDownloadFileName(newName);
      setStatus("✅ Ký số thành công!");
    } catch (error) {
      console.error(error);
      setStatus("❌ Lỗi: Đảm bảo file là .docx hợp lệ và có thẻ {signature} ở nơi muốn hiển thị chữ ký.");
    }
  };

  if (!currentUser) return null;

  return (
    <div className="w-full max-w-3xl space-y-6">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-xl p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Khu Vực Ký Số</h1>
          <p className="text-gray-500 text-sm mt-1">
            Xin chào,{" "}
            <span className="font-semibold text-blue-600">{currentUser}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-800 text-sm">Trang chủ</Link>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm font-medium">
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Private Key Management */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          🔑 Quản Lý Private Key
        </h2>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800">
          <strong>⚠️ Lưu ý bảo mật:</strong> Private Key của bạn chỉ được lưu trên trình duyệt này.
          Hãy tải về và lưu giữ cẩn thận. Nếu mất Private Key, bạn sẽ không thể ký số được nữa.
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadPrivateKey}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            💾 Tải về Private Key (.pem)
          </button>
          <button
            onClick={handleCopyKey}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {privateKeyCopied ? "✅ Đã sao chép!" : "📋 Sao chép Key"}
          </button>
          <button
            onClick={() => setShowKey(!showKey)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {showKey ? "🙈 Ẩn Key" : "👁️ Xem Key"}
          </button>
        </div>

        {showKey && (
          <div className="mt-4 bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-lg overflow-x-auto max-h-32 overflow-y-auto">
            {privateKey || "Không tìm thấy Private Key"}
          </div>
        )}
      </div>

      {/* Template Selection */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          📁 Tải Biểu Mẫu Công Ty
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Chọn một biểu mẫu để tải về, điền nội dung, sau đó upload lên để ký số.
          Mỗi biểu mẫu đã có thẻ <code className="bg-gray-100 px-1 rounded">&#123;signature&#125;</code> sẵn ở cuối.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleDownloadTemplate(tmpl.id)}
              className="flex items-start gap-3 p-4 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-left transition-all group"
            >
              <span className="text-2xl">{tmpl.icon}</span>
              <div>
                <div className="font-semibold text-gray-800 group-hover:text-blue-700 text-sm">
                  {tmpl.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{tmpl.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sign Document */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          ✍️ Ký Số File Word
        </h2>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:border-blue-400 transition-colors">
          <div className="text-4xl mb-2">📤</div>
          <p className="text-gray-500 text-sm mb-3">Chọn file Word (.docx) đã điền nội dung để ký số</p>
          <input
            type="file"
            accept=".docx"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setDownloadUrl(null);
              setStatus("");
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {file && (
            <p className="mt-2 text-sm text-blue-600 font-medium">✅ Đã chọn: {file.name}</p>
          )}
        </div>

        {status && (
          <div className={`mt-4 text-center text-sm font-medium py-2 px-4 rounded-lg ${
            status.startsWith("✅") ? "bg-green-50 text-green-700" :
            status.startsWith("❌") ? "bg-red-50 text-red-700" :
            "bg-blue-50 text-blue-700"
          }`}>
            {status}
          </div>
        )}

        <button
          onClick={handleSign}
          disabled={!file}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
        >
          Thực Hiện Ký Số
        </button>

        {downloadUrl && (
          <a
            href={downloadUrl}
            download={downloadFileName}
            className="block w-full text-center mt-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            💾 Lưu File Đã Ký Về Máy
          </a>
        )}
      </div>
    </div>
  );
}
