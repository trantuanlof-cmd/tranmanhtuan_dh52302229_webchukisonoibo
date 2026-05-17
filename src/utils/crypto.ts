// Sử dụng Web Crypto API thuần của trình duyệt để không phụ thuộc server
export async function generateSHA256Hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export async function signData(text: string, privateKeyStr: string): Promise<string> {
  // 1. Băm nội dung
  const hash = await generateSHA256Hash(text);
  
  // 2. Ký số bằng Private Key (Giả lập cho mục đích demo Frontend)
  // Trong thực tế sẽ dùng thư viện RSA như node-forge để mã hóa chuỗi Hash
  // Ví dụ: const signature = forge.pki.privateKey.sign(hash)
  
  // Ở đây tạo ra một chuỗi Base64 đại diện cho Chữ ký RSA
  const signaturePayload = `[RSA_SIGNATURE_OF_${hash}_WITH_KEY_${privateKeyStr.substring(0, 10)}]`;
  return btoa(signaturePayload);
}
