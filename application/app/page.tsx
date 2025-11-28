"use client";
import { Github, Hourglass, Linkedin } from "lucide-react";
import Link from "next/link";
import Card from "@/components/Card";
import EmailForm from "@/components/EmailForm";
import MMLogo from "@/components/Logo";
import CardHeader from "@/components/Offer";
import Background from "@/components/Background";

const LinkedinLink =
	process.env.NEXT_PUBLIC_LINKEDIN || "https://www.linkedin.com/";
const GithubLink = process.env.NEXT_PUBLIC_GITHUB || "https://www.github.com/";

export default function Home() {
	// Data from env
	const features =
		process.env.NEXT_PUBLIC_FEATURES ||
		"Text to 9 Images, Adjustable Creativity, Colour Input, Image Style";
	const date = process.env.NEXT_PUBLIC_LAUNCH_DATE || "2025-12-15";
	const title =
		process.env.NEXT_PUBLIC_TITLE ||
		"Join the Waitlist for the First Version of MuseBoard";
	const description = process.env.NEXT_PUBLIC_OFFER_TITLE || "";

	function getDaysLeft(): number {
		const endDate = new Date(date); // Set your target date here
		const today = new Date();
		const diffTime = endDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return Math.max(0, diffDays);
	}

	return (
		<div>
			<Background />
			<div className="w-1/3 max-sm:w-1/2 max-sm:my-8 h-auto mx-auto object-contain max-sm:mb-11 mb-14 text-[#0FFEC5]">
				<MMLogo />
			</div>
			<Card>
				<div className="md:grid md:grid-cols-2 gap-10">
					<div className="self-center max-[880px]:self-start">
						<div className="flex flex-col items-center justify-center md:items-start">
							<h1 className="md:text-4xl text-2xl leading-normal text-center md:text-left font-semibold tracking-wide mb-8">
								{title}
							</h1>
							<span
								suppressHydrationWarning={true}
								className="text-[#06664F] bg-[#6FFEDC] px-4 py-1 rounded-full text-sm items-center flex gap-1 w-fit"
							>
								<Hourglass size={14} strokeWidth={2} aria-hidden="true" />
								{getDaysLeft()} days left
							</span>
						</div>
						<CardHeader title={description} features={features} />
					</div>
					<EmailForm date={date} title={title} />
				</div>
			</Card>
			<div className="pt-4">
				<div className="w-1/4 h-auto mx-auto object-contain max-sm:mt-0 mt-8">
					<div className="flex gap-4 justify-center">
						<Link
							href={LinkedinLink}
							target="_blank"
							className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-600 shadow transition duration-200 ease-linear hover:bg-gray-100 hover:text-gray-500 hover:shadow-none"
						>
							<Linkedin size={20} />
						</Link>
						<Link
							href={GithubLink}
							target="_blank"
							className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-600 shadow transition duration-200 ease-linear hover:bg-gray-100 hover:text-gray-500 hover:shadow-none"
						>
							<Github size={20} />
						</Link>
					</div>
				</div>
				<div className="flex gap-2 text-white text-[12px] h-25 mx-auto object-contain justify-center mt-6">
					{" "}
					<Link
						href="https://musemachine.ai/legal/legal-disclosure"
						target="_blank"
						className="underline transition-all duration-200 hover:no-underline"
					>
						Legal Disclosure
					</Link>{" "}
					<Link
						href="https://musemachine.ai/legal/privacy-policy"
						target="_blank"
						className="underline transition-all duration-200 hover:no-underline"
					>
						Privacy Policy
					</Link>
				</div>
			</div>
		</div>
	);
}
