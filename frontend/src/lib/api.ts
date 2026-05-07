export const API_BASE = "http://localhost:8081";

export interface Course {
  id: number | string;
  title: string;
  description?: string;
  instructor?: string;
  category?: string;
  price?: number;
  rating?: number;
  students?: number;
  image?: string;
  duration?: string;
  level?: string;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
}

export interface Enrollment {
  userId: number | string;
  courseId: number | string;
}

export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch(`${API_BASE}/courses`);
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json();
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function createEnrollment(data: Enrollment & Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create enrollment");
  return res.json();
}

export async function createUser(data: { name: string; email: string; password?: string }) {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to register user");
  return res.json();
}
