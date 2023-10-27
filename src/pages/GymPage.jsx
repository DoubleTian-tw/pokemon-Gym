import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { HeroProvider } from "../components/Hero/useHeroContext";

const GymPage = () => {
    return (
        <>
            <Navbar />
            <HeroProvider>
                <Hero />
            </HeroProvider>
            <Footer />
        </>
    );
};
export default GymPage;
