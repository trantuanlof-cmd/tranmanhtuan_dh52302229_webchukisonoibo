import fs from "fs";
import path from "path";
import usersJson from "@/data/users.json";

export interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  department: string;
  publicKey: string;
}

// Biến in-memory dự phòng
let inMemoryUsers: User[] = [...(usersJson as User[])];

const isServerless = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Đường dẫn file data local
const getLocalFilePath = () => {
  return path.join(process.cwd(), "src", "data", "users.json");
};

// Đọc toàn bộ danh sách users
export async function getAllUsers(): Promise<User[]> {
  // 1. Nếu có cấu hình Vercel KV / Upstash Redis (Ưu tiên khi deploy Vercel)
  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/get/users`, {
        headers: { Authorization: `Bearer ${kvToken}` },
        cache: "no-store",
      });
      const data = await res.json();
      if (data && data.result) {
        return JSON.parse(data.result);
      }
    } catch (e) {
      console.error("Lỗi khi đọc từ Vercel KV, chuyển sang chế độ dự phòng:", e);
    }
  }

  // 2. Nếu chạy ở máy local (không phải Vercel), đọc trực tiếp từ file users.json để đồng bộ vĩnh viễn
  if (!isServerless) {
    try {
      const filePath = getLocalFilePath();
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.error("Lỗi khi đọc file users.json local:", e);
    }
  }

  // 3. Fallback in-memory
  return inMemoryUsers;
}

// Lưu thêm user mới
export async function saveUser(newUser: User): Promise<boolean> {
  const currentUsers = await getAllUsers();
  
  // Kiểm tra trùng lặp
  if (currentUsers.some((u) => u.username === newUser.username)) {
    return false;
  }

  const updatedUsers = [...currentUsers, newUser];

  // 1. Lưu vào Vercel KV / Upstash Redis
  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/set/users`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${kvToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedUsers),
      });
      const data = await res.json();
      if (data && data.result === "OK") {
        inMemoryUsers = updatedUsers;
        return true;
      }
    } catch (e) {
      console.error("Lỗi khi lưu vào Vercel KV:", e);
    }
  }

  // 2. Lưu vào file local ở máy máy của bạn để không bao giờ bị mất khi khởi động lại
  if (!isServerless) {
    try {
      const filePath = getLocalFilePath();
      fs.writeFileSync(filePath, JSON.stringify(updatedUsers, null, 2), "utf-8");
      inMemoryUsers = updatedUsers;
      return true;
    } catch (e) {
      console.error("Lỗi khi ghi file users.json local:", e);
    }
  }

  // 3. Fallback in-memory
  inMemoryUsers = updatedUsers;
  return true;
}
