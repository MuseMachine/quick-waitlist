// lib/errors.ts
import { NextResponse } from "next/server";

// Central error registry: extend by adding entries here.
export const ERROR_DEFS = {
	INTERNAL_ERROR: { status: 500, code: 1000 },
	ENCRYPTION_ERROR: { status: 500, code: 1010 },
	DECRYPTION_ERROR: { status: 500, code: 1020 },
	ENVIRONMENT_VARS: { status: 500, code: 1030 },
	RESEND_SEND_EMAIL: { status: 500, code: 1040 },
	RESEND_AUDIENCE: { status: 500, code: 1050 },
	// examples for non-500 errors:
	BAD_REQUEST: { status: 400, code: 4000 },
	TURNSTILE_VERIFICATION_FAILED: { status: 400, code: 4010 },
	UNAUTHORIZED: { status: 401, code: 4001 },
	NOT_FOUND: { status: 404, code: 4004 },
} as const;

export type ErrorType = keyof typeof ERROR_DEFS;

export interface ErrorBody {
	error: {
		type: ErrorType;
		code?: number; // included only for 500 errors
		message?: string; // included only for <500 errors
	};
	timestamp: string;
	requestId?: string;
}

// AppError derives status/code from the registry; no external status/code overrides.
export class AppError extends Error {
	readonly type: ErrorType;
	readonly status: number;
	readonly code: number;
	readonly requestId?: string;

	constructor(
		type: ErrorType,
		opts?: { requestId?: string; cause?: unknown; message?: string },
	) {
		super(opts?.message ? opts.message : type, { cause: opts?.cause });
		this.name = "AppError";
		this.type = type;
		this.status = ERROR_DEFS[type].status;
		this.code = ERROR_DEFS[type].code;
		this.requestId = opts?.requestId;
	}

	// Only expose type, and include numeric code only when status is 500.
	// No message or cause is serialized.
	toJSON(): ErrorBody {
		return {
			error: {
				type: this.type,
				...(this.status === 500
					? { code: this.code }
					: { message: this.message }),
				...{ cause: this.cause },
			},
			timestamp: new Date().toISOString(),
			...(this.requestId ? { requestId: this.requestId } : {}),
		};
	}
}

// Convenience subclass for the common 500 case.
export class InternalError extends AppError {
	constructor(opts?: { requestId?: string; cause?: unknown }) {
		super("INTERNAL_ERROR", opts);
	}
}

// Turn any error into a safe Next.js JSON response.
export function jsonError(e: unknown): NextResponse {
	const err = e instanceof AppError ? e : new InternalError();
	return NextResponse.json(err, { status: err.status });
}

// One-liner to fail by type without subclassing.
export function fail(
	type: ErrorType,
	opts?: { requestId?: string; cause?: unknown },
): NextResponse {
	return jsonError(new AppError(type, opts));
}
