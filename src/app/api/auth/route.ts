import { NextResponse } from "next/server";
import { getAllUsers } from "@/utils/userStore";
import { pendingChallenges } from "@/utils/authStore";
import { webcrypto } from "node:crypto";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const allUsers = await getAllUsers();
    const user = allUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Sai tài khoản hoặc mật khẩu!" },
        { status: 401 }
      );
    }

    // Kiểm tra user có Public Key chưa
    if (user.publicKey && user.publicKey.length > 20) {
      const challenge = webcrypto.randomUUID();
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
