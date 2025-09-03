import { NextRequest } from "next/server";

interface TokenCache {
	accessToken: string | null;
	expiresAt: number | null;
}

let tokenCache: TokenCache = {
	accessToken: null,
	expiresAt: null,
};

async function getCleverReachToken(): Promise<string> {
	if (
		tokenCache.accessToken &&
		tokenCache.expiresAt &&
		Date.now() < tokenCache.expiresAt
	) {
		return tokenCache.accessToken;
	}
	console.log("test");
	const clientId = process.env.NEXT_CLEVERREACH_CLIENT_ID;
	const clientSecret = process.env.NEXT_CLEVERREACH_CLIENT_SECRET;

	const tokenUrl = "https://rest.cleverreach.com/oauth/token.php";

	if (!clientId || !clientSecret) {
		throw new Error(
			"CleverReach client ID or secret is not configured in environment variables.",
		);
	}

	try {
		// CORRECTED AUTHENTICATION METHOD: Using HTTP Basic Auth in the header.
		// 1. Combine client ID and secret, then Base64-encode them.
		const encodedCredentials = Buffer.from(
			`${clientId}:${clientSecret}`,
		).toString("base64");

		const response = await fetch(tokenUrl, {
			method: "POST",
			headers: {
				// 2. Set the Authorization header for Basic Auth.
				Authorization: `Basic ${encodedCredentials}`,
			},
			// 4. The body now only contains the grant_type.
			body: new URLSearchParams({ grant_type: "client_credentials" }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				`Failed to fetch CleverReach token: ${response.statusText} - ${JSON.stringify(errorData)}`,
			);
		}

		const tokenData = await response.json();
		const expiresIn = tokenData.expires_in; // The duration in seconds

		// Store the new token and its expiration time in the cache.
		// We subtract 60 seconds from the expiry time as a safety buffer.
		tokenCache = {
			accessToken: tokenData.access_token,
			expiresAt: Date.now() + (expiresIn - 60) * 1000,
		};

		return tokenCache.accessToken as string;
	} catch (error) {
		console.error("Error getting CleverReach token:", error);
		// Clear the cache in case of an error
		tokenCache = { accessToken: null, expiresAt: null };
		throw error;
	}
}

async function POST(req: NextRequest) {
	const waitListGroupId = process.env.NEXT_CLEVERREACH_GROUP_ID;
	const body = await req.json();
	try {
		const token = await getCleverReachToken();
		const cleverreachApiBasePath = "https://rest.cleverreach.com/v3";
		const url = new URL(
			cleverreachApiBasePath + "/groups.json/" + waitListGroupId + "/receivers",
		);
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"content-type": "application/json",
			},
			body: JSON.stringify({ email: body.email, source: "Waiting List MVP" }),
		});
		if (response.ok) {
			return new Response(JSON.stringify({ message: await response.json() }));
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
		return new Response(JSON.stringify({ error: "Failed" }), { status: 500 });
	}
}

async function GET() {
	try {
		const token = await getCleverReachToken();
		const cleverreachApiBasePath = "https://rest.cleverreach.com/v3";
		const url = new URL(
			cleverreachApiBasePath +
				"/receivers.json/" +
				"kapilan.koch@musemachine.de",
		);
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.ok) {
			return new Response(
				JSON.stringify({ user: await response.json(), requesturl: url }),
			);
		} else {
			const body = await response.json();
			return new Response(
				JSON.stringify({ message: body, requesturl: url.href }),
			);
		}
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Failed to fetch token", status: error }),
			{ status: 500 },
		);
	}
}
