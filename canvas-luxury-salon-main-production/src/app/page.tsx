import {
  HomeAbout,
  HomeCta,
  HomeGallery,
  HomeHero,
  HomeMakeupServices,
  HomeOffers,
  HomeServices,
  HomeSteps,
  HomeTestimonials,
  HomeWhy,
} from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeMakeupServices />
      <HomeServices />
      <HomeAbout />
      <HomeWhy />
      <HomeSteps />
      <HomeGallery />
      <HomeOffers />
      <HomeTestimonials />
      <HomeCta />
    </>
  );
}
