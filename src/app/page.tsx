import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import LocationsSection from "@/components/LocationsSection";
import Footer from "@/components/Footer";
import MobileOrderView from "@/components/MobileOrderView";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen w-full overflow-x-hidden">
      {/* Mobile View: App-like Ordering Experience */}
      <div className="md:hidden">
        <MobileOrderView />
      </div>

      {/* Desktop View: Landing Page */}
      <div className="hidden md:flex flex-col w-full">
        <Header />
        <HeroSection />
        <FeaturedSection />
        <MenuSection />
        <AboutSection />
        <LocationsSection />
        <Footer />
      </div>
    </main>
  );
}
