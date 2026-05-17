"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  fullName: string;
  department: string;
  publicKey: string;
}

export default function Home() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/register")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Danh Sách Khóa Công Khai Nội Bộ
        </h1>
        <div className="flex gap-3">
          <Link
            href="/verify"
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Xác Thực
          </Link>
          <Link
            href="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Đăng Ký
          </Link>
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Đăng Nhập
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Đang tải dữ liệu...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="p-4 border-b">Mã NV</th>
                <th className="p-4 border-b">Họ Tên</th>
                <th className="p-4 border-b">Phòng Ban</th>
                <th className="p-4 border-b">Public Key</th>
                <th className="p-4 border-b">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b text-gray-800">{user.id}</td>
                  <td className="p-4 border-b text-gray-800 font-medium">
                    {user.fullName}
                  </td>
                  <td className="p-4 border-b text-gray-600">{user.department}</td>
                  <td className="p-4 border-b">
                    <div className="max-w-[220px] truncate font-mono text-xs text-gray-500 bg-gray-100 p-2 rounded">
                      {user.publicKey}
                    </div>
                  </td>
                  <td className="p-4 border-b">
                    <button
                      onClick={() => copyToClipboard(user.publicKey)}
                      className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition-colors"
                    >
                      {copiedKey === user.publicKey ? "Đã copy!" : "Copy Key"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
