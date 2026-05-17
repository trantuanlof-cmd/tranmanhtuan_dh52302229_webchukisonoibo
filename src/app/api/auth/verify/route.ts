import { NextResponse } from "next/server";
import { getAllUsers } from "@/utils/userStore";
import { pendingChallenges } from "@/utils/authStore";
import { webcrypto } from "node:crypto";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { username, signedChallenge } = await request.json();

    // 1. Kiểm tra challenge có tồn tại không
    const pending = pendingChallenges.get(username);
    if (!pending) {
      return NextResponse.json(
        { success: false, message: "Challenge không tồn tại hoặc đã hết hạn. Vui lòng đăng nhập lại." },
        { status: 400 }
      );
    }

    // 2. Kiểm tra hết hạn
    if (Date.now() > pending.expiresAt) {
      pendingChallenges.delete(username);
      return NextResponse.json(
        { success: false, message: "Challenge đã hết hạn (3 phút). Vui lòng đăng nhập lại." },
        { status: 400 }
      );
    }

    // 3. Lấy Public Key từ DB
    const user = getAllUsers().find((u) => u.username === username);
    if (!user || !user.publicKey) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy thông tin người dùng hoặc Public Key." },
        { status: 404 }
      );
    }

    // 4. Import Public Key (SPKI base64) vào webcrypto
    const publicKeyBytes = Buffer.from(user.publicKey, "base64");
    const publicKey = await webcrypto.subtle.importKey(
      "spki",
      publicKeyBytes,
      { name: "RSA-PSS", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // 5. Xác thực chữ ký
    const signatureBytes = Buffer.from(signedChallenge, "base64");
    const challengeBytes = new TextEncoder().encode(pending.challenge);

    const isValid = await webcrypto.subtle.verify(
      { name: "RSA-PSS", saltLength: 32 },
      publicKey,
      signatureBytes,
      challengeBytes
    );

    // 6. Xóa challenge (chống replay attack)
    pendingChallenges.delete(username);

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: "Xác thực chữ ký số thành công!",
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          department: user.department,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Xác thực chữ ký số THẤT BẠI. Chữ ký không hợp lệ!" },
        { status: 401 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, message: "Lỗi xác thực: " + (e as Error).message },
      { status: 500 }
    );
  }
}
