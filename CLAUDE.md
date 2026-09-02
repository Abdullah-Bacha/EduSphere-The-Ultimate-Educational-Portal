# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Building
npm run build        # Build for production
npm start           # Run production server

# Code quality
npm run lint        # Run ESLint
```

## Project Structure & Architecture

This is a **Learning Management System (LMS)** built with **Next.js 16** (App Router), **React 19**, **MongoDB**, and **Tailwind CSS 4**. It supports three user roles: **admin**, **teacher**, and **student**, each with distinct dashboards and permissions.

**Directory Layout:**
```
src/
├── app/                    # Next.js App Router (pages, routes, API)
│   ├── (dashboard)/        # Protected routes (require authentication)
│   │   └── dashboard/      # Role-based dashboards (admin, teacher, student)
│   ├── (public)/           # Public pages (login, register, about, contact)
│   ├── api/                # API endpoints (RESTful routes)
│   ├── components/         # React components (organized by feature)
│   │   ├── layout/         # Layout wrappers: Sidebar, Navbar, DashboardLayout
│   │   ├── categories/     # Category feature components
│   │   ├── courses/        # Course feature components
│   │   ├── dashboard/      # Dashboard widgets & cards
│   │   ├── admin/          # Admin-only components
│   │   ├── home/           # Public home page components
│   │   └── [feature]/      # Other feature folders
│   ├── constants/          # Constants (navigation, permissions, enums)
│   ├── data/               # Mock/reference data (lesson structures, etc)
│   └── globals.css         # Global styles with design tokens (CSS variables)
├── lib/                    # Utilities & helpers
│   ├── auth.js             # Auth helpers (getAuthUser, requireRole, etc.)
│   ├── db.js               # MongoDB connection singleton
│   ├── dbConnect.js        # Connection wrapper
│   ├── jwt.js              # JWT token generation/verification
│   └── serializeUser.js    # Data serialization helpers
├── models/                 # Mongoose schemas (17 models: User, Course, etc.)
├── services/               # Business logic layer (25+ service modules)
├── validations/            # Input validation schemas & functions
└── middleware.js           # Next.js middleware (auth, redirects)
```

**Separation of Concerns:**
- **Models** — Mongoose schemas & database validation
- **Services** — Business logic, reused across API routes & pages
- **Validations** — Input sanitization & schema validation
- **API Routes** — HTTP handlers that orchestrate: auth → validation → service call → response
- **Lib** — Pure utilities (no side effects)
- **Components** — React UI (client or server)

## Authentication & Authorization

**Auth Flow:**
1. User logs in via `/login` → POST `/api/auth/login` → JWT token generated (7-day expiry)
2. Token stored as **httpOnly cookie** (name: "token", secure in production)
3. `middleware.js` validates token on every `/dashboard/*` request
4. Token payload: `id`, `name`, `email`, `role`

**Role-Based Access Control (RBAC):**
- **Middleware** (`src/middleware.js`) enforces route-level access:
  - `/dashboard/admin/*` → admin only
  - `/dashboard/teacher/*` → teacher only
  - `/dashboard/student/*` → student only
  - `/dashboard/courses`, `/dashboard/settings` → admin + teacher only
  - `/dashboard/students`, `/dashboard/teachers` → admin only
- **API Routes** use helper functions in `src/lib/auth.js`:
  - `requireAuth()` — throw if not authenticated
  - `requireAdmin()` — throw if not admin
  - `requireTeacher()` — throw if not teacher
  - `requireStudent()` — throw if not student
  - `requireRole(role)` — throw if specific role doesn't match
  - `requireRoles([...])` — throw if role not in list
  - `getAuthUser()` — fetch current user (returns null if not logged in)

**Common Auth Pattern in API Routes:**
```javascript
export async function POST(request) {
    const user = await requireRoles(['admin', 'teacher']);  // Throws if not authorized
    const body = await request.json();
    const { valid, errors, payload } = validatePayload(body);
    if (!valid) return Response.json({ success: false, errors }, { status: 400 });
    const result = await someService(payload);
    return Response.json({ success: true, result });
}
```

## Database & Models

**MongoDB Connection Pattern:**
- Singleton with global cache (`src/lib/dbConnect.js`)
- Uses `mongoose.connect()` with reusable connection
- Auto-connects on first service/route call
- Restart dev server to force reconnect

**Core Models & Schema Relationships:**
- **User** — `role`, `email` (unique), `password` (bcrypt), `enrolledCourses` → Course[]
- **Course** — `title`, `description`, `category` → Category, `teacher` → User, `lessons` → Lesson[]
- **Lesson** — `title`, `content`, `order`, `course` → Course
- **Quiz** — `title`, `questions` → Question[], `course` → Course
- **QuizAttempt** — `quiz` → Quiz, `student` → User, `answers`, `score`
- **Assignment** — `title`, `description`, `dueDate`, `course` → Course
- **AssignmentSubmission** — `assignment` → Assignment, `student` → User, `submission`, `score`
- **Progress** — `student` → User, `course` → Course, `completionPercentage`
- **Certificate** — `student` → User, `course` → Course, `issuedAt`
- **Category** — `name` (groups courses)
- **Notification** — `user` → User, `message`, `type`, `read`
- **ContactMessage**, **Announcement**, **Testimonial**, **WebsiteSetting**, **NewsletterSubscriber**, **Message** — for public features
- **Model Patterns:**
  - All have `createdAt`, `updatedAt` timestamps
  - `_id` is auto-generated ObjectId
  - Foreign keys use `.populate()` in queries (or `.lean()` for read-only)

## Services Layer

**Purpose:** Centralize business logic, separate from HTTP concerns. Call from API routes or pages.

**Key Services** (25+ total in `src/services/`):
- `courseService` — Course CRUD, enrollment
- `lessonService` — Lesson operations
- `quizService` — Quiz/attempt handling
- `assignmentService` — Assignment CRUD
- `studentService` — Student profile, courses, progress
- `teacherService` — Teacher profile, lessons
- `enrollmentService` — Course enrollment logic
- `progressService` — Student progress tracking
- `certificateService` — Certificate generation/retrieval
- `notificationService` — Send/list notifications
- `categoryService` — Category CRUD
- `emailService` — Email sending (via nodemailer)
- `contactMessageService` — Contact form submissions
- `dashboardService` — Dashboard stats/analytics
- `adminSearchService` — Search/filtering for admin
- `exportService` — Export data (courses, students, etc.)

**Service Pattern:**
```javascript
// src/services/courseService.js
export async function getCourseById(id) {
    await dbConnect();
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await Course.findById(id).lean();
    return doc ? serializeCourse(doc) : null;
}
```

**When to Create a Service:**
- Logic reused in 2+ routes
- Complex business rules (validation, state transitions)
- Database operations beyond CRUD
- Call from page components (server-side data fetching)

## Utilities & Helpers

**Authentication** (`src/lib/auth.js`):
- `getAuthUser()` — fetch current user from cookie/token
- `requireAuth()`, `requireRole()`, `requireRoles()`, etc. — auth guards

**JWT** (`src/lib/jwt.js`):
- `generateToken(payload)` — create JWT with 7-day expiry
- `verifyToken(token)` — validate & decode JWT

**Database** (`src/lib/dbConnect.js`, `src/lib/db.js`):
- `dbConnect()` — connect/reuse MongoDB connection

**Serialization** (`src/lib/serializeUser.js`):
- `sanitizeUser(user)` — strip sensitive fields from user objects
- Used before returning user data in API responses

**Path Aliases:**
- `@/*` → `src/*` (e.g., `@/models/User`, `@/services/courseService`)





**API Error Handling Pattern:**
```javascript
export async function POST(request) {
    try {
        const user = await requireRoles(['admin', 'teacher']);
        const body = await request.json();
        const { valid, errors, payload } = validateCoursePayload(body);
        
        if (!valid) {
            return Response.json({ success: false, errors }, { status: 400 });
        }
        
        const result = await courseService.createCourse(payload);
        return Response.json({ success: true, result });
    } catch (error) {
        if (error.message === "Unauthorized") {
            return Response.json({ success: false, message: error.message }, { status: 401 });
        }
        if (error.message === "Forbidden") {
            return Response.json({ success: false, message: error.message }, { status: 403 });
        }
        return Response.json({ success: false, message: error.message }, { status: 500 });
    }
}
```

**Response Format** (consistent across all endpoints):
- Success: `{ success: true, result: {...}, message: "..." }`
- Failure: `{ success: false, message: "...", errors: [...] }`

**Common Error Statuses:**
- `400` — validation failed or bad request
- `401` — unauthorized (invalid/missing token)
- `403` — forbidden (insufficient role)
- `500` — server error

## API Patterns

**Standard Flow:**
1. Auth check: `await requireRoles([...])`
2. Input validation: `validatePayload(body)`
3. Service call: `await serviceFunction(payload)`
4. Error handling: catch auth/validation/service errors
5. Response: consistent format
6. Dynamic rendering: `export const dynamic = "force-dynamic"` (disables ISR)

**Adding a New Endpoint:**
1. Create `src/app/api/[resource]/route.js`
2. Export `GET`, `POST`, `PUT`, `DELETE` async functions
3. Each handler: auth → validate → service call → response
4. Use path aliases for imports (`@/models/...`, `@/services/...`)

## Styling & Design System

**Design Tokens** (`src/app/globals.css`):
CSS variables define consistent colors, spacing, shadows, and transitions:
```css
--sidebar-bg: #0f172a              /* Dark sidebar background */
--sidebar-text: #94a3b8            /* Sidebar text color */
--sidebar-active-bg: rgba(99,102,241,0.12)  /* Active menu item */

--bg-main: #f1f5f9                 /* Main page background */
--surface: #ffffff                 /* Card/surface background */
--border: #e2e8f0                  /* Border color */

--accent: #6366f1                  /* Primary brand color (indigo) */
--accent-hover: #4f46e5            /* Hover state */
--accent-light: rgba(99,102,241,0.08)  /* Light background for buttons */

--text-primary: #0f172a            /* Main text */
--text-secondary: #475569          /* Secondary text */
--text-muted: #94a3b8              /* Disabled/muted text */

--radius-sm: 6px                   /* Small border radius */
--radius-md: 10px                  /* Medium border radius */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.07)  /* Subtle shadow */
--shadow-card: 0 0 0 1px var(--border), 0 2px 8px rgba(0,0,0,0.06)
```

**Tailwind Configuration:**
- Uses Tailwind CSS 4 with `@tailwindcss/postcss`
- Arbitrary values supported: `className="w-[450px] text-[#abc123]"`
- Global styles applied, then components override with className

**Component Styling:**
- All styling via Tailwind `className` (no CSS modules)
- Use design token variables for consistency
- Example: `className="bg-[var(--surface)] border border-[var(--border)]"`

## Layout Components

**Sidebar** (`src/app/components/layout/Sidebar.jsx`)
- Dark themed navigation with role-based menu items
- Shows student/teacher/admin navigation based on user role
- Uses Lucide icons for menu items
- Mobile responsive (hidden on small screens)

**Navbar** (`src/app/components/layout/Navbar.jsx`)
- Top bar with user menu, notifications, search
- Shows user name, role, and avatar
- Logout button in dropdown menu
- Search functionality (admin search feature)

**DashboardLayout** (`src/app/components/layout/DashboardLayout.jsx`)
- Wrapper component combining Sidebar + main content area
- Sets up two-column layout: sidebar + content

**MobileMenu** (`src/app/components/layout/MobileMenu.jsx`)
- Mobile-friendly hamburger menu
- Shows navigation for mobile screens

**PublicNavbar** (`src/app/components/layout/PublicNavbar.jsx`)
- Navigation for public pages (before login)
- Shows Home, About, Courses, Teachers, Contact links
- Login/Register buttons

## Database Connection & Pooling

**MongoDB Connection Pattern** (`src/lib/db.js`):
Uses singleton pattern with global caching to prevent multiple connections:
```javascript
let cached = global.mongoose;  // Reuse existing connection

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

// Check if already connected
if (cached.conn) {
    console.log("✅ MongoDB already connected");
    return cached.conn;
}

// Create new connection promise
if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
    });
}

// Wait for connection
cached.conn = await cached.promise;
```

**Why Singleton?**
- Next.js serverless functions reuse connections between invocations
- Prevents "too many connections" errors
- Connection pool managed automatically by Mongoose
- Cache stored in `global` object (persists across function calls in same Lambda)

**Logs to Monitor:**
- `🔄 Connecting to MongoDB...` — attempting connection
- `✅ MongoDB Connected Successfully` — ready to use
- `❌ MongoDB Connection Failed` — check MONGODB_URI and network

## User Schema Details

**User Fields** (`src/models/User.js`):
```javascript
{
    name: String (required),          // Full name
    email: String (required, unique), // Login email
    password: String (required),      // bcrypt hashed
    role: "student" | "teacher" | "admin" (default: student),
    phone: String (optional),
    gender: "Male" | "Female" | "" (optional),
    dateOfBirth: Date (optional),
    address: String (optional),
    avatar: String (optional, URL),
    bio: String (optional),
    enrolledCourses: [ObjectId → Course],  // Courses student is enrolled in
    createdAt: Date (auto),
    updatedAt: Date (auto),
}
```

## Configuration

**Environment Variables** (`.env.local`):
- `MONGODB_URI` — MongoDB connection (required)
- `JWT_SECRET` — JWT signing key (change from default in production)
- `NODE_ENV` — "development" | "production"
- `EMAIL_HOST` — SMTP server (optional, for notifications)
- `EMAIL_PORT` — SMTP port (optional)
- `EMAIL_USER` — sender email (optional)
- `EMAIL_PASS` — sender password (optional)
- `EMAIL_FROM` — from header (optional)

**Build Tools:**
- ESLint (Next.js config) — run `npm run lint`
- Tailwind CSS 4 — see `postcss.config.mjs`
- React Compiler — enabled in `next.config.mjs`

**Next.js 16.2.10 Specifics:**
- App Router required (no Pages Router)
- Server Components by default; use `'use client'` for interactivity
- `next/font` for font optimization
- Dynamic imports with `next/dynamic` for code splitting
- See `node_modules/next/dist/docs/` for breaking changes

## Common Development Tasks

**Adding a New API Endpoint:**
1. Create `src/app/api/resource/route.js`
2. Use auth helper: `const user = await requireRoles(['admin'])`
3. Validate input: `const { valid, errors, payload } = validate(body)`
4. Call service: `const result = await service.create(payload)`
5. Return consistent response with status code

**Adding a New Page:**
1. Create in `src/app/(dashboard)/dashboard/role/feature/page.jsx` (server component by default)
2. Fetch data: `const user = await getAuthUser()` or call service directly
3. Use `'use client'` directive only for interactive components (forms, modals, state)
4. Pass data as props to client components

**Adding a New Component:**
- Place in `src/app/components/` organized by feature (categories, courses, etc.)
- Most should be client components (`'use client'`) if they have interactivity
- Server components for data fetching, then pass data as props to client components

**Updating Mongoose Models:**
1. Edit schema in `src/models/[Model].js`
2. Mongoose allows schema-less updates (loose validation)
3. For breaking changes: consider backfill scripts (see `scripts/backfill-course-teachers.mjs`)
4. Add indexes to schema if querying frequently

**Styling:**
- Tailwind CSS 4 with arbitrary values
- Global styles in `src/app/globals.css`
- Component-scoped via className
- Dark mode via `prefers-color-scheme`

## Debugging Tips

**MongoDB Connection:**
- Check `.env.local` has valid `MONGODB_URI`
- Look for console logs: `🔄 Connecting to MongoDB...` → `✅ Connected` or `❌ Failed`
- Connection cached globally; restart dev server if connection pool stale

**Auth Issues:**
- Token stored as httpOnly cookie (name: "token")
- Middleware checks on `/dashboard/*` requests
- Expired tokens (>7 days) trigger `/login` redirect
- API returns 401 (unauthorized) or 403 (forbidden) for auth failures
- Check browser DevTools → Application → Cookies for "token"

**API Failures:**
- Inspect response `success` flag and `message` field
- Validation errors have `errors` array with field details
- 400 = validation/input error, 401 = no token, 403 = wrong role, 500 = server error
- Check browser Network tab for request/response body

**Component Issues:**
- Use `'use client'` for state/event handlers, not for data fetching
- Avoid fetching in client components; pass data from server
- Check console for React/ESLint warnings

## Client Components & UI Patterns

**Client Component Pattern** (`'use client'` directive):
Use for: state management, event handlers, form submissions, useEffect data fetching.
```javascript
'use client';
import { useState, useEffect } from 'react';

export default function CategoryForm({ initialData, isEdit }) {
    const [name, setName] = useState(initialData?.name || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const res = await fetch(isEdit ? `/api/categories/${initialData._id}` : '/api/categories', {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name.trim() }),
        });

        const data = await res.json().catch(() => null);
        if (!res.ok) {
            setError(data?.message || 'Failed');
            setLoading(false);
            return;
        }
        
        // Success handling...
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            {error && <p className="text-red-500">{error}</p>}
            <button disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </form>
    );
}
```

**Refresh Pattern:**
Use a `refreshKey` state to refetch data after mutations:
```javascript
const [refreshKey, setRefreshKey] = useState(0);

useEffect(() => {
    async function load() {
        const res = await fetch('/api/announcements', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) setData(data.result);
    }
    load();
}, [refreshKey]);

// After successful mutation:
setRefreshKey(k => k + 1);  // Triggers reload
```

**Component Organization:**
- `src/app/components/` organized by feature (categories/, courses/, dashboard/, etc.)
- Each feature folder may have: Form, Actions, Table, Chart, Dialog, Client components
- Import Lucide icons: `import { Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react'`
- Use Tailwind CSS for styling (no CSS modules needed)

## Constants & Navigation

**Navigation Constants** (`src/app/constants/navigation.js`):
Defines menu structure for public, student, teacher, and admin dashboards.
- `publicNavigation` — home, about, courses, teachers, contact
- `studentNavigation` — my courses, lessons, assignments, quizzes, progress, certificates, notifications, messages, feedback, profile
- `teacherNavigation` — dashboard, my courses, students, performance, grade book, announcements, analytics, messages, lessons, assignments, quizzes, notifications, profile, settings
- `adminNavigation` — dashboard, students, teachers, courses, categories, messages, announcements, search, certificates, enrollments, revenue, assessments, approvals, progress, testimonials, settings

Each nav item has: `name` (or `title` for public), `href` (URL path), `icon` (lucide-react component).

**Course Levels:**
- Defined in `src/validations/courseValidation.js`: `["Beginner", "Intermediate", "Advanced"]`
- Used in validation and course model enums

## Validation & Sanitization

**Validation Module Pattern** (`src/validations/courseValidation.js`):
```javascript
export const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"];
export const DEFAULT_COURSE_THUMBNAIL = "/images/course-placeholder.svg";

export function normalizeCoursePayload(data) {
    // Clean/format/default values
    return {
        title: String(data?.title ?? "").trim(),
        description: String(data?.description ?? "").trim(),
        level: String(data?.level ?? "").trim(),
        price: Number.isFinite(price) ? price : data?.price,
        isPublished: typeof data?.isPublished === "boolean" ? data.isPublished : true,
    };
}

export function validateCoursePayload(data) {
    const errors = [];
    const payload = normalizeCoursePayload(data);
    
    if (!payload.title) errors.push("Title is required.");
    if (!COURSE_LEVELS.includes(payload.level)) 
        errors.push("Level must be Beginner, Intermediate, or Advanced.");
    
    return { valid: errors.length === 0, errors, payload };
}
```

**Validation in API Routes:**
```javascript
const { valid, errors, payload } = validateCoursePayload(body);
if (!valid) {
    return NextResponse.json({ success: false, errors }, { status: 400 });
}
// Use payload (sanitized) for service call
```

## Advanced Model Features

**Mongoose Schema Patterns:**

**Course Model:**
- `teacher` — ObjectId reference to User (indexed for fast lookups)
- `category` — string (can be extended to reference Category model)
- `level` — enum: "Beginner" | "Intermediate" | "Advanced"
- `price` — number (0 for free courses)
- `thumbnail` — defaults to course placeholder image
- `isPublished` — boolean for draft/published state
- `archived` — boolean for soft-delete pattern
- Validation: title (max 120 chars), description (max 2000 chars), instructor name (max 100 chars)

**Lesson Model:**
- `course` — ObjectId ref to Course (required)
- `videoUrl` — optional video URL (support for embedded videos)
- `content` — rich text or markdown content
- `duration` — string like "10 mins", "1 hour"
- `order` — number (sort lessons within course)
- `isPublished` — publish/draft state
- All lessons have `createdAt`, `updatedAt` timestamps

**Quiz Model:**
- `course` — ObjectId ref to Course
- `questions` — array of question objects:
  ```javascript
  {
    questionText: String,
    options: [String, String, String, String],  // 4 options typically
    correctOptionIndex: Number,  // 0-3
  }
  ```
- `timeLimit` — number in minutes (default 15)
- `isPublished` — boolean

**Assignment Model:**
- Similar to Quiz: course ref, title, description, dueDate
- Students create AssignmentSubmission documents with their work
- Teacher grades submissions and records score/feedback

**Pattern: Indexed Foreign Keys:**
Common indexes for performance:
- `teacher` field in Course — `index: true` (find courses by teacher)
- `student`, `course` fields in Progress, Certificate, etc. — indexed for fast queries
- Always use `.lean()` for read-only queries (faster, returns plain objects)
- Use `.select()` to limit returned fields: `User.find().select("_id name email")`

## Error Handling Helpers

**Error Response Helper Pattern** (in API routes):
```javascript
function errorResponse(message, status = 500, errors) {
    return NextResponse.json(
        {
            success: false,
            message,
            ...(errors ? { errors } : {}),  // Include errors array if present
        },
        { status }
    );
}

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

// Usage
return errorResponse("Validation failed.", 400, ["Title required", "Price invalid"]);
return errorResponse(error.message, authErrorStatus(error));
```

**Error Handling in POST:**
```javascript
export async function POST(request) {
    try {
        await requireRoles(["admin", "teacher"]);
        const body = await request.json();
        const { valid, errors, payload } = validatePayload(body);

        if (!valid) return errorResponse("Validation failed.", 400, errors);

        const result = await service.create(payload);
        return NextResponse.json({ success: true, result }, { status: 201 });
    } catch (error) {
        if (error.message === "Unauthorized" || error.message === "Forbidden") {
            return errorResponse(error.message, authErrorStatus(error));
        }
        if (error instanceof SyntaxError) {
            return errorResponse("Request body must be valid JSON.", 400);
        }
        if (error.name === "ValidationError") {
            // Mongoose validation error
            return errorResponse("Validation failed.", 400,
                Object.values(error.errors).map(e => e.message)
            );
        }
        console.error(error);
        return errorResponse("Unable to create resource.");
    }
}
```

## Query Parameters & Filtering

**Common Query Patterns:**
- `search` — text search (name, title, email matching)
- `category` — filter by category
- `level` — filter by level (Beginner, Intermediate, Advanced)
- `page` — pagination (default 1)
- `limit` — items per page (default 9)
- `role` — filter users by role (admin, teacher, student)

**Parsing Query Params:**
```javascript
const { searchParams } = new URL(request.url);
const search = searchParams.get("search") || "";
const page = parseInt(searchParams.get("page")) || 1;
const limit = parseInt(searchParams.get("limit")) || 9;
```

**Service Function with Filters:**
```javascript
export async function getPublishedCourses({
    search = "",
    category = "",
    level = "",
    page = 1,
    limit = 9,
}) {
    const query = { isPublished: true };
    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (level) query.level = level;

    const skip = (page - 1) * limit;
    const docs = await Course.find(query).skip(skip).limit(limit).lean();
    const total = await Course.countDocuments(query);
    
    return { docs, total, page, limit, pages: Math.ceil(total / limit) };
}
```

## Email Service

**Email Configuration** (`src/services/emailService.js`):
Requires environment variables:
- `EMAIL_HOST` — SMTP host (e.g., smtp.gmail.com)
- `EMAIL_PORT` — SMTP port (587 for TLS, 465 for SSL)
- `EMAIL_USER` — sender email address
- `EMAIL_PASS` — sender password or app-specific password
- `EMAIL_FROM` — from header (defaults to EMAIL_USER)

**Sending Email:**
```javascript
import { sendEmail, gradeNotificationEmail } from "@/services/emailService";

const emailContent = gradeNotificationEmail({
    studentName: "John Doe",
    assignmentTitle: "Essay on Climate",
    marksAwarded: 85,
    totalMarks: 100,
    feedback: "Great work!"
});

await sendEmail({
    to: "student@example.com",
    subject: emailContent.subject,
    html: emailContent.html,
});
```

**Email Patterns:**
- `gradeNotificationEmail()` — notify student when assignment graded
- More templates can be added following the same pattern
- Service silently skips if email not configured (returns undefined)
- Try-catch in service prevents email errors from crashing requests

**Note:** Email is optional; missing config won't break the app. Useful for notifications, grade updates, course completions, etc.

## Advanced Features

**Soft Deletes:**
Use `archived: true` flag instead of hard delete (Course, Lesson, Quiz, etc.).
Query with: `Course.find({ archived: false })`

**Quiz Attempts:**
- Student takes Quiz → creates QuizAttempt document
- Stores: quiz id, student id, answers array, score, attempt date
- Supports multiple attempts per quiz

**Progress Tracking:**
- Progress document stores: student, course, completionPercentage
- Updated when lesson completed, quiz attempted, assignment submitted
- Used for progress charts and certificate eligibility

**Certificates:**
- Generated when student reaches 100% course completion
- Stores: student, course, issuedAt timestamp
- Can be retrieved via `/api/student/certificates`

## Scripts & Maintenance

**One-time Data Migrations:**
- `node scripts/backfill-course-teachers.mjs` — backfill legacy course-teacher relationships (run once when deploying schema changes)
  - Reads `.env.local` for `MONGODB_URI`
  - Finds courses missing `teacher` ObjectId reference
  - Matches by `instructor` name string to User documents
  - Updates Course.teacher field to proper ObjectId
  - Logs skipped courses if no teacher user matches name

**When to Use Backfill Scripts:**
- After schema changes that add new required ObjectId references
- One-time setup scripts for data consistency
- Include in deployment docs so team knows to run them

## Performance & Scalability

**Database Query Optimization:**
- Always use `.lean()` for read-only queries (returns plain objects, 2-3x faster)
- Use `.select()` to limit fields when not all needed: `.select("_id name email")`
- Add indexes to frequently queried fields (see model schema `index: true`)
- Paginate large result sets: implement page/limit parameters
- Use `.countDocuments()` for totals instead of fetching all docs

**Caching Strategies:**
- `export const dynamic = "force-dynamic"` disables ISR/caching for dynamic data
- Use this on all API routes with auth or user-specific data
- For static public pages, consider ISR: `export const revalidate = 3600` (1 hour)

**Large File/Video Handling:**
- Lesson `videoUrl` field stores video URLs (external hosted videos recommended)
- Don't upload large files to MongoDB; use external storage (S3, etc.)
- Store only URL in database

## Security Considerations

**Authentication & Authorization:**
- JWT tokens expire after 7 days (forced re-login)
- Middleware blocks unauthenticated `/dashboard/*` access
- httpOnly cookies prevent XSS token theft
- Always check role before modifying data: use `requireRoles()` guards

**Input Sanitization:**
- All inputs validated before storage (see validation modules)
- Trim whitespace, enforce length limits, sanitize special chars
- Use validation functions: never trust user input

**Password Security:**
- Passwords hashed with bcryptjs before storage
- Never return password in API responses
- `sanitizeUser()` strips sensitive fields from user objects

**Email Verification:**
- Currently no email verification implemented; consider adding if expanding auth
- Validate email format in User schema if added

**HTTPS in Production:**
- Set `NODE_ENV=production` to enable secure cookie flags
- Use `.env.local` (not committed) for secrets
- Change JWT_SECRET from default before deploying

## Common Pitfalls & Gotchas

**State & Timing Issues:**
- **Lesson order matters:** When fetching lessons for a course, always `.sort({ order: 1 })`
- **Enrollment consistency:** Check `User.enrolledCourses` is populated when fetching students in a course
- **Progress tracking:** Only update Progress when lesson actually completed (not just visited)

**Component & Rendering:**
- **Server vs Client:** Don't use `useState` or `useEffect` in server components (omit `'use client'`)
- **Stale data:** Client components fetching in `useEffect` need `[refreshKey]` dep to refetch
- **Pagination:** Reset to page 1 when search query changes

**Database & Queries:**
- **Connection reuse:** `dbConnect()` uses global singleton; only calls MongoDB once per request
- **Lean queries:** Can't call `.save()` on `.lean()` results; use full documents for updates
- **Timestamps:** Mongoose auto-adds `createdAt`, `updatedAt`; don't manually set

**API Response Format:**
- Always return `{ success: true/false, result: ..., message: "..." }`
- Never return raw error stack traces (handle in try-catch)
- Use correct HTTP status: 400 (bad request), 401 (no auth), 403 (no permission), 500 (server error)

**Email & Notifications:**
- Email service silently fails if not configured; check logs if emails not sending
- Don't wait for email send: `sendEmail()` doesn't await in most flows
- Use `cache: "no-store"` when fetching API data in components

## Testing Checklist

**Before Committing:**
- Run `npm run lint` (ESLint) — fix any warnings
- Test the feature manually in browser (dev server at http://localhost:3000)
- Verify error cases: invalid input, missing auth, wrong role
- Check database: use MongoDB compass or shell to verify data

**API Testing (via curl or Postman):**
```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password"}'

# Get cookie from response, then:
curl http://localhost:3000/api/courses \
  -H "Cookie: token=JWT_TOKEN_HERE"
```

**Role-Based Access:**
- Test with admin, teacher, student roles
- Verify redirects for unauthorized roles
- Check API returns 403 for wrong role

**Form Validation:**
- Submit empty fields → should show error messages
- Submit invalid email/price → should reject
- Submit valid data → should succeed and show success message

**UI Responsiveness:**
- Test on mobile (375px), tablet (768px), desktop (1280px) widths
- Check Tailwind responsive classes are applied correctly
- Verify dark mode if implemented

## Deployment Checklist

**Pre-Deployment:**
1. ✅ All tests pass, no lint errors
2. ✅ `.env.local` configured with production values:
   - `MONGODB_URI` → production database
   - `JWT_SECRET` → strong secret (not "my_super_secret_key")
   - `NODE_ENV=production`
   - Email credentials if needed
3. ✅ Run `npm run build` and verify no errors
4. ✅ Test production build locally: `npm start`
5. ✅ Database indexes created (Mongoose handles automatically)
6. ✅ Backfill scripts run if needed (schema changes)

**Post-Deployment:**
1. ✅ Verify login works
2. ✅ Test role-based access (admin, teacher, student flows)
3. ✅ Check API endpoints return correct data
4. ✅ Verify email notifications sending (if configured)
5. ✅ Monitor logs for errors

## File Naming & Import Conventions

**Files:**
- Page components: `page.jsx` (Next.js App Router)
- API routes: `route.js` (Next.js App Router, export GET/POST/etc)
- Client components: `FileName.jsx` (PascalCase)
- Services/utilities: `fileName.js` (camelCase)
- Models: `ModelName.js` (PascalCase, matches MongoDB collection name)

**Imports:**
- Use path aliases: `import { getAuthUser } from "@/lib/auth"`
- Avoid relative imports (`../../../lib/auth`)
- Import models: `import User from "@/models/User"`
- Import services: `import { getCourses } from "@/services/courseService"`

## Anti-Patterns & What NOT to Do

**❌ Don't:**
1. **Use `await` on email in critical path** — `sendEmail()` is fire-and-forget; don't depend on it succeeding
2. **Fetch data in client components without deps** — useEffect needs `[refreshKey]` or `[]` to avoid infinite loops
3. **Call `dbConnect()` multiple times** — singleton handles it; call once per route
4. **Return raw user object in API** — always run through `sanitizeUser()` to remove password
5. **Make separate API calls per item** — batch queries when fetching related data
6. **Hard-code role strings** — use constants for "admin", "teacher", "student"
7. **Leave `.env.local` unencrypted in git** — `.gitignore` protects it; verify before committing
8. **Skip validation** — every API input must be validated
9. **Use `.save()` on `.lean()` results** — lean returns plain objects; fetch full document for updates
10. **Trust error messages sent to client** — log details server-side, send generic message to frontend

**✅ Do:**
1. Validate inputs with validation modules
2. Use services for business logic (reusable, tested separately)
3. Call `requireRole()` in every protected route
4. Return consistent response format `{ success, result, message, errors }`
5. Use `.lean()` for read-only queries (2-3x faster)
6. Add indexes to frequently queried fields
7. Implement pagination for large result sets
8. Sanitize user data before returning in responses
9. Use try-catch to convert errors to API responses
10. Log detailed errors server-side for debugging

## Vercel Deployment Notes

**Environment Variables on Vercel:**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add each variable from `.env.local`:
   - `MONGODB_URI` — production MongoDB connection
   - `JWT_SECRET` — use strong secret (minimum 32 chars)
   - `NODE_ENV` → "production"
   - Email variables if needed
3. Redeploy after adding variables
4. Verify: check Function logs in Vercel Dashboard for connection success

**Common Vercel Issues:**
- **"MONGODB_URI is not set"** — env var not added to Vercel project
- **Connection timeout** — verify MongoDB IP allowlist includes Vercel IPs
- **Email not sending** — SMTP credentials missing or incorrect
- **Build fails** — check Next.js version compatibility, run `npm run build` locally first

**Build Command:**
- Default: `npm run build`
- Vercel auto-detects Next.js projects
- Output directory: `.next/`

**Monitoring:**
- Check Vercel Logs (Function logs show server-side errors)
- Check browser Console (client-side errors)
- MongoDB Atlas logs for connection issues

## Git Workflow

**Before Committing:**
1. Check `.env.local` NOT staged: `git status` should NOT show it
2. Run `npm run lint` and fix warnings
3. Test manually in browser
4. Verify models/services/API changes make sense together

**Commit Message Style:**
```
feat: add quiz attempt submission endpoint
- Store quiz answers and calculate score
- Update student progress on completion
- Send notification email to teacher

fix: resolve course teacher reference issue
- Backfill missing teacher ObjectIds from instructor names
- Add index to teacher field for performance

refactor: extract validation logic into separate module
```

**Push Strategy:**
- Feature branches recommended for larger changes
- Keep commits atomic (one logical change per commit)
- Avoid mixing features in one commit

## Troubleshooting Guide

**Problem: Page shows "Unauthorized" after login**
- Check browser DevTools → Cookies; token should exist
- Verify JWT_SECRET in `.env.local` matches deployment
- Check middleware.js: `/dashboard` routes require token

**Problem: MongoDB connection times out**
```
❌ MongoDB Connection Failed
Name: MongoNetworkTimeoutError
```
- Verify `MONGODB_URI` in `.env.local` is correct
- Ping MongoDB Atlas: check IP allowlist includes your IP
- Check firewall/VPN not blocking connection
- Increase `serverSelectionTimeoutMS` in `src/lib/db.js` if needed

**Problem: Course has no teacher (null reference)**
- Run backfill script: `node scripts/backfill-course-teachers.mjs`
- Verify teacher user exists with matching name
- Check Course.instructor name matches User.name exactly

**Problem: Form validation errors not showing**
- Verify API returns `{ success: false, errors: [...] }`
- Check component renders error message: `{error && <p>{error}</p>}`
- Inspect network request/response in DevTools

**Problem: Images/uploads not showing**
- Lesson `videoUrl` should be full URL or path from `/public`
- Course `thumbnail` defaults to `/images/course-placeholder.svg`
- Verify path exists in `public/` folder

## Dashboard Improvements

### **Admin Dashboard** (Streamlined)
- ✅ Removed: Revenue tracking, Testimonials management, Contact messages admin page
- ✅ Kept: 12 core features (Students, Teachers, Courses, Categories, Announcements, etc.)
- ✅ Result: Cleaner interface, reduced maintenance burden

### **Student Dashboard** (Enhanced)
- ✅ Course cards now show:
  - Progress bar with percentage
  - Star ratings with review count
  - Better visual hierarchy
- ✅ All 12 core features working (Courses, Lessons, Assignments, Quizzes, Progress, Certificates, etc.)
- ✅ Notifications: Unread counter in navbar
- ✅ Messages: Thread-based with search/filter
- ✅ Quizzes: Timer-based with auto-submit on timeout
- ✅ Assignments: File upload + text submission support

### **Teacher Dashboard** (Ready)
- ✅ Courses, Lessons, Assignments, Quizzes management
- ✅ Student performance tracking
- ✅ Grade book functionality
- ✅ Announcements and messaging

## Key Takeaways

1. **Architecture:** Models → Services → API Routes / Pages
2. **Auth:** Middleware checks all `/dashboard/*`, API routes use role helpers
3. **Validation:** Every input validated before database (prevent bad data)
4. **Errors:** Consistent response format with proper HTTP status codes
5. **Components:** Server components by default, `'use client'` only for interactivity
6. **Performance:** Use `.lean()`, `.select()`, pagination, indexed fields
7. **Email:** Optional, silently skips if not configured
8. **Security:** HttpOnly JWT cookies, hashed passwords, role-based access control
9. **Styling:** Design tokens in globals.css, Tailwind for all components
10. **Database:** Singleton connection pattern, reused across serverless invocations
