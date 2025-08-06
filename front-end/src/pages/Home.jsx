import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AwarenessSection from "../components/AwarenessSection";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";



const Home = () => (
  <div className="home-container">
    <Navbar />
    <HeroSection />
    <AwarenessSection />
    <FeaturesSection />
    <Footer />
  </div>
);

export default Home;
