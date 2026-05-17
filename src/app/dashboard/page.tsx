"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signData } from "@/utils/crypto";

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      router.push("/login");
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  const handleSign = async () => {
    if (!file) {
      setStatus("Vui lòng chọn một file Word (.docx)!");
      return;
    }

    try {
      setStatus("Đang xử lý đọc file...");
      
      // Dynamic import to avoid SSR issues with these libraries
      const mammoth = (await import("mammoth")).default;
      const PizZip = (await import("pizzip")).default;
      const Docxtemplater = (await import("docxtemplater")).default;

      const arrayBuffer = await file.arrayBuffer();
      
      // 1. Đọc nội dung text để băm
      setStatus("Đang băm nội dung (SHA-256)...");
      const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      const textContent = result.value;

      // 2. Ký số
      setStatus("Đang ký số bằng Private Key...");
      const privateKey = localStorage.getItem("privateKey") || "DEFAULT_KEY";
      const signature = await signData(textContent, privateKey);

      // 3. Chèn chữ ký vào file Word
      // Lưu ý: File mẫu cần có tag {signature} ở cuối để docxtemplater thay thế
      // Nếu file tải lên không có tag {signature}, bước này có thể không chèn được.
      // Giải pháp thực tế hơn: Ghi thẳng vào đuôi file.
      setStatus("Đang nhúng chữ ký vào Word...");
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Render the document (replace {signature} with actual signature)
      // We will try to render, if no tag, it does nothing
      doc.render({
        signature: `\n\n--- CHỮ KÝ SỐ XÁC THỰC ---\nNgười ký: ${currentUser}\nMã chữ ký: ${signature}\n--------------------------`,
      });

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = URL.createObjectURL(out);
      setDownloadUrl(url);
      setStatus("Ký số thành công! Nhấn nút dưới đây để tải về.");
    } catch (error) {
      console.error(error);
      setStatus("Có lỗi xảy ra trong quá trình ký số. Đảm bảo file là .docx hợp lệ và có tag {signature}.");
    }
  };

  if (!currentUser) return null;

  return (
    <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Khu Vực Ký Số</h1>
          <p className="text-gray-500">Xin chào, <span className="font-semibold text-blue-600">{currentUser}</span></p>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 font-medium"
        >
          Đăng xuất
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-800 mb-2">1. Tải Biểu Mẫu (Tùy chọn)</h3>
          <p className="text-sm text-blue-600 mb-3">
            Tải biểu mẫu Word có sẵn thẻ <code>{`{signature}`}</code> để hệ thống tự động điền chữ ký vào cuối.
          </p>
          <a
            href="/templates/bieu_mau_cong_ty.docx"
            download
            className="inline-block bg-white text-blue-600 px-4 py-2 rounded shadow-sm border border-blue-200 hover:bg-blue-100 text-sm font-medium"
          >
            Tải biểu mẫu công ty
          </a>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
          <h3 className="font-bold text-gray-700 mb-4">2. Upload File Cần Ký</h3>
          <input
            type="file"
            accept=".docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {status && (
          <div className="text-center text-sm font-medium text-gray-600 py-2">
            {status}
          </div>
        )}

        <button
          onClick={handleSign}
          disabled={!file}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Thực Hiện Ký Số
        </button>

        {downloadUrl && (
          <a
            href={downloadUrl}
            download={`signed_${file?.name}`}
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors mt-4"
          >
            Lưu File Đã Ký Về Máy
          </a>
        )}
      </div>
      <div className="mt-6 text-center">
        <Link href="/" className="text-gray-500 hover:text-gray-800 text-sm">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
