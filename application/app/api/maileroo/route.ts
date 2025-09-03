import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const baseUrlMaileroo = "https://manage.maileroo.app/v1/contact/";
	const listId = "1445";
	const apiKey = process.env.NEXT_MAILEROO_API_KEY;
	if (!apiKey) {
		throw new Error("No api key or list id given");
	}
	const url = new URL(baseUrlMaileroo + listId);

	try {
		const response = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": apiKey,
			},
			body: JSON.stringify({
				subscriber_name: body.name,
				subscriber_email: body.email,
				subscriber_status: "UNCONFIRMED",
				subscriber_timezone: "Europe/Berlin",
			}),
		});

		if (response.ok) {
			return new Response(JSON.stringify({ message: "ok" }));
		} else {
			return new Response(
				JSON.stringify({
					message: "not ok",
					resp: await response.json(),
					url: url.toString(),
				}),
			);
		}
	} catch (error) {
		return new Response(JSON.stringify({ error: error }), { status: 500 });
	}
}
