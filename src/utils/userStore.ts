import usersJson from "@/data/users.json";

export interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  department: string;
  publicKey: string;
}

// Biến lưu tạm user mới đăng ký (in-memory, phù hợp cho demo)
export const inMemoryUsers: User[] = [];

export function getAllUsers(): User[] {
  return [...(usersJson as User[]), ...inMemoryUsers];
}
