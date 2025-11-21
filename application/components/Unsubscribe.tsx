"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UnsubscribeUI() {
	const [message, setMessage] = useState("Confirmiung your ");
	const searchParams = useSearchParams();

	useEffect(() => {
		const unsubscribeEmail = async () => {
			const token = searchParams.get("token");
			if (!token) {
				setMessage("Invalid unsubscribe link");
				return;
			}

			const response = await fetch(
				`/api/unsubscribe?token=${encodeURIComponent(token)}`,
			);

			if (!response.ok || response.status !== 200) {
				return setMessage(
					"An error occurred during removing your subscription",
				);
			}

			setMessage(
				"Email has been removed successfully! You should not recieve any email from us.",
			);
		};

		unsubscribeEmail();
	}, [searchParams]);

	return <p>{message}</p>;
}
