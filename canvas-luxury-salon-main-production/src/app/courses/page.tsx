import type { Metadata } from "next";
import { CourseCard } from "@/components/courses/CourseCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getPublishedCourses } from "@/lib/courses-store";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: "Courses",
    description: `Beauty training courses with ${site.name}.`,
  };
}

export default async function CoursesPage() {
  const [courses, site] = await Promise.all([
    getPublishedCourses(),
    getSiteContent(),
  ]);

  return (
    <ThemeScope scope="book">
      <section className="relative overflow-hidden bg-canvas px-4 pb-4 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-6 sm:pb-6 sm:pt-[max(7.5rem,env(safe-area-inset-top))] md:px-8">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal blur>
            <p className="eyebrow">{site.name}</p>
            <h1 className="mt-2.5 font-display text-[2.4rem] leading-[1.06] text-ink xs:text-5xl sm:text-6xl">
              Our <span className="accent-gradient-text">courses</span>
            </h1>
            <p className="mx-auto mt-3.5 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
              {courses.length > 0
                ? `${courses.length} programme${courses.length === 1 ? "" : "s"} — same premium training, tailored to your goals.`
                : "Hands-on training for makeup, hair, and salon skills."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-canvas px-4 pb-12 pt-4 sm:px-6 sm:pb-20 sm:pt-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          {courses.length === 0 ? (
            <p className="text-center text-sm text-ink-soft">
              No courses listed yet — contact us for upcoming batches.
            </p>
          ) : (
            <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {courses.map((course) => (
                <RevealItem key={course.id} className="h-full min-w-0">
                  <CourseCard course={course} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>
    </ThemeScope>
  );
}
