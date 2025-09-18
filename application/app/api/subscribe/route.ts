import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { encrypt } from "@/app/lib/crypto";
import { fail } from "@/app/lib/errors";
import { EmailConfirmation } from "@/emails/Confirmation";

const fromEmail = process.env.FROM_EMAIL || undefined; // needed! Else e-mail won't be send
const audienceId = process.env.AUDIENCE_ID || undefined;
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN || undefined;
const subject = "Confirm your subscription";

export async function POST(req: NextRequest) {
	const apiKey = process.env.RESEND_API_KEY || undefined;
	if (!apiKey) {
		return fail("ENVIRONMENT_VARS");
	}
	const resend = new Resend(process.env.RESEND_API_KEY);
	if (!fromEmail || !audienceId || !siteUrl) {
		return fail("ENVIRONMENT_VARS");
	}
	const body = await req.json();
	try {
		// Generate a token with encrypted email and timestamp
		const tokenData = `${body.email}:${Date.now()}`;

		let token = "";
		try {
			token = encrypt(tokenData);
		} catch (error: unknown) {
			if (error instanceof Error) {
				return fail("ENCRYPTION_ERROR");
			}
		}

		const confirmationLink = `${siteUrl}/confirm?token=${encodeURIComponent(token)}`;

		const sendEmail = await resend.emails.send({
			from: fromEmail as string,
			to: [body.email],
			subject: subject,
			react: EmailConfirmation(confirmationLink),
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
	} catch {
		return fail("INTERNAL_ERROR");
	}
}
