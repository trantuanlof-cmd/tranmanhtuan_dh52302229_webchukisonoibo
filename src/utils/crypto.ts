// Toàn bộ dùng Web Crypto API của trình duyệt - không cần thư viện bên ngoài

// ====== Key Generation ======
export async function generateKeyPair(): Promise<{ publicKeyBase64: string; privateKeyBase64: string }> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-PSS",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  );

  const publicKeySpki = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKeyPkcs8 = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKeySpki)));
  const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKeyPkcs8)));

  return { publicKeyBase64, privateKeyBase64 };
}

// ====== Sign Challenge (Client dùng Private Key) ======
export async function signChallenge(challenge: string, privateKeyBase64: string): Promise<string> {
  const privateKeyBytes = Uint8Array.from(atob(privateKeyBase64), (c) => c.charCodeAt(0));

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyBytes,
    { name: "RSA-PSS", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const challengeBytes = new TextEncoder().encode(challenge);
  const signatureBytes = await crypto.subtle.sign(
    { name: "RSA-PSS", saltLength: 32 },
    privateKey,
    challengeBytes
  );

  return btoa(String.fromCharCode(...new Uint8Array(signatureBytes)));
}

// ====== Hash SHA-256 ======
export async function generateSHA256Hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ====== Sign Document ======
export async function signData(text: string, privateKeyBase64: string): Promise<string> {
  const hash = await generateSHA256Hash(text);
  return signChallenge(hash, privateKeyBase64);
}
