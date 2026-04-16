import CryptoJS from "crypto-js"

const SECRET = process.env.NEXT_PUBLIC_APPROVAL_SECRET!

export function encryptValue(value: string) {
  return CryptoJS.AES.encrypt(value, SECRET).toString()
}