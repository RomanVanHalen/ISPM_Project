import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AwarenessSection from "../components/AwarenessSection";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import Footer2 from "../components/Footer2";
import InfoSection from "../components/InfoSection";



const Home = () => (
  <div className="home-container">
    <Navbar />
    <HeroSection />
    <AwarenessSection />
    <InfoSection />
    <FeaturesSection />
    <Footer />
    <Footer2 />
    
  </div>
);

export default Home;
