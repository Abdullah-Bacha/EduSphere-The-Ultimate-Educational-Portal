import { NextResponse } from "next/server";

export class ApiError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}

export class AuthError extends ApiError {
    constructor(message = "Unauthorized") {
        super(message, 401);
        this.name = "AuthError";
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = "Forbidden") {
        super(message, 403);
        this.name = "ForbiddenError";
    }
}

export class ValidationError extends ApiError {
    constructor(message, errors = []) {
        super(message, 400);
        this.errors = errors;
        this.name = "ValidationError";
    }
}

export class NotFoundError extends ApiError {
    constructor(message = "Not Found") {
        super(message, 404);
        this.name = "NotFoundError";
    }
}

export function handleApiError(error) {
    console.error("[API Error]", error);

    if (error instanceof ApiError) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
                ...(error.errors && { errors: error.errors }),
            },
            { status: error.status }
        );
    }

    if (error instanceof SyntaxError) {
        return NextResponse.json(
            { success: false, message: "Request body must be valid JSON" },
            { status: 400 }
        );
    }

    if (error.name === "ValidationError" && error.errors) {
        return NextResponse.json(
            {
                success: false,
                message: "Validation failed",
                errors: Object.values(error.errors).map((e) => e.message),
            },
            { status: 400 }
        );
    }

    return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
    );
}
