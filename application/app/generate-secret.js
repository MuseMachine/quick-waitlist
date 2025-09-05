// generate-secret.js
// Run this file once with `node generate-secret.js` to create a new secure secret.

import { randomBytes } from "crypto";

// We want 256 bits of entropy, which is 32 bytes.
const secretBytes = 32;

// Generate 32 random bytes and encode them as a hexadecimal string.
// This will result in a 64-character long string.
const masterSecret = randomBytes(secretBytes).toString("hex");

console.log("Your new secure master secret is:");
console.log(masterSecret);
