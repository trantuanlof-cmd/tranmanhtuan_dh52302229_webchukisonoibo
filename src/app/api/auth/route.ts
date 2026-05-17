import { NextResponse } from "next/server";
import users from "@/data/users.json";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          department: user.department,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "Sai tài khoản hoặc mật khẩu!" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi Server" },
      { status: 500 }
    );
  }
}
