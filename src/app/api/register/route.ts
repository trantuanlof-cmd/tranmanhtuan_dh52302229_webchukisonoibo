import { NextResponse } from "next/server";
import { getAllUsers, saveUser } from "@/utils/userStore";

export async function GET() {
  const users = await getAllUsers();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const { username, password, fullName, department, publicKey } = await request.json();

    const allUsers = await getAllUsers();

    if (allUsers.find((u) => u.username === username)) {
      return NextResponse.json(
        { success: false, message: "Tên đăng nhập đã tồn tại!" },
        { status: 400 }
      );
    }

    const newId = `NV${String(allUsers.length + 1).padStart(3, "0")}`;

    const newUser = {
      id: newId,
      username,
      password,
      fullName,
      department: department || "Chưa phân công",
      publicKey: publicKey || "", // Public Key thực (SPKI base64) từ client gửi lên
    };

    const saved = await saveUser(newUser);
    if (!saved) {
      return NextResponse.json(
        { success: false, message: "Tên đăng nhập đã tồn tại!" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đăng ký thành công! Vui lòng đăng nhập.",
      user: { id: newId, username, fullName },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Lỗi Server" }, { status: 500 });
  }
}
