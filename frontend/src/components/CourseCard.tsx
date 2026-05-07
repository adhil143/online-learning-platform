import { Link } from "@tanstack/react-router";
import type { Course } from "@/lib/api";
import { Star, Users, Clock } from "lucide-react";

const FALLBACK = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to="/enroll/$courseId"
      params={{ courseId: String(course.id) }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={course.image || FALLBACK}
          alt={course.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {course.category && (
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">{course.category}</span>
        )}
        <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        {course.instructor && (
          <p className="text-xs text-muted-foreground">By {course.instructor}</p>
        )}
        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted-foreground">
          {course.rating != null && (
            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{course.rating}</span>
          )}
          {course.students != null && (
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.students}</span>
          )}
          {course.duration && (
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="font-bold text-lg">
            {course.price != null ? (course.price === 0 ? "Free" : `$${course.price}`) : "View"}
          </span>
          <span className="text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">Enroll →</span>
        </div>
      </div>
    </Link>
  );
}
