import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseDetailEnroll } from "@/components/courses/CourseDetailEnroll";
import { Reveal } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getCourseBySlug } from "@/lib/courses-store";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course || !course.published) return { title: "Course" };
  return {
    title: course.title,
    description: course.description.slice(0, 140),
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const [course, site] = await Promise.all([
    getCourseBySlug(slug),
    getSiteContent(),
  ]);
  if (!course || !course.published) notFound();

  return (
    <ThemeScope scope="book">
      <article className="px-4 pb-12 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-6 sm:pb-20 md:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Link
              href="/courses"
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent"
            >
              ← Courses
            </Link>
            <h1 className="mt-4 font-display text-3xl text-ink sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-3 text-sm text-muted">
              {[course.level, course.duration, course.price]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </Reveal>

          {course.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.coverImage}
              alt=""
              className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover shadow-soft"
            />
          ) : null}

          <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-ink-soft">
            {course.description}
          </div>

          <CourseDetailEnroll
            slug={course.slug}
            title={course.title}
            price={course.price}
            level={course.level}
            duration={course.duration}
          />

          <div className="mt-4">
            <Link href="/contact" className="btn-ghost inline-flex">
              Or contact {site.name.split(" ")[0]}
            </Link>
          </div>
        </div>
      </article>
    </ThemeScope>
  );
}
