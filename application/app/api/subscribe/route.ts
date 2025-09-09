import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/app/lib/crypto";
import { EmailConfirmation } from "@/emails/Confirmation";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL; // needed! Else e-mail won't be send
const audienceId = process.env.NEXT_PUBLIC_AUDIENCE_ID;
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN;
const subject = "Confirm your subscription";

export async function POST(req: NextRequest) {
	const body = await req.json();
	try {
		const addContact = await resend.contacts.create({
			email: body.email,
			firstName: body.firstName,
			lastName: body.lastName,
			unsubscribed: true,
			audienceId: audienceId as string,
		});

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

		return NextResponse.json({
			sendEmail,
			addContact,
		});
	} catch (error) {
		return NextResponse.json({ error });
	}
}
