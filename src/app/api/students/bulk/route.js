import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { bulkStudentAction } from "@/services/studentService";
import { validateArray, validateObjectId } from "@/validations/commonValidation";
import { handleApiError, ValidationError } from "@/lib/apiError";

const ALLOWED_ACTIONS = ["activate", "deactivate", "delete"];

export async function POST(request) {
    try {
        await requireAdmin();
        const body = await request.json();

        if (!body.ids || !body.action) {
            throw new ValidationError("Missing required fields: ids and action");
        }

        const idsValidation = validateArray(body.ids, "ids", 500);
        if (!idsValidation.valid) {
            throw new ValidationError(idsValidation.error);
        }

        if (!ALLOWED_ACTIONS.includes(body.action)) {
            throw new ValidationError(`Invalid action. Must be one of: ${ALLOWED_ACTIONS.join(", ")}`);
        }

        for (const id of body.ids) {
            const idValidation = validateObjectId(id, "Student ID");
            if (!idValidation.valid) {
                throw new ValidationError(idValidation.error);
            }
        }

        const result = await bulkStudentAction(body.ids, body.action);

        return NextResponse.json({
            success: true,
            result,
            message: `${result.modified} student(s) updated.`,
        });
    } catch (error) {
        return handleApiError(error);
    }
}
