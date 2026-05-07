import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export function Navbar() {
  const linkCls = "text-sm font-medium text-foreground/70 hover:text-primary transition-colors";
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-lg text-primary-foreground" style={{ background: "var(--brand-gradient)" }}>
            <GraduationCap className="h-5 w-5" />
          </span>
          <span>LearnHub</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className={linkCls} activeOptions={{ exact: true }} activeProps={{ className: "text-primary font-semibold" }}>Home</Link>
          <Link to="/courses" className={linkCls} activeProps={{ className: "text-primary font-semibold" }}>Courses</Link>
          <Link to="/dashboard" className={linkCls} activeProps={{ className: "text-primary font-semibold" }}>Dashboard</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/register" className="hidden md:inline-flex text-sm font-medium px-4 py-2 rounded-md hover:bg-accent transition-colors">Sign in</Link>
          <Link to="/register" className="inline-flex items-center text-sm font-semibold px-4 py-2 rounded-md text-primary-foreground shadow-sm hover:opacity-90 transition" style={{ background: "var(--brand-gradient)" }}>
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
