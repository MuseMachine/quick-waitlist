import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { encrypt } from "@/app/lib/crypto";
import { fail } from "@/app/lib/errors";
import { EmailConfirmation } from "@/emails/Confirmation";

const fromEmail = process.env.FROM_EMAIL || undefined; // needed! Else e-mail won't be send
const audienceId = process.env.AUDIENCE_ID || undefined;
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN || undefined;
const subject = "Confirm your subscription";

// TypeScript interfaces for Cloudflare Turnstile verification
interface TurnstileVerifyRequest {
	secret: string;
	response: string;
	remoteip?: string;
}

interface TurnstileVerifyResponse {
	success: boolean;
	challenge_ts?: string;
	hostname?: string;
	"error-codes"?: string[];
	action?: string;
	cdata?: string;
}

export async function POST(req: NextRequest) {
	console.info("Subscribe API called");

	const apiKey = process.env.RESEND_API_KEY || undefined;
	if (!apiKey) {
		console.error("Missing Resend API key");
		return fail("ENVIRONMENT_VARS");
	}

	const resend = new Resend(process.env.RESEND_API_KEY);
	if (!fromEmail || !audienceId || !siteUrl) {
		console.error(
			"Missing environment variables: FROM_EMAIL, AUDIENCE_ID, or NEXT_PUBLIC_DOMAIN",
		);
		return fail("ENVIRONMENT_VARS");
	}

	const body = await req.json();
	console.debug("Request body:", { body });

	// Validate Turnstile token presence
	if (!body.turnstileToken) {
		console.error("Turnstile token is missing in the request");
		return fail("BAD_REQUEST");
	}

	// Verify Turnstile token with Cloudflare
	const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
	if (!turnstileSecretKey) {
		console.error("Turnstile secret key is missing");
		return fail("ENVIRONMENT_VARS");
	}

	try {
		console.debug("Verifying Turnstile token with Cloudflare");
		const verifyResponse = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					secret: turnstileSecretKey,
					response: body.turnstileToken,
				} as TurnstileVerifyRequest),
			},
		);

		const verifyResult: TurnstileVerifyResponse = await verifyResponse.json();
		console.debug("Turnstile verification result:", { verifyResult });

		if (!verifyResult.success) {
			console.error("Turnstile verification failed", {
				errorCodes: verifyResult["error-codes"],
			});
			return fail("TURNSTILE_VERIFICATION_FAILED");
		}
	} catch (error: unknown) {
		console.error("Turnstile verification API call failed", { error });
		return fail("INTERNAL_ERROR", { cause: error });
	}

	try {
		// Generate a token with encrypted email and timestamp
		const tokenData = `${body.email}:${Date.now()}`;
		console.debug("Generating token for email:", { email: body.email });

		let token = "";
		try {
			token = encrypt(tokenData);
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Encryption failed", { error });
				return fail("ENCRYPTION_ERROR");
			}
		}

		const confirmationLink = `${siteUrl}/confirm?token=${encodeURIComponent(token)}`;
		console.debug("Confirmation link generated:", { confirmationLink });

		const sendEmail = await resend.emails.send({
			from: fromEmail as string,
			to: [body.email],
			subject: subject,
			react: EmailConfirmation(confirmationLink),
		});
		console.info("Email sent successfully", { email: body.email });

		const addContact = await resend.contacts.create({
			email: body.email,
			firstName: body.firstName,
			lastName: body.lastName,
			unsubscribed: true,
			audienceId: audienceId as string,
		});
		console.info("Contact added to audience", { email: body.email });

		return NextResponse.json({
			sendEmail,
			addContact,
		});
	} catch (error) {
		console.error("Failed to send email or add contact", { error });
		return fail("INTERNAL_ERROR");
	}
}
