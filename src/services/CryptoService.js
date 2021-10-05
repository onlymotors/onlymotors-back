const crypto = require('crypto');
const algorithm = "aes-192-cbc";
const password = process.env.CRYPTO_SECRET;
const key = crypto.scryptSync(password, 'salt', 24);

function criptografar(clearText) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(clearText, "utf8", "hex");
  return [
    encrypted + cipher.final("hex"),
    Buffer.from(iv).toString("hex"),
  ].join("|");
}

function descriptografar(encryptedText) {
  const [encrypted, iv] = encryptedText.split("|");
  if (!iv) throw new Error("IV not found");
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );
  return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
}

module.exports = { criptografar, descriptografar }