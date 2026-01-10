import { NextResponse } from "next/server";
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
		const sendEmail = await resend.emails.send({
			from: fromEmail as string,
			to: email,
			subject: "Welcome",
			html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>You've secured your spot! Get ready for MuseBoard.</title>
    </head>
    <body style="background-color: #f6f9fc; padding: 10px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #f0f0f0; padding: 45px;">
            <tr>
                <td align="center">
                    <img src="https://waitlist.musemachine.ai/mm_logo.svg" width="200" height="50" alt="Logo" style="padding-top: 40px; margin: 0 auto;">
                </td>
            </tr>
            <tr>
                <td align="center">
                    <h1 style="font-size: 28px; font-weight: bold; color: #1a1a1a; margin: 30px 0;">You're officially on the list! 🎉</h1>
                </td>
            </tr>
            <tr>
                <td>
                    <p style="font-size: 16px; font-family: 'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-weight: 400; color: #404040; line-height: 26px;">
                        Thank you for signing up for the waitlist for our prototype, <strong>MuseBoard</strong>. We're genuinely excited to have you among the first to experience what we're building.
                    </p>
                    <p style="font-size: 16px; font-family: 'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-weight: 400; color: #404040; line-height: 26px;">
                        As you know, staying updated in the creative AI space can be overwhelming. We're crafting a tool to solve exactly that, and your early feedback will be invaluable in shaping a product that truly makes a difference. You're not just a user on a list; you're a co-creator.
                    </p>
                    <hr style="border-color: #cccccc; margin: 20px 0;">
                    <p style="font-size: 16px; font-family: 'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-weight: bold; color: #000; line-height: 26px;">
                        So, what happens next?
                    </p>
                    <p style="font-size: 16px; font-family: 'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-weight: 400; color: #404040; line-height: 26px;">
                        We're putting the final touches on the prototype right now. As soon as it's ready, you will receive an exclusive invitation to be one of the very first to take it for a spin.
                    </p>
                    <p style="font-size: 16px; font-family: 'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-weight: 400; color: #404040; line-height: 26px;">
                        <strong>
                            To ensure your invitation doesn't get lost, please add <a href="mailto:info@updates.musemachine.ai">info@updates.musemachine.ai</a> to your contacts.
                        </strong> This is the best way to make sure our updates land safely in your main inbox.
                    </p>
                    <hr style="border-color: #cccccc; margin: 20px 0;">
                    <p style="font-size: 14px;">
                        You are receiving this email because you opted in via our <a href="https://waitlist.musemachine.ai" style="text-decoration: underline;">waitlist</a>.
                    </p>
                    <p style="font-size: 14px;">
                        Want to change how you receive these emails? <br />
                        You can <a href="${unsubscribeLink}" style="text-decoration: underline;">unsubscribe from this list</a>.
                    </p>
                </td>
            </tr>
        </table>
        <div style="display: flex; justify-content: center; margin-top: 20px;">
            <table style="display: flex; justify-content: center;">
                <tr>
                    <td>
                        <p>MuseMachine UG・Roehrer Weg 8・71032 Boeblingen Germany</p>
                        <p style="display: flex; justify-content: center; color: #09cd9f;">www.musemachine.ai</p>
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>
  `,
		});
		if (sendEmail.error !== null) {
			return NextResponse.json(new AppError("RESEND_SEND_EMAIL").toJSON());
		}
	} catch {
		return NextResponse.json(new AppError("INTERNAL_ERROR").toJSON());
	}

	return NextResponse.json({ message: "Email confirmed successfully" });
}
