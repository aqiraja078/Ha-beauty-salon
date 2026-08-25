export type JobType = "Full-time" | "Part-time" | "Contract";

export type JobPost = {
  id: string;
  title: string;
  slug: string;
  location?: string;
  type: JobType;
  salaryText?: string;
  description: string;
  applyWhatsApp?: string;
  applyEmail?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type JobPostInput = {
  title: string;
  slug?: string;
  location?: string;
  type?: JobType;
  salaryText?: string;
  description?: string;
  applyWhatsApp?: string;
  applyEmail?: string;
  active?: boolean;
};

export const JOB_TYPES: JobType[] = ["Full-time", "Part-time", "Contract"];

export function isJobType(v: string): v is JobType {
  return (JOB_TYPES as string[]).includes(v);
}
