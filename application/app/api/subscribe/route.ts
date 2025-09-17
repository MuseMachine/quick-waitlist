import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { encrypt } from "@/app/lib/crypto";
import { EmailConfirmation } from "@/emails/Confirmation";

const fromEmail = process.env.FROM_EMAIL || undefined; // needed! Else e-mail won't be send
const audienceId = process.env.AUDIENCE_ID || undefined;
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN || undefined;
const subject = "Confirm your subscription";

export async function POST(req: NextRequest) {
	const resend = new Resend(process.env.RESEND_API_KEY);
	if (!fromEmail || !audienceId || !siteUrl) {
		throw new Error("Missing Email address, audienceId and siteUrl");
	}
	const body = await req.json();
	try {
		// Generate a token with encrypted email and timestamp
		const tokenData = `${body.email}:${Date.now()}`;
		const token = encrypt(tokenData);

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
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
