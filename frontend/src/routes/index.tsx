import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "@/lib/api";
import { CourseCard } from "@/components/CourseCard";
import { Sparkles, BookOpen, Award, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LearnHub — Learn Anything, Anytime" },
      { name: "description", content: "Modern online learning platform with thousands of courses taught by industry experts." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: courses = [] } = useQuery({ queryKey: ["courses"], queryFn: fetchCourses });
  const featured = courses.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-10"
          style={{ background: "var(--brand-gradient)" }}
        />
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              New courses every week
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Learn skills that <span style={{ background: "var(--brand-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>matter</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              Join millions of learners growing their careers with expert-led courses in tech, business, design and more.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/courses" className="inline-flex items-center px-6 py-3 rounded-lg text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition" style={{ background: "var(--brand-gradient)" }}>
                Browse courses
              </Link>
              <Link to="/register" className="inline-flex items-center px-6 py-3 rounded-lg border border-border bg-card font-semibold hover:bg-accent transition">
                Sign up free
              </Link>
            </div>
          </div>
          <div className="relative aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 rounded-3xl rotate-3" style={{ background: "var(--brand-gradient)", opacity: 0.2 }} />
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop"
              alt="Students learning"
              className="relative rounded-3xl shadow-2xl object-cover h-full w-full"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, label: "Courses", value: "10K+" },
            { icon: Award, label: "Instructors", value: "500+" },
            { icon: TrendingUp, label: "Learners", value: "2M+" },
            { icon: Sparkles, label: "Reviews", value: "4.8★" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
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
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured courses</h2>
            <p className="text-muted-foreground mt-2">Hand-picked by our team</p>
          </div>
          <Link to="/courses" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
        </div>
        {featured.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Loading courses...</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </section>
    </div>
  );
}
