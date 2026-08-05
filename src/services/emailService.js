import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
    if (transporter) return transporter;

    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT) || 587;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!host || !user || !pass) return null;

    transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });

    return transporter;
}

const FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@lmsuniversity.com";
const SITE_NAME = "LMS University";

/**
 * Send an email. Silently skips if email is not configured.
 */
export async function sendEmail({ to, subject, html }) {
    const t = getTransporter();
    if (!t) return; // email not configured — skip silently

    try {
        await t.sendMail({ from: `"${SITE_NAME}" <${FROM}>`, to, subject, html });
    } catch (err) {
        console.error("[EmailService] Failed to send email:", err.message);
    }
}

/* ── Email templates ── */

export function gradeNotificationEmail({ studentName, assignmentTitle, marksAwarded, totalMarks, feedback }) {
    return {
        subject: `Your assignment "${assignmentTitle}" has been graded`,
        html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;">
                <h2 style="color:#0f172a;margin-bottom:8px;">Assignment Graded 🎉</h2>
                <p style="color:#475569;">Hi ${studentName},</p>
                <p style="color:#475569;">Your submission for <strong>${assignmentTitle}</strong> has been reviewed.</p>
                <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0;">
                    <p style="margin:0;font-size:24px;font-weight:700;color:#6366f1;">${marksAwarded} / ${totalMarks}</p>
                    <p style="margin:4px 0 0;color:#64748b;font-size:14px;">Marks Awarded</p>
                    ${feedback ? `<hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;"/><p style="color:#475569;font-size:14px;margin:0;"><strong>Feedback:</strong> ${feedback}</p>` : ""}
                </div>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/student/assignments" style="display:inline-block;background:#6366f1;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Assignment</a>
                <p style="color:#94a3b8;font-size:12px;margin-top:32px;">© ${SITE_NAME}</p>
            </div>
        `,
    };
}

export function announcementEmail({ title, message, link }) {
    return {
        subject: `[${SITE_NAME}] ${title}`,
        html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;">
                <h2 style="color:#0f172a;margin-bottom:8px;">📢 ${title}</h2>
                <p style="color:#475569;white-space:pre-wrap;">${message}</p>
                ${link ? `<a href="${link}" style="display:inline-block;background:#6366f1;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px;">Learn more</a>` : ""}
                <p style="color:#94a3b8;font-size:12px;margin-top:32px;">© ${SITE_NAME} — You received this because you are enrolled on this platform.</p>
            </div>
        `,
    };
}

export function newSubmissionEmail({ teacherName, studentName, assignmentTitle, courseTitle }) {
    return {
        subject: `New submission: "${assignmentTitle}" by ${studentName}`,
        html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;">
                <h2 style="color:#0f172a;margin-bottom:8px;">New Assignment Submission 📝</h2>
                <p style="color:#475569;">Hi ${teacherName},</p>
                <p style="color:#475569;"><strong>${studentName}</strong> has submitted their work for <strong>${assignmentTitle}</strong> in <strong>${courseTitle}</strong>.</p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/teacher/assignments" style="display:inline-block;background:#6366f1;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Review Submission</a>
                <p style="color:#94a3b8;font-size:12px;margin-top:32px;">© ${SITE_NAME}</p>
            </div>
        `,
    };
}
