export type JobApplication = {
  id: string;
  jobId: string;
  jobTitle: string;
  jobSlug: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  experience?: string;
  message?: string;
  createdAt: string;
};

export type JobApplicationInput = {
  jobId: string;
  jobTitle: string;
  jobSlug: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  experience?: string;
  message?: string;
};
