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
	const apiKey = process.env.RESEND_API_KEY || undefined;
	if (!apiKey) {
		return fail("ENVIRONMENT_VARS");
	}

	const resend = new Resend(process.env.RESEND_API_KEY);
	if (!fromEmail || !audienceId || !siteUrl) {
		console.log(
			"Missing environment variables: FROM_EMAIL, AUDIENCE_ID, or NEXT_PUBLIC_DOMAIN",
		);
		return fail("ENVIRONMENT_VARS");
	}

	const body = await req.json();
	console.log("Request body:", { body });

	// Validate Turnstile token presence
	if (!body.turnstileToken) {
		return fail("BAD_REQUEST");
	}

	// Verify Turnstile token with Cloudflare
	const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
	if (!turnstileSecretKey) {
		return fail("ENVIRONMENT_VARS");
	}

	try {
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

		if (!verifyResult.success) {
			console.log("Turnstile verification failed", {
				errorCodes: verifyResult["error-codes"],
			});
			return fail("TURNSTILE_VERIFICATION_FAILED");
		}
	} catch (error: unknown) {
		console.log("Turnstile verification API call failed", { error });
		return fail("INTERNAL_ERROR");
	}
	try {
		// Generate a token with encrypted email and timestamp
		const tokenData = `${body.email}:${Date.now()}`;

		let token = "";
		try {
			token = encrypt(tokenData);
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.log("Encryption failed", { error });
				return fail("ENCRYPTION_ERROR");
			}
		}

		const confirmationLink = `${siteUrl}/confirm?token=${encodeURIComponent(token)}`;

		const sendEmail = await resend.emails.send({
			from: fromEmail as string,
			to: [body.email],
			subject: subject,
			react: `<div><h1>Confirm your subscription</h1><a href="${confirmationLink}">Click here to confirm</a></div>`,
			// react: EmailConfirmation(confirmationLink),
		});
		const addContact = await resend.contacts.create({
			email: body.email,
			firstName: body.firstName,
			lastName: body.lastName,
			unsubscribed: true,
			audienceId: audienceId as string,
		});

		return NextResponse.json({
			sendEmail,
			addContact,
		});
	} catch (error) {
		console.log("Failed to send email or add contact", { error });
		return fail("INTERNAL_ERROR", { cause: String(error) });
	}
}
