import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { fetchCourses } from "@/lib/api";
import { CourseCard } from "@/components/CourseCard";
import { Search } from "lucide-react";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "All Courses — LearnHub" },
      { name: "description", content: "Browse thousands of courses across tech, business, design, and more." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const { data: courses = [], isLoading, error } = useQuery({ queryKey: ["courses"], queryFn: fetchCourses });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => c.category && set.add(c.category));
    return ["all", ...Array.from(set)];
  }, [courses]);

  const filtered = courses.filter((c) => {
    const matchQ = c.title.toLowerCase().includes(q.toLowerCase());
    const matchC = cat === "all" || c.category === cat;
    return matchQ && matchC;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Explore courses</h1>
        <p className="text-muted-foreground mt-2">Find the perfect course to advance your career.</p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-accent"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="text-center py-20 text-muted-foreground">Loading...</div>}
      {error && <div className="text-center py-20 text-destructive">Failed to load courses. Make sure the API at http://localhost:8081 is running.</div>}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">No courses found.</div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
      </div>
    </div>
  );
}
