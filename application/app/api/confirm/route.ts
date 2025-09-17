import { NextResponse } from "next/server";
import { Resend } from "resend";
import { decrypt, encrypt } from "@/app/lib/crypto";
import { WelcomeEmail } from "@/emails/WelcomeEmail";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || undefined; // needed! Else e-mail won't be send
const audienceId = process.env.NEXT_PUBLIC_AUDIENCE_ID || undefined;
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN || undefined;

export async function GET(request: Request) {
	if (!fromEmail || !audienceId || !siteUrl) {
		throw new Error("Missing Email address, audienceId and siteUrl");
	}
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

	try {
		// Update user status in Resend audience to subscribed using the email
		const updateContact = await resend.contacts.update({
			email,
			unsubscribed: false,
			audienceId: audienceId,
		});
		if (updateContact.error !== null) {
			const resErrorMessage = updateContact.error.message;
			return NextResponse.json({ resErrorMessage });
		}

		// For the welcome email we also need an unsubscribe link.
		// Generate a token with encrypted email. Without timestamp, because:
		// GDPR (conditions for consent and right to object)
		const token = encrypt(email);
		const unsubscribeLink = `${siteUrl}/unsubscribe?token=${encodeURIComponent(token)}`;
		const sendEmail = await resend.emails.send({
			from: fromEmail as string,
			to: email,
			subject: "Welcome",
			react: WelcomeEmail(unsubscribeLink),
		});
		if (sendEmail.error !== null) {
			const resErrorMessage = sendEmail.error.message;
			return NextResponse.json({ resErrorMessage });
		}
	} catch (error) {
		return NextResponse.json({ error });
	}

	return NextResponse.json({ message: "Email confirmed successfully" });
}
