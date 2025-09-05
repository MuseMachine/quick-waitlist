import { decrypt } from "@/app/lib/crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
const audienceId = process.env.NEXT_PUBLIC_AUDIENCE_ID || "";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const token = searchParams.get("token");

	if (!token) {
		return NextResponse.json({ error: "Token is required" }, { status: 400 });
	}

	const decryptedToken = decrypt(token);
	const [email, timestamp] = decryptedToken.split(":");

	// Check if the token is expired (e.g., after 24 hours)
	const deci = 10;
	const tokenAge = Date.now() - Number.parseInt(timestamp, deci);
	if (tokenAge > 24 * 60 * 60 * 1000) {
		return NextResponse.json({ error: "Token has expired" }, { status: 400 });
	}

	// // Check if user is already confirmed
	// await resend.contacts.get({
	// 	email,
	// 	audienceId,
	// });

	// Update user status in Resend audience to subscribed using the email
	await resend.contacts.update({
		email,
		unsubscribed: false,
		audienceId: audienceId,
	});

	return NextResponse.json({ message: "Email confirmed successfully" });
}
