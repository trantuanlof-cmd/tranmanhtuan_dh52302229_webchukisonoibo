// Module dùng chung để lưu challenges đang chờ xác thực (in-memory)
// Được dùng chung bởi /api/auth và /api/auth/verify

export interface PendingChallenge {
  challenge: string;
  expiresAt: number;
}

// Map lưu: username -> challenge
export const pendingChallenges = new Map<string, PendingChallenge>();
