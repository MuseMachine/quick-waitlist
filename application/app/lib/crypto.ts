import crypto from "node:crypto";

const algorithm = "aes-256-cbc";

// Errors are due to typescript types not matching correctly with the node:crypto package.
// Ignore them. It works in runtime.
/**
 * Takes the text and encrypts it, return the encrypted text. Errors if the passphrase is missing in the environment variables.
 * @param text
 * @returns string | Error
 */
export function encrypt(text: string): string {
	const secretPassphrase = process.env.PASSPHRASE || undefined;
	if (!secretPassphrase) {
		throw new Error("Missing ENCRYPTION_KEY");
	}
	const iv = crypto.randomBytes(16);
	const salt = crypto.randomBytes(16); // Unique salt for each encryption
	const key = crypto.scryptSync(secretPassphrase, salt, 32);
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(text, "utf8", "hex");
	encrypted += cipher.final("hex");
	return `${iv.toString("hex")}:${salt.toString("hex")}:${encrypted}`;
}

export function decrypt(text: string): string {
	const secretPassphrase = process.env.PASSPHRASE || undefined;
	if (!secretPassphrase) {
		throw new Error("Missing ENCRYPTION_KEY");
	}
	const [ivHex, saltHex, encryptedHex] = text.split(":");
	const iv = Buffer.from(ivHex, "hex");
	const salt = Buffer.from(saltHex, "hex");
	const key = crypto.scryptSync(secretPassphrase, salt, 32);
	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	let decrypted = decipher.update(encryptedHex, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
}
