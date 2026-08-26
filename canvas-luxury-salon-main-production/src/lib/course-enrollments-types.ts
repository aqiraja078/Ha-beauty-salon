export type CourseEnrollmentStatus = "pending" | "approved" | "rejected";

export type CourseEnrollment = {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  /** Price shown on the course at submit time */
  coursePrice?: string;
  /** Duration shown on the course at submit time */
  courseDuration?: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  message?: string;
  status: CourseEnrollmentStatus;
  createdAt: string;
};

export type CourseEnrollmentInput = {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  coursePrice?: string;
  courseDuration?: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  message?: string;
  status?: CourseEnrollmentStatus;
};
