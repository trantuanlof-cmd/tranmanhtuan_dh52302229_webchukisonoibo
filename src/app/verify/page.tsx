"use client";

import { useState } from "react";
import Link from "next/link";

type VerifyStatus = "idle" | "loading" | "success" | "fail" | "error";

interface SignatureMeta {
  signer: string;
  timestamp: string;
  algorithm: string;
  signature: string;
}

interface VerifyResult {
  status: VerifyStatus;
  meta?: SignatureMeta;
  publicKeyFound?: boolean;
  message?: string;
}

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<VerifyResult>({ status: "idle" });
  const [steps, setSteps] = useState<string[]>([]);

  const addStep = (msg: string) => setSteps((prev) => [...prev, msg]);

  const handleVerify = async () => {
    if (!file) return;

    setResult({ status: "loading" });
    setSteps([]);

    try {
      addStep("📂 Đang mở file Word...");
      const PizZip = (await import("pizzip")).default;
      const mammoth = (await import("mammoth")).default;
      const arrayBuffer = await file.arrayBuffer();
      const zip = new PizZip(arrayBuffer);

      // Bước 1: Đọc metadata chữ ký
      addStep("🔍 Đang tìm dữ liệu chữ ký trong file...");
      const metaFile = zip.file("word/signature-meta.xml");
      if (!metaFile) {
        setResult({
          status: "error",
          message: "Không tìm thấy dữ liệu xác thực trong file. Nguyên nhân có thể do: (1) File này chưa được ký số, hoặc (2) File được ký bằng phiên bản cũ chưa hỗ trợ xác thực. → Vui lòng vào Dashboard, ký lại file bằng phiên bản mới nhất, sau đó thử xác thực lại.",
        });
        return;
      }

      const metaXml = metaFile.asText();
      const getTag = (tag: string) => {
        const match = metaXml.match(new RegExp(`<${tag}>([\s\S]*?)<\/${tag}>`));
        return match ? match[1].trim() : "";
      };

      const meta: SignatureMeta = {
        signer: getTag("Signer"),
        timestamp: getTag("Timestamp"),
        algorithm: getTag("Algorithm"),
        signature: getTag("Signature"),
      };

      if (!meta.signer || !meta.signature) {
        setResult({ status: "error", message: "Dữ liệu chữ ký trong file bị hỏng hoặc không đầy đủ." });
        return;
      }

      addStep(`✅ Tìm thấy chữ ký của: ${meta.signer} (${meta.timestamp})`);

      // Bước 2: Lấy Public Key của người ký
      addStep(`🔑 Đang lấy Public Key của "${meta.signer}" từ hệ thống...`);
      const usersRes = await fetch("/api/register");
      const users = await usersRes.json();
      const signerUser = users.find((u: { username: string; publicKey?: string }) => u.username === meta.signer);

      if (!signerUser || !signerUser.publicKey) {
        setResult({
          status: "error",
          meta,
          publicKeyFound: false,
          message: `Không tìm thấy Public Key của "${meta.signer}" trong hệ thống. Tài khoản có thể đã bị xóa hoặc chưa đăng ký.`,
        });
        return;
      }
      addStep(`✅ Đã tìm thấy Public Key của "${meta.signer}"`);

      // Bước 3: Đọc nội dung gốc (bỏ phần signature đã chèn)
      addStep("📄 Đang đọc nội dung gốc của tài liệu...");
      let documentXml = zip.file("word/document.xml")!.asText();

      // Xóa phần chữ ký đã chèn trước </w:body> để lấy nội dung gốc
      const sigBlockRegex = /\n?<w:p xmlns:w="http:\/\/schemas\.openxmlformats\.org\/wordprocessingml\/2006\/main">\s*<w:pPr><w:jc w:val="center"\/><\/w:pPr>\s*<\/w:p>[\s\S]*?<\/w:body>/;
      const originalXml = documentXml.replace(sigBlockRegex, "</w:body>");

      // Tạo zip tạm với nội dung gốc để đọc text
      const tempZip = new PizZip(arrayBuffer);
      tempZip.file("word/document.xml", originalXml);
      const tempBuffer = tempZip.generate({ type: "arraybuffer" });
      const textResult = await mammoth.extractRawText({ arrayBuffer: tempBuffer });
      const originalText = textResult.value;

      addStep(`✅ Đã tách nội dung gốc (${originalText.length} ký tự)`);

      // Bước 4: Tính hash SHA-256 của nội dung gốc
      addStep("🔐 Đang tính băm SHA-256 của nội dung...");
      const { generateSHA256Hash, signChallenge } = await import("@/utils/crypto");
      const contentHash = await generateSHA256Hash(originalText);
      addStep(`✅ Hash: ${contentHash.substring(0, 32)}...`);

      // Bước 5: Xác thực chữ ký bằng Public Key
      addStep("🔍 Đang xác thực chữ ký số bằng RSA-PSS...");
      const publicKeyBytes = Uint8Array.from(
        atob(signerUser.publicKey),
        (c) => c.charCodeAt(0)
      );
      const publicKey = await crypto.subtle.importKey(
        "spki",
        publicKeyBytes,
        { name: "RSA-PSS", hash: "SHA-256" },
        false,
        ["verify"]
      );

      const signatureBytes = Uint8Array.from(
        atob(meta.signature),
        (c) => c.charCodeAt(0)
      );
      const challengeBytes = new TextEncoder().encode(contentHash);

      const isValid = await crypto.subtle.verify(
        { name: "RSA-PSS", saltLength: 32 },
        publicKey,
        signatureBytes,
        challengeBytes
      );

      if (isValid) {
        addStep("✅ Chữ ký số HỢP LỆ!");
        setResult({ status: "success", meta, publicKeyFound: true });
      } else {
        addStep("❌ Chữ ký số KHÔNG HỢP LỆ — nội dung có thể đã bị chỉnh sửa!");
        setResult({ status: "fail", meta, publicKeyFound: true });
      }
    } catch (e) {
      console.error(e);
      setResult({ status: "error", message: "Lỗi kỹ thuật: " + (e as Error).message });
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Xác Thực Văn Bản Đã Ký</h1>
            <p className="text-gray-500 text-sm mt-1">Kiểm tra tính hợp lệ của chữ ký số</p>
          </div>
          <Link href="/" className="text-gray-500 hover:text-gray-800 text-sm">← Trang chủ</Link>
        </div>
      </div>

      {/* Upload */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">📂 Tải File Đã Ký Lên</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-gray-500 text-sm mb-3">
            Chọn file Word <strong>đã được ký số</strong> để xác thực
          </p>
          <input
            type="file"
            accept=".docx"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setResult({ status: "idle" });
              setSteps([]);
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {file && <p className="mt-2 text-sm text-purple-600 font-medium">✅ Đã chọn: {file.name}</p>}
        </div>

        <button
          onClick={handleVerify}
          disabled={!file || result.status === "loading"}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {result.status === "loading" ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang xác thực...
            </>
          ) : "Xác Thực Chữ Ký"}
        </button>
      </div>

      {/* Steps log */}
      {steps.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-5">
          <p className="text-gray-400 text-xs font-semibold mb-3 uppercase">Nhật ký xác thực</p>
          <div className="space-y-1.5">
            {steps.map((s, i) => (
              <p key={i} className="text-green-400 font-mono text-sm">{s}</p>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result.status === "success" && result.meta && (
        <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">✅</span>
            <div>
              <h3 className="text-xl font-bold text-green-700">Chữ Ký Số HỢP LỆ</h3>
              <p className="text-green-600 text-sm">Văn bản chưa bị chỉnh sửa kể từ khi ký</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
            <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">Người ký:</span><span>{result.meta.signer}</span></div>
            <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">Thời gian:</span><span>{result.meta.timestamp}</span></div>
            <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">Thuật toán:</span><span>{result.meta.algorithm}</span></div>
          </div>
        </div>
      )}

      {result.status === "fail" && result.meta && (
        <div className="bg-red-50 border-2 border-red-400 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">❌</span>
            <div>
              <h3 className="text-xl font-bold text-red-700">Chữ Ký Số KHÔNG HỢP LỆ</h3>
              <p className="text-red-600 text-sm">Nội dung văn bản đã bị thay đổi sau khi ký hoặc chữ ký bị giả mạo!</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-sm">
            <p><strong>Người ký (tuyên bố):</strong> {result.meta.signer}</p>
          </div>
        </div>
      )}

      {result.status === "error" && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⚠️</span>
            <div>
              <h3 className="text-xl font-bold text-amber-700">Không Thể Xác Thực</h3>
              <p className="text-amber-700 text-sm mt-1">{result.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
