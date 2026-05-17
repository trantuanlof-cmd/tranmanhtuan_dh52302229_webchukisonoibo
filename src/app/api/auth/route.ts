import { NextResponse } from "next/server";
import { getAllUsers } from "@/utils/userStore";
import { webcrypto } from "node:crypto";

// Lưu tạm challenges (in-memory, phù hợp cho demo)
const pendingChallenges = new Map<string, { challenge: string; expiresAt: number }>();

// POST /api/auth - Kiểm tra username/password, trả về challenge
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = getAllUsers().find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Sai tài khoản hoặc mật khẩu!" },
        { status: 401 }
      );
    }

    // Kiểm tra user có Public Key chưa (để quyết định có cần xác thực chữ ký không)
    if (user.publicKey && user.publicKey.length > 20) {
      // Sinh challenge ngẫu nhiên
      const challenge = webcrypto.randomUUID();
      // Lưu tạm với timeout 3 phút
      pendingChallenges.set(username, {
        challenge,
        expiresAt: Date.now() + 3 * 60 * 1000,
      });

      return NextResponse.json({
        success: true,
        requireSignature: true,
        challenge,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          department: user.department,
        },
      });
    }

    // Không có public key → đăng nhập thường
    return NextResponse.json({
      success: true,
      requireSignature: false,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        department: user.department,
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Lỗi Server" }, { status: 500 });
  }
}

// Export pendingChallenges để dùng ở verify route
export { pendingChallenges };
