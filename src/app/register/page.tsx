"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateKeyPair } from "@/utils/crypto";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (form.password.length < 3) {
      setError("Mật khẩu phải có ít nhất 3 ký tự!");
      return;
    }

    try {
      setLoading(true);

      // Bước 1: Sinh cặp khóa RSA-PSS 2048-bit thực sự
      setSuccess("🔐 Đang tạo cặp khóa RSA-2048...");
      const { publicKeyBase64, privateKeyBase64 } = await generateKeyPair();

      // Bước 2: Gửi thông tin đăng ký + Public Key lên server
      setSuccess("📡 Đang gửi thông tin đăng ký...");
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          fullName: form.fullName,
          department: form.department,
          publicKey: publicKeyBase64,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Bước 3: Lưu Private Key vào localStorage của trình duyệt
        localStorage.setItem("privateKey", privateKeyBase64);
        localStorage.setItem("currentUser", form.username);
        setSuccess("✅ Đăng ký thành công! Cặp khóa RSA đã được lưu vào thiết bị. Đang chuyển hướng...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.message || "Đăng ký thất bại!");
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tạo khóa hoặc kết nối server!");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Đăng Ký Tài Khoản
      </h2>
      <p className="text-center text-gray-500 text-sm mb-8">
        Tạo tài khoản để sử dụng chức năng ký số nội bộ
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-5 text-sm border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-5 text-sm border border-green-200">
          {success}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Họ và Tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Nhập họ và tên đầy đủ..."
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Phòng Ban
          </label>
          <select
            name="department"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            value={form.department}
            onChange={handleChange}
          >
            <option value="">-- Chọn phòng ban --</option>
            <option value="Phòng IT">Phòng IT</option>
            <option value="Phòng Hành Chính">Phòng Hành Chính</option>
            <option value="Phòng Kế Toán">Phòng Kế Toán</option>
            <option value="Phòng Kinh Doanh">Phòng Kinh Doanh</option>
            <option value="Phòng Nhân Sự">Phòng Nhân Sự</option>
            <option value="Ban Giám Đốc">Ban Giám Đốc</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Tên Đăng Nhập <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Nhập tên đăng nhập (viết liền, không dấu)..."
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Mật Khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Nhập mật khẩu (ít nhất 3 ký tự)..."
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Xác Nhận Mật Khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Nhập lại mật khẩu..."
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors mt-2 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang tạo cặp khóa RSA...
            </>
          ) : (
            "Đăng Ký & Tạo Khóa"
          )}
        </button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <p className="text-gray-500 text-sm">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Đăng nhập
          </Link>
        </p>
        <Link href="/" className="text-gray-400 hover:text-gray-700 text-sm block">
          &larr; Về trang chủ
        </Link>
      </div>
    </div>
  );
}
