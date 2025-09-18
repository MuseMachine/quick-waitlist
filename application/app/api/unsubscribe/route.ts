import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { decrypt } from "@/app/lib/crypto"; // Deine Krypto-Funktionen
import { AppError, fail } from "@/app/lib/errors";

const audienceId = process.env.AUDIENCE_ID || undefined;

export async function GET(request: NextRequest) {
	const resend = new Resend(process.env.RESEND_API_KEY);
	if (!audienceId) {
		return fail("ENVIRONMENT_VARS");
	}
	const searchParams = request.nextUrl.searchParams;
	const token = searchParams.get("token");

	if (!token) {
		return NextResponse.json(
			new AppError("BAD_REQUEST", { message: "Token is required" }).toJSON(),
		);
	}

	try {
		const decryptedData = decrypt(token);
		let email = "";
		try {
			email = decryptedData;
		} catch (error: unknown) {
			if (error instanceof Error) {
				return NextResponse.json(
					{
						code: 3,
					},
					{ status: 500 },
				);
			}
		}

		if (!email) {
			return NextResponse.json(
				new AppError("BAD_REQUEST", { message: "Token is invalid" }).toJSON(),
			);
		}

		const deleteUser = await resend.contacts.remove({
			email,
			audienceId: audienceId as string,
		});

		if (deleteUser.error !== null) {
			if (deleteUser.error.name === "not_found") {
				return NextResponse.json({ message: "You have been unsubscribed." });
			}
			return NextResponse.json(new AppError("RESEND_AUDIENCE").toJSON());
		}
		return NextResponse.json({
			message: "You have been unsubscribed.",
		});
	} catch {
		return NextResponse.json(
			new AppError("BAD_REQUEST", {
				message: "Invalid or expired link.",
			}).toJSON(),
		);
	}
}
