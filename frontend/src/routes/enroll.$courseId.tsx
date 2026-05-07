import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { fetchCourses, fetchUsers, createEnrollment, type User } from "@/lib/api";
import { CheckCircle2, Star, Clock, Users as UsersIcon, Loader2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/enroll/$courseId")({
  head: () => ({ meta: [{ title: "Enroll — LearnHub" }] }),
  component: EnrollPage,
});

interface StoredEnrollment {
  userId: string;
  courseId: string;
  enrolledAt: number;
}

function EnrollPage() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();
  const {
    data: courses = [],
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({ queryKey: ["courses"], queryFn: fetchCourses });
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });

  const course = courses.find((c) => String(c.id) === courseId);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enrollments = useMemo<StoredEnrollment[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("learnhub_enrollments") || "[]");
    } catch {
      return [];
    }
  }, [success]);

  const alreadyEnrolled = useMemo(() => {
    if (!selectedUserId || !course) return false;
    return enrollments.some(
      (e) => String(e.userId) === String(selectedUserId) && String(e.courseId) === String(course.id),
    );
  }, [enrollments, selectedUserId, course]);

  useEffect(() => {
    const stored = localStorage.getItem("learnhub_user");
    if (stored) {
      try {
        setSelectedUserId(String((JSON.parse(stored) as User).id));
      } catch {}
    }
  }, []);

  // Clear stale field error when user changes selection
  useEffect(() => {
    if (error) setError(null);
  }, [selectedUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEnroll = async () => {
    if (submitting || success) return; // hard guard against double-clicks
    if (!course) return;

    if (!selectedUserId) {
      setError("Please select a user to enroll.");
      return;
    }
    if (alreadyEnrolled) {
      setError("This user is already enrolled in this course.");
      toast.error("Already enrolled in this course");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await createEnrollment({ userId: selectedUserId, courseId: course.id });
      const enrolled: StoredEnrollment[] = JSON.parse(
        localStorage.getItem("learnhub_enrollments") || "[]",
      );
      // Server-side success — also dedupe locally just in case
      if (
        !enrolled.some(
          (e) =>
            String(e.userId) === String(selectedUserId) &&
            String(e.courseId) === String(course.id),
        )
      ) {
        enrolled.push({
          userId: String(selectedUserId),
          courseId: String(course.id),
          enrolledAt: Date.now(),
        });
        localStorage.setItem("learnhub_enrollments", JSON.stringify(enrolled));
      }
      setSuccess(true);
      toast.success(`Enrolled in ${course.title}`);
      setTimeout(() => navigate({ to: "/dashboard" }), 1200);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Enrollment failed";
      setError(msg);
      toast.error(msg);
      setSubmitting(false);
    }
  };

  if (coursesLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground flex items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading course...
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-destructive">
        Failed to load course. <Link to="/courses" className="text-primary underline">Back to courses</Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">
        Course not found. <Link to="/courses" className="text-primary">Browse all</Link>
      </div>
    );
  }

  const buttonDisabled = !selectedUserId || submitting || success || alreadyEnrolled;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="aspect-video rounded-2xl overflow-hidden bg-muted mb-6">
          <img
            src={
              course.image ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop"
            }
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>
        {course.category && (
          <span className="text-xs font-semibold uppercase text-primary">{course.category}</span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold mt-2">{course.title}</h1>
        {course.description && (
          <p className="text-muted-foreground mt-4 leading-relaxed">{course.description}</p>
        )}

        <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
          {course.rating != null && (
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {course.rating}
            </span>
          )}
          {course.students != null && (
            <span className="flex items-center gap-1">
              <UsersIcon className="h-4 w-4" />
              {course.students} students
            </span>
          )}
          {course.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {course.duration}
            </span>
          )}
          {course.instructor && (
            <span>
              Instructor: <strong className="text-foreground">{course.instructor}</strong>
            </span>
          )}
        </div>
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="text-3xl font-bold mb-1">
            {course.price != null ? (course.price === 0 ? "Free" : `$${course.price}`) : "Free"}
          </div>
          <p className="text-xs text-muted-foreground mb-6">Lifetime access</p>

          {success ? (
            <div
              className="flex items-center gap-2 text-green-600 font-semibold py-3"
              role="status"
              aria-live="polite"
            >
              <CheckCircle2 className="h-5 w-5" /> Enrolled! Redirecting...
            </div>
          ) : (
            <>
              <label htmlFor="enroll-user" className="text-sm font-medium block mb-1.5">
                Enroll as
              </label>
              <select
                id="enroll-user"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={usersLoading || submitting}
                aria-invalid={!!error && !selectedUserId}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background mb-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                <option value="">
                  {usersLoading ? "Loading users..." : "Select a user..."}
                </option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>

              {usersError && (
                <p className="text-xs text-destructive mb-2 flex items-start gap-1">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  Couldn't load users. Please refresh.
                </p>
              )}

              {alreadyEnrolled && !error && (
                <p className="text-xs text-amber-600 mb-2 flex items-start gap-1">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  This user is already enrolled in this course.
                </p>
              )}

              {error && (
                <p
                  className="text-sm text-destructive mb-3 flex items-start gap-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  {error}
                </p>
              )}

              <button
                onClick={handleEnroll}
                disabled={buttonDisabled}
                aria-busy={submitting}
                className="mt-2 w-full py-3 rounded-lg text-primary-foreground font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "var(--brand-gradient)" }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Enrolling...
                  </>
                ) : alreadyEnrolled ? (
                  "Already enrolled"
                ) : (
                  "Enroll now"
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                No account?{" "}
                <Link to="/register" className="text-primary font-semibold">
                  Sign up
                </Link>
              </p>
            </>
          )}

          <ul className="mt-6 space-y-2 text-sm text-muted-foreground border-t border-border pt-4">
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              Full lifetime access
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              Certificate of completion
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              Access on mobile and desktop
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
