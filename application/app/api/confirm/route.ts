import { NextResponse } from "next/server";
import { renderToString } from "react-dom/server";
import { Resend } from "resend";
import { decrypt, encrypt } from "@/app/lib/crypto";
import { AppError, fail } from "@/app/lib/errors";
import { WelcomeEmail } from "@/emails/WelcomeEmail";

const fromEmail = process.env.FROM_EMAIL || undefined; // needed! Else e-mail won't be send
const audienceId = process.env.AUDIENCE_ID || undefined;
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN || undefined;

export async function GET(request: Request) {
	const resend = new Resend(process.env.RESEND_API_KEY);
	if (!fromEmail || !audienceId || !siteUrl) {
		return fail("ENVIRONMENT_VARS");
	}
	const { searchParams } = new URL(request.url);
	const token = searchParams.get("token");

	if (!token) {
		return NextResponse.json(
			new AppError("BAD_REQUEST", { message: "Token is required" }).toJSON(),
		);
	}

	const decryptedToken = decrypt(token);
	const [email, timestamp] = decryptedToken.split(":");

	// Check if the token is expired (e.g., after 24 hours)
	const deci = 10;
	const tokenAge = Date.now() - Number.parseInt(timestamp, deci);
	if (tokenAge > 24 * 60 * 60 * 1000) {
		return NextResponse.json(
			new AppError("BAD_REQUEST", { message: "Token has expired" }).toJSON(),
		);
	}

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
		const preRenderHtml = renderToString(WelcomeEmail(unsubscribeLink));
		const sendEmail = await resend.emails.send({
			from: fromEmail as string,
			to: email,
			subject: "Welcome",
			html: preRenderHtml,
		});
		if (sendEmail.error !== null) {
			return NextResponse.json(new AppError("RESEND_SEND_EMAIL").toJSON());
		}
	} catch {
		return NextResponse.json(new AppError("INTERNAL_ERROR").toJSON());
	}

	return NextResponse.json({ message: "Email confirmed successfully" });
}
