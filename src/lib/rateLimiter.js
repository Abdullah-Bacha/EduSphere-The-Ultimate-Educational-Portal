const attempts = new Map();

export function rateLimit(identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const key = `${identifier}`;

    if (!attempts.has(key)) {
        attempts.set(key, []);
    }

    const userAttempts = attempts.get(key);
    const recentAttempts = userAttempts.filter((time) => now - time < windowMs);

    if (recentAttempts.length >= maxAttempts) {
        const oldestAttempt = recentAttempts[0];
        const resetTime = new Date(oldestAttempt + windowMs);
        return {
            limited: true,
            retryAfter: Math.ceil((resetTime - now) / 1000),
            message: `Too many attempts. Try again after ${resetTime.toLocaleTimeString()}`,
        };
    }

    recentAttempts.push(now);
    attempts.set(key, recentAttempts);

    return { limited: false };
}

export function resetRateLimit(identifier) {
    attempts.delete(identifier);
}
