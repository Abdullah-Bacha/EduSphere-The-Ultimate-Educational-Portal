export function validateArray(arr, name = "array", maxLength = 100) {
    if (!Array.isArray(arr)) {
        return { valid: false, error: `${name} must be an array` };
    }
    if (arr.length === 0) {
        return { valid: false, error: `${name} cannot be empty` };
    }
    if (arr.length > maxLength) {
        return { valid: false, error: `${name} cannot exceed ${maxLength} items` };
    }
    return { valid: true };
}

export function validateString(str, name = "string", minLength = 1, maxLength = 500) {
    if (typeof str !== "string") {
        return { valid: false, error: `${name} must be a string` };
    }
    const trimmed = str.trim();
    if (trimmed.length < minLength) {
        return { valid: false, error: `${name} must be at least ${minLength} characters` };
    }
    if (trimmed.length > maxLength) {
        return { valid: false, error: `${name} cannot exceed ${maxLength} characters` };
    }
    return { valid: true };
}

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: "Invalid email format" };
    }
    return { valid: true };
}

export function validateObjectId(id, name = "ID") {
    if (typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return { valid: false, error: `${name} must be a valid MongoDB ID` };
    }
    return { valid: true };
}

export function validateFile(file, maxSizeMB = 10, allowedTypes = ["image", "pdf", "text"]) {
    if (!file) {
        return { valid: false, error: "File is required" };
    }
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
        return { valid: false, error: `File size cannot exceed ${maxSizeMB}MB` };
    }
    const typeMatch = file.type.split("/")[0];
    if (!allowedTypes.includes(typeMatch) && !allowedTypes.includes(file.type)) {
        return { valid: false, error: `File type not allowed` };
    }
    return { valid: true };
}
