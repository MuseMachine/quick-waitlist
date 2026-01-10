"use client";
import { Turnstile } from "@marsidev/react-turnstile";
import { LoaderCircle } from "lucide-react";
import type React from "react";
import { useId, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EmailForm = ({ date, title }: { date: string; title: string }) => {
	const nameId = useId();
	const emailId = useId();
	const checkboxId = useId();
	const [isPending, startTransaction] = useTransition();
	const [turnstileToken, setTurnstileToken] = useState<string>("");

	const handleTurnstileSuccess = (token: string) => {
		setTurnstileToken(token);
	};

	const handleTurnstileError = () => {
		setTurnstileToken("");
		toast.error("Verification failed. Please try again");
	};

	const handleTurnstileExpire = () => {
		setTurnstileToken("");
	};

	const handleSubmit = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		const target = event.target as HTMLFormElement;
		const form = new FormData(target);
		const email = form.get("email");
		const name = form.get("name") as string;
		const checkBoxState = form.get("checkbox") as string;
		if (!email || !name || !checkBoxState) {
			return null;
		}

		// Validate Turnstile token presence before submission
		if (!turnstileToken) {
			toast.error("Please complete the verification to continue");
			return;
		}

		// Split full name into first and last name
		const [firstName, ...lastNameParts] = name.trim().split(" ");
		const lastName = lastNameParts.join(" ") || ""; // Join remaining parts or empty string

		startTransaction(async () => {
			try {
				const res = await fetch("/api/subscribe", {
					method: "POST",
					body: JSON.stringify({ firstName, lastName, email, turnstileToken }),
					headers: { "Content-Type": "application/json" },
				});

				if (res.ok) {
					target.reset();
					setTurnstileToken(""); // Reset token after successful submission
					toast.success("Thank you for subscribing 🎉");
				} else {
					// Handle API errors related to Turnstile verification
					const errorData = await res.json().catch(() => ({}));
					console.log("Error:", res.status, res.statusText);

					// Check if it's a Turnstile verification error
					if (res.status === 400 && errorData.code === 4010) {
						toast.error(
							"Bot verification failed. Please refresh and try again",
						);
						setTurnstileToken(""); // Reset token on verification failure
					} else {
						toast.error("Something went wrong");
						setTurnstileToken(""); // Reset token on other errors
					}
				}
			} catch (error) {
				console.log("Fetch error:", error);
				setTurnstileToken(""); // Reset token on network errors
				toast.error("Something went wrong");
			}
		});
	};
	return (
		<div className="py-5 space-y-8 flex flex-col justify-center border border-white rounded-2xl p-8 self-center bg-white/10">
			<p>
				MuseBoard is coming soon — and you can be among the very first to try
				it. The future of creative image generation starts here, and the
				countdown has already begun. Join the Waitlist today and secure your
				early access before the public launch.
			</p>

			<form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
				<div>
					<div className="relative">
						<Input
							type="text"
							name="name"
							id={nameId}
							required
							placeholder="Full name"
							className="rounded-full placeholder:text-[#CFCFCF] text-[#F5F5F5]"
						/>
					</div>
				</div>
				<div>
					<div className="relative">
						<Input
							type="email"
							name="email"
							id={emailId}
							required
							placeholder="Your email address"
							className="rounded-full placeholder:text-[#CFCFCF] text-[#F5F5F5] focus:boder-red-500"
						/>
					</div>
				</div>
				<div className="flex gap-2 px-4">
					<Input
						name="checkbox"
						id={checkboxId}
						type="checkbox"
						className="relative size-4 content-between top-0.5 flex-shrink-0"
						required
					/>
					<Label className="leading-5">
						I&apos;ve read the{" "}
						<a
							href="https://musemachine.ai/en/privacy-policy"
							className="underline hover:no-underline"
						>
							privacy policy
						</a>
						&nbsp; and agree that my email address will be stored and processed
						for the purpose of maintaining the waiting list.
					</Label>
				</div>
				<Button
					disabled={isPending}
					data-loading={isPending}
					type="submit"
					className="group relative disabled:opacity-100 w-full rounded-full"
				>
					<span className="group-data-[loading=true]:text-transparent text-black text-lg font-medium">
						Join the waitlist
					</span>
					{isPending && (
						<div className="absolute inset-0 flex items-center justify-center">
							<LoaderCircle
								className="animate-spin"
								size={16}
								strokeWidth={2}
								aria-hidden="true"
							/>
						</div>
					)}
				</Button>
				<div className="flex justify-center">
					<Turnstile
						siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
						onSuccess={handleTurnstileSuccess}
						onError={handleTurnstileError}
						onExpire={handleTurnstileExpire}
						options={{
							theme: "auto",
							size: "normal",
						}}
					/>
				</div>
			</form>
		</div>
	);
};

export default EmailForm;
