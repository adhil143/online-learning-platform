import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchCourses, type User } from "@/lib/api";
import { CourseCard } from "@/components/CourseCard";
import { BookOpen, Trophy, Flame } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LearnHub" }] }),
  component: DashboardPage,
});

interface StoredEnrollment { userId: string; courseId: string | number; enrolledAt: number; }

function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [enrollments, setEnrollments] = useState<StoredEnrollment[]>([]);
  const { data: courses = [] } = useQuery({ queryKey: ["courses"], queryFn: fetchCourses });

  useEffect(() => {
    const u = localStorage.getItem("learnhub_user");
    if (u) try { setUser(JSON.parse(u)); } catch {}
    const e = localStorage.getItem("learnhub_enrollments");
    if (e) try { setEnrollments(JSON.parse(e)); } catch {}
  }, []);

  const myEnrollments = user
    ? enrollments.filter((e) => String(e.userId) === String(user.id))
    : enrollments;

  const myCourses = courses.filter((c) => myEnrollments.some((e) => String(e.courseId) === String(c.id)));

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-12">
      <div className="rounded-2xl p-8 mb-10 text-primary-foreground shadow-lg" style={{ background: "var(--brand-gradient)" }}>
        <p className="text-sm opacity-90">Welcome back{user ? `, ${user.name}` : ""}</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-1">Keep learning today</h1>
        <p className="opacity-90 mt-2 max-w-xl">Pick up where you left off or discover new courses to expand your skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[
          { icon: BookOpen, label: "Enrolled courses", value: myCourses.length },
          { icon: Trophy, label: "Completed", value: 0 },
          { icon: Flame, label: "Day streak", value: 1 },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6">My courses</h2>
        {myCourses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="inline-block mt-4 px-5 py-2.5 rounded-lg text-primary-foreground font-semibold" style={{ background: "var(--brand-gradient)" }}>
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myCourses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </section>
    </div>
  );
}
