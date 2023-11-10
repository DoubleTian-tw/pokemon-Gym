import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { HeroProvider } from "../components/Hero/useHeroContext";
import { ThemeProvider } from "../components/contexts/useTheme";

const GymPage = () => {
    return (
        <>
            <ThemeProvider>
                <Navbar />
                <HeroProvider>
                    <Hero />
                </HeroProvider>
                <Footer />
            </ThemeProvider>
        </>
    );
};
export default GymPage;
