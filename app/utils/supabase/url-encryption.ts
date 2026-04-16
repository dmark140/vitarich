/* eslint-disable @typescript-eslint/no-explicit-any */

export const encryptData = (data: any) => {
  try {
    if (data === undefined || data === null) return "";

    const jsonString = JSON.stringify(data);

    let encrypted = btoa(jsonString);

    const replacements = [
      { key: "=", value: "eQs" },
      { key: "/", value: "bckS" },
      { key: "+", value: "plS" },
    ];

    replacements.forEach(({ key, value }) => {
      encrypted = encrypted.replaceAll(key, value);
    });

    return encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
};
// arte man jud sa data type si typescript,
export const decryptData = (encryptedData: any) => {
  try {
    if (!encryptedData) return null;

    let base64 = encryptedData;

    const replacements = [
      { key: "eQs", value: "=" },
      { key: "bckS", value: "/" },
      { key: "plS", value: "+" },
    ];

    replacements.forEach(({ key, value }) => {
      base64 = base64.replaceAll(key, value);
    });

    const jsonString = atob(base64);

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
