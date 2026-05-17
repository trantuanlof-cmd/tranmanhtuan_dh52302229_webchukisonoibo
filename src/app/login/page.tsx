"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        if (!localStorage.getItem("privateKey")) {
          localStorage.setItem("privateKey", `PRIVATE_KEY_${username}_${Date.now()}`);
        }
        localStorage.setItem("currentUser", username);
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi kết nối đến máy chủ.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 mt-20">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Đăng Nhập Hệ Thống
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Tên đăng nhập
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Mật khẩu
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Đăng Nhập
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <p className="text-gray-500 text-sm">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-green-600 hover:underline font-medium">
            Đăng ký ngay
          </Link>
        </p>
        <Link href="/" className="text-gray-400 hover:text-gray-700 text-sm block">
          &larr; Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
