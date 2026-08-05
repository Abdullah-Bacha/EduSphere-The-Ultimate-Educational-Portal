import dbConnect from "@/lib/dbConnect";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";
import User from "@/models/User";
import Progress from "@/models/Progress";
import mongoose from "mongoose";

function serializeDoc(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : { ...doc };
    return {
        ...obj,
        _id: obj._id?.toString(),
        id: obj._id?.toString(),
        course: obj.course?.toString(),
        student: obj.student?.toString(),
        quiz: obj.quiz?.toString(),
        createdAt: obj.createdAt ? obj.createdAt.toISOString() : null,
        updatedAt: obj.updatedAt ? obj.updatedAt.toISOString() : null,
    };
}

export async function getStudentQuizzes(studentId) {
    await dbConnect();

    const student = await User.findById(studentId);
    if (!student) throw new Error("Student not found");

    const quizzes = await Quiz.find({
        course: { $in: student.enrolledCourses },
        isPublished: true,
    }).sort({ createdAt: -1 });

    const attempts = await QuizAttempt.find({
        student: studentId,
        quiz: { $in: quizzes.map(q => q._id) },
    });

    return quizzes.map(quiz => {
        const attempt = attempts.find(a => a.quiz.toString() === quiz._id.toString());
        // Do not expose correctOptionIndex to the frontend!
        const sanitizedQuiz = serializeDoc(quiz);
        if (sanitizedQuiz.questions) {
            sanitizedQuiz.questions = sanitizedQuiz.questions.map(q => {
                const { correctOptionIndex, ...rest } = q;
                return rest;
            });
        }

        return {
            ...sanitizedQuiz,
            attempt: serializeDoc(attempt),
        };
    });
}

export async function submitQuiz(studentId, quizId, answers) {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
        throw new Error("Invalid Quiz ID");
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");

    // Check if attempt already exists
    const existingAttempt = await QuizAttempt.findOne({ quiz: quizId, student: studentId });
    if (existingAttempt) {
        throw new Error("Quiz already attempted");
    }

    let score = 0;
    const gradedAnswers = quiz.questions.map((q, index) => {
        const studentAnswer = answers.find(a => a.questionIndex === index);
        const selectedOptionIndex = studentAnswer ? studentAnswer.selectedOptionIndex : -1;
        const isCorrect = selectedOptionIndex === q.correctOptionIndex;
        
        if (isCorrect) score += 1;
        
        return {
            questionIndex: index,
            selectedOptionIndex,
            isCorrect
        };
    });

    const attempt = await QuizAttempt.create({
        quiz: quizId,
        student: studentId,
        score,
        totalQuestions: quiz.questions.length,
        answers: gradedAnswers
    });

    // Update Progress
    await Progress.findOneAndUpdate(
        { student: studentId, course: quiz.course },
        { $addToSet: { completedQuizzes: quizId }, lastAccessed: new Date() },
        { upsert: true }
    );

    const { recalculateProgress } = await import("@/services/progressService");
    await recalculateProgress(studentId, quiz.course);

    const { notifyUsers } = await import("@/services/notificationService");
    await notifyUsers([studentId], {
        title: "Quiz result published",
        message: `You scored ${score}/${quiz.questions.length} on "${quiz.title}".`,
        link: `/dashboard/student/quizzes`,
    });

    const Course = (await import("@/models/Course")).default;
    const course = await Course.findById(quiz.course).select("teacher title").lean();
    if (course?.teacher) {
        const student = await User.findById(studentId).select("name").lean();
        await notifyUsers([course.teacher], {
            title: "New quiz attempt",
            message: `${student?.name ?? "A student"} scored ${score}/${quiz.questions.length} on "${quiz.title}".`,
            link: `/dashboard/teacher/quizzes?courseId=${quiz.course}`,
        });
    }

    return serializeDoc(attempt);
}
