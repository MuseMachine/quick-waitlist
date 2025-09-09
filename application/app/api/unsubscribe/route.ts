import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { decrypt } from "@/app/lib/crypto"; // Deine Krypto-Funktionen

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
const audienceId = process.env.NEXT_PUBLIC_AUDIENCE_ID;

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const token = searchParams.get("token");

	if (!token) {
		return NextResponse.json({ error: "Missing token." }, { status: 400 });
	}

	try {
		const decryptedData = decrypt(token);
		const { email } = JSON.parse(decryptedData);

		if (!email) {
			throw new Error("Invalid token payload.");
		}

		const deleteUser = await resend.contacts.remove({
			email,
			audienceId: audienceId as string,
		});

		if (deleteUser.error !== null) {
			if (deleteUser.error.name === "not_found") {
				return NextResponse.json({ message: "You have been unsubscribed." });
			}
			throw new Error(
				"Unsubscribe was not successfull, with the message: " +
					deleteUser.error.message,
			);
		}
		return NextResponse.json({
			message: "You have been unsubscribed.",
		});
	} catch (error) {
		console.error("Unsubscribe error:", error);
		// Gib eine generische Fehlermeldung aus, um keine Systemdetails preiszugeben.
		return NextResponse.json(
			{ error: "Invalid or expired link." },
			{ status: 400 },
		);
	}
}
